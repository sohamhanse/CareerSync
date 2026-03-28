import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { FaGooglePlay, FaApple } from "react-icons/fa";

export default function DownloadAppSection() {
    return (
        <div className="w-full py-20 px-6 md:px-16 bg-gradient-to-br from-cobalt-900 via-cobalt-800 to-cobalt-900 text-white overflow-hidden">

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">

                {/* LEFT SECTION */}
                <div className="md:w-1/2 space-y-6 text-center md:text-left border-r border-cream-200/40 pr-12">

                    <h2 className="text-3xl md:text-4xl font-bold leading-tight text-cream-200">
                        Get Career<span className="text-cobalt-300">Sync</span> on your phone
                    </h2>

                    <h4 className="text-3xl md:text-3xl font-bold leading-tight text-cream-200">
                        Download the App!
                    </h4>

                    <p className="text-cobalt-100/70 text-lg">
                        Discover jobs, track applications, and get AI-powered recommendations anytime, anywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 mt-4 justify-center md:justify-start">

                        {/* ⭐ Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-lg">⭐</span>
                            <span className="text-white font-semibold">4.7</span>
                            <span className="text-cobalt-200/70 text-sm">7L+ reviews</span>
                        </div>

                        {/* ⬇ Downloads */}
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-lg">⬇</span>
                            <span className="text-white font-semibold">2Cr+</span>
                            <span className="text-cobalt-200/70 text-sm">app downloads</span>
                        </div>

                    </div>

                    {/* STORE BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

                        {/* Play Store */}
                        <button className="flex items-center gap-3 bg-white/10 border border-white/20 px-5 py-3 rounded-lg">
                            <FaGooglePlay className="text-xl" />
                            <div>
                                <p className="text-xs">Get it on</p>
                                <p className="text-sm font-semibold">Google Play</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 bg-white/10 border border-white/20 px-5 py-3 rounded-lg">
                            <FaApple className="text-xl" />
                            <div>
                                <p className="text-xs">Download on the</p>
                                <p className="text-sm font-semibold">App Store</p>
                            </div>
                        </button>

                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="md:w-1/2 flex justify-center relative">

                    {/* Glow background */}
                    <div className="absolute w-64 h-64 bg-cobalt-500/30 blur-3xl rounded-full"></div>

                    {/* PHONE IMAGE */}
                    <motion.img
                        src="/src/assets/PhoneUi.png"
                        alt="App UI"
                        className="relative z-10 w-[360px] md:w-[420px] object-contain drop-shadow-2xl"
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    />

                </div>

            </div>
        </div>
    );
}