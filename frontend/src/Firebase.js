import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import  Axios  from 'axios';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDT23KvFxPmKmCF_t3OqFWFhaiVbTro2Mc",
    authDomain: "teambuilder-704d8.firebaseapp.com",
    projectId: "teambuilder-704d8",
    storageBucket: "teambuilder-704d8.firebasestorage.app",
    messagingSenderId: "983146937375",
    appId: "1:983146937375:web:1bdb1be653880676d8692a"
  };

const credCheck = async function(res){
    
    const result = await Axios.post('http://localhost:3001/login-with-google',{
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