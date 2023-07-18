import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TemplateService } from '../templates/template.service';
import { TemplateRO } from '../templates/ro/template.ro';
import { TemplateBody } from '../templates/dto/template.dto';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
  @ApiOkResponse({ type: TemplateRO })
  @Get('/get-all-templates')
  async GetAll(@Res() res) {
    const result = await this.templateService.GetAll();
    return res.status(result.status).json(result.body);
  }

  @Post('/add')
  async create(@Body() template: TemplateBody, @Res() res) {
    console.log(template);
    const result = await this.templateService.Create(template);
    return res.status(result.status).json(result.body);
  }
}
