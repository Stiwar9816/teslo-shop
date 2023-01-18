import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { validRoles } from './interfaces';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

//Doc API - ApiTags()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  // Doc API - ApiResponse
  @ApiCreatedResponse({ description: 'User was created successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  // Doc API - ApiResponse
  @ApiCreatedResponse({ status: 201, description: 'User successfully logged in' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  // Doc API - ApiResponse
  @ApiOkResponse({ description: 'Successfully renewed token' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorize' })
  @ApiForbiddenResponse({ description: 'Forbidden. Token related.' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  checkAuthStatus(@GetUser() user: User) {

    return this.authService.checkAuthStatus(user)
  }

  // Autentificación optimizada
  @Get('private')
  @Auth(validRoles.admin) // Autentificanción para un rol especifico
  // Doc API - ApiResponse
  @ApiOkResponse({ description: 'Route protected, only for users with role admin' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorize' })
  @ApiForbiddenResponse({ description: 'Forbidden. Token related.' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }
}
