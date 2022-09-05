//require appsys.js

const stepLi = document.getElementById("stepList").getElementsByTagName("li");
const INPUT_PRE_UNIV = document.getElementById("input-pre-university");
const INPUT_MOTIVATION_TEXT = document.getElementById("input-motivation-text");
let INPUT_MOTIVATIONS = [];
const motivationLength = 10;

for (let i = 1; i <= motivationLength; i++) {
    INPUT_MOTIVATIONS.push(document.getElementById(`input-motivation${i.toString()}`));
}

let currentStep = 0;
let paid = false;

const clipboard = new ClipboardJS("#copy");
const COPY = document.getElementById("copy");
let tooltip = new bootstrap.Tooltip(COPY, {
    title: "Copied!",
    trigger: "manual"
});
clipboard.on('success', function (e) {
    // $("#copy").tooltip('dispose').tooltip({title: 'Copied!'}).tooltip('show');
    $("#copy").tooltip("show");
});

document.addEventListener("DOMContentLoaded", (event) => {
    for (let i = 0; i < stepLi.length; i++) {
        stepLi[i].onclick = warp.bind(null, i);
    }
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            //メールアドレスを取得して表示
            for (let i = 0; i < USER_EMAILs.length; i++) {
                USER_EMAILs[i].innerText = user.email;
            }
            INPUT_EMAIL.value = user.email;
            document.getElementById("copy").setAttribute("data-clipboard-text", user.email);
            const snapshot = await firebase.database().ref("/contests/jol2023/users/" + user.uid).once("value");
            let val = snapshot.val();
            if (val) {
                if (val.entry) {
                    await proceed(0, 3);
                }
                else {
                    await writeData(val);
                    updateSpot(val.spot);
                    await proceed(0, 2);
                }
            }
            else {
                const snapshot2 = await firebase.database().ref("/users/" + user.uid).once("value");
                if (snapshot2.val()) {
                    let val = snapshot2.val();
                    console.log(val);
                    if (val.entry) {
                        document.getElementById("mainmenu").style.display = "inline-block";
                        await writeData(val);
                    }
                }
                await proceed(0, 0);
            }
            window.removeEventListener('beforeunload', onBeforeunloadHandler);
            await firebase.database().ref("/orders/jol2023/" + user.email.replaceAll('.', '=')).on("value", async (snapshot2) => {
                const val2 = snapshot2.val();
                if (val2) {
                    paid = true;
                    await firebase.database().ref("/users/" + user.uid).update({ entry: "jol2023" });
                    await firebase.database().ref("/contests/jol2023/users/" + user.uid).update({ entry: true });
                    if (currentStep == 2) {
                        await proceed(currentStep, 3);
                    }
                    window.removeEventListener('beforeunload', onBeforeunloadHandler);
                }
            });
            document.getElementsByTagName("body").item(0).style.opacity = 1;
        }
        else {
            location.href = "/login/"
        }
    });
});

const INPUT_PA = document.getElementById('input-pa');

async function writeData(val) {
    INPUT_NAME.value = val.name || "";
    INPUT_NAME_ROMAN.value = val.nameRoman || "";
    INPUT_BIRTHDATE.value = val.birthdate || "";
    INPUT_SCHOOL_NAME.value = val.schoolName || "";
    INPUT_GRADE.value = val.grade || null;
    INPUT_PA.checked = val.pa;
    INPUT_PRE_UNIV.checked = val.preUniv;
    INPUT_ADDRESS.value = val.address || "";
    INPUT_ZIPCODE.value = val.zipcode || "";
    INPUT_PUBLISH.checked = val.publish;
    for (let i = 0; i < motivationLength; i++) {
        INPUT_MOTIVATIONS[i].checked = val.motivations ? val.motivations[i] || false : false;
    }
    INPUT_MOTIVATION_TEXT.value = val.motivationText || "";
}

function enableForm(formSelecter) {
    Array.prototype.map.call(
        document.querySelectorAll(formSelecter + " input:not(#input-email)"),
        function (i) {
            i.disabled = false;
        }
    );
    document.getElementById("step1-2").style.display = "block";
}

const modify_updateSpot = updateSpot;
updateSpot = (spot) => {
    const neg = spot == "flag" ? "award" : "flag";
    enableForm("#app-cont-info");
    document.getElementById("input-spot").value = spot;
    document.getElementById("select-spot-" + spot).classList.add("active");
    document.getElementById("select-spot-" + neg).classList.remove("active");
    modify_updateSpot(spot);
}

async function infoSubmit() {
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
        publish: INPUT_PUBLISH.checked,
        motivations: INPUT_MOTIVATIONS.map((v) => (v.checked)),
        motivationText: INPUT_MOTIVATION_TEXT.value,
        timestamp: Date.now()
    }
    await updateDatabasePushContToUser(data, "/contests/jol2023");
    if (paid) {
        proceed(1, 3);
        window.removeEventListener('beforeunload', onBeforeunloadHandler);
    }
    else {
        proceed(1, 2);
    }
}

async function proceed(prev, next) {
    currentStep = next;
    document.getElementById("stepList").getElementsByTagName("li")[prev].classList.remove("toc-active");
    document.getElementById("stepList").getElementsByTagName("li")[next].classList.add("toc-active");
    document.getElementById("step" + prev).style.display = "none";
    document.getElementById("step" + next).style.display = "block";
    window.addEventListener('beforeunload', onBeforeunloadHandler);
    window.scrollTo(0, 0);
}

function warp(next) {
    if (currentStep != 3 && currentStep > next) {
        proceed(currentStep, next);
    }
}

async function transitionToMainmenu() {
    const user = firebase.auth().currentUser;
    await firebase.database().ref("/users/" + user.uid).update({ entry: "mainmenu2023" });
    location.href = "/account/"
}