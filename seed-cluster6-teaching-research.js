// Cluster 6 — TRB, TET, UGC NET, CSIR NET
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster6-teaching-research.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const TRB_QUESTIONS = [
  q("Which teaching method emphasizes learning through direct experience and activity?", ["Lecture method", "Activity-based/experiential method", "Rote learning", "Dictation method"], 1, "Teaching Aptitude", "Activity-based learning emphasizes hands-on, experiential engagement with material."),
  q("Formative assessment is primarily used to:", ["Grade students at the end of a course", "Monitor ongoing learning and provide feedback", "Rank students competitively", "Determine final certification only"], 1, "Teaching Aptitude", "Formative assessment provides ongoing feedback to improve learning during the instructional process."),
  q("Bloom's Taxonomy classifies educational objectives into domains including:", ["Cognitive, Affective, and Psychomotor", "Only Cognitive", "Only Behavioral", "Physical and Mental only"], 0, "Teaching Aptitude", "Bloom's Taxonomy categorizes learning objectives into cognitive, affective, and psychomotor domains."),
  q("Which of the following best describes 'differentiated instruction'?", ["Teaching all students identically", "Tailoring teaching methods to meet diverse student needs", "Only teaching advanced students", "Avoiding assessments"], 1, "Teaching Aptitude", "Differentiated instruction adapts teaching approaches to accommodate varying student needs and abilities."),
  q("Which teaching aid is most effective for explaining abstract scientific concepts to young learners?", ["Only verbal explanation", "Models, charts, and visual aids", "Written notes only", "No aids needed"], 1, "Teaching Aptitude", "Visual aids and models help make abstract concepts more concrete and understandable for learners."),
  q("The term 'scaffolding' in education refers to:", ["Physical classroom structure", "Temporary support provided to help students achieve understanding", "A type of assessment", "A disciplinary method"], 1, "Teaching Aptitude", "Scaffolding involves providing temporary guided support that is gradually removed as learners gain independence."),
  q("Which of the following is an example of summative assessment?", ["Daily classroom quiz for feedback", "Final term examination", "Verbal questioning during class", "Peer feedback during group work"], 1, "Teaching Aptitude", "Summative assessment evaluates learning at the end of an instructional period, like a final exam."),
  q("Micro-teaching is primarily used for:", ["Teaching very young children only", "Training teachers by practicing specific skills in a small-scale setting", "Teaching only small classes", "Online teaching exclusively"], 1, "Teaching Aptitude", "Micro-teaching is a teacher training technique focusing on practicing specific skills in a scaled-down setting."),
  q("Which learning theory emphasizes learning through reinforcement and punishment?", ["Constructivism", "Behaviorism", "Cognitivism", "Humanism"], 1, "Teaching Aptitude", "Behaviorism, associated with theorists like Skinner, emphasizes learning shaped by reinforcement and punishment."),
  q("Peer tutoring in classrooms primarily helps to:", ["Replace the teacher entirely", "Enhance learning through collaborative student interaction", "Reduce student engagement", "Eliminate the need for assessment"], 1, "Teaching Aptitude", "Peer tutoring fosters collaborative learning, benefiting both the tutor and the tutee."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "General Knowledge", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("The Right to Education is enshrined under which article?", ["Article 19", "Article 21A", "Article 25", "Article 30"], 1, "General Knowledge", "Article 21A guarantees free and compulsory education for children aged 6-14."),
  q("The National Education Policy (NEP) 2020 replaced the education policy of which year?", ["1968", "1986", "1992", "2000"], 1, "General Knowledge", "NEP 2020 replaced the National Policy on Education of 1986 (as modified in 1992)."),
  q("Which body regulates teacher education in India?", ["UGC", "NCTE (National Council for Teacher Education)", "AICTE", "NCERT"], 1, "General Knowledge", "The NCTE regulates and maintains standards for teacher education in India."),
  q("NCERT stands for:", ["National Council of Educational Research and Training", "National Committee for Education Reform and Training", "National Council for Educational Regulation and Training", "National Center for Education Research and Testing"], 0, "General Knowledge", "NCERT is the apex body for curriculum development and educational research in India."),
  q("Which is the longest river in India?", ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], 1, "General Knowledge", "The Ganga is the longest river flowing within India."),
  q("India's Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "General Knowledge", "The Constitution was adopted on 26 November 1949."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Knowledge", "Rabindranath Tagore wrote 'Jana Gana Mana.'"),
  q("Which committee's recommendations led to the establishment of the Kothari Commission's education reforms?", ["Radhakrishnan Commission", "Kothari Commission (1964-66)", "Mudaliar Commission", "Sargent Committee"], 1, "General Knowledge", "The Kothari Commission (1964-66) made comprehensive recommendations shaping Indian education policy."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "General Knowledge", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Reasoning", "Shift +1: EPH."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Reasoning", "Next term: 30."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Reasoning", "Potato is a vegetable."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Reasoning", "Next letter: I."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Reasoning", "Next term: 243."),
  q("Which word does NOT belong: Circle, Square, Triangle, Sphere", ["Circle", "Square", "Triangle", "Sphere"], 3, "Reasoning", "Sphere is 3D."),
  q("If Monday falls on the 1st of a month, what day falls on the 15th?", ["Monday", "Tuesday", "Sunday", "Wednesday"], 0, "Reasoning", "15th is also Monday."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Reasoning", "C is shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Reasoning", "Next perfect square: 25."),
  q("If all Roses are Flowers and all Flowers are Plants, then all Roses are:", ["Plants", "Trees", "Shrubs", "Weeds"], 0, "Reasoning", "Roses are Plants."),
  q("Find the odd pair: (4,16), (5,25), (6,35), (7,49)", ["(4,16)", "(5,25)", "(6,35)", "(7,49)"], 2, "Reasoning", "6²=36, not 35."),
  q("A clock shows 3:00. The angle between hour and minute hands is:", ["45°", "90°", "60°", "75°"], 1, "Reasoning", "Angle = 90°."),
  q("Find the missing letter: B, D, F, H, ?", ["I", "J", "K", "L"], 1, "Reasoning", "Next letter: J."),
  q("Which number should replace the question mark: 7, 14, 28, 56, ?", ["84", "112", "98", "70"], 1, "Reasoning", "Next term: 112."),
  q("If '5 # 3' means 5+3 and '5 @ 3' means 5-3, what is '8 # 2 @ 1'?", ["9", "11", "7", "10"], 0, "Reasoning", "8#2=10, then 10@1=9."),
  q("Which is the highest mountain peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Nanga Parbat"], 2, "General Knowledge", "Mount Everest is the highest peak."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "General Knowledge", "The Pacific Ocean is the largest ocean."),
  q("Who was the first Prime Minister of independent India?", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Sardar Patel", "Rajendra Prasad"], 0, "General Knowledge", "Jawaharlal Nehru was India's first Prime Minister."),
  q("Which is the national bird of India?", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Knowledge", "The peacock is India's national bird."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "General Knowledge", "The RBI was established in 1935."),
  q("Team teaching primarily involves:", ["A single teacher managing all subjects alone", "Two or more teachers collaboratively planning and delivering instruction", "Students teaching themselves without supervision", "Only online instruction"], 1, "Teaching Aptitude", "Team teaching involves collaboration between multiple teachers in planning and delivering lessons."),
  q("Which of the following best describes 'inclusive education'?", ["Segregating students by ability", "Educating all students, including those with disabilities, together in general classrooms", "Only teaching gifted students", "Excluding students with special needs"], 1, "Teaching Aptitude", "Inclusive education integrates students of all abilities into mainstream classrooms."),
  q("The term 'pedagogy' refers to:", ["The study of curriculum design only", "The method and practice of teaching", "Student assessment exclusively", "Classroom furniture arrangement"], 1, "Teaching Aptitude", "Pedagogy encompasses the theory and practice of teaching methods."),
  q("Which of the following is a characteristic of a good lesson plan?", ["Vague and unclear objectives", "Clear objectives, structured content, and assessment methods", "No consideration for student needs", "Excludes all activities"], 1, "Teaching Aptitude", "A good lesson plan has clear objectives, organized content, and built-in assessment."),
  q("Continuous and Comprehensive Evaluation (CCE) aims to:", ["Reduce examination stress and assess holistic development", "Increase reliance on a single final exam", "Eliminate all forms of assessment", "Only assess academic performance"], 0, "Teaching Aptitude", "CCE evaluates students continuously across academic and co-scholastic areas to reduce exam stress."),
  q("Which of the following best supports a constructivist approach to learning?", ["Rote memorization of facts", "Students actively constructing knowledge through experience and reflection", "Passive listening only", "Strict teacher-centered lecturing"], 1, "Teaching Aptitude", "Constructivism emphasizes active learner engagement in constructing understanding."),
  q("Which is the longest river in India?", ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], 1, "General Knowledge", "The Ganga is the longest river flowing within India."),
  q("Which is the smallest planet in the solar system?", ["Mars", "Mercury", "Venus", "Earth"], 1, "General Knowledge", "Mercury is the smallest planet."),
  q("Who invented the telephone?", ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "James Watt"], 1, "General Knowledge", "Alexander Graham Bell invented the telephone."),
  q("The Taj Mahal is located in which Indian city?", ["Delhi", "Agra", "Jaipur", "Lucknow"], 1, "General Knowledge", "The Taj Mahal is located in Agra."),
  q("India's first satellite was named:", ["Chandrayaan", "Aryabhata", "Mangalyaan", "INSAT"], 1, "General Knowledge", "Aryabhata was India's first satellite."),
  q("GST in India was implemented in the year:", ["2015", "2016", "2017", "2019"], 2, "General Knowledge", "GST implemented on 1 July 2017."),
  q("Which Indian city is known as the 'Silicon Valley of India'?", ["Mumbai", "Bengaluru", "Chennai", "Hyderabad"], 1, "General Knowledge", "Bengaluru is called India's Silicon Valley."),
  q("Which body regulates teacher education in India?", ["UGC", "NCTE", "AICTE", "NCERT"], 1, "General Knowledge", "The NCTE regulates teacher education standards in India."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Reasoning", "x = 50."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Reasoning", "Average = 30."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Reasoning", "Speed = 10 m/s."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Reasoning", "LCM = 36."),
  q("Peer tutoring in classrooms primarily helps to:", ["Replace the teacher entirely", "Enhance learning through collaborative student interaction", "Reduce student engagement", "Eliminate the need for assessment"], 1, "Teaching Aptitude", "Peer tutoring fosters collaborative learning benefits for both tutor and tutee."),
  q("Which of the following is a good practice for classroom management?", ["Ignoring disruptive behavior entirely", "Setting clear expectations and consistent routines", "Favoring certain students", "Avoiding any structure"], 1, "Teaching Aptitude", "Clear expectations and consistent routines support effective classroom management."),
];

const TET_QUESTIONS = [
  q("According to Piaget's theory, children in the 'concrete operational stage' typically fall in which age range?", ["0-2 years", "2-7 years", "7-11 years", "11+ years"], 2, "Child Development & Pedagogy", "Piaget's concrete operational stage typically spans ages 7 to 11 years."),
  q("Vygotsky's concept of the 'Zone of Proximal Development' refers to:", ["Tasks a child can do independently", "The gap between what a learner can do alone and with guidance", "A child's physical growth zone", "A fixed IQ measurement"], 1, "Child Development & Pedagogy", "ZPD represents the difference between independent ability and potential ability with guided support."),
  q("Which type of learner primarily benefits from listening and verbal instruction?", ["Visual learner", "Auditory learner", "Kinesthetic learner", "Reading/writing learner"], 1, "Child Development & Pedagogy", "Auditory learners grasp information best through listening and verbal explanation."),
  q("Inclusive education primarily aims to:", ["Separate children with disabilities", "Integrate all children, including those with disabilities, into mainstream classrooms", "Focus only on gifted children", "Reduce classroom diversity"], 1, "Child Development & Pedagogy", "Inclusive education integrates children of all abilities into general education settings."),
  q("Which of the following is a formative assessment tool?", ["Final board examination", "Classroom quizzes and observations during teaching", "Annual report card only", "Entrance examination"], 1, "Child Development & Pedagogy", "Formative assessment tools like quizzes provide ongoing feedback during the learning process."),
  q("According to Kohlberg, moral development progresses through stages that are:", ["Random and unordered", "Sequential and universal across cultures (in his theory)", "Based only on age, not reasoning", "Unrelated to cognitive development"], 1, "Child Development & Pedagogy", "Kohlberg proposed that moral reasoning develops through a sequential and largely universal series of stages."),
  q("A child who learns best through hands-on activities and movement is likely a(n):", ["Visual learner", "Auditory learner", "Kinesthetic learner", "Abstract learner"], 2, "Child Development & Pedagogy", "Kinesthetic learners benefit most from physical activity and hands-on experience."),
  q("Which of the following best describes 'individual differences' among learners?", ["All children learn identically", "Variations among children in ability, interest, and learning pace", "Only physical differences matter", "Differences that should be ignored in teaching"], 1, "Child Development & Pedagogy", "Individual differences refer to the natural variations in ability, interest, and pace among learners."),
  q("Which parenting/teaching style is characterized by high warmth and high structure/expectations?", ["Authoritarian", "Permissive", "Authoritative", "Neglectful"], 2, "Child Development & Pedagogy", "The authoritative style balances warmth with clear expectations and structure."),
  q("Language acquisition in early childhood is best supported by:", ["Isolation from social interaction", "Rich linguistic environment and social interaction", "Avoiding conversation with the child", "Strict grammar drills only"], 1, "Child Development & Pedagogy", "Rich social and linguistic interaction significantly supports early language development."),
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "Language", "'Abundant' means plentiful."),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "Language", "Antonym of 'ancient' is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "Language", "Correct spelling: 'receive.'"),
  q("Fill in the blank: She ___ to the market yesterday.", ["go", "goes", "went", "going"], 2, "Language", "Correct: 'went.'"),
  q("Choose the correct plural form of 'Child':", ["Childs", "Childes", "Children", "Childrens"], 2, "Language", "Correct plural: 'children.'"),
  q("Choose the correct preposition: She is good ___ mathematics.", ["in", "at", "on", "with"], 1, "Language", "'Good at' is correct."),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "Language", "Correct: 'doesn't like.'"),
  q("Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "Language", "'Joyful' is synonym of 'happy.'"),
  q("Identify the noun in the sentence: 'The dog ran quickly.'", ["ran", "quickly", "dog", "the"], 2, "Language", "'Dog' is the noun."),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "Language", "Antonym of 'generous' is 'stingy.'"),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Mathematics", "Speed = 10 m/s."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Mathematics", "SI = Rs.200."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Mathematics", "Average = 30."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Mathematics", "LCM = 36."),
  q("The HCF of 12 and 18 is:", ["2", "6", "36", "4"], 1, "Mathematics", "HCF = 6."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Mathematics", "12×12=144."),
  q("The perimeter of a square with side 8 cm is:", ["32 cm", "64 cm", "16 cm", "24 cm"], 0, "Mathematics", "Perimeter = 32 cm."),
  q("The area of a triangle with base 10 cm and height 6 cm is:", ["60 cm²", "30 cm²", "16 cm²", "40 cm²"], 1, "Mathematics", "Area = 30 cm²."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Mathematics", "x = 50."),
  q("Which teaching approach is most effective for teaching primary-level mathematics concepts?", ["Abstract lecture only", "Using concrete objects and manipulatives", "Memorization of formulas only", "Avoiding practice problems"], 1, "Mathematics Pedagogy", "Concrete objects and manipulatives help young learners grasp abstract mathematical concepts."),
  q("The chemical formula of water is:", ["H2O", "HO2", "H2O2", "OH"], 0, "Environmental Studies", "Water is H2O."),
  q("Photosynthesis takes place mainly in which part of the plant?", ["Root", "Stem", "Leaf", "Flower"], 2, "Environmental Studies", "Leaves are the primary site of photosynthesis."),
  q("Which gas is essential for respiration in most living organisms?", ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], 2, "Environmental Studies", "Oxygen is essential for cellular respiration."),
  q("The process by which plants lose water vapor through leaves is called:", ["Respiration", "Transpiration", "Photosynthesis", "Excretion"], 1, "Environmental Studies", "Transpiration is the loss of water vapor from plant surfaces."),
  q("Which of the following is a renewable source of energy?", ["Coal", "Petroleum", "Solar energy", "Natural gas"], 2, "Environmental Studies", "Solar energy is renewable."),
  q("Segregation of waste into biodegradable and non-biodegradable categories primarily helps in:", ["Increasing pollution", "Effective waste management and recycling", "Wasting resources", "Nothing significant"], 1, "Environmental Studies", "Waste segregation supports effective recycling and reduces environmental harm."),
  q("Which of the following is an example of a natural resource?", ["Plastic", "Water", "Steel", "Concrete"], 1, "Environmental Studies", "Water is a naturally occurring resource essential for life."),
  q("The layer of the atmosphere that protects Earth from harmful UV radiation is the:", ["Troposphere", "Ozone layer", "Mesosphere", "Ionosphere"], 1, "Environmental Studies", "The ozone layer absorbs and blocks most of the sun's harmful UV radiation."),
  q("Which of the following practices helps conserve soil fertility?", ["Overgrazing", "Crop rotation", "Deforestation", "Excessive use of chemical fertilizers only"], 1, "Environmental Studies", "Crop rotation helps maintain and restore soil fertility naturally."),
  q("Which of the following is considered a good practice for water conservation?", ["Leaving taps running", "Rainwater harvesting", "Excessive irrigation", "Ignoring leaks"], 1, "Environmental Studies", "Rainwater harvesting is an effective method for conserving water resources."),
  q("A child who struggles primarily with reading despite normal intelligence may have:", ["Dyscalculia", "Dyslexia", "Dysgraphia", "ADHD exclusively"], 1, "Child Development & Pedagogy", "Dyslexia is a specific learning difficulty primarily affecting reading ability."),
  q("Which of the following is a characteristic of gifted children?", ["Below-average curiosity", "Advanced problem-solving ability and curiosity", "Difficulty grasping new concepts", "Disinterest in learning"], 1, "Child Development & Pedagogy", "Gifted children often show advanced problem-solving skills and heightened curiosity."),
  q("Socialization in early childhood is primarily influenced by:", ["Genetics alone", "Family, peers, and the surrounding environment", "Television only", "None of these factors"], 1, "Child Development & Pedagogy", "Socialization develops through interactions with family, peers, and the broader environment."),
  q("The term 'multiple intelligences,' proposed by Howard Gardner, suggests that:", ["Intelligence is a single fixed trait", "There are multiple distinct types of intelligence", "Only academic intelligence matters", "Intelligence cannot be measured"], 1, "Child Development & Pedagogy", "Gardner's theory proposes multiple distinct types of intelligence beyond traditional academic measures."),
  q("Choose the correct meaning of the idiom 'Once in a blue moon':", ["Very frequently", "Rarely", "Every night", "Regularly"], 1, "Language", "Means something happening very rarely."),
  q("Choose the correct passive voice: 'She writes a letter.'", ["A letter is written by her.", "A letter was written by her.", "A letter written by her.", "A letter is writing by her."], 0, "Language", "Present passive: 'is written.'"),
  q("Identify the verb in the sentence: 'They played football yesterday.'", ["They", "played", "football", "yesterday"], 1, "Language", "'Played' is the verb."),
  q("Choose the correct article: ___ university is a place of higher learning.", ["A", "An", "The", "No article needed"], 0, "Language", "'University' starts with a consonant sound, taking 'a.'"),
  q("A shopkeeper sells an item for Rs.550 at a profit of 10%. The cost price is:", ["Rs.500", "Rs.495", "Rs.540", "Rs.505"], 0, "Mathematics", "CP = Rs.500."),
  q("The value of 15% of 200 is:", ["20", "30", "25", "35"], 1, "Mathematics", "15% of 200 = 30."),
  q("If 20% of a number is 50, the number is:", ["200", "250", "100", "150"], 1, "Mathematics", "x = 250."),
  q("A can complete a work in 10 days and B in 15 days. Together they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Mathematics", "Together: 6 days."),
  q("The volume of a cube with side 4 cm is:", ["16 cm³", "64 cm³", "48 cm³", "12 cm³"], 1, "Mathematics", "Volume = 64 cm³."),
  q("Which teaching aid is most effective for teaching primary geometry concepts?", ["Only verbal explanation", "Concrete shapes and manipulatives", "Written notes only", "No aids at all"], 1, "Mathematics Pedagogy", "Concrete shapes and manipulatives help young learners understand geometric concepts."),
  q("Newton's first law of motion is also known as the law of:", ["Momentum", "Inertia", "Action-reaction", "Gravitation"], 1, "Environmental Studies", "Newton's first law describes inertia."),
  q("Which organ in the human body is primarily responsible for filtering blood?", ["Liver", "Heart", "Kidney", "Lungs"], 2, "Environmental Studies", "The kidneys filter waste products from the blood."),
  q("The pH of pure water is:", ["0", "7", "14", "1"], 1, "Environmental Studies", "Pure water has a pH of 7."),
  q("Sound cannot travel through:", ["Solids", "Liquids", "Gases", "Vacuum"], 3, "Environmental Studies", "Sound requires a medium and cannot travel through vacuum."),
  q("Which of the following is used to test for the presence of starch?", ["Litmus paper", "Iodine solution", "Phenolphthalein", "Universal indicator"], 1, "Environmental Studies", "Iodine solution turns blue-black in the presence of starch."),
  q("Which of the following is an example of a food chain?", ["Grass -> Rabbit -> Fox", "A single organism only", "A random list of animals", "A geographical map"], 0, "Environmental Studies", "A food chain shows the sequential transfer of energy: producers to consumers."),
];

