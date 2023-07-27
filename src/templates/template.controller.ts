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
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SuccessResRO } from '../templates/ro/template.ro';
import {
  TemplateCreateDTO,
  TemplateUpdateDTO,
} from '../templates/dto/template.dto';
import { S3Service } from 'src/common/s3.service';

@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly s3Service: S3Service,
  ) {}
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
    const resultUpload = await this.s3Service.S3UploadV2(file[0]);
    if (!resultUpload) {
      return res.status(404).json();
    }
    const result = await this.templateService.create(body, file[0]);
    return res.status(result.status).json(result.body);
  }

  @Delete('/delete:id')
  async delete(@Res() res, @Param('id') id: number) {
    const result = await this.templateService.delete(id);
    return res.status(result.status).json(result.body);
  }
}
