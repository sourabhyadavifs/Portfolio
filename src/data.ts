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

export const CREDITPLANNER_PROJECT_DATA: Project = {
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
};

export const SELECTED_WORK: Project[] = [
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
  },
  {
    id: "aivoicereceptionist",
    name: "AI Voice Receptionist",
    tagline: "Built using Retell AI, Gemini 2.5 Flash-Lite, Google Calendar and Cal.com. Wrote custom prompts, tested with 3 users across 3 real conversations, and iterated based on feedback.",
    description: "Built an AI-powered voice receptionist for Green Trends Unisex Hair & Style Salon – Bagalur Road to automate customer interactions, answer common salon enquiries, and streamline appointment bookings. The AI voice agent engages customers in natural conversations, provides information about salon services, pricing, business hours, and location, checks appointment availability through Google Calendar, and books appointments using the Cal.com API.",
    coverImage: "/assets/ai_voice_receptionist.svg",
    challenge: "Salon owners and receptionists spend a significant amount of time handling repetitive customer calls.\n\nCustomers frequently call to:\n• Ask about salon services\n• Enquire about pricing\n• Check business hours\n• Confirm salon location\n• Book appointments\n\nHandling these repetitive enquiries manually increases staff workload, causes delays during busy hours, and sometimes results in missed calls and lost bookings.\n\nTraditional phone systems lack automation and require customers to wait for a receptionist, creating a less efficient customer experience.",
    research: "User Interviews\nStudied how customers interact with salon receptionists and identified the most common reasons people call salons.\n\nUser Journey Analysis\nMapped the customer journey from initiating a phone call to successfully booking an appointment.\n\nSecondary Research\nResearched conversational AI, voice assistants, appointment scheduling systems, and AI receptionists used in service-based businesses.\n\nCompetitor Analysis\nAnalyzed AI voice assistant solutions and traditional salon booking experiences to identify opportunities for improving customer interactions through conversational automation.",
    insights: "• Most customer calls involve repetitive questions about services, pricing, timings, and appointments.\n• Customers prefer immediate responses over waiting for staff availability.\n• Booking appointments through natural conversation creates a more convenient experience.\n• Integrating AI with scheduling systems eliminates manual appointment coordination.\n• AI can significantly reduce receptionist workload while maintaining a professional customer experience.",
    solution: "Designed and developed an AI-powered voice receptionist capable of handling customer enquiries and appointment bookings through natural voice conversations.\n\nThe solution integrates conversational AI with Google Calendar and the Cal.com API, enabling customers to check appointment availability and schedule appointments without human intervention.",
    outcome: "Successfully developed an AI-powered voice receptionist capable of handling customer enquiries and appointment bookings with minimal human intervention.\n\nKey Outcomes:\n• Automated repetitive customer calls\n• Reduced receptionist workload\n• Simplified appointment booking\n• Improved customer response time\n• Integrated real-time calendar availability\n• Delivered a seamless voice-based customer experience\n\nThe project demonstrated how conversational AI can automate front-desk operations while improving customer service for small businesses.",
    resources: [
      {
        title: "Demo Video",
        url: "https://drive.google.com/file/d/1soDdGWIpnyP0Jx2Xfp5vh8SNJJb5ybOg/view?usp=sharing",
        type: "Video"
      }
    ]
  }
];

