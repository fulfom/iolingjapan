document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            INPUT_EMAIL.value = user.email;
            document.getElementById('user-email').innerText = user.email;
            firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
                if(snapshot.val()){
                    var val = snapshot.val();
                    INPUT_NAME.value = val.name || '';
                    INPUT_NAME_ROMAN.value = val.nameRoman || '';
                    INPUT_BIRTHDATE.value = val.birthdate || '';
                    INPUT_SCHOOL_NAME.value = val.schoolName || '';
                    INPUT_GRADE.value = val.grade || null;
                    INPUT_PUBLISH.checked = val.publish;
                }
                else{
                    firebase.database().ref('/users/' + user.uid).set({
                        email: user.email
                    });
                }
                firebase.database().ref('/orders/' + user.email.replaceAll('.','=')).once('value').then((snapshot)=>{
                    var paid = false;
                    if(snapshot.val()){
                        if(snapshot.val().paid){
                            paid = true;
                            STEP_PAY.classList.add('step-done');
                            APP_PAY.classList.add('hidden');
                        }
                    }
                    if(paid && checkRequired()){
                        APP_STEP.classList.add('app-done');
                    }
                    document.getElementsByTagName('body').item(0).style.opacity = 1;
                })
            });
        }
        else{
            location.href = "/login/"
        }
    });
});

function logout(){
    firebase.auth().onAuthStateChanged( (user) => {
        firebase.auth().signOut().then(()=>{
        console.log("ログアウトしました");
        })
        .catch( (error)=>{
        console.log(`ログアウト時にエラーが発生しました (${error})`);
        });
    });
}

//form

const APP_STEP = document.getElementById('app-step');
const STEP_INFO = document.getElementById('step-info');
const STEP_PAY = document.getElementById('step-pay');
const APP_PAY = document.getElementById('app-pay');
const EDIT_INFO = document.getElementById('edit-info');
const UPDATE_INFO = document.getElementById('update-info');
const APP_CONT_INFO_STATUS = document.getElementById('app-cont-info-status');
const INPUT_EMAIL = document.getElementById('input-email');
const INPUT_NAME = document.getElementById('input-name');
const INPUT_NAME_ROMAN = document.getElementById('input-name-roman');
const INPUT_BIRTHDATE = document.getElementById('input-birthdate');
const INPUT_SCHOOL_NAME = document.getElementById('input-school-name');
const INPUT_GRADE = document.getElementById('input-grade');
const INPUT_PUBLISH = document.getElementById('input-publish');
const DATE20 = new Date('2001-07-20');

function infoSubmit(){
    window.removeEventListener('beforeunload', onBeforeunloadHandler);
    checkRequired();
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            firebase.database().ref('/users/' + user.uid).update({
                name: INPUT_NAME.value,
                nameRoman: INPUT_NAME_ROMAN.value,
                birthdate: INPUT_BIRTHDATE.value,
                schoolName: INPUT_SCHOOL_NAME.value || '',
                grade: INPUT_GRADE.value,
                publish: INPUT_PUBLISH.checked
            });
        }
    });
    disableForm();
}

function checkRequired(){
    if(INPUT_NAME.value != "" && INPUT_NAME_ROMAN.value != "" && INPUT_BIRTHDATE.value != ""){
        STEP_INFO.classList.add('step-done');
        updateEntry();
        return true;
    }
    else{
        APP_CONT_INFO_STATUS.innerText = "未入力の情報があります";
        return false;
    }
}

function updateEntry(){
    const BIRTHDATE = new Date(INPUT_BIRTHDATE.value);
    var isAgeUnder20 = BIRTHDATE.getTime() > DATE20.getTime();
    var schoolName = INPUT_SCHOOL_NAME.value;
    var grade = INPUT_GRADE.value;
    var entry = (isAgeUnder20 && schoolName !="" && grade != "");
    APP_CONT_INFO_STATUS.innerText = (entry ? "選抜参加者として登録中(代表選抜の対象です)" : "競技参加者として登録中(代表選抜の対象ではありません)");
}

function disableForm(){
    EDIT_INFO.disabled = false;
    UPDATE_INFO.disabled = true;
    Array.prototype.map.call(
    document.querySelectorAll("#app-cont-info input:not(#input-email)"),
        function(i){
            i.disabled=true;
            i.classList.add('form-control-plaintext');
            i.classList.remove('form-control');
        }
    );
}

function enableForm(){
    EDIT_INFO.disabled = true;
    UPDATE_INFO.disabled = false;
    Array.prototype.map.call(
    document.querySelectorAll("#app-cont-info input:not(#input-email)"),
        function(i){
            i.disabled=false;
            i.classList.remove('form-control-plaintext')
            i.classList.add('form-control');
        }
    );
}

var checkValue = document.querySelectorAll('#app-cont-info input');
var submitBtn = document.querySelector('#update-info');
var checkFlag = false;
var onBeforeunloadHandler = function(e) {
    var msg = 'このページから移動すると入力フォームの内容が消えます．';
    e.returnValue = msg;
};
var formAlert = function() {
    if(!checkFlag) {
    window.addEventListener('beforeunload', onBeforeunloadHandler);
    for(var i = 0; i < checkValue.length; i++) {
        checkValue[i].removeEventListener('input', formAlert);
        checkValue[i].removeEventListener('change', formAlert);
    }
    checkFlag = true;
    }
};
for(var i = 0; i < checkValue.length; i++) {
    checkValue[i].addEventListener('input', formAlert);
    checkValue[i].addEventListener('change', formAlert);
}