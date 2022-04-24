Vue.createApp({
    mounted() {
        const _this = this;
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const snapshot = await firebase.database().ref("/contests/aplo2022/results/" + user.uid).once("value");
                const val = snapshot.val();
                if (val) {
                    _this.sums = val.sums
                    _this.rank = val.rank
                }
                else {
                    location.href = "/account/"
                }
            }
            else {
                location.href = "/login/"
            }
        })
    },
    data() {
        return {
            sums: [],
            rank: 0,
        }
    },
    methods: {
    }
}).mount('#app')