import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';
import { Profile } from './entities/profile.entity';
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
