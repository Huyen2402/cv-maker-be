import { _ } from 'lodash';
import { PathLike, unlinkSync } from 'fs';
import * as moment from 'moment';
import { HttpStatus, Injectable } from '@nestjs/common';
import { S3Service } from 'src/services/s3.service';
import { BaseService } from 'src/services/base.service';
import { CvRepository } from './cv.repository';
import { CvEntity } from './cv.entity';
import { CvAddDTO } from './dto/cv.dto';
import { TemplateRepository } from 'src/templates/template.repository';
import { UserRepository } from 'src/user/user.repository';
import { PDFService } from 'src/services/PDF.service';
@Injectable()
export class CvService extends BaseService {
  constructor(
    private readonly cvRepository: CvRepository,
    private readonly tempalteRepository: TemplateRepository,
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
    private readonly pdfService: PDFService,
  ) {
    super();
  }
  async GetAll() {
    const response = [];
    const results = await this.cvRepository.findAll();
    console.log(results);
    for await (const item of results) {
      const checkItem = await this.tempalteRepository.findTemplate(
        item.template_id,
      );
      const url = await this.s3Service.GetObjectUrl(checkItem.image);
      item.path = url;

      response.push(item);
    }
    return this.formatData(HttpStatus.OK, response);
  }

  async generate(id: number) {
    const results = await this.cvRepository.findCv(id);
    if (!results) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          result: false,
          message: 'Cv has exist!',
        },
      };
    }
    const template = await this.tempalteRepository.findTemplate(
      results.template_id,
    );
    const url = await this.s3Service.createDocumentFromTemplate(template.name);
    const keyResult: any = await this.pdfService.addPDF(results, url);
    if (!keyResult) {
      return this.formatData(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'error!',
      });
    }
    const resultUpdate = await this.cvRepository.updatePathById(
      results.id,
      keyResult,
    );
    if (!resultUpdate) {
      return this.formatData(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'error!',
      });
    }
    return this.formatData(HttpStatus.OK, results);
  }
  async create(cv: CvAddDTO, file: { originalname: any; path: PathLike }) {
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
    let newCv;
    await this.cvRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.queryRunner.startTransaction();
        try {
          const keyFile = `${moment(Date()).format('MM_DD_YYYY_hh_mm_ss')}_${
            file.originalname
          }`;

          newCv = new CvEntity();
          newCv.address = cv.address;
          newCv.avatar = keyFile;
          newCv.gender = cv.gender;
          newCv.job_title = cv.job_title;
          newCv.experince = cv.experince;
          newCv.name = cv.name;
          newCv.objective = cv.objective;
          newCv.path = cv.path;
          newCv.certifications = cv.certifications;
          newCv.phone = cv.phone;
          newCv.projects = cv.projects;
          newCv.skills = cv.skills;
          newCv.template_id = cv.template_id;
          newCv.userId = cv.userId;
          await this.cvRepository.createCvWithTransaction(
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
          unlinkSync(file.path);
          await transactionalEntityManager.queryRunner.rollbackTransaction();
        }
      },
    );
    return this.formatData(
      result ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      newCv,
    );
  }

  async downloadPDF(body: any) {
    const path = await this.cvRepository.getPathById(body.cvId);
    const url = await this.s3Service.GetObjectUrl(`cvs/${path}`);
    return this.formatData(HttpStatus.OK, { url });
  }
}
