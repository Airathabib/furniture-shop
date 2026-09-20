import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class UpdateProductDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsOptional()
  slug?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  sku?: string | null;

  @Field(() => Float, { nullable: true })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0)
  @IsOptional()
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0)
  @IsOptional()
  oldPrice?: number | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  description?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(10000)
  @IsOptional()
  fullDescription?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  warranty?: string | null;

  @Field(() => String, { nullable: true })
  @IsUrl(
    {},
    {
      message: 'Изображение должно быть корректным URL',
    },
  )
  @IsOptional()
  image?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsUrl(
    {},
    {
      each: true,
      message: 'Каждый элемент images должен быть URL',
    },
  )
  @IsOptional()
  images?: string[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  categoryId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  collection?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  size?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  configuration?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  color?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  material?: string | null;
}
