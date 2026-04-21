"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/authStore";

const registerSchema = z
  .object({
    name: z.string().min(2, "Tên cần ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự"),
    confirmPassword: z.string().min(8, "Mật khẩu xác nhận cần ít nhất 8 ký tự"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Mật khẩu xác nhận chưa khớp",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAccount } = useAuthStore();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel = ["Yếu", "Trung bình", "Khá", "Mạnh"];

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerAccount(values.name, values.email, values.password);
      toast.success("Tạo tài khoản thành công");
      router.push("/dashboard");
    } catch {
      toast.error("Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-card w-full max-w-md p-6">
        <h1 className="text-2xl font-extrabold">Đăng ký tài khoản</h1>
        <p className="mt-1 text-sm text-white/75">Tạo tài khoản host để quản lý phòng quiz của bạn.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-semibold">
              Họ và tên
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Nguyễn Văn A"
            />
            {errors.name ? <p className="mt-1 text-sm text-red-300">{errors.name.message}</p> : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="teacher@school.vn"
            />
            {errors.email ? <p className="mt-1 text-sm text-red-300">{errors.email.message}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="••••••••"
            />
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full bg-green-400 transition-all" style={{ width: `${passwordStrength * 25}%` }} />
            </div>
            <p className="mt-1 text-xs text-white/80">Độ mạnh mật khẩu: {strengthLabel[Math.max(passwordStrength - 1, 0)]}</p>
            {errors.password ? <p className="mt-1 text-sm text-red-300">{errors.password.message}</p> : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="••••••••"
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--accent)] py-3 font-bold transition hover:brightness-110 disabled:opacity-60"
          >
            {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-4 text-sm text-white/80">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-semibold text-white underline">
            Đăng nhập ngay
          </Link>
        </p>
      </section>
    </main>
  );
}
