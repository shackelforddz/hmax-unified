import Image from "next/image";

export default function AuthHeader() {
  return (
    <Image
      src="/header-logo.svg"
      alt="HITACHI HMAX Unified"
      width={194}
      height={22}
      priority
    />
  );
}
