//require appsys.js

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            for(let i = 0; i < USER_EMAILs.length; i++){
                USER_EMAILs[i].innerText = user.email;
            }
            // statusの説明 = {
            //     "pre": "開催予定 or 要選抜",
            //     "entryopen": "応募開始(only for JOL), 代表決定(else)",
            //     "siteopen": "オンライン限定．会場オープン中",
            //     "marking": "コンテスト（含面接）終了～結果待ち",
            //     "resultopen": "結果公開"
            // }
                
            const contests = [
                {
                    name: "jol2021",
                    // status: "pre", //応募開始前
                    // status: "entryopen", //応募開始後
                    // status: "siteopen", //会場オープン
                    // status: "marking", //会場閉鎖
                    status: "resultopen", //結果公開
                    visible:  (badge) => { // 応募期間終了後
                        return badge["jol2021"];
                    }
                },
                {
                    name: "aplo2021",
                    // status: "pre", //代表決定前
                    // status: "entryopen", //代表決定後
                    status: "siteopen", //会場オープン
                    visible: (badge) => {
                        // return badge["jol2021"] == "flag"; //jol選抜参加だけ
                        return badge["aplo2021"]; //出る人だけ
                    },
                },
                {
                    name: "iol2021",
                    status: "pre",
                    // status: "entryopen", //代表決定後
                    visible: (badge) => {
                        // return badge["jol2021"] == "flag"; //jol選抜参加だけ
                        return badge["aplo2021"]; //APLO代表だけ
                        // return badge["iol2021"]; //出る人だけ
                    },
                }
            ];

            const promiseBadge = (async () => {
                const snapshot = await firebase.database().ref("/badges/" + user.uid).once("value")
                let badges = snapshot.val();
                for(let j = 0; j < contests.length; j++){
                    let cont = contests[j];
                    
                    let isvisible = false;
                    if("visible" in cont){
                        isvisible = cont.visible(badges);
                    }
                    else isvisible = true;
                    if(isvisible){
                        document.getElementById("contest-" + cont.name).style.display = "block";

                        if(cont.status == "entryopen" && badges[cont.name]){
                            const snapshot2 = await firebase.database().ref("/contests/" + cont.name + "/users/" + user.uid).once("value");
                            let contestantInfo = snapshot2.val();
                            if(contestantInfo){
                                document.getElementById("entried-" + cont.name).style.display = "block";
                                document.getElementById("entried-" + cont.name + "-link").style.display = "inline-block";
                            }
                            else document.getElementById("entryopen-" + cont.name).style.display = "block";
                        }
                        else document.getElementById(cont.status + "-" + cont.name).style.display = "block";
                    }
                    else document.getElementById("contest-" + cont.name).remove();
                }
            })();
            const promiseUser = (async () => {
                const snapshot = await firebase.database().ref("/users/" + user.uid).once("value");
                let isnewuser = true;
                if(snapshot.val()){
                    var val = snapshot.val();
                    if(val.existing){
                        isnewuser = false;
                    }
                    // if(val.cancel){
                    //     APPCANCELCANCEL.style.display = "block";
                    //     BTNCANCEL.style.display = "none";
                    // }
                }
                else{
                    await firebase.database().ref("/users/" + user.uid).set({
                        email: user.email
                    });
                }
                if(isnewuser) location.href = "/newuser/";
            })();
            
            await Promise.all([promiseBadge, promiseUser]);
            document.getElementsByTagName("body").item(0).style.opacity = 1;
        }
        else{
            location.href = "/login/"
        }
    });
});

//form

// function cancel(){
//     firebase.auth().onAuthStateChanged((user) => {
//         if(user){
//             firebase.database().ref("/users/" + user.uid).update({
//                 cancel: true
//             }, (error) => {
//                 if(error){
//                     alert("キャンセルできませんでした")
//                 }
//                 else{
//                     alert("応募がキャンセルされました")
//                     APPCANCELCANCEL.style.display = "block";
//                     BTNCANCEL.style.display = "none";
//                 }
//             });
//         }
//     });
// }

// function cancelcancel(){
//     firebase.auth().onAuthStateChanged((user) => {
//         if(user){
//             firebase.database().ref("/users/" + user.uid).update({
//                 cancel: false
//             }, (error) => {
//                 if(error){
//                     alert("有効化できませんでした")
//                 }
//                 else{
//                     alert("応募が有効化されました")
//                     APPCANCELCANCEL.style.display = "none";
//                     BTNCANCEL.style.display = "block";
//                 }
//             });
//         }
//     });
// }