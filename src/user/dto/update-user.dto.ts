import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import {Binary} from 'typeorm';

export class UpdateUserDto {
    @ApiProperty()
    @IsEmail()
    readonly email?: string;

    @ApiProperty()
    @IsString()
    readonly password?: string;

    @ApiProperty()
    @IsString()
    readonly firstName?: string;

    @ApiProperty()
    @IsString()
    readonly lastName?: string;

}
