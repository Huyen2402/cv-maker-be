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

  async Create(body, file) {
    const newTemp = {
      name: file.originalname,
      title: body.title,
      image: body.image,
    };
    const add = await this.templateRepository.addTemplate(newTemp);
    return {
      status: 200,
      body: {
        result: true,
        statusCode: 201,
      },
    };
  }
}
