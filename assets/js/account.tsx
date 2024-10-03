import { app, auth, db, logout } from "./firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import CONTESTS_DATA from "../data/contests.json";
import { User } from "firebase/auth";
import { Badge, Button, Modal, ModalProps, Stack, Table } from "react-bootstrap";
import { emails } from "./messages"

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
    public?: boolean;
    probCount?: number;
};

const CONFIG_AWARD: {
    [key: string]: {
        name: string;
        color: string;
    }
} = {
    gold: {
        name: "金賞",
        color: "#eee7cc"
    },
    silver: {
        name: "銀賞",
        color: "#eee"
    },
    bronze: {
        name: "銅賞",
        color: "#edc"
    },
    honourable: {
        name: "努力賞",
        color: "#dcedc8"
    },
    grand: {
        name: "最優秀賞",
        color: "#eee7cc"
    },
    junior: {
        name: "ジュニア奨励賞",
        color: "#dcedc8"
    },
    area: {
        name: "地区賞",
        color: "#dcedc8"
    },
    hm: {
        name: "敢闘賞",
        color: "#dcedc8"
    },
}

type History = {
    [key: string]: {
        spot?: "flag" | "award",
        qualified?: boolean,
        attend?: boolean,
        onhold?: boolean,
        award?: string[],
        teamAward?: string[],
        sum?: number[],
        score?: number[], // for compatibility
        rank?: number, // used for APLO and the "grand" award
        area?: string,
    }
} & {
    admin?: {
        value: boolean,
        email: string,
    }
}

const CONTESTS_DATA_OBJ: { [key: string]: contestConfigType } = Object.fromEntries([...(CONTESTS_DATA.hideContests || []), ...(CONTESTS_DATA.pastContests || []), ...(CONTESTS_DATA.upcomingContests || [])].map((v) => ([v.id, v])))

