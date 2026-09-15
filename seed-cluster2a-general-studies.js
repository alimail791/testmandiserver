// Cluster 2a — General Studies pattern: UPSC CSE, SSC CGL, State PSC
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster2a-general-studies.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const UPSC_QUESTIONS = [
  // Polity (20)
  q("Fundamental Rights are enshrined in which Part of the Constitution?", ["Part II", "Part III", "Part IV", "Part V"], 1, "Polity", "Fundamental Rights are covered under Part III, Articles 12-35."),
  q("Which article provides for the Right to Constitutional Remedies?", ["Article 19", "Article 21", "Article 32", "Article 44"], 2, "Polity", "Article 32 is the 'heart and soul' of the Constitution per Dr. Ambedkar."),
  q("Residuary powers under the Indian Constitution rest with:", ["State Legislature", "Parliament", "President", "Judiciary"], 1, "Polity", "Article 248 vests residuary powers in Parliament."),
  q("The Preamble was amended by which constitutional amendment?", ["24th", "42nd", "44th", "52nd"], 1, "Polity", "The 42nd Amendment (1976) added 'Socialist, Secular, Integrity' to the Preamble."),
  q("The Directive Principles of State Policy are contained in which Part?", ["Part III", "Part IV", "Part V", "Part VI"], 1, "Polity", "Directive Principles are laid out in Part IV, Articles 36-51."),
  q("Who appoints the Chief Justice of India?", ["Prime Minister", "President", "Parliament", "Chief Justice himself"], 1, "Polity", "The President appoints the Chief Justice of India, per Article 124."),
  q("The concept of 'Judicial Review' in India is inspired by the constitution of:", ["UK", "USA", "Canada", "Australia"], 1, "Polity", "Judicial review, allowing courts to strike down unconstitutional laws, is borrowed from the US Constitution."),
  q("Which schedule of the Constitution deals with anti-defection law?", ["Ninth Schedule", "Tenth Schedule", "Eleventh Schedule", "Twelfth Schedule"], 1, "Polity", "The Tenth Schedule, added by the 52nd Amendment, contains anti-defection provisions."),
  q("The minimum age to become a member of the Lok Sabha is:", ["21 years", "25 years", "30 years", "35 years"], 1, "Polity", "A person must be at least 25 years old to contest Lok Sabha elections."),
  q("Which body recommends the distribution of tax revenue between the Centre and States?", ["Planning Commission", "Finance Commission", "NITI Aayog", "GST Council"], 1, "Polity", "The Finance Commission, constituted under Article 280, recommends tax revenue distribution."),
  q("The Indian Constitution declares India as a:", ["Federal state only", "Unitary state only", "Union of States", "Confederation"], 2, "Polity", "Article 1 describes India as a 'Union of States,' reflecting a quasi-federal structure."),
  q("Which amendment introduced Fundamental Duties into the Constitution?", ["42nd Amendment", "44th Amendment", "61st Amendment", "73rd Amendment"], 0, "Polity", "The 42nd Amendment Act, 1976, added Fundamental Duties under Article 51A."),
  q("The President of India is elected by an Electoral College consisting of:", ["Only Lok Sabha members", "Elected members of Parliament and State Legislative Assemblies", "All MPs and MLAs including nominated ones", "Only Rajya Sabha members"], 1, "Polity", "The Electoral College comprises elected members of both Houses of Parliament and elected members of State Legislative Assemblies."),
  q("Which of the following writs is issued to prevent an official from acting outside their jurisdiction?", ["Habeas Corpus", "Mandamus", "Prohibition", "Certiorari"], 2, "Polity", "The writ of Prohibition is issued by a higher court to prevent a lower court/authority from exceeding its jurisdiction."),
  q("The concept of 'Rule of Law' is a basic feature borrowed mainly from:", ["USA", "UK", "France", "Ireland"], 1, "Polity", "Rule of Law, ensuring supremacy of law over arbitrary power, is a British constitutional concept."),
  q("Panchayati Raj Institutions were given constitutional status by the:", ["42nd Amendment", "44th Amendment", "73rd Amendment", "74th Amendment"], 2, "Polity", "The 73rd Amendment Act, 1992, gave constitutional status to Panchayati Raj Institutions."),
  q("Which of the following is NOT a Fundamental Right?", ["Right to Equality", "Right to Property", "Right to Freedom", "Right against Exploitation"], 1, "Polity", "Right to Property was removed from Fundamental Rights by the 44th Amendment and made a legal right instead."),
  q("The Rajya Sabha can have a maximum strength of:", ["245", "250", "552", "545"], 1, "Polity", "The Rajya Sabha's maximum strength is fixed at 250 members."),
  q("Money Bills can only be introduced in:", ["Rajya Sabha", "Lok Sabha", "Either House", "State Legislature"], 1, "Polity", "Article 110 stipulates Money Bills can only originate in the Lok Sabha."),
  q("The National Emergency under Article 352 can be proclaimed on grounds of:", ["Financial instability only", "War, external aggression, or armed rebellion", "State government failure", "Economic crisis only"], 1, "Polity", "Article 352 allows National Emergency on grounds of war, external aggression, or armed rebellion."),
  // History (20)
  q("Who founded the Mauryan Empire?", ["Ashoka", "Chandragupta Maurya", "Bindusara", "Samudragupta"], 1, "History", "Chandragupta Maurya founded the Mauryan Empire around 322 BCE."),
  q("The Quit India Movement was launched in the year:", ["1930", "1942", "1935", "1947"], 1, "History", "The Quit India Movement was launched by Gandhi in August 1942."),
  q("Who was the founder of the Delhi Sultanate?", ["Muhammad Ghori", "Qutb-ud-din Aibak", "Iltutmish", "Balban"], 1, "History", "Qutb-ud-din Aibak founded the Delhi Sultanate in 1206 CE."),
  q("The Battle of Plassey was fought in the year:", ["1757", "1764", "1857", "1770"], 0, "History", "The Battle of Plassey (1757) established British East India Company dominance in Bengal."),
  q("Who gave the slogan 'Swaraj is my birthright and I shall have it'?", ["Mahatma Gandhi", "Bal Gangadhar Tilak", "Subhas Chandra Bose", "Bhagat Singh"], 1, "History", "Bal Gangadhar Tilak coined this famous slogan."),
  q("The Indian National Congress was founded in the year:", ["1885", "1905", "1857", "1919"], 0, "History", "The Indian National Congress was founded in 1885 by A.O. Hume."),
  q("The Jallianwala Bagh massacre took place in which city?", ["Delhi", "Amritsar", "Lahore", "Lucknow"], 1, "History", "The massacre occurred in Amritsar in April 1919."),
  q("Who was the last Mughal emperor?", ["Akbar II", "Bahadur Shah Zafar", "Shah Alam II", "Jahandar Shah"], 1, "History", "Bahadur Shah Zafar was the last Mughal emperor, exiled after the 1857 revolt."),
  q("The Non-Cooperation Movement was launched in which year?", ["1920", "1930", "1942", "1919"], 0, "History", "Gandhi launched the Non-Cooperation Movement in 1920."),
  q("Chandragupta Maurya's court was visited by the Greek ambassador:", ["Alexander", "Megasthenes", "Seleucus", "Herodotus"], 1, "History", "Megasthenes, sent by Seleucus Nicator, visited Chandragupta's court and wrote 'Indica.'"),
  q("The Simon Commission arrived in India in the year:", ["1927", "1935", "1919", "1942"], 0, "History", "The Simon Commission arrived in 1927, sparking widespread protests since it had no Indian members."),
  q("Who wrote the book 'Discovery of India'?", ["Mahatma Gandhi", "Jawaharlal Nehru", "Rajendra Prasad", "Sardar Patel"], 1, "History", "Jawaharlal Nehru wrote 'The Discovery of India' during his imprisonment."),
  q("The Dandi March (Salt Satyagraha) took place in which year?", ["1930", "1920", "1942", "1919"], 0, "History", "Gandhi led the Dandi March in 1930 to protest the salt tax."),
  q("The Ashokan edicts were primarily written in which script?", ["Devanagari", "Brahmi", "Kharosthi only", "Sanskrit script"], 1, "History", "Most Ashokan edicts were inscribed in Brahmi script."),
  q("Who founded the Brahmo Samaj?", ["Swami Vivekananda", "Raja Ram Mohan Roy", "Dayanand Saraswati", "Ishwar Chandra Vidyasagar"], 1, "History", "Raja Ram Mohan Roy founded the Brahmo Samaj in 1828."),
  q("The Government of India Act of 1935 provided for:", ["Complete independence", "Provincial autonomy", "Partition of India", "Abolition of princely states"], 1, "History", "The 1935 Act introduced provincial autonomy, a key step toward self-governance."),
  q("The Harappan civilization is also known as the:", ["Vedic civilization", "Indus Valley civilization", "Gangetic civilization", "Aryan civilization"], 1, "History", "The Harappan civilization is more widely known as the Indus Valley Civilization."),
  q("Who was the founder of the Sikh religion?", ["Guru Gobind Singh", "Guru Nanak", "Guru Arjan Dev", "Guru Tegh Bahadur"], 1, "History", "Guru Nanak founded Sikhism in the 15th century."),
  q("The Partition of Bengal by Lord Curzon took place in:", ["1905", "1911", "1919", "1935"], 0, "History", "Lord Curzon partitioned Bengal in 1905, sparking the Swadeshi Movement."),
  q("India attained independence on:", ["15 August 1947", "26 January 1950", "2 October 1947", "26 November 1949"], 0, "History", "India became independent on 15 August 1947."),
  // Geography & Economy (20)
  q("Which is the longest river in India?", ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], 1, "Geography", "The Ganga is the longest river flowing within India."),
  q("The Tropic of Cancer passes through how many Indian states?", ["6", "8", "10", "12"], 1, "Geography", "The Tropic of Cancer passes through 8 Indian states."),
  q("Which is the highest peak in India?", ["Nanda Devi", "Kangchenjunga", "K2", "Everest"], 1, "Geography", "Kangchenjunga is the highest peak located entirely within India."),
  q("The Western Ghats run parallel to which coast of India?", ["Eastern coast", "Western coast", "Northern coast", "Southern tip only"], 1, "Geography", "The Western Ghats run along India's western coastline."),
  q("Which state is the largest producer of tea in India?", ["Kerala", "Assam", "Tamil Nadu", "West Bengal"], 1, "Geography", "Assam is India's largest tea-producing state."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "Economy", "The RBI was established on 1 April 1935 under the RBI Act, 1934."),
  q("GST in India was implemented in the year:", ["2015", "2016", "2017", "2019"], 2, "Economy", "The Goods and Services Tax was implemented across India on 1 July 2017."),
  q("Which Five Year Plan focused on the Green Revolution?", ["First Plan", "Third Plan", "Fourth Plan", "Second Plan"], 1, "Economy", "The Third Five Year Plan period saw the initial phase of the Green Revolution."),
  q("NITI Aayog replaced which earlier body?", ["Finance Commission", "Planning Commission", "GST Council", "RBI"], 1, "Economy", "NITI Aayog was formed in 2015, replacing the Planning Commission."),
  q("Which river is known as the 'Sorrow of Bihar'?", ["Ganga", "Kosi", "Son", "Gandak"], 1, "Geography", "The Kosi river is called the 'Sorrow of Bihar' due to frequent devastating floods."),
  q("The Deccan Plateau is bordered on the north by the:", ["Himalayas", "Vindhya Range", "Aravalli Range", "Western Ghats"], 1, "Geography", "The Vindhya Range marks the northern boundary of the Deccan Plateau."),
  q("India's currency, the Rupee, is regulated by:", ["SEBI", "RBI", "Finance Ministry directly", "NITI Aayog"], 1, "Economy", "The RBI regulates the issuance and management of the Indian Rupee."),
  q("Which is the smallest state in India by area?", ["Sikkim", "Goa", "Tripura", "Nagaland"], 1, "Geography", "Goa is the smallest Indian state by area."),
  q("Inflation in India is primarily measured using:", ["GDP growth rate", "Consumer Price Index (CPI)", "Fiscal deficit", "Repo rate"], 1, "Economy", "The Consumer Price Index (CPI) is the primary measure of retail inflation in India."),
  q("The Thar Desert is located primarily in which state?", ["Gujarat", "Rajasthan", "Haryana", "Punjab"], 1, "Geography", "The Thar Desert lies mostly in the state of Rajasthan."),
  q("Which sector contributes the most to India's GDP currently?", ["Agriculture", "Industry", "Services", "Mining"], 2, "Economy", "The services sector is the largest contributor to India's GDP."),
  q("The Sundarbans delta is formed by which rivers?", ["Ganga and Brahmaputra", "Godavari and Krishna", "Indus and Sutlej", "Narmada and Tapi"], 0, "Geography", "The Sundarbans delta is formed by the Ganga-Brahmaputra river system."),
  q("Disinvestment in India refers to:", ["Increasing government stake in PSUs", "Selling government stake in public sector undertakings", "Foreign direct investment", "Currency devaluation"], 1, "Economy", "Disinvestment involves the government selling its stake in public sector enterprises."),
  q("Which Indian state has the longest coastline?", ["Tamil Nadu", "Gujarat", "Andhra Pradesh", "Maharashtra"], 1, "Geography", "Gujarat has the longest coastline among Indian states."),
  q("The concept of 'Fiscal Deficit' refers to:", ["Total revenue minus total expenditure", "Total expenditure minus total receipts excluding borrowings", "Trade deficit", "Current account deficit"], 1, "Economy", "Fiscal deficit is the excess of total expenditure over total non-borrowed receipts."),
];

