import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOkResponse, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { TemplateService } from '../templates/template.service';
import { TemplateRO } from '../templates/ro/template.ro';
import {
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SuccessResRO } from '../templates/ro/template.ro';
import {
  TemplateCreateDTO,
  TemplateUpdateDTO,
} from '../templates/dto/template.dto';

@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
  @ApiOkResponse({ type: TemplateRO })
  @Get('/get-all-templates')
  async GetAll(@Res() res) {
    const result = await this.templateService.GetAll();
    return res
      .set({ 'content-type': 'image/svg+xml' })
      .status(result.status)
      .json(result.body);
  }
  @ApiOkResponse({ type: TemplateRO })
  @Get('/get/:id')
  async GetByID(@Res() res, @Param('id') id: number) {
    const result = await this.templateService.GetByID(id);
    return res
      .set({ 'content-type': 'image/svg+xml' })
      .status(result.status)
      .json(result.body);
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
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file_template', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './offline_file/',
          filename: function (req, file, cb) {
            cb(null, file.originalname);
          },
        }),
      },
    ),
  )
  @Put('/update/:id')
  async Update(
    @Body() body: TemplateUpdateDTO,
    @Res() res,
    @Param('id') id: number,
    @UploadedFiles() file,
  ) {
    const result = await this.templateService.update(id, body, file);
    return res.status(result.status).json(result.body);
  }

  @ApiOkResponse({ type: SuccessResRO })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        file_template: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file_template', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './offline_file/',
          filename: function (req, file, cb) {
            cb(null, file.originalname);
          },
        }),
      },
    ),
  )
  @Post('/add')
  async create(
    @Body() body: TemplateCreateDTO,
    @Res() res,
    @UploadedFiles() file,
  ) {
    console.log(file);
    const result = await this.templateService.create(
      body,
      file.file_template[0],
      file.image[0],
    );
    return res.status(result.status).json(result.body);
  }

  @Delete('/delete/:id')
  async delete(@Res() res, @Param('id') id: number) {
    const result = await this.templateService.delete(id);
    return res.status(result.status).json(result.body);
  }
}
