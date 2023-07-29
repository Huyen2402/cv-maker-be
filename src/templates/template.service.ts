import { _ } from 'lodash';
import { unlinkSync } from 'fs';
import * as moment from 'moment';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TemplateRepository } from '../templates/template.repository';
import { S3Service } from 'src/services/s3.service';
import { TemplateCreateDTO, TemplateUpdateDTO } from './dto/template.dto';
import { TemplateEntity } from './template.entity';
import { BaseService } from 'src/services/base.service';

@Injectable()
export class TemplateService extends BaseService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly s3Service: S3Service,
  ) {
    super();
  }

  async GetAll() {
    const result = await this.templateRepository.findAll();
    return {
      status: 200,
      body: {
        result,
      },
    };
  }

  async update(id: number, template: TemplateUpdateDTO, file) {
    let result = false;
    const templateFound = await this.templateRepository.findOneById(id);
    if (!templateFound) {
      HttpStatus.BAD_REQUEST, { result };
    }

    // Format data
    const key = `uploads/${moment(Date()).format('MM_DD_YYYY_hh_mm_ss')}_${
      file.originalname
    }`;
    const newData = {
      id: templateFound.id,
      name: key,
      title: template.title,
      isDeleted: templateFound.isDeleted,
    };

    await this.templateRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.queryRunner.startTransaction();
        try {
          // Update template
          await this.templateRepository.updateTemplateWithTransaction(
            transactionalEntityManager.queryRunner,
            newData,
          );

          // Upload S3
          const resultUpload = await this.s3Service.S3UploadV2(file, key);
          if (!resultUpload) {
            await transactionalEntityManager.queryRunner.rollbackTransaction();
          } else {
            result = true;
            unlinkSync(file.path);
            await transactionalEntityManager.queryRunner.commitTransaction();
          }
        } catch (error) {
          console.log(error);
          unlinkSync(file.path);
          await transactionalEntityManager.queryRunner.rollbackTransaction();
        }
      },
    );

    // Response
    return this.formatData(
      result ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      result,
    );
  }

  async create(body: TemplateCreateDTO, file) {
    // Check name exist
    const templateFound = await this.templateRepository.findByName(body.title);
    if (templateFound) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          result: false,
          message: 'Field name has exist!',
        },
      };
    }

    let result = false;
    await this.templateRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.queryRunner.startTransaction();
        try {
          const key = `uploads/${moment(Date()).format(
            'MM_DD_YYYY_hh_mm_ss',
          )}_${file.originalname}`;

          const template = new TemplateEntity();
          template.isDeleted = false;
          template.name = key;
          template.title = body.title;

          // Insert template
          await this.templateRepository.addTemplateWithTransaction(
            transactionalEntityManager.queryRunner,
            template,
          );

          // Upload S3
          const resultUpload = await this.s3Service.S3UploadV2(file, key);
          if (!resultUpload) {
            await transactionalEntityManager.queryRunner.rollbackTransaction();
          } else {
            result = true;
            unlinkSync(file.path);
            await transactionalEntityManager.queryRunner.commitTransaction();
          }
        } catch (error) {
          console.log(error);
          unlinkSync(file.path);
          await transactionalEntityManager.queryRunner.rollbackTransaction();
        }
      },
    );

    // Response
    return this.formatData(
      result ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      result,
    );
  }

  async delete(id: number) {
    const result = await this.templateRepository.findOneById(id);
    if (_.isNil(result)) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          result: false,
          message: 'Template is not exist!',
        },
      };
    }

    const deleteResult = this.templateRepository.deleleById(id);
    if (!deleteResult) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          result: false,
        },
      };
    }

    // Response success
    return {
      status: HttpStatus.OK,
      body: {
        result: true,
      },
    };
  }
}
