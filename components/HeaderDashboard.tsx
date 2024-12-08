"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image"; // Import Image from next/image

export default function HeaderDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser(); // Get user information

  return (
    <header className="bg-white shadow-sm ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
            <div className="flex justify-center items-center gap-2">

              <span className="sr-only">Zen3D</span>
              <Image
                className="h-8 w-auto sm:h-10"
                src="/logo.svg"
                alt="3D Printing Service Logo"
                width={100} // Specify width
                height={100} // Specify height
                />
              <p className="opacity-90">Zen 3D</p> <p className="uppercase border rounded p-1 opacity-50">beta</p>
                </div>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <SignedIn>
              <div className="flex items-center space-x-3 ml-auto">
                {user && (
                  <span className="flex  text-gray-700  items-center gap-2">
                    Welcome, {user.firstName}!
                  </span>
                )}

                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-20">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <Image
                    className="h-8 w-auto"
                    src="/logo.svg"
                    alt="3D Printing Service Logo"
                    width={100} // Specify width
                    height={100} // Specify height
                  />
                </div>
                <div className="-mr-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Close menu</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <SignedIn>
                <Link href="/dashboard">
                  <Button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Order Now
                  </Button>
                </Link>
                <SignOutButton>
                  <Button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700">
                    Sign Out
                  </Button>
                </SignOutButton>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
