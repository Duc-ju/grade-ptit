import firebase, { db } from "./config";

export const addDocument = (collection: string, data: any) => {
  const query = db.collection(collection);
  return query.add({
    ...data,
    createAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const getFileCount = async (userId: string) => {
  let size = 1000;
  await db
    .collection("files")
    .where("uid", "==", userId)
    .get()
    .then((snapshot) => {
      size = snapshot.size;
    });
  return size;
};
