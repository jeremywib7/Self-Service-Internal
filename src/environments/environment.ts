    // This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // apiBaseUrl: 'https://selfserviceonline.herokuapp.com',
    apiBaseUrl: 'http://localhost:8080',
    project: 'selfservice',
    accessToken: '1234',

    firebase: {
        apiKey: "AIzaSyDCiCWjf3tms077CnqgiP0zWhFqQjzLdRc",
        authDomain: "self-service-4820d.firebaseapp.com",
        databaseURL: "https://self-service-4820d-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "self-service-4820d",
        storageBucket: "self-service-4820d.appspot.com",
        messagingSenderId: "602646727662",
        appId: "1:602646727662:web:a323db94f3dea8e9e49cff",
        measurementId: "G-Q3EQ96CHJP"
    }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
