import { EntityManager, Repository } from 'typeorm';
import { TemplateEntity } from './template.entity';
import { Injectable } from '@nestjs/common';

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
            image: template.image,
          })
          .where({ id: template.id })
          .execute();
      },
    );
  }
}
