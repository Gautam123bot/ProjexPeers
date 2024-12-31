import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import signup_img from "../../assets/images/signup.png";
import { RegisterUser } from "../../service/Api";
import { verifyOtp } from "../../service/Api";
import { sendOtp } from "../../service/Api";

import "./SignUp.css";

const SignUp = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const [credentials, setcredentials] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
    otp: "",
  });

  // const handleChange = (e) => {
  //   setcredentials({ ...credentials, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "username") {
      // Only allow alphanumeric characters
      const isValid = /^[a-zA-Z0-9]*$/.test(value);
      if (!isValid) {
        alert("Username can only contain letters and numbers.");
        return;
      }
    }
  
    setcredentials({ ...credentials, [name]: value });
  };
  

  const handleSendOtp = async () => {
    if (!credentials.email) {
      alert("Please enter an email to receive OTP.");
      return;
    }
    const isConfirmed = window.confirm("Are you sure you want to send OTP to this email?");
  if (!isConfirmed) {
    return;
  }
    try {
      const response = await sendOtp({ email: credentials.email });
      if (response.data.success) {
        alert("OTP sent successfully to your email.");
        setIsOtpSent(true);
      } else {
        alert(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      alert("An error occurred while sending OTP.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!credentials.otp) {
      alert("Please enter the OTP.");
      return;
    }
    try {
      const response = await verifyOtp({
        email: credentials.email,
        otp: credentials.otp,
      });
      if (response.data.success) {
        setIsOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        alert(response.data.message || "Invalid OTP.");
      }
    } catch (error) {
      alert("An error occurred while verifying OTP.");
      console.error(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      alert("Please verify your OTP before proceeding with registration.");
      return;
    }

    if (credentials.password !== credentials.cpassword) {
      alert("Passwords do not match!");
    } else {
      const { cpassword, otp, ...userData } = credentials;
      try {
        const reg = await RegisterUser(userData);
        console.log("this is reg: ", reg);
        if (reg.data.exists === true) {
          alert("USER ALREADY EXISTS !! ");
          // navigate("/signin");
        }
        if (reg.data.success === true) {
          alert("USER CREATED !! ");
          navigate("/");
        }

        if (reg.data.success === false && reg.data.exists !== true) {
          alert("ERROR");
          setcredentials({
            fullname: "",
            username: "",
            email: "",
            password: "",
          });
        }
      } catch (error) {
        console.log("Error in signup", error);
        alert("An error occured while registering");
      }
    }
  };

  return (
    <div>
      <div className="signup_body">
        <div className="signup_left">
          <h2 className="hdtxt">
            Sign up to <span>ProjexPeers</span>
          </h2>
          <p className="a-text">
            Find your perfect project partner, build projects together, discover
            hackathons and much more!
          </p>
          <button className="gbtn">
            <FcGoogle />
            Sign Up with Google{" "}
          </button>

          <form className="form_stylee" action="">
            <label htmlFor="fullname">Name*</label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter Your Name"
              value={credentials.fullname}
              onChange={handleChange}
            />
            <label htmlFor="username">User Name*</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Your Username"
              value={credentials.username}
              onChange={handleChange}
            />
            <label htmlFor="email">Email*</label>
            <input
              name="email"
              placeholder="Enter Your Email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
            />
            <button
              type="button"
              className="otp_btn"
              onClick={handleSendOtp}
              disabled={isOtpSent}
            >
              {isOtpSent ? "OTP Sent" : "Send OTP"}
            </button>
            {isOtpSent && (
              <>
                <label htmlFor="otp">Enter OTP*</label>
                <input
                  name="otp"
                  placeholder="Enter OTP"
                  type="text"
                  value={credentials.otp}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="otp_verify_btn"
                  onClick={handleVerifyOtp}
                  disabled={isOtpVerified}
                >
                  {isOtpVerified ? "OTP Verified" : "Verify OTP"}
                </button>
              </>
            )}
            <label htmlFor="password">Password*</label>
            <input
              name="password"
              placeholder="Enter Your Password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
            />
            <label htmlFor="cpassword">Confirm Password*</label>
            <input
              name="cpassword"
              placeholder="Confirm Your Password"
              type="password"
              value={credentials.cpassword}
              onChange={handleChange}
            />

            <button
              className="signup_btn"
              onClick={handleSignup}
              disabled={!isOtpVerified}
              style={{
                backgroundColor: isOtpVerified ? "#4CAF50" : "#ccc",
                cursor: isOtpVerified ? "pointer" : "not-allowed",
              }}
            >
              Sign Up
            </button>
          </form>
          <div className="signup_more_style">
            <p>
              Already have an account ?{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/");
                }}
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
        <div className="signup_right">
          <div className="signup_image">
            <img src={signup_img} alt="" />
          </div>
          <div className="signup_img_btext"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
