import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product)

      return product
    } catch (error) {
      this.handleDBException(error)
    }

  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    return this.productRepository.find({
      take: limit, // Toma la cantidad que se especifica en el limite
      skip: offset // Salta todos los que diga la vartiable offset 
    });
  }

  async findOne(id: string) {

    let product: Product

    // search for id(UUID) or slug
    if (isUUID(id)) {

      product = await this.productRepository.findOneBy({ id: id })

    } else {

      const queryBuilder = this.productRepository.createQueryBuilder()
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: id.toUpperCase(),
          slug: id.toLowerCase()
        }).getOne()
    }
    // Manejo de errores
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })

    // Manejo de errores
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    try {
      await this.productRepository.save(product)
      return product
    } catch (error) {
      this.handleDBException(error)
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productRepository.remove(product)
  }

  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    else {
      this.logger.error(error)
      throw new InternalServerErrorException('Ayuda')
    }
  }

}
