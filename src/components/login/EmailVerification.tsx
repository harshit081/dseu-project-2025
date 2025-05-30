'use client'

import { useState } from 'react';
import { maskEmail } from '@/services/auth';

interface EmailVerificationProps {
  email: string;
  onVerify: (email: string) => Promise<void>;
  isLoading: boolean;
}

const EmailVerification = ({ email, onVerify, isLoading }: EmailVerificationProps) => {
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      await onVerify(userEmail);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-600 mb-1">
        Please enter the email associated with your account:
<<<<<<< Updated upstream
        <div className="font-medium">{maskEmail(email)}</div>
=======
        {email && (
          <div className="font-medium mt-1 p-2 bg-gray-100 rounded-lg">
            Hint: {email}
          </div>
        )}
>>>>>>> Stashed changes
      </div>
      <input 
        type="email" 
        required 
        placeholder="Enter your complete email" 
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <button 
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        Verify Email
      </button>
    </div>
  );
};

export default EmailVerification;
