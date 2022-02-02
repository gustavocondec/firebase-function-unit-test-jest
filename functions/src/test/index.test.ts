/* First before anything else import 'firebase-functions-test'
 and before initialize it offline or online.*/
import * as firebaseFunctionsTest from "firebase-functions-test";
// We start FirebaseFunctionsTest offline
firebaseFunctionsTest();

/*
Then we import the file that initializes the Cloud Functions
(example/functions/src/index.ts) since it has the InitializeApp
of 'firebase-admin' inside it.
If it is in another location, import it.
*/
import {firstFunctionHttp} from "../index";


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
