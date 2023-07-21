import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TemplateEntity } from './template.entity';
import { TemplateCreateDTO } from './dto/template.dto';

@Injectable()
export class TemplateRepository extends Repository<TemplateEntity> {
  constructor(private readonly emanager: EntityManager) {
    super(TemplateEntity, emanager);
  }

  async findAll() {
    return await this.find({
      select: ['id', 'title', 'name', 'image'],
      where: { is_deleted: false },
    });
  }

  async findOneById(id: number) {
    return await this.findOneBy({ id, is_deleted: false });
  }

  async edit(template: TemplateEntity) {
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

  async add(body: TemplateCreateDTO) {
    const template = new TemplateEntity();
    template.image = body.image;
    template.is_deleted = false;
    template.name = body.name;
    template.title = body.title;
    return await this.save(template);
  }

  async findByName(name: string) {
    return await this.findOne({ where: { name, is_deleted: false } });
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
