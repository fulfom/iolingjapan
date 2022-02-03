let results = {
    sums: {
        avgs: {
            flag: {
                gold: [67.88888889, 19.9047619, 19.04761905, 9.547619048, 9.936507937, 9.452380952],
                silver: [54.98076923, 18.38461538, 17.34615385, 7.855769231, 6.076923077, 5.317307692],
                bronze: [47.67575758, 15.63636364, 16.65454545, 7.360606061, 3.842424243, 4.181818182],
                whole: [38.84795322, 9.783625731, 14.84795322, 6.307017544, 3.888888889, 4.020467836],
                // gold: [67.22222222, 19.9047619, 19.04761905, 9.547619048, 9.46031746, 9.261904762],
                // silver: [55.43518519, 18.5, 17.33333333, 8.013888889, 6.185185185, 5.402777778],
                // bronze: [48.11581921, 16.91525424, 16.61016949, 6.971751412, 3.491525424, 4.127118644],
                // whole: [37.53 ,9.30, 14.81, 6.11, 3.47, 3.85]
            },
            award: {
                gold: [89.08333333, 20, 20, 19.125, 16.33333333, 13.625],
                silver: [64.5, 19.75, 18, 11.375, 9.25, 6.125],
                bronze: [54.76923077, 17.69230769, 16.30769231, 8.628205128, 6.256410257, 5.884615385],
                whole: [44.88461538, 14.92307692, 16.76923077, 6.371794872, 2.820512821, 4],
                // gold: [82.125, 20, 20, 19.125, 10.5, 12.5],
                // silver: [63.9047619, 19.71428571, 17.71428571, 11.42857143, 8.761904762, 6.285714286],
                // bronze: [54.5, 17.27272727, 16.72727273, 9.121212121, 5.878787879, 5.5],
                // whole: [41.35, 10.90, 14.93, 7.41, 3.63, 4.49]
            },
            all: {
                whole: [39.51910569, 10.03414634, 14.86341463, 6.504878049, 3.993495935, 4.123170732],
                // whole: [35.96, 9.01, 13.97, 5.96, 3.29, 3.72]
            }
        },
        maxs: [100, 20, 20, 20, 20, 20],
        mins: [0, 0, 0, 0, 0, 0],
        borders: {
            flag: [37.8, 44.1, 51.5, 61.0, 79.83], //honorouble, bronze, silver, gold (lowest), gold (highest)
            award: [41.6, 50.6, 60.3, 83.0, 96]
        }
    },
    scores: {
        avgs: [0.7756097561, 0.9219512195, 0.8926829268, 0.8487804878, 1.27804878, 1.126829268, 0.9609756098, 0.8926829268, 1.419512195, 0.9170731707, 0.9073170732, 1.648780488, 1.629268293, 1.595121951, 1.248780488, 1.8, 1.770731707, 1.302439024, 1.356097561, 1.604878049, 0.4512195122, 0.2365853659, 0.287804878, 0.05853658537, 0.3109756098, 0.2951219512, 0.3341463415, 0.3841463415, 0.1707317073, 0.1821138211, 0.5024390244, 0.3658536586, 0.3463414634, 0.4422764228, 0.2536585366, 0.2756097561, 0.3207317073, 0.3743902439, 0.8048780488, 0.03902439024, 0.02926829268, 0.03902439024, 0.2292682927, 0.2113821138, 0.118699187, 0.09756097561, 0.1479674797, 0.09593495935, 0.1707317073, 0.07317073171, 0.1804878049, 0.1495934959, 0.1544715447, 0.3577235773, 0.2016260163, 0.1284552846, 0.1723577236, 0.05203252033, 0.06666666667, 0.118699187, 0.1707317073, 0.1235772358, 0.1219512195, 0.03902439025, 0.07804878049, 0.1902439024, 0.1837398374, 0.04227642277, 0.1219512195, 0.1056910569, 0.0243902439, 0.06504065041, 0.293902439, 0.2585365854, 0.3646341463, 0.3243902439, 0.3219512195, 0.2853658537, 0.343902439, 0.3146341463, 0.3402439024, 0.2890243902, 0.362195122, 0.1097560976, 0.1829268293, 0.1207317073, 0.06585365854, 0.03292682927, 0.1341463415, 0.08048780488, 0.06951219512, 0.06219512195, 0.08780487805],
        // avgs: [0.7050691244, 0.8248847926, 0.801843318, 0.7695852535, 1.161290323, 0.9861751152, 0.8479262673, 0.797235023, 1.271889401, 0.8479262673, 0.8525345622, 1.552995392, 1.520737327, 1.502304147, 1.175115207, 1.69124424, 1.668202765, 1.225806452, 1.276497696, 1.506912442, 0.4216589862, 0.2165898618, 0.2718894009, 0.05069124424, 0.2891705069, 0.2718894009, 0.3076036866, 0.3548387097, 0.1566820276, 0.1658986175, 0.4608294931, 0.3333333333, 0.3149001536, 0.400921659, 0.2350230415, 0.2523041475, 0.2960829493, 0.33640553, 0.7188940092, 0.03686635945, 0.02764976959, 0.03686635945, 0.1950844854, 0.1751152074, 0.1044546851, 0.07834101382, 0.1213517665, 0.08294930876, 0.1490015361, 0.06144393241, 0.1474654378, 0.1182795699, 0.1274961598, 0.3010752688, 0.1643625192, 0.1152073733, 0.1382488479, 0.04608294931, 0.05529953917, 0.1044546851, 0.1351766513, 0.09216589862, 0.09370199693, 0.03225806452, 0.06451612903, 0.1551459293, 0.1520737327, 0.03072196621, 0.09677419355, 0.07987711214, 0.01689708141, 0.05683563748, 0.2638248848, 0.2373271889, 0.3271889401, 0.2960829493, 0.2937788018, 0.2580645161, 0.3087557604, 0.2822580645, 0.3052995392, 0.2592165899, 0.3260368664, 0.1036866359, 0.1658986175, 0.1140552995, 0.05529953917, 0.03110599078, 0.1152073733, 0.06912442396, 0.05875576037, 0.05529953917, 0.08294930876],
        maxs: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.5, 0.5, 0.5, 0.5, 2, 2, 2, 2, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
        mins: Array(93).fill(0)
    }
}
const TSUMS = {
    tr: document.querySelectorAll("#t-sums > tbody > tr"),
    td1: document.querySelectorAll("#t-sums > tbody > tr > td:nth-child(1)"),
    td2: document.querySelectorAll("#t-sums > tbody > tr > td:nth-child(2)")
};
const TSCORES = {
    tr: document.querySelectorAll(".t-scores > tbody > tr"),
    td1: document.querySelectorAll(".t-scores > tbody > tr > td:nth-child(1)"),
    td2: document.querySelectorAll(".t-scores > tbody > tr > td:nth-child(2)")
};

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const snapshot = await firebase.database().ref("/contests/jol2022/results/" + user.uid).once("value");
            const val = snapshot.val();
            results.result = val;
            const ELEM_RESULT = document.getElementById("result");
            const ELEM_RESULT2 = document.getElementById("result2");
            const ELEM_RESULTLEAD = document.getElementById("resultlead");
            const ELEM_FORM = document.getElementById("form");
            document.getElementById(`sums-chart-${val.spot}`).checked = true;
            drawSums(val.spot);
            drawTable("scores", TSCORES, val.spot);

            if (val && val.award) {
                if ("無" == val.award) {
                    ELEM_RESULT.innerText = "残念ながらあなたは賞を獲得することができませんでした．"; //賞獲得ならず
                }
                else {
                    let spottext = val.spot == "flag" ? "選抜" : val.spot == "award" ? "オープン" : "";
                    ELEM_RESULTLEAD.innerText = spottext + "枠 " + val.award + "賞";
                    var text = "日本言語学オリンピック2022の競技結果に基づき，" + spottext + "枠" + val.award + "賞を授与いたします．";
                    if (val.aplo) {
                        text += "\n\n同時に2022年4月10日（日）実施予定のアジア太平洋言語学オリンピック2022（二次選抜）にご招待します．ただし，APLOは別途参加資格の確認があり，参加資格を満たす場合にのみ公式に参加ができます．詳しいことが決まり次第，メールでご連絡差し上げます．";
                    }
                    else if(val.spot == "flag"){
                        text += "\n\nあなたはAPLO（二次選抜）の出場権を獲得することはできませんでした．"
                    }
                    ELEM_RESULT.innerText = text;

                    // const snapshot2 = await firebase.database().ref("/contests/jol2022/users/" + user.uid).once("value");
                    // const contVal = snapshot2.val();
                    // if(contVal){
                    //     INPUT_NAME.value = contVal.name;
                    //     INPUT_NAME_ROMAN.value = contVal.nameRoman;
                    //     INPUT_ZIPCODE.value = contVal.zipcode;
                    //     INPUT_ADDRESS.value = contVal.address;
                    // }
                    // ELEM_FORM.style.display = "block";
                    ELEM_RESULT2.style.display = "block";
                }
                document.getElementsByTagName("body").item(0).style.opacity = 1;
            }
            else {
                location.href = "/account/";
            }
        }
        else {
            location.href = "/login/";
        }
    });
});

