import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Eye, EyeOff, Mail, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      toast({
        title: "Account created successfully!",
        description: "Please log in with your credentials.",
      });
    }
  }, [searchParams, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: formData.email.trim().toLowerCase(),
      //     password: formData.password,
      //   }),
      // });
      
      console.log("Login attempt:", { email: formData.email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to dashboard on success
      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: "Invalid email or password. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      setErrors({ forgotPassword: "Email is required" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      setErrors({ forgotPassword: "Please enter a valid email address" });
      return;
    }

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: forgotPasswordEmail.trim().toLowerCase() }),
      // });
      
      console.log("Forgot password request:", { email: forgotPasswordEmail });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setForgotPasswordSent(true);
      setErrors({});
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
    } catch (error) {
      setErrors({ forgotPassword: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-garden">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-herbal">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-herbal p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {showForgotPassword ? "Reset Password" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground">
                {showForgotPassword 
                  ? "Enter your email to receive a password reset link"
                  : "Sign in to your account to continue"}
              </p>
            </div>

            {/* Error Alert */}
            {errors.submit && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {!showForgotPassword ? (
              // Login Form
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-destructive pl-10" : "pl-10"}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="password">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                      placeholder="Enter your password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-sm text-destructive mt-1" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-herbal"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            ) : (
              // Forgot Password Form
              <form onSubmit={handleForgotPassword} className="space-y-6">
                {forgotPasswordSent ? (
                  <div className="text-center space-y-4">
                    <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Email Sent!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We've sent a password reset link to <strong>{forgotPasswordEmail}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Please check your inbox and follow the instructions to reset your password.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordEmail("");
                        setForgotPasswordSent(false);
                      }}
                    >
                      Back to Login
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="forgotPasswordEmail">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="forgotPasswordEmail"
                          name="forgotPasswordEmail"
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) => {
                            setForgotPasswordEmail(e.target.value);
                            if (errors.forgotPassword) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.forgotPassword;
                                return newErrors;
                              });
                            }
                          }}
                          className={errors.forgotPassword ? "border-destructive pl-10" : "pl-10"}
                          placeholder="you@example.com"
                          aria-invalid={!!errors.forgotPassword}
                          aria-describedby={errors.forgotPassword ? "forgotPassword-error" : undefined}
                        />
                      </div>
                      {errors.forgotPassword && (
                        <p id="forgotPassword-error" className="text-sm text-destructive mt-1" role="alert">
                          {errors.forgotPassword}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-herbal"
                    >
                      Send Reset Link
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordEmail("");
                        setErrors({});
                      }}
                    >
                      Back to Login
                    </Button>
                  </>
                )}
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;


