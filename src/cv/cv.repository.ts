import { EntityManager, QueryRunner, Repository } from 'typeorm';
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

  async findCvByIdUser(id) {
    return await this.findOneBy({ userId: id });
  }

  async findCv(id) {
    return await this.findOneBy({ id: id });
  }
  async findAll() {
    return await this.find({
      select: ['id', 'job_title', 'template_id'],
    });
  }

  async createCvWithTransaction(queryRunner: QueryRunner, cv) {
    return await queryRunner.manager.save(CvEntity, cv);
  }

  async updatePathById(id: number, path: string) {
    return await this.createQueryBuilder()
      .update()
      .set({ path: path })
      .where('id = :id', { id })
      .execute();
  }

  async getPathById(id: number) {
    return (await this.findOne({ where: { id } })).path;
  }
}
