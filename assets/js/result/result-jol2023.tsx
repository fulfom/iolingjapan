import { app, auth, db } from "../firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import React, { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client';
import {
    Chart as ChartJS,
    defaults,
    RadialLinearScale,
    RadarController,
    PointElement,
    LineElement
} from 'chart.js';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { User } from "firebase/auth";

ChartJS.register(RadialLinearScale, RadarController, PointElement, LineElement);

const awardName = {
    gold: "金",
    silver: "銀",
    bronze: "銅",
    honourable: "努力"
}

let results: any = {
    sums: {
        avgs: {
            flag: {
                whole: [54.01480263, 9.149122807, 12.75877193, 16.7379386, 9.899122807, 5.469846491],
                gold: [78.95833333, 15.58333333, 17.08333333, 19.79166667, 17.75, 8.75],
                silver: [71.28240741, 13, 16.2962963, 19.25925926, 15.66666667, 7.060185185],
                bronze: [64.67, 11.36, 15.2, 19, 12.85333333, 6.256666667],
                honourable: [58.13920455, 10.25, 13.45454545, 17.95454545, 10.52272727, 5.957386364],
            },
            award: {
                whole: [54.39215686, 9.803921569, 12.31372549, 17.23039216, 9.568627451, 5.475490196],
                gold: [83.125, 17.33333333, 19, 18.33333333, 18.66666667, 9.791666667],
                silver: [72.72727273, 13.09090909, 17.63636364, 19.09090909, 15.81818182, 7.090909091],
                bronze: [65.63235294, 11.88235294, 14.58823529, 19.11764706, 12.94117647, 7.102941176],
                honourable: [58.81521739, 11.13043478, 14.08695652, 18.47826087, 10.26086957, 4.858695652],
            },
            all: {
                whole: [54.08378136, 9.268817204, 12.67741935, 16.82795699, 9.838709677, 5.470878136],
            }
        },
        maxs: [100, 20, 20, 20, 20, 20],
        mins: [0, 0, 0, 0, 0, 0],
        borders: {
            //honourable, bronze, silver, gold (lowest), gold (highest)
            flag: [54.25, 61.25, 68.5, 75.25, 89],
            award: [54.5, 63.5, 69.25, 78.75, 89.5],
        }
    },
    // scores: {
    //     avgs: [],
    //     maxs: [],
    //     mins: Array(93).fill(0)
    // },
    result: {} as any
}
// const TSCORES = {
//     tr: document.querySelectorAll(".t-scores > tbody > tr"),
//     td1: document.querySelectorAll(".t-scores > tbody > tr > td:nth-child(1)"),
//     td2: document.querySelectorAll(".t-scores > tbody > tr > td:nth-child(2)")
// };

// document.addEventListener("DOMContentLoaded", (event) => {
//     auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             const snapshot = await get(ref(db, "/contests/jol2022/results/" + user.uid));
//             const val = snapshot.val();
//             results.result = val;
//             const ELEM_RESULT = document.getElementById("result");
//             const ELEM_RESULT2 = document.getElementById("result2");
//             const ELEM_RESULTLEAD = document.getElementById("resultlead");
//             const ELEM_FORM = document.getElementById("form");
//             (document.getElementById(`sums-chart-${val.spot}`) as HTMLInputElement)!.checked = true;
//             drawSums(val.spot);
//             drawTable("scores", TSCORES, val.spot);

//             if (val && val.award) {
//                 if ("無" == val.award) {
//                     ELEM_RESULT!.innerText = "残念ながらあなたは賞を獲得することができませんでした．"; //賞獲得ならず
//                 }
//                 else {
//                     let spottext = val.spot == "flag" ? "選抜" : val.spot == "award" ? "オープン" : "";
//                     ELEM_RESULTLEAD!.innerText = spottext + "枠 " + val.award + "賞";
//                     var text = "日本言語学オリンピック2022の競技結果に基づき，" + spottext + "枠" + val.award + "賞を授与いたします．";
//                     if (val.aplo) {
//                         text += "\n\n同時に2022年4月10日（日）実施予定のアジア太平洋言語学オリンピック2022（二次選抜）にご招待します．ただし，APLOは別途参加資格の確認があり，参加資格を満たす場合にのみ公式に参加ができます．詳しいことが決まり次第，メールでご連絡差し上げます．";
//                     }
//                     else if (val.spot == "flag") {
//                         text += "\n\nあなたはAPLO（二次選抜）の出場権を獲得することはできませんでした．"
//                     }
//                     ELEM_RESULT!.innerText = text;

