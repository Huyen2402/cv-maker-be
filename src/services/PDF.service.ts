import * as PizZip from 'pizzip';
import * as moment from 'moment';
import { CvEntity } from 'src/cv/cv.entity';
import { S3Service } from './s3.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Docxtemplater = require('docxtemplater');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const libre = require('libreoffice-convert');
// eslint-disable-next-line @typescript-eslint/no-var-requires
libre.convertAsync = require('util').promisify(libre.convert);

export class PDFService {
  async addPDF(cv: CvEntity, template: any) {
    console.log(template);
    const zip = new PizZip(template.Body);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      name: cv.name,
      jobTitle: cv.job_title,
      phone: cv.phone,
      address: cv.address,
      email: cv.email,
      objective: cv.objective || '',
      skills: JSON.parse(cv.skills),
      experince: JSON.parse(cv.experince),
      projects: JSON.parse(cv.projects),
      certifications: cv.certifications,
      hasProjects: !!cv.projects,
      hasSkills: !!cv.skills,
      hasCertifications: !!cv.certifications,
      hasExperince: !!cv.experince,
    });
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });

    const pdfBuf = await libre.convertAsync(buf, 'pdf', undefined);

    const key = `cvs/CV_${cv.name}_${moment().format(
      'YYYY-MM-DD_HH-mm-ss',
    )}.pdf`;
    const resultUpload = await new S3Service().S3UploadV3(pdfBuf, key);
    if (!resultUpload) {
      return false;
    }
    return key;
  }
}
