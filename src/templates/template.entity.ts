import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('templates')
export class TemplateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  image: string;
}
