'use client'

import { useState } from 'react';
import Captcha from './Captcha';
import EmailVerification from './login/EmailVerification';
import OtpVerification from './login/OtpVerification';
import PasswordCreation from './login/PasswordCreation';
import VerifiedUserLogin from './login/VerifiedUserLogin';

import { 
  UserData, 
  fetchUserData, 
  verifyEmail, 
  verifyOtp, 
  createPassword 
} from '@/services/auth';

const Login = () => {
  const [rollNo, setRollNo] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loginStage, setLoginStage] = useState<'initial' | 'email' | 'otp' | 'createPassword' | 'password'>('initial');

  // Reset the entire form to initial state
  const resetForm = () => {
    setRollNo('');
    setCaptchaVerified(false);
    setUserData(null);
    setLoginStage('initial');
    setMessage('');
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
          setLoginStage('password');
          setMessage("Please enter your password to continue.");
        } else {
          setLoginStage('email');
          setMessage("Account requires verification. Please enter the email associated with your account.");
        }
      } catch (error) {
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
        setLoginStage('otp');
        setMessage(response.message);
      } else {
        // Error occurred, reset the form
        resetForm();
        setMessage(response.message);
      }
    } catch (error) {
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
      const response = await verifyOtp(otp, "");
      
      if (response.success) {
        setLoginStage('createPassword');
        setMessage(response.message);
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage("An unexpected error occurred while verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCreate = async (newPassword: string, confirmPassword: string) => {
    setIsLoading(true);
    setMessage("Creating password...");
    
    try {
      const response = await createPassword(rollNo, newPassword);
      
      if (response.status === 200) {
        setMessage(response.message);
        
        // Reset the form after 2 seconds
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        setMessage("Failed to create password. Please try again.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred while creating password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (password: string) => {
    setIsLoading(true);
    setMessage("Logging in...");
    
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("Login successful!");
      // Here you would redirect to dashboard or home page
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      
      {/* roll no Input alwyas visible but disabled after captcha verification */}
      <div className="flex flex-col gap-2">
        <input 
          type="text" 
          required 
          placeholder="Roll No." 
          value={rollNo} 
          onChange={e => setRollNo(e.target.value)} 
          className="p-2 border rounded"
          disabled={captchaVerified}
        />
      </div>

      {/* Show CAPTCHA only in initial stage */}
      {loginStage === 'initial' && !captchaVerified && (
        <Captcha onVerify={handleCaptchaVerify} />
      )}
      
      {/* Show appropriate components based on login stage */}
      {userData && (
        <>
          {loginStage === 'email' && (
            <EmailVerification 
              email={userData.email} 
              onVerify={handleEmailVerify} 
              isLoading={isLoading} 
            />
          )}
          
          {loginStage === 'otp' && (
            <OtpVerification
              onVerify={handleOtpVerify}
              isLoading={isLoading}
            />
          )}
          
          {loginStage === 'createPassword' && (
            <PasswordCreation
              onSubmit={handlePasswordCreate}
              isLoading={isLoading}
            />
          )}
          
          {loginStage === 'password' && (
            <VerifiedUserLogin
              onSubmit={handleLogin}
              isLoading={isLoading}
            />
          )}
        </>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-2">
          <span className="inline-block animate-spin mr-2">⟳</span> Loading...
        </div>
      )}

      {/* Message area */}
      {message && (
        <div className={`p-2 rounded ${
          message.includes('Error') || message.includes('Invalid') || message.includes('Please') || 
          message.includes('requires verification') || message.includes('does not match') || 
          message.includes('Server error') || message.includes('Failed')
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default Login;
