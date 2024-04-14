import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  allUsers() {
    return this.authService.getUsers();
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
