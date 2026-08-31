"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageCircle, Bell, Search, Briefcase, Banknote, Cog, Activity, Stethoscope, LogOut, ChevronDown, Check } from "lucide-react";
import { MOCK_USER } from "@/lib/roles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedRole } from "@/store/slices/authSlice";

const PERSONAS = [
  { label: "Project Manager", icon: Briefcase },
  { label: "Sales", icon: Banknote },
  { label: "Operations", icon: Cog },
  { label: "Reliability Engineer", icon: Activity },
  { label: "Diagnostics", icon: Stethoscope },
] as const;

export default function TopNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedRole = useAppSelector((s) => s.auth.selectedRole);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const switchPersona = (label: string) => {
    dispatch(setSelectedRole(label));
    setOpen(false);
    router.push("/dashboard");
  };

  const logOut = () => {
    setOpen(false);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between h-8 shrink-0">
      <Image
        src="/header-logo.svg"
        alt="HITACHI HMAX Unified"
        width={194}
        height={22}
        priority
      />

      {/* Right icon group */}
      <div className="flex items-center gap-2">
        {/* AI chat button */}
        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors cursor-pointer">
          <MessageCircle size={15} strokeWidth={1.5} />
        </button>

        {/* Bell with dot */}
        <button className="relative w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
          <Bell size={16} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gray-900" />
        </button>

        {/* Search */}
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
          <Search size={16} strokeWidth={1.5} />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOCK_USER.avatar}
              alt={MOCK_USER.fullName}
              className="w-8 h-8 rounded-full object-cover bg-gray-200 grayscale"
            />
            <ChevronDown size={13} strokeWidth={2} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-message-in">
              {/* User header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MOCK_USER.avatar}
                  alt={MOCK_USER.fullName}
                  className="w-9 h-9 rounded-full object-cover bg-gray-200 grayscale shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 truncate">{MOCK_USER.fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{MOCK_USER.email}</p>
                </div>
              </div>

              {/* Persona switcher */}
              <div className="px-4 pt-2.5 pb-1">
                <p className="text-[11px] text-gray-400 tracking-wider">Persona</p>
              </div>
              {PERSONAS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => switchPersona(label)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Icon size={15} strokeWidth={1.5} className="text-gray-400" />
                  {label}
                  {selectedRole === label && <Check size={14} className="text-gray-500 ml-auto" />}
                </button>
              ))}

              <hr className="border-gray-100 my-1" />

              {/* Log out */}
              <button
                onClick={logOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <LogOut size={15} strokeWidth={1.5} className="text-gray-400" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
