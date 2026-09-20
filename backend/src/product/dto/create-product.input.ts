import { Field, Float, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
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
export class CreateProductDto {
  @Field(() => String)
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название обязательно' })
  @MaxLength(150, {
    message: 'Название не должно превышать 150 символов',
  })
  name!: string;

  @Field(() => String)
  @IsString({ message: 'Slug должен быть строкой' })
  @IsNotEmpty({ message: 'Slug обязателен' })
  @MaxLength(150, {
    message: 'Slug не должен превышать 150 символов',
  })
  slug!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  sku?: string | null;

  @Field(() => Float)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Цена должна быть числом' },
  )
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price!: number;

  @Field(() => Float, { nullable: true })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Старая цена должна быть числом' },
  )
  @Min(0, { message: 'Старая цена не может быть отрицательной' })
  @IsOptional()
  oldPrice?: number | null;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(5000, {
    message: 'Описание не должно превышать 5000 символов',
  })
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

  @Field(() => String)
  @IsString({ message: 'Изображение должно быть строкой' })
  @IsNotEmpty({ message: 'Изображение обязательно' })
  @IsUrl({}, { message: 'Изображение должно быть корректным URL' })
  image!: string;

  @Field(() => [String])
  @IsArray({ message: 'images должно быть массивом' })
  @ArrayNotEmpty({ message: 'Добавьте хотя бы одно изображение' })
  @ArrayMaxSize(20, {
    message: 'Можно добавить не более 20 изображений',
  })
  @IsUrl(
    {},
    {
      each: true,
      message: 'Каждый элемент images должен быть корректным URL',
    },
  )
  images!: string[];

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean({ message: 'inStock должен быть boolean' })
  @IsOptional()
  inStock?: boolean;

  @Field(() => String)
  @IsString({ message: 'categoryId должен быть строкой' })
  @IsNotEmpty({ message: 'categoryId обязателен' })
  categoryId!: string;

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
