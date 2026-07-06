import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
import { OpenaiService } from '../../ai/services/openai/openai.service';
import { GetimgAIService } from '../../ai/services/getimg/getimg.service';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
    private openaiService: OpenaiService,
    private getimg: GetimgAIService,
  ) {}

  async create(body: CreatePostDto, userId: number) {
    try {
      const newPost = await this.postRepository.save({
        ...body,
        user: { id: userId },
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

  async publish(id: number, userId: number) {
    const post = await this.findOne(id);
    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para publicar este post.',
      );
    }
    if (!post.content || !post.title || post.categories?.length === 0) {
      throw new BadRequestException(
        'El post no puede ser publicado. Asegúrate de que tenga título, contenido y al menos una categoría.',
      );
    }
    //const summary = await this.openaiService.generateSummary(post.content);
    const image = await this.getimg.generateImage(post.title);
    const changes = this.postRepository.merge(post, {
      isDraft: false,
      coverImage: image,
    });
    const updatedPost = await this.postRepository.save(changes);
    return this.findOne(updatedPost.id);
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
