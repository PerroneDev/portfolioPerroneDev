import { useEffect, useState, useRef } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import webGLFluid from 'webgl-fluid';

function GlobalFluidBackground() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 4, ease: "easeInOut" }}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* Huge Emerald Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/30 rounded-full mix-blend-screen filter blur-[120px] md:blur-[200px] animate-slowblob"></div>
      
      {/* Huge Yellow Blob */}
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-yellow-400/20 rounded-full mix-blend-screen filter blur-[120px] md:blur-[200px] animate-slowblob animation-delay-4000"></div>
      
      {/* Another Emerald Blob at bottom */}
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[150px] md:blur-[250px] animate-slowblob animation-delay-10000"></div>
    </motion.div>
  );
}

function FeaturedProject() {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      webGLFluid(canvasRef.current, {
        IMMEDIATE: false,
        COLORFUL: true,
        DENSITY_DISSIPATION: 1.2,
        VELOCITY_DISSIPATION: 0.8,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 5,
        SPLAT_RADIUS: 0.35, 
        SPLAT_FORCE: 4000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 18, g: 18, b: 20 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.1,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });
    }

    let lastX = 0;
    let lastY = 0;
    let isHovering = false;

    const handleMouseMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      
      // Update persistent glow position
      if (cardRef.current && glowRef.current && isHovering) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glowRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };

    const handleScroll = () => {
      if (!isHovering) return;
      
      // Dispatch fake mousemove to canvas so fluid simulates during scroll
      if (canvasRef.current) {
        const event = new MouseEvent('mousemove', {
          clientX: lastX,
          clientY: lastY,
          bubbles: true
        });
        canvasRef.current.dispatchEvent(event);
      }
      
      // Update persistent glow position during scroll
      if (cardRef.current && glowRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = lastX - rect.left;
        const y = lastY - rect.top;
        glowRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };

    const handleMouseEnter = () => {
       isHovering = true;
       if(glowRef.current) glowRef.current.style.opacity = '1';
    };
    
    const handleMouseLeave = () => {
       isHovering = false;
       if(glowRef.current) glowRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (card) {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="mb-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Projeto em Destaque</h3>
        <span className="text-emerald-400 text-sm font-medium tracking-widest uppercase flex items-center gap-2">
          Case Real <ArrowRight className="w-4 h-4" />
        </span>
      </div>
      
      <a 
        href="https://whatsapp-analyzer-gamma.vercel.app" 
        target="_blank" 
        rel="noreferrer" 
        ref={cardRef}
        className="block relative group overflow-hidden rounded-[2rem] border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500 p-8 md:p-16"
      >
        {/* WEBGL FLUID CANVAS BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-auto opacity-20 group-hover:opacity-60 transition-opacity duration-700">
           {/* The canvas is grayscaled and brightened so multiply blending works perfectly */}
           <canvas ref={canvasRef} className="w-full h-full grayscale contrast-150 brightness-150" />
           
           {/* Colorizing Overlay: Multiply blends the bright fluid with these colors, keeping the black background black */}
           <div className="absolute inset-0 mix-blend-multiply bg-gradient-to-br from-emerald-400 via-emerald-300 to-yellow-300 pointer-events-none"></div>
        </div>

        {/* PERSISTENT LOCATION GLOW */}
        <div 
          ref={glowRef}
          className="absolute top-0 left-0 w-[250px] h-[250px] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none opacity-0 transition-opacity duration-500 z-0"
          style={{ transform: 'translate(-50%, -50%)' }}
        ></div>
        
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-zinc-900/70 via-zinc-900/30 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl pointer-events-none">
          <h4 className="text-3xl md:text-5xl font-bold text-white mb-6 group-hover:text-emerald-400 transition-colors drop-shadow-sm">WaAnalyzer</h4>
          <p className="text-lg text-zinc-300 leading-relaxed mb-10 drop-shadow-sm">
            Um sistema simples que nasceu de uma necessidade real no suporte da Jonck Company. Como o gerenciamento das mensagens no WhatsApp tomava muito tempo da equipe durante os atendimentos, criei essa ferramenta para organizar o fluxo. Foi uma ótima oportunidade para aplicar a programação em um problema prático da nossa rotina e melhorar nosso processo.
          </p>
          
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-full font-medium border border-emerald-500/20 transition-all duration-300 shadow-lg pointer-events-auto group-hover:bg-emerald-500 group-hover:text-zinc-950">
            Acessar Plataforma <ExternalLink className="w-4 h-4" />
          </span>
        </div>
      </a>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="mb-40 relative">
      <h3 className="text-4xl md:text-5xl font-bold text-white mb-16 tracking-tight">Minha Jornada</h3>
      
      {/* Wrapper for the timeline */}
      <div className="relative flex flex-col">
        
        {/* Background line (locked between the first and last bullets) */}
        <div className="absolute left-[5px] md:left-[21px] top-[60px] bottom-[60px] w-[2px] bg-zinc-800/50 z-0"></div>
        
        {/* Animated fill line (grows from bottom to top once in view) */}
        <motion.div 
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-[5px] md:left-[21px] top-[60px] bottom-[60px] w-[2px] bg-gradient-to-t from-yellow-500/20 via-emerald-500/50 to-emerald-400 origin-bottom shadow-[0_0_10px_rgba(52,211,153,0.3)] z-10"
        />

        {/* ITEMS */}
        <ExperienceItem 
          company="Jonck Company"
          date="Mar/2026 - Atual"
          role="Suporte de Operações"
          desc="Atendimento direto aos clientes, suporte operacional no funil de vendas e auxílio nas demandas diárias da equipe, sempre buscando organizar e facilitar o fluxo de trabalho."
          tag="Full-time"
          isCurrent={true}
        />
        <ExperienceItem 
          company="Óticas Raki"
          date="Mai/2025 - Mar/2026"
          role="Consultor de Vendas & Social Media"
          desc="Atendimento e resolução de problemas operacionais."
          tag="Presencial"
        />
        <ExperienceItem 
          company="Agência Newave Co."
          date="2024 - 2025"
          role="Web Designer & Editor de Mídia"
          tag="Freelance"
        />
        <ExperienceItem 
          company="SIASI"
          date="Set/2023 - Nov/2023"
          role="Freelance de Dashboards de Dados"
          tag="Freelance"
        />
      </div>
    </section>
  );
}

function ExperienceItem({ company, date, role, desc, tag, isCurrent }) {
  const itemRef = useRef(null);
  // Trigger exactly when this item crosses the center of the viewport
  const isInView = useInView(itemRef, { once: false, margin: "-50% 0px -50% 0px" });
  
  return (
    <div ref={itemRef} className="group relative flex flex-col lg:flex-row lg:items-center justify-between py-10 pl-8 md:pl-16 transition-colors duration-500 gap-6">
      
      {/* Horizontal separator line (Starts exactly at the vertical timeline to avoid excess on the left) */}
      <div className="absolute bottom-0 left-[5px] md:left-[21px] right-0 h-[1px] bg-zinc-800/30 group-hover:bg-emerald-500/30 transition-colors duration-500 z-0"></div>
      
      {/* Glow on the horizontal line on hover */}
      <div className="absolute bottom-0 left-[5px] md:left-[21px] right-0 h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-700 z-0"></div>

      {/* TIMELINE BULLET */}
      <div className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Background circle */}
        <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-700 z-10 transition-colors duration-500" />
        
        {/* Glow fill when in view */}
        {isCurrent ? (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { scale: 0, opacity: 0, filter: "brightness(1)" },
              visible: { 
                scale: 1, 
                opacity: 1, 
                filter: ["brightness(3)", "brightness(1)"],
                transition: { duration: 0.8, ease: "easeOut", delay: 1.5 } // delay aligns with the line filling up
              }
            }}
            className="absolute w-3 h-3 rounded-full bg-emerald-400 z-20"
          >
            {/* Dimming and oscillating pulse */}
            <motion.div 
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2.3 }}
              className="absolute inset-[-4px] rounded-full bg-emerald-400 blur-[2px]"
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, type: "spring" }}
            className="absolute w-3 h-3 rounded-full bg-yellow-500 z-20 shadow-[0_0_10px_rgba(234,179,8,0.6)]"
          />
        )}
      </div>

      <div className="flex-1">
        <h4 className={`text-2xl font-semibold mb-2 transition-colors duration-500 ${isCurrent ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-white group-hover:text-yellow-400'}`}>
          {company}
        </h4>
        <p className="text-zinc-500 text-sm tracking-wide uppercase">{date}</p>
      </div>
      <div className="flex-1">
        <p className="text-lg text-zinc-300">{role}</p>
        {desc && <p className="text-zinc-500 mt-1">{desc}</p>}
      </div>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 group-hover:border-zinc-700 group-hover:text-zinc-300 transition-colors duration-300">{tag}</span>
      </div>
    </div>
  )
}

