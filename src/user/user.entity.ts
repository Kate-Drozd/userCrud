import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  firstName: string;

  @Column({ length: 500 })
  lastName: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ length: 500, nullable: true})
  image: string;

  @Column('blob', {nullable: true})
  pdf: Buffer;

}
