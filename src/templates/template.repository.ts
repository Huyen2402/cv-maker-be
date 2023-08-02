import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TemplateEntity } from './template.entity';

@Injectable()
export class TemplateRepository extends Repository<TemplateEntity> {
  constructor(private readonly emanager: EntityManager) {
    super(TemplateEntity, emanager);
  }

  async findAll() {
    return await this.find({
      select: ['id', 'title', 'name', 'image'],
      where: { isDeleted: false },
    });
  }

  async findTemplate(id) {
    return await this.findOneBy({ id: id });
  }

  async updateTemplateWithTransaction(
    queryRunner: QueryRunner,
    template: TemplateEntity,
  ) {
    return await queryRunner.manager
      .createQueryBuilder()
      .update(TemplateEntity)
      .set({
        name: template.name,
        title: template.title,
        image: template.image,
      })
      .where({ id: template.id })
      .execute();
  }

  async addTemplateWithTransaction(
    queryRunner: QueryRunner,
    body: TemplateEntity,
  ) {
    return await queryRunner.manager.save(TemplateEntity, body);
  }

  async findByName(name: string) {
    return await this.findOne({ where: { name, isDeleted: false } });
  }

  async deleleById(id: number) {
    return await this.emanager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(TemplateEntity)
          .set({
            is_deleted: true,
          })
          .where({ id })
          .execute();
      },
    );
  }
}
