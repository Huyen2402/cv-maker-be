import { _ } from 'lodash';
import * as moment from 'moment';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TemplateRepository } from '../templates/template.repository';
import { S3Service } from 'src/services/s3.service';
import { TemplateCreateDTO } from './dto/template.dto';
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
    const result = await this.templateRepository.getAllTemplate();
    return {
      status: 200,
      body: {
        result,
      },
    };
  }
  async Update(id, template, file) {
    const result = await this.templateRepository.findTemplate(id);
    const newData = {
      id: result.id,
      name: file[0].originalname,
      title: template.title,
      isDeleted: result.isDeleted,
      image: template.image,
    };
    const update = await this.templateRepository.updateTemplate(newData);
    return {
      status: 200,
      body: {
        result,
      },
    };
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
          // Format data
          body = {
            ...body,
            name: file.originalname,
          };
          const key = `uploads/${moment(Date()).format(
            'MM_DD_YYYY_hh_mm_ss',
          )}_${file.originalname}`;

          const template = new TemplateEntity();
          template.image = body.image;
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
            await transactionalEntityManager.queryRunner.commitTransaction();
          }
        } catch (error) {
          console.log(error);
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

  async delete(id) {
    const result = await this.templateRepository.findTemplate(id);
    if (_.isNil(result)) {
      return {
        status: HttpStatus.NOT_FOUND,
        body: {
          result: false,
          message: 'Field name has exist!',
        },
      };
    }
    const deleteResult = this.templateRepository.deleleTemplate(result);
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
