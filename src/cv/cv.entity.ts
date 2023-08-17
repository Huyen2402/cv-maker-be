import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
@Entity('cv')
export class CvEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  job_title: string;

  @Column({ length: 10 })
  phone: string;

  @Column({ length: 255 })
  address: string;

  @Column()
  gender: boolean;

  @Column({ length: 255 })
  objective: string;

  @Column({ length: 500 })
  skills: string;

  @Column({ length: 500 })
  projects: string;

  @Column({ length: 500 })
  avatar: string;

  @Column({ length: 500 })
  certifications: string;

  @Column({ length: 500 })
  experince: string;

  @Column()
  template_id: number;

  @Column({ length: 255, default: '' })
  path: string;

  @ManyToOne(() => UserEntity)
  user: number;
}
