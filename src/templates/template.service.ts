import { HttpStatus, Injectable } from '@nestjs/common';
import { TemplateRepository } from '../templates/template.repository';
import { TemplateCreateDTO } from './dto/template.dto';

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
  async Update(id, template, file) {
    const result = await this.templateRepository.findTemplate(id);
    const newData = {
      id: result.id,
      name: file[0].originalname,
      title: template.title,
      is_deleted: result.is_deleted,
      image: template.image,
    };
    const update = await this.templateRepository.updateTemplate(newData);
    return {
      status: 200,
      body: {
        result,
      },
    };
  }

  async create(body: TemplateCreateDTO, file) {
    // Check name exist
    const templateFound = await this.templateRepository.findByName(body.name);
    if (templateFound) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          result: false,
          message: 'Field name has exist!',
        },
      };
    }

    // Format data
    body = {
      ...body,
      name: file.originalname,
    };

    // Insert template
    const resultCreate = await this.templateRepository.addTemplate(body);
    if (!resultCreate) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          result: false,
        },
      };
    }

    // Response success
    return {
      status: HttpStatus.CREATED,
      body: {
        result: true,
      },
    };
  }
}
