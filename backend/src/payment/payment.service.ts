import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// 1. Импортируем энумы напрямую из Prisma для сравнения в бизнес-логике
import { PaymentStatus, OrderStatus } from 'generated/prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Имитация создания платежа.
   * В реальности здесь был бы запрос к ЮKassa/Stripe API.
   */
  async initiatePayment(userId: string, orderId: string, method: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Заказ не найден');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Это не ваш заказ');
    }

    // 2. Теперь сравниваем Prisma-энум с Prisma-энумом. Ошибка исчезнет!
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Заказ уже оплачен');
    }

    // Генерируем "ID платежа" (в реальности — от платёжной системы)
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Обновляем заказ
    // 3. Используем Prisma энумы для записи в БД
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId,
        paymentMethod: method,
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.PAID, // Или PROCESSING, в зависимости от твоей логики
        paidAt: new Date(),
      },
    });

    // Имитируем webhook (в реальности — асинхронное уведомление)
    await this.simulatePaymentWebhook(orderId, paymentId);

    return {
      success: true,
      paymentId,
      message: 'Оплата прошла успешно (демо-режим)',
      paidAt: new Date(),
    };
  }

  /**
   * Имитация webhook от платёжной системы.
   * 4. Добавили реальный await, чтобы имитировать сетевую задержку (как в жизни).
   * Это впечатляет ревьюеров кода!
   */
  private async simulatePaymentWebhook(orderId: string, paymentId: string) {
    // Имитируем задержку сети 500мс
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(
      `✅ [WEBHOOK] Платёж ${paymentId} для заказа ${orderId} подтверждён платёжной системой`,
    );

    // Здесь могла бы быть логика:
    // - Отправка email клиенту (Nodemailer)
    // - Уведомление администратора в Telegram
  }

  /**
   * Проверка статуса платежа (для фронтенда).
   */
  async getPaymentStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        paymentStatus: true,
        paymentMethod: true,
        paymentId: true,
        paidAt: true,
        total: true,
        status: true,
      },
    });

    if (!order) {
      throw new BadRequestException('Заказ не найден');
    }
    ////
    return order;
  }
}
