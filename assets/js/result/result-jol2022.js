// let results = {
//     sums: {
//         avgs: {
//             flag: {
//                 gold: [82.20, 18.20, 15.80, 15.60, 32.60],
//                 silver: [64.91, 17.00, 7.64, 14.91, 25.36],
//                 bronze: [52.13, 15.87, 4.84, 12.19, 19.23],
//                 whole: [38.33, 11.27, 4.04, 9.04, 13.97]
//             },
//             award: {
//                 gold: [92.50, 19.00, 19.50, 17.00, 37.00],
//                 silver: [70.62, 17.54, 6.92, 16.15, 30.00],
//                 bronze: [54.20, 13.60, 6.40, 11.20, 23.00],
//                 whole: [40.94, 11.88, 4.19, 9.79, 15.07]
//             },
//             all: {
//                 whole: [39.04, 11.44, 4.09, 9.25, 14.27]
//             }
//         },
//         maxs: [100, 20, 20, 20, 40],
//         mins: [0, 0, 0, 0, 0],
//         borders: {
//             flag: [39, 46, 59, 71, 93], //honorouble, bronze, silver, gold (lowest), gold (highest)
//             award: [44, 50, 62, 89, 96]
//         }
//     },
//     scores: {
//         avgs: [1.18, 1.59, 1.6, 1.06, 1.17, 0.65, 0.93, 1.42, 0.78, 1.04, 0.27, 0.36, 0.20, 0.31, 0.20, 0.23, 0.23, 0.07, 0.14, 0.10, 0.17, 0.09, 0.98, 0.24, 0.20, 0.21, 1.00, 1.13, 1.06, 1.21, 1.31, 0.97, 0.91, 0.45, 0.20, 1.00, 1.33, 1.14, 0.67, 0.57, 0.46, 0.41, 0.78, 0.90, 0.60, 0.99, 0.63, 0.82, 0.71, 1.00, 0.47, 0.79, 0.38, 0.69, 0.34, 0.59],
//         maxs: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
//         mins: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, 0, 0, -1, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//     }
// }
// const TSUMS = {
//     tr: document.querySelectorAll("#t-sums > tbody > tr"),
//     td1: document.querySelectorAll("#t-sums > tbody > tr > td:nth-child(1)"),
//     td2: document.querySelectorAll("#t-sums > tbody > tr > td:nth-child(2)")
// };
// const TSCORES = {
//     tr: document.querySelectorAll(".t-scores > tbody > tr"),
//     td1: document.querySelectorAll(".t-scores > tbody > tr > td:nth-child(1)"),
//     td2: document.querySelectorAll(".t-scores > tbody > tr > td:nth-child(2)")
// };

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const snapshot = await firebase.database().ref("/contests/jol2022/results/" + user.uid).once("value");
            const val = snapshot.val();
            // results.result = val;
            const ELEM_RESULT = document.getElementById("result");
            const ELEM_RESULT2 = document.getElementById("result2");
            const ELEM_RESULTLEAD = document.getElementById("resultlead");
            const ELEM_FORM = document.getElementById("form");
            // document.getElementById(`sums-chart-${val.spot}`).checked = true;
            // drawSums(val.spot);
            // drawTable("scores", TSCORES, val.spot);

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
                    ELEM_RESULT.innerText = text;

                    const snapshot2 = await firebase.database().ref("/contests/jol2022/users/" + user.uid).once("value");
                    const contVal = snapshot2.val();
                    if(contVal){
                        INPUT_NAME.value = contVal.name;
                        INPUT_NAME_ROMAN.value = contVal.nameRoman;
                        INPUT_ZIPCODE.value = contVal.zipcode;
                        INPUT_ADDRESS.value = contVal.address;
                    }
                    ELEM_FORM.style.display = "block";
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

