import {
  Controller,
  Post,
  Body,
  Res,
  UseInterceptors,
  UploadedFiles,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResRO } from './ro/cv.ro';
import { CvAddDTO } from './dto/cv.dto';
import { CvService } from './cv.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Cv')
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @ApiOkResponse({ type: SuccessResRO })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        name: { type: 'string' },
        job_title: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string' },
        gender: { type: 'bit' },
        objective: { type: 'string' },
        experince: { type: 'string' },
        certifications: { type: 'string' },
        skills: { type: 'string' },
        projects: { type: 'string' },
        path: { type: 'string' },
        template_id: { type: 'number' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }], {
      storage: diskStorage({
        destination: './offline_file/',
        filename: function (_, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @Post('/add')
  async create(@Body() cv: CvAddDTO, @Res() res, @UploadedFiles() file) {
    const result = await this.cvService.create(cv, file.avatar[0]);
    return res.status(result.status).json(result.body);
  }

  @Get('/get-mycv')
  async GetAll(@Res() res) {
    const result = await this.cvService.GetAll();
    return res
      .set({ 'content-type': 'image/svg+xml' })
      .status(result.status)
      .json(result.body);
  }

  @Post('/generate-pdf')
  async generatePDF(@Body() cvId: number, @Res() res) {
    const result = await this.cvService.generate(cvId);
    return res.status(result.status).json(result.body);
  }

  @Post('/download-pdf')
  async downloadPDF(@Body() body: number, @Res() res) {
    const result = await this.cvService.downloadPDF(body);
    return res.status(result.status).json(result.body);
  }
}
