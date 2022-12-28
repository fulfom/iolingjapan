import { app, auth, db } from "../../firebase-initialize"
import { ref, onValue, update, get, set, serverTimestamp } from "firebase/database"
import { toHms } from "../../utility/toHms"
import QRCode from "qrcode";

const ELEM_LINKS = document.getElementById('links')!.getElementsByTagName('a');
const ELEM_LINKSLI = document.getElementById('links')!.getElementsByTagName('li');
const ELEM_LINKS2 = document.getElementById('links2')!.getElementsByTagName('a');
const ELEM_LINKSLI2 = document.getElementById('links2')!.getElementsByTagName('li');

const ELEM_TIMER = document.getElementById('timer');

const ELEM_MEETING = document.getElementById('notice-meeting');
const ELEM_MEETINGLINK = document.getElementsByClassName('meetinglink')[0];
// const ELEM_COMMENT_BOX = document.getElementById('comment-box');
// const ELEM_COMMENT_BODY = document.getElementById('comment-body');
const ELEM_RUGTIME = document.getElementById('rugtime');
const ELEM_NOTSELECTED = document.getElementById('notice-notselected');

const ELEM_email = document.getElementById("contestant-email");
const ELEM_name = document.getElementById("contestant-name");
const ELEM_meetingname = document.getElementById("meeting-name");
const ELEM_spot = document.getElementById("contestant-spot");


let handleTimer;
let userdata = {
    problemSeen: false,
    answerSeen: false,
    currentMeetingGroup: "",
    meetinggroup: "",
    meetingLink: ""
};

document.addEventListener("DOMContentLoaded", (event) => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const paid = await get(ref(db, '/orders/jol2023/' + user.email!.replace(/\./g, '=').toLowerCase()));
            if (paid.val()) {
                const refContUser = ref(db, '/contests/jol2023/users/' + user.uid);
                const refContLog = ref(db, '/contests/jol2023/contestlog/' + user.uid);
                const snapshot1 = await get(refContUser);
                const userInfo = snapshot1.val()
                if (userInfo) {
                    const spot = userInfo.spot == "flag" ? "選抜" : "オープン";
                    ELEM_email!.innerText = userInfo.email;
                    ELEM_name!.innerText = userInfo.name;
                    ELEM_meetingname!.innerText = userInfo.name;
                    ELEM_spot!.innerText = spot;
                    Object.assign(userdata, userInfo);
                    document.getElementById("notice-contest-participation-message")!.innerText = spot === "選抜"
                        ? "面接対象かどうかを17:30頃に本ページ上で発表いたします．それまで，休憩です．"
                        : "これで競技は終了となります．2023年1月10日の結果発表をお待ちください．本ページは閉じても構いません．";
                }
                onValue(ref(db, '/contests/jol2023/publish/contest/'), async (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        Object.assign(userdata, data);
                        updateLinks(data);
                        if (!userdata.problemSeen) {
                            await update(refContUser, { problemSeen: serverTimestamp() });
                            Object.assign(userdata, { problemSeen: true });
                        }
                        ELEM_RUGTIME!.innerText = data.rug == 0 ? "" : toHms(data.rug) + "遅れで競技開始（タイマーには加算済み）"
                        startTimer(data.rug || 0);
                    }
                    else {
                        startTimer(0);
                    }
                });
                onValue(ref(db, '/contests/jol2023/contest/' + user.uid), async (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        Object.assign(userdata, data);
                        updateLinks(data);
                        if (!userdata.answerSeen) {
                            await update(refContUser, { answerSeen: serverTimestamp() });
                            Object.assign(userdata, { answerSeen: true });
                        }
                    }
                });
            }
            else {
                location.href = "/account/";
            }
        }
        else {
            location.href = "/login/";
        }
    });
});

function startTimer(rug) {
    clearInterval(handleTimer)
    var end = new Date(Date.UTC(2022, 11, 29, 6, 0, 0))
    // var now = new Date();
    // var diff = end.getTime() - now.getTime();
    // var data = Math.max(Math.floor(diff/1000) + rug, 0);
    //現在時刻から試験終了までの秒数を取得
    // console.log(end,now,diff,data)

    handleTimer = setInterval(() => {
        var now = new Date();
        var diff = end.getTime() - now.getTime();
        var data = Math.max(Math.floor(diff / 1000) + rug, 0);
        updateTimer(data)
        if (data <= 0) {
            document.getElementById('notice-contest-participation')!.classList.remove('d-none');
            clearInterval(handleTimer);
        }
    }, 100);
}

const updateLinks = (data) => {
    if (data.answerSheet) {
        ELEM_LINKS[1].href = data.answerSheet;
        ELEM_LINKSLI[1].classList.add('list-group-item-success')
        if (!userdata.answerSeen) window.open(data.answerSheet, '_blank');
    }
    if (data.problem) {
        ELEM_LINKS[0].href = data.problem;
        ELEM_LINKSLI[0].classList.add('list-group-item-success')
        if (!userdata.problemSeen) window.open(data.problem, '_blank');
    }
    if (data.answerSheet2) {
        ELEM_LINKS2[1].href = data.answerSheet2;
        ELEM_LINKSLI2[1].classList.add('list-group-item-success')
    }
    if (data.problem2) {
        ELEM_LINKS2[0].href = data.problem2;
        ELEM_LINKSLI2[0].classList.add('list-group-item-success')
    }
    if (data.pwd) {
        document.getElementById('pwd')!.innerText = data.pwd;
    };
    if (0 < data.meetinggroup) {
        document.getElementById('meeting-start')!.innerText = data.meetingstart;
        document.getElementById('meeting-gather')!.innerText = data.meetinggather;
        document.getElementById('meeting-open')!.innerText = data.meetingopen;
        ELEM_MEETING!.classList.remove('d-none');
    }
    if (userdata.currentMeetingGroup) {
        if (userdata.meetinggroup) {
            ELEM_NOTSELECTED!.classList.add('d-none');
            if (userdata.currentMeetingGroup == userdata.meetinggroup && userdata.meetingLink) {
                const meetingHref = document.getElementById("meetinglinkHref") as HTMLLinkElement
                meetingHref!.href = userdata.meetingLink;
                QRCode.toDataURL(userdata.meetingLink).then((url) => {
                    (document.getElementById("meetinglink-qrcode") as HTMLImageElement).src = url;
                    ELEM_MEETINGLINK.classList.remove('d-none');
                })
            }
            else ELEM_MEETINGLINK.classList.add('d-none');
        }
        else {
            ELEM_NOTSELECTED!.classList.remove('d-none');
        }
    }
}

function updateTimer(data) {
    if (data !== null) {
        var timer = "";
        if (data > 7200) {
            timer = "競技開始まで" + toHms(data - 7200)
        }
        else if (data < 0) {
            timer = "競技終了"
        }
        else timer = toHms(data);
        if (ELEM_TIMER!.innerText !== timer) {
            ELEM_TIMER!.innerText = timer;
        }
    }
}
