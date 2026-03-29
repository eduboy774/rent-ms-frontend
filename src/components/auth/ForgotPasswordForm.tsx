import { useState } from "react";
import { Link } from "react-router";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { FORGOT_PASSWORD } from "../../graphql/mutation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const { data } = await forgotPassword({
        variables: { userEmail: email },
      });

      const response = data?.forgotPasswordMutation?.response;

      if (response?.code === 9000 || response?.status === "1") {
        setSubmitted(true);
        toast.success(response?.message || "Reset link sent to your email");
      } else {
        toast.error(response?.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[460px] text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Check Your Email
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setSubmitted(false)}
              className="font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400"
            >
              try again
            </button>
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
      <div className="w-full max-w-[460px]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                Email Address <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
              size="sm"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
