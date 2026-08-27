"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { roleFromSlug } from "@/lib/roles";

export default function RoleLoginPage() {
  const { role: slug } = useParams<{ role: string }>();
  const router = useRouter();
  const role = roleFromSlug(slug);

  // Unknown slug → fall back to the base login.
  useEffect(() => {
    if (!role) router.replace("/login");
  }, [role, router]);

  if (!role) return null;
  return <LoginForm role={role} />;
}
