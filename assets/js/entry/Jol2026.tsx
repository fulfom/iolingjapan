import * as React from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip, { TooltipProps } from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { app, auth, db, logout } from "../firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp, off } from "firebase/database"
import { User } from "firebase/auth";

function App() {
    const [step, setStep] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [udb, setUdb] = useState<any | null>(null); // need a proper type definition
    const [paid, setPaid] = useState(false);

    useLayoutEffect(() => {
        // setUser({ email: "test", uid: "" })
        // setUdb({ spot: "" })
        // 現在ログインしているユーザを取得
        auth.onAuthStateChanged(async v => {
            setLoading(20);
            if (v) {
                setUser(v);
                //fetch data from db
                const snapshot = await get(ref(db, "/contests/jol2026/users/" + v.uid));
                setLoading(70);
                const udbtmp = snapshot.val();
                const dbOrderRef = ref(db, "/orders/jol2026/" + v.email!.replace(/\./g, '=').toLowerCase());
                if (udbtmp && udbtmp.email) {
                    setUdb(udbtmp);
                    setStep(1);
                }
                else {
                    const snapshotUser = await get(ref(db, "/users/" + v.uid));
                    const userInfo = snapshotUser.val();
                    setUdb({
                        spot: userInfo?.spot || null,
                        email: v.email,
                        name: userInfo?.name || null,
                        nameRoman: userInfo?.nameRoman || null,
                        birthdate: userInfo?.birthdate || null,
                        preUniv: userInfo?.preUniv || null,
                        isInSchool: userInfo?.isInSchool || true,
                        schoolCode: userInfo?.schoolCode || null,
                        codeNotFound: userInfo?.codeNotFound || null,
                        schoolName: userInfo?.schoolName || null,
                        grade: userInfo?.grade || null,
                        isCertificateNecessary: userInfo?.isCertificateNecessary || null,
                        zipcode: userInfo?.zipcode || null,
                        address: userInfo?.address || null,
                        publish: userInfo?.publish || true,
                        pa: userInfo?.pa || null,
                        motivations: null,
                        motivationText: null,
                    });
                    setStep(0);
                }
                onValue(dbOrderRef, async (snapshotOrder) => {
                    if (snapshotOrder.val()) {
                        setPaid(true);
                        if (udbtmp && udbtmp.email || udb && udb.email) {
                            if (udbtmp && !udbtmp.entry || udb && !udb.entry) {
                                update(ref(db, "/contests/jol2026/users/" + v.uid), { entry: true })
                            };
                            setStep(3);
                            setLoaded(true);
                            off(dbOrderRef);
                        }
                        else setLoaded(true);
                    }
                    else setLoaded(true);
                });
            } else {
                location.href = "/login/";
            }
        });
    }, [])

    //todo: コピペ機能
    const renderTooltip = (props: TooltipProps) => (
        <Tooltip id="button-tooltip" {...props}>
            Copied!
        </Tooltip>
    );

    const infoSubmit = async (e: React.FormEvent<HTMLElement>) => {
        if (!user) return;
        await Promise.allSettled([
            update(ref(db, "/contests/jol2026/users/" + user.uid), {
                ...udb
            }),
            update(ref(db, "/users/" + user.uid), {
                ...udb, motivations: null, motivationText: null,
            })
        ])
        setStep(step === 11 ? 13 : paid ? 3 : 2);
        window.scrollTo(0, 0);
    }

    return (
        <>
            {loaded && user ? <>
                <div className="ArticleToc" id="stepList">
                    <ol>
                        {[
                            <>最新の<i className="fas fa-file-alt fa-fw"></i>受験案内をよく読む</>,
                            <>参加枠の選択 &amp; 個人情報の入力</>,
                            <>受験料の支払い</>,
                            <>応募完了</>
                        ].map((v, i) => (
                            <li
                                key={i}
                                className={step === i || step === i + 10 ? "toc-active" : ""}
                                onClick={() => { if (!paid && step > i) setStep(i) }}
                            >{v}</li>
                        ))}
                    </ol>
                </div>
                {step === 0 ? <div>
                    <p>日本言語学オリンピック（JOL）へご興味を持ってくださり，ありがとうございます．</p>
                    <p><a href="/application/">最新の<span className="unmot"><i className="fas fa-file-alt fa-fw"></i> </span>受験案内をお読みの上，ご応募ください</a>．</p>
                    <button onClick={() => {
                        setStep(1);
                        window.scrollTo(0, 0);
                    }} className="btn btn-template-primary">JOL2026応募に進む</button>
                    <div className="simple-box">
                        <span className="box-title">Q. 応募済なのにこの画面が出ます</span>
                        <p>応募時とは別のアカウントやメールアドレスでログインしているかもしれません．</p>
                        <p>使用中のメールアドレス: {user.email}</p>
                        <button id="logout" onClick={logout} className="btn btn-danger">ログアウト</button>
                    </div>
                    <button onClick={async () => {
                        await update(ref(db, "/contests/jol2026/users/" + user.uid), { isNotNew: true });
                        location.href = "/account/"
                    }} className="btn btn-outline-primary text-decoration-none">過去の成績参照</button>
                </div> : <></>}
                {step === 1 || step === 11 ? <><div>
                    <h3>参加枠の選択</h3>
                    <div className="row">
                        <div className="card col-6">
                            <Button
                                onClick={() => {
                                    setUdb({ ...udb, spot: "flag" })
                                }}
                                variant="template-main"
                                className={["w-100", "shadow-none", (udb.spot === "flag" ? "active" : "")].join(" ")}>
                                <i className="fas fa-flag fa-fw"></i>選抜
                            </Button>
                            <ul>
                                <li>参加資格: 20歳未満かつ大学未入学</li>
                                <li>日本代表選抜の対象</li>
                            </ul>
                        </div>
                        <div className="card col-6">
                            <Button
                                onClick={() => {
                                    setUdb({ ...udb, spot: "award" })
                                }}
                                variant="template-main"
                                className={["w-100", "shadow-none", (udb.spot === "award" ? "active" : "")].join(" ")}>
                                <i className="fas fa-circle-notch fa-fw"></i>オープン
                            </Button>
                            <ul>
                                <li>参加資格: 不問</li>
                                <li>日本代表選抜の対象ではない</li>
                            </ul>
                        </div>
                    </div>
                </div>
                    {udb.spot ? <div>
                        <h3><i className="fas fa-user-edit fa-fw"></i>個人情報の入力</h3>
                        <Form className="needs-validation"
                            onSubmit={(e) => {
                                e.preventDefault();
                                infoSubmit(e);
                                return false;
                            }}
                        // onKeyPress={e => {
                        //     if (e.key === 'Enter') e.preventDefault();
                        // }}
                        >
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>メールアドレス</Form.Label>
                                <Form.Control type="email" value={user?.email || ""} disabled />
                                <Form.Text className="text-muted">
                                    変更不可
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3 was-validated" controlId="formName">
                                <Form.Label>氏名(フルネーム)</Form.Label>
                                <Form.Control required
                                    value={udb?.name || ""}
                                    onChange={(e) => {
                                        setUdb({ ...udb, name: e.currentTarget.value })
                                    }}
                                />
                                <Form.Text className="text-muted">
                                    郵送時の宛名・賞状への記名に用います．
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3 was-validated" controlId="formNameRoman">
                                <Form.Label>氏名(ローマ字)</Form.Label>
                                <Form.Control required pattern="^[0-9A-Za-z\s]+$"
                                    value={udb?.nameRoman || ""}
                                    onChange={(e) => {
                                        setUdb({ ...udb, nameRoman: e.currentTarget.value })
                                    }}
                                />
                                <Form.Text className="text-muted">
                                    半角英数．例) Namae Myouji / MYOUJI Namae<br />こちらで大文字小文字・スペースなどを調整した後，賞状への記名に用います．名字名前の順番やスペルが希望通りか確認してください．
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3 was-validated" controlId="formBirthdate">
                                <Form.Label>生年月日</Form.Label>
                                <Form.Control required
                                    min={udb.spot === "flag" ? "2006-07-28" : ""}
                                    type="date"
                                    value={udb?.birthdate || ""}
                                    onChange={(e) => {
                                        setUdb({ ...udb, birthdate: e.currentTarget.value })
                                    }}
                                />
                                {udb.spot === "flag" ? <Form.Text className="text-muted">
                                    2006年7月28日以降の生まれである必要があります．
                                </Form.Text> : <></>}
                            </Form.Group>
                            {udb.spot === "flag" ?
                                <>
                                    <Form.Group className="mb-3 was-validated" controlId="formPreUniv">
                                        <Form.Check required type="checkbox" label="現在私は大学教育を受けたことがありません"
                                            checked={udb?.preUniv || false}
                                            onChange={(e) => {
                                                setUdb({ ...udb, preUniv: e.currentTarget.checked })
                                            }}
                                        />
                                        <Form.Text className="text-muted">
                                            参加資格確認
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formIsInSchool">
                                        <Form.Check type="checkbox" label="現在学校に通っています"
                                            checked={udb?.isInSchool || false}
                                            onChange={(e) => {
                                                setUdb({ ...udb, isInSchool: e.currentTarget.checked })
                                            }}
                                        />
                                        <Form.Text className="text-muted">
                                            通っていない場合はチェックを外してください．
                                        </Form.Text>
                                    </Form.Group>
                                    {udb?.isInSchool ? <>
                                        {!udb?.codeNotFound ? <Form.Group className="mb-3 was-validated" controlId="formSchoolCode">
                                            <Form.Label>現在の所属学校の学校コード</Form.Label>
                                            <Form.Control required
                                                value={udb?.schoolCode || ""}
                                                onChange={(e) => {
                                                    setUdb({ ...udb, schoolCode: e.currentTarget.value.trim() })
                                                    if (!udb?.schoolName && e.currentTarget.value.match("[A-H][12][0-4][0-9][1-3][1-9][0-9]{7}")) {
                                                        // Todo: Cloud Functions でここを実装
                                                        // fetch("https://api.edu-data.jp/api/v1/single", {method: "GET", headers: {'Authorization': `Bearer: process.env.SCHOOL_CODE_API_TOKEN`, 'Accept': 'application/json', 'school_code': `${e.currentTarget.value}` } })
                                                        //     .then((res) => {
                                                        //         return res.json()
                                                        //     })
                                                        //     .then((json) => {
                                                        //         setUdb((pre) => ({
                                                        //             ...pre,
                                                        //             schoolName: json?.school?.school_name || "",
                                                        //         }))
                                                        //     })
                                                    }
                                                }}
                                                pattern="[A-H][12][0-4][0-9][1-3][1-9][0-9]{7}"
                                            />
                                            <Form.Text className="text-muted">
                                                <a href="https://edu-data.jp/" target="_blank" rel="noopener noreferrer">https://edu-data.jp/ で学校コードを検索しコピペしてください．</a>例: B148210000013
                                            </Form.Text>
                                        </Form.Group> : <></>}
                                        <Form.Group className="mb-3" controlId="formCodeNotFound">
                                            <Form.Check type="checkbox" label="海外の学校に在学などで学校コードが見つかりません"
                                                checked={udb?.codeNotFound || false}
                                                onChange={(e) => {
                                                    setUdb({ ...udb, codeNotFound: e.currentTarget.checked })
                                                }}
                                            />
                                            <Form.Text className="text-muted">
                                                学校コードが見つからない場合はチェック
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="mb-3 was-validated" controlId="formSchoolName">
                                            <Form.Label>現在の所属学校名</Form.Label>
                                            <Form.Control required
                                                value={udb?.schoolName || ""}
                                                onChange={(e) => {
                                                    setUdb({ ...udb, schoolName: e.currentTarget.value })
                                                }}
                                            />
                                            <Form.Text className="text-muted">
                                                正式名称を略さずに記入．
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="mb-3 was-validated" controlId="formGrade">
                                            <Form.Label>現在の学年</Form.Label>
                                            <Form.Control required type="number"
                                                value={udb?.grade || ""}
                                                onChange={(e) => {
                                                    setUdb({ ...udb, grade: e.currentTarget.value })
                                                }}
                                            />
                                            <Form.Text className="text-muted">
                                                数字．
                                            </Form.Text>
                                        </Form.Group>
                                    </> : <></>}
                                </> : <></>}
                            <Form.Group className="mb-3" controlId="formIsCertificateNecessary">
                                <p className="mb-2">賞状の受け取り方</p>
                                <Form.Check
                                    type="radio"
                                    name="isCertificateNecessary"
                                    label="紙の賞状を郵送"
                                    value="paper"
                                    id="isCertificateNecessaryPaper"
                                    inline
                                    checked={!udb?.isCertificateNecessary}
                                    onChange={(e) => {
                                        setUdb({ ...udb, isCertificateNecessary: e.target.value === "e" })
                                    }}
                                />
                                <Form.Check
                                    type="radio"
                                    name="isCertificateNecessary"
                                    label="電子データ（pdf）をメール"
                                    value="e"
                                    id="isCertificateNecessaryE"
                                    inline
                                    checked={udb?.isCertificateNecessary}
                                    onChange={(e) => {
                                        setUdb({ ...udb, isCertificateNecessary: e.target.value === "e" })
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 was-validated" controlId="formZipcode">
                                <Form.Label>郵便番号</Form.Label>
                                <Form.Control required pattern="^[0-9]+$"
                                    value={udb?.zipcode || ""}
                                    onChange={(e) => {
                                        setUdb({ ...udb, zipcode: e.currentTarget.value })
                                    }}
                                />
                                <Form.Text className="text-muted">
                                    半角数字．ハイフン不要．
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3 was-validated" controlId="formAddress">
                                <Form.Label>住所</Form.Label>
                                <Form.Control required
                                    value={udb?.address || ""}
                                    onChange={(e) => {
                                        setUdb({ ...udb, address: e.currentTarget.value })
                                    }}
                                />
                                <Form.Text className="text-muted">
                                    賞状の送付に使用します．
                                </Form.Text>
                            </Form.Group>
                            {udb.spot === "flag" ? <>
                                <Form.Group className="mb-3" controlId="formPublish">
                                    <Form.Check type="checkbox" label="広報目的のため，授賞対象者となった場合は，氏名・所属・学年をウェブページに掲載することに同意します"
                                        checked={udb?.publish || false}
                                        onChange={(e) => {
                                            setUdb({ ...udb, publish: e.currentTarget.checked })
                                        }}
                                    />
                                    <Form.Text className="text-muted">
                                        同意しない場合はチェックしないでください．
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3 was-validated" controlId="formPa">
                                    <Form.Check required type="checkbox" label="JOL2026への参加にあたって私は保護者に有効な同意を得ています"
                                        checked={udb?.pa || false}
                                        onChange={(e) => {
                                            setUdb({ ...udb, pa: e.currentTarget.checked })
                                        }}
                                    />
                                </Form.Group></> : <></>}
                            <h3>アンケート（任意）</h3>
                            <h4>言語学オリンピックをどこで知りましたか</h4>
                            {
                                ["友人・先輩", "学校の先生", "家族", "塾", "YouTube", "ツイッター（X）", "インスタグラム", "テレビ", "雑誌・新聞", "インターネット上のサイト", "JOL公式サイト", "JOL公式ハンドアウト", "書籍『パズルで解く世界の言語』"].map((v, i) => (
                                    <Form.Check
                                        inline
                                        label={v}
                                        name="group1"
                                        type="checkbox"
                                        id={`motivations-${i}`}
                                        key={`motivations-${i}`}
                                        checked={udb?.motivations && udb?.motivations[i] || false}
                                        onChange={(e) => {
                                            let motivationsTmp: boolean[] = udb?.motivations ? udb?.motivations : [];
                                            motivationsTmp[i] = e.currentTarget.checked;
                                            setUdb({ ...udb, motivations: motivationsTmp })
                                        }}
                                    />
                                ))
                            }
                            <Form.Group className="mb-3" controlId="formMotivationText">
                                <Form.Label>その他の手段・詳細（YouTube のチャンネル名など）</Form.Label>
                                <Form.Control
                                    value={udb?.motivationText || ""}
                                    onChange={(e) => {
                                        setUdb({ ...udb, motivationText: e.currentTarget.value })
                                    }}
                                />
                            </Form.Group>
                            <Button type="submit" className="w-100" variant="template-primary">
                                更新して次へ
                            </Button>
                        </Form>
                        {step === 1 ? <Button onClick={() => { setStep(0) }}>戻る</Button> : <></>}
                    </div> : <></>}</> : <></>}
                {step === 2 ? <div>
                    <h3>受験料の支払い</h3>
                    <p>以下の手順にしたがって進めてください．</p>
                    <p>
                        1. 受験料支払い用のサイト（Stores）にアクセス<br />
                        2. 「日本言語学オリンピック2026受験料」をカートに入れる
                    </p>
                    <figure>
                        <img src="/img/jol2022/stores1.png" alt="" loading="lazy" />
                    </figure>
                    <p>3. 注文画面へ進む</p>
                    <figure>
                        <img src="/img/jol2022/stores2.png" alt="" />
                    </figure>
                    <p>4. 購入者情報を入力</p>
                    <figure>
                        <img src="/img/jol2022/stores3.png" alt="" />
                    </figure>
                    <div className="alert alert-primary" role="alert" >
                        <p><i className="fas fa-exclamation-triangle text-muted fa-fw"></i>↓メールアドレスの欄には必ず応募に使用しているメールアドレスをご入力ください．以下をコピー&amp;ペーストすることをおすすめします．</p>
                        <p>お使いのメールアドレス: <span className="unmot">{user.email}
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 0, hide: 0 }}
                                overlay={renderTooltip}
                                trigger="focus"
                            >
                                <Button
                                    variant="template-primary"
                                    className="d-inline-block btn-small ms-3"
                                    onClick={() => { navigator.clipboard.writeText(user!.email || "") }}>
                                    <i className="fas fa-clipboard fa-fw"></i>コピー
                                </Button>
                            </OverlayTrigger></span>
                        </p>
                        <figure>
                            <img src="/img/jol2022/stores4.png" alt="" />
                        </figure>
                    </div>
                    <p>
                        5. 指示に従って支払いを済ませる<br />
                        6. 支払いが確認されるまで本ページ上でお待ちください．
                    </p>
                    <p><a className='btn btn-template-primary text-decoration-none' href="https://iolingjapan.stores.jp/items/68dc04f33c52b729a96aa19b" target="_blank">受験料支払い用のサイトへ</a></p>
                    <div className="simple-box">
                        <span className="box-title">進まない場合</span>
                        <ul>
                            <li>コンビニ決済・銀行振込の場合，コンビニや銀行で受験料をお支払いいただき，こちらで入金が確認でき次第，応募完了となります．</li>
                            <li>支払いの確認に数分かかります．電波状況などによってはもう少しかかります．数分たっても画面が変わらない場合は一度ページを再読み込みしてみてください．</li>
                            <li>応募と支払いで異なるメールアドレスを使用した場合，支払いの確認が取れません．その場合は，<strong>支払いで使用したメールアドレス</strong>から委員会に以下の内容を含むメールを送信してください．</li>
                            <ul>
                                <li>氏名</li>
                                <li>応募で使用したメールアドレス</li>
                                <li>受験料振替の旨</li>
                                <li>支払いで使用したメールアドレスが分からない，間違えた場合は，代わりにオーダー番号</li>
                            </ul>
                            <li>メールアドレスに不備もなく，10分経ったが進まない場合は，委員会に問い合わせてください．</li>
                        </ul>
                    </div>
                    <Button onClick={() => { setStep(1) }} variant="template-main">戻る</Button>
                </div> : <></>}
                {step === 3 || step === 4 || step === 13 ? <div>
                    {step === 3 ? <>
                        <h3>応募完了</h3>
                        <p>ご応募ありがとうございます．</p>

                    </> : <>
                        <h3>個人情報の更新完了</h3>
                        <p>個人情報の更新が完了しました．</p>
                    </>}
                    <div className="simple-box">
                        <span className="box-title">メールアドレスの記録</span>
                        <p>今後別の Google アカウント/メールアドレスで間違えてログインしないよう，応募で使用したメールアドレスをメモやスクリーンショットで記録することをおすすめします．</p>
                        <p>JOL2026の応募に使用したメールアドレス: {user.email}</p>
                    </div>
                    <p>個人情報は応募締切日まで訂正ができます．</p>
                    <p>選抜枠: {udb.spot === "flag" ? "選抜" : "オープン"}</p>
                    <Button
                        variant="template-main"
                        onClick={() => setStep(11)}
                    >
                        個人情報の確認・訂正
                    </Button>
                    <Button
                        variant="template-primary"
                        className="ms-3"
                        href="/account/"
                        as="a"
                    >
                        → 応募者ページへ
                    </Button>
                </div> : <></>}
            </> : <><p>読み込み中</p>
                <ProgressBar now={loading} />
            </>}
        </>
    );
}

const root = createRoot(document.getElementById("react")!);

root.render(
    <App />,
);