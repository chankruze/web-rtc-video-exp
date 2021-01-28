// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDwwvutOoG7-sGFKDPXPEy0Ts-JOk_MaKM",
  authDomain: "react-auth-dev-203cc.firebaseapp.com",
  databaseURL: "https://react-auth-dev-203cc.firebaseio.com",
  projectId: "react-auth-dev-203cc",
  storageBucket: "react-auth-dev-203cc.appspot.com",
  messagingSenderId: "897405763031",
  appId: "1:897405763031:web:1c29636d5158d7c5a41f92",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

// login an user with firebase
const signinSession = (email, pass) => {
  return auth
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return auth.signInWithEmailAndPassword(email, pass);
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
};

const signin = (email, pass) => {
  return auth.signInWithEmailAndPassword(email, pass);
};

// logout an user with firebase
const logout = (email, pass) => {
  return auth.signOut();
};

// reset password of an user with firebase
const resetPassword = (email) => {
  return auth.sendPasswordResetEmail(email);
};

// update email of an user with firebase
const updateEmail = (email) => {
  return currentUser.updateEmail(email);
};

// update password of an user with firebase
const updatePassword = (password) => {
  return currentUser.updatePassword(password);
};

const form = document.getElementById("gauth");
const email = document.getElementById("email");
const pass = document.getElementById("pass");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();

  // firebase auth
  signin(email.value, pass.value).then(({ user, operationType }) => {
    const { email } = user;
    if (
      operationType === "signIn" &&
      (email === "husband@geekofia.in" || email === "wife@geekofia.in")
    ) {
      console.log(`${email} is authorized to enter ${ROOM_ID}`);

      // redirect to video chat page
      $.ajax({
        async: true,
        dataType: "json",
        crossDomain: true,
        url: `/check/${ROOM_ID}`,
        type: "POST",
        success: ({ status }) => {
          if (status === "ok") window.location.href = `/p2p/video/${ROOM_ID}`;
        },
      });
    }
  });
});
