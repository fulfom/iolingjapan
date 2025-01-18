import { app, auth, db } from "../firebase-initialize"
import { ref, onValue, update, get, set } from "firebase/database"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client';
import {
    Chart as ChartJS,
    defaults,
    RadialLinearScale,
    RadarController,
    PointElement,
    LineElement,
    ChartDataset,
    TooltipItem,
    ChartOptions,
    DatasetChartOptions,
    ChartData,
    TooltipModel
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import { User } from "firebase/auth";
import { useObjectVal } from "react-firebase-hooks/database";
import { useForm } from "react-hook-form";

ChartJS.register(RadialLinearScale, RadarController, PointElement, LineElement);

const scores = {
    avgs: {
        flag: {
            whole: [54.79, 14.63, 12.73, 27.43],
            gold: [93.34, 19.02, 18.62, 55.69],
            silver: [81.83, 17.77, 17.53, 46.52],
            bronze: [70.18, 16.41, 16.22, 37.54],
            honourable: [59.82, 15.28, 14.56, 29.98],
        },
        award: {
            whole: [58.52, 15.48, 12.76, 30.29],
            gold: [98.00, 20.00, 19.50, 58.50],
            silver: [87.78, 19.25, 18.66, 49.88],
            bronze: [77.10, 18.36, 16.22, 42.52],
            honourable: [65.27, 15.08, 14.02, 36.17],
        },
        all: {
            whole: [55.37, 14.76, 12.74, 27.87],
        }
    },
    maxs: [100, 20, 20, 60],
    mins: [0, 0, 0, 0, 0, 0],
    borders: {
        //honourable, bronze, silver, gold (lowest), gold (highest)
        flag: [55, 65, 77, 88, 100],
        award: [59, 72, 84, 94, 100],
    }
}

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

function UserForm({ user, udb }: { user: User, udb: any }) {
    const { register, handleSubmit, formState: { isDirty, isValid }, reset } = useForm({ defaultValues: udb, shouldUseNativeValidation: true, mode: "onChange" });

    const onSubmit = async (data: any) => {
        await Promise.all([
            update(ref(db, "/contests/jol2025/users/" + user.uid), {
                ...data
            }),
            update(ref(db, "/users/" + user.uid), {
                ...data
            })
        ]);
        reset({}, { keepValues: true });
    }

    return (
        <div>
            <h3><i className="fas fa-user-edit fa-fw"></i>個人情報の入力</h3>
            <p>賞を獲得された方には賞状をお送りします．以下の氏名{!udb.isCertificateNecessary && "・郵送先住所"}をご確認いただき，修正が必要な場合は 2025年2月2日（日）までに修正してください．修正は以下の情報を書き換えて修正ボタンを押すことで完了します．</p>
            <Form className="needs-validation"
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={e => {
                    if (e.key === 'Enter') e.preventDefault();
                }}
            >
                <Form.Group className="mb-3 was-validated" controlId="formName">
                    <Form.Label>氏名(フルネーム)</Form.Label>
                    <Form.Control {...register("name", { required: "入力してください" })} />
                    <Form.Text className="text-muted">
                        郵送時の宛名・賞状への記名に用います．
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3 was-validated" controlId="formNameRoman">
                    <Form.Label>氏名(ローマ字)</Form.Label>
                    <Form.Control {...register("nameRoman", {
                        required: "入力してください", pattern: {
                            value: /^[0-9A-Za-z\s]+$/,
                            message: "ローマ字で入力してください"
                        }
                    })} />
                    <Form.Text className="text-muted">
                        半角英数．例) Namae Myouji / MYOUJI Namae<br />こちらで大文字小文字・スペースなどを調整した後，賞状への記名に用います．名字名前の順番やスペルが希望通りか確認してください．
                    </Form.Text>
                </Form.Group>
                <p className="mb-2">賞状の受け取り方（変更不可）: {udb.isCertificateNecessary ? "電子データ（pdf）をメール" : "紙の賞状を郵送"}</p>
                {!udb.isCertificateNecessary && <>
                    <Form.Group className="mb-3 was-validated" controlId="formZipcode">
                        <Form.Label>郵便番号</Form.Label>
                        <Form.Control {...register("zipcode", {
                            required: true,
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "半角数字，ハイフンなしで入力してください"
                            }
                        })} />
                        <Form.Text className="text-muted">
                            半角数字．ハイフン不要．
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3 was-validated" controlId="formAddress">
                        <Form.Label>住所</Form.Label>
                        <Form.Control {...register("address", { required: "入力してください" })} />
                        <Form.Text className="text-muted">
                            賞状の送付に使用します．
                        </Form.Text>
                    </Form.Group>
                </>}
                <Button type="submit" className="w-100" variant="template-primary" disabled={!(isDirty && isValid)}>
                    修正
                </Button>
            </Form>
        </div>
    )
}

