export interface UserData {
  name: string;
  email: string;
  isVerified: boolean;
}

// Dummy API call function to fetch user data
export const fetchUserData = async (rollNo: string): Promise<UserData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Dummy response
  return {
    name: `Student ${rollNo}`,
    email: `student${rollNo}@dseu.ac.in`,
    isVerified: Math.random() > 0.5, // Random verification status
  };
};

// Dummy API call to verify email
export const verifyEmail = async (email: string, rollNo: string): Promise<{ status: number, message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Randomly simulate different response statuses for demonstration
  const statusOptions = [200, 401, 501];
  const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  
  if (randomStatus === 200) {
    return { 
      status: 200, 
      message: "OTP sent to your registered email address" 
    };
  } else if (randomStatus === 401) {
    return { 
      status: 401, 
      message: "Invalid email address or roll number. Please try again." 
    };
  } else {
    return { 
      status: 501, 
      message: "Server error. Please try again later." 
    };
  }
};

// Dummy API call to verify OTP
export const verifyOtp = async (otp: string, email: string): Promise<{ success: boolean, message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, any 6-digit OTP is considered valid
  if (/^\d{6}$/.test(otp)) {
    return { success: true, message: "OTP verified successfully" };
  } else {
    return { success: false, message: "Invalid OTP. Please try again." };
  }
};

// Dummy API call to create new password
export const createPassword = async (rollNo: string, newPassword: string): Promise<{ status: number, message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Always return success for demo purposes
  return {
    status: 200,
    message: "Password created successfully. Please login with your new password."
  };
};

// Utility function to mask email - show first 3 chars, asterisks, and last 3 chars
export const maskEmail = (email: string): string => {
  if (!email || email.length <= 6) return email;
  
  const atIndex = email.indexOf('@');
  if (atIndex <= 3) {
    // Handle short local-part emails
    const localPart = email.substring(0, atIndex);
    const domain = email.substring(atIndex);
    return localPart + domain;
  }
  
  const firstThree = email.substring(0, 3);
  const lastThree = email.substring(email.length - 3);
  const middleLength = email.length - 6;
  const asterisks = '*'.repeat(Math.min(middleLength, 5)); // Limit asterisks to 5 max
  
  return `${firstThree}${asterisks}${lastThree}`;
};
