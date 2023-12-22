import { app, auth, db } from "@js/firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp } from "firebase/database"
import { toHms } from "@js/utility/toHms"
import QA from "@js/components/QA"
import React, { useEffect, useMemo, useState } from "react"
import { createRoot } from "react-dom/client";
import { Button, ButtonGroup, Card, Collapse } from "react-bootstrap"
import { useObjectVal } from "react-firebase-hooks/database"
import { User } from "firebase/auth"
import { useTimer } from "react-timer-hook"

const rootQA = createRoot(document.getElementById("qa")!);
const rootContestantInfoTable = createRoot(document.getElementById("contestant-info-table")!);

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
    rug?: number;
}

type demoUserType = {
    answerSheet: string;
}

const Timer = ({ rug, setFlag, expiryTimestamp }: { rug: number, setFlag: (arg0: boolean) => (void), expiryTimestamp: Date }) => {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => console.warn('onExpire called') });

    useEffect(() => {
        if (totalSeconds === 7200) {
            setFlag(true)
            console.log("true")
        }
        return () => {
        }
    }, [totalSeconds])

    const handleClick = () => {
        const end = new Date();
        end.setTime(end.getTime() + 7205000 + rug)
        setFlag(false)
        restart(end)
    }

    return <>
        <Button className="btn btn-primary" onClick={handleClick}>練習用タイマー</Button>
        <p>練習用タイマーを押すと，競技開始5秒前の状況が再現されます．</p>
        <div className="fa-2x position-sticky pt-1" style={{ top: "62px", backgroundColor: "white", zIndex: 10 }}>
            {
                totalSeconds > 7200 ?
                    "競技開始まで" + toHms(totalSeconds - 7200)
                    : totalSeconds <= 0 ?
                        "競技終了"
                        : toHms(totalSeconds)
            }
        </div></>
}

const Links = ({ user }: { user: any }) => {
    const [publishDemo, publishDemoloading, publishDemoerror] = useObjectVal<PublishDemoType>(ref(db, '/contests/jol2024/publish/demo/'));
    const [demoUser, demoUserloading, demoUsererror] = useObjectVal<demoUserType>(ref(db, `/contests/jol2024/demo/${user.uid}`));
    const [alternateAnswerSheet, setAlternateAnswerSheet] = useState<boolean>(false);
    const [flag, setFlag] = useState(false);

    const end = new Date();
    end.setTime(end.getTime() + 7205000);

    const { problem, problem2, problem3, answerSheet2 }: PublishDemoType = useMemo(() => (flag && publishDemo) || {
        problem: "",
        problem2: "",
        problem3: "",
        answerSheet2: "",
    }, [publishDemo?.problem, publishDemo?.problem2, publishDemo?.problem3, publishDemo?.answerSheet2, flag])

    const rug: number = publishDemo && publishDemo.rug || 0;

    const { answerSheet }: demoUserType = useMemo(() => (flag && demoUser) || { answerSheet: "" }, [flag, demoUser])

    const toggleAlternateAnswerSheet = async () => {
        setAlternateAnswerSheet((prev: boolean) => (!prev));
    }

    const handleFlag = (newValue: boolean) => {
        setFlag(newValue)
    }

    useEffect(() => {
        if (flag) {
            if (problem) {
                window.open(problem, '_blank');
            }
            if (answerSheet) {
                window.open(answerSheet, '_blank');
            }
        }
    }, [problem, answerSheet, flag])

    return <>
        <Timer rug={rug} setFlag={handleFlag} expiryTimestamp={end} />
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


// function updateTimer(data){
//     if(data !== null){
//         document.getElementById('timer').innerText = data > 7200 ? "競技開始まで" + toHms(data - 7200) : toHms(data);
//     }
// }