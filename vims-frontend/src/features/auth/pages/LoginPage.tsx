import { CheckCircle2 } from "lucide-react";
import loginBg from "@/assets/images/bg-login.webp";
import logo from "@/assets/icons/logo-supreme-small.png";
import { LoginForm } from "../components/LoginForm";

const FEATURES = [
  "Multi-level approval workflow",
  "Full audit trail & history",
  "Multi-format invoice parsing",
  "Real-time reports & reconciliation",
];

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="flex w-full max-w-[740px] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.6)" }}
      >
        {/* LEFT — brand */}
        <div
          className="hidden md:flex flex-col justify-between w-[50%] shrink-0 p-8"
          style={{ background: "#0d1f3c" }}
        >
          <div className="space-y-6">
            <img src={logo} alt="Supreme Energy" className="h-8 w-auto object-contain" />

            <div>
              <p className="text-blue-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5">
                Vendor Invoice Management System
              </p>
              <h1 className="text-white text-[26px] font-bold tracking-tight leading-tight mb-3">
                VIMS
              </h1>
              <p className="text-white/40 text-[11px] leading-relaxed">
                An integrated platform to manage the full vendor invoice lifecycle — from
                receipt and verification to approval and payment.
              </p>
            </div>

            <div className="space-y-2.5">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3 h-3 text-blue-400 mt-[1px] shrink-0" />
                  <span className="text-white/45 text-[11px] leading-snug">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/15 text-[10px]">© 2026 Supreme Energy · All rights reserved</p>
        </div>

        {/* RIGHT — form */}
        <div
          className="flex-1 flex flex-col justify-center p-8"
          style={{ background: "#ffffff" }}
        >
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-6">
            <img src={logo} alt="Supreme Energy" className="h-7 w-auto object-contain" />
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}