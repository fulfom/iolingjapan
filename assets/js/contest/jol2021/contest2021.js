const ELEM_LINKS = document.getElementById('links').getElementsByTagName('a');
const ELEM_LINKSLI = document.getElementById('links').getElementsByTagName('li');
const ELEM_MEETING = document.getElementById('notice-meeting');
const ELEM_MEETINGLINK = document.getElementsByClassName('meetinglink')[0];
const ELEM_COMMENT_BOX = document.getElementById('comment-box');
const ELEM_COMMENT_BODY = document.getElementById('comment-body');
const ELEM_RUGTIME = document.getElementById('rugtime');

var contestlinks;
var handleTimer;

firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        var links = firebase.database().ref('/contest/' + user.uid);
        var currentMeetingGroup = firebase.database().ref('/currentmeetinggroup/');
        var rug = firebase.database().ref('/rug/');
        var comment = firebase.database().ref('/comment/' + user.uid);

        links.on('value', (snapshot) =>{
            const data = snapshot.val();
            contestlinks = data;
            updateLinks(contestlinks);
            if(data.undone) links.update({undone: false})
        });
        comment.on('value', (snapshot) =>{
            const data = snapshot.val();
            if(data){
                ELEM_COMMENT_BODY.innerText = data;
                ELEM_COMMENT_BOX.classList.remove('d-none');
            }
            else ELEM_COMMENT_BOX.classList.add('d-none');

        });
        currentMeetingGroup.on('value', (snapshot) =>{
            const data = snapshot.val();
            updateMeetingLink(data);
        });
        rug.on('value', (snapshot) =>{
            const data = snapshot.val();
            ELEM_RUGTIME.innerText = data == 0 ? "" : data + "秒遅れで競技開始（タイマーには加算済み）"
            startTimer(data);
        });
    }
    else{
        location.href = "/login/"
    }
});

function startTimer(rug){
    clearInterval(handleTimer)
    var end = new Date(Date.UTC(2020,11,28,6,0,0))
    // var now = new Date();
    // var diff = end.getTime() - now.getTime();
    // var data = Math.max(Math.floor(diff/1000) + rug, 0);
    //現在時刻から試験終了までの秒数を取得
    // console.log(end,now,diff,data)

    handleTimer = setInterval(() => {
        var now = new Date();
        var diff = end.getTime() - now.getTime();
        var data = Math.max(Math.floor(diff/1000) + rug, 0);
        // data--;
        updateTimer(data)
        if(data <= 0){
            clearInterval(handleTimer);
        }
    }, 1000);
}

function updateLinks(data){
    if(data.answerSheet){
        ELEM_LINKS[1].href = data.answerSheet;
        ELEM_LINKSLI[1].classList.add('list-group-item-success')
        if(data.undone) window.open(data.answerSheet, '_blank');
    }
    if(data.problem){
        ELEM_LINKS[0].href = data.problem;
        ELEM_LINKSLI[0].classList.add('list-group-item-success')
        if(data.undone) window.open(data.problem, '_blank');
    }

    if(data.pwd){
        document.getElementById('pwd').innerText = data.pwd;
    };

    if(0 < data.meetinggroup){            
        document.getElementById('meeting-name').innerText = data.meetingname;
        document.getElementById('meeting-start').innerText = data.meetingstart;
        document.getElementById('meeting-gather').innerText = data.meetinggather;
        var gather = new Date("2020 12 28 " + data.meetinggather);
        gather.setMinutes(gather.getMinutes() - 20);
        document.getElementById('meeting-open').innerText = gather.getHours() + ":" + gather.getMinutes();
        ELEM_MEETING.classList.remove('d-none');
    }
    else if(0 > data.meetinggroup){
        if(data.isqualified){
            document.getElementById('notice-notselected').classList.remove('d-none');
        }
        else document.getElementById('notice-contest-participation').classList.remove('d-none');
    }
}

function updateMeetingLink(currentMeetingGroup){
    if(currentMeetingGroup == contestlinks.meetinggroup){
        ELEM_MEETINGLINK.classList.remove('d-none');
    }
    else ELEM_MEETINGLINK.classList.add('d-none');

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