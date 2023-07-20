import { _ } from 'lodash';
import { TemplateRepository } from '../templates/template.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async GetAll() {
    const result = await this.templateRepository.getAllTemplate();
    return {
      status: 200,
      body: {
        result,
      },
    };
  }
  async Update(id, template, file){
    const result = await this.templateRepository.findTemplate(id);
    const newData = {
      id: result.id,
      name: file[0].originalname,
      title: template.title,
      is_deleted: result.is_deleted,
      image: template.image
    }
    const update = await this.templateRepository.updateTemplate(newData);
    return {
      status: 200,
      body: {
        result,
      },
    };
  }
}
