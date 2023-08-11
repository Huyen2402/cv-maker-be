import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvRepository } from '../cv/cv.repository';
import { UserRepository } from 'src/user/user.repository';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { S3Service } from 'src/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([CvRepository, UserRepository])],
  controllers: [CvController],
  providers: [CvRepository, UserRepository, CvService, S3Service],
  exports: [CvService],
})
export class CvModule {}
