export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  challenge: string;
  research: string;
  insights: string;
  solution: string;
  outcome: string;
  resources: {
    title: string;
    url: string;
    type: string;
  }[];
}

export interface MoreProject {
  id: string;
  name: string;
  category: string;
  description: string;
  links?: {
    title: string;
    url: string;
    type: string;
  }[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description?: string;
  bullets: string[];
  focusAreas?: string[];
}

export interface Recognition {
  title: string;
  award: string;
  description: string;
  certificateUrl?: string;
}

export const SELECTED_WORK: Project[] = [
  {
    id: "creditplanner",
    name: "CreditPlanner",
    tagline: "Improving trust in fintech recommendations through explainable product experiences.",
    description: "Identified a trust gap in CardWise, a fintech application that recommends the best credit card based on billing cycles, rewards, and interest-free periods.",
    coverImage: "/assets/creditplanner_card.svg",
    challenge: "Users received smart recommendations but could not understand why specific cards were being suggested, reducing trust and feature adoption.",
    research: "Conducted interviews with 19 users and used the product extensively to understand recommendation behavior, trust issues, and decision-making patterns.",
    insights: "• 84% could not explain recommendation logic\n• 89% did not understand the impact of ignoring recommendations\n• Users trusted the data less because they lacked context",
    solution: "Proposed contextual explanations for every recommendation so users could understand the reasoning behind card suggestions without changing the recommendation engine itself.",
    outcome: "16 of 19 users reported higher trust and willingness to follow recommendations after receiving contextual explanations.\n\nWinner — PM Challenge 2026",
    resources: [
      {
        title: "Presentation Deck",
        url: "https://docs.google.com/presentation/d/11FrAU42ttP5hurPXpD4_t-RNbhw_qL1F/edit?slide=id.p1#slide=id.p1",
        type: "Presentation"
      },
      {
        title: "LinkedIn Case Discussion",
        url: "https://www.linkedin.com/posts/sou-y_productmanagement-pmchallenge2026-cardwise-ugcPost-7464248402302640128-i-RH/",
        type: "LinkedIn"
      }
    ]
  },
  {
    id: "netro",
    name: "Netro",
    tagline: "A smart networking platform that transforms event connections into lasting professional relationships.",
    description: "Netro is a smart digital networking platform designed to replace traditional business cards with dynamic QR-based profiles, conversation context, and professional relationship management.",
    coverImage: "/assets/netro_logo.svg",
    challenge: "Traditional business cards are frequently lost, forgotten, or disconnected from the conversations that created them, making meaningful follow-ups difficult.",
    research: "Conducted discussions with students and professionals attending networking events to understand networking behavior, follow-up challenges, and business card usage patterns.",
    insights: "• Business cards are often lost after events\n• Users forget conversation context\n• Existing solutions focus on sharing contacts, not building relationships",
    solution: "Designed Netro, a digital networking platform that combines QR-based profile sharing, contact management, conversation notes, and networking analytics to improve relationship-building.",
    outcome: "Created a complete product concept that combines digital business cards, contact management, networking analytics, and future CRM integration opportunities.",
    resources: [
      {
        title: "Prototype & Wireframe",
        url: "https://netro-751538530016.asia-southeast1.run.app",
        type: "Prototype"
      }
    ]
  },
  {
    id: "airesumebuilder",
    name: "AI Resume Builder",
    tagline: "Helping professionals transition careers through AI-powered resume customization.",
    description: "Built an AI-powered platform that helps professionals create role-specific resumes tailored to target job opportunities and ATS requirements.",
    coverImage: "/assets/ai_resume_builder.svg",
    challenge: "Career switchers often struggle to customize resumes, highlight transferable skills, and position themselves effectively for new roles.",
    research: "Spoke with students, professionals, and job seekers to understand resume customization challenges, ATS concerns, and application behavior.",
    insights: "• Most candidates use the same resume for multiple applications\n• ATS optimization is poorly understood\n• Manual customization is repetitive and time-consuming",
    solution: "Designed an AI-powered resume builder that generates personalized resume content based on a user's existing resume and desired target role.",
    outcome: "Developed an MVP capable of transforming generic resumes into role-specific applications while reducing manual customization effort.",
    resources: [
      {
        title: "Interactive Web Prototype",
        url: "https://ai-resume-builder-d9dc6a32.base44.app/",
        type: "Prototype"
      }
    ]
  }
];

export const MORE_PROJECTS: MoreProject[] = [
  {
    id: "zomato",
    name: "Zomato",
    category: "PRODUCT TEARDOWN & UX",
    description: "Designed a product strategy case study focused on reducing ordering time on Zomato by addressing decision fatigue, discovery friction, and user drop-offs. Proposed AI-driven personalization and UX improvements to improve conversion and retention.",
    links: [
      {
        title: "Presentation",
        url: "https://drive.google.com/file/d/1Jb9uvjdF6jS_dGK2PK8Hs6ArqvAjXl4s/view",
        type: "Presentation"
      },
      {
        title: "LinkedIn Post",
        url: "https://www.linkedin.com/posts/sou-y_case-study-ugcPost-7461736841713463296-PHLQ/",
        type: "LinkedIn"
      }
    ]
  },
  {
    id: "slikk",
    name: "Slikk",
    category: "GROWTH & GTM STRATEGY",
    description: "Built a GTM strategy for Slikk's Home Decor expansion in HSR Layout, focusing on trust, quality assurance, and customer confidence rather than delivery speed. Secured Runner-Up position at The Builder's League competition.",
    links: [
      {
        title: "Presentation",
        url: "https://drive.google.com/file/d/1GrNoIzjijezJfp6lrKcOx_VdYcrhs1OT/view",
        type: "Presentation"
      },
      {
        title: "LinkedIn Post",
        url: "https://www.linkedin.com/posts/sou-y_casecompetition-scalerschoolofbusiness-slikk-ugcPost-7460172626385154048-BUPn/",
        type: "LinkedIn"
      }
    ]
  },
  {
    id: "linkedin-automation",
    name: "AI LinkedIn Automation",
    category: "AI & AUTOMATION",
    description: "Built an end-to-end LinkedIn content automation workflow using Make.com, Gemini AI, Google Sheets, LinkedIn, and Gmail. Automated content generation, publishing, and notifications to reduce manual effort.",
    links: [
      {
        title: "Document Demo",
        url: "https://docs.google.com/document/d/1L_AiR9MCBs9isap7ORZ17s9ekwArQEtTwQX7puuqIIM/edit",
        type: "Demo"
      }
    ]
  },
  {
    id: "homestay-assistant",
    name: "AI Homestay Assistant",
    category: "CONVERSATIONAL AI",
    description: "Developed an AI-powered travel assistant that recommends personalized homestays based on budget, location, amenities, and travel preferences through natural language conversations.",
    links: [
      {
        title: "Document Demo",
        url: "https://docs.google.com/document/d/1i_tfrwRkAAW4WHUY2Ytkz_BrptiDUEhb_WCz79xGH5U/edit",
        type: "Demo"
      }
    ]
  },
  {
    id: "wispr-flow",
    name: "Wispr Flow – Product Onboarding Case Study",
    category: "PRODUCT MANAGEMENT & UX RESEARCH",
    description: "Analyzed Wispr Flow's onboarding experience, identified user friction in permissions and onboarding, validated findings across Android and iPhone users, and proposed actionable improvements to enhance first-time user activation.",
    links: [
      {
        title: "CASE STUDY",
        url: "https://docs.google.com/document/d/1Y1xN3RuAZ53SliqmRT0vVAEwZzZHQlJY/edit?usp=sharing&ouid=114639471073486384576&rtpof=true&sd=true",
        type: "Case Study"
      }
    ]
  }
];

export const EXPERIENCE_HISTORY: Experience[] = [
  {
    company: "ACCENTURE INDIA",
    role: "Campaign Management Associate",
    period: "Sep 2022 – Apr 2024",
    location: "Mumbai, India",
    description: "Worked across global brands to improve campaign performance, stakeholder alignment, and business outcomes through data-driven decision making.",
    bullets: [
      "Managed stakeholder relationships across 10+ global brands, optimizing creative, tech, and analytics workflows to accelerate multi-channel campaign delivery.",
      "Managed a £100,000 monthly advertising budget on nectar360, consistently exceeding performance targets through strategic campaign optimization."
    ],
    focusAreas: [
      "Stakeholder Management",
      "Cross-functional Collaboration",
      "Campaign Strategy",
      "Growth Marketing",
      "Analytics",
      "Budget Ownership"
    ]
  },
  {
    company: "NETZWERK ACADEMY / NETZWERK AI",
    role: "Data Analyst Intern",
    period: "Nov 2024 – May 2025",
    location: "Remote",
    description: "Used data and analytics to uncover business insights, improve reporting efficiency, and support product and business decision making.",
    bullets: [
      "Analyzed large student engagement and performance datasets using SQL and Google Sheets to extract actionable, data-driven business insights.",
      "Reduced manual cross-functional reporting requests by 40% by designing and building high-visibility interactive Tableau dashboards."
    ],
    focusAreas: [
      "SQL",
      "Tableau",
      "Analytics",
      "Dashboarding",
      "Business Insights",
      "Data Storytelling"
    ]
  },
  {
    company: "IDEASTACK SOLUTIONS",
    role: "Digital Marketing Intern",
    period: "Dec 2021 – Jun 2022",
    location: "Mumbai, India",
    description: "Supported paid marketing and SEO initiatives focused on improving campaign performance and organic growth.",
    bullets: [
      "Maximized efficiency of a ₹1 lakh monthly PPC budget by implementing negative keyword filters and conducting systematic A/B ad copy testing.",
      "Increased organic search visibility and user acquisition through SEO technical audits and high-authority backlink strategies."
    ],
    focusAreas: [
      "SEO",
      "SEM",
      "Google Ads",
      "Performance Marketing",
      "Growth"
    ]
  }
];

export const RECOGNITIONS: Recognition[] = [
  {
    title: "PM Challenge Winner",
    award: "Winner — PM Challenge 2026 (Fintech)",
    description: "Identified a trust gap in a fintech application by analyzing user behavior and conducting interviews with 19 users. Proposed an explainable recommendation framework that improved user understanding and was validated by 16 participants.",
    certificateUrl: "https://drive.google.com/file/d/1RrD69sAl1GMx_9OcKMtHnVZvkVk1YUr8/view?usp=sharing"
  },
  {
    title: "Skillathon Winner",
    award: "1st Place — Skillathon, Innovation Lab (2026)",
    description: "Led product discovery for a chronic disease management platform, leveraging feedback from 120+ users and secondary research to validate market demand and product opportunity.",
    certificateUrl: "https://drive.google.com/file/d/13al2xtqFCrKYrDfuTiW7KQzb9VOo8Zyc/view?usp=sharing"
  },
  {
    title: "Builder's League Runner-Up",
    award: "Runner-Up — Quick Commerce Case Competition (2026)",
    description: "Developed a GTM strategy for Slikk's Home Decor expansion in HSR Layout by identifying customer trust gaps, discovery challenges, and scalable growth opportunities.",
    certificateUrl: "https://drive.google.com/file/d/1ScBO2Q9kwOlen8cTmm3hceaDiETtpTZ8/view?usp=sharing"
  }
];

