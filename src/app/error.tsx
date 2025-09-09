"use client";

import React from "react";
import Link from "next/link";

const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="bg-gray-800 rounded-xl shadow-lg p-10 max-w-md w-full text-center animate-fade-in">
          <svg className="mx-auto mb-6" width="64" height="64" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#ef4444" />
            <path d="M12 8v4m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="mb-6 text-gray-300">{error?.message || "An unexpected error has occurred. Please try again or return home."}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Try Again
            </button>
            <Link href="/" className="text-sm text-gray-400 hover:text-white underline">
              Go to Home
            </Link>
          </div>
        </div>
        <style jsx global>{`
					@keyframes fade-in {
						from { opacity: 0; transform: translateY(20px); }
						to { opacity: 1; transform: translateY(0); }
					}
					.animate-fade-in { animation: fade-in 0.6s cubic-bezier(.4,0,.2,1) both; }
				`}</style>
      </body>
    </html>
  );
}


export default ErrorPage;