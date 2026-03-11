/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Mail, 
  LayoutGrid
} from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, link, image, tags }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.5)]"
  >
    <div className="relative w-full h-[280px] md:h-[320px] overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
    
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(tag => (
          <span key={tag} className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white/10 text-white/50">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight" style={{ fontFamily: '"Noto Serif SC", "Songti SC", serif' }}>{title}</h3>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <p className="text-white/50 text-sm leading-relaxed max-w-xl">{description}</p>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-300 shrink-0"
        >
          View Project <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: { x: number; y: number; r: number; s: number; a: number; ta: number; ts: number }[] = [];
    const dpr = window.devicePixelRatio || 1;
    let animId: number;

    function initStars() {
      const w = window.innerWidth, h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.scale(dpr, dpr);
      const count = Math.floor((w * h) / 1800);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() < 0.9 ? Math.random() * 0.8 + 0.2 : Math.random() * 1.2 + 0.4,
          s: Math.random() * 0.15 + 0.03,
          a: Math.random(), ta: Math.random(),
          ts: Math.random() * 0.01 + 0.001
        });
      }
    }

    function animate() {
      const w = window.innerWidth, h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = '#FFF';
      stars.forEach(star => {
        star.y -= star.s;
        if (star.y < 0) { star.y = h; star.x = Math.random() * w; }
        if (star.a > star.ta) { star.a -= star.ts; if (star.a <= star.ta) star.ta = Math.random(); }
        else { star.a += star.ts; if (star.a >= star.ta) star.ta = Math.random(); }
        ctx!.globalAlpha = Math.max(0, Math.min(1, star.a));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx!.fill();
      });
      animId = requestAnimationFrame(animate);
    }

    initStars();
    animate();
    window.addEventListener('resize', initStars);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', initStars);
    };
  }, []);

  const projects = [
    {
      title: "Milo — AI 私人营养师",
      description: "多模态饮食助手，支持拍照、语音、文字记录。基于真实生活惯例生成个性化饮食计划，从计划到记录形成完整闭环。",
      link: "https://milo-intro.vercel.app/",
      image: "/幻灯片1.png",
      tags: ["Product Design", "Multi-modal AI", "Full-stack", "PWA", "Health Management"],
    },
    {
      title: "The Alchemy — 基于荣格理论的 AI 咨询师",
      description: "支持梦境解析、投射分析与原型人格对话，RAG 检索 9 卷荣格全集，12 个原型 Agent 各具独立人格与对话策略，维护跨会话长期记忆与个性化用户画像。",
      link: "https://alchemy-intro.vercel.app/",
      image: "/幻灯片2.png",
      tags: ["LLM Application", "RAG", "Multi-Agent", "Long-term Memory", "Psychology"],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Star Field Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-black from-30% via-[#060d18] via-60% to-[#0d1e35]" />
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/50 backdrop-blur-md' : 'py-8'}`}>
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium tracking-tight text-white/50">Janice Chen's Portfolio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#project-1" onClick={(e) => { e.preventDefault(); document.getElementById('project-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="text-sm font-semibold text-white/70 hover:text-white transition-colors cursor-pointer">Milo</a>
            <a href="#project-2" onClick={(e) => { e.preventDefault(); document.getElementById('project-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="text-sm font-semibold text-white/70 hover:text-white transition-colors cursor-pointer">The Alchemy</a>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero left + Projects right */}
        <section className="min-h-screen px-6 pt-28 pb-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:sticky md:top-[30vh] md:self-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/60">Building AI That Truly Matters</span>
              </div>
              
              <h1 className="text-4xl md:text-[3rem] lg:text-[4rem] font-light tracking-tight leading-[1.1] mb-10 text-white" style={{ fontFamily: '"Noto Serif SC", "Songti SC", serif' }}>
                你好，我是 <br /> 陈诗靓 Janice
              </h1>
              
              <p className="text-white/80 text-sm md:text-base max-w-md leading-relaxed">
                专注于人工智能与创新产品，希望用AI创造真实的价值。<br />目前研究方向包括智能体长期记忆与个性化，多智能体协作等
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col gap-28 mt-8"
            >
              {projects.slice(0, 2).map(({ title, description, link, image, tags }, i) => (
                <React.Fragment key={title}>
                  <div id={`project-${i + 1}`}>
                    <ProjectCard title={title} description={description} link={link} image={image} tags={tags} />
                  </div>
                  {i === 0 && (
                    <motion.div 
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="flex flex-col items-center gap-2 -mt-20 cursor-pointer"
                      onClick={() => document.getElementById('project-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    >
                      <span className="text-[11px] uppercase tracking-widest text-white/50 font-semibold">More Projects</span>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white/50">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <footer id="contact" className="py-20 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div />
            
            <div className="flex items-center gap-8">
              <a href="https://www.linkedin.com/in/janicechen0312/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white/70 hover:text-white transition-colors">LinkedIn</a>
              <a href="mailto:1262325196@qq.com" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Email</a>
            </div>

            <p className="text-sm text-white/30">© 2025 Janice Chen</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
