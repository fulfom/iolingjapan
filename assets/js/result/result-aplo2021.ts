import { app, auth, db } from "../firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp } from "firebase/database"

document.addEventListener("DOMContentLoaded", (event) => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const snapshot = await get(ref(db, "/contests/aplo2021/results/" + user.uid));
            const val = snapshot.val();
            // results.result = val;
            const ELEM_RESULT = document.getElementById("result");
            // document.getElementById(`sums-chart-${val.spot}`).checked = true;
            // drawSums(val.spot);
            // drawTable("scores", TSCORES, val.spot);

            if (val && val.award) {
                let text = "";
                if ("無" == val.award) {
                    text = "残念ながらあなたは賞を獲得することができませんでした．"; //賞獲得ならず
                    if (val.iol) {
                        text += "しかしあなたはIOL参加希望者の中で上位8名に入る成績を取りました．よってあなたを国際言語学オリンピック2021日本代表に選出します．";
                        document.getElementById("entry-iol")!.style.display = "inline-block"
                    }
                }
                else {
                    // let spottext = val.spot == "flag" ? "選抜" : val.spot == "award" ? "競技" : "";
                    text = "アジア太平洋言語学オリンピック2021の競技結果に基づき，" + val.award + "賞を授与いたします．";
                    if (val.iol) {
                        text += "同時にあなたを国際言語学オリンピック2021日本代表に選出します．";
                        document.getElementById("entry-iol")!.style.display = "inline-block"
                    }

                    // const snapshot2 = await firebase.database().ref("/contests/jol2021/users/" + user.uid).once("value");
                    // const contVal = snapshot2.val();
                    // if(contVal){
                    //     INPUT_NAME.value = contVal.name;
                    //     INPUT_NAME_ROMAN.value = contVal.nameRoman;
                    //     INPUT_ZIPCODE.value = contVal.zipcode;
                    //     INPUT_ADDRESS.value = contVal.address;
                    // }
                    // else{
                    //     const snapshot3 = await firebase.database().ref("/users/" + user.uid).once("value");
                    //     const userVal = snapshot3.val();
                    //     if(userVal){
                    //         INPUT_NAME.value = userVal.name;
                    //         INPUT_NAME_ROMAN.value = userVal.nameRoman;
                    //         INPUT_ZIPCODE.value = userVal.zipcode;
                    //         INPUT_ADDRESS.value = userVal.address;
                    //     }
                    // }
                }
                ELEM_RESULT!.innerText = text;
            }
            else {
                ELEM_RESULT!.innerText = "あなたはAPLO2021に出席していません．";
            }
            document.getElementsByTagName("body").item(0)!.style.opacity = "1";
        }
        else {
            location.href = "/login/";
        }
    });
});
