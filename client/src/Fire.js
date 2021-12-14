import firebase from "firebase";
var config = {
  apiKey: "AIzaSyBveAZrPYk3ZKRfgktqGppj4sblxJvWAWE",
  authDomain: "ecertify-d4259.firebaseapp.com",
  databaseURL: "https://ecertify-d4259-default-rtdb.firebaseio.com",
  projectId: "ecertify-d4259",
  storageBucket: "ecertify-d4259.appspot.com",
  messagingSenderId: "937974719095"
};
var fire = firebase.initializeApp(config);
export default fire;
