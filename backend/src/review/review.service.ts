import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { Role } from 'generated/prisma/enums';

import { CreateReviewDto } from './dto/create-review.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, input: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
          data: {
            userId,
            productId: input.productId,
            rating: input.rating,
            comment: input.comment,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        const stats = await tx.review.aggregate({
          where: {
            productId: input.productId,
          },
          _avg: {
            rating: true,
          },
          _count: {
            rating: true,
          },
        });

        await tx.product.update({
          where: {
            id: input.productId,
          },
          data: {
            rating: stats._avg.rating ?? 0,
            reviewCount: stats._count.rating ?? 0,
          },
        });

        return review;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Вы уже оставляли отзыв на этот товар');
      }

      throw error;
    }
  }

  async getProductReviews(productId: string) {
    return this.prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteReview(reviewId: string, userId: string, userRole: Role) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    if (review.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Нет прав для удаления этого отзыва');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.review.delete({
        where: {
          id: reviewId,
        },
      });

      const stats = await tx.review.aggregate({
        where: {
          productId: review.productId,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

      await tx.product.update({
        where: {
          id: review.productId,
        },
        data: {
          rating: stats._avg.rating ?? 0,
          reviewCount: stats._count.rating ?? 0,
        },
      });
    });

    return {
      success: true,
      message: 'Отзыв успешно удален',
    };
  }
}
