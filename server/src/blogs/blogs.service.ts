import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../shared/schemas/blog.schema';

const INITIAL_BLOGS = [
  {
    slug: "complete-guide-kundli-milan-gun-milan-marriage",
    title: "Complete Guide to Kundli Milan (Gun Milan) for Marriage: 36 Gunas Explained",
    subtitle: "Understand how Vedic horoscope matching works, what Ashtakoot Gun Milan means, Manglik Dosha exceptions, and remedies for a harmonious marital life.",
    category: "Astrology",
    author: "Pandit Pravin Shriram",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop",
    content: "<h2>The Essence of Vedic Kundli Milan (Horoscope Matching)</h2><p>In Vedic Astrology, marriage is considered a sacred union. Kundli Milan evaluates emotional, physiological, intellectual, and spiritual compatibility between prospective partners.</p><h3>Ashtakoot Gun Milan (36 Points)</h3><p>The Ashtakoot matching system evaluates 8 dimensions: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi.</p>",
    tags: ["Kundli Milan", "Marriage", "Gun Milan", "Vedic Astrology"]
  },
  {
    slug: "navamsha-d9-chart-marriage-spouse-astrology",
    title: "Navamsha (D9 Chart) Secrets: Decoding Your Soul, Marriage & True Potential",
    subtitle: "Why the D9 chart is considered the most crucial divisional chart in Vedic Astrology for predicting spouse nature and marriage timing.",
    category: "Astrology",
    author: "Pandit Pravin Shriram",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    content: "<h2>Why the Navamsha (D9) is the Golden Key of Jyotish</h2><p>While the Rashi chart (D1) represents the seed of your life, the Navamsha chart (D9) represents the actual fruit and outcome of your karmas.</p>",
    tags: ["Navamsha", "D9 Chart", "Spouse Prediction"]
  },
  {
    slug: "vastu-shastra-remedies-home-office-wealth",
    title: "Vastu Shastra for Prosperity: Essential Guidelines for Home, Office & Factory",
    subtitle: "Practical, non-demolition energy alignment guidelines for balancing the 16 Vastu zones and attracting wealth, health, and peace.",
    category: "Vastu Shastra",
    author: "Pandit Pravin Shriram",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    content: "<h2>The Cosmic Architecture of Vastu Shastra</h2><p>Vastu Shastra is the traditional Indian system of architecture based on directional alignments and the five primordial elements (Pancha Bhootas).</p>",
    tags: ["Vastu Shastra", "Wealth", "Positive Energy"]
  }
];

@Injectable()
export class BlogsService implements OnModuleInit {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.blogModel.countDocuments();
      if (count === 0) {
        console.log('📦 Seeding initial blogs to MongoDB...');
        await this.blogModel.insertMany(INITIAL_BLOGS);
        console.log('✅ Initial blogs seeded successfully.');
      }
    } catch (err: any) {
      console.error('Blogs seed check warning:', err.message);
    }
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogModel.findOne({ slug }).exec();
    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }
    return blog;
  }

  async create(blogData: Partial<Blog>): Promise<Blog> {
    const newBlog = new this.blogModel(blogData);
    return newBlog.save();
  }

  async update(id: string, blogData: Partial<Blog>): Promise<Blog> {
    const updated = await this.blogModel.findByIdAndUpdate(id, blogData, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.blogModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return { message: 'Blog deleted successfully' };
  }
}

