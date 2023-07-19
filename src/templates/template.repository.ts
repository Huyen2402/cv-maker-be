import { EntityManager, Repository } from 'typeorm';
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

  async addTemplate(body: TemplateCreateDTO) {
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
}
