import { Lesson, Question, Flashcard, Badge } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'math-place-value',
    subject: 'Math',
    title: 'Place Value (Large Numbers)',
    standard: 'MGSE4.NBT.1',
    description: 'Learn how to read and write numbers up to 1,000,000!',
    explanation: 'Place value is the value of each digit in a number. For example, in 456, the 4 is in the hundreds place, the 5 is in the tens place, and the 6 is in the ones place.',
    example: {
      question: 'What is the value of the 7 in 74,321?',
      answer: '70,000',
      explanation: 'The 7 is in the ten-thousands place, so it means 7 ten-thousands, which is 70,000.'
    },
    practiceQuestions: [
      {
        id: 'math-pv-1',
        subject: 'Math',
        text: 'What is the value of the 5 in 152,300?',
        options: ['500', '5,000', '50,000', '500,000'],
        correctAnswer: '50,000',
        explanation: 'The 5 is in the ten-thousands place.',
        hint: 'Count the places from the right: ones, tens, hundreds, thousands, ten-thousands...',
        standard: 'MGSE4.NBT.1',
        topic: 'Place Value',
        difficulty: 'Easy'
      },
      {
        id: 'math-pv-2',
        subject: 'Math',
        text: 'Write 40,000 + 5,000 + 300 + 20 + 1 in standard form.',
        options: ['4,532', '45,321', '453,210', '405,321'],
        correctAnswer: '45,321',
        explanation: 'Add the values together: 40,000 + 5,000 = 45,000. Then add 300 + 20 + 1 = 321. Total is 45,321.',
        hint: 'Combine the numbers by their place values.',
        standard: 'MGSE4.NBT.1',
        topic: 'Place Value',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'math-fractions',
    subject: 'Math',
    title: 'Adding Fractions',
    standard: 'MGSE4.NF.3',
    description: 'Learn how to add fractions with the same denominator.',
    explanation: 'When adding fractions with the same denominator (the bottom number), you only add the numerators (the top numbers). The denominator stays the same!',
    example: {
      question: 'What is 1/4 + 2/4?',
      answer: '3/4',
      explanation: 'Add the top numbers: 1 + 2 = 3. Keep the bottom number: 4. So the answer is 3/4.'
    },
    practiceQuestions: [
      {
        id: 'math-fr-1',
        subject: 'Math',
        text: 'What is 2/5 + 1/5?',
        options: ['3/10', '3/5', '1/5', '2/5'],
        correctAnswer: '3/5',
        explanation: '2 + 1 = 3. The denominator 5 stays the same.',
        hint: 'Only add the top numbers!',
        standard: 'MGSE4.NF.3',
        topic: 'Fractions',
        difficulty: 'Easy'
      },
      {
        id: 'math-fr-2',
        subject: 'Math',
        text: 'What is 3/8 + 5/8?',
        options: ['8/16', '1 whole', '2/8', '1/8'],
        correctAnswer: '1 whole',
        explanation: '3 + 5 = 8. So 8/8 is the same as 1 whole.',
        hint: 'If the top and bottom numbers are the same, it equals 1!',
        standard: 'MGSE4.NF.3',
        topic: 'Fractions',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'math-geometry',
    subject: 'Math',
    title: 'Geometry: Angles & Shapes',
    standard: 'MGSE4.G.1',
    description: 'Identify points, lines, line segments, rays, and angles.',
    explanation: 'Geometry is the study of shapes! A right angle is exactly 90 degrees (like the corner of a square). An acute angle is smaller than 90 degrees, and an obtuse angle is larger than 90 degrees.',
    example: {
      question: 'Which angle is smaller than a right angle?',
      answer: 'Acute angle',
      explanation: 'Think of it as "a-cute" little angle because it is small!'
    },
    practiceQuestions: [
      {
        id: 'math-geo-1',
        subject: 'Math',
        text: 'What do we call two lines that never touch and stay the same distance apart?',
        options: ['Intersecting lines', 'Perpendicular lines', 'Parallel lines', 'Curvy lines'],
        correctAnswer: 'Parallel lines',
        explanation: 'Parallel lines are like railroad tracks—they never meet!',
        hint: 'Think of the two "l"s in the word parallel.',
        standard: 'MGSE4.G.1',
        topic: 'Geometry',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'ela-main-idea',
    subject: 'ELA',
    title: 'Main Idea & Details',
    standard: 'ELAGSE4.RI.2',
    description: 'Find the most important part of a story.',
    explanation: 'The main idea is what the story is mostly about. Supporting details are the small facts that tell more about the main idea.',
    example: {
      question: 'Read: "Dogs are great pets. They are loyal and can learn tricks. Many people love playing fetch with their dogs." What is the main idea?',
      answer: 'Dogs are great pets.',
      explanation: 'The whole paragraph is about why dogs make good pets.'
    },
    practiceQuestions: [
      {
        id: 'ela-mi-1',
        subject: 'ELA',
        passage: 'Honeybees are very busy insects. They fly from flower to flower to collect nectar. They use the nectar to make honey in their hives. Bees also help flowers grow by carrying pollen.',
        text: 'What is the main idea of this passage?',
        options: [
          'Bees make honey.',
          'Honeybees are busy and helpful insects.',
          'Flowers need pollen to grow.',
          'Bees live in hives.'
        ],
        correctAnswer: 'Honeybees are busy and helpful insects.',
        explanation: 'The passage describes several things bees do, showing how busy and helpful they are.',
        hint: 'What is the whole paragraph mostly about?',
        standard: 'ELAGSE4.RI.2',
        topic: 'Main Idea',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'ela-text-structure',
    subject: 'ELA',
    title: 'Text Structure',
    standard: 'ELAGSE4.RI.5',
    description: 'Learn how authors organize their writing.',
    explanation: 'Authors use different structures like Cause and Effect, Compare and Contrast, or Chronological Order (time order) to organize their ideas.',
    example: {
      question: 'If a passage uses words like "first," "next," and "finally," what structure is it?',
      answer: 'Chronological Order',
      explanation: 'These words show the order in which things happen over time.'
    },
    practiceQuestions: [
      {
        id: 'ela-ts-1',
        subject: 'ELA',
        text: 'A passage explains why the dinosaurs went extinct after a giant asteroid hit Earth. What is the structure?',
        options: ['Compare and Contrast', 'Cause and Effect', 'Problem and Solution', 'Description'],
        correctAnswer: 'Cause and Effect',
        explanation: 'The asteroid hitting Earth is the cause, and the dinosaurs going extinct is the effect.',
        hint: 'One thing happened because of another thing.',
        standard: 'ELAGSE4.RI.5',
        topic: 'Text Structure',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'science-weather',
    subject: 'Science',
    title: 'Weather & Climate',
    standard: 'S4E3',
    description: 'Learn about the water cycle and different types of weather.',
    explanation: 'Weather is what is happening outside right now. Climate is the pattern of weather over a long time. The water cycle includes evaporation, condensation, and precipitation.',
    example: {
      question: 'What is it called when water falls from the sky as rain or snow?',
      answer: 'Precipitation',
      explanation: 'Precipitation is any form of water that falls from clouds.'
    },
    practiceQuestions: [
      {
        id: 'sci-we-1',
        subject: 'Science',
        text: 'Which part of the water cycle happens when water turns into gas and rises?',
        options: ['Precipitation', 'Condensation', 'Evaporation', 'Collection'],
        correctAnswer: 'Evaporation',
        explanation: 'Evaporation is when heat from the sun turns water into vapor.',
        hint: 'Think about steam rising from a hot cup of cocoa!',
        standard: 'S4E3',
        topic: 'Weather',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'science-life-cycles',
    subject: 'Science',
    title: 'Life Cycles',
    standard: 'S4L1',
    description: 'How living things grow and change.',
    explanation: 'All living things have a life cycle. For example, a butterfly starts as an egg, becomes a larva (caterpillar), then a pupa (chrysalis), and finally an adult butterfly.',
    example: {
      question: 'What is the first stage of a frog\'s life cycle?',
      answer: 'Egg',
      explanation: 'Frogs start as eggs in the water before becoming tadpoles.'
    },
    practiceQuestions: [
      {
        id: 'sci-lc-1',
        subject: 'Science',
        text: 'Which process describes a major change in an animal\'s body as it grows, like a caterpillar turning into a butterfly?',
        options: ['Hibernation', 'Metamorphosis', 'Migration', 'Photosynthesis'],
        correctAnswer: 'Metamorphosis',
        explanation: 'Metamorphosis is a big change in form during a life cycle.',
        hint: 'It starts with "Meta"!',
        standard: 'S4L1.a',
        topic: 'Life Cycles',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'math-mult-div',
    subject: 'Math',
    title: 'Multiplication & Division',
    standard: 'MGSE4.NBT.5',
    description: 'Master large numbers and sharing equally.',
    explanation: 'Multiplication is adding the same number many times. Division is splitting a large number into equal groups.',
    example: {
      question: 'What is 4 × 306?',
      answer: '1,224',
      explanation: '4 × 300 = 1,200 and 4 × 6 = 24. 1,200 + 24 = 1,224.'
    },
    practiceQuestions: [
      {
        id: 'math-md-1',
        subject: 'Math',
        text: 'A school has 144 students. If they are split into 6 equal groups, how many students are in each group?',
        options: ['20', '22', '24', '26'],
        correctAnswer: '24',
        explanation: '144 divided by 6 is 24.',
        hint: '6 goes into 14 twice...',
        standard: 'MGSE4.NBT.6',
        topic: 'Multiplication & Division',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'ela-vocab',
    subject: 'ELA',
    title: 'Vocabulary Builder',
    standard: 'ELAGSE4.L.4',
    description: 'Learn how to use context clues to find word meanings.',
    explanation: 'Context clues are the words around a tricky word that help you figure out what it means.',
    example: {
      question: 'The hiker was exhausted after climbing all day. What does exhausted mean?',
      answer: 'Very tired',
      explanation: 'Climbing all day would make someone very tired!'
    },
    practiceQuestions: [
      {
        id: 'ela-voc-1',
        subject: 'ELA',
        text: 'The monarch butterfly is famous for its long journey. What does journey mean?',
        options: ['A type of food', 'A long trip', 'A colorful wing', 'A winter home'],
        correctAnswer: 'A long trip',
        explanation: 'A journey is a trip from one place to another.',
        hint: 'They fly over 2,000 miles!',
        standard: 'ELAGSE4.L.4.a',
        topic: 'Vocabulary',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'science-life',
    subject: 'Science',
    title: 'Life Science: Food Chains',
    standard: 'S4L1.b',
    description: 'Learn how energy moves through nature.',
    explanation: 'A food chain shows how living things get food. It starts with producers (plants) that get energy from the sun.',
    example: {
      question: 'Which of these is a producer?',
      answer: 'A green plant',
      explanation: 'Plants produce their own food using sunlight.'
    },
    practiceQuestions: [
      {
        id: 'sci-life-1',
        subject: 'Science',
        text: 'If a predator eats all the frogs, what happens to the insects they used to eat?',
        options: ['They decrease', 'They increase', 'They stay the same', 'They turn into frogs'],
        correctAnswer: 'They increase',
        explanation: 'Without frogs to eat them, the insect population will grow!',
        hint: 'Think about what happens when the "boss" is away!',
        standard: 'S4L1.b',
        topic: 'Food Chains',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'math-decimals',
    subject: 'Math',
    title: 'Decimals & Money',
    standard: 'MGSE4.NF.6',
    description: 'Understand decimals and how they relate to fractions.',
    explanation: 'Decimals are another way to write fractions. 0.5 is the same as 5/10 or 1/2. Think of it like cents in a dollar!',
    example: {
      question: 'What is 0.75 in fraction form?',
      answer: '75/100 (or 3/4)',
      explanation: '0.75 means 75 hundredths.'
    },
    practiceQuestions: [
      {
        id: 'math-dec-1',
        subject: 'Math',
        text: 'Which decimal is equal to 4/10?',
        options: ['0.04', '0.4', '4.0', '0.44'],
        correctAnswer: '0.4',
        explanation: '4/10 is written as 0.4 in decimal form.',
        hint: 'The first place after the decimal is the tenths place.',
        standard: 'MGSE4.NF.6',
        topic: 'Decimals',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'ela-poetry',
    subject: 'ELA',
    title: 'Understanding Poetry',
    standard: 'ELAGSE4.RL.5',
    description: 'Learn about stanzas, rhythm, and rhyme.',
    explanation: 'Poetry is a special kind of writing that often uses stanzas (groups of lines) and rhythm to express feelings or ideas.',
    example: {
      question: 'What do we call a "paragraph" in a poem?',
      answer: 'A stanza',
      explanation: 'Stanzas are the building blocks of poems.'
    },
    practiceQuestions: [
      {
        id: 'ela-po-1',
        subject: 'ELA',
        text: 'If two words end with the same sound, like "cat" and "hat", what is it called?',
        options: ['Alliteration', 'Rhyme', 'Stanza', 'Metaphor'],
        correctAnswer: 'Rhyme',
        explanation: 'Rhyming words have the same ending sound.',
        hint: 'Think of Dr. Seuss books!',
        standard: 'ELAGSE4.RL.5',
        topic: 'Poetry',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'math-measurement',
    subject: 'Math',
    title: 'Measurement: Time & Mass',
    standard: 'MGSE4.MD.1',
    description: 'Learn how to measure time, weight, and volume.',
    explanation: 'Measurement helps us understand how big, heavy, or long something is! For example, there are 60 minutes in 1 hour and 1,000 grams in 1 kilogram.',
    example: {
      question: 'How many minutes are in 2 hours?',
      answer: '120 minutes',
      explanation: '60 minutes × 2 = 120 minutes.'
    },
    practiceQuestions: [
      {
        id: 'math-ms-1',
        subject: 'Math',
        text: 'Which unit would you use to measure the weight of a paperclip?',
        options: ['Kilograms', 'Grams', 'Liters', 'Meters'],
        correctAnswer: 'Grams',
        explanation: 'Grams are used for small, light objects.',
        hint: 'A paperclip is very light!',
        standard: 'MGSE4.MD.1',
        topic: 'Measurement',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'ela-inference',
    subject: 'ELA',
    title: 'Making Inferences',
    standard: 'ELAGSE4.RL.1',
    description: 'Learn how to read between the lines.',
    explanation: 'Inference is using what you know plus what the book says to figure out something the author didn\'t say directly.',
    example: {
      question: 'Read: "Tom grabbed his umbrella and boots as he looked at the dark clouds." What can you infer?',
      answer: 'It is about to rain.',
      explanation: 'Tom is getting ready for rain because of the dark clouds and his gear.'
    },
    practiceQuestions: [
      {
        id: 'ela-inf-1',
        subject: 'ELA',
        text: 'Read: "The girl smiled and jumped up and down when she saw the gift." How does she feel?',
        options: ['Sad', 'Angry', 'Excited', 'Bored'],
        correctAnswer: 'Excited',
        explanation: 'Smiling and jumping are signs of excitement.',
        hint: 'Look at her actions!',
        standard: 'ELAGSE4.RL.1',
        topic: 'Inference',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'science-energy',
    subject: 'Science',
    title: 'Energy & Motion',
    standard: 'S4P3',
    description: 'Learn about light, sound, and heat energy.',
    explanation: 'Energy is the ability to do work! Light energy helps us see, sound energy helps us hear, and heat energy keeps us warm.',
    example: {
      question: 'Which type of energy comes from a vibrating object?',
      answer: 'Sound energy',
      explanation: 'Vibrations create sound waves.'
    },
    practiceQuestions: [
      {
        id: 'sci-en-1',
        subject: 'Science',
        text: 'What happens to light when it hits a mirror and bounces back?',
        options: ['Refraction', 'Absorption', 'Reflection', 'Transmission'],
        correctAnswer: 'Reflection',
        explanation: 'Reflection is when light bounces off a surface.',
        hint: 'Think about looking in a mirror!',
        standard: 'S4P1.b',
        topic: 'Energy',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'math-fractions-2',
    subject: 'Math',
    title: 'Comparing Fractions',
    standard: 'MGSE4.NF.2',
    description: 'Learn how to tell which fraction is bigger.',
    explanation: 'To compare fractions, you can find a common denominator or use a benchmark like 1/2. If the denominators are the same, the one with the bigger numerator is larger!',
    example: {
      question: 'Which is larger: 3/4 or 1/4?',
      answer: '3/4',
      explanation: 'Since the denominators are both 4, we compare the numerators. 3 is bigger than 1.'
    },
    practiceQuestions: [
      {
        id: 'math-cf-1',
        subject: 'Math',
        text: 'Which fraction is equivalent to 1/2?',
        options: ['2/4', '1/4', '3/4', '2/2'],
        correctAnswer: '2/4',
        explanation: '1/2 and 2/4 both represent half of a whole.',
        hint: 'Multiply the top and bottom of 1/2 by 2.',
        standard: 'MGSE4.NF.1',
        topic: 'Fractions',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'science-ecosystems',
    subject: 'Science',
    title: 'Ecosystems & Survival',
    standard: 'S4L1.c',
    description: 'How plants and animals survive in their environment.',
    explanation: 'An ecosystem is a community of living things and their environment. Animals have adaptations (special features) that help them survive, like a camel\'s hump or a bird\'s beak.',
    example: {
      question: 'What is an adaptation of a polar bear?',
      answer: 'Thick white fur',
      explanation: 'The fur keeps it warm and helps it blend into the snow.'
    },
    practiceQuestions: [
      {
        id: 'sci-eco-1',
        subject: 'Science',
        text: 'Which of these is a non-living part of an ecosystem?',
        options: ['Plants', 'Animals', 'Sunlight', 'Bacteria'],
        correctAnswer: 'Sunlight',
        explanation: 'Sunlight is an abiotic (non-living) factor.',
        hint: 'Living things grow and breathe!',
        standard: 'S4L1.c',
        topic: 'Ecosystems',
        difficulty: 'Easy'
      }
    ]
  }
];

export const FLASHCARDS: Flashcard[] = [
  { id: 'fc-1', subject: 'Math', front: 'Area of a Rectangle', back: 'Length × Width' },
  { id: 'fc-2', subject: 'Math', front: 'Perimeter', back: 'The distance around the outside of a shape.' },
  { id: 'fc-3', subject: 'ELA', front: 'Noun', back: 'A person, place, or thing.' },
  { id: 'fc-4', subject: 'ELA', front: 'Verb', back: 'An action word (like run, jump, or play).' },
  { id: 'fc-5', subject: 'Science', front: 'Photosynthesis', back: 'How plants use sunlight to make food.' },
  { id: 'fc-6', subject: 'Science', front: 'Mammal', back: 'An animal that has hair or fur and feeds its babies milk.' },
  { id: 'fc-7', subject: 'Math', front: 'Right Angle', back: 'An angle that is exactly 90 degrees.' },
  { id: 'fc-8', subject: 'Math', front: 'Parallel Lines', back: 'Lines that stay the same distance apart and never touch.' },
  { id: 'fc-9', subject: 'ELA', front: 'Adjective', back: 'A word that describes a noun (like "blue" or "happy").' },
  { id: 'fc-10', subject: 'ELA', front: 'Main Idea', back: 'What a story or paragraph is mostly about.' },
  { id: 'fc-11', subject: 'Science', front: 'Evaporation', back: 'When liquid water turns into a gas (vapor).' },
  { id: 'fc-12', subject: 'Science', front: 'Precipitation', back: 'Water falling from the sky as rain, snow, or hail.' },
  { id: 'fc-13', subject: 'Math', front: 'Numerator', back: 'The top number in a fraction.' },
  { id: 'fc-14', subject: 'Math', front: 'Denominator', back: 'The bottom number in a fraction.' },
  { id: 'fc-15', subject: 'Science', front: 'Igneous Rock', back: 'Rock formed from cooled magma or lava.' },
  { id: 'fc-16', subject: 'Math', front: 'Acute Angle', back: 'An angle smaller than 90 degrees.' },
  { id: 'fc-17', subject: 'Math', front: 'Obtuse Angle', back: 'An angle larger than 90 degrees.' },
  { id: 'fc-18', subject: 'ELA', front: 'Synonym', back: 'A word that means the same as another word.' },
  { id: 'fc-19', subject: 'ELA', front: 'Antonym', back: 'A word that means the opposite of another word.' },
  { id: 'fc-20', subject: 'Science', front: 'Condensation', back: 'When gas turns into liquid (like dew on grass).' },
  { id: 'fc-21', subject: 'Science', front: 'Producer', back: 'An organism that makes its own food (like a plant).' },
  { id: 'fc-22', subject: 'Math', front: 'Product', back: 'The answer to a multiplication problem.' },
  { id: 'fc-23', subject: 'Math', front: 'Quotient', back: 'The answer to a division problem.' },
  { id: 'fc-24', subject: 'ELA', front: 'Simile', back: 'A comparison using "like" or "as".' },
  { id: 'fc-25', subject: 'Science', front: 'Metamorphosis', back: 'A major change in an animal\'s body as it grows.' }
];

export const BADGES: Badge[] = [
  { id: 'badge-1', name: 'Math Star', icon: '⭐', description: 'Complete 5 Math lessons.' },
  { id: 'badge-2', name: 'Reading Ace', icon: '📚', description: 'Complete 5 ELA lessons.' },
  { id: 'badge-3', name: 'Science Whiz', icon: '🔬', description: 'Complete 5 Science lessons.' },
  { id: 'badge-4', name: 'Streak Master', icon: '🔥', description: 'Keep a 3-day streak!' }
];
