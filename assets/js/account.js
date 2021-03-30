//require appsys.js

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            for(let i = 0; i < USER_EMAILs.length; i++){
                USER_EMAILs[i].innerText = user.email;
            }

            const promiseBadge = (async () => {
                const snapshot = await firebase.database().ref("/badges/" + user.uid).once("value")
                const badges = snapshot.val();
                const contests = document.getElementsByClassName("appSys-contest");
                let toberemoved = [];
                for(let j = 0; j < contests.length; j++){
                    const cont = contests[j];
                    const badge = cont.getAttribute("data-visible-badge");
                    const eq = cont.getAttribute("data-visible-eq");

                    const isvisible = badge ? eq ? badges[badge] == eq : badges[badge] : true;
                    if(isvisible){
                        if(cont.getAttribute("data-status") == "entryopen"){
                            const contId = cont.getAttribute("data-id");
                            const snapshot2 = await firebase.database().ref("/contests/" + contId + "/users/" + user.uid).once("value");
                            const contestantInfo = snapshot2.val();
                            if(contestantInfo){
                                document.getElementById("entried-" + contId).style.display = "block";
                            }
                            else document.getElementById("entryopen-" + contId).style.display = "block";
                        }
                    }
                    else toberemoved.push(cont);
                }
                toberemoved.forEach((cont)=>{cont.remove()});
            })();
            const promiseUser = (async () => {
                const snapshot = await firebase.database().ref("/users/" + user.uid).once("value");
                let isnewuser = true;
                if(snapshot.val()){
                    var val = snapshot.val();
                    if(val.admin){
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
            
            await Promise.all([promiseBadge, promiseUser]).catch((e) => {
                console.error(e);
                alert("エラー");
            });
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