// const color = {
//     bg: {
//         jolred: "rgba(254, 98, 77, 0.2)",
//         red: 'rgba(255, 99, 132, 0.2)',
//         blue: 'rgba(54, 162, 235, 0.2)',
//         yellow: 'rgba(255, 206, 86, 0.2)',
//         green: 'rgba(75, 192, 192, 0.2)',
//         purple: 'rgba(153, 102, 255, 0.2)',
//         orange: 'rgba(255, 159, 64, 0.2)',
//         primary: "rgba(56, 167, 187, 0.2)",
//         success: "rgba(56, 187, 142, 0.2)",
//         gold: "rgba(200, 177, 89, 0.2)",
//         silver: "rgba(161, 161, 161, 0.2)",
//         bronze: "rgba(200, 144, 89, 0.2)",
//         honorouble: "rgba(56, 187, 142, 0.2)"
//     },
//     border: {
//         jolred: "rgba(254, 98, 77, 1)",
//         red: 'rgba(255, 99, 132, 1)',
//         blue: 'rgba(54, 162, 235, 1)',
//         yellow: 'rgba(255, 206, 86, 1)',
//         green: 'rgba(75, 192, 192, 1)',
//         purple: 'rgba(153, 102, 255, 1)',
//         orange: 'rgba(255, 159, 64, 1)',
//         primary: "rgba(56, 167, 187, 1)",
//         danger: "rgba(187, 76, 56, 1)",
//         success: "rgba(56, 187, 142, 1)",
//         // success: "#28a745",
//         // gold: "#eee7cc",
//         gold: "rgba(200, 177, 89, 1)",
//         // silver: "#ddd",
//         silver: "rgba(161, 161, 161, 1)",
//         // bronze: "#edc",
//         bronze: "rgba(200, 144, 89, 1)",
//         // whole: "#aaa",
//         whole: "#777",
//         // whole: "#777",
//         honorouble: "rgba(75, 192, 192, 1)"
//     }
// }

// Chart.defaults.global.defaultFontFamily = "-apple-system, BlinkMacSystemFont, YuGothic, 'Yu Gothic Medium', 'Yu Gothic', Verdana, Meiryo, sans-serif"
// const borderDash = [10, 10];

// function toRate(data) {
//     let newdata = [];
//     for (let i = 0; i < data.length; i++) {
//         newdata[i] = data[i] * 100 / results.sums.maxs[i];
//     }
//     return newdata;
// }

// function drawSums(mode = "") {
//     drawTable("sums", TSUMS, mode);
//     const CSUMS = document.getElementById('c-sums');

//     let datasets = [
//         {
//             label: 'あなた',
//             data: toRate(results.result.sums).slice(1),
//             backgroundColor: color.bg.jolred,
//             borderColor: color.border.jolred,
//             pointBorderColor: "#fff",
//             pointBackgroundColor: color.border.jolred,
//             pointHoverBorderColor: color.border.jolred,
//             pointHoverBackgroundColor: "#fff"
//         }
//     ];
//     if (mode) {
//         datasets = datasets.concat([
//             {
//                 label: '金',
//                 data: toRate(results.sums.avgs[mode].gold).slice(1),
//                 fill: false,
//                 // backgroundColor: color.bg.gold,
//                 borderDash: borderDash,
//                 borderColor: color.border.gold,
//                 pointBorderColor: "#fff",
//                 pointBackgroundColor: color.border.gold,
//                 pointHoverBorderColor: color.border.gold,
//                 pointHoverBackgroundColor: "#fff"
//             },
//             {
//                 label: '銀',
//                 data: toRate(results.sums.avgs[mode].silver).slice(1),
//                 fill: false,
//                 // backgroundColor: color.bg.silver,
//                 borderDash: borderDash,
//                 borderColor: color.border.silver,
//                 pointBorderColor: "#fff",
//                 pointBackgroundColor: color.border.silver,
//                 pointHoverBorderColor: color.border.silver,
//                 pointHoverBackgroundColor: "#fff"
//             },
//             {
//                 label: '銅',
//                 data: toRate(results.sums.avgs[mode].bronze).slice(1),
//                 fill: false,
//                 borderDash: borderDash,
//                 borderColor: color.border.bronze,
//                 pointBorderColor: "#fff",
//                 pointBackgroundColor: color.border.bronze,
//                 pointHoverBorderColor: color.border.bronze,
//                 pointHoverBackgroundColor: "#fff"
//             },
//             {
//                 label: '全体',
//                 data: toRate(results.sums.avgs[mode].whole).slice(1),
//                 fill: false,
//                 borderDash: borderDash,
//                 borderColor: color.border.whole,
//                 pointBorderColor: "#fff",
//                 pointBackgroundColor: color.border.whole,
//                 pointHoverBorderColor: color.border.whole,
//                 pointHoverBackgroundColor: "#fff"
//             }
//         ]);
//     }
//     else {
//         datasets = datasets.concat([
//             {
//                 label: '全体',
//                 data: toRate(results.sums.avgs.all.whole).slice(1),
//                 fill: false,
//                 borderDash: borderDash,
//                 borderColor: color.border.whole,
//                 pointBorderColor: "#fff",
//                 pointBackgroundColor: color.border.whole,
//                 pointHoverBorderColor: color.border.whole,
//                 pointHoverBackgroundColor: "#fff"
//             }
//         ]);
//     }

