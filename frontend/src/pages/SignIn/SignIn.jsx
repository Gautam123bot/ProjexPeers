import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import signin_img from "../../assets/images/signin.png";
import {
  LoginUser,
  sendForgetPasswordOtp,
  resetToNewPassword,
} from "../../service/Api";
import "./SignIn.css";
import { signInWithGoogle } from "../../Firebase";

const SignIn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [credentials, setcredentials] = useState({
    email: "",
    password: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otpDetails, setOtpDetails] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    // if (credentials.password.length < 5) {
    //   alert("Passwords needs to be greater than 5 characters !! ");
    // } else {
    try {
      const reg = await LoginUser(credentials);
      console.log("registered user details: ", reg);
      if (reg?.data?.success === true) {
        alert("USER LOGGED IN !! ");
        localStorage.setItem("token", reg.data.token);
        localStorage.setItem("username", reg.data.username);
        localStorage.setItem("user_info", JSON.stringify(reg.data.user));
        setIsLoggedIn(true);
        const username = reg.data.username.trim();
        console.log("reg username is in signin page is:", username);

        if (username) {
          navigate(`/${username}`);
        } else {
          alert("Username is not available!");
        }
      } else {
        alert("Invalid Credentials!! ");
      }
    } catch (error) {
      console.error("Error during login: ", error);
      alert("An error occured during login. Please try again");
    }
    // }
  };

  const handleForgotPassword = async () => {
    if (!emailForOtp) {
      alert("Please provide your email.");
      return;
    }
    try {
      const response = await sendForgetPasswordOtp(emailForOtp);
      if (response?.data?.success) {
        alert("OTP has been sent to your email.");
        setOtpSent(true);
        setOtpDetails({ ...otpDetails, email: emailForOtp });
      } else {
        alert(response?.data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP: ", error);
    }
  };

  const handleResetPassword = async () => {
    const { otp, newPassword, confirmPassword } = otpDetails;

    if (!otp || !newPassword || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await resetToNewPassword(otpDetails);
      console.log("response: ", response);
      if (response?.data?.success) {
        alert("Password has been reset successfully!");
        setShowForgotPassword(false);
        setOtpSent(false);
        setOtpDetails({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: "",
        });
        // navigate("/signin");
      } else {
        alert(response?.data?.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password: ", error);
    }
  };

  return (
    <div>
      <div className="signup_body">
        {showForgotPassword ? (
          <div className="signup_left">
            <div className="signup_left_inside">
              <h1 className="sih">Forgot Password</h1>
              {!otpSent ? (
                <>
                  <label htmlFor="email">Enter your email*</label>
                  <input
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={emailForOtp}
                    onChange={(e) => setEmailForOtp(e.target.value)}
                  />
                  <button className="signin_btn" onClick={handleForgotPassword}>
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <label htmlFor="otp">Enter OTP*</label>
                  <input
                    name="otp"
                    placeholder="Enter the OTP sent to your email"
                    type="text"
                    value={otpDetails.otp}
                    onChange={(e) =>
                      setOtpDetails({ ...otpDetails, otp: e.target.value })
                    }
                  />
                  <label htmlFor="newPassword">New Password*</label>
                  <input
                    name="newPassword"
                    placeholder="Enter your new password"
                    type="password"
                    value={otpDetails.newPassword}
                    onChange={(e) =>
                      setOtpDetails({
                        ...otpDetails,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    type="password"
                    value={otpDetails.confirmPassword}
                    onChange={(e) =>
                      setOtpDetails({
                        ...otpDetails,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button className="signin_btn" onClick={handleResetPassword}>
                    Reset Password
                  </button>
                </>
              )}
              <p
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </p>
            </div>
          </div>
        ) : (
          <div className="signup_left">
            <div className="signup_left_inside">
              <h1 className="sih">
                Sign in to <span>ProjexPeers</span>
              </h1>
              <p className="a-text">
                Find your perfect project partner, build projects together,
                discover hackathons and much more!
              </p>
              <button className="gbtn" onClick={signInWithGoogle}>
                <FcGoogle />
                Sign In with Google{" "}
              </button>
              <form className="form_style" action="">
                <label htmlFor="email">Email*</label>
                <input
                  name="email"
                  placeholder="Enter Your Email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                />
                <label htmlFor="password">Password*</label>
                <input
                  name="password"
                  placeholder="Enter Your Password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                />
                <button className="signin_btn" onClick={handleSignin}>
                  Sign In
                </button>
              </form>
              <div className="signup_more_style">
                <p>
                  Don't have an account?{" "}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </span>
                </p>
                <p
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="signup_right">
          <div className="signup_image">
            <img src={signin_img} alt="" />
          </div>
          <div className="signup_img_btext"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
