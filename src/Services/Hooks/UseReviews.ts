import { getProductReviewsQuery } from '../Queries/ReviewsQuery';
import { useQuery } from 'react-query';
import { keys } from '@/System/function';

export const useProductReviews = (product_id: string | undefined) => {
  return useQuery(
    keys.product_reviews(product_id),
    () => getProductReviewsQuery(product_id),
    {
      enabled: !!product_id,
      placeholderData: []
    }
  );
};
