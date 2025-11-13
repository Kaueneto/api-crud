import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Situations } from "./Situations";
import bcrypt from "bcryptjs";
@Entity("users")
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  
  @Column({ unique: true })
  recoverPassword!: string;

  @ManyToOne(() => Situations, (situation) => situation.users)
  @JoinColumn({ name: "situationId" })
  situation!: Situations;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  //metodo pra comparar a senha informada pelo user com a sneha salva no banco de dads
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
} }

