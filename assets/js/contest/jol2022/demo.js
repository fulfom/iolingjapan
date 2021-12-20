const ELEM_LINKS = document.getElementById('links').getElementsByTagName('a');
const ELEM_LINKSLI = document.getElementById('links').getElementsByTagName('li');

const ELEM_TIMER = document.getElementById('timer');

const ELEM_email = document.getElementById("contestant-email");
const ELEM_name = document.getElementById("contestant-name");
const ELEM_spot = document.getElementById("contestant-spot");

let handleTimer;
// startTimer(0);
let demolinks = {};

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) =>{
        if(user){
            const paid = await firebase.database().ref('/orders/jol2022/' + user.email.replaceAll('.','=').toLowerCase()).once("value");
            if(paid.val()){
                const snapshot1 = await firebase.database().ref('/contests/jol2022/users/' + user.uid).once("value");
                const userInfo = snapshot1.val()
                if(userInfo){
                    ELEM_email.innerText = userInfo.email;
                    ELEM_name.innerText = userInfo.name;
                    ELEM_spot.innerText = userInfo.spot == "flag" ? "選抜": "オープン";
                }
                const snapshot2 = await firebase.database().ref('/contests/jol2022/publish/demo/').once("value");
                const publish = snapshot2.val();
                if(publish){
                    demolinks = Object.assign({}, demolinks, publish);
                    // updateLinks(publish);
                }
                const snapshot3 = await firebase.database().ref('/contests/jol2022/demo/' + user.uid).once("value");
                const answerSheet = snapshot3.val();
                if(answerSheet){
                    demolinks = Object.assign({}, demolinks, answerSheet);
                }
            }
            else{
                location.href = "/account/";
            }
        }
        else{
            location.href = "/login/";
        }
    });
});

// function startTimer(){
//     document.getElementById('timerbtn').disabled = true;
//     var data = 7206;
//     var timer = setInterval(() => {
//         data--;
//         updateTimer(data)
//         if(data == 7200){
//             updateLinks(demolinks);
//         }
//         if(data <= 0){
//             clearInterval(timer);
//         }
//     }, 1000);
// }

function startTimer(rug){
    clearInterval(handleTimer)
    var end = new Date();
    end.setTime(end.getTime() + 7206000);
    // var now = new Date();
    // var diff = end.getTime() - now.getTime();
    // var data = Math.max(Math.floor(diff/1000) + rug, 0);
    //現在時刻から試験終了までの秒数を取得
    // console.log(end,now,diff,data)

    handleTimer = setInterval(() => {
        var now = new Date();
        var diff = end.getTime() - now.getTime();
        var data = Math.max(Math.floor(diff/1000) + rug, 0);
        updateTimer(data)
        if(data == 7200){
            updateLinks(demolinks);
        }
        if(data <= 0){
            clearInterval(handleTimer);
        }
    }, 100);
}

function updateLinks(data){
        if(data.problem){
            ELEM_LINKS[0].href = data.problem;
            ELEM_LINKSLI[0].classList.add('list-group-item-success')
            window.open(data.problem, '_blank');
        }
        // else ELEM_LINKS[0].removeAttribute('href')
        if(data.answerSheet){
            ELEM_LINKS[1].href = data.answerSheet;
            ELEM_LINKSLI[1].classList.add('list-group-item-success')
            window.open(data.answerSheet, '_blank');
        }
        if(data.pwd){
            document.getElementById('pwd').innerText = data.pwd;
        }
}

// function updateTimer(data){
//     if(data !== null){
//         document.getElementById('timer').innerText = data > 7200 ? "競技開始まで" + toHms(data - 7200) : toHms(data);
//     }
// }

function updateTimer(data){
    if(data !== null){
        var timer = "";
        if(data > 7200){
            timer = "競技開始まで" + toHms(data - 7200)
        }
        else if(data <= 0){
            timer = "競技終了"
        }
        else timer = toHms(data);
        ELEM_TIMER.innerText = timer;
    }
}

function toHms(t) {
	var hms = "";
	var h = t / 3600 | 0;
	var m = t % 3600 / 60 | 0;
	var s = t % 60;

	if (h != 0) {
		hms = h + "時間" + padZero(m) + "分" + padZero(s) + "秒";
	} else if (m != 0) {
		hms = m + "分" + padZero(s) + "秒";
	} else {
		hms = s + "秒";
	}

	return hms;

	function padZero(v) {
		if (v < 10) {
			return "0" + v;
		} else {
			return v;
		}
	}
}