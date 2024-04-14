// create-book.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Author cannot be empty' })
  @IsString({ message: 'Author must be a string' })
  author: string;

  @IsOptional()
  @IsInt({ message: 'Publication year must be an integer' })
  @Min(0, { message: 'Publication year cannot be negative' })
  publicationYear?: number;

  @IsOptional()
  @IsBoolean({ message: 'Is published must be a boolean value' })
  isPublished?: boolean;
}
