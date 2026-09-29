export interface SACService {
  description: string;
  sacCode: string;
  gstRate: number;
}

export const SAC_SERVICES: SACService[] = [
  // Object 1 — Core IT & Technology Services
  { description: "Software Development (Custom — ERP, CRM, Tools)", sacCode: "998311", gstRate: 18 },
  { description: "Web Application Development", sacCode: "998312", gstRate: 18 },
  { description: "Mobile Application Development (Android / iOS)", sacCode: "998316", gstRate: 18 },
  { description: "UI / UX Design — App & Web Screens, Wireframes", sacCode: "998394", gstRate: 18 },
  { description: "Search Engine Optimization (SEO / GEO / AEO)", sacCode: "998365", gstRate: 18 },
  { description: "Social Media Management", sacCode: "998365", gstRate: 18 },
  { description: "Digital Marketing (Campaigns, Strategy)", sacCode: "998365", gstRate: 18 },
  { description: "Content Creation & Copywriting", sacCode: "998471", gstRate: 18 },
  { description: "Video Editing & Production (Reels, Corporate, YouTube)", sacCode: "999612", gstRate: 18 },
  { description: "Allied Technology-Driven Solutions (General IT)", sacCode: "998314", gstRate: 18 },

  // Object 2 — Digital Platforms, Portals & App Operations
  { description: "Mobile App Development, Licensing & Distribution", sacCode: "998316", gstRate: 18 },
  { description: "Web Portal Development & Maintenance", sacCode: "998312", gstRate: 18 },
  { description: "SaaS Platform / Digital Platform Development", sacCode: "998311", gstRate: 18 },
  { description: "Online Library / LMS (Learning Management System)", sacCode: "998311", gstRate: 18 },
  { description: "AMC — Annual Maintenance Contract (IT Systems)", sacCode: "998315", gstRate: 18 },
  { description: "Server / Hosting / Cloud / DevOps / VPS Management", sacCode: "998319", gstRate: 18 },

  // Object 3 — Educational & Cultural Content Creation
  { description: "Educational Content Development (Digital Formats)", sacCode: "998471", gstRate: 18 },
  { description: "E-Book / Audio Book / Video Content Production", sacCode: "999612", gstRate: 18 },
  { description: "Interactive Learning Material Development", sacCode: "998311", gstRate: 18 },
  { description: "Educational Game Development", sacCode: "998311", gstRate: 18 },
  { description: "Content Translation & Localization (Regional Languages)", sacCode: "998471", gstRate: 18 },
  { description: "Children's Literature — Digitization & Publishing", sacCode: "998471", gstRate: 18 },

  // Object 4 — EdTech Devices, Hardware & Multilingual Programming
  { description: "Smart Toy / Learning Device — Design & Consulting", sacCode: "998317", gstRate: 18 },
  { description: "Audio Player / Tablet / Learning Kit — Product Design", sacCode: "998394", gstRate: 18 },
  { description: "Multilingual Content Programming for Devices", sacCode: "998471", gstRate: 18 },
  { description: "Regional Language Stories / Learning Modules", sacCode: "998471", gstRate: 18 },
  { description: "Content Licensing to Schools, Libraries, Institutions", sacCode: "998311", gstRate: 18 },
  { description: "Trading of Electronic Educational Products (Goods)", sacCode: "996111", gstRate: 18 },

  // Object 6 — E-Commerce, Retail & Subscription Services
  { description: "E-Commerce Website / App Development", sacCode: "998312", gstRate: 18 },
  { description: "Online Marketplace / Platform Development", sacCode: "998311", gstRate: 18 },
  { description: "Subscription Platform Development & Management", sacCode: "998311", gstRate: 18 },
  { description: "Paid Advertising Management (Meta Ads / Google Ads)", sacCode: "998361", gstRate: 18 },
  { description: "Direct Marketing (Email, WhatsApp, Outreach Campaigns)", sacCode: "998366", gstRate: 18 },
  { description: "Digital Product Sales via Websites / Marketplaces", sacCode: "996111", gstRate: 18 },

  // Object 7 — EdTech SaaS, Language Learning & Consulting
  { description: "Language Learning App / Platform Development", sacCode: "998311", gstRate: 18 },
  { description: "SaaS Platform — Build, License & Operate", sacCode: "998311", gstRate: 18 },
  { description: "Digital Library Subscription Platform", sacCode: "998311", gstRate: 18 },
  { description: "EdTech Consulting for Schools & Institutions", sacCode: "998317", gstRate: 18 },
  { description: "AI Chatbot / Automation Tool Development", sacCode: "998311", gstRate: 18 },
  { description: "IT Strategy & Technology Advisory", sacCode: "998317", gstRate: 18 },

  // Additional Services (Creative & Design)
  { description: "Logo Design & Branding", sacCode: "998392", gstRate: 18 },
  { description: "Graphic Design — Social Media Creatives, Banners", sacCode: "998392", gstRate: 18 },
  { description: "Certificate Design / Invitation / Print Design", sacCode: "998399", gstRate: 18 },
  { description: "Cybersecurity / SSL / Firewall Configuration", sacCode: "998318", gstRate: 18 },
  { description: "IT Security Consulting", sacCode: "998318", gstRate: 18 }
];
