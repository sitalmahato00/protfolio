import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, Menu, X, ArrowRight, Code, Server, Database, Monitor, Globe, Shield, Terminal, Zap, Layout, Briefcase, ChevronRight } from 'lucide-react';

const Github = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.3-3.6 5 5 0 0 0-.1-3.5s-1-0.3-3.5 1.4a11.9 11.9 0 0 0-8 0C1 1.7 0 2.8 0 2.8A5 5 0 0 0 -.1 6.3 5.2 5.2 0 0 0 -1.4 9.8c0 5.2 3 6.4 6 6.7a4.8 4.8 0 0 0-1 3.5v3.5" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

/* ─── BACKGROUND ORBS ────────────────────────────────────── */
const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <motion.div
      animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[10%] left-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 blur-[120px] rounded-full"
    />
    <motion.div
      animate={{ y: [0, 50, 0], x: [0, -40, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-[20%] right-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-green-500/5 blur-[150px] rounded-full"
    />
  </div>
);

/* ─── NAVBAR ─────────────────────────────────────────────── */
const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const links = ["Projects", "Skills", "Experience", "About", "Contact"];
  const go = id => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5 py-4 px-6 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-white font-bold text-xl cursor-pointer tracking-tight relative group"
        >
          Sital.
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </span>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l} onClick={() => go(l)} className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">
              {l}
            </button>
          ))}
          <a href="mailto:sitalmahato077@gmail.com" className="bg-primary hover:bg-[#bceb54] text-black px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(212,255,112,0.3)]">
            Hire Me
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-0 right-0 bg-dark-900 border-b border-white/5 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            {links.map(l => (
              <button key={l} onClick={() => go(l)} className="text-gray-300 text-left text-lg font-medium">
                {l}
              </button>
            ))}
            <a href="mailto:sitalmahato077@gmail.com" className="bg-primary text-black text-center px-5 py-3 mt-4 rounded-xl text-md font-bold">
              Hire Me
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

