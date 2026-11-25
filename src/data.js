export const profile = {
  name: 'Mico S. Alano', initials: 'MA', role: 'Computer Engineer & Full-Stack Developer',
  email: 'mico.alano999@gmail.com', phone: '09604332929', telephone: '+639604332929',
  location: 'Muntinlupa, Metro Manila', github: 'https://github.com/okimsz', resume: '/Mico-Alano-Resume.pdf',
  bio: ['Hello! I’m Mico, a Computer Engineering graduate from Colegio de Muntinlupa. I build web applications and connected systems, combining full-stack development with hands-on experience in electronics and IC layout.', 'My work spans real-time hydroponics monitoring, an AI-powered IoT collar, and a corporate web application. I enjoy connecting software with physical devices—from live sensor dashboards to circuit wiring, hardware integration, and 3D-printed enclosures.'],
};
export const projects = [
  {title: 'HydroSmart', subtitle: 'Solar Hydroponics Smart Farm IoT Dashboard', dates: 'August 2026 – September 2026', description: 'Developed a real-time monitoring and control dashboard for a solar hydroponics farm. Firebase Realtime Database synchronizes pH, EC, water temperature, ambient humidity, and energy metrics, while an Express backend handles manual pump and dosing overrides.', tags: ['React 19', 'JavaScript', 'Vite', 'Firebase', 'Express'], type: 'IoT dashboard', color: 'sage'},
  {title: 'Meow Guardian', subtitle: 'IoT Collar using YOLOv11 & Edge Impulse', dates: 'January 2025 – April 2026', description: 'Trained and deployed an optimized FOMO object-detection model on an Arduino Nicla Vision for real-time, on-device detection. Integrated camera, GPS, and IMU sensors into custom hardware, completed circuit wiring and soldering, and designed a lightweight 3D-printed enclosure.', tags: ['Edge Impulse', 'FOMO', 'Arduino Nicla Vision', 'Autodesk Fusion'], type: 'Embedded AI & IoT', color: 'clay'},
  {title: 'Corporate Web Application', subtitle: 'Web development internship · CDI Sakata Inx Corp.', dates: 'June 2025 – August 2025', description: 'Engineered a full-stack corporate web application to streamline administrative content updates. Implemented responsive UI components and efficient API endpoints to improve platform stability and the experience across devices.', tags: ['React', 'Vite', 'Node.js', 'Express', 'REST APIs'], type: 'Full-stack application', color: 'gold'},
];
export const education = {degree: 'B.S. in Computer Engineering', school: 'Colegio de Muntinlupa', date: 'July 2026', location: 'Muntinlupa, Metro Manila', honors: ['President’s List · 1 semester', 'Dean’s List · 1 semester', 'Mayor’s List · 1 semester']};
export const skillGroups = {
  'Programming & data': ['Python', 'C++', 'JavaScript (JSX)', 'Assembly', 'MySQL', 'Verilog'],
  'Web development': ['React 19', 'Node.js', 'Express', 'Vite', 'HTML5', 'CSS3', 'REST APIs', 'Firebase'],
  'Hardware & EDA': ['Synopsys EDA', 'Eagle CAD', 'EasyEDA', 'Proteus 8', 'PLC Ladder', 'Circuit Wizard'],
  'CAD & 3D modeling': ['Autodesk Fusion', 'SolidWorks'],
  'AI & developer tools': ['Edge Impulse', 'Prompt Engineering', 'GitHub Copilot', 'Visual Studio Code'],
  'Design & collaboration': ['Figma', 'Adobe Photoshop', 'Adobe Premiere', 'Notion', 'Miro'],
};
export const experience = [
  {title: 'IC Layout Engineer Trainee', company: 'LABS by Xinyx', dates: 'June 2026 – September 2026', details: ['Translated circuit schematics into physical IC layout floorplans and stick diagrams.', 'Executed Design Rule Checking (DRC) and Layout Versus Schematic (LVS) verification with Synopsys EDA tools to achieve zero manufacturing rule violations.', 'Validated VLSI fabrication flows for physical design reliability and tape-out compliance.']},
  {title: 'Web Developer Intern', company: 'CDI Sakata Inx Corp.', dates: 'June 2025 – August 2025', details: ['Built a full-stack corporate application with React, Vite, Node.js, and Express to improve administrative content update workflows.', 'Implemented responsive UI components and efficient API endpoints, improving platform stability and user experience across devices.']},
];
export const sections = {
  projects: {title: 'Featured projects', eyebrow: 'A FEW THINGS I’VE BUILT', description: 'Connected farms, embedded AI, and practical web applications.'},
  about: {title: 'A little about me', eyebrow: 'THE PERSON BEHIND THE PIXELS', description: 'From web interfaces to the hardware behind them.'},
  education: {title: 'Learning & milestones', eyebrow: 'ACHIEVEMENTS & EDUCATION', description: 'My engineering foundation and academic honors.'},
  skills: {title: 'My creative toolkit', eyebrow: 'SKILLS & EXPERIENCE', description: 'Full-stack development, connected devices, and IC layout engineering.'},
  contact: {title: 'Let’s make something.', eyebrow: 'MY DOOR IS ALWAYS OPEN', description: 'Have an idea or an opportunity in software, IoT, or hardware? Let’s talk.'},
};
