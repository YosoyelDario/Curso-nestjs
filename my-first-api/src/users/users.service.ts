import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  async create(body: CreateUserDto) {
    try {
      const newUser = await this.userRepository.save(body);
      return newUser;
    } catch {
      throw new BadRequestException('Error creando el usuario.');
    }
  }

  async update(id: number, changes: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const updatedUser = this.userRepository.merge(user, changes);
      return this.userRepository.save(updatedUser);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.delete(user);
    return {
      message: 'Usuario eliminado.',
    };
  }

  private async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const pgError = error as QueryFailedError & {
        code?: string;
        detail?: string;
      };

      if (pgError.code === '23505') {
        throw new ConflictException(
          pgError.detail ?? 'Ya existe un recurso con esos datos únicos.',
        );
      }
    }

    throw error;
  }
}
