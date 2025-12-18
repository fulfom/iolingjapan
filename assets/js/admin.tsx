import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { app, auth, db } from "./firebase-initialize"
import { ref, onValue, update, get, set, push, serverTimestamp } from "firebase/database"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { User } from "firebase/auth";
import { format } from "date-fns";
import { Col, Row, Table, Nav } from "react-bootstrap";

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
    },
    jol2026: {
        previous: "jol2025",
        name: "JOL2026",
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
    birthdate?: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [history, setHistory] = useState<{ [key: string]: { [key: string]: any } }>({});
    const [users, setUsers] = useState<{ [uid: string]: UserInfo }>({});
    const [orders, setOrders] = useState<{ [key: string]: boolean }>({});
    const [transfers, setTransfers] = useState<{ [key: string]: { source: string, target: string, name: string, memo: string, timestamp: number } }>({});
    const [usersPreviousYear, setUsersPreviousYear] = useState<{ [uid: string]: UserInfo }>({});
    const [selectedId, setSelectedId] = useState("jol2026");

    const [navtab, setNavtab] = useState("orderTransfer");

    // const transferFormSource = useRef<HTMLInputElement>(null);
    const transferFormName = useRef<HTMLInputElement>(null);
    const [transferFormSource, setTransferFormSource] = useState<string>("");
    const [transferFormTarget, setTransferFormTarget] = useState<string>("");
    const [searchFormZipcode, setSearchFormZipcode] = useState<string>("");
    const [searchFormName, setSearchFormName] = useState<string>("");

    const [groupOrderEmailsText, setGroupOrderEmailsText] = useState<string>("");
    const groupOrderEmails = groupOrderEmailsText.split(",").map((email) => email.trim()).filter((email) => email !== "");

    const transferTargetCandidates = Object.entries(users).filter(([k, v]) => (v.email?.toLowerCase() === transferFormTarget.toLowerCase()))

    const checkOrders = useMemo(() => {
        if (!users || !orders) { return [] };
        const userEmails = Object.entries(users).map(([k, v]) => (v.email ? v.email.replace(/\./g, "=").toLowerCase() : ""));
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

    const youngAwardUsers = Object.entries(users).filter(([k, v]) => (v.spot === "award" && v.birthdate && new Date(v.birthdate) >= new Date("2008-04-02")));

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
        const refTransfers = ref(db, `/orderTransferHistory/${selectedId}/`);

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
        const unsubscribeTransfers = onValue(refTransfers, (sn) => {
            if (!sn.val()) return;
            setTransfers(sn.val());
        });

        return () => {
            unsubscribeUsers();
            unsubscribeOrders();
            unsubscribePreviousYear();
            unsubscribeTransfers();
        }
    }, [selectedId, user])

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
        });
    }, [])

    useEffect(() => {
        if (user === null) return;
        const refHistory = ref(db, `/history/${user.uid}/`);
        const unsubscribeHistory = onValue(refHistory, (sn) => {
            if (!sn.val()) return;
            setHistory(sn.val());
        }, { onlyOnce: true });
        return () => {
            unsubscribeHistory();
        }
    }, [user]);

    const handleTransfer = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user === null) {
            alert("Not logged in");
            return;
        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            alert("Invalid input");
        } else {
            const source = form["transfer.source"].value.replace(/\./g, "=");
            const target = form["transfer.target"].value.replace(/\./g, "=").toLowerCase();
            const refOrders = ref(db, `/orders/${selectedId}/`);
            if (source !== "" && target !== "" && orders[source] && !orders[target]) {
                push(ref(db, `/orderTransferHistory/${selectedId}`), {
                    source: form["transfer.source"].value,
                    target: form["transfer.target"].value,
                    name: form["transfer.name"].value,
                    memo: form["transfer.memo"].value,
                    timestamp: serverTimestamp(),
                });
                await update(refOrders, {
                    [target]: orders[source],
                    [source]: null,
                });
                setTransferFormSource("");
                setTransferFormTarget("");
                form.reset();
            } else {
                let errs = [];
                if (!orders[source]) {
                    errs.push(`${source} is not paid`);
                }
                if (orders[target]) {
                    errs.push(`${target} is already paid`);
                }
                alert(`Invalid input: ${errs.join(", ")}`);
            }
        }
    }

    const handleGroupOrder = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user === null) {
            alert("Not logged in");
            return;
        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            alert("Invalid input");
        } else {
            const refOrders = ref(db, `/orders/${selectedId}/`);
            for (const email of groupOrderEmails) {
                const key = email.replace(/\./g, "=").toLowerCase();
                await update(refOrders, {
                    [key]: true,
                });
            }
        }
    }

    return (
        <>
            <Form.Select aria-label="Select Year" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="jol2026">JOL2026</option>
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
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && orders[v.email.replace(/\./g, "=").toLowerCase()])).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && usersPreviousYear[k]?.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.email && !v.isCertificateNecessary)).length}</td>
                    </tr>
                    <tr>
                        <th>選抜枠</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag" && v.email && orders[v.email.replace(/\./g, "=").toLowerCase()])).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag" && v.email && usersPreviousYear[k]?.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "flag" && v.email && !v.isCertificateNecessary)).length}</td>
                    </tr>
                    <tr>
                        <th>オープン枠</th>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award")).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award" && v.email && orders[v.email.replace(/\./g, "=").toLowerCase()])).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award" && v.email && usersPreviousYear[k]?.email)).length}</td>
                        <td>{Object.entries(users).filter(([k, v]) => (v.spot === "award" && v.email && !v.isCertificateNecessary)).length}</td>
                    </tr>
                </tbody>
            </table>
            {history && history.admin?.orderTransfer &&
                <>
                    <Nav justify variant="tabs" defaultActiveKey="orderTransfer" onSelect={(selectedKey) => {
                        setNavtab(selectedKey || "");
                    }}>
                        <Nav.Item>
                            <Nav.Link eventKey="orderTransfer">オーダー付替</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="groupOrder">グループオーダー</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {navtab === "orderTransfer" && <>
                        <h2>オーダー付替</h2>
                        <p>{Object.entries(orders).filter(([k, v]) => (v)).length}</p>
                        <p>未申込: {checkOrders.length}件</p>
                        <div style={{ overflowWrap: "anywhere" }}>{checkOrders.filter((v) => (
                            transferFormSource ? v[1].toLowerCase().startsWith(transferFormSource.toLowerCase()) : true
                        )).map((v) => (
                            <a role="button" key={v[1]} className="me-3 text-nowrap" onClick={
                                (e) => {
                                    setTransferFormSource(v[1]);
                                }
                            }>{v[1]}</a>
                        ))}</div>
                        <Form validated onSubmit={handleTransfer}>
                            <Form.Group className="mb-3" controlId="transfer.source">
                                <Form.Label>Source</Form.Label>
                                <Form.Control type="email" required autoComplete="off" value={transferFormSource} onChange={(e) => setTransferFormSource(e.currentTarget.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="transfer.target">
                                <Form.Label>Target</Form.Label>
                                <Form.Control type="email" required autoComplete="off" value={transferFormTarget} onChange={(e) => setTransferFormTarget(e.currentTarget.value)} />
                                <Form.Text className="text-muted">{transferTargetCandidates.length}件 {transferTargetCandidates.length <= 0 ? "" : !orders[transferFormTarget.replace(/\./g, "=").toLowerCase()] ? "OK" : "NG: 支払済！"} {transferTargetCandidates.map(([k, v]) => (<span key={k} role="button" onClick={(e) => { if (transferFormName.current) transferFormName.current.value = v.name }}>{v.name} {v.spot === "flag" ? "選抜" : "オープン"} {v.birthdate} {k} {v.zipcode} {v.address} {v.schoolName} {v.grade}年</span>))}</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="transfer.name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" required autoComplete="off" ref={transferFormName} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="transfer.memo">
                                <Form.Label>Memo</Form.Label>
                                <Form.Control type="text" autoComplete="off" />
                            </Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="search.zipcode">
                                <Form.Label>zipcode</Form.Label>
                                <Form.Control type="text" autoComplete="off" value={searchFormZipcode} onChange={(e) => setSearchFormZipcode(e.currentTarget.value)} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="search.name">
                                <Form.Label>name</Form.Label>
                                <Form.Control type="text" autoComplete="off" value={searchFormName} onChange={(e) => setSearchFormName(e.currentTarget.value)} />
                            </Form.Group>
                            <Form.Group as={Col} xs="12" md="auto" controlId="search.clear">
                                <Button variant="secondary" onClick={() => {
                                    setSearchFormZipcode("");
                                    setSearchFormName("");
                                }} >clear</Button>
                            </Form.Group>
                        </Row>
                        <Table>
                            <thead>
                                <tr>
                                    <th>uid</th>
                                    <th>email</th>
                                    <th>name</th>
                                    <th>zipcode</th>
                                    <th>address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(searchFormZipcode || searchFormName) ? Object.entries(users).filter(([k, v]) => (
                                    v.zipcode && v.name &&
                                    v.zipcode.startsWith(searchFormZipcode) && v.name.includes(searchFormName)
                                )).map(([k, v]) => (
                                    <tr key={k}>
                                        <td>{k}</td>
                                        <td>{<a role="button" className="me-3 text-nowrap" onClick={
                                            (e) => {
                                                setTransferFormTarget(v.email || "");
                                            }
                                        }>{v.email}</a>}</td>
                                        <td>{v.name}</td>
                                        <td>{v.zipcode}</td>
                                        <td>{v.address}</td>
                                    </tr>
                                )) : <tr>
                                    <td colSpan={5}>検索条件を指定してください</td>
                                </tr>}
                            </tbody>
                        </Table>
                        <h3>{CONTEST_DATA[selectedId].name} 付替履歴</h3>
                        <ul>
                            {Object.entries(transfers).map(([k, v]) => (
                                <li key={k}>{v.source} → {v.target} @{format(v.timestamp, "yyyy-MM-dd HH:mm:ss")} {v.name} //{v.memo}</li>
                            ))}
                        </ul>
                    </>}
                    {navtab === "groupOrder" && <>
                        <h2>グループオーダー</h2>
                        <Form validated onSubmit={handleGroupOrder}>
                            <Form.Group className="mb-3" controlId="transfer.target">
                                <Form.Label>Target</Form.Label>
                                <Form.Control type="text" required autoComplete="off" value={groupOrderEmailsText} onChange={(e) => setGroupOrderEmailsText(e.currentTarget.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                        <Table>
                            <thead>
                                <tr>
                                    <th>status</th>
                                    <th>email</th>
                                    <th>uid</th>
                                    <th>info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupOrderEmailsText ? groupOrderEmails.map((email) => {
                                    const user = Object.entries(users).find(([k, v]) => (v.email?.toLowerCase() === email.toLowerCase()));
                                    if (!user) {
                                        return <tr key={email}>
                                            <td>Not found</td>
                                            <td>{email}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    }
                                    const [k, v] = user;
                                    const isPaid = orders[email.replace(/\./g, "=").toLowerCase()];
                                    return <tr key={email}>
                                        <td>{!isPaid ? "OK" : "NG: 支払済！"}</td>
                                        <td>{email}</td>
                                        <td>{k}</td>
                                        <td>{v.name} {v.spot} {v.schoolName || ""}</td>
                                    </tr>
                                }) : <tr>
                                    <td colSpan={4}>対象を指定してください</td>
                                </tr>}
                            </tbody>
                        </Table>
                    </>}
                    <h2>{CONTEST_DATA[selectedId].name} 選抜疑惑</h2>
                    <Button className="mb-3" onClick={() => {
                        navigator.clipboard.writeText(youngAwardUsers.map(([k, v]) => `${v.email}`).join("\n"));
                    }}>{youngAwardUsers.length}件 コピー</Button>
                    <ul>
                        {youngAwardUsers
                            .map(([k, v]) => (
                                <li key={k}>{v.email} {v.name} ({v.birthdate})</li>
                            ))
                        }
                    </ul>
                </>
            }
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