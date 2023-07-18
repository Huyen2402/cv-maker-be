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

  async Create(body) {
    const checkName = await this.templateRepository.checkName();
    console.log(checkName);
    const newTemp = {
      name: body.name,
      title: body.title,
      image: body.image,
    };
    const add = await this.templateRepository.addTemplate(newTemp);
    console.log(add);
    return {
      status: 200,
      body: {
        checkName,
      },
    };
  }
}
