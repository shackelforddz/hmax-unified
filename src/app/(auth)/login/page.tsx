"use client";

import { useRouter } from "next/navigation";
import { KeyRound, ShieldAlert } from "lucide-react";
import AuthHeader from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex flex-col font-patrick-hand">
      <header className="flex justify-center pt-8">
        <AuthHeader />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 w-full max-w-[420px]">
          <h1 className="font-patrick-hand text-[1.65rem] text-center leading-snug mb-1">
            Sign in to your workspace
          </h1>
          <p className="text-sm text-gray-400 text-center mb-8">
            Access your Hitachi HMAX cockpit
          </p>

          <Button
            onClick={() => router.push("/loading-profile")}
            className="w-full rounded-full h-auto py-3 gap-2 text-sm cursor-pointer"
          >
            <KeyRound size={15} strokeWidth={2} />
            Sign in with Single Sign-On
          </Button>

          <p className="text-sm text-center text-gray-400 mt-4 hover:text-gray-600 cursor-pointer transition-colors">
            Other sign-in options
          </p>

          <hr className="my-6 border-gray-100" />

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldAlert size={13} strokeWidth={1.5} />
            <span>Secured by Hitachi IAM Enterprise Guard</span>
          </div>
        </div>
      </main>

      <footer className="flex justify-center items-center gap-4 py-6 text-xs text-gray-400">
        <a href="#" className="hover:underline">Terms of Service</a>
        <span>•</span>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <span>•</span>
        <span>© 2025 Hitachi, Ltd. All rights reserved.</span>
      </footer>
    </div>
  );
}
