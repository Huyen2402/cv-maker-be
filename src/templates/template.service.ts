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
}
