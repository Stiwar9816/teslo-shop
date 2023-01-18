import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"


export class LoginUserDto {

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'User email',
        uniqueItems: true,
        nullable: false,
        default: 'test1@gmail.com'
    })
    @IsString()
    @IsEmail()
    email: string

    // Doc API - ApiProperty
    @ApiProperty({
        description: 'User password',
        nullable: false,
        default: 'Abc123',
        minLength: 6,
        maxLength: 50
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}