import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductImage } from './product-image.entity'
import { User } from '../../auth/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity({ name: 'products' })
export class Product {

    //Doc API - ApiProperty()
    @ApiProperty({
        example: '2ad0bc6e-7c63-43bd-ad90-feb291d985b4',
        description: 'Product ID',
        uniqueItems: true,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 0,
        description: 'Product price'
    })
    @Column('float', {
        default: 0
    })
    price: number

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product slug',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 20,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number

    //Doc API - ApiProperty()
    // Arreglo de strings
    @ApiProperty({
        example: '["XS","S"]',
        description: 'Product sizes'
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 'men',
        description: 'Product gender'
    })
    @Column('text')
    gender: string

    //Doc API - ApiProperty()
    //tags 
    @ApiProperty({
        example: '["shirt","men"]',
        description: 'Product tags'
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    //Doc API - ApiProperty()
    // Relación de uno a muchos con la tabla (entity) productImage
    @ApiProperty({
        example: '["7652426-00-A_0_2000.jpg","7652426-00-A_1.jpg"]',
        description: 'Product images'
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    // Relación de muchos a uno con la tabla (entity) users
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSluginsert() {

        if (!this.slug) {
            this.slug = this.title
        }
        this.checkSlug()
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.checkSlug()

    }

    private checkSlug() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')

    }
}

