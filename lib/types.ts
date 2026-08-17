export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  certificateImage?: string;
  skills: string[];
  badgeColor?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  techStack: string[];
  year: string;
  platform: string;
  overview: string;
  problem: string;
  problemPoints: string[];
  myRoleDescription: string;
  keyChallenges: {
    title: string;
    description: string;
    codeSnippet?: string;
  }[];
  decisions: {
    question: string;
    answer: string;
  }[];
  results: {
    metric: string;
    label: string;
  }[];
}

export interface ExperienceRole {
  id: string;
  period: string;
  location: string;
  role: string;
  company: string;
  description: string;
  highlights?: string[];
  skills: string[];
  caseStudy?: CaseStudy;
}

export interface CapabilityItem {
  id: string;
  category: string;
  techTags: string[];
  description: string;
  codeSnippet: string;
}

export interface HeroData {
  name: string;
  title: string;
  headline: string;
  subheadline: string;
  experienceYears: string;
  location: string;
  status: string;
  skillsTicker: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  contactEmail?: string;
}

export interface AboutData {
  title?: string;
  titleHighlight?: string;
  paragraph1?: string;
  paragraph2?: string;
  portraitImage?: string;
  highlights?: string[];
}

export interface SectionTags {
  work: string;
  certificates: string;
  capabilities: string;
  contact: string;
  about?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  quote: string;
  relationship?: string;
}

export interface CMSData {
  hero: HeroData;
  about?: AboutData;
  capabilities: CapabilityItem[];
  caseStudy: CaseStudy;
  caseStudies?: CaseStudy[];
  certificates: Certificate[];
  experience: ExperienceRole[];
  testimonials?: Testimonial[];
  sectionTags?: SectionTags;
  customWorkFilters?: string[];
  enableThemeToggle?: boolean;
  enableMaintenanceMode?: boolean;
  maintenanceMessage?: string;
  enableCommandTerminal?: boolean;
  enableTestimonials?: boolean;
  enableSoundEffects?: boolean;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  csrfToken: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}
