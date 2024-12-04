import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { ErrorFilter } from "@/System/function";
import { AuthUserType } from "@/Types/Auth";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { QueryClient } from "./QueryClient";

/**
 * <read>
 * QUERY TO READ USER DATA
 *
 * @param user_uid the id of the authenticated user
 * @returns promise returns UserMetaDataInterface
 */
export const queryToGetUserData = (
  user: AuthUserType,
  type?: "admin" | "user"
): Promise<AuthUserType> =>
  new Promise((resolve, reject) => {
    try {
      if (user?.uid) {
        if (user?.isAnonymous) {
          if (type == "user") {
            return resolve({
              ...user,
              ...{
                role: "guest",
                admin: false,
              },
            });
          } else if (type == "admin") {
            return resolve({});
          }
        }
        const UserCollectionQuery = query(
          collection(firestore, "Users"),
          where("uid", "==", user?.uid),
          limit(1)
        );
        console.log(type);
        getDocs(UserCollectionQuery)
          .then((user_firestore) => {
            if (user_firestore.docs.length > 0) {
              const data: AuthUserType = user_firestore.docs[0].data();
              if (type == "admin" && !!data.admin) {
                resolve({
                  ...user,
                  ...data,
                });
              } else if (type == "user" && !data.admin) {
                resolve({
                  ...user,
                  ...data,
                });
              } else {
                resolve(null);
              }
            }
          })
          .catch((err) => {
            reject(err);
            notify.error({
              text: "There was issue while fetching user metadata. Please contact administrator",
            });
          });
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
      notify.error({
        text: "There was a try/catch error when fetching user metadata",
      });
    }
  });

/**
 * Query to create new user in app
 *
 * @param payload UserSignUpFormINput
 * @param admin boolean to instance to determine if user is an admin or not
 * @returns
 */
export const queryToRegisterUser = (
  payload: UserSignUpFormInput,
  admin: boolean = false
) =>
  new Promise((resolve, reject) => {
    try {
      if (admin) {
        // if create instance is an administrator
        createUserWithEmailAndPassword(
          auth,
          payload.email as string,
          payload.password as string
        )
          .then((user) => {
            const UsersCollection = collection(firestore, "Users");
            const { user: currentUser } = user;
            const UserDoc = doc(UsersCollection, currentUser.uid);
            setDoc(
              UserDoc,
              JSON.parse(
                JSON.stringify({
                  ...payload,
                  admin: admin,
                  uid: currentUser.uid,
                  displayName: payload.username,
                  isAnonymous: currentUser.isAnonymous,
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
                } as AuthUserType)
              )
            )
              .then((res) => {
                queryToLogout(true);
                resolve(res);
                notify.success({
                  text: `${
                    admin ? "Admin" : "User"
                  } has been registered successfully.`,
                });
              })
              .catch((err) => {
                queryToLogout(true);
                reject(err);
                notify.error(
                  {
                    text: "There was a problem with registering. Please contact administrator.",
                  },
                  err
                );
              });
          })
          .catch((error) => {
            notify.error({ text: ErrorFilter(error) });
            reject(error);
          });
      }
    } catch (error) {
      console.log(error);
      notify.error({
        text: "Unable to create administrator use. Check console log",
      });
      reject(error);
    }
  });

/**
 * Query to login user and administrator to dashboard
 * @param payload UserSignInFormInput
 */
export const queryToLoginUser = (payload: UserSignInFormInput) =>
  new Promise((resolve, reject) => {
    try {
      const UsersCollection = collection(firestore, "Users");
      const QueryForUser = query(
        UsersCollection,
        where("admin", "==", payload.admin || false),
        where("email", "==", payload.email)
      );
      getDocs(QueryForUser).then((user) => {
        if (user.docs.length > 0) {
          // There is such user or such administrator
          signInWithEmailAndPassword(
            auth,
            payload.email as string,
            payload.password as string
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
        } else {
          notify.error({ text: "User not found!" });
        }
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

export const queryToVerifyAccount = () =>
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

/**
 * QUERY TO LOGOUT FROM ACCOUNT.
 *
 * @param dontinform if true, there won't be a notification display for the user
 * @returns promise resolve,reject
 */
export const queryToLogout = (dontinform: boolean = false) =>
  new Promise((resolve, reject) => {
    try {
      signOut(auth)
        .then((res) => {
          if (!dontinform) {
            notify.success({ text: "You have successfully being logged out." });
          }
          QueryClient.setQueryData(["auth_user"], null);
          QueryClient.setQueryData(["auth_admin"], null);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
          notify.error({
            text: `[Error @llg]: There was a problem with logging you out. <br/>${JSON.stringify(
              error
            )} <br/> Contact administrator`,
          });
        });
    } catch (error) {
      reject(error);
      notify.error({
        text: `[Error #kan]: try/catch: ${JSON.stringify(
          error
        )}. <br/>Contact administrator.`,
      });
    }
  });
