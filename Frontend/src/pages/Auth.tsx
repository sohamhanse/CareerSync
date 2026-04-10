import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import logo from "../assets/CSLogo1.png";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const signUpSchema = signInSchema
  .extend({ confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

const inputCls =
  "w-full h-full !bg-transparent border-0 border-b-2 rounded-none outline-none font-semibold pr-6 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 peer border-cobalt-500 text-cream-200 focus:border-cobalt-300 [&:-webkit-autofill]:[-webkit-text-fill-color:#efeed7] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#0f1a4a_inset]";

const labelCls =
  "absolute left-0 transition-all z-20 top-[-6px] translate-y-0 text-xs text-cobalt-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-cream-200/70 peer-focus:top-[-6px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-cobalt-300 peer-[&:-webkit-autofill]:top-[-6px] peer-[&:-webkit-autofill]:translate-y-0 peer-[&:-webkit-autofill]:text-xs peer-[&:-webkit-autofill]:text-cobalt-300";

const reviewCards = [
  { user: "Alice M.", role: "Software Engineer", rating: 5, text: "Found my dream job in exactly a week! Highly recommended.", top: 100, left: "2%" },
  { user: "David K.", role: "Product Manager", rating: 4, text: "The cross-platform syncing is absolutely brilliant.", top: 400, left: "26%" },
  { user: "Lucy J.", role: "Data Scientist", rating: 5, text: "CareerSync's AI suggestions were incredibly spot on.", top: 200, left: "50%" },
  { user: "Michael T.", role: "Frontend Dev", rating: 4, text: "Tracking applications has never been this seamless.", top: 500, left: "74%" },
  { user: "Elena R.", role: "UX Designer", rating: 5, text: "Beautiful interface and extremely effective feature set!", top: 700, left: "2%" },
  { user: "James W.", role: "Backend Engineer", rating: 4, text: "Saved me countless hours of manual job searching.", top: 1000, left: "26%" },
  { user: "Mayur C.", role: "Software Engineer", rating: 5, text: "Found my dream job in exactly a week!", top: 800, left: "50%" },
  { user: "Digvijay I.", role: "Product Manager", rating: 4, text: "The cross-platform syncing is absolutely brilliant.", top: 1100, left: "74%" },
  { user: "Sarah J.", role: "Data Scientist", rating: 5, text: "CareerSync's AI suggestions were spot on.", top: 1300, left: "2%" },
  { user: "Soham H.", role: "Frontend Dev", rating: 4, text: "Tracking applications has never been this seamless.", top: 1600, left: "26%" },
  { user: "Kiran D.", role: "UX Designer", rating: 5, text: "Beautiful interface and effective feature set!", top: 1400, left: "50%" },
  { user: "Kane H.", role: "Backend Engineer", rating: 4, text: "Saved me countless hours of manual job searching.", top: 1700, left: "74%" },
];

export default function Auth() {
  const { isAuthenticated, signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const signInForm = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });
  const signUpForm = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  if (isAuthenticated) return <Navigate to="/profile" replace />;

  const onSignIn = signInForm.handleSubmit(async ({ email, password }) => {
    await signIn(email, password);
  });

  const onSignUp = signUpForm.handleSubmit(async ({ email, password }) => {
    await signUp(email, password);
  });

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />

      <div className="relative flex-1 overflow-hidden">
        {/* Floating review cards background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, 2000] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          >
            {[1, 2].flatMap((batch) =>
              reviewCards.map((card, idx) => (
                <div
                  key={`${batch}-${idx}`}
                  className="absolute backdrop-blur-sm rounded-lg px-5 py-4 w-72 bg-cobalt-500/[0.06] border border-cobalt-500/15 shadow-glass opacity-85"
                  style={{ top: batch === 1 ? card.top : card.top - 2000, left: card.left }}
                >
                  <p className="text-sm font-bold text-cobalt-800 mb-1">{card.user}</p>
                  <p className="text-xs italic text-cobalt-400 mb-2">{card.role}</p>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < card.rating ? "text-yellow-400" : "text-gray-300"}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-cobalt-700 leading-snug">"{card.text}"</p>
                </div>
              ))
            )}
          </motion.div>
        </div>

        {/* Centered auth card */}
        <div className="flex-1 flex items-center justify-center pt-32 pb-16 px-6">
          <div
            className="relative w-full max-w-[800px] h-[500px] rounded-2xl overflow-hidden border-2 border-cobalt-500"
            style={{
              background: "#0f1a4a",
              boxShadow: "0 0 40px rgba(31,63,195,0.33), 0 0 80px rgba(31,63,195,0.13)",
            }}
          >
            {/* Rotating shape 1 */}
            <div
              className="absolute -top-[5px] right-[2px] w-[900px] h-[650px] origin-bottom-right z-[1]"
              style={{
                background: "linear-gradient(135deg, #0f1a4a 0%, #1f3fc3 60%, #3a57d4 100%)",
                transition: "transform 1.5s cubic-bezier(.77,0,.18,1)",
                transform: isRegister ? "rotate(0deg) skewY(0deg)" : "rotate(10deg) skewY(40deg)",
                transitionDelay: isRegister ? "0.5s" : "1.6s",
              }}
            />

            {/* Rotating shape 2 */}
            <div
              className="absolute left-[260px] top-full w-[900px] h-[750px] origin-bottom-left z-[1] border-t-[3px] border-cobalt-500"
              style={{
                background: "#162040",
                transition: "transform 1.5s cubic-bezier(.77,0,.18,1)",
                transform: isRegister ? "rotate(-11deg) skewY(-41deg)" : "rotate(0deg) skewY(0deg)",
                transitionDelay: isRegister ? "1.2s" : "0.5s",
              }}
            />

            {/* === SIGN IN FORM (left) === */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 z-10 flex flex-col justify-center px-8 md:px-12 transition-all duration-700"
              style={{
                transform: isRegister ? "translateX(-120%)" : "translateX(0)",
                opacity: isRegister ? 0 : 1,
                pointerEvents: isRegister ? "none" : "auto",
              }}
            >
              <h2 className="text-2xl font-bold text-cream-200 text-center mb-6 tracking-tight">Sign In</h2>

              <form onSubmit={onSignIn} className="flex flex-col gap-5">
                <div className="relative w-full h-[50px]">
                  <Input id="si-email" type="email" placeholder=" " {...signInForm.register("email")} className={inputCls} />
                  <Label htmlFor="si-email" className={labelCls}>Email</Label>
                  {signInForm.formState.errors.email && <p className="text-red-400 text-xs mt-0.5">{signInForm.formState.errors.email.message}</p>}
                </div>

                <div className="relative w-full h-[50px]">
                  <Input id="si-password" type="password" placeholder=" " {...signInForm.register("password")} className={inputCls} />
                  <Label htmlFor="si-password" className={labelCls}>Password</Label>
                  {signInForm.formState.errors.password && <p className="text-red-400 text-xs mt-0.5">{signInForm.formState.errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={signInForm.formState.isSubmitting}
                  className="relative w-full h-11 border-2 border-cobalt-500 rounded-full font-semibold text-sm text-cream-200 bg-transparent cursor-pointer overflow-hidden group disabled:opacity-50"
                >
                  <span className="absolute top-[-100%] left-0 w-full h-[300%] bg-gradient-to-b from-[#0f1a4a] via-cobalt-500 to-[#0f1a4a] transition-all duration-500 group-hover:top-0" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {signInForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sign In
                  </span>
                </button>

                <p className="text-sm text-center text-cream-200/60">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setIsRegister(true)} className="text-cobalt-300 font-semibold underline bg-transparent border-none cursor-pointer">
                    Create Account
                  </button>
                </p>
              </form>
            </div>

            {/* === SIGN IN INFO (right) === */}
            <div
              className="absolute inset-y-0 right-0 w-1/2 z-10 flex flex-col items-center justify-center px-8 md:px-12 transition-all duration-700"
              style={{
                transform: isRegister ? "translateX(120%)" : "translateX(0)",
                opacity: isRegister ? 0 : 1,
                pointerEvents: isRegister ? "none" : "auto",
              }}
            >
              <img src={logo} alt="CareerSync" className="w-28 h-28 rounded-xl object-contain mb-4 -mt-8 -mr-16" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wide text-center mt-2 mb-2 -mr-16">Welcome Back!</h2>
              <p className="text-cream-200/60 text-sm text-center leading-relaxed -mr-16">
                Your career journey continues<br />find jobs tailored for you.
              </p>
            </div>

            {/* === SIGN UP FORM (right) === */}
            <div
              className="absolute inset-y-0 right-0 w-1/2 z-10 flex flex-col justify-center px-8 md:px-12 transition-all duration-700"
              style={{
                transform: isRegister ? "translateX(0)" : "translateX(120%)",
                opacity: isRegister ? 1 : 0,
                pointerEvents: isRegister ? "auto" : "none",
              }}
            >
              <h2 className="text-2xl font-bold text-cream-200 text-center mb-5 tracking-tight">Create Account</h2>

              <form onSubmit={onSignUp} className="flex flex-col gap-4">
                <div className="relative w-full h-[50px]">
                  <Input id="su-email" type="email" placeholder=" " {...signUpForm.register("email")} className={inputCls} />
                  <Label htmlFor="su-email" className={labelCls}>Email</Label>
                  {signUpForm.formState.errors.email && <p className="text-red-400 text-xs mt-0.5">{signUpForm.formState.errors.email.message}</p>}
                </div>

                <div className="relative w-full h-[50px]">
                  <Input id="su-password" type="password" placeholder=" " {...signUpForm.register("password")} className={inputCls} />
                  <Label htmlFor="su-password" className={labelCls}>Password</Label>
                  {signUpForm.formState.errors.password && <p className="text-red-400 text-xs mt-0.5">{signUpForm.formState.errors.password.message}</p>}
                </div>

                <div className="relative w-full h-[50px]">
                  <Input id="su-confirm" type="password" placeholder=" " {...signUpForm.register("confirmPassword")} className={inputCls} />
                  <Label htmlFor="su-confirm" className={labelCls}>Confirm Password</Label>
                  {signUpForm.formState.errors.confirmPassword && <p className="text-red-400 text-xs mt-0.5">{signUpForm.formState.errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={signUpForm.formState.isSubmitting}
                  className="relative w-full h-11 border-2 border-cobalt-500 rounded-full font-semibold text-sm text-cream-200 bg-transparent cursor-pointer overflow-hidden group disabled:opacity-50"
                >
                  <span className="absolute top-[-100%] left-0 w-full h-[300%] bg-gradient-to-b from-[#0f1a4a] via-cobalt-500 to-[#0f1a4a] transition-all duration-500 group-hover:top-0" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {signUpForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Account
                  </span>
                </button>

                <p className="text-sm text-center text-cream-200/60">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setIsRegister(false)} className="text-cobalt-300 font-semibold underline bg-transparent border-none cursor-pointer">
                    Sign In
                  </button>
                </p>
              </form>
            </div>

            {/* === SIGN UP INFO (left) === */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 z-10 flex flex-col items-center justify-center px-8 md:px-12 transition-all duration-700"
              style={{
                transform: isRegister ? "translateX(0)" : "translateX(-120%)",
                opacity: isRegister ? 1 : 0,
                pointerEvents: isRegister ? "auto" : "none",
              }}
            >
              <img src={logo} alt="CareerSync" className="w-28 h-28 rounded-xl object-contain mb-4 -mt-16 -ml-16" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wide text-center mt-1 mb-2 -ml-16">Welcome!</h2>
              <p className="text-cream-200/60 text-sm text-center leading-relaxed -ml-16">
                Start your job search journey<br />your next opportunity awaits.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
