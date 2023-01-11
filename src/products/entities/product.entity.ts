import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
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
