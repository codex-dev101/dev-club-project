const knowledgeQuestions = {
  general_knowledge: [
    { question: "What is the largest continent on Earth by land area?", options: ["Africa", "North America", "Asia", "Europe"], answer: 2 },
    { question: "Which is the longest river in the world?", options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"], answer: 1 },
    { question: "What is the capital city of France?", options: ["Rome", "Berlin", "Paris", "Madrid"], answer: 2 },
    { question: "How many days are in a leap year?", options: ["364", "365", "366", "367"], answer: 2 },
    { question: "In which country can you visit the ancient ruins of Petra, carved into rose-red cliffs?", options: ["Egypt", "Jordan", "Saudi Arabia", "Turkey"], answer: 1 },
    { question: "Which is the tallest mountain in the world above sea level?", options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Fuji"], answer: 2 },
    { question: "What is the official currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Franc"], answer: 2 },
    { question: "How many rings are displayed on the official Olympic flag?", options: ["4", "5", "6", "7"], answer: 1 },
    { question: "Which country gifted the Statue of Liberty to the United States?", options: ["France", "United Kingdom", "Spain", "Germany"], answer: 0 },
    { question: "In which city would you find the famous Colosseum amphitheatre?", options: ["Athens", "Rome", "Paris", "Vienna"], answer: 1 },
    { question: "How many sides does an Octagon have?", options: ["6", "7", "8", "10"], answer: 2 },
    { question: "Who painted the world-famous masterpiece 'Mona Lisa'?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: 2 },
    { question: "Which is the largest hot desert in the world?", options: ["Sahara Desert", "Gobi Desert", "Kalahari Desert", "Arabian Desert"], answer: 0 },
    { question: "What is the capital city of Japan?", options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], answer: 2 },
    { question: "In which country can you find the Great Pyramids of Giza?", options: ["Sudan", "Jordan", "Egypt", "Greece"], answer: 2 },
    { question: "Which language has the most native speakers in the world?", options: ["English", "Spanish", "Mandarin Chinese", "Hindi"], answer: 2 },
    { question: "What is the smallest independent sovereign state in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1 },
    { question: "What is the largest coral reef system in the world?", options: ["Belize Barrier Reef", "Great Barrier Reef", "Red Sea Coral Reef", "Florida Reef"], answer: 1 },
    { question: "Who wrote the classic play 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: 1 },
    { question: "Which country is known as the 'Land of the Midnight Sun'?", options: ["Norway", "Canada", "Greenland", "Russia"], answer: 0 },
    { question: "In which country is the famous Taj Mahal located?", options: ["Pakistan", "India", "Bangladesh", "Nepal"], answer: 1 },
    { question: "What is the primary language spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], answer: 1 },
    { question: "What is the main dish of traditional Japanese sushi served with?", options: ["Noodles", "Vinegared Rice", "Fried Bread", "Steamed Potatoes"], answer: 1 },
    { question: "Which is the smallest continent by land area?", options: ["Europe", "Antarctica", "Australia (Oceania)", "South America"], answer: 2 },
    { question: "What is the capital city of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: 2 },
    { question: "Which famous canal connects the Mediterranean Sea to the Red Sea?", options: ["Panama Canal", "Suez Canal", "Kiel Canal", "Corinth Canal"], answer: 1 },
    { question: "What is the official currency of Japan?", options: ["Yuan", "Won", "Yen", "Baht"], answer: 2 },
    { question: "Which country has the most natural lakes in the world?", options: ["United States", "Canada", "Finland", "Russia"], answer: 1 },
    { question: "What is the capital city of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], answer: 3 },
    { question: "Which ancient wonder of the world stood in the harbor of Alexandria, Egypt?", options: ["Colossus of Rhodes", "Lighthouse of Alexandria", "Hanging Gardens of Babylon", "Statue of Zeus"], answer: 1 },
    { question: "What colors are featured on the national flag of Nigeria?", options: ["Green and White", "Red and White", "Green and Yellow", "Blue and White"], answer: 0 },
    { question: "How many players are on the field for one team during a standard soccer match?", options: ["9", "10", "11", "12"], answer: 2 },
    { question: "What is the capital city of Egypt?", options: ["Alexandria", "Cairo", "Giza", "Luxor"], answer: 1 },
    { question: "How many minutes are in a full 24-hour day?", options: ["1,200", "1,440", "1,600", "1,800"], answer: 1 },
    { question: "Which world-famous bell tower leans noticeably in Tuscany, Italy?", options: ["Eiffel Tower", "Tower of London", "Leaning Tower of Pisa", "Big Ben"], answer: 2 },
    { question: "Which country is famous for originating the game of golf?", options: ["England", "Scotland", "Ireland", "United States"], answer: 1 },
    { question: "Which country is home to the ancient Incan citadel of Machu Picchu?", options: ["Peru", "Chile", "Bolivia", "Colombia"], answer: 0 },
    { question: "What is the world's highest uninterrupted waterfall?", options: ["Niagara Falls", "Angel Falls", "Victoria Falls", "Iguazu Falls"], answer: 1 },
    { question: "Which ocean lies between the Americas and Europe/Africa?", options: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Arctic Ocean"], answer: 2 },
    { question: "What is the national animal of Australia that carries its young in a pouch?", options: ["Koala", "Kangaroo", "Wombat", "Platypus"], answer: 1 },
    { question: "Which famous museum in Paris houses the Mona Lisa?", options: ["The Prado", "The Louvre", "The Met", "The British Museum"], answer: 1 },
    { question: "What is the capital city of Italy?", options: ["Milan", "Florence", "Rome", "Venice"], answer: 2 },
    { question: "Who was the legendary ancient Greek poet credited with composing the 'Iliad' and the 'Odyssey'?", options: ["Socrates", "Plato", "Homer", "Aristotle"], answer: 2 },
    { question: "Which is the largest island in the world?", options: ["Madagascar", "Greenland", "Borneo", "New Guinea"], answer: 1 },
    { question: "How many degrees are in a full circle?", options: ["180°", "270°", "360°", "400°"], answer: 2 },
    { question: "Which country produces the most coffee beans in the world?", options: ["Colombia", "Vietnam", "Brazil", "Ethiopia"], answer: 2 },
    { question: "In which city is the famous Big Ben clock tower located?", options: ["Dublin", "Edinburgh", "London", "Manchester"], answer: 2 },
    { question: "What is the currency used in most European Union member countries?", options: ["Pound", "Euro", "Franc", "Krona"], answer: 1 },
    { question: "Which famous wall stretches thousands of miles across northern China?", options: ["Hadrian's Wall", "The Great Wall of China", "Berlin Wall", "Western Wall"], answer: 1 },
    { question: "What is the capital city of Germany?", options: ["Munich", "Frankfurt", "Berlin", "Hamburg"], answer: 2 }
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