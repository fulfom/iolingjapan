import QAAdmin from "@js/components/QAAdmin"
import { auth, db } from "@js/firebase-initialize"
import { onAuthStateChanged } from "firebase/auth"
import { onValue, ref } from "firebase/database"
import React, { } from "react"
import { createRoot } from "react-dom/client"

document.addEventListener("DOMContentLoaded", (event) => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            location.replace("/");
            return;
        }
        onValue(ref(db, `admin/${user.uid}`), (snapshot) => {
            if (!snapshot.exists() || !snapshot.val()) {
                location.replace("/");
                return;
            }
            createRoot(document.getElementById("app")!).render(
                <div>
                    <div>Account: {user.email}</div>
                    <div>Verified: True</div>
                    <QAAdmin contId="jol2024" site="demo"></QAAdmin>
                </div>
            )
        }, {
            onlyOnce: true
        })
    })
});