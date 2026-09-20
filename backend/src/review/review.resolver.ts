import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { User } from '../auth/model/user.model';
import { CreateReviewDto } from './dto/create-review.input';
import { ReviewModel } from './types/review.model';
import { DeleteReviewResponse } from './types/delete-review-response.type';
import { ReviewService } from './review.service';

@Resolver(() => ReviewModel)
export class ReviewResolver {
  constructor(private reviewService: ReviewService) {}

  @Mutation(() => ReviewModel, {
    description: 'Оставить отзыв на товар',
  })
  @Authorization()
  async createReview(
    @Authorized() user: User,
    @Args('input') input: CreateReviewDto,
  ) {
    return this.reviewService.createReview(user.id, input);
  }

  @Query(() => [ReviewModel], {
    description: 'Получить все отзывы для конкретного товара',
  })
  async productReviews(
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.reviewService.getProductReviews(productId);
  }

  @Mutation(() => DeleteReviewResponse, {
    description: 'Удалить отзыв (свой или любой для админа)',
  })
  @Authorization()
  async deleteReview(
    @Authorized() user: User,
    @Args('reviewId', { type: () => ID }) reviewId: string,
  ): Promise<DeleteReviewResponse> {
    return this.reviewService.deleteReview(reviewId, user.id, user.role);
  }
}