/* ─── HERO ───────────────────────────────────────────────── */
const Hero = () => (
  <section className="pt-40 pb-20 px-6 min-h-[90vh] flex items-center relative overflow-hidden z-10">
    <div className="max-w-6xl mx-auto w-full relative grid lg:grid-cols-2 gap-12 items-center">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Available for work</span>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Full Stack<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Web Developer</span>
          </h1>
        </motion.div>

        <motion.p variants={fadeUp} className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-md">
          Passionate about building efficient and user-friendly software solutions. Motivated IT student building production-ready applications with modern web technologies.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
          <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="bg-primary hover:bg-[#bceb54] text-black px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(212,255,112,0.3)]">
            View Projects <ArrowRight size={18} />
          </button>
          <a href="/assets/Sital_Mahato_CV.pdf" target="_blank" className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-8 py-4 rounded-full font-bold transition-all relative overflow-hidden group">
            <span className="relative z-10">Download CV</span>
            <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16 pt-8 border-t border-white/10 flex gap-10 md:gap-12">
          {[
            { n: "6+", l: "Projects Built" },
            { n: "10+", l: "Technologies" },
            { n: "2026", l: "Graduating" }
          ].map(stat => (
            <div key={stat.l} className="group cursor-default">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{stat.n}</div>
              <div className="text-sm text-gray-500 font-medium">{stat.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Visual element (Profile Picture) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -15, 0] }}
        transition={{
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative mx-auto lg:ml-auto w-full max-w-sm lg:max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(212,255,112,0.15)] border border-white/10 group"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src="dist/profile.png"
          alt="Sital Mahato"
          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('bg-dark-800') }}
        />
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-xs font-semibold tracking-wider">Ready to build</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── PROJECTS ───────────────────────────────────────────── */
const projs = [
  {
    title: "E-Commerce Platform",
    desc: "A fully functional e-commerce platform with a user-friendly interface and secure payment gateway integration.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    img: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    title: "IT Department Management System",
    desc: "Comprehensive role-based system for IT operations. Manages attendance, examinations, and academic records.",
    tags: ["Laravel", "PHP", "Tailwind", "MySQL"],
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/sitalmahato00/IT-DMS"
  },
  {
    title: "Task Management App",
    desc: "A productivity tool allowing users to create, organize, and track tasks efficiently with real-time state updates.",
    tags: ["React", "Node.js", "MySQL"],
    img: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    title: "Weather Dashboard",
    desc: "Real-time weather application fetching dynamic data from an external API, providing a 7-day extended forecast.",
    tags: ["JavaScript", "HTML/CSS", "API"],
    img: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    title: "DIT Result Web Application",
    desc: "Responsive result display system for DIT students. Deployed on GitHub Pages for zero-cost hosting.",
    tags: ["HTML", "JS", "CSS"],
    img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
    link: "https://sitalmahato00.github.io/DIT_result/"
  },
  {
    title: "MMP College Management System",
    desc: "Production-ready college management platform with multi-role access. Features Redis caching and rate limiting.",
    tags: ["Laravel", "Redis", "PHP"],
    img: "https://images.unsplash.com/photo-15230503530c0-1c4d98ed0248?auto=format&fit=crop&q=80&w=800",
    link: "#"
  }
];

const Projects = () => (
  <section id="projects" className="py-24 px-6 bg-dark-900/50 border-t border-white/5 relative z-10">
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Projects I've<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Built & Shipped</span></h2>
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projs.map((p, i) => (
          <motion.div
            key={p.title}
            variants={fadeUp}
            whileHover={{ y: -10 }}
            className="group flex flex-col rounded-3xl bg-dark-800/80 backdrop-blur-sm border border-white/5 overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(212,255,112,0.1)]"
          >
            {/* Project Image Container */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent z-10" />
              <motion.img
                src={p.img}
                alt={p.title}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <div className="w-10 h-10 rounded-full bg-dark-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary transition-transform group-hover:rotate-12">
                  <Code size={18} />
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-8 pt-4 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">{p.desc}</p>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tags.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-gray-300 text-xs font-medium group-hover:border-primary/30 transition-colors">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all">
                    View Project <ArrowRight size={16} />
                  </a>
                  <div className="text-gray-500 group-hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─── SKILLS ─────────────────────────────────────────────── */
const Skills = () => {
  const stack = [
    { cat: "HTML/CSS", percent: 90 },
    { cat: "JavaScript", percent: 85 },
    { cat: "React", percent: 85 },
    { cat: "Node.js", percent: 80 },
    { cat: "PHP & Laravel", percent: 80 },
    { cat: "Java", percent: 75 },
    { cat: "C/C++", percent: 70 },
    { cat: "MySQL", percent: 85 },
    { cat: "MongoDB", percent: 75 },
    { cat: "Git", percent: 80 },
    { cat: "Figma", percent: 85 },
    { cat: "VS Code", percent: 90 }
  ];

  return (
    <section id="skills" className="py-24 px-6 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-16">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Technical Arsenal</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Languages & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Technologies</span></h2>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10"
        >
          {stack.map((s, i) => (
            <motion.div key={s.cat} variants={fadeUp} whileHover={{ scale: 1.05, x: 10 }} className="group">
              <div className="flex justify-between items-end mb-3">
                <span className="text-white font-bold tracking-tight group-hover:text-primary transition-colors">{s.cat}</span>
                <span className="text-primary text-sm font-mono opacity-80">{s.percent}%</span>
              </div>
              <div className="h-2.5 w-full bg-dark-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.percent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full relative"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ─── EXPERIENCE ─────────────────────────────────────────── */
const Experience = () => {
  const exps = [
    { role: "Web Developer", company: "Freelancer", period: "Aug 2023 - Present", desc: "Developing custom web applications, integrating APIs, and ensuring optimal performance and user experience across complex systems." },
    { role: "Web Designer", company: "Creative Agency", period: "May 2023 - Present", desc: "Designing responsive, intuitive, and visually appealing user interfaces focusing on premium modern aesthetics." }
  ];

  return (
    <section id="experience" className="py-24 px-6 bg-dark-900/50 border-t border-white/5 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-16 text-center">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Career Journey</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Experience</span></h2>
        </motion.div>

        <div className="space-y-8 pl-4 md:pl-0">
          {exps.map((e, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative pl-8 group">
              <div className="absolute left-0 top-0 bottom-[-2rem] w-px bg-white/10 group-last:bg-transparent">
                <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full border-2 border-primary bg-dark-900 shadow-[0_0_10px_rgba(212,255,112,0.5)]"></div>
              </div>
              <div className="bg-dark-800/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:border-primary/30 transition-colors shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{e.role}</h3>
                  <span className="text-primary text-sm font-semibold px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full inline-block">{e.period}</span>
                </div>
                <h4 className="text-lg text-gray-400 font-bold mb-4 flex items-center gap-2">
                  <Briefcase size={18} /> {e.company}
                </h4>
                <p className="text-gray-500 leading-relaxed">{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── ABOUT ──────────────────────────────────────────────── */
const About = () => (
  <section id="about" className="py-24 px-6 bg-dark-900/80 border-t border-white/5 relative overflow-hidden z-10">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-16 items-start">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="lg:col-span-7">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">Who I Am &<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">What Drives Me</span></motion.h2>

          <motion.div variants={fadeUp} className="prose prose-invert max-w-none text-gray-400 text-lg leading-relaxed mb-8">
            <p className="mb-6">
              I am a motivated IT student from Golbazar, Siraha, deeply passionate about building efficient, robust, AND user-friendly software solutions. I am currently pursuing a Diploma in Information Technology at Manmohan Memorial Polytechnic.
            </p>
            <p className="mb-6">
              My expertise spans a wide range of technologies, from Java and C++ to modern web frameworks like React and Native PHP Laravel. Whether it's designing precise layouts in Figma or writing complex rate-limited APIs on Node.js, my focus remains constant: delivering an outstanding user experience.
            </p>
            <p className="mb-8">
              When I'm not coding, I'm exploring new system architectures, contributing to open-source, or refining UI/UX patterns to create products that people truly love using.
            </p>

            {/* About Picture */}
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 border border-white/10 relative group">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/about.jpg"
                alt="Sital Working"
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('hidden') }}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <a href="mailto:sitalmahato077@gmail.com" className="flex items-center gap-2 text-black bg-primary font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,255,112,0.3)]">
              <Mail size={18} /> Email Me
            </a>
            <a href="https://github.com/sitalmahato00" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white bg-dark-800 border border-white/10 px-6 py-3 rounded-full hover:border-white transition-colors group">
              <Github size={18} className="group-hover:scale-110 transition-transform" /> GitHub
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="lg:col-span-5 bg-dark-800/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl relative sticky top-32"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
            <div className="text-6xl font-black text-primary/10">02</div>
          </div>

          <h3 className="text-white font-bold text-xl mb-10 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-green-500 rounded-full"></div>
            Education & Timeline
          </h3>

          <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-primary bg-dark-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/5 p-4 rounded-xl shadow group-hover:border-primary/50 transition-colors">
                <span className="text-primary font-bold text-xs uppercase tracking-wider mb-1 block">Present</span>
                <h4 className="text-md font-bold text-white mb-1">Production Projects</h4>
                <p className="text-gray-400 text-sm">Building Full Stack role-based systems</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white/30 bg-dark-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:border-primary transition-colors"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/5 p-4 rounded-xl shadow group-hover:border-primary/50 transition-colors">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1 block">2024</span>
                <h4 className="text-md font-bold text-white mb-1">Full Stack Mastery</h4>
                <p className="text-gray-400 text-sm">Advanced Laravel, React, API integration</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white/30 bg-dark-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:border-primary transition-colors"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/5 p-4 rounded-xl shadow group-hover:border-primary/50 transition-colors">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1 block">2023 - 2026</span>
                <h4 className="text-md font-bold text-white mb-1">Diploma in IT</h4>
                <p className="text-gray-400 text-sm">Manmohan Memorial Polytechnic</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── CONTACT ────────────────────────────────────────────── */
const Contact = () => (
  <section id="contact" className="py-24 px-6 border-t border-white/5 relative z-10">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-4xl mx-auto text-center relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Let's Build<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Something Together</span></h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          I'm currently open to new opportunities — whether it's a full-time role, freelance project, or open-source collaboration. Drop me a message and I'll get back to you within 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
          <a href="mailto:sitalmahato077@gmail.com" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-black font-bold px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(212,255,112,0.3)]">
            <Mail size={20} /> sitalmahato077@gmail.com
          </a>
          <a href="tel:+9779704191610" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-dark-800/80 backdrop-blur-md text-white font-bold px-8 py-4 rounded-full border border-white/10 hover:border-primary transition-all">
            <Phone size={20} /> +977 9704191610
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-400 font-medium bg-white/5 px-6 py-3 rounded-full inline-flex border border-white/10">
          <MapPin size={18} className="text-primary" />
          Golbazar, Siraha, Nepal <span className="opacity-50 mx-2">|</span> Remote worldwide
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── FOOTER ─────────────────────────────────────────────── */
const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5 bg-dark-900 border-none bg-black relative z-10">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="text-white font-bold text-3xl tracking-tight">Sital.</span>
        <p className="text-gray-500 text-sm">Building digital experiences.</p>
      </div>

      <div className="flex items-center gap-6 text-gray-400">
        <a href="https://github.com/sitalmahato00" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:scale-110 transform"><Github size={24} /></a>
        <a href="https://linkedin.com/in/sitalmahato" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:scale-110 transform"><Linkedin size={24} /></a>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500">
        <a href="#projects" className="hover:text-white transition-colors">Projects</a>
        <a href="#skills" className="hover:text-white transition-colors">Skills</a>
        <a href="#experience" className="hover:text-white transition-colors">Experience</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="bg-dark-900 min-h-screen text-gray-200 selection:bg-primary/30 selection:text-white relative font-sans">
      <AmbientBackground />
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
