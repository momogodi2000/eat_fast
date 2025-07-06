// Verify2FACode.jsx
import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Mail,
  ChevronRight,
  ArrowLeft,
  RotateCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { userContextInformation } from "./const_provider";
import { CAMEROON_COLORS } from "./const";

export default function Verify2FACode({ userId, contactMethod, onResendCode }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uiState, setUiState] = useState({
    darkMode: false,
    language: "fr",
    focusedField: "",
    mousePosition: { x: 0, y: 0 },
  });

  const navigate = useNavigate();
  const { userInformation } = useContext(userContextInformation);

  // Initialize dark mode from system preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setUiState((prev) => ({ ...prev, darkMode: darkModeQuery.matches }));

    const handleChange = (e) => {
      setUiState((prev) => ({ ...prev, darkMode: e.matches }));
    };

    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setUiState((prev) => ({
        ...prev,
        mousePosition: {
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        },
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleFocus = (fieldName) => {
    setUiState((prev) => ({ ...prev, focusedField: fieldName }));
  };

  const handleBlur = () => {
    setUiState((prev) => ({ ...prev, focusedField: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setError("");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);

      // Simulate navigation after success
      setTimeout(() => {
        if (userInformation?.user_type === "client") {
          navigate("/client/dashboard");
        } else {
          alert(
            "Inscription réussie ! Vos documents sont en cours de vérification."
          );
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    onResendCode();
    setError("");
    // Show temporary success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const inputFocusVariants = {
    focus: {
      scale: 1.02,
      boxShadow: `0 0 20px ${CAMEROON_COLORS.green}40`,
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0px rgba(0,0,0,0)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        uiState.darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white"
          : "bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 text-gray-900"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="w-full max-w-md relative"
            variants={itemVariants}
          >
            {/* 3D Card Effect Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-3xl blur-xl opacity-20"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className={`relative p-8 rounded-3xl shadow-2xl backdrop-blur-xl border ${
                uiState.darkMode
                  ? "bg-gray-800/90 border-gray-700/50"
                  : "bg-white/90 border-white/50"
              } transform-gpu`}
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateY(${
                  uiState.mousePosition.x * -1
                }deg) rotateX(${uiState.mousePosition.y * 1}deg)`,
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              {/* Header */}
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <motion.button
                  onClick={handleBack}
                  className="absolute left-6 top-6 p-2 rounded-full hover:bg-gray-700/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft size={20} className="text-emerald-500" />
                </motion.button>

                <motion.div
                  className="inline-flex items-center space-x-2 mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                    Vérification en 2 étapes
                  </h1>
                </motion.div>
                <p
                  className={
                    uiState.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Entrez le code de vérification envoyé à{" "}
                  <span className="font-semibold text-emerald-500">
                    {contactMethod}
                  </span>
                </p>
              </motion.div>

              {/* Status Messages */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center"
                  >
                    <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm">
                      Code envoyé avec succès !
                    </span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl flex items-center"
                  >
                    <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verification Form */}
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      uiState.darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Code de vérification
                  </label>
                  <motion.div
                    className="relative"
                    variants={inputFocusVariants}
                    animate={uiState.focusedField === "code" ? "focus" : "blur"}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {/* {contactMethod.includes("@") ? (
                        <Mail
                          size={18}
                          className={`${
                            uiState.focusedField === "code"
                              ? "text-emerald-500"
                              : uiState.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          } transition-colors`}
                        />
                      ) : ( */}

                      <Smartphone
                        size={18}
                        className={`${
                          uiState.focusedField === "code"
                            ? "text-emerald-500"
                            : uiState.darkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        } transition-colors`}
                      />
                    </div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      onFocus={() => handleFocus("code")}
                      onBlur={handleBlur}
                      className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                        uiState.darkMode
                          ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                          : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                      }`}
                      placeholder="123456"
                      maxLength={6}
                    />
                  </motion.div>
                </motion.div>

                {/* Submit button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isLoading || code.length !== 6
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105"
                  } text-white`}
                  disabled={isLoading || code.length !== 6}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  variants={itemVariants}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Vérification...</span>
                    </>
                  ) : (
                    <>
                      <span>Vérifier</span>
                      <ChevronRight size={20} />
                    </>
                  )}
                </motion.button>

                {/* Resend code */}
                <motion.div
                  className="flex justify-center"
                  variants={itemVariants}
                >
                  <motion.button
                    type="button"
                    onClick={handleResendCode}
                    className={`flex items-center space-x-2 ${
                      uiState.darkMode
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-emerald-600 hover:text-emerald-700"
                    } transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    <RotateCw size={16} />
                    <span className="text-sm font-medium">
                      Renvoyer le code
                    </span>
                  </motion.button>
                </motion.div>

                {/* Info message */}
                <motion.div
                  className={`text-center text-sm ${
                    uiState.darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  variants={itemVariants}
                >
                  <p>Le code de vérification est valide pendant 10 minutes.</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
