//require appsys.js

const INPUT_PRE_UNIV = document.getElementById("input-pre-university");

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            //メールアドレスを取得して表示
            for(let i = 0; i < USER_EMAILs.length; i++){
                USER_EMAILs[i].innerText = user.email;
            }
            INPUT_EMAIL.value = user.email;
            const snapshot = await firebase.database().ref("/contests/jol2022/users/" + user.uid).once("value");
            let val = snapshot.val();
            if(val){
                await writeData(val);
                updateSpot(val.spot);
            }
            else{
                location.href = "/account/"
            }
            window.removeEventListener('beforeunload', onBeforeunloadHandler);
            document.getElementsByTagName("body").item(0).style.opacity = 1;
        }
        else{
            location.href = "/login/"
        }
    });
});

const INPUT_PA = document.getElementById('input-pa');

async function writeData(val){
    INPUT_NAME.value = val.name || "";
    INPUT_NAME_ROMAN.value = val.nameRoman || "";
    INPUT_BIRTHDATE.value = val.birthdate || "";
    INPUT_SCHOOL_NAME.value = val.schoolName || "";
    INPUT_GRADE.value = val.grade || null;
    INPUT_PA.checked = val.pa;
    INPUT_PRE_UNIV.checked = val.preUniv;
    INPUT_ADDRESS.value = val.address || "";
    INPUT_ZIPCODE.value = val.zipcode || "";
}

function enableForm(formSelecter){
    Array.prototype.map.call(
    document.querySelectorAll(formSelecter + " input:not(#input-email)"),
        function(i){
            i.disabled=false;
        }
    );
}

const modify_updateSpot = updateSpot;
updateSpot = (spot) => {
    const neg = spot == "flag" ? "award" : "flag";
    // enableForm("#app-cont-info");
    document.getElementById("input-spot").value = spot;
    document.getElementById("select-spot-"+spot).classList.add("active");
    document.getElementById("select-spot-"+neg).classList.remove("active");
    modify_updateSpot(spot);
}

async function infoSubmit(){
    const data = {
        spot: document.getElementById("input-spot").value,
        email: INPUT_EMAIL.value,
        name: INPUT_NAME.value,
        nameRoman: INPUT_NAME_ROMAN.value,
        birthdate: INPUT_BIRTHDATE.value,
        schoolName: INPUT_SCHOOL_NAME.value || '',
        grade: INPUT_GRADE.value || 0,
        pa: INPUT_PA.checked,
        preUniv: INPUT_PRE_UNIV.checked,
        zipcode: INPUT_ZIPCODE.value,
        address: INPUT_ADDRESS.value,
        timestamp: Date.now()
    }
    await updateDatabasePushContToUser(data, "/contests/jol2022");
    window.removeEventListener('beforeunload', onBeforeunloadHandler);
    location.href = "/account/"
}