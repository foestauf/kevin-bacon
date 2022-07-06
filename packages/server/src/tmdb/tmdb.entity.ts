import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("tmdbConfig")
export class TMDBEntity {
  @PrimaryColumn({
    type: "enum",
    enum: ["CONFIG"],
    default: "CONFIG",
    unique: true,
  })
  type: "CONFIG";

  @Column()
  base_url: string;

  @Column()
  secure_base_url: string;

  @Column({ type: "simple-array" })
  backdrop_sizes: string[];

  @Column({ type: "simple-array" })
  logo_sizes: string[];

  @Column({ type: "simple-array" })
  poster_sizes: string[];

  @Column({ type: "simple-array" })
  profile_sizes: string[];

  @Column({ type: "simple-array" })
  still_sizes: string[];

  @Column({ type: "simple-array" })
  change_keys: string[];

  @UpdateDateColumn()
  updatedAt: Date;
}
