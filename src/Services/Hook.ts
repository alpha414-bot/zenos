import { keys } from "@/System/function";
import { AuthUserType } from "@/Types/Auth";
import { MediaItemInterface } from "@/Types/Media";
import { auth } from "@/firebase-config";
import { notify } from "@/notify";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAuthUser } from "./Hooks";
import { queryToGetUserData } from "./Queries/AuthQuery";
import { queryAppMedia, queryToGetAssetFile } from "./Queries/MediaQuery";
import { getCartProducts, getProductData, getSimilarProductData } from "./Queries/ProductQuery";
import { getOrders } from "./Queries/OrderQuery";

export const use = (type: "admin" | "user" = "user") => {
  const queryClient = useQueryClient();
  const queryKey = [`auth_${type}`];
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // for syncing all query data if auth user is changed
      const data = await queryToGetUserData(user, type);
      queryClient.setQueryData(queryKey, data);
    });
  }, []);
  return useQuery({
    queryKey,
    queryFn: (): Promise<AuthUserType> =>
      new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
          try {
            if (!user?.uid) {
              // user should be signed in anonymously, if none authenticated
              signInAnonymously(auth)
                .then((new_user) => {
                  queryToGetUserData(new_user.user, type).then((data) => {
                    resolve(data);
                  });
                })
                .catch((error) => {
                  notify.error({
                    title: "Error",
                    text: "[Error %gBF]: Authentication instance unmet.<br/> Contact administrator or try to login",
                  });
                  reject(error);
                });
            } else {
              // user is authenticated and is not anonymous
              queryToGetUserData(user, type).then((metadata) => {
                resolve(metadata);
              });
            }
          } catch (error) {
            reject(error);
          }
        });
      }),
  });
};

export const useProductsData = <T>(product_id?: any) => {
  const queryClient = useQueryClient();
  // listener to subscribe to firestore snappshot
  const snapshotListener = useCallback((data: any) => {
    queryClient.setQueryData(keys.product_data(product_id), data);
    return data;
  }, []);
  return useQuery(
    keys.product_data(product_id),
    (): Promise<T> => getProductData(snapshotListener, product_id),
    {
      keepPreviousData: true,
      placeholderData: !!product_id ? [] : ({} as T),
    }
  );
};

export const useSimilarProductsData = (product: ProductItemType) => {
  const queryClient = useQueryClient();
  // listener to subscribe to firestore snappshot
  const snapshotListener = useCallback((data: any) => {
    queryClient.setQueryData(keys.similar_product_data(product.id), data);
    return data;
  }, []);
  return useQuery(
    keys.similar_product_data(product.id),
    () => getSimilarProductData(snapshotListener, product),
    {
      placeholderData: [],
    }
  );
};

export const useCartProducts = () => {
  const queryClient = useQueryClient();
  const { data: AuthUser } = useAuthUser();
  const snapshotListener = useCallback(
    (data: any, type?: "product") => {
      if (type == "product") {
        // the listener is meant for a single product inside the carts, so it can be updated
        const ProductsData = data as ProductItemType;
        const CartData = queryClient.getQueryData(
          keys.cart_data(AuthUser?.uid)
        ) as CartMetaItem[];
        if (CartData) {
          const CartUpdatedData = CartData.map((item) =>
            item.productID === ProductsData?.id
              ? { ...item, ...{ metadata: ProductsData } }
              : item
          );
          queryClient.setQueryData(
            keys.cart_data(AuthUser?.uid),
            CartUpdatedData
          );
        }
        return data;
      } else {
        queryClient.setQueryData(keys.cart_data(AuthUser?.uid), data);
        return data;
      }
    },
    [AuthUser]
  );

  return useQuery(
    keys.cart_data(AuthUser?.uid),
    (): Promise<CartMetaItem[]> => getCartProducts(snapshotListener),
    {
      placeholderData: [],
    }
  );
};

export const useOrders = () => {
  const queryClient = useQueryClient();
  const { data: AuthUser } = useAuthUser();
  const snapshotListener = useCallback(
    (data: any) => {
      queryClient.setQueryData(keys.order_data(AuthUser?.uid), data);
      return data;
    },
    [AuthUser]
  );

  return useQuery(
    keys.order_data(AuthUser?.uid),
    (): Promise<OrderDataInterface[]> => getOrders(snapshotListener),
    {
      placeholderData: [],
    }
  );
};

export const useMediaFile = (
  path: any,
  notify_if_not_found: boolean = true,
  dont_look_into_firebase_instead_public_folder: boolean = false
) => {
  const queryClient = useQueryClient();
  const queryKey = ["asset_file", path];
  const snapshotListener = useCallback(
    (data: any) => {
      if (!dont_look_into_firebase_instead_public_folder) {
        return queryClient.setQueryData(queryKey, data);
      } else {
        return queryClient.setQueryData(queryKey, path);
      }
    },
    [queryClient, path]
  );
  return useQuery({
    queryKey: queryKey,
    queryFn: (): Promise<any> =>
      queryToGetAssetFile(
        path,
        snapshotListener,
        dont_look_into_firebase_instead_public_folder
      ).catch((error: any) => {
        if (notify_if_not_found) {
          let ErrorText;
          switch (error.code) {
            case "storage/object-not-found":
              // File doesn't exist
              ErrorText = "No object exists at the desired reference.";
              break;
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              ErrorText =
                "User is not authorized to perform the desired action, check your security rules to ensure they are correct.";
              break;
            case "storage/quota-exceeded":
              ErrorText =
                "Quota on your Cloud Storage bucket has been exceeded. If you're on the no-cost tier, upgrade to a paid plan. If you're on a paid plan, reach out to Firebase support.";
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect the server response
              ErrorText = "Unknow error when accessing storage";
              break;
            default:
              ErrorText = "There was a problem with the storage. ";
              break;
          }
          notify.error(
            {
              text: ErrorText,
            },
            error
          );
        }
      }),
    placeholderData: typeof path === "object" ? [] : "",
  });
};

export const useUserMedia = () => {
  const queryClient = useQueryClient();
  const { data: AuthUser, isFetched: AuthUserIsFetched } = useAuthUser();
  const queryKey = ["user_media", AuthUser?.uid];
  const snapshotListener = useCallback(
    (data: any) => {
      queryClient.setQueryData(queryKey, data);
      return data;
    },
    [AuthUser]
  );
  return useQuery({
    queryKey,
    queryFn: (): Promise<MediaItemInterface[]> =>
      queryAppMedia(snapshotListener, AuthUser?.uid),
    enabled: !!(AuthUserIsFetched && AuthUser?.uid),
  });
};
