//need to be used with appsys.js
//実際にはjol2021で使用されていない．参考のため

document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            INPUT_EMAIL.value = user.email;
            for(let i = 0; i < USER_EMAILs.length; i++){
                USER_EMAILs[i].innerText = user.email;
            }

            firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
                if(snapshot.val()){
                    var val = snapshot.val();
                    INPUT_NAME.value = val.name || '';
                    INPUT_NAME_ROMAN.value = val.nameRoman || '';
                    INPUT_BIRTHDATE.value = val.birthdate || '';
                    INPUT_SCHOOL_NAME.value = val.schoolName || '';
                    INPUT_GRADE.value = val.grade || null;
                    INPUT_PUBLISH.checked = val.publish;
                    if(val.spot){
                        document.getElementById('input-spot-' + val.spot).checked = true;
                        updateSpot(val.spot);
                        // changeStep(val.step || "step1");
                    }
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
                    document.getElementsByTagName('body').item(0).style.opacity = 1;
                })
            });
        }
        else{
            location.href = "/login/"
        }
    });
});

function selectSpot(spot){
    updateSpot(spot);
    changeStep("step2");
}

function infoSubmit(){
    // updateDatabase();
    window.removeEventListener('beforeunload', onBeforeunloadHandler);
    changeStep("step3", true);
}

function changeStep(currentstep, updatedb = false){
    let allsteps = document.getElementsByClassName("step");
    for(let i = 0; i < allsteps.length; i++){
        if(allsteps[i].classList.contains(currentstep)){
            allsteps[i].style.display = "block";
        }
        else{
            allsteps[i].style.display = "none";
        }
    }
    if(currentstep == "step3"){
        STEP_INFO.classList.add('step-done');
    }
    if(updatedb){
        firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                firebase.database().ref('/users/' + user.uid).update({
                    step: currentstep
                });
            }
        });
    }
}