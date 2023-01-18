import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities";
import { ApiProperty } from "@nestjs/swagger";

@Entity('users')
export class User {

    //Doc API - ApiProperty()
    @ApiProperty({
        example: '2ad0bc6e-7c63-43bd-ad90-feb291d985b4',
        description: 'User ID',
        uniqueItems: true,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 'test1@gmail.com',
        description: 'User email',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 'Abcd123',
        description: 'User password'
    })
    @Column('text', {
        select: false
    })
    password: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 'Test One',
        description: 'User fullName'
    })
    @Column('text')
    fullName: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: true,
        description: 'User isActive',
        format: 'Boolean'
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean

    //Doc API - ApiProperty()
    @ApiProperty({
        example: '["admin","user"]',
        description: 'User roles'
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product

    // Convertimos los datos del email a minúsculas
    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert()
    }

}

