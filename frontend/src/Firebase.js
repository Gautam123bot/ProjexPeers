import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import  Axios  from 'axios';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

const credCheck = async function(res){
    
    const result = await Axios.post('http://localhost:3001/auth/login-with-google',{
            email : res.user.email
    }).catch((e) => {
        alert("Please Register.");
    });
    if(result){
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user_info", JSON.stringify(result.data.user));
        window.open("/","_self");
        console.log(result);
    }else{
       window.open("/signup", "_self");
    }
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage();


const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
    signInWithPopup(auth,provider).then((res) => {
        credCheck(res);
        console.log(res.user.email);
    }).catch((e) => {
        console.log(e);
    })
}