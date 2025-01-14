"use client"; // Mark this component as a Client Component

import Appicon from "../SVG_ICONS/logo.svg";
import Link from "next/link";
import { useAuth, SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";

function Navbar() {
  const BackgroundColorObject = { backgroundColor: "#DC2626" };
  const { userId } = useAuth();

  return (
    <header>
      <div className="p-8 px-20">
        <div className="sm:flex sm:items-center sm:justify-between">
          {/* Logo and app name */}
          <div className="text-center sm:text-left mb-7 sm:mb-0">
            <div className="flex gap-2 items-center sm:justify-between">
              <div style={BackgroundColorObject} className="p-2 rounded-md">
                <Appicon style={{ width: "50px", height: "50px", fill: "#000000" }} />
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  style={{ color: "#DC2626" }}
                  className="text-2xl font-semibold page-font-mono"
                >
                  Habit
                </span>
                <span className="font-normal page-font-mono">Stacker</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <SignedIn>
              {/* Content to show only when signed in */}
              <div className="flex items-center">
                <Link
                  href="/dashboard"
                  style={BackgroundColorObject}
                  className="block rounded-lg px-9 py-3 text-sm font-medium text-white transition"
                >
                  Dashboard
                </Link>
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              {/* Content to show only when signed out */}
              <div className="flex items-center gap-4">
                <SignInButton>
                  <button
                    style={BackgroundColorObject}
                    className="block sm:w-32 w-full rounded-lg px-9 py-3 text-sm font-medium text-white transition focus:outline-none text-center"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <Link
                  href="/sign-up"
                  className="block sm:w-32 w-full border rounded-lg px-9 py-3 text-sm font-medium transition focus:outline-none 
                          hover:bg-red-600 hover:text-white border-red-600 text-red-600 duration-500 ease-in-out text-center"
                >
                  Sign Up
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
