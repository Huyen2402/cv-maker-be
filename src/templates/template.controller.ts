import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOkResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TemplateService } from '../templates/template.service';
import { SuccessResRO, TemplateRO } from '../templates/ro/template.ro';
import { TemplateCreateDTO } from '../templates/dto/template.dto';

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
  @Post('/add')
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
  async create(
    @Body() body: TemplateCreateDTO,
    @Res() res,
    @UploadedFiles() file,
  ) {
    const result = await this.templateService.create(body, file[0]);
    return res.status(result.status).json(result.body);
  }
}
