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

  async addTemplate(body) {
    const template = new TemplateEntity();
    template.image = body.image;
    template.is_deleted = false;
    template.name = body.name;
    template.title = body.title;
    return await this.save(template);
  }
  async checkName() {
    return await this.find({
      take: 1,
      order: {
        name: 'DESC',
      },
    });
  }
}
