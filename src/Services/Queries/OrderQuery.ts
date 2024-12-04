import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { clearCartProducts } from "./CartQuery";

export const newOrderQuery = (
  payment_instance: PaymentOnSuccessProps,
  carts: CartMetaItem[],
  billing_info: BillingInputInterface
) =>
  new Promise((resolve, reject) => {
    try {
      if (auth.currentUser?.uid) {
        const OrderCollection = collection(firestore, "Orders");
        const PaymentReferenceDoc = doc(
          OrderCollection,
          payment_instance.reference
        );

        getDoc(PaymentReferenceDoc).then((UserProductItems) => {
          const UserOrderProducts =
            UserProductItems.data() as OrderDataInterface;
          if (UserProductItems.exists() && UserOrderProducts) {
            // retrieving the order payment reference
            resolve(UserProductItems.data());
          } else {
            setDoc(PaymentReferenceDoc, {
              payment_instance: payment_instance,
              products: carts,
              billing_info: billing_info,
              user_uid: auth.currentUser?.uid,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
              .then((data) => {
                notify.success({
                  text: `Payment is successful and order received. You would be redirected to order page to track your products.`,
                });
                clearCartProducts();
                resolve(data);
              })
              .catch((error) => {
                notify.error({
                  title: "Error",
                  text: `[Error /&Bye]: ${JSON.stringify(
                    error
                  )}. <br/> Contact administrator`,
                });
                reject(error);
              });
          }
        });
      } else {
        notify.error({
          title: "Error",
          text: "[Error #ProblemSignInD]: There was a problem with authorization instance.<br/> Contact administrator or try to login",
        });
      }
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #njnsm]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const getOrders = (listener: any): Promise<OrderDataInterface[]> =>
  new Promise((resolve, reject) => {
    try {
      const CartCollection = query(
        collection(firestore, "Orders"),
        orderBy("createdAt", "desc")
      );
      if (auth.currentUser?.uid) {
        onSnapshot(
          CartCollection,
          async (snap) => {
            const OrderData = snap.docs.map((snapshot) => ({
              ...(snapshot.data() as OrderDataInterface),
              ...{ id: snapshot.id },
            }));
            resolve(
              listener(
                OrderData.filter(
                  (fresh) => fresh.user_uid == auth.currentUser?.uid
                )
              )
            );
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
        text: `[Error #NUJ]: Try/catch. <br/> Contact Administrator.`,
      });
      reject(error);
    }
  });
