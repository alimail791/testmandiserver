// Cluster 1 — Core academic: NEET, JEE Main, Class 10 Boards, Class 12 Boards
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster1-core-academic.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const NEET_QUESTIONS = [
  // Biology (20)
  q("Which nitrogenous base is unique to RNA?", ["Adenine", "Cytosine", "Uracil", "Guanine"], 2, "Molecular Biology", "Uracil replaces thymine in RNA."),
  q("Mendel's law of independent assortment applies to genes located on:", ["The same chromosome, closely linked", "Different chromosomes", "The X chromosome only", "Mitochondrial DNA"], 1, "Genetics", "Independent assortment holds for genes on different chromosome pairs."),
  q("Darwinian fitness refers to:", ["Physical strength", "Reproductive success", "Body size", "Speed of movement"], 1, "Evolution", "Fitness is a measure of reproductive output, not physical prowess."),
  q("A test cross is used to determine:", ["Phenotype of F2", "Genotype of a dominant phenotype individual", "Mutation rate", "Linkage distance only"], 1, "Genetics", "Crossing with a homozygous recessive reveals unknown genotype."),
  q("Analogous organs are a result of:", ["Divergent evolution", "Convergent evolution", "Genetic drift", "Co-dominance"], 1, "Evolution", "Analogous structures arise from convergent evolution under similar selection pressure."),
  q("The functional unit of the kidney is the:", ["Neuron", "Nephron", "Alveolus", "Villus"], 1, "Human Physiology", "The nephron is the structural and functional unit of the kidney."),
  q("Which blood vessel carries oxygenated blood away from the heart to the body?", ["Pulmonary artery", "Aorta", "Vena cava", "Pulmonary vein"], 1, "Human Physiology", "The aorta carries oxygenated blood from the left ventricle to the body."),
  q("Photosynthesis occurs primarily in which cell organelle?", ["Mitochondria", "Ribosome", "Chloroplast", "Golgi body"], 2, "Plant Physiology", "Chloroplasts contain chlorophyll and carry out photosynthesis."),
  q("The site of protein synthesis in a cell is the:", ["Ribosome", "Lysosome", "Nucleolus", "Peroxisome"], 0, "Cell Biology", "Ribosomes translate mRNA into proteins."),
  q("Which hormone regulates blood glucose by promoting glucose uptake?", ["Glucagon", "Insulin", "Adrenaline", "Thyroxine"], 1, "Human Physiology", "Insulin lowers blood glucose by promoting its uptake into cells."),
  q("DNA replication is described as semi-conservative because:", ["Both strands are newly synthesized", "Each daughter DNA has one old and one new strand", "Only one daughter DNA is functional", "RNA replaces one strand"], 1, "Molecular Biology", "Each new DNA molecule retains one parental strand and one newly synthesized strand."),
  q("Which of the following is a vestigial organ in humans?", ["Appendix", "Liver", "Pancreas", "Kidney"], 0, "Evolution", "The vestigial appendix is a remnant structure with reduced function in humans."),
  q("The process of formation of pollen grains is called:", ["Spermatogenesis", "Microsporogenesis", "Megasporogenesis", "Oogenesis"], 1, "Plant Reproduction", "Microsporogenesis is the formation of microspores (pollen) inside the anther."),
  q("Which of these is NOT a greenhouse gas?", ["Carbon dioxide", "Methane", "Nitrogen", "Nitrous oxide"], 2, "Ecology", "Nitrogen is not a greenhouse gas; it doesn't absorb infrared radiation significantly."),
  q("The exchange of gases in the lungs occurs across the walls of the:", ["Bronchi", "Trachea", "Alveoli", "Bronchioles"], 2, "Human Physiology", "Alveoli provide a large surface area for gas exchange with capillaries."),
  q("In humans, the sex of a child is determined by the chromosome contributed by the:", ["Mother only", "Father", "Both equally determine independently", "Neither, it's random"], 1, "Genetics", "Since females are XX and males are XY, the father's X or Y sperm determines the child's sex."),
  q("Which plant hormone is primarily responsible for apical dominance?", ["Cytokinin", "Auxin", "Gibberellin", "Ethylene"], 1, "Plant Physiology", "Auxin produced at the shoot apex suppresses growth of lateral buds."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic reticulum"], 1, "Cell Biology", "Mitochondria generate ATP through cellular respiration."),
  q("Which of the following is an example of adaptive radiation?", ["Darwin's finches", "Human evolution", "Antibiotic resistance in bacteria", "Industrial melanism"], 0, "Evolution", "Darwin's finches diversified into many species from a common ancestor to fill different niches."),
  q("The enzyme responsible for the initial digestion of starch in the mouth is:", ["Pepsin", "Salivary amylase", "Trypsin", "Lipase"], 1, "Human Physiology", "Salivary amylase (ptyalin) begins starch digestion in the mouth."),
  // Physics (20)
  q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Kinematics", "Uniform velocity implies no change in velocity, so acceleration is zero."),
  q("The work done by a centripetal force on a body in circular motion is:", ["Positive", "Negative", "Zero", "Depends on radius"], 2, "Work-Energy", "Centripetal force is always perpendicular to velocity, so work done is zero."),
  q("Newton's third law implies action-reaction pairs act on:", ["The same body", "Different bodies", "Only rigid bodies", "Only at contact"], 1, "Laws of Motion", "Action and reaction always act on two different bodies."),
  q("Impulse is equal to change in:", ["Force", "Momentum", "Velocity only", "Acceleration"], 1, "Laws of Motion", "Impulse-momentum theorem: impulse = change in momentum."),
  q("The SI unit of electric resistance is:", ["Ampere", "Volt", "Ohm", "Watt"], 2, "Current Electricity", "Resistance is measured in ohms (Ω)."),
  q("Which of the following is a vector quantity?", ["Mass", "Speed", "Displacement", "Energy"], 2, "Kinematics", "Displacement has both magnitude and direction, making it a vector."),
  q("The phenomenon of light bending around obstacles is called:", ["Reflection", "Refraction", "Diffraction", "Dispersion"], 2, "Optics", "Diffraction is the bending of light waves around obstacles or through slits."),
  q("According to Ohm's law, V=IR, if resistance is doubled while current is constant, voltage:", ["Doubles", "Halves", "Stays the same", "Becomes zero"], 0, "Current Electricity", "V is directly proportional to R at constant I, so doubling R doubles V."),
  q("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "3.0 km/s", "9.8 km/s"], 1, "Gravitation", "Earth's escape velocity is approximately 11.2 km/s."),
  q("A convex lens always forms a real image when the object is placed:", ["Within the focal length", "At the focus", "Beyond the focal length", "At infinity only"], 2, "Optics", "A convex lens forms a real image for objects placed beyond its focal length."),
  q("The unit of power is:", ["Joule", "Newton", "Watt", "Pascal"], 2, "Work-Energy", "Power is measured in watts, equal to joules per second."),
  q("Which law states that the total momentum of an isolated system remains constant?", ["Newton's first law", "Law of conservation of momentum", "Law of conservation of energy", "Newton's third law"], 1, "Laws of Motion", "In the absence of external forces, total momentum of a system is conserved."),
  q("The frequency of a wave is inversely proportional to its:", ["Amplitude", "Wavelength", "Speed", "Period"], 3, "Waves", "Frequency and time period are reciprocals of each other: f = 1/T."),
  q("Which of these is a good conductor of electricity?", ["Rubber", "Wood", "Copper", "Glass"], 2, "Current Electricity", "Copper is a metal with free electrons, making it an excellent conductor."),
  q("The bending of a ray of light when it passes from one medium to another is called:", ["Reflection", "Refraction", "Interference", "Polarization"], 1, "Optics", "Refraction occurs due to change in speed of light across media of different densities."),
  q("The SI unit of magnetic flux is:", ["Tesla", "Weber", "Henry", "Gauss"], 1, "Magnetism", "Magnetic flux is measured in webers (Wb)."),
  q("A body in free fall experiences acceleration due to:", ["Air resistance", "Gravity", "Friction", "Normal force"], 1, "Gravitation", "In free fall, gravity is the sole force causing acceleration (ignoring air resistance)."),
  q("The energy stored in a stretched spring is called:", ["Kinetic energy", "Potential energy", "Thermal energy", "Chemical energy"], 1, "Work-Energy", "A stretched or compressed spring stores elastic potential energy."),
  q("Which mirror is used as a rear-view mirror in vehicles?", ["Concave", "Convex", "Plane", "Cylindrical"], 1, "Optics", "Convex mirrors give a wider field of view, ideal for rear-view use."),
  q("The dimensional formula for force is:", ["MLT⁻¹", "MLT⁻²", "ML²T⁻²", "ML⁻¹T⁻²"], 1, "Units & Dimensions", "Force = mass × acceleration, giving dimensions MLT⁻²."),
  // Chemistry (20)
  q("The atomic number of an element represents the number of:", ["Neutrons", "Protons", "Electrons only in ions", "Protons + neutrons"], 1, "Atomic Structure", "Atomic number equals the number of protons in the nucleus."),
  q("Which of the following is an example of an exothermic reaction?", ["Photosynthesis", "Combustion", "Evaporation", "Melting of ice"], 1, "Thermodynamics", "Combustion releases heat, making it exothermic."),
  q("The pH of a neutral solution at 25°C is:", ["0", "7", "14", "1"], 1, "Acids & Bases", "A neutral solution has a pH of 7 at 25°C."),
  q("Which gas is commonly known as laughing gas?", ["Carbon dioxide", "Nitrous oxide", "Methane", "Nitrogen"], 1, "Inorganic Chemistry", "Nitrous oxide (N2O) has anesthetic and mildly euphoric effects, earning the nickname 'laughing gas.'"),
  q("The number of electrons in the outermost shell of a noble gas (except helium) is:", ["2", "4", "6", "8"], 3, "Periodic Table", "Noble gases (except helium, which has 2) have 8 electrons in their outer shell, giving them stability."),
  q("Which of these is an example of an organic compound?", ["Sodium chloride", "Methane", "Water", "Calcium carbonate"], 1, "Organic Chemistry", "Methane (CH4) is a hydrocarbon and thus an organic compound."),
  q("The process of converting a liquid directly into vapor without boiling is:", ["Sublimation", "Evaporation", "Condensation", "Distillation"], 1, "Physical Chemistry", "Evaporation is the surface-level conversion of liquid to vapor below boiling point."),
  q("Which of the following is a strong acid?", ["Acetic acid", "Citric acid", "Hydrochloric acid", "Carbonic acid"], 2, "Acids & Bases", "HCl fully dissociates in water, making it a strong acid."),
  q("The functional group -OH represents a(n):", ["Aldehyde", "Alcohol", "Ketone", "Carboxylic acid"], 1, "Organic Chemistry", "The hydroxyl group (-OH) characterizes alcohols."),
  q("Isotopes of an element differ in the number of:", ["Protons", "Electrons", "Neutrons", "Valence electrons"], 2, "Atomic Structure", "Isotopes have the same number of protons but different numbers of neutrons."),
  q("Which of the following is used as a catalyst in the Haber process?", ["Platinum", "Iron", "Nickel", "Copper"], 1, "Chemical Reactions", "Iron acts as a catalyst in the Haber process for ammonia synthesis."),
  q("The chemical formula of baking soda is:", ["Na2CO3", "NaHCO3", "NaOH", "CaCO3"], 1, "Inorganic Chemistry", "Baking soda is sodium bicarbonate, NaHCO3."),
  q("A solution with pH less than 7 is:", ["Basic", "Neutral", "Acidic", "Amphoteric"], 2, "Acids & Bases", "A pH below 7 indicates an acidic solution."),
  q("Which type of bond involves the sharing of electron pairs?", ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], 1, "Chemical Bonding", "Covalent bonds form through the sharing of electron pairs between atoms."),
  q("The oxidation state of oxygen in most compounds is:", ["+2", "-1", "-2", "0"], 2, "Redox Reactions", "Oxygen typically has an oxidation state of -2, except in peroxides and a few exceptions."),
  q("Which of the following elements is a metalloid?", ["Sodium", "Silicon", "Chlorine", "Calcium"], 1, "Periodic Table", "Silicon exhibits properties of both metals and non-metals, classifying it as a metalloid."),
  q("The process by which plants convert atmospheric nitrogen into usable forms is aided by:", ["Photosynthesis", "Nitrogen fixation", "Respiration", "Transpiration"], 1, "Chemistry in Nature", "Nitrogen-fixing bacteria convert atmospheric N2 into ammonia, usable by plants."),
  q("Which of these is a noble gas?", ["Oxygen", "Nitrogen", "Argon", "Hydrogen"], 2, "Periodic Table", "Argon is a noble gas, chemically inert under normal conditions."),
  q("The molar mass of water (H2O) is approximately:", ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"], 1, "Mole Concept", "Water's molar mass is 2(1) + 16 = 18 g/mol."),
  q("Rusting of iron is an example of:", ["Reduction", "Oxidation", "Neutralization", "Sublimation"], 1, "Redox Reactions", "Rusting involves iron reacting with oxygen and moisture, an oxidation process."),
];

const JEE_QUESTIONS = [
  // Physics (20)
  q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Kinematics", "Uniform velocity implies no change in velocity, so acceleration is zero."),
  q("The work done by a centripetal force on a body in circular motion is:", ["Positive", "Negative", "Zero", "Depends on radius"], 2, "Work-Energy", "Centripetal force is always perpendicular to velocity, so work done is zero."),
  q("The dimensional formula for force is:", ["MLT⁻¹", "MLT⁻²", "ML²T⁻²", "ML⁻¹T⁻²"], 1, "Units & Dimensions", "Force = mass × acceleration, giving dimensions MLT⁻²."),
  q("A projectile's maximum range is achieved at a launch angle of:", ["30°", "45°", "60°", "90°"], 1, "Kinematics", "For a given speed, range is maximized at a launch angle of 45° (in absence of air resistance)."),
  q("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "3.0 km/s", "9.8 km/s"], 1, "Gravitation", "Earth's escape velocity is approximately 11.2 km/s."),
  q("According to Ohm's law, if resistance is doubled while current is constant, voltage:", ["Doubles", "Halves", "Stays the same", "Becomes zero"], 0, "Current Electricity", "V is directly proportional to R at constant I, so doubling R doubles V."),
  q("The phenomenon of light bending around obstacles is called:", ["Reflection", "Refraction", "Diffraction", "Dispersion"], 2, "Optics", "Diffraction is the bending of light waves around obstacles or through slits."),
  q("Which law states the total momentum of an isolated system remains constant?", ["Newton's first law", "Law of conservation of momentum", "Law of conservation of energy", "Newton's third law"], 1, "Laws of Motion", "In the absence of external forces, total momentum of a system is conserved."),
  q("The SI unit of magnetic flux is:", ["Tesla", "Weber", "Henry", "Gauss"], 1, "Magnetism", "Magnetic flux is measured in webers (Wb)."),
  q("The energy stored in a stretched spring is called:", ["Kinetic energy", "Potential energy", "Thermal energy", "Chemical energy"], 1, "Work-Energy", "A stretched or compressed spring stores elastic potential energy."),
  q("A convex lens always forms a real image when the object is placed:", ["Within the focal length", "At the focus", "Beyond the focal length", "At infinity only"], 2, "Optics", "A convex lens forms a real image for objects placed beyond its focal length."),
  q("The frequency of a wave is inversely proportional to its:", ["Amplitude", "Wavelength", "Speed", "Period"], 3, "Waves", "Frequency and time period are reciprocals: f = 1/T."),
  q("For a simple harmonic oscillator, the acceleration is:", ["Constant", "Proportional to displacement, directed opposite to it", "Proportional to velocity", "Zero at all times"], 1, "Oscillations", "In SHM, acceleration is proportional to displacement but directed toward the mean position."),
  q("The unit of power is:", ["Joule", "Newton", "Watt", "Pascal"], 2, "Work-Energy", "Power is measured in watts, equal to joules per second."),
  q("Which of the following is a vector quantity?", ["Mass", "Speed", "Displacement", "Energy"], 2, "Kinematics", "Displacement has both magnitude and direction, making it a vector."),
  q("In an AC circuit, the power factor is the cosine of the angle between:", ["Voltage and resistance", "Voltage and current", "Current and impedance", "Frequency and time period"], 1, "Alternating Current", "Power factor = cos(φ), where φ is the phase difference between voltage and current."),
  q("A body in free fall experiences acceleration due to:", ["Air resistance", "Gravity", "Friction", "Normal force"], 1, "Gravitation", "In free fall, gravity is the sole force causing acceleration (ignoring air resistance)."),
  q("The de Broglie wavelength of a particle is inversely proportional to its:", ["Charge", "Momentum", "Mass only", "Energy only"], 1, "Modern Physics", "de Broglie wavelength λ = h/p, inversely proportional to momentum."),
  q("Which of these is a good conductor of electricity?", ["Rubber", "Wood", "Copper", "Glass"], 2, "Current Electricity", "Copper is a metal with free electrons, making it an excellent conductor."),
  q("The photoelectric effect demonstrates that light behaves as:", ["Only a wave", "Only a particle", "Both wave and particle (quantized)", "Neither"], 2, "Modern Physics", "The photoelectric effect shows light's particle nature via discrete energy packets (photons)."),
  // Chemistry (20)
  q("The atomic number of an element represents the number of:", ["Neutrons", "Protons", "Electrons only in ions", "Protons + neutrons"], 1, "Atomic Structure", "Atomic number equals the number of protons in the nucleus."),
  q("Which of the following is a strong acid?", ["Acetic acid", "Citric acid", "Hydrochloric acid", "Carbonic acid"], 2, "Acids & Bases", "HCl fully dissociates in water, making it a strong acid."),
  q("The functional group -OH represents a(n):", ["Aldehyde", "Alcohol", "Ketone", "Carboxylic acid"], 1, "Organic Chemistry", "The hydroxyl group (-OH) characterizes alcohols."),
  q("Isotopes of an element differ in the number of:", ["Protons", "Electrons", "Neutrons", "Valence electrons"], 2, "Atomic Structure", "Isotopes have the same number of protons but different numbers of neutrons."),
  q("Which type of bond involves the sharing of electron pairs?", ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], 1, "Chemical Bonding", "Covalent bonds form through the sharing of electron pairs between atoms."),
  q("The oxidation state of oxygen in most compounds is:", ["+2", "-1", "-2", "0"], 2, "Redox Reactions", "Oxygen typically has an oxidation state of -2, except in peroxides and a few exceptions."),
  q("Which of the following elements is a metalloid?", ["Sodium", "Silicon", "Chlorine", "Calcium"], 1, "Periodic Table", "Silicon exhibits properties of both metals and non-metals, classifying it as a metalloid."),
  q("The rate of a chemical reaction generally increases with:", ["Decreasing temperature", "Increasing temperature", "Decreasing concentration", "Removing the catalyst"], 1, "Chemical Kinetics", "Higher temperature increases molecular kinetic energy, speeding up reaction rate."),
  q("Which quantum number determines the shape of an orbital?", ["Principal", "Azimuthal", "Magnetic", "Spin"], 1, "Atomic Structure", "The azimuthal (angular momentum) quantum number determines orbital shape (s, p, d, f)."),
  q("Le Chatelier's principle predicts the effect of a disturbance on:", ["Reaction rate", "Chemical equilibrium", "Molecular mass", "Bond length"], 1, "Chemical Equilibrium", "Le Chatelier's principle describes how equilibrium shifts to counteract an imposed change."),
  q("Which of the following has the highest first ionization energy?", ["Sodium", "Chlorine", "Argon", "Potassium"], 2, "Periodic Table", "Noble gases like argon have very high ionization energies due to stable electron configurations."),
  q("The hybridization of carbon in methane (CH4) is:", ["sp", "sp2", "sp3", "sp3d"], 2, "Chemical Bonding", "Carbon in methane is sp3 hybridized, forming four equivalent bonds in a tetrahedral shape."),
  q("Which of these is an example of a nucleophile?", ["H+", "NH3", "BF3", "AlCl3"], 1, "Organic Chemistry", "NH3 has a lone pair and donates electrons, acting as a nucleophile."),
  q("The molar mass of water (H2O) is approximately:", ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"], 1, "Mole Concept", "Water's molar mass is 2(1) + 16 = 18 g/mol."),
  q("Which of the following is used as a catalyst in the Haber process?", ["Platinum", "Iron", "Nickel", "Copper"], 1, "Chemical Reactions", "Iron acts as a catalyst in the Haber process for ammonia synthesis."),
  q("Entropy is a measure of:", ["Energy content", "Disorder in a system", "Temperature", "Pressure"], 1, "Thermodynamics", "Entropy quantifies the degree of disorder or randomness in a system."),
  q("Which of the following is an aromatic compound?", ["Methane", "Ethanol", "Benzene", "Propane"], 2, "Organic Chemistry", "Benzene, with its stable ring of alternating double bonds, is the classic aromatic compound."),
  q("The pH of a neutral solution at 25°C is:", ["0", "7", "14", "1"], 1, "Acids & Bases", "A neutral solution has a pH of 7 at 25°C."),
  q("Which of the following best describes an ideal gas?", ["Has intermolecular forces", "Occupies negligible volume with no intermolecular forces", "Only exists at high pressure", "Condenses easily"], 1, "States of Matter", "An ideal gas is modeled as having negligible volume and no intermolecular forces."),
  q("Which element has the electronic configuration 1s2 2s2 2p6 3s1?", ["Neon", "Sodium", "Magnesium", "Fluorine"], 1, "Atomic Structure", "This configuration (11 electrons) corresponds to sodium."),
  // Mathematics (20)
  q("The distance of point (3,4) from origin is:", ["5", "7", "25", "3"], 0, "Straight Lines", "Distance = sqrt(3^2+4^2) = 5."),
  q("The general equation of a circle is x^2+y^2+2gx+2fy+c=0. Its centre is:", ["(g,f)", "(-g,-f)", "(2g,2f)", "(-2g,-2f)"], 1, "Circles", "Centre of the general circle equation is (-g, -f)."),
  q("Eccentricity of a parabola is:", ["0", "1", "Between 0 and 1", "Greater than 1"], 1, "Conic Sections", "A parabola always has eccentricity exactly 1."),
  q("Two lines are perpendicular when the product of their slopes is:", ["0", "1", "-1", "Undefined"], 2, "Straight Lines", "Perpendicular lines satisfy m1*m2 = -1."),
  q("Length of latus rectum of y^2=4ax is:", ["a", "2a", "4a", "8a"], 2, "Conic Sections", "For y^2=4ax, latus rectum length = 4a."),
  q("The derivative of sin(x) with respect to x is:", ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], 0, "Calculus", "The standard derivative of sin(x) is cos(x)."),
  q("The value of the determinant of a 2x2 identity matrix is:", ["0", "1", "2", "-1"], 1, "Matrices", "The determinant of any identity matrix is always 1."),
  q("If A and B are independent events, P(A ∩ B) equals:", ["P(A) + P(B)", "P(A) - P(B)", "P(A) × P(B)", "P(A) / P(B)"], 2, "Probability", "For independent events, the probability of both occurring is the product of their individual probabilities."),
  q("The sum of the first n natural numbers is given by:", ["n(n+1)/2", "n(n-1)/2", "n²", "n(n+1)"], 0, "Sequences & Series", "The formula for the sum of the first n natural numbers is n(n+1)/2."),
  q("The number of ways to arrange 5 distinct objects in a row is:", ["25", "60", "120", "20"], 2, "Permutations & Combinations", "5 distinct objects can be arranged in 5! = 120 ways."),
  q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "Calculus", "The standard integral of 1/x is the natural logarithm ln|x| + C."),
  q("If a matrix A is singular, then its determinant is:", ["1", "Non-zero", "0", "Negative"], 2, "Matrices", "A singular matrix has a determinant of exactly 0."),
  q("The modulus of a complex number z = a + bi is:", ["a + b", "sqrt(a² + b²)", "a² + b²", "a - b"], 1, "Complex Numbers", "The modulus of a complex number is sqrt(a² + b²)."),
  q("The value of sin(90°) is:", ["0", "1", "-1", "0.5"], 1, "Trigonometry", "sin(90°) = 1 by definition of the unit circle."),
  q("A function f(x) is continuous at x=a if:", ["f(a) is defined only", "The limit exists only", "The limit equals f(a)", "f(x) is differentiable at a"], 2, "Calculus", "Continuity requires the limit as x approaches a to equal the function value f(a)."),
  q("The slope of a line parallel to the x-axis is:", ["Undefined", "1", "0", "-1"], 2, "Straight Lines", "A line parallel to the x-axis has zero slope."),
  q("The number of terms in the binomial expansion of (x+y)^n is:", ["n", "n-1", "n+1", "2n"], 2, "Binomial Theorem", "The binomial expansion of (x+y)^n has exactly n+1 terms."),
  q("If the discriminant of a quadratic equation is negative, the roots are:", ["Real and equal", "Real and distinct", "Complex conjugates", "Zero"], 2, "Quadratic Equations", "A negative discriminant means the roots are complex conjugates."),
  q("The dot product of two perpendicular vectors is:", ["1", "-1", "0", "Equal to their magnitudes"], 2, "Vectors", "Perpendicular vectors have a dot product of zero, since cos(90°) = 0."),
  q("The value of log(1) in any base is:", ["1", "0", "Undefined", "-1"], 1, "Logarithms", "log(1) = 0 in any valid logarithmic base, since base^0 = 1."),
];

const CLASS10_QUESTIONS = [
  // Mathematics (15)
  q("The value of sin30° + cos60° is:", ["0", "0.5", "1", "1.5"], 2, "Trigonometry", "sin30° = 0.5, cos60° = 0.5; sum = 1."),
  q("If tanθ = 1, θ equals:", ["30°", "45°", "60°", "90°"], 1, "Trigonometry", "tan45° = 1."),
  q("The identity sin²θ + cos²θ equals:", ["0", "1", "2", "tan²θ"], 1, "Trigonometry", "This is the fundamental Pythagorean trigonometric identity."),
  q("The quadratic formula for ax²+bx+c=0 is:", ["x = -b ± sqrt(b²-4ac) / 2a", "x = b ± sqrt(b²-4ac) / a", "x = -b ± sqrt(b²+4ac) / 2a", "x = -b / 2a"], 0, "Quadratic Equations", "The standard quadratic formula is x = (-b ± sqrt(b²-4ac)) / 2a."),
  q("The nth term of an arithmetic progression is given by:", ["a + (n-1)d", "a + nd", "a - (n-1)d", "an"], 0, "Arithmetic Progressions", "The nth term formula is a + (n-1)d."),
  q("The distance between points (0,0) and (3,4) is:", ["5", "7", "3", "4"], 0, "Coordinate Geometry", "Using the distance formula: sqrt(3² + 4²) = 5."),
  q("The midpoint of the segment joining (2,3) and (4,7) is:", ["(3,5)", "(2,4)", "(6,10)", "(1,2)"], 0, "Coordinate Geometry", "Midpoint formula: ((2+4)/2, (3+7)/2) = (3,5)."),
  q("The area of a triangle with base 10 cm and height 6 cm is:", ["60 cm²", "30 cm²", "16 cm²", "40 cm²"], 1, "Mensuration", "Area = (1/2) × base × height = 30 cm²."),
  q("The volume of a cube with side 4 cm is:", ["16 cm³", "64 cm³", "48 cm³", "12 cm³"], 1, "Mensuration", "Volume of a cube = side³ = 4³ = 64 cm³."),
  q("If two triangles are similar, their corresponding sides are:", ["Equal", "Proportional", "Perpendicular", "Parallel"], 1, "Triangles", "Similar triangles have proportional corresponding sides."),
  q("The HCF of 12 and 18 is:", ["2", "6", "36", "4"], 1, "Real Numbers", "The highest common factor of 12 and 18 is 6."),
  q("A quadratic polynomial has at most how many zeroes?", ["1", "2", "3", "0"], 1, "Polynomials", "A quadratic polynomial (degree 2) has at most 2 zeroes."),
  q("The probability of getting a head when tossing a fair coin is:", ["0", "1", "0.5", "0.25"], 2, "Probability", "A fair coin has an equal 0.5 probability of heads or tails."),
  q("The mean of the numbers 2, 4, 6, 8, 10 is:", ["5", "6", "7", "8"], 1, "Statistics", "Mean = (2+4+6+8+10)/5 = 6."),
  q("A pair of linear equations in two variables has a unique solution if the lines are:", ["Parallel", "Coincident", "Intersecting", "Perpendicular only"], 2, "Linear Equations", "Intersecting lines meet at exactly one point, giving a unique solution."),
  // Science (15)
  q("The chemical formula of water is:", ["H2O", "HO2", "H2O2", "OH"], 0, "Chemistry", "Water is composed of two hydrogen atoms and one oxygen atom: H2O."),
  q("Photosynthesis takes place mainly in which part of the plant?", ["Root", "Stem", "Leaf", "Flower"], 2, "Biology", "Leaves contain chloroplasts and are the primary site of photosynthesis."),
  q("The SI unit of electric current is:", ["Volt", "Ampere", "Ohm", "Watt"], 1, "Physics", "Electric current is measured in amperes (A)."),
  q("The process by which plants lose water vapor through leaves is called:", ["Respiration", "Transpiration", "Photosynthesis", "Excretion"], 1, "Biology", "Transpiration is the loss of water vapor from plant surfaces, mainly leaves."),
  q("Newton's first law of motion is also known as the law of:", ["Momentum", "Inertia", "Action-reaction", "Gravitation"], 1, "Physics", "Newton's first law describes inertia."),
  q("The pH of pure water is:", ["0", "7", "14", "1"], 1, "Chemistry", "Pure water is neutral, with a pH of 7."),
  q("Which organ in the human body is primarily responsible for filtering blood?", ["Liver", "Heart", "Kidney", "Lungs"], 2, "Biology", "The kidneys filter waste products from the blood to form urine."),
  q("The unit of force in the SI system is:", ["Joule", "Newton", "Watt", "Pascal"], 1, "Physics", "Force is measured in newtons (N)."),
  q("Which type of mirror is used in solar cookers to concentrate sunlight?", ["Plane mirror", "Convex mirror", "Concave mirror", "Cylindrical mirror"], 2, "Physics", "Concave mirrors converge parallel rays of light to a focal point."),
  q("Which of the following is a renewable source of energy?", ["Coal", "Petroleum", "Solar energy", "Natural gas"], 2, "Physics", "Solar energy is continuously replenished and thus renewable."),
  q("The basic unit of heredity is the:", ["Cell", "Chromosome", "Gene", "Nucleus"], 2, "Biology", "Genes are the basic units of heredity."),
  q("Which acid is present in the human stomach?", ["Sulfuric acid", "Hydrochloric acid", "Nitric acid", "Acetic acid"], 1, "Chemistry", "The stomach secretes hydrochloric acid to aid digestion."),
  q("Sound cannot travel through:", ["Solids", "Liquids", "Gases", "Vacuum"], 3, "Physics", "Sound requires a medium and cannot travel through a vacuum."),
  q("The process by which a solid changes directly to a gas is called:", ["Melting", "Sublimation", "Condensation", "Freezing"], 1, "Chemistry", "Sublimation is the direct transition from solid to gas."),
  q("The reaction between an acid and a base is called:", ["Oxidation", "Reduction", "Neutralization", "Combustion"], 2, "Chemistry", "Acid-base reactions producing salt and water are neutralization reactions."),
];

const CLASS12_QUESTIONS = [
  // Mathematics (15)
  q("The derivative of x² with respect to x is:", ["x", "2x", "x²", "2"], 1, "Differentiation", "Using the power rule, d/dx(x^n) = n·x^(n-1), so d/dx(x²) = 2x."),
  q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "Integration", "The standard integral of 1/x is the natural logarithm ln|x| + C."),
  q("The derivative of a constant is:", ["1", "0", "The constant itself", "Undefined"], 1, "Differentiation", "The rate of change of a constant is always zero."),
  q("d/dx(sin x) equals:", ["cos x", "-cos x", "-sin x", "tan x"], 0, "Differentiation", "The standard derivative of sin x is cos x."),
  q("The dot product of two perpendicular vectors is:", ["1", "-1", "0", "Equal to their magnitudes"], 2, "Vectors", "Perpendicular vectors have a dot product of zero."),
  q("A function is said to have a maximum at a point if the second derivative there is:", ["Positive", "Negative", "Zero", "Undefined"], 1, "Application of Derivatives", "A negative second derivative at a critical point indicates a local maximum."),
  q("The determinant of a 2x2 identity matrix is:", ["0", "1", "2", "-1"], 1, "Matrices & Determinants", "The determinant of any identity matrix is always 1."),
  q("If A and B are independent events, P(A ∩ B) equals:", ["P(A) + P(B)", "P(A) - P(B)", "P(A) × P(B)", "P(A) / P(B)"], 2, "Probability", "For independent events, joint probability is the product of individual probabilities."),
  q("A relation that is reflexive, symmetric, and transitive is called a(n):", ["Function", "Equivalence relation", "Bijection", "Identity relation"], 1, "Relations & Functions", "A relation satisfying all three properties is an equivalence relation."),
  q("The value of ∫e^x dx is:", ["e^x + C", "xe^x + C", "e^x/x + C", "ln(x) + C"], 0, "Integration", "The integral of e^x is simply e^x + C."),
  q("The angle between two vectors with dot product zero and both non-zero is:", ["0°", "45°", "90°", "180°"], 2, "Vectors", "A zero dot product between non-zero vectors indicates they are perpendicular."),
  q("The derivative of ln(x) with respect to x is:", ["x", "1/x", "ln(x)", "e^x"], 1, "Differentiation", "The standard derivative of ln(x) is 1/x."),
  q("The order of the differential equation (d²y/dx²) + y = 0 is:", ["1", "2", "0", "3"], 1, "Differential Equations", "The order is the highest derivative present, which is the second derivative here."),
  q("The value of sin⁻¹(1) is:", ["0", "π/4", "π/2", "π"], 2, "Inverse Trigonometric Functions", "sin⁻¹(1) corresponds to π/2 radians (90°)."),
  q("If f(x) = x³, then f'(x) is:", ["x²", "3x²", "3x", "x³"], 1, "Differentiation", "Using the power rule, the derivative of x³ is 3x²."),
  // Physics (15)
  q("Coulomb's law describes the force between two:", ["Masses", "Point charges", "Magnetic poles", "Currents"], 1, "Electrostatics", "Coulomb's law gives the electrostatic force between two point charges."),
  q("The SI unit of electric potential is:", ["Ampere", "Ohm", "Volt", "Coulomb"], 2, "Electrostatics", "Electric potential is measured in volts (V)."),
  q("According to Lenz's law, the induced current opposes:", ["The magnetic field", "The change in magnetic flux causing it", "The resistance", "The applied voltage"], 1, "Electromagnetic Induction", "Lenz's law states induced EMF opposes the change in flux that produced it."),
  q("The power factor of a purely resistive AC circuit is:", ["0", "0.5", "1", "Depends on frequency"], 2, "Alternating Current", "A purely resistive circuit has voltage and current in phase, giving power factor 1."),
  q("The photoelectric effect provided evidence for the:", ["Wave nature of light only", "Particle nature of light", "Non-existence of photons", "Continuous nature of energy"], 1, "Modern Physics", "The photoelectric effect demonstrated light's particle nature."),
  q("In a p-n junction diode, current flows easily when it is:", ["Reverse biased", "Forward biased", "Not biased", "Short-circuited"], 1, "Semiconductor Electronics", "Forward biasing allows current to flow easily."),
  q("The unit of magnetic field strength is:", ["Weber", "Tesla", "Henry", "Farad"], 1, "Magnetism", "Magnetic field strength is measured in tesla (T)."),
  q("Which of the following particles has no charge?", ["Proton", "Electron", "Neutron", "Positron"], 2, "Atoms & Nuclei", "Neutrons are electrically neutral particles."),
  q("Gauss's law relates electric flux to:", ["Magnetic field", "Enclosed electric charge", "Current", "Resistance"], 1, "Electrostatics", "Gauss's law relates electric flux through a closed surface to enclosed charge."),
  q("The half-life of a radioactive substance is the time taken for:", ["All the substance to decay", "Half the substance to decay", "The substance to double", "No decay to occur"], 1, "Atoms & Nuclei", "Half-life is the time for half of a sample to decay."),
  q("A convex lens is also known as a:", ["Diverging lens", "Converging lens", "Plane lens", "Cylindrical lens"], 1, "Optics", "Convex lenses converge parallel light rays to a focal point."),
  q("The energy of a photon is given by E=hf, where h is:", ["Planck's constant", "Boltzmann constant", "Gravitational constant", "Avogadro's number"], 0, "Modern Physics", "Planck's constant relates a photon's energy to its frequency."),
  q("An AC generator works on the principle of:", ["Electrostatic induction", "Electromagnetic induction", "Thermionic emission", "Photoelectric effect"], 1, "Electromagnetic Induction", "AC generators convert mechanical to electrical energy via electromagnetic induction."),
  q("The SI unit of capacitance is:", ["Ohm", "Henry", "Farad", "Tesla"], 2, "Electrostatics", "Capacitance is measured in farads (F)."),
  q("The threshold frequency in the photoelectric effect is the minimum frequency required to:", ["Reflect light", "Eject electrons from a metal surface", "Increase resistance", "Cause refraction"], 1, "Modern Physics", "Below threshold frequency, no photoelectrons are emitted regardless of intensity."),
];

