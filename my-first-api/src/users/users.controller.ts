import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  NotFoundException,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from './user.dto';
interface User {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    {
      id: '1',
      name: 'John Wick',
      email: 'john.wick@example.com',
    },
    {
      id: '2',
      name: 'Red John',
      email: 'red.john@example.com',
    },
  ];

  @Get()
  getUsers() {
    return this.users;
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    if (user.id === '1') {
      throw new ForbiddenException('No tienes permisos para acceder a los datos de este usuario.');
    }
    return user;
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    const newUser = {
      ...body,
      id: `${new Date().getTime()}`,
    };
    this.users.push(newUser);
    return newUser;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const position = this.users.findIndex((user) => user.id === id);
    if (position === -1) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    this.users.splice(position, 1);
    return {
      message: 'Usuario eliminado.',
    };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() changes: UpdateUserDto) {
    const position = this.users.findIndex((user) => user.id === id);
    if (position === -1) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const currentData = this.users[position];
    const email = changes?.email;
    // Validar el formato del correo electrónico si se proporciona, en la practica con el DTO
    // y el ValidationPipe no es necesario,
    // pero lo agrego para mostrar un ejemplo de validación manual que se hizo antes
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new UnprocessableEntityException('Email no es valido.');
      }
    }
    const updatedUser = {
      ...currentData,
      ...changes,
    };
    this.users[position] = updatedUser;
    return updatedUser;
  }
}
