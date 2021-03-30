const ELEM_LINKS = document.getElementById('links').getElementsByTagName('a');
const ELEM_LINKSLI = document.getElementById('links').getElementsByTagName('li');

var demolinks;

firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        var links = firebase.database().ref('/users/' + user.uid + '/demolinks');

        links.once('value', (snapshot) =>{
            const data = snapshot.val();
            demolinks = data;
            if(!data.done) links.update({done: true})
        });
    }
    else{
        location.href = "/login/"
    }
});

function startTimer(){
    document.getElementById('timerbtn').disabled = true;
    var data = 7206;
    var timer = setInterval(() => {
        data--;
        updateTimer(data)
        if(data == 7200){
            updateLinks(demolinks);
        }
        if(data <= 0){
            clearInterval(timer);
        }
    }, 1000);
}

function updateLinks(data){
        if(data.problem){
            ELEM_LINKS[0].href = data.problem;
            ELEM_LINKSLI[0].classList.add('list-group-item-success')
            window.open(data.problem, '_blank');
        }
        else ELEM_LINKS[0].removeAttribute('href')
        if(data.answerSheet){
            ELEM_LINKS[1].href = data.answerSheet;
            ELEM_LINKSLI[1].classList.add('list-group-item-success')
            window.open(data.answerSheet, '_blank');
        }
        if(data.pwd){
            document.getElementById('pwd').innerText = data.pwd;
        }
}

function updateTimer(data){
    if(data !== null){
        document.getElementById('timer').innerText = data > 7200 ? "競技開始まで" + toHms(data - 7200) : toHms(data);
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