export const ZOMATO_PROJECT_DATA: Project = {
  id: "zomato",
  name: "Zomato",
  tagline: "Reducing decision fatigue through behavioral product design and smarter recommendation experiences.",
  description: "Reducing decision fatigue through behavioral product design and smarter recommendation experiences.",
  coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  challenge: "Although Zomato has optimized restaurant discovery and delivery, users still spend excessive time deciding what to eat.\n\nCommon behaviors observed:\n• Endless scrolling\n• Comparing ratings and reviews\n• Comparing delivery times\n• Switching between restaurants\n• Closing the app without ordering\n• Returning later and restarting the search\n\nThe real problem wasn't delivery. It was decision fatigue.\n\nLonger decision time leads to lower conversions, higher abandonment, poorer customer experience, reduced repeat ordering, and increased cognitive overload. Helping users decide faster improves both business metrics and user satisfaction.",
  research: "User Interviews\nSpoke with friends, classmates, and frequent Zomato users to understand ordering behavior.\n\nSurveys\nCollected qualitative feedback on restaurant selection habits and browsing patterns.\n\nBehavioral Observation\nAnalyzed repeated scrolling, comparison loops, and abandoned sessions.\n\nCompetitor Analysis\nReviewed recommendation systems across food delivery, entertainment, and e-commerce products.",
  insights: "• Users know their mood but not what they want to eat.\n• Too many choices create decision fatigue.\n• Users repeatedly compare options before acting.\n• Many reopen the app several times before placing an order.\n• Recommendations optimize restaurants instead of decision-making.",
  solution: "Proposed behavioral design features to solve decision fatigue:\n\n• Food Autopilot: A habit-based recommendation engine that enables one-tap ordering for recurring meals.\n• Hungry State Detection: Detects prolonged browsing and simplifies the experience when users appear overwhelmed.\n• Emotional Ordering: Suggests food based on user intent or mood instead of cuisine (Comfort Food, Healthy Choice, Late Night Cravings, Quick Energy, Celebration Meals).\n\nCore product principle:\nShift from \"What restaurant should we recommend?\" to \"How can we help users decide faster?\"",
  outcome: "Developed a product strategy aimed at reducing ordering time by approximately 40%.\n\nDemonstrated that improving decision-making can be just as valuable as improving logistics.",
  resources: [
    {
      title: "Presentation",
      url: "https://drive.google.com/file/d/1Jb9uvjdF6jS_dGK2PK8Hs6ArqvAjXl4s/view",
      type: "Presentation"
    },
    {
      title: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/sou-y_case-study-ugcPost-7461736841713463296-PHLQ/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC4lWdABNg_70UszDy71gVX5DauC2NJ45qw",
      type: "LinkedIn"
    }
  ]
};

export const SLIKK_PROJECT_DATA: Project = {
  id: "slikk",
  name: "Slikk",
  tagline: "Developed a go-to-market strategy for Slikk to support the launch of its Home Decor category in HSR Layout. The strategy focused on customer trust, product confidence, and discovery-led shopping rather than competing solely on delivery speed.",
  description: "Developed a go-to-market strategy for Slikk to support the launch of its Home Decor category in HSR Layout.",
  coverImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
  challenge: "Slikk wanted to expand into the Home Decor category, where customers value trust, quality, and visualization more than ultra-fast delivery. The challenge was to identify a product strategy that would drive customer confidence, adoption, and repeat purchases in a considered buying journey.\n\nUnlike grocery purchases, home decor decisions involve higher emotional investment and greater purchase hesitation. Improving customer confidence can increase conversion, category adoption, and long-term customer engagement.",
  research: "User Interviews\nConducted customer interviews to understand buying behaviour and purchase hesitation.\n\nSurveys\nCollected feedback on trust factors, product discovery, and delivery expectations.\n\nSecondary Research\nStudied home decor trends and quick-commerce category expansion opportunities.\n\nCompetitor Analysis\nBenchmarked Amazon, Flipkart, IKEA, Pepperfry, and local retailers to identify trust-building opportunities.",
  insights: "• Customers value trust over delivery speed.\n• Product visualization increases purchase confidence.\n• Community recommendations strongly influence buying decisions.\n• Quality assurance reduces hesitation.\n• Home decor requires a different product strategy than groceries.",
  solution: "Proposed initiatives to prioritize customer trust and confidence over delivery speed:\n\n• 90 Minutes or Free: A delivery promise designed to balance speed with customer confidence.\n• QA Verification Videos: Show product quality before dispatch.\n• AR Room Visualization: Help customers visualize products in their own homes.\n• Personalized Packaging: Improve trust with customer-tagged verification.\n• Community Trust Loops: Encourage user-generated content and apartment-focused discovery.\n\nCore product principle:\nShift from \"How fast can we deliver?\" to \"How confidently can customers purchase?\"",
  outcome: "Developed a differentiated go-to-market strategy for Slikk's Home Decor expansion.\n\nThe strategy received Runner-Up recognition at The Builder's League Case Competition hosted by Scaler School of Business and won ₹25,000.\n\nIt demonstrated how customer psychology, trust, and operational feasibility can become competitive advantages.",
  resources: [
    {
      title: "Presentation",
      url: "https://drive.google.com/file/d/1GrNoIzjijezJfp6lrKcOx_VdYcrhs1OT/view",
      type: "Presentation"
    },
    {
      title: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/sou-y_casecompetition-scalerschoolofbusiness-slikk-ugcPost-7460172626385154048-BUPn/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC4lWdABNg_70UszDy71gVX5DauC2NJ45qw",
      type: "LinkedIn"
    }
  ]
};

