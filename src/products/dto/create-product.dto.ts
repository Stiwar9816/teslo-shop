import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPositive, IsString, MinLength, IsOptional, IsArray, IsInt, IsIn } from "class-validator"


export class CreateProductDto {

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product title',
        uniqueItems: true,
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product price',
        nullable: true,
        default: 0,

    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product description',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product slug',
        uniqueItems: true,
        nullable: true
    })
    @IsString()
    @IsOptional()
    slug?: string

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product stock',
        nullable: true,
        default: 0
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product sizes',
        nullable: false,
        isArray: true
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product gender',
        nullable: false,
        isArray: true
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product tags',
        nullable: false,
        isArray: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[]

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'Product images',
        nullable: true,
        isArray: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]
}
