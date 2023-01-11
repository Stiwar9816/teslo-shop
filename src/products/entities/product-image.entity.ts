import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'products_images' })
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    url: string

    // Relación de muchos a uno con la tabla (Entity) product
    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product
}