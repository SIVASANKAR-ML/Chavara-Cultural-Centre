import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempted:", form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://www.timesindiatravels.com/wp-content/uploads/2017/09/Discover-Kerala-Tour.jpg')", // 🎨 Cultural arts theme
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-red-900">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* Forgot password link */}
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-red-800 hover:text-red-600 transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold"
          >
            Sign In
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-red-800 hover:text-red-600 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