//                     // const snapshot2 = await get(ref(db, "/contests/jol2022/users/" + user.uid));
//                     // const contVal = snapshot2.val();
//                     // if(contVal){
//                     //     INPUT_NAME.value = contVal.name;
//                     //     INPUT_NAME_ROMAN.value = contVal.nameRoman;
//                     //     INPUT_ZIPCODE.value = contVal.zipcode;
//                     //     INPUT_ADDRESS.value = contVal.address;
//                     // }
//                     // ELEM_FORM.style.display = "block";
//                     ELEM_RESULT2!.style.display = "block";
//                 }
//                 document.getElementsByTagName("body").item(0)!.style.opacity = "1";
//             }
//             else {
//                 location.href = "/account/";
//             }
//         }
//         else {
//             location.href = "/login/";
//         }
//     });
// });

// const INPUTS = document.querySelectorAll("#form input");

// for (let j = 0; j < INPUTS.length; j++) {
//     INPUTS[j].addEventListener("input", (e) => {
//         UPDATE_INFO!.disabled = false;
//     });
// }

// function infoSubmit() {
//     let user = auth.currentUser;
//     if (user) {
//         let data = {
//             name: INPUT_NAME!.value,
//             nameRoman: INPUT_NAME_ROMAN!.value,
//             zipcode: INPUT_ZIPCODE!.value,
//             address: INPUT_ADDRESS!.value
//         };
//         updateDatabasePushContToUser(data, "/contests/jol2022");
//         window.removeEventListener('beforeunload', onBeforeunloadHandler);
//         UPDATE_INFO.disabled = true;
//     }
// }

const color = {
    bg: {
        jolred: "rgba(254, 98, 77, 0.2)",
        red: 'rgba(255, 99, 132, 0.2)',
        blue: 'rgba(54, 162, 235, 0.2)',
        yellow: 'rgba(255, 206, 86, 0.2)',
        green: 'rgba(75, 192, 192, 0.2)',
        purple: 'rgba(153, 102, 255, 0.2)',
        orange: 'rgba(255, 159, 64, 0.2)',
        primary: "rgba(56, 167, 187, 0.2)",
        success: "rgba(56, 187, 142, 0.2)",
        gold: "rgba(200, 177, 89, 0.2)",
        silver: "rgba(161, 161, 161, 0.2)",
        bronze: "rgba(200, 144, 89, 0.2)",
        honorouble: "rgba(56, 187, 142, 0.2)"
    },
    border: {
        jolred: "rgba(254, 98, 77, 1)",
        red: 'rgba(255, 99, 132, 1)',
        blue: 'rgba(54, 162, 235, 1)',
        yellow: 'rgba(255, 206, 86, 1)',
        green: 'rgba(75, 192, 192, 1)',
        purple: 'rgba(153, 102, 255, 1)',
        orange: 'rgba(255, 159, 64, 1)',
        primary: "rgba(56, 167, 187, 1)",
        danger: "rgba(187, 76, 56, 1)",
        success: "rgba(56, 187, 142, 1)",
        // success: "#28a745",
        // gold: "#eee7cc",
        gold: "rgba(200, 177, 89, 1)",
        // silver: "#ddd",
        silver: "rgba(161, 161, 161, 1)",
        // bronze: "#edc",
        bronze: "rgba(200, 144, 89, 1)",
        // whole: "#aaa",
        whole: "#777",
        // whole: "#777",
        honorouble: "rgba(75, 192, 192, 1)"
    }
}

ChartJS.defaults.font.family = "-apple-system, BlinkMacSystemFont, YuGothic, 'Yu Gothic Medium', 'Yu Gothic', Verdana, Meiryo, sans-serif"
const borderDash = [10, 10];

function toRate(data) {
    let newdata: number[] = [];
    for (let i = 0; i < data.length; i++) {
        newdata.push(data[i] * 100 / results.sums.maxs[i]);
    }
    return newdata;
}

