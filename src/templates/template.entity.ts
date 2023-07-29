import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('templates')
export class TemplateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ length: 255 })
  title: string;
}
