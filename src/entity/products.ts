import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Situations } from "./Situations";
import { ProductCategory } from "./ProductCategory";
import { ProductSituation } from "./ProductSituation";

@Entity("products")
export class Products {
  @PrimaryGeneratedColumn()
  id!: number; //ai di

  @Column()
  name!: string; //nome

  @ManyToOne(
    () => ProductSituation,
    (situations: { products: any }) => situations.products
  ) //product situation
  @JoinColumn({ name: "productSituationId" })
  situations!: ProductSituation;

  @ManyToOne(
    () => ProductCategory,
    (categories: { products: any }) => categories.products
  ) //product category
  @JoinColumn({ name: "productCategoryId" })
  categories!: ProductCategory;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }) //created
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP", //updated
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
  category: any;
}
