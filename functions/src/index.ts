import * as functions from "firebase-functions";
import {firestore, initializeApp} from "firebase-admin";

initializeApp();

export const firstFunctionHttp = functions.https.onRequest((req, res) => {
  res.send("ok");
});

export const onCreateUsers = functions.firestore.document("users/{userId}")
    .onCreate(async (snapshot, context) => {
    // return snapshot.ref.update({createdDate: new Date()});
      await firestore().doc("users/" + snapshot.id)
          .update({createdDate: new Date});
    });

export const onUpdateUser = functions.firestore.document("users/{userId")
    .onUpdate(async (change, context) => {
      await change.after.ref.update({updatedDate: new Date()});
    });

export const readUser = async () => {
  const data = await firestore().doc("users/567").get();
  data;
  return {prueba: 123};
};

