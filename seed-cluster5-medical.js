// Cluster 5 — NEET Foundation, NEET PG
// (AIIMS and JIPMER skipped — their separate UG entrance exams were
// discontinued in 2020 and merged into NEET-UG; no distinct exam exists.)
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster5-medical.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const NEET_FOUNDATION_QUESTIONS = [
  q("The basic unit of life is the:", ["Tissue", "Cell", "Organ", "Organism"], 1, "Biology", "The cell is the fundamental structural and functional unit of all living organisms."),
  q("Which part of the plant conducts photosynthesis?", ["Root", "Stem", "Leaf", "Flower"], 2, "Biology", "Leaves contain chlorophyll and are the main site of photosynthesis."),
  q("The process of a caterpillar turning into a butterfly is called:", ["Fertilization", "Metamorphosis", "Germination", "Pollination"], 1, "Biology", "Metamorphosis is the biological process of transformation, as seen in insects like butterflies."),
  q("Which organ pumps blood throughout the human body?", ["Lungs", "Heart", "Liver", "Kidney"], 1, "Biology", "The heart pumps blood through the circulatory system."),
  q("Plants take in which gas for photosynthesis?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2, "Biology", "Plants absorb carbon dioxide during photosynthesis to produce glucose."),
  q("The process by which water moves from roots to leaves is called:", ["Respiration", "Transpiration pull (via the xylem)", "Digestion", "Excretion"], 1, "Biology", "Water moves upward through the xylem tissue, driven partly by transpiration."),
  q("Which blood cells help fight infections?", ["Red blood cells", "White blood cells", "Platelets", "Plasma"], 1, "Biology", "White blood cells are part of the immune system and help fight infections."),
  q("The gas we breathe in that is essential for respiration is:", ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], 2, "Biology", "Oxygen is used by our cells during respiration to release energy."),
  q("Which of these is a producer in a food chain?", ["Lion", "Grass", "Frog", "Snake"], 1, "Biology", "Grass is a producer, making its own food via photosynthesis."),
  q("The study of living organisms is called:", ["Physics", "Chemistry", "Biology", "Geology"], 2, "Biology", "Biology is the scientific study of living organisms."),
  q("Which part of the human body is responsible for filtering blood and producing urine?", ["Liver", "Heart", "Kidney", "Lungs"], 2, "Biology", "Kidneys filter blood to remove waste and produce urine."),
  q("The smallest unit of a chemical element is called a(n):", ["Molecule", "Atom", "Cell", "Compound"], 1, "Biology", "An atom is the smallest unit of a chemical element retaining its properties."),
  q("Which type of teeth are used for cutting food?", ["Molars", "Canines", "Incisors", "Premolars"], 2, "Biology", "Incisors, the front teeth, are used for cutting food."),
  q("The green pigment in plants that helps absorb sunlight is called:", ["Melanin", "Chlorophyll", "Hemoglobin", "Keratin"], 1, "Biology", "Chlorophyll is the green pigment that captures light energy for photosynthesis."),
  q("Which organ is responsible for breathing in humans?", ["Heart", "Lungs", "Kidney", "Stomach"], 1, "Biology", "The lungs are the primary organs of the respiratory system."),
  q("Reproduction in flowering plants primarily occurs via:", ["Spores", "Seeds formed after pollination and fertilization", "Budding only", "Fission"], 1, "Biology", "Flowering plants reproduce sexually through pollination, fertilization, and seed formation."),
  q("The hard outer covering of an egg is called the:", ["Shell", "Yolk", "Membrane", "Albumen"], 0, "Biology", "The shell is the hard protective outer covering of an egg."),
  q("Which nutrient is the primary source of energy for the human body?", ["Proteins", "Carbohydrates", "Vitamins", "Minerals"], 1, "Biology", "Carbohydrates are the body's main and most readily available energy source."),
  q("The process of breaking down food into usable nutrients is called:", ["Respiration", "Digestion", "Excretion", "Circulation"], 1, "Biology", "Digestion breaks down food into simpler substances the body can absorb."),
  q("Which of the following is a vertebrate animal?", ["Earthworm", "Jellyfish", "Fish", "Snail"], 2, "Biology", "Fish have a backbone (vertebral column), making them vertebrates."),
  q("A body at rest remains at rest unless acted upon by a force. This is:", ["Newton's second law", "Newton's first law (law of inertia)", "Newton's third law", "Law of gravitation"], 1, "Physics", "Newton's first law describes inertia — objects resist changes in their state of motion."),
  q("The SI unit of length is the:", ["Kilogram", "Meter", "Second", "Litre"], 1, "Physics", "The meter is the SI base unit of length."),
  q("Which of the following is a form of energy?", ["Mass", "Heat", "Volume", "Distance"], 1, "Physics", "Heat is a form of energy, associated with the motion of particles."),
  q("The bending of light when it passes from one medium to another is called:", ["Reflection", "Refraction", "Absorption", "Diffusion"], 1, "Physics", "Refraction occurs due to the change in speed of light between media."),
  q("A simple machine that changes the direction of an applied force, like in a well, is a:", ["Lever", "Pulley", "Wheel", "Screw"], 1, "Physics", "A pulley changes the direction of force, commonly used to lift buckets from wells."),
  q("The unit used to measure electric current is the:", ["Volt", "Ampere", "Ohm", "Watt"], 1, "Physics", "Electric current is measured in amperes."),
  q("Sound travels fastest through which medium?", ["Air", "Water", "Solids", "Vacuum"], 2, "Physics", "Sound travels fastest through solids due to closely packed particles."),
  q("Which of the following is a natural source of light?", ["Bulb", "Candle", "Sun", "Torch"], 2, "Physics", "The Sun is a natural source of light, unlike man-made sources like bulbs or torches."),
  q("The force that pulls objects toward the Earth is called:", ["Friction", "Gravity", "Magnetism", "Tension"], 1, "Physics", "Gravity is the force of attraction pulling objects toward Earth's center."),
  q("A magnet attracts which of the following materials?", ["Wood", "Plastic", "Iron", "Glass"], 2, "Physics", "Magnets attract ferromagnetic materials like iron."),
  q("Which mirror is used by dentists to get a magnified image of teeth?", ["Plane mirror", "Convex mirror", "Concave mirror", "Cylindrical mirror"], 2, "Physics", "Concave mirrors produce magnified images when the object is close, useful for dentists."),
  q("The process of a liquid turning into a gas is called:", ["Condensation", "Evaporation", "Freezing", "Sublimation"], 1, "Physics", "Evaporation is the process of a liquid changing into vapor."),
  q("Which simple machine is a ramp an example of?", ["Lever", "Inclined plane", "Pulley", "Wheel and axle"], 1, "Physics", "A ramp is a classic example of an inclined plane."),
  q("The push or pull on an object is called:", ["Energy", "Force", "Work", "Power"], 1, "Physics", "A force is any push or pull acting on an object."),
  q("Which of these best conducts electricity?", ["Rubber", "Plastic", "Copper wire", "Wood"], 2, "Physics", "Copper is a metal with free electrons, making it an excellent electrical conductor."),
  q("The unit used to measure temperature is:", ["Meter", "Celsius", "Kilogram", "Second"], 1, "Physics", "Temperature is commonly measured in degrees Celsius (or Kelvin/Fahrenheit)."),
  q("An object floats in water if its density is:", ["Greater than water", "Equal to or less than water", "Always zero", "Unrelated to floating"], 1, "Physics", "An object floats if its density is less than or equal to that of the fluid it's placed in."),
  q("Which of these is an example of a renewable energy source?", ["Coal", "Solar energy", "Petroleum", "Natural gas"], 1, "Physics", "Solar energy is continuously replenished, making it renewable."),
  q("The pitch of a sound is related to its:", ["Amplitude", "Frequency", "Speed", "Wavelength only"], 1, "Physics", "Pitch is determined by the frequency of a sound wave."),
  q("Which of the following is measured using a thermometer?", ["Weight", "Temperature", "Length", "Time"], 1, "Physics", "A thermometer measures temperature."),
  q("The chemical symbol for water is:", ["H2O", "CO2", "O2", "NaCl"], 0, "Chemistry", "Water's chemical formula is H2O, two hydrogen atoms and one oxygen atom."),
  q("Which of the following is a pure substance?", ["Air", "Salt water", "Distilled water", "Soil"], 2, "Chemistry", "Distilled water is a pure substance, free from dissolved impurities."),
  q("The three states of matter are:", ["Solid, liquid, and metal", "Solid, liquid, and gas", "Hot, cold, and warm", "Heavy, light, and medium"], 1, "Chemistry", "Matter commonly exists in three states: solid, liquid, and gas."),
  q("Which gas is released when a candle burns?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 1, "Chemistry", "Burning releases carbon dioxide as a byproduct of combustion."),
  q("An acid turns blue litmus paper:", ["Blue", "Red", "Green", "Colorless"], 1, "Chemistry", "Acids turn blue litmus paper red."),
  q("A base turns red litmus paper:", ["Red", "Blue", "Yellow", "Colorless"], 1, "Chemistry", "Bases turn red litmus paper blue."),
  q("Which of the following is a mixture?", ["Pure gold", "Distilled water", "Salt water", "Oxygen gas"], 2, "Chemistry", "Salt water is a mixture of salt and water, not a pure substance."),
  q("The process of separating a solid from a liquid using a filter is called:", ["Evaporation", "Filtration", "Distillation", "Sublimation"], 1, "Chemistry", "Filtration separates insoluble solids from liquids using a filter medium."),
  q("Rusting of iron is a type of:", ["Physical change", "Chemical change", "No change at all", "Temporary change"], 1, "Chemistry", "Rusting forms a new substance (iron oxide), making it a chemical change."),
  q("The smallest particle of an element that retains its chemical properties is the:", ["Molecule", "Atom", "Compound", "Mixture"], 1, "Chemistry", "An atom is the basic unit of a chemical element."),
  q("Which of these is an example of a chemical change?", ["Melting ice", "Boiling water", "Burning paper", "Cutting paper"], 2, "Chemistry", "Burning paper produces new substances (ash, gases), a chemical change."),
  q("Which gas makes up the majority of Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "Chemistry", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("Which of the following is used to test if a liquid is acidic or basic?", ["Thermometer", "Litmus paper", "Barometer", "Hydrometer"], 1, "Chemistry", "Litmus paper indicates whether a substance is acidic or basic through color change."),
  q("A compound is formed when two or more elements are:", ["Mixed physically", "Chemically combined", "Simply placed together", "Heated separately"], 1, "Chemistry", "A compound forms when elements chemically combine in fixed proportions."),
  q("The process of converting a solid directly into a gas is called:", ["Melting", "Sublimation", "Condensation", "Freezing"], 1, "Chemistry", "Sublimation is the direct transition from solid to gas."),
  q("Which of these substances is a metal?", ["Sulfur", "Iron", "Oxygen", "Chlorine"], 1, "Chemistry", "Iron is a metal, known for its strength and magnetic properties."),
  q("Salt (sodium chloride) is formed by the reaction of an acid with a:", ["Metal only", "Base", "Gas", "Non-metal only"], 1, "Chemistry", "Neutralization of an acid with a base forms a salt and water."),
  q("Which of the following is an example of a non-metal?", ["Iron", "Copper", "Oxygen", "Aluminum"], 2, "Chemistry", "Oxygen is a non-metal, essential for respiration and combustion."),
  q("The process of dissolving a solid in a liquid to form a solution is called:", ["Evaporation", "Dissolution", "Filtration", "Sublimation"], 1, "Chemistry", "Dissolution is the process of a solute mixing into a solvent to form a solution."),
  q("Baking soda used in cooking is chemically known as:", ["Sodium chloride", "Sodium bicarbonate", "Calcium carbonate", "Sodium hydroxide"], 1, "Chemistry", "Baking soda is sodium bicarbonate (NaHCO3)."),
];

const NEETPG_QUESTIONS = [
  q("The largest gland in the human body is the:", ["Pancreas", "Liver", "Thyroid", "Adrenal gland"], 1, "Anatomy", "The liver is the largest gland in the human body."),
  q("The femur is located in which part of the body?", ["Arm", "Thigh", "Forearm", "Lower leg"], 1, "Anatomy", "The femur is the thigh bone, the longest bone in the human body."),
  q("The number of bones in the adult human body is approximately:", ["106", "156", "206", "256"], 2, "Anatomy", "An adult human skeleton typically has 206 bones."),
  q("The functional unit of the kidney is the:", ["Nephron", "Neuron", "Alveolus", "Hepatocyte"], 0, "Anatomy", "The nephron is the structural and functional unit of the kidney."),
  q("The largest artery in the human body is the:", ["Pulmonary artery", "Aorta", "Renal artery", "Carotid artery"], 1, "Anatomy", "The aorta is the largest artery, carrying oxygenated blood from the heart to the body."),
  q("The pituitary gland is often called the:", ["Master gland", "Silent gland", "Emergency gland", "Digestive gland"], 0, "Anatomy", "The pituitary gland is called the 'master gland' because it regulates other endocrine glands."),
  q("Normal adult resting heart rate is approximately:", ["40-50 bpm", "60-100 bpm", "120-140 bpm", "150-170 bpm"], 1, "Physiology", "A normal resting heart rate for adults typically ranges from 60 to 100 beats per minute."),
  q("Insulin is secreted by which cells of the pancreas?", ["Alpha cells", "Beta cells", "Delta cells", "Acinar cells"], 1, "Physiology", "Beta cells of the pancreatic islets of Langerhans secrete insulin."),
  q("The normal pH range of human blood is approximately:", ["6.0-6.5", "7.35-7.45", "8.0-8.5", "5.0-5.5"], 1, "Physiology", "Human blood pH is tightly regulated between 7.35 and 7.45."),
  q("Which hormone is primarily responsible for regulating blood calcium levels along with parathyroid hormone?", ["Insulin", "Calcitonin", "Glucagon", "Cortisol"], 1, "Physiology", "Calcitonin, secreted by the thyroid, works alongside parathyroid hormone to regulate blood calcium."),
  q("The normal respiratory rate for a healthy adult at rest is approximately:", ["4-8 breaths/min", "12-20 breaths/min", "30-40 breaths/min", "50-60 breaths/min"], 1, "Physiology", "A normal adult resting respiratory rate is typically 12 to 20 breaths per minute."),
  q("Erythropoietin, which stimulates red blood cell production, is primarily produced by the:", ["Liver", "Kidney", "Spleen", "Bone marrow"], 1, "Physiology", "The kidney is the primary site of erythropoietin production in adults."),
  q("Paracetamol is primarily classified as a(n):", ["Antibiotic", "Analgesic and antipyretic", "Antihistamine", "Antihypertensive"], 1, "Pharmacology", "Paracetamol (acetaminophen) is widely used as a pain reliever (analgesic) and fever reducer (antipyretic)."),
  q("Penicillin belongs to which class of drugs?", ["Antivirals", "Antibiotics (beta-lactams)", "Antifungals", "Antihistamines"], 1, "Pharmacology", "Penicillin is a beta-lactam antibiotic used to treat bacterial infections."),
  q("Insulin is used in the management of which condition?", ["Hypertension", "Diabetes mellitus", "Asthma", "Peptic ulcer"], 1, "Pharmacology", "Insulin is a hormone therapy used to manage blood glucose levels in diabetes mellitus."),
  q("Aspirin, apart from being an analgesic, is also known for its:", ["Antiplatelet (blood-thinning) effect", "Antibiotic effect", "Antifungal effect", "Muscle relaxant effect"], 0, "Pharmacology", "Aspirin has antiplatelet properties, commonly used in low doses for cardiovascular protection."),
  q("Which class of drugs is commonly used to treat hypertension by blocking calcium channels?", ["Beta blockers", "Calcium channel blockers", "ACE inhibitors", "Diuretics"], 1, "Pharmacology", "Calcium channel blockers reduce blood pressure by relaxing blood vessels through calcium channel inhibition."),
  q("Jaundice is primarily characterized by elevated levels of:", ["Glucose", "Bilirubin", "Cholesterol", "Creatinine"], 1, "Pathology", "Jaundice results from elevated bilirubin levels, causing yellowing of skin and eyes."),
  q("Anemia is generally defined by a reduced level of:", ["White blood cells", "Hemoglobin", "Platelets", "Plasma proteins"], 1, "Pathology", "Anemia is characterized by a deficiency of hemoglobin or red blood cells."),
  q("Diabetes mellitus is primarily characterized by:", ["Low blood glucose", "High blood glucose", "Low blood pressure", "High white blood cell count"], 1, "Pathology", "Diabetes mellitus is characterized by chronically elevated blood glucose levels."),
  q("Tuberculosis is primarily caused by which organism?", ["Virus", "Mycobacterium tuberculosis (bacterium)", "Fungus", "Parasite"], 1, "Pathology", "Tuberculosis is caused by the bacterium Mycobacterium tuberculosis."),
  q("Hypertension is generally defined as a sustained blood pressure at or above approximately:", ["100/60 mmHg", "120/80 mmHg", "140/90 mmHg", "180/120 mmHg only"], 2, "Pathology", "Hypertension is commonly defined as sustained blood pressure of 140/90 mmHg or higher (guidelines vary slightly)."),
  q("Malaria is transmitted to humans through the bite of an infected:", ["Housefly", "Female Anopheles mosquito", "Tick", "Flea"], 1, "Pathology", "Malaria is transmitted via the bite of an infected female Anopheles mosquito."),
  q("The most common cause of peptic ulcer disease is infection with:", ["Escherichia coli", "Helicobacter pylori", "Salmonella typhi", "Staphylococcus aureus"], 1, "Medicine", "Helicobacter pylori infection is a leading cause of peptic ulcer disease."),
  q("A myocardial infarction is commonly known as a:", ["Stroke", "Heart attack", "Seizure", "Kidney failure"], 1, "Medicine", "Myocardial infarction refers to a heart attack, caused by blocked blood flow to heart muscle."),
  q("Which vitamin deficiency causes night blindness?", ["Vitamin B12", "Vitamin A", "Vitamin C", "Vitamin D"], 1, "Medicine", "Vitamin A deficiency is a well-known cause of night blindness."),
  q("Which vitamin deficiency is associated with beriberi?", ["Vitamin B1 (Thiamine)", "Vitamin C", "Vitamin D", "Vitamin K"], 0, "Medicine", "Beriberi results from thiamine (Vitamin B1) deficiency."),
  q("The standard treatment for anaphylaxis includes immediate administration of:", ["Paracetamol", "Adrenaline (epinephrine)", "Insulin", "Aspirin"], 1, "Medicine", "Adrenaline (epinephrine) is the first-line emergency treatment for anaphylaxis."),
  q("Appendicitis refers to inflammation of the:", ["Gallbladder", "Appendix", "Pancreas", "Spleen"], 1, "Surgery", "Appendicitis is the inflammation of the vermiform appendix."),
  q("A fracture where the bone breaks into more than two fragments is called:", ["Simple fracture", "Comminuted fracture", "Greenstick fracture", "Stress fracture"], 1, "Surgery", "A comminuted fracture involves the bone breaking into three or more pieces."),
  q("The most common site for a hernia in the groin region is the:", ["Umbilical region", "Inguinal region", "Femoral region only", "Epigastric region"], 1, "Surgery", "Inguinal hernias are the most common type of groin hernia."),
  q("Cholecystectomy refers to surgical removal of the:", ["Kidney", "Gallbladder", "Spleen", "Appendix"], 1, "Surgery", "Cholecystectomy is the surgical removal of the gallbladder."),
  q("The normal duration of human pregnancy is approximately:", ["30 weeks", "40 weeks", "50 weeks", "35 weeks"], 1, "Obstetrics & Gynecology", "A full-term human pregnancy lasts approximately 40 weeks from the last menstrual period."),
  q("The first stage of labor is characterized by:", ["Delivery of the placenta", "Cervical dilation and effacement", "Delivery of the baby", "Postpartum recovery"], 1, "Obstetrics & Gynecology", "The first stage of labor involves progressive cervical dilation and effacement."),
  q("Which hormone is primarily responsible for maintaining pregnancy by supporting the uterine lining?", ["Estrogen only", "Progesterone", "Testosterone", "Oxytocin"], 1, "Obstetrics & Gynecology", "Progesterone plays a key role in maintaining the uterine lining during pregnancy."),
  q("The condition of high blood pressure during pregnancy, often with proteinuria, is called:", ["Gestational diabetes", "Pre-eclampsia", "Placenta previa", "Ectopic pregnancy"], 1, "Obstetrics & Gynecology", "Pre-eclampsia is characterized by high blood pressure and proteinuria during pregnancy."),
  q("The normal weight range for a full-term newborn is approximately:", ["1.0-1.5 kg", "2.5-4.0 kg", "5.0-6.0 kg", "0.5-1.0 kg"], 1, "Pediatrics", "A healthy full-term newborn typically weighs between 2.5 and 4.0 kg."),
  q("BCG vaccine is administered to protect against:", ["Measles", "Tuberculosis", "Polio", "Hepatitis B"], 1, "Pediatrics", "The BCG vaccine provides protection against tuberculosis."),
  q("Which reflex in newborns involves grasping an object placed in their palm?", ["Moro reflex", "Palmar grasp reflex", "Rooting reflex", "Babinski reflex"], 1, "Pediatrics", "The palmar grasp reflex causes a newborn to grasp objects placed in their palm."),
  q("Exclusive breastfeeding is generally recommended for the first how many months of an infant's life?", ["1 month", "3 months", "6 months", "12 months"], 2, "Pediatrics", "Exclusive breastfeeding is recommended for the first six months of life by major health organizations."),
  q("The Apgar score is used to assess the health of a:", ["Pregnant woman", "Newborn immediately after birth", "Elderly patient", "Child during vaccination"], 1, "Pediatrics", "The Apgar score assesses a newborn's physical condition shortly after birth."),
  q("Which organ is primarily responsible for detoxification in the human body?", ["Kidney", "Liver", "Spleen", "Pancreas"], 1, "Physiology", "The liver plays the central role in detoxifying harmful substances in the body."),
  q("The normal fasting blood glucose level in a healthy adult is approximately:", ["40-60 mg/dL", "70-100 mg/dL", "150-200 mg/dL", "250-300 mg/dL"], 1, "Physiology", "Normal fasting blood glucose is typically between 70 and 100 mg/dL."),
  q("Which blood group is known as the universal donor?", ["AB positive", "A positive", "O negative", "B negative"], 2, "Physiology", "O negative blood can be given to patients of any blood type, making it the universal donor."),
  q("Which blood group is known as the universal recipient?", ["O negative", "AB positive", "A negative", "B positive"], 1, "Physiology", "AB positive individuals can receive blood from any ABO/Rh blood type, making it the universal recipient."),
  q("Antibiotics are used to treat infections caused by:", ["Viruses", "Bacteria", "All pathogens equally", "Only fungi"], 1, "Pharmacology", "Antibiotics specifically target bacterial infections and are ineffective against viruses."),
  q("Which vitamin is essential for blood clotting?", ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin E"], 2, "Physiology", "Vitamin K plays a crucial role in the blood clotting cascade."),
  q("The condition characterized by abnormally low levels of hemoglobin is called:", ["Leukemia", "Anemia", "Thrombocytopenia", "Polycythemia"], 1, "Pathology", "Anemia is defined by low hemoglobin or red blood cell count."),
  q("A stroke is primarily caused by disruption of blood supply to the:", ["Heart", "Brain", "Kidney", "Liver"], 1, "Medicine", "A stroke occurs due to interrupted blood supply to the brain, causing tissue damage."),
  q("The hormone responsible for the 'fight or flight' response is:", ["Insulin", "Adrenaline (epinephrine)", "Thyroxine", "Progesterone"], 1, "Physiology", "Adrenaline is released by the adrenal medulla during acute stress, triggering the fight-or-flight response."),
  q("Which of the following is a common site for administering an intramuscular injection?", ["Earlobe", "Deltoid muscle", "Fingertip", "Scalp"], 1, "Medicine", "The deltoid muscle is a commonly used site for intramuscular injections."),
  q("The gold standard investigation for diagnosing most cancers involves:", ["Blood test alone", "Biopsy with histopathological examination", "X-ray alone", "Physical examination alone"], 1, "Pathology", "A biopsy followed by histopathological examination is the definitive diagnostic method for most cancers."),
  q("Chickenpox is caused by which type of pathogen?", ["Bacterium", "Virus (Varicella-zoster)", "Fungus", "Parasite"], 1, "Pathology", "Chickenpox is caused by the varicella-zoster virus."),
  q("The normal total white blood cell count in a healthy adult is approximately:", ["1,000-2,000 /µL", "4,000-11,000 /µL", "20,000-30,000 /µL", "50,000-60,000 /µL"], 1, "Physiology", "A normal adult WBC count typically ranges from 4,000 to 11,000 cells per microliter."),
  q("Which vaccine is used to prevent poliomyelitis?", ["BCG", "OPV/IPV (Oral/Inactivated Polio Vaccine)", "MMR", "DPT"], 1, "Pediatrics", "OPV and IPV are the vaccines used to prevent polio."),
  q("The main function of platelets in blood is:", ["Oxygen transport", "Fighting infection", "Blood clotting", "Hormone transport"], 2, "Physiology", "Platelets play a central role in the blood clotting (coagulation) process."),
  q("Which organ produces bile, which aids in fat digestion?", ["Pancreas", "Liver", "Stomach", "Small intestine"], 1, "Physiology", "The liver produces bile, which is stored in the gallbladder and aids fat digestion."),
  q("The condition of abnormally high blood sugar in a pregnant woman without prior diabetes is called:", ["Type 1 diabetes", "Gestational diabetes", "Type 2 diabetes", "Pre-eclampsia"], 1, "Obstetrics & Gynecology", "Gestational diabetes refers to high blood sugar that develops during pregnancy in women without prior diabetes."),
  q("Which antibiotic class is contraindicated in pregnancy due to effects on fetal bone/teeth development?", ["Penicillins", "Tetracyclines", "Macrolides", "Cephalosporins"], 1, "Pharmacology", "Tetracyclines are generally avoided in pregnancy due to risks to fetal bone and teeth development."),
  q("The normal body temperature in a healthy adult is approximately:", ["35.0°C", "37.0°C", "39.0°C", "41.0°C"], 1, "Physiology", "Normal human body temperature averages around 37.0°C (98.6°F)."),
];

const TESTS = [
  { id: "premium_neetfoundation_1", title: "NEET Foundation Complete Practice Test — Basic Biology, Physics & Chemistry", category: "NEET Foundation", questions: NEET_FOUNDATION_QUESTIONS,
    description: "A full 60-question foundation-level practice test in Biology, Physics, and Chemistry — pitched for younger students (Class 9-10) building toward eventual NEET-UG preparation." },
  { id: "premium_neetpg_1", title: "NEET PG Complete Practice Test — Anatomy, Physiology, Pharmacology & Clinical Subjects", category: "NEET PG", questions: NEETPG_QUESTIONS,
    description: "A full 60-question NEET PG-pattern practice test covering Anatomy, Physiology, Pharmacology, Pathology, Medicine, Surgery, Obstetrics & Gynecology, and Pediatrics — focused on well-established, foundational clinical facts." },
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
