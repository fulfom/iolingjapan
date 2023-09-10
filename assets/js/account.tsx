import { app, auth, db, logout } from "./firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import CONTESTS_DATA from "../data/contests.json";
import { User } from "firebase/auth";

const FEATURES_CONFIG = [
    {
        weight: 1,
        name: "大会",
        id: "features-contests",
        icon: "puzzle-piece",
        link: "#contests",
    },
    {
        weight: 2,
        name: "結果",
        id: "features-results",
        icon: "trophy",
        link: "#results",
    }
]

type contestConfigType = {
    id: string;
    title: string;
    desc1?: string;
    date?: string;
    desc2?: string;
    detail?: string;
    entry?: string;
    entryui?: string;
    limited?: boolean;
    result?: string;
    record?: string;
    site?: string;
    status: string;
    visible?: {
        badge?: string;
        spot?: string;
    };
};

const statusButton = (config: contestConfigType, isEntried?: boolean) => {
    switch (config.status) {
        case "pre":
            return <button disabled className="btn btn-outline-dark float-end">{config.limited ? <><i className="fas fa-flag fa-fw"></i>要選抜</> : <>開催予定</>}</button>
        case "entryopen":
            return !isEntried ?
                <><a href={config.entry} className="btn btn-primary float-end" role="button"><i className="fas fa-file-alt fa-fw"></i>応募</a></> :
                <><button disabled className="btn btn-outline-success float-end"><i className="fas fa-check-circle fa-fw"></i>応募済</button></>
        case "siteopen":
            return <a href={config.site} className="btn btn-primary float-end" role="button"><i className="fas fa-puzzle-piece fa-fw"></i>競技会場</a>
        case "marking":
            return <button disabled className="btn btn-outline-dark float-end">採点中</button>
        case "resultopen":
            return <a href={config.result} className="btn btn-info float-end" role="button"><i className="fas fa-trophy fa-fw"></i>結果公開</a>
        default:
            break;
    }
}

const logoutButton = <button onClick={logout} className="btn btn-danger btn-small mt-5">ログアウト</button>

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [badges, setBadges] = useState<any>({});
    const [userInfo, setUserInfo] = useState<any>({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [paid, setPaid] = useState(false);
    const [contUserInfo, setContUserInfo] = useState<any>({})

    const contest = (config: contestConfigType, isEntried: boolean = false) => {
        const configBadge = config.visible?.badge;
        const configSpot = config.visible?.spot;

        const isVisible = userInfo.admin ? true : (configBadge ? badges[configBadge] : true) && (configSpot ? userInfo.spot === configSpot : true)

        return isVisible ? <div className="list-group-item appSys-contest">
            <div>
                {statusButton(config, isEntried)}
                <div>
                    <small>{config.desc1}</small>
                    {config.desc2 ? <small className="ms-1">{config.desc2.split("|").map((desc2) => (<span className="unmot">{desc2}</span>))}</small> : <></>}
                </div>
            </div>
            <h5 className="text-moderate mt-1">{config.title}</h5>
            {config.detail ? <a className="card-link" href={config.detail}>詳細</a> : <></>}
            {isEntried ? (config.entryui || config.entry ? <a className="card-link" href={config.entryui || config.entry}><i className="fas fa-user-edit fa-fw"></i>確認</a> : <></>) : <></>}
            {config.record ? <a className="card-link" href={config.record}>データ</a> : <></>}
        </div > : <></>
    }

    const contests = (
        <div id="account-contests" className="row">
            <div className="col-lg-6">
                <h3 id="contests">大会</h3>
                <div id="account-upcoming-contests" className="list-group list-group-flush mb-2">
                    {CONTESTS_DATA.upcomingContests.map((v) => (
                        contest(v, contUserInfo[v.id]?.entry)
                    ))}
                </div>
            </div>
            <div className="col-lg-6">
                <h3 id="results">結果</h3>
                <div id="account-past-contests" className="list-group list-group-flush mb-2">
                    {CONTESTS_DATA.pastContests.map((v) => (
                        contest(v)
                    ))}
                </div>
            </div>
        </div>)

    const adminPortalLink = isAdmin ? <a href="/admin-portal/" className="btn btn-info btn-small" role="button">管理者ポータル</a> : <></>

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                const promiseBadge = (async () => {
                    const snapshot = await get(ref(db, "/badges/" + user.uid));
                    setBadges(snapshot.val());
                })();
                const promiseUserInfo = (async () => {
                    const snapshot = await get(ref(db, "/users/" + user.uid));
                    setUserInfo(snapshot.val());
                    if (snapshot.val()?.admin) {
                        const adminRef = await get(ref(db, "/admin/" + user.uid));
                        setIsAdmin(adminRef.val());
                        if (!adminRef.val()) {
                            await update(ref(db, "/users/" + user.uid), { admin: false });
                        }
                    }
                    else if (snapshot.val()) {
                        // console.log("normal")
                    }
                    else {
                        await update(ref(db, "/users/" + user.uid), {
                            email: user.email
                        });
                    }
                })();
                await Promise.all([promiseBadge, promiseUserInfo]).catch((e) => {
                    console.error(e);
                    alert("エラー");
                });

                for (const cont of CONTESTS_DATA.upcomingContests) {
                    if (cont.status === "entryopen") {
                        const contSnapshot = await get(ref(db, "/contests/" + cont.id + "/users/" + user.uid));
                        const contestantInfo = contSnapshot.val();
                        if (!contestantInfo) {
                            location.replace("/entry/" + cont.id);
                        }
                        else {
                            setContUserInfo((pre) => ({ ...pre, [cont.id]: contestantInfo }));
                        }
                    }
                }
                // const paidSnapshot = await get(ref(db, '/orders/jol2023/' + user.email!.replace(/\./g, '=').toLowerCase()));

                document.getElementsByTagName("body").item(0)!.style.opacity = "1";
            }
            else {
                location.replace("/login/");
            }
        });

        return () => {
            // setUser(null);
            unsubscribed();
        };
    }, []);
    return <>{adminPortalLink}{contests}{logoutButton}</>
}

