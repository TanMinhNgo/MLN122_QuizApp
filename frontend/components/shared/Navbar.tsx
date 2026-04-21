"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/dang-nhap");
  };

  return (
    <header className="glass-card mx-auto mt-4 flex w-[min(1100px,calc(100%-2rem))] items-center justify-between px-4 py-3">
      <Link href="/dashboard" className="text-xl font-extrabold tracking-wide">
        QuizVui
      </Link>
      <div className="flex items-center gap-3">
        <p className="text-sm text-white/90">{user?.name || "Giáo viên"}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20"
        >
          <LogOut className="size-4" />
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
