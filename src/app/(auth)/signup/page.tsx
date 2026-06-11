"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ChevronLeft } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import Button from "@/components/Button";

export default function SignUpPage() {
    const { signup } = useAuth();
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!fullName.trim()) e.fullName = "Display name is required";
        if (!email.includes("@")) e.email = "Invalid email";
        if (password.length < 6) e.password = "At least 6 characters";
        if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        if (!validate()) return;
        setLoading(true);

        try {
            const data = await signup(email, password, fullName.trim());
            if (data.user && data.session) {
                // Auto-logged in → go to onboarding
                router.push("/onboarding/gender");
            } else if (data.user) {
                // Email confirmation required
                setMessage("Account created! Check your email to verify, then log in.");
            }
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col text-white">
            {/* Logo */}
            <div className="pb-2 pt-6">
                <AppLogo href="/" inverted />
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm w-full py-8">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Create account</h1>
                    <p className="mt-2 text-sm text-white/55">Start your fitness journey today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="auth-label">Display Name</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="auth-input"
                        />
                        {errors.fullName && <p className="text-white text-xs mt-1 font-semibold">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className="auth-label">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@email.com"
                            className="auth-input"
                        />
                        {errors.email && <p className="text-white text-xs mt-1 font-semibold">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="auth-label">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            className="auth-input"
                        />
                        {errors.password && <p className="text-white text-xs mt-1 font-semibold">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="auth-label">Confirm Password</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            className="auth-input"
                        />
                        {errors.confirmPassword && <p className="text-white text-xs mt-1 font-semibold">{errors.confirmPassword}</p>}
                    </div>

                    {message && (
                        <div className="rounded-[var(--radius-md)] border border-white/15 bg-white/10 p-3 text-sm text-white/90">{message}</div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        block
                        variant="lime"
                        className="!py-3 !text-base"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </form>

                <p className="text-center text-white/60 text-sm mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white font-semibold hover:text-white/80 transition">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
