import { app, auth, db, logout } from "./firebase-initialize"
import { browserLocalPersistence, browserSessionPersistence, EmailAuthProvider, GoogleAuthProvider, indexedDBLocalPersistence, initializeAuth, onAuthStateChanged, signInWithCredential } from "firebase/auth"

/** @type { import("@types/google.accounts") } */
import type * as firebaseui from 'firebaseui';

onAuthStateChanged(auth, (user) => {
    if (user) {
        location.replace("/account/");
    }
    else {
        document.getElementsByTagName('body')!.item(0)!.style.opacity = "1";
    }
});

document.getElementById("google-auth2")

function handleCredentialResponse(response) {
    // Build Firebase credential with the Google ID token.
    const idToken = response.credential;
    const credential = GoogleAuthProvider.credential(idToken);

    // Sign in with credential from the Google user.
    signInWithCredential(auth, credential).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The credential that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "205884223458-frt3fbbpoo5hhd87h49dq0q3hirtfjen.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        ux_mode: "popup",
    });
    google.accounts.id.renderButton(
        document.getElementById("google-auth2")!,
        { theme: "outline", size: "large", type: "standard" }  // customization attributes
    );
    // google.accounts.id.prompt(); // also display the One Tap dialog
}

// Initialize the FirebaseUI Widget using Firebase.
// @ts-ignore
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
