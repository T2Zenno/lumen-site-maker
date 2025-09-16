import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCompleted, setCaptchaCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Load Google reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize reCAPTCHA when script loads
    script.onload = () => {
      window.grecaptcha.ready(() => {
        console.log('reCAPTCHA loaded');
      });
    };

    return () => {
      // Clean up
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!captchaCompleted) {
      setError('Harap verifikasi bahwa Anda bukan robot');
      setIsLoading(false);
      return;
    }

    // Verify reCAPTCHA token with server (simulated here)
    try {
      // In a real app, you would verify the token with your backend
      // const token = window.grecaptcha.getResponse();
      // const verified = await verifyCaptcha(token);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!login(username, password)) {
        setError('Username atau password salah');
        // Reset reCAPTCHA on failed login
        window.grecaptcha.reset();
        setCaptchaCompleted(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat verifikasi captcha');
      window.grecaptcha.reset();
      setCaptchaCompleted(false);
    }
    
    setIsLoading(false);
  };

  const handleCaptchaVerify = (token: string) => {
    if (token) {
      setCaptchaCompleted(true);
      setError('');
    }
  };

  const handleCaptchaExpired = () => {
    setCaptchaCompleted(false);
    setError('Waktu verifikasi captcha habis. Silakan coba lagi.');
  };

  const handleCaptchaError = () => {
    setCaptchaCompleted(false);
    setError('Terjadi kesalahan dalam verifikasi captcha.');
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
                  type={showPassword ? 'text' : 'password'}
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
            
            {/* Google reCAPTCHA v2 */}
            <div className="flex justify-center">
              <div
                className="g-recaptcha"
                data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is a test key from Google
                data-callback="handleCaptchaVerify"
                data-expired-callback="handleCaptchaExpired"
                data-error-callback="handleCaptchaError"
              ></div>
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
      
      {/* Add global functions for reCAPTCHA callbacks */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.handleCaptchaVerify = function(token) {
              window.dispatchEvent(new CustomEvent('captchaVerified', { detail: token }));
            };
            window.handleCaptchaExpired = function() {
              window.dispatchEvent(new Event('captchaExpired'));
            };
            window.handleCaptchaError = function() {
              window.dispatchEvent(new Event('captchaError'));
            };
          `,
        }}
      />
    </div>
  );
}

// Hook untuk mendengarkan event reCAPTCHA
export const useCaptchaEvents = () => {
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    const handleVerified = (e: CustomEvent) => {
      setVerified(true);
    };
    
    const handleExpired = () => {
      setVerified(false);
    };
    
    const handleError = () => {
      setVerified(false);
    };
    
    window.addEventListener('captchaVerified', handleVerified as EventListener);
    window.addEventListener('captchaExpired', handleExpired);
    window.addEventListener('captchaError', handleError);
    
    return () => {
      window.removeEventListener('captchaVerified', handleVerified as EventListener);
      window.removeEventListener('captchaExpired', handleExpired);
      window.removeEventListener('captchaError', handleError);
    };
  }, []);
  
  return verified;
};