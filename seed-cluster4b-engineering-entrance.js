// Cluster 4b — NATA, BITS AT, VITEEE, SRMJEEE
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster4b-engineering-entrance.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const NATA_QUESTIONS = [
  q("The value of sin30° + cos60° is:", ["0", "0.5", "1", "1.5"], 2, "Mathematics", "sin30° = 0.5, cos60° = 0.5; sum = 1."),
  q("The distance of point (3,4) from origin is:", ["5", "7", "25", "3"], 0, "Mathematics", "Distance = sqrt(3²+4²) = 5."),
  q("Two lines are perpendicular when the product of their slopes is:", ["0", "1", "-1", "Undefined"], 2, "Mathematics", "Perpendicular lines satisfy m1×m2 = -1."),
  q("The area of a triangle with base 10 cm and height 6 cm is:", ["60 cm²", "30 cm²", "16 cm²", "40 cm²"], 1, "Mathematics", "Area = (1/2)×base×height = 30 cm²."),
  q("The volume of a cube with side 4 cm is:", ["16 cm³", "64 cm³", "48 cm³", "12 cm³"], 1, "Mathematics", "Volume = side³ = 64 cm³."),
  q("The circumference of a circle with radius 7 cm (using π=22/7) is:", ["22 cm", "44 cm", "14 cm", "154 cm"], 1, "Mathematics", "Circumference = 2πr = 44 cm."),
  q("If tanθ = 1, θ equals:", ["30°", "45°", "60°", "90°"], 1, "Mathematics", "tan45° = 1."),
  q("The value of the determinant of a 2x2 identity matrix is:", ["0", "1", "2", "-1"], 1, "Mathematics", "Determinant of identity matrix = 1."),
  q("The general equation of a circle is x²+y²+2gx+2fy+c=0. Its centre is:", ["(g,f)", "(-g,-f)", "(2g,2f)", "(-2g,-2f)"], 1, "Mathematics", "Centre of general circle equation is (-g,-f)."),
  q("A regular hexagon has how many lines of symmetry?", ["4", "5", "6", "8"], 2, "Mathematics", "A regular hexagon has 6 lines of symmetry."),
  q("The sum of interior angles of a hexagon is:", ["360°", "540°", "720°", "900°"], 2, "Mathematics", "Sum of interior angles = (n-2)×180° = (6-2)×180° = 720°."),
  q("The value of cos0° is:", ["0", "1", "-1", "Undefined"], 1, "Mathematics", "cos0° = 1 by definition."),
  q("The identity sin²θ + cos²θ equals:", ["0", "1", "2", "tan²θ"], 1, "Mathematics", "This is the fundamental Pythagorean identity."),
  q("The surface area of a sphere of radius r is given by:", ["πr²", "2πr²", "4πr²", "(4/3)πr³"], 2, "Mathematics", "Surface area of a sphere = 4πr²."),
  q("The golden ratio is approximately equal to:", ["1.414", "1.618", "3.14", "2.718"], 1, "Mathematics", "The golden ratio (phi) is approximately 1.618, often used in art and architecture."),
  q("A cylinder's volume is given by:", ["πr²h", "2πrh", "πr³", "(1/3)πr²h"], 0, "Mathematics", "Volume of a cylinder = πr²h."),
  q("The slope of a line parallel to the x-axis is:", ["Undefined", "1", "0", "-1"], 2, "Mathematics", "A line parallel to the x-axis has zero slope."),
  q("The perimeter of a rectangle with length 8 cm and breadth 5 cm is:", ["13 cm", "26 cm", "40 cm", "20 cm"], 1, "Mathematics", "Perimeter = 2(l+b) = 2(8+5) = 26 cm."),
  q("If a shape has 3-fold rotational symmetry, rotating it by how many degrees maps it onto itself?", ["90°", "120°", "180°", "270°"], 1, "Mathematics", "360°/3 = 120° for 3-fold symmetry."),
  q("The value of √2 is approximately:", ["1.41", "1.73", "2.24", "1.0"], 0, "Mathematics", "√2 ≈ 1.414."),
  q("Find the odd one out: Circle, Square, Triangle, Sphere", ["Circle", "Square", "Triangle", "Sphere"], 3, "General Aptitude", "Sphere is 3D, the others are 2D shapes."),
  q("If a shape is rotated 90° four times, it returns to its:", ["Mirror image", "Original position", "Inverted position", "Half size"], 1, "General Aptitude", "Four 90° rotations complete a full 360°, returning to the original position."),
  q("Which of the following best represents visual balance in composition?", ["All elements on one side", "Symmetrical or asymmetrical distribution of visual weight", "Random placement", "Only large elements"], 1, "General Aptitude", "Visual balance involves distributing elements to create equilibrium, whether symmetric or asymmetric."),
  q("In a 3D object, an 'isometric view' shows:", ["Only the front face", "All three dimensions at equal angles", "Only a 2D cross-section", "Only the top view"], 1, "General Aptitude", "Isometric projection displays three dimensions of an object at equal angles (typically 120° apart)."),
  q("A floor plan is an example of which type of view?", ["Elevation view", "Plan (top-down) view", "Perspective view", "Isometric view"], 1, "General Aptitude", "A floor plan represents a top-down (plan) view of a building's layout."),
  q("Which of these best describes 'proportion' in design?", ["The color scheme used", "The relative size relationship between elements", "The material used", "The location of a building"], 1, "General Aptitude", "Proportion refers to the size relationships between different elements in a design."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "General Aptitude", "Differences are 4,6,8,10 — next term: 30."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "General Aptitude", "Shift +1: EPH."),
  q("Which of the following is an example of bilateral symmetry?", ["A regular pentagon", "The human face", "A random cloud shape", "A scalene triangle"], 1, "General Aptitude", "The human face shows approximate bilateral (left-right mirror) symmetry."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "General Aptitude", "Skipping one letter each time: next is I."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "General Aptitude", "C is the shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "General Aptitude", "Perfect squares: next is 25."),
  q("Which of the following best describes 'texture' in visual design?", ["The color palette", "The surface quality or feel of a material", "The overall size", "The price of materials"], 1, "General Aptitude", "Texture refers to the surface quality, whether visual or tactile, of a material or design."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "General Aptitude", "Each term ×3: next is 243."),
  q("Which term describes the empty or open space in a design composition?", ["Positive space", "Negative space", "Focal space", "Balanced space"], 1, "General Aptitude", "Negative space refers to the empty areas around and between design elements."),
  q("Who designed the Sydney Opera House?", ["Frank Lloyd Wright", "Jørn Utzon", "Le Corbusier", "Zaha Hadid"], 1, "Architecture Awareness", "Danish architect Jørn Utzon designed the Sydney Opera House."),
  q("Which architectural style is the Taj Mahal an example of?", ["Gothic", "Mughal architecture", "Baroque", "Modernist"], 1, "Architecture Awareness", "The Taj Mahal is a masterpiece of Mughal architecture, blending Persian, Islamic, and Indian styles."),
  q("Le Corbusier is well known as a pioneer of which architectural movement?", ["Gothic Revival", "Modernist architecture", "Baroque", "Art Nouveau"], 1, "Architecture Awareness", "Le Corbusier was a leading pioneer of Modernist architecture in the 20th century."),
  q("Which material is most commonly associated with ancient Roman architecture?", ["Steel", "Concrete", "Glass", "Bamboo"], 1, "Architecture Awareness", "The Romans pioneered widespread use of concrete in construction, notably in structures like the Pantheon."),
  q("The Burj Khalifa, the world's tallest building, is located in:", ["Doha", "Dubai", "Abu Dhabi", "Riyadh"], 1, "Architecture Awareness", "The Burj Khalifa is located in Dubai, UAE."),
  q("Which Indian architect designed Chandigarh's city plan along with Le Corbusier?", ["Charles Correa", "Pierre Jeanneret", "B.V. Doshi", "Both Pierre Jeanneret and B.V. Doshi contributed", "Raj Rewal"], 3, "Architecture Awareness", "Chandigarh's plan involved Le Corbusier along with collaborators including Pierre Jeanneret and later contributions by figures like B.V. Doshi."),
  q("The Pantheon in Rome is famous for its:", ["Gothic spires", "Large unreinforced concrete dome", "Steel frame construction", "Glass curtain walls"], 1, "Architecture Awareness", "The Pantheon features a massive unreinforced concrete dome, an engineering marvel of its time."),
  q("Which style is characterized by pointed arches, ribbed vaults, and flying buttresses?", ["Romanesque", "Gothic", "Baroque", "Renaissance"], 1, "Architecture Awareness", "Gothic architecture is known for pointed arches, ribbed vaults, and flying buttresses."),
  q("Frank Lloyd Wright is known for designing which famous house that integrates with a waterfall?", ["Villa Savoye", "Fallingwater", "Farnsworth House", "Robie House"], 1, "Architecture Awareness", "Fallingwater, designed by Frank Lloyd Wright, is built directly over a waterfall."),
  q("Which Indian architect is known for pioneering sustainable and low-cost architecture, winning the Pritzker Prize?", ["Charles Correa", "B.V. Doshi", "Raj Rewal", "Hafeez Contractor"], 1, "Architecture Awareness", "B.V. Doshi became the first Indian architect to win the Pritzker Prize, in 2018."),
  q("The Eiffel Tower, an iconic wrought-iron structure, is located in:", ["London", "Paris", "Rome", "Berlin"], 1, "Architecture Awareness", "The Eiffel Tower is located in Paris, France."),
  q("Which ancient wonder is known for its massive stone pyramids?", ["Great Wall of China", "Pyramids of Giza", "Colosseum", "Machu Picchu"], 1, "Architecture Awareness", "The Pyramids of Giza in Egypt are among the most famous ancient stone structures."),
  q("Which term refers to the study of how buildings interact with their surrounding environment?", ["Ergonomics", "Contextual architecture", "Structural engineering", "Urban sprawl"], 1, "Architecture Awareness", "Contextual architecture considers how a building relates to and fits within its surrounding environment."),
  q("Antoni Gaudí is famous for his unique architectural style seen in which city?", ["Madrid", "Barcelona", "Seville", "Valencia"], 1, "Architecture Awareness", "Antoni Gaudí's distinctive works, including the Sagrada Família, are located in Barcelona."),
  q("Which term describes a building's ability to support its own structural loads efficiently?", ["Aesthetics", "Structural integrity", "Ventilation", "Insulation"], 1, "Architecture Awareness", "Structural integrity refers to a building's capacity to safely bear and transfer loads."),
  q("The term 'cantilever' in architecture refers to:", ["A structure supported at both ends", "A structure that projects horizontally, supported at only one end", "An underground structure", "A curved roof"], 1, "Architecture Awareness", "A cantilever is a rigid structural element extending horizontally, supported only at one end."),
  q("Which famous architect designed the Guggenheim Museum in Bilbao?", ["Frank Gehry", "I.M. Pei", "Renzo Piano", "Norman Foster"], 0, "Architecture Awareness", "Frank Gehry designed the Guggenheim Museum Bilbao, known for its deconstructivist style."),
  q("Vastu Shastra is a traditional Indian system related to:", ["Music composition", "Architecture and spatial design", "Textile weaving", "Culinary arts"], 1, "Architecture Awareness", "Vastu Shastra is an ancient Indian architectural science dealing with design, layout, and spatial arrangement."),
  q("Which material became especially important with the advent of skyscraper construction?", ["Wood", "Steel", "Thatch", "Mud brick"], 1, "Architecture Awareness", "Steel-frame construction enabled the development of tall skyscrapers."),
  q("I.M. Pei is well known for designing which famous glass pyramid structure?", ["Louvre Pyramid, Paris", "Pyramid of Giza", "Luxor Hotel Pyramid", "Bent Pyramid"], 0, "Architecture Awareness", "I.M. Pei designed the glass pyramid entrance of the Louvre Museum in Paris."),
  q("The term 'facade' in architecture refers to:", ["The roof structure", "The building's foundation", "The exterior front face of a building", "The interior layout"], 2, "Architecture Awareness", "A facade is the exterior front face of a building."),
  q("Which Indian monument is an example of Indo-Islamic architecture combined with a fort complex?", ["Red Fort, Delhi", "Konark Sun Temple", "Meenakshi Temple", "Hampi Ruins"], 0, "Architecture Awareness", "The Red Fort in Delhi is a notable example of Indo-Islamic Mughal architecture."),
  q("Zaha Hadid was known for pioneering which architectural style?", ["Classical revival", "Deconstructivism / fluid parametric forms", "Colonial architecture", "Brutalism"], 1, "Architecture Awareness", "Zaha Hadid was renowned for her fluid, deconstructivist architectural designs."),
  q("The term 'elevation' in architectural drawing refers to:", ["A top-down view", "A vertical, side-on view of a building", "A 3D perspective sketch", "A site plan"], 1, "General Aptitude", "An elevation drawing shows a building's vertical face from a particular side."),
  q("Which of the following best describes 'scale' in a technical drawing?", ["The color scheme used", "The ratio between drawn size and actual size", "The type of paper used", "The artist's signature"], 1, "General Aptitude", "Scale represents the proportional ratio between a drawing's dimensions and the real object's dimensions."),
];

const BITSAT_QUESTIONS = [
  q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Physics", "Uniform velocity implies zero acceleration."),
  q("The SI unit of electric resistance is:", ["Ampere", "Volt", "Ohm", "Watt"], 2, "Physics", "Resistance is measured in ohms."),
  q("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "3.0 km/s", "9.8 km/s"], 1, "Physics", "Earth's escape velocity is about 11.2 km/s."),
  q("The unit of power is:", ["Joule", "Newton", "Watt", "Pascal"], 2, "Physics", "Power is measured in watts."),
  q("A convex lens always forms a real image when the object is placed:", ["Within the focal length", "At the focus", "Beyond the focal length", "At infinity only"], 2, "Physics", "A convex lens forms a real image for objects placed beyond its focal length."),
  q("The frequency of a wave is inversely proportional to its:", ["Amplitude", "Wavelength", "Speed", "Period"], 3, "Physics", "f = 1/T."),
  q("Newton's third law implies action-reaction pairs act on:", ["The same body", "Different bodies", "Only rigid bodies", "Only at contact"], 1, "Physics", "Action and reaction act on two different bodies."),
  q("The dimensional formula for force is:", ["MLT⁻¹", "MLT⁻²", "ML²T⁻²", "ML⁻¹T⁻²"], 1, "Physics", "Force = mass × acceleration = MLT⁻²."),
  q("The SI unit of magnetic flux is:", ["Tesla", "Weber", "Henry", "Gauss"], 1, "Physics", "Magnetic flux is measured in webers."),
  q("A body in free fall experiences acceleration due to:", ["Air resistance", "Gravity", "Friction", "Normal force"], 1, "Physics", "In free fall, gravity is the sole force causing acceleration."),
  q("The atomic number of an element represents the number of:", ["Neutrons", "Protons", "Electrons only in ions", "Protons + neutrons"], 1, "Chemistry", "Atomic number equals the number of protons."),
  q("The pH of a neutral solution at 25°C is:", ["0", "7", "14", "1"], 1, "Chemistry", "Neutral pH is 7 at 25°C."),
  q("Isotopes of an element differ in the number of:", ["Protons", "Electrons", "Neutrons", "Valence electrons"], 2, "Chemistry", "Isotopes differ in neutron count."),
  q("Which type of bond involves the sharing of electron pairs?", ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], 1, "Chemistry", "Covalent bonds form via shared electron pairs."),
  q("The hybridization of carbon in methane (CH4) is:", ["sp", "sp2", "sp3", "sp3d"], 2, "Chemistry", "Carbon in methane is sp3 hybridized."),
  q("The distance of point (3,4) from origin is:", ["5", "7", "25", "3"], 0, "Mathematics", "Distance = sqrt(3²+4²) = 5."),
  q("The derivative of sin(x) with respect to x is:", ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], 0, "Mathematics", "Standard derivative of sin(x) is cos(x)."),
  q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "Mathematics", "Standard integral of 1/x is ln|x| + C."),
  q("The modulus of a complex number z = a + bi is:", ["a + b", "sqrt(a² + b²)", "a² + b²", "a - b"], 1, "Mathematics", "Modulus = sqrt(a² + b²)."),
  q("If A and B are independent events, P(A ∩ B) equals:", ["P(A) + P(B)", "P(A) - P(B)", "P(A) × P(B)", "P(A) / P(B)"], 2, "Mathematics", "Independent events: joint probability = product."),
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "English", "'Abundant' means plentiful."),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "English", "Antonym of 'ancient' is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "English", "Correct spelling: 'receive.'"),
  q("Choose the correct passive voice: 'She writes a letter.'", ["A letter is written by her.", "A letter was written by her.", "A letter written by her.", "A letter is writing by her."], 0, "English", "Present passive: 'is written.'"),
  q("Choose the correct plural form of 'Child':", ["Childs", "Childes", "Children", "Childrens"], 2, "English", "Correct plural: 'children.'"),
  q("Choose the correct preposition: She is good ___ mathematics.", ["in", "at", "on", "with"], 1, "English", "'Good at' is correct."),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "English", "Correct: 'doesn't like.'"),
  q("Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "English", "'Joyful' is synonym of 'happy.'"),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Logical Reasoning", "Shift +1: EPH."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Logical Reasoning", "Next term: 30."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Logical Reasoning", "Potato is a vegetable."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Logical Reasoning", "Next letter: I."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Logical Reasoning", "Next term: 243."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Logical Reasoning", "C is shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Logical Reasoning", "Next perfect square: 25."),
  q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "Physics", "Mars is known as the Red Planet."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], 1, "Chemistry", "Mitochondria generate ATP for the cell."),
  q("Which of the following is a strong acid?", ["Acetic acid", "Citric acid", "Hydrochloric acid", "Carbonic acid"], 2, "Chemistry", "HCl fully dissociates, making it a strong acid."),
  q("The value of log(1) in any base is:", ["1", "0", "Undefined", "-1"], 1, "Mathematics", "log(1) = 0 in any base."),
  q("A convex mirror always produces a:", ["Real, inverted image", "Virtual, erect, diminished image", "Real, magnified image", "Virtual, inverted image"], 1, "Physics", "Convex mirrors always form virtual, erect, and smaller images."),
  q("The molar mass of water (H2O) is approximately:", ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"], 1, "Chemistry", "Water's molar mass is 2(1)+16 = 18 g/mol."),
  q("If a matrix A is singular, its determinant is:", ["1", "Non-zero", "0", "Negative"], 2, "Mathematics", "Singular matrix has determinant 0."),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "English", "Antonym of 'generous' is 'stingy.'"),
  q("Find the missing letter: B, D, F, H, ?", ["I", "J", "K", "L"], 1, "Logical Reasoning", "Next letter: J."),
  q("Which number should replace the question mark: 7, 14, 28, 56, ?", ["84", "112", "98", "70"], 1, "Logical Reasoning", "Next term: 112."),
  q("Newton's first law of motion is also known as the law of:", ["Momentum", "Inertia", "Action-reaction", "Gravitation"], 1, "Physics", "Newton's first law describes inertia."),
  q("Which of the following is an aromatic compound?", ["Methane", "Ethanol", "Benzene", "Propane"], 2, "Chemistry", "Benzene is the classic aromatic compound."),
  q("The number of ways to arrange 5 distinct objects in a row is:", ["25", "60", "120", "20"], 2, "Mathematics", "5! = 120."),
  q("Choose the correct synonym of 'Diligent':", ["Lazy", "Hardworking", "Careless", "Slow"], 1, "English", "'Diligent' means hardworking."),
  q("A sum doubles itself in 8 years at simple interest. The rate is:", ["10%", "12.5%", "8%", "15%"], 1, "Mathematics", "Rate = 100/8 = 12.5%."),
  q("The value of (a+b)² expands to:", ["a² + b²", "a² + 2ab + b²", "a² - 2ab + b²", "2a + 2b"], 1, "Mathematics", "Standard identity for square of a sum."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Mathematics", "12×12=144."),
  q("Sound cannot travel through:", ["Solids", "Liquids", "Gases", "Vacuum"], 3, "Physics", "Sound requires a medium and cannot travel through vacuum."),
  q("Which acid is present in the human stomach?", ["Sulfuric acid", "Hydrochloric acid", "Nitric acid", "Acetic acid"], 1, "Chemistry", "The stomach secretes hydrochloric acid."),
  q("If Monday falls on the 1st of a month, what day falls on the 15th?", ["Monday", "Tuesday", "Sunday", "Wednesday"], 0, "Logical Reasoning", "15th is also Monday."),
  q("If all Roses are Flowers and all Flowers are Plants, then all Roses are:", ["Plants", "Trees", "Shrubs", "Weeds"], 0, "Logical Reasoning", "Roses are Plants."),
  q("Choose the correct meaning of the idiom 'Once in a blue moon':", ["Very frequently", "Rarely", "Every night", "Regularly"], 1, "English", "Means something happening very rarely."),
  q("The value of cos0° is:", ["0", "1", "-1", "Undefined"], 1, "Mathematics", "cos0° = 1."),
  q("Which of the following is a good conductor of heat?", ["Wood", "Plastic", "Metal", "Rubber"], 2, "Physics", "Metals conduct heat efficiently."),
  q("The value of tan(45°) is:", ["0", "0.5", "1", "Undefined"], 2, "Mathematics", "tan(45°) = 1."),
];

