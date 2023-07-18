import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateRepository } from '../templates/template.repository';
import { TemplateService } from '../templates/template.service';
import { TemplateController } from '../templates/template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateRepository])],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateRepository],
  exports: [TemplateRepository],
})
export class TemplateModule {}
