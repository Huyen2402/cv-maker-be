import { _ } from 'lodash';
import { unlinkSync } from 'fs';
import * as moment from 'moment';
import { HttpStatus, Injectable } from '@nestjs/common';
import { S3Service } from 'src/services/s3.service';
import { BaseService } from 'src/services/base.service';
import { CvRepository } from './cv.repository';
import { CvAddDTO } from './dto/cv.dto';
import { CvEntity } from './cv.entity';

@Injectable()
export class CvService extends BaseService {
  constructor(
    private readonly cvRepository: CvRepository,
    private readonly s3Service: S3Service,
  ) {
    super();
  }
  async create(cv: CvAddDTO, file) {
    let result = false;
    const checkCv = await this.cvRepository.findCvByIdTemplate(cv.template_id);
    if (checkCv) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          result: false,
          message: 'Template has exist!',
        },
      };
    }
    await this.cvRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.queryRunner.startTransaction();
        try {
          const keyFile = `${moment(Date()).format('MM_DD_YYYY_hh_mm_ss')}_${
            file.originalname
          }`;
          const newCv = new CvEntity();
          newCv.address = cv.address;
          newCv.avatar = keyFile;
          newCv.gender = cv.gender;
          newCv.job_title = cv.job_title;
          newCv.experince = JSON.stringify(cv.experince);
          newCv.name = cv.name;
          newCv.objective = cv.objective;
          newCv.path = cv.path;
          newCv.certifications = JSON.stringify(cv.certifications);
          newCv.phone = cv.phone;
          newCv.projects = JSON.stringify(cv.projects);
          newCv.skills = JSON.stringify(cv.skills);
          newCv.template_id = cv.template_id;
          newCv.user = cv.userId;
          await this.cvRepository.createCv(
            transactionalEntityManager.queryRunner,
            newCv,
          );
          const resultUpload = await this.s3Service.S3UploadV2(file, keyFile);
          if (!resultUpload) {
            await transactionalEntityManager.queryRunner.rollbackTransaction();
          }
          result = true;
          await transactionalEntityManager.queryRunner.commitTransaction();
          unlinkSync(file.path);
        } catch (error) {
          console.log(error);
          await transactionalEntityManager.queryRunner.rollbackTransaction();
        }
      },
    );
    return this.formatData(
      result ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      result,
    );
  }
}
