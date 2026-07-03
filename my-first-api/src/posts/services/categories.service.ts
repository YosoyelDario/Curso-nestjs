import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(body: CreateCategoryDto) {
    try {
      const newCategory = await this.categoryRepository.save(body);
      return this.findOne(newCategory.id);
    } catch {
      throw new BadRequestException('Error creando la categoría.');
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    return category;
  }
  async getPostsById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        posts: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    return category.posts ?? [];
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id);
      const updatedCategory = this.categoryRepository.merge(
        category,
        updateCategoryDto,
      );
      const savedCategory = await this.categoryRepository.save(updatedCategory);
      return savedCategory;
    } catch {
      throw new BadRequestException('Error modificando la categoría.');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.categoryRepository.delete(id);
      return { message: 'La categoría fue eliminada' };
    } catch {
      throw new BadRequestException('Error eliminando la categoría.');
    }
  }
}
