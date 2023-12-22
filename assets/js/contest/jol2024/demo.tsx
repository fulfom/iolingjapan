import { app, auth, db } from "@js/firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp } from "firebase/database"
import { toHms } from "@js/utility/toHms"
import QA from "@js/components/QA"
import React from "react"
import { createRoot } from "react-dom/client";

const ELEM_LINKS = document.getElementById('links')!.getElementsByTagName('a');
const ELEM_LINKSLI = document.getElementById('links')!.getElementsByTagName('li');
const ELEM_LINKS2 = document.getElementById('links2')!.getElementsByTagName('a');
const ELEM_LINKSLI2 = document.getElementById('links2')!.getElementsByTagName('li');

const ELEM_TIMER = document.getElementById('timer');
const ELEM_TIMERBTN = document.getElementById('timerbtn');

const rootQA = createRoot(document.getElementById("qa")!);
const rootContestantInfoTable = createRoot(document.getElementById("contestant-info-table")!);

let handleTimer: NodeJS.Timeout;
// startTimer(0);
let demolinks = {};

rootQA.render(
    <QA contId="jol2024" site="demo" />
);

window.onhashchange = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
};

document.addEventListener("DOMContentLoaded", (event) => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            onValue(ref(db, '/orders/jol2024/' + user.email!.replace(/\./g, '=').toLowerCase()), (paid) => {
                if (paid.val()) {
                    onValue(ref(db, '/contests/jol2024/users/' + user.uid), (snapshot1) => {
                        const userInfo = snapshot1.val()
                        if (userInfo) {
                            rootContestantInfoTable.render(
                                <table className="list-like ms-3">
                                    <tbody>
                                        <tr>
                                            <td>メールアドレス:</td>
                                            <td>{user.email}</td>
                                        </tr>
                                        <tr>
                                            <td>競技者氏名:</td>
                                            <td>{userInfo.name}</td>
                                        </tr>
                                        <tr>
                                            <td>参加枠:</td>
                                            <td>{userInfo.spot === "flag" ? "選抜" : "オープン"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )
                            for (const elem of Array.from(document.getElementsByClassName("only-flag") as HTMLCollectionOf<HTMLElement>)) {
                                elem.style.display = userInfo.spot === "flag" ? "block" : "none";
                            }
                        }
                        update(ref(db, '/contests/jol2024/demolog/' + user.uid), {
                            timestamp: serverTimestamp()
                        })
                    }, {
                        onlyOnce: true
                    });
                    onValue(ref(db, '/contests/jol2024/publish/demo/'), (snapshot2) => {
                        const publish = snapshot2.val();
                        if (publish) {
                            demolinks = Object.assign({}, demolinks, publish);
                            // updateLinks(publish);
                        }
                    }, {
                        onlyOnce: true
                    });
                    onValue(ref(db, '/contests/jol2024/demo/' + user.uid), (snapshot3) => {
                        const answerSheet = snapshot3.val();
                        if (answerSheet) {
                            demolinks = Object.assign({}, demolinks, answerSheet);
                        }
                    }, {
                        onlyOnce: true
                    });
                }
                else {
                    location.href = "/account/";
                }
            });
        }
        else {
            location.href = "/login/";
        }
    });
});

function startTimer(rug: number) {
    let flag = false;
    clearInterval(handleTimer)
    var end = new Date();
    end.setTime(end.getTime() + 7206000);
    // var now = new Date();
    // var diff = end.getTime() - now.getTime();
    // var data = Math.max(Math.floor(diff/1000) + rug, 0);
    //現在時刻から試験終了までの秒数を取得
    // console.log(end,now,diff,data)

    handleTimer = setInterval(() => {
        var now = new Date();
        var diff = end.getTime() - now.getTime();
        var data = Math.max(Math.floor(diff / 1000) + rug, 0);
        updateTimer(data)
        if (data == 7200 && !flag) {
            console.log("start!", flag)
            flag = true;
            updateLinks(demolinks);
        }
        if (data <= 0) {
            clearInterval(handleTimer);
        }
    }, 100);
}

ELEM_TIMERBTN?.addEventListener("click", () => {
    startTimer(0);
})

function updateLinks(data: any) {
    if (data.answerSheet) {
        ELEM_LINKS[1].href = data.answerSheet;
        ELEM_LINKSLI[1].classList.add('list-group-item-success')
        window.open(data.answerSheet, '_blank');
    }
    if (data.problem) {
        ELEM_LINKS[0].href = data.problem;
        ELEM_LINKSLI[0].classList.add('list-group-item-success')
        window.open(data.problem, '_blank');
    }
    if (data.answerSheet2) {
        ELEM_LINKS2[1].href = data.answerSheet2;
        ELEM_LINKSLI2[1].classList.add('list-group-item-success')
    }
    if (data.problem2) {
        ELEM_LINKS2[0].href = data.problem2;
        ELEM_LINKSLI2[0].classList.add('list-group-item-success')
    }
    if (data.pwd) {
        document.getElementById('pwd')!.innerText = data.pwd;
    };
}

// function updateTimer(data){
//     if(data !== null){
//         document.getElementById('timer').innerText = data > 7200 ? "競技開始まで" + toHms(data - 7200) : toHms(data);
//     }
// }

function updateTimer(data: number | null) {
    if (data !== null) {
        var timer = "";
        if (data > 7200) {
            timer = "競技開始まで" + toHms(data - 7200)
        }
        else if (data <= 0) {
            timer = "競技終了"
        }
        else timer = toHms(data);
        ELEM_TIMER!.innerText = timer;
    }
}