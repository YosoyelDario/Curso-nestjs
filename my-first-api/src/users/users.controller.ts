import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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
    return (
      this.users.find((user) => user.id === id) ??
      `ERROR 404, no se encontro el ID ${id}`
    );
  }

  @Post()
  createUser(@Body() body: User) {
    this.users.push(body);
    return body;
  }
}
