'use client'

import { useState } from 'react';

interface VerifiedUserLoginProps {
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
}

const VerifiedUserLogin = ({ onSubmit, isLoading }: VerifiedUserLoginProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      await onSubmit(password);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input 
        type="password" 
        required 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <button 
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        Login
      </button>
    </div>
  );
};

export default VerifiedUserLogin;
