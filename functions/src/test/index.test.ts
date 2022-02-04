import * as path from "path";
/* First before anything else import 'firebase-functions-test'
 and before initialize it offline or online.*/
import * as firebaseFunctionsTest from "firebase-functions-test";

// ------------------MODE OFFLINE---------
// this mode not write in firestore or rtdb products, not conect with cloud
// Optionally could be connected whit local firestore emulator
// process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
// const fireTest = firebaseFunctionsTest()

// ------------------end config mode OFFLINE-------------

// -------------------------------------- MODE ONLINE-------------------------
// We start FirebaseFunctionsTest online (Mode recommended and easy) this affect Firestore , RTDB, and other products, use whit precaution!!!!!
const fireTest = firebaseFunctionsTest({ // data from firebase config
  databaseURL: "YOUR_URL",
  projectId: "YOUR",
  storageBucket: "YOUR",
}, path.join(__dirname, "google-key.json")); // Link to file key get from
// firebase>config>account service> sdk of fire admin > generate new private kesy, donwload and save safe. NOT SHARE FILE.
// --------------------- end config mode online--------------

/*
Then we import the file that initializes the Cloud Functions
(example/functions/src/index.ts) since it has the InitializeApp
of 'firebase-admin' inside it.
If it is in another location, import it.
*/
import {firstFunctionHttp, onCreateUsers, onUpdateUser, readUser} from "../index";
import {firestore} from "firebase-admin";

describe("Mi first Test Cloud Function with Jest and Typescript", () => {
  test("Call the function fistFunctionHttp must return \"ok\"", () => {
    const req = {} as any;

    const res = {
      send: (payload: any) => {
        expect(payload).toBe("ok");
      },
    } as any;

    firstFunctionHttp(req, res);
  });
});

describe("Test firestore path/Users", () => {
  const pathUser = "users/1234";

  // Create the document of test
  beforeAll(async () => {
    await firestore().doc(pathUser).set({
      name: "Hola",
    });
  });
  // delete document of the test
  afterAll(async () => {
    await firestore().doc(pathUser).delete({exists: true});
  });
  test("call function user return objt with field prueba", async () => {
    const ret = await readUser();
    expect(typeof ret == "object").toBe(true);
    expect(ret).toHaveProperty("prueba");
  });

  test("When create a new User add field \"createdDate\" whit date actual",
      async () => {
        const wrapped = fireTest.wrap(onCreateUsers);
        const snap = fireTest.firestore.makeDocumentSnapshot({
          prueba: "no debe estar vacio",
        }, pathUser);
        await wrapped(snap);
        const {createdDate} = (await firestore().doc(pathUser).get()).data() as { createdDate: firestore.Timestamp };
        const dateNow = new Date();
        // created recent
        expect(dateNow.getTime() - createdDate.toDate().getTime()).toBeLessThanOrEqual(10000);
      });

  test("When update user set updatedDate with time now", async () => {
    const beforeSnap = fireTest.firestore.makeDocumentSnapshot({name: "Gustavo"}, pathUser);
    const afterSnap = fireTest.firestore.makeDocumentSnapshot({name: "Gustavo Condezo"}, pathUser);
    const change = fireTest.makeChange(beforeSnap, afterSnap);

    const wrapped = fireTest.wrap(onUpdateUser);

    await wrapped(change);

    const userDateNow = (await firestore().doc(pathUser).get()).get("updatedDate");
    const dateNow = new Date();
    expect(dateNow.getTime() - userDateNow.toDate().getTime()).toBeLessThanOrEqual(10000);
  });
});
