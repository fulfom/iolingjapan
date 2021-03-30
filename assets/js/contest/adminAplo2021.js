const namelist = document.getElementById("namelist");
const portal = document.getElementById("portal");

var db = new Dexie("imgDB");
db.version(1).stores({
    img: '&key,url,blob'
});

          //
          // Put some data into it
          //
        //   db.img.put({name: "Nicolas", shoeSize: 8}).then (function(){
        //       //
        //       // Then when data is stored, read from it
        //       //
        //       return db.id.get('Nicolas');
        //   }).then(function (friend) {
        //       //
        //       // Display the result
        //       //
        //       alert ("Nicolas has shoe size " + friend.shoeSize);
        //   }).catch(function(error) {
        //      //
        //      // Finally don't forget to catch any error
        //      // that could have happened anywhere in the
        //      // code blocks above.
        //      //
        //      alert ("Ooops: " + error);
        //   });

let cachedLink = [];
let handlers = [];

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            const sn = await firebase.database().ref("/adminValue/" + user.uid).once("value");
            const adminValue = sn.val();
            if(adminValue && adminValue.conts){
                Object.entries(adminValue.conts).forEach((e) => {
                    const uid = e[0];
                    const v = e[1];
                    if(v){
                        let li = document.createElement("li");
                        li.classList.add("list-group-item");
                        li.innerHTML = `<a href="#${uid}">${v.name}</a>`;
                        namelist.appendChild(li);
                        let div = document.createElement("div");
                        div.id = uid;
                        div.innerHTML = `<h5>${v.name} / ${v.num}</h5>`;
                        [{
                            key: "blank",
                            name: "白紙"
                        },
                        {
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
                            <p class="d-inline-block">${titles.name}</p><button id="btn-${uid + titles.key}" class="ml-3 btn btn-primary btn-small" onclick="inputCheck(this)" data-uid="${uid}" data-key="${titles.key}">確認する</button>
                            <div id="${uid + titles.key}" class="prob-preview">
                            </div>`;
                        })
                        portal.appendChild(div);
                        handlers[uid] = adminPortal(v, uid, div);
                        if(v.checks){
                            Object.keys(v.checks).forEach((key) => {
                                document.getElementById("btn-" + uid + key).disabled = true;
                            })
                        }
                    }
                });
                
            }
            document.getElementsByTagName("body")[0].style.opacity = 1;
        }
        else location.href = "/login/";
    });
});

function adminPortal(cont, uid, div) {
    const name = cont.name;
    const num = cont.num;
    return firebase.database().ref("/contests/aplo2021/storage/" + uid).on("value", (sn) => {
        const val2 = sn.val();
        if (val2) {
            Object.keys(val2).forEach((key) => { //key == FILE_PRE1 など
                let value = val2[key];
                let section = document.getElementById(uid + key);
                Object.keys(value).forEach((key2) => { //key2 == ファイルごとの key
                    console.log(value[key2]);
                    if (!cachedLink || !cachedLink[key] || !cachedLink[key][key2]) {
                        addImg(value[key2], uid, key, key2, section);
                    }
                }, value);
            }, val2);
            if (cachedLink[uid]) {
                Object.keys(cachedLink[uid]).forEach((key) => {
                    let value = cachedLink[uid][key];
                    Object.keys(value).forEach((key2) => {
                        console.log(value[key2]);
                        if (!val2 || !val2[key] || !val2[key][key2]) {
                            const toberomoved = document.getElementById(key2);
                            toberomoved.parentNode.removeChild(toberomoved);
                        }
                    }, value);
                }, cachedLink[uid]);
            }

            cachedLink[uid] = val2;
        }
    });
}

async function addImg(imageUrl, uid, elemId, key2, elem){
    const preview = elem;
    const div = document.createElement("div");
    div.id = key2;
    preview.appendChild(div); // #previewの中に追加
    const cachedImg = await db.img.get(key2);
    if(cachedImg){
        showBlob(cachedImg.blob, div, uid, elemId);
    }
    else{
        if(filetype(imageUrl, "heic")){
            div.innerHTML = `<button class="btn btn-info btn-small" onclick="showHeic()" data-url="${imageUrl}" data-key="${key2}" data-uid="${uid}">要変換</button>`;
        }
        else{
            await fetch(imageUrl)
            .then((res) => res.blob())
            .then((blob) => {
                db.img.put({key: key2, blob: blob, url: imageUrl});
                showBlob(blob, div, uid, elemId);
            })
        }
    }
}

function showBlob(blob, div, uid, elemId){
    const a = document.createElement("a");
    const img = document.createElement("img"); // img要素を作成
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function(evt) {
        let srcurl = reader.result;
        a.href = srcurl;
        img.src = srcurl;
        a.setAttribute("data-lightbox", uid + elemId);
        div.appendChild(a);
        a.appendChild(img);
    }
}

lightbox.option({
    "alwaysShowNavOnTouchDevices": true,
    "disableScrolling": true
})

async function inputCheck(e){
    let user = firebase.auth().currentUser;
    console.log(e)
    if(user){
        const uid = e.getAttribute("data-uid");
        const key = e.getAttribute("data-key");
        e.disabled = true;
        await firebase.database().ref("/adminValue/" + user.uid + "/conts/" + uid + "/checks/").update({[key]: true});
    }
}

function getExt(filename){
	let pos = filename.lastIndexOf('.');
	if (pos === -1) return '';
	return filename.slice(pos + 1);
}

function filetype(url, type){
    const reg = new RegExp(`\.${type}`,"i");
    return url.match(reg);
}

// async function get(db, id) { // NOTE: if not found, resolves with undefined.
//     return new Promise((resolve, reject) => {
//       const docs = db.transaction([DOCNAME, ]).objectStore(DOCNAME);
//       const req = docs.get(id);
//       req.onsuccess = () => resolve(req.result);
//       req.onerror = reject;
//     });
//   }

function showHeic(e){
    var e = e || window.event;
    var elem = e.target || e.srcElement;
    var elemId = elem.id;
    const imageUrl = elem.getAttribute("data-url");
    const key = elem.getAttribute("data-key");
    const uid = elem.getAttribute("data-uid");
    const div = elem.parentNode;
    const a = document.createElement("a");
    const img = document.createElement("img"); // img要素を作成
    fetch(imageUrl)
    .then((res) => res.blob())
    .then((blob) => heic2any({ blob }))
    .then((conversionResult) => {
        // conversionResult is a BLOB
        // of the PNG formatted image
        db.img.put({key: key, blob: conversionResult, url: imageUrl});
        let reader = new FileReader();
        reader.readAsDataURL(conversionResult);
        reader.onload = function(evt) {
            elem.parentNode.removeChild(elem);
            let srcurl = reader.result;
            a.href = srcurl;
            img.src = srcurl;
            a.setAttribute("data-lightbox", uid + elemId);
            div.appendChild(a);
            a.appendChild(img);
            console.log("converted" + srcurl);
        }
    })
    .catch((e) => {
        // see error handling section
        alert("変換エラー（間を置く）");
    });
}
