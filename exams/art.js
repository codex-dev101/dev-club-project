const artQuestions = {
    art: [
        { question: "Who painted the famous artwork 'Mona Lisa'?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: 2 },
        { question: "Which colors are the three Primary Colors?", options: ["Red, Green, Blue", "Red, Yellow, Blue", "Orange, Green, Purple", "Yellow, Blue, Green"], answer: 1 },
        { question: "What color do you get when you mix Red and Yellow?", options: ["Green", "Purple", "Orange", "Brown"], answer: 2 },
        { question: "Who painted 'The Starry Night'?", options: ["Vincent van Gogh", "Michelangelo", "Salvador Dali", "Rembrandt"], answer: 0 },
        { question: "What do we call a painting of inanimate objects such as fruit or flowers?", options: ["Portrait", "Landscape", "Still Life", "Abstract"], answer: 2 },
        { question: "What is the art of folding paper into decorative shapes called?", options: ["Calligraphy", "Origami", "Mosaic", "Ceramics"], answer: 1 },
        { question: "Which artistic era is famous for Michelangelo and Raphael?", options: ["Baroque", "Renaissance", "Cubism", "Surrealism"], answer: 1 },
        { question: "What type of art uses small pieces of colored glass or stone?", options: ["Collage", "Fresco", "Mosaic", "Sculpture"], answer: 2 },
        { question: "What is the lightness or darkness of a color called?", options: ["Hue", "Value", "Texture", "Saturation"], answer: 1 },
        { question: "What medium is made by mixing pigment with egg yolk?", options: ["Oil paint", "Watercolor", "Tempera", "Acrylic"], answer: 2 },
        { question: "Who sculpted the famous statue of 'David'?", options: ["Donatello", "Leonardo da Vinci", "Michelangelo", "Bernini"], answer: 2 },
        { question: "What is the term for art that does not attempt to represent external reality?", options: ["Realism", "Impressionism", "Abstract Art", "Pop Art"], answer: 2 },
        { question: "Which art movement was co-founded by Pablo Picasso and Georges Braque?", options: ["Surrealism", "Cubism", "Futurism", "Dadaism"], answer: 1 },
        { question: "Who painted 'The Last Supper'?", options: ["Raphael", "Michelangelo", "Leonardo da Vinci", "Caravaggio"], answer: 2 },
        { question: "What color is complementary (opposite) to Blue on the color wheel?", options: ["Green", "Orange", "Red", "Yellow"], answer: 1 },
        { question: "What color is complementary to Red on the color wheel?", options: ["Green", "Blue", "Purple", "Yellow"], answer: 0 },
        { question: "Who painted 'The Persistence of Memory' featuring melting clocks?", options: ["Pablo Picasso", "Salvador Dali", "Rene Magritte", "Frida Kahlo"], answer: 1 },
        { question: "What is the art of beautiful decorative handwriting called?", options: ["Typography", "Calligraphy", "Orthography", "Lithography"], answer: 1 },
        { question: "Which famous Mexican artist is celebrated for her vivid self-portraits?", options: ["Frida Kahlo", "Diego Rivera", "Georgia O'Keeffe", "Mary Cassatt"], answer: 0 },
        { question: "What is a painting executed directly upon wet plaster called?", options: ["Fresco", "Gouache", "Encaustic", "Etching"], answer: 0 },
        { question: "Which American artist was a leading figure in the Pop Art movement (Campbells Soup)?", options: ["Jackson Pollock", "Andy Warhol", "Mark Rothko", "Roy Lichtenstein"], answer: 1 },
        { question: "What is the surface on which an artist mixes colors called?", options: ["Canvas", "Palette", "Easel", "Pedestal"], answer: 1 },
        { question: "What wooden stand is used to support an artist's canvas while painting?", options: ["Easel", "Palette", "Plinth", "Armature"], answer: 0 },
        { question: "Which art technique creates an image by assembling different materials like paper and cloth?", options: ["Collage", "Engraving", "Impasto", "Sfumato"], answer: 0 },
        { question: "Who painted the Sistine Chapel ceiling in Rome?", options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Botticelli"], answer: 2 },
        { question: "What color do you get when you mix Blue and Yellow?", options: ["Green", "Purple", "Orange", "Brown"], answer: 0 },
        { question: "What color do you get when you mix Red and Blue?", options: ["Green", "Purple", "Orange", "Yellow"], answer: 1 },
        { question: "What are colors next to each other on the color wheel called?", options: ["Complementary", "Analogous", "Triadic", "Monochromatic"], answer: 1 },
        { question: "Who painted 'Girl with a Pearl Earring'?", options: ["Johannes Vermeer", "Rembrandt", "Claude Monet", "Peter Paul Rubens"], answer: 0 },
        { question: "Which style of art focuses on capturing the effects of light and everyday scenes?", options: ["Impressionism", "Baroque", "Constructivism", "Minimalism"], answer: 0 },
        { question: "Who is famous for painting Water Lilies?", options: ["Claude Monet", "Edgar Degas", "Paul Cezanne", "Pierre-Auguste Renoir"], answer: 0 },
        { question: "What is the technique of applying thick paint that stands out from the surface called?", options: ["Glazing", "Impasto", "Grisaille", "Chiaroscuro"], answer: 1 },
        { question: "What is the contrast between light and dark in art called?", options: ["Sfumato", "Chiaroscuro", "Tenebrism", "Hatching"], answer: 1 },
        { question: "Which famous sculpture depicts a woman with no arms at the Louvre Museum?", options: ["Venus de Milo", "Winged Victory", "Pietà", "The Thinker"], answer: 0 },
        { question: "Who sculpted 'The Thinker'?", options: ["Auguste Rodin", "Michelangelo", "Alberto Giacometti", "Henry Moore"], answer: 0 },
        { question: "What is the primary material used in ceramic sculpture?", options: ["Clay", "Plaster", "Bronze", "Wood"], answer: 0 },
        { question: "Which culture is famous for Terracotta Army sculptures?", options: ["Egypt", "Greece", "China", "Rome"], answer: 2 },
        { question: "What type of perspective creates the illusion of depth using a vanishing point?", options: ["Linear Perspective", "Atmospheric Perspective", "Isometric Perspective", "Curvilinear Perspective"], answer: 0 },
        { question: "What is a color mixed with white called?", options: ["Shade", "Tone", "Tint", "Hue"], answer: 2 },
        { question: "What is a color mixed with black called?", options: ["Shade", "Tone", "Tint", "Value"], answer: 0 },
        { question: "Who painted 'Guernica', depicting the tragedies of war?", options: ["Pablo Picasso", "Francisco Goya", "Salvador Dali", "Henri Matisse"], answer: 0 },
        { question: "Which artistic movement celebrated industrial machinery and speed?", options: ["Futurism", "Romanticism", "Rococo", "Art Nouveau"], answer: 0 },
        { question: "What is the Japanese art of flower arrangement called?", options: ["Ikebana", "Bonsai", "Origami", "Ukiyo-e"], answer: 0 },
        { question: "What does 'Monochromatic' mean in art?", options: ["Many vibrant colors", "Variations of a single hue", "Black and white only", "Warm colors only"], answer: 1 },
        { question: "Who painted 'The Scream'?", options: ["Edvard Munch", "Gustav Klimt", "Egon Schiele", "Paul Gauguin"], answer: 0 },
        { question: "Who painted 'The Kiss' featuring golden patterns?", options: ["Gustav Klimt", "Alphonse Mucha", "Henri de Toulouse-Lautrec", "Paul Klee"], answer: 0 },
        { question: "Which art style features ornate, flowing curves inspired by plant forms?", options: ["Art Nouveau", "Bauhaus", "Minimalism", "Constructivism"], answer: 0 },
        { question: "What is the term for a rapid drawing capturing the basic form of a subject?", options: ["Sketch", "Engraving", "Fresco", "Lithograph"], answer: 0 },
        { question: "Which famous museum houses the Mona Lisa?", options: ["The Met (New York)", "The Louvre (Paris)", "The Prado (Madrid)", "British Museum (London)"], answer: 1 },
        { question: "What is a three-dimensional work of art created by shaping or carving called?", options: ["Sculpture", "Mural", "Print", "Mosaic"], answer: 0 }
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
window.subjectQuestions.art = artQuestions.art;
window.shuffleQuestions = shuffleQuestions;