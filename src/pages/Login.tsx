import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Added toast
import { login, ensureCSRFToken, checkScannerAccess } from "@/services/api"; // Added API imports

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook for redirection

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- UPDATED LOGIC ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get a fresh CSRF token before attempting login
      await ensureCSRFToken();

      // 2. Call the Frappe login method
      const loginSuccess = await login(form.email, form.password);

      if (loginSuccess) {
        // 3. Check if the user has staff permissions
        const isStaff = await checkScannerAccess();
        
        toast.success("Welcome back!");

        // 4. Redirect based on role
        if (isStaff) {
          navigate("/verify"); // Go to scanner if staff
        } else {
          navigate("/"); // Go to home if customer
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle Frappe error messages
      const errorMsg = error.response?.data?.message || "Invalid email or password";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  // ---------------------

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&fit=crop')",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* FLOATING BLOBS */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 h-96 w-96 bg-orange-500/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-120px] right-[-120px] h-96 w-96 bg-amber-400/30 rounded-full blur-3xl"
      />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-2xl 
                   bg-white/90 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 rounded-2xl ring-1 ring-orange-500/20 pointer-events-none" />

        {/* LOADER */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-white/90 rounded-2xl flex flex-col items-center justify-center"
            >
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-2 border-orange-200" />
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="absolute inset-0 flex items-start justify-center"
                >
                  <span className="h-3 w-3 rounded-full bg-orange-500" />
                </motion.span>
              </div>
              <p className="mt-4 text-sm font-semibold text-orange-600">
                Authenticating...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-500 font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 transition-all"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-orange-600 hover:text-orange-500"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;