function drawSums(mode = "") {
    const TSUMS = {
        tr: document.querySelectorAll("#t-sums > tbody > tr"),
        td1: document.querySelectorAll("#t-sums > tbody > tr > td:nth-child(1)"),
        td2: document.querySelectorAll("#t-sums > tbody > tr > td:nth-child(2)")
    };
    drawTable("sums", TSUMS, mode);
    const CSUMS = document.getElementById('c-sums') as HTMLCanvasElement;

    let datasets: any = [
        {
            label: 'あなた',
            data: toRate(results.result.sums).slice(1),
            backgroundColor: color.bg.jolred,
            borderColor: color.border.jolred,
            pointBorderColor: "#fff",
            pointBackgroundColor: color.border.jolred,
            pointHoverBorderColor: color.border.jolred,
            pointHoverBackgroundColor: "#fff"
        }
    ];
    if (mode === "flag" || mode === "award") {
        datasets = datasets.concat([
            {
                label: '金',
                data: toRate(results.sums.avgs[mode].gold).slice(1),
                fill: false,
                // backgroundColor: color.bg.gold,
                borderDash: borderDash,
                borderColor: color.border.gold,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.gold,
                pointHoverBorderColor: color.border.gold,
                pointHoverBackgroundColor: "#fff"
            },
            {
                label: '銀',
                data: toRate(results.sums.avgs[mode].silver).slice(1),
                fill: false,
                // backgroundColor: color.bg.silver,
                borderDash: borderDash,
                borderColor: color.border.silver,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.silver,
                pointHoverBorderColor: color.border.silver,
                pointHoverBackgroundColor: "#fff"
            },
            {
                label: '銅',
                data: toRate(results.sums.avgs[mode].bronze).slice(1),
                fill: false,
                borderDash: borderDash,
                borderColor: color.border.bronze,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.bronze,
                pointHoverBorderColor: color.border.bronze,
                pointHoverBackgroundColor: "#fff"
            },
            {
                label: '全体',
                data: toRate(results.sums.avgs[mode].whole).slice(1),
                fill: false,
                borderDash: borderDash,
                borderColor: color.border.whole,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.whole,
                pointHoverBorderColor: color.border.whole,
                pointHoverBackgroundColor: "#fff"
            }
        ]);
    }
    else {
        datasets = datasets.concat([
            {
                label: '全体',
                data: toRate(results.sums.avgs.all.whole).slice(1),
                fill: false,
                borderDash: borderDash,
                borderColor: color.border.whole,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.whole,
                pointHoverBorderColor: color.border.whole,
                pointHoverBackgroundColor: "#fff"
            }
        ]);
    }

    if (results.chartSums) {
        results.chartSums.data.datasets = datasets;
        results.chartSums.update();
    }
    else {
        results.chartSums = new ChartJS(CSUMS, {
            type: 'radar',
            data: {
                labels: ['第1問', '第2問', '第3問', '第4問', '第5問'],
                datasets: datasets
            },
            options: {
                aspectRatio: 1,
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (tooltipItem) => {
                                return this.labels[tooltipItem[0].dataIndex];
                            },
                            label: (tooltipItem) => {
                                return [this.datasets[tooltipItem.datasetIndex].label + ": " + Math.round(Number(tooltipItem.formattedValue) * 100) / 100 + "%"];
                            }
                        }
                    },
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: false
                        },
                        display: true,
                        ticks: {
                            stepSize: 20,
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

function drawTable(mode, T, spot = "") {
    const scores = results.result[mode];
    let avgs = mode == "scores" ? results[mode].avgs : results[mode].avgs[spot || "all"]["whole"];
    let maxs = results[mode].maxs;
    let mins = results[mode].mins;
    for (let i = 0; i < scores.length; i++) {
        T.td2[i].innerText = scores[i];
        T.td2[i].setAttribute("data-min", mins[i]);
        T.td2[i].setAttribute("data-max", maxs[i]);
        let avg = {
            color: "#eee",
            range: "0px",
            value: Math.round((avgs[i] - mins[i]) / (maxs[i] - mins[i]) * 100)
        };
        let score = {
            range: "5px",
            value: Math.round((scores[i] - mins[i]) / (maxs[i] - mins[i]) * 100),
            color: ""
        };
        score.color = scores[i] >= maxs[i] ? color.border.success : 75 < score.value && score.value < 90 ? color.bg.jolred : color.border.jolred;
        let scoreLine = [
            "to right",
            `rgba(0,0,0,0) min(${score.value}%, calc(100% - ${score.range}))`,
            `${score.color} min(${score.value}%, calc(100% - ${score.range})) min(calc(${score.value}% + ${score.range}), 100%)`,
            `rgba(0,0,0,0) min(calc(${score.value}% + ${score.range}), 100%)`,
        ]
        let grad = [] as any[];
        if (mode == "sums" && i == 0 && spot) {
            let borders = results.sums.borders[spot];
            grad = [
                "to right",
                `${avg.color} ${avg.value}%`,
                `#fff ${avg.value}% ${borders[0]}%`,
                `${color.bg.honorouble} ${borders[0]}% ${borders[1]}%`,
                `${color.bg.bronze} ${borders[1]}% ${borders[2]}%`,
                `${color.bg.silver} ${borders[2]}% ${borders[3]}%`,
                `${color.bg.gold} ${borders[3]}% ${borders[4]}%`,
                `#fff ${borders[4]}%`
            ]
        }
        else {
            grad = [
                "to right",
                `${avg.color} ${avg.value}%`,
                `#fff ${avg.value}%`
            ]
        }
        // T.td1[i].style.background = `linear-gradient(${scoreLine.join(", ")}), linear-gradient(${grad.join(", ")})`;
        T.td2[i].style.background = `linear-gradient(${scoreLine.join(", ")}), linear-gradient(${grad.join(", ")})`;
    }
}

function updateSums(mode = "") {
    drawSums(mode);
}

function App() {
    const [editting, setEditting] = useState(false);
    const [user, setUser] = useState(null as User | null);
    const [udb, setUdb] = useState({} as any);
    const [ur, setUr] = useState({} as any);
    const [chartRadio, setChartRadio] = useState("");
    const [sums, setSums] = useState([0, 0, 0, 0, 0, 0]);

    const videoRef = useRef<HTMLVideoElement>(null);

    const infoSubmit = async (e: React.FormEvent<HTMLElement>) => {
        if (!user) return;
        await Promise.all([
            update(ref(db, "/contests/jol2023/users/" + user.uid), {
                ...udb
            }),
            update(ref(db, "/users/" + user.uid), {
                ...udb
            })
        ])
        setEditting(false);
    }

    useLayoutEffect(() => {
        // setUser({ email: "test", uid: "" })
        // setUdb({ spot: "" })
        // 現在ログインしているユーザを取得
        auth.onAuthStateChanged(async v => {
            if (v) {
                setUser(v);
                //fetch data from db
                const snapshotResults = await get(ref(db, "/contests/jol2023/results/" + v.uid));
                const resulttmp = snapshotResults.val();
                if (resulttmp) {
                    setUr(resulttmp);
                    if (resulttmp.award && resulttmp.award !== "onhold") {
                        results.result = resulttmp;
                        setSums(resulttmp.sums);
                        videoRef.current!.src = `/video/jol-result/${resulttmp.spot}-${resulttmp.award}.mov`;
                        videoRef.current!.play();
                        setChartRadio(resulttmp.spot);
                        drawSums(resulttmp.spot);
                    } else {
                        videoRef.current!.style.display = "none";
                    }
                }

                const snapshot = await get(ref(db, "/contests/jol2023/users/" + v.uid));
                const udbtmp = snapshot.val();
                if (udbtmp && udbtmp.email) {
                    setUdb(udbtmp);
                }
                document.getElementsByTagName("body").item(0)!.style.opacity = "1";
            } else {
                location.href = "/account/";
            }
        });
    }, [])

    return (<>
        <h2>JOL2023 賞</h2>
        <video ref={videoRef} muted playsInline className="w-100">
            {ur.award ?
                <p style={{ fontSize: "3em" }}>{`${ur.spot === "flag" ? "選抜" : "オープン"}枠${awardName[ur.award]}賞`}</p>
                : <p>あなたはJOL当日に参加していません．</p>}
        </video>
        <div style={{ display: ur.award && ur.award !== "none" && ur.award !== "onhold" ? "block" : "none" }}>
            <h3><i className="fas fa-user-edit fa-fw"></i>個人情報の入力</h3>
            <p>賞を獲得された方には賞状をお送りします．以下の氏名・郵送先住所をご確認いただき，修正が必要な場合は 2023年1月22日（日）までに修正してください．修正は以下の情報を書き換えて修正ボタンを押すことで完了します．</p>
            <Form className="needs-validation"
                onSubmit={(e) => {
                    e.preventDefault();
                    infoSubmit(e);
                    return false;
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter') e.preventDefault();
                }}
            >
                <Form.Group className="mb-3 was-validated" controlId="formName">
                    <Form.Label>氏名(フルネーム)</Form.Label>
                    <Form.Control required
                        value={udb?.name || ""}
                        onChange={(e) => {
                            setEditting(true);
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
                            setEditting(true);
                            setUdb({ ...udb, nameRoman: e.currentTarget.value })
                        }}
                    />
                    <Form.Text className="text-muted">
                        半角英数．例) Namae Myouji / MYOUJI Namae<br />こちらで大文字小文字・スペースなどを調整した後，賞状への記名に用います．名字名前の順番やスペルが希望通りか確認してください．
                    </Form.Text>
                </Form.Group>
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
                            setEditting(true);
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
                            setEditting(true);
                            setUdb({ ...udb, isCertificateNecessary: e.target.value === "e" })
                        }}
                    />
                </Form.Group>
                <Form.Group className="mb-3 was-validated" controlId="formZipcode">
                    <Form.Label>郵便番号</Form.Label>
                    <Form.Control required pattern="^[0-9]+$"
                        value={udb?.zipcode || ""}
                        onChange={(e) => {
                            setEditting(true);
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
                            setEditting(true);
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
                                setEditting(true);
                                setUdb({ ...udb, publish: e.currentTarget.checked })
                            }}
                        />
                        <Form.Text className="text-muted">
                            同意しない場合はチェックしないでください．
                        </Form.Text>
                    </Form.Group>
                </> : <></>}
                <Button type="submit" className="w-100" variant="template-primary" disabled={!editting}>
                    修正
                </Button>
            </Form>
        </div>
        {ur.award === "onhold" ?
            <p>あなたは確認事項があるため，結果発表を保留しています．後日委員会からメールで連絡がありますので，必ず確認してください．</p>
            : <></>}
        {ur.award ? <></> : <p>あなたはJOL当日に参加していません．</p>}
        <h2>個別スコア</h2>
        <h3>合計・小計</h3>
        <div className="row justify-content-around">
            <div className="col-12 text-center mb-3">
                <Form>
                    {[
                        {
                            name: "",
                            label: "総合"
                        },
                        {
                            name: "flag",
                            label: "選抜"
                        },
                        {
                            name: "award",
                            label: "オープン"
                        },

                    ].map((radio) => (
                        <Form.Check
                            type="radio"
                            name={radio.name}
                            key={radio.name || "all"}
                            id={`radio-${radio.name}`}
                            label={radio.label}
                            value={radio.name}
                            inline
                            checked={chartRadio === radio.name}
                            onChange={(e) => {
                                setChartRadio(e.target.value)
                                updateSums(e.target.value)
                            }}
                        />
                    ))}
                </Form>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
                <h4 className="h5"><a className="text-reset text-decoration-none dottedUnderline" data-bs-toggle="collapse" data-bs-target="#collapseAvgScoreRateNote" role="button" aria-expanded="false" aria-controls="collapseAvgScoreRateNote">平均得点率</a>との比較</h4>
                <p className="collapse small mb-0" id="collapseAvgScoreRateNote">平均得点率 = 平均点 / 配点 × 100</p>
                <div className="chart-container" style={{ position: "relative" }}>
                    <canvas id="c-sums"></canvas>
                </div>
            </div>
            <div className="col-md-4 col-lg-4">
                <h4 className="h5"><a className="text-reset text-decoration-none dottedUnderline" data-bs-toggle="collapse" data-bs-target="#collapseScoreNote" role="button" aria-expanded="false" aria-controls="collapseScoreNote">点数</a></h4>
                <div className="collapse small mb-0" id="collapseScoreNote">
                    <table className="list-like">
                        <tbody>
                            {[["赤線/緑線", "あなたの点数（緑: 満点）"],
                            [" グレー", "平均点以下"],
                            ["緑", "努力賞の範囲"],
                            ["銅", "銅賞の範囲"],
                            ["銀", "銀賞の範囲"],
                            ["金", "金賞の範囲"],].map((row) => (
                                <tr key={row[0]}>
                                    <td>{row[0]}</td>
                                    <td>{row[1]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <table className="table table-tdfirst-bold" id="t-sums">
                    <thead>
                        <tr>
                            <th></th>
                            <th>点数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>合計</td>
                            <td>{sums[0]}</td>
                        </tr>
                        {[0, 1, 2, 3, 4].map((row, i) => (
                            <tr key={i}>
                                <td>第{i + 1}問</td>
                                <td>{sums[i + 1]}</td>
                            </tr>))}
                    </tbody>
                </table>
            </div>
        </div>
    </>)
}

const root = createRoot(document.getElementById("app"));

root.render(
    <App />,
);