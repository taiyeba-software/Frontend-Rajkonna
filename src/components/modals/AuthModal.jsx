import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";
import { X } from "lucide-react";

/**
 * AuthModal
 * - Single global modal that shows login OR register based on modalType from ModalContext
 */
export default function AuthModal() {
  const { modalType, closeModal, openModal } = useContext(ModalContext);
  const { login, register } = useContext(AuthContext);

  // Local form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  // Reset form whenever modal type changes (open/register or open/login)
  useEffect(() => {
    setForm({ name: "", email: "", password: "" });
    setError("");
    setIsSubmitting(false);
  }, [modalType]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (modalType) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalType, closeModal]);

  // If modalType is null -> don't render
  if (!modalType) return null;

  // Basic client-side validation helpers
  const isValidEmail = (value) =>
    !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isValidPassword = (value) => !!value && value.length >= 6;
  const isValidName = (value) => !!value && value.trim().length >= 2;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleOverlayClick = (e) => {
    // close only when clicked on backdrop, not inside dialog
    if (e.target === e.currentTarget) closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidPassword(form.password)) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (modalType === "register" && !isValidName(form.name)) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalType === "login") {
        // login(email, password) is implemented in AuthContext
        await login(form.email.trim(), form.password);
      } else {
        // register(name, email, password)
        await register(form.name.trim(), form.email.trim(), form.password);
      }
      // On success AuthContext already shows toast; close modal
      closeModal();
    } catch (err) {
      // AuthContext throws and already uses toasts, but show local message too
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchLink = (type) => {
    // Switch modal view: open new type (this resets form via useEffect above)
    openModal(type);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 clip-card bg-background/95 border border-border p-6 rounded-2xl shadow-2xl animate-fade-in font-mplus"
        style={{ backdropFilter: "blur(6px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-edu text-amber-400">
            {modalType === "login" ? "Welcome Back" : "Create your account"}
          </h3>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="rounded-md text-gray-300 hover:text-amber-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 text-sm text-red-400 bg-red-900/10 border border-red-900/10 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalType === "register" && (
            <div>
              <label className="block text-sm text-foreground/80 mb-1">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card1 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                disabled={isSubmitting}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-foreground/80 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border border-border bg-card1 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              disabled={isSubmitting}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/80 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-border bg-card1 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              disabled={isSubmitting}
              autoComplete={modalType === "login" ? "current-password" : "new-password"}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cosmic-button py-2 rounded-full text-sm font-semibold"
          >
            {isSubmitting ? "Processing..." : modalType === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-4 text-center text-sm text-foreground/80">
          {modalType === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => handleSwitchLink("register")}
                className="text-amber-400 hover:text-amber-300 font-medium"
                disabled={isSubmitting}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => handleSwitchLink("login")}
                className="text-amber-400 hover:text-amber-300 font-medium"
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
