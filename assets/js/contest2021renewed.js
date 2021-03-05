const ELEM_TIMER = document.getElementById('timer');

var handleTimer;
startTimer(0);

function startTimer(rug){
    clearInterval(handleTimer)
    var end = new Date(Date.UTC(2021,2,6,6,0,0))
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