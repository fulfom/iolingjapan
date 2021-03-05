//require appsys.js

function updateSpot(spot){
    //spot選択を app-cont-info に反映
    if(spot == "flag"){
        FORM_BIRTHDATE.getElementsByClassName("invalid-feedback")[0].innerText = "2001年7月20日以降の生まれである必要があります．"
        INPUT_BIRTHDATE.setAttribute("min", "2001-07-20");
        for(let i = 0; i < FORM_GROUPs.length; i++){
            if(FORM_GROUPs[i].classList.contains("spot-award-delete")){
                FORM_GROUPs[i].style.display = "block";
                if(!FORM_GROUPs[i].classList.contains("nr")) FORM_GROUPs[i].getElementsByTagName("input")[0].required = true;
            }
        }
    }
    else if(spot == "award"){
        FORM_BIRTHDATE.getElementsByClassName("invalid-feedback")[0].innerText = ""
        INPUT_BIRTHDATE.removeAttribute("min");
        for(let i = 0; i < FORM_GROUPs.length; i++){
            if(FORM_GROUPs[i].classList.contains("spot-award-delete")){
                FORM_GROUPs[i].style.display = "none";
                if(!FORM_GROUPs[i].classList.contains("nr")) FORM_GROUPs[i].getElementsByTagName("input")[0].required = false;
            }
        }
    }
}