const root = createRoot(document.getElementById("app")!);

root.render(
    <App />
);

const USER_EMAILs = document.getElementsByClassName('user-email') as HTMLCollectionOf<HTMLElement>;

// document.addEventListener("DOMContentLoaded", (event) => {
//     auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             for (let i = 0; i < USER_EMAILs.length; i++) {
//                 USER_EMAILs[i].innerText = user.email || "";
//             }

//             // if (ELEM_alert) {
//             //     // コンテスト直前は支払済みでないアカウントにはアラートを出す
//             //     const paid = await get(ref(db, '/orders/jol2023/' + user.email!.replace(/\./g, '=').toLowerCase()));
//             //     if (!paid.val()) {
//             //         ELEM_alert.style.display = "block";
//             //         ELEM_info!.style.display = "none";
//             //     }
//             // }

//             const contests = document.getElementsByClassName("appSys-contest");
//             let toberemoved: Element[] = [];
// const promiseBadge = (async () => {
//     const snapshot = await get(ref(db, "/badges/" + user.uid))
//     const badges = snapshot.val();
//     for (let j = 0; j < contests.length; j++) {
//         const cont = contests[j];
//         const badge = cont.getAttribute("data-visible-badge");
//         const eq = cont.getAttribute("data-visible-eq");

//         // const isvisible = badge ? eq ? badges[badge] == eq : badges[badge] : true;
//         let isvisible = true;
//         if (badge) {
//             if (badges) {
//                 if (eq) {
//                     isvisible = badges[badge] && badges[badge] == eq;
//                 }
//                 else {
//                     isvisible = badges[badge];
//                 }
//             }
//             else {
//                 isvisible = false;
//             }
//         }
//         if (isvisible) {
//         }
//         else toberemoved.push(cont);
//     }
// })();
//             const promiseUser = (async () => {
//                 const snapshot = await get(ref(db, "/users/" + user.uid));
//                 let isnewuser = true;
//                 if (snapshot.val()) {
//                     const val = snapshot.val();
//                     if (val.admin) {
//                         toberemoved.splice(0);
//                         const adminRef = await get(ref(db, "/admin/" + user.uid));
//                         if (adminRef.val()) {
//                             isnewuser = false;
//                             const a = document.createElement("a");
//                             a.href = "/admin-portal/";
//                             a.innerText = "管理者ポータル";
//                             a.classList.add("btn", "btn-info", "btn-small");
//                             const refNode = document.querySelector("#content section");
//                             refNode!.parentNode!.insertBefore(a, refNode);
//                         }
//                         else await update(ref(db, "/users/" + user.uid), { admin: false });
//                     }
//                     else {
//                         for (let j = 0; j < contests.length; j++) {
//                             const cont = contests[j];
//                             const spot = cont.getAttribute("data-visible-spot");

//                             const isvisible = val.spot ? spot ? spot == val.spot : true : true;
//                             if (isvisible) {
//                             }
//                             else toberemoved.push(cont);
//                         }
//                     }
//                     // if(val.entry == "jol2022"){
//                     //     isnewuser = false;
//                     // }
//                     // else if(val.entry == "mainmenu2022"){
//                     //     isnewuser = false;
//                     // }
//                 }
//                 else {
//                     await set(ref(db, "/users/" + user.uid), {
//                         email: user.email
//                     });
//                 }
//                 // if(isnewuser) location.href = "/entry/jol2022/";
//             })();

//             await Promise.all([promiseBadge, promiseUser]).catch((e) => {
//                 console.error(e);
//                 alert("エラー");
//             });
//             toberemoved.forEach((cont) => { cont.remove() });
//             let flag = true;
//             for (let j = 0; j < contests.length; j++) {
//                 const cont = contests[j];
//                 if (cont.getAttribute("data-status") == "entryopen") {
//                     const contId = cont.getAttribute("data-id");
//                     const snapshot2 = await get(ref(db, "/contests/" + contId + "/users/" + user.uid));
//                     const contestantInfo = snapshot2.val();
//                     if (contestantInfo && contestantInfo.entry) {
//                         document.getElementById("entried-" + contId)!.style.display = "block";
//                     }
//                     else if (contestantInfo && contestantInfo.isNotNew) {
//                         document.getElementById("entryopen-" + contId)!.style.display = "block";
//                     }
//                     else {
//                         flag = false;
//                         location.href = "/entry/" + contId;
//                     }
//                 }
//             }
//             if (flag) document.getElementsByTagName("body").item(0)!.style.opacity = "1";
//         }
//         else {
//             location.href = "/login/"
//         }
//     });
// });
