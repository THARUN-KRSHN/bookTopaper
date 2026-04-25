"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Folder,
  Search,
  Grid,
  List as ListIcon,
  Check,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useUIStore } from "@/lib/store";

const CursorIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    <path
      d="M5.5 3.5L18.5 10.5L12 12.5L9.5 19.5L5.5 3.5Z"
      fill="black"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const MAX_STEPS = 10;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [progressItem, setProgressItem] = useState(-1);
  const { setAuthModalOpen, setAuthMode } = useUIStore();
  const [isPaused, setIsPaused] = useState(false);

  const handleGetStarted = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  useEffect(() => {
    if (isPaused) return;

    let t: NodeJS.Timeout;

    const advance = (delay: number, nextStep: number) => {
      t = setTimeout(() => {
        setStep(nextStep);
      }, delay);
    };

    switch (step) {
      case 0:
        advance(2400, 1);
        break;
      case 1:
        advance(3500, 2);
        break;
      case 2:
        // Inner progress simulation
        const p0 = setTimeout(() => setProgressItem(0), 400);
        const p1 = setTimeout(() => setProgressItem(1), 1400);
        const p2 = setTimeout(() => setProgressItem(2), 2400);
        const p3 = setTimeout(() => setProgressItem(3), 3200);
        const p4 = setTimeout(() => setProgressItem(4), 4500); 
        t = setTimeout(() => setStep(3), 5000);
        return () => {
          clearTimeout(p0); clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); clearTimeout(p4); clearTimeout(t);
        };
      case 3:
        advance(2800, 4);
        break;
      case 4:
        advance(4000, 5); // Exam UI
        break;
      case 5:
        advance(2800, 6);
        break;
      case 6:
        advance(3500, 7); // Feedback UI
        break;
      case 7:
        advance(2800, 8);
        break;
      case 8:
        advance(4000, 9); // Dashboard UI
        break;
      case 9:
        advance(3000, 10);
        break;
      case 10:
        // Final screen, no auto-advance
        break;
    }

    return () => clearTimeout(t);
  }, [step, isPaused]);

  // Handle manual navigation
  const goToNext = () => setStep((s) => Math.min(s + 1, MAX_STEPS));
  const restart = () => {
    setStep(0);
    setProgressItem(-1);
    setIsPaused(false);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#FDFCF8] overflow-hidden text-[#1A1916] font-sohne flex flex-col justify-center items-center">
      
      {/* Background Grid Pattern (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      {/* Header NavBar */}
      <div className="absolute top-0 w-full p-4 md:p-8 flex items-center justify-between z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#6B6860] hover:text-[#1A1916] transition-colors group bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm md:text-base">Exit Demo</span>
        </Link>

        {/* Global Progress Indicators */}
        <div className="hidden md:flex flex-1 max-w-[300px] mx-8 gap-1.5">
          {Array.from({ length: MAX_STEPS }).map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-[#EAEAEA] rounded-full overflow-hidden">
              <div 
                className={`h-full ${i < step ? 'bg-accent-primary' : i === step ? 'bg-accent-primary/50' : 'bg-transparent'} transition-all duration-300`} 
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {step < MAX_STEPS && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-white text-text-primary px-3 md:px-4 py-2 border border-[#EBEBEB] rounded-xl text-sm font-medium shadow-sm hover:bg-[#F5F5F5] transition-all flex items-center justify-center"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play size={16} className="fill-current" /> : <Pause size={16} className="fill-current" />}
            </button>
          )}
          {step < MAX_STEPS && (
            <button
              onClick={goToNext}
              className="bg-white text-text-primary px-3 md:px-4 py-2 border border-[#EBEBEB] rounded-xl text-sm font-medium shadow-sm hover:bg-[#F5F5F5] transition-all"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleGetStarted}
            className="bg-accent-primary text-white px-4 md:px-6 py-2 rounded-xl text-sm md:text-base font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Main Slide Area */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center"
          >
            <p className="text-[#6B6860] font-styrene font-medium mb-6 uppercase tracking-widest text-sm">Step 1: Upload</p>
            <motion.div
              animate={{ scale: [1, 1, 0.95, 1] }}
              transition={{ times: [0, 0.7, 0.8, 1], duration: 2.4 }}
              className="bg-white border border-[#EBEBEB] text-[#1A1916] px-8 py-3.5 rounded-2xl shadow-sm text-lg font-medium tracking-tight"
            >
              Generate Exam
            </motion.div>
            <motion.div
              initial={{ x: 100, y: 150, opacity: 0 }}
              animate={{ x: 30, y: 35, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
              className="absolute z-10 pointer-events-none mt-8"
            >
              <CursorIcon />
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* macOS Style Window Content */}
            <div className="w-[800px] h-[550px] bg-white rounded-[14px] shadow-2xl border border-[#E0E0E0] overflow-hidden flex flex-col font-[-apple-system,BlinkMacSystemFont,sans-serif]">
              {/* Toolbar */}
              <div className="h-14 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center px-4 shrink-0 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex bg-white rounded border border-[#D1D1D1] shadow-sm px-2 py-1 items-center gap-2 text-[13px] font-medium text-black ml-4">
                    <Folder size={14} className="text-[#38AAEB] fill-[#38AAEB]" />
                    <span>Documents</span>
                    <ChevronDown size={14} className="text-[#888] ml-2" />
                  </div>
                </div>
                <div className="relative">
                  <Search size={12} className="absolute left-2 top-1.5 text-[#888]" />
                  <input type="text" placeholder="Search" className="text-[12px] pl-6 pr-2 py-1 bg-white border border-[#D1D1D1] rounded shadow-sm w-36 outline-none" />
                </div>
              </div>
              {/* Workspace */}
              <div className="flex flex-1 overflow-hidden bg-white">
                <div className="w-[180px] bg-[#F5F5F7] border-r border-[#E0E0E0] p-2 flex flex-col text-[13px]">
                  <span className="font-semibold text-[#A0A0A0] text-[11px] uppercase tracking-wider mb-2 ml-2 mt-2">Favorites</span>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-white bg-[#0060F0] rounded-md shadow-sm">
                    <Folder size={14} /> Documents
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-[#4D4D4D] rounded-md hover:bg-[#EAEAEA]">Downloads</div>
                </div>
                <div className="flex-1 p-6 relative">
                  <div className="grid grid-cols-3 gap-6">
                    <FolderItem name="Biology Notes" />
                    <FolderItem name="CS Question Bank" />
                    <motion.div
                      animate={{ backgroundColor: ["transparent", "#E0F0FE", "#E0F0FE"] }}
                      transition={{ times: [0, 0.4, 1], duration: 1.8 }}
                      className="flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer"
                    >
                      <Folder size={64} fill="#A5D8FD" className="text-[#65B7FA] mb-2" strokeWidth={1} />
                      <span className="text-[13px] font-medium text-black break-words text-center bg-transparent max-w-full">
                        Biology Unit 1
                      </span>
                    </motion.div>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <div className="px-4 py-1 rounded-md border border-[#D1D1D1] bg-white shadow-sm text-[13px] text-black">Cancel</div>
                    <motion.div 
                      animate={{ scale: [1, 1, 0.95, 1], backgroundColor: ["#007AFF", "#007AFF", "#005FCB", "#007AFF"] }}
                      transition={{ times: [0, 0.8, 0.9, 1], duration: 2.8 }}
                      className="px-6 py-1 rounded-md bg-[#007AFF] text-white shadow-sm text-[13px] font-medium tracking-wide flex items-center justify-center"
                    >
                      Open
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            {/* Simulated Cursor */}
            <motion.div
              initial={{ x: 200, y: 300, opacity: 0 }}
              animate={{ x: [200, 500, 500, 680], y: [300, 200, 200, 490], opacity: 1 }}
              transition={{ duration: 2.5, times: [0, 0.4, 0.7, 1], ease: "easeInOut" }}
              className="absolute z-10 pointer-events-none top-0 left-0"
            >
              <CursorIcon />
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-[24px] p-8 border border-[#EAEAEA] shadow-xl w-[440px]"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-medium text-xl text-[#1A1916]">Generating Exam</h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1916] animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1916] animate-pulse" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1916] animate-pulse" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
            <div className="space-y-6">
              <TaskItem text="Reading materials" status={ progressItem < 0 ? "idle" : progressItem === 0 ? "active" : "done" } number={1} />
              <TaskItem text="Extracting key concepts" status={ progressItem < 1 ? "idle" : progressItem === 1 ? "active" : "done" } number={2} />
              <TaskItem text="Synthesizing questions" status={ progressItem < 2 ? "idle" : progressItem === 2 ? "active" : "done" } number={3} />
              <TaskItem text="Building custom paper" status={ progressItem < 3 ? "idle" : progressItem === 3 ? "active" : "done" } number={4} />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.h2
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-[72px] font-styrene font-medium text-[#1A1916] text-center leading-[1.05] tracking-tight max-w-[1000px] mx-auto px-6 text-balance"
          >
            and builds your custom <br className="hidden md:block" />
            exam in seconds.
          </motion.h2>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
             <p className="text-[#6B6860] font-styrene font-medium mb-6 uppercase tracking-widest text-sm absolute -top-12">Step 2: Test</p>
            {/* Simulated Exam UI */}
            <div className="w-[700px] h-auto bg-white rounded-2xl shadow-xl border border-[#E0E0E0] overflow-hidden p-8 font-sohne flex flex-col">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#EAEAEA]">
                <div className="space-y-1">
                  <h4 className="font-styrene font-medium text-lg text-text-primary">Biology Unit 1 Mock</h4>
                  <p className="text-sm text-text-secondary">Question 3 of 20</p>
                </div>
                <div className="bg-[#FAF9F7] px-4 py-2 rounded-lg border border-[#EBEBEB] text-sm font-medium">12:45 Remaining</div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-6 text-text-primary">Which organelle is known as the powerhouse of the cell?</h3>
                <div className="space-y-3">
                  <OptionBox letter="A" text="Nucleus" />
                  <motion.div
                    animate={{ backgroundColor: ["#FFFFFF", "#FFFFFF", "#FFF0F0", "#FFF0F0"], borderColor: ["#EBEBEB", "#EBEBEB", "var(--accent-primary)", "var(--accent-primary)"] }}
                    transition={{ duration: 2.5, times: [0, 0.5, 0.6, 1] }}
                    className="flex text-lg items-center gap-4 p-4 rounded-xl border border-[#EBEBEB] bg-white cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F7] border border-[#EBEBEB] flex justify-center items-center font-medium text-sm text-[#6B6860]">B</div>
                    <span className="font-medium text-[#1A1916]">Mitochondria</span>
                  </motion.div>
                  <OptionBox letter="C" text="Ribosome" />
                  <OptionBox letter="D" text="Endoplasmic Reticulum" />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <motion.div 
                  animate={{ scale: [1, 1, 0.95, 1] }}
                  transition={{ times: [0, 0.8, 0.85, 1], duration: 3.5 }}
                  className="bg-[#1A1916] text-white px-6 py-2.5 rounded-xl font-medium"
                >
                  Confirm & Next
                </motion.div>
              </div>
            </div>
            
            {/* Cursor clicks option B then confirm */}
            <motion.div
              initial={{ x: 200, y: 350, opacity: 0 }}
              animate={{ x: [200, 300, 300, 550, 550], y: [350, 200, 200, 380, 380], opacity: 1 }}
              transition={{ duration: 3.5, times: [0, 0.4, 0.6, 0.8, 1], ease: "easeInOut" }}
              className="absolute z-10 pointer-events-none top-0 left-0"
            >
              <CursorIcon />
            </motion.div>
          </motion.div>
        )}

        {step === 5 && (
           <motion.h2
            key="step5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-[72px] font-styrene font-medium text-[#1A1916] text-center leading-[1.05] tracking-tight max-w-[1000px] mx-auto px-6 text-balance"
          >
            experience a calm, <span className="text-accent-primary">distraction-free</span>
            <br className="hidden md:block" />
            testing environment.
          </motion.h2>
        )}

        {step === 6 && (
           <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
             <p className="text-[#6B6860] font-styrene font-medium mb-6 uppercase tracking-widest text-sm absolute -top-12">Step 3: AI Review</p>
            {/* Simulated Feedback UI */}
            <div className="w-[600px] h-auto bg-white rounded-[24px] shadow-xl border border-[#E0E0E0] p-8 flex flex-col">
               <div className="flex gap-8 items-center mb-8 border-b border-[#EAEAEA] pb-8">
                 {/* Score Ring */}
                 <div className="relative w-28 h-28 flex shrink-0 justify-center items-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F5F3EF" strokeWidth="8"/>
                      <motion.circle 
                        initial={{ strokeDasharray: "0 999" }}
                        animate={{ strokeDasharray: "213 251" }} // roughly 85% of 2*PI*40
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        cx="50" cy="50" r="40" fill="transparent" stroke="#22C55E" strokeWidth="8" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-styrene font-semibold text-[#1A1916]">85%</span>
                    </div>
                 </div>
                 <div>
                   <h3 className="text-2xl font-medium text-[#1A1916] mb-2">Excellent Work!</h3>
                   <p className="text-[#6B6860] leading-relaxed">Your understanding of cellular structures is profound. However, we've identified some minor gaps in the Krebs cycle mechanisms.</p>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <h4 className="font-medium text-lg">Question Analysis</h4>
                 <div className="p-4 bg-[#FAF9F7] rounded-xl border border-[#EBEBEB]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Question 14</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Incorrect</span>
                    </div>
                    <p className="text-sm text-text-primary mb-3">Which phase of cellular respiration produces the most ATP?</p>
                    <div className="p-3 bg-white border border-[#EBEBEB] rounded-lg">
                      <p className="text-sm text-[#1A1916]"><span className="text-red-500 line-through mr-2">Krebs Cycle</span> <span className="font-medium text-green-600">Electron Transport Chain</span></p>
                      <p className="text-xs mt-3 text-[#6B6860] leading-relaxed"><strong className="text-[#1A1916]">AI Feedback:</strong> You confused the output stages. ETC produces ~34 ATP compared to Krebs cycle's ~2 ATP. Review Chapter 5 Section 3.</p>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {step === 7 && (
           <motion.h2
            key="step7"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-[72px] font-styrene font-medium text-[#1A1916] text-center leading-[1.05] tracking-tight max-w-[1000px] mx-auto px-6 text-balance"
          >
            get deep, personalized <br className="hidden md:block" />
            AI feedback instantly.
          </motion.h2>
        )}

        {step === 8 && (
           <motion.div
            key="step8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <p className="text-[#6B6860] font-styrene font-medium mb-6 uppercase tracking-widest text-sm absolute -top-12">Step 4: Grow</p>
            {/* Dashboard Mock */}
            <div className="w-[850px] h-[500px] bg-white rounded-3xl shadow-xl border border-[#E0E0E0] flex font-sohne overflow-hidden">
               {/* Sidebar */}
               <div className="w-[200px] border-r border-[#EAEAEA] bg-[#FAF9F7] p-6 flex flex-col gap-4">
                 <div className="w-8 h-8 rounded-full bg-accent-primary mb-6 flex justify-center items-center shadow-md">
                   <img src="/images/logo.png" alt="Logo" className="w-4 h-4 object-contain brightness-0 invert" />
                 </div>
                 <div className="w-full h-8 rounded-lg bg-[#EAEAEA]"></div>
                 <div className="w-full h-8 rounded-lg bg-transparent border border-[#EAEAEA]"></div>
                 <div className="w-full h-8 rounded-lg bg-transparent border border-[#EAEAEA]"></div>
               </div>
               {/* Main Canvas */}
               <div className="flex-1 p-8 overflow-hidden bg-white">
                  <h3 className="text-2xl font-styrene font-medium text-[#1A1916] mb-8">Study Dashboard</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="p-6 border border-[#EAEAEA] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <h4 className="font-medium mb-4">Topic Mastery</h4>
                        <ProgressBar label="Biology" value={85} />
                        <ProgressBar label="Chemistry" value={60} />
                        <ProgressBar label="Mathematics" value={92} />
                      </div>
                    </div>
                    <div className="space-y-6">
                       <div className="bg-[#FFF8F3] border border-[#FBE3DB] p-6 rounded-2xl">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-accent-primary mb-2 block">Action Plan</span>
                          <h4 className="font-styrene font-medium text-lg mb-2">Review Chemistry Formulae</h4>
                          <p className="text-sm text-accent-primary/80 mb-4">Your scores in stoichiometry dropped this week.</p>
                          <div className="h-10 bg-white rounded-xl border border-[#FBE3DB] flex items-center px-4 justify-between">
                            <span className="text-sm font-medium">Generate targeted exam</span>
                            <ArrowLeft size={16} className="rotate-180" />
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {step === 9 && (
           <motion.h2
            key="step9"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-[72px] font-styrene font-medium text-[#1A1916] text-center leading-[1.05] tracking-tight max-w-[1000px] mx-auto px-6 text-balance"
          >
            uncover your strengths and <br className="hidden md:block" />
            <span className="text-accent-primary">focus</span> on what matters.
          </motion.h2>
        )}

        {step === 10 && (
          <motion.div
            key="step10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-4xl bg-accent-primary flex items-center justify-center text-white shadow-lg shadow-accent-primary/20">
                <img src="/images/logo.png" alt="Logo" className="w-5 h-5 md:w-8 md:h-8 object-contain" />
              </div>
              <h1 className="text-4xl md:text-6xl font-styrene font-semibold tracking-tight">
                BookToPaper
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl font-styrene font-medium text-[#1A1916] mb-12 opacity-80">
              The AI for students
            </p>

            <div className="flex gap-4">
              <button
                onClick={restart}
                className="flex items-center gap-2 text-[#6B6860] hover:text-[#1A1916] border border-[#EBEBEB] px-6 h-12 md:h-14 rounded-xl font-medium transition-all bg-white shadow-sm"
              >
                <RotateCcw size={18} />
                Replay Demo
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-accent-primary hover:brightness-110 text-white px-8 h-12 md:h-14 md:text-lg rounded-xl font-medium transition-colors shadow-sm"
              >
                Get started free 
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----- Subcomponents for UI Mockups ----- //

function OptionBox({ letter, text }: { letter: string; text: string }) {
  return (
    <div className="flex text-lg items-center gap-4 p-4 rounded-xl border border-[#EBEBEB] bg-white">
      <div className="w-8 h-8 rounded-lg bg-[#FAF9F7] border border-[#EBEBEB] flex justify-center items-center font-medium text-sm text-[#6B6860]">{letter}</div>
      <span className="font-medium text-[#1A1916]">{text}</span>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-[#1A1916]">{label}</span>
        <span className="text-[#6B6860] font-medium">{value}%</span>
      </div>
      <div className="w-full h-2 bg-[#FAF9F7] rounded-full overflow-hidden border border-[#EBEBEB]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="h-full bg-accent-primary"
        />
      </div>
    </div>
  )
}

function FolderItem({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-black/5">
      <Folder size={64} fill="#A5D8FD" className="text-[#65B7FA] mb-2" strokeWidth={1} />
      <span className="text-[13px] font-medium text-black break-words text-center">{name}</span>
    </div>
  );
}

function TaskItem({ text, status, number }: { text: string; status: "idle" | "active" | "done"; number: number }) {
  return (
    <div className="flex items-center gap-4 text-lg">
      <div className="relative flex shrink-0 items-center justify-center w-7 h-7">
        {status === "idle" && (
          <div className="w-7 h-7 rounded-full border-[1.5px] border-[#CCC] flex items-center justify-center">
            <span className="text-xs font-semibold text-[#888]">{number}</span>
          </div>
        )}
        {status === "active" && (
          <div className="relative w-7 h-7 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-[#EAEAEA] border-t-accent-primary" />
            <span className="text-xs font-semibold text-black">{number}</span>
          </div>
        )}
        {status === "done" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-7 h-7 rounded-full bg-accent-primary flex items-center justify-center">
            <Check size={16} strokeWidth={3} className="text-white" />
          </motion.div>
        )}
      </div>
      <span className={`font-sohne tracking-tight transition-all duration-300 ${status === "idle" ? "text-[#A0A0A0]" : status === "active" ? "text-[#1A1916]" : "text-[#6B6860] line-through decoration-[#CCC]"}`}>
        {text}
      </span>
    </div>
  );
}
