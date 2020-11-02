document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            location.href = "/account/"
        }
        else{
            document.getElementsByTagName('body').item(0).style.opacity = 1;
        }
    });
});