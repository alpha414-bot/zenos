import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const addToCartQuery = (product: ProductItemType) =>
  new Promise((resolve, reject) => {
    try {
      if (auth.currentUser?.uid) {
        // there is an authenticated user
        const CartCollection = collection(firestore, "Carts");
        const UserCartDoc = doc(CartCollection, auth.currentUser.uid);
        getDoc(UserCartDoc).then((UserProductItems) => {
          const UserCartProducts = UserProductItems.data() as CartProductItem;
          if (UserProductItems.exists() && UserCartProducts.products) {
            // the user has made use of "Add to cart" and there is 'products'
            const UpdateInUserProducts = UserCartProducts?.products.map(
              (item) => {
                // check if about to be added products is already there
                return item.productID === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      updatedAt: new Date(),
                    }
                  : item;
              }
            ); // this might not be necessary
            const NewUserProducts = UserCartProducts?.products.some(
              (item) => item.productID === product.id
            )
              ? UpdateInUserProducts // no new products, work still on old products added
              : [
                  ...UpdateInUserProducts,
                  {
                    productID: product.id,
                    quantity: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ];
            updateDoc(UserCartDoc, { products: NewUserProducts })
              .then((data) => {
                notify.success({
                  text: `<strong class="underline underline-offset-2 decoration-dotted">${product.name}</strong> added to cart.`,
                });
                resolve(data);
              })
              .catch((error) => {
                notify.error({
                  title: "Error",
                  text: `[Error @Kmop]: Error while configuring products ${JSON.stringify(
                    error
                  )}.<br/> Contact administrator`,
                });
                reject(error);
              });
          } else {
            setDoc(UserCartDoc, {
              products: [
                {
                  productID: product.id,
                  quantity: 1,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            })
              .then((data) => {
                notify.success({
                  text: `<strong class="underline underline-offset-2 decoration-dotted">${product.name}</strong> added to cart.`,
                });
                resolve(data);
              })
              .catch((error) => {
                notify.error({
                  title: "Error",
                  text: `[Error /&GNm]: ${JSON.stringify(
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
          text: "[Error #ProblemSignInc]: There was a problem with authorization instance.<br/> Contact administrator or try to login",
        });
      }
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #Capi]: try/catch: ${JSON.stringify(
          error
        )}.<br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const removeCartProduct = (product: ProductItemType) =>
  new Promise((resolve, reject) => {
    try {
      const CartCollection = collection(firestore, "Carts");
      const UserCartDoc = doc(CartCollection, auth.currentUser?.uid);
      getDoc(UserCartDoc).then((UserProductItems) => {
        const UserCartProducts = UserProductItems.data() as CartProductItem;
        if (UserProductItems.exists() && UserCartProducts.products) {
          const RemainingProductAfterDel = UserCartProducts?.products.filter(
            (item) => item.productID !== product?.id
          );
          updateDoc(UserCartDoc, { products: RemainingProductAfterDel })
            .then((data) => {
              notify.success({
                text: `<strong class="underline underline-offset-2 decoration-dotted">${product.name}</strong> removed from cart.`,
              });
              resolve(data);
            })
            .catch((error) => {
              notify.error({
                title: "Error",
                text: `[Error @Psnx]: Error while configuring products ${JSON.stringify(
                  error
                )}.<br/> Contact administrator`,
              });
              reject(error);
            });
        }
      });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error %snUm]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const clearCartProducts = () =>
  new Promise((resolve, reject) => {
    try {
      const CartCollection = collection(firestore, "Carts");
      const UserCartDoc = doc(CartCollection, auth.currentUser?.uid);
      getDoc(UserCartDoc).then((UserProductItems) => {
        const UserCartProducts = UserProductItems.data() as CartProductItem;
        if (UserProductItems.exists() && UserCartProducts.products) {
          updateDoc(UserCartDoc, { products: [] })
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              notify.error({
                title: "Error",
                text: `[Error @NuJ]: Error while clearing carts ${JSON.stringify(
                  error
                )}.<br/> Contact administrator`,
              });
              reject(error);
            });
        }
      });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error %badGF]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const updateCartQuantity = (
  product: ProductItemType,
  quantity?: number,
  operator?: "insert"
) =>
  new Promise((resolve, reject) => {
    try {
      const CartCollection = collection(firestore, "Carts");
      const UserCartDoc = doc(CartCollection, auth.currentUser?.uid);
      getDoc(UserCartDoc).then((UserProductItems) => {
        const UserCartProducts = UserProductItems.data() as CartProductItem;
        if (UserProductItems.exists() && UserCartProducts.products) {
          const UpdateInUserProducts = UserCartProducts?.products.map(
            (item) => {
              // check if about to be added products is already there
              const NewQuantity = Number(
                operator != "insert"
                  ? Number(item.quantity + (quantity || 0))
                  : quantity
              );
              return item.productID === product.id
                ? {
                    ...item,
                    quantity: NewQuantity < 2 ? 1 : NewQuantity,
                    updatedAt: new Date(),
                  }
                : item;
            }
          );
          updateDoc(UserCartDoc, { products: UpdateInUserProducts })
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              notify.error({
                title: "Error",
                text: `[Error @upQA]: Error while updating products  ${JSON.stringify(
                  error
                )}.<br/> Contact administrator`,
              });
              reject(error);
            });
        }
      });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #HsfG]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const updateCartProductDiscount = (
  product: ProductItemType,
  discount: { name: string; value: number }
) =>
  new Promise((resolve, reject) => {
    try {
      const CartCollection = collection(firestore, "Carts");
      const UserCartDoc = doc(CartCollection, auth.currentUser?.uid);
      getDoc(UserCartDoc).then((UserProductItems) => {
        const UserCartProducts = UserProductItems.data() as CartProductItem;
        if (UserProductItems.exists() && UserCartProducts.products) {
          const UpdateInUserProducts = UserCartProducts?.products.map(
            (item) => {
              // check if about to be added products is already there
              return item.productID === product.id
                ? {
                    ...item,
                    discount: discount,
                    updatedAt: new Date(),
                  }
                : item;
            }
          );

          updateDoc(UserCartDoc, { products: UpdateInUserProducts })
            .then((data) => {
              notify.success({
                text: `<strong class="underline underline-offset-4 decoration-dotted">${discount.name}</strong> discount offer has been applied on <strong class="underline underline-offset-4 decoration-dotted">${product.name}</strong> in cart.`,
              });
              resolve(data);
            })
            .catch((error) => {
              notify.error({
                title: "Error",
                text: `[Error @upQA]: Error while updating products  ${JSON.stringify(
                  error
                )}.<br/> Contact administrator`,
              });
              reject(error);
            });
        }
      });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #njUin]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const removeCartProductDiscount = (product: ProductItemType) =>
  new Promise((resolve, reject) => {
    try {
      const CartCollection = collection(firestore, "Carts");
      const UserCartDoc = doc(CartCollection, auth.currentUser?.uid);
      getDoc(UserCartDoc).then((UserProductItems) => {
        const UserCartProducts = UserProductItems.data() as CartProductItem;
        if (UserProductItems.exists() && UserCartProducts.products) {
          const UpdateInUserProducts = UserCartProducts?.products.map(
            (item) => {
              // check if about to be added products is already there
              if (item.productID === product.id) {
                delete item.discount;
              }
              return item.productID === product.id
                ? {
                    ...item,
                    updatedAt: new Date(),
                  }
                : item;
            }
          );

          updateDoc(UserCartDoc, { products: UpdateInUserProducts })
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              notify.error({
                title: "Error",
                text: `[Error @upQA]: Error while updating products  ${JSON.stringify(
                  error
                )}.<br/> Contact administrator`,
              });
              reject(error);
            });
        }
      });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #BmSd]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });
