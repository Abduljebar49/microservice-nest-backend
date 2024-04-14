import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RResponse } from 'models/response';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<RResponse> {
    const newBook = this.bookRepository.create(createBookDto);
    await this.bookRepository.save(newBook);

    return {
      message: '',
      data: { book: newBook },
    };
  }

  async findAll(): Promise<RResponse> {
    const books = await this.bookRepository.find();
    return {
      message: 'Fetched successfully',
      data: books,
    };
  }

  async findOne(id: number): Promise<RResponse> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return {
      message: 'success',
      data: book,
    };
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<RResponse> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('No record found with given id');
    }
    this.bookRepository.merge(book, updateBookDto);
    const data = await this.bookRepository.save(book);
    return {
      data: { book: data },
      message: 'Successfully updated',
    };
  }

  async remove(id: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id } });
    await this.bookRepository.remove(book);
  }
}
