const USER_EMAILs = document.getElementsByClassName('user-email');
// const APPCANCELCANCEL = document.getElementById('app-cancel-cancel');
// const BTNCANCEL = document.getElementById('btncancel');
const APP_STEP = document.getElementById('app-step');
const STEP_INFO = document.getElementById('step-info');
const STEP_PAY = document.getElementById('step-pay');
const APP_PAY = document.getElementById('app-pay');
const EDIT_INFO = document.getElementById('edit-info');
const UPDATE_INFO = document.getElementById('update-info');
const INPUT_EMAIL = document.getElementById('input-email');
const INPUT_NAME = document.getElementById('input-name');
const INPUT_NAME_ROMAN = document.getElementById('input-name-roman');
const INPUT_BIRTHDATE = document.getElementById('input-birthdate');
const INPUT_SCHOOL_NAME = document.getElementById('input-school-name');
const INPUT_GRADE = document.getElementById('input-grade');
const INPUT_PUBLISH = document.getElementById('input-publish');
const INPUT_SPOT = document.getElementsByName('spot');
const INPUT_ZIPCODE = document.getElementById('input-zipcode');
const INPUT_ADDRESS = document.getElementById('input-address');
const DATE20 = new Date('2001-07-20');

function logout() {
    firebase.auth().onAuthStateChanged((user) => {
        firebase.auth().signOut().then(() => {
            console.log("ログアウトしました");
        })
            .catch((error) => {
                console.log(`ログアウト時にエラーが発生しました (${error})`);
            });
    });
}

//form

const FORM_GROUPs = document.querySelectorAll("#app-cont-info .form-group");
// getElementById("app-cont-info").getElementsByClassName("form-group");
const FORM_BIRTHDATE = document.getElementById("form-birthdate");

async function updateDatabase(data, prefix = "") {
    let user = firebase.auth().currentUser;
    if (user) {
        await firebase.database().ref(prefix + '/users/' + user.uid).update(data);
    }
}

async function updateDatabasePushContToUser(data, prefix) {
    let user = firebase.auth().currentUser;
    if (user) {
        const FBDB_USERS = firebase.database().ref("/users/" + user.uid);
        const promiseUSERS = (async () => {
            const snapshot = await FBDB_USERS.once("value");
            let val = snapshot.val();
            if (val) {
                if (!val.settings || !val.settings.pushContToUser) {
                    await FBDB_USERS.update(data);
                }
            }
        })();
        const promisePREFIX_USERS = firebase.database().ref(prefix + '/users/' + user.uid).update(data);
        await Promise.all([promiseUSERS, promisePREFIX_USERS]);
    }
}

function disableForm(formSelecter) {
    EDIT_INFO.disabled = false;
    UPDATE_INFO.disabled = true;
    UPDATE_INFO.style.opacity = 0;
    Array.prototype.map.call(
        document.querySelectorAll(formSelecter + " input:not(#input-email)"),
        function (i) {
            i.disabled = true;
            i.classList.add("form-control-plaintext");
            i.classList.remove("form-control");
        }
    );
}

function enableForm(formSelecter) {
    EDIT_INFO.disabled = true;
    UPDATE_INFO.disabled = false;
    UPDATE_INFO.style.opacity = 1;
    Array.prototype.map.call(
        document.querySelectorAll(formSelecter + " input:not(#input-email)"),
        function (i) {
            i.disabled = false;
            i.classList.remove("form-control-plaintext")
            i.classList.add("form-control");
        }
    );
}

function checkedRadio(radioNodeList) {
    for (let i = 0; i < radioNodeList.length; i++) {
        if (radioNodeList[i].checked == true) {
            return radioNodeList[i];
        }
    }
}

const FORM_INPUTs = document.querySelectorAll('#content input');
var checkFlag = false;
var onBeforeunloadHandler = function (e) {
    var msg = 'このページから移動すると入力フォームの内容が消えます．';
    e.returnValue = msg;
}
var formAlert = function () {
    if (!checkFlag) {
        window.addEventListener('beforeunload', onBeforeunloadHandler);
        for (var i = 0; i < FORM_INPUTs.length; i++) {
            FORM_INPUTs[i].removeEventListener('input', formAlert);
            FORM_INPUTs[i].removeEventListener('change', formAlert);
        }
        checkFlag = true;
    }
}
for (var i = 0; i < FORM_INPUTs.length; i++) {
    FORM_INPUTs[i].addEventListener('input', formAlert);
    FORM_INPUTs[i].addEventListener('change', formAlert);
}

async function writeData(val) {
    INPUT_NAME.value = val.name || "";
    INPUT_NAME_ROMAN.value = val.nameRoman || "";
    INPUT_BIRTHDATE.value = val.birthdate || "";
    INPUT_SCHOOL_NAME.value = val.schoolName || "";
    INPUT_GRADE.value = val.grade || null;
    INPUT_PUBLISH.checked = val.publish;
    INPUT_ADDRESS.value = val.address || "";
    INPUT_ZIPCODE.value = val.zipcode || "";
}


const debounce = (
    callback,
    delay = 250,
) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => callback(...args), delay)
    }
}

function throttle(fn, delay) {
    let timerId;
    let lastExecTime = 0;
    return () => {
        const context = this;
        const args = arguments;
        let elapsedTime = performance.now() - lastExecTime;
        const execute = () => {
            fn.apply(context, args);
            lastExecTime = performance.now();
        }
        if (!timerId) {
            execute();
        }
        if (timerId) {
            clearTimeout(timerId);
        }
        if (elapsedTime > delay) {
            execute();
        } else {
            timerId = setTimeout(execute, delay);
        }
    }
}
