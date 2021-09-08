//require appsys.js

const INPUT_PRE_UNIV = document.getElementById("input-pre-university");

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            INPUT_EMAIL.value = user.email;
            const snapshot = await firebase.database().ref("/contests/aplo2021/users/" + user.uid).once("value");
            let val = snapshot.val();
            if(val){
                await writeData(val);
                INPUT_PRE_UNIV.checked = true;
                // UPDATE_INFO.innerText = "更新";
            }
            else{
                const snapshot2 = await firebase.database().ref("/users/" + user.uid).once("value");
                let isnewuser = true;
                if(snapshot2.val()){
                    let val = snapshot2.val();
                    if(val.existing){
                        isnewuser = false;
                        await writeData(val);
                    }
                }
                if(isnewuser) location.href = "/newuser/";
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
        publish: INPUT_PUBLISH.checked,
        zipcode: INPUT_ZIPCODE.value,
        address: INPUT_ADDRESS.value,
        timestamp: Date.now()
    };
    await updateDatabasePushContToUser(data, "/contests/aplo2021");
    window.removeEventListener('beforeunload', onBeforeunloadHandler);
    location.href = "/account/";
}