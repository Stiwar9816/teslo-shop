import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductImage } from './product-image.entity'
import { User } from '../../auth/entities/user.entity'

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true
    })
    title: string

    @Column('float', {
        default: 0
    })
    price: number

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column('text', {
        unique: true
    })
    slug: string

    @Column('int', {
        default: 0
    })
    stock: number

    // Arreglo de strings
    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string


    //tags 

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    // Relación de uno a muchos con la tabla (entity) productImage
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

