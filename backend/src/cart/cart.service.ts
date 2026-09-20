import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.input';
import { UpdateCartItemDto } from './dto/update-cart-item.input';
import { CartItemType, CartType } from './types/cart-item.type';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string): Promise<CartType> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const items: CartItemType[] = cartItems.map((item) => {
      const categoryWithType = {
        ...item.product.category,
        productCount: 0,
      };

      return {
        id: item.id,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
        product: {
          ...item.product,
          category: categoryWithType,
        },
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      items,
      totalAmount,
    };
  }

  async addToCart(userId: string, input: AddToCartDto): Promise<CartType> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    if (!product.inStock) {
      throw new BadRequestException('Товар отсутствует на складе');
    }

    const quantity = input.quantity ?? 1;

    await this.prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId,
        productId: input.productId,
        quantity,
      },
    });

    return this.getCart(userId);
  }

  async updateCartItem(
    userId: string,
    input: UpdateCartItemDto,
  ): Promise<CartType> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар отсутствует в корзине');
    }

    await this.prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
      data: {
        quantity: input.quantity,
      },
    });

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string): Promise<CartType> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар отсутствует в корзине');
    }

    await this.prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartType> {
    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    });

    return {
      items: [],
      totalAmount: 0,
    };
  }
}
