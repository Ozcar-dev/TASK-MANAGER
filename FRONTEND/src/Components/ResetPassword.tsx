import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { resetPassword } from "../api/authService";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = { password: "", confirmPassword: "" };
    let valid = true;

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!token) {
      setServerError("Invalid reset link.");
      return;
    }

    try {
      setLoading(true);
      setServerError("");
      await resetPassword(token, { password });
      setSuccess(true);
    } catch (err) {
      setServerError(getErrorMessage(err, "Failed to reset password. The link may have expired."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-white px-4">
      <div className="bg-purple-200 rounded-2xl shadow-md p-8 w-full max-w-md">

        {success ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-purple-400 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Password Reset!</h2>
            <p className="text-sm text-gray-600">Your password has been updated. You can now log in.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Reset Password</h1>
            <p className="text-sm text-gray-600 text-center mb-6">Enter your new password below.</p>

            {serverError && (
              <p className="text-red-500 text-sm text-center mb-4 font-medium">{serverError}</p>
            )}

            <div className="flex flex-col gap-4">
              <div className="relative border border-gray-400 rounded-md bg-white px-3 py-3">
                <label className="absolute -top-3.5 left-3 bg-white px-1 text-md text-gray-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="••••••••"
                  className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent py-1"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs -mt-2 font-medium pl-1">{errors.password}</p>}

              <div className="relative border border-gray-400 rounded-md bg-white px-3 py-3">
                <label className="absolute -top-3.5 left-3 bg-white px-1 text-md text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  placeholder="••••••••"
                  className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent py-1"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs -mt-2 font-medium pl-1">{errors.confirmPassword}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;