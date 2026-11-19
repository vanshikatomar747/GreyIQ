import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Compass, Send, CheckCircle, Mail, Phone, MapPin, Sparkles, Briefcase, Star, BrainCircuit, Quote, Code2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

// 3D Tilt Card Component for Focus Areas
function TiltCard({ title, desc, icon: Icon, color, onClick }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;

    // Calculate rotational angle
    const factorX = (x / (card.width / 2)) * 12;
    const factorY = (y / (card.height / 2)) * 12;

    setCoords({ x: factorX, y: -factorY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const borderStyles = {
    '#7C3AED': 'hover:border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)]',
    '#22D3EE': 'hover:border-secondary/50 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]',
    '#4ADE80': 'hover:border-accent/50 shadow-[0_0_15px_rgba(74,222,128,0.1)] hover:shadow-[0_0_30px_rgba(74,222,128,0.25)]',
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateY(${coords.x}deg) rotateX(${coords.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease-out',
      }}
      className={`glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-[320px] ${onClick ? 'cursor-pointer' : ''
        } ${borderStyles[color] || ''}`}
    >
      <div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center space-x-1.5 text-xs font-semibold mt-4" style={{ color }}>
        <span>Explore Program Details</span>
        <span>→</span>
      </div>
    </div>
  );
}

// Card Component for Year Roadmaps (No cursor-tracking movement)
function YearCard({ year, title, items, color }) {
  const borderStyles = {
    '#7C3AED': 'hover:border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.08)] hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]',
    '#22D3EE': 'hover:border-secondary/50 shadow-[0_0_15px_rgba(34,211,238,0.08)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]',
    '#4ADE80': 'hover:border-accent/50 shadow-[0_0_15px_rgba(74,222,128,0.08)] hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]',
    '#FB7185': 'hover:border-highlight/50 shadow-[0_0_15px_rgba(251,113,133,0.08)] hover:shadow-[0_0_30px_rgba(251,113,133,0.2)]',
  };

  return (
    <div
      className={`glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-[360px] ${borderStyles[color] || ''}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-extrabold text-white">{year}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
            Syllabus
          </span>
        </div>
        <h4 className="text-xs font-bold text-slate-200 mb-4 tracking-wide border-b border-white/5 pb-2">{title}</h4>
        <ul className="space-y-2.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start text-xs text-slate-400 text-left">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 shrink-0 animate-pulse" style={{ backgroundColor: color }} />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end">
        <Link
          to="/program-details"
          className="text-[10px] font-bold uppercase tracking-wider hover:underline flex items-center space-x-1 transition-colors duration-200"
          style={{ color }}
        >
          <span>More</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// Dynamic Spotlight Card Component for Solution Vector
function SolutionCard({ title, icon: Icon, color, items }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const shadowColors = {
    '#7C3AED': 'rgba(124,58,237,0.15)',
    '#22D3EE': 'rgba(34,211,238,0.15)',
    '#4ADE80': 'rgba(74,222,128,0.15)',
    '#FB7185': 'rgba(251,113,133,0.15)'
  };

  const bgGradients = {
    '#7C3AED': 'from-slate-950 via-slate-950 to-purple-950/20 hover:border-primary/30',
    '#22D3EE': 'from-slate-950 via-slate-950 to-cyan-950/20 hover:border-secondary/30',
    '#4ADE80': 'from-slate-950 via-slate-950 to-emerald-950/20 hover:border-accent/30',
    '#FB7185': 'from-slate-950 via-slate-950 to-rose-950/20 hover:border-highlight/30'
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl border border-white/5 p-8 flex flex-col justify-between min-h-[460px] overflow-hidden bg-gradient-to-br ${bgGradients[color]} transition-all duration-500 group`}
      style={{
        boxShadow: isHovered ? `0 20px 40px -15px ${shadowColors[color]}, inset 0 0 20px rgba(255, 255, 255, 0.02)` : 'none'
      }}
    >
      {/* Spotlight effect overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${color}0c, transparent 80%)`
          }}
        />
      )}

      {/* Border glow spotlight */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl border border-transparent"
          style={{
            background: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, ${color}22, transparent 60%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px'
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header Icon + Title */}
        <div className="flex items-center space-x-4 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
            style={{
              background: `${color}12`,
              border: `1px solid ${color}20`,
              boxShadow: isHovered ? `0 0 15px ${color}20` : 'none'
            }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">GreyIQ Pillar</span>
          </div>
        </div>

        {/* List items with premium sub-boxes */}
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start text-xs text-slate-300 text-left p-3 rounded-xl bg-white/[0.01] border border-white/[0.02] hover:bg-white/[0.03] hover:border-white/[0.05] transition-all duration-300 group/item"
            >
              <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3 shrink-0 transition-all duration-300 group-hover/item:scale-125" style={{ backgroundColor: color }} />
              <span className="leading-relaxed font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-5 mt-4">
        <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">
          Program Vector
        </span>
        <span
          className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/2 border-white/5"
          style={{ color, borderColor: `${color}30` }}
        >
          Active Module
        </span>
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: "Nidhi Bansal",
    target: "FMS Convert | 99.38%ile",
    mentor: "Rohit Sir",
    initials: "NB",
    text: "I am extremely grateful to have Rohit Sir as Quant mentor during my CAT journey. With his guidance, I was able to secure a 99.38 percentile overall in CAT and convert FMS. What truly sets him apart is his unique approach to teaching Quant. Instead of focusing on heavy calculations, he trained us to think smartly—always asking first: do we even need to calculate this? His emphasis on elimination techniques and treating options as part of the question completely changed the way I approached problems. He made Quant feel much simpler and more logical rather than intimidating. This shift in mindset was a complete game changer for me. He played a crucial role in my CAT preparation and success, and I would highly recommend him to anyone looking to strengthen their Quant fundamentals and problem-solving approach.",
    color: "#7C3AED", // purple
    activeClass: "border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(124,58,237,0.15)]",
    iconColor: "text-primary",
    avatarBg: "bg-primary/10 border-primary/20",
    badgeBg: "bg-primary/10 text-primary border-primary/20"
  },
  {
    name: "Ishika Jain",
    target: "IIM Calcutta | 99.23%ile",
    mentor: "Rohit Sir",
    initials: "IJ",
    text: "Rohit Sir was an exceptional teacher who completely transformed my approach to Quantitative Aptitude by focusing on building strong fundamentals. He had a unique ability to simplify even the most complex topics and consistently provided effective shortcuts that were crucial for solving questions quickly in the CAT. With his guidance, I was able to overcome my fear of difficult areas like Geometry and turn them into strengths. His mentorship played a major role in helping me score a 99.23 percentile in CAT, perform well in Quant even in a tough paper, and secure admission to IIM Calcutta.",
    color: "#22D3EE", // cyan
    activeClass: "border-secondary/40 bg-secondary/5 shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    iconColor: "text-secondary",
    avatarBg: "bg-secondary/10 border-secondary/20",
    badgeBg: "bg-secondary/10 text-secondary border-secondary/20"
  },
  {
    name: "Avichal Agrawal",
    target: "IIM Lucknow",
    mentor: "Ankit Sir",
    initials: "AA",
    text: "Ankit Srivastava (Ankit sir) is one of the best faculty and person that I have ever had the chance of meeting and being mentored by. My entire CAT journey and the path to making it to a premium B-School has essentially been orchestrated by him. Not only is he extremely confident about what he is teaching and the way he teaches but it’s his humane approach that sets him apart. Even today, I reach out to him for guidance and despite of his schedule, he has always been just a call away. It’s an honour to have been mentored by him and above all, gotten a fierce friend in him.",
    color: "#4ADE80", // green/emerald
    activeClass: "border-accent/40 bg-accent/5 shadow-[0_0_20px_rgba(74,222,128,0.15)]",
    iconColor: "text-accent",
    avatarBg: "bg-accent/10 border-accent/20",
    badgeBg: "bg-accent/10 text-accent border-accent/20"
  },
  {
    name: "Sugandha Gupta",
    target: "ISB & IIM Bangalore",
    mentor: "Ankit Sir",
    initials: "SG",
    text: "I had the privilege of being mentored by Ankit Sir during my MBA preparation, and his guidance was a key factor in my successful admits to both ISB and IIM Bangalore. What stood out to me was his genuine commitment to each student’s journey. He owned my prep like his own and consistently checked in on my progress, offered practical feedback, and gave timely encouragement whenever I felt stuck. His clarity in explaining concepts, especially in areas like critical reasoning that are important for CAT & GMAT helped me build confidence and improve steadily over time. Beyond academics, his mentorship helped me stay focused through the ups and downs of a demanding prep journey. He was always available to talk things through, whether it was about exam strategy or simply managing stress. Ankit Sir’s ability to combine structured coaching with thoughtful mentorship made a big difference in how I approached both the entrance exams and the application process. I’m immensely thankful for his support.",
    color: "#FB7185", // pink
    activeClass: "border-highlight/40 bg-highlight/5 shadow-[0_0_20px_rgba(251,113,133,0.15)]",
    iconColor: "text-highlight",
    avatarBg: "bg-highlight/10 border-highlight/20",
    badgeBg: "bg-highlight/10 text-highlight border-highlight/20"
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAppStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full relative z-10 pt-20">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 neon-glow-purple"
          >
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">The Most comprehensive and industry specific placement training program</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            GreyIQ <br />
            <span className="text-gradient-purple-cyan font-extrabold">Solutions</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl leading-relaxed mb-10"
          >
            Transforming students into industry-ready professionals.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="btn-glow text-white px-8 py-3.5 rounded-xl font-semibold text-base shadow-xl flex items-center space-x-2"
            >
              <span>Get Started</span>
              <span>→</span>
            </Link>
            <a
              href="#focus"
              className="text-slate-300 hover:text-white px-6 py-3.5 rounded-xl text-base font-semibold border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-12 text-slate-400"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-white">35+ Years</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-secondary mt-1">Collective Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-white">20,000+</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-primary mt-1">Students Guided</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-white">4.87</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-accent mt-1">Avg Student Satisfaction

              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. CORE FOCUS AREAS SECTION */}
      <section id="focus" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-secondary mb-3">Core Modules</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Our Core Focus Areas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TiltCard
            title="1. English for Communication & Exams"
            desc="Building from grammar fundamentals to interview-level fluency and exam performance."
            icon={BookOpen}
            color="#7C3AED"
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <TiltCard
            title="2. Resume & Placement Readiness"
            desc="Progressive resume development from introduction to ATS-optimized final versions with portfolio building."
            icon={FileText}
            color="#22D3EE"
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <div className="md:col-span-2 lg:col-span-1">
            <TiltCard
              title="3. Career Counselling"
              desc="From career awareness in Year 1 to placement simulation and salary negotiation in Year 4."
              icon={Compass}
              color="#4ADE80"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>
        </div>
      </section>

      {/* PROGRAM OVERVIEW - AT A GLANCE SECTION */}
      <section id="overview" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-primary mb-3">Academic Roadmap</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Program Overview – At a Glance</h3>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            A comprehensive, structured year-by-year syllabus matching language competencies, resume readiness, and career counseling goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <YearCard
            year="1st Year"
            title="Foundations & Awareness"
            color="#7C3AED"
            items={[
              "Foundations of English & Communication",
              "Aptitude Basics (Quant + LR)",
              "Resume Introduction",
              "Career Path Awareness"
            ]}
          />
          <YearCard
            year="2nd Year"
            title="Professional Execution"
            color="#22D3EE"
            items={[
              "Professional Mail writing",
              "Verbal Ability + Data Interpretation",
              "Resume Building + LinkedIn",
              "Industry Awareness"
            ]}
          />
          <YearCard
            year="3rd Year"
            title="Advanced Integration"
            color="#4ADE80"
            items={[
              "Advanced Communication & Presentations",
              "Advanced Aptitude + Career Awareness",
              "Tailored Resume + Cover Letter",
              "Internship & Higher Ed Strategy"
            ]}
          />
          <YearCard
            year="4th Year"
            title="Workplace Placement"
            color="#FB7185"
            items={[
              "Interview & Workplace Communication",
              "Placement Mock Tests (Company-specific)",
              "Final Resume Polish + ATS + Portfolio",
              "Placement Simulation & Salary Negotiation"
            ]}
          />
        </div>
      </section>

      {/* OUR SOLUTION SECTION */}
      <section id="solution" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/15 border border-primary/20 w-fit px-3.5 py-1 rounded-full mb-3 mx-auto neon-glow-purple">
            <BrainCircuit className="w-4.5 h-4.5 text-secondary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">Our Solution</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Programs
          </h3>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            We offer a complete ecosystem of student employability. Explore the technical, communications, and mapping modules that align candidates with modern industry roles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <SolutionCard
            title="Placement Training"
            icon={Briefcase}
            color="#7C3AED"
            items={[
              "Resume building & LinkedIn optimization",
              "Mock interviews with experts’ feedback",
              "Group Discussion & HR round prep",
              "Body Language & presentation skills"
            ]}
          />
          <SolutionCard
            title="Aptitude Training"
            icon={BookOpen}
            color="#22D3EE"
            items={[
              "End to end training for all 3 sections",
              "Special tailor-made sessions to improve individual section",
              "Test taking and time management strategies",
              "Company specific aptitude drills"
            ]}
          />
          <SolutionCard
            title="Technical Training"
            icon={Code2}
            color="#FB7185"
            items={[
              "Full stack web development & DSA fundamentals",
              "Coding bootcamps & hands-on mini-projects",
              "Database management & API design workshops",
              "Mock coding rounds & technical assessment prep"
            ]}
          />
          <SolutionCard
            title="Career Counselling"
            icon={Compass}
            color="#4ADE80"
            items={[
              "Personalized career mapping sessions",
              "Individual guidance on career paths and higher education",
              "Personality assessments and role-fit analysis",
              "One on one mentorship throughout the session"
            ]}
          />
        </div>

        {/* Dedicated Placement Support Highlight Card */}
        <div className="mt-14 glass-panel p-8 md:p-10 rounded-3xl border border-secondary/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-[0_0_40px_rgba(34,211,238,0.08)]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-secondary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Dedicated Placement Directorate</span>
            </div>
            <h4 className="text-xl md:text-2xl font-extrabold text-white">
              Looking for End-to-End <span className="text-gradient-purple-cyan font-extrabold">Placement Support</span> & Campus Drives?
            </h4>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light">
              We connect partner institutions with top corporate employers including TCS, Mahindra, Maruti Suzuki, and leading MNCs, coordinating exclusive campus recruitment drives, company-specific bootcamps, and offer negotiation advisory.
            </p>
          </div>
          <Link
            to="/placement-support"
            className="btn-glow text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform"
          >
            <span>Explore Placement Support</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 px-6 bg-slate-950/40 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Why <span className="text-gradient-cyan-green font-extrabold">Choose Us</span>
              </h3>
              <p className="text-slate-300 mt-6 text-sm md:text-base leading-relaxed max-w-lg font-light text-left">
                We believe in <span className="text-accent font-semibold">rigorous execution</span> and <span className="text-accent font-semibold">regional exclusivity</span>. Partnering with <span className="text-white font-medium">GreyIQ Solutions</span> means securing a customized, data-backed roadmap engineered specifically for your institutional needs.
              </p>

              <div className="mt-8">
                <Link
                  to="/synergy"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md"
                >
                  <span>Explore Synergy Vectors</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 text-lg">
                  🎯
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Customization</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Programs tailored to your sector, companies, and student baseline.</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-secondary/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-4 text-lg">
                  🤝
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Regional Exclusivity</h4>
                <p className="text-xs text-slate-400 leading-relaxed">No competitor college in your area will access our curriculum.</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4 text-lg">
                  📊
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Data-Driven Tracking</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Measurable reports highlighting student progress monthly.</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-highlight/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-highlight/10 border border-highlight/20 flex items-center justify-center text-highlight mb-4 text-lg">
                  📈
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Outcome Guarantee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Outcome-focused training that improves placement pass rates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-transparent to-slate-950/40 border-t border-white/5">
        {/* Decorative backdrop gradients */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full mb-4">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Success Spotlights</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              What Our <span className="text-gradient-purple-cyan font-extrabold">Students Say</span> About Us
            </h3>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Explore the detailed preparation journeys, strategic breakthroughs, and mentorship experiences of our students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">

            {/* LEFT: MAIN HIGHLIGHT TESTIMONIAL */}
            <div className="md:col-span-8 flex">
              <div className="w-full glass-panel p-8 md:p-12 rounded-3xl border border-white/5 relative flex flex-col justify-between overflow-hidden min-h-[400px]">
                {/* Accent glow corner */}
                <div
                  className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
                  style={{ backgroundColor: testimonials[activeTestimonial].color }}
                />

                {/* Massive quote water mark */}
                <Quote className="absolute -top-2 -right-2 w-32 h-32 text-white/[0.015] pointer-events-none" />

                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col justify-between h-full relative z-10"
                >
                  <div className="mb-8 text-left">
                    <Quote className="w-8 h-8 text-slate-500 mb-4 opacity-50" />
                    <p className="text-sm md:text-base lg:text-lg text-slate-200 leading-relaxed italic font-light">
                      {testimonials[activeTestimonial].text}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-6 text-left">
                    <div>
                      <h4 className="text-base font-extrabold text-white tracking-wide">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: testimonials[activeTestimonial].color }}>
                        {testimonials[activeTestimonial].target}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${testimonials[activeTestimonial].badgeBg}`}>
                        Mentored by {testimonials[activeTestimonial].mentor}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* RIGHT: SELECTORS LIST */}
            <div className="md:col-span-4 flex flex-col gap-4 justify-between">
              {testimonials.map((t, idx) => {
                const isActive = idx === activeTestimonial;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center space-x-4 transition-all duration-300 ${isActive
                      ? t.activeClass
                      : "bg-slate-900/20 border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                      }`}
                  >
                    {/* Circle avatar with initials */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${t.avatarBg} ${t.iconColor}`}>
                      {t.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate transition-colors ${isActive ? "text-white" : "text-slate-300"}`}>
                        {t.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {t.target}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 4. CONTACT US SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-secondary mb-3">Connect</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">Let's build your pathway</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
              Have questions about registration deadlines, institutional partnerships, or corporate assessments? Get in touch with our program leads.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:greyiqts@gmail.com" className="text-slate-300 text-sm hover:text-white transition-colors">greyiqts@gmail.com</a>
              </div>
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="tel:+918882167686" className="text-slate-300 text-sm hover:text-white transition-colors">+91 8882167686</a>
              </div>
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-slate-300 text-sm">26, DSIDC Shed, Okhla Phase-2, New Delhi</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
            {formSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Message Transmitted!</h4>
                <p className="text-slate-400 text-sm max-w-xs">
                  Thank you for reaching out. A GreyIQ Solutions development representative will email you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    className="w-full glass-input px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="student@college.edu"
                    className="w-full glass-input px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="How can we help you coordinate your student development goals?"
                    className="w-full glass-input px-4 py-3 rounded-lg text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-glow py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div >
  );
}