export const WISPR_FLOW_PROJECT_DATA: Project = {
  id: "wispr-flow",
  name: "Wispr Flow",
  tagline: "Conducted a Product & Onboarding UX Audit of Wispr Flow, an AI-powered voice-to-text application, to evaluate the first-time user experience and identify opportunities to improve user activation. The audit combined personal testing with usability observations from five participants across Android and iOS.",
  description: "Audited Wispr Flow's onboarding experience to identify usability gaps, improve activation, and recommend product enhancements based on real user testing.",
  coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  challenge: "Although Wispr Flow communicates a strong value proposition, the onboarding experience introduces friction that slows user activation.\n\nKey issues included:\n• Multiple permission requests without guidance\n• Confusing onboarding flow\n• Android users seeing iPhone-specific instructions\n• Limited differentiation from native voice typing\n• Reduced emphasis on the core value proposition\n\nThe challenge was improving onboarding clarity and helping users reach their first \"Aha!\" moment faster.\n\nFirst impressions strongly influence product adoption. Reducing onboarding friction improves activation, user confidence, and long-term retention. For AI productivity products, onboarding must quickly demonstrate why users should choose the product over built-in alternatives.",
  research: "Usability Testing\nConducted usability testing with 5 participants (myself plus four additional users), including Android and iPhone users.\n\nUser Journey Analysis\nMapped the onboarding journey from installation through first-time use.\n\nComparative Analysis\nCompared onboarding experiences across Android and iOS.\n\nObservation-Based Research\nDocumented user behaviour, confusion points, navigation patterns, and first impressions.",
  insights: "• Users quickly understand the value proposition.\n• Permission requests create the biggest onboarding friction.\n• Android onboarding needs platform-specific guidance.\n• Users compare Wispr Flow with native voice typing.\n• The floating voice button creates a memorable \"Aha!\" moment.",
  solution: "Proposed recommendations as feature cards:\n\n• Permission Flow Improvements: Simplify permission requests and add better guidance.\n• Platform-Specific Onboarding: Provide onboarding tailored to Android and iOS.\n• Stronger Product Positioning: Clearly communicate why Wispr Flow is better than native voice typing.\n• Improved First-Time Experience: Reduce onboarding friction and accelerate activation.\n\nCore product principle:\nShift from \"Request permissions quickly\" to \"Help users understand value before asking for commitment.\"",
  outcome: "Completed a comprehensive onboarding audit that identified multiple activation barriers and practical opportunities to improve the first-time user experience.\n\nThe audit demonstrated how structured usability research can translate into actionable product recommendations.",
  resources: [
    {
      title: "Product & Onboarding UX Audit",
      url: "https://docs.google.com/document/d/1Y1xN3RuAZ53SliqmRT0vVAEwZzZHQlJY/edit?usp=sharing&ouid=114639471073486384576&rtpof=true&sd=true",
      type: "Document"
    }
  ]
};

