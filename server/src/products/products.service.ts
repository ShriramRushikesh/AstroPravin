import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../shared/schemas/product.schema';

const INITIAL_CATALOG = [
  {
    name: "Yellow Sapphire (Pukhraj) - Certified Ceylon",
    category: "gemstones",
    price: 25000,
    carat: "4.25 Ratti",
    origin: "Ceylon (Sri Lanka)",
    rulingPlanet: "Jupiter (Guru)",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    power: "Wisdom, Wealth & Marital Bliss",
    inStock: true,
    description: "100% natural, untreated, unheated yellow sapphire. Energized with 1,008 Brihaspati Beej Mantras. Ideal for wisdom, academic excellence, prosperity, and delay in marriage."
  },
  {
    name: "Blue Sapphire (Neelam) - Certified Natural",
    category: "gemstones",
    price: 32000,
    carat: "5.15 Ratti",
    origin: "Ceylon / Madagascar",
    rulingPlanet: "Saturn (Shani)",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    power: "Rapid Career Elevation & Protection",
    inStock: true,
    description: "Authentic royal blue sapphire with sharp clarity. Consecrated with Dasharatha Shani Stotram. Recommended for career breakthroughs, judicial success, and protection."
  },
  {
    name: "Natural Ruby (Manikya) - Certified Old Burma",
    category: "gemstones",
    price: 18000,
    carat: "4.50 Ratti",
    origin: "Burma (Myanmar)",
    rulingPlanet: "Sun (Surya)",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    power: "Leadership, Health & Authority",
    inStock: true,
    description: "Pigeon-blood red natural ruby. Energized during solar hora with Aditya Hridaya Stotram. Bestows executive confidence, government success, vitality, and paternal harmony."
  },
  {
    name: "Natural Emerald (Panna) - Certified Zambian",
    category: "gemstones",
    price: 21000,
    carat: "4.75 Ratti",
    origin: "Zambia",
    rulingPlanet: "Mercury (Budh)",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
    power: "Commerce, Logic & Communication",
    inStock: true,
    description: "Vibrant grass-green natural emerald. Energized with Vishnu Sahasranama. Excellent for business owners, chartered accountants, software engineers, and public speakers."
  },
  {
    name: "Original 7-Mukhi Nepali Rudraksha",
    category: "rudraksha",
    price: 3500,
    carat: "Natural Bead",
    origin: "Nepal",
    rulingPlanet: "Venus (Shukra) & Goddess Mahalakshmi",
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=800&auto=format&fit=crop",
    power: "Wealth Abundance & Debt Relief",
    inStock: true,
    description: "Authentic large Nepali 7 Mukhi bead blessed by Mahalakshmi. Dissolves financial blockages, attracts auspicious opportunities, and harmonizes marital affection."
  },
  {
    name: "Siddh Maha Meru Shree Yantra (Heavy Brass)",
    category: "yantras",
    price: 4999,
    carat: "450 Grams",
    origin: "Consecrated at Kendra",
    rulingPlanet: "All 9 Planets (Sarva Karya Siddhi)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    power: "Vastu Rectification & Cosmic Wealth",
    inStock: true,
    description: "3D sacred geometry pyramidal Shree Yantra. Consecrated with 108 Sri Suktam recitations to sanctify the home or office Northeast Ishanya zone."
  }
];

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.productModel.countDocuments();
      if (count === 0) {
        console.log('📦 Seeding initial live catalog products to MongoDB...');
        await this.productModel.insertMany(INITIAL_CATALOG);
        console.log('✅ Initial catalog seeded successfully.');
      }
    } catch (err: any) {
      console.error('Products seed check warning:', err.message);
    }
  }

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
