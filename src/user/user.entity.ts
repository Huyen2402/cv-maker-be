import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserLoginEntity } from '../user_login/user_login.entity';
import { CvEntity } from '../cv/cv.entity';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ length: 45 })
  phone: string;

  @Column({ type: 'date', default: '2023-09-09' })
  dob: Date;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @OneToMany((type) => UserLoginEntity, (user) => user.user)
  user_login: UserLoginEntity[];

  @OneToMany((type) => CvEntity, (cv) => cv.user)
  cv: CvEntity[];
}
