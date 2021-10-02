import {Controller, Post, UseGuards, Req, UseInterceptors, UploadedFile, Param, Body, Patch} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {editFileName, imageFileFilter} from '../utils/file-uploading.utils';
import {CreateUserDto} from '../user/dto/create-user.dto';
import {UpdateUserDto} from '../user/dto/update-user.dto';
import {User} from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  async signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @Patch('upload/:id')
  @UseInterceptors(
      FileInterceptor('image', {
          storage: diskStorage({
              destination: './files/img',
              filename: editFileName,
          }),
          fileFilter: imageFileFilter,
      }),
  )
  async upload(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.authService.upload(+id, file);
  }

    @Patch('update/:id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.authService.update(+id, updateUserDto);
    }

  @UseGuards(AuthGuard('local-sign-in'))
  @Post('sign-in')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

}
