const log = document.getElementById("log");
const portal = document.getElementById("portal");

let cachedLink;

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            const sn = await firebase.database().ref("/adminValue/" + user.uid).once("value");
            const adminValue = sn.val();
            if(adminValue && adminValue.conts){
                for(let i = 0; i < adminValue.conts.length; i++){
                    const v = adminValue.conts[i];
                    let div = document.createElement("div");
                    div.id = v.uid;
                    div.innerHTML = `<h5>${v.name} / ${v.num}</h5>`;
                    [{
                        key: "FILE_PRE1",
                        name: "身分証"
                    },
                    {
                        key: "FILE_PRE2",
                        name: "上シール"
                    },
                    {
                        key: "FILE_PRE3",
                        name: "下シール"
                    },
                    {
                        key: "FILE_PROB1",
                        name: "問題1"
                    },
                    {
                        key: "FILE_PROB2",
                        name: "問題2"
                    },
                    {
                        key: "FILE_PROB3",
                        name: "問題3"
                    },
                    {
                        key: "FILE_PROB4",
                        name: "問題4"
                    },
                    {
                        key: "FILE_PROB5",
                        name: "問題5"
                    },
                    {
                        key: "FILE_Q",
                        name: "アンケート"
                    },].forEach((titles)=>{
                        div.innerHTML += `<div>
                        <h6>${titles.name}</h6>
                        <div id="${v.uid + titles.key}" class="prob-preview">
                        </div>`;
                    })
                    portal.appendChild(div);
                    adminPortal(v, div);
                }
            }
            document.getElementsByTagName("body")[0].style.opacity = 1;
        }
        else location.href = "/login/";
    });
});

const adminPortal = (cont, div) => {
    const name = cont.name;
    const num = cont.num;
    const uid = cont.uid;
    firebase.database().ref("/contests/aplo2021/storage/" + uid).on("value", (sn) => {
        const val2 = sn.val();
        if(val2){
            Object.keys(val2).forEach((key) => {
                let value = val2[key];
                let section = document.getElementById(uid + key);
                Object.keys(value).forEach((key2) => {
                    console.log(value[key2]);
                    if(!cachedLink || !cachedLink[key] || !cachedLink[key][key2]){
                        addImg(value[key2], key, key2, section);
                    }
                }, value);
            }, val2);
            if(cachedLink){
                Object.keys(cachedLink).forEach((key) => {
                    let value = cachedLink[key];
                    Object.keys(value).forEach((key2) => {
                        console.log(value[key2]);
                        if(!val2 || !val2[key] || !val2[key][key2]){
                            const toberomoved = document.getElementById(key2);
                            toberomoved.parentNode.removeChild(toberomoved);
                        }
                    }, value);
                }, cachedLink);
            }

            cachedLink = val2;
        }
    });
}

async function addImg(imageUrl, elemId, key2, elem = null){
    const preview = elem || document.getElementById("preview-" + elemId);
    const div = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img"); // img要素を作成
    div.id = key2;
    a.href = imageUrl;
    img.src = imageUrl; // URLをimg要素にセット
    a.setAttribute("data-lightbox", elemId);
    preview.appendChild(div); // #previewの中に追加
    div.appendChild(a);
    a.appendChild(img);
}

lightbox.option({
    "alwaysShowNavOnTouchDevices": true,
    "disableScrolling": true
})