const INPUTS = document.querySelectorAll("#form input");

for (let j = 0; j < INPUTS.length; j++) {
    INPUTS[j].addEventListener("input", (e) => {
        UPDATE_INFO.disabled = false;
    });
}

function infoSubmit() {
    let user = firebase.auth().currentUser;
    if (user) {
        let data = {
            name: INPUT_NAME.value,
            nameRoman: INPUT_NAME_ROMAN.value,
            zipcode: INPUT_ZIPCODE.value,
            address: INPUT_ADDRESS.value
        };
        updateDatabasePushContToUser(data, "/contests/jol2022");
        window.removeEventListener('beforeunload', onBeforeunloadHandler);
        UPDATE_INFO.disabled = true;
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

Chart.defaults.global.defaultFontFamily = "-apple-system, BlinkMacSystemFont, YuGothic, 'Yu Gothic Medium', 'Yu Gothic', Verdana, Meiryo, sans-serif"
const borderDash = [10, 10];

function toRate(data) {
    let newdata = [];
    for (let i = 0; i < data.length; i++) {
        newdata[i] = data[i] * 100 / results.sums.maxs[i];
    }
    return newdata;
}

function drawSums(mode = "") {
    drawTable("sums", TSUMS, mode);
    const CSUMS = document.getElementById('c-sums');

    let datasets = [
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
    if (mode) {
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
        results.chartSums = new Chart(CSUMS, {
            type: 'radar',
            data: {
                labels: ['第1問', '第2問', '第3問', '第4問', '第5問'],
                datasets: datasets
            },
            options: {
                aspectRatio: 1,
                tooltips: {
                    callbacks: {
                        title: (tooltipItem, data) => {
                            return data.labels[tooltipItem[0].index];
                        },
                        label: (tooltipItem, data) => {
                            return [data.datasets[tooltipItem.datasetIndex].label + ": " + Math.round(tooltipItem.value * 100) / 100 + "%"];
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scale: {
                    angleLines: {
                        display: false
                    },
                    ticks: {
                        display: false,
                        stepSize: 20,
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
            value: Math.round((scores[i] - mins[i]) / (maxs[i] - mins[i]) * 100)
        };
        score.color = scores[i] >= maxs[i] ? color.border.success : 75 < score.value && score.value < 90 ? color.bg.jolred : color.border.jolred;
        let scoreLine = [
            "to right",
            `rgba(0,0,0,0) min(${score.value}%, calc(100% - ${score.range}))`,
            `${score.color} min(${score.value}%, calc(100% - ${score.range})) min(calc(${score.value}% + ${score.range}), 100%)`,
            `rgba(0,0,0,0) min(calc(${score.value}% + ${score.range}), 100%)`,
        ]
        let grad = [];
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