const UGCNET_QUESTIONS = [
  q("Which of the following best describes 'research aptitude'?", ["Ability to memorize facts only", "Capacity to systematically investigate and analyze a problem", "Skill in public speaking only", "Ability to teach large classes"], 1, "Research Aptitude", "Research aptitude involves the systematic capacity to investigate, analyze, and draw conclusions about a problem."),
  q("A research hypothesis is best described as:", ["A proven fact", "A tentative statement predicting the relationship between variables", "An unrelated observation", "A final conclusion"], 1, "Research Aptitude", "A hypothesis is a testable, tentative prediction about the relationship between variables."),
  q("Which type of research primarily aims to describe characteristics of a phenomenon without manipulating variables?", ["Experimental research", "Descriptive research", "Historical research", "Action research"], 1, "Research Aptitude", "Descriptive research aims to systematically describe characteristics without manipulation."),
  q("A literature review in research primarily serves to:", ["Replace the need for original research", "Summarize and situate the study within existing knowledge", "Avoid citing other scholars", "Only list book titles"], 1, "Research Aptitude", "A literature review contextualizes new research within the existing body of knowledge."),
  q("Which sampling method gives every member of a population an equal chance of selection?", ["Convenience sampling", "Random sampling", "Purposive sampling", "Snowball sampling"], 1, "Research Aptitude", "Random sampling ensures every population member has an equal chance of being selected."),
  q("A null hypothesis typically states that:", ["There is a significant relationship between variables", "There is no significant relationship or effect between variables", "The research is invalid", "Data cannot be collected"], 1, "Research Aptitude", "The null hypothesis proposes no significant relationship or effect, which the researcher may seek to reject."),
  q("Plagiarism in academic research refers to:", ["Proper citation of sources", "Presenting others' work or ideas as one's own without credit", "Conducting original research", "Peer review of a manuscript"], 1, "Research Aptitude", "Plagiarism is the unethical practice of using others' work without proper attribution."),
  q("Which of the following is considered a primary source of data?", ["A textbook summary", "Original survey data collected by the researcher", "An encyclopedia entry", "A review article"], 1, "Research Aptitude", "Primary sources involve original, firsthand data collection by the researcher."),
  q("Which teaching method emphasizes learning through direct experience and activity?", ["Lecture method", "Activity-based/experiential method", "Rote learning", "Dictation method"], 1, "Teaching Aptitude", "Activity-based learning emphasizes hands-on engagement."),
  q("Bloom's Taxonomy classifies educational objectives into domains including:", ["Cognitive, Affective, and Psychomotor", "Only Cognitive", "Only Behavioral", "Physical and Mental only"], 0, "Teaching Aptitude", "Bloom's Taxonomy includes cognitive, affective, and psychomotor domains."),
  q("Formative assessment is primarily used to:", ["Grade students at course end", "Monitor ongoing learning and provide feedback", "Rank students competitively", "Determine final certification only"], 1, "Teaching Aptitude", "Formative assessment provides ongoing feedback during learning."),
  q("Which of the following best describes 'differentiated instruction'?", ["Teaching all students identically", "Tailoring teaching to meet diverse student needs", "Only teaching advanced students", "Avoiding assessments"], 1, "Teaching Aptitude", "Differentiated instruction adapts to varying student needs."),
  q("The term 'pedagogy' refers to:", ["The study of curriculum design only", "The method and practice of teaching", "Student assessment exclusively", "Classroom furniture arrangement"], 1, "Teaching Aptitude", "Pedagogy encompasses the theory and practice of teaching."),
  q("Which learning theory emphasizes learning through reinforcement and punishment?", ["Constructivism", "Behaviorism", "Cognitivism", "Humanism"], 1, "Teaching Aptitude", "Behaviorism emphasizes reinforcement and punishment in learning."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Logical Reasoning", "Shift +1: EPH."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Logical Reasoning", "Next term: 30."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Logical Reasoning", "Potato is a vegetable."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Logical Reasoning", "Next letter: I."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Logical Reasoning", "Next term: 243."),
  q("If all Roses are Flowers and all Flowers are Plants, then all Roses are:", ["Plants", "Trees", "Shrubs", "Weeds"], 0, "Logical Reasoning", "Roses are Plants."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Logical Reasoning", "C is shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Logical Reasoning", "Next perfect square: 25."),
  q("Find the odd pair: (4,16), (5,25), (6,35), (7,49)", ["(4,16)", "(5,25)", "(6,35)", "(7,49)"], 2, "Logical Reasoning", "6²=36, not 35."),
  q("A clock shows 3:00. The angle between hour and minute hands is:", ["45°", "90°", "60°", "75°"], 1, "Logical Reasoning", "Angle = 90°."),
  q("If a bar graph shows sales of 100, 150, 200, and 250 units over 4 quarters, the percentage growth from Q1 to Q4 is:", ["100%", "150%", "125%", "175%"], 1, "Data Interpretation", "Growth = 150%."),
  q("A pie chart shows 'Salaries' at 40% of a 360° circle. The angle representing Salaries is:", ["120°", "144°", "160°", "180°"], 1, "Data Interpretation", "40% of 360° = 144°."),
  q("A data set has values 2, 4, 6, 8, 10. The median is:", ["4", "5", "6", "8"], 2, "Data Interpretation", "Median = 6."),
  q("Which chart type is best suited for showing proportions of a whole?", ["Line graph", "Pie chart", "Scatter plot", "Histogram"], 1, "Data Interpretation", "Pie charts show proportions of a whole."),
  q("Which body regulates university education standards in India?", ["AICTE", "UGC (University Grants Commission)", "NCTE", "NCERT"], 1, "Higher Education System", "The UGC coordinates and maintains standards of university education in India."),
  q("The National Education Policy (NEP) 2020 aims to achieve a Gross Enrolment Ratio in higher education of approximately:", ["30% by 2035", "50% by 2035", "70% by 2035", "90% by 2035"], 1, "Higher Education System", "NEP 2020 targets a Gross Enrolment Ratio of 50% in higher education by 2035."),
  q("Which of the following best describes 'ICT' in education?", ["Information and Communication Technology", "Institutional Curriculum Training", "Internal Class Testing", "Integrated Career Training"], 0, "ICT & Environment", "ICT stands for Information and Communication Technology, widely used in modern education."),
  q("MOOCs stand for:", ["Massive Open Online Courses", "Modern Online Organized Classes", "Multiple Objective Online Curricula", "Ministry of Online Course Certification"], 0, "ICT & Environment", "MOOCs (Massive Open Online Courses) provide free/open access to online educational content."),
  q("SWAYAM is an Indian government initiative related to:", ["Rural infrastructure", "Online education platform", "Healthcare", "Agriculture subsidy"], 1, "ICT & Environment", "SWAYAM is a government of India platform providing free online courses."),
  q("Sustainable development primarily emphasizes:", ["Rapid resource exploitation", "Meeting present needs without compromising future generations' ability to meet theirs", "Ignoring environmental concerns", "Short-term economic gain only"], 1, "ICT & Environment", "Sustainable development balances current needs with preserving resources for future generations."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "General Knowledge", "Dr. B.R. Ambedkar chaired the Drafting Committee."),
  q("Which is the apex research funding body for science in India?", ["UGC", "DST (Department of Science and Technology)", "AICTE", "NCERT"], 1, "General Knowledge", "The DST is a key body funding and promoting science and technology research in India."),
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "Reading Comprehension", "'Abundant' means plentiful."),
  q("Choose the correct antonym of 'Ambiguous':", ["Vague", "Clear", "Uncertain", "Confusing"], 1, "Reading Comprehension", "Antonym of 'ambiguous' is 'clear.'"),
  q("Effective communication in teaching primarily requires:", ["One-way transmission only", "Clarity, feedback, and mutual understanding", "Avoiding student questions", "Complex jargon"], 1, "Communication", "Effective communication involves clarity and a feedback loop for mutual understanding."),
  q("Which of the following is a barrier to effective communication?", ["Active listening", "Noise and distractions", "Clear articulation", "Appropriate feedback"], 1, "Communication", "Noise and distractions can significantly hinder effective communication."),
  q("A literature review in research primarily serves to:", ["Replace the need for original research", "Summarize and situate the study within existing knowledge", "Avoid citing other scholars", "Only list book titles"], 1, "Research Aptitude", "A literature review contextualizes new research within existing knowledge."),
  q("Which type of research primarily aims to describe characteristics of a phenomenon without manipulating variables?", ["Experimental research", "Descriptive research", "Historical research", "Action research"], 1, "Research Aptitude", "Descriptive research describes characteristics without manipulation."),
  q("Micro-teaching is primarily used for:", ["Teaching very young children only", "Training teachers by practicing specific skills in a small-scale setting", "Teaching only small classes", "Online teaching exclusively"], 1, "Teaching Aptitude", "Micro-teaching trains teachers by practicing specific skills in a scaled-down setting."),
  q("Which of the following best describes 'inclusive education'?", ["Segregating students by ability", "Educating all students, including those with disabilities, together", "Only teaching gifted students", "Excluding students with special needs"], 1, "Teaching Aptitude", "Inclusive education integrates students of all abilities into mainstream classrooms."),
  q("Team teaching primarily involves:", ["A single teacher managing all subjects alone", "Two or more teachers collaboratively planning and delivering instruction", "Students teaching themselves without supervision", "Only online instruction"], 1, "Teaching Aptitude", "Team teaching involves collaborative planning and delivery by multiple teachers."),
  q("Continuous and Comprehensive Evaluation (CCE) aims to:", ["Reduce examination stress and assess holistic development", "Increase reliance on a single final exam", "Eliminate all forms of assessment", "Only assess academic performance"], 0, "Teaching Aptitude", "CCE evaluates students continuously across academic and co-scholastic areas."),
  q("Which is the longest river in India?", ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], 1, "General Knowledge", "The Ganga is the longest river flowing within India."),
  q("India's Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "General Knowledge", "The Constitution was adopted on 26 November 1949."),
  q("Which is the highest mountain peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Nanga Parbat"], 2, "General Knowledge", "Mount Everest is the highest peak."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "General Knowledge", "The RBI was established in 1935."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "General Knowledge", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "Reading Comprehension", "Antonym of 'ancient' is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "Reading Comprehension", "Correct spelling: 'receive.'"),
  q("Choose the correct meaning of 'to break the ice':", ["To cause an argument", "To start a conversation in an awkward situation", "To end a relationship", "To celebrate"], 1, "Reading Comprehension", "Means initiating conversation, easing tension."),
  q("Which of the following describes 'open educational resources' (OER)?", ["Paid textbooks only", "Freely accessible teaching and learning materials", "Restricted institutional documents", "Personal notes only"], 1, "ICT & Environment", "OER are freely accessible educational materials available for use and adaptation."),
  q("Digital literacy in education primarily refers to:", ["Only owning a computer", "The ability to effectively find, evaluate, and use digital information", "Avoiding technology entirely", "Only using social media"], 1, "ICT & Environment", "Digital literacy involves effectively navigating and using digital tools and information."),
  q("Environmental degradation is most directly caused by:", ["Sustainable practices", "Overexploitation of natural resources and pollution", "Afforestation", "Renewable energy adoption"], 1, "ICT & Environment", "Overexploitation of resources and pollution are primary drivers of environmental degradation."),
  q("Which of the following best represents 'population explosion' as an environmental concern?", ["Decreasing population growth", "Rapid, unsustainable population growth straining resources", "Stable population levels", "Population decline"], 1, "ICT & Environment", "Population explosion refers to rapid growth straining available resources and infrastructure."),
  q("NAAC in Indian higher education stands for:", ["National Assessment and Accreditation Council", "National Academic Advisory Committee", "National Association of Autonomous Colleges", "National Academic Accreditation Cell"], 0, "Higher Education System", "NAAC assesses and accredits higher education institutions in India."),
  q("Autonomy for colleges/universities in India primarily allows them to:", ["Ignore UGC guidelines entirely", "Design and manage their own curriculum and evaluation to some extent", "Avoid all forms of accreditation", "Charge unregulated fees only"], 1, "Higher Education System", "Autonomous institutions get flexibility in curriculum design and evaluation within a regulatory framework."),
];

const CSIRNET_QUESTIONS = [
  q("The SI unit of electric resistance is:", ["Ampere", "Volt", "Ohm", "Watt"], 2, "General Science Aptitude", "Resistance is measured in ohms."),
  q("The atomic number of an element represents the number of:", ["Neutrons", "Protons", "Electrons only in ions", "Protons + neutrons"], 1, "General Science Aptitude", "Atomic number equals proton count."),
  q("Which nitrogenous base is unique to RNA?", ["Adenine", "Cytosine", "Uracil", "Guanine"], 2, "General Science Aptitude", "Uracil replaces thymine in RNA."),
  q("The pH of a neutral solution at 25°C is:", ["0", "7", "14", "1"], 1, "General Science Aptitude", "Neutral pH is 7 at 25°C."),
  q("The functional unit of the kidney is the:", ["Neuron", "Nephron", "Alveolus", "Villus"], 1, "General Science Aptitude", "The nephron is the kidney's functional unit."),
  q("Which of the following is an example of an exothermic reaction?", ["Photosynthesis", "Combustion", "Evaporation", "Melting of ice"], 1, "General Science Aptitude", "Combustion releases heat, making it exothermic."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic reticulum"], 1, "General Science Aptitude", "Mitochondria generate ATP for the cell."),
  q("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "3.0 km/s", "9.8 km/s"], 1, "General Science Aptitude", "Earth's escape velocity is about 11.2 km/s."),
  q("DNA replication is described as semi-conservative because:", ["Both strands are newly synthesized", "Each daughter DNA has one old and one new strand", "Only one daughter DNA is functional", "RNA replaces one strand"], 1, "General Science Aptitude", "Each new DNA molecule retains one parental strand and one new strand."),
  q("Isotopes of an element differ in the number of:", ["Protons", "Electrons", "Neutrons", "Valence electrons"], 2, "General Science Aptitude", "Isotopes differ in neutron count."),
  q("A research hypothesis is best described as:", ["A proven fact", "A tentative statement predicting the relationship between variables", "An unrelated observation", "A final conclusion"], 1, "Research Methodology", "A hypothesis is a testable, tentative prediction."),
  q("Which sampling method gives every member of a population an equal chance of selection?", ["Convenience sampling", "Random sampling", "Purposive sampling", "Snowball sampling"], 1, "Research Methodology", "Random sampling gives equal selection chance to all members."),
  q("A null hypothesis typically states that:", ["There is a significant relationship between variables", "There is no significant relationship or effect between variables", "The research is invalid", "Data cannot be collected"], 1, "Research Methodology", "The null hypothesis proposes no significant relationship or effect."),
  q("Peer review in scientific publishing primarily serves to:", ["Speed up publication without scrutiny", "Ensure quality and validity of research before publication", "Replace the need for data analysis", "Guarantee funding for the study"], 1, "Research Methodology", "Peer review evaluates research quality and validity before publication."),
  q("Plagiarism in academic research refers to:", ["Proper citation of sources", "Presenting others' work or ideas as one's own without credit", "Conducting original research", "Peer review of a manuscript"], 1, "Research Methodology", "Plagiarism is using others' work without proper attribution."),
  q("Which of the following is considered a primary source of data?", ["A textbook summary", "Original experimental data collected by the researcher", "An encyclopedia entry", "A review article"], 1, "Research Methodology", "Primary sources are original, firsthand data."),
  q("A control group in an experiment is used to:", ["Receive the experimental treatment", "Provide a baseline for comparison against the treatment group", "Be excluded from analysis", "Replace randomization"], 1, "Research Methodology", "A control group provides a baseline for comparison, helping isolate the treatment's effect."),
  q("Reproducibility in scientific research refers to:", ["A study's results being obtainable only once", "The ability of independent researchers to obtain consistent results using the same methods", "Avoiding all forms of documentation", "Using different, unrelated methods each time"], 1, "Research Methodology", "Reproducibility means independent researchers can achieve consistent results using the same methodology."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quantitative Aptitude", "Speed = 10 m/s."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quantitative Aptitude", "Average = 30."),
  q("If x:y = 2:3 and y:z = 4:5, then x:y:z is:", ["8:12:15", "2:3:5", "4:6:5", "8:6:15"], 0, "Quantitative Aptitude", "Combined ratio: 8:12:15."),
  q("A can complete a work in 10 days and B in 15 days. Together they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Quantitative Aptitude", "Together: 6 days."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Quantitative Aptitude", "12×12=144."),
  q("If A and B are independent events, P(A ∩ B) equals:", ["P(A) + P(B)", "P(A) - P(B)", "P(A) × P(B)", "P(A) / P(B)"], 2, "Quantitative Aptitude", "Independent events: joint probability = product."),
  q("The value of the determinant of a 2x2 identity matrix is:", ["0", "1", "2", "-1"], 1, "Quantitative Aptitude", "Determinant of identity matrix = 1."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Quantitative Aptitude", "x = 50."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quantitative Aptitude", "LCM = 36."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Quantitative Aptitude", "Shift +1: EPH."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Quantitative Aptitude", "Next term: 30."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Quantitative Aptitude", "Next term: 243."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Quantitative Aptitude", "C is shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Quantitative Aptitude", "Next perfect square: 25."),
  q("The value of log(1) in any base is:", ["1", "0", "Undefined", "-1"], 1, "Quantitative Aptitude", "log(1) = 0 in any base."),
  q("Find the missing letter: B, D, F, H, ?", ["I", "J", "K", "L"], 1, "Quantitative Aptitude", "Next letter: J."),
  q("Which number should replace the question mark: 7, 14, 28, 56, ?", ["84", "112", "98", "70"], 1, "Quantitative Aptitude", "Next term: 112."),
  q("The number of ways to arrange 5 distinct objects in a row is:", ["25", "60", "120", "20"], 2, "Quantitative Aptitude", "5! = 120."),
  q("The sum of the first n natural numbers is given by:", ["n(n+1)/2", "n(n-1)/2", "n²", "n(n+1)"], 0, "Quantitative Aptitude", "Sum formula: n(n+1)/2."),
  q("The derivative of x² with respect to x is:", ["x", "2x", "x²", "2"], 1, "General Science Aptitude", "Power rule: d/dx(x²) = 2x."),
  q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "General Science Aptitude", "Standard integral of 1/x is ln|x| + C."),
  q("The SI unit of magnetic flux is:", ["Tesla", "Weber", "Henry", "Gauss"], 1, "General Science Aptitude", "Magnetic flux is measured in webers."),
  q("Newton's third law implies action-reaction pairs act on:", ["The same body", "Different bodies", "Only rigid bodies", "Only at contact"], 1, "General Science Aptitude", "Action and reaction act on different bodies."),
  q("The molar mass of water (H2O) is approximately:", ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"], 1, "General Science Aptitude", "Water's molar mass is 18 g/mol."),
  q("Which type of bond involves the sharing of electron pairs?", ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], 1, "General Science Aptitude", "Covalent bonds share electron pairs."),
  q("The process of formation of pollen grains is called:", ["Spermatogenesis", "Microsporogenesis", "Megasporogenesis", "Oogenesis"], 1, "General Science Aptitude", "Microsporogenesis forms pollen grains in the anther."),
  q("Which hormone regulates blood glucose by promoting glucose uptake?", ["Glucagon", "Insulin", "Adrenaline", "Thyroxine"], 1, "General Science Aptitude", "Insulin lowers blood glucose by promoting cellular uptake."),
  q("The rate of a chemical reaction generally increases with:", ["Decreasing temperature", "Increasing temperature", "Decreasing concentration", "Removing the catalyst"], 1, "General Science Aptitude", "Higher temperature speeds up reactions."),
  q("A control group in an experiment is used to:", ["Receive the experimental treatment", "Provide a baseline for comparison against the treatment group", "Be excluded from analysis", "Replace randomization"], 1, "Research Methodology", "A control group provides a baseline for comparing against the treatment group."),
  q("Which of the following is considered a secondary source of data?", ["Original survey data", "A published review article summarizing prior studies", "Raw experimental readings", "Field observation notes"], 1, "Research Methodology", "Secondary sources summarize or interpret existing primary data/research."),
  q("Statistical significance in research typically indicates:", ["The result is definitely true", "The result is unlikely to have occurred by chance alone", "The sample size was too small", "The hypothesis was rejected automatically"], 1, "Research Methodology", "Statistical significance suggests results are unlikely due to random chance, based on a set threshold."),
  q("Which of the following best describes 'ethics in research'?", ["Ignoring participant consent", "Ensuring honesty, participant welfare, and integrity in research conduct", "Fabricating convenient data", "Avoiding peer review"], 1, "Research Methodology", "Research ethics involves honesty, protecting participants, and maintaining data integrity."),
  q("A longitudinal study is characterized by:", ["Observing a single point in time", "Repeated observations of the same variables over an extended period", "Only laboratory experiments", "Exclusively qualitative data"], 1, "Research Methodology", "Longitudinal studies track the same subjects over an extended time period."),
  q("Which of the following is an example of qualitative research data?", ["Test scores", "Interview transcripts and open-ended responses", "Numerical survey ratings only", "Statistical averages"], 1, "Research Methodology", "Qualitative data includes non-numerical information like interview transcripts."),
  q("An independent variable in an experiment is:", ["The outcome being measured", "The variable manipulated by the researcher", "A constant throughout the study", "Always the same as the dependent variable"], 1, "Research Methodology", "The independent variable is manipulated by the researcher to observe its effect."),
  q("A dependent variable in an experiment is:", ["The variable manipulated by the researcher", "The outcome measured, which may change due to the independent variable", "Always constant", "Unrelated to the study"], 1, "Research Methodology", "The dependent variable is the measured outcome, expected to change based on the independent variable."),
  q("Which of the following describes 'inter-disciplinary research'?", ["Research confined to a single discipline", "Research integrating methods/perspectives from multiple disciplines", "Research done by a single researcher only", "Research without any theoretical framework"], 1, "Research Methodology", "Interdisciplinary research draws on methods and perspectives from multiple academic fields."),
  q("A questionnaire is a common tool used in which type of data collection?", ["Qualitative only", "Survey research", "Laboratory experiments only", "Historical archival research only"], 1, "Research Methodology", "Questionnaires are widely used tools in survey-based research."),
  q("Which of the following is an example of a physical science?", ["Botany", "Zoology", "Physics", "Microbiology"], 2, "General Science Aptitude", "Physics is a core physical science, distinct from life sciences like botany or zoology."),
  q("Which of the following is an example of a life science?", ["Chemistry", "Physics", "Biology", "Geology"], 2, "General Science Aptitude", "Biology is the primary life science, studying living organisms."),
  q("Earth Sciences primarily encompass the study of:", ["Only outer space", "The Earth's physical structure, atmosphere, and processes", "Only marine life", "Only human societies"], 1, "General Science Aptitude", "Earth Sciences study the Earth's physical structure, atmosphere, oceans, and related processes."),
  q("Which of the following is an example of a mathematical science topic?", ["Photosynthesis", "Linear algebra", "Cell division", "Plate tectonics"], 1, "General Science Aptitude", "Linear algebra is a core topic within mathematical sciences."),
];

const TESTS = [
  { id: "premium_trb_1", title: "TRB Complete Practice Test — Teaching Aptitude, GK & Reasoning", category: "TRB", questions: TRB_QUESTIONS,
    description: "A full 60-question TRB-pattern practice test covering Teaching Aptitude, General Knowledge, and Reasoning." },
  { id: "premium_tet_1", title: "TET Complete Practice Test — Child Development, Language, Maths & EVS", category: "TET", questions: TET_QUESTIONS,
    description: "A full 60-question TET-pattern practice test covering Child Development & Pedagogy, Language, Mathematics, and Environmental Studies." },
  { id: "premium_ugcnet_1", title: "UGC NET Complete Practice Test — Teaching & Research Aptitude (Paper 1)", category: "UGC NET", questions: UGCNET_QUESTIONS,
    description: "A full 60-question UGC NET Paper 1-pattern practice test covering Teaching Aptitude, Research Aptitude, Reasoning, Data Interpretation, ICT, and Higher Education System." },
  { id: "premium_csirnet_1", title: "CSIR NET Complete Practice Test — General Science, Research Methodology & Aptitude", category: "CSIR NET", questions: CSIRNET_QUESTIONS,
    description: "A full 60-question CSIR NET-pattern practice test covering General Science Aptitude, Research Methodology, and Quantitative Aptitude — the common component across all CSIR NET science streams." },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set — check your .env file.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "testmandi");
  const tests = db.collection("tests");

  let added = 0, skipped = 0;
  for (const test of TESTS) {
    const exists = await tests.findOne({ id: test.id });
    if (exists) {
      console.log(`Skipping "${test.title}" — already exists.`);
      skipped++;
      continue;
    }
    await tests.insertOne({
      id: test.id, title: test.title, category: test.category, price: 99, duration: 60,
      description: test.description, questions: test.questions,
      sellerEmail: SELLER_EMAIL, sellerName: SELLER_NAME,
      rating: 0, ratingCount: 0, createdAt: Date.now(),
    });
    console.log(`Added "${test.title}" (${test.category}) — ${test.questions.length} questions.`);
    added++;
  }

  console.log(`\nDone — ${added} test(s) added, ${skipped} skipped (already existed).`);
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
