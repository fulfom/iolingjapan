import { initializeApp } from "firebase/app";
import { initializeAnalytics } from "firebase/analytics";
import { browserLocalPersistence, browserSessionPersistence, EmailAuthProvider, GoogleAuthProvider, indexedDBLocalPersistence, initializeAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase } from "firebase/database";
import * as firebaseui from 'firebaseui';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB3UbePjjc0Q5-G6uYnWntG9mdKQBL9d6w",
    authDomain: process.env.HUGO_AUTH_DOMAIN,
    databaseURL: "https://application-ef043.firebaseio.com",
    projectId: "application-ef043",
    storageBucket: "application-ef043.appspot.com",
    messagingSenderId: "205884223458",
    appId: "1:205884223458:web:38aa6379161011c78e13bb",
    measurementId: "G-835927SH9F"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = initializeAnalytics(app);
export const auth = initializeAuth(app, {
    persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence
    ],
});
export const db = getDatabase(app)

const navbarlogin = document.getElementById("navbarlogin");
if (navbarlogin) {
    navbarlogin.addEventListener("click", (e) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in.
                // ...
                location.href = "/account/";

            } else {
                // User is signed out.
                // ...
                location.href = "/login/";
            }
        });
    })
}

export const logout = () => {
    onAuthStateChanged(auth, (user) => {
        auth.signOut().then(() => {
            console.log("ログアウトしました");
        })
            .catch((error) => {
                console.log(`ログアウト時にエラーが発生しました (${error})`);
            });
    });
}

// console.log(document.getElementById("firebaseui-auth-container"), document.getElementById("firebaseui-auth-container") !== null)
if (document.getElementById("firebaseui-auth-container") !== null) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            location.href = "/account/"
        }
        else {
            document.getElementsByTagName('body')!.item(0)!.style.opacity = "1";
        }
    });
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(auth);

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {

                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.

                return true;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader')!.style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'redirect',
        signInSuccessUrl: '/account/',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            GoogleAuthProvider.PROVIDER_ID,
            {
                provider: EmailAuthProvider.PROVIDER_ID,
                signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
                requireDisplayName: false
            }
        ],
        // Terms of service url.
        tosUrl: '/term-of-service/',
        // Privacy policy url.
        privacyPolicyUrl: '/privacy-policy/'
    };

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}