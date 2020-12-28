firebase.auth().onAuthStateChanged(function(user) {
    if(user){

        var result = firebase.database().ref('/result/' + user.uid);
        result.once('value', (snapshot) => {
            const data = snapshot.val();
            const ELEM_RESULT = document.getElementById('contest-result');

            if(data.award){
                if("無" == data.award){
                    ELEM_RESULT.innerText = "残念ながらあなたは賞を獲得することができませんでした．" //賞獲得ならず
                }
                else{
                    var text = "日本言語学オリンピック2021の競技結果に基づき，" + (data.isqualified ? "選抜" : "競技") + "参加枠 - " + data.award + "賞を授与いたします．";
                    if(data.isqualified && (data.award == "金" || data.award == "銀")){
                        text += "同時にアジア太平洋言語学オリンピック2021（二次選抜）にご招待します．APLOに向けたスケジュールは2月末までにメールでご連絡します．"
                    }

                    text += "賞状の発行・個別成績の通知・解答解説の公開はいずれも2月末までに行う予定です．" 

                    ELEM_RESULT.innerText = text;
                }
            }
        })
    }
});