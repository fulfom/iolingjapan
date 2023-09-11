import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { app, auth, db } from "./firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';

type UserInfo = {
    [key: string]: string;
} & {
    email?: string;
    isCertificateNecessary?: boolean;
    spot?: string;
}

function App() {
    const [users, setUsers] = useState<{ [uid: string]: UserInfo }>({});
    const [orders, setOrders] = useState<any>({});
    const [usersPreviousYear, setUsersPreviousYear] = useState<{ [uid: string]: UserInfo }>({});

    const checkOrders = useMemo(() => {
        const userEmails = Object.entries(users).map(([k, v]) => (v.email ? v.email.replace(/\./g, "=") : ""));
        const paidList: string[] = [];
        const result: [string, string][] = [];
        for (const [order, flag] of Object.entries(orders)) {
            if (!flag) continue;
            if (userEmails.includes(order)) {
                paidList.push(order)
            }
            else {
                result.push(["未申込", order.replace(/=/g, ".")])
            }
        }
        return result;
    }, [users, orders])

    const { motivations, motivationsFlag, motivationsAward, motivationText, motivationCounter } = useMemo(() => {
        let motivationstmp = Array(20).fill(0);
        let motivationstmpFlag = Array(20).fill(0);
        let motivationstmpAward = Array(20).fill(0);
        let motivationTexttmp: string[] = [];
        let motivationCountertmp = 0;
        Object.entries(users).map(([k, v]) => {
            if (v.motivations) {
                Object.entries(v.motivations).map(([mk, mv]) => {
                    motivationstmp[mk] += mv ? 1 : 0;
                    if (v.spot === "flag") {
                        motivationstmpFlag[mk] += mv ? 1 : 0;
                    } else {
                        motivationstmpAward[mk] += mv ? 1 : 0;
                    }
                })
            }
            if (v.motivationText) {
                motivationTexttmp.push(v.motivationText);
            }
            if (v.motivations || v.motivationText) {
                motivationCountertmp++;
            }
        })
        return {
            motivations: motivationstmp,
            motivationsFlag: motivationstmpFlag,
            motivationsAward: motivationstmpAward,
            motivationText: motivationTexttmp,
            motivationCounter: motivationCountertmp,
        }
    }, [users])

    useEffect(() => {
        // setUser({ email: "test", uid: "" })
        // setUdb({ spot: "" })
        // 現在ログインしているユーザを取得
        auth.onAuthStateChanged(async v => {
            const refUsers = ref(db, "/contests/jol2024/users/");
            const refUsersPreviousYear = ref(db, "/contests/jol2023/users/");
            const refOrders = ref(db, "/orders/jol2024/");

            onValue(refUsers, (sn) => {
                if (!sn.val()) return;
                const { iJzZm4b685VtudLmpnAVlO8EJc93, R0LNjJBhu6fWozNcw29WmP9zHSC2, ...snval }: { [uid: string]: UserInfo } = sn.val()
                setUsers(snval);
            });
            onValue(refOrders, (sn) => {
                if (!sn.val()) return;
                setOrders(sn.val())
            });
            setUsersPreviousYear((await get(refUsersPreviousYear)).val())
        });
    }, [])

    return (
        <>
            <h2>JOL2024 応募状況</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>応募者数</th>
                        <th>うち支払済み</th>
                        <th>リピーター</th>
                        <th>紙賞状希望</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>全体</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && orders[v.email.replace(/\./g, "=")])).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && usersPreviousYear[k]?.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && !v.isCertificateNecessary)).length}</td>
                    </tr>
                    <tr>
                        <th>選抜枠</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag" && v.email && orders[v.email.replace(/\./g, "=")])).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag" && v.email && usersPreviousYear[k]?.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag" && v.email && !v.isCertificateNecessary)).length}</td>
                    </tr>
                    <tr>
                        <th>オープン枠</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award" && v.email && orders[v.email.replace(/\./g, "=")])).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award" && v.email && usersPreviousYear[k]?.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award" && v.email && !v.isCertificateNecessary)).length}</td>
                    </tr>
                </tbody>
            </table>
            <p>{Object.entries(orders).filter(([k, v]) => (v)).length}</p>
            <p>未申込: {checkOrders.length}件</p>
            <p>{checkOrders.map((v) => (v[1])).join(", ")}</p>
            <h2>JOL2024アンケート結果</h2>
            <h3>言語学オリンピックをどこで知りましたか</h3>
            <p>{motivationCounter}人回答</p>
            {["友人・先輩", "学校の先生", "家族", "塾", "ツイッター", "インスタグラム", "テレビ", "雑誌・新聞", "インターネット上のサイト", "JOL公式サイト", "JOL公式ハンドアウト", "書籍『パズルで解く世界の言語』"].map((v, i) => (
                <div className="container" key={v}>
                    <div className="row">
                        <div className="col-12 col-md-2">{v}</div>
                        <div className="col-md-10">
                            <ProgressBar key={v} now={motivations[i]} label={`${motivations[i]} (${motivationsFlag[i]})`} max={Math.max(100, ...motivations)} />
                        </div>
                    </div>
                </div>
            ))}
            <div className="container">
                <p>その他</p>
                <ul>
                    {motivationText.map((v, i) => {
                        return <li key={`motivation${i}`}>{v}</li>
                    })}
                </ul>
            </div>
            <p>※()外は全体，()内は選抜枠の数</p>
        </>
    );
}

const root = createRoot(document.getElementById("react")!);

root.render(
    <App />,
);