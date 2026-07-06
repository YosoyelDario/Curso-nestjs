import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Put,
  Post,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';
import { Profile } from '../entities/profile.entity';
import { Posts } from '../../posts/entities/post.entity';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findALL();
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Get(':id/profile')
  findUserProfile(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
    return this.usersService.getUserProfileById(id);
  }

  @Get(':id/posts')
  findUserPosts(@Param('id', ParseIntPipe) id: number): Promise<Posts[]> {
    return this.usersService.getUserPostsById(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateUserDto,
  ) {
    return this.usersService.update(id, changes);
  }
}
