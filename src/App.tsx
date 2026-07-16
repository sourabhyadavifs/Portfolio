import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Github,
  FileText,
  Award,
  Briefcase,
  Package,
  Folder,
  Trophy,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Mail,
  Upload,
  Trash2,
  TrendingUp,
  Leaf,
  GraduationCap
} from "lucide-react";

import {
  SELECTED_WORK,
  MORE_PROJECTS,
  EXPERIENCE_HISTORY,
  RECOGNITIONS,
  Project,
  ZOMATO_PROJECT_DATA,
  SLIKK_PROJECT_DATA,
  WISPR_FLOW_PROJECT_DATA,
  LINKEDIN_AUTOMATION_PROJECT_DATA,
  HOMESTAY_ASSISTANT_PROJECT_DATA,
  CREDITPLANNER_PROJECT_DATA
} from "./data";

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Secure portfolio: check if current user is the owner (via secret query parameter or saved owner session)
  const [isOwner] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("edit") || urlParams.has("admin") || urlParams.has("owner")) {
        localStorage.setItem("is_portfolio_owner", "true");
        return true;
      }
      return localStorage.getItem("is_portfolio_owner") === "true";
    }
    return false;
  });

  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [customProfile, setCustomProfile] = useState<string | null>(() => {
    return localStorage.getItem("sourabh_custom_profile");
  });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync theme with document class list
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Scroll spy to update active section in header
  useEffect(() => {
    if (currentProject) return;

    const handleScroll = () => {
      const sections = ["hero", "story", "work", "experience", "recognition", "contact"];
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentProject]);

  // Show a temporary toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize custom profile image from localStorage to the server if needed
  useEffect(() => {
    if (customProfile && isOwner) {
      fetch("/api/upload-profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-portfolio-owner": "true"
        },
        body: JSON.stringify({ image: customProfile })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Profile image synchronized to the server.");
        }
      })
      .catch(err => {
        console.error("Failed to sync profile image to server:", err);
      });
    }
  }, [customProfile, isOwner]);

  // Profile image upload handler
  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) {
      showToast("Access denied: Only the portfolio owner can upload files.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Please select an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      if (base64String) {
        localStorage.setItem("sourabh_custom_profile", base64String);
        setCustomProfile(base64String);
        
        // Upload immediately to the server
        fetch("/api/upload-profile", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-portfolio-owner": "true"
          },
          body: JSON.stringify({ image: base64String })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showToast("Profile image updated across all devices!");
          } else {
            showToast("Profile image updated locally.");
          }
        })
        .catch(err => {
          console.error("Error uploading profile image:", err);
          showToast("Profile image updated locally.");
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Clear uploaded profile photo and revert to default
  const handleClearProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOwner) {
      showToast("Access denied: Only the portfolio owner can clear the profile.");
      return;
    }
    localStorage.removeItem("sourabh_custom_profile");
    setCustomProfile(null);
    showToast("Reverted to default editorial avatar.");
  };

  // Trigger file selection
  const triggerFileSelect = () => {
    if (!isOwner) return;
    fileInputRef.current?.click();
  };

  // Navigation click handler
  const handleNavClick = (sectionId: string) => {
    // Release focus from the active button back to the webpage
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Always close the mobile menu immediately so the user gets instant feedback
    setIsMenuOpen(false);

    const scrollWithOffset = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        const headerHeight = 64; // Height of the sticky navigation bar (h-16 is 64px)
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    };

    if (currentProject !== null) {
      setCurrentProject(null);
      // Wait for project detail exit transition to complete before scrolling
      setTimeout(() => {
        scrollWithOffset(sectionId);
      }, 350);
    } else {
      // If the mobile menu was open, wait for the menu closing transition
      // to complete before smooth scrolling, to prevent the animation from interrupting the scroll.
      if (isMenuOpen) {
        setTimeout(() => {
          scrollWithOffset(sectionId);
        }, 250);
      } else {
        scrollWithOffset(sectionId);
      }
    }
  };

  // Fallback default professional portrait of a South Asian product leader
  const defaultProfileUrl = "/assets/profile.png";

  // Selected project object lookup
  const activeProjectData = [...SELECTED_WORK, ZOMATO_PROJECT_DATA, SLIKK_PROJECT_DATA, WISPR_FLOW_PROJECT_DATA, LINKEDIN_AUTOMATION_PROJECT_DATA, HOMESTAY_ASSISTANT_PROJECT_DATA, CREDITPLANNER_PROJECT_DATA].find((p) => p.id === currentProject);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? "bg-[#0A0A0A] text-[#F5F5F7]" : "bg-[#FAF9F6] text-[#1C1C1E]"}`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-55 px-4 py-2.5 rounded-full text-xs font-medium shadow-lg border backdrop-blur-md ${
              isDark 
                ? "bg-white/10 text-[#F5F5F7] border-white/10" 
                : "bg-black/5 text-stone-900 border-stone-200"
            }`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0A]/80 border-white/5" : "bg-[#FAF9F6]/80 border-black/5"
      }`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            id="nav-logo"
            onClick={() => {
              setCurrentProject(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-display font-semibold tracking-tight text-base cursor-pointer hover:opacity-80 transition-opacity uppercase tracking-[0.1em]"
          >
            Sourabh Yadav
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: "story", label: "My Story" },
              { id: "work", label: "Selected Work" },
              { id: "experience", label: "Experience" },
              { id: "recognition", label: "Recognition" },
              { id: "contact", label: "Contact" }
            ].map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-[0.1em] transition-all relative cursor-pointer ${
                  activeSection === item.id && !currentProject
                    ? isDark ? "text-white" : "text-stone-900"
                    : isDark ? "text-[#86868B] hover:text-white" : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {item.label}
                {activeSection === item.id && !currentProject && (
                  <motion.span
                    layoutId="activeNavBackground"
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isDark ? "bg-white/5 border border-white/10" : "bg-stone-150"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Icons (Theme + Mobile Trigger) */}
          <div className="flex items-center space-x-2">
            
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle"
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark 
                  ? "border-white/10 hover:bg-white/5 text-[#86868B] hover:text-white" 
                  : "border-black/5 hover:bg-black/5 text-stone-500 hover:text-stone-900"
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full border md:hidden transition-colors cursor-pointer ${
                isDark 
                  ? "border-white/10 hover:bg-white/5 text-[#86868B] hover:text-white" 
                  : "border-black/5 hover:bg-black/5 text-stone-500 hover:text-stone-900"
              }`}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-16 left-0 right-0 z-45 border-b md:hidden backdrop-blur-lg overflow-hidden ${
              isDark ? "bg-[#0A0A0A]/95 border-white/5" : "bg-[#FAF9F6]/95 border-black/5"
            }`}
          >
            <div className="px-6 py-8 flex flex-col space-y-4">
              {[
                { id: "story", label: "My Story" },
                { id: "work", label: "Selected Work" },
                { id: "experience", label: "Experience" },
                { id: "recognition", label: "Recognition" },
                { id: "contact", label: "Contact" }
              ].map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-sm uppercase tracking-wider font-semibold py-2 transition-colors cursor-pointer ${
                    activeSection === item.id 
                      ? isDark ? "text-white" : "text-stone-900" 
                      : isDark ? "text-[#86868B]" : "text-stone-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Main Content Area */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {!currentProject ? (
            
            /* HOME VIEW */
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto px-6 md:px-8 py-16 space-y-24 md:space-y-36"
            >
              
              {/* SECTION 1: HERO */}
              <section id="hero" className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center pt-8">
                
                {/* Profile Image Column */}
                <div className="md:col-span-5 flex justify-center">
                  <div 
                    id="profile-image-container"
                    onClick={isOwner ? triggerFileSelect : undefined}
                    className={`relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden group border transition-all duration-500 hover:shadow-xl ${
                      isOwner ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"
                    } ${
                      isDark ? "border-white/10 bg-white/5" : "border-stone-200 bg-stone-100"
                    }`}
                    title={isOwner ? "Click to upload your own profile photo" : undefined}
                  >
                    <img
                      src={defaultProfileUrl}
                      alt="Sourabh Yadav"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700"
                    />

                    {/* Dark overlay with instructions on hover */}
                    {isOwner && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                        <Upload className="w-6 h-6 mb-2 stroke-[1.5]" />
                        <span className="text-xs font-semibold tracking-wide">Upload Custom Photo</span>
                        <span className="text-[10px] text-zinc-300 mt-1 max-w-[180px]">Accepts JPG, PNG. Replaces default avatar.</span>
                      </div>
                    )}

                    {/* Quick clear button */}
                    {isOwner && customProfile && (
                      <button
                        id="clear-profile-button"
                        onClick={handleClearProfile}
                        className="absolute bottom-3 right-3 p-1.5 rounded-full bg-red-600/95 hover:bg-red-700 text-white shadow-md z-10 transition-colors"
                        title="Revert to default profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Badge */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest font-mono font-semibold ${
                      isDark ? "bg-black/70 text-[#D1D1D6] border border-white/10" : "bg-white/90 text-stone-600 border border-stone-200"
                    }`}>
                      Product Builder
                    </div>
                  </div>
                </div>

                {/* Hero Information Column */}
                <div className="md:col-span-7 space-y-6 text-left">
                  <div className="space-y-2">
                    <span className="font-sans text-xs md:text-sm text-amber-600 dark:text-[#86868B] dark:font-semibold dark:uppercase dark:tracking-widest font-medium block">
                      Hi, I'm Sourabh.
                    </span>
                    <h1 id="hero-headline" className="font-display font-semibold tracking-tight text-3xl sm:text-4xl md:text-[44px] leading-[1.15]">
                      Building products where <span className={isDark ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#86868B]" : "text-stone-900"}>user behavior, data, and AI intersect.</span>
                    </h1>
                  </div>

                  <p id="hero-intro" className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                    I’m passionate about understanding user behavior, solving meaningful problems, and turning insights into products people genuinely want to use.
                    <br /><br />
                    Currently pursuing Product Management at the Institute of Product Leadership while building my skills through hands-on projects, product thinking, and continuous learning.
                  </p>

                  {/* Actions Row */}
                  <div id="hero-actions" className="flex flex-wrap gap-3 items-center pt-2">
                    
                    <button
                      id="view-work-button"
                      onClick={() => handleNavClick("work")}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-1.5 transition-all duration-300 cursor-pointer ${
                        isDark 
                          ? "bg-white text-black hover:bg-gray-200" 
                          : "bg-stone-900 text-white hover:bg-stone-800"
                      }`}
                    >
                      <span>View Work</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                    </button>

                    <a
                      id="resume-button-hero"
                      href="https://drive.google.com/file/d/12jzIo5FZTYcfvuxM7bIRsAI4LWf3uAI0/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 flex items-center space-x-1.5 ${
                        isDark 
                          ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" 
                          : "border-stone-200 hover:bg-stone-100 text-stone-600"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </a>

                    <a
                      id="linkedin-button-hero"
                      href="https://www.linkedin.com/in/sou-y/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 flex items-center space-x-1.5 ${
                        isDark 
                          ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" 
                          : "border-stone-200 hover:bg-stone-100 text-stone-600"
                      }`}
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>

                  </div>
                </div>
              </section>

              {/* SECTION 1.5: PROFESSIONAL METRICS */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="w-full pt-10 border-t border-dashed border-stone-200 dark:border-white/5 !mt-12 md:!mt-16"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 text-center">
                  {/* Years Experience */}
                  <div className="flex flex-col items-center justify-center px-4 border-none md:border-r md:border-stone-200/60 md:dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-1 justify-center">
                      <Briefcase className="w-4 h-4 text-stone-400 dark:text-[#86868B] shrink-0 stroke-[1.5]" />
                      <span className="font-display font-bold text-2xl sm:text-3xl text-stone-900 dark:text-white leading-none">
                        2+
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-[#86868B] leading-snug">
                      Years Experience
                    </span>
                  </div>

                  {/* Products Delivered */}
                  <div className="flex flex-col items-center justify-center px-4 border-none md:border-r md:border-stone-200/60 md:dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-1 justify-center">
                      <Package className="w-4 h-4 text-stone-400 dark:text-[#86868B] shrink-0 stroke-[1.5]" />
                      <span className="font-display font-bold text-2xl sm:text-3xl text-stone-900 dark:text-white leading-none">
                        5
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-[#86868B] leading-snug">
                      Products Delivered
                    </span>
                  </div>

                  {/* PM Case Studies */}
                  <div className="flex flex-col items-center justify-center px-4 border-none md:border-r md:border-stone-200/60 md:dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-1 justify-center">
                      <Folder className="w-4 h-4 text-stone-400 dark:text-[#86868B] shrink-0 stroke-[1.5]" />
                      <span className="font-display font-bold text-2xl sm:text-3xl text-stone-900 dark:text-white leading-none">
                        4
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-[#86868B] leading-snug">
                      PM Case Studies
                    </span>
                  </div>

                  {/* Product Competition Wins */}
                  <div className="flex flex-col items-center justify-center px-4 border-none">
                    <div className="flex items-center space-x-2 mb-1 justify-center">
                      <Trophy className="w-4 h-4 text-stone-400 dark:text-[#86868B] shrink-0 stroke-[1.5]" />
                      <span className="font-display font-bold text-2xl sm:text-3xl text-stone-900 dark:text-white leading-none">
                        3
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-[#86868B] leading-snug">
                      Product Competition Wins
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* SECTION 2: MY STORY */}
              <section id="story" className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-dashed border-stone-200 dark:border-white/5">
                <div className="md:col-span-4">
                  <div className="sticky top-24 space-y-1">
                    <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-stone-400 dark:text-[#86868B]">
                      Background
                    </span>
                    <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight uppercase tracking-wider">
                      Why Product Management
                    </h2>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-6 text-left">
                  <div className={`font-serif text-lg italic md:text-xl font-medium tracking-tight border-l-2 pl-4 py-1 leading-normal ${
                    isDark ? "border-white/10 text-[#D1D1D6]" : "border-stone-200 text-stone-700"
                  }`}>
                    Digital Marketing &rarr; Accenture &rarr; Product Management
                  </div>

                  <p id="story-p1" className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                    My career started in digital marketing, where I became fascinated by a simple question:
                    <br /><br />
                    <em>Why do people behave differently even when they interact with the same product?</em>
                    <br /><br />
                    At Accenture, I worked with global brands, analyzed campaign performance, and learned how customer behavior, experimentation, and data influence business outcomes.
                  </p>

                  <p id="story-p2" className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                    Over time, I became more interested in the product decisions behind those outcomes than the marketing campaigns themselves.
                    <br /><br />
                    That curiosity led me to Product Management.
                    <br /><br />
                    Today, I spend my time researching user problems, building product ideas, and exploring how AI, analytics, and behavioral insights can create better user experiences.
                  </p>
                </div>
              </section>

              {/* SECTION 3: SELECTED WORK */}
              <section id="work" className="space-y-10 pt-4 border-t border-dashed border-stone-200 dark:border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-stone-400 dark:text-[#86868B]">
                      01 / Featured Projects
                    </span>
                    <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight uppercase tracking-wider">
                      Selected Work
                    </h2>
                  </div>
                  <span className={`text-xs ${isDark ? "text-[#86868B]" : "text-stone-400"}`}>
                    Click to view immersive PRD & design details
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SELECTED_WORK.map((proj) => (
                    <div
                      key={proj.id}
                      id={`project-card-${proj.id}`}
                      onClick={() => setCurrentProject(proj.id)}
                      className={`group rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01] flex flex-col h-full ${
                        isDark 
                          ? "border-white/10 bg-white/5 hover:border-white/20" 
                          : "border-stone-200 bg-[#FCFBFB] hover:bg-white"
                      }`}
                    >
                      {/* Project Image */}
                      <div className="aspect-[4/3] w-full overflow-hidden relative border-b border-stone-200/50 dark:border-white/5">
                        <img
                          src={proj.coverImage}
                          alt={proj.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
                          }}
                        />
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-black/60 text-white border border-white/10 backdrop-blur-sm">
                          {proj.id === "creditplanner" && "Fintech Product Strategy"}
                          {proj.id === "netro" && "Digital Networking Platform"}
                          {proj.id === "airesumebuilder" && "AI Product"}
                          {proj.id === "aivoicereceptionist" && "AI VOICE AGENT"}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex-grow flex flex-col justify-between text-left">
                        <div className="space-y-2">
                          <h3 className="font-display font-bold text-lg group-hover:text-amber-600 dark:group-hover:text-white transition-colors">
                            {proj.name}
                          </h3>
                          <p className={`text-xs sm:text-[13px] leading-relaxed ${
                            proj.id === "aivoicereceptionist" ? "" : "line-clamp-3"
                          } ${
                            isDark ? "text-[#86868B]" : "text-stone-500"
                          }`}>
                            {proj.tagline}
                          </p>
                        </div>

                        <div className="pt-4 flex items-center space-x-1 text-xs font-semibold text-amber-600 dark:text-[#F5F5F7]">
                          <span className="uppercase tracking-widest text-[10px] group-hover:underline underline-offset-4">View Project</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 2.1: AI LAB */}
              <section id="ai-lab" className="space-y-6 pt-4 border-t border-dashed border-stone-200 dark:border-white/5">
                <div className="space-y-1 text-left">
                  <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-stone-400 dark:text-[#86868B]">
                    02 / AI LAB
                  </span>
                  <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight uppercase tracking-wider">
                    AI LAB
                  </h2>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-500"} max-w-3xl`}>
                    AI products, automations, and intelligent workflow solutions built using LLMs, conversational AI, automation platforms, and no-code tools.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MORE_PROJECTS.filter(p => p.id === "homestay-assistant" || p.id === "linkedin-automation")
                    .sort((a, b) => {
                      const order = ["homestay-assistant", "linkedin-automation"];
                      return order.indexOf(a.id) - order.indexOf(b.id);
                    })
                    .map((proj) => (
                      <div
                        key={proj.id}
                        id={`more-project-${proj.id}`}
                        onClick={() => {
                          if (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") {
                            setCurrentProject(proj.id);
                            window.scrollTo({ top: 0 });
                          }
                        }}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-4 hover:border-white/20 transition-all duration-300 ${
                          (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") ? "cursor-pointer hover:shadow-lg hover:scale-[1.01]" : ""
                        } ${
                          isDark 
                            ? "bg-white/5 border-white/10" 
                            : "bg-stone-50/50 border-stone-200/80 hover:border-stone-300"
                        }`}
                      >
                        <div className="space-y-2">
                          <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${
                            isDark ? "text-[#86868B]" : "text-stone-400"
                          }`}>
                            {proj.category}
                          </span>
                          <h3 className={`font-display font-bold text-xs tracking-tight ${
                            (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") ? "group-hover:text-amber-600 dark:group-hover:text-white transition-colors" : ""
                          }`}>
                            {proj.name}
                          </h3>
                        </div>
                        
                        <div className="space-y-3 flex-grow flex flex-col justify-between">
                          <p className={`text-[11px] leading-normal ${
                            isDark ? "text-[#86868B]" : "text-stone-500"
                          }`}>
                            {proj.description}
                          </p>
   
                          {proj.links && proj.links.length > 0 && (
                            <div className="pt-2.5 border-t border-stone-200/50 dark:border-white/5 flex flex-wrap gap-x-2 gap-y-1">
                              {proj.links.map((link, lIdx) => {
                                const isInteractiveCaseStudy = (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") && link.type === "Case Study";
                                if (isInteractiveCaseStudy) {
                                  return (
                                    <button
                                      key={lIdx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentProject(proj.id);
                                        window.scrollTo({ top: 0 });
                                      }}
                                      className={`text-[9px] font-bold flex items-center space-x-0.5 uppercase tracking-wider transition-colors cursor-pointer text-left ${
                                        isDark 
                                          ? "text-stone-300 hover:text-white" 
                                          : "text-amber-700 hover:text-amber-900"
                                      }`}
                                    >
                                      <span>{link.title}</span>
                                    </button>
                                  );
                                }
                                return (
                                  <a
                                    key={lIdx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-[9px] font-bold flex items-center space-x-0.5 uppercase tracking-wider transition-colors ${
                                      isDark 
                                        ? "text-stone-300 hover:text-white" 
                                        : "text-amber-700 hover:text-amber-900"
                                    }`}
                                  >
                                    <span>{link.title}</span>
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {/* SECTION 4: EXPERIENCE */}
              <section id="experience" className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-dashed border-stone-200 dark:border-white/5">
                <div className="md:col-span-4">
                  <div className="sticky top-24 space-y-1">
                    <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-stone-400 dark:text-[#86868B]">
                      02 / Professional
                    </span>
                    <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight uppercase tracking-wider">
                      Experience
                    </h2>
                    <p className={`text-xs ${isDark ? "text-[#86868B]" : "text-stone-400"} mt-2 max-w-[200px]`}>
                      Consolidating digital strategy with core analytics frameworks.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-12 text-left">
                  {EXPERIENCE_HISTORY.map((exp, idx) => (
                    <div key={idx} id={`experience-item-${idx}`} className="relative pl-6 border-l border-stone-200 dark:border-white/5 space-y-3 group">
                      
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                        isDark 
                          ? "bg-white/10 group-hover:bg-white" 
                          : "bg-stone-200 group-hover:bg-amber-600"
                      }`} />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h3 className="font-display font-bold text-base sm:text-lg">
                            {exp.company}
                          </h3>
                          <span className="font-mono text-[11px] font-semibold text-stone-400 dark:text-[#86868B] bg-stone-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                            {exp.period}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 dark:text-[#86868B]">
                          <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-white" />
                          <span className="dark:text-white">{exp.role}</span>
                          <span className="text-stone-300 dark:text-white/20">&bull;</span>
                          <span className={`font-normal ${isDark ? "text-[#86868B]" : "text-stone-400"}`}>{exp.location}</span>
                        </div>

                        {exp.description && (
                          <p className={`text-xs sm:text-[13px] leading-relaxed pt-1.5 ${
                            isDark ? "text-[#86868B]" : "text-stone-600"
                          }`}>
                            {exp.description}
                          </p>
                        )}
                      </div>

                      <ul className="space-y-2 pt-1">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className={`text-xs sm:text-[13px] leading-relaxed flex items-start space-x-2 ${
                            isDark ? "text-[#86868B]" : "text-stone-500"
                          }`}>
                            <span className="text-amber-600 dark:text-[#86868B] select-none mt-1.5">&bull;</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {exp.focusAreas && exp.focusAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.focusAreas.map((area, aIdx) => (
                            <span
                              key={aIdx}
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                                isDark
                                  ? "bg-white/5 text-stone-300 border border-white/5"
                                  : "bg-stone-100 text-stone-650 border border-stone-200/50"
                              }`}
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 5: RECOGNITION */}
              <section id="recognition" className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-dashed border-stone-200 dark:border-white/5">
                <div className="md:col-span-4">
                  <div className="sticky top-24 space-y-1">
                    <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-stone-400 dark:text-[#86868B]">
                      03 / Awards
                    </span>
                    <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight uppercase tracking-wider">
                      Recognition
                    </h2>
                    <p className={`text-xs ${isDark ? "text-[#86868B]" : "text-stone-400"} mt-2 max-w-[200px]`}>
                      Validating product excellence and strategic solutions in challenges.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {RECOGNITIONS.map((rec, idx) => (
                    <div
                      key={idx}
                      id={`recognition-card-${idx}`}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 hover:border-white/20 transition-all ${
                        isDark 
                          ? "bg-white/5 border-white/10" 
                          : "bg-[#FCFBFB] border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className={`p-2 w-fit rounded-lg ${isDark ? "bg-white/5 text-white" : "bg-stone-100 text-amber-600"}`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <h3 className="font-display font-bold text-sm tracking-tight pt-1">
                          {rec.title}
                        </h3>
                        <p className={`text-[10px] font-mono tracking-wide uppercase font-semibold ${
                          isDark ? "text-[#86868B]" : "text-stone-500"
                        }`}>
                          {rec.award}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <p className={`text-xs leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-500"}`}>
                          {rec.description}
                        </p>

                        {rec.certificateUrl && (
                          <div>
                            <a
                              href={rec.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center space-x-1.5 text-[10px] font-mono tracking-wider uppercase font-bold transition-all px-3 py-1 rounded-full border ${
                                isDark
                                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                                  : "bg-stone-100 border-stone-200 hover:bg-stone-200 text-stone-700"
                              }`}
                            >
                              <span>View LinkedIn Post</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>              {/* SECTION 6: ADDITIONAL CASE STUDIES */}
              <section id="more-projects" className="space-y-6 pt-4 border-t border-dashed border-stone-200 dark:border-white/5">
                <div className="space-y-1 text-left">
                  <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-stone-400 dark:text-[#86868B]">
                    04 / Exploration Index
                  </span>
                  <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight uppercase tracking-wider">
                    Additional Case Studies
                  </h2>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-500"} max-w-3xl`}>
                    Product strategy, UX research, product audits, and business case studies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {MORE_PROJECTS.filter(p => p.id === "creditplanner" || p.id === "zomato" || p.id === "slikk" || p.id === "wispr-flow")
                    .sort((a, b) => {
                      const order = ["creditplanner", "zomato", "slikk", "wispr-flow"];
                      return order.indexOf(a.id) - order.indexOf(b.id);
                    })
                    .map((proj) => (
                      <div
                        key={proj.id}
                        id={`more-project-${proj.id}`}
                        onClick={() => {
                          if (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") {
                            setCurrentProject(proj.id);
                            window.scrollTo({ top: 0 });
                          }
                        }}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-4 hover:border-white/20 transition-all duration-300 ${
                          (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") ? "cursor-pointer hover:shadow-lg hover:scale-[1.01]" : ""
                        } ${
                          isDark 
                            ? "bg-white/5 border-white/10" 
                            : "bg-stone-50/50 border-stone-200/80 hover:border-stone-300"
                        }`}
                      >
                        <div className="space-y-2">
                          <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${
                            isDark ? "text-[#86868B]" : "text-stone-400"
                          }`}>
                            {proj.category}
                          </span>
                          <h3 className={`font-display font-bold text-xs tracking-tight ${
                            (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") ? "group-hover:text-amber-600 dark:group-hover:text-white transition-colors" : ""
                          }`}>
                            {proj.name}
                          </h3>
                        </div>
                        
                        <div className="space-y-3 flex-grow flex flex-col justify-between">
                          <p className={`text-[11px] leading-normal ${
                            isDark ? "text-[#86868B]" : "text-stone-500"
                          }`}>
                            {proj.description}
                          </p>
   
                          {proj.links && proj.links.length > 0 && (
                            <div className="pt-2.5 border-t border-stone-200/50 dark:border-white/5 flex flex-wrap gap-x-2 gap-y-1">
                              {proj.links.map((link, lIdx) => {
                                const isInteractiveCaseStudy = (proj.id === "zomato" || proj.id === "slikk" || proj.id === "wispr-flow" || proj.id === "linkedin-automation" || proj.id === "homestay-assistant" || proj.id === "creditplanner") && link.type === "Case Study";
                                if (isInteractiveCaseStudy) {
                                  return (
                                    <button
                                      key={lIdx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentProject(proj.id);
                                        window.scrollTo({ top: 0 });
                                      }}
                                      className={`text-[9px] font-bold flex items-center space-x-0.5 uppercase tracking-wider transition-colors cursor-pointer text-left ${
                                        isDark 
                                          ? "text-stone-300 hover:text-white" 
                                          : "text-amber-700 hover:text-amber-900"
                                      }`}
                                    >
                                      <span>{link.title}</span>
                                    </button>
                                  );
                                }
                                return (
                                  <a
                                    key={lIdx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-[9px] font-bold flex items-center space-x-0.5 uppercase tracking-wider transition-colors ${
                                      isDark 
                                        ? "text-stone-300 hover:text-white" 
                                        : "text-amber-700 hover:text-amber-900"
                                    }`}
                                  >
                                    <span>{link.title}</span>
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {/* SECTION 7: CONTACT / FOOTER */}
              <section id="contact" className={`p-8 md:p-12 rounded-2xl border text-center space-y-8 relative overflow-hidden ${
                isDark 
                  ? "bg-[#0A0A0A] border-white/5" 
                  : "bg-stone-100/50 border-stone-200"
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent blur-xl pointer-events-none" />
                
                <div className="max-w-md mx-auto space-y-4">
                  <div className={`p-3 w-fit mx-auto rounded-full ${isDark ? "bg-white/5 text-white" : "bg-white text-amber-600 shadow-sm"}`}>
                    <Sparkles className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  
                  <h2 className="font-display font-semibold text-2xl md:text-3xl tracking-tight leading-tight uppercase tracking-wider">
                    Let's build something meaningful.
                  </h2>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                    Whether you are recruiting for Product Management roles, looking to collaborate on a dynamic AI framework, or just want to discuss behavioral conversion metrics—let's connect.
                  </p>
                </div>

                {/* Social and Contact Links Grid */}
                <div className="flex flex-wrap justify-center gap-3">
                  
                  <a
                    id="email-contact"
                    href="mailto:sourabhyadav2877@gmail.com"
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition-all shadow-sm ${
                      isDark 
                        ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" 
                        : "bg-white hover:bg-stone-50 text-stone-900 border border-stone-200"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-white" />
                    <span>Email</span>
                  </a>

                  <a
                    id="linkedin-contact"
                    href="https://www.linkedin.com/in/sou-y/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition-all shadow-sm ${
                      isDark 
                        ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" 
                        : "bg-white hover:bg-stone-50 text-stone-900 border border-stone-200"
                    }`}
                  >
                    <Linkedin className="w-3.5 h-3.5 text-white" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    id="github-contact"
                    href="https://github.com/sourabhyadavifs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition-all shadow-sm ${
                      isDark 
                        ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" 
                        : "bg-white hover:bg-stone-50 text-stone-900 border border-stone-200"
                    }`}
                  >
                    <Github className="w-3.5 h-3.5 text-white" />
                    <span>GitHub</span>
                  </a>

                  <a
                    id="resume-contact"
                    href="https://drive.google.com/file/d/12jzIo5FZTYcfvuxM7bIRsAI4LWf3uAI0/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition-all shadow-sm ${
                      isDark 
                        ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" 
                        : "bg-white hover:bg-stone-50 text-stone-900 border border-stone-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-white" />
                    <span>Resume</span>
                  </a>

                </div>

                <div className="pt-8 border-t border-stone-200/50 dark:border-white/5 text-[11px] font-mono flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 dark:text-zinc-500">
                  <span>Thanks for stopping by!</span>
                  <span>&copy; 2026 Sourabh Yadav. All rights reserved.</span>
                </div>
              </section>

            </motion.div>
          ) : (
            
            /* DEDICATED PROJECT DETAIL VIEW */
            <motion.div
              key="project-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl mx-auto px-6 md:px-8 py-12 space-y-12"
            >
              {/* Back to Home Header */}
              <div className="flex items-center justify-between">
                <button
                  id="project-back-button"
                  onClick={() => {
                    setCurrentProject(null);
                    window.scrollTo({ top: 0 });
                  }}
                  className={`group px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    isDark 
                      ? "bg-white/5 hover:bg-white/10 text-white" 
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Back to work</span>
                </button>

                <div className="flex items-center space-x-1 text-xs font-mono text-stone-400 dark:text-[#86868B]">
                  <span>Selected Work</span>
                  <span>/</span>
                  <span className="text-[#F5F5F7] font-semibold">{activeProjectData?.name}</span>
                </div>
              </div>

              {activeProjectData && (
                <article className="space-y-16">
                  
                  {/* Hero Header */}
                  <div className="space-y-4 text-left">
                    <h1 id="project-title" className="font-display font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl leading-tight">
                      {activeProjectData.name}
                    </h1>
                    <p id="project-tagline" className={`text-base sm:text-lg font-serif italic ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                      {activeProjectData.tagline}
                    </p>
                  </div>

                  {/* High Quality Cover Image */}
                  <div className={`aspect-[16/9] w-full rounded-2xl overflow-hidden border ${
                    isDark ? "border-white/5 bg-white/5" : "border-stone-200 bg-stone-100"
                  }`}>
                    <img
                      src={activeProjectData.coverImage}
                      alt={activeProjectData.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                  </div>

                  {/* Details Split Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    
                    {/* Left Column: Metadata */}
                    <div className="md:col-span-4 text-left">
                      <div className={`p-6 rounded-2xl border space-y-6 sticky top-24 ${
                        isDark 
                          ? "bg-white/[0.02] border-white/10" 
                          : "bg-stone-50/50 border-stone-200/80"
                      }`}>
                        
                        <div>
                          <h4 className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-[#86868B] mb-1">
                            Role / Context
                          </h4>
                          <p className="text-xs font-semibold">
                            {activeProjectData.id === "creditplanner"
                              ? "Product Discovery, User Research, Customer Interviews, Solution Design, Validation"
                              : activeProjectData.id === "netro"
                              ? "Product Discovery, User Research, Market Analysis, Product Strategy, Feature Prioritization, Wireframing"
                              : activeProjectData.id === "airesumebuilder"
                              ? "Product Discovery, User Research, Product Strategy, AI Workflow Design, Prompt Engineering, MVP Development"
                              : activeProjectData.id === "zomato"
                              ? "Problem Discovery, User Research, Product Analysis, Journey Mapping, Feature Prioritization, UX Strategy, Solution Design, Presentation"
                              : activeProjectData.id === "slikk"
                              ? "Product Strategy, User Research, Problem Framing, Market Research, Customer Journey Mapping, Solution Ideation, Go-To-Market Strategy, Business Analysis, Presentation Development"
                              : activeProjectData.id === "wispr-flow"
                              ? "Product Discovery, User Research, Usability Testing, User Journey Mapping, Product Analysis, UX Audit, Opportunity Identification, Recommendation Development, Customer Experience Evaluation, Product Documentation"
                              : activeProjectData.id === "linkedin-automation"
                              ? "Product Management, Workflow Automation, AI Integration, Automation Strategy"
                              : activeProjectData.id === "homestay-assistant"
                              ? "Product Management, AI Product Design, Conversational UX, Recommendation Systems"
                              : activeProjectData.id === "aivoicereceptionist"
                              ? "Product Manager & AI Builder"
                              : "Lead Product Manager"
                            }
                          </p>
                        </div>

                        <div>
                          <h4 className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-[#86868B] mb-1">
                            Focus Areas
                          </h4>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(activeProjectData.id === "creditplanner" 
                              ? ["User Research", "Product Thinking", "Problem Framing", "Prioritization", "UX Strategy", "Validation"]
                              : activeProjectData.id === "netro"
                              ? ["Product Discovery", "User Research", "Market Research", "Product Strategy", "Feature Prioritization", "Go-To-Market Thinking"]
                              : activeProjectData.id === "airesumebuilder"
                              ? ["Product Discovery", "User Research", "Product Strategy", "AI Product Design", "Prompt Engineering", "MVP Development"]
                              : activeProjectData.id === "zomato"
                              ? ["Product Discovery", "User Research", "Customer Journey Mapping", "Behavioral Analysis", "Product Strategy", "Feature Prioritization", "UX Thinking", "Problem Framing", "Opportunity Assessment", "Storytelling"]
                              : activeProjectData.id === "slikk"
                              ? ["Product Strategy", "User Research", "Market Research", "Customer Journey Mapping", "Go-To-Market Planning", "Problem Framing", "Prioritization", "Business Analysis", "Stakeholder Thinking", "Storytelling"]
                              : activeProjectData.id === "wispr-flow"
                              ? ["Product Discovery", "User Research", "Usability Testing", "Product Analysis", "UX Audit", "User Journey Mapping", "Problem Identification", "Customer Experience", "Product Strategy", "Critical Thinking"]
                              : activeProjectData.id === "linkedin-automation"
                              ? ["Product Discovery", "Workflow Design", "Process Optimization", "AI Product Thinking", "API Integration", "User Journey Mapping", "MVP Development", "Systems Thinking"]
                              : activeProjectData.id === "homestay-assistant"
                              ? ["Product Discovery", "User Research", "AI Product Design", "Conversational UX", "Prompt Engineering", "Customer Journey Mapping", "Personalization Strategy", "UX Design", "MVP Development", "Systems Thinking"]
                              : activeProjectData.id === "aivoicereceptionist"
                              ? ["Product Discovery", "User Research", "AI Product Management", "Conversational UX Design", "Voice AI Design", "Prompt Engineering", "Customer Journey Mapping", "Workflow Design", "API Integration Planning", "Systems Thinking", "MVP Development", "Product Strategy"]
                              : ["LLM Grounding", "ATS Parsers", "Responsive Markdown"]
                            ).map((tag, tIdx) => (
                              <span 
                                key={tIdx} 
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  isDark ? "bg-white/5 text-white" : "bg-stone-150 text-stone-700"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-[#86868B] mb-1">
                            Strategic Intent
                          </h4>
                          <p className={`text-xs leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-500"}`}>
                            {activeProjectData.id === "creditplanner" 
                              ? "Improving trust in fintech recommendations through explainable product experiences."
                              : activeProjectData.id === "netro"
                              ? "Transforming networking from contact exchange into relationship building."
                              : activeProjectData.id === "airesumebuilder"
                              ? "Helping professionals transition careers through AI-powered resume customization."
                              : activeProjectData.id === "zomato"
                              ? "Reducing decision fatigue through behavioral product design and smarter recommendation experiences."
                              : activeProjectData.id === "slikk"
                              ? "Developed a go-to-market strategy for Slikk's Home Decor expansion in HSR Layout, focusing on trust, quality assurance, and customer confidence rather than delivery speed."
                              : activeProjectData.id === "wispr-flow"
                              ? "Conducted an end-to-end Product & Onboarding UX Audit of Wispr Flow, evaluating first-time user activation across Android (primary) and iOS platforms to identify friction and map optimizations."
                              : activeProjectData.id === "linkedin-automation"
                              ? "Transform manual LinkedIn publishing into an intelligent AI-powered automation workflow."
                              : activeProjectData.id === "homestay-assistant"
                              ? "Transform accommodation discovery from traditional search into an intelligent conversational recommendation experience."
                              : activeProjectData.id === "aivoicereceptionist"
                              ? "Automate salon enquiries, services pricing, and appointment scheduling through conversational voice agents."
                              : "Making systemic ATS optimization transparent, accessible, and editorial."
                            }
                          </p>
                        </div>

                        <div>
                          <h4 className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-[#86868B] mb-1">
                            Tech Stack & Tools
                          </h4>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(activeProjectData.id === "wispr-flow" 
                              ? ["Wispr Flow", "Android", "iOS", "Google Docs", "User Research", "UX Analysis"]
                              : activeProjectData.id === "creditplanner"
                              ? ["Figma", "User Research", "Fintech Analysis", "PM Frameworks"]
                              : activeProjectData.id === "netro"
                              ? ["React", "TypeScript", "Vite", "Tailwind CSS", "Express"]
                              : activeProjectData.id === "airesumebuilder"
                              ? ["React", "TypeScript", "Gemini API", "Tailwind CSS", "Express"]
                              : activeProjectData.id === "zomato"
                              ? ["Zomato App", "Figma", "User Research", "Product Analysis"]
                              : activeProjectData.id === "slikk"
                              ? ["Slikk App", "Market Research", "Journey Mapping", "Product Strategy"]
                              : activeProjectData.id === "linkedin-automation"
                              ? ["Google Sheets", "Gemini AI API", "Make.com", "LinkedIn API", "Gmail"]
                              : activeProjectData.id === "homestay-assistant"
                              ? ["Zapier AI Chatbot", "OpenAI GPT Model", "Prompt Engineering", "Travel Recommendation Logic"]
                              : activeProjectData.id === "aivoicereceptionist"
                              ? ["Retell AI", "Gemini 2.5 Flash-Lite", "Google Calendar", "Cal.com API", "Prompt Engineering", "Voice AI Workflow Design"]
                              : ["React", "TypeScript", "Tailwind CSS"]
                            ).map((tag, tIdx) => (
                              <span 
                                key={tIdx} 
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  isDark ? "bg-white/5 text-white" : "bg-stone-150 text-stone-700"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Direct resources rendering in the meta sidebar */}
                        {activeProjectData.resources && activeProjectData.resources.length > 0 && (
                          <div className="pt-2">
                            <h4 className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-[#86868B] mb-2">
                              Project Deliverables
                            </h4>
                            <div className="space-y-1.5">
                              {activeProjectData.resources.map((res, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                                    isDark 
                                      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white" 
                                      : "bg-white border-stone-200 hover:bg-stone-50 text-stone-700"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <FileText className={`w-3.5 h-3.5 ${
                                      res.type === "Document" || res.type === "Research" ? "text-red-500" : "text-blue-500"
                                    }`} />
                                    <span className="truncate max-w-[130px]">{res.title}</span>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                                </a>
                              ))}

                              {/* Demo Guide for AI Voice Receptionist */}
                              {activeProjectData.id === "aivoicereceptionist" && (
                                <div className="mt-4 pt-3 border-t border-dashed border-stone-200 dark:border-white/10 text-left space-y-2">
                                  <h5 className="font-display font-bold text-[11px] uppercase tracking-wider text-amber-600 dark:text-white">
                                    Demo Guide
                                  </h5>
                                  <ul className={`text-[11px] leading-relaxed space-y-2 ${
                                    isDark ? "text-[#86868B]" : "text-stone-500"
                                  }`}>
                                    <li className="flex items-start">
                                      <span className="mr-1.5 shrink-0 text-stone-400 dark:text-[#86868B]">•</span>
                                      <span>To quickly understand what I built and how the product works, watch from <strong>1:00 to 1:45</strong>.</span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="mr-1.5 shrink-0 text-stone-400 dark:text-[#86868B]">•</span>
                                      <span>To experience the complete AI Voice Agent interaction, start watching from <strong>2:05 onwards</strong>.</span>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Right Column: Case Study Narrative */}
                    <div className="md:col-span-8 space-y-10 text-left">
                      
                      {/* Section Challenge */}
                      <div className="space-y-3" id="case-challenge">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-stone-400 dark:text-[#86868B] font-semibold">01 /</span>
                          <h3 className="font-display font-bold text-lg md:text-xl">The Challenge</h3>
                        </div>
                        <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                          {activeProjectData.challenge}
                        </p>
                      </div>

                      {/* Section Research */}
                      <div className="space-y-3" id="case-research">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-stone-400 dark:text-[#86868B] font-semibold">02 /</span>
                          <h3 className="font-display font-bold text-lg md:text-xl">User Research</h3>
                        </div>
                        <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                          {activeProjectData.research}
                        </p>
                      </div>

                      {/* Section Insights */}
                      <div className="space-y-4" id="case-insights">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-stone-400 dark:text-[#86868B] font-semibold">03 /</span>
                          <h3 className="font-display font-bold text-lg md:text-xl">Key Insights</h3>
                        </div>
                        
                        <div className={`p-5 rounded-2xl border border-dashed flex items-start space-x-4 ${
                          isDark 
                            ? "bg-white/[0.02] border-white/10 text-white" 
                            : "bg-amber-500/5 border-stone-200 text-stone-700"
                        }`}>
                          <div className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-white rounded-lg shrink-0 mt-0.5">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <div className="space-y-4 w-full">
                            <div>
                              <h4 className="font-display font-semibold text-xs uppercase tracking-wide mb-1 text-amber-600 dark:text-white">Key Insights</h4>
                              <p className="text-xs sm:text-sm leading-relaxed text-stone-500 dark:text-[#86868B] whitespace-pre-line">
                                {activeProjectData.insights}
                              </p>
                            </div>
                            {(activeProjectData.id === "creditplanner" || activeProjectData.id === "netro" || activeProjectData.id === "airesumebuilder" || activeProjectData.id === "zomato" || activeProjectData.id === "slikk" || activeProjectData.id === "wispr-flow" || activeProjectData.id === "linkedin-automation" || activeProjectData.id === "aivoicereceptionist") && (
                              <div className="pt-3 border-t border-dashed border-stone-200 dark:border-white/10">
                                <h4 className="font-display font-semibold text-xs uppercase tracking-wide mb-1 text-amber-600 dark:text-white">Learnings</h4>
                                <p className="text-xs sm:text-sm leading-relaxed text-stone-500 dark:text-[#86868B] whitespace-pre-line font-sans">
                                  {activeProjectData.id === "creditplanner"
                                    ? "Trust is created through clarity.\nSometimes a simple explanation creates more impact than an entirely new feature."
                                    : activeProjectData.id === "netro"
                                    ? "Networking products succeed when they support relationships, not just contact exchange.\nUser research often reveals deeper problems than initially expected."
                                    : activeProjectData.id === "airesumebuilder"
                                    ? "Career transitions are positioning problems, not formatting problems.\nPersonalization creates significantly more value than automation alone."
                                    : activeProjectData.id === "slikk"
                                    ? "• Trust can outperform speed.\n• Customer behaviour changes across product categories.\n• Strong product strategies balance users, business, and operations.\n• Research reduces assumptions.\n• Customer confidence is part of the product experience."
                                    : activeProjectData.id === "wispr-flow"
                                    ? "• Platform Alignment: Onboarding walkthroughs must match the user's OS (Android vs iOS) to avoid confusion.\n• Zero-Restart Flow: Permission gates require automatic status checks; manual app restarts trigger immediate drop-offs.\n• Contextual Social Proof: Review requests must be delayed until users experience their first custom tone 'Aha!' moment.\n• Early Positioning: Advanced AI features (style tuning, grammar corrections) must be highlighted early to beat native keyboards."
                                    : activeProjectData.id === "linkedin-automation"
                                    ? "• Automation removes repetitive work.\n• AI is most valuable inside workflows.\n• End-to-end journeys matter more than isolated features.\n• No-code tools accelerate MVP development.\n• Reliable automation balances UX, scalability, and robustness."
                                    : activeProjectData.id === "aivoicereceptionist"
                                    ? "• Designing voice conversations requires different UX principles than text-based chatbots.\n• Structured knowledge bases improve response consistency and reliability.\n• Product thinking is essential when balancing business needs with customer experience.\n• Calendar integration significantly enhances the usefulness of AI voice agents.\n• Clear conversation flows reduce customer confusion and improve booking completion rates."
                                    : "• More choices don't always improve UX.\n• Decision fatigue creates hidden churn.\n• Great PM opportunities come from behavioral observation.\n• Personalization should reduce effort.\n• Great products help users make decisions."
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section Solution */}
                      <div className="space-y-4" id="case-solution">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-stone-400 dark:text-[#86868B] font-semibold">04 /</span>
                          <h3 className="font-display font-bold text-lg md:text-xl">The Solution</h3>
                        </div>
                        {activeProjectData.id === "linkedin-automation" ? (
                          <div className="space-y-6">
                            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                              Designed an automated workflow orchestrated by Make.com that transforms raw content ideas into published LinkedIn posts with real-time Gmail notifications:
                            </p>

                            {/* Workflow diagram / flow pipeline */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                              {[
                                {
                                  step: "Google Sheets",
                                  role: "Idea Input & Status",
                                  desc: "Holds content ideas, publication dates, and tracks execution status."
                                },
                                {
                                  step: "Gemini AI",
                                  role: "AI Generation",
                                  desc: "Transforms ideas into highly engaging, optimized LinkedIn posts."
                                },
                                {
                                  step: "LinkedIn Publishing",
                                  role: "Auto-Publish",
                                  desc: "Automatically publishes approved drafts directly to LinkedIn."
                                },
                                {
                                  step: "Gmail Notification",
                                  role: "Confirmation",
                                  desc: "Sends real-time email summaries once the post is live."
                                }
                              ].map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 relative ${
                                    isDark ? "bg-white/[0.02] border-white/10" : "bg-stone-50 border-stone-200"
                                  }`}
                                >
                                  <div>
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-amber-600 dark:text-white font-bold block mb-1">
                                      0{idx + 1} / {item.role}
                                    </span>
                                    <h4 className="font-display font-bold text-sm text-stone-800 dark:text-white">
                                      {item.step}
                                    </h4>
                                    <p className={`text-xs leading-relaxed mt-1 ${isDark ? "text-[#86868B]" : "text-stone-500"}`}>
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Core Pipeline Highlight */}
                            <div className={`p-4 rounded-xl border border-dashed text-center ${
                              isDark ? "bg-white/[0.01] border-white/10" : "bg-stone-50 border-stone-200"
                            }`}>
                              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-[#86868B]">
                                Core Automation Pipeline
                              </span>
                              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 font-mono text-xs text-amber-600 dark:text-white font-bold">
                                <span>Idea</span>
                                <span className="text-stone-400">→</span>
                                <span>AI Generation</span>
                                <span className="text-stone-400">→</span>
                                <span>Publish</span>
                                <span className="text-stone-400">→</span>
                                <span>Email Confirmation</span>
                              </div>
                            </div>
                          </div>
                        ) : (activeProjectData.id === "slikk" || activeProjectData.id === "wispr-flow" || activeProjectData.id === "homestay-assistant" || activeProjectData.id === "aivoicereceptionist") ? (
                          <div className="space-y-6">
                            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                              {activeProjectData.id === "slikk" 
                                ? "Proposed initiatives to prioritize customer trust and confidence over delivery speed:"
                                : activeProjectData.id === "wispr-flow"
                                ? "Proposed actionable product recommendations to simplify onboarding, build user trust, and shorten the time-to-value:"
                                : activeProjectData.id === "aivoicereceptionist"
                                ? "Designed and developed an AI-powered voice receptionist with the following core capabilities:"
                                : "Designed an AI-powered conversational recommendation assistant that guides travelers through accommodation discovery. Key capabilities include:"
                              }
                            </p>
                            
                            {/* Feature Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {(activeProjectData.id === "slikk" ? [
                                {
                                  title: "90 Minutes or Free",
                                  desc: "A delivery promise designed to balance speed with customer confidence."
                                },
                                {
                                  title: "QA Verification Videos",
                                  desc: "Show product quality before dispatch."
                                },
                                {
                                  title: "AR Room Visualization",
                                  desc: "Help customers visualize products in their own homes."
                                },
                                {
                                  title: "Personalized Packaging",
                                  desc: "Improve trust with customer-tagged verification."
                                },
                                {
                                  title: "Community Trust Loops",
                                  desc: "Encourage user-generated content and apartment-focused discovery."
                                }
                              ] : activeProjectData.id === "wispr-flow" ? [
                                {
                                  title: "Auto-Detect Permission Flow",
                                  desc: "Automatically detect permission success, display a clear success indicator, and progress users instantly to eliminate the manual reopening loop."
                                },
                                {
                                  title: "OS-Specific Tutorial Guides",
                                  desc: "Dynamically detect user devices to display tailored Android or iOS walkthroughs instead of default iOS tutorials."
                                },
                                {
                                  title: "AI Feature Differentiation",
                                  desc: "Highlight high-value features (grammar correction, AI rewriting, custom styles) early to beat default voice keyboards."
                                },
                                {
                                  title: "Landing Page Branding Balance",
                                  desc: "Increase the visual prominence of Wispr branding on mobile screens to ensure the brand name isn't overshadowed by CTAs."
                                },
                                {
                                  title: "Post-Aha! Rating Prompts",
                                  desc: "Trigger review prompts only after users choose their writing styles and see the floating button in action to lift Play Store scores."
                                }
                              ] : activeProjectData.id === "aivoicereceptionist" ? [
                                {
                                  title: "AI Voice Receptionist",
                                  desc: "Engages customers through natural voice conversations and responds to common salon enquiries."
                                },
                                {
                                  title: "Service Information",
                                  desc: "Provides accurate information about salon services, pricing, business hours, and location using a structured knowledge base."
                                },
                                {
                                  title: "Appointment Booking",
                                  desc: "Checks available appointment slots using Google Calendar and books appointments through the Cal.com API."
                                },
                                {
                                  title: "Intelligent Call Handling",
                                  desc: "Transfers calls to the salon owner when customers request assistance beyond the AI's knowledge base."
                                },
                                {
                                  title: "Knowledge-Based Responses",
                                  desc: "Uses a predefined salon knowledge base to ensure consistent and accurate customer responses."
                                }
                              ] : [
                                {
                                  title: "Conversational Travel Assistance",
                                  desc: "Guides travelers naturally through accommodation discovery instead of using static forms."
                                },
                                {
                                  title: "Personalized Homestay Recommendations",
                                  desc: "Delivers tailored options specifically matched to travel goals and preferences."
                                },
                                {
                                  title: "Preference-Based Filtering",
                                  desc: "Applies filters dynamically through chat based on budget, destination, and amenities."
                                },
                                {
                                  title: "Dynamic Recommendation Engine",
                                  desc: "Generates custom recommendations dynamically from user-specified parameters."
                                },
                                {
                                  title: "Simple Chat-Based UX",
                                  desc: "Minimizes decision fatigue and simplifies the exploration experience."
                                }
                              ]).map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className={`p-4 rounded-xl border text-left space-y-2 ${
                                    isDark ? "bg-white/[0.02] border-white/10" : "bg-stone-50 border-stone-200"
                                  }`}
                                >
                                  <h4 className="font-display font-bold text-sm uppercase tracking-wide text-amber-600 dark:text-white">
                                    {item.title}
                                  </h4>
                                  <p className={`text-xs sm:text-[13px] leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-500"}`}>
                                    {item.desc}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Core Principle Quote Card */}
                            <div className={`p-5 rounded-2xl border border-dashed text-center space-y-2 ${
                              isDark 
                                ? "bg-white/[0.01] border-white/10" 
                                : "bg-stone-50 border-stone-200"
                            }`}>
                              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-[#86868B]">
                                Core Product Principle
                              </span>
                              <div className="flex flex-col items-center justify-center space-y-1 py-1">
                                <span className={`text-xs line-through ${isDark ? "text-[#86868B]" : "text-stone-400"}`}>
                                  {activeProjectData.id === "slikk" 
                                    ? '"How fast can we deliver?"' 
                                    : activeProjectData.id === "wispr-flow" 
                                    ? '"Request permissions quickly"'
                                    : activeProjectData.id === "aivoicereceptionist"
                                    ? '"Rely on manual receptionists for repetitive queries"'
                                    : '"Rely on static forms and manual filters"'}
                                </span>
                                <span className="text-sm font-bold text-amber-600 dark:text-white uppercase tracking-wider">
                                  {activeProjectData.id === "slikk" 
                                    ? '"How confidently can customers purchase?"' 
                                    : activeProjectData.id === "wispr-flow" 
                                    ? '"Help users understand value before asking for commitment."'
                                    : activeProjectData.id === "aivoicereceptionist"
                                    ? '"Automate repetitive calls to let staff focus on high-quality services."'
                                    : '"Understand traveler intent and preferences through conversational guidance."'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                            {activeProjectData.solution}
                          </p>
                        )}
                      </div>

                      {/* Section Process (Slikk / LinkedIn Automation / Homestay Assistant specific) */}
                      {(activeProjectData.id === "slikk" || activeProjectData.id === "linkedin-automation" || activeProjectData.id === "homestay-assistant" || activeProjectData.id === "aivoicereceptionist") && (
                        <div className="space-y-4" id="case-process">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-stone-400 dark:text-[#86868B] font-semibold">05 /</span>
                            <h3 className="font-display font-bold text-lg md:text-xl">The Process</h3>
                          </div>
                          
                          {/* Process Timeline/Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                            {(activeProjectData.id === "slikk" ? [
                              {
                                step: "Discovery",
                                desc: "Studied category-specific buying behaviour."
                              },
                              {
                                step: "Prioritization",
                                desc: "Focused on customer trust instead of delivery speed."
                              },
                              {
                                step: "Wireframing",
                                desc: "Designed trust-building customer experiences."
                              },
                              {
                                step: "Validation",
                                desc: "Validated assumptions through customer research and benchmarking."
                              },
                              {
                                step: "Testing",
                                desc: "Evaluated customer impact, operational feasibility, and scalability."
                              }
                            ] : activeProjectData.id === "linkedin-automation" ? [
                              {
                                step: "Discovery",
                                desc: "Identified inefficiencies in manual content publishing."
                              },
                              {
                                step: "Prioritization",
                                desc: "Focused on automating repetitive, high-effort tasks."
                              },
                              {
                                step: "Workflow Design",
                                desc: "Designed triggers, actions, and integrations."
                              },
                              {
                                step: "Validation",
                                desc: "Verified publishing reliability and AI output quality."
                              },
                              {
                                step: "Testing",
                                desc: "Performed end-to-end testing across Google Sheets, Gemini AI, LinkedIn, and Gmail."
                              }
                            ] : activeProjectData.id === "aivoicereceptionist" ? [
                              {
                                step: "Discovery",
                                desc: "Identified repetitive customer enquiries that consume receptionist time and impact salon operations."
                              },
                              {
                                step: "Prioritization",
                                desc: "Focused on automating high-frequency customer interactions, including pricing enquiries, service information, and appointment booking."
                              },
                              {
                                step: "Conversation Design",
                                desc: "Designed natural conversational flows that guide customers through information requests and booking processes while maintaining a friendly and professional tone."
                              },
                              {
                                step: "Integration",
                                desc: "Integrated Google Calendar for availability checking and Cal.com API for appointment scheduling within Retell AI."
                              },
                              {
                                step: "Testing",
                                desc: "Validated conversation quality, booking accuracy, response consistency, and user experience across multiple customer scenarios."
                              }
                            ] : [
                              {
                                step: "Discovery",
                                desc: "Identified challenges with traditional accommodation search experiences."
                              },
                              {
                                step: "Prioritization",
                                desc: "Focused on reducing search effort through conversational interactions."
                              },
                              {
                                step: "Conversation Design",
                                desc: "Designed chatbot flows to naturally collect user preferences."
                              },
                              {
                                step: "Validation",
                                desc: "Tested recommendation quality and conversational usability."
                              },
                              {
                                step: "Testing",
                                desc: "Evaluated response accuracy, recommendation relevance, and user satisfaction."
                              }
                            ]).map((item, idx) => (
                              <div 
                                key={idx} 
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 ${
                                  isDark ? "bg-white/[0.02] border-white/10" : "bg-stone-50 border-stone-200"
                                }`}
                              >
                                <div className="space-y-1">
                                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-amber-600 dark:text-[#86868B]">
                                    0{idx + 1}
                                  </span>
                                  <h4 className="font-display font-bold text-xs uppercase tracking-wider">
                                    {item.step}
                                  </h4>
                                </div>
                                <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-500"}`}>
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section Outcome */}
                      <div className="space-y-4" id="case-outcome">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-stone-400 dark:text-[#86868B] font-semibold">
                            {(activeProjectData.id === "slikk" || activeProjectData.id === "linkedin-automation" || activeProjectData.id === "homestay-assistant" || activeProjectData.id === "aivoicereceptionist") ? "06 /" : "05 /"}
                          </span>
                          <h3 className="font-display font-bold text-lg md:text-xl">Outcome & Impact</h3>
                        </div>
                        
                        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                          {activeProjectData.outcome}
                        </p>

                        {/* Metric Highlights */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className={`p-4 rounded-2xl border text-center ${
                            isDark ? "bg-white/[0.02] border-white/10" : "bg-stone-50 border-stone-200/50"
                          }`}>
                            <div className="font-display font-extrabold text-2xl md:text-3xl text-stone-900 dark:text-white">
                              {activeProjectData.id === "creditplanner" 
                                ? "16 / 19" 
                                : activeProjectData.id === "netro" 
                                ? "120+" 
                                : activeProjectData.id === "zomato" 
                                ? "~40%" 
                                : activeProjectData.id === "slikk"
                                ? "Runner-Up"
                                : activeProjectData.id === "wispr-flow"
                                ? "19"
                                : activeProjectData.id === "linkedin-automation"
                                ? "100%"
                                : activeProjectData.id === "homestay-assistant"
                                ? "Functional"
                                : activeProjectData.id === "aivoicereceptionist"
                                ? "100%"
                                : "3.5x"
                              }
                            </div>
                            <div className={`text-[10px] uppercase font-mono tracking-wider font-semibold mt-1 ${
                              isDark ? "text-[#86868B]" : "text-stone-400"
                            }`}>
                              {activeProjectData.id === "creditplanner" 
                                ? "Users Reporting Higher Trust" 
                                : activeProjectData.id === "netro" 
                                ? "Discovery Discussions" 
                                : activeProjectData.id === "zomato" 
                                ? "Reduction in Ordering Time" 
                                : activeProjectData.id === "slikk"
                                ? "Scaler Builder's League"
                                : activeProjectData.id === "wispr-flow"
                                ? "Usability Test Participants"
                                : activeProjectData.id === "linkedin-automation"
                                ? "Fully Automated Pipeline"
                                : activeProjectData.id === "homestay-assistant"
                                ? "AI Travel Assistant"
                                : activeProjectData.id === "aivoicereceptionist"
                                ? "Real-time calendar booking"
                                : "Recruiter Callbacks Increase"
                              }
                            </div>
                          </div>

                          <div className={`p-4 rounded-2xl border text-center ${
                            isDark ? "bg-white/[0.02] border-white/10" : "bg-stone-50 border-stone-200/50"
                          }`}>
                            <div className="font-display font-extrabold text-2xl md:text-3xl text-stone-900 dark:text-white">
                              {activeProjectData.id === "creditplanner" 
                                ? "Winner" 
                                : activeProjectData.id === "netro" 
                                ? "Concept" 
                                : activeProjectData.id === "zomato" 
                                ? "UX" 
                                : activeProjectData.id === "slikk"
                                ? "₹25,000"
                                : activeProjectData.id === "wispr-flow"
                                ? "~4 min"
                                : activeProjectData.id === "linkedin-automation"
                                ? "0 min"
                                : activeProjectData.id === "homestay-assistant"
                                ? "Minimized"
                                : activeProjectData.id === "aivoicereceptionist"
                                ? "Automated"
                                : "40%"
                              }
                            </div>
                            <div className={`text-[10px] uppercase font-mono tracking-wider font-semibold mt-1 ${
                              isDark ? "text-[#86868B]" : "text-stone-400"
                            }`}>
                              {activeProjectData.id === "creditplanner" 
                                ? "PM Challenge 2026" 
                                : activeProjectData.id === "netro" 
                                ? "Complete Design" 
                                : activeProjectData.id === "zomato" 
                                ? "Behavioral Strategy" 
                                : activeProjectData.id === "slikk"
                                ? "Prize Money Won"
                                : activeProjectData.id === "wispr-flow"
                                ? "Average Sign-in Time"
                                : activeProjectData.id === "linkedin-automation"
                                ? "Manual Posting Effort"
                                : activeProjectData.id === "homestay-assistant"
                                ? "Decision Fatigue"
                                : activeProjectData.id === "aivoicereceptionist"
                                ? "Enquiry & Booking handling"
                                : "Tailoring prep time saved"
                              }
                            </div>
                          </div>
                        </div>

                        {/* Recognition Card for Slikk */}
                        {activeProjectData.id === "slikk" && (
                          <div className="space-y-4 pt-4">
                            <div className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 ${
                              isDark 
                                ? "bg-white/5 border-white/10" 
                                : "bg-[#FCFBFB] border-stone-200"
                            }`}>
                              <div className="space-y-2">
                                <div className={`p-2 w-fit rounded-lg ${isDark ? "bg-white/5 text-white" : "bg-stone-100 text-amber-600"}`}>
                                  <Award className="w-4 h-4 text-amber-600 dark:text-white" />
                                </div>
                                <h3 className="font-display font-bold text-sm tracking-tight pt-1">
                                  Runner-Up
                                </h3>
                                <p className={`text-[10px] font-mono tracking-wide uppercase font-semibold ${
                                  isDark ? "text-[#86868B]" : "text-stone-500"
                                }`}>
                                  The Builder's League Case Competition
                                </p>
                                <p className="text-xs font-semibold text-amber-600 dark:text-amber-500">
                                  Hosted by Scaler School of Business
                                </p>
                              </div>
                              <div className="pt-3 border-t border-dashed border-stone-200 dark:border-white/10 flex items-center justify-between">
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-stone-300" : "text-stone-600"}`}>Prize Money</span>
                                <span className="text-sm font-extrabold text-amber-600 dark:text-white">₹25,000</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* Project Bottom Contact Callout */}
                  <div className={`p-8 rounded-2xl border text-center space-y-4 ${
                    isDark ? "bg-white/5 border-white/10" : "bg-stone-50/50 border-stone-200/80"
                  }`}>
                    <h4 className="font-display font-semibold text-lg uppercase tracking-wider">Interested in this project?</h4>
                    <p className={`text-xs sm:text-sm max-w-lg mx-auto leading-relaxed ${isDark ? "text-[#86868B]" : "text-stone-600"}`}>
                      I would love to walk you through the structural mockups, database schemas, and product hypothesis notes behind this concept.
                    </p>
                    <div className="flex justify-center space-x-3 pt-2">
                      <button
                        onClick={() => {
                          setCurrentProject(null);
                          // delay slightly to allow component swap
                          setTimeout(() => {
                            const el = document.getElementById("contact");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-1.5 transition-colors cursor-pointer ${
                          isDark ? "bg-white text-black hover:bg-gray-200" : "bg-stone-900 text-white hover:bg-stone-800"
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Discuss with Sourabh</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentProject(null);
                          window.scrollTo({ top: 0 });
                        }}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                          isDark 
                            ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" 
                            : "border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <span>Back to Work</span>
                      </button>
                    </div>
                  </div>

                </article>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