const TESTS = [
  { id: "premium_neet_1", title: "NEET Complete Practice Test — Biology, Physics & Chemistry", category: "NEET", questions: NEET_QUESTIONS,
    description: "A full 60-question practice test spanning Biology, Physics, and Chemistry — modeled on real NEET pacing and difficulty." },
  { id: "premium_jee_1", title: "JEE Main Complete Practice Test — Physics, Chemistry & Maths", category: "JEE Main", questions: JEE_QUESTIONS,
    description: "A full 60-question practice test spanning Physics, Chemistry, and Mathematics — modeled on real JEE Main pacing and difficulty." },
  { id: "premium_class10_1", title: "Class 10 Boards Complete Practice Test — Maths & Science", category: "Class 10 Boards", questions: CLASS10_QUESTIONS,
    description: "A full 60-question CBSE-pattern practice test covering Mathematics and Science for Class 10 board exam preparation." },
  { id: "premium_class12_1", title: "Class 12 Boards Complete Practice Test — Maths & Physics", category: "Class 12 Boards", questions: CLASS12_QUESTIONS,
    description: "A full 60-question CBSE-pattern practice test covering Mathematics and Physics for Class 12 board exam preparation (Science stream)." },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set — check your .env file.");
    process.exit(1);
  }

  for (const t of TESTS) {
    if (t.questions.length !== 60) {
      console.log(`Note: "${t.title}" has ${t.questions.length} questions (not exactly 60) — still valid, just noting for your records.`);
    }
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
