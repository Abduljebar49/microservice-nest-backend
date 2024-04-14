// book.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  publicationYear: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: 1 })
  totalCopies: number;

  @Column({ default: 0 })
  borrowedCopies: number;
}
