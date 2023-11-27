import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  passwordResetCode: string;

  @Column({ nullable: true })
  passwordResetCodeExpire: number;

  @Column({ nullable: true })
  passwordResetVerified: boolean;

  @Column('simple-array', { default: 'student' })
  role: Array<string>;

  @Column({ default: false, nullable: true })
  ban: boolean;

  @Column('date', { nullable: true })
  banDate: Date;

  @Column({ default: 0 })
  limit: number;

  @Column()
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
}
