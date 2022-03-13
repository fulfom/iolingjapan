Vue.createApp({
    mounted() {
        const _this = this;
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
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
                document.getElementById("app").classList.remove('opacity-0')
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
    methods: {
    }
}).mount('#app')