const VITEEE_QUESTIONS = [
  q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Physics", "Uniform velocity implies zero acceleration."),
  q("The phenomenon of light bending around obstacles is called:", ["Reflection", "Refraction", "Diffraction", "Dispersion"], 2, "Physics", "Diffraction is the bending of light around obstacles."),
  q("The unit of power is:", ["Joule", "Newton", "Watt", "Pascal"], 2, "Physics", "Power is measured in watts."),
  q("The frequency of a wave is inversely proportional to its:", ["Amplitude", "Wavelength", "Speed", "Period"], 3, "Physics", "f = 1/T."),
  q("A convex lens always forms a real image when the object is placed:", ["Within the focal length", "At the focus", "Beyond the focal length", "At infinity only"], 2, "Physics", "A convex lens forms a real image for objects beyond its focal length."),
  q("The dimensional formula for force is:", ["MLT⁻¹", "MLT⁻²", "ML²T⁻²", "ML⁻¹T⁻²"], 1, "Physics", "Force = mass × acceleration = MLT⁻²."),
  q("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "3.0 km/s", "9.8 km/s"], 1, "Physics", "Earth's escape velocity is about 11.2 km/s."),
  q("Which law states that the total momentum of an isolated system remains constant?", ["Newton's first law", "Law of conservation of momentum", "Law of conservation of energy", "Newton's third law"], 1, "Physics", "Momentum is conserved in isolated systems."),
  q("A body in free fall experiences acceleration due to:", ["Air resistance", "Gravity", "Friction", "Normal force"], 1, "Physics", "Gravity causes acceleration in free fall."),
  q("The SI unit of magnetic flux is:", ["Tesla", "Weber", "Henry", "Gauss"], 1, "Physics", "Magnetic flux is measured in webers."),
  q("The atomic number of an element represents the number of:", ["Neutrons", "Protons", "Electrons only in ions", "Protons + neutrons"], 1, "Chemistry", "Atomic number equals proton count."),
  q("Which of the following is a strong acid?", ["Acetic acid", "Citric acid", "Hydrochloric acid", "Carbonic acid"], 2, "Chemistry", "HCl is a strong acid."),
  q("The functional group -OH represents a(n):", ["Aldehyde", "Alcohol", "Ketone", "Carboxylic acid"], 1, "Chemistry", "-OH is the hydroxyl group of alcohols."),
  q("Isotopes of an element differ in the number of:", ["Protons", "Electrons", "Neutrons", "Valence electrons"], 2, "Chemistry", "Isotopes differ in neutron count."),
  q("The hybridization of carbon in methane (CH4) is:", ["sp", "sp2", "sp3", "sp3d"], 2, "Chemistry", "Carbon in methane is sp3 hybridized."),
  q("The distance of point (3,4) from origin is:", ["5", "7", "25", "3"], 0, "Mathematics", "Distance = sqrt(3²+4²) = 5."),
  q("The general equation of a circle is x²+y²+2gx+2fy+c=0. Its centre is:", ["(g,f)", "(-g,-f)", "(2g,2f)", "(-2g,-2f)"], 1, "Mathematics", "Centre = (-g,-f)."),
  q("Eccentricity of a parabola is:", ["0", "1", "Between 0 and 1", "Greater than 1"], 1, "Mathematics", "A parabola always has eccentricity 1."),
  q("The derivative of sin(x) with respect to x is:", ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], 0, "Mathematics", "Derivative of sin(x) is cos(x)."),
  q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "Mathematics", "Integral of 1/x is ln|x| + C."),
  q("Choose the word most nearly OPPOSITE in meaning to 'Frugal':", ["Thrifty", "Extravagant", "Economical", "Prudent"], 1, "English", "Opposite of 'frugal' is 'extravagant.'"),
  q("Choose the word most nearly SIMILAR in meaning to 'Eloquent':", ["Silent", "Articulate", "Confused", "Shy"], 1, "English", "Similar to 'eloquent' is 'articulate.'"),
  q("Choose the correctly spelled word:", ["Accomodate", "Acommodate", "Accommodate", "Acomodate"], 2, "English", "Correct spelling: 'accommodate.'"),
  q("Choose the correct synonym of 'Ambiguous':", ["Clear", "Vague", "Certain", "Precise"], 1, "English", "'Ambiguous' means unclear, similar to 'vague.'"),
  q("Identify the grammatically correct sentence:", ["Each of the students have submitted their assignment.", "Each of the students has submitted their assignment.", "Each of the students have submitted his assignment.", "Each of the student has submitted assignment."], 1, "English", "'Each' takes singular verb 'has.'"),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Aptitude", "Speed = 10 m/s."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Aptitude", "Average = 30."),
  q("If x:y = 2:3 and y:z = 4:5, then x:y:z is:", ["8:12:15", "2:3:5", "4:6:5", "8:6:15"], 0, "Aptitude", "Combined ratio: 8:12:15."),
  q("A can complete a work in 10 days and B in 15 days. Together they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Aptitude", "Together: 6 days."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Aptitude", "Shift +1: EPH."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Aptitude", "Next term: 30."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Aptitude", "Potato is a vegetable."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Aptitude", "Next letter: I."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Aptitude", "Next term: 243."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Aptitude", "C is shortest."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], 1, "Physics", "Mitochondria generate ATP for the cell."),
  q("The molar mass of water (H2O) is approximately:", ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"], 1, "Chemistry", "Water's molar mass is 18 g/mol."),
  q("Which of these is a noble gas?", ["Oxygen", "Nitrogen", "Argon", "Hydrogen"], 2, "Chemistry", "Argon is a noble gas."),
  q("The value of log(1) in any base is:", ["1", "0", "Undefined", "-1"], 1, "Mathematics", "log(1) = 0 in any base."),
  q("If a matrix A is singular, its determinant is:", ["1", "Non-zero", "0", "Negative"], 2, "Mathematics", "Singular matrix has determinant 0."),
  q("Which mirror is used as a rear-view mirror in vehicles?", ["Concave", "Convex", "Plane", "Cylindrical"], 1, "Physics", "Convex mirrors give a wider field of view."),
  q("The rate of a chemical reaction generally increases with:", ["Decreasing temperature", "Increasing temperature", "Decreasing concentration", "Removing the catalyst"], 1, "Chemistry", "Higher temperature speeds up reactions."),
  q("If A and B are independent events, P(A ∩ B) equals:", ["P(A) + P(B)", "P(A) - P(B)", "P(A) × P(B)", "P(A) / P(B)"], 2, "Mathematics", "Independent events: joint probability = product."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Aptitude", "Next perfect square: 25."),
  q("Choose the correct antonym of 'Meticulous':", ["Careful", "Precise", "Careless", "Detailed"], 2, "English", "Antonym of 'meticulous' is 'careless.'"),
  q("The value of sin(90°) is:", ["0", "1", "-1", "0.5"], 1, "Mathematics", "sin(90°) = 1."),
  q("Which quantum number determines the shape of an orbital?", ["Principal", "Azimuthal", "Magnetic", "Spin"], 1, "Chemistry", "The azimuthal quantum number determines orbital shape."),
  q("The number of terms in the binomial expansion of (x+y)^n is:", ["n", "n-1", "n+1", "2n"], 2, "Mathematics", "Binomial expansion has n+1 terms."),
  q("A convex mirror always produces a:", ["Real, inverted image", "Virtual, erect, diminished image", "Real, magnified image", "Virtual, inverted image"], 1, "Physics", "Convex mirrors always form virtual, erect, smaller images."),
  q("Which of the following is a good conductor of electricity?", ["Rubber", "Wood", "Copper", "Glass"], 2, "Physics", "Copper is an excellent conductor."),
  q("The oxidation state of oxygen in most compounds is:", ["+2", "-1", "-2", "0"], 2, "Chemistry", "Oxygen typically has -2 oxidation state."),
  q("Which of the following is an aromatic compound?", ["Methane", "Ethanol", "Benzene", "Propane"], 2, "Chemistry", "Benzene is the classic aromatic compound."),
  q("If the discriminant of a quadratic equation is negative, the roots are:", ["Real and equal", "Real and distinct", "Complex conjugates", "Zero"], 2, "Mathematics", "Negative discriminant gives complex roots."),
  q("The dot product of two perpendicular vectors is:", ["1", "-1", "0", "Equal to their magnitudes"], 2, "Mathematics", "Perpendicular vectors have zero dot product."),
  q("A sum doubles itself in 8 years at simple interest. The rate is:", ["10%", "12.5%", "8%", "15%"], 1, "Aptitude", "Rate = 12.5%."),
  q("The value of (25% of 80) + (10% of 200) is:", ["30", "40", "50", "60"], 1, "Aptitude", "20+20=40."),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "English", "Antonym of 'generous' is 'stingy.'"),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "English", "Correct: 'doesn't like.'"),
  q("Which of the following is a renewable source of energy?", ["Coal", "Petroleum", "Solar energy", "Natural gas"], 2, "Physics", "Solar energy is renewable."),
  q("The number of ways to arrange 4 distinct objects in a row is:", ["12", "16", "24", "20"], 2, "Mathematics", "4! = 24."),
];

