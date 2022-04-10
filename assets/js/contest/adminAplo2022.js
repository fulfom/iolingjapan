const app = Vue.createApp({
    mounted() {
        const _this = this;
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {

                const adminSn = await firebase.database().ref("admin/" + user.uid).once("value");
                if (!adminSn.val()) {
                    location.href = "/account/"
                }
                else {
                    firebase.database().ref("adminValue/aplo2022/").on("value", (snapshot) => {
                        const val = Object.entries(snapshot.val())
                        _this.studentlist = val.map(e => ({ key: e[0], ...e[1] }))
                    });
                }

                const ref = firebase.database().ref("/contests/aplo2022/storage")

                ref.on('value', (snapshot) => {
                    _this.imageItems = snapshot.val() ? Object.entries(snapshot.val()).map(e => { return { key: e[0], ...e[1], title: _this.formAnswers.find(f => f.id === e[1].for).label } }) : []
                });

                // document.getElementById("app").classList.remove('opacity-0')
                document.getElementById("loading").classList.add('d-none')
            }
            else {
                location.href = "/login/"
            }
        })
        this.submit = debounce(async () => {
        }, 250)
    },
    data() {
        return {
            //解答提出
            confirmationTarget: 'pre',
            studentlist: [],
            visible: false,
            index: 0,
            imageItems: [],
            CONFIRMATION_TARGETS: ['pre', 'post'],
            uidToFilterImages: '',
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
        }
    },
    computed: {
        confirmNum() {
            const max = this.studentlist.length
            const nums = this.CONFIRMATION_TARGETS.map(ct => this.studentlist.filter(e => e.confirm?.[ct]).length)
            return nums.map(e => `${e} / ${max}`)
        },
        imageItemsLimited() {
            //imageItems から uid でfilter し，for で sort
            console.log(this);
            return Object.entries(this.imageItems.filter(e => this.uidToFilterImages ? e.uid === this.uidToFilterImages : true).sort((a, b) => {
                if (a.for < b.for) {
                    return -1
                }
                if (a.for > b.for) {
                    return 1
                }
                return 0
            })).map(e => ({ index: e[0], ...e[1] }));
        }
    },
    methods: {
        showImg(index) {
            this.index = index
            this.visible = true
        },
        handleHide() {
            this.visible = false
        },
        confirmFormAnswers(e, uid) {
            firebase.database().ref("adminValue/aplo2022/" + uid + "/confirm/" + this.confirmationTarget).set(e.target.checked)
        },
        memo(e, uid) {
            console.log('checked');
            firebase.database().ref("adminValue/aplo2022/" + uid + "/memo").set(e.target.value)
        },
        copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert("copied!")
                    console.log("copied!")
                })
                .catch(e => {
                    console.error(e)
                })
        }
    }
})

app.use(VueEasyLightbox)
app.mount('#app')
