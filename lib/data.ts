import { CaseStudy, ExperienceRole, CapabilityItem, Certificate, HeroData, CMSData, SectionTags, AboutData, Testimonial } from './types';

export const HERO_DATA: HeroData = {
  name: "SOUGATA_CHANDA",
  title: "FULL-STACK SOFTWARE ENGINEER",
  headline: "I BUILD PRODUCTS, SYSTEMS & EXPERIENCES THAT SCALE.",
  subheadline: "Full-stack engineer specializing in modern web applications, backend microservices, cloud infrastructure, and AI-powered products.",
  experienceYears: "3+ YEARS",
  location: "Bangalore, India",
  status: "OPEN TO FULL-TIME",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  contactEmail: "hello@sougata.dev",
  skillsTicker: [
    "TYPESCRIPT", "REACT", "NEXT.JS", "NODE.JS", "PYTHON", "POSTGRESQL", "RUST", "AWS", "DOCKER", "KUBERNETES", "GRAPHQL"
  ]
};

export const ABOUT_DATA: AboutData = {
  title: "Curious by Default.",
  titleHighlight: "Obsessed with Building.",
  paragraph1: "Software engineering is not just a technical discipline; it is a craft. The internal architecture behind a system should be as clean, robust, and intentional as the interface the user interacts with.",
  paragraph2: "My approach is rooted in pragmatism, performance metrics, and zero-compromise code safety. I write code designed for maintainability, enforce rigorous automated testing, and continuously optimize for low end-user latency.",
  portraitImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc-JJiGDK6qyokD4IqyZDq_aeCOB9p3zKLRhygS_d3Wns2qUiCeLvv0UkJVksYSoCFV_f-_JOfQJ0f3RlyMqQ2ztCmoRB19YNJ9r8JNzvNkwqqbDBG_zXXK0Eyb7UxFfpqDGSKJC5hM8eXXQjXMsZLI780gIdCZk3FJo4PglMms9glom6R69T9k7DwFhJiQ1vAi7REL7xCPQ6Oj9fxK63tTW1Y0_FY4BnYDX7hHMtCN8Qm6BJnFLg1lg",
  highlights: [
    "Strict TypeScript Enforcement",
    "Decoupled Microservices",
    "Zero Layout Shift UI",
    "Automated CI/CD Pipelines"
  ]
};

export const DEFAULT_SECTION_TAGS: SectionTags = {
  work: '// 01_WORK_EXPERIENCES',
  certificates: '// 02_VERIFIED_CERTIFICATES',
  capabilities: '// 03_CAPABILITIES_&_SYSTEMS',
  contact: '// 04_GET_IN_TOUCH',
  about: '// 05_ABOUT_&_PHILOSOPHY'
};

export const CASE_STUDY_DATA: CaseStudy = {
  id: "nexus-platform",
  title: "Nexus Platform Redesign",
  subtitle: "Re-architecting an enterprise logistics data visualizer for 10x throughput.",
  role: "Lead Systems Architect & Staff Engineer",
  techStack: ["Next.js 15", "Node.js", "AWS ECS", "GraphQL", "Redis PubSub", "Tailwind CSS"],
  year: "2024",
  platform: "Web Dashboard & iOS Sync API",
  overview: "Nexus is an enterprise data visualization platform utilized by Fortune 500 logistics teams. The legacy monolith was struggling under immense technical debt, leading to excruciatingly slow query times and UI freezes during peak load.",
  problem: "Client-side rendering was heavily taxing user hardware, and synchronous API chains created fragile dependency bottlenecks that frequently cascaded into full application outages.",
  problemPoints: [
    "> P99 response times exceeding 4,500ms under load",
    "> DOM node count exceeding 15,000 elements on primary views",
    "> Tightly coupled state leading to memory leaks and memory spikes"
  ],
  myRoleDescription: "As Lead Engineer, directed a team of five engineers through a full-stack re-architecture. Responsibilities included designing the event-driven GraphQL backend, implementing Next.js Server Components rendering patterns, and defining strict CI/CD zero-downtime deployments.",
  keyChallenges: [
    {
      title: "Real-time State Synchronization",
      description: "Maintaining state parity across thousands of concurrent client dashboards required moving away from polling to a Redis Pub/Sub WebSocket engine.",
      codeSnippet: `// WebSocket Sync Event Handler
redisClient.subscribe('sync_channel', (message) => {
  const { eventType, payload } = JSON.parse(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.room === payload.roomId) {
      client.send(JSON.stringify({ type: eventType, data: payload }));
    }
  });
});`
    },
    {
      title: "Zero Layout Shift & Micro-Bundle Splitting",
      description: "Implemented route-level dynamic code splitting and React Server Components to stream data directly into the DOM, eliminating spinners and layout shifts."
    }
  ],
  decisions: [
    {
      question: "Why Next.js App Router?",
      answer: "Hybrid rendering requirements: Static site generation for public marketing pages and server-side streaming for live data dashboards to achieve optimal SEO and sub-100ms load times."
    },
    {
      question: "Why AWS ECS Fargate?",
      answer: "Eliminated infrastructure management overhead while retaining fine-grained autoscaling triggers during peak traffic periods."
    }
  ],
  results: [
    { metric: "42%", label: "Faster API Response (P99 < 320ms)" },
    { metric: "65%", label: "Reduction in Infrastructure Costs" }
  ]
};

