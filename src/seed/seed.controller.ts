import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

//Doc API - ApiTags
@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  // Doc API - ApiResponse
  @ApiOkResponse({ description: 'Seed run successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  executeSeed() {
    return this.seedService.runSeed();
  }

}
