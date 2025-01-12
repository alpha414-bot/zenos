import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { baseURL } from "@/System/Constants";
import axios, { AxiosError } from "axios";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import _ from "lodash";
import { clearCartProducts } from "./CartQuery";

export const newOrderQuery = (
  instance: PaymentOnSuccessProps,
  carts: CartMetaItem[],
  billing_info: BillingInputInterface
) =>
  new Promise((resolve, reject) => {
    try {
      if (auth.currentUser?.uid) {
        const OrderCollection = collection(firestore, "Orders");
        const OrderReferenceDoc = doc(OrderCollection, instance.reference);

        getDoc(OrderReferenceDoc).then((UserProductItems) => {
          const UserOrderProducts =
            UserProductItems.data() as OrderDataInterface;
          if (UserProductItems.exists() && UserOrderProducts) {
            // retrieving the order payment reference
            resolve(UserOrderProducts);
            // resolve(UserProductItems.data());
          } else {
            delete billing_info.password;
            delete billing_info.confirm_password;
            setDoc(OrderReferenceDoc, {
              instance: instance,
              products: carts,
              billing_info: billing_info,
              user_uid: auth.currentUser?.uid,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
              .then(() => {
                axios
                  .request({
                    baseURL,
                    url: "mailer/new/order",
                    method: "post",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    maxBodyLength: Infinity,
                    responseType: "json",
                    data: JSON.stringify({
                      username: billing_info.username,
                      email: billing_info.email,
                      order_id: instance.reference,
                      products: carts.map((item) => ({
                        id: item.productID,
                        name: _.trim(item.metadata?.name),
                        price:
                          (item.quantity || 1) * Number(item.metadata?.price),
                      })),
                    }),
                  })
                  .then((res) => {
                    // #notification to admin
                    console.log("respsone", res.data);
                    notify.success({
                      text: `Payment is successful and order received. You would be redirected to order page to track your products.`,
                    });
                    clearCartProducts();
                    resolve({});
                  })
                  .catch(
                    (
                      error: AxiosError<{
                        data: { message: string };
                        error: boolean;
                        success: boolean;
                      }>
                    ) => {
                      console.log(error.response);
                      if (error.response && error.response.data.data) {
                        notify.error({
                          text: `Notification failed to triggered. ${JSON.stringify(
                            error.response.data.data.message
                          )}`,
                        });
                      } else {
                        notify.error({
                          text: "Internal Server Error. Please customer support.",
                        });
                      }
                    }
                  );
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
