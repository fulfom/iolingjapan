const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.registerUsers = functions.auth.user().onCreate((user) => {
  const { uid } = user;
  const db = admin.database();
  const email = user.email || '';

  return db.ref('users/').set({
    name: '',
    email: email,
    create_on: new Date(),
  })
    .then(() => {
      console.log('Success'); // eslint-disable-line no-console
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
    });
});