export const VERTEX_CASE_STUDY: CaseStudy = {
  id: "vertex-trading",
  title: "Vertex High-Frequency Trading Terminal",
  subtitle: "Real-time financial telemetry dashboard rendering 50,000+ data nodes.",
  role: "Senior Frontend Engineer",
  techStack: ["TypeScript", "WebGL", "Node.js", "Tailwind CSS", "WebSockets"],
  year: "2021",
  platform: "Institutional Desktop Terminal",
  overview: "Vertex Financial required an ultra-low latency trading interface capable of visualizing live stock order books and algorithmic trade executions without drop in frame rate.",
  problem: "Traditional DOM rendering froze browser threads when receiving over 1,000 ticker updates per second.",
  problemPoints: [
    "> Frame rates dropping below 15 FPS during market volatility",
    "> Memory leak build-up over 8-hour trading sessions",
    "> Canvas re-render queue blocking UI input events"
  ],
  myRoleDescription: "Designed custom WebGL instanced rendering pipelines and worker threads for parsing incoming WebSocket binary protocols.",
  keyChallenges: [
    {
      title: "Offscreen Canvas & Web Workers",
      description: "Offloaded WebGL buffer generation to background Web Workers to maintain 60 FPS UI responsiveness.",
      codeSnippet: `// Web Worker Offscreen Canvas Dispatcher
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);`
    }
  ],
  decisions: [
    {
      question: "Why WebGL over SVG?",
      answer: "DOM SVG nodes overhead scaled exponentially beyond 5,000 elements, whereas WebGL instanced rendering maintained 60 FPS for 50,000+ data nodes."
    }
  ],
  results: [
    { metric: "60 FPS", label: "Smooth Render Rate under Volatility" },
    { metric: "0ms", label: "UI Thread Blocking Delay" }
  ]
};

export const ACME_CASE_STUDY: CaseStudy = {
  id: "acme-design-system",
  title: "Acme Component Engine & Micro-Frontends",
  subtitle: "Modular frontend design system scaling across 5 enterprise product lines.",
  role: "Full-Stack Developer",
  techStack: ["React", "Python", "PostgreSQL", "Docker", "REST APIs"],
  year: "2018",
  platform: "Enterprise Web Suite",
  overview: "Unified fragmented product codebases into a shared, accessible component design system and automated CI/CD pipeline.",
  problem: "Duplicate component implementations caused inconsistent branding, bundle bloat, and slow release cycles.",
  problemPoints: [
    "> Bundle size exceeding 3.5 MB per initial page load",
    "> Inconsistent UI patterns across product lines"
  ],
  myRoleDescription: "Built core design tokens, automated accessibility test suites, and managed npm package distribution across engineering teams.",
  keyChallenges: [
    {
      title: "Tree-Shaking & Bundle Minimization",
      description: "Optimized ES module exports to allow lazy-loading of UI components on demand."
    }
  ],
  decisions: [
    {
      question: "Why Modular Component Architecture?",
      answer: "Allowed independent team deployments while maintaining strict brand consistency and 40% smaller bundle sizes."
    }
  ],
  results: [
    { metric: "40%", label: "Bundle Size Reduction" },
    { metric: "1.2s", label: "Faster Time to Interactive (TTI)" }
  ]
};

