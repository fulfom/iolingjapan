document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            const snapshot = await firebase.database().ref("/contests/jol2021/results/" + user.uid).once("value");
            const val = snapshot.val();
            const ELEM_RESULT = document.getElementById("result");

            if (val && val.award) {
                if ("無" == val.award) {
                    ELEM_RESULT.innerText = "残念ながらあなたは賞を獲得することができませんでした．"; //賞獲得ならず
                }
                else {
                    let spottext = val.spot == "flag" ? "選抜" : val.spot == "award" ? "競技": "";
                    var text = "日本言語学オリンピック2021の競技結果に基づき，" + spottext + "参加枠 - " + val.award + "賞を授与いたします．";
                    if (val.aplo) {
                        text += "同時にアジア太平洋言語学オリンピック2021（二次選抜）にご招待します．";
                    }
                    ELEM_RESULT.innerText = text;

                    const INPUT_ZIPCODE = document.getElementById("input-zipcode");
                    const INPUT_ADDRESS = document.getElementById("input-address");

                    const snapshot2 = await firebase.database().ref("/contests/jol2021/users/" + user.uid).once("value");
                    const contVal = snapshot2.val();
                    if(contVal){
                        INPUT_ZIPCODE.value = contVal.zipcode;
                        INPUT_ADDRESS.value = contVal.address;
                    }
                    else{
                        const snapshot3 = await firebase.database().ref("/users/" + user.uid).once("value");
                        const userVal = snapshot3.val();
                        if(userVal){
                            INPUT_ZIPCODE.value = userVal.zipcode;
                            INPUT_ADDRESS.value = userVal.address;
                        }
                    }
                }
            }
            else {
                ELEM_RESULT.innerText = "あなたはJOL2021に出席していません．";
            }
            document.getElementsByTagName("body").item(0).style.opacity = 1;
        }
        else{
            location.href = "/login/";
        }
    });
});

const INPUTS = document.querySelectorAll("#form input");

for(let j = 0; j < INPUTS.length; j++){
    INPUTS[j].addEventListener("input", (e) => {
        UPDATE_INFO.disabled = false;
    });
}

function infoSubmit(){
    let user = firebase.auth().currentUser;
    if(user){
        let data = {
            zipcode: INPUT_ZIPCODE.value,
            address: INPUT_ADDRESS.value,
            timestamp: Date.now()
        };
        updateDatabasePushContToUser(data, "/contests/jol2021");
        window.removeEventListener('beforeunload', onBeforeunloadHandler);
        UPDATE_INFO.disabled = true;
    }
}