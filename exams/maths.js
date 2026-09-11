const mathsQuestions = {
    math: [
        { question: "What is the value of 15 × 4 + 10?", options: ["50", "70", "60", "80"], answer: 1 },
        { question: "What is the square root of 144?", options: ["10", "11", "12", "14"], answer: 2 },
        { question: "Solve for x: 2x + 6 = 18", options: ["x = 6", "x = 4", "x = 8", "x = 12"], answer: 0 },
        { question: "What is 25% of 200?", options: ["25", "40", "50", "75"], answer: 2 },
        { question: "How many degrees are in the sum of angles of a triangle?", options: ["90°", "180°", "270°", "360°"], answer: 1 },
        { question: "What is the next prime number after 7?", options: ["9", "10", "11", "13"], answer: 2 },
        { question: "What is the perimeter of a rectangle with length 8cm and width 4cm?", options: ["24cm", "32cm", "16cm", "28cm"], answer: 0 },
        { question: "Simplify: (5 + 3) × 2 - 4", options: ["10", "12", "14", "16"], answer: 1 },
        { question: "What is the value of 2 to the power of 5 (2⁵)?", options: ["16", "25", "32", "64"], answer: 2 },
        { question: "If a shirt costs $40 after a 20% discount, what was its original price?", options: ["$48", "$50", "$60", "$55"], answer: 1 },
        { question: "What is 7 cubed (7³)?", options: ["243", "343", "441", "349"], answer: 1 },
        { question: "What is the area of a square with side length 9cm?", options: ["18cm²", "36cm²", "72cm²", "81cm²"], answer: 3 },
        { question: "What is the greatest common divisor (GCD) of 12 and 18?", options: ["2", "3", "6", "9"], answer: 2 },
        { question: "What is the least common multiple (LCM) of 4 and 6?", options: ["12", "18", "24", "8"], answer: 0 },
        { question: "If x = 3 and y = 4, what is the value of x² + y²?", options: ["7", "12", "25", "49"], answer: 2 },
        { question: "What is 3/5 expressed as a percentage?", options: ["30%", "50%", "60%", "75%"], answer: 2 },
        { question: "How many sides does a heptagon have?", options: ["6", "7", "8", "9"], answer: 1 },
        { question: "What is the formula for the area of a circle?", options: ["2πr", "πr²", "πd", "2πr²"], answer: 1 },
        { question: "Solve for y: 5y - 15 = 0", options: ["y = 0", "y = 3", "y = 5", "y = -3"], answer: 1 },
        { question: "What is 100 divided by 0.5?", options: ["50", "100", "200", "500"], answer: 2 },
        { question: "What is the sum of the first 5 positive integers (1+2+3+4+5)?", options: ["10", "12", "15", "20"], answer: 2 },
        { question: "Convert 0.75 to a simple fraction:", options: ["1/2", "2/3", "3/4", "4/5"], answer: 2 },
        { question: "What is the Roman numeral for 50?", options: ["C", "D", "L", "V"], answer: 2 },
        { question: "What is the slope of a horizontal line?", options: ["0", "1", "Undefined", "-1"], answer: 0 },
        { question: "How many seconds are in 2.5 hours?", options: ["150", "3600", "7200", "9000"], answer: 3 },
        { question: "If 3 pens cost $15, how much will 7 pens cost?", options: ["$25", "$30", "$35", "$40"], answer: 2 },
        { question: "What is 15% of 80?", options: ["8", "10", "12", "14"], answer: 2 },
        { question: "Which of the following numbers is an irrational number?", options: ["√4", "3/4", "√2", "0.25"], answer: 2 },
        { question: "What is the supplementary angle of 70°?", options: ["20°", "90°", "110°", "130°"], answer: 2 },
        { question: "What is the complementary angle of 35°?", options: ["45°", "55°", "65°", "145°"], answer: 1 },
        { question: "What is the median of the numbers: 3, 7, 9, 12, 15?", options: ["7", "9", "9.2", "12"], answer: 1 },
        { question: "What is the mean of: 4, 8, 12, 16?", options: ["8", "9", "10", "12"], answer: 2 },
        { question: "What is 2³ × 3²?", options: ["36", "72", "64", "48"], answer: 1 },
        { question: "If a car travels 180 km in 3 hours, what is its average speed?", options: ["50 km/h", "60 km/h", "70 km/h", "90 km/h"], answer: 1 },
        { question: "Factorize: x² - 9", options: ["(x - 3)²", "(x + 3)(x - 3)", "(x + 9)(x - 1)", "(x - 9)(x + 1)"], answer: 1 },
        { question: "What is the reciprocal of 4/7?", options: ["-4/7", "7/4", "-7/4", "1/4"], answer: 1 },
        { question: "How many degrees are in a right angle?", options: ["45°", "90°", "180°", "360°"], answer: 1 },
        { question: "What is the value of (-5) × (-4)?", options: ["-20", "20", "-9", "9"], answer: 1 },
        { question: "What is 10 to the power of 0 (10⁰)?", options: ["0", "1", "10", "Undefined"], answer: 1 },
        { question: "How many millimeters are in 5.5 meters?", options: ["55mm", "550mm", "5500mm", "55000mm"], answer: 2 },
        { question: "What is the value of π (Pi) rounded to two decimal places?", options: ["3.12", "3.14", "3.16", "3.18"], answer: 1 },
        { question: "Solve: 4(x - 2) = 16", options: ["x = 4", "x = 6", "x = 8", "x = 2"], answer: 1 },
        { question: "What is the probability of flipping heads on a fair coin?", options: ["0.25", "0.5", "0.75", "1"], answer: 1 },
        { question: "What is the volume of a cube with side length 3cm?", options: ["9cm³", "18cm³", "27cm³", "36cm³"], answer: 2 },
        { question: "What is the simple interest on $1,000 at 5% per annum for 2 years?", options: ["$50", "$100", "$150", "$200"], answer: 1 },
        { question: "How many vertices does a cube have?", options: ["6", "8", "12", "14"], answer: 1 },
        { question: "What is the product of 11 and 12?", options: ["121", "131", "132", "142"], answer: 2 },
        { question: "What is 4! (4 factorial)?", options: ["10", "16", "24", "36"], answer: 2 },
        { question: "Which polygon has 10 sides?", options: ["Nonagon", "Decagon", "Dodecagon", "Octagon"], answer: 1 },
        { question: "If 2x = 50, what is x/5?", options: ["5", "10", "15", "25"], answer: 0 }
    ]
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
window.subjectQuestions.math = mathsQuestions.math;
window.shuffleQuestions = shuffleQuestions;