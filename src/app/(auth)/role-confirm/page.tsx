"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Banknote,
  RefreshCcw,
  Cog,
  Stethoscope,
} from "lucide-react";
import AuthHeader from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedRole } from "@/store/slices/authSlice";
import {
  RECOMMENDED_ROLE,
  ALL_ROLES,
  MOCK_USER,
  type Role,
} from "@/lib/roles";

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  Banknote,
  RefreshCcw,
  Cog,
  Stethoscope,
};

function RoleIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={1.5} />;
}

export default function RoleConfirmPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedRoleLabel = useAppSelector((s) => s.auth.selectedRole);

  // The role carried in from the login URL becomes the "recommended" persona
  // and is pre-selected; the remaining roles are shown as alternatives.
  const recommended = ALL_ROLES.find((r) => r.label === selectedRoleLabel) ?? RECOMMENDED_ROLE;
  const alternatives = ALL_ROLES.filter((r) => r.id !== recommended.id);
  const [selected, setSelected] = useState<Role>(recommended);

  const handleContinue = () => {
    dispatch(setSelectedRole(selected.label));
    router.push("/dashboard");
  };

  const isSelected = (role: Role) => selected.id === role.id;

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex flex-col font-patrick-hand">
      <header className="flex justify-center pt-8">
        <AuthHeader />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[740px]">
          {/* Heading */}
          <p className="text-xs text-gray-400 text-center mb-1 tracking-wide">
            Role Detected: {MOCK_USER.detectedDivision}
          </p>
          <h1 className="font-patrick-hand text-[2rem] text-center mb-8">
            Your Recommended Persona
          </h1>

          {/* Recommended role card */}
          <button
            onClick={() => setSelected(recommended)}
            className={`w-full text-left bg-white rounded-2xl p-6 flex items-start gap-5 mb-6 transition-all ${
              isSelected(recommended)
                ? "ring-2 ring-black shadow-sm"
                : "ring-1 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 mt-0.5">
              <RoleIcon name={recommended.icon} size={24} />
            </div>
            <div>
              <h2 className="font-patrick-hand text-xl mb-2">
                {recommended.label}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {recommended.description}
              </p>
            </div>
          </button>

          {/* Alternative roles */}
          <p className="text-xs text-gray-400 text-center mb-4">
            Or, select an alternative workspace persona below
          </p>

          <div className="grid grid-cols-3 gap-3">
            {alternatives.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelected(role)}
                className={`text-left bg-white rounded-xl p-4 transition-all ${
                  isSelected(role)
                    ? "ring-2 ring-black shadow-sm"
                    : "ring-1 ring-gray-200 hover:ring-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-gray-600">
                  <RoleIcon name={role.icon} size={16} />
                  <span className="font-patrick-hand text-base">
                    {role.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {role.description}
                </p>
              </button>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="h-auto px-0 text-sm text-gray-500 hover:bg-transparent hover:text-gray-800 cursor-pointer"
            >
              Sign in with another account
            </Button>
            <Button
              onClick={handleContinue}
              className="rounded-full h-auto px-6 py-2.5 text-sm cursor-pointer"
            >
              Continue with {selected.label}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
