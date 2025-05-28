'use client'

import { useState } from 'react';

interface OtpVerificationProps {
  onVerify: (otp: string) => Promise<void>;
  isLoading: boolean;
}

const OtpVerification = ({ onVerify, isLoading }: OtpVerificationProps) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim()) {
      await onVerify(otp);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-600 mb-1">
        Enter the OTP sent to your email:
      </div>
      <input 
        type="text" 
        required 
        placeholder="Enter 6-digit OTP" 
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="p-2 border rounded"
        maxLength={6}
      />
      <button 
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OtpVerification;
