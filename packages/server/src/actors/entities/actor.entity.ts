import { MovieEntity } from 'src/movies/entities/movie.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('actors')
export class ActorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  adult: boolean;

  @Column({ nullable: true })
  birthday: string;

  @Column({ nullable: true })
  deathday: string;

  @Column({ nullable: true })
  gender: string;

  @Column({nullable: true})
  known_for_department: string;

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  imdb_id: string;

  @Column({ nullable: true })
  homepage: string;

  @Column({ nullable: true })
  place_of_birth: string;

  @Column({ nullable: true, type: 'numeric' })
  popularity: number;

  @Column({ nullable: true })
  profile_path: string;

  @Column({ unique: true })
  tmdbId: number;

  @ManyToMany(() => MovieEntity, { cascade: true, nullable: true })
  @JoinTable({ name: 'cast' })
  movies: MovieEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
