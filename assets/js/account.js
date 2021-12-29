//require appsys.js

// const ELEM_alert = document.getElementById("alert");
const ELEM_info = document.getElementById("info");

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            for(let i = 0; i < USER_EMAILs.length; i++){
                USER_EMAILs[i].innerText = user.email;
            }
            const paid = await firebase.database().ref('/orders/jol2022/' + user.email.replaceAll('.','=').toLowerCase()).once("value");
            if(!paid.val()){
                // ELEM_alert.style.display = "block";
                ELEM_info.style.display = "none";
            }
            const contests = document.getElementsByClassName("appSys-contest");
            let toberemoved = [];
            const promiseBadge = (async () => {
                const snapshot = await firebase.database().ref("/badges/" + user.uid).once("value")
                const badges = snapshot.val();
                for(let j = 0; j < contests.length; j++){
                    const cont = contests[j];
                    const badge = cont.getAttribute("data-visible-badge");
                    const eq = cont.getAttribute("data-visible-eq");

                    // const isvisible = badge ? eq ? badges[badge] == eq : badges[badge] : true;
                    let isvisible = true;
                    if(badge){
                        if(badges){
                            if(eq){
                                isvisible = badges[badge] && badges[badge] == eq;
                            }
                            else{
                                isvisible = badges[badge];
                            }
                        }
                        else{
                            isvisible = false;
                        }
                    }
                    if(isvisible){
                    }
                    else toberemoved.push(cont);
                }
            })();
            const promiseUser = (async () => {
                const snapshot = await firebase.database().ref("/users/" + user.uid).once("value");
                let isnewuser = true;
                if(snapshot.val()){
                    const val = snapshot.val();
                    if(val.admin){
                        toberemoved.splice(0);
                        const adminRef = await firebase.database().ref("/admin/" + user.uid).once("value");
                        if(adminRef.val()){
                            isnewuser = false;
                            const a = document.createElement("a");
                            a.href = "/admin-portal/";
                            a.innerText = "管理者ポータル";
                            a.classList.add("btn", "btn-info", "btn-small");
                            const refNode = document.querySelector("#content section");
                            refNode.parentNode.insertBefore(a,refNode);
                        }
                        else await firebase.database().ref("/users/" + user.uid).update({admin: false});
                    }
                    else{
                        for(let j = 0; j < contests.length; j++){
                            const cont = contests[j];
                            const spot = cont.getAttribute("data-visible-spot");

                            const isvisible = val.spot ? spot ? spot == val.spot : true : true;
                            if(isvisible){
                            }
                            else toberemoved.push(cont);
                        }
                    }
                    // if(val.entry == "jol2022"){
                    //     isnewuser = false;
                    // }
                    // else if(val.entry == "mainmenu2022"){
                    //     isnewuser = false;
                    // }
                }
                else{
                    await firebase.database().ref("/users/" + user.uid).set({
                        email: user.email
                    });
                }
                // if(isnewuser) location.href = "/entry/jol2022/";
            })();
            
            await Promise.all([promiseBadge, promiseUser]).catch((e) => {
                console.error(e);
                alert("エラー");
            });
            toberemoved.forEach((cont)=>{cont.remove()});
            for(let j = 0; j < contests.length; j++){
                const cont = contests[j];
                if(cont.getAttribute("data-status") == "entryopen"){
                    const contId = cont.getAttribute("data-id");
                    const snapshot2 = await firebase.database().ref("/contests/" + contId + "/users/" + user.uid).once("value");
                    const contestantInfo = snapshot2.val();
                    if(contestantInfo && contestantInfo.entry){
                        document.getElementById("entried-" + contId).style.display = "block";
                    }
                    else document.getElementById("entryopen-" + contId).style.display = "block";
                }
            }
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