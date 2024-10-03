import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { app, auth, db } from "./firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { User } from "firebase/auth";

const CONTEST_DATA: {
    [key: string]: {
        previous: string;
        name: string;
        motivations: string[];
    }
} = {
    jol2024: {
        previous: "jol2023",
        name: "JOL2024",
        motivations: ["友人・先輩", "学校の先生", "家族", "塾", "ツイッター", "インスタグラム", "テレビ", "雑誌・新聞", "インターネット上のサイト", "JOL公式サイト", "JOL公式ハンドアウト", "書籍『パズルで解く世界の言語』"],
    },
    jol2025: {
        previous: "jol2024",
        name: "JOL2025",
        motivations: ["友人・先輩", "学校の先生", "家族", "塾", "YouTube", "ツイッター（X）", "インスタグラム", "テレビ", "雑誌・新聞", "インターネット上のサイト", "JOL公式サイト", "JOL公式ハンドアウト", "書籍『パズルで解く世界の言語』"],
    }
}

type UserInfo = {
    [key: string]: string;
} & {
    email?: string;
    isCertificateNecessary?: boolean;
    spot?: string;
    motivations?: boolean[];
}

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<{ [uid: string]: UserInfo }>({});
    const [orders, setOrders] = useState<{ [key: string]: boolean }>({});
    const [usersPreviousYear, setUsersPreviousYear] = useState<{ [uid: string]: UserInfo }>({});
    const [selectedId, setSelectedId] = useState("jol2025");

    const checkOrders = useMemo(() => {
        if (!users || !orders) { return [] };
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
        let motivationstmp: number[] = Array(CONTEST_DATA[selectedId].motivations.length).fill(0);
        let motivationstmpFlag: number[] = Array(CONTEST_DATA[selectedId].motivations.length).fill(0);
        let motivationstmpAward: number[] = Array(CONTEST_DATA[selectedId].motivations.length).fill(0);
        let motivationTexttmp: string[] = [];
        let motivationCountertmp = 0;
        for (const k in users) {
            const v = users[k]
            if (v.motivations) {
                for (const mk in v.motivations) {
                    const mv = v.motivations[mk];
                    motivationstmp[Number(mk)] += mv ? 1 : 0;
                    if (v.spot === "flag") {
                        motivationstmpFlag[Number(mk)] += mv ? 1 : 0;
                    } else {
                        motivationstmpAward[Number(mk)] += mv ? 1 : 0;
                    }
                }
            }
            if (v.motivationText) {
                motivationTexttmp.push(v.motivationText);
            }
            if (v.motivations || v.motivationText) {
                motivationCountertmp++;
            }
        }
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

        if (user === null) return;
        const refUsers = ref(db, `/contests/${selectedId}/users/`);
        const refUsersPreviousYear = ref(db, `/contests/${CONTEST_DATA[selectedId].previous}/users/`);
        const refOrders = ref(db, `/orders/${selectedId}/`);

        console.log("fetching data")
        const unsubscribeUsers = onValue(refUsers, (sn) => {
            if (!sn.val()) return;
            const { iJzZm4b685VtudLmpnAVlO8EJc93, R0LNjJBhu6fWozNcw29WmP9zHSC2, ...snval }: { [uid: string]: UserInfo } = sn.val()
            setUsers(snval);
        });
        const unsubscribeOrders = onValue(refOrders, (sn) => {
            if (!sn.val()) return;
            setOrders(sn.val())
        });
        const unsubscribePreviousYear = onValue(refUsersPreviousYear, (sn) => {
            if (!sn.val()) return;
            setUsersPreviousYear(sn.val());
        }, { onlyOnce: true });

        return () => {
            unsubscribeUsers();
            unsubscribeOrders();
            unsubscribePreviousYear();
        }
    }, [selectedId, user])

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
        });
    }, [])

    return (
        <>
            <Form.Select aria-label="Select Year" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="jol2025">JOL2025</option>
                <option value="jol2024">JOL2024</option>
            </Form.Select>
            <h2>{CONTEST_DATA[selectedId].name} 応募状況</h2>
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
            <h2>{CONTEST_DATA[selectedId].name}アンケート結果</h2>
            <h3>言語学オリンピックをどこで知りましたか</h3>
            <p>{motivationCounter}人回答</p>
            {CONTEST_DATA[selectedId].motivations.map((v, i) => (
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
                <p>その他・詳細</p>
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