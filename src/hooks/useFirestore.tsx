import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import OrderByDirection = firebase.firestore.OrderByDirection;

const useFirestore = (
  collection: string,
  condition:
    | null
    | undefined
    | { fieldName: string; operator: WhereFilterOp; compareValue: string },
  mode: OrderByDirection | undefined
) => {
  const [documents, setDocuments] = useState<any>([]);
  useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createAt", mode);
    if (
      condition &&
      condition.compareValue &&
      condition.compareValue.length > 0
    ) {
      collectionRef = collectionRef.where(
        condition.fieldName,
        condition.operator,
        condition.compareValue
      );
    }

    const unsubcribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocuments(documents);
    });
    return unsubcribe;
  }, [collection, condition, mode]);
  return documents;
};
export default useFirestore;
