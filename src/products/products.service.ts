import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto, user: User) {

    try {

      const { images = [], ...productDetails } = createProductDto

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user: user
      })

      await this.productRepository.save(product)

      return { ...product, images }

    } catch (error) {
      this.handleDBException(error)
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit, // Toma la cantidad que se especifica en el limite
      skip: offset, // Salta todos los que diga la vartiable offset 
      relations: {
        images: true
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))

  }

  async findOne(id: string) {

    let product: Product

    // search for id(UUID) or slug
    if (isUUID(id)) {

      product = await this.productRepository.findOneBy({ id: id })

    } else {

      const queryBuilder = this.productRepository.createQueryBuilder('prod')
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: id.toUpperCase(),
          slug: id.toLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne()
    }
    // Manejo de errores
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return product
  }

  // Metodo para aplanar el resultado de las imagenes si se busca por el slug
  async findOnePlain(id: string) {
    const { images = [], ...productDetails } = await this.findOne(id)
    return {
      ...productDetails,
      images: images.map(img => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...toUpdate } = updateProductDto

    const product = await this.productRepository.preload({
      id, ...toUpdate
    })

    // Create Query Runner
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    // Manejo de errores
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    try {

      if (images) {
        // Borramos todas las imagenes ya existentes si las hay
        await queryRunner.manager.delete(ProductImage, { product: { id } })

        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      }

      product.user = user
      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction()
      await queryRunner.release()
      return this.findOnePlain(id)

    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleDBException(error)
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productRepository.remove(product)
  }

  // Manejo de excepciones
  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    else {
      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs')
    }
  }

  // Eliminación masiva
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')

    try {
      return await query
        .delete()
        .where({})
        .execute()
    } catch (error) {
      this.handleDBException(error)
    }

  }
}
