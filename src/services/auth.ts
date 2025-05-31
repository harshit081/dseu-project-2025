export interface UserData {
  name: string;
  email: string;
  isVerified: boolean;
}

// Dummy API call function to fetch user data
export const fetchUserData = async (rollNo: string): Promise<UserData> => {
  try {
    // Replace with actual API call
    const response = await fetch(`http://localhost:5000/api/v1/users/rollNumber-exist/${rollNo}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch {
    throw new Error("Failed to fetch user data. Please try again later.");
  }
};

// Dummy API call to verify email
export const verifyEmail = async (email: string, rollNo: string): Promise<{ status: number, message: string }> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/users/verify-partial-email/${rollNo}/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return {
      status: response.status,
      message: data.message || "OTP sent to your registered email address"
    };
  } catch {
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
export const createPassword = async (_rollNo: string, _newPassword: string): Promise<{ status: number, message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Always return success for demo purposes
  return {
    status: 200,
    message: "Password created successfully. Please login with your new password."
  };
};
