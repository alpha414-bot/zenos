import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { firestore as db } from '@/firebase-config';
import { notify } from '@/notify';

export interface ReviewType {
  id?: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: Timestamp;
}

export const checkUserPurchasedProduct = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const ordersRef = collection(db, 'Orders');
    const q = query(ordersRef, where('user_uid', '==', userId));
    const orderSnapshot = await getDocs(q);
    
    // Check if any order contains the product
    return orderSnapshot.docs.some(doc => {
      const orderData = doc.data();
      return orderData.products?.some((product: any) => product.productID === productId);
    });
  } catch (error) {
    console.error('Error checking purchase history:', error);
    return false;
  }
};

export const addReviewQuery = async (review: Omit<ReviewType, 'id' | 'created_at'>) => {
  try {
    // Check if user has purchased the product
    const hasPurchased = await checkUserPurchasedProduct(review.user_id, review.product_id);
    
    if (!hasPurchased) {
      notify.error({ 
        text: 'You must purchase this product before leaving a review',
        title: 'Review Error'
      });
      throw new Error('User has not purchased this product');
    }

    // Check if user has already reviewed this product
    const existingReview = await checkExistingReview(review.user_id, review.product_id);
    if (existingReview) {
      notify.error({ 
        text: 'You have already reviewed this product',
        title: 'Review Error'
      });
      throw new Error('User has already reviewed this product');
    }

    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...review,
      created_at: Timestamp.now()
    });
    
    notify.success({ text: 'Review added successfully!' });
    return docRef;
  } catch (error) {
    if (error instanceof Error && error.message.includes('has not purchased')) {
      // Error already shown through notify
      throw error;
    }
    notify.error({ text: 'Failed to add review' });
    throw error;
  }
};

const checkExistingReview = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('user_id', '==', userId),
      where('product_id', '==', productId)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking existing review:', error);
    return false;
  }
};

export const getProductReviewsQuery = async (product_id: string | undefined) => {
  if (!product_id) return [];
  
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('product_id', '==', product_id),
      orderBy('created_at', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReviewType[];
  } catch (error) {
    notify.error({ text: 'Failed to fetch reviews' });
    throw error;
  }
};