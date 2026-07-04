import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../../posts/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findALL() {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);
    if (user.id === 1) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este usuario.',
      );
    }
    return user;
  }

  async getUserProfileById(id: number): Promise<Profile> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });

    if (!user?.profile) {
      throw new NotFoundException('No se encontró el perfil para ese usuario.');
    }

    return user.profile;
  }

  async getUserPostsById(id: number): Promise<Posts[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        posts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user.posts ?? [];
  }

  async create(body: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(body);
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch {
      throw new BadRequestException('Error creando el usuario.');
    }
  }

  async update(id: number, changes: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const updatedUser = this.userRepository.merge(user, changes);
      const savedUser = await this.userRepository.save(updatedUser);
      return savedUser;
    } catch {
      throw new BadRequestException('Error modificando al usuario.');
    }
  }

  async delete(id: number) {
    try {
      await this.userRepository.delete(id);
      return { message: 'El usuario fue eliminado' };
    } catch {
      throw new BadRequestException('Error eliminando al usuario.');
    }
  }

  private async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }
}
