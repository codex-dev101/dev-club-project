
const scienceQuestions = {
    science: [
        { question: "What gas do plants absorb for photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1 },
        { question: "What is the chemical formula for water?", options: ["CO2", "O2", "H2O", "NaCl"], answer: 2 },
        { question: "Which organ in the human body pumps blood?", options: ["Brain", "Lungs", "Heart", "Liver"], answer: 2 },
        { question: "What is the boiling point of pure water at sea level?", options: ["50°C", "90°C", "100°C", "120°C"], answer: 2 },
        { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
        { question: "What is the unit of electric current?", options: ["Volt", "Watt", "Ampere", "Ohm"], answer: 2 },
        { question: "Which part of the plant conducts water from roots to leaves?", options: ["Phloem", "Xylem", "Stomata", "Chloroplast"], answer: 1 },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Cell Wall"], answer: 2 },
        { question: "What is the center of an atom called?", options: ["Electron", "Proton", "Nucleus", "Neutron"], answer: 2 },
        { question: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], answer: 2 },
        { question: "What is the process by which a solid changes directly into a gas?", options: ["Evaporation", "Condensation", "Sublimation", "Melting"], answer: 2 },
        { question: "What is the chemical symbol for Gold?", options: ["Ag", "Au", "Fe", "Pb"], answer: 1 },
        { question: "What is the speed of light in a vacuum approximately?", options: ["300,000 km/s", "150,000 km/s", "3,000 km/s", "30,000 km/s"], answer: 0 },
        { question: "Which human organ filters waste products from the blood?", options: ["Heart", "Kidney", "Stomach", "Pancreas"], answer: 1 },
        { question: "What type of energy is stored in a stretched rubber band?", options: ["Kinetic Energy", "Potential Energy", "Thermal Energy", "Chemical Energy"], answer: 1 },
        { question: "What is the chemical symbol for Iron?", options: ["Ir", "In", "Fe", "Au"], answer: 2 },
        { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
        { question: "What is the pH value of pure neutral water?", options: ["5", "7", "9", "14"], answer: 1 },
        { question: "Which vitamin is synthesized by the human body when exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], answer: 3 },
        { question: "How many bones are in the adult human skeleton?", options: ["198", "206", "214", "250"], answer: 1 },
        { question: "What device is used to measure atmospheric pressure?", options: ["Thermometer", "Barometer", "Hygrometer", "Anemometer"], answer: 1 },
        { question: "Which part of the eye controls the amount of light entering it?", options: ["Retina", "Cornea", "Iris", "Lens"], answer: 2 },
        { question: "What is the green pigment in plants responsible for photosynthesis?", options: ["Chlorophyll", "Carotene", "Hemoglobin", "Melanin"], answer: 0 },
        { question: "What is the unit of force in physics?", options: ["Joule", "Pascal", "Newton", "Watt"], answer: 2 },
        { question: "Which blood type is known as the universal donor?", options: ["A+", "B-", "AB+", "O-"], answer: 3 },
        { question: "What is the chemical formula for common table salt?", options: ["NaCl", "KCl", "CaCl2", "NaHCO3"], answer: 0 },
        { question: "Which planet is the largest in our solar system?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], answer: 1 },
        { question: "What force keeps the planets in orbit around the Sun?", options: ["Magnetism", "Friction", "Gravity", "Nuclear Force"], answer: 2 },
        { question: "What is the freezing point of water in Fahrenheit?", options: ["0°F", "32°F", "100°F", "212°F"], answer: 1 },
        { question: "Which organ produces insulin in the human body?", options: ["Liver", "Gallbladder", "Pancreas", "Spleen"], answer: 2 },
        { question: "Sound waves cannot travel through which of the following?", options: ["Water", "Air", "Steel", "Vacuum"], answer: 3 },
        { question: "What is the chemical symbol for Sodium?", options: ["So", "Sd", "Na", "Sm"], answer: 2 },
        { question: "Which subatomic particle has a negative electric charge?", options: ["Proton", "Neutron", "Electron", "Positron"], answer: 2 },
        { question: "What is the largest organ of the human body?", options: ["Liver", "Brain", "Skin", "Lungs"], answer: 2 },
        { question: "Which planet is closest to the Sun?", options: ["Mercury", "Venus", "Earth", "Mars"], answer: 0 },
        { question: "What type of rock is formed from cooled magma or lava?", options: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"], answer: 2 },
        { question: "What is the study of living organisms called?", options: ["Geology", "Biology", "Astronomy", "Ecology"], answer: 1 },
        { question: "What is the chemical symbol for Potassium?", options: ["P", "Po", "K", "Pt"], answer: 2 },
        { question: "Which gas do humans inhale for cellular respiration?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"], answer: 1 },
        { question: "What is the SI unit of electrical resistance?", options: ["Ohm", "Volt", "Ampere", "Coulomb"], answer: 0 },
        { question: "Which celestial body is at the center of our solar system?", options: ["Earth", "The Sun", "Jupiter", "The Moon"], answer: 1 },
        { question: "What is the process of cell division in body cells called?", options: ["Mitosis", "Meiosis", "Osmosis", "Diffusion"], answer: 0 },
        { question: "Which acid is found in car batteries?", options: ["Hydrochloric Acid", "Sulfuric Acid", "Nitric Acid", "Acetic Acid"], answer: 1 },
        { question: "What is the primary function of white blood cells?", options: ["Carry oxygen", "Fight infections", "Clot blood", "Digest food"], answer: 1 },
        { question: "Which planet is famous for its prominent rings?", options: ["Mars", "Saturn", "Jupiter", "Uranus"], answer: 1 },
        { question: "What is the chemical formula for Carbon Dioxide?", options: ["CO", "CO2", "C2O", "CH4"], answer: 1 },
        { question: "What instrument is used to view microscopic objects?", options: ["Telescope", "Periscope", "Microscope", "Stethoscope"], answer: 2 },
        { question: "Which layer of the atmosphere contains the ozone layer?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], answer: 1 },
        { question: "What is the normal human body temperature in Celsius?", options: ["35°C", "37°C", "39°C", "40°C"], answer: 1 },
        { question: "Which animal group is warm-blooded?", options: ["Reptiles", "Amphibians", "Fish", "Mammals"], answer: 3 }
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
window.subjectQuestions.science = scienceQuestions.science;
window.shuffleQuestions = shuffleQuestions;

