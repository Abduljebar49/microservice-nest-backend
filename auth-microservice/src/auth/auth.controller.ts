import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  allUsers() {
    return this.authService.getUsers();
  }

  @Public()
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto);
  }


  @Post('register')
  registerUser(@Body() body: CreateUserDto) {
    try {
      return this.authService.signUp(body);
    } catch (e) {
      return {
        message: '',
        error: e.message,
        status: 400,
      };
    }
  }

  @Get()
  greeting() {
    return { message: 'greeting' };
  }
}

