# Unit Test in Firebase Functions with Jest and Typescript

###  First Create Firebase project function inside a folder(sample name: example) with:
```sh
firebase init
```
Select Cloud Function
Select Typescript
And install dependencies

before have folder structure:
```
example
    functions
        src
            index.ts
        .eslintrc.js
        .package.json
        tsconfig.dev.json
        tsconfig.json
    .firebaserc
    firebase.json
```
### Configure Unit Test in Firebase Functions with Jest and Typescript
1. Install packages (into folder functions)
    Console in path: .../path/example/functions
    ```
    npm install --save-dev jest @types/jest ts-jest firebase-functions-test
    ```
2. Initialize Jest (into folder functions)
    Console in path: .../path/example/functions
    ```
    npx ts-jest config:init
    ```
    You can see that the jest.config.js file is added in the path example/functions/jest.config.js
3. Add the following script to the package.json file
    ```
    "test": "jest --watchAll"
    ```
4. To the functions file: example/functions/src/index.ts copy the following code:
    ```
    import * as functions from "firebase-functions";
    import {initializeApp} from "firebase-admin";

    initializeApp();

    export const firstFunctionHttp = functions.https.onRequest((req, res) => {
      res.send("ok");
    });
    ```
    We have written our first cloud function of type http
4. Create the following structure and file. Here will be the tests.
    ```
    path/example/functions/src/test/index.test.ts
    ```
5. In file path/example/functions/src/test/index.test.ts write first test.
    ```
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
    ```
6. Execute test
    ```
        npm run test
    ```
