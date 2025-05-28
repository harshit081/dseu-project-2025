'use client'

import { useState } from 'react';

interface PasswordCreationProps {
  onSubmit: (newPassword: string, confirmPassword: string) => Promise<void>;
  isLoading: boolean;
}

const PasswordCreation = ({ onSubmit, isLoading }: PasswordCreationProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setPasswordError('');
    
    // password ckeck if wrong do not make a call
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    await onSubmit(newPassword, confirmPassword);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-600 mb-1">
        Create your new password:
      </div>
      <input 
        type="password" 
        required 
        placeholder="New Password" 
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setPasswordError('');
        }}
        className="p-2 border rounded"
      />
      <input 
        type="password" 
        required 
        placeholder="Confirm Password" 
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setPasswordError('');
        }}
        className="p-2 border rounded"
      />
      
      {passwordError && (
        <div className="text-xs text-red-600 mt-1">
          {passwordError}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        Create Password
      </button>
    </div>
  );
};

export default PasswordCreation;