const SRMJEEE_QUESTIONS = [
  q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Physics", "Uniform velocity implies zero acceleration."),
  q("The work done by a centripetal force on a body in circular motion is:", ["Positive", "Negative", "Zero", "Depends on radius"], 2, "Physics", "Centripetal force is perpendicular to velocity, so work done is zero."),
  q("Newton's third law implies action-reaction pairs act on:", ["The same body", "Different bodies", "Only rigid bodies", "Only at contact"], 1, "Physics", "Action and reaction act on different bodies."),
  q("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "3.0 km/s", "9.8 km/s"], 1, "Physics", "Earth's escape velocity is about 11.2 km/s."),
  q("According to Ohm's law, if resistance is doubled while current is constant, voltage:", ["Doubles", "Halves", "Stays the same", "Becomes zero"], 0, "Physics", "V is proportional to R at constant I."),
  q("The phenomenon of light bending around obstacles is called:", ["Reflection", "Refraction", "Diffraction", "Dispersion"], 2, "Physics", "Diffraction is bending of light around obstacles."),
  q("Which law states the total momentum of an isolated system remains constant?", ["Newton's first law", "Law of conservation of momentum", "Law of conservation of energy", "Newton's third law"], 1, "Physics", "Momentum is conserved in isolated systems."),
  q("The SI unit of magnetic flux is:", ["Tesla", "Weber", "Henry", "Gauss"], 1, "Physics", "Magnetic flux is measured in webers."),
  q("The energy stored in a stretched spring is called:", ["Kinetic energy", "Potential energy", "Thermal energy", "Chemical energy"], 1, "Physics", "A stretched spring stores elastic potential energy."),
  q("A convex lens always forms a real image when the object is placed:", ["Within the focal length", "At the focus", "Beyond the focal length", "At infinity only"], 2, "Physics", "A convex lens forms a real image beyond its focal length."),
  q("The frequency of a wave is inversely proportional to its:", ["Amplitude", "Wavelength", "Speed", "Period"], 3, "Physics", "f = 1/T."),
  q("A body in free fall experiences acceleration due to:", ["Air resistance", "Gravity", "Friction", "Normal force"], 1, "Physics", "Gravity causes free-fall acceleration."),
  q("The dimensional formula for force is:", ["MLT⁻¹", "MLT⁻²", "ML²T⁻²", "ML⁻¹T⁻²"], 1, "Physics", "Force = MLT⁻²."),
  q("The unit of power is:", ["Joule", "Newton", "Watt", "Pascal"], 2, "Physics", "Power is measured in watts."),
  q("Which of the following is a vector quantity?", ["Mass", "Speed", "Displacement", "Energy"], 2, "Physics", "Displacement is a vector."),
  q("The de Broglie wavelength of a particle is inversely proportional to its:", ["Charge", "Momentum", "Mass only", "Energy only"], 1, "Physics", "λ = h/p, inversely proportional to momentum."),
  q("The photoelectric effect demonstrates that light behaves as:", ["Only a wave", "Only a particle", "Both wave and particle (quantized)", "Neither"], 2, "Physics", "The photoelectric effect shows light's particle nature."),
  q("Which of these is a good conductor of electricity?", ["Rubber", "Wood", "Copper", "Glass"], 2, "Physics", "Copper is an excellent conductor."),
  q("The atomic number of an element represents the number of:", ["Neutrons", "Protons", "Electrons only in ions", "Protons + neutrons"], 1, "Chemistry", "Atomic number equals proton count."),
  q("Which of the following is a strong acid?", ["Acetic acid", "Citric acid", "Hydrochloric acid", "Carbonic acid"], 2, "Chemistry", "HCl is a strong acid."),
  q("The functional group -OH represents a(n):", ["Aldehyde", "Alcohol", "Ketone", "Carboxylic acid"], 1, "Chemistry", "-OH is the hydroxyl group."),
  q("Isotopes of an element differ in the number of:", ["Protons", "Electrons", "Neutrons", "Valence electrons"], 2, "Chemistry", "Isotopes differ in neutron count."),
  q("Which type of bond involves the sharing of electron pairs?", ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], 1, "Chemistry", "Covalent bonds share electron pairs."),
  q("The oxidation state of oxygen in most compounds is:", ["+2", "-1", "-2", "0"], 2, "Chemistry", "Oxygen typically has -2 oxidation state."),
  q("Which of the following elements is a metalloid?", ["Sodium", "Silicon", "Chlorine", "Calcium"], 1, "Chemistry", "Silicon is a metalloid."),
  q("The rate of a chemical reaction generally increases with:", ["Decreasing temperature", "Increasing temperature", "Decreasing concentration", "Removing the catalyst"], 1, "Chemistry", "Higher temperature speeds up reactions."),
  q("Which quantum number determines the shape of an orbital?", ["Principal", "Azimuthal", "Magnetic", "Spin"], 1, "Chemistry", "Azimuthal quantum number determines orbital shape."),
  q("Le Chatelier's principle predicts the effect of a disturbance on:", ["Reaction rate", "Chemical equilibrium", "Molecular mass", "Bond length"], 1, "Chemistry", "Le Chatelier's principle describes equilibrium shifts."),
  q("The hybridization of carbon in methane (CH4) is:", ["sp", "sp2", "sp3", "sp3d"], 2, "Chemistry", "Carbon in methane is sp3 hybridized."),
  q("The molar mass of water (H2O) is approximately:", ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"], 1, "Chemistry", "Water's molar mass is 18 g/mol."),
  q("The distance of point (3,4) from origin is:", ["5", "7", "25", "3"], 0, "Mathematics", "Distance = sqrt(3²+4²) = 5."),
  q("The general equation of a circle is x²+y²+2gx+2fy+c=0. Its centre is:", ["(g,f)", "(-g,-f)", "(2g,2f)", "(-2g,-2f)"], 1, "Mathematics", "Centre = (-g,-f)."),
  q("Eccentricity of a parabola is:", ["0", "1", "Between 0 and 1", "Greater than 1"], 1, "Mathematics", "A parabola has eccentricity 1."),
  q("Two lines are perpendicular when the product of their slopes is:", ["0", "1", "-1", "Undefined"], 2, "Mathematics", "Perpendicular lines: m1×m2 = -1."),
  q("The derivative of sin(x) with respect to x is:", ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], 0, "Mathematics", "Derivative of sin(x) is cos(x)."),
  q("The value of the determinant of a 2x2 identity matrix is:", ["0", "1", "2", "-1"], 1, "Mathematics", "Determinant of identity matrix = 1."),
  q("If A and B are independent events, P(A ∩ B) equals:", ["P(A) + P(B)", "P(A) - P(B)", "P(A) × P(B)", "P(A) / P(B)"], 2, "Mathematics", "Independent events: joint probability = product."),
  q("The sum of the first n natural numbers is given by:", ["n(n+1)/2", "n(n-1)/2", "n²", "n(n+1)"], 0, "Mathematics", "Sum formula: n(n+1)/2."),
  q("The number of ways to arrange 5 distinct objects in a row is:", ["25", "60", "120", "20"], 2, "Mathematics", "5! = 120."),
  q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "Mathematics", "Integral of 1/x is ln|x| + C."),
  q("If a matrix A is singular, its determinant is:", ["1", "Non-zero", "0", "Negative"], 2, "Mathematics", "Singular matrix has determinant 0."),
  q("The modulus of a complex number z = a + bi is:", ["a + b", "sqrt(a² + b²)", "a² + b²", "a - b"], 1, "Mathematics", "Modulus = sqrt(a² + b²)."),
  q("The value of sin(90°) is:", ["0", "1", "-1", "0.5"], 1, "Mathematics", "sin(90°) = 1."),
  q("The slope of a line parallel to the x-axis is:", ["Undefined", "1", "0", "-1"], 2, "Mathematics", "Parallel to x-axis has zero slope."),
  q("The number of terms in the binomial expansion of (x+y)^n is:", ["n", "n-1", "n+1", "2n"], 2, "Mathematics", "Binomial expansion has n+1 terms."),
  q("If the discriminant of a quadratic equation is negative, the roots are:", ["Real and equal", "Real and distinct", "Complex conjugates", "Zero"], 2, "Mathematics", "Negative discriminant gives complex roots."),
  q("The dot product of two perpendicular vectors is:", ["1", "-1", "0", "Equal to their magnitudes"], 2, "Mathematics", "Perpendicular vectors have zero dot product."),
  q("The value of log(1) in any base is:", ["1", "0", "Undefined", "-1"], 1, "Mathematics", "log(1) = 0 in any base."),
  q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Physics", "Uniform velocity implies zero acceleration."),
  q("Which of the following is a vector quantity?", ["Mass", "Speed", "Displacement", "Energy"], 2, "Physics", "Displacement is a vector."),
  q("Which of these is a good conductor of electricity?", ["Rubber", "Wood", "Copper", "Glass"], 2, "Physics", "Copper is an excellent conductor."),
  q("Which of the following is used as a catalyst in the Haber process?", ["Platinum", "Iron", "Nickel", "Copper"], 1, "Chemistry", "Iron catalyzes the Haber process."),
  q("A solution with pH less than 7 is:", ["Basic", "Neutral", "Acidic", "Amphoteric"], 2, "Chemistry", "pH below 7 indicates an acidic solution."),
  q("The pH of a neutral solution at 25°C is:", ["0", "7", "14", "1"], 1, "Chemistry", "Neutral pH is 7."),
  q("The number of ways to arrange 5 distinct objects in a row is:", ["25", "60", "120", "20"], 2, "Mathematics", "5! = 120."),
  q("A convex mirror always produces a:", ["Real, inverted image", "Virtual, erect, diminished image", "Real, magnified image", "Virtual, inverted image"], 1, "Physics", "Convex mirrors form virtual, erect, smaller images."),
  q("Which type of mirror is used in solar cookers?", ["Plane mirror", "Convex mirror", "Concave mirror", "Cylindrical mirror"], 2, "Physics", "Concave mirrors converge light to a focal point."),
  q("Which of the following is an aromatic compound?", ["Methane", "Ethanol", "Benzene", "Propane"], 2, "Chemistry", "Benzene is the classic aromatic compound."),
  q("The value of (a+b)² expands to:", ["a² + b²", "a² + 2ab + b²", "a² - 2ab + b²", "2a + 2b"], 1, "Mathematics", "Standard identity for square of a sum."),
  q("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "3.0 km/s", "9.8 km/s"], 1, "Physics", "Earth's escape velocity is about 11.2 km/s."),
];

