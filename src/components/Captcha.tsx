"use client";

import { useState, useEffect } from "react";
import { CaptchaJs } from "@solarwinter/captchajs";
// import ReloadImg from "../../public/loading-arrow.png";

const captcha = new CaptchaJs({
  client: "demo", // Replace with process.env.CAPTCHAS_CLIENT in production
  secret: "secret", // Replace with process.env.CAPTCHAS_SECRET in production
});

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

const Captcha = ({ onVerify }: CaptchaProps) => {
  const [randomString, setRandomString] = useState("");
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [message, setMessage] = useState("");

  // generate captcha when component loads
  useEffect(() => {
    generateCaptcha();
  }, []);

  // generate new captcha
  const generateCaptcha = () => {
    const random = captcha.getRandomString();
    setRandomString(random);
    setCaptchaImageUrl(captcha.getImageUrl({ randomString: random }));
    setUserCaptchaInput("");
    onVerify(false);
  };

  // Verify captcha user ne jo input diya
  const verifyCaptcha = () => {
    if (!captcha.validateRandomString(randomString)) {
      setMessage("CAPTCHA has expired. Generating a new one.");
      generateCaptcha();
      return false;
    } else if (!captcha.verifyPassword(randomString, userCaptchaInput)) {
      setMessage("Invalid CAPTCHA text. Please try again.");
      generateCaptcha();
      return false;
    } else {
      setMessage("CAPTCHA verified successfully!");
      onVerify(true);
      return true;
    }
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    verifyCaptcha();
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
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
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
