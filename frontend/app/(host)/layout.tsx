"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/shared/Navbar";
import { useAuthStore } from "@/stores/authStore";

interface HostLayoutProps {
  children: React.ReactNode;
}

export default function HostLayout({ children }: HostLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      await hydrate();
      setLoading(false);
    };

    void run();
  }, [hydrate]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/dang-nhap");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Đang kiểm tra phiên đăng nhập...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pb-6">
      <Navbar />
      {children}
    </div>
  );
}
