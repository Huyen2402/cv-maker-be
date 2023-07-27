import { HttpStatus, Injectable } from '@nestjs/common';
import { TemplateRepository } from '../templates/template.repository';
import { TemplateCreateDTO, TemplateUpdateDTO } from './dto/template.dto';
import { _ } from 'lodash';
@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async GetAll() {
    const result = await this.templateRepository.findAll();
    return {
      status: 200,
      body: {
        result,
      },
    };
  }
  async update(id: number, data: TemplateUpdateDTO, file) {
    const result = await this.templateRepository.findOneById(id);
    const newData = {
      id: result.id,
      name: file[0].originalname,
      title: data.title,
      is_deleted: result.is_deleted,
      image: data.image,
    };

    try {
      await this.templateRepository.edit(newData);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          message: 'Error',
        },
      };
    }

    return {
      status: HttpStatus.OK,
      body: {
        result,
      },
    };
  }

  async create(body: TemplateCreateDTO, file) {
    // Check name exist
    const templateFound = await this.templateRepository.findByName(body.title);
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
    const resultCreate = await this.templateRepository.add(body);
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

  async delete(id: number) {
    const result = await this.templateRepository.findOneById(id);
    if (_.isNil(result)) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          result: false,
          message: 'Template is not exist!',
        },
      };
    }

    const deleteResult = this.templateRepository.deleleById(id);
    if (!deleteResult) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          result: false,
        },
      };
    }

    // Response success
    return {
      status: HttpStatus.OK,
      body: {
        result: true,
      },
    };
  }

}
