//require appsys.js

const INPUT_PRE_UNIV = document.getElementById("input-pre-university");

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            INPUT_EMAIL.value = user.email;
            const snapshot = await firebase.database().ref("/contests/iol2021/users/" + user.uid).once("value");
            let val = snapshot.val();
            if(val){
                await writeData2(val);
                INPUT_PRE_UNIV.checked = true;
                UPDATE_INFO.innerText = "応募済み";
                UPDATE_INFO.disabled = true;
                const formSelecter = "#app-cont-info";
                Array.prototype.map.call(
                    document.querySelectorAll(formSelecter + " input:not(#input-email)"),
                    function(i){
                        i.disabled = true;
                        i.classList.add("form-control-plaintext");
                        i.classList.remove("form-control");
                    }
                );
            }
            else{
                const snapshot2 = await firebase.database().ref("/users/" + user.uid).once("value");
                let val = snapshot2.val();
                if(val && val.existing){
                    await writeData2(val);
                }
                else location.href = "/newuser/";
            }
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
        zipcode: INPUT_ZIPCODE.value,
        address: INPUT_ADDRESS.value,
        timestamp: Date.now()
    };
    await updateDatabasePushContToUser(data, "/contests/iol2021");
    window.removeEventListener('beforeunload', onBeforeunloadHandler);
    location.href = "/account/";
}

async function writeData2(val){
    INPUT_NAME.value = val.name || "";
    INPUT_NAME_ROMAN.value = val.nameRoman || "";
    INPUT_BIRTHDATE.value = val.birthdate || "";
    INPUT_SCHOOL_NAME.value = val.schoolName || "";
    INPUT_GRADE.value = val.grade || null;
    INPUT_ADDRESS.value = val.address || "";
    INPUT_ZIPCODE.value = val.zipcode || "";
}