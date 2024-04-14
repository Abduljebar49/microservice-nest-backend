import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponse, RResponse } from 'src/models/response';

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
        return {
          message: 'please login with your email and password',
          data: {},
          error: 'duplicate email detected',
        };
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

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
