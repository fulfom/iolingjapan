import { initializeApp } from "firebase/app";
import { initializeAnalytics } from "firebase/analytics";
import { browserLocalPersistence, browserSessionPersistence, EmailAuthProvider, GoogleAuthProvider, indexedDBLocalPersistence, initializeAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB3UbePjjc0Q5-G6uYnWntG9mdKQBL9d6w",
    authDomain: "auth.iolingjapan.org",
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
