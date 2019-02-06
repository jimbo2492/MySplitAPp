import firebase from 'firebase';
import 'firebase/firestore';

//Config aus Firebase
const config = {
    apiKey: "AIzaSyAfnNMkA2C9keVtVbl1LJmcIsq56l7wAYY",
    authDomain: "mysplitapp-e3e18.firebaseapp.com",
    databaseURL: "https://mysplitapp-e3e18.firebaseio.com",
    projectId: "mysplitapp-e3e18",
    storageBucket: "mysplitapp-e3e18.appspot.com",
    messagingSenderId: "1066382754182"
};

//Initialisierung von Firebase
export default class Firebase {
    static db;

    static init() {
        firebase.initializeApp(config);
        Firebase.db = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        Firebase.db.settings(settings);
    }
}