export const CAPABILITIES_DATA: CapabilityItem[] = [
  {
    id: "frontend",
    category: "FRONTEND",
    techTags: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS"],
    description: "Building high-performance, accessible, and visually striking user interfaces. Deep expertise in component architecture, state management, and custom rendering pipelines for complex web applications.",
    codeSnippet: `// High Performance Component Memoization & GPU Acceleration
export const RenderCanvas = memo(({ data }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('webgl2', { alpha: false });
    // Shader pipeline execution
  }, [data]);
  return <canvas ref={canvasRef} className="will-change-transform" />;
});`
  },
  {
    id: "backend",
    category: "BACKEND",
    techTags: ["Node.js", "Python", "Go", "Rust", "GraphQL", "PostgreSQL"],
    description: "Designing robust APIs, event-driven systems, and microservices. Focus on low-latency data processing, horizontal scalability, and secure serverless architecture for high-volume enterprise platforms.",
    codeSnippet: `// Event-Driven PubSub Handler with Rate Limiting
redisClient.subscribe('sync_channel', (message) => {
  const { eventType, payload } = JSON.parse(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.room === payload.roomId) {
      client.send(JSON.stringify({ type: eventType, data: payload }));
    }
  });
});`
  },
  {
    id: "cloud",
    category: "CLOUD & INFRA",
    techTags: ["AWS ECS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Redis"],
    description: "Implementing Infrastructure as Code, zero-downtime CI/CD deployment strategies, and automated container orchestration to ensure 99.99% system availability under surge traffic.",
    codeSnippet: `# Terraform AWS ECS Service Config
resource "aws_ecs_service" "main" {
  name            = "nexus-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 12
  launch_type     = "FARGATE"
}`
  }
];

export const CERTIFICATES_DATA: Certificate[] = [
  {
    id: "aws-solutions-architect",
    title: "AWS Certified Solutions Architect – Professional",
    issuer: "Amazon Web Services",
    date: "2024",
    credentialId: "AWS-PSA-9402817",
    verificationUrl: "https://aws.amazon.com/verification",
    certificateImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGgb0lMr8W8yOqtXeuKp4mz_DG71xjaHwdRUS3ck1-b4y_l4fyyr3R-mExRj4MTe23VSHunjYcSi1d3g5SxdW1ps_BaVpINnHerq9tbqBoky6XkPCbUCvNlIP4zx6mz934h-OfKoMv9R5nrqDbnOO6QbB3P4LvsHvsns-R2Fi8CUZCo-iJbwmIwzcsdoLFvnsQjiaeSRGXVGEfhJ0he5O-3cnyanna21HZCNbIpYgEptuNctLEAIZz3w",
    skills: ["Cloud Architecture", "AWS ECS", "Serverless", "Terraform", "Security"],
    badgeColor: "#FF9900"
  },
  {
    id: "cka-kubernetes",
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "2023",
    credentialId: "CKA-8291047",
    verificationUrl: "https://www.cncf.io/certification/cka/",
    certificateImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAc8YhbNz11DZUYs7MRHD5u_c3jsKL7Cy3wQdvmkPuZVNC7nLcgc1cZrBd_JDbUoU9RCGNp0w92chex3iwIy8XfLewk48yNx2kfXAfileVoOo1FcLELkYRdnXM6_njeSNlDZDAMgy5mgBhqvs4-ygk_yfwQ1iNz03Bmg2Dz7T6ICzXCmxmF7RN84uDW__X560Z-MMAfueTyS3DDDXYRwWjRbFlXPEPCvf7bHC2Sixr3y3YvxN0w83-UAA",
    skills: ["Kubernetes", "Container Security", "Helm", "Cluster Ops"],
    badgeColor: "#326CE5"
  },
  {
    id: "meta-fullstack",
    title: "Meta Senior Full-Stack Engineer Certificate",
    issuer: "Meta",
    date: "2023",
    credentialId: "META-FS-49201",
    verificationUrl: "https://coursera.org/verify/meta-fullstack",
    certificateImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUUoi6DnpAvsNHGVbft07X7-XOibjnxD6pX86LWhfX-tvjdXobOZ3B28Q8yuUhXBXBjHhf__7H6aZ0_ysFfP1p__H42W0HZ_9wuQzsFdaRTrOKXk_yg_o9mXaUKgzemdgC6P7vb8YDgTIPEnzfI4dO_fCyrPJbOBsBiWJvjqGP1YeIHqB0L_r5HsSpLNcRCcc1JWYup_MAeq9mBERWWhx-Q_Ar8J2kdNxXaML_jEBLagvCXk4PSL0rvg",
    skills: ["React", "Next.js", "Advanced System Design", "Web Performance"],
    badgeColor: "#0668E1"
  },
  {
    id: "gcp-professional-architect",
    title: "Google Cloud Professional Cloud Architect",
    issuer: "Google Cloud",
    date: "2022",
    credentialId: "GCP-PCA-104928",
    verificationUrl: "https://cloud.google.com/certification",
    certificateImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ_XrSPJkJR7IlL1lUCNFGifelxeEhTWAqLdmc7DomeEVS6DziDypVczcrTSWzVpJKc4X1vFRiGj-g1Q3bm4L4K-9v8aeKou92pYujOgPQLDcZy89mIOBqOw5WLuNny1T4Ys_E346z75GOpsuqHaLlgRqUnb32h_etn3X0sbJrCDCgd4IIPTVxBJm5WhI3_IWqvtZdhpydnwkobL5rzDBmvhalGc8xIOafx0Xdklh65CFl7bSjYqabQA",
    skills: ["GCP", "BigQuery", "Distributed Systems", "Cloud IAM"],
    badgeColor: "#4285F4"
  }
];

