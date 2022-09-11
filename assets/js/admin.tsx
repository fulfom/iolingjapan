import * as React from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import * as ReactDOM from "react-dom/client";
import fb from "firebase/compat/app";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';

declare const firebase: typeof fb;

function App() {
    const [users, setUsers] = useState({} as Object);
    const [orders, setOrders] = useState({});
    const [motivations, setMotivations] = useState([] as any[]);
    const [motivationsFlag, setMotivationsFlag] = useState([] as any[]);
    const [motivationsAward, setMotivationsAward] = useState([] as any[]);
    const [motivationText, setMotivationText] = useState([] as string[])

    useLayoutEffect(() => {
        // setUser({ email: "test", uid: "" })
        // setUdb({ spot: "" })
        // 現在ログインしているユーザを取得
        firebase.auth().onAuthStateChanged(async v => {
            const refUsers = firebase.database().ref("/contests/jol2023/users/");
            const refOrders = firebase.database().ref("/orders/jol2023/");

            refUsers.on("value", (sn) => {
                if (!sn.val()) return;
                const { iJzZm4b685VtudLmpnAVlO8EJc93, R0LNjJBhu6fWozNcw29WmP9zHSC2, ...snval } = sn.val()

                let motivationstmp = Array(20).fill(0);
                let motivationstmpFlag = Array(20).fill(0);
                let motivationstmpAward = Array(20).fill(0);
                let motivationTexttmp = [] as string[];
                Object.entries(snval as Object).map(([k, v]) => {
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
                        motivationTexttmp.push(v.motivationText as string);
                    }

                    if (orders) {
                        snval[k] = ({ ...snval[k], paid: snval.email ? orders[snval.email.replace(/\./g, "=")] : false })
                    }
                })
                setMotivations(motivationstmp);
                setMotivationsFlag(motivationstmpFlag);
                setMotivationsAward(motivationstmpAward);
                setMotivationText(motivationTexttmp);
                setUsers(snval);
            });
            refOrders.on("value", (sn) => {
                if (!sn.val()) return;
                setOrders(sn.val())
            })
        });
    }, [])

    return (
        <>
            <h2>JOL2023 応募状況</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>応募者数</th>
                        <th>うち支払済み</th>
                        <th>紙賞状希望</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>全体</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && orders[v.email.replace(/\./g, "=")])).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && !v.isCertificateNecessary)).length}</td>
                    </tr>
                    <tr>
                        <th>選抜枠</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && orders[v.email.replace(/\./g, "=")] && v.spot === "flag")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && !v.isCertificateNecessary && v.spot === "flag")).length}</td>
                    </tr>
                    <tr>
                        <th>オープン枠</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && orders[v.email.replace(/\./g, "=")] && v.spot === "award")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && !v.isCertificateNecessary && v.spot === "award")).length}</td>
                    </tr>
                </tbody>
            </table>
            <h2>JOL2023アンケート結果</h2>
            <h3>言語学オリンピックをどこで知りましたか</h3>
            {["友人・先輩", "学校の先生", "家族", "塾", "ツイッター", "インスタグラム", "テレビ", "雑誌・新聞", "インターネット上のサイト", "JOL公式サイト", "JOL公式ハンドアウト"].map((v, i) => (
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
                    {motivationText.map((v) => {
                        return <li key={v}>{v}</li>
                    })}
                </ul>
            </div>
            <p>※()外は全体，()内は選抜枠の数</p>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("react"));

root.render(
    <App />,
);