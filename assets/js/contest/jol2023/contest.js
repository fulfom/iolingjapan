const ELEM_LINKS = document.getElementById('links').getElementsByTagName('a');
const ELEM_LINKSLI = document.getElementById('links').getElementsByTagName('li');
const ELEM_LINKS2 = document.getElementById('links2').getElementsByTagName('a');
const ELEM_LINKSLI2 = document.getElementById('links2').getElementsByTagName('li');
const ELEM_MEETING = document.getElementById('notice-meeting');
const ELEM_MEETINGLINK = document.getElementsByClassName('meetinglink')[0];
// const ELEM_COMMENT_BOX = document.getElementById('comment-box');
// const ELEM_COMMENT_BODY = document.getElementById('comment-body');
const ELEM_RUGTIME = document.getElementById('rugtime');

const ELEM_email = document.getElementById("contestant-email");
const ELEM_name = document.getElementById("contestant-name");
const ELEM_meetingname = document.getElementById("meeting-name");
const ELEM_spot = document.getElementById("contestant-spot");

let handleTimer;
let userdata = {};

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) =>{
        if(user){
            const paid = await firebase.database().ref('/orders/jol2022/' + user.email.replaceAll('.','=').toLowerCase()).once("value");
            if(paid.val()){
                const ref = firebase.database().ref('/contests/jol2022/users/' + user.uid);
                const snapshot1 = await ref.once("value");
                const userInfo = snapshot1.val()
                if(userInfo){
                    ELEM_email.innerText = userInfo.email;
                    ELEM_name.innerText = userInfo.name;
                    ELEM_meetingname.innerText = userInfo.name;
                    ELEM_spot.innerText = userInfo.spot == "flag" ? "選抜": "オープン";
                    Object.assign(userdata, userInfo)
                }
                firebase.database().ref('/contests/jol2022/publish/contest/').on("value", async (snapshot) =>{
                    const data = snapshot.val();
                    if(data){
                        Object.assign(userdata, data);
                        updateLinks(data);
                        if(!userdata.problemSeen){
                            await ref.update({problemSeen: firebase.database.ServerValue.TIMESTAMP});
                            Object.assign(userdata, {problemSeen: true});
                        }
                        ELEM_RUGTIME.innerText = data.rug == 0 ? "" : toHms(data.rug) + "遅れで競技開始（タイマーには加算済み）"
                        startTimer(data.rug || 0);
                    }
                    else{
                        startTimer(0);
                    }
                });
                firebase.database().ref('/contests/jol2022/contest/' + user.uid).on("value", async (snapshot) =>{
                    const data = snapshot.val();
                    if(data){
                        Object.assign(userdata, data);
                        updateLinks(data);
                        if(!userdata.answerSeen){
                            await ref.update({answerSeen: firebase.database.ServerValue.TIMESTAMP});
                            Object.assign(userdata, {answerSeen: true});
                        }
                    }
                });
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

function startTimer(rug){
    clearInterval(handleTimer)
    var end = new Date(Date.UTC(2021,11,29,6,0,0))
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
        if(data <= 0){
            document.getElementById('notice-contest-participation').classList.remove('d-none');
            clearInterval(handleTimer);
        }
    }, 100);
}

function updateLinks(data){
    if(data.answerSheet){
        ELEM_LINKS[1].href = data.answerSheet;
        ELEM_LINKSLI[1].classList.add('list-group-item-success')
        if(!userdata.answerSeen) window.open(data.answerSheet, '_blank');
    }
    if(data.problem){
        ELEM_LINKS[0].href = data.problem;
        ELEM_LINKSLI[0].classList.add('list-group-item-success')
        if(!userdata.problemSeen) window.open(data.problem, '_blank');
    }
    if(data.answerSheet2){
        ELEM_LINKS2[1].href = data.answerSheet2;
        ELEM_LINKSLI2[1].classList.add('list-group-item-success')
    }
    if(data.problem2){
        ELEM_LINKS2[0].href = data.problem2;
        ELEM_LINKSLI2[0].classList.add('list-group-item-success')
    }
    if(data.pwd){
        document.getElementById('pwd').innerText = data.pwd;
    };
    if(0 < data.meetinggroup){
        document.getElementById('meeting-start').innerText = data.meetingstart;
        document.getElementById('meeting-gather').innerText = data.meetinggather;
        document.getElementById('meeting-open').innerText = data.meetingopen;
        ELEM_MEETING.classList.remove('d-none');
    }
    if(userdata.currentMeetingGroup){
        if(userdata.meetinggroup){
            document.getElementById('notice-notselected').classList.add('d-none');
            if(userdata.currentMeetingGroup == userdata.meetinggroup){
                ELEM_MEETINGLINK.classList.remove('d-none');
            }
            else ELEM_MEETINGLINK.classList.add('d-none');
        }
        else{
            document.getElementById('notice-notselected').classList.remove('d-none');
        }
    }
}

function updateTimer(data){
    if(data !== null){
        var timer = "";
        if(data > 7200){
            timer = "競技開始まで" + toHms(data - 7200)
        }
        else if(data < 0){
            timer = "競技終了"
        }
        else timer = toHms(data);
        document.getElementById('timer').innerText = timer;
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