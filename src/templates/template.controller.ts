import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOkResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { TemplateService } from '../templates/template.service';
import { TemplateRO } from '../templates/ro/template.ro';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SuccessResRO } from '../templates/ro/template.ro';
import {
  TemplateCreateDTO,
  TemplateUpdateDTO,
} from '../templates/dto/template.dto';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
  @ApiOkResponse({ type: TemplateRO })
  @Get('/get-all-templates')
  async GetAll(@Res() res) {
    const result = await this.templateService.GetAll();
    return res.status(result.status).json(result.body);
  }

  @ApiOkResponse({ type: SuccessResRO })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string' },
        file_template: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('file_template', 20, {
      storage: diskStorage({
        destination: './offline_file/',
        filename: function (req, file, cb) {
          cb(null, file.originalname + '.docx');
        },
      }),
    }),
  )
  @Put('/update/:id')
  async Update(
    @Body() template: TemplateUpdateDTO,
    @Res() res,
    @Param('id') id: number,
    @UploadedFiles() file,
  ) {
    const result = await this.templateService.Update(id, template, file);
    return res.status(result.status).json(result.body);
  }

  @ApiOkResponse({ type: SuccessResRO })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string' },
        file_template: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('file_template', 20, {
      storage: diskStorage({
        destination: './offline_file/',
        filename: function (req, file, cb) {
          cb(null, file.originalname + '.docx');
        },
      }),
    }),
  )
  @Post('/add')
  async create(
    @Body() body: TemplateCreateDTO,
    @Res() res,
    @UploadedFiles() file,
  ) {
    const result = await this.templateService.create(body, file[0]);
    return res.status(result.status).json(result.body);
  }
}
