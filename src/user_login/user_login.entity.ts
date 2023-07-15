import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('user_login')
export class UserLoginEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  access_token: string;

  @Column({ length: 255 })
  refresh_token: string;

  @Column({ name: 'is_used' })
  isUsed: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
