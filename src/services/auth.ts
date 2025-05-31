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

// Real API call to verify OTP using roll number and otp
export const verifyOtp = async (otp: string, rollNo: string): Promise<{ success: boolean, message: string }> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rollNumber: rollNo, otp }),
    });
    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch {
    return { success: false, message: "Server error. Please try again later." };
  }
};

// Real API call to set password using roll number and password
export const createPassword = async (rollNo: string, newPassword: string): Promise<{ status: number, message: string }> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/users/set-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rollNumber: rollNo, password: newPassword }),
    });
    const data = await response.json();
    return { status: response.status, message: data.message };
  } catch {
    return { status: 501, message: "Server error. Please try again later." };
  }
};
