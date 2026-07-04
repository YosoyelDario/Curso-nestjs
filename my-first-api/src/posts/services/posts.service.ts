import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) {}

  async create(body: CreatePostDto) {
    try {
      const newPost = await this.postRepository.save({
        ...body,
        user: { id: body.userId },
        categories: body.categoryIds?.map((id) => ({ id })),
      });
      return this.findOne(newPost.id);
    } catch {
      throw new BadRequestException('Error creando el post.');
    }
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: {
        user: {
          profile: true,
        },
        categories: true,
      },
    });
    return posts;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        user: {
          profile: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post con id ${id} no encontrado`);
    }

    return post;
  }

  async getCategoriesById(id: number): Promise<Category[]> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post con id ${id} no encontrado`);
    }

    return post.categories ?? [];
  }

  async getPostsByCategoryId(categoryId: number) {
    const posts = await this.postRepository.find({
      where: {
        categories: {
          id: categoryId,
        },
      },
      relations: { user: { profile: true } },
    });
    return posts;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findOne(id);
      const updatedPost = this.postRepository.merge(post, updatePostDto);
      const savedPost = await this.postRepository.save(updatedPost);
      return savedPost;
    } catch {
      throw new BadRequestException('Error modificando el post.');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.postRepository.delete(id);
      return { message: 'El post fue eliminado' };
    } catch {
      throw new BadRequestException('Error eliminando el post.');
    }
  }
}
