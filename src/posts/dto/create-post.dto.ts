import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  title!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post.',
  })
  content!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The cover image of the post',
    example: 'https://example.com/cover-image.jpg',
  })
  coverImage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The summary of the post',
    example: 'This is a summary of my first post.',
  })
  summary?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'The IDs of the categories associated with the post',
    example: ['string'],
  })
  categoryIds?: number[];
}