function ResultChart({ userResult }: { userResult: Result }) {
    const [chartRadio, setChartRadio] = useState<Spot>("all");

    useEffect(() => {
        if (userResult) {
            setChartRadio(userResult.spot);
        }
    }, [userResult]);

    const barColor = (score: number, value: number, border?: number) => {
        //得点率
        if (border && score >= border) {
            return color.border.success;
        }
        else if (75 < value && value < 90) {
            //点数の文字と被るので薄くする
            return color.bg.jolred;
        } else {
            return color.border.jolred;
        }
    }

    const scoreLine = (score: number, max: number, min: number = 0, range: string = "5px") => {
        const value = Math.round((score - min) / (max - min) * 100);
        return [
            "to right",
            `rgba(0,0,0,0) min(${value}%, calc(100% - ${range}))`,
            `${barColor(score, value)} min(${value}%, calc(100% - ${range})) min(calc(${value}% + ${range}), 100%)`,
            `rgba(0,0,0,0) min(calc(${value}% + ${range}), 100%)`,
        ].join(",");
    }

    const scoreGradationTotal = (borders: number[]) => {
        return [
            "to right",
            `#eee ${borders[0]}%`,
            `${color.bg.honorouble} ${borders[0]}% ${borders[1]}%`,
            `${color.bg.bronze} ${borders[1]}% ${borders[2]}%`,
            `${color.bg.silver} ${borders[2]}% ${borders[3]}%`,
            `${color.bg.gold} ${borders[3]}% ${borders[4]}%`,
            `#fff ${borders[4]}%`
        ].join(",");
    }

    const scoreGradation = (value: number) => ([
        "to right",
        `#eee ${value}%`,
        `#fff ${value}%`
    ].join(","));

    const toRate = (array: number[]) => (
        array.map((value, i) => Math.round(value * 100 / scores.maxs[i]))
    )

    const data: ChartData<"radar"> = {
        labels: [...Array(scores.maxs.length - 1)].map((v, i) => (`第${i + 1}問`)),
        datasets: [
            {
                label: 'あなた',
                data: toRate(userResult.sum).slice(1),
                fill: false,
                backgroundColor: color.bg.jolred,
                borderColor: color.border.jolred,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.jolred,
                pointHoverBorderColor: color.border.jolred,
                pointHoverBackgroundColor: "#fff"
            } as ChartDataset<"radar">
        ].concat(chartRadio === "all" ? [] : [
            {
                label: '金',
                data: toRate(scores.avgs[chartRadio].gold).slice(1),
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
                data: toRate(scores.avgs[chartRadio].silver).slice(1),
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
                data: toRate(scores.avgs[chartRadio].bronze).slice(1),
                fill: false,
                borderDash: borderDash,
                borderColor: color.border.bronze,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.bronze,
                pointHoverBorderColor: color.border.bronze,
                pointHoverBackgroundColor: "#fff"
            },
        ]).concat([
            {
                label: '全体',
                data: toRate(scores.avgs[chartRadio].whole).slice(1),
                fill: false,
                borderDash: borderDash,
                borderColor: color.border.whole,
                pointBorderColor: "#fff",
                pointBackgroundColor: color.border.whole,
                pointHoverBorderColor: color.border.whole,
                pointHoverBackgroundColor: "#fff"
            }
        ])
    };

    const options: ChartOptions<"radar"> = {
        aspectRatio: 1,
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItems: TooltipItem<"radar">[]) => {
                        return tooltipItems.map((tooltipItem) => (
                            tooltipItem.dataset.label || ""
                        ))
                    },
                    label: (tooltipItem: TooltipItem<"radar">) => {
                        return tooltipItem.dataset.label + ": " + Math.round(Number(tooltipItem.formattedValue) * 100) / 100 + "%";
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

    return (<>
        <h3>個別スコア</h3>
        <h4>合計・小計</h4>
        <div className="row justify-content-around">
            <div className="col-12 text-center mb-3">
                <Form>
                    {[
                        {
                            name: "all",
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
                            key={radio.name}
                            id={`radio-${radio.name}`}
                            label={radio.label}
                            value={radio.name}
                            inline
                            checked={chartRadio === radio.name}
                            onChange={(e) => {
                                setChartRadio(e.target.value as Spot)
                            }}
                        />
                    ))}
                </Form>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
                <h4 className="h5"><a className="text-reset text-decoration-none dottedUnderline" data-bs-toggle="collapse" data-bs-target="#collapseAvgScoreRateNote" role="button" aria-expanded="false" aria-controls="collapseAvgScoreRateNote">平均得点率</a>との比較</h4>
                <p className="collapse small mb-0" id="collapseAvgScoreRateNote">平均得点率 = 各賞受賞者の平均点 / 配点 × 100</p>
                <div className="chart-container" style={{ position: "relative" }}>
                    <Radar
                        data={data}
                        options={options}
                    ></Radar>
                </div>
            </div>
            <div className="col-md-4 col-lg-4">
                <h4 className="h5"><a className="text-reset text-decoration-none dottedUnderline" data-bs-toggle="collapse" data-bs-target="#collapseScoreNote" role="button" aria-expanded="false" aria-controls="collapseScoreNote">点数</a></h4>
                <div className="collapse small mb-0" id="collapseScoreNote">
                    <table className="list-like">
                        <tbody>
                            {[["赤線", "あなたの点数"],
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
                <table className="table table-tdfirst-bold mb-1" id="t-sums">
                    <thead>
                        <tr>
                            <th></th>
                            <th>点数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>合計</td>
                            <td
                                data-min={scores.mins[0]}
                                data-max={scores.maxs[0]}
                                style={{
                                    background: `linear-gradient(${scoreLine(userResult.sum[0], scores.maxs[0])}), linear-gradient(${chartRadio === "all" ? scoreGradation(scores.avgs.all.whole[0] * 100 / scores.maxs[0]) : scoreGradationTotal(scores.borders[chartRadio])})`
                                }}
                            >{userResult.sum[0]}</td>
                        </tr>
                        {[...Array(scores.maxs.length - 1)].map((row, i) => (
                            <tr key={i}>
                                <td>第{i + 1}問</td>
                                <td
                                    data-min={scores.mins[i + 1]}
                                    data-max={scores.maxs[i + 1]}
                                    style={{ background: `linear-gradient(${scoreLine(userResult.sum[i + 1], scores.maxs[i + 1])}), linear-gradient(${scoreGradation(scores.avgs[chartRadio].whole[i + 1] * 100 / scores.maxs[i + 1])})` }}
                                >{userResult.sum[i + 1]}</td>
                            </tr>))}
                    </tbody>
                </table>
                <p><a href="/record-jol/">ボーダー・平均点などはこちら</a></p>
            </div>
        </div >
    </>)
}

function AuthProvider() {
    const [user, setUser] = useState(null as User | null);
    const [udb, setUdb] = useState({} as any);

    useEffect(() => {
        // 現在ログインしているユーザを取得
        auth.onAuthStateChanged(async v => {
            if (v) {
                setUser(v);
                //fetch data from db
                const snapshot = await get(ref(db, "/contests/jol2025/users/" + v.uid));
                const udbtmp = snapshot.val();
                if (udbtmp && udbtmp.email) {
                    setUdb(udbtmp);
                }
            } else {
                location.href = "/account/";
            }
        });
    }, []);

    return (user && udb.email
        ? <App user={user} udb={udb}></App>
        : <></>)
}

type Spot = "flag" | "award" | "all";

type Result = {
    qualified: boolean;
    attend: boolean;
    spot: "flag" | "award";
    area?: string;
    sum: number[];
    award?: string[];
    rank?: number;
}

type Video = {
    src: string;
    alt: string;
}

function VideoArea({ videos }: { videos: Video[] }) {
    const [select, setSelect] = useState(0);
    const [ended, setEnded] = useState(false);

    const selectedVideo = videos.length > 0 && <video muted playsInline autoPlay className="w-100" src={videos[select].src} key={videos[select].src}
        onEnded={() => setEnded(true)}>
        <p style={{ fontSize: "3em" }}>{videos[select].alt}</p>
    </video>;

    return (
        <>
            {selectedVideo}
            {ended && <p>受賞した賞の一覧: {videos.map(({ src, alt }, i) => (
                <a onClick={() => setSelect(i)}
                    className="me-3"
                    role="button"
                    key={alt}
                >{alt}</a>
            ))}</p>}
        </>
    )
}

function App({ user, udb }: { user: User, udb: any }) {
    const [userResult, userResultLoading, userResultError] = useObjectVal<Result>(ref(db, "/history/" + user.uid + "/jol2025/"));

    // // 敢闘賞の判定
    // const hasHmAward: boolean = userResult && !userResult.award ? userResult.sum.slice(1).some((v, i) => (v >= scores.maxs[i + 1] * 0.8)) : false;

    const videos: Video[] = useMemo(() => {
        if (!userResult || !userResult.award) { return []; }
        let tmp: Video[] = [];
        // 最優秀賞
        if (userResult.award.includes("grand")) {
            tmp.push({
                src: `/video/jol2025-result/${userResult.spot}-best${userResult.rank}.mov`,
                alt: `${userResult.spot === "flag" ? "選抜" : "オープン"}枠最優秀賞（${userResult.rank}位）`
            });
        }
        // 優秀賞
        if (userResult.award.includes("gold")) {
            tmp.push({
                src: `/video/jol2025-result/${userResult.spot}-gold.mov`,
                alt: "gold"
            });
        }
        if (userResult.award.includes("silver")) {
            tmp.push({
                src: `/video/jol2025-result/${userResult.spot}-silver${userResult.award.includes("aplo") ? "-aplo" : "-notaplo"}.mov`,
                alt: "silver"
            });
        }
        if (userResult.award.includes("bronze")) {
            tmp.push({
                src: `/video/jol2025-result/${userResult.spot}-bronze.mov`,
                alt: "bronze"
            });
        }
        if (userResult.award.includes("honourable")) {
            tmp.push({
                src: `/video/jol2025-result/${userResult.spot}-honourable.mov`,
                alt: "honourable"
            });
        }

        // ジュニア奨励賞
        if (userResult.award.includes("junior")) {
            tmp.push({
                src: `/video/jol2025-result/junior.mov`,
                alt: "ジュニア奨励賞"
            });
        }
        // 地区賞
        if (userResult.award.includes("area")) {
            tmp.push({
                src: `/video/jol2025-result/${userResult.area}.mov`,
                alt: `${userResult.area}地区賞`
            });
        }
        // 敢闘賞
        if (userResult.award.includes("hm")) {
            tmp.push({
                src: `/video/jol2025-result/${userResult.spot}-k.mov`,
                alt: `敢闘賞`
            });
        }

        if (tmp.length === 0) {
            return [{
                src: `/video/jol2025-result/${userResult.spot}-none.mov`,
                alt: "受賞なし"
            }];
        } else {
            return tmp;
        }
    }, [userResult]);

    return (<>
        <h2>JOL2025 結果発表</h2>
        {!userResultLoading ? !userResult ?
            <p>あなたはJOL当日に参加していません．</p> :
            <>
                {userResult.attend && userResult.award && <>
                    <VideoArea videos={videos}></VideoArea>
                    {userResult.spot === "flag" && (
                        userResult.award.includes("aplo") ?
                            <p>2025年4月20日（日）実施のアジア太平洋言語学オリンピック2025（二次選抜）にご招待します．ただし，APLOは別途参加資格の確認があり，参加資格を満たす場合にのみ公式に参加ができます．詳しいことが決まり次第，メールでご連絡差し上げます．</p>
                            : <p>（アジア太平洋言語学オリンピック2025への招待はありません）</p>
                    )}
                    {userResult.sum && <ResultChart userResult={userResult}></ResultChart>}
                    {/* <UserForm user={user} udb={udb}></UserForm> */}
                </>}
                {/* {userResult.participation === "onhold" && <p>{userResult.message}</p>} */}
                {!userResult.attend && <p>あなたはJOL当日に参加していません．</p>}
            </> : <p>読み込み中...</p>}
    </>)
}

const root = createRoot(document.getElementById("app")!);

root.render(
    <AuthProvider />
);