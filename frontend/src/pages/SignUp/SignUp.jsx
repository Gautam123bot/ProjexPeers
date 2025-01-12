import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import signup_img from "../../assets/images/signup.png";
import { RegisterUser } from "../../service/Api";
import { verifyOtp } from "../../service/Api";
import { sendOtp } from "../../service/Api";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const isConfirmed = window.confirm(
      "Are you sure you want to send OTP to this email?"
    );
    if (!isConfirmed) {
      return;
    }
    setIsOtpLoading(true);
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
    } finally {
      setIsOtpLoading(false);
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

    if (credentials.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (!isOtpVerified) {
      alert("Please verify your OTP before proceeding with registration.");
      return;
    }

    if (credentials.password !== credentials.cpassword) {
      alert("Passwords do not match!");
    } else {
      const { cpassword, otp, ...userData } = credentials;
      setIsSignupLoading(true);
      try {
        const reg = await RegisterUser(userData);
        if (reg.data.exists === true) {
          alert("USER ALREADY EXISTS !! ");
        }
        if (reg.data.success === true) {
          alert("USER CREATED !! ");
          navigate("/login");
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
      } finally {
        setIsSignupLoading(false);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 md:w-1/2 lg:w-1/3 w-full">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">
            Sign up to <span className="text-indigo-600">ProjexPeers</span>
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Find your perfect project partner, build projects together, and
            discover hackathons!
          </p>

          <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4">
            <FcGoogle className="mr-2 text-lg" />
            Sign Up with Google
          </button>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name*
              </label>
              <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username*
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className={`mt-2 px-4 py-2 rounded-md text-sm font-medium ${isOtpSent
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : isOtpLoading
                    ? "bg-indigo-600 text-white cursor-wait"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                disabled={isOtpSent || isOtpLoading}
              >
                {isOtpLoading ? (
                  <Loader /> // Show loader if loading
                ) : isOtpSent ? (
                  "OTP Sent"
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>

            {isOtpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OTP*
                </label>
                <input
                  type="text"
                  name="otp"
                  value={credentials.otp}
                  onChange={handleChange}
                  placeholder="Enter the OTP"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className={`mt-2 px-4 py-2 rounded-md text-sm font-medium ${isOtpVerified
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  disabled={isOtpVerified}
                >
                  {isOtpVerified ? "OTP Verified" : "Verify OTP"}
                </button>
              </div>
            )}

            <div>
              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-1 top-6 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password*
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="cpassword"
                  value={credentials.cpassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-6 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white ${isOtpVerified
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!isOtpVerified || isSignupLoading}
            >
              {isSignupLoading ? <Loader /> : "Register"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
