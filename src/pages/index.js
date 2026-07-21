import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Lenis from "lenis";

// FadeIn component that transitions from opacity 0 to 1 after delay
function FadeIn({ children, delay = 0, duration = 1000, className = "" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ScrollReveal component using IntersectionObserver for viewport entrance animations
function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = ""
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  const getAnimationStyles = () => {
    switch (animation) {
      case "fade-up":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
        };
      case "fade-down":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-40px)",
        };
      case "fade-left":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(40px)",
        };
      case "fade-right":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(-40px)",
        };
      case "zoom-in":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.96)",
        };
      default:
        return {
          opacity: isVisible ? 1 : 0,
        };
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{
        ...getAnimationStyles(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// AnimatedHeading splits text by line and char to stagger entrance transitions
function AnimatedHeading({ text, delay = 200, charDelay = 30, className = "" }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const lines = text.split("\n");

  return (
    <span className={`block ${className}`}>
      {lines.map((line, lineIndex) => {
        let prevCharsCount = 0;
        for (let i = 0; i < lineIndex; i++) {
          prevCharsCount += lines[i].length;
        }

        return (
          <span key={lineIndex} className="block whitespace-nowrap leading-[1.05]">
            {line.split("").map((char, charIndex) => {
              const globalIndex = prevCharsCount + charIndex;
              const staggerDelay = globalIndex * charDelay;

              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateX(0)" : "translateX(-18px)",
                    transitionDuration: "500ms",
                    transitionDelay: `${staggerDelay}ms`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("gold");
  const [activePurpose, setActivePurpose] = useState("mentorship");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const id = target.getAttribute('href');
        if (id === '#') return;
        const element = document.querySelector(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -80 });
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans">
      {/* 1. HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Full-screen background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Darkening video overlay to keep the darken style fixed */}
        <div className="absolute inset-0 bg-black/45 z-10 pointer-events-none"></div>

        {/* Top Header / Navbar */}
        <div className="w-full px-6 md:px-12 lg:px-16 pt-6 z-20">
          <nav className="liquid-glass rounded-xl px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center">
              <div className="relative w-32 h-14">
                <Image
                  src="/logo.png"
                  alt="One Empire Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#why-choose" className="text-sm text-slate-200 hover:text-white transition-colors duration-200">
                Why Choose
              </a>
              <a href="#plans" className="text-sm text-slate-200 hover:text-white transition-colors duration-200">
                Plans
              </a>
              <a href="#community" className="text-sm text-slate-200 hover:text-white transition-colors duration-200">
                Community
              </a>
            </div>

            {/* Right Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://login.oneempirecommunity.com/login.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="https://login.oneempirecommunity.com/Register.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
              >
                Registration
              </a>
              <a
                href="https://wa.me/447537166377"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-all duration-200 hover:scale-[1.02]"
              >
                Join Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-slate-300 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </nav>

          
        </div>

        {/* Hero Content (Positioned at bottom of viewport) */}
        <div className="w-full px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex-1 flex flex-col justify-end z-20">
          <div className="lg:grid lg:grid-cols-2 lg:items-end gap-12 lg:gap-8">
            {/* Left Column - Main Titles & Actions */}
            <div className="flex flex-col items-start text-left">
              {/* Heading */}
              <AnimatedHeading
                text={"Build Real Assets\nNot Liabilities"}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white mb-6"
                delay={200}
                charDelay={30}
              />

              {/* Subheading */}
              <FadeIn delay={800} duration={1000}>
                <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl font-light">
                  Join One Empire, where smart individuals secure their future through 100% asset-backed opportunities in Gold Jewellery and Property.
                </p>
              </FadeIn>

              {/* Action Buttons Row */}
              <FadeIn delay={1200} duration={1000} className="w-full sm:w-auto">
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                  <a
                    href="https://login.oneempirecommunity.com/Register.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black px-8 py-3.5 rounded-lg font-medium hover:bg-slate-100 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Build Assets Now
                  </a>
                  <a
                    href="#plans"
                    className="bg-white/5 border border-white/20 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-[1.02]"
                  >
                    Explore Plans
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right Column - Premium Tag Card */}
            <div className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
              <FadeIn delay={1400} duration={1000}>
                <div className="liquid-glass border border-white/20 p-8 rounded-xl shadow-2xl flex flex-col gap-4 text-left min-w-[280px]">
                  <div>
                    <span className="text-3xl font-normal text-white">5,000+</span>
                    <span className="text-xs text-slate-400 block uppercase tracking-wider mt-1">Active Members</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div>
                    <span className="text-3xl font-normal text-brand-gold">$50.0M+</span>
                    <span className="text-xs text-slate-400 block uppercase tracking-wider mt-1">Asset Value</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <span className="text-xs font-semibold uppercase text-brand-orange tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                    Gold Jewellery Assets
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PARADIGM SHIFT SECTION (DARK THEME - PURE BLACK - ASYMMETRICAL & CREATIVE) */}
      <section className="py-32 bg-black relative overflow-hidden">
        {/* Abstract vector background lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(white 1px, transparent 0), radial-gradient(white 1px, transparent 0)", backgroundSize: "40px 40px", backgroundPosition: "0 0, 20px 20px" }}></div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left side: Editorial Layout block */}
            <ScrollReveal animation="fade-right" className="lg:col-span-8 text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white mb-8">
                Last time, many people created liabilities. This time, smart people are
                building <span className="font-semibold bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">ASSETS</span>{" "}with One Empire.
              </h2>
              <div className="mt-8">
                <a
                  href="https://login.oneempirecommunity.com/Register.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-slate-100 transition-colors hover:scale-[1.02]"
                >
                  Join The Movement
                </a>
              </div>
            </ScrollReveal>

            {/* Right side: High-end trading widget representation */}
            <ScrollReveal animation="fade-left" delay={200} className="lg:col-span-4 w-full">
              <div className="liquid-glass border border-white/10 rounded-2xl p-8 text-left shadow-2xl flex flex-col gap-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Reserves</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/20">Live</span>
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">Active Members</span>
                    <span className="text-3xl font-normal text-white">5,000+</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">Assets</span>
                    <span className="text-3xl font-normal text-brand-gold">$50M+</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">Verification</span>
                    <span className="text-lg font-normal text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      100% Asset-Backed
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE SECTION (MIX COLORED THEME - WHITE BACKGROUND - STICKY EDITORIAL STYLE) */}
      <section id="why-choose" className="py-32 md:py-40 bg-brand-light text-black scroll-mt-6 relative overflow-hidden">
        {/* Soft layout visual markers & background watermark logo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute -left-16 bottom-10 w-96 h-96 opacity-[0.08] pointer-events-none">
          <Image
            src="/logo.png"
            alt="One Empire Logo Watermark"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Sticky Left Column */}
            <ScrollReveal animation="fade-right" className="lg:col-span-5 text-left lg:sticky lg:top-28">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-black mt-3 mb-6 leading-tight">
                Why Choose One Empire?
              </h2>
              <p className="text-slate-600 text-lg font-light leading-relaxed">
                Join thousands of smart individuals focused on building real wealth through tangible assets
              </p>

              {/* Sleek asset security badge */}
              <div className="mt-8 p-6 rounded-xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex gap-4 items-start max-w-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.957 11.957 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-black mb-1 uppercase tracking-wider">Physical Verification</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    All assets are audited quarterly and physical holdings are secured in high-security vaults in the United Kingdom.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Asymmetrical Right Column List */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Item 1 */}
              <ScrollReveal animation="fade-up" delay={0}>
                <div className="liquid-glass-light p-8 rounded-2xl flex flex-col justify-between min-h-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/10 hover:border-brand-orange/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange rounded-t-2xl"></div>
                  <div>
                    <span className="font-display text-4xl font-extralight text-brand-orange block mb-4">01</span>
                    <h3 className="text-lg font-semibold text-black mb-3">Real Asset Strength</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      Opportunities connected to Gold Jewellery and Property with genuine underlying value.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Item 2 */}
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="liquid-glass-light p-8 rounded-2xl flex flex-col justify-between min-h-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/10 hover:border-brand-blue/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue rounded-t-2xl"></div>
                  <div>
                    <span className="font-display text-4xl font-extralight text-brand-blue block mb-4">02</span>
                    <h3 className="text-lg font-semibold text-black mb-3">Build Family Wealth</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      Create assets your family can benefit from for generations to come.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Item 3 */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="liquid-glass-light p-8 rounded-2xl flex flex-col justify-between min-h-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/10 hover:border-brand-orange/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange rounded-t-2xl"></div>
                  <div>
                    <span className="font-display text-4xl font-extralight text-brand-orange block mb-4">03</span>
                    <h3 className="text-lg font-semibold text-black mb-3">Safe & Smart Vision</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      Focus on real value with practical and transparent strategies.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Item 4 */}
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="liquid-glass-light p-8 rounded-2xl flex flex-col justify-between min-h-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/10 hover:border-brand-blue/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue rounded-t-2xl"></div>
                  <div>
                    <span className="font-display text-4xl font-extralight text-brand-blue block mb-4">04</span>
                    <h3 className="text-lg font-semibold text-black mb-3">Strong Community</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      Grow alongside ambitious and like-minded people worldwide.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Item 5 */}
              <ScrollReveal animation="fade-up" delay={400}>
                <div className="liquid-glass-light p-8 rounded-2xl flex flex-col justify-between min-h-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/10 hover:border-brand-orange/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange rounded-t-2xl"></div>
                  <div>
                    <span className="font-display text-4xl font-extralight text-brand-orange block mb-4">05</span>
                    <h3 className="text-lg font-semibold text-black mb-3">Long-Term Growth</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      Build today and benefit tomorrow through sustainable wealth creation.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Item 6 */}
              <ScrollReveal animation="fade-up" delay={500}>
                <div className="liquid-glass-light p-8 rounded-2xl flex flex-col justify-between min-h-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/10 hover:border-brand-blue/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue rounded-t-2xl"></div>
                  <div>
                    <span className="font-display text-4xl font-extralight text-brand-blue block mb-4">06</span>
                    <h3 className="text-lg font-semibold text-black mb-3">People Network</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      Join a global network of successful asset builders and people.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED OPPORTUNITIES (DARK THEME - LUXURY ASSET BOARD LAYOUT) */}
      <section id="plans" className="py-32 bg-black border-t border-white/10 scroll-mt-6 relative overflow-hidden">
        {/* Animated background blobs matching logo colors (Blue & Orange/Gold) */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[130px] pointer-events-none animate-drift-slow z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none animate-drift-slower z-0"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-3xl mb-16 text-left">

            <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-white mt-3 mb-4">
              Featured Asset-Based Opportunities
            </h2>
            <p className="text-slate-400 font-light">
              100% Asset-Backed · Real Value Focused. Select your primary ownership pathway below.
            </p>

            {/* Custom Tab Switcher */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setActiveTab("gold")}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                  activeTab === "gold"
                    ? "bg-brand-orange text-black border-brand-orange shadow-lg shadow-brand-orange/20"
                    : "bg-transparent text-slate-400 border-white/10 hover:text-white"
                }`}
              >
                Gold Jewellery Plan
              </button>
              <button
                onClick={() => setActiveTab("property")}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                  activeTab === "property"
                    ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20"
                    : "bg-transparent text-slate-400 border-white/10 hover:text-white"
                }`}
              >
                Property Plan
              </button>
            </div>
          </div>

          <ScrollReveal animation="zoom-in" threshold={0.05} className="w-full">
            {activeTab === "gold" ? (
              <div className="liquid-glass border border-brand-orange/20 rounded-2xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center animate-fade-in">
                {/* Left details */}
                <div className="lg:col-span-7 text-left">
                  <span className="text-xs font-bold text-brand-orange tracking-widest uppercase">Gold Jewellery Plan</span>
                  <h3 className="text-2xl sm:text-3xl font-normal text-white mt-2 mb-4">
                    Gold Jewellery Plan
                  </h3>
                  <p className="text-slate-300 leading-relaxed font-light mb-6">
                    Transform your wealth into timeless gold assets with lasting value.
                  </p>

                  {/* Specs sheet styling - Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-white/10 py-6 mb-8 text-left">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">100% asset-backed structure</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">Tangible gold jewellery ownership</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">Long-term value potential</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">Family wealth protection</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://wa.me/447537166377?text=Interested%20in%20Gold%20Jewellery%20Plan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-orange text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-amber-500 transition-colors"
                    >
                      Explore Gold Plan
                    </a>
                    <a
                      href="https://login.oneempirecommunity.com/Register.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-lg text-sm border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Access Member Portal
                    </a>
                  </div>
                </div>

                {/* Right Visual: Gold Asset Image */}
                <div className="lg:col-span-5 flex justify-center items-center py-6">
                  <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-brand-orange/30 shadow-[0_15px_45px_rgba(230,126,0,0.15)] transition-all duration-500 hover:scale-[1.02]">
                    <Image
                      src="/gold_assets.png"
                      alt="Gold Custody Assets Allocation"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="liquid-glass border border-brand-blue/20 rounded-2xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center animate-fade-in">
                {/* Left details */}
                <div className="lg:col-span-7 text-left">
                  <span className="text-xs font-bold text-brand-blue tracking-widest uppercase">Property Plan</span>
                  <h3 className="text-2xl sm:text-3xl font-normal text-white mt-2 mb-4">
                    Property Plan
                  </h3>
                  <p className="text-slate-300 leading-relaxed font-light mb-6">
                    Build lasting wealth through real estate with long-term growth.
                  </p>

                  {/* Specs sheet styling - Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-white/10 py-6 mb-8 text-left">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">Real estate ownership opportunities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">Property value appreciation potential</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">Passive income opportunities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light text-slate-300">Long-term asset security</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://wa.me/447537166377?text=Interested%20in%20Property%20Plan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-blue text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-brand-blue-hover transition-colors"
                    >
                      Explore Property Plan
                    </a>
                    <a
                      href="https://login.oneempirecommunity.com/Register.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-lg text-sm border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Access Member Portal
                    </a>
                  </div>
                </div>

                {/* Right Visual: Property Asset Image */}
                <div className="lg:col-span-5 flex justify-center items-center py-6">
                  <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-brand-blue/30 shadow-[0_15px_45px_rgba(29,78,216,0.15)] transition-all duration-500 hover:scale-[1.02]">
                    <Image
                      src="/property_assets.png"
                      alt="UK Real Estate Asset Allocation"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      <section className="py-32 bg-brand-light text-black border-t border-slate-200 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[350px] h-[350px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Quote Card Layout (Left Column) */}
          <ScrollReveal animation="fade-right" className="lg:col-span-5 flex justify-start">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xl flex flex-col transition-all duration-300 hover:scale-[1.01]">
              {/* Premium Gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-brand-gold to-brand-blue z-20"></div>
              
              {/* Top Half: Premium Boardroom Photo with baked-in company logo */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src="/boardroom_with_logo.png"
                  alt="One Empire London Boardroom"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Bottom Half: Quote */}
              <div className="p-8 text-left flex flex-col justify-between flex-1">
                <div>
                  <span className="text-brand-orange font-display text-4xl font-extrabold leading-none block -mt-2">&ldquo;</span>
                  <p className="text-slate-700 text-sm italic font-light leading-relaxed mb-6 mt-1">
                    We don't just build portfolios. We build futures, protect families, and create legacies
                    that last for generations.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-brand-blue"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    ONE EMPIRE TEAM
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column Content details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <ScrollReveal animation="fade-left">
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-black mb-6">
                To help families move from liabilities to ownership
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-10 font-light">
                Our Commitment: building transparent, asset-backed plans with your family's future at heart.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {/* Empowerment Card */}
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[180px] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange"></div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-black text-sm uppercase tracking-wider">Empowerment</h4>
                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m-3.418 4.818l-3.586 3.586A2 2 0 018.586 18H5v-3.586a2 2 0 01.586-1.414l3.586-3.586m0 0a5 5 0 117.072 7.072l-3.572-3.572" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    We believe every family deserves the tools and knowledge to build lasting wealth.
                  </p>
                </div>
              </ScrollReveal>

              {/* Integrity Card */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[180px] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue"></div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-black text-sm uppercase tracking-wider">Integrity</h4>
                    <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.957 11.957 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    100% transparent, asset-backed plans with your family's future at heart.
                  </p>
                </div>
              </ScrollReveal>

              {/* Growth Card */}
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[180px] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange"></div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-black text-sm uppercase tracking-wider">Growth</h4>
                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Building generational wealth that grows with you, today and tomorrow.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ELITE COMMUNITY NETWORK (DARK THEME - PURE BLACK WITH GLOWS & LIQUID-GLASS) */}
      <section id="community" className="py-32 bg-black border-t border-white/10 scroll-mt-6 relative overflow-hidden">
        {/* Animated background glows matching brand colors */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none animate-drift-slow z-0"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none animate-drift-slower z-0"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <ScrollReveal animation="fade-up" className="max-w-3xl mb-16 text-left">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-white mt-3 mb-6">
              Why People Join Us
            </h2>
            <p className="text-slate-400 font-light">
              Join an exclusive community of visionaries focused on building wealth through tangible assets.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Item 1 */}
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="group overflow-hidden rounded-xl bg-slate-950/40 border border-white/10 hover:border-brand-orange/40 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[360px] h-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src="/join_asset.png"
                    alt="100% Asset-Based Opportunities"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-brand-orange uppercase block tracking-widest mb-3">01 / Assets</span>
                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
                      100% Asset-Based Opportunities
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Every plan is backed by real, tangible assets you can see and own
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Item 2 */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="group overflow-hidden rounded-xl bg-slate-950/40 border border-white/10 hover:border-brand-orange/40 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[360px] h-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src="/join_gold.png"
                    alt="Gold Jewellery Ownership Options"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-brand-orange uppercase block tracking-widest mb-3">02 / Gold</span>
                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
                      Gold Jewellery Ownership Options
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Invest in timeless precious metal assets that never lose value
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Item 3 */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="group overflow-hidden rounded-xl bg-slate-950/40 border border-white/10 hover:border-brand-blue/40 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[360px] h-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src="/join_property.png"
                    alt="Property Growth Opportunities"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-brand-blue uppercase block tracking-widest mb-3">03 / Property</span>
                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-brand-blue transition-colors duration-300">
                      Property Growth Opportunities
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Build wealth through real estate with guaranteed appreciation
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Item 4 */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="group overflow-hidden rounded-xl bg-slate-950/40 border border-white/10 hover:border-brand-orange/40 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[360px] h-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src="/join_mindset.png"
                    alt="Wealth Creation Mindset"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-brand-orange uppercase block tracking-widest mb-3">04 / Mindset</span>
                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
                      Wealth Creation Mindset
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Learn from successful asset builders who've done it before
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Item 5 */}
            <ScrollReveal animation="fade-up" delay={400}>
              <div className="group overflow-hidden rounded-xl bg-slate-950/40 border border-white/10 hover:border-brand-blue/40 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[360px] h-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src="/join_support.png"
                    alt="Global Community Support"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-brand-blue uppercase block tracking-widest mb-3">05 / Support</span>
                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-brand-blue transition-colors duration-300">
                      Global Community Support
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Connect with people worldwide in an exclusive network
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Item 6 */}
            <ScrollReveal animation="fade-up" delay={500}>
              <div className="group overflow-hidden rounded-xl bg-slate-950/40 border border-white/10 hover:border-brand-blue/40 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[360px] h-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src="/join_network.png"
                    alt="Strong Business Network"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-brand-blue uppercase block tracking-widest mb-3">06 / Network</span>
                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-brand-blue transition-colors duration-300">
                      Strong Business Network
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Build relationships that last with elite entrepreneurs
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-32 bg-brand-light text-black scroll-mt-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Interactive Accordion */}
          <ScrollReveal animation="fade-right" className="lg:col-span-7 text-left">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-black mb-6">
              Be Part of Something Extraordinary
            </h2>
            <p className="text-slate-600 text-base leading-relaxed font-light mb-10">
              Our community is not only about wealth creation — it is about transformation, empowerment, and building a legacy that lasts for generations.
            </p>

            <div className="space-y-4">
              {/* Mentorship Accordion */}
              <div className="border-b border-slate-200 pb-4">
                <button
                  onClick={() => setActivePurpose("mentorship")}
                  className="w-full flex justify-between items-center text-left py-3 group"
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${
                    activePurpose === "mentorship" ? "text-brand-orange" : "text-black group-hover:text-brand-orange"
                  }`}>
                    Exclusive Mentorship
                  </span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${
                    activePurpose === "mentorship" ? "rotate-90 text-brand-orange" : "text-slate-400"
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${
                  activePurpose === "mentorship" ? "max-h-[100px] opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Learn directly from millionaires who built their wealth through assets.
                  </p>
                </div>
              </div>

              {/* Events Accordion */}
              <div className="border-b border-slate-200 pb-4">
                <button
                  onClick={() => setActivePurpose("events")}
                  className="w-full flex justify-between items-center text-left py-3 group"
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${
                    activePurpose === "events" ? "text-brand-blue" : "text-black group-hover:text-brand-blue"
                  }`}>
                    Private Events & Networking
                  </span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${
                    activePurpose === "events" ? "rotate-90 text-brand-blue" : "text-slate-400"
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${
                  activePurpose === "events" ? "max-h-[100px] opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Connect at exclusive gatherings with elite entrepreneurs.
                  </p>
                </div>
              </div>

              {/* Support Accordion */}
              <div className="border-b border-slate-200 pb-4">
                <button
                  onClick={() => setActivePurpose("support")}
                  className="w-full flex justify-between items-center text-left py-3 group"
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${
                    activePurpose === "support" ? "text-emerald-600" : "text-black group-hover:text-emerald-600"
                  }`}>
                    24/7 Community Support
                  </span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${
                    activePurpose === "support" ? "rotate-90 text-emerald-600" : "text-slate-400"
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${
                  activePurpose === "support" ? "max-h-[100px] opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Get answers and guidance whenever you need it.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Visual Mockup Showcase Cards */}
          <ScrollReveal animation="fade-left" delay={200} className="lg:col-span-5 flex justify-center lg:justify-end py-6">
            <div className="relative w-full max-w-sm min-h-[340px] rounded-2xl bg-slate-950 border border-slate-800 p-8 flex flex-col justify-between shadow-2xl text-left transition-all duration-500 hover:scale-[1.02] h-full">
              {/* Dynamic light glows behind the card matching active selection */}
              <div className={`absolute inset-0 rounded-2xl opacity-10 blur-xl transition-all duration-500 -z-10 ${
                activePurpose === 'mentorship' ? 'bg-brand-orange' :
                activePurpose === 'events' ? 'bg-brand-blue' : 'bg-emerald-500'
              }`}></div>

              {activePurpose === 'mentorship' && (
                <div className="animate-fade-in flex flex-col justify-between h-full min-h-[280px] w-full">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">Service Registry</span>
                      <h4 className="text-sm font-semibold text-white tracking-wider uppercase mt-0.5">Executive Counsel</h4>
                    </div>
                    <div className="w-8 h-6 rounded bg-gradient-to-br from-brand-gold to-brand-orange border border-brand-gold/30 flex items-center justify-center">
                      <div className="w-4 h-4 border-r border-b border-black/20"></div>
                    </div>
                  </div>
                  <div className="my-8">
                    <span className="font-mono text-xs tracking-widest text-brand-gold block mb-1">DEED REF: MENTOR-OE-992</span>
                    <span className="text-xl font-light text-slate-300">Direct Portal Connection to Senior Allocators</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/5 pt-4 text-xs font-mono text-slate-400">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-slate-500 block">DESK</span>
                      <span className="text-white">GENEVA & LDN</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] uppercase tracking-widest text-slate-500 block">STATUS</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        CONNECTED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activePurpose === 'events' && (
                <div className="animate-fade-in flex flex-col justify-between h-full min-h-[280px] w-full">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">Access Level</span>
                      <h4 className="text-sm font-semibold text-white tracking-wider uppercase mt-0.5">VIP Summit Pass</h4>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center border border-brand-blue/30 text-white font-mono text-xs">
                      VIP
                    </div>
                  </div>
                  <div className="my-8">
                    <span className="font-mono text-[10px] tracking-widest text-brand-blue block mb-1">LOCATION: MAYFAIR, LONDON</span>
                    <span className="text-xl font-light text-slate-300">Annual Generational Capital Assembly</span>
                  </div>
                  {/* Barcode visual using divs */}
                  <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                      <span>Invitation Only</span>
                      <span>#OE-77893-X</span>
                    </div>
                    <div className="h-8 flex gap-0.5 bg-white/5 rounded px-2 items-center overflow-hidden">
                      <div className="w-1 h-full bg-slate-400"></div>
                      <div className="w-0.5 h-full bg-slate-400"></div>
                      <div className="w-2 h-full bg-slate-400"></div>
                      <div className="w-1 h-full bg-slate-400"></div>
                      <div className="w-0.5 h-full bg-slate-400"></div>
                      <div className="w-1.5 h-full bg-slate-400"></div>
                      <div className="w-0.5 h-full bg-slate-400"></div>
                      <div className="w-2.5 h-full bg-slate-400"></div>
                      <div className="w-1.5 h-full bg-slate-400"></div>
                      <div className="w-0.5 h-full bg-slate-400"></div>
                      <div className="w-2.5 h-full bg-slate-400"></div>
                      <div className="w-1 h-full bg-slate-400"></div>
                      <div className="w-0.5 h-full bg-slate-400"></div>
                      <div className="w-1.5 h-full bg-slate-400"></div>
                      <div className="w-0.5 h-full bg-slate-400"></div>
                      <div className="w-2 h-full bg-slate-400"></div>
                      <div className="w-1 h-full bg-slate-400"></div>
                    </div>
                  </div>
                </div>
              )}

              {activePurpose === 'support' && (
                <div className="animate-fade-in flex flex-col justify-between h-full min-h-[280px] w-full">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">Ops Desk Status</span>
                      <h4 className="text-sm font-semibold text-white tracking-wider uppercase mt-0.5">Control Center</h4>
                    </div>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="my-8 flex flex-col gap-3 font-mono text-xs text-slate-400">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span>Active Members</span>
                      <span className="font-semibold text-white">5,000+</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span>Assets Value</span>
                      <span className="font-semibold text-brand-gold">$50M+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Verification</span>
                      <span className="font-semibold text-emerald-400">100% Asset-Backed</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/5 pt-4 text-[10px] font-mono text-slate-500">
                    <div>SECURE · TRUSTED</div>
                    <div className="text-emerald-400 font-semibold uppercase tracking-wider">Growing Fast</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION (DARK THEME - PURE BLACK) */}
      <section id="contact" className="py-28 bg-black border-t border-white/10 text-center scroll-mt-6">
        <ScrollReveal animation="zoom-in" className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-normal text-white mt-3 mb-6">
            Join One Empire Today
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10 font-light">
            Don't just earn money. Build real assets.<br />One Vision. One Team. One Empire.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="https://login.oneempirecommunity.com/Register.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-slate-100 transition-colors text-center hover:scale-[1.02]"
            >
              Join Now
            </a>
            <a
              href="#plans"
              className="w-full sm:w-auto bg-white/5 border border-white/20 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              Gold Plan
            </a>
            <a
              href="#plans"
              className="w-full sm:w-auto bg-white/5 border border-white/20 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              Property Plan
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* 9. FOOTER (LIGHT THEME - WHITE BACKGROUND) */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Top Row: Logo, Brand Info & Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 pb-10 border-b border-slate-100">
            <div className="md:col-span-8 flex flex-col items-start gap-3">
              <a href="#" className="flex items-center">
                <div className="relative w-36 h-12">
                  <Image
                    src="/logo.png"
                    alt="One Empire Logo"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </a>
              <p className="text-sm leading-relaxed max-w-lg font-light text-slate-500">
                Building Real Assets. Creating Real Wealth. Join thousands of smart people transforming their financial future.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col md:items-end gap-3">
              <h3 className="text-slate-900 text-xs font-bold tracking-widest uppercase">Quick Navigation</h3>
              <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#why-choose" className="hover:text-emerald-600 transition-colors">Why Choose Us</a>
                <a href="#plans" className="hover:text-emerald-600 transition-colors">Our Plans</a>
                <a href="#community" className="hover:text-emerald-600 transition-colors">Community</a>
              </div>
            </div>
          </div>

          {/* Middle Section: Our Global Offices Cards (Full Width 3 Columns) */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Our Global Offices
              </h3>
              <span className="text-xs font-medium text-slate-400">3 Locations Worldwide</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dubai Office */}
              <div className="group relative p-5 bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1 overflow-hidden">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-900 text-base tracking-tight truncate">Dubai</span>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 rounded-full">
                      🇦🇪 UAE
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed mb-5 font-normal">
                    1104, 11th Floor, The Tower Plaza Hotel, Sheikh Zayed Road, Dubai, UAE
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Dubai%2C+1104%2C+11th+Floor%2C+The+Tower+Plaza+Hotel%2C+Sheikh+Zayed+Road%2C+Dubai%2C+UAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full py-2.5 px-4 bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl text-xs font-semibold transition-all duration-200 group/btn shadow-2xs"
                >
                  <span>View on Map</span>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              {/* Manchester Office */}
              <div className="group relative p-5 bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1 overflow-hidden">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-900 text-base tracking-tight truncate">Manchester</span>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 rounded-full">
                      🇬🇧 UK
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed mb-5 font-normal">
                    459-461, Cheetham Hill Road, M8 9PA, Manchester, UK
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Manchester%2C+459-461%2C+Cheetham+Hill+Road%2C+M8+9PA%2C+Manchester%2C+UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full py-2.5 px-4 bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl text-xs font-semibold transition-all duration-200 group/btn shadow-2xs"
                >
                  <span>View on Map</span>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              {/* Casablanca Office */}
              <div className="group relative p-5 bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1 overflow-hidden">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-900 text-base tracking-tight truncate">Casablanca</span>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-full">
                      🇲🇦 Morocco
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed mb-5 font-normal">
                    2 Bis, Rue Abou Abdellah Nafii, Maarif, Casablanca 20100, Morocco
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Casablanca%2C+2+Bis%2C+Rue+Abou+Abdellah+Nafii%2C+Maarif%2C+Casablanca+20100%2C+Morocco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full py-2.5 px-4 bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl text-xs font-semibold transition-all duration-200 group/btn shadow-2xs"
                >
                  <span>View on Map</span>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-slate-400">
            <p>&copy; 2026 One Empire Community. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sidebar (Drawer) - Rendered globally at root level to prevent stacking context z-index overlap issues */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Sidebar content container */}
        <div className={`absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-black border-l border-white/10 p-8 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div>
            {/* Header inside sidebar */}
            <div className="flex items-center justify-between mb-12">
              <div className="relative w-28 h-12">
                <Image
                  src="/logo.png"
                  alt="One Empire Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Vertical menu links */}
            <div className="flex flex-col gap-6 text-left">
              <a
                href="#why-choose"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-300 hover:text-white transition-colors py-2 border-b border-white/5"
              >
                Why Choose
              </a>
              <a
                href="#plans"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-300 hover:text-white transition-colors py-2 border-b border-white/5"
              >
                Plans
              </a>
              <a
                href="#community"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-300 hover:text-white transition-colors py-2 border-b border-white/5"
              >
                Community
              </a>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-col gap-4 mt-8">
            <a
              href="https://login.oneempirecommunity.com/login.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 text-sm text-slate-300 border border-white/10 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              Login
            </a>
            <a
              href="https://login.oneempirecommunity.com/Register.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 text-sm text-slate-300 border border-white/10 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              Registration
            </a>
            <a
              href="https://login.oneempirecommunity.com/Register.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 text-sm font-semibold bg-white text-black rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="https://wa.me/447537166377"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.518 2.266 2.27 3.51 5.284 3.509 8.492-.008 6.66-5.347 11.997-11.957 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.489 4.886 1.49 5.518.002 10.01-4.486 10.015-10.01.002-2.673-1.036-5.188-2.925-7.078C16.85 1.67 14.34 1.63 11.968 1.63c-5.52.002-10.014 4.496-10.018 10.02-.002 1.8.484 3.5 1.408 5.003L2.33 21.647l5.048-1.32c1.472.82 2.99 1.258 4.27 1.258z" />
          </svg>
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
          </span>
        </a>
      </div>
    </div>
  );
}
