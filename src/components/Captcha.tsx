"use client";

import { useState, useEffect } from "react";


interface CaptchaProps {
  onVerify: (verified: boolean) => void;
  isEnabled?: boolean; // to check if roll no is filled or not (if not verify disable)
}

const Captcha = ({ onVerify, isEnabled = true }: CaptchaProps) => {
  const [randomString, setRandomString] = useState("");
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [message, setMessage] = useState("");


  // generate captcha when component loads
  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line
  }, []);

  // generate new captcha by calling backend
  const generateCaptcha = async () => {
    setMessage("");
    setUserCaptchaInput("");
    onVerify(false);
    try {
      // Use the correct backend endpoint for CAPTCHA generation
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/v1/users/generate-captcha`, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }
      const data = await res.json();
      setRandomString(data.captchaId);
      setCaptchaImageUrl(data.image);
    } catch {
      setMessage("Failed to load CAPTCHA. Please try again.");
    }
  };


  // Verify captcha by calling backend
  const verifyCaptcha = async () => {
    try {
      // Use the correct backend endpoint for CAPTCHA verification
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/v1/users/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaId: randomString, answer: userCaptchaInput }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("CAPTCHA verified successfully!");
        onVerify(true);
        return true;
      } else {
        setMessage(data.message || "Invalid CAPTCHA. Try again.");
        generateCaptcha();
        return false;
      }
    } catch {
      setMessage("Failed to verify CAPTCHA. Please try again.");
      generateCaptcha();
      return false;
    }
  };

  const handleVerify = async (e: React.MouseEvent) => {
    e.preventDefault();
    await verifyCaptcha();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {captchaImageUrl && (
          <div className="flex-shrink-0">
            <img
              src={captchaImageUrl}
              alt="CAPTCHA"
              className="h-12 border rounded-lg shadow-sm"
            />
          </div>
        )}
        <div className="flex-grow">
          <input
            type="text"
            required
            placeholder="Enter CAPTCHA"
            value={userCaptchaInput}
            onChange={(e) => setUserCaptchaInput(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-sm text-blue-500 hover:text-blue-600 p-2"
        >
          <img
            src="/loading-arrow.png"
            alt="Reload CAPTCHA"
            className="w-5 h-5 hover:rotate-180 transition-transform duration-300"
          />
        </button>
        <button
          onClick={handleVerify}
          disabled={!isEnabled} // if there is no roll no
          className={`py-2 px-4 rounded-lg ${
            isEnabled 
              ? "bg-blue-500 hover:bg-blue-600 text-white" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition-all`}
        >
          Verify
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.includes("Invalid") || message.includes("expired")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {message}
        </div>
      )}

      <input type="hidden" name="randomString" value={randomString} />
    </div>
  );
};

export default Captcha;
