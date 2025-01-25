import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import signin_img from "../../assets/images/signin.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  LoginUser,
  sendForgetPasswordOtp,
  resetToNewPassword,
} from "../../service/Api";
// import "./SignIn.css";
import { signInWithGoogle } from "../../Firebase";
import Navbar from "../../components/Navbar/Navbar";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginSpinner, setShowLoginSpinner] = useState(false);

  const handleChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setShowLoginSpinner(true);

    // if (credentials.password.length < 5) {
    //   alert("Passwords needs to be greater than 5 characters !! ");
    // } else {
    try {
      const reg = await LoginUser(credentials);
      console.log("registered user details: ", reg);
      if (reg?.data?.success === true) {
        // alert("USER LOGGED IN !! ");
        localStorage.setItem("token", reg.data.token);
        localStorage.setItem("username", reg.data.username);
        localStorage.setItem("user_info", JSON.stringify(reg.data.user));
        setIsLoggedIn(true);
        const username = reg.data.username.trim();
        console.log("reg username is in signin page is:", username);

        if (username) {
          navigate(`/dashboard`);
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
    finally {
      setShowLoginSpinner(false);
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
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
          {/* Left Section */}
          <div className="p-8 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-indigo-600 mb-2">
              {showForgotPassword
                ? "Forgot Password"
                : "Sign In to ProjexPeers"}
            </h1>
            <p className="text-gray-500 mb-6">
              {showForgotPassword
                ? "Reset your password by providing the required details."
                : "Find your perfect project partner and explore hackathons!"}
            </p>

            {showForgotPassword ? (
              !otpSent ? (
                <>
                  <label className="block mb-2 text-gray-600">Email*</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-400"
                    value={emailForOtp}
                    onChange={(e) => setEmailForOtp(e.target.value)}
                  />
                  <button
                    className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                    onClick={handleForgotPassword}
                  >
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <label className="block mb-2 text-gray-600">OTP*</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-400"
                    value={otpDetails.otp}
                    onChange={(e) =>
                      setOtpDetails({ ...otpDetails, otp: e.target.value })
                    }
                  />
                  <div>
                    {/* New Password Field */}
                    <div className="relative">
                      <label className="block mb-2 text-gray-600">New Password*</label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-400"
                        value={otpDetails.newPassword}
                        onChange={(e) =>
                          setOtpDetails({
                            ...otpDetails,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-12 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <label className="block mb-2 text-gray-600">Confirm Password*</label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-400"
                        value={otpDetails.confirmPassword}
                        onChange={(e) =>
                          setOtpDetails({
                            ...otpDetails,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-12 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button
                    className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </>
              )
            ) : (
              <>
                <button
                  className="w-full flex items-center justify-center bg-white border border-gray-300 py-3 rounded-md mb-4 hover:bg-gray-100"
                  onClick={signInWithGoogle}
                >
                  <FcGoogle className="mr-2" />
                  Sign In with Google
                </button>
                {showLoginSpinner && (
                  <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="text-center text-white p-6 bg-gray-800 rounded-lg shadow-lg">
                      <div className="animate-spin rounded-full border-t-4 border-b-4 border-indigo-500 w-16 h-16 mx-auto"></div>
                      <p className="mt-4 text-lg">Logging in...</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSignin}>
                  <label className="block mb-2 text-gray-600">Email*</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-400"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                  <div className="relative">
                    <label className="block mb-2 text-gray-600">Password*</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-400"
                      value={credentials.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-12 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                  >
                    Sign In
                  </button>
                </form>
              </>
            )}

            <div className="text-center mt-6">
              {showForgotPassword ? (
                <p
                  className="text-indigo-500 cursor-pointer"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Sign In
                </p>
              ) : (
                <>
                  <p>
                    Don't have an account?{" "}
                    <span
                      className="text-indigo-500 cursor-pointer"
                      onClick={() => navigate("/signup")}
                    >
                      Sign up
                    </span>
                  </p>
                  <p
                    className="text-indigo-500 cursor-pointer mt-2"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center bg-indigo-600">
            <img src={signin_img} alt="Sign In" className="w-3/4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