function ResultModal(props: ModalProps & { fullHistory: History | null, contestId: string }) {
    const { fullHistory, contestId, ...modalProps } = props;

    const CONTEST_DATA = CONTESTS_DATA_OBJ[contestId];
    if (!CONTEST_DATA) {
        return <></>
    }
    const history = fullHistory && fullHistory[contestId];
    if (!history) {
        alert("結果がありません")
        return <></>
    }
    const [total, ...probSum]: number[] = history.sum || [];
    const award: string[] = history.award && history.award.length > 0 && history.award || []
    const color = award.length > 0 && CONFIG_AWARD[award[0]] && CONFIG_AWARD[award[0]].color || ""

    return (
        <Modal
            {...modalProps}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {CONTEST_DATA.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className={`fs-1 centralize py-3 ${award[0]}`}>
                    {award.map((v) => (CONFIG_AWARD[v].name)).join("，")}
                    {history.rank &&
                        <>{history.rank}位</>}
                </p>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>合計</th>
                            {[...Array(CONTEST_DATA.probCount || 5)].map((v, i) => <th key={i}>{i + 1}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{total}</td>
                            {probSum.map((v, i) => <td key={i}>{v}</td>)}
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}

const statusButton = (handleModalShow: (id: string) => (void), config: contestConfigType, isEntried: boolean) => {
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
            return config.result ?
                <a href={config.result} className="btn btn-info float-end" role="button"><i className="fas fa-trophy fa-fw"></i>結果公開</a> :
                <Button variant="info" className="float-end" onClick={() => handleModalShow(config.id)}><i className="fas fa-trophy fa-fw"></i>結果公開</Button>
        default:
            break;
    }
}

// const logoutButton = <button onClick={logout} className="btn btn-danger btn-small mt-5">ログアウト</button>

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    // const [[badges, isBadgesLoaded], setBadges] = useState<[{ [key: string]: boolean } | null, boolean]>([null, false]);
    const [[history, isHistoryLoaded], setHistory] = useState<[History | null, boolean]>([null, false]);
    // const [userInfo, setUserInfo] = useState<{ [key: string]: unknown } | null>(null);
    // const [isAdmin, setIsAdmin] = useState(false);
    const [[isPaid, isIsPaidLoaded], setIsPaid] = useState([false, false]);
    // const [contUserInfo, setContUserInfo] = useState<{ [key: string]: { [key: string]: unknown } } | null>(null)
    const [[isEntried, isIsEntriedLoaded], setIsEntried] = useState([false, false]);

    const isAdmin: boolean = history && history.admin && history.admin.value || false;
    const [modalShow, setModalShow] = useState("");

    const handleShowModal = useCallback((id: string) => {
        setModalShow(id);
    }, []);

    const contest = (config: contestConfigType) => {
        const configVisiblePublic = config.public;
        // const configBadge = config.visible?.badge;
        // const configSpot = config.visible?.spot;

        const isVisible = !!(isAdmin ||
            configVisiblePublic ||
            history && history[config.id] && history[config.id].attend)

        // (configBadge ? badges && badges[configBadge] : true))

        // const isVisible = isAdmin ||
        //     (configBadge ? badges && badges[configBadge] : true) &&
        //     (configSpot ? userInfo?.spot === configSpot : true)

        const award = history && history[config.id] && history[config.id].award || [];
        const color = award.length > 0 && CONFIG_AWARD[award[0]].color || "";
        return isVisible ? <div className="list-group-item appSys-contest" key={config.id} style={{ background: `linear-gradient(to right, ${color} 50%, transparent)` }}>
            <div>
                {statusButton(handleShowModal, config, isEntried)}
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
        </div> : <></>
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
                    {isHistoryLoaded ? CONTESTS_DATA.upcomingContests
                        .sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()))
                        .map((v) => (
                            contest(v
                                // v.status === "entryopen" ? !!contUserInfo?.[v.id]?.entry : isPaid
                            )
                        )) :
                        loadingContest}
                </div>
            </div>
            <div className="col-lg-6">
                <h3 id="results">結果</h3>
                <div id="account-past-contests" className="list-group list-group-flush mb-2">
                    {isHistoryLoaded ?
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
        <p>JOL2025の応募完了までもう一歩です</p>
        <ol>
            <li>
                <p>応募途中の場合</p>
                <p><a href="/entry/jol2025/">→こちらから応募手続きを続けてください．</a></p>
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

    const news = useMemo(() => <div className="simple-box">
        <span className="box-title">お知らせ</span>
        {/* {isPaid && <p>2023/12/22: <a>JOL2024の事前準備ページを公開しました．</a></p>}
        {isPaid && <p>2023/12/29: <a>JOL2024本番で使う競技会場ページを公開しました．</a></p>}
        <p>2023/12/29: JOL2024本番終了</p>
        <p>2024/01/22: <a href="/result/jol2024/">JOL2024結果発表</a></p> */}
    </div>, [isPaid])

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
                const currentContestId = "jol2025"
                const currentContestData = CONTESTS_DATA.upcomingContests.find((v) => (v.id === currentContestId))
                if (!currentContestData) return
                switch (currentContestData.status) {
                    case "pre":
                        break;
                    default:
                        const paidSnapshot = await get(ref(db, `/orders/${currentContestId}/` + user.email!.replace(/\./g, '=').toLowerCase()))
                        const isPaidTemp = paidSnapshot.val()
                        setIsPaid([!!isPaidTemp, true]);

                        if (currentContestData.status === "entryopen") {
                            const contSnapshot = await get(ref(db, "/contests/" + currentContestId + "/users/" + user.uid));
                            const contestantInfo = contSnapshot.val();
                            if (contestantInfo && contestantInfo.name && isPaidTemp) {
                                setIsEntried([true, true])
                            }
                            else if (contestantInfo && contestantInfo.isNotNew) {
                                setIsEntried([false, true])
                            }
                            else {
                                location.replace("/entry/" + currentContestId);
                            }
                        }
                        break;
                }

                const promiseHistory = (async () => {
                    const snapshot = await get(ref(db, "/history/" + user.uid));
                    setHistory([snapshot.val(), true]);
                })();
                await Promise.all([promiseHistory]).catch((e) => {
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
        {isIsPaidLoaded && isIsEntriedLoaded && !isPaid ? <>
            {news}
            {messagePreOrder}
        </>
            : <></>}
        {/* {isIsPaidLoaded ? <>
            {news}
            {isPaid && emails}
            {!isPaid && message2}
        </> :
            <div className="simple-box placeholder-glow">
                <span className="box-title placeholder col-1"></span>
                <p className="placeholder w-100"></p>
                <p className="placeholder w-75"></p>
                <p className="placeholder w-50"></p>
            </div>} */}
        {adminPortalLink}
        {/* {isAdmin ? <a href="/contest/jol2024/contest-admin/" className="btn btn-info btn-small ms-3" role="button">JOL2024本番Admin</a> : <></>}
        {isAdmin ? <a href="/contest/jol2024/demo-admin/" className="btn btn-info btn-small ms-3" role="button">JOL2024デモAdmin</a> : <></>} */}
        {contests}
        <div className="mt-5">
            {user ?
                <span className="me-3">{user.email + " でログイン中"}</span> :
                <span className="me-3 placeholder-glow placeholder w-25"></span>
            }
            <button onClick={logout} className="btn btn-danger btn-small">ログアウト</button>
        </div>
        <ResultModal
            show={modalShow != ""}
            onHide={() => setModalShow("")}
            contestId={modalShow}
            fullHistory={history}
        ></ResultModal>
    </div>
}

const root = createRoot(document.getElementById("app")!);

root.render(
    <App />
);
