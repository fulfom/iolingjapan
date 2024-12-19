import { app, auth, db } from "@js/firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp, push } from "firebase/database"
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
    <QA contId="jol2025" site="contest" />
);

window.onhashchange = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
};

type PublishType = {
    problem: string;
    problem2: string;
    problem3: string;
    answerSheet2: string;
    answerSheet3: string;
    rug?: number;
}

const ELEM_TIMER = document.getElementById("timer")!

const Timer = ({ expiryTimestamp }: { expiryTimestamp: Date }) => {
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
    } = useTimer({ expiryTimestamp, autoStart: true, onExpire: () => console.warn('onExpire called') });

    useEffect(() => {
        restart(expiryTimestamp, true);
        return () => {
        }
    }, [expiryTimestamp])

    ELEM_TIMER.innerText =
        totalSeconds > 7200 ?
            "競技開始まで" + toHms(totalSeconds - 7200)
            : totalSeconds <= 0 ?
                "競技終了"
                : toHms(totalSeconds)

    return <>
        {/* <div className="fa-2x position-sticky pt-1" style={{ top: "62px", backgroundColor: "white", zIndex: 10 }}>
            {
                totalSeconds > 7200 ?
                    "競技開始まで" + toHms(totalSeconds - 7200)
                    : totalSeconds <= 0 ?
                        "競技終了"
                        : toHms(totalSeconds)
            }
        </div> */}
    </>
}

const Links = ({ user, uid }: { user: any, uid: string }) => {
    const [publish, publishloading, publisherror] = useObjectVal<PublishType>(ref(db, '/contests/jol2025/publish/contest/'));
    const [answerSheet, answerSheetloading, answerSheeterror] = useObjectVal<string>(ref(db, `/contests/jol2025/contest/${uid}/answerSheet`));
    const [alternateAnswerSheet, setAlternateAnswerSheet] = useState<boolean>(false);

    const rug: number = publish && publish.rug || 0;

    const expiryTimestamp = useMemo(() => {
        const end = new Date("2024-12-29T15:00:00+09:00");
        end.setTime(end.getTime() + rug * 1000);
        return end
    }, [rug])

    const { problem, problem2, problem3, answerSheet2, answerSheet3 }: PublishType = useMemo(() => (publish) || {
        problem: "",
        problem2: "",
        problem3: "",
        answerSheet2: "",
        answerSheet3: "",
    }, [publish?.problem, publish?.problem2, publish?.problem3, publish?.answerSheet2, publish?.answerSheet3])

    const toggleAlternateAnswerSheet = async () => {
        setAlternateAnswerSheet((prev: boolean) => (!prev));
    }

    useEffect(() => {
        if (problem) {
            window.open(problem, '_blank');
            push(ref(db, `/contests/jol2025/log/contest/${uid}/problem`), serverTimestamp())
        }
    }, [problem])
    useEffect(() => {
        if (answerSheet) {
            window.open(answerSheet, '_blank');
            push(ref(db, `/contests/jol2025/log/contest/${uid}/answerSheet`), serverTimestamp())
        }
    }, [answerSheet])

    return <>
        <Timer expiryTimestamp={expiryTimestamp} />
        <Card>
            <ul className="list-group list-fill-link list-group-horizontal-sm">
                <li className={"list-group-item flex-fill" + (problem ? " list-group-item-success" : "")}>
                    <a target="_blank" href={problem || undefined}>
                        <i className="fas fa-file-download fa-fw"></i>問題pdf1
                    </a>
                </li>
                <li className={"list-group-item" + (problem2 ? " list-group-item-success" : "")}>
                    <a target="_blank" href={problem2 || undefined}>
                        <i className="fas fa-file-download fa-fw"></i>（予備）問題pdf2
                    </a>
                </li>
                <li className={"list-group-item" + (problem3 ? " list-group-item-success" : "")}>
                    <a target="_blank" href={problem3 || undefined}>
                        <i className="fas fa-file-download fa-fw"></i>（予備）問題pdf3
                    </a>
                </li>
            </ul>
            <ul className="list-group list-fill-link list-group-horizontal-sm">
                <li className={"list-group-item flex-fill" + (answerSheet ? " list-group-item-success" : "")}>
                    <a target="_blank" href={answerSheet || undefined}>
                        <span className="unmot"><i className="fas fa-table fa-fw"></i>解答用ページ</span>
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
                <ul className="list-group list-fill-link mb-3">
                    <li className={"list-group-item flex-fill" + (answerSheet2 ? " list-group-item-success" : "")}>
                        <a target="_blank" href={answerSheet2 || undefined}><i className="fas fa-table fa-fw"></i>解答用エクセル1</a>
                    </li>
                    <li className={"list-group-item flex-fill" + (answerSheet3 ? " list-group-item-success" : "")}>
                        <a target="_blank" href={answerSheet3 || undefined}><i className="fas fa-table fa-fw"></i>（予備）解答用エクセル2</a>
                    </li>
                </ul>
                <p>※解答用エクセル1と2は同じものです</p>
            </div>
        </Collapse>
        {rug > 0 && <p>{rug}秒遅れで競技開始（タイマーには加算済み）</p>}
    </>
}

document.addEventListener("DOMContentLoaded", (event) => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            onValue(ref(db, '/orders/jol2025/' + user.email!.replace(/\./g, '=').toLowerCase()), (paid) => {
                if (paid.val()) {
                    onValue(ref(db, '/contests/jol2025/users/' + user.uid), (snapshot1) => {
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
                            createRoot(document.getElementById("links")!).render(<Links user={userInfo} uid={user.uid} />)
                            for (const elem of Array.from(document.getElementsByClassName("only-flag") as HTMLCollectionOf<HTMLElement>)) {
                                elem.style.display = userInfo.spot === "flag" ? "block" : "none";
                            }
                        }
                        // update(ref(db, '/contests/jol2025/log/contest/' + user.uid), {
                        //     timestamp: serverTimestamp()
                        // })
                        push(ref(db, `/contests/jol2025/log/contest/${user.uid}/siteVisit`), serverTimestamp())
                    }, {
                        onlyOnce: true
                    });
                }
                else {
                    alert("JOL2025応募アカウントではありません．アカウントを間違えている場合はログインし直してください．")
                    location.href = "/account/";
                }
            });
        }
        else {
            location.href = "/login/";
        }
    });
});
