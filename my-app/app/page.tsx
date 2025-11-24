"use client";

import { useState } from "react";
import SuccessModal from "@/components/SuccessModal";

const ROLES = ["Product", "Design", "Marketing", "Tech", "Operations", "Other"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    linkedin: "",
    role: "",
    about: "",
    portfolio: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setSubmitStatus({
          type: "error",
          message: "Please upload a PDF file only.",
        });
        e.target.value = "";
        return;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setSubmitStatus({
          type: "error",
          message: "File size must be less than 10MB.",
        });
        e.target.value = "";
        return;
      }
      
      setSubmitStatus({ type: null, message: "" });
    }
    
    setFormData((prev) => ({ ...prev, portfolio: file }));
  };

  const handleRoleClick = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate role selection
    if (!formData.role) {
      setSubmitStatus({
        type: "error",
        message: "Please select a role you're applying for.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("about", formData.about);
      
      if (formData.portfolio) {
        formDataToSend.append("portfolio", formData.portfolio);
      }

      // Submit to API
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      // Show success modal
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        linkedin: "",
        role: "",
        about: "",
        portfolio: null,
      });

      // Clear file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1">
          <section className="py-20 md:py-32">
            <div className="px-4 mx-auto max-w-4xl text-center">
              <div className="flex flex-col gap-6 items-center">
                <div className="flex flex-col gap-4">
                  <h1 className="text-text-primary text-5xl font-black leading-tight tracking-tight md:text-7xl lowercase">
                    we are friends of humans.
                  </h1>
                  <h2 className="text-text-primary text-lg font-normal leading-normal max-w-2xl mx-auto md:text-xl">
                    We're building{" "}
                    <a
                      href="https://webyalaya.com"
                      className="text-primary font-semibold hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Webyalaya
                    </a>{" "}
                    — a peer-to-peer learning platform
                    <br />
                    where people can learn, share, and grow together.
                  </h2>
                </div>
                <p className="text-text-secondary text-lg md:text-xl pt-4">
                  Want to build this together? Join us.
                </p>
              </div>
            </div>
          </section>

          <section className="pb-20 md:pb-32">
            <div className="px-4 mx-auto max-w-2xl">
              <div className="bg-white border border-border-color/50 rounded-lg p-6 md:p-10 shadow-sm">
                <div className="flex flex-col gap-8">
                  <div className="text-center">
                    <h2 className="text-text-primary text-3xl font-bold leading-tight tracking-tight">
                      Join the Tribe
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex flex-col w-full">
                        <p className="text-text-primary text-base font-medium leading-normal pb-2">
                          Full Name
                        </p>
                        <input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary focus:outline-0 focus:ring-2 focus:ring-pastel-green border border-border-color bg-white h-14 placeholder:text-text-secondary p-[15px] text-base font-normal leading-normal transition-all duration-200"
                          placeholder="Your awesome name here"
                          type="text"
                          required
                        />
                      </label>

                      <label className="flex flex-col w-full">
                        <p className="text-text-primary text-base font-medium leading-normal pb-2">
                          Email
                        </p>
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary focus:outline-0 focus:ring-2 focus:ring-pastel-green border border-border-color bg-white h-14 placeholder:text-text-secondary p-[15px] text-base font-normal leading-normal transition-all duration-200"
                          placeholder="you@email.com"
                          type="email"
                          required
                        />
                      </label>

                      <label className="flex flex-col w-full">
                        <p className="text-text-primary text-base font-medium leading-normal pb-2">
                          Mobile Number
                        </p>
                        <input
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary focus:outline-0 focus:ring-2 focus:ring-pastel-green border border-border-color bg-white h-14 placeholder:text-text-secondary p-[15px] text-base font-normal leading-normal transition-all duration-200"
                          placeholder="Your contact number"
                          type="tel"
                          required
                        />
                      </label>

                      <label className="flex flex-col w-full">
                        <p className="text-text-primary text-base font-medium leading-normal pb-2">
                          LinkedIn Profile Link
                        </p>
                        <input
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary focus:outline-0 focus:ring-2 focus:ring-pastel-green border border-border-color bg-white h-14 placeholder:text-text-secondary p-[15px] text-base font-normal leading-normal transition-all duration-200"
                          placeholder="linkedin.com/in/yourprofile"
                          type="url"
                          required
                        />
                      </label>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-text-primary text-base font-medium leading-normal">
                        Role Applying For
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleClick(role)}
                            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium border border-border-color transition-colors duration-200 ${
                              formData.role === role
                                ? "bg-pastel-green text-text-primary"
                                : "bg-white text-text-primary hover:bg-pastel-green focus:bg-pastel-green focus:text-text-primary focus:outline-none"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex flex-col w-full">
                      <p className="text-text-primary text-base font-medium leading-normal pb-2">
                        Tell us about yourself
                      </p>
                      <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-primary focus:outline-0 focus:ring-2 focus:ring-pastel-green border border-border-color bg-white min-h-[120px] placeholder:text-text-secondary p-[15px] text-base font-normal leading-normal transition-all duration-200"
                        placeholder="A short paragraph about your passion and skills..."
                        required
                      />
                    </label>

                    <div className="flex flex-col w-full">
                      <p className="text-text-primary text-base font-medium leading-normal pb-2">
                        Upload Work Portfolio
                      </p>
                      <div className="relative flex items-center justify-center w-full h-32 px-4 py-3 border-2 border-dashed rounded-lg border-border-color bg-white/50 hover:bg-pastel-green/50 transition-colors duration-200">
                        {formData.portfolio ? (
                          <div className="text-center">
                            <span className="material-symbols-outlined text-4xl text-primary">
                              description
                            </span>
                            <p className="text-sm text-text-primary font-medium mt-2">
                              {formData.portfolio.name}
                            </p>
                            <p className="text-xs text-text-secondary/70">
                              {(formData.portfolio.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="material-symbols-outlined text-4xl text-text-secondary">
                              upload_file
                            </span>
                            <p className="text-sm text-text-secondary">
                              Drag & drop files here or{" "}
                              <span className="font-semibold text-primary/80">browse</span>
                            </p>
                            <p className="text-xs text-text-secondary/70">
                              PDF only, max 10MB
                            </p>
                          </div>
                        )}
                        <input
                          aria-label="Upload Work Portfolio"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          type="file"
                          accept=".pdf,application/pdf"
                        />
                      </div>
                    </div>

                    {submitStatus.type === "error" && (
                      <div className="p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                        <p className="text-sm font-medium">{submitStatus.message}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-text-primary text-base font-bold leading-normal tracking-wide transition-opacity duration-200 transform shadow-sm ${
                        isSubmitting
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:opacity-90 hover:scale-[1.02]"
                      }`}
                    >
                      <span>{isSubmitting ? "Submitting..." : "Let's Connect"}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />

        <footer className="py-10">
          <div className="px-4 mx-auto max-w-4xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-6 text-text-secondary">
                <a
                  className="flex items-center gap-2 hover:text-text-primary transition-colors"
                  href="mailto:namaste@webyalaya.com"
                >
                  <span className="material-symbols-outlined text-xl">mail</span>
                  <span className="text-sm">namaste@webyalaya.com</span>
                </a>
                <a
                  className="flex items-center gap-2 hover:text-text-primary transition-colors"
                  href="tel:+919891247897"
                >
                  <span className="material-symbols-outlined text-xl">call</span>
                  <span className="text-sm">+91 98912 47897</span>
                </a>
              </div>
              <p className="text-text-secondary text-sm">
                Made with ❤️ by Humans, for Humans.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