//     if (results.chartSums) {
//         results.chartSums.data.datasets = datasets;
//         results.chartSums.update();
//     }
//     else {
//         results.chartSums = new Chart(CSUMS, {
//             type: 'radar',
//             data: {
//                 labels: ['第1問', '第2問', '第3問', '第4問'],
//                 datasets: datasets
//             },
//             options: {
//                 aspectRatio: 1,
//                 tooltips: {
//                     callbacks: {
//                         title: (tooltipItem, data) => {
//                             return data.labels[tooltipItem[0].index];
//                         },
//                         label: (tooltipItem, data) => {
//                             return [data.datasets[tooltipItem.datasetIndex].label + ": " + Math.round(tooltipItem.value * 100) / 100 + "%"];
//                         }
//                     }
//                 },
//                 elements: {
//                     line: {
//                         borderWidth: 3
//                     }
//                 },
//                 scale: {
//                     angleLines: {
//                         display: false
//                     },
//                     ticks: {
//                         display: false,
//                         stepSize: 20,
//                         suggestedMin: 0,
//                         suggestedMax: 100
//                     }
//                 }
//             }
//         });
//     }
// }

// function drawTable(mode, T, spot = "") {
//     const scores = results.result[mode];
//     let avgs = mode == "scores" ? results[mode].avgs : results[mode].avgs[spot || "all"]["whole"];
//     let maxs = results[mode].maxs;
//     let mins = results[mode].mins;
//     for (let i = 0; i < scores.length; i++) {
//         T.td2[i].innerText = scores[i];
//         T.td2[i].setAttribute("data-min", mins[i]);
//         T.td2[i].setAttribute("data-max", maxs[i]);
//         let avg = {
//             color: "#eee",
//             range: "0px",
//             value: Math.round((avgs[i] - mins[i]) / (maxs[i] - mins[i]) * 100)
//         };
//         let score = {
//             range: "5px",
//             value: Math.round((scores[i] - mins[i]) / (maxs[i] - mins[i]) * 100)
//         };
//         score.color = scores[i] >= maxs[i] ? color.border.success : 75 < score.value && score.value < 90 ? color.bg.jolred : color.border.jolred;
//         let scoreLine = [
//             "to right",
//             `rgba(0,0,0,0) min(${score.value}%, calc(100% - ${score.range}))`,
//             `${score.color} min(${score.value}%, calc(100% - ${score.range})) min(calc(${score.value}% + ${score.range}), 100%)`,
//             `rgba(0,0,0,0) min(calc(${score.value}% + ${score.range}), 100%)`,
//         ]
//         let grad = [];
//         if (mode == "sums" && i == 0 && spot) {
//             let borders = results.sums.borders[spot];
//             grad = [
//                 "to right",
//                 `${avg.color} ${avg.value}%`,
//                 `#fff ${avg.value}% ${borders[0]}%`,
//                 `${color.bg.honorouble} ${borders[0]}% ${borders[1]}%`,
//                 `${color.bg.bronze} ${borders[1]}% ${borders[2]}%`,
//                 `${color.bg.silver} ${borders[2]}% ${borders[3]}%`,
//                 `${color.bg.gold} ${borders[3]}% ${borders[4]}%`,
//                 `#fff ${borders[4]}%`
//             ]
//         }
//         else {
//             grad = [
//                 "to right",
//                 `${avg.color} ${avg.value}%`,
//                 `#fff ${avg.value}%`
//             ]
//         }
//         // T.td1[i].style.background = `linear-gradient(${scoreLine.join(", ")}), linear-gradient(${grad.join(", ")})`;
//         T.td2[i].style.background = `linear-gradient(${scoreLine.join(", ")}), linear-gradient(${grad.join(", ")})`;
//     }
// }

// function updateSums(mode = "") {
//     drawSums(mode);
// }