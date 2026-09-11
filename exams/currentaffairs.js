const currentAffairsQuestions = {
    current_affairs: [
        { question: "Who is the current Secretary-General of the United Nations (UN)?", options: ["Ban Ki-moon", "António Guterres", "Kofi Annan", "Tedros Adhanom"], answer: 1 },
        { question: "Which country hosted the Olympic Games in 2024?", options: ["Japan", "USA", "France (Paris)", "United Kingdom"], answer: 2 },
        { question: "What is the official currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Yen"], answer: 2 },
        { question: "Which continent has the largest human population in the world?", options: ["Africa", "Asia", "Europe", "North America"], answer: 1 },
        { question: "What is the capital city of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: 2 },
        { question: "What does the abbreviation 'WHO' stand for?", options: ["World Health Organization", "World Housing Office", "World Heritage Order", "Wide Health Operations"], answer: 0 },
        { question: "Which organization was awarded the Nobel Peace Prize in 2020?", options: ["UNICEF", "World Food Programme", "Red Cross", "Doctors Without Borders"], answer: 1 },
        { question: "What is the longest river in Africa?", options: ["River Niger", "River Congo", "River Nile", "River Zambezi"], answer: 2 },
        { question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: 3 },
        { question: "Which country has the largest land area in the world?", options: ["Canada", "China", "Russia", "United States"], answer: 2 },
        { question: "What is the headquarters location of the United Nations (UN)?", options: ["Geneva", "New York City", "Paris", "London"], answer: 1 },
        { question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit"], answer: 2 },
        { question: "Which country is known as the Land of the Rising Sun?", options: ["China", "Japan", "South Korea", "Thailand"], answer: 1 },
        { question: "Who is the current President of the World Bank Group (appointed 2023)?", options: ["Ajay Banga", "David Malpass", "Jim Yong Kim", "Kristalina Georgieva"], answer: 0 },
        { question: "What is the capital city of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], answer: 3 },
        { question: "What does 'NATO' stand for?", options: ["North Atlantic Treaty Organization", "National American Trade Office", "North Asian Transport Order", "National Alliance for Technical Operations"], answer: 0 },
        { question: "Which country won the FIFA Men's World Cup in 2022?", options: ["France", "Brazil", "Argentina", "Croatia"], answer: 2 },
        { question: "What is the currency of the European Union member states?", options: ["Pound", "Euro", "Franc", "Krona"], answer: 1 },
        { question: "Which is the smallest country in the world by land area?", options: ["Monaco", "Nauru", "Vatican City", "San Marino"], answer: 2 },
        { question: "What is the capital of Nigeria?", options: ["Lagos", "Abuja", "Kano", "Port Harcourt"], answer: 1 },
        { question: "What is the official currency of Nigeria?", options: ["Naira", "Cedi", "Rand", "Shilling"], answer: 0 },
        { question: "What does 'OPEC' stand for?", options: ["Organization of Petroleum Exporting Countries", "Oil Production and Energy Council", "Overseas Petroleum Exploration Committee", "Oil Producers Economic Coalition"], answer: 0 },
        { question: "What is the capital city of Germany?", options: ["Munich", "Frankfurt", "Berlin", "Hamburg"], answer: 2 },
        { question: "Which country left the European Union in the process known as 'Brexit'?", options: ["France", "United Kingdom", "Germany", "Italy"], answer: 1 },
        { question: "Who was the first female Prime Minister of the United Kingdom?", options: ["Theresa May", "Margaret Thatcher", "Liz Truss", "Angela Merkel"], answer: 1 },
        { question: "What is the capital of South Africa?", options: ["Johannesburg", "Pretoria", "Durban", "Cape Town & Pretoria"], answer: 3 },
        { question: "Which African country is known as the 'Giant of Africa'?", options: ["South Africa", "Egypt", "Nigeria", "Ghana"], answer: 2 },
        { question: "What is the capital city of Ghana?", options: ["Kumasi", "Accra", "Tamale", "Cape Coast"], answer: 1 },
        { question: "What is the currency of Ghana?", options: ["Naira", "Cedi", "Rand", "Kwacha"], answer: 1 },
        { question: "What does 'ECOWAS' stand for?", options: ["Economic Community of West African States", "East Coast Oil and Water Authority", "Energy Cooperation of West African Sector", "Economic Council of Western Associated States"], answer: 0 },
        { question: "Where are the headquarters of the African Union (AU) located?", options: ["Addis Ababa (Ethiopia)", "Cairo (Egypt)", "Nairobi (Kenya)", "Abuja (Nigeria)"], answer: 0 },
        { question: "What is the capital city of Kenya?", options: ["Mombasa", "Nairobi", "Kisumu", "Eldoret"], answer: 1 },
        { question: "Which canal connects the Mediterranean Sea to the Red Sea?", options: ["Panama Canal", "Suez Canal", "Kiel Canal", "Erie Canal"], answer: 1 },
        { question: "Which canal connects the Atlantic Ocean to the Pacific Ocean?", options: ["Suez Canal", "Panama Canal", "Corinth Canal", "Welland Canal"], answer: 1 },
        { question: "What is the capital city of Japan?", options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], answer: 2 },
        { question: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Giza", "Luxor"], answer: 1 },
        { question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], answer: 1 },
        { question: "Who was the first black President of South Africa?", options: ["Thabo Mbeki", "Nelson Mandela", "Jacob Zuma", "Cyril Ramaphosa"], answer: 1 },
        { question: "What is the currency of China?", options: ["Yen", "Renminbi (Yuan)", "Won", "Baht"], answer: 1 },
        { question: "What is the capital city of Brazil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], answer: 2 },
        { question: "What is the capital city of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Bangalore"], answer: 1 },
        { question: "What does 'UNESCO' stand for?", options: ["UN Educational, Scientific and Cultural Organization", "UN Economic and Social Care Order", "UN Environmental and Sanitation Council", "UN Emergency School Cooperation Office"], answer: 0 },
        { question: "Which country has the highest number of official languages?", options: ["India", "South Africa", "Bolivia", "Papua New Guinea"], answer: 2 },
        { question: "What is the capital of Spain?", options: ["Barcelona", "Madrid", "Valencia", "Seville"], answer: 1 },
        { question: "What is the capital city of Italy?", options: ["Milan", "Venice", "Rome", "Naples"], answer: 2 },
        { question: "Which country is the largest economy in the world by nominal GDP?", options: ["China", "United States", "Japan", "Germany"], answer: 1 },
        { question: "What is the currency of the United States?", options: ["US Dollar", "Pound", "Euro", "Peso"], answer: 0 },
        { question: "Which planet in our solar system is nicknamed the Morning Star?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: 1 },
        { question: "How many countries are permanent members of the UN Security Council?", options: ["3", "5", "7", "10"], answer: 1 },
        { question: "What international award is presented annually for physics, chemistry, medicine, and peace?", options: ["Pulitzer Prize", "Nobel Prize", "Academy Award", "Grammy Award"], answer: 1 }
    ],
};

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
window.subjectQuestions.current_affairs = currentAffairsQuestions.current_affairs;
window.shuffleQuestions = shuffleQuestions;