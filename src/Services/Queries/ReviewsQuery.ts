import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import {firestore as db } from '@/firebase-config';
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

export const addReviewQuery = async (review: Omit<ReviewType, 'id' | 'created_at'>) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...review,
      created_at: Timestamp.now()
    });
    notify.success({ text: 'Review added successfully!' });
    return docRef;
  } catch (error) {
    notify.error({ text: 'Failed to add review' });
    throw error;
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