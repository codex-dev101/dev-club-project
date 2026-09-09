const knowledgeQuestions = {
  general_knowledge: [
    { question: "What does HTML stand for in web development?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Management Language", "Home Tool Markup Language"], answer: 0 },
    { question: "Which company developed the Android operating system?", options: ["Apple", "Google", "Microsoft", "Samsung"], answer: 1 },
    { question: "How many days are in a leap year?", options: ["364", "365", "366", "367"], answer: 2 },
    { question: "Which device is used to input text into a computer?", options: ["Monitor", "Mouse", "Keyboard", "Printer"], answer: 2 },
    { question: "What is the capital city of France?", options: ["Rome", "Berlin", "Paris", "Madrid"], answer: 2 },
    { question: "Which company created ChatGPT?", options: ["Google", "Microsoft", "OpenAI", "Meta"], answer: 2 },
    { question: "What is the main function of RAM in a computer?", options: ["Permanent storage", "Temporary fast memory", "Cooling the processor", "Connecting to internet"], answer: 1 },
    { question: "What does 'WWW' stand for?", options: ["World Wide Web", "Wide World Words", "Web World Wide", "Wireless Web Works"], answer: 0 },
    { question: "How many sides does an Octagon have?", options: ["6", "7", "8", "10"], answer: 2 },
    { question: "Which is the tallest mountain in the world above sea level?", options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Fuji"], answer: 2 },
    { question: "What does 'CPU' stand for in computer hardware?", options: ["Central Processing Unit", "Computer Program Unit", "Core Power Utility", "Central Performance Unit"], answer: 0 },
    { question: "What does 'URL' stand for?", options: ["Uniform Resource Locator", "Universal Reference Link", "Unified Routing Language", "Universal Record Line"], answer: 0 },
    { question: "Which key on a keyboard is used to create space between words?", options: ["Backspace", "Enter", "Spacebar", "Shift"], answer: 2 },
    { question: "How many bits are in one Byte?", options: ["4", "8", "16", "32"], answer: 1 },
    { question: "How many Megabytes (MB) are in 1 Gigabyte (GB)?", options: ["100", "500", "1000", "1024"], answer: 3 },
    { question: "What does 'HTTP' stand for in web browsers?", options: ["HyperText Transfer Protocol", "High Transfer Tech Program", "Hyper Terminal Text Port", "Home Tool Transport Protocol"], answer: 0 },
    { question: "What does the 'S' stand for in 'HTTPS'?", options: ["Speed", "Secure", "Server", "System"], answer: 1 },
    { question: "Which programming language is predominantly used to add interactivity to web pages?", options: ["HTML", "CSS", "JavaScript", "SQL"], answer: 2 },
    { question: "What does 'SQL' stand for in database management?", options: ["Structured Query Language", "Simple Quick Logic", "System Query Link", "Standard Question Language"], answer: 0 },
    { question: "Who is widely considered the father of modern computing?", options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"], answer: 1 },
    { question: "Who was the first computer programmer in history?", options: ["Ada Lovelace", "Grace Hopper", "Katherine Johnson", "Margaret Hamilton"], answer: 0 },
    { question: "Which company created the Windows operating system?", options: ["Apple", "IBM", "Microsoft", "Intel"], answer: 2 },
    { question: "What is the primary language of iOS app development?", options: ["Java", "Swift", "C#", "Kotlin"], answer: 1 },
    { question: "What is the primary language used for native Android development?", options: ["Kotlin / Java", "Swift", "PHP", "Ruby"], answer: 0 },
    { question: "What does 'PDF' stand for?", options: ["Portable Document Format", "Public Data File", "Personal Document Folder", "Program Data File"], answer: 0 },
    { question: "Which shortcut key is commonly used to copy selected text on Windows?", options: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + Z"], answer: 1 },
    { question: "Which shortcut key is used to paste copied text on Windows?", options: ["Ctrl + P", "Ctrl + V", "Ctrl + S", "Ctrl + A"], answer: 1 },
    { question: "Which shortcut key is used to undo an action on Windows?", options: ["Ctrl + U", "Ctrl + Y", "Ctrl + Z", "Ctrl + W"], answer: 2 },
    { question: "What type of software is designed to harm or exploit computers?", options: ["Freeware", "Malware", "Shareware", "Firmware"], answer: 1 },
    { question: "What does 'Wi-Fi' stand for?", options: ["Wireless Fidelity", "Wide Field", "Wire Free Internet", "Wireless Flow"], answer: 0 },
    { question: "What is the physical board inside a computer that connects all components?", options: ["Hard Drive", "Motherboard", "Sound Card", "Graphics Card"], answer: 1 },
    { question: "What does 'SSD' stand for in storage drives?", options: ["Solid State Drive", "Super Speed Disk", "System Storage Device", "Secure State Drive"], answer: 0 },
    { question: "What is the smallest unit of digital image data on a display screen?", options: ["Byte", "Pixel", "Dot", "Voxel"], answer: 1 },
    { question: "What does 'LAN' stand for in networking?", options: ["Local Area Network", "Large Access Node", "Linked Audio Network", "Local Array Node"], answer: 0 },
    { question: "What is the standard port for HTTP web traffic?", options: ["21", "22", "80", "443"], answer: 2 },
    { question: "What is the standard port for HTTPS encrypted web traffic?", options: ["25", "80", "443", "8080"], answer: 2 },
    { question: "What does 'GUI' stand for in computing?", options: ["Graphical User Interface", "General User Interaction", "Global Utility Interface", "Graphic Universal Index"], answer: 0 },
    { question: "What type of computer network spans across cities, countries, or the globe?", options: ["LAN", "PAN", "WAN", "SAN"], answer: 2 },
    { question: "What is an open-source version control system created by Linus Torvalds?", options: ["Git", "SVN", "Mercurial", "Docker"], answer: 0 },
    { question: "What is the world's most popular web search engine?", options: ["Bing", "Yahoo", "Google", "DuckDuckGo"], answer: 2 },
    { question: "Who founded Microsoft along with Paul Allen in 1975?", options: ["Steve Jobs", "Bill Gates", "Jeff Bezos", "Elon Musk"], answer: 1 },
    { question: "Who co-founded Apple Inc. alongside Steve Wozniak?", options: ["Steve Jobs", "Tim Cook", "Larry Page", "Mark Zuckerberg"], answer: 0 },
    { question: "Which company owns the social media platforms Facebook, Instagram, and WhatsApp?", options: ["Alphabet", "Meta", "Amazon", "Twitter"], answer: 1 },
    { question: "What does 'AI' stand for?", options: ["Automated Internet", "Artificial Intelligence", "Advanced Integration", "App Interface"], answer: 1 },
    { question: "What does 'IoT' stand for in modern technology?", options: ["Internet of Things", "Index of Tech", "Integrated Online Tasks", "Internal Operations Team"], answer: 0 },
    { question: "Which symbol is used in JavaScript to check both value and type equality?", options: ["=", "==", "===", "!="], answer: 2 },
    { question: "What is the primary function of an operating system?", options: ["Play games", "Manage hardware and software resources", "Edit photos", "Browse websites"], answer: 1 },
    { question: "What is the cloud computing service platform provided by Amazon?", options: ["Azure", "Google Cloud", "AWS (Amazon Web Services)", "iCloud"], answer: 2 },
    { question: "What does 'CSS' stand for in web styling?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Styling Syntax", "Colorful Style Sheets"], answer: 0 },
    { question: "Which browser is developed and maintained by Google?", options: ["Safari", "Firefox", "Chrome", "Edge"], answer: 2 }
  ]
};

// Shuffle function
function shuffleQuestions(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

// Make accessible globally
window.subjectQuestions = window.subjectQuestions || {};
window.subjectQuestions.general_knowledge = knowledgeQuestions.general_knowledge;
window.shuffleQuestions = shuffleQuestions;