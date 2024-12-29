import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import signup_img from '../../assets/images/signup.png'
import { RegisterUser } from '../../service/Api';

import "./SignUp.css"

const SignUp = () => {
    const navigate = useNavigate();

    const [credentials, setcredentials] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        cpassword: "",
    });

    const handleChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignup = async (e) => {
        e.preventDefault()

        if (credentials.password !== credentials.cpassword) {
            alert("Passwords do not match!")

        }else {
            const reg = await RegisterUser(credentials)
            console.log("this is reg: ", reg);
            if (reg.data.exists === true) {
                alert("USER ALREADY EXISTS !! ")
                navigate("/signin")
            }
            if (reg.data.success === true) {
                alert("USER CREATED !! ")
                navigate("/")
            }

            if (reg.data.success === false && reg.data.exists !== true) {
                alert("ERROR")
                setcredentials({
                    fullname: "",
                    username: "",
                    email: "",
                    password: "",
                    cpassword: "",
                })
            }
        }
    }


    return (
        <div>
            <div className="signup_body">
                <div className="signup_left">

                    <h2 className="hdtxt">Sign up to <span>ProjexPeers</span></h2>
                    <p className="a-text">Find your perfect project partner, build projects together, discover hackathons and much more!</p>
                    <button className="gbtn"><FcGoogle />Sign Up with Google </button>


                    <form className="form_stylee" action="">

                        <label htmlFor="fullname">Name*</label>
                        <input type="text" name="fullname" placeholder="Enter Your Name" value={credentials.fullname} onChange={handleChange} />
                        <label htmlFor="username">User Name*</label>
                        <input type="text" name="username" placeholder="Enter Your Username" value={credentials.username} onChange={handleChange} />
                        <label htmlFor="email" >Email*</label>
                        <input name="email" placeholder="Enter Your Email" type="email" value={credentials.email} onChange={handleChange} />
                        <label htmlFor="password">Password*</label>
                        <input name="password" placeholder="Enter Your Password" type="password" value={credentials.password} onChange={handleChange} />
                        <label htmlFor="cpassword">Confirm Password*</label>
                        <input name="cpassword" placeholder="Confirm Your Password" type="password" value={credentials.cpassword} onChange={handleChange} />



                        <button className="signup_btn" onClick={handleSignup}  >Sign Up</button>
                    </form>
                    <div className="signup_more_style"><p>Already have an account ? <span style={{cursor:"pointer"}} onClick={()=>{navigate("/")}}>Sign in</span></p></div>

                </div>
                <div className="signup_right">
                    <div className="signup_image">
                        <img src={signup_img} alt="" />
                    </div>
                    <div className="signup_img_btext">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
