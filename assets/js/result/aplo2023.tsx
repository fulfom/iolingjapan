import { app, auth, db } from "../firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp } from "firebase/database"
import React from 'react'
import { createRoot } from 'react-dom/client';

auth.onAuthStateChanged(async (user) => {
    if (user) {
        const snapshot = await get(ref(db, "/contests/aplo2023/results/" + user.uid));
        const val = snapshot.val();
        if (val) {
            createRoot(document.getElementById("app")).render(
                <table className="table" style={{ maxWidth: "500px" }}>
                    <thead>
                        <tr>
                            {["順位", "合計", "問題1", "問題2", "問題3", "問題4", "問題5"].map((v) => (<th key={v}>{v}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{val.rank || "loading"}</td>
                            {val.sums && val.sums.length > 0 ? val.sums.map((v, i) => (<td key={i}>{v}</td>)) : <></>}
                        </tr>
                    </tbody>
                </table>
            )
        }
        else {
            location.href = "/account/"
        }
    }
    else {
        location.href = "/login/"
    }
})