import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  const apiErrorMessage = isError
    ? (error as any)?.response?.data?.message ?? "Username atau password salah."
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-gray-900 text-base font-bold tracking-tight mb-1">
          Sign in to your account
        </h2>
        <p className="text-gray-400 text-[11px]">
          Use the credentials provided by your IT administrator.
        </p>
      </div>

      <div className="space-y-4">
        {/* Username */}
        <div className="space-y-1">
          <Label
            htmlFor="username"
            className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest"
          >
            Username
          </Label>
          <Input
            id="username"
            placeholder="Enter your username"
            disabled={isPending}
            className="h-8 text-[12px] rounded-lg bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-400"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-[10px]">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest"
            >
              Password
            </Label>
            <button
              type="button"
              className="text-blue-500 text-[10px] font-medium hover:text-blue-600 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isPending}
              className="h-8 text-[12px] rounded-lg bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 pr-8 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-400"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[10px]">{errors.password.message}</p>
          )}
        </div>

        {/* API error */}
        {apiErrorMessage && (
          <p className="text-red-500 text-[11px] text-center">{apiErrorMessage}</p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-8 text-[12px] rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold tracking-wide transition-colors"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </div>

      <p className="text-gray-300 text-[10px] text-center mt-5">
        Need access?{" "}
        <span className="text-blue-500 font-medium cursor-pointer hover:underline">
          Contact IT Support
        </span>
      </p>
    </form>
  );
}