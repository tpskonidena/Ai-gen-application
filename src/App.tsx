import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, ShieldAlert, Cpu, Database, Wifi, AlertTriangle } from 'lucide-react';

const GlitchText = ({ children, className = "" }: { children: string; className?: string }) => {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <span className="glitch-text" data-text={children}>
        {children}
      </span>
    </div>
  );
};

interface LogEntry {
  text: string;
  type: "info" | "error" | "warning" | "success";
}

const TerminalLine: React.FC<{ text: string; delay?: number; type?: LogEntry['type'] }> = ({ text, delay = 0, type = "info" }) => {
  const colors: Record<LogEntry['type'], string> = {
    info: "text-syn-cyan",
    error: "text-syn-magenta",
    warning: "text-syn-yellow",
    success: "text-green-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.1 }}
      className={`font-retro text-xl flex gap-2 ${colors[type]}`}
    >
      <span className="opacity-50">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
      <span className="font-bold">{">"}</span>
      <span>{text}</span>
    </motion.div>
  );
};

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState("CONNECTED");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startupSequence: LogEntry[] = [
      { text: "INITIALIZING VOID_TERMINAL v0.9.4b...", type: "info" },
      { text: "CHECKING SYSTEM INTEGRITY...", type: "info" },
      { text: "WARNING: MEMORY LEAK DETECTED IN SECTOR 7G", type: "warning" },
      { text: "BYPASSING CORRUPTED NODES...", type: "info" },
      { text: "CONNECTING TO SYNTH_VOICE HUB...", type: "info" },
      { text: "ENCRYPTED HANDSHAKE SUCCESSFUL", type: "success" },
      { text: "PROTOCOL: NULL-DATA ESTABLISHED", type: "info" },
      { text: "AWAITING HUMAN INTERFACE...", type: "info" },
    ];

    let timeout: NodeJS.Timeout;
    startupSequence.forEach((log, index) => {
      timeout = setTimeout(() => {
        setLogs(prev => [...prev.slice(-15), log]);
        if (index === startupSequence.length - 1) setLoading(false);
      }, index * 400);
    });

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Periodic random errors to maintain tone
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const messages: LogEntry[] = [
        { text: "PACKET LOSS DETECTED", type: "error" },
        { text: "RECALIBRATING NEURAL NET...", type: "info" },
        { text: "UNAUTHORIZED ACCESS ATTEMPT BLOCKED", type: "warning" },
        { text: "SYNCHRONIZING VOID_TICKS...", type: "info" },
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [...prev.slice(-15), randomMsg]);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative overflow-hidden select-none">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--color-syn-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-syn-cyan) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Screen Tear Layers */}
      <div className="absolute inset-0 pointer-events-none tear-layer opacity-20 z-40 bg-syn-magenta h-1 w-full" style={{ top: '20%', '--delay': '1s' } as any} />
      <div className="absolute inset-0 pointer-events-none tear-layer opacity-10 z-40 bg-syn-cyan h-[2px] w-full" style={{ top: '65%', '--delay': '2.5s' } as any} />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 terminal-outline p-4 bg-syn-void/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <TerminalIcon className="w-8 h-8 animate-pulse text-syn-magenta" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tighter leading-none">
              <GlitchText>VOID_TERMINAL</GlitchText>
            </h1>
            <span className="text-[10px] font-mono opacity-60">SYSTEM STATUS: {status} // LATENCY: 0.04ms</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[12px] font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-syn-yellow" />
            <span>LOAD: 88%</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-syn-cyan" />
            <span>DB: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-syn-magenta" />
            <span>PING: 12ms</span>
          </div>
        </div>
      </header>

      {/* Main UI */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 z-10">
        {/* Terminal Logs */}
        <section className="lg:col-span-3 terminal-outline bg-syn-void/50 backdrop-blur-md p-4 flex flex-col relative h-[50vh] lg:h-auto overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-30">
            <ShieldAlert className="w-24 h-24" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pb-4" ref={scrollRef}>
            {logs.map((log, i) => (
              <TerminalLine key={i} text={log.text} delay={0} type={log.type} />
            ))}
          </div>
          <div className="mt-auto border-t border-syn-cyan/30 pt-4 flex items-center gap-2 text-syn-cyan">
            <span className="text-syn-magenta font-bold blink">_</span>
            <input 
              type="text" 
              className="bg-transparent border-none outline-none flex-1 font-retro text-xl placeholder:opacity-30"
              placeholder="ENTER COMMAND..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value;
                  if (!val) return;
                  setLogs(prev => [...prev.slice(-15), { text: `EXECUTING: ${val.toUpperCase()}`, type: "info" }]);
                  e.currentTarget.value = '';
                  
                  // Easter eggs
                  setTimeout(() => {
                    if (val.toLowerCase() === 'help') {
                      setLogs(prev => [...prev, { text: "UNAVAILABLE // SECURITY RESTRICTIONS OVERRIDE REQUIRED", type: "error" }]);
                    } else if (val.toLowerCase() === 'iamroot') {
                      setLogs(prev => [...prev, { text: "ACCESS GRANTED // WELCOME CREATOR", type: "success" }]);
                      setStatus("ROOT_OVERRIDE");
                    } else {
                      setLogs(prev => [...prev, { text: `UNKNOWN COMMAND: ${val.toUpperCase()}`, type: "error" }]);
                    }
                  }, 500);
                }
              }}
            />
          </div>
        </section>

        {/* Sidebar Controls */}
        <aside className="lg:col-span-1 space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="terminal-outline p-6 bg-syn-magenta/10 border-syn-magenta text-syn-magenta cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <h2 className="font-bold uppercase tracking-widest">Override Protocol</h2>
            </div>
            <p className="text-[10px] opacity-70 mb-4 whitespace-pre-wrap">
              DANGER: MANUAL OVERRIDE MAY CAUSE PERMANENT SOUL DE-SYNC OR HARDWARE COMBUSTION.
            </p>
            <button className="w-full border border-syn-magenta py-2 text-sm font-bold uppercase hover:bg-syn-magenta hover:text-syn-void transition-colors">
              Initiate Purge
            </button>
          </motion.div>

          <div className="terminal-outline p-4 space-y-4 bg-syn-void/40">
            <h3 className="text-xs opacity-50 uppercase tracking-tighter">Diagnostic Readings</h3>
            {[
              { label: "Reality Index", val: "0.992", color: "text-syn-cyan" },
              { label: "Memory Depth", val: "∞ TB", color: "text-syn-magenta" },
              { label: "Entropy", val: `${(Math.random() * 100).toFixed(1)}%`, color: "text-syn-yellow" },
              { label: "Sync Rate", val: "99.9%", color: "text-green-400" },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-end border-b border-syn-cyan/10 pb-1">
                <span className="text-[10px] uppercase">{stat.label}</span>
                <span className={`font-retro text-xl ${stat.color}`}>{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="terminal-outline p-4 bg-syn-void/40 relative overflow-hidden">
           <div className="flex flex-col gap-2">
             <div className="h-1 bg-syn-cyan/20 relative overflow-hidden">
                <motion.div 
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-1/3 bg-syn-cyan shadow-[0_0_10px_var(--color-syn-cyan)]"
                />
             </div>
             <span className="text-[8px] opacity-40 uppercase text-center">Transmitting data to NULL_HUB</span>
             <div className="flex justify-center gap-1">
               {[...Array(8)].map((_, i) => (
                 <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 h-3 bg-syn-magenta"
                 />
               ))}
             </div>
           </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="mt-8 flex flex-col md:flex-row justify-between items-center text-[10px] opacity-40 gap-4">
        <span>© 1999-20XX VOID_CORP. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-4">
          <span className="hover:opacity-100 cursor-help">PRIVACY_NULL</span>
          <span className="hover:opacity-100 cursor-help">TERMS_VOID</span>
          <span className="hover:opacity-100 cursor-help">REPORT_GLITCH</span>
        </div>
      </footer>

      {/* CRT Curvature / Scanline Overlay Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 ring-inset ring-[40px] md:ring-[100px] ring-syn-void/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      
      {/* Noise flickering overlay */}
      <motion.div 
        animate={{ opacity: [0.05, 0.1, 0.05, 0.08, 0.05] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="pointer-events-none fixed inset-0 z-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"
      />
      
      <style>{`
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        ::selection { background: var(--color-syn-cyan); color: var(--color-syn-void); }
      `}</style>
    </div>
  );
}
