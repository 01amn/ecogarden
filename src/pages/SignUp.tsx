import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import Navigation from "@/components/Navigation";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    state: "",
    organization: "",
    role: "",
    plantInterests: "",
    purpose: "",
    consent: false,
    ayushPreferences: {
      ayurveda: false,
      yoga: false,
      unani: false,
      siddha: false,
      homoeopathy: false,
      sowaRigpa: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia",
    "Germany", "France", "Japan", "China", "Brazil", "Other"
  ];

  const roles = [
    "Individual User",
    "Healthcare Professional",
    "Researcher",
    "Student",
    "Organization",
    "Other"
  ];

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^a-zA-Z0-9]/.test(password),
    };
    return requirements;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === "consent") {
        setFormData(prev => ({ ...prev, consent: checked }));
      } else if (name.startsWith("ayush_")) {
        const pref = name.replace("ayush_", "") as keyof typeof formData.ayushPreferences;
        setFormData(prev => ({
          ...prev,
          ayushPreferences: { ...prev.ayushPreferences, [pref]: checked }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === "password") {
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
      }
    }

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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const pwdReq = validatePassword(formData.password);
      if (!pwdReq.length) newErrors.password = "Password must be at least 8 characters";
      else if (!pwdReq.upper || !pwdReq.lower || !pwdReq.number || !pwdReq.symbol) {
        newErrors.password = "Password must contain uppercase, lowercase, number, and symbol";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (E.164 format)";
    }

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.consent) newErrors.consent = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Build JSON payload
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim() || undefined,
      country: formData.country,
      state: formData.state.trim() || undefined,
      organization: formData.organization.trim() || undefined,
      role: formData.role,
      plantInterests: formData.plantInterests.trim() || undefined,
      purpose: formData.purpose.trim() || undefined,
      ayushPreferences: Object.entries(formData.ayushPreferences)
        .filter(([_, value]) => value)
        .map(([key, _]) => key),
      consent: formData.consent,
    };

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      
      console.log("Signup payload:", payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to login page on success
      navigate("/login?signup=success");
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordReq = formData.password ? validatePassword(formData.password) : null;

  return (
    <div className="min-h-screen bg-gradient-garden">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-herbal">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-herbal p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
              <p className="text-muted-foreground">
                Join our herbal wellness community
              </p>
            </div>

            {/* Error Alert */}
            {errors.submit && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "border-destructive" : ""}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-sm text-destructive mt-1" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "border-destructive" : ""}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-sm text-destructive mt-1" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-destructive" : ""}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-destructive" : ""}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.phone}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">E.164 format (e.g., +1234567890)</p>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
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
                {formData.password && (
                  <div className="mt-2">
                    <Progress value={passwordStrength} className="h-2 mb-2" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${passwordReq?.length ? "text-green-600" : "text-muted-foreground"}`}>
                        {passwordReq?.length ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>8+ characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordReq?.upper ? "text-green-600" : "text-muted-foreground"}`}>
                        {passwordReq?.upper ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>Uppercase</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordReq?.lower ? "text-green-600" : "text-muted-foreground"}`}>
                        {passwordReq?.lower ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>Lowercase</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordReq?.number ? "text-green-600" : "text-muted-foreground"}`}>
                        {passwordReq?.number ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>Number</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordReq?.symbol ? "text-green-600" : "text-muted-foreground"}`}>
                        {passwordReq?.symbol ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>Symbol</span>
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Country & State */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.country ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? "country-error" : undefined}
                  >
                    <option value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.country && (
                    <p id="country-error" className="text-sm text-destructive mt-1" role="alert">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State/Region (Optional)</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Role & Organization */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.role ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? "role-error" : undefined}
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <p id="role-error" className="text-sm text-destructive mt-1" role="alert">
                      {errors.role}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="organization">Organization (Optional)</Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* AYUSH Preferences */}
              <div>
                <Label className="mb-3 block">AYUSH Preferences (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(formData.ayushPreferences).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ayush_${key}`}
                        name={`ayush_${key}`}
                        checked={value}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            ayushPreferences: { ...prev.ayushPreferences, [key]: checked as boolean }
                          }));
                        }}
                      />
                      <Label htmlFor={`ayush_${key}`} className="font-normal cursor-pointer capitalize">
                        {key === "yoga" ? "Yoga & Naturopathy" : key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plant Interests */}
              <div>
                <Label htmlFor="plantInterests">Plant Interests (Optional)</Label>
                <textarea
                  id="plantInterests"
                  name="plantInterests"
                  value={formData.plantInterests}
                  onChange={handleInputChange}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g., Tulsi, Ashwagandha, Turmeric..."
                />
              </div>

              {/* Purpose */}
              <div>
                <Label htmlFor="purpose">Purpose (Optional)</Label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Tell us why you're joining..."
                />
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ ...prev, consent: checked as boolean }));
                    if (errors.consent) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.consent;
                        return newErrors;
                      });
                    }
                  }}
                  className={errors.consent ? "border-destructive" : ""}
                  aria-invalid={!!errors.consent}
                />
                <Label htmlFor="consent" className="font-normal cursor-pointer">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
                  <span className="text-destructive">*</span>
                </Label>
              </div>
              {errors.consent && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.consent}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-herbal"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


