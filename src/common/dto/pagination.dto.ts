import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive, IsOptional, Min } from 'class-validator';


export class PaginationDto {

    // Doc API - ApiProperty
    @ApiProperty({
        default: 10,
        description: 'How many rows do you need'
    })
    @IsPositive()
    @IsOptional()
    @Type(() => Number) // enableImplicitConversions: true
    limit?: number

    // Doc API - ApiProperty
    @ApiProperty({
        default: 0,
        description: 'How many rows do you want to skip'
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number
}