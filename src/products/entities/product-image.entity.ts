import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products_images' })
export class ProductImage {

    //Doc API - ApiProperty()
    @ApiProperty({
        example: '2ad0bc6e-7c63-43bd-ad90-feb291d985b4',
        description: 'ProductImage ID',
        uniqueItems: true,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn()
    id: number

    //Doc API - ApiProperty()
    @ApiProperty({
        example: 'http://localhost:3000/api/files/product/1740176-00-A_0_2000.jpg',
        description: 'ProductImage url'
    })
    @Column('text')
    url: string

    //Doc API - ApiProperty()
    // Relación de muchos a uno con la tabla (Entity) product
    @ApiProperty({
        example: '2ad0bc6e-7c63-43bd-ad90-feb291d985b4',
        description: 'ProductImage productID',
        uniqueItems: true,
        format: 'uuid'
    })
    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product
}