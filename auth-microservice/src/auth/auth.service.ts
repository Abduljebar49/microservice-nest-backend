import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponse, RResponse } from 'src/models/response';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<RResponse> {
    const user = await this.userRepository.find();
    return {
      message: 'Users fetched successfully',
      data: user,
    };
  }

  async signIn(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new NotFoundException(`Incorrect email or password`);
    }
    const passwordCheck = await this.checkPassword(
      loginDto.password,
      user.password,
    );
    if (!passwordCheck) {
      throw new NotFoundException(`Incorrect email or password`);
    }
    const userData = {
      id: user.id,
      email: user.email,
      password: user.password,
    };
    return {
      accessToken: await this.jwtService.signAsync(userData),
      user: { ...userData, password: undefined },
      message: 'Successfully logged in',
      status: 200,
    };
  }

  async signUp(userDto: CreateUserDto): Promise<RResponse> {
    try {
      const user: User = new User();
      const hashedPassword = await this.encryptPassword(userDto.password);

      user.email = userDto.email;
      user.password = hashedPassword;

      const isUserExist = await this.userRepository.findOne({
        where: { email: userDto.email },
      });

      if (isUserExist) {
        throw new ConflictException(`Duplicate email`);
      }

      const userData = await this.userRepository.save(user);
      return await {
        data: { ...userData, password: undefined },
        message: 'success',
      };
    } catch (error) {
      console.log('error : ', error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'This is a custom message',
          message: 'Duplicate email',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }

  async checkPassword(password: string, existingPassword: string) {
    return await bcrypt.compare(password, existingPassword);
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
