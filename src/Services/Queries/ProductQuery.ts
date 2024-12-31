import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const queryToDeleteProduct = (id?: string) =>
  new Promise((resolve, reject) => {
    try {
      const ProductCollection = collection(firestore, "Products");
      const ProductDoc = doc(ProductCollection, id);
      deleteDoc(ProductDoc)
        .then((data) => {
          resolve(data);
          notify.success({ text: "Product deleted successfully" });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
          notify.error({
            text: "System was unable to proceed with deleting product",
          });
        });
    } catch (error) {
      console.log(error);
      reject(error);
      notify.error({
        text: "There was try/catch error while removing products",
      });
    }
  });

export const getProductData = <T>(
  listener: any,
  product_id?: any,
  admin: boolean = false
): Promise<T> =>
  new Promise(async (resolve, reject) => {
    try {
      const ProductCollection = collection(firestore, "Products");
      if (product_id) {
        // return only a single product using the product_id
        const ProductDoc = doc(ProductCollection, product_id);
        onSnapshot(
          ProductDoc,
          (singleSnap) => {
            resolve(listener({ ...singleSnap.data(), id: product_id }));
          },
          (error) => {
            notify.error({
              title: "Error",
              text: `[Error #BtG]: ON_SNAPSHOT_ERROR: ${JSON.stringify(
                error
              )}. <br/>Contact administrator.`,
            });
            reject(error);
          }
        );
      } else {
        // return all the products in the ProductCollection with pagination

        let productQuery = query(ProductCollection, orderBy("createdAt"));
        if (!admin) {
          // user is the one quering
          productQuery = query(productQuery, where("status", "==", "active"));
        }

        onSnapshot(
          productQuery,
          (snap) => {
            resolve(
              listener(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
          },
          (error) => {
            notify.error({
              title: "Error",
              text: `[Error ^HSTs]: SNAPSHOT_ERROR_WHILE_RETRIEVING_PRODUCTS: ${JSON.stringify(
                error
              )}. <br/>Contact administrator`,
            });
            reject(error);
          }
        );
      }
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #BnH]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const getSimilarProductData = (
  listener: any,
  product: ProductItemType
) =>
  new Promise(async (resolve, reject) => {
    try {
      const ProductCollection = collection(firestore, "Products");
      // return all the products in the ProductCollection with pagination
      const productQuery = query(
        ProductCollection,
        where("name", "!=", product?.name || "non"),
        where("category", "==", product?.category || "non"),
        orderBy("createdAt"),
        limit(3)
      );

      onSnapshot(
        productQuery,
        (snap) => {
          resolve(
            listener(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
          );
        },
        (error) => {
          notify.error({
            title: "Error",
            text: `[Error ^JNSUs]: SNAPSHOT_ERROR_WHILE_RETRIEVING_PRODUCTS: ${JSON.stringify(
              error
            )}. <br/>Contact administrator`,
          });
          reject(error);
        }
      );
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #BnH]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const getCartProducts = (listener: any): Promise<CartMetaItem[]> =>
  new Promise((resolve, reject) => {
    try {
      const CartCollection = collection(firestore, "Carts");
      if (auth.currentUser?.uid) {
        const UserDocs = doc(CartCollection, auth.currentUser?.uid);
        onSnapshot(
          UserDocs,
          async (snap) => {
            const DocData = snap.data() as CartProductItem;
            const DocDataProducts = DocData?.products;
            if (DocDataProducts) {
              // Map products to an array of promises
              const productPromises = DocDataProducts.map(async (item) => {
                const productData = await getProductData(
                  (data: any) => listener(data, "product"),
                  item.productID
                );
                return {
                  ...item,
                  metadata: productData,
                };
              });
              // Wait for all promises to resolve
              Promise.all(productPromises)
                .then((RefetchProductsMetadata) => {
                  resolve(listener(RefetchProductsMetadata || []));
                })
                .catch((error) => {
                  console.error("Error fetching product data:", error);
                });
            } else {
              resolve(listener([]));
            }
          },
          (error) => {
            notify.error({
              text: `[Error #DbG]: Problem fetching cart collection. ${JSON.stringify(
                error
              )}. <br/> Contact Administrator`,
            });
            reject(error);
          }
        );
      } else {
        resolve(listener([]));
      }
    } catch (error) {
      notify.error({
        text: `[Error #bhs]: Try/catch. <br/> Contact Administrator.`,
      });
      reject(error);
    }
  });
