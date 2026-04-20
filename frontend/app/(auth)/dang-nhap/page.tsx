"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/authStore";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Đăng nhập thành công");
      router.push("/dashboard");
    } catch {
      toast.error("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-card w-full max-w-md p-6">
        <h1 className="text-2xl font-extrabold">Đăng nhập hệ thống</h1>
        <p className="mt-1 text-sm text-white/75">Quản lý quiz và tạo phòng trực tiếp cho lớp học.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            {errors.password ? <p className="mt-1 text-sm text-red-300">{errors.password.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--accent)] py-3 font-bold transition hover:brightness-110 disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-4 text-sm text-white/80">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-semibold text-white underline">
            Tạo tài khoản mới
          </Link>
        </p>
      </section>
    </main>
  );
}
