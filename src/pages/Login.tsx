import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCompleted, setCaptchaCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const captchaRef = useRef<HTMLDivElement | null>(null);

  // Site key reCAPTCHA kamu
  const RECAPTCHA_SITE_KEY = "6Lf2SssrAAAAAJiH1GgQp5z_tH2C3AKx1JeZ6Ymo";

  // Load script Google reCAPTCHA
  useEffect(() => {
    const scriptId = "recaptcha-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.grecaptcha && captchaRef.current) {
          window.grecaptcha.ready(() => {
            window.grecaptcha.render(captchaRef.current, {
              sitekey: RECAPTCHA_SITE_KEY,
              callback: (token: string) => {
                if (token) {
                  setCaptchaCompleted(true);
                  setError("");
                }
              },
              "expired-callback": () => {
                setCaptchaCompleted(false);
                setError("Waktu verifikasi captcha habis. Silakan coba lagi.");
              },
              "error-callback": () => {
                setCaptchaCompleted(false);
                setError("Terjadi kesalahan dalam verifikasi captcha.");
              },
            });
          });
        }
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!captchaCompleted) {
      setError("Harap verifikasi bahwa Anda bukan robot");
      setIsLoading(false);
      return;
    }

    try {
      // Ambil token dari reCAPTCHA
      const token = window.grecaptcha.getResponse();

      // Biasanya token dikirim ke backend untuk verifikasi di server
      console.log("Token reCAPTCHA:", token);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!login(username, password)) {
        setError("Username atau password salah");
        window.grecaptcha.reset();
        setCaptchaCompleted(false);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat verifikasi captcha");
      window.grecaptcha.reset();
      setCaptchaCompleted(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Masuk ke PageBuilder</CardTitle>
          <CardDescription>
            Masukkan kredensial Anda untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Tempat render reCAPTCHA */}
            <div className="flex justify-center">
              <div ref={captchaRef}></div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !captchaCompleted}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
