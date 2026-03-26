import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
      {/* Mobile-only brand header */}
      <div className="mb-8 flex flex-col items-center lg:hidden">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>
        <span className="text-xl font-bold text-orange-500">
          Rental Management System
        </span>
      </div>

      <div className="w-full max-w-[460px]">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below to get started
          </p>
        </div>

        {/* Form */}
        <form>
          <div className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="First name"
                />
              </div>
              <div>
                <Label>
                  Last Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="lname"
                  name="lname"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  type={showPassword ? "text" : "password"}
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

            {/* Terms checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                className="mt-0.5 h-5 w-5"
                checked={isChecked}
                onChange={setIsChecked}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By creating an account you agree to the{" "}
                <span className="font-medium text-gray-800 dark:text-white/90">
                  Terms &amp; Conditions
                </span>{" "}
                and our{" "}
                <span className="font-medium text-gray-800 dark:text-white/90">
                  Privacy Policy
                </span>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-theme-xs transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Divider */}
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

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/ "
            className="font-semibold text-orange-500 transition-colors hover:text-orange-600 dark:text-orange-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
