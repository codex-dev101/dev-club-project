const englishQuestions = {
    english: [
        { question: "Choose the correct spelling:", options: ["Accommodate", "Acommodate", "Accomodate", "Acomodate"], answer: 0 },
        { question: "What is the antonym (opposite) of 'Generous'?", options: ["Kind", "Selfish", "Friendly", "Honest"], answer: 1 },
        { question: "Identify the noun: 'The curious cat ran quickly.'", options: ["curious", "quickly", "cat", "ran"], answer: 2 },
        { question: "Choose the correct past tense of 'Drink':", options: ["Drunk", "Drank", "Drinked", "Drinking"], answer: 1 },
        { question: "What is the synonym of 'Ancient'?", options: ["Modern", "Recent", "Old", "Future"], answer: 2 },
        { question: "Complete the sentence: 'She has ______ finished her assignment.'", options: ["already", "all ready", "alright", "all right"], answer: 0 },
        { question: "What type of word is 'Quietly' in: 'She walked quietly'?", options: ["Adjective", "Adverb", "Verb", "Preposition"], answer: 1 },
        { question: "Which of the following is a metaphor?", options: ["He is as brave as a lion", "Time is money", "The wind whispered", "She cried buckets"], answer: 1 },
        { question: "Choose the correct plural form of 'Child':", options: ["Childs", "Childrens", "Children", "Childes"], answer: 2 },
        { question: "Which word is an interjection?", options: ["Wow!", "And", "Because", "Under"], answer: 0 },
        { question: "Select the correctly punctuated sentence:", options: ["Where are you going.", "Where are you going?", "Where are you going!", "Where are you going,"], answer: 1 },
        { question: "What is a group of lions called?", options: ["Pack", "Herd", "Flock", "Pride"], answer: 3 },
        { question: "What is the antonym of 'Transparent'?", options: ["Clear", "Opaque", "Bright", "Clean"], answer: 1 },
        { question: "Identify the conjunction in: 'I wanted to go, but it was raining.'", options: ["wanted", "go", "but", "was"], answer: 2 },
        { question: "Choose the correct pronoun: 'Neither of the boys brought ______ book.'", options: ["his", "their", "them", "they"], answer: 0 },
        { question: "What figure of speech gives human qualities to animals or objects?", options: ["Hyperbole", "Simile", "Personification", "Alliteration"], answer: 2 },
        { question: "Which of the following is a synonym for 'Abundant'?", options: ["Scarce", "Plentiful", "Little", "Rare"], answer: 1 },
        { question: "Choose the correct word: 'The sun will ______ in the east.'", options: ["rise", "raise", "rose", "rising"], answer: 0 },
        { question: "Identify the adjective in: 'The red car zoomed past.'", options: ["car", "red", "zoomed", "past"], answer: 1 },
        { question: "What is the comparative form of the adjective 'Good'?", options: ["Gooder", "Best", "Better", "More good"], answer: 2 },
        { question: "What is the superlative form of 'Bad'?", options: ["Worse", "Baddest", "Worst", "More bad"], answer: 2 },
        { question: "Choose the correct preposition: 'He is proficient ______ English.'", options: ["in", "at", "with", "on"], answer: 0 },
        { question: "Which sentence is written in the passive voice?", options: ["The chef cooked the meal.", "The meal was cooked by the chef.", "The chef is cooking.", "The chef will cook."], answer: 1 },
        { question: "What is an exaggeration used for emphasis called?", options: ["Irony", "Hyperbole", "Oxymoron", "Onomatopoeia"], answer: 1 },
        { question: "Choose the correct spelling:", options: ["Receive", "Recieve", "Receve", "Riceive"], answer: 0 },
        { question: "What is the plural form of 'Cactus'?", options: ["Cactuses", "Cacti", "Cacta", "Both A and B"], answer: 3 },
        { question: "What does the idiom 'Bite the bullet' mean?", options: ["To eat quickly", "To face a difficult situation with courage", "To shoot a gun", "To run away"], answer: 1 },
        { question: "Identify the prefix in the word 'Unhappy':", options: ["Un", "Happy", "Appy", "Hap"], answer: 0 },
        { question: "Identify the suffix in the word 'Careless':", options: ["Care", "Rel", "Less", "Ess"], answer: 2 },
        { question: "Choose the correct form: 'Each of the students ______ present.'", options: ["is", "are", "were", "have been"], answer: 0 },
        { question: "What is the antonym of 'Expand'?", options: ["Enlarge", "Contract", "Grow", "Extend"], answer: 1 },
        { question: "Choose the correct homophone: 'I cannot ______ this heavy weight.'", options: ["bare", "bear", "beer", "bier"], answer: 1 },
        { question: "What is a poem of fourteen lines called?", options: ["Ballad", "Sonnet", "Haiku", "Epic"], answer: 1 },
        { question: "What does the root word 'Bio' mean?", options: ["Earth", "Life", "Water", "Light"], answer: 1 },
        { question: "Choose the correct spelling:", options: ["Definately", "Definitely", "Definetly", "Definitaly"], answer: 1 },
        { question: "Identify the verb in: 'The birds sing beautifully every morning.'", options: ["birds", "sing", "beautifully", "morning"], answer: 1 },
        { question: "Which word means 'a person who writes plays'?", options: ["Playwriter", "Playwright", "Playwrite", "Playright"], answer: 1 },
        { question: "What is the synonym of 'Courageous'?", options: ["Timid", "Cowardly", "Brave", "Fearful"], answer: 2 },
        { question: "Complete: 'A stitch in time saves ______.'", options: ["five", "seven", "nine", "ten"], answer: 2 },
        { question: "What is the plural of 'Foot'?", options: ["Foots", "Feet", "Feets", "Footes"], answer: 1 },
        { question: "Which of the following is an example of an onomatopoeia?", options: ["Buzz", "Fast", "Quiet", "Bright"], answer: 0 },
        { question: "What does 'Omniscient' mean?", options: ["All-powerful", "All-knowing", "Ever-present", "Invisible"], answer: 1 },
        { question: "Choose the correct spelling:", options: ["Seperate", "Separate", "Seprate", "Seperet"], answer: 1 },
        { question: "Identify the subject in: 'Under the tree slept the tired traveller.'", options: ["tree", "slept", "tired", "the tired traveller"], answer: 3 },
        { question: "What is the antonym of 'Arrogant'?", options: ["Proud", "Humble", "Boastful", "Stubborn"], answer: 1 },
        { question: "Complete the sentence: 'She is ______ honest woman.'", options: ["a", "an", "the", "no article"], answer: 1 },
        { question: "What is the opposite of 'Victory'?", options: ["Success", "Defeat", "Triumph", "Win"], answer: 1 },
        { question: "Choose the correct form: 'The police ______ investigating the crime.'", options: ["is", "are", "was", "has been"], answer: 1 },
        { question: "What is a narrative song or poem that tells a story called?", options: ["Ballad", "Limerick", "Sonnet", "Elegy"], answer: 0 },
        { question: "What does 'Break a leg' mean in theatre?", options: ["Get injured", "Good luck", "Quit acting", "Speak louder"], answer: 1 }
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
window.subjectQuestions.english = englishQuestions.english;
window.shuffleQuestions = shuffleQuestions;