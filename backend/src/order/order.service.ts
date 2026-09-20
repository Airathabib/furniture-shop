import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.input';
import { ChangeOrderStatusDto } from './dto/change-status.input';
import { OrderStatusEnum, PaymentStatusEnum } from './types/order.model';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, input: CheckoutDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException(
        'Корзина пуста. Добавьте товары перед оформлением.',
      );
    }

    let subtotal = 0;
    const orderItemsData = cartItems.map((cartItem) => {
      const product = cartItem.product;

      if (!product.inStock) {
        throw new BadRequestException(
          `Товар "${product.name}" недоступен для заказа.`,
        );
      }

      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity: cartItem.quantity,
        total: itemTotal,
      };
    });

    const total = subtotal + (input.deliveryCost ?? 0) - (input.discount ?? 0);

    const orderNumber = await this.generateOrderNumber();

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatusEnum.PENDING,
          paymentStatus: PaymentStatusEnum.UNPAID,
          subtotal,
          deliveryCost: input.deliveryCost ?? 0,
          discount: input.discount ?? 0,
          total,
          address: input.address,
          phone: input.phone,
          email: input.email,
          comment: input.comment,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { userId } });

      return createdOrder;
    });

    return order;
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, isAdmin: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден.');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этому заказу.');
    }

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async changeStatus(input: ChangeOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден.');
    }

    const updateData: Prisma.OrderUpdateInput = {};

    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    if (input.paymentStatus !== undefined) {
      updateData.paymentStatus = input.paymentStatus;
    }

    return this.prisma.order.update({
      where: { id: input.orderId },
      data: updateData,
      include: { items: true },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });
    const number = String(count + 1).padStart(6, '0');
    return `ORD-${year}-${number}`;
  }
}
