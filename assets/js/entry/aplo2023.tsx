import { app, auth, db } from "../firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import React, { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"

function App() {
    const [editting, setEditting] = useState(false);
    const [formValue, setFormValue] = useState([]);
    const [udb, setUdb] = useState<{ [key: string]: unknown } & { [key in "email" | "birthdate" | "name"]?: string | null } | null>(null)

    const infoSubmit = async (e: React.FormEvent<HTMLElement>) => {
        const user = auth.currentUser;
        if (!user) return;
        await Promise.all([
            update(ref(db, "/contests/jol2023/formValues/" + user.uid + "/aplo2023/"), {
                ...formValue
            }),
        ])
        setEditting(false);
        alert("ありがとうございます．回答を受け付けました．間違いがあった場合は締切日までは変更可能ですので，再度回答してください．")
    }

    useLayoutEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const snapshot = await get(ref(db, "/contests/jol2023/formValues/" + user.uid + "/aplo2023/"));
                const val = snapshot.val();
                if (val) {
                    setFormValue(val);
                }
                const snapshot2 = await get(ref(db, "/contests/jol2023/users/" + user.uid));
                const udbVal = snapshot2.val();
                if (udbVal) {
                    setUdb(udbVal);
                }
            }
            else {
                location.href = "/account/";
            }
        })
    }, [])

    if (!udb?.email) {
        return <>読み込み中</>
    }
    return (<>
        <h2>APLO2023参加意思の確認</h2>
        <p><b>趣旨説明</b>: JOL選抜枠はAPLOやIOL出場を希望しない方も参加できます．そのため，（IOL2次選抜としての）APLOの参加者数はこちらの予想より少なくなります．その参加者の分，より多くの2次選抜参加者をとるため，アンケートを実施することになりました．</p>
        <p><b>締切</b>: <strong>2023年1月23日まで</strong>に回答をお願いします．</p>
        <p>APLO2023は2023年4月9日（日）に対面で開催される予定です．日本会場は東京のみの予定です．</p>
        <p>※このアンケートはあくまで参加意思を確認するもので，アンケートに答えた方が必ずAPLOに進めるとは限りません．このページでの回答によってAPLOに出場できなくなることはありません．回答はAPLOボーダー決定の参考にしますので，正確に正直に答えてください．</p>
        <hr />
        <p className="h6"><i className="fas fa-user fa-fw"></i>競技者情報</p>
        <table className="list-like">
            <tbody>
                <tr><td>メールアドレス</td><td>{udb?.email}</td></tr>
                <tr><td>氏名</td><td>{udb?.name}</td></tr>
                <tr><td>生年月日</td><td>{udb?.birthdate}</td></tr>
            </tbody>
        </table>
        <p>※競技者情報に間違いがあればメールで連絡してください．</p>
        <hr />
        <Form className="needs-validation"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.currentTarget.checkValidity() === false) {
                    return false;
                }
                infoSubmit(e);
                return false;
            }}
            onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault();
            }}
        >
            {[
                {
                    id: "qual",
                    label: "次のIOLの参加資格を満たさなくなる可能性はありますか？",
                    desc: "参加資格は2023年7月25日時点で20歳未満かつ大学未入学です．9月入学予定の受験生や，受験生でない方は「ない」にチェックしてください．2023年4月に大学に入学する可能性のある受験生は，合否がまだ分からなくても「ある」にチェックしてください．",
                    checks: [
                        {
                            label: "可能性はない",
                            value: "no"
                        },
                        {
                            label: "可能性はある",
                            value: "yes"
                        },
                    ]
                },
                {
                    id: "face",
                    label: "APLOが対面開催の場合，会場（東京）に出てくる意思はありますか？",
                    desc: "APLO開催時に海外にいる場合はメールで個別にご相談ください（滞在国の会場でAPLOに参加できる可能性があります）．",
                    checks: [
                        {
                            label: "ある",
                            value: "yes",
                        },
                        {
                            label: "ない",
                            value: "no",
                        },
                        {
                            label: "海外にいる",
                            value: "abroad",
                        },
                    ],
                },
                {
                    id: "online",
                    label: "万が一APLOがオンライン開催の場合，参加する意思はありますか？",
                    desc: "",
                },
                {
                    id: "repr",
                    label: "APLO上位だった場合，必要な費用を支払い，代表になる意思はありますか？",
                    desc: "",
                    checks: [
                        {
                            label: "ある",
                            value: "yes",
                        },
                        {
                            label: "興味はあるが確証はできない",
                            value: "intersted",
                        },
                        {
                            label: "ない",
                            value: "no",
                        },
                    ],
                },
                {
                    id: "alt",
                    label: "APLO上位だった場合，自費で補欠になる意思はありますか？",
                    desc: "補欠は参加費・渡航費の補助は出ませんが，事前練習に参加，現地に同行し，欠員が出た場合は代表として参加します．",
                    checks: [
                        {
                            label: "ある",
                            value: "yes",
                        },
                        {
                            label: "興味はあるが確証はできない",
                            value: "intersted",
                        },
                        {
                            label: "ない",
                            value: "no",
                        },
                    ]
                },
            ].map((v, i) => (
                <Form.Group className="mb-3" controlId={`form${i}`} key={i}>
                    <p className="h6">{i + 1}. {v.label}</p>
                    {v.desc ? <p className="text-muted">{v.desc}</p> : <></>}
                    {(v.checks ? v.checks : [
                        {
                            label: "ある",
                            value: "yes"
                        },
                        {
                            label: "ない",
                            value: "no"
                        }
                    ]).map((choice) => (
                        <Form.Check type="radio" label={choice.label} name={v.id} key={choice.value} id={`form${i}-${choice.value}`} inline required
                            checked={formValue[v.id] === choice.value}
                            onChange={(e) => {
                                setEditting(true);
                                setFormValue({ ...formValue, [v.id]: choice.value })
                            }}
                        />
                    ))}
                </Form.Group>
            ))}

            <Button type="submit" className="w-100" variant="template-primary" disabled={!editting}>
                更新
            </Button>
        </Form>
    </>)
}

const root = createRoot(document.getElementById("app")!);

root.render(
    <App />,
);