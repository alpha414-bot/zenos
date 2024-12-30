import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { createSlug, isURL } from "@/System/function";
import { MediaItemInterface, MediaMetaDataInterface } from "@/Types/Media";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { backend_url } from "../../../package.json";

/**
 * <read>
 * QUERY TO READ FILE FROM STORAGE
 *
 * @param path the relative path to fetch the asset
 * @param listener subsribe to firebase snapshot
 * @param dont_search if true, search won't be run in firebase bucket, but the path would be returned directly
 * @returns
 */
export const queryToGetAssetFile = (
  path: any,
  listener: any,
  width: string = "1280",
  type: string = "images"
): Promise<string | object> =>
  new Promise((resolve, reject) => {
    try {
      if (isURL(path)) {
        resolve(path);
        return path;
      } else if (!!path) {
        return resolve(
          listener(
            `${backend_url}/media/cdn/${type}/${
              isNaN(Number(width)) ? width : `w${width}`
            }/${path}`
          )
        );
      }
    } catch (error) {
      reject(null);
    }
  });

/**
 * <create>
 * QUERY TO CREATE NEW FILES IN STORAGE
 *
 * @param files the files array to be uploaded
 * @param directory the parent directory in the bucket to upload the files
 * @param randomFileName if true random filename is used to store the file
 * @param filename manually specified each filenames to be used if needed
 * @returns promise resolve,reject
 */
export const queryToUploadFiles = (
  files: File[],
  _directory: string = "/uploads",
  randomFileName: boolean = true // system should generate random filename for each files
) =>
  new Promise((resolve, reject) => {
    try {
      const promises = [];
      for (let i = 0; i < files?.length; i++) {
        const file = files[i];
        promises.push(
          new Promise((resolve, reject) => {
            const formdata = new FormData();
            formdata.append("file", file);
            formdata.append(
              "random_filename",
              randomFileName ? "True" : "False"
            );
            fetch(`${backend_url}/media/upload-image/`, {
              method: "POST",
              body: formdata,
              redirect: "follow",
            })
              .then(async (snap) => {
                const snapshot: MediaMetaDataInterface = await snap.json();
                const slug = createSlug(snapshot?.name);
                const MediaCollection = collection(firestore, "Media");
                const q = query(MediaCollection, where("slug", "==", slug));
                getDocs(q).then((snap) => {
                  if (snap.empty && snap.size == 0) {
                    // prevent duplicate entry of the same file again after upload to storage
                    addDoc(MediaCollection, {
                      slug: slug,
                      reuploadAttempt: 1,
                      createdAt: Timestamp.now(),
                      media: JSON.parse(JSON.stringify({ ...snapshot })),
                      useruid: auth.currentUser?.uid || "app",
                    })
                      .then((data) => {
                        resolve(data);
                        notify.success({
                          text:
                            files.length == 1
                              ? "File is uploaded successfully."
                              : "Files are uploaded successfully.",
                        });
                      })
                      .catch((err) => {
                        reject(err);
                        notify.error(
                          {
                            text: "File has been uploaded successfully, but there was a problem with storing the media to datastore.",
                          },
                          err
                        );
                      });
                  } else {
                    // const ReferenceDoc = doc(firestore, snap.docs[0]);
                    const ReferenceDoc = doc(MediaCollection, snap.docs[0].id);
                    updateDoc(ReferenceDoc, {
                      // updatedAt: Timestamp.now(),
                      reuploadAttempt:
                        (snap.docs[0].data().reuploadAttempt || 0) + 1,
                    })
                      .then(() => {
                        resolve({
                          ...{
                            path: snapshot?.name,
                            id: ReferenceDoc.id,
                          },
                        });
                        notify.success({
                          text: "File already exists, Records has been updated successfully.",
                        });
                      })
                      .catch((err) => {
                        reject(err);
                        notify.error(
                          {
                            text: "File exists!. There was issue with updating files record.",
                          },
                          err
                        );
                      });
                  }
                });
              })
              .catch((error) => {
                reject(error);
                notify.error(
                  {
                    text: `There was an error while resolving final upload. Please check with firebase/storage.<br/>${JSON.stringify(
                      error
                    )}`,
                  },
                  error
                );
              });
          })
        );
      }

      Promise.all(promises)
        .then(resolve)
        .catch((err) => {
          reject(err);
          notify.error(
            {
              text: `There was a problem while uploading to storage. <br/> ${JSON.stringify(
                err
              )}`,
            },
            err
          );
        });
    } catch (error) {
      reject(error);

      notify.error({
        text: `There was a trycatch error while uploading files. <br/> ${JSON.stringify(
          error
        )}`,
      });
    }
  });

//
export const queryToDeleteFiles = (path: string) =>
  new Promise((resolve, reject) => {
    try {
      // delete from firestore collection first, and then proceed to deleting from storage
      const MediaCollection = collection(firestore, "Media");
      console.log("path is", path);
      const QueryForFile = query(
        MediaCollection,
        where("media.name", "==", path),
        limit(1)
      );
      getDocs(QueryForFile).then((snapFile) => {
        if (!snapFile.empty) {
          const MediaFileRef = snapFile.docs[0].ref;
          const { media } = snapFile.docs[0].data() as MediaItemInterface;
          // Now delete from backend server
          console.log("media file is", media);
          deleteDoc(MediaFileRef)
            .then(() => {
              const headers = new Headers();
              headers.append("Content-Type", "application/json");
              fetch(`${backend_url}/media/delete?`, {
                method: "DELETE",
                body: JSON.stringify({
                  filename: media.name,
                  directory: media.directory,
                }),
                headers,
                redirect: "follow",
              }).then(async (resp) => {
                console.log("delete request", await resp.json());
                resolve(resp.json());
                notify.success({
                  text: "File has been deleted successfully.",
                });
              });
            })
            .catch((err) => {
              console.log(
                "There was a severe issue while delete file. Please contact administrator",
                err,
                err.code
              );
            });
        }
      });
    } catch (error) {
      reject(error);
      notify.error({
        text: "Try/catch error while deleting the file. Please try again later.",
      });
    }
  });

/**
 * <read>
 * QUERY TO READ USER MEDIA ASSETS
 *
 * @param listener subscribe to firebase snapshot
 * @param user_uid the id of the authenticated user
 * @returns promise return MediaItemInterface[]
 */
export const queryUserMedias = (
  listener: any,
  user_uid?: string
): Promise<MediaItemInterface[]> =>
  new Promise((resolve, reject) => {
    try {
      if (user_uid) {
        const MediaCollection = query(
          collection(firestore, "Media"),
          where("useruid", "==", user_uid),
          orderBy("createdAt", "desc")
        );
        return onSnapshot(
          MediaCollection,
          async (snap) => {
            const MedidaDocs = snap.docs.map((item) => ({
              ...item.data(),
              ...{ id: item.id },
            }));
            resolve(listener(MedidaDocs || []));
          },
          (err) => {
            reject(err);
          }
        );
      }
      return resolve([]);
    } catch (error) {
      notify.error({
        text: "There was a try/catch error while querying user media",
      });
    }
  });
