import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../shared/schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findInStock(): Promise<Product[]> {
    return this.productModel.find({ inStock: true }).exec();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const newProduct = new this.productModel(productData);
    return newProduct.save();
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, productData, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.productModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return { message: 'Product deleted successfully' };
  }
}
