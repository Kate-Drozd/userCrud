import {Injectable, Inject, HttpException, HttpStatus} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import {CreateUserDto} from './dto/create-user.dto';
import * as PDFDocument from 'pdfkit';
const blobStream  = require('blob-stream');
import * as fs from 'fs';
import {createWriteStream} from 'fs';
import {UpdateUserDto} from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    const users =   await this.userRepository.find();
    if (users === undefined || users === null) {
      throw new HttpException('Users don\'t exist', HttpStatus.BAD_REQUEST);
    }

    return users;
  }

  async find(id: number): Promise<User> {
    const user =   await this.userRepository.findOne(id);

    if (user === undefined || user === null) {
      throw new HttpException('User doesn\'t exists', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user =  await this.userRepository.findOne({ where: { email } });

    if (user === undefined || user === null) {
     return null;
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = await this.hashPassword(createUserDto.password);
    user.image = createUserDto.image;
    return await this.userRepository.save(user);
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const hashed: string = await bcrypt.hash(plain, saltRounds);
    return hashed;
  }

  async upload(id: number, file: string){
    const user = await this.userRepository.findOne(id);

    if (user === undefined || user === null) {
      throw new HttpException('User with this id doesn\'t exists', HttpStatus.BAD_REQUEST);
    }

    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream(`./files/pdf/${id}.pdf`));
    doc.pipe(fs.createWriteStream(`./files/pdf/${id}.pdf`));
    doc.fontSize(25)
       .text(`${user.firstName} ${user.lastName}`, 100, 100);
    doc.image(`./files/img/${file}`, {
      align: 'center',
      valign: 'center'
    });
    doc.end();
    const blob = Buffer.from(stream);

    const bool = await this.userRepository.update(id,{"image": file, "pdf": blob});
    const result: object =
        {
          result : `${bool !== undefined}`
        };

    return JSON.stringify(result);
  }


  async update(id: number, updateUserDto: UpdateUserDto){
    const user = await this.userRepository.findOne(id);

    if (user === undefined || user === null) {
      throw new HttpException('User with this id doesn\'t exists', HttpStatus.BAD_REQUEST);
    }
    const updUser = new User();
    updUser.firstName = updateUserDto.firstName;
    updUser.lastName = updateUserDto.lastName;
    updUser.email = updateUserDto.email;
    updUser.password = await this.hashPassword(updateUserDto.password);
     console.log(updateUserDto.email);
     if(updUser.email !==  undefined){
       await this.userRepository.update(id,{"email": updUser.email});
     }
     if(updUser.firstName !==  undefined){
       await this.userRepository.update(id,{"firstName": updUser.firstName});
     }
     if(updUser.lastName !==  undefined){
       await this.userRepository.update(id,{"lastName": updUser.lastName});
     }
     if(updUser.password !==  undefined){
       await this.userRepository.update(id,{"password": updUser.password});
     }

    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream(`./files/pdf/${id}.pdf`));
    doc.pipe(fs.createWriteStream(`./files/pdf/${id}.pdf`));
    doc.fontSize(25)
        .text(`${updUser.firstName} ${updUser.lastName}`, 100, 100);
    doc.image(`./files/img/${user.image}`, {
      align: 'center',
      valign: 'center'
    });
    doc.end();
    const blob = Buffer.from(stream);

    const bool = await this.userRepository.update(id,{"pdf": blob}, );
    const result: object =
        {
          result : `${bool !== undefined}`
        };

    return JSON.stringify(result);
  }

  async deleteUserById(id: number) {
    const user = await this.userRepository.findOne({id});

    if (user === undefined || user === null) {
      throw new HttpException('User with this id doesn\'t exists', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.delete(id);
  }
}
