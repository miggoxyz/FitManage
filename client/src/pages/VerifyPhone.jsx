import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyPhone = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    setError("");
    setMessage("");
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      // Send verification code to backend
      const response = await axios.post(
        "/api/auth/verify-code",
        { verificationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );

      setMessage(response.data.message);
      navigate("/"); // Redirect to the dashboard or home page after successful verification
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Verify Your Phone Number
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter verification code"
            />
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
