import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from '../components/Navbar';
import Footer from "@/components/Footer";
import DownloadAppSection from "@/components/AppSection";

/* ── Google Fonts: Poppins ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const signUpSchema = signInSchema.extend({
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

/* ── Colour tokens ── */
const C = {
  cobalt: "#1f3fc3",
  cobaltDeep: "#162d9a",   // used for gradient depth
  cobaltLight: "#3a57d4",   // hover / sweep
  cream: "#efeed7",
  creamDark: "#e2e0c0",
  white: "#ffffff",
  dark: "#0f1a4a",   // near-navy dark bg for card
  darkMid: "#162040",   // shape fill
  error: "#f87171",
};

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

  /* ── shared input class ── */
  const inputCls =
    "w-full h-full !bg-transparent border-0 border-b-2 rounded-none outline-none font-semibold pr-6 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 peer " +
    "border-cobalt-500 text-cream-200 focus:border-cobalt-300 " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:#efeed7] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#0f1a4a_inset]";

  const labelCls =
    "absolute left-0 transition-all z-20 " +
    "top-[-6px] translate-y-0 text-xs text-cobalt-300 " +
    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-cream-200/70 " +
    "peer-focus:top-[-6px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-cobalt-300 " +
    "peer-[&:-webkit-autofill]:top-[-6px] peer-[&:-webkit-autofill]:translate-y-0 peer-[&:-webkit-autofill]:text-xs peer-[&:-webkit-autofill]:text-cobalt-300";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: C.cream,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Navbar />
      <br />

      {/* ── Floating user review cards behind login/signup ── */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {/* Infinite scrolling animated background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            animate={{ y: [0, 2000] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          >
            {[1, 2].flatMap((batch) =>
              [
                { user: "Alice M.", role: "Software Engineer", rating: 5, text: "Found my dream job in exactly a week! Highly recommended.", yStart: 100, left: "2%" },
                { user: "David K.", role: "Product Manager", rating: 4, text: "The cross-platform syncing is absolutely brilliant.", yStart: 400, left: "26%" },
                { user: "Lucy J.", role: "Data Scientist", rating: 5, text: "CareerSync's AI suggestions were incredibly spot on.", yStart: 200, left: "50%" },
                { user: "Michael T.", role: "Frontend Dev", rating: 4, text: "Tracking applications has never been this seamless.", yStart: 500, left: "74%" },
                { user: "Elena R.", role: "UX Designer", rating: 5, text: "Beautiful interface and extremely effective feature set!", yStart: 700, left: "2%" },
                { user: "James W.", role: "Backend Engineer", rating: 4, text: "Saved me countless hours of manual job searching.", yStart: 1000, left: "26%" },
                { user: "Mayur C.", role: "Software Engineer", rating: 5, text: "Found my dream job in exactly a week! Highly recommended.", yStart: 800, left: "50%" },
                { user: "Digvijay I.", role: "Product Manager", rating: 4, text: "The cross-platform syncing is absolutely brilliant.", yStart: 1100, left: "74%" },
                { user: "Sarah J.", role: "Data Scientist", rating: 5, text: "CareerSync's AI suggestions were incredibly spot on.", yStart: 1300, left: "2%" },
                { user: "Soham H.", role: "Frontend Dev", rating: 4, text: "Tracking applications has never been this seamless.", yStart: 1600, left: "26%" },
                { user: "Kiran D.", role: "UX Designer", rating: 5, text: "Beautiful interface and extremely effective feature set!", yStart: 1400, left: "50%" },
                { user: "Kane H.", role: "Backend Engineer", rating: 4, text: "Saved me countless hours of manual job searching.", yStart: 1700, left: "74%" },
              ].map((card, idx) => (
                <div
                  key={`${batch}-${idx}`}
                  className="absolute backdrop-blur-sm rounded-lg px-5 py-4 w-72"
                  style={{
                    top: batch === 1 ? card.yStart : card.yStart - 2000,
                    left: card.left,
                    background: "rgba(31, 63, 195, 0.06)",
                    border: "1px solid rgba(31, 63, 195, 0.15)",
                    boxShadow: "0 8px 32px rgba(15, 26, 74, 0.05)",
                    opacity: 0.85,
                  }}
                >
                  <p className="text-sm font-bold mb-1">
                    <span style={{ color: C.cobaltDeep }}>{card.user}</span>
                  </p>
                  <p className="text-xs italic mb-2" style={{ color: C.cobaltLight }}>
                    <span>{card.role}</span>
                  </p>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, starIndex) => (
                      <span key={starIndex} style={{ color: starIndex < card.rating ? "#FFD700" : "#555555" }}>
                        &#9733; {/* Unicode star */}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-snug">
                    <span style={{ color: C.darkMid }}>"{card.text}"</span>
                  </p>
                </div>
              ))
            )}
          </motion.div>
        </div>

        {/* ── Full-page centred rotation card ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8rem 1.5rem 4rem 1.5rem",
          }}
        >
          {/* Card shell — same dimensions as original 800×500 module */}
          <div
            style={{
              position: "relative",
              width: "800px",
              maxWidth: "100%",
              height: "500px",
              background: C.dark,
              border: `2px solid ${C.cobalt}`,
              boxShadow: `0 0 40px ${C.cobalt}55, 0 0 80px ${C.cobalt}22`,
              overflow: "hidden",
              borderRadius: "16px",
            }}
          >
            {/* ── Rotating shape 1 (top-right, cobalt gradient) ── */}
            <div
              style={{
                position: "absolute",
                top: "-5px",
                right: "2px",
                width: "900px",
                height: "650px",
                background: `linear-gradient(135deg, ${C.dark} 0%, ${C.cobalt} 60%, ${C.cobaltLight} 100%)`,
                transformOrigin: "bottom right",
                transition: "transform 1.5s cubic-bezier(.77,0,.18,1)",
                transform: isRegister
                  ? "rotate(0deg) skewY(0deg)"
                  : "rotate(10deg) skewY(40deg)",
                transitionDelay: isRegister ? "0.5s" : "1.6s",
                zIndex: 1,
              }}
            />

            {/* ── Rotating shape 2 (bottom-left, dark with cobalt border) ── */}
            <div
              style={{
                position: "absolute",
                left: "260px",
                top: "100%",
                width: "900px",
                height: "750px",
                background: C.darkMid,
                borderTop: `3px solid ${C.cobalt}`,
                transformOrigin: "bottom left",
                transition: "transform 1.5s cubic-bezier(.77,0,.18,1)",
                transform: isRegister
                  ? "rotate(-11deg) skewY(-41deg)"
                  : "rotate(0deg) skewY(0deg)",
                transitionDelay: isRegister ? "1.2s" : "0.5s",
                zIndex: 1,
              }}
            />

            {/* ══════════════════════════════════════════
               SIGN-IN FORM  (left half)
          ══════════════════════════════════════════ */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                height: "100%",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 3rem",
                transition: "transform 0.7s ease, opacity 0.7s ease",
                transform: isRegister ? "translateX(-120%)" : "translateX(0)",
                opacity: isRegister ? 0 : 1,
                pointerEvents: isRegister ? "none" : "auto",
              }}
            >
              <h2
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: C.cream,
                  textAlign: "center",
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Sign In
              </h2>

              <form onSubmit={onSignIn} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {/* Email */}
                <div style={{ position: "relative", width: "100%", height: "50px" }}>
                  <Input
                    id="si-email"
                    type="email"
                    placeholder=" "
                    {...signInForm.register("email")}
                    className={inputCls}
                    style={{ borderBottomColor: C.cobalt }}
                  />
                  <Label htmlFor="si-email" className={labelCls}>Email</Label>
                  {signInForm.formState.errors.email && (
                    <p style={{ color: C.error, fontSize: "0.7rem", marginTop: "2px" }}>
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div style={{ position: "relative", width: "100%", height: "50px" }}>
                  <Input
                    id="si-password"
                    type="password"
                    placeholder=" "
                    {...signInForm.register("password")}
                    className={inputCls}
                    style={{ borderBottomColor: C.cobalt }}
                  />
                  <Label htmlFor="si-password" className={labelCls}>Password</Label>
                  {signInForm.formState.errors.password && (
                    <p style={{ color: C.error, fontSize: "0.7rem", marginTop: "2px" }}>
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={signInForm.formState.isSubmitting}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "44px",
                    border: `2px solid ${C.cobalt}`,
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    color: C.cream,
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "inherit",
                  }}
                  className="group"
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "-100%",
                      left: 0,
                      width: "100%",
                      height: "300%",
                      background: `linear-gradient(to bottom, ${C.dark}, ${C.cobalt}, ${C.dark})`,
                      transition: "top 0.5s ease",
                    }}
                    className="group-hover:!top-0"
                  />
                  <span style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "6px" }}>
                    {signInForm.formState.isSubmitting && <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />}
                    Sign In
                  </span>
                </button>

                <p style={{ fontSize: "0.8rem", textAlign: "center", color: `${C.cream}99` }}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    style={{ color: C.cobaltLight, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
                  >
                    Create Account
                  </button>
                </p>
              </form>
            </div>

            {/* ══════════════════════════════════════════
               SIGN-IN INFO  (right half)
          ══════════════════════════════════════════ */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50%",
                height: "100%",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 3rem",
                transition: "transform 0.7s ease, opacity 0.7s ease",
                transform: isRegister ? "translateX(120%)" : "translateX(0)",
                opacity: isRegister ? 0 : 1,
                pointerEvents: isRegister ? "none" : "auto",
              }}
            >
              {/* Logo mark */}
              <div
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 14,
                  backgroundImage: `url(/src/assets/CSLogo1.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "-3.5rem",
                  marginRight: "-4rem",
                  marginBottom: "1rem",
                  // boxShadow: `0 4px 20px ${C.cobalt}66`,
                }}
              >
                {/* <BarChart2 style={{ color: C.cream, width: 28, height: 28 }} /> */}
              </div>

              {/* <span style={{ fontSize: "1.2rem", fontWeight: 700, color: C.cream, marginBottom: "0.2rem" }}>
              Career<span style={{ color: C.cream }}>Sync</span>
            </span> */}

              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.white,
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginTop: "1rem",
                  marginBottom: "0.5rem",
                  marginRight: "-4rem",
                  letterSpacing: "0.04em",
                }}
              >
                Welcome Back!
              </h2>
              <p style={{ color: `${C.cream}99`, fontSize: "0.82rem", marginRight: "-4rem", textAlign: "center", lineHeight: 1.6 }}>
                Your career journey continues <br />find jobs tailored for you.
              </p>
            </div>

            {/* ══════════════════════════════════════════
               SIGN-UP FORM  (right half)
          ══════════════════════════════════════════ */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50%",
                height: "100%",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 3rem",
                transition: "transform 0.7s ease, opacity 0.7s ease",
                transform: isRegister ? "translateX(0)" : "translateX(120%)",
                opacity: isRegister ? 1 : 0,
                pointerEvents: isRegister ? "auto" : "none",
              }}
            >
              <h2
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: C.cream,
                  textAlign: "center",
                  marginBottom: "1.2rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Create Account
              </h2>

              <form onSubmit={onSignUp} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {/* Email */}
                <div style={{ position: "relative", width: "100%", height: "50px" }}>
                  <Input
                    id="su-email"
                    type="email"
                    placeholder=" "
                    {...signUpForm.register("email")}
                    className={inputCls}
                    style={{ borderBottomColor: C.cobalt }}
                  />
                  <Label htmlFor="su-email" className={labelCls}>Email</Label>
                  {signUpForm.formState.errors.email && (
                    <p style={{ color: C.error, fontSize: "0.7rem", marginTop: "2px" }}>
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                {/* Password */}
                <div style={{ position: "relative", width: "100%", height: "50px" }}>
                  <Input
                    id="su-password"
                    type="password"
                    placeholder=" "
                    {...signUpForm.register("password")}
                    className={inputCls}
                    style={{ borderBottomColor: C.cobalt }}
                  />
                  <Label htmlFor="su-password" className={labelCls}>
                    Password
                  </Label>
                  {signUpForm.formState.errors.password && (
                    <p style={{ color: C.error, fontSize: "0.7rem", marginTop: "2px" }}>
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ position: "relative", width: "100%", height: "50px" }}>
                  <Input
                    id="su-confirm"
                    type="password"
                    placeholder=" "
                    {...signUpForm.register("confirmPassword")}
                    className={inputCls}
                    style={{ borderBottomColor: C.cobalt }}
                  />
                  <Label htmlFor="su-confirm" className={labelCls}>
                    Confirm Password
                  </Label>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p style={{ color: C.error, fontSize: "0.7rem", marginTop: "2px" }}>
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={signUpForm.formState.isSubmitting}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "44px",
                    border: `2px solid ${C.cobalt}`,
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    color: C.cream,
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "inherit",
                  }}
                  className="group"
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "-100%",
                      left: 0,
                      width: "100%",
                      height: "300%",
                      background: `linear-gradient(to bottom, ${C.dark}, ${C.cobalt}, ${C.dark})`,
                      transition: "top 0.5s ease",
                    }}
                    className="group-hover:!top-0"
                  />
                  <span style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "6px" }}>
                    {signUpForm.formState.isSubmitting && <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />}
                    Create Account
                  </span>
                </button>

                <p style={{ fontSize: "0.8rem", textAlign: "center", color: `${C.cream}99` }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    style={{ color: C.cobaltLight, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>

            {/* ══════════════════════════════════════════
               SIGN-UP INFO  (left half)
          ══════════════════════════════════════════ */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                height: "100%",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 3rem",
                transition: "transform 0.7s ease, opacity 0.7s ease",
                transform: isRegister ? "translateX(0)" : "translateX(-120%)",
                opacity: isRegister ? 1 : 0,
                pointerEvents: isRegister ? "auto" : "none",
              }}
            >
              {/* Logo mark */}
              <div
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 14,
                  backgroundImage: `url(/src/assets/CSLogo1.png)`, // your logo path
                  backgroundSize: "cover", // ensures the image fits the div
                  backgroundPosition: "center", // centers the image
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  marginTop: "-6.5rem",      // shifts upward
                  marginLeft: "-4rem",     // shifts left slightly
                  display: "flex",         // needed for flex alignment if you want content inside
                  // boxShadow: `0 4px 20px ${C.cobalt}66`,
                }}
              />

              {/* <span style={{ fontSize: "1.2rem", fontWeight: 700, color: C.cream, marginBottom: "0.2rem" }}>
              Career<span style={{ color: C.cream }}>Sync</span>
            </span> */}

              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.white,
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginTop: "0.15rem",
                  marginLeft: "-4rem",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.04em",
                }}
              >
                Welcome!
              </h2>
              <p style={{ color: `${C.cream}99`, fontSize: "0.82rem", marginLeft: "-4rem", textAlign: "center", lineHeight: 1.6 }}>
                Start your job search journey <br />your next opportunity awaits.
              </p>
            </div>

          </div>{/* end card */}
        </div>{/* end centred wrapper */}

        <div className="relative z-10 w-full mt-auto">
          <br />
          <br />
          <DownloadAppSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}