const SSC_QUESTIONS = [
  // Quant (20)
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = distance/time = 120/12 = 10 m/s."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = PRT/100 = 1000*10*2/100 = Rs.200."),
  q("A sum doubles itself in 8 years at simple interest. The rate of interest is:", ["10%", "12.5%", "8%", "15%"], 1, "Quant", "For doubling in 8 years at SI, rate = 100/8 = 12.5%."),
  q("If the ratio of two numbers is 3:4 and their sum is 63, the numbers are:", ["27 and 36", "21 and 42", "30 and 33", "18 and 45"], 0, "Quant", "3x+4x=63, so x=9; numbers are 27 and 36."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quant", "Average = (10+20+30+40+50)/5 = 150/5 = 30."),
  q("A shopkeeper sells an item for Rs.550 at a profit of 10%. The cost price is:", ["Rs.500", "Rs.495", "Rs.540", "Rs.505"], 0, "Quant", "CP = SP/(1+profit%) = 550/1.10 = Rs.500."),
  q("If 20% of a number is 50, the number is:", ["200", "250", "100", "150"], 1, "Quant", "20% of x = 50, so x = 50/0.20 = 250."),
  q("The compound interest on Rs.2000 at 10% p.a. for 2 years is:", ["Rs.400", "Rs.420", "Rs.440", "Rs.480"], 1, "Quant", "CI = 2000(1.1)² - 2000 = 2420 - 2000 = Rs.420."),
  q("A can complete a work in 10 days and B in 15 days. Working together, they can complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Quant", "Combined rate = 1/10 + 1/15 = 1/6, so together they take 6 days."),
  q("The perimeter of a square with side 8 cm is:", ["32 cm", "64 cm", "16 cm", "24 cm"], 0, "Quant", "Perimeter of a square = 4 × side = 4 × 8 = 32 cm."),
  q("If x:y = 2:3 and y:z = 4:5, then x:y:z is:", ["8:12:15", "2:3:5", "4:6:5", "8:6:15"], 0, "Quant", "Combining ratios: x:y=2:3=8:12, y:z=4:5=12:15, so x:y:z=8:12:15."),
  q("A person covers a distance at 40 km/h and returns at 60 km/h. The average speed for the whole journey is:", ["50 km/h", "48 km/h", "45 km/h", "52 km/h"], 1, "Quant", "Average speed = 2xy/(x+y) = 2×40×60/100 = 48 km/h."),
  q("The value of 15% of 200 is:", ["20", "30", "25", "35"], 1, "Quant", "15% of 200 = 0.15 × 200 = 30."),
  q("If the cost price of 10 articles equals the selling price of 8 articles, the profit percent is:", ["20%", "25%", "15%", "30%"], 1, "Quant", "Profit% = (10-8)/8 × 100 = 25%."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Quant", "12 × 12 = 144, so the square root is 12."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Quant", "1.2x = 60, so x = 50."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quant", "The lowest common multiple of 12 and 18 is 36."),
  q("If a car travels 240 km in 4 hours, its speed is:", ["50 km/h", "60 km/h", "40 km/h", "70 km/h"], 1, "Quant", "Speed = distance/time = 240/4 = 60 km/h."),
  q("The value of (25% of 80) + (10% of 200) is:", ["30", "40", "50", "60"], 1, "Quant", "25% of 80 = 20; 10% of 200 = 20; sum = 40."),
  q("A sum of Rs.5000 becomes Rs.5500 in one year at simple interest. The rate is:", ["10%", "8%", "12%", "5%"], 0, "Quant", "SI = 500, so rate = (500×100)/(5000×1) = 10%."),
  // Reasoning (20)
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Reasoning", "Each letter shifts +1: D->E, O->P, G->H."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Reasoning", "Differences are 4,6,8,10 — next term is 20+10=30."),
  q("If South-East becomes North and North-East becomes West, then South becomes:", ["North-East", "North-West", "South-East", "South-West"], 1, "Reasoning", "The direction system is rotated 135° clockwise, mapping South to North-West."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Reasoning", "Potato is a vegetable, while the others are fruits."),
  q("If '5 # 3' means 5+3, '5 @ 3' means 5-3, what is '8 # 2 @ 1'?", ["9", "11", "7", "10"], 0, "Reasoning", "8#2=10, then 10@1=9."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Reasoning", "The series skips one letter each time: A,C,E,G,I."),
  q("If in a certain code, BOOK is written as CPPL, then WORD is written as:", ["XPSE", "XQSE", "XPES", "YPSE"], 0, "Reasoning", "Each letter shifts +1: W->X, O->P, R->S, D->E, giving XPSE."),
  q("Pointing to a man, a woman says, 'His mother is the only daughter of my mother.' How is the woman related to the man?", ["Sister", "Mother", "Aunt", "Grandmother"], 1, "Reasoning", "The only daughter of the woman's mother is the woman herself, so she is the man's mother."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Reasoning", "Each term is multiplied by 3: 81×3=243."),
  q("Which word does NOT belong: Circle, Square, Triangle, Sphere", ["Circle", "Square", "Triangle", "Sphere"], 3, "Reasoning", "Sphere is a 3D shape, while the others are 2D shapes."),
  q("If Monday falls on the 1st of a month, what day falls on the 15th?", ["Monday", "Tuesday", "Sunday", "Wednesday"], 0, "Reasoning", "15-1=14 days later, which is exactly 2 weeks, so it's also Monday."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Reasoning", "Since A>B>C in height, C is the shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Reasoning", "These are perfect squares: 1²,2²,3²,4²,5²=25."),
  q("If all Roses are Flowers and all Flowers are Plants, then all Roses are:", ["Plants", "Trees", "Shrubs", "Weeds"], 0, "Reasoning", "By transitive logic, if Roses are Flowers and Flowers are Plants, then Roses are Plants."),
  q("Find the odd pair: (4,16), (5,25), (6,35), (7,49)", ["(4,16)", "(5,25)", "(6,35)", "(7,49)"], 2, "Reasoning", "In all other pairs, the second number is the square of the first; 6²=36, not 35."),
  q("A clock shows 3:00. What is the angle between the hour and minute hands?", ["45°", "90°", "60°", "75°"], 1, "Reasoning", "At 3:00, the hour hand is at 90° and minute hand at 0°, giving a 90° angle."),
  q("If 'Book' is called 'Pen,' 'Pen' is called 'Table,' what would you write with?", ["Book", "Pen", "Table", "None of these"], 2, "Reasoning", "Since Pen is called Table, you would 'write with Table' in this coded system."),
  q("Find the missing letter: B, D, F, H, ?", ["I", "J", "K", "L"], 1, "Reasoning", "The series skips one letter each time: B,D,F,H,J."),
  q("Six friends sit in a row. If P is to the immediate right of Q, and Q is at one end, P is:", ["At the other end", "Second from the left/right end where Q sits", "In the middle", "Cannot be determined"], 1, "Reasoning", "If Q is at one end and P is immediately to Q's right, P is the second person from that end."),
  q("Which number should replace the question mark: 7, 14, 28, 56, ?", ["84", "112", "98", "70"], 1, "Reasoning", "Each term doubles: 56×2=112."),
  // General Knowledge (20)
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "General Knowledge", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("The national bird of India is the:", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Knowledge", "The peacock (Pavo cristatus) is India's national bird."),
  q("Which is the smallest planet in the solar system?", ["Mars", "Mercury", "Venus", "Earth"], 1, "General Knowledge", "Mercury is the smallest planet in our solar system."),
  q("The headquarters of the United Nations is located in:", ["Geneva", "New York", "Paris", "London"], 1, "General Knowledge", "The UN headquarters is in New York City."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Knowledge", "Rabindranath Tagore wrote 'Jana Gana Mana,' India's national anthem."),
  q("The currency of Japan is the:", ["Yuan", "Yen", "Won", "Ringgit"], 1, "General Knowledge", "Japan's currency is the Yen."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "General Knowledge", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("The first Prime Minister of India was:", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi", "Rajendra Prasad"], 0, "General Knowledge", "Jawaharlal Nehru served as India's first Prime Minister from 1947."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "General Knowledge", "The Pacific Ocean is the largest and deepest ocean on Earth."),
  q("The Olympic Games are held every:", ["2 years", "4 years", "5 years", "3 years"], 1, "General Knowledge", "The Summer and Winter Olympics are each held every 4 years."),
  q("Who invented the telephone?", ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "James Watt"], 1, "General Knowledge", "Alexander Graham Bell is credited with inventing the telephone."),
  q("The Taj Mahal is located in which Indian city?", ["Delhi", "Agra", "Jaipur", "Lucknow"], 1, "General Knowledge", "The Taj Mahal is located in Agra, Uttar Pradesh."),
  q("Which country is known as the Land of the Rising Sun?", ["China", "Japan", "South Korea", "Thailand"], 1, "General Knowledge", "Japan is traditionally called the Land of the Rising Sun."),
  q("The study of birds is called:", ["Zoology", "Ornithology", "Entomology", "Botany"], 1, "General Knowledge", "Ornithology is the scientific study of birds."),
  q("India's first satellite was named:", ["Chandrayaan", "Aryabhata", "Mangalyaan", "INSAT"], 1, "General Knowledge", "Aryabhata, launched in 1975, was India's first satellite."),
  q("Which vitamin deficiency causes scurvy?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], 2, "General Knowledge", "Scurvy is caused by a deficiency of Vitamin C."),
  q("The Great Wall of China was built primarily to:", ["Promote trade", "Protect against invasions", "Mark territorial boundaries only", "Serve as a religious site"], 1, "General Knowledge", "The Great Wall was constructed mainly for defense against northern invasions."),
  q("Who is regarded as the Father of Computers?", ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"], 1, "General Knowledge", "Charles Babbage is credited as the Father of Computers for designing the Analytical Engine."),
  q("The Sun rises in the:", ["North", "South", "East", "West"], 2, "General Knowledge", "Due to Earth's rotation direction, the Sun appears to rise in the East."),
  q("Which Indian city is known as the 'Silicon Valley of India'?", ["Mumbai", "Bengaluru", "Chennai", "Hyderabad"], 1, "General Knowledge", "Bengaluru is popularly called India's Silicon Valley due to its IT industry concentration."),
];

const STATEPSC_QUESTIONS = [
  // General Studies mix (60) — broadly applicable across most State PSC prelims
  q("The Indian Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "Polity", "The Constitution was adopted by the Constituent Assembly on 26 November 1949, effective 26 January 1950."),
  q("Which is the largest state in India by area?", ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Uttar Pradesh"], 2, "Geography", "Rajasthan is India's largest state by land area."),
  q("Who was the first President of India?", ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "Dr. B.R. Ambedkar", "Sardar Patel"], 1, "Polity", "Dr. Rajendra Prasad served as India's first President, from 1950 to 1962."),
  q("Panchayati Raj Institutions operate at how many levels?", ["Two", "Three", "Four", "One"], 1, "Polity", "Panchayati Raj operates at three levels: village, block/intermediate, and district."),
  q("Which is the most populous state in India?", ["Maharashtra", "Bihar", "Uttar Pradesh", "West Bengal"], 2, "Geography", "Uttar Pradesh is India's most populous state."),
  q("The Right to Education is enshrined under which article?", ["Article 19", "Article 21A", "Article 25", "Article 30"], 1, "Polity", "Article 21A guarantees free and compulsory education for children aged 6-14."),
  q("Who was the Grand Old Man of India?", ["Bal Gangadhar Tilak", "Dadabhai Naoroji", "Gopal Krishna Gokhale", "Lala Lajpat Rai"], 1, "History", "Dadabhai Naoroji is popularly known as the 'Grand Old Man of India.'"),
  q("Which river is the longest in India?", ["Yamuna", "Ganga", "Godavari", "Narmada"], 1, "Geography", "The Ganga is the longest river flowing within India."),
  q("The Chief Minister of a state is appointed by the:", ["Prime Minister", "Governor", "President", "Chief Justice of the High Court"], 1, "Polity", "The Governor appoints the Chief Minister, usually the leader of the majority party in the state legislature."),
  q("India's Green Revolution is most associated with which crop?", ["Rice", "Wheat", "Cotton", "Sugarcane"], 1, "Economy", "The Green Revolution significantly boosted wheat production in India starting in the 1960s."),
  q("Who founded the Indian National Army (INA)?", ["Bhagat Singh", "Subhas Chandra Bose", "Chandrashekhar Azad", "Rash Behari Bose"], 3, "History", "The INA was originally founded by Rash Behari Bose, later led by Subhas Chandra Bose."),
  q("Which body is responsible for conducting elections in India?", ["Supreme Court", "Election Commission of India", "Parliament", "NITI Aayog"], 1, "Polity", "The Election Commission of India conducts and oversees elections at all levels."),
  q("The Sun is a:", ["Planet", "Star", "Satellite", "Comet"], 1, "Science", "The Sun is a star, the primary source of light and heat for the solar system."),
  q("Which is the smallest continent by area?", ["Europe", "Australia", "Antarctica", "South America"], 1, "Geography", "Australia is the smallest continent by land area."),
  q("The 'Doctrine of Lapse' was introduced by:", ["Lord Curzon", "Lord Dalhousie", "Lord Wellesley", "Lord Canning"], 1, "History", "Lord Dalhousie introduced the Doctrine of Lapse to annex princely states without heirs."),
  q("Which vitamin is essential for blood clotting?", ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin E"], 2, "Science", "Vitamin K plays a crucial role in blood clotting."),
  q("The Chief Justice of a High Court is appointed by the:", ["Governor", "President", "Prime Minister", "Chief Minister"], 1, "Polity", "The President appoints High Court Chief Justices in consultation with the Chief Justice of India."),
  q("Which is the second most populous country in the world?", ["USA", "India", "China", "Indonesia"], 1, "Geography", "As of recent estimates, India has become the most/second-most populous country, often cited alongside China."),
  q("The 'Champaran Satyagraha' was led by Gandhi to address issues faced by:", ["Textile workers", "Indigo farmers", "Salt workers", "Railway workers"], 1, "History", "Gandhi's first major Satyagraha in India addressed indigo farmers' grievances in Champaran, Bihar."),
  q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "Science", "Mars appears reddish due to iron oxide on its surface, earning it the nickname 'Red Planet.'"),
  q("The Preamble to the Indian Constitution declares India to be a:", ["Sovereign Socialist Secular Democratic Republic", "Sovereign Democratic Republic only", "Federal Socialist State", "Unitary Democratic State"], 0, "Polity", "The Preamble describes India as a Sovereign Socialist Secular Democratic Republic."),
  q("Who is known as the 'Iron Man of India'?", ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Bhagat Singh", "Subhas Chandra Bose"], 1, "History", "Sardar Patel is called the 'Iron Man of India' for unifying princely states post-independence."),
  q("The process of converting solid directly into gas is called:", ["Evaporation", "Sublimation", "Condensation", "Melting"], 1, "Science", "Sublimation is the direct transition of a solid to a gaseous state."),
  q("Which Indian state is known as the 'Rice Bowl of India'?", ["Punjab", "Andhra Pradesh", "Haryana", "Bihar"], 1, "Geography", "Andhra Pradesh is often referred to as the 'Rice Bowl of India' due to high rice production."),
  q("The Fundamental Duties of Indian citizens are listed under:", ["Article 51A", "Article 32", "Article 21", "Article 14"], 0, "Polity", "Article 51A lists the Fundamental Duties, added by the 42nd Amendment."),
  q("Who discovered the theory of gravity?", ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Johannes Kepler"], 1, "Science", "Isaac Newton formulated the law of universal gravitation."),
  q("The Battle of Panipat (1526) was fought between Babur and:", ["Ibrahim Lodi", "Rana Sanga", "Sher Shah Suri", "Humayun"], 0, "History", "The First Battle of Panipat (1526) was fought between Babur and Ibrahim Lodi, establishing Mughal rule."),
  q("Which organ in the human body produces insulin?", ["Liver", "Pancreas", "Kidney", "Stomach"], 1, "Science", "The pancreas produces insulin to regulate blood sugar levels."),
  q("The Indian Ocean is bordered by which continent to its north?", ["Africa", "Asia", "Australia", "Antarctica"], 1, "Geography", "Asia borders the Indian Ocean to the north."),
  q("Who was the first woman Prime Minister of India?", ["Sonia Gandhi", "Indira Gandhi", "Pratibha Patil", "Sushma Swaraj"], 1, "Polity", "Indira Gandhi became India's first female Prime Minister in 1966."),
  q("The study of earthquakes is called:", ["Geology", "Seismology", "Meteorology", "Volcanology"], 1, "Science", "Seismology is the scientific study of earthquakes and seismic waves."),
  q("Which is the capital of Australia?", ["Sydney", "Melbourne", "Canberra", "Perth"], 2, "Geography", "Canberra, not Sydney, is the capital of Australia."),
  q("The Mughal Empire was founded by:", ["Akbar", "Babur", "Humayun", "Shah Jahan"], 1, "History", "Babur founded the Mughal Empire in India after the First Battle of Panipat in 1526."),
  q("Which gas do plants absorb during photosynthesis?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2, "Science", "Plants absorb carbon dioxide during photosynthesis to produce glucose and oxygen."),
  q("The 'Quit India Movement' was launched at which session?", ["Lahore session", "Bombay session (AICC, 1942)", "Karachi session", "Lucknow session"], 1, "History", "The Quit India Resolution was passed at the Bombay AICC session in August 1942."),
  q("Which state shares a border with the maximum number of other Indian states?", ["Madhya Pradesh", "Uttar Pradesh", "Assam", "Rajasthan"], 1, "Geography", "Uttar Pradesh borders the largest number of other Indian states."),
  q("The three organs of the Indian government are the Legislature, Executive, and:", ["Bureaucracy", "Judiciary", "Military", "Media"], 1, "Polity", "The three organs of government are the Legislature, Executive, and Judiciary."),
  q("Which is the hardest natural substance on Earth?", ["Gold", "Iron", "Diamond", "Platinum"], 2, "Science", "Diamond is the hardest known natural substance."),
  q("The 'Cripps Mission' came to India in the year:", ["1940", "1942", "1946", "1935"], 1, "History", "The Cripps Mission arrived in India in March 1942, offering limited self-government proposals."),
  q("The State Legislative Council exists in how many Indian states currently (as a bicameral upper house)?", ["All states", "A select few states", "None", "Only union territories"], 1, "Polity", "Only a handful of Indian states (like Uttar Pradesh, Bihar, Maharashtra, Karnataka, Andhra Pradesh, Telangana) have a Legislative Council."),
  q("Which Indian city is called the 'Pink City'?", ["Udaipur", "Jaipur", "Jodhpur", "Jaisalmer"], 1, "Geography", "Jaipur is known as the 'Pink City' due to the pink-colored buildings in its old quarter."),
  q("The main function of red blood cells is to:", ["Fight infection", "Carry oxygen", "Clot blood", "Digest food"], 1, "Science", "Red blood cells carry oxygen from the lungs to tissues via hemoglobin."),
  q("Who was the founder of the Maratha Empire?", ["Shivaji Maharaj", "Baji Rao I", "Sambhaji", "Shahu"], 0, "History", "Chhatrapati Shivaji Maharaj founded the Maratha Empire in the 17th century."),
  q("Which is the longest mountain range in the world?", ["Himalayas", "Andes", "Rockies", "Alps"], 1, "Geography", "The Andes in South America is the longest continental mountain range in the world."),
  q("The concept of Fundamental Rights being justiciable means:", ["They can be enforced through courts", "They cannot be changed", "They apply only to citizens", "They are optional"], 0, "Polity", "Justiciable rights can be enforced by approaching courts if violated."),
  q("Which metal is liquid at room temperature?", ["Iron", "Mercury", "Aluminum", "Copper"], 1, "Science", "Mercury is the only metal that is liquid at standard room temperature."),
  q("The 'Poona Pact' of 1932 was signed between Gandhi and:", ["Jinnah", "B.R. Ambedkar", "Nehru", "Bose"], 1, "History", "The Poona Pact was signed between Gandhi and Ambedkar regarding representation of depressed classes."),
  q("Which is the largest desert in the world?", ["Thar Desert", "Sahara Desert", "Gobi Desert", "Kalahari Desert"], 1, "Geography", "The Sahara Desert in Africa is the largest hot desert in the world."),
  q("The Anti-Defection Law is contained in which schedule of the Constitution?", ["Ninth Schedule", "Tenth Schedule", "Eleventh Schedule", "Twelfth Schedule"], 1, "Polity", "The Tenth Schedule deals with disqualification on grounds of defection."),
  q("Which is the process by which green plants make their own food?", ["Respiration", "Transpiration", "Photosynthesis", "Digestion"], 2, "Science", "Photosynthesis is the process by which plants synthesize food using sunlight, water, and CO2."),
  q("The 'Wood's Despatch' of 1854 is related to:", ["Land reforms", "Education policy", "Railway expansion", "Judicial reforms"], 1, "History", "Wood's Despatch of 1854 laid down the framework for modern education in India."),
  q("Which is the largest bone in the human body?", ["Femur", "Humerus", "Tibia", "Radius"], 0, "Science", "The femur (thigh bone) is the longest and strongest bone in the human body."),
  q("The Governor of a state is appointed by the:", ["Chief Minister", "President", "Prime Minister", "State Legislature"], 1, "Polity", "The President appoints the Governor of each state."),
  q("Which was the first metal used by humans?", ["Iron", "Copper", "Bronze", "Gold"], 1, "History", "Copper is generally considered the first metal used by early humans, giving name to the Copper Age."),
  q("Which is the smallest state in India by population?", ["Sikkim", "Goa", "Mizoram", "Nagaland"], 0, "Geography", "Sikkim has the smallest population among Indian states."),
  q("The 'Rowlatt Act' of 1919 allowed the British government to:", ["Grant more autonomy", "Arrest and imprison without trial", "Reduce taxes", "Expand voting rights"], 1, "History", "The Rowlatt Act allowed detention without trial, sparking widespread protests in India."),
  q("Which blood group is known as the universal donor?", ["AB", "A", "B", "O negative"], 3, "Science", "O negative blood can be given to patients of any blood type, making it the universal donor."),
  q("India's National Emblem is adopted from which historical pillar?", ["Ashoka Pillar at Sarnath", "Iron Pillar of Delhi", "Qutub Minar", "Sanchi Stupa"], 0, "Polity", "India's National Emblem is derived from the Lion Capital of the Ashoka Pillar at Sarnath."),
  q("Which is the fastest land animal?", ["Lion", "Cheetah", "Horse", "Leopard"], 1, "Science", "The cheetah is the fastest land animal, capable of reaching speeds up to 100-120 km/h."),
  q("The 'Vernacular Press Act' of 1878 aimed to:", ["Promote Indian newspapers", "Restrict the Indian-language press", "Fund English newspapers", "Establish government newspapers"], 1, "History", "The Vernacular Press Act was enacted to curb criticism of British rule in Indian-language newspapers."),
];

const TESTS = [
  { id: "premium_upsc_1", title: "UPSC CSE Complete Practice Test — Polity, History & Geography", category: "UPSC CSE", questions: UPSC_QUESTIONS,
    description: "A full 60-question UPSC Prelims-style practice test covering Polity, Modern History, Geography, and Economy." },
  { id: "premium_ssc_1", title: "SSC CGL Complete Practice Test — Quant, Reasoning & GK", category: "SSC CGL", questions: SSC_QUESTIONS,
    description: "A full 60-question SSC CGL-pattern practice test covering Quantitative Aptitude, Reasoning, and General Knowledge." },
  { id: "premium_statepsc_1", title: "State PSC Complete Practice Test — General Studies", category: "State PSC", questions: STATEPSC_QUESTIONS,
    description: "A full 60-question general studies practice test covering Polity, History, Geography, and Science — broadly applicable across most State PSC prelims exams." },
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