export const EXPERIENCE_DATA: ExperienceRole[] = [
  {
    id: "nexus",
    period: "2021 — PRESENT",
    location: "San Francisco, CA",
    role: "Staff Software Engineer",
    company: "Nexus Dynamics",
    description: "Led the architectural redesign of the core data processing engine, reducing P99 latency by 42%. Managed a cross-functional team of 6 engineers across full-stack deliverables and real-time dashboard telemetry.",
    skills: ["Rust", "React 19", "Next.js", "AWS ECS", "GraphQL", "Redis"],
    caseStudy: CASE_STUDY_DATA
  },
  {
    id: "vertex",
    period: "2018 — 2021",
    location: "New York, NY",
    role: "Senior Frontend Engineer",
    company: "Vertex Financial",
    description: "Developed a high-frequency trading dashboard with real-time WebGL charting. Improved client rendering performance for datasets exceeding 50,000 active nodes without UI lag.",
    skills: ["TypeScript", "WebGL", "Node.js", "Tailwind CSS"],
    caseStudy: VERTEX_CASE_STUDY
  },
  {
    id: "acme",
    period: "2016 — 2018",
    location: "Remote",
    role: "Full-Stack Developer",
    company: "Acme Enterprise Solutions",
    description: "Architected modern microservices and modular UI design systems used across 5 flagship product lines. Reduced bundle sizes by 40% and improved TTI by 1.2s.",
    skills: ["React", "Python", "PostgreSQL", "Docker", "REST APIs"],
    caseStudy: ACME_CASE_STUDY
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-1",
    name: "Marcus Vance",
    role: "VP of Engineering",
    company: "Nexus Logistics",
    quote: "Sougata re-architected our core data pipeline, reducing P99 latency by 50% while mentoring our senior engineers on strict TypeScript standards.",
    relationship: "Managed Sougata directly"
  },
  {
    id: "test-2",
    name: "Elena Rostova",
    role: "Chief Technology Officer",
    company: "Vertex Cloud Labs",
    quote: "One of the most pragmatic full-stack architects I've worked with. Delivers zero-compromise code with exceptional speed and UI finesse.",
    relationship: "Client & Collaborator"
  }
];

export const DEFAULT_WORK_FILTERS: string[] = [
  "ALL", "TypeScript", "Next.js", "React", "Node.js", "Python", "Rust", "PostgreSQL", "AWS", "Docker", "GraphQL"
];

export const INITIAL_CMS_DATA: CMSData = {
  hero: HERO_DATA,
  about: ABOUT_DATA,
  capabilities: CAPABILITIES_DATA,
  caseStudy: CASE_STUDY_DATA,
  caseStudies: [CASE_STUDY_DATA, VERTEX_CASE_STUDY, ACME_CASE_STUDY],
  certificates: CERTIFICATES_DATA,
  experience: EXPERIENCE_DATA,
  testimonials: TESTIMONIALS_DATA,
  sectionTags: DEFAULT_SECTION_TAGS,
  customWorkFilters: DEFAULT_WORK_FILTERS,
  enableThemeToggle: true,
  enableMaintenanceMode: false,
  maintenanceMessage: "We are currently performing scheduled system maintenance and content updates. Please check back shortly.",
  enableCommandTerminal: true,
  enableTestimonials: true,
  enableSoundEffects: true
};
