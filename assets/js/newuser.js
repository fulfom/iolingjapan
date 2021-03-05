document.addEventListener("DOMContentLoaded", (event) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
            for(let i = 0; i < USER_EMAILs.length; i++){
                USER_EMAILs[i].innerText = user.email;
            }

            const promiseUser = (async () => {
                const snapshot = await firebase.database().ref("/users/" + user.uid).once("value");
                let val = snapshot.val();
                let isnewuser = true;
                if(val){
                    if(val.existing){
                        isnewuser = false;
                    }
                }
                else{
                    await firebase.database().ref("/users/" + user.uid).set({
                        email: user.email
                    });
                }
                if(!isnewuser) location.href = "/account/";
                else document.getElementsByTagName("body").item(0).style.opacity = 1;
            })();

        }
        else{
            location.href = "/login/"
        }
    });
});