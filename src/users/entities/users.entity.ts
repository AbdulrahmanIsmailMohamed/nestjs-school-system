import { Student } from 'src/students/entities/student.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  newPassword: string;

  @Column({ nullable: true })
  emailConfirmCodeExpire: string;

  @Column({ nullable: true })
  emailConfirmCode: string;

  @Column({ nullable: true })
  passwordResetCode: string;

  @Column({ nullable: true })
  passwordResetCodeExpire: string;

  @Column({ nullable: true })
  passwordResetVerified: boolean;

  @Column('simple-array', { default: 'student' })
  role: Array<string>;

  @Column({ default: false })
  ban: boolean;

  @Column({ default: false })
  confirm: boolean;

  @Column({ nullable: true })
  banDate: string;

  @Column({ default: 0 })
  limit: number;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column('simple-array', { nullable: true })
  profileImages: Array<string>;

  @Column({ default: true })
  active: boolean;

  @Column('simple-array', { nullable: true })
  favourites: Array<string>;

  @OneToOne(() => Student, (student) => student.user)
  @JoinColumn()
  student: Student;

  // @OneToOne(() => Student, (student) => student.user)
  // @JoinColumn()
  // teacher: Student;
}
