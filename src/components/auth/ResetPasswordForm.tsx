import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { RESET_PASSWORD } from "../../graphql/mutation";

export default function ResetPasswordForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a new password");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: {
          input: {
            requestToken: token,
            userPassword: password,
          },
        },
      });

      const response = data?.resetPasswordMutation?.response;

      if (response?.code === 9000 || response?.status === "1") {
        toast.success(response?.message || "Password reset successfully");
        navigate("/");
      } else {
        toast.error(response?.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
      <div className="w-full max-w-[460px]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below to reset your account password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                New Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5 fill-current" />
                  ) : (
                    <EyeCloseIcon className="size-5 fill-current" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label>
                Confirm Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="size-5 fill-current" />
                  ) : (
                    <EyeCloseIcon className="size-5 fill-current" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
              size="sm"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
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
