const formUserInfo = "#app-cont-info";

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            // INPUT_EMAIL.value = user.email;
            for(let i = 0; i < USER_EMAILs.length; i++){
                USER_EMAILs[i].innerText = user.email;
            }
            const snapshot = await firebase.database().ref("/users/" + user.uid).once("value");
            let isnewuser = true;
            let val = snapshot.val();
            if(val){
                if(val.existing){
                    isnewuser = false;
                    await Promise.all([
                        writeSettings(val.settings),
                        writeData(val)
                    ]);
                }
                // if(val.cancel){
                //     APPCANCELCANCEL.style.display = "block";
                //     BTNCANCEL.style.display = "none";
                // }
                if(val.spot){
                    document.getElementById("input-spot-" + val.spot).checked = true;
                    await updateSpot(val.spot);
                }
            }
            else{
                await firebase.database().ref("/users/" + user.uid).set({
                    email: user.email
                });
            }
            if(isnewuser) location.href = "/newuser/";
            document.getElementsByTagName("body").item(0).style.opacity = 1;
        }
        else{
            location.href = "/login/"
        }
    });
});

async function infoSubmit(){
    const data = {
        name: INPUT_NAME.value,
        nameRoman: INPUT_NAME_ROMAN.value,
        birthdate: INPUT_BIRTHDATE.value,
        schoolName: INPUT_SCHOOL_NAME.value || '',
        grade: INPUT_GRADE.value,
        publish: INPUT_PUBLISH.checked,
        spot: checkedRadio(INPUT_SPOT).value || "",
        zipcode: INPUT_ZIPCODE.value,
        address: INPUT_ADDRESS.value,
        timestamp: Date.now()
    }
    await updateDatabase(data);
    window.removeEventListener('beforeunload', onBeforeunloadHandler);
    disableForm(formUserInfo);
}

function selectSpot(spot){
    updateSpot(spot);
}

async function updateSpot(spot){
    //spot選択を app-cont-info に反映
    if(spot == "flag"){
        for(let i = 0; i < FORM_GROUPs.length; i++){
            if(FORM_GROUPs[i].classList.contains("spot-award-delete")){
                FORM_GROUPs[i].style.display = "block";
                if(!FORM_GROUPs[i].classList.contains("nr")) FORM_GROUPs[i].getElementsByTagName("input")[0].required = true;
            }
        }
    }
    else if(spot == "award"){
        for(let i = 0; i < FORM_GROUPs.length; i++){
            if(FORM_GROUPs[i].classList.contains("spot-award-delete")){
                FORM_GROUPs[i].style.display = "none";
                if(!FORM_GROUPs[i].classList.contains("nr")) FORM_GROUPs[i].getElementsByTagName("input")[0].required = false;
            }
        }
    }
}

const INPUTS = document.querySelectorAll("#app-settings input");
const SETTINGSUPDATE = document.getElementById("settingsUpdate");

for(let j = 0; j < INPUTS.length; j++){
    INPUTS[j].addEventListener("change", (e) => {
        SETTINGSUPDATE.disabled = false;
    });
}

function settingsUpdate(){
    let user = firebase.auth().currentUser;
    if(user){
        let settings = {};
        for(let i = 0; i < INPUTS.length; i++){
            settings[INPUTS[i].id] = INPUTS[i].classList.contains("prechecked") ^ INPUTS[i].checked;
        }
        firebase.database().ref("/users/" + user.uid + "/settings/").update(settings);
        SETTINGSUPDATE.disabled = true;
        window.removeEventListener('beforeunload', onBeforeunloadHandler);
    }
}

async function writeSettings(settings){
    for(let i = 0; i < INPUTS.length; i++){
        INPUTS[i].checked = INPUTS[i].classList.contains("prechecked") ^ settings[INPUTS[i].id];
    }
    return true;
}
