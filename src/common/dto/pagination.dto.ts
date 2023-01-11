import { Type } from 'class-transformer';
import { IsPositive, IsOptional, Min } from 'class-validator';


export class PaginationDto {

    @IsPositive()
    @IsOptional()
    @Type(() => Number) // enableImplicitConversions: true
    limit?: number

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number
}