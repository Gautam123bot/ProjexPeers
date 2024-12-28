import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import signin_img from '../../assets/images/signin.png'
import { LoginUser } from '../../service/Api';
import "./SignIn.css"
import { signInWithGoogle } from '../../Firebase';
import { auth } from '../../Firebase';
import { Axios } from 'axios';


const SignIn = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const [credentials, setcredentials] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignin = async (e) => {
        e.preventDefault()

        if (credentials.password.length < 5) {
            alert("Passwords needs to be greater than 5 characters !! ");
        }
        else {
            const reg = await LoginUser(credentials)
            console.log(reg);
            if (reg.data.sucess === true) {
                alert("USER LOGGED IN !! ");
                localStorage.setItem("token", reg.data.token);
                localStorage.setItem("user_info", JSON.stringify(reg.data.user));
                setIsLoggedIn(true);
                navigate("/");
            }

            if (reg.data.sucess === false) {
                alert("Invalid Credentials!! ");
                navigate("/signin");
            }
        }

    }
   
    
    
    
    return (
        <div>
            <div className="signup_body">
                <div className="signup_left">
                    <div className="signup_left_inside">
                        <h1 className="sih">Sign in to <span>ProjexPeers</span></h1>
                        <p className="a-text">Find your perfect project partner, build projects together, discover hackathons and much more!</p>
                        <button className="gbtn" onClick={signInWithGoogle}><FcGoogle />Sign In with Google </button>


                        <form className="form_style" action="">
                            <label htmlFor="email" >Email*</label>
                            <input name="email" placeholder="Enter Your Email" type="email" value={credentials.email} onChange={handleChange} />
                            <label htmlFor="password">Password*</label>
                            <input name="password" placeholder="Enter Your Password" type="password" value={credentials.password} onChange={handleChange} />
                            <button className="signin_btn" onClick={handleSignin}>Sign In</button>
                        </form>
                        <div className="signup_more_style"><p>Don't have an account ? <span style={{ cursor: "pointer" }} onClick={() => { navigate("/signup") }}>Sign up</span></p></div>
                    </div>


                </div>
                <div className="signup_right">
                    <div className="signup_image">
                        <img src={signin_img} alt="" />
                    </div>
                    <div className="signup_img_btext">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;
