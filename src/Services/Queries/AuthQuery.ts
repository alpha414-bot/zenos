import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { ErrorFilter } from "@/System/function";
import { AuthUserType } from "@/Types/Auth";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  AuthError
  
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

// Interface definitions
interface UserSignInFormInput {
  email?: string;
  phone?: string;
  password: string;
  admin?: boolean;
}

interface UserSignUpFormInput {
  email?: string;
  phone: string;
  password: string;
  username: string;
}

/**
 * <read>
 * QUERY TO READ USER DATA
 *
 * @param user_uid the id of the authenticated user
 * @returns promise returns UserMetaDataInterface
 */
export const queryToGetUserData = (user: AuthUserType): Promise<AuthUserType> =>
  new Promise((resolve, reject) => {
    try {
      if (user?.uid) {
        if (user?.isAnonymous) {
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
          where("uid", "==", user?.uid),
          limit(1)
        );
        getDocs(UserCollectionQuery)
          .then((user_firestore) => {
            if (user_firestore.docs.length > 0) {
              const data: AuthUserType = user_firestore.docs[0].data();
              resolve({
                ...user,
                ...data,
              });
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

const generateEmailFromPhone = (phone: string | undefined): string => {
  if (!phone) {
    throw new Error('Phone number is required');
  }
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `user.${cleanPhone}@generated.app`;
};

/**
 * Query to create new user in app
 * @param payload UserSignUpFormInput
 * @param admin boolean to determine if user is an admin or not
 */
export const queryToRegisterUser = (
  payload: UserSignUpFormInput,
  admin: boolean = false
) =>
  new Promise((resolve, reject) => {
    try {
      if (!payload.phone && !payload.email) {
        throw new Error('Either phone or email is required');
      }

      if (admin && !payload.email) {
        throw new Error('Email is required for admin registration');
      }

      if (admin) {
        if (!payload.email) {
          throw new Error('Email is required for admin registration');
        }
        createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        )
          .then((user) => {
            const UsersCollection = collection(firestore, "Users");
            const { user: currentUser } = user;
            const UserDoc = doc(UsersCollection, currentUser.uid);
            const { password, ...payloadWithoutPassword } = payload;
            setDoc(
              UserDoc,
              JSON.parse(
                JSON.stringify({
                  ...payloadWithoutPassword,
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
                  text: "Admin has been registered successfully.",
                });
              })
              .catch(err => {
                queryToLogout(true);
                reject(err);
                notify.error(
                  {
                    text: "There was a problem with registering admin. Please contact administrator.",
                  },
                  err
                );
              });
          })
          .catch((error) => {
            notify.error({ text: ErrorFilter(error) });
            reject(error);
          });
      } else {
        const generatedEmail = generateEmailFromPhone(payload.phone);
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        
        const Credential = EmailAuthProvider.credential(
          generatedEmail,
          payload.password
        );
        
        linkWithCredential(currentUser, Credential)
          .then((newuser) => {
            notify.success({
              text: "Your account has successfully being created",
            });
            const UsersCollection = collection(firestore, "Users");
            const { user: currentUser } = newuser;
            const UserDoc = doc(UsersCollection, currentUser.uid);
            const { password, ...payloadWithoutPassword } = payload;
            setDoc(
              UserDoc,
              JSON.parse(
                JSON.stringify({
                  ...payloadWithoutPassword,
                  email: generatedEmail,
                  admin: false,
                  uid: currentUser.uid,
                  displayName: payload.username,
                  isAnonymous: currentUser.isAnonymous,
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
                } as AuthUserType)
              )
            ).catch(() => {
              notify.error({
                text: `Account is created successfully, but there was problem with updating user profile. Contact administrator`,
              });
            });
            resolve(newuser);
          })
          .catch((error) => {
            notify.error({ text: ErrorFilter(error) });
            reject(error);
          });
      }
    } catch (error) {
      console.error(error);
      notify.error({
        text: "Unable to create user. Check console log",
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
      
      if (payload.admin && !payload.email) {
        throw new Error('Email is required for admin login');
      }
      if (!payload.admin && !payload.phone) {
        throw new Error('Phone number is required for user login');
      }

      const QueryForUser = payload.admin 
        ? query(
            UsersCollection,
            where("admin", "==", true),
            where("email", "==", payload.email)
          )
        : query(
            UsersCollection,
            where("admin", "==", false),
            where("phone", "==", payload.phone)
          );

      getDocs(QueryForUser).then((user) => {
        if (user.docs.length > 0) {
          const loginEmail = payload.admin 
            ? payload.email! 
            : generateEmailFromPhone(payload.phone);

          signInWithEmailAndPassword(
            auth,
            loginEmail,
            payload.password
          )
            .then((user) => {
              notify.success({
                text: "Signed in successfully.",
              });
              resolve(user);
            })
            .catch((error: AuthError) => {  // Updated error type
              notify.error({ text: ErrorFilter(error) });
              reject(error);
            });
        } else {
          notify.error({
            text: "Authentication failed! Please try again later",
          });
        }
      });
    } catch (error) {
      const authError = error as AuthError;  // Type assertion for the catch block
      notify.error({
        title: "Error",
        text: "An error occurred during login. Please try again.",
      });
      reject(authError);
    }
  });


export const queryToVerifyAccount = () =>
  new Promise((resolve, reject) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      sendEmailVerification(currentUser)
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