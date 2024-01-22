import { app, auth, db, logout } from "./firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import CONTESTS_DATA from "../data/contests.json";
import { User } from "firebase/auth";
import { Accordion } from "react-bootstrap";

const FEATURES_CONFIG = [
    {
        weight: 1,
        name: "大会",
        id: "features-contests",
        icon: "puzzle-piece",
        link: "#contests",
    },
    {
        weight: 2,
        name: "結果",
        id: "features-results",
        icon: "trophy",
        link: "#results",
    }
]

type contestConfigType = {
    id: string;
    title: string;
    desc1?: string;
    date?: string;
    desc2?: string;
    detail?: string;
    entry?: string;
    entryui?: string;
    limited?: boolean;
    result?: string;
    record?: string;
    site?: string;
    demosite?: string;
    status: string;
    visible?: {
        badge?: string;
        spot?: string;
    };
};

const statusButton = (config: contestConfigType, isEntried?: boolean) => {
    switch (config.status) {
        case "pre":
            return <button disabled className="btn btn-outline-dark float-end">{config.limited ? <><i className="fas fa-flag fa-fw"></i>要選抜</> : <>開催予定</>}</button>
        case "entryopen":
            return !isEntried ?
                <><a href={config.entry} className="btn btn-primary float-end" role="button"><i className="fas fa-file-alt fa-fw"></i>応募</a></> :
                <><button disabled className="btn btn-outline-success float-end"><i className="fas fa-check-circle fa-fw"></i>応募済</button></>
        case "demositeopen":
            return isEntried ?
                <a href={config.demosite} className="btn btn-primary float-end" role="button"><i className="fas fa-puzzle-piece fa-fw"></i>事前準備</a> :
                <button disabled className="btn btn-outline-dark float-end">応募終了</button>
        case "siteopen":
            return isEntried ?
                <a href={config.site} className="btn btn-primary float-end" role="button"><i className="fas fa-puzzle-piece fa-fw"></i>競技会場</a> :
                <button disabled className="btn btn-outline-dark float-end">応募終了</button>
        case "marking":
            return <button disabled className="btn btn-outline-dark float-end">採点中</button>
        case "resultopen":
            return <a href={config.result} className="btn btn-info float-end" role="button"><i className="fas fa-trophy fa-fw"></i>結果公開</a>
        default:
            break;
    }
}

// const logoutButton = <button onClick={logout} className="btn btn-danger btn-small mt-5">ログアウト</button>

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [[badges, isBadgesLoaded], setBadges] = useState<[{ [key: string]: boolean } | null, boolean]>([null, false]);
    const [userInfo, setUserInfo] = useState<{ [key: string]: unknown } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [[notPaid, isNotPaidLoaded], setNotPaid] = useState([true, false]);
    const [contUserInfo, setContUserInfo] = useState<{ [key: string]: { [key: string]: unknown } } | null>(null)

    const contest = (config: contestConfigType, isEntried: boolean = false) => {
        const configBadge = config.visible?.badge;
        const configSpot = config.visible?.spot;

        const isVisible = isAdmin || (configBadge ? badges && badges[configBadge] : true) && (configSpot ? userInfo?.spot === configSpot : true)

        return isVisible && <div className="list-group-item appSys-contest" key={config.id}>
            <div>
                {statusButton(config, isEntried)}
                <div>
                    <small>{config.desc1}</small>
                    {config.desc2 ? <small className="ms-1">{config.desc2.split("|").map((desc2) => (<span className="unmot" key={desc2}>{desc2}</span>))}</small> : <></>}
                </div>
            </div>
            <h5 className="text-moderate mt-1">{config.title}</h5>
            {config.detail ? <a className="card-link" href={config.detail}>詳細</a> : <></>}
            {config.status === "entryopen" && isEntried && (config.entryui || config.entry) && <a className="card-link" href={config.entryui || config.entry}><i className="fas fa-user-edit fa-fw"></i>確認</a>}
            {config.status === "siteopen" && isEntried && config.demosite && <a href={config.demosite} className="card-link" ><i className="fas fa-puzzle-piece fa-fw"></i>事前準備</a>}
            {config.record ? <a className="card-link" href={config.record}>データ</a> : <></>}
        </div>
    }

    const loadingContest = <div className="list-group-item appSys-contest placeholder-glow">
        <div>
            <div>
                <small className="placeholder w-50"></small>
            </div>
        </div>
        <h5 className="text-moderate mt-1 placeholder w-25"></h5>
        <p className="placeholder w-100"></p>
    </div >

    const contests = (
        <div id="account-contests" className="row">
            <div className="col-lg-6">
                <h3 id="contests">大会</h3>
                <div id="account-upcoming-contests" className="list-group list-group-flush mb-2">
                    {isBadgesLoaded ? CONTESTS_DATA.upcomingContests
                        .sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()))
                        .map((v) => (
                            contest(v,
                                v.status === "entryopen" ? !!contUserInfo?.[v.id]?.entry : !notPaid)
                        )) :
                        loadingContest}
                </div>
            </div>
            <div className="col-lg-6">
                <h3 id="results">結果</h3>
                <div id="account-past-contests" className="list-group list-group-flush mb-2">
                    {isBadgesLoaded ?
                        CONTESTS_DATA.pastContests
                            .sort((a, b) => (- new Date(a.date).getTime() + new Date(b.date).getTime()))
                            .map((v) => (
                                contest(v)
                            )) :
                        loadingContest
                    }
                </div>
            </div>
        </div>)

    const adminPortalLink = isAdmin ? <a href="/admin-portal/" className="btn btn-info btn-small" role="button">管理者ポータル</a> : <></>

    const messagePreOrder = <div className="simple-box">
        <span className="box-title"><i className="fas fa-exclamation-triangle fa-fw"></i>注意</span>
        <p>JOL2024の応募完了までもう一歩です</p>
        <ol>
            <li>
                <p>応募途中の場合</p>
                <p><a href="/entry/jol2024/">→こちらから応募手続きを続けてください．</a></p>
            </li>
            <li>
                <p>ログインするアカウントを間違えている場合</p>
                <p>→正しいアカウントでログインしなおしてください．</p>
                <div className="d-flex align-items-baseline">
                    <p>今お使いのメールアドレス: <span className="user-select-all">{user?.email || ""}</span></p>
                    <button onClick={logout} className="btn btn-danger btn-small ms-auto">ログアウト</button>
                </div>
            </li>
            <li>
                <p>受験料の支払い確認が取れない場合</p>
                <div className="simple-box m-0">
                    <ul>
                        <li>コンビニ決済・銀行振込の場合，コンビニや銀行で受験料をお支払いいただき，こちらで入金が確認でき次第，応募完了となります．</li>
                        <li>応募と支払いで異なるメールアドレスを使用した場合，支払いの確認が取れません．その場合は，<strong>支払いで使用したメールアドレス</strong>から委員会 <a href="mailto:jol@iolingjapan.org">jol@iolingjapan.org</a> に以下の内容を含むメールを送信してください．</li>
                        <ul>
                            <li>氏名</li>
                            <li>応募で使用したメールアドレス</li>
                            <li>受験料振替の旨</li>
                            <li>支払いで使用したメールアドレスが分からない，間違えた場合は，代わりにオーダー番号</li>
                        </ul>
                    </ul>
                </div>
            </li>
        </ol>
    </div>

    const emails = useMemo(() =>
        <div className="simple-box">
            <span className="box-title">応募者向けメール履歴</span>
            <Accordion flush>
                <Accordion.Item eventKey="3">
                    <Accordion.Header as="p">2024/01/22 17:30: JOL2024結果発表</Accordion.Header>
                    <Accordion.Body>
                        <p className="mb-3">JOL2024応募者のみなさま，</p>
                        <p className="mb-3">JOL2024の結果を公開いたしました．</p>
                        <p>個人成績: <a href="https://iolingjapan.org/result/jol2024/">https://iolingjapan.org/result/jol2024/</a></p>
                        <p className="mb-3">全体結果: <a href="https://iolingjapan.org/record-jol/">https://iolingjapan.org/record-jol/</a></p>
                        <p className="mb-3">採点結果の最終調整のため，結果発表が遅れましたことをお詫び申し上げます．</p>
                        <p className="mb-3">問題は楽しんでいただけたでしょうか？</p>
                        <p className="mb-3">再ダウンロードできるリンクをお送りします．諸事情のため，問題はまだ公式サイトに公開できませんが，参加者同士であれば中身について話し合っても構いません（SNS等での共有はまだできません）．競技中時間がなくて解けなかった問題など，じっくり解きなおしてみると楽しいと思います．</p>
                        <p className="mb-3">問題: <a href="https://drive.google.com/file/d/1RbPcK0RFvl56PbhXNXzNSEzBgT8vlo90/view">https://drive.google.com/file/d/1RbPcK0RFvl56PbhXNXzNSEzBgT8vlo90/view</a></p>
                        <p className="mb-3">※なお，第5問について，誤植がありました．心よりお詫び申し上げます．この点について採点基準の調整は済んでいます．</p>
                        <p className="mb-3">11. 誤: atupa sia re woban; 正: atupa sia ye woban;</p>
                        <p className="mb-3">これからもより良い問題を作成し，言語学の世界や世界の言語への間口が広がるかもしれない機会を提供できるよう取り組み続けていきたいと思います．</p>
                        <p className="mb-3">今後とも言語学オリンピックをよろしくお願いいたします．</p>
                        <p>国際言語学オリンピック日本委員会</p>

                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header as="p">2023/12/29 10:00: JOL2024競技会場ページ公開</Accordion.Header>
                    <Accordion.Body>
                        <p className="mb-3">JOL2024応募者のみなさま，</p>
                        <p className="mb-3">JOL2024本番で使う競技会場ページを公開いたしました．</p>
                        <p className="mb-3">競技会場ページで待機の上，13:00に問題pdfが閲覧できるようになったら各自解き始めてください．</p>
                        <p className="mb-3"><a href="https://iolingjapan.org/contest/jol2024/contest/">https://iolingjapan.org/contest/jol2024/contest/</a></p>
                        <p className="mb-3">※ログインが必要です．ログインしてもアクセスできない場合，メールアドレスを間違えている可能性があります．その場合は，このメールを受け取ったメールアドレスでログインしなおしてみてください．</p>
                        <p className="mb-3">2点重要な注意事項をお知らせします．</p>
                        <p><strong>不正行為について</strong></p>
                        <p>不正行為は偽計業務妨害にあたり，違法行為です．</p>
                        <p>ここ数年間のオンライン競技で，不正行為によって失格した者はゼロではありません．</p>
                        <p>競技者本人が，他者の助けを得たり，外部資料を参照したりすることなく参加してください．</p>
                        <p>不正行為が疑われる場合，所属校にその旨を通知するなどの処置を取ります．</p>
                        <p>不正行為が疑われる場合には追加調査を行う可能性がありますが，追加調査に協力しなかった場合は失格とします．</p>
                        <p className="mb-3"></p>
                        <p><strong>問題pdfと解答用ページ閲覧のトラブルについて</strong></p>
                        <p>事前準備ページで問題pdfと解答用ページが閲覧・操作できている方は問題ありません．</p>
                        <p>事前準備ページで動作確認を行っていない場合，競技時間中にトラブルが生じても対応しきれない可能性があります．</p>
                        <p className="mb-3">よくある回避策: 問題pdfや解答用ページにアクセスする際に，シークレットモード/シークレットウィンドウで開くことで，アクセスできるようになるケースがあります．</p>
                        <p className="mb-3">そのほか，動作確認期間中にいただいたよくある質問の解答を掲載いたします．</p>
                        <ul>
                            <li>解答用ページ（グーグルスプレッドシート）は提出操作不要です．競技時間が終了したら解答用ページと競技会場を閉じて解散して構いません．</li>
                            <li>↑が使えず，代わりに解答用エクセルをダウンロードして記入した場合に限り，競技時間内に解答用エクセルのメール提出が必要です．詳しくは競技会場ページの「（予備）解答用ページが使えない場合」を押して案内をお読みください．</li>
                            <li>問題pdfの印刷の際に，プリンターのトラブルが生じたなどの理由で，問題を解く以外の範囲で他者の助けを借りるのは構いません．</li>
                        </ul>
                        <p>なにかトラブルが生じた場合は委員会にお問い合わせください．</p>
                        <p className="mb-3"><a href="mailto:jol@iolingjapan.org">jol@iolingjapan.org</a></p>
                        <p className="mb-3">それでは，本番お楽しみください．よろしくお願いいたします．</p>
                        <p>国際言語学オリンピック日本委員会</p>

                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header as="p">2023/12/23 02:15: JOL2024事前準備ページ公開</Accordion.Header>
                    <Accordion.Body>
                        <p className="mb-3">JOL2024応募者のみなさま，</p>
                        <p className="mb-3">JOL2024事前準備ページを公開いたしました．</p>
                        <p className="mb-3"><a href="https://iolingjapan.org/contest/jol2024/demo/">https://iolingjapan.org/contest/jol2024/demo/</a></p>
                        <p className="mb-3">※ログインが必要です．ログインしてもアクセスできない場合，メールアドレスを間違えている可能性があります．その場合は，このメールを受け取ったメールアドレスでログインしなおしてみてください．</p>
                        <p>なにかトラブルが生じた場合は委員会にお問い合わせください．</p>
                        <p className="mb-3"><a href="mailto:jol@iolingjapan.org">jol@iolingjapan.org</a></p>
                        <p className="mb-3">それでは，よろしくお願いいたします．</p>
                        <p>国際言語学オリンピック日本委員会</p>

                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="0">
                    <Accordion.Header as="p">2023/12/20 22:50: 日本言語学オリンピック 今後のスケジュール</Accordion.Header>
                    <Accordion.Body>
                        <p className="mb-3">JOL2024応募者のみなさま，</p>
                        <p className="mb-3">このたびは日本言語学オリンピックにご応募いただきありがとうございます．</p>
                        <p>今後のスケジュールについてご連絡いたします．</p>
                        <ul className="mb-3">
                            <li>12月22日（予定）「JOL2024事前準備」ページ公開</li>
                            <li>12月23日～28日 動作確認期間</li>
                            <li>12月29日 「JOL2024競技会場」ページ公開</li>
                        </ul>
                        <p className="mb-3">まず，22日に公開予定の「JOL2024事前準備」ページでは，当日とほとんど同じ環境で競技の体験ができるようになっています．具体的には1. 問題（体験版）pdfの閲覧，2. 解答の入力（スプレッドシートまたはエクセル），3. 競技中の質問投稿・訂正の確認，4. 当日の流れと注意事項の説明，以上4点が可能です．</p>
                        <p className="mb-3">ごくまれに問題が閲覧できないなどのトラブルがありますので，あらかじめ事前準備ページにアクセスしていただき，動作確認と練習を行っていただくようお願いいたします．</p>
                        <p className="mb-3">29日になりましたら，「JOL2024競技会場」ページが公開されます．12時30分～競技開始までの間にこちらのページにアクセスしてください．13:00になりましたら競技がスタートし，問題pdfの閲覧と解答入力が可能になります．2時間楽しんでいただければ幸いです．</p>
                        <p className="mb-3">15:00になりましたら，競技終了・解散となります．結果は競技2週間後をめどに発表する予定です．</p>
                        <p className="mb-3">解答入力の方法など，細かい点は事前練習ページに案内を掲載いたしますので，そちらをご確認ください．22日と29日のページ公開の際には再度メールでご連絡を差し上げます．</p>
                        <p className="mb-3">それでは，よろしくお願いいたします．</p>
                        <p>国際言語学オリンピック日本委員会</p>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>, [])

    const news = useMemo(() => <div className="simple-box">
        <span className="box-title">お知らせ</span>
        {!notPaid && <p>2023/12/22: <a>JOL2024の事前準備ページを公開しました．</a></p>}
        {!notPaid && <p>2023/12/29: <a>JOL2024本番で使う競技会場ページを公開しました．</a></p>}
        <p>2023/12/29: JOL2024本番終了</p>
        <p>2024/01/22: JOL2024結果発表</p>
    </div>, [notPaid])

    const message2 = useMemo(() => <div className="simple-box">
        <span className="box-title"><i className="fas fa-exclamation-triangle fa-fw"></i>注意</span>
        <p>ログインするアカウントを間違えている可能性があります．</p>
        <p>→正しいアカウントでログインしなおしてください．</p>
        <div className="d-flex align-items-baseline">
            <p>今お使いのメールアドレス: <span className="user-select-all">{user?.email || ""}</span></p>
            <button onClick={logout} className="btn btn-danger btn-small ms-auto">ログアウト</button>
        </div>
    </div>, [user])

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                for (const cont of CONTESTS_DATA.upcomingContests) {
                    if (cont.status === "demositeopen" || cont.status === "siteopen" || cont.status === "marking") {
                        const paidSnapshot = await get(ref(db, `/orders/${cont.id}/` + user.email!.replace(/\./g, '=').toLowerCase()));
                        if (paidSnapshot.val()) {
                            setNotPaid([false, true]);
                        }
                        else {
                            setNotPaid([true, true]);
                        }
                    }
                    else if (cont.status === "entryopen") {
                        const contSnapshot = await get(ref(db, "/contests/" + cont.id + "/users/" + user.uid));
                        const contestantInfo = contSnapshot.val();
                        if (!contestantInfo) {
                            location.replace("/entry/" + cont.id);
                        }
                        else {
                            // 支払いが完了しているのに，参加者情報が不完全な場合は応募ページに飛ばす．
                            if (!contestantInfo.entry) {
                                const paidSnapshot = await get(ref(db, `/orders/${cont.id}/` + user.email!.replace(/\./g, '=').toLowerCase()));
                                if (paidSnapshot.val()) {
                                    location.replace("/entry/" + cont.id);
                                }
                            }
                            setContUserInfo((pre) => ({ ...pre, [cont.id]: contestantInfo }));
                        }
                    }
                }

                const promiseBadge = (async () => {
                    const snapshot = await get(ref(db, "/badges/" + user.uid));
                    setBadges([snapshot.val(), true]);
                })();
                const promiseUserInfo = (async () => {
                    const snapshot = await get(ref(db, "/users/" + user.uid));
                    setUserInfo(snapshot.val());
                    if (snapshot.val()?.admin) {
                        const adminRef = await get(ref(db, "/admin/" + user.uid));
                        setIsAdmin(adminRef.val());
                        if (!adminRef.val()) {
                            await update(ref(db, "/users/" + user.uid), { admin: null });
                        }
                    }
                    else if (snapshot.val()) {
                        // console.log("normal")
                    }
                    else {
                        await update(ref(db, "/users/" + user.uid), {
                            email: user.email
                        });
                    }

                })();
                await Promise.all([promiseBadge, promiseUserInfo]).catch((e) => {
                    console.error(e);
                    alert("エラー");
                });

                // document.getElementsByTagName("body").item(0)!.style.opacity = "1";
            }
            else {
                location.replace("/login/");
            }
        });

        return () => {
            // setUser(null);
            unsubscribed();
        };
    }, []);
    return <div>
        {isNotPaidLoaded ? <>
            {news}
            {!notPaid && emails}
            {notPaid && message2}
        </> :
            <div className="simple-box placeholder-glow">
                <span className="box-title placeholder col-1"></span>
                <p className="placeholder w-100"></p>
                <p className="placeholder w-75"></p>
                <p className="placeholder w-50"></p>
            </div>}
        {adminPortalLink}
        {isAdmin ? <a href="/contest/jol2024/contest-admin/" className="btn btn-info btn-small ms-3" role="button">JOL2024本番Admin</a> : <></>}
        {isAdmin ? <a href="/contest/jol2024/demo-admin/" className="btn btn-info btn-small ms-3" role="button">JOL2024デモAdmin</a> : <></>}
        {contests}
        <div className="mt-5">
            {user ?
                <span className="me-3">{user.email + " でログイン中"}</span> :
                <span className="me-3 placeholder-glow placeholder w-25"></span>
            }
            <button onClick={logout} className="btn btn-danger btn-small">ログアウト</button>
        </div>
    </div>
}

const root = createRoot(document.getElementById("app")!);

root.render(
    <App />
);
