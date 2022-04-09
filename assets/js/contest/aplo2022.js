const app = Vue.createApp({
    mounted() {
        const _this = this;
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const ref = firebase.database().ref("/contests/aplo2022/storage").orderByChild('uid').equalTo(user.uid)

                ref.on('value', (snapshot) => {
                    console.log('log');
                    _this.imageItems = snapshot.val() ? (Object.entries(Object.entries(snapshot.val()).sort((a, b) => {
                        if (a[1].for < b[1].for) {
                            return -1
                        }
                        if (a[1].for > b[1].for) {
                            return 1
                        }
                        return 0
                    })).map(e => { return { index: +e[0], key: e[1][0], ...e[1][1], title: _this.formAnswers.find(f => f.id === e[1][1].for).label } })) : []
                });

                const snapshot = await firebase.database().ref("/contests/aplo2022/users/" + user.uid).once("value");
                const val = snapshot.val();
                if (val) {
                    _this.edit = val;
                    _this.submitMessage = '更新'
                }
                else {
                    const badgesSnapshot = await firebase.database().ref("/badges/" + user.uid).once("value");
                    if (badgesSnapshot.val()) {
                        const badges = badgesSnapshot.val()
                        if (badges.aplo2022) {
                            const userSnapshot = await firebase.database().ref("/users/" + user.uid).once("value");
                            _this.edit = { ...userSnapshot.val(), pa: false, preUniv: false };
                        }
                        else location.href = "/account/"
                    }
                    else {
                        location.href = "/newuser/";
                    }
                }

                // document.getElementById("app").classList.remove('opacity-0')
                document.getElementById("loading").classList.add('d-none')
            }
            else {
                location.href = "/login/"
            }
        })
        this.submit = debounce(async () => {
            await updateDatabasePushContToUser(this.edit, "/contests/aplo2022/").catch((err) => { alert('エラー') });
            window.removeEventListener('beforeunload', onBeforeunloadHandler);
            alert(`${_this.submitMessage}しました`)
        }, 250)
    },
    data() {
        return {
            //解答提出
            visible: false,
            index: 0,
            imageItems: [],
            selected: '',
            imageSelected: '',
            formAnswers: [
                {
                    id: 'idcard',
                    label: '身分証',
                },
                {
                    id: 'prob1',
                    label: '問題1',
                },
                {
                    id: 'prob2',
                    label: '問題2',
                },
                {
                    id: 'prob3',
                    label: '問題3',
                },
                {
                    id: 'prob4',
                    label: '問題4',
                },
                {
                    id: 'prob5',
                    label: '問題5',
                },
                {
                    id: 'q',
                    label: 'アンケート',
                }
            ],
            //個人情報
            edit: {},
            submit: null,
            submitMessage: '応募',
            form: [
                {
                    id: 'email',
                    label: 'メールアドレス',
                    type: 'email',
                    disabled: true,
                    help: '変更不可',
                    required: false,
                },
                {
                    id: 'name',
                    label: '氏名（フルネーム）',
                    help: '郵送時の宛名・賞状への記名に用います．'
                },
                {
                    id: 'nameRoman',
                    label: '氏名（ローマ字）',
                    pattern: '^[0-9A-Za-z\\s]+$',
                    help: '半角英数（例: Namae Myouji / MYOUJI Namae）．こちらで大文字小文字・スペースなどを調整した後，APLO国際ランキングや賞状への記名などに用います．名字名前の順番やスペルが希望通りか確認してください．'
                },
                {
                    id: 'birthdate',
                    label: '生年月日',
                    type: 'date',
                    min: '2002-07-25',
                    feedback: '2002年7月25日以降の生まれである必要があります．',
                },
                {
                    id: 'preUniv',
                    label: '2022年4月10時点で私は大学教育を受けたことがありません',
                    type: 'checkbox',
                },
                {
                    id: 'schoolName',
                    label: '2022年4月10日時点での所属学校名',
                    help: '正式名称を略さずに記入．所属していなければ「なし」'
                },
                {
                    id: 'grade',
                    label: '2022年4月10日時点での学年',
                    type: 'number',
                    help: '数字．所属していなければ-1'
                },
                {
                    id: 'zipcode',
                    label: '郵便番号',
                    pattern: '^[0-9]+$',
                    help: 'ハイフン不要'
                },
                {
                    id: 'address',
                    label: '住所',
                    help: '問題・賞状の送付に使用します．'
                },
                {
                    id: 'publish',
                    label: 'ウェブページへの氏名の掲載を希望しない',
                    type: 'checkbox',
                    required: false,
                    help: '掲載を希望しない場合はチェックする',
                },
                {
                    id: 'pa',
                    label: 'APLO2022への参加にあたって私は保護者に有効な同意を得ています',
                    type: 'checkbox'
                }
            ]
        }
    },
    computed: {
    },
    methods: {
        showImg(index) {
            this.index = index
            this.visible = true
        },
        handleHide() {
            this.visible = false
        },
        async handleFileSelect(event) {
            const e = event || window.event;
            const elem = e.target || e.srcElement;
            const files = elem.files;
            for (let i = 0; i < files.length; i++) {
                // previewFile(files[i], elemId);
                let file = files[i];
                if (file.size > 1024 * 1024 * 20) {
                    alert('ファイルサイズが大きすぎます． 20MB以下にしてください．')
                    elem.value = '';
                    return;
                }
                // let file;
                // if(filetype(files[i].name, "heic")){
                //     label.innerText = "変換中"
                //     let blob = files[i];
                //     let result = await heic2any({blob});
                //     file = result;
                // }
                // else file = files[i];

                await this.uploadFile(file, elem);
                // console.log(files[i]);　// 1つ1つのファイルデータはfiles[i]で取得できる
            }
            // window.removeEventListener('beforeunload', onBeforeunloadHandler);
        },
        // Create a root reference
        async uploadFile(file, elem) {
            let user = firebase.auth().currentUser;
            if (user) {
                const label = elem.parentNode.getElementsByTagName("label")[0];
                const rootRef = firebase.storage().ref('contests/aplo2022/users/').child(user.uid);
                let uploadTask = rootRef.child(elem.id + Date.now() + file.name).put(file);

                uploadTask.on('state_changed', (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    elem.parentNode.getElementsByTagName("span")[0].innerText = `${progress}%完了`;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // Handle unsuccessful uploads
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                        console.log('File available at', downloadURL);
                        let sn = await firebase.database().ref("/contests/aplo2022/storage/").push({
                            uid: user.uid,
                            src: downloadURL,
                            for: elem.id,
                        });
                    });
                });
            }
        },
        async removeImg(key, url) {
            let user = firebase.auth().currentUser;
            if (user) {
                let yesno = confirm("この画像を削除しますか");
                if (yesno) {
                    await firebase.database().ref("/contests/aplo2022/storage/" + key).remove();
                    await firebase.storage().refFromURL(url).delete();
                }
            }
        },
        async editDB(key, data) {
            let user = firebase.auth().currentUser;
            if (user) {
                await firebase.database().ref("/contests/aplo2022/storage/" + key).update(data);
            }
        }
    }
})

app.use(VueEasyLightbox)
app.mount('#app')