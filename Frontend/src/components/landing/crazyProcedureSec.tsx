import { motion } from "framer-motion";
import { Activity, CheckCircle2 } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Create Profile",
        desc: "Add resume & details for AI analysis.",
        icon: "/src/assets/UserProfileCreation.png",
    },
    {
        id: 2,
        title: "AI Analysis",
        desc: "AI suggests best-fit jobs instantly.",
        icon: "/src/assets/AIModel.png",
    },
    {
        id: 3,
        title: "Discover Jobs",
        desc: "Explore curated opportunities easily.",
        icon: "activity",
    },
    {
        id: 4,
        title: "Apply & Track",
        desc: "Apply and monitor progress.",
        icon: "check",
    },
];

export default function UltimateFlow() {
    return (
        <div className="relative py-16 overflow-hidden max-w-6xl mx-auto px-4 md:px-0">

            {/* CENTRAL DASHED TIMELINE (Desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0 -translate-x-1/2 z-0 border-l-[3px] border-dashed border-cobalt-400 opacity-40"></div>

            <div className="space-y-12 md:space-y-24 relative z-10 w-full">
                {steps.map((step, i) => {
                    const isLeft = i % 2 === 0;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="flex flex-col md:flex-row items-center justify-between w-full relative"
                        >

                            {/* LEFT SIDE */}
                            <div className={`w-full md:w-5/12 flex justify-center md:justify-end ${!isLeft ? 'hidden md:flex md:invisible' : ''} mb-8 md:mb-0`}>
                                <GlassCard step={step} align="left" />
                            </div>

                            {/* CENTER NODE */}
                            <div className="hidden md:flex w-2/12 relative z-20 items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-cobalt-600 border-[3px] border-white flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                </div>
                            </div>

                            {/* RIGHT SIDE */}
                            <div className={`w-full md:w-5/12 flex justify-center md:justify-start ${isLeft ? 'hidden md:flex md:invisible' : ''}`}>
                                <GlassCard step={step} align="right" />
                            </div>

                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* 🔥 ENHANCED CARD */
function GlassCard({ step, align }: { step: any, align: string }) {
    return (
        <div className="relative w-full max-w-[320px] md:max-w-[400px] group">

            {/* NUMBER BADGE */}
            <div
                className={`absolute -top-4 w-10 h-10 ${align === "left"
                    ? "md:-right-5 md:left-auto left-4"
                    : "md:-left-5 md:right-auto right-4"
                    } bg-cobalt-600 rounded-full flex items-center justify-center text-white font-bold shadow-md z-20 border-2 border-white transition-transform group-hover:scale-110`}
            >
                {step.id}
            </div>

            {/* CARD */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-2xl shadow-xl shadow-cobalt-900/5 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/40 transition-all duration-300 relative z-10 w-full">

                {/* ICON */}
                <div className={`flex ${align === "left" ? "md:justify-end justify-center" : "md:justify-start justify-center"} mb-6`}>
                    <div className="w-16 h-16 rounded-2xl bg-cobalt-50 text-cobalt-500 flex items-center justify-center shadow-inner">
                        {step.icon === "activity" ? (
                            <Activity className="h-8 w-8" />
                        ) : step.icon === "check" ? (
                            <CheckCircle2 className="h-8 w-8" />
                        ) : (
                            <img
                                src={step.icon}
                                className="h-10 w-10 object-contain drop-shadow-sm"
                            />
                        )}
                    </div>
                </div>

                {/* TITLE */}
                <h3 className={`text-xl font-bold text-cobalt-900 mb-3 ${align === "left" ? "md:text-right text-center" : "md:text-left text-center"}`}>
                    {step.title}
                </h3>

                {/* DESC */}
                <p className={`text-[15px] text-cobalt-700/80 leading-relaxed ${align === "left" ? "md:text-right text-center" : "md:text-left text-center"}`}>
                    {step.desc}
                </p>
            </div>
        </div>
    );
}