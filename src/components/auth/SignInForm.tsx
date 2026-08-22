import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useSignIn } from "./useSignIn";
import { getDevCredentials } from "../../store/devCredentials";
import "react-toastify/dist/ReactToastify.css";

export default function SignInForm() {
  // Prefilled while developing; empty in a production build.
  const devCredentials = getDevCredentials();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState(devCredentials.username);
  const [password, setPassword] = useState(devCredentials.password);
  const { authenticate } = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticate(userName, password);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
      <div className="w-full max-w-[460px]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Login
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to login!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                Username <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
              size="sm"
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 dark:bg-gray-900 dark:text-gray-500">
              or
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-orange-500 transition-colors hover:text-orange-600 dark:text-orange-400"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
