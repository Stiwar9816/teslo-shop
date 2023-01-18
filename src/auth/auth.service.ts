import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userDetails } = createUserDto

      const user = this.userRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)
      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      this.handleDBerros(error)
    }
  }


  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)')
    }
    console.log({ user })

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async checkAuthStatus(user: User) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }

  // Obtener token
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  // Manejo de errores
  private handleDBerros(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    } else {
      console.log(error)
      throw new InternalServerErrorException('Please check server logs')
    }
  }

}
