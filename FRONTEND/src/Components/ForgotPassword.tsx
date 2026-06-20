import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { forgotPassword } from "../api/authService";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");
      await forgotPassword({ email: email.trim() });
      setSent(true);
    } catch (err) {
      setServerError(getErrorMessage(err, "Failed to send reset link. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-white px-4">
      <div className="bg-purple-200 rounded-2xl shadow-md p-8 w-full max-w-md">

        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 6l-10 7L2 6"/>
                <rect x="2" y="4" width="20" height="16" rx="2"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Check Your Email</h2>
            <p className="text-sm text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>. It expires in 15 minutes.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Forgot Password</h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {serverError && (
              <p className="text-red-500 text-sm text-center mb-4 font-medium">{serverError}</p>
            )}

            <div className="flex flex-col gap-4">
              <div className="relative border border-gray-400 rounded-md bg-white px-3 py-3">
                <label className="absolute -top-3.5 left-3 bg-white px-1 text-md text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value.trim()) setEmailError("");
                  }}
                  placeholder="you@example.com"
                  className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent py-1"
                />
              </div>
              {emailError && <p className="text-red-500 text-xs -mt-2 font-medium pl-1">{emailError}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-purple-700 font-medium cursor-pointer hover:underline"
                >
                  Back to Login
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;