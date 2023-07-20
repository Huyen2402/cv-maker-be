import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Query,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { TemplateService } from '../templates/template.service';
import { TemplateRO } from '../templates/ro/template.ro';
import { TemplateBody } from '../templates/dto/template.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
  @ApiOkResponse({ type: TemplateRO })
  @Get('/get-all-templates')
  async GetAll(@Res() res) {
    const result = await this.templateService.GetAll();
    return res.status(result.status).json(result.body);
  }

  @ApiOkResponse({ type: TemplateRO })
  @ApiParam({ name: 'id' })
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
      //   fileFilter: imageFileFilter,
    }),
  )
  @Put('/update/:id')
  async Update(
    @Body() template: TemplateBody,
    @Res() res,
    @Param('id') params,
    @UploadedFiles() file,
  ) {
    const result = await this.templateService.Update(params, template, file);
    return res.status(result.status).json(result.body);
  }
}
