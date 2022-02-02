import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin";

initializeApp();

export const firstFunctionHttp = functions.https.onRequest((req, res) => {
  res.send("ok");
});


