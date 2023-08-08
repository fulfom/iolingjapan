import { app, auth, db, logout } from "./firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"

const ELEM_alert = document.getElementById("alert");
const ELEM_info = document.getElementById("info");
const USER_EMAILs = document.getElementsByClassName('user-email') as HTMLCollectionOf<HTMLElement>;

document.getElementById("logout1")!.addEventListener("click", () => {
    logout();
})
document.getElementById("logout2")!.addEventListener("click", () => {
    logout();
})

document.addEventListener("DOMContentLoaded", (event) => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            for (let i = 0; i < USER_EMAILs.length; i++) {
                USER_EMAILs[i].innerText = user.email || "";
            }

            // if (ELEM_alert) {
            //     // コンテスト直前は支払済みでないアカウントにはアラートを出す
            //     const paid = await get(ref(db, '/orders/jol2023/' + user.email!.replace(/\./g, '=').toLowerCase()));
            //     if (!paid.val()) {
            //         ELEM_alert.style.display = "block";
            //         ELEM_info!.style.display = "none";
            //     }
            // }

            const contests = document.getElementsByClassName("appSys-contest");
            let toberemoved: Element[] = [];
            const promiseBadge = (async () => {
                const snapshot = await get(ref(db, "/badges/" + user.uid))
                const badges = snapshot.val();
                for (let j = 0; j < contests.length; j++) {
                    const cont = contests[j];
                    const badge = cont.getAttribute("data-visible-badge");
                    const eq = cont.getAttribute("data-visible-eq");

                    // const isvisible = badge ? eq ? badges[badge] == eq : badges[badge] : true;
                    let isvisible = true;
                    if (badge) {
                        if (badges) {
                            if (eq) {
                                isvisible = badges[badge] && badges[badge] == eq;
                            }
                            else {
                                isvisible = badges[badge];
                            }
                        }
                        else {
                            isvisible = false;
                        }
                    }
                    if (isvisible) {
                    }
                    else toberemoved.push(cont);
                }
            })();
            const promiseUser = (async () => {
                const snapshot = await get(ref(db, "/users/" + user.uid));
                let isnewuser = true;
                if (snapshot.val()) {
                    const val = snapshot.val();
                    if (val.admin) {
                        toberemoved.splice(0);
                        const adminRef = await get(ref(db, "/admin/" + user.uid));
                        if (adminRef.val()) {
                            isnewuser = false;
                            const a = document.createElement("a");
                            a.href = "/admin-portal/";
                            a.innerText = "管理者ポータル";
                            a.classList.add("btn", "btn-info", "btn-small");
                            const refNode = document.querySelector("#content section");
                            refNode!.parentNode!.insertBefore(a, refNode);
                        }
                        else await update(ref(db, "/users/" + user.uid), { admin: false });
                    }
                    else {
                        for (let j = 0; j < contests.length; j++) {
                            const cont = contests[j];
                            const spot = cont.getAttribute("data-visible-spot");

                            const isvisible = val.spot ? spot ? spot == val.spot : true : true;
                            if (isvisible) {
                            }
                            else toberemoved.push(cont);
                        }
                    }
                    // if(val.entry == "jol2022"){
                    //     isnewuser = false;
                    // }
                    // else if(val.entry == "mainmenu2022"){
                    //     isnewuser = false;
                    // }
                }
                else {
                    await set(ref(db, "/users/" + user.uid), {
                        email: user.email
                    });
                }
                // if(isnewuser) location.href = "/entry/jol2022/";
            })();

            await Promise.all([promiseBadge, promiseUser]).catch((e) => {
                console.error(e);
                alert("エラー");
            });
            toberemoved.forEach((cont) => { cont.remove() });
            let flag = true;
            for (let j = 0; j < contests.length; j++) {
                const cont = contests[j];
                if (cont.getAttribute("data-status") == "entryopen") {
                    const contId = cont.getAttribute("data-id");
                    const snapshot2 = await get(ref(db, "/contests/" + contId + "/users/" + user.uid));
                    const contestantInfo = snapshot2.val();
                    if (contestantInfo && contestantInfo.entry) {
                        document.getElementById("entried-" + contId)!.style.display = "block";
                    }
                    else if (contestantInfo && contestantInfo.isNotNew) {
                        document.getElementById("entryopen-" + contId)!.style.display = "block";
                    }
                    else {
                        flag = false;
                        location.href = "/entry/" + contId;
                    }
                }
            }
            if (flag) document.getElementsByTagName("body").item(0)!.style.opacity = "1";
        }
        else {
            location.href = "/login/"
        }
    });
});
