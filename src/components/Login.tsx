"use client";

import { useState, useEffect } from "react";
import Captcha from "./Captcha";
import EmailVerification from "./login/EmailVerification";
import OtpVerification from "./login/OtpVerification";
import PasswordCreation from "./login/PasswordCreation";
import VerifiedUserLogin from "./login/VerifiedUserLogin";
import Image from "next/image";

import {
  UserData,
  fetchUserData,
  verifyEmail,
  verifyOtp,
  createPassword,
} from "@/services/auth";

const Login = () => {
  const [rollNo, setRollNo] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loginStage, setLoginStage] = useState<
    "initial" | "email" | "otp" | "createPassword" | "password"
  >("initial");
  const [isClient, setIsClient] = useState(false);

  // hydration error fix (dont know how but fixed)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset the entire form to initial state
  const resetForm = () => {
    setRollNo("");
    setCaptchaVerified(false);
    setUserData(null);
    setLoginStage("initial");
    setMessage("");
  };

  const handleCaptchaVerify = async (verified: boolean) => {
    setCaptchaVerified(verified);

    if (verified && rollNo.trim()) {
      setIsLoading(true);
      setMessage("Fetching user information...");

      try {
        // Make the API call to get user data once captcha is verified
        const userData = await fetchUserData(rollNo);
        setUserData(userData);

        if (userData.isVerified) {
          setLoginStage("password");
          setMessage("Please enter your password to continue.");
        } else {
          setLoginStage("email");
          setMessage(
            "Account requires verification. Please enter the email associated with your account."
          );
        }
      } catch {
        setMessage("Error fetching user data. Please try again.");
        setCaptchaVerified(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmailVerify = async (email: string) => {
    setIsLoading(true);
    setMessage("Verifying email...");

    try {
      const response = await verifyEmail(email, rollNo);

      if (response.status === 200) {
        // Email verified, show OTP field
        setLoginStage("otp");
        setMessage(response.message);
      } else {
        // Error occurred, reset the form
        resetForm();
        setMessage(response.message);
      }
    } catch {
      resetForm();
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setIsLoading(true);
    setMessage("Verifying OTP...");

    try {
      const response = await verifyOtp(otp, rollNo);
      if (response.success) {
        setLoginStage("createPassword");
        setMessage(response.message);
      } else {
        setMessage(response.message);
      }
    } catch {
      setMessage("An unexpected error occurred while verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCreate = async (newPassword: string) => {
    setIsLoading(true);
    setMessage("Creating password...");

    try {
      const response = await createPassword(rollNo, newPassword);
      if (response.status === 200) {
        setMessage(response.message);

        // Fetch updated user data to check if verified is now true
        const updatedUserData = await fetchUserData(rollNo);
        setUserData(updatedUserData);

        if (updatedUserData.isVerified) {
          setLoginStage("password");
          setMessage("Password created successfully! Please log in.");
        } else {
          setMessage("Password created, but account not verified. Please contact support.");
        }
      } else {
        setMessage("Failed to create password. Please try again.");
      }
    } catch {
      setMessage("An unexpected error occurred while creating password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (password: string) => {
    setIsLoading(true);
    setMessage("Logging in...");
    console.log("Logging in with rollNo:", rollNo, "and password:", password);

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Login successful!");
      // Here you would redirect to dashboard or home page
    } catch {
      setMessage("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 relative">
      {/* Logo container - only visible on medium and larger screens */}
      <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2">
        <Image
          src="/logo.png"
          alt="DSEU Logo"
          width={350}
          height={225}
          className="object-contain"
          priority
        />
      </div>

      {/* Adjusted top padding to account for logo */}
      <div className="min-h-screen w-full flex items-center justify-center md:pt-24">
        <form className="flex flex-col gap-4 w-[95%] md:max-w-md p-4 sm:p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white border-t-4 border-b-4 border-t-blue-500 border-b-blue-500">
          {/* Logo and text container - only visible on small screens */}
          <div className="md:hidden flex flex-col items-center gap-4 mb-4">
            <Image
              src="/onlylogo.png"
              alt="DSEU Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
            <Image
              src="/onlytext12.png"
              alt="DSEU Text"
              width={150}
              height={30}
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-6 text-blue-500">
            Login
          </h2>

          {userData && (
            <div className="text-center mb-2">
              <p className="text-lg font-medium text-gray-800">Welcome, {userData.name}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="rollNo"
              className="text-sm font-medium text-gray-700"
            >
              Roll Number
            </label>
            <input
              id="rollNo"
              type="text"
              required
              placeholder="Enter your roll number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              disabled={captchaVerified}
            />
          </div>

          {loginStage === "initial" && !captchaVerified && (
            <Captcha 
              onVerify={handleCaptchaVerify} 
              isEnabled={rollNo.trim().length > 0} 
            />
          )}

          {userData && (
            <>
              {loginStage === "email" && (
                <EmailVerification
                  email={userData.email}
                  onVerify={handleEmailVerify}
                  isLoading={isLoading}
                />
              )}

              {loginStage === "otp" && (
                <OtpVerification
                  onVerify={handleOtpVerify}
                  isLoading={isLoading}
                />
              )}

              {loginStage === "createPassword" && (
                <PasswordCreation
                  onSubmit={handlePasswordCreate}
                  isLoading={isLoading}
                />
              )}

              {loginStage === "password" && (
                <VerifiedUserLogin
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                />
              )}
            </>
          )}

          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.includes("Error") ||
                message.includes("Invalid") ||
                message.includes("Please") ||
                message.includes("requires verification") ||
                message.includes("does not match") ||
                message.includes("Server error") ||
                message.includes("Failed")
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-3">
              <span className="inline-block animate-spin mr-2 text-blue-500">
                ⟳
              </span>
              <span className="text-gray-600">Loading...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
