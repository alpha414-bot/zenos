import { ErrorFilter, isURL } from "@/System/function";
import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { getUrl } from "aws-amplify/storage";
import {
  EmailAuthProvider,
  User,
  linkWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";

export const getProductData = (listener: any, product_id?: any) =>
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
      let productQuery = query(
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

export const addCollectionDoc = (
  CollectionName: any,
  data: ProductItemType[],
  successMessage?: string
) =>
  new Promise((resolve, reject) => {
    try {
      const ProductCollection = collection(firestore, CollectionName);
      data.forEach((item) => {
        const DataObject = {
          ...item,
          ...{
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        addDoc(ProductCollection, DataObject)
          .then((data) => {
            notify.success({
              text: successMessage || `${CollectionName} successfully added.`,
            });
            resolve(data);
          })
          .catch((error) => {
            notify.error({
              title: "Error",
              text: "[Error &fjH]: Error while adding doc to collection. <br/>Contact administrator",
            });
            reject(error);
          });
      });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #DnG]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

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
            }
            // resolve(listener(DocDataProducts || []));
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

export const createUser = (AuthData: UserSignUpFormInput) =>
  new Promise((resolve, reject) => {
    try {
      const Credential = EmailAuthProvider.credential(
        AuthData.email as string,
        AuthData.password as string
      );
      linkWithCredential(auth.currentUser as User, Credential)
        .then((newuser) => {
          notify.success({
            text: "Your account has successfully being created",
          });
          updateProfile(newuser.user, {
            displayName: AuthData.username,
          }).catch((error) => {
            notify.error({
              text: `[Error @usme]: Account is created successfully, but there was problem with updating user profile. <br/>${JSON.stringify(
                error
              )} <br/> Contact administrator`,
            });
          });
          resolve(newuser);
        })
        .catch((error) => {
          notify.error({ text: ErrorFilter(error) });
          reject(error);
        });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #BNmzx]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const loginUser = (AuthData: UserSignInFormInput) =>
  new Promise((resolve, reject) => {
    try {
      signInWithEmailAndPassword(
        auth,
        AuthData.email as string,
        AuthData.password as string
      )
        .then((user) => {
          notify.success({
            text: "User signed in successfully.",
          });
          resolve(user);
        })
        .catch((error) => {
          notify.error({ text: ErrorFilter(error) });
          reject(error);
        });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #no_sside]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const logoutUser = () =>
  new Promise((resolve, reject) => {
    try {
      signOut(auth)
        .then((res) => {
          notify.success({ text: "You have successfully being logged out." });
          resolve(res);
        })
        .catch((error) => {
          notify.error({
            text: `[Error @llg]: There was a problem with logging you out. <br/>${JSON.stringify(
              error
            )} <br/> Contact administrator`,
          });
          reject(error);
        });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #kan]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const verifyAccount = () =>
  new Promise((resolve, reject) => {
    try {
      sendEmailVerification(auth.currentUser as User)
        .then((res) => {
          notify.success({
            text: "Email verification sent successfully. Please check your inbox.",
          });
          resolve(res);
        })
        .catch((error) => {
          notify.error({
            text: `[Error @vemI]: Failed to send email verification. <br/>${JSON.stringify(
              error
            )} <br/> Contact administrator`,
          });
          reject(error);
        });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #KinS]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const resetPasswordStepA = (email: string) =>
  new Promise((resolve, reject) => {
    try {
      sendPasswordResetEmail(auth, email)
        .then((data) => {
          notify.success({
            text: "Password reset email sent successfully. Check your inbox",
          });
          resolve(data);
        })
        .catch((error) => {
          notify.error({ text: ErrorFilter(error, "forgot-password") });
          reject(error);
        });
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #GnbH]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });

export const getAwsMedia = (key: any, dont_search: boolean = false) =>
  new Promise((resolve, reject) => {
    try {
      if (isURL(key) || dont_search) {
        // key is an absolute url, no need for cross checking
        // if dont_search is set to true
        resolve(key);
        return key;
      } else {
        getUrl({
          key: key,
          options: {
            accessLevel: "guest", // can be 'private', 'protected', or 'guest' but defaults to `guest`
            validateObjectExistence: false, // defaults to false
            expiresIn: 3600, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
            useAccelerateEndpoint: false, // Whether to use accelerate endpoint.
          },
        })
          .then((result) => {
            resolve(result.url.href);
            return result.url.href;
          })
          .catch((error) => {
            reject(error);
          });
      }
    } catch (error) {
      notify.error({
        title: "Error",
        text: `[Error #AwsMedia]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
      reject(error);
    }
  });
