import { firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

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

export const updateCollectionDoc = (
  CollectionName: any,
  DocReference: any,
  data: ProductItemType,
  successMessage?: string
) =>
  new Promise((resolve, reject) => {
    try {
      const ProductCollection = collection(firestore, CollectionName);
      const ProductDoc = doc(ProductCollection, DocReference);
      const DataObject = {
        ...data,
        ...{
          updatedAt: new Date(),
        },
      };
      setDoc(ProductDoc, DataObject)
        .then((data) => {
          notify.success({
            text: successMessage || `${CollectionName} successfully updated.`,
          });
          resolve(data);
        })
        .catch((error) => {
          notify.error({
            title: "Error",
            text: "[Error &fjH]: Error while updating doc in collection. <br/>Contact administrator",
          });
          reject(error);
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
