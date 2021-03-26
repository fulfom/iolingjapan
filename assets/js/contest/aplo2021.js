const CONFIRM = document.getElementById("confirm");

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            const sn = await firebase.database().ref("/contests/aplo2021/users/" + user.uid).once("value");
            const val = sn.val();
            if(val){
                updateConfirmation(val.package);
                document.getElementsByTagName("body")[0].style.opacity = 1;
            }
            else{
                location.href = "/account/";
            }
        }
        else location.href = "/login/";
    });
});

function updateConfirmation(package){
    if(package){
        CONFIRM.innerText = "確認済";
        CONFIRM.disabled = true;
    }
    else{
        CONFIRM.innerText = "確認する";
        CONFIRM.disabled = false;
    }
}

async function confirm(){
    let user = firebase.auth().currentUser;
    if(user){
        await firebase.database().ref("/contests/aplo2021/users/" + user.uid).update({package: true})
        .catch(err => {
            alert("エラー");
        });
        updateConfirmation(true);
    }
    else location.href = "/login/";
}