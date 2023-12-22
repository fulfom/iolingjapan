import { app, auth, db } from "@js/firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp } from "firebase/database"
import { toHms } from "@js/utility/toHms"
import QA from "@js/components/QA"
import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client";
import { Button, ButtonGroup, Card, Collapse } from "react-bootstrap"
import { useObjectVal } from "react-firebase-hooks/database"
import { User } from "firebase/auth"

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

type PublishDemoType = {
    problem: string;
    problem2: string;
    problem3: string;
    answerSheet2: string;
}

type demoUserType = {
    answerSheet: string;
}

const Links = ({ user }: { user: any }) => {
    const [publishDemo, publishDemoloading, publishDemoerror] = useObjectVal<PublishDemoType>(ref(db, '/contests/jol2024/publish/demo/'));
    const [demoUser, demoUserloading, demoUsererror] = useObjectVal<demoUserType>(ref(db, `/contests/jol2024/demo/${user.uid}`));
    const [alternateAnswerSheet, setAlternateAnswerSheet] = useState<boolean>(false);

    const { problem, problem2, problem3, answerSheet2 }: PublishDemoType = publishDemo || {
        problem: "",
        problem2: "",
        problem3: "",
        answerSheet2: "",
    }
    const { answerSheet }: demoUserType = demoUser || { answerSheet: "" }

    const toggleAlternateAnswerSheet = async () => {
        setAlternateAnswerSheet((prev: boolean) => (!prev));
    }

    useEffect(() => {
        if (problem) {
            window.open(problem, '_blank');
        }
        if (answerSheet) {
            window.open(answerSheet, '_blank');
        }
    }, [problem, answerSheet])


    return <>
        <Card>
            <ul className="list-group list-fill-link list-group-horizontal-sm">
                <li className={"list-group-item flex-fill" + (problem ? " list-group-item-success" : "")}>
                    <a target="_blank" href={problem || undefined}>
                        <i className="fas fa-file-download fa-fw"></i>問題pdf1（体験版）
                    </a>
                </li>
                <li className={"list-group-item" + (problem2 ? " list-group-item-success" : "")}>
                    <a target="_blank" href={problem2 || undefined}>
                        <i className="fas fa-file-download fa-fw"></i>（予備）問題pdf2（体験版）
                    </a>
                </li>
                <li className={"list-group-item" + (problem3 ? " list-group-item-success" : "")}>
                    <a target="_blank" href={problem3 || undefined}>
                        <i className="fas fa-file-download fa-fw"></i>（予備）問題pdf3（体験版）
                    </a>
                </li>
            </ul>
            <ul className="list-group list-fill-link list-group-horizontal-sm">
                <li className={"list-group-item flex-fill" + (answerSheet ? " list-group-item-success" : "")}>
                    <a target="_blank" href={answerSheet || undefined}>
                        <span className="unmot"><i className="fas fa-table fa-fw"></i>解答用ページ（体験版）</span>
                    </a></li>
                <li className="list-group-item">
                    <a role="button" onClick={toggleAlternateAnswerSheet} className="link-primary">
                        <span className="unmot"><i className="fas fa-table fa-fw"></i>（予備）解答用ページが使えない場合</span>
                    </a></li>
            </ul>
        </Card >
        <Collapse in={alternateAnswerSheet}>
            <div className="my-3">
                <p>下記の解答用エクセルファイルをダウンロードして解答を記入してください．</p>
                <p>解答用エクセルファイルは<strong>競技時間内にメールで</strong> <a href="mailto:jol@iolingjapan.org">jol@iolingjapan.org</a> に提出してください．</p>
                <p>メールには次の情報を付してください:「<span className="user-select-all">メールアドレス: {user.email}，氏名: {user.name}，参加枠: {user.spot === "flag" ? "選抜" : "オープン"}</span>」</p>
                <ul className="list-group list-fill-link">
                    <li className={"list-group-item flex-fill" + (answerSheet2 ? " list-group-item-success" : "")}>
                        <a target="_blank" href={answerSheet2 || undefined}><i className="fas fa-table fa-fw"></i>解答用エクセル（予備）</a></li>
                </ul>
            </div>
        </Collapse>
    </>
}

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
                            createRoot(document.getElementById("links")!).render(<Links user={userInfo} />)
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
            // link
        }
        if (data <= 0) {
            clearInterval(handleTimer);
        }
    }, 100);
}

ELEM_TIMERBTN?.addEventListener("click", () => {
    startTimer(0);
})

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