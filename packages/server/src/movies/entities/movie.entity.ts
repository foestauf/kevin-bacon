import { ActorEntity } from 'src/actors/entities/actor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  adult: boolean;

  @Column({ nullable: true })
  backdrop_path: string;

  @Column({ nullable: true })
  budget: number;

  @Column({ nullable: true })
  homepage: string;

  @Column({ nullable: true })
  imdb_id: string;

  @Column({ nullable: true })
  original_language: string;

  @Column({ nullable: true })
  original_title: string;

  @Column({ nullable: true })
  overview: string;

  @Column({ nullable: true, type: 'numeric' })
  popularity: number;

  @Column({ nullable: true })
  poster_path: string;

  @Column({ nullable: true })
  release_date: string;

  @Column({ nullable: true })
  revenue: number;

  @Column({ nullable: true })
  runtime: number;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  tagline: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true, unique: true })
  tmdbId: number;

  @Column({ nullable: true, type: 'numeric' })
  vote_average: number;

  @Column({ nullable: true })
  vote_count: number;

  @ManyToMany(() => ActorEntity, { cascade: true })
  @JoinTable({ name: 'cast' })
  actors: ActorEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
