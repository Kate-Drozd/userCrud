import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import {CreateUserDto} from '../user/dto/create-user.dto';
import {UpdateUserDto} from '../user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (! user) {
      throw new BadRequestException('auth/account-not-found');
    }
    const matches: boolean = await bcrypt.compare(password, user.password);
    if (! matches) {
      throw new BadRequestException('auth/wrong-password');
    }
    delete user.password;
    return user;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userService.findByEmail(createUserDto.email);
    if (existing) {
      throw new BadRequestException('auth/account-exists');
    }
    const user: User = await this.userService.create(createUserDto);
    delete user.password;
    return user;
  }

  async upload(id: number, file: Express.Multer.File ){
    const imgName = file.filename.toString();
    return this.userService.upload(id,imgName);
  }

  async update(id: number, updateUserDto: UpdateUserDto ){
    return this.userService.update(id, updateUserDto);
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