function App() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('vitorltperrone@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative bg-zinc-900 overflow-x-hidden text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-white">
      
      {/* GLOBAL DISCREET FLUID BACKGROUND */}
      <GlobalFluidBackground />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col pt-32 pb-16">
        
        {/* HERO SECTION */}
        <section className="min-h-[70vh] flex flex-col justify-center mb-32">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-emerald-400 font-medium tracking-widest uppercase mb-6 text-sm"
          >
            Portfólio Pessoal
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-white leading-none tracking-tighter mb-8"
          >
            Vitor <br/> Perrone.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4 pt-12"
          >
            {/* Elegant Gradient Divider */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/40 via-zinc-700/50 to-transparent"></div>
            
            <h2 className="text-2xl md:text-3xl font-medium bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent max-w-md">
              Ciência da Computação & Visão de Operações
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
              Transformo curiosidade técnica em soluções reais. Foco em investigar problemas, entender o fluxo e entregar ferramentas úteis para o dia a dia da operação.
            </p>
          </motion.div>
        </section>

        {/* ABOUT ME & SKILLS SECTION */}
        <section className="mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
            
            {/* Left: About */}
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Sobre Mim</h3>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-6 text-justify">
                Estudante do 7º período de Ciência da Computação na Estácio. Atualmente, trabalhar direto no suporte de operações tem me ensinado a entender a dor do usuário na prática antes de pensar em código. 
              </p>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed text-justify">
                Sempre fui curioso para entender como as coisas funcionam por baixo dos panos, seja montando um PC, mexendo no meu carro ou caçando um bug. Enxergo a programação de um jeito bem prático: como uma ferramenta para resolver problemas e facilitar a rotina.
              </p>
            </div>

            {/* Right: Skills & Stats (Unboxed) */}
            <div className="flex flex-col gap-10 pt-4 lg:pt-0">
              
              <div>
                <h4 className="text-sm text-zinc-500 font-semibold uppercase tracking-wider mb-4">Hard Skills</h4>
                <div className="flex flex-wrap gap-2.5">
                  {['Python', 'JavaScript', 'HTML', 'CSS', 'Git', 'Lógica de Programação'].map(tech => (
                    <span key={tech} className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-zinc-500 font-semibold uppercase tracking-wider mb-4">Soft Skills</h4>
                <div className="flex flex-wrap gap-2.5">
                  {['Visão de Operações', 'Resolução de Problemas', 'Troubleshooting'].map(skill => (
                    <span key={skill} className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-300 hover:border-yellow-500/50 hover:text-yellow-400 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-zinc-500 font-semibold uppercase tracking-wider mb-4">Ferramentas</h4>
                <div className="flex flex-wrap gap-2.5">
                  {['Figma', 'Ferramentas de IA'].map(tool => (
                    <span key={tool} className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        <FeaturedProject />

        {/* EXPERIENCE SECTION */}
        <ExperienceSection />

        {/* FOOTER & CONTACT */}
        <footer className="pt-16 pb-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight">Quer <br/><span className="text-emerald-400">bater um papo?</span></h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
            <a href="https://www.linkedin.com/in/vitorperrone/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-emerald-500 hover:border-emerald-500 hover:text-zinc-950 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-zinc-300 font-medium">
              <FaLinkedin className="w-5 h-5" /> LinkedIn
            </a>
            <a href="https://github.com/PerroneDev" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-yellow-400 hover:border-yellow-400 hover:text-zinc-950 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-zinc-300 font-medium">
              <FaGithub className="w-5 h-5" /> GitHub
            </a>
            <button 
              onClick={handleCopyEmail} 
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-full font-medium cursor-pointer transition-all duration-300 ${
                emailCopied 
                  ? 'bg-emerald-500 border border-emerald-500 text-zinc-950 scale-95' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-white hover:border-white hover:text-red-600 hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              <FaEnvelope className="w-5 h-5" /> {emailCopied ? 'Copiado!' : 'E-mail'}
            </button>
          </div>

          <p className="text-zinc-500 text-sm uppercase tracking-widest">
            © {new Date().getFullYear()} Vitor Perrone
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;