export const LINKEDIN_AUTOMATION_PROJECT_DATA: Project = {
  id: "linkedin-automation",
  name: "AI LinkedIn Automation",
  tagline: "Built an end-to-end AI-powered workflow that automatically transforms content ideas into published LinkedIn posts using Make.com, Google Sheets, Gemini AI, LinkedIn, and Gmail.",
  description: "Built an end-to-end AI-powered workflow that automatically transforms content ideas into published LinkedIn posts using Make.com, Google Sheets, Gemini AI, LinkedIn, and Gmail. The system streamlines content creation, publishing, and notifications with minimal manual effort.",
  coverImage: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=1200&q=80",
  challenge: "Professionals spend significant time creating and publishing LinkedIn content.\n\nCommon challenges include:\n• Generating quality content ideas\n• Writing engaging posts\n• Maintaining posting consistency\n• Manually publishing content\n• Tracking publishing status\n• Switching across multiple tools\n\nThe repetitive workflow limits productivity and scalability.\n\nFirst impressions and consistent visibility strongly influence audience growth. Automating content creation enables consistent publishing, reduced manual effort, higher productivity, and scalable content operations, freeing up more time for strategy instead of execution.",
  research: "User Interviews\nDiscussed publishing challenges with professionals and LinkedIn creators.\n\nWorkflow Analysis\nMapped the complete journey from idea generation to publishing.\n\nProcess Observation\nIdentified repetitive manual tasks suitable for automation.\n\nTool Evaluation\nCompared AI and automation platforms to design the optimal workflow.",
  insights: "• Writing consumes most publishing time.\n• Consistency is harder than generating ideas.\n• Users frequently switch between multiple tools.\n• Publishing contains repetitive tasks ideal for automation.\n• AI becomes significantly more valuable within structured workflows.",
  solution: "Proposed recommendations as an automated workflow:\n\nGoogle Sheets → Gemini AI → LinkedIn Publishing → Gmail Notification\n\nHighlighting the automation pipeline:\nIdea → AI Generation → Publish → Email Confirmation\n\nMake.com orchestrates the complete workflow.",
  outcome: "Completed end-to-end implementation that delivers:\n• Fully automated content workflow\n• Significant reduction in manual effort\n• Improved publishing consistency\n• Reusable automation framework\n• Scalable AI-powered content operations",
  resources: [
    {
      title: "Demo Video",
      url: "https://drive.google.com/file/d/1yAcwV136KsoamnMeggKF8VJQWYBJfCp7/view?usp=sharing",
      type: "Video"
    },
    {
      title: "Workflow Documentation",
      url: "https://docs.google.com/document/d/1L_AiR9MCBs9isap7ORZ17s9ekwArQEtTwQX7puuqIIM/edit",
      type: "Document"
    }
  ]
};

export const HOMESTAY_ASSISTANT_PROJECT_DATA: Project = {
  id: "homestay-assistant",
  name: "AI Homestay Recommendation Assistant",
  tagline: "Built an AI-powered conversational assistant that helps travelers discover personalized homestay recommendations based on budget, destination, travel purpose, amenities, and preferences.",
  description: "Built an AI-powered conversational assistant that helps travelers discover personalized homestay recommendations based on budget, destination, travel purpose, amenities, and preferences. The chatbot uses natural language conversations to simplify accommodation discovery and deliver tailored recommendations.",
  coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  challenge: "Finding the right accommodation is time-consuming and overwhelming.\n\nCommon challenges include:\n• Browsing multiple booking platforms\n• Comparing numerous listings\n• Applying endless filters\n• Evaluating locations and amenities\n• Struggling to match stays with travel goals\n\nMost booking platforms rely on search and filtering instead of understanding user intent through conversation, resulting in decision fatigue.\n\nBetter accommodation recommendations improve the overall travel experience. A conversational AI assistant can reduce search effort, minimize decision fatigue, improve recommendation relevance, personalize travel planning, and help users discover suitable stays faster.",
  research: "User Interviews\nInterviewed travelers and students to understand accommodation search behavior and booking challenges.\n\nUser Journey Analysis\nMapped the journey from trip planning to accommodation booking.\n\nSecondary Research\nStudied travel booking behavior, recommendation systems, and conversational AI applications.\n\nCompetitor Analysis\nEvaluated Airbnb, Booking.com, Agoda, and MakeMyTrip to identify opportunities for conversational recommendations.",
  insights: "• Users know the experience they want more than the exact property.\n• Excessive filtering creates decision fatigue.\n• Personalized recommendations outperform generic search results.\n• Conversational guidance reduces search time.\n• Natural conversations feel easier than navigating multiple filters.",
  solution: "Designed an AI-powered conversational recommendation assistant that guides travelers through accommodation discovery.\n\nCore capabilities include:\n• Conversational Travel Assistance\n• Personalized Homestay Recommendations\n• Preference-Based Filtering\n• Dynamic Recommendation Engine\n• Simple Chat-Based User Experience\n\nRecommendations are generated dynamically using user preferences such as budget, destination, amenities, travel purpose, and preferred experiences.",
  outcome: "Completed implementation of a functional AI-powered travel assistant that simplifies accommodation discovery, reduces search effort, improves recommendation relevance, and personalizes travel planning. The project successfully demonstrates AI-driven travel decision support.",
  resources: [
    {
      title: "Demo Video",
      url: "https://drive.google.com/file/d/1dJkggg_Ok8L8YJ702rTIwR1jWVJHUzT5/view?usp=sharing",
      type: "Video"
    }
  ]
};

