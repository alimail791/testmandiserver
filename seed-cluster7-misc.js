// Cluster 7 — NIFT, ICAR, Olympiad, Other Exams (final cluster)
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster7-misc.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const NIFT_QUESTIONS = [
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quantitative Ability", "Speed = 10 m/s."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quantitative Ability", "SI = Rs.200."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quantitative Ability", "Average = 30."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quantitative Ability", "LCM = 36."),
  q("If 20% of a number is 50, the number is:", ["200", "250", "100", "150"], 1, "Quantitative Ability", "x = 250."),
  q("The value of 15% of 200 is:", ["20", "30", "25", "35"], 1, "Quantitative Ability", "15% of 200 = 30."),
  q("A shopkeeper sells an item for Rs.550 at a profit of 10%. The cost price is:", ["Rs.500", "Rs.495", "Rs.540", "Rs.505"], 0, "Quantitative Ability", "CP = Rs.500."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Quantitative Ability", "12×12=144."),
  q("A can complete a work in 10 days and B in 15 days. Together they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Quantitative Ability", "Together: 6 days."),
  q("The perimeter of a square with side 8 cm is:", ["32 cm", "64 cm", "16 cm", "24 cm"], 0, "Quantitative Ability", "Perimeter = 32 cm."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Quantitative Ability", "x = 50."),
  q("The HCF of 12 and 18 is:", ["2", "6", "36", "4"], 1, "Quantitative Ability", "HCF = 6."),
  q("If the ratio of two numbers is 3:4 and their sum is 63, the numbers are:", ["27 and 36", "21 and 42", "30 and 33", "18 and 45"], 0, "Quantitative Ability", "Numbers: 27, 36."),
  q("A person covers a distance at 40 km/h and returns at 60 km/h. The average speed is:", ["50 km/h", "48 km/h", "45 km/h", "52 km/h"], 1, "Quantitative Ability", "Average speed = 48 km/h."),
  q("A sum doubles itself in 8 years at simple interest. The rate is:", ["10%", "12.5%", "8%", "15%"], 1, "Quantitative Ability", "Rate = 12.5%."),
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "English & Communication", "'Abundant' means plentiful."),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "English & Communication", "Antonym of 'ancient' is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "English & Communication", "Correct spelling: 'receive.'"),
  q("Choose the correct meaning of the idiom 'Once in a blue moon':", ["Very frequently", "Rarely", "Every night", "Regularly"], 1, "English & Communication", "Means something happening very rarely."),
  q("Choose the correct passive voice: 'She writes a letter.'", ["A letter is written by her.", "A letter was written by her.", "A letter written by her.", "A letter is writing by her."], 0, "English & Communication", "Present passive: 'is written.'"),
  q("Choose the correct plural form of 'Child':", ["Childs", "Childes", "Children", "Childrens"], 2, "English & Communication", "Correct plural: 'children.'"),
  q("Choose the correct preposition: She is good ___ mathematics.", ["in", "at", "on", "with"], 1, "English & Communication", "'Good at' is correct."),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "English & Communication", "Correct: 'doesn't like.'"),
  q("Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "English & Communication", "'Joyful' is synonym of 'happy.'"),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "English & Communication", "Antonym of 'generous' is 'stingy.'"),
  q("Which colors are known as primary colors in design and art?", ["Red, Green, Blue", "Red, Yellow, Blue", "Orange, Green, Purple", "Black, White, Grey"], 1, "General Knowledge", "Red, Yellow, and Blue are the traditional primary colors in art/design (pigment-based)."),
  q("The term 'silhouette' in fashion design refers to:", ["A fabric type", "The overall outline/shape of a garment", "A sewing technique", "A color scheme"], 1, "General Knowledge", "Silhouette refers to the overall shape or outline created by a garment."),
  q("Which Indian city is historically known as the textile hub, especially for cotton?", ["Delhi", "Ahmedabad", "Chennai", "Bengaluru"], 1, "General Knowledge", "Ahmedabad has long been known as a major center for the textile industry in India."),
  q("The term 'haute couture' refers to:", ["Mass-produced clothing", "High-end, custom-fitted fashion design", "Casual streetwear", "Industrial textile manufacturing"], 1, "General Knowledge", "Haute couture refers to exclusive, custom-made high fashion design."),
  q("Which fabric is derived from the cocoon of the silkworm?", ["Cotton", "Silk", "Wool", "Linen"], 1, "General Knowledge", "Silk is a natural fiber produced by silkworms."),
  q("Which of the following is a natural fiber?", ["Polyester", "Nylon", "Cotton", "Acrylic"], 2, "General Knowledge", "Cotton is a natural plant-based fiber, unlike synthetic fibers like polyester."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "General Knowledge", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("Which Indian design institute is most renowned for fashion and design education?", ["IIT", "NIFT", "AIIMS", "IIM"], 1, "General Knowledge", "NIFT (National Institute of Fashion Technology) is India's premier fashion and design education institute."),
  q("The color wheel is a tool used primarily to understand relationships between:", ["Fabric types", "Colors", "Stitching patterns", "Sizes"], 1, "General Knowledge", "The color wheel visually represents relationships and harmony between colors."),
  q("Which of the following best describes 'sustainable fashion'?", ["Fast, disposable clothing production", "Environmentally and ethically conscious clothing production", "Only using synthetic fabrics", "Ignoring labor conditions"], 1, "General Knowledge", "Sustainable fashion emphasizes environmentally friendly and ethical production practices."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Analytical & Logical Ability", "Shift +1: EPH."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Analytical & Logical Ability", "Next term: 30."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Analytical & Logical Ability", "Potato is a vegetable."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Analytical & Logical Ability", "Next letter: I."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Analytical & Logical Ability", "Next term: 243."),
  q("Which word does NOT belong: Circle, Square, Triangle, Sphere", ["Circle", "Square", "Triangle", "Sphere"], 3, "Analytical & Logical Ability", "Sphere is 3D."),
  q("If Monday falls on the 1st of a month, what day falls on the 15th?", ["Monday", "Tuesday", "Sunday", "Wednesday"], 0, "Analytical & Logical Ability", "15th is also Monday."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Analytical & Logical Ability", "C is shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Analytical & Logical Ability", "Next perfect square: 25."),
  q("If all Roses are Flowers and all Flowers are Plants, then all Roses are:", ["Plants", "Trees", "Shrubs", "Weeds"], 0, "Analytical & Logical Ability", "Roses are Plants."),
  q("Find the odd pair: (4,16), (5,25), (6,35), (7,49)", ["(4,16)", "(5,25)", "(6,35)", "(7,49)"], 2, "Analytical & Logical Ability", "6²=36, not 35."),
  q("A clock shows 3:00. The angle between hour and minute hands is:", ["45°", "90°", "60°", "75°"], 1, "Analytical & Logical Ability", "Angle = 90°."),
  q("Find the missing letter: B, D, F, H, ?", ["I", "J", "K", "L"], 1, "Analytical & Logical Ability", "Next letter: J."),
  q("Which number should replace the question mark: 7, 14, 28, 56, ?", ["84", "112", "98", "70"], 1, "Analytical & Logical Ability", "Next term: 112."),
  q("If '5 # 3' means 5+3 and '5 @ 3' means 5-3, what is '8 # 2 @ 1'?", ["9", "11", "7", "10"], 0, "Analytical & Logical Ability", "8#2=10, then 10@1=9."),
  q("A pattern of visual elements repeated at regular intervals is called:", ["Contrast", "Rhythm/Pattern", "Balance", "Emphasis"], 1, "Analytical & Logical Ability", "Rhythm in design refers to the repetition of visual elements at regular intervals."),
  q("The principle of 'balance' in design refers to:", ["Random placement of elements", "Even distribution of visual weight", "Using only one color", "Avoiding all symmetry"], 1, "Analytical & Logical Ability", "Balance involves distributing visual weight evenly, whether symmetrically or asymmetrically."),
  q("Which of the following best represents 'contrast' in visual design?", ["Using identical elements throughout", "Using distinctly different elements to create visual interest", "Avoiding any variation", "Using only neutral colors"], 1, "Analytical & Logical Ability", "Contrast creates visual interest through differences in color, size, shape, or texture."),
  q("Complementary colors on the color wheel are:", ["Colors located next to each other", "Colors located opposite each other", "All shades of the same color", "Only black and white"], 1, "General Knowledge", "Complementary colors sit opposite each other on the color wheel, creating strong contrast."),
  q("The term 'texture' in design and fashion refers to:", ["The color of a fabric", "The surface quality or feel of a material", "The price of a fabric", "The country of origin"], 1, "General Knowledge", "Texture refers to the tactile or visual surface quality of a material."),
  q("Which of the following is an example of a warm color?", ["Blue", "Green", "Red", "Purple"], 2, "General Knowledge", "Red is considered a warm color, associated with energy and heat."),
  q("Which of the following is an example of a cool color?", ["Red", "Orange", "Yellow", "Blue"], 3, "General Knowledge", "Blue is considered a cool color, associated with calmness."),
  q("A mood board in design is primarily used to:", ["Store financial records", "Visually communicate a design concept's inspiration and direction", "Track employee attendance", "Manage inventory"], 1, "General Knowledge", "A mood board visually represents ideas, colors, and inspiration guiding a design concept."),
  q("Which of the following is a key consideration in garment pattern-making?", ["Ignoring body measurements", "Accurate body measurements and fit", "Using only one size for all", "Avoiding fabric considerations"], 1, "General Knowledge", "Accurate measurements and fit considerations are essential in garment pattern-making."),
  q("The term 'draping' in fashion design refers to:", ["Ironing fabric flat", "Arranging fabric on a mannequin to create a garment shape", "Cutting fabric with scissors only", "Dyeing fabric a specific color"], 1, "General Knowledge", "Draping involves arranging fabric directly on a mannequin or body form to develop a garment's shape."),
];

const ICAR_QUESTIONS = [
  q("Which nitrogenous base is unique to RNA?", ["Adenine", "Cytosine", "Uracil", "Guanine"], 2, "Biology", "Uracil replaces thymine in RNA."),
  q("Photosynthesis occurs primarily in which cell organelle?", ["Mitochondria", "Ribosome", "Chloroplast", "Golgi body"], 2, "Biology", "Chloroplasts contain chlorophyll and carry out photosynthesis."),
  q("The process of formation of pollen grains is called:", ["Spermatogenesis", "Microsporogenesis", "Megasporogenesis", "Oogenesis"], 1, "Biology", "Microsporogenesis forms pollen grains inside the anther."),
  q("Which plant hormone is primarily responsible for apical dominance?", ["Cytokinin", "Auxin", "Gibberellin", "Ethylene"], 1, "Biology", "Auxin suppresses growth of lateral buds, promoting apical dominance."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic reticulum"], 1, "Biology", "Mitochondria generate ATP through cellular respiration."),
  q("Nitrogen fixation in soil is primarily carried out by:", ["Fungi only", "Nitrogen-fixing bacteria (e.g., Rhizobium)", "Earthworms", "Algae only"], 1, "Biology", "Rhizobium and other nitrogen-fixing bacteria convert atmospheric nitrogen into usable forms for plants."),
  q("Which part of the plant absorbs water and minerals from the soil?", ["Leaf", "Stem", "Root", "Flower"], 2, "Biology", "Roots absorb water and minerals from the soil."),
  q("The Green Revolution in India is most associated with which crop?", ["Rice", "Wheat", "Cotton", "Sugarcane"], 1, "Agriculture GK", "The Green Revolution significantly boosted wheat production in India starting in the 1960s."),
  q("Who is known as the Father of the Green Revolution in India?", ["Verghese Kurien", "M.S. Swaminathan", "Norman Borlaug (globally) / M.S. Swaminathan (India)", "C. Subramaniam"], 2, "Agriculture GK", "M.S. Swaminathan is widely credited as the Father of India's Green Revolution, alongside global pioneer Norman Borlaug."),
  q("Which is the apex body for agricultural research in India?", ["ICAR (Indian Council of Agricultural Research)", "NABARD", "FCI", "APEDA"], 0, "Agriculture GK", "ICAR is the premier body coordinating agricultural research and education in India."),
  q("The 'White Revolution' in India refers to a significant increase in the production of:", ["Rice", "Milk", "Cotton", "Wheat"], 1, "Agriculture GK", "The White Revolution, led by Verghese Kurien, refers to India's massive increase in milk production."),
  q("Who is known as the Father of India's White Revolution?", ["M.S. Swaminathan", "Verghese Kurien", "Norman Borlaug", "C. Subramaniam"], 1, "Agriculture GK", "Verghese Kurien is credited as the Father of India's White Revolution (Operation Flood)."),
  q("Which season is associated with the sowing of Kharif crops in India?", ["Winter", "Summer/Monsoon (June-October)", "Spring only", "Autumn only"], 1, "Agriculture GK", "Kharif crops are sown at the beginning of the monsoon season, roughly June to October."),
  q("Rabi crops in India are typically sown in which season?", ["Monsoon", "Winter (October-March)", "Summer only", "Autumn only"], 1, "Agriculture GK", "Rabi crops are sown in winter and harvested in spring, roughly October to March."),
  q("Which is the largest producer of milk in the world?", ["USA", "India", "China", "Brazil"], 1, "Agriculture GK", "India is the world's largest producer of milk."),
  q("NABARD stands for:", ["National Bank for Agriculture and Rural Development", "National Association for Banking Rural Development", "National Bank for Agricultural Research and Development", "National Authority for Banking Rural Development"], 0, "Agriculture GK", "NABARD is the apex bank for agriculture and rural development in India."),
  q("Which of the following is a leguminous crop that fixes nitrogen in the soil?", ["Wheat", "Rice", "Soybean", "Maize"], 2, "Agriculture GK", "Soybean, a legume, fixes atmospheric nitrogen in the soil through root nodule bacteria."),
  q("Vermicomposting primarily uses which organism to decompose organic waste?", ["Fungi", "Earthworms", "Bacteria only", "Algae"], 1, "Agriculture GK", "Vermicomposting uses earthworms to break down organic waste into nutrient-rich compost."),
  q("Which irrigation method is most water-efficient?", ["Flood irrigation", "Drip irrigation", "Furrow irrigation", "Sprinkler irrigation only"], 1, "Agriculture GK", "Drip irrigation delivers water directly to plant roots, minimizing water waste."),
  q("The pH of a neutral solution at 25°C is:", ["0", "7", "14", "1"], 1, "Chemistry", "A neutral solution has a pH of 7 at 25°C."),
  q("Which of the following is a macronutrient essential for plant growth?", ["Iron", "Nitrogen", "Zinc", "Copper"], 1, "Chemistry", "Nitrogen is a primary macronutrient essential for plant growth."),
  q("Which of the following is a micronutrient for plants?", ["Nitrogen", "Phosphorus", "Zinc", "Potassium"], 2, "Chemistry", "Zinc is a micronutrient, needed in small quantities for plant health."),
  q("The three primary macronutrients for plant growth (NPK) are:", ["Nitrogen, Phosphorus, Potassium", "Nitrogen, Phosphorus, Zinc", "Nitrogen, Potassium, Iron", "Phosphorus, Potassium, Calcium"], 0, "Chemistry", "NPK refers to Nitrogen, Phosphorus, and Potassium, the three primary plant macronutrients."),
  q("Soil with a pH below 7 is considered:", ["Alkaline", "Acidic", "Neutral", "Saline"], 1, "Chemistry", "Soil pH below 7 indicates acidic soil conditions."),
  q("Which of the following is commonly used as an organic fertilizer?", ["Urea", "Farmyard manure (FYM)", "Ammonium nitrate", "Superphosphate"], 1, "Chemistry", "Farmyard manure is a widely used organic fertilizer derived from animal waste."),
  q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Physics", "Uniform velocity implies zero acceleration."),
  q("The SI unit of force is:", ["Joule", "Newton", "Watt", "Pascal"], 1, "Physics", "Force is measured in newtons."),
  q("Which of the following is a renewable source of energy commonly used in agriculture?", ["Coal", "Solar energy", "Petroleum", "Natural gas"], 1, "Physics", "Solar energy is a renewable resource increasingly used in agricultural operations like irrigation pumps."),
  q("Evapotranspiration in agriculture refers to:", ["Only evaporation from soil", "Combined water loss from soil evaporation and plant transpiration", "Only plant water uptake", "Rainfall measurement"], 1, "Physics", "Evapotranspiration combines evaporation from soil/water surfaces and transpiration from plants."),
  q("Which of the following instruments is used to measure rainfall?", ["Barometer", "Rain gauge", "Thermometer", "Hygrometer"], 1, "Physics", "A rain gauge is the standard instrument used to measure rainfall."),
  q("Which of the following is a cereal crop?", ["Soybean", "Wheat", "Groundnut", "Mustard"], 1, "Agriculture GK", "Wheat is a cereal crop, a staple food grain."),
  q("Which of the following is an oilseed crop?", ["Rice", "Wheat", "Mustard", "Maize"], 2, "Agriculture GK", "Mustard is grown primarily as an oilseed crop."),
  q("Crop rotation is practiced primarily to:", ["Deplete soil nutrients faster", "Maintain soil fertility and reduce pest/disease buildup", "Increase water usage", "Reduce crop yield intentionally"], 1, "Agriculture GK", "Crop rotation helps maintain soil fertility and disrupts pest and disease cycles."),
  q("Which of the following is a common method of soil conservation?", ["Deforestation", "Contour ploughing", "Overgrazing", "Excessive tillage"], 1, "Agriculture GK", "Contour ploughing helps reduce soil erosion on sloped land."),
  q("Which Indian state is the largest producer of rice?", ["Punjab", "West Bengal", "Uttar Pradesh", "Bihar"], 1, "Agriculture GK", "West Bengal is traditionally the largest rice-producing state in India."),
  q("Which Indian state is the largest producer of wheat?", ["Punjab", "Uttar Pradesh", "Haryana", "Madhya Pradesh"], 1, "Agriculture GK", "Uttar Pradesh is the largest wheat-producing state in India."),
  q("Which is the primary staple food crop in most of South India?", ["Wheat", "Rice", "Maize", "Barley"], 1, "Agriculture GK", "Rice is the primary staple food crop across most of South India."),
  q("Integrated Pest Management (IPM) primarily aims to:", ["Rely solely on chemical pesticides", "Combine biological, cultural, and minimal chemical methods to control pests", "Eliminate all insects regardless of benefit", "Avoid all pest control"], 1, "Agriculture GK", "IPM combines multiple strategies to manage pests sustainably, minimizing chemical reliance."),
  q("Hybrid seeds are primarily developed to achieve:", ["Lower yield", "Improved yield, disease resistance, or other desirable traits", "Reduced growth rate", "No specific benefit"], 1, "Agriculture GK", "Hybrid seeds are bred to combine desirable traits like higher yield and disease resistance."),
  q("Which of the following is a symptom of nitrogen deficiency in plants?", ["Dark green leaves", "Yellowing of older leaves (chlorosis)", "Excessive root growth", "Purple stems only"], 1, "Agriculture GK", "Nitrogen deficiency commonly causes yellowing (chlorosis) starting in older leaves."),
  q("Which of the following is a key function of phosphorus in plants?", ["Chlorophyll production only", "Root development and energy transfer", "Water absorption only", "Pest resistance only"], 1, "Agriculture GK", "Phosphorus is crucial for root development and energy transfer within the plant."),
  q("Agroforestry refers to:", ["Growing only forest trees", "Integrating trees with crops and/or livestock on the same land", "Complete deforestation for farming", "Urban gardening only"], 1, "Agriculture GK", "Agroforestry combines trees with agricultural crops or livestock for sustainable land use."),
  q("Which of the following is a major pulse crop grown in India?", ["Wheat", "Chickpea (gram)", "Cotton", "Sugarcane"], 1, "Agriculture GK", "Chickpea (gram) is a major pulse crop widely cultivated in India."),
  q("Which of the following describes 'monoculture' in farming?", ["Growing multiple crops together", "Growing a single crop repeatedly on the same land", "Rotating crops each season", "Mixing livestock and crops"], 1, "Agriculture GK", "Monoculture refers to growing a single crop species repeatedly on the same land."),
  q("Which of the following is a biological method of pest control?", ["Chemical pesticides only", "Introducing natural predators of the pest", "Burning the entire field", "Excessive irrigation"], 1, "Agriculture GK", "Biological pest control uses natural predators or parasites to manage pest populations."),
  q("Which gas is released during the process of composting organic waste?", ["Oxygen only", "Carbon dioxide and methane", "Hydrogen only", "Nitrogen only"], 1, "Agriculture GK", "Composting releases gases including carbon dioxide and methane as organic matter decomposes."),
  q("The term 'horticulture' primarily refers to the cultivation of:", ["Only cereal crops", "Fruits, vegetables, flowers, and ornamental plants", "Only livestock", "Only forest trees"], 1, "Agriculture GK", "Horticulture focuses on cultivating fruits, vegetables, flowers, and ornamental plants."),
  q("Which of the following is an example of a plantation crop?", ["Wheat", "Tea", "Rice", "Mustard"], 1, "Agriculture GK", "Tea is a classic plantation crop, grown on large estates."),
  q("Sericulture refers to the rearing of which organism?", ["Bees", "Silkworms", "Fish", "Poultry"], 1, "Agriculture GK", "Sericulture is the practice of rearing silkworms to produce silk."),
  q("Apiculture refers to the rearing of which organism?", ["Silkworms", "Bees", "Fish", "Poultry"], 1, "Agriculture GK", "Apiculture is the practice of beekeeping."),
  q("Pisciculture refers to the rearing of which organism?", ["Bees", "Silkworms", "Fish", "Poultry"], 2, "Agriculture GK", "Pisciculture is the practice of fish farming."),
  q("Which of the following best describes 'organic farming'?", ["Using only synthetic fertilizers and pesticides", "Farming without synthetic chemicals, relying on natural inputs", "Farming exclusively indoors", "Avoiding all soil cultivation"], 1, "Agriculture GK", "Organic farming avoids synthetic chemicals, relying on natural fertilizers and pest control methods."),
  q("Which of the following is an example of a Kharif crop?", ["Wheat", "Rice", "Mustard", "Gram"], 1, "Agriculture GK", "Rice is a classic Kharif crop, sown at the start of the monsoon."),
  q("Which of the following is an example of a Rabi crop?", ["Rice", "Maize", "Wheat", "Cotton"], 2, "Agriculture GK", "Wheat is a classic Rabi crop, sown in winter."),
  q("The main objective of the Food Corporation of India (FCI) is to:", ["Regulate stock markets", "Procure, store, and distribute food grains", "Regulate banking operations", "Manage foreign trade policy"], 1, "Agriculture GK", "FCI procures, stores, and distributes food grains to ensure food security in India."),
  q("Which of the following is used to determine soil texture?", ["Litmus paper", "Soil texture triangle based on sand, silt, clay proportions", "Thermometer", "pH meter alone"], 1, "Agriculture GK", "Soil texture is determined based on proportions of sand, silt, and clay, often visualized in a texture triangle."),
  q("Which of the following best describes 'mulching' in agriculture?", ["Removing all soil cover", "Covering soil surface with material to retain moisture and suppress weeds", "Excessive tilling of soil", "Burning crop residue"], 1, "Agriculture GK", "Mulching involves covering soil to conserve moisture, regulate temperature, and suppress weeds."),
  q("The process of preparing land for sowing by turning and loosening the soil is called:", ["Harvesting", "Ploughing/Tillage", "Irrigation", "Weeding"], 1, "Agriculture GK", "Ploughing (tillage) prepares soil for sowing by turning and loosening it."),
  q("Which of the following is an example of a cash crop?", ["Wheat (for personal consumption)", "Cotton", "Rice (for personal consumption)", "Maize (for personal consumption)"], 1, "Agriculture GK", "Cotton is grown primarily for commercial sale rather than direct consumption, making it a cash crop."),
  q("Which of the following best describes 'shifting cultivation'?", ["Permanent farming on the same land indefinitely", "Clearing land, farming briefly, then moving to new land", "Only greenhouse farming", "Urban rooftop farming"], 1, "Agriculture GK", "Shifting cultivation involves clearing land for temporary farming before moving to new plots."),
];

const OLYMPIAD_QUESTIONS = [
  q("If x + y = 10 and x - y = 4, what is the value of x?", ["3", "5", "7", "9"], 2, "Mathematics", "Adding both equations: 2x=14, so x=7."),
  q("The next number in the sequence 1, 1, 2, 3, 5, 8, ? is:", ["10", "11", "13", "15"], 2, "Mathematics", "This is the Fibonacci sequence; next term = 5+8 = 13."),
  q("What is the sum of the interior angles of a pentagon?", ["360°", "450°", "540°", "720°"], 2, "Mathematics", "Sum = (n-2)×180° = (5-2)×180° = 540°."),
  q("If a number is divisible by both 3 and 4, it must be divisible by:", ["6", "8", "12", "24"], 2, "Mathematics", "A number divisible by both 3 and 4 is divisible by their LCM, which is 12."),
  q("The value of 7! (7 factorial) is:", ["720", "5040", "40320", "120"], 1, "Mathematics", "7! = 7×6×5×4×3×2×1 = 5040."),
  q("If a rectangle's length is doubled and width is halved, its area:", ["Doubles", "Halves", "Remains the same", "Quadruples"], 2, "Mathematics", "New area = (2L)×(W/2) = LW, the same as the original area."),
  q("What is the remainder when 17 is divided by 5?", ["1", "2", "3", "4"], 1, "Mathematics", "17 = 5×3 + 2, so the remainder is 2."),
  q("The sum of the first 10 odd numbers is:", ["50", "100", "90", "110"], 1, "Mathematics", "Sum of first n odd numbers = n²; for n=10, sum = 100."),
  q("If the area of a square is 49 cm², its side length is:", ["6 cm", "7 cm", "8 cm", "9 cm"], 1, "Mathematics", "Side = sqrt(49) = 7 cm."),
  q("A number increased by its half equals 15. The number is:", ["8", "9", "10", "12"], 2, "Mathematics", "x + x/2 = 15, so 1.5x=15, x=10."),
  q("The number of diagonals in a hexagon is:", ["6", "9", "12", "15"], 1, "Mathematics", "Diagonals = n(n-3)/2 = 6×3/2 = 9."),
  q("If 3 apples cost Rs.45, the cost of 7 apples is:", ["Rs.90", "Rs.105", "Rs.120", "Rs.135"], 1, "Mathematics", "Cost per apple = 15; 7 apples = Rs.105."),
  q("What is the smallest prime number?", ["0", "1", "2", "3"], 2, "Mathematics", "2 is the smallest and only even prime number."),
  q("The value of (2^3) × (2^2) is:", ["2^5", "2^6", "4^5", "2^1"], 0, "Mathematics", "Using exponent rules: 2^3 × 2^2 = 2^(3+2) = 2^5 = 32."),
  q("If a clock reads 9:00, the angle between the hour and minute hands is:", ["45°", "60°", "90°", "180°"], 2, "Mathematics", "At 9:00, the hour hand is at 270° and minute hand at 0°/360°, giving a 90° angle."),
  q("Which of the following is a prime number?", ["21", "27", "29", "33"], 2, "Mathematics", "29 is only divisible by 1 and itself, making it prime."),
  q("The value of the square root of 169 is:", ["11", "12", "13", "14"], 2, "Mathematics", "13×13=169."),
  q("If a triangle has sides 3, 4, and 5, it is a:", ["Equilateral triangle", "Right triangle", "Obtuse triangle", "Scalene non-right triangle"], 1, "Mathematics", "3-4-5 satisfies the Pythagorean theorem (9+16=25), making it a right triangle."),
  q("The average of the first 5 natural numbers is:", ["2", "2.5", "3", "3.5"], 2, "Mathematics", "Sum=1+2+3+4+5=15; average=15/5=3."),
  q("If a = 2 and b = 3, the value of a² + b² is:", ["10", "12", "13", "15"], 2, "Mathematics", "a²+b² = 4+9 = 13."),
  q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "Science", "Mars is known as the Red Planet due to iron oxide on its surface."),
  q("The chemical symbol for gold is:", ["Go", "Gd", "Au", "Ag"], 2, "Science", "Gold's chemical symbol, Au, comes from the Latin 'aurum.'"),
  q("Which gas do plants absorb from the atmosphere for photosynthesis?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2, "Science", "Plants absorb carbon dioxide for photosynthesis."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], 1, "Science", "Mitochondria generate ATP for the cell."),
  q("Sound travels fastest through which medium?", ["Air", "Water", "Solids", "Vacuum"], 2, "Science", "Sound travels fastest through solids due to closely packed particles."),
  q("Which of the following is a renewable resource?", ["Coal", "Natural gas", "Solar energy", "Petroleum"], 2, "Science", "Solar energy is continuously replenished, making it renewable."),
  q("The freezing point of water at standard atmospheric pressure is:", ["0°C", "10°C", "100°C", "-10°C"], 0, "Science", "Water freezes at 0°C under standard atmospheric pressure."),
  q("Which organ pumps blood throughout the human body?", ["Lungs", "Heart", "Liver", "Kidney"], 1, "Science", "The heart pumps blood through the circulatory system."),
  q("The Sun is primarily composed of which two elements?", ["Oxygen and Nitrogen", "Hydrogen and Helium", "Carbon and Oxygen", "Iron and Nickel"], 1, "Science", "The Sun is composed mostly of hydrogen and helium."),
  q("Which of the following animals is a mammal?", ["Shark", "Frog", "Dolphin", "Crocodile"], 2, "Science", "Dolphins are mammals, breathing air and nursing their young with milk."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Logical Reasoning", "Shift +1: EPH."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Logical Reasoning", "Next term: 30."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Logical Reasoning", "Potato is a vegetable."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Logical Reasoning", "Next letter: I."),
  q("If all Roses are Flowers and all Flowers are Plants, then all Roses are:", ["Plants", "Trees", "Shrubs", "Weeds"], 0, "Logical Reasoning", "Roses are Plants."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Logical Reasoning", "C is shortest."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Logical Reasoning", "Next term: 243."),
  q("Which word does NOT belong: Circle, Square, Triangle, Sphere", ["Circle", "Square", "Triangle", "Sphere"], 3, "Logical Reasoning", "Sphere is 3D."),
  q("Find the missing letter: B, D, F, H, ?", ["I", "J", "K", "L"], 1, "Logical Reasoning", "Next letter: J."),
  q("If Monday falls on the 1st of a month, what day falls on the 15th?", ["Monday", "Tuesday", "Sunday", "Wednesday"], 0, "Logical Reasoning", "15th is also Monday."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Logical Reasoning", "C is the shortest."),
  q("If '5 # 3' means 5+3 and '5 @ 3' means 5-3, what is '8 # 2 @ 1'?", ["9", "11", "7", "10"], 0, "Logical Reasoning", "8#2=10, then 10@1=9."),
  q("Which number should replace the question mark: 7, 14, 28, 56, ?", ["84", "112", "98", "70"], 1, "Logical Reasoning", "Next term: 112."),
  q("Find the odd pair: (4,16), (5,25), (6,35), (7,49)", ["(4,16)", "(5,25)", "(6,35)", "(7,49)"], 2, "Logical Reasoning", "6²=36, not 35."),
  q("A clock shows 3:00. The angle between hour and minute hands is:", ["45°", "90°", "60°", "75°"], 1, "Logical Reasoning", "The angle is 90°."),
  q("If all judges are lawyers and no lawyer is dishonest, then no judge is:", ["Educated", "Dishonest", "Experienced", "Respected"], 1, "Logical Reasoning", "By transitive logic, no judge is dishonest."),
  q("What is the value of pi (π) rounded to two decimal places?", ["3.14", "3.41", "3.12", "3.16"], 0, "Mathematics", "Pi (π) is approximately 3.14159, rounding to 3.14."),
  q("If a number's digits sum to a multiple of 3, the number itself is divisible by:", ["2", "3", "5", "7"], 1, "Mathematics", "A number is divisible by 3 if the sum of its digits is divisible by 3."),
  q("What is the least common multiple (LCM) of 4, 6, and 8?", ["12", "24", "48", "16"], 1, "Mathematics", "LCM of 4, 6, and 8 is 24."),
  q("If a cube has a volume of 27 cubic cm, its side length is:", ["3 cm", "9 cm", "6 cm", "4.5 cm"], 0, "Mathematics", "Side = cube root of 27 = 3 cm."),
  q("The sum of the angles in any triangle is always:", ["90°", "180°", "270°", "360°"], 1, "Mathematics", "The sum of interior angles of a triangle is always 180°."),
  q("What is 25% of 25% of 400?", ["25", "50", "100", "200"], 0, "Mathematics", "25% of 400 = 100; 25% of 100 = 25."),
  q("Which of the following is a light-year a measure of?", ["Time", "Distance", "Speed", "Mass"], 1, "Science", "A light-year measures distance — how far light travels in one year."),
  q("The process by which plants lose excess water through leaves is called:", ["Photosynthesis", "Transpiration", "Respiration", "Germination"], 1, "Science", "Transpiration is the loss of water vapor from plant surfaces, mainly leaves."),
  q("Which of the following gases is responsible for the greenhouse effect primarily?", ["Nitrogen", "Oxygen", "Carbon dioxide", "Hydrogen"], 2, "Science", "Carbon dioxide is a major greenhouse gas contributing to global warming."),
  q("The center of an atom is called the:", ["Electron cloud", "Nucleus", "Orbital", "Shell"], 1, "Science", "The nucleus is the dense central core of an atom, containing protons and neutrons."),
  q("Which of the following best describes an ecosystem?", ["A single species in isolation", "A community of living organisms interacting with their physical environment", "Only non-living matter", "A single geographic location with no life"], 1, "Science", "An ecosystem includes living organisms interacting with each other and their physical environment."),
  q("Which planet has the most prominent ring system?", ["Mars", "Saturn", "Mercury", "Venus"], 1, "Science", "Saturn is famous for its extensive and prominent ring system."),
  q("The study of the stars and celestial objects is called:", ["Geology", "Astronomy", "Meteorology", "Biology"], 1, "Science", "Astronomy is the scientific study of celestial objects and phenomena."),
  q("Which of the following elements is essential for the formation of bones and teeth?", ["Sodium", "Calcium", "Potassium", "Chlorine"], 1, "Science", "Calcium is essential for the strength and formation of bones and teeth."),
];

const OTHER_QUESTIONS = [
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "General Knowledge", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("The national bird of India is the:", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Knowledge", "The peacock is India's national bird."),
  q("Which is the smallest planet in the solar system?", ["Mars", "Mercury", "Venus", "Earth"], 1, "General Knowledge", "Mercury is the smallest planet."),
  q("The headquarters of the United Nations is located in:", ["Geneva", "New York", "Paris", "London"], 1, "General Knowledge", "The UN headquarters is in New York City."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Knowledge", "Rabindranath Tagore wrote 'Jana Gana Mana.'"),
  q("The currency of Japan is the:", ["Yuan", "Yen", "Won", "Ringgit"], 1, "General Knowledge", "Japan's currency is the Yen."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "General Knowledge", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("The first Prime Minister of India was:", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi", "Rajendra Prasad"], 0, "General Knowledge", "Jawaharlal Nehru was India's first Prime Minister."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "General Knowledge", "The Pacific Ocean is the largest ocean."),
  q("Who invented the telephone?", ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "James Watt"], 1, "General Knowledge", "Alexander Graham Bell invented the telephone."),
  q("The Taj Mahal is located in which Indian city?", ["Delhi", "Agra", "Jaipur", "Lucknow"], 1, "General Knowledge", "The Taj Mahal is located in Agra."),
  q("Which is the highest mountain peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Nanga Parbat"], 2, "General Knowledge", "Mount Everest is the highest peak."),
  q("India's first satellite was named:", ["Chandrayaan", "Aryabhata", "Mangalyaan", "INSAT"], 1, "General Knowledge", "Aryabhata was India's first satellite."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "General Knowledge", "The RBI was established in 1935."),
  q("GST in India was implemented in the year:", ["2015", "2016", "2017", "2019"], 2, "General Knowledge", "GST implemented on 1 July 2017."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = 10 m/s."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = Rs.200."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quant", "Average = 30."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quant", "LCM = 36."),
  q("If 20% of a number is 50, the number is:", ["200", "250", "100", "150"], 1, "Quant", "x = 250."),
  q("The value of 15% of 200 is:", ["20", "30", "25", "35"], 1, "Quant", "15% of 200 = 30."),
  q("A shopkeeper sells an item for Rs.550 at a profit of 10%. The cost price is:", ["Rs.500", "Rs.495", "Rs.540", "Rs.505"], 0, "Quant", "CP = Rs.500."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Quant", "12×12=144."),
  q("A can complete a work in 10 days and B in 15 days. Together they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Quant", "Together: 6 days."),
  q("The perimeter of a square with side 8 cm is:", ["32 cm", "64 cm", "16 cm", "24 cm"], 0, "Quant", "Perimeter = 32 cm."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Quant", "x = 50."),
  q("The HCF of 12 and 18 is:", ["2", "6", "36", "4"], 1, "Quant", "HCF = 6."),
  q("If the ratio of two numbers is 3:4 and their sum is 63, the numbers are:", ["27 and 36", "21 and 42", "30 and 33", "18 and 45"], 0, "Quant", "Numbers: 27, 36."),
  q("A person covers a distance at 40 km/h and returns at 60 km/h. The average speed is:", ["50 km/h", "48 km/h", "45 km/h", "52 km/h"], 1, "Quant", "Average speed = 48 km/h."),
  q("A sum doubles itself in 8 years at simple interest. The rate is:", ["10%", "12.5%", "8%", "15%"], 1, "Quant", "Rate = 12.5%."),
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
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "English", "'Abundant' means plentiful."),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "English", "Antonym of 'ancient' is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "English", "Correct spelling: 'receive.'"),
  q("Fill in the blank: She ___ to the market yesterday.", ["go", "goes", "went", "going"], 2, "English", "Correct: 'went.'"),
  q("Choose the correct passive voice: 'She writes a letter.'", ["A letter is written by her.", "A letter was written by her.", "A letter written by her.", "A letter is writing by her."], 0, "English", "Present passive: 'is written.'"),
  q("Choose the correct plural form of 'Child':", ["Childs", "Childes", "Children", "Childrens"], 2, "English", "Correct plural: 'children.'"),
  q("Choose the correct preposition: She is good ___ mathematics.", ["in", "at", "on", "with"], 1, "English", "'Good at' is correct."),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "English", "Correct: 'doesn't like.'"),
  q("Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "English", "'Joyful' is synonym of 'happy.'"),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "English", "Antonym of 'generous' is 'stingy.'"),
  q("Choose the correct article: ___ university is a place of higher learning.", ["A", "An", "The", "No article needed"], 0, "English", "'University' starts with a consonant sound, taking 'a.'"),
  q("Identify the verb in the sentence: 'They played football yesterday.'", ["They", "played", "football", "yesterday"], 1, "English", "'Played' is the verb."),
  q("Choose the correct antonym of 'Optimistic':", ["Hopeful", "Positive", "Pessimistic", "Confident"], 2, "English", "Antonym of 'optimistic' is 'pessimistic.'"),
  q("The value of √2 is approximately:", ["1.41", "1.73", "2.24", "1.0"], 0, "Quant", "√2 is approximately 1.414."),
  q("Which is the highest gallantry award in India?", ["Ashoka Chakra", "Param Vir Chakra", "Maha Vir Chakra", "Vir Chakra"], 1, "General Knowledge", "The Param Vir Chakra is India's highest military decoration."),
  q("A pattern of visual elements repeated at regular intervals is called:", ["Contrast", "Rhythm/Pattern", "Balance", "Emphasis"], 1, "Reasoning", "Rhythm refers to repeated visual elements at regular intervals."),
];

const TESTS = [
  { id: "premium_nift_1", title: "NIFT Complete Practice Test — Quant, English, GK & Analytical Ability", category: "NIFT", questions: NIFT_QUESTIONS,
    description: "A full 60-question NIFT General Ability Test-pattern practice covering Quantitative Ability, English & Communication, General Knowledge, and Analytical & Logical Ability." },
  { id: "premium_icar_1", title: "ICAR Complete Practice Test — Biology, Agriculture GK, Chemistry & Physics", category: "ICAR", questions: ICAR_QUESTIONS,
    description: "A full 60-question ICAR AIEEA-pattern practice test covering Biology, Agriculture General Knowledge, Chemistry, and Physics." },
  { id: "premium_olympiad_1", title: "Olympiad Complete Practice Test — Mathematics, Science & Logical Reasoning", category: "Olympiad", questions: OLYMPIAD_QUESTIONS,
    description: "A full 60-question Olympiad-style practice test covering Mathematics, Science, and Logical Reasoning at a challenging school level." },
  { id: "premium_other_1", title: "General Competitive Exam Practice Test — GK, Quant, Reasoning & English", category: "Other Exams", questions: OTHER_QUESTIONS,
    description: "A full 60-question general-purpose practice test covering General Knowledge, Quantitative Aptitude, Reasoning, and English — suitable as a broad warm-up for many competitive exams." },
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
