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
    const results = await this.templateRepository.findAll();
    const response = [];
    for await (const item of results) {
      const url = await this.s3Service.GetObjectUrl(item.image);
      const file = await this.s3Service.GetObjectUrl(item.name);
      item.image = url;
      item.name = file;
      response.push(item);
    }

    return this.formatData(HttpStatus.OK, response);
  }

  async GetByID(id) {
    const response = await this.templateRepository.findTemplate(id);
    const url = await this.s3Service.GetObjectUrl(response.image);
    const file = await this.s3Service.GetObjectUrl(response.name);
    response.image = url;
    response.name = file;
    return this.formatData(HttpStatus.OK, response);
  }

  async update(id: number, template: TemplateUpdateDTO, file) {
    let result = false;
    let keyFile;
    let keyImage;
    const templateFound = await this.templateRepository.findOneById(id);
    if (!templateFound) {
      HttpStatus.BAD_REQUEST, { result };
    }
    if (!_.isNil(file.file_template)) {
      // Format data
      keyFile = `uploads/${moment(Date()).format('MM_DD_YYYY_hh_mm_ss')}_${
        file.file_template[0].originalname
      }`;
    }
    if (!_.isNil(file.image)) {
      keyImage = `uploads/${moment(Date()).format('MM_DD_YYYY_hh_mm_ss')}_${
        file.image[0].originalname
      }`;
    }

    const newData = {
      id: templateFound.id,
      name: _.isNil(keyFile) ? templateFound.name : keyFile,
      image: _.isNil(keyImage) ? templateFound.image : keyImage,
      title: template.title === '' ? templateFound.title : template.title,
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
          if (!_.isNil(keyFile)) {
            const resultUpload = await this.s3Service.S3UploadV2(
              file.file_template[0],
              keyFile,
            );
            unlinkSync(file.file_template[0].path);
          }
          if (!_.isNil(keyImage)) {
            const resultImage = await this.s3Service.S3UploadV2(
              file.image[0],
              keyImage,
            );
            unlinkSync(file.image[0].path);
          }
          // Upload S3
          result = true;
          await transactionalEntityManager.queryRunner.commitTransaction();
        } catch (error) {
          console.log(error);
          unlinkSync(file.file_template[0].path);
          unlinkSync(file.image[0].path);
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

  async create(body: TemplateCreateDTO, file, image) {
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
          const keyFile = `${moment(Date()).format('MM_DD_YYYY_hh_mm_ss')}_${
            file.originalname
          }`;

          const keyImage = `${moment(Date()).format('MM_DD_YYYY_hh_mm_ss')}_${
            image.originalname
          }`;
          const template = new TemplateEntity();
          template.isDeleted = false;
          template.name = keyFile;
          template.image = keyImage;
          template.title = body.title;

          // Insert template
          await this.templateRepository.addTemplateWithTransaction(
            transactionalEntityManager.queryRunner,
            template,
          );

          // Upload S3
          const resultUpload = await this.s3Service.S3UploadV2(file, keyFile);
          const resultImage = await this.s3Service.S3UploadV2(image, keyImage);
          if (!resultUpload || !resultImage) {
            await transactionalEntityManager.queryRunner.rollbackTransaction();
          } else {
            result = true;
            await transactionalEntityManager.queryRunner.commitTransaction();
          }
          unlinkSync(file.path);
          unlinkSync(image.path);
        } catch (error) {
          console.log(error);
          unlinkSync(file.path);
          unlinkSync(image.path);
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