export const MORE_PROJECTS: MoreProject[] = [
  {
    id: "creditplanner",
    name: "CreditPlanner",
    category: "FINTECH PRODUCT STRATEGY",
    description: "Improving trust in fintech recommendations through explainable product experiences.",
    links: [
      {
        title: "CASE STUDY ↗",
        url: "#",
        type: "Case Study"
      }
    ]
  },
  {
    id: "zomato",
    name: "Zomato",
    category: "PRODUCT STRATEGY & UX",
    description: "Reducing decision fatigue through behavioral product design and smarter recommendation experiences.",
    links: [
      {
        title: "CASE STUDY ↗",
        url: "#",
        type: "Case Study"
      }
    ]
  },
  {
    id: "slikk",
    name: "Slikk",
    category: "PRODUCT STRATEGY & GO-TO-MARKET",
    description: "Designed a go-to-market strategy for Slikk's Home Decor expansion by prioritizing customer trust, visualization, and confidence over delivery speed.",
    links: [
      {
        title: "CASE STUDY ↗",
        url: "#",
        type: "Case Study"
      }
    ]
  },
  {
    id: "linkedin-automation",
    name: "AI LinkedIn Automation",
    category: "AI & AUTOMATION",
    description: "Built an end-to-end AI-powered workflow that automatically transforms content ideas into published LinkedIn posts using Make.com, Google Sheets, Gemini AI, LinkedIn, and Gmail.",
    links: [
      {
        title: "CASE STUDY ↗",
        url: "#",
        type: "Case Study"
      }
    ]
  },
  {
    id: "homestay-assistant",
    name: "AI Homestay Recommendation Assistant",
    category: "AI Product",
    description: "Built an AI-powered conversational assistant that helps travelers discover personalized homestay recommendations based on budget, destination, travel purpose, amenities, and preferences.",
    links: [
      {
        title: "CASE STUDY ↗",
        url: "#",
        type: "Case Study"
      }
    ]
  },
  {
    id: "wispr-flow",
    name: "Wispr Flow",
    category: "PRODUCT AUDIT & UX RESEARCH",
    description: "Audited Wispr Flow's onboarding experience to identify usability gaps, improve activation, and recommend product enhancements based on real user testing.",
    links: [
      {
        title: "CASE STUDY ↗",
        url: "#",
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
    certificateUrl: "https://lnkd.in/p/gm5mFdrX"
  },
  {
    title: "Skillathon Winner",
    award: "1st Place — Skillathon, Innovation Lab (2026)",
    description: "Led product discovery for a chronic disease management platform, leveraging feedback from 120+ users and secondary research to validate market demand and product opportunity.",
    certificateUrl: "https://lnkd.in/p/gwTCu6jx"
  },
  {
    title: "Builder's League Runner-Up",
    award: "Runner-Up — Quick Commerce Case Competition (2026)",
    description: "Developed a GTM strategy for Slikk's Home Decor expansion in HSR Layout by identifying customer trust gaps, discovery challenges, and scalable growth opportunities.",
    certificateUrl: "https://lnkd.in/p/g7R5hE8r"
  }
];

