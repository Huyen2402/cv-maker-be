import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TemplateEntity } from './template.entity';
import { TemplateCreateDTO } from './dto/template.dto';

@Injectable()
export class TemplateRepository extends Repository<TemplateEntity> {
  constructor(private readonly emanager: EntityManager) {
    super(TemplateEntity, emanager);
  }

  async getAllTemplate() {
    return await this.find();
  }

  async findTemplate(id) {
    return await this.findOneBy({ id: id });
  }

  async updateTemplate(template: TemplateEntity) {
    return await this.emanager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(TemplateEntity)
          .set({
            name: template.name,
            title: template.title,
          })
          .where({ id: template.id })
          .execute();
      },
    );
  }

  async addTemplateWithTransaction(
    queryRunner: QueryRunner,
    body: TemplateCreateDTO,
  ) {
    return await queryRunner.manager.save(TemplateEntity, body);
  }

  async findByName(name: string) {
    return await this.findOne({ where: { name, isDeleted: false } });
  }

  async deleleTemplate(template) {
    return await this.emanager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(TemplateEntity)
          .set({
            is_deleted: true,
          })
          .where({ id: template.id })
          .execute();
      },
    );
  }
}
