import { firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { AuthUserType } from "@/Types/Auth";
import { User } from "firebase/auth";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

/**
 * <read>
 * QUERY TO READ USER DATA
 *
 * @param user_uid the id of the authenticated user
 * @returns promise returns UserMetaDataInterface
 */
export const queryToGetUserData = (
  user: User,
  anonymously: boolean = false
): Promise<AuthUserType> =>
  new Promise((resolve, reject) => {
    try {
      if (anonymously) {
        return resolve({
          ...user,
          ...{
            role: "guest",
            admin: false,
          },
        });
      }
      const UserCollectionQuery = query(
        collection(firestore, "Users"),
        where("uid", "==", user.uid),
        limit(1)
      );
      getDocs(UserCollectionQuery)
        .then((user_firestore) => {
          if (user_firestore.docs.length > 0) {
            resolve(user_firestore.docs[0].data() as AuthUserType);
          }
        })
        .catch((err) => {
          reject(err);
          notify.error({
            text: "There was issue while fetching user metadata. Please contact administrator",
          });
        });
    } catch (error) {
      reject(error);
      notify.error({
        text: "There was a try/catch error when fetching user metadata",
      });
    }
  });
