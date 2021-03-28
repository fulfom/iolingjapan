const CONFIRM = document.getElementById("confirm");

const FILE_PROB1 = document.getElementById("FILE_PROB1");
const PREVIEW1 = document.getElementById("preview-prob1");

document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            const sn = await firebase.database().ref("/contests/aplo2021/users/" + user.uid).once("value");
            const val = sn.val();
            if(val){
                updateConfirmation(val.package);
                document.getElementsByTagName("body")[0].style.opacity = 1;
            }
            else{
                location.href = "/account/";
            }

            const sn2 = await firebase.database().ref("/contests/aplo2021/storage/" + user.uid).once("value");
            const val2 = sn2.val();
            if(val2){
                Object.keys(val2).forEach((key) => {
                    let value = val2[key];
                    Object.keys(value).forEach((key2) => {
                        console.log(value[key2]);
                        addImg(value[key2], key, key2);
                    }, value);
                }, val2);
            }
        }
        else location.href = "/login/";
    });
});

function updateConfirmation(package){
    if(package){
        CONFIRM.innerText = "確認済";
        CONFIRM.disabled = true;
    }
    else{
        CONFIRM.innerText = "確認する";
        CONFIRM.disabled = false;
    }
}

async function confirmProb(){
    let user = firebase.auth().currentUser;
    if(user){
        await firebase.database().ref("/contests/aplo2021/users/" + user.uid).update({package: true})
        .catch(err => {
            alert("エラー");
        });
        updateConfirmation(true);
    }
    else location.href = "/login/";
}

// const UPLOAD1s = document.getElementsByClassName("upload1");
// const SUBMIT1 = document.getElementById("submit1");
// for(let j = 0; j < UPLOAD1s.length; j++){
//     UPLOAD1s[j].addEventListener("change", (e) => {
//         SUBMIT1.disabled = false;
//     });
// }

const handleFileSelect = async (event) => {
    const e = event || window.event;
    const elem = e.target || e.srcElement;
    const elemId = elem.id;
    const input = document.getElementById(elemId);
    const files = input.files;
    for (let i = 0; i < files.length; i++) {
        // previewFile(files[i], elemId);
        let file;
        
        const label = document.getElementById(elemId).parentNode.getElementsByTagName("label")[0];
        if(filetype(files[i].name, "heic")){
            label.innerText = "変換中"
            let blob = files[i];
            let result = await heic2any({blob});
            file = result;
        }
        else file = files[i];

        await uploadFile(file, elemId, label);
        // console.log(files[i]);　// 1つ1つのファイルデータはfiles[i]で取得できる
    }
    // window.removeEventListener('beforeunload', onBeforeunloadHandler);
}

// function previewFile(file, elemId){
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//         const imageUrl = e.target.result; // URLはevent.target.resultで呼び出せる
//         await addImg(imageUrl, elemId)
//       }
    
//       // いざファイルをURLとして読み込む
//       reader.readAsDataURL(file);
// }

async function addImg(imageUrl, elemId, key){
    const preview = document.getElementById("preview-" + elemId);
    const div = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img"); // img要素を作成
    const i = document.createElement("i");
    a.href = imageUrl;
    img.src = imageUrl; // URLをimg要素にセット
    i.classList.add("fas", "fa-trash-alt");
    i.setAttribute("data-url", imageUrl);
    i.setAttribute("data-id", elemId);
    i.setAttribute("data-key", key);
    i.addEventListener("click", removeImg);
    a.setAttribute("data-lightbox", elemId);
    preview.appendChild(div); // #previewの中に追加
    div.appendChild(a);
    a.appendChild(img);
    div.appendChild(i);
}

// Create a root reference
const storageRef = firebase.storage().ref().child("/contests/aplo2021/users/");

async function uploadFile(file, id, label){
    let user = firebase.auth().currentUser;
    if(user){
        const rootRef = storageRef.child(user.uid);
        let uploadTask = rootRef.child(id + "/" + file.name + Date.now()).put(file);

        uploadTask.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            label.innerText = `${progress}%完了`;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
              console.log('File available at', downloadURL);
              let sn = await firebase.database().ref("/contests/aplo2021/storage/" + user.uid + "/" + id).push(downloadURL);
              await addImg(downloadURL, id, sn.key);
            });
        });
    }
}

async function downloadPreviewFile(url, elemId, key){
    // let url = await storageRef.child(path).getDownloadURL();
    await addImg(url, elemId, key);
}

async function removeImg(){
    let user = firebase.auth().currentUser;
    if(user){
        let url = this.getAttribute("data-url");
        let id = this.getAttribute("data-id");
        let key = this.getAttribute("data-key");
        console.log(url, key)
        let yesno = confirm("この画像を削除しますか");
        if(yesno){
            await firebase.database().ref("/contests/aplo2021/storage/" + user.uid + "/" + id + "/" + key).remove();
            await firebase.storage().refFromURL(url).delete();
            let div = this.parentNode;
            div.parentNode.removeChild(div);
        }
    }
}

lightbox.option({
    "alwaysShowNavOnTouchDevices": true,
    "disableScrolling": true
})

function filetype(url, type){
    const reg = new RegExp(`\.${type}`,"i");
    return url.match(reg);
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

// 削除ボタン OK 
// cloud storage との通信 OK 
// 監督者ポータル（realtime database?）
