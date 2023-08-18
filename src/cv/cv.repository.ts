import {
  EntityManager,
  QueryRunner,
  Repository,
  createQueryBuilder,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CvEntity } from './cv.entity';

@Injectable()
export class CvRepository extends Repository<CvEntity> {
  constructor(private readonly emanager: EntityManager) {
    super(CvEntity, emanager);
  }
  async findCvByIdTemplate(id) {
    return await this.findOneBy({ template_id: id });
  }
  async findAll() {
    return await this.find({
      select: ['id', 'job_title', 'template_id'],
    });
  }

  async createCvWithTransaction(queryRunner: QueryRunner, cv) {
    return await queryRunner.manager.save(CvEntity, cv);
  }
}