const TESTS = [
  { id: "premium_nata_1", title: "NATA Complete Practice Test — Mathematics, Aptitude & Architecture Awareness", category: "NATA", questions: NATA_QUESTIONS,
    description: "A full 60-question NATA-pattern practice test covering Mathematics, General Aptitude, and Architecture & Design Awareness." },
  { id: "premium_bitsat_1", title: "BITSAT Complete Practice Test — Physics, Chemistry, Maths, English & Reasoning", category: "BITS AT", questions: BITSAT_QUESTIONS,
    description: "A full 60-question BITSAT-pattern practice test covering Physics, Chemistry, Mathematics, English, and Logical Reasoning." },
  { id: "premium_viteee_1", title: "VITEEE Complete Practice Test — Physics, Chemistry, Maths, English & Aptitude", category: "VITEEE", questions: VITEEE_QUESTIONS,
    description: "A full 60-question VITEEE-pattern practice test covering Physics, Chemistry, Mathematics, English, and Aptitude." },
  { id: "premium_srmjeee_1", title: "SRMJEEE Complete Practice Test — Physics, Chemistry & Mathematics", category: "SRMJEEE", questions: SRMJEEE_QUESTIONS,
    description: "A full 60-question SRMJEEE-pattern practice test covering Physics, Chemistry, and Mathematics." },
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
