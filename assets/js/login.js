function login(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        // ...
        location.href = "/account/";

      } else {
        // User is signed out.
        // ...
        location.href = "/login/";
      }
    });
}