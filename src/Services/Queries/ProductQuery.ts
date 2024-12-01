import { firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { collection, deleteDoc, doc } from "firebase/firestore";

export const queryToDeleteProduct = (id?: string) =>
  new Promise((resolve, reject) => {
    try {
      const ProductCollection = collection(firestore, "Products");
      const ProductDoc = doc(ProductCollection, id);
      deleteDoc(ProductDoc)
        .then((data) => {
          resolve(data);
          notify.success({ text: "Product deleted successfully" });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
          notify.error({
            text: "System was unable to proceed with deleting product",
          });
        });
    } catch (error) {
      console.log(error);
      reject(error);
      notify.error({
        text: "There was try/catch error while removing products",
      });
    }
  });
