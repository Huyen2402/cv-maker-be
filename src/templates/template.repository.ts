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
}
