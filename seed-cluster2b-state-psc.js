// Cluster 2b — TNPSC, APPSC, APSC, SSC Exams
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster2b-state-psc.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const TNPSC_QUESTIONS = [
  q("Who was the first Chief Minister of Tamil Nadu (then Madras State)?", ["C.N. Annadurai", "K. Kamaraj", "M.G. Ramachandran", "M. Bhaktavatsalam"], 1, "Tamil Nadu GK", "K. Kamaraj served as Chief Minister of the then Madras State from 1954."),
  q("Madras State was renamed Tamil Nadu in the year:", ["1956", "1969", "1965", "1972"], 1, "Tamil Nadu GK", "Madras State was officially renamed Tamil Nadu in 1969."),
  q("Which is the longest river flowing through Tamil Nadu?", ["Cauvery", "Vaigai", "Tamiraparani", "Palar"], 0, "Tamil Nadu GK", "The Cauvery is the principal and longest river flowing through Tamil Nadu."),
  q("The Meenakshi Temple, a major landmark, is located in which city?", ["Chennai", "Madurai", "Coimbatore", "Trichy"], 1, "Tamil Nadu GK", "The Meenakshi Amman Temple is located in Madurai."),
  q("Who composed the Tamil epic 'Silappathikaram'?", ["Ilango Adigal", "Sekkizhar", "Kambar", "Thiruvalluvar"], 0, "Tamil Nadu GK", "Ilango Adigal is credited with composing the Tamil epic Silappathikaram."),
  q("Which Tamil Nadu city is known as the 'Manchester of South India'?", ["Madurai", "Coimbatore", "Salem", "Tiruppur"], 1, "Tamil Nadu GK", "Coimbatore is called the 'Manchester of South India' due to its textile industry."),
  q("The Kalpakkam nuclear power plant is located in which district?", ["Chennai", "Kanchipuram", "Vellore", "Cuddalore"], 1, "Tamil Nadu GK", "Kalpakkam Nuclear Power Station is located in Kanchipuram district."),
  q("Who wrote the Tamil classic 'Thirukkural'?", ["Kambar", "Thiruvalluvar", "Ilango Adigal", "Avvaiyar"], 1, "Tamil Nadu GK", "Thiruvalluvar authored the Thirukkural, a classic text on ethics and morality."),
  q("Tamil Nadu's Legislative Assembly is known as the:", ["Vidhan Sabha", "Legislative Assembly", "State Assembly", "All of these refer to the same body"], 3, "Tamil Nadu GK", "All these terms commonly refer to the state's Legislative Assembly."),
  q("Which hill station in Tamil Nadu is known as the 'Queen of Hill Stations'?", ["Kodaikanal", "Ooty (Udhagamandalam)", "Yercaud", "Coonoor"], 1, "Tamil Nadu GK", "Ooty is popularly called the 'Queen of Hill Stations.'"),
  q("The Marina Beach, one of the longest urban beaches in the world, is located in:", ["Chennai", "Rameswaram", "Kanyakumari", "Puducherry"], 0, "Tamil Nadu GK", "Marina Beach is located in Chennai."),
  q("Who was the founder of the Dravidian movement (Self-Respect Movement) in Tamil Nadu?", ["C.N. Annadurai", "Periyar E.V. Ramasamy", "M. Karunanidhi", "K. Kamaraj"], 1, "Tamil Nadu GK", "Periyar E.V. Ramasamy founded the Self-Respect Movement, the basis of the Dravidian movement."),
  q("Which is the capital city of Tamil Nadu?", ["Madurai", "Coimbatore", "Chennai", "Trichy"], 2, "Tamil Nadu GK", "Chennai is the capital of Tamil Nadu."),
  q("Kanyakumari, the southernmost tip of mainland India, is located in which state?", ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"], 1, "Tamil Nadu GK", "Kanyakumari is located in Tamil Nadu, at the southern tip of the Indian peninsula."),
  q("The Bharathiyar (Subramania Bharati), a famous Tamil poet, is closely associated with:", ["Freedom movement and Tamil literature", "Classical music only", "Modern architecture", "Science and technology"], 0, "Tamil Nadu GK", "Subramania Bharati was a nationalist poet whose works fueled the Indian freedom movement."),
  q("Which classical dance form originated in Tamil Nadu?", ["Kathak", "Bharatanatyam", "Odissi", "Kathakali"], 1, "Tamil Nadu GK", "Bharatanatyam is a classical dance form that originated in Tamil Nadu."),
  q("The Mudumalai Wildlife Sanctuary is located in which district of Tamil Nadu?", ["Nilgiris", "Erode", "Salem", "Dindigul"], 0, "Tamil Nadu GK", "Mudumalai Wildlife Sanctuary lies in the Nilgiris district."),
  q("Which port is the oldest artificial port in India, located in Tamil Nadu?", ["Chennai Port", "Tuticorin Port", "Ennore Port", "Cuddalore Port"], 0, "Tamil Nadu GK", "Chennai Port (Madras Port) is one of the oldest artificial harbors in India."),
  q("The Rock Fort Temple, a prominent landmark, is located in which Tamil Nadu city?", ["Madurai", "Tiruchirappalli (Trichy)", "Salem", "Vellore"], 1, "Tamil Nadu GK", "The Rock Fort Temple complex is a major landmark in Tiruchirappalli."),
  q("Which former Chief Minister of Tamil Nadu was also a noted film actor?", ["K. Kamaraj", "M.G. Ramachandran", "C. Rajagopalachari", "Rajaji"], 1, "Tamil Nadu GK", "M.G. Ramachandran (MGR) was a popular film actor who became Chief Minister of Tamil Nadu."),
  q("Fundamental Rights are enshrined in which Part of the Indian Constitution?", ["Part II", "Part III", "Part IV", "Part V"], 1, "Polity", "Fundamental Rights are covered under Part III, Articles 12-35."),
  q("Who was the first Prime Minister of independent India?", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Sardar Patel", "Rajendra Prasad"], 0, "History", "Jawaharlal Nehru served as India's first Prime Minister from 1947."),
  q("Which is the longest river in India?", ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], 1, "Geography", "The Ganga is the longest river flowing within India."),
  q("The process by which green plants make their own food is called:", ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], 1, "Science", "Photosynthesis is the process by which plants synthesize food using sunlight."),
  q("India's Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "Polity", "The Constitution was adopted on 26 November 1949, effective from 26 January 1950."),
  q("Who founded the Indian National Congress?", ["A.O. Hume", "Dadabhai Naoroji", "W.C. Banerjee", "Surendranath Banerjee"], 0, "History", "A.O. Hume founded the Indian National Congress in 1885."),
  q("Which is the smallest planet in the solar system?", ["Venus", "Mercury", "Mars", "Earth"], 1, "Science", "Mercury is the smallest planet in our solar system."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "Economy", "The RBI was established on 1 April 1935."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "Science", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quant", "Average = (10+20+30+40+50)/5 = 30."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = distance/time = 120/12 = 10 m/s."),
  q("Find the next number in the series: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Reasoning", "Differences are 4,6,8,10 — next term is 20+10=30."),
  q("The Quit India Movement was launched in the year:", ["1930", "1942", "1935", "1947"], 1, "History", "Gandhi launched the Quit India Movement in August 1942."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "Geography", "The Pacific Ocean is the largest and deepest ocean on Earth."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "Polity", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("The Battle of Plassey was fought in the year:", ["1757", "1764", "1857", "1770"], 0, "History", "The Battle of Plassey (1757) established British dominance in Bengal."),
  q("Which vitamin deficiency causes scurvy?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], 2, "Science", "Scurvy is caused by a deficiency of Vitamin C."),
  q("GST in India was implemented in the year:", ["2015", "2016", "2017", "2019"], 2, "Economy", "GST was implemented across India on 1 July 2017."),
  q("The national bird of India is the:", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Knowledge", "The peacock is India's national bird."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Knowledge", "Rabindranath Tagore wrote 'Jana Gana Mana.'"),
  q("The Preamble to the Indian Constitution was amended by which amendment?", ["24th", "42nd", "44th", "52nd"], 1, "Polity", "The 42nd Amendment (1976) added 'Socialist, Secular, Integrity' to the Preamble."),
  q("The Non-Cooperation Movement was launched in which year?", ["1920", "1930", "1942", "1919"], 0, "History", "Gandhi launched the Non-Cooperation Movement in 1920."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], 1, "Science", "Mitochondria generate ATP through cellular respiration."),
  q("Which body recommends distribution of tax revenue between Centre and States?", ["Planning Commission", "Finance Commission", "NITI Aayog", "GST Council"], 1, "Polity", "The Finance Commission recommends tax revenue distribution, per Article 280."),
  q("Which is the highest mountain peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Nanga Parbat"], 2, "Geography", "Mount Everest is the highest peak in the world, located in the Himalayas."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = PRT/100 = 1000*10*2/100 = Rs.200."),
  q("Who was the last Mughal emperor?", ["Akbar II", "Bahadur Shah Zafar", "Shah Alam II", "Jahandar Shah"], 1, "History", "Bahadur Shah Zafar was the last Mughal emperor."),
  q("The functional unit of the kidney is the:", ["Neuron", "Nephron", "Alveolus", "Villus"], 1, "Science", "The nephron is the structural and functional unit of the kidney."),
  q("Panchayati Raj Institutions were given constitutional status by the:", ["42nd Amendment", "44th Amendment", "73rd Amendment", "74th Amendment"], 2, "Polity", "The 73rd Amendment Act, 1992, gave constitutional status to Panchayati Raj."),
  q("Which Indian state is known as the 'Rice Bowl of India'?", ["Punjab", "Andhra Pradesh", "Haryana", "Bihar"], 1, "Geography", "Andhra Pradesh is often referred to as the 'Rice Bowl of India.'"),
  q("Money Bills can only be introduced in:", ["Rajya Sabha", "Lok Sabha", "Either House", "State Legislature"], 1, "Polity", "Article 110 stipulates Money Bills can only originate in the Lok Sabha."),
  q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "Science", "Mars appears reddish due to iron oxide on its surface."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quant", "The lowest common multiple of 12 and 18 is 36."),
  q("The Jallianwala Bagh massacre took place in which city?", ["Delhi", "Amritsar", "Lahore", "Lucknow"], 1, "History", "The massacre occurred in Amritsar in April 1919."),
  q("Which is the currency of Japan?", ["Yuan", "Yen", "Won", "Ringgit"], 1, "General Knowledge", "Japan's currency is the Yen."),
  q("Which vitamin is essential for blood clotting?", ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin E"], 2, "Science", "Vitamin K plays a crucial role in blood clotting."),
  q("NITI Aayog replaced which earlier body?", ["Finance Commission", "Planning Commission", "GST Council", "RBI"], 1, "Economy", "NITI Aayog was formed in 2015, replacing the Planning Commission."),
  q("The study of birds is called:", ["Zoology", "Ornithology", "Entomology", "Botany"], 1, "General Knowledge", "Ornithology is the scientific study of birds."),
  q("If South-East becomes North and North-East becomes West, then South becomes:", ["North-East", "North-West", "South-East", "South-West"], 1, "Reasoning", "The direction system rotated 135° clockwise maps South to North-West."),
  q("The Directive Principles of State Policy are contained in which Part of the Constitution?", ["Part III", "Part IV", "Part V", "Part VI"], 1, "Polity", "Directive Principles are laid out in Part IV, Articles 36-51."),
];

const APPSC_QUESTIONS = [
  q("Who was the first Chief Minister of Andhra Pradesh?", ["N.T. Rama Rao", "Neelam Sanjiva Reddy", "Kasu Brahmananda Reddy", "Damodaram Sanjivayya"], 1, "Andhra Pradesh GK", "Neelam Sanjiva Reddy became the first Chief Minister of Andhra Pradesh in 1956."),
  q("Andhra Pradesh was formed as a separate state in the year:", ["1953", "1956", "1960", "2014"], 1, "Andhra Pradesh GK", "Andhra Pradesh was formed in 1956 by merging Andhra State with Telangana (part of Hyderabad State)."),
  q("The current capital of Andhra Pradesh (post-bifurcation) is being developed as:", ["Hyderabad", "Amaravati", "Visakhapatnam", "Vijayawada"], 1, "Andhra Pradesh GK", "Amaravati has been designated as the planned capital of Andhra Pradesh after the 2014 bifurcation."),
  q("Which river is central to the Andhra Pradesh delta regions?", ["Cauvery and Tungabhadra", "Krishna and Godavari", "Krishna and Cauvery", "Godavari and Penna"], 1, "Andhra Pradesh GK", "The Krishna and Godavari rivers form the fertile delta regions central to Andhra Pradesh's agriculture."),
  q("The Tirumala Venkateswara Temple is located near which Andhra Pradesh city?", ["Vijayawada", "Tirupati", "Visakhapatnam", "Kurnool"], 1, "Andhra Pradesh GK", "The Tirumala temple is located near Tirupati."),
  q("Andhra Pradesh was bifurcated to form Telangana in the year:", ["2000", "2010", "2014", "2019"], 2, "Andhra Pradesh GK", "Telangana was carved out of Andhra Pradesh in June 2014."),
  q("Which Andhra Pradesh port is a major port on India's east coast?", ["Kochi", "Visakhapatnam", "Chennai", "Paradip"], 1, "Andhra Pradesh GK", "Visakhapatnam Port is a major port on India's east coast, located in Andhra Pradesh."),
  q("The classical dance form Kuchipudi originated in which state?", ["Tamil Nadu", "Andhra Pradesh", "Odisha", "Kerala"], 1, "Andhra Pradesh GK", "Kuchipudi originated in Andhra Pradesh."),
  q("Which is the longest river flowing through Andhra Pradesh?", ["Krishna", "Godavari", "Penna", "Tungabhadra"], 1, "Andhra Pradesh GK", "The Godavari is the longest river flowing through Andhra Pradesh."),
  q("The Nagarjuna Sagar Dam is built on which river?", ["Godavari", "Krishna", "Penna", "Tungabhadra"], 1, "Andhra Pradesh GK", "The Nagarjuna Sagar Dam is constructed across the Krishna River."),
  q("Amaravati, the ancient Buddhist site, is located in which Andhra Pradesh district?", ["Guntur", "Krishna", "Kurnool", "Chittoor"], 0, "Andhra Pradesh GK", "The ancient Buddhist site of Amaravati is located in Guntur district."),
  q("Which language is the official language of Andhra Pradesh?", ["Tamil", "Telugu", "Kannada", "Malayalam"], 1, "Andhra Pradesh GK", "Telugu is the official language of Andhra Pradesh."),
  q("The Araku Valley is located near which city?", ["Vijayawada", "Visakhapatnam", "Kurnool", "Nellore"], 1, "Andhra Pradesh GK", "Araku Valley is a hill station located near Visakhapatnam."),
  q("Who was a prominent freedom fighter from Andhra Pradesh known as 'Andhra Kesari'?", ["Alluri Sitarama Raju", "Tanguturi Prakasam", "Potti Sriramulu", "N.G. Ranga"], 1, "Andhra Pradesh GK", "Tanguturi Prakasam Pantulu was popularly known as 'Andhra Kesari.'"),
  q("Potti Sriramulu's death led to the formation of which state?", ["Telangana", "Andhra State", "Karnataka", "Tamil Nadu"], 1, "Andhra Pradesh GK", "Potti Sriramulu's fast unto death in 1952 led to the formation of Andhra State in 1953."),
  q("Which Andhra Pradesh region is fertile due to the Godavari delta?", ["East Godavari", "Anantapur", "Kurnool", "Kadapa"], 0, "Andhra Pradesh GK", "The East Godavari district, part of the fertile delta region, is a major rice-producing area."),
  q("The Srisailam Dam is built across which river?", ["Godavari", "Krishna", "Penna", "Tungabhadra"], 1, "Andhra Pradesh GK", "The Srisailam Dam is constructed on the Krishna River."),
  q("Visakhapatnam is well known for hosting which major industry?", ["IT services only", "Steel and shipbuilding", "Textile only", "Film industry"], 1, "Andhra Pradesh GK", "Visakhapatnam is known for its steel plant and shipbuilding industry."),
  q("Andhra University, one of the oldest universities in the state, is located in:", ["Guntur", "Visakhapatnam", "Vijayawada", "Tirupati"], 1, "Andhra Pradesh GK", "Andhra University is located in Visakhapatnam."),
  q("Which Andhra Pradesh Chief Minister founded the Telugu Desam Party?", ["Y.S. Rajasekhara Reddy", "N.T. Rama Rao", "Chandrababu Naidu", "N. Janardhana Reddy"], 1, "Andhra Pradesh GK", "N.T. Rama Rao (NTR) founded the Telugu Desam Party in 1982."),
  q("Fundamental Rights are enshrined in which Part of the Indian Constitution?", ["Part II", "Part III", "Part IV", "Part V"], 1, "Polity", "Fundamental Rights are covered under Part III, Articles 12-35."),
  q("Who was the first Prime Minister of independent India?", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Sardar Patel", "Rajendra Prasad"], 0, "History", "Jawaharlal Nehru served as India's first Prime Minister from 1947."),
  q("Which is the longest river in India?", ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], 1, "Geography", "The Ganga is the longest river flowing within India."),
  q("The process by which green plants make their own food is called:", ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], 1, "Science", "Photosynthesis is the process by which plants synthesize food using sunlight."),
  q("India's Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "Polity", "The Constitution was adopted on 26 November 1949, effective from 26 January 1950."),
  q("Who founded the Indian National Congress?", ["A.O. Hume", "Dadabhai Naoroji", "W.C. Banerjee", "Surendranath Banerjee"], 0, "History", "A.O. Hume founded the Indian National Congress in 1885."),
  q("Which is the smallest planet in the solar system?", ["Venus", "Mercury", "Mars", "Earth"], 1, "Science", "Mercury is the smallest planet in our solar system."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "Economy", "The RBI was established on 1 April 1935."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "Science", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quant", "Average = (10+20+30+40+50)/5 = 30."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = distance/time = 120/12 = 10 m/s."),
  q("Find the next number in the series: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Reasoning", "Differences are 4,6,8,10 — next term is 20+10=30."),
  q("The Quit India Movement was launched in the year:", ["1930", "1942", "1935", "1947"], 1, "History", "Gandhi launched the Quit India Movement in August 1942."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "Geography", "The Pacific Ocean is the largest and deepest ocean on Earth."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "Polity", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("The Battle of Plassey was fought in the year:", ["1757", "1764", "1857", "1770"], 0, "History", "The Battle of Plassey (1757) established British dominance in Bengal."),
  q("Which vitamin deficiency causes scurvy?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], 2, "Science", "Scurvy is caused by a deficiency of Vitamin C."),
  q("GST in India was implemented in the year:", ["2015", "2016", "2017", "2019"], 2, "Economy", "GST was implemented across India on 1 July 2017."),
  q("The national bird of India is the:", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Knowledge", "The peacock is India's national bird."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Knowledge", "Rabindranath Tagore wrote 'Jana Gana Mana.'"),
  q("The Preamble to the Indian Constitution was amended by which amendment?", ["24th", "42nd", "44th", "52nd"], 1, "Polity", "The 42nd Amendment (1976) added 'Socialist, Secular, Integrity' to the Preamble."),
  q("The Non-Cooperation Movement was launched in which year?", ["1920", "1930", "1942", "1919"], 0, "History", "Gandhi launched the Non-Cooperation Movement in 1920."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], 1, "Science", "Mitochondria generate ATP through cellular respiration."),
  q("Which body recommends distribution of tax revenue between Centre and States?", ["Planning Commission", "Finance Commission", "NITI Aayog", "GST Council"], 1, "Polity", "The Finance Commission recommends tax revenue distribution, per Article 280."),
  q("Which is the highest mountain peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Nanga Parbat"], 2, "Geography", "Mount Everest is the highest peak in the world."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = PRT/100 = 1000*10*2/100 = Rs.200."),
  q("Who was the last Mughal emperor?", ["Akbar II", "Bahadur Shah Zafar", "Shah Alam II", "Jahandar Shah"], 1, "History", "Bahadur Shah Zafar was the last Mughal emperor."),
  q("The functional unit of the kidney is the:", ["Neuron", "Nephron", "Alveolus", "Villus"], 1, "Science", "The nephron is the structural and functional unit of the kidney."),
  q("Panchayati Raj Institutions were given constitutional status by the:", ["42nd Amendment", "44th Amendment", "73rd Amendment", "74th Amendment"], 2, "Polity", "The 73rd Amendment Act, 1992, gave constitutional status to Panchayati Raj."),
  q("Money Bills can only be introduced in:", ["Rajya Sabha", "Lok Sabha", "Either House", "State Legislature"], 1, "Polity", "Article 110 stipulates Money Bills can only originate in the Lok Sabha."),
  q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "Science", "Mars appears reddish due to iron oxide on its surface."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quant", "The lowest common multiple of 12 and 18 is 36."),
  q("The Jallianwala Bagh massacre took place in which city?", ["Delhi", "Amritsar", "Lahore", "Lucknow"], 1, "History", "The massacre occurred in Amritsar in April 1919."),
  q("Which is the currency of Japan?", ["Yuan", "Yen", "Won", "Ringgit"], 1, "General Knowledge", "Japan's currency is the Yen."),
  q("Which vitamin is essential for blood clotting?", ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin E"], 2, "Science", "Vitamin K plays a crucial role in blood clotting."),
  q("NITI Aayog replaced which earlier body?", ["Finance Commission", "Planning Commission", "GST Council", "RBI"], 1, "Economy", "NITI Aayog was formed in 2015, replacing the Planning Commission."),
  q("The study of birds is called:", ["Zoology", "Ornithology", "Entomology", "Botany"], 1, "General Knowledge", "Ornithology is the scientific study of birds."),
  q("If South-East becomes North and North-East becomes West, then South becomes:", ["North-East", "North-West", "South-East", "South-West"], 1, "Reasoning", "The direction system rotated 135° clockwise maps South to North-West."),
  q("The Directive Principles of State Policy are contained in which Part of the Constitution?", ["Part III", "Part IV", "Part V", "Part VI"], 1, "Polity", "Directive Principles are laid out in Part IV, Articles 36-51."),
  q("Who is known as the 'Iron Man of India'?", ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Bhagat Singh", "Subhas Chandra Bose"], 1, "History", "Sardar Patel is called the 'Iron Man of India.'"),
];

const APSC_QUESTIONS = [
  q("Who was the first Chief Minister of Assam after independence?", ["Gopinath Bordoloi", "Bishnuram Medhi", "Sarat Chandra Sinha", "Hiteswar Saikia"], 0, "Assam GK", "Gopinath Bordoloi became Assam's first Chief Minister after independence in 1947."),
  q("Which river is the principal river flowing through Assam?", ["Ganga", "Brahmaputra", "Yamuna", "Godavari"], 1, "Assam GK", "The Brahmaputra is the major river flowing through the Assam Valley."),
  q("The Kaziranga National Park, famous for one-horned rhinoceros, is located in:", ["Meghalaya", "Assam", "Nagaland", "Manipur"], 1, "Assam GK", "Kaziranga National Park in Assam is renowned for its one-horned rhinoceros population."),
  q("What is the capital of Assam?", ["Guwahati", "Dispur", "Silchar", "Jorhat"], 1, "Assam GK", "Dispur, part of Guwahati, is the official capital of Assam."),
  q("Assam is well known for the production of which beverage crop?", ["Coffee", "Tea", "Cocoa", "Cashew"], 1, "Assam GK", "Assam is one of the largest tea-producing regions in the world."),
  q("The Ahom dynasty ruled Assam for approximately how many years?", ["100 years", "300 years", "600 years", "900 years"], 2, "Assam GK", "The Ahom dynasty ruled Assam for roughly 600 years, from the 13th to 19th century."),
  q("Which festival is the most important cultural festival of Assam?", ["Durga Puja", "Bihu", "Onam", "Pongal"], 1, "Assam GK", "Bihu is the most significant and widely celebrated festival in Assam."),
  q("The Kamakhya Temple is located near which city?", ["Silchar", "Guwahati", "Jorhat", "Dibrugarh"], 1, "Assam GK", "The Kamakhya Temple is located on Nilachal Hill near Guwahati."),
  q("Majuli, the largest river island in the world, sits in which river?", ["Ganga", "Brahmaputra", "Yamuna", "Krishna"], 1, "Assam GK", "Majuli is a large river island situated in the Brahmaputra River in Assam."),
  q("The Ahoms repelled Mughal invasions notably at the Battle of:", ["Plassey", "Saraighat", "Panipat", "Haldighati"], 1, "Assam GK", "The Battle of Saraighat (1671) saw the Ahoms defeat the Mughal navy."),
  q("Assam shares an international border with which country?", ["Nepal", "Bhutan only", "Bangladesh", "Myanmar directly"], 2, "Assam GK", "Assam shares a border with Bangladesh."),
  q("The Brahmaputra river originates in which region?", ["Western Ghats", "Tibet", "Himachal Pradesh", "Nepal"], 1, "Assam GK", "The Brahmaputra originates in Tibet before flowing into Assam."),
  q("Which classical dance form is native to Assam?", ["Bharatanatyam", "Sattriya", "Kathak", "Odissi"], 1, "Assam GK", "Sattriya is the classical dance form that originated in Assam."),
  q("Srimanta Sankardeva is credited with founding which movement in Assam?", ["Neo-Vaishnavism", "Freedom movement", "Education reform only", "Industrial movement"], 0, "Assam GK", "Srimanta Sankardeva founded the Neo-Vaishnavite movement in 15th-16th century Assam."),
  q("Which is the largest city in Assam?", ["Dispur", "Guwahati", "Silchar", "Dibrugarh"], 1, "Assam GK", "Guwahati is the largest city in Assam."),
  q("The Assam Accord was signed in which year?", ["1975", "1985", "1990", "2000"], 1, "Assam GK", "The Assam Accord was signed in 1985."),
  q("Which wildlife sanctuary in Assam is known for pygmy hogs and wild buffalo?", ["Kaziranga", "Manas National Park", "Nameri", "Orang"], 1, "Assam GK", "Manas National Park is known for pygmy hogs and wild buffalo."),
  q("Dibrugarh in Assam is often called the:", ["Tea City of India", "Silicon Valley of India", "Manchester of India", "Steel City of India"], 0, "Assam GK", "Dibrugarh is known as the 'Tea City of India.'"),
  q("The state language of Assam is:", ["Bengali", "Assamese", "Hindi", "Bodo"], 1, "Assam GK", "Assamese is the official language of Assam."),
  q("Which Assam freedom fighters are remembered from the Quit India Movement?", ["Kanaklata Barua", "Gopinath Bordoloi", "Bishnu Rabha", "Both Kanaklata Barua and Bishnu Rabha"], 3, "Assam GK", "Both Kanaklata Barua and Bishnu Rabha are prominent Assam freedom fighters."),
  q("Fundamental Rights are enshrined in which Part of the Indian Constitution?", ["Part II", "Part III", "Part IV", "Part V"], 1, "Polity", "Fundamental Rights are covered under Part III, Articles 12-35."),
  q("Who was the first Prime Minister of independent India?", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Sardar Patel", "Rajendra Prasad"], 0, "History", "Jawaharlal Nehru served as India's first Prime Minister from 1947."),
  q("Which is the longest river in India?", ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], 1, "Geography", "The Ganga is the longest river flowing within India."),
  q("The process by which green plants make their own food is called:", ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], 1, "Science", "Photosynthesis is the process by which plants synthesize food using sunlight."),
  q("India's Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "Polity", "The Constitution was adopted on 26 November 1949, effective from 26 January 1950."),
  q("Who founded the Indian National Congress?", ["A.O. Hume", "Dadabhai Naoroji", "W.C. Banerjee", "Surendranath Banerjee"], 0, "History", "A.O. Hume founded the Indian National Congress in 1885."),
  q("Which is the smallest planet in the solar system?", ["Venus", "Mercury", "Mars", "Earth"], 1, "Science", "Mercury is the smallest planet in our solar system."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "Economy", "The RBI was established on 1 April 1935."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "Science", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quant", "Average = (10+20+30+40+50)/5 = 30."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = distance/time = 120/12 = 10 m/s."),
  q("Find the next number in the series: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Reasoning", "Differences are 4,6,8,10 — next term is 20+10=30."),
  q("The Quit India Movement was launched in the year:", ["1930", "1942", "1935", "1947"], 1, "History", "Gandhi launched the Quit India Movement in August 1942."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "Geography", "The Pacific Ocean is the largest and deepest ocean on Earth."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "Polity", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("The Battle of Plassey was fought in the year:", ["1757", "1764", "1857", "1770"], 0, "History", "The Battle of Plassey (1757) established British dominance in Bengal."),
  q("Which vitamin deficiency causes scurvy?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], 2, "Science", "Scurvy is caused by a deficiency of Vitamin C."),
  q("GST in India was implemented in the year:", ["2015", "2016", "2017", "2019"], 2, "Economy", "GST was implemented across India on 1 July 2017."),
  q("The national bird of India is the:", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Knowledge", "The peacock is India's national bird."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Knowledge", "Rabindranath Tagore wrote 'Jana Gana Mana.'"),
  q("The Preamble to the Indian Constitution was amended by which amendment?", ["24th", "42nd", "44th", "52nd"], 1, "Polity", "The 42nd Amendment (1976) added 'Socialist, Secular, Integrity' to the Preamble."),
  q("The Non-Cooperation Movement was launched in which year?", ["1920", "1930", "1942", "1919"], 0, "History", "Gandhi launched the Non-Cooperation Movement in 1920."),
  q("The powerhouse of the cell is the:", ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], 1, "Science", "Mitochondria generate ATP through cellular respiration."),
  q("Which body recommends distribution of tax revenue between Centre and States?", ["Planning Commission", "Finance Commission", "NITI Aayog", "GST Council"], 1, "Polity", "The Finance Commission recommends tax revenue distribution, per Article 280."),
  q("Which is the highest mountain peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Nanga Parbat"], 2, "Geography", "Mount Everest is the highest peak in the world."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = PRT/100 = 1000*10*2/100 = Rs.200."),
  q("Who was the last Mughal emperor?", ["Akbar II", "Bahadur Shah Zafar", "Shah Alam II", "Jahandar Shah"], 1, "History", "Bahadur Shah Zafar was the last Mughal emperor."),
  q("The functional unit of the kidney is the:", ["Neuron", "Nephron", "Alveolus", "Villus"], 1, "Science", "The nephron is the structural and functional unit of the kidney."),
  q("Panchayati Raj Institutions were given constitutional status by the:", ["42nd Amendment", "44th Amendment", "73rd Amendment", "74th Amendment"], 2, "Polity", "The 73rd Amendment Act, 1992, gave constitutional status to Panchayati Raj."),
  q("Money Bills can only be introduced in:", ["Rajya Sabha", "Lok Sabha", "Either House", "State Legislature"], 1, "Polity", "Article 110 stipulates Money Bills can only originate in the Lok Sabha."),
  q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "Science", "Mars appears reddish due to iron oxide on its surface."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quant", "The lowest common multiple of 12 and 18 is 36."),
  q("The Jallianwala Bagh massacre took place in which city?", ["Delhi", "Amritsar", "Lahore", "Lucknow"], 1, "History", "The massacre occurred in Amritsar in April 1919."),
  q("Which is the currency of Japan?", ["Yuan", "Yen", "Won", "Ringgit"], 1, "General Knowledge", "Japan's currency is the Yen."),
  q("Which vitamin is essential for blood clotting?", ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin E"], 2, "Science", "Vitamin K plays a crucial role in blood clotting."),
  q("NITI Aayog replaced which earlier body?", ["Finance Commission", "Planning Commission", "GST Council", "RBI"], 1, "Economy", "NITI Aayog was formed in 2015, replacing the Planning Commission."),
  q("The study of birds is called:", ["Zoology", "Ornithology", "Entomology", "Botany"], 1, "General Knowledge", "Ornithology is the scientific study of birds."),
  q("If South-East becomes North and North-East becomes West, then South becomes:", ["North-East", "North-West", "South-East", "South-West"], 1, "Reasoning", "The direction system rotated 135° clockwise maps South to North-West."),
  q("The Directive Principles of State Policy are contained in which Part of the Constitution?", ["Part III", "Part IV", "Part V", "Part VI"], 1, "Polity", "Directive Principles are laid out in Part IV, Articles 36-51."),
  q("Who is known as the 'Iron Man of India'?", ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Bhagat Singh", "Subhas Chandra Bose"], 1, "History", "Sardar Patel is called the 'Iron Man of India.'"),
];

const SSCEXAMS_QUESTIONS = [
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "English", "'Abundant' means existing in large quantities, synonymous with 'plentiful.'"),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "English", "'Ancient' means very old, so its antonym is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "English", "The correct spelling is 'receive.'"),
  q("Fill in the blank: She ___ to the market yesterday.", ["go", "goes", "went", "going"], 2, "English", "Since the sentence refers to yesterday (past), the correct form is 'went.'"),
  q("Choose the correct meaning of the idiom 'Once in a blue moon':", ["Very frequently", "Rarely", "Every night", "Regularly"], 1, "English", "'Once in a blue moon' means something that happens very rarely."),
  q("Identify the correctly punctuated sentence:", ["Where are you going.", "Where are you going", "Where are you going?", "where are you going?"], 2, "English", "A question must end with a question mark and begin with a capital letter."),
  q("Choose the correct passive voice: 'She writes a letter.'", ["A letter is written by her.", "A letter was written by her.", "A letter written by her.", "A letter is writing by her."], 0, "English", "Present tense active 'writes' converts to present tense passive 'is written.'"),
  q("Choose the correct plural form of 'Child':", ["Childs", "Childes", "Children", "Childrens"], 2, "English", "'Children' is the correct irregular plural of 'child.'"),
  q("Identify the noun in the sentence: 'The dog ran quickly.'", ["ran", "quickly", "dog", "the"], 2, "English", "'Dog' is the noun, the subject performing the action."),
  q("Choose the correct preposition: She is good ___ mathematics.", ["in", "at", "on", "with"], 1, "English", "The correct idiomatic preposition is 'good at' for skills/subjects."),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "English", "Third-person singular negative present tense requires 'doesn't' + base verb form."),
  q("Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "English", "'Joyful' is a synonym of 'happy.'"),
  q("Choose the correct article: ___ university is a place of higher learning.", ["A", "An", "The", "No article needed"], 0, "English", "'University' starts with a consonant sound, so 'a' is used, not 'an.'"),
  q("Identify the verb in the sentence: 'They played football yesterday.'", ["They", "played", "football", "yesterday"], 1, "English", "'Played' is the verb, indicating the action performed."),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "English", "'Stingy' is the opposite of 'generous.'"),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quant", "Average = (10+20+30+40+50)/5 = 30."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = distance/time = 120/12 = 10 m/s."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = PRT/100 = 1000*10*2/100 = Rs.200."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quant", "The lowest common multiple of 12 and 18 is 36."),
  q("If 20% of a number is 50, the number is:", ["200", "250", "100", "150"], 1, "Quant", "20% of x = 50, so x = 250."),
  q("The value of 15% of 200 is:", ["20", "30", "25", "35"], 1, "Quant", "15% of 200 = 30."),
  q("A shopkeeper sells an item for Rs.550 at a profit of 10%. The cost price is:", ["Rs.500", "Rs.495", "Rs.540", "Rs.505"], 0, "Quant", "CP = SP/(1+profit%) = 550/1.10 = Rs.500."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Quant", "12 × 12 = 144."),
  q("If the ratio of two numbers is 3:4 and their sum is 63, the numbers are:", ["27 and 36", "21 and 42", "30 and 33", "18 and 45"], 0, "Quant", "3x+4x=63, so x=9; numbers are 27 and 36."),
  q("A can complete a work in 10 days and B in 15 days. Working together, they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Quant", "Combined rate = 1/10 + 1/15 = 1/6, so together they take 6 days."),
  q("The perimeter of a square with side 8 cm is:", ["32 cm", "64 cm", "16 cm", "24 cm"], 0, "Quant", "Perimeter of a square = 4 × side = 32 cm."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Quant", "1.2x = 60, so x = 50."),
  q("A person covers a distance at 40 km/h and returns at 60 km/h. The average speed is:", ["50 km/h", "48 km/h", "45 km/h", "52 km/h"], 1, "Quant", "Average speed = 2xy/(x+y) = 48 km/h."),
  q("The value of (25% of 80) + (10% of 200) is:", ["30", "40", "50", "60"], 1, "Quant", "25% of 80 = 20; 10% of 200 = 20; sum = 40."),
  q("A sum of Rs.5000 becomes Rs.5500 in one year at simple interest. The rate is:", ["10%", "8%", "12%", "5%"], 0, "Quant", "SI = 500, so rate = 10%."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "General Knowledge", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("The national bird of India is the:", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Knowledge", "The peacock is India's national bird."),
  q("Which is the smallest planet in the solar system?", ["Mars", "Mercury", "Venus", "Earth"], 1, "General Knowledge", "Mercury is the smallest planet."),
  q("The headquarters of the United Nations is located in:", ["Geneva", "New York", "Paris", "London"], 1, "General Knowledge", "The UN headquarters is in New York City."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Knowledge", "Rabindranath Tagore wrote 'Jana Gana Mana.'"),
  q("The currency of Japan is the:", ["Yuan", "Yen", "Won", "Ringgit"], 1, "General Knowledge", "Japan's currency is the Yen."),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "General Knowledge", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("The first Prime Minister of India was:", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi", "Rajendra Prasad"], 0, "General Knowledge", "Jawaharlal Nehru served as India's first Prime Minister."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "General Knowledge", "The Pacific Ocean is the largest ocean."),
  q("The Olympic Games are held every:", ["2 years", "4 years", "5 years", "3 years"], 1, "General Knowledge", "The Olympics are held every 4 years."),
  q("Who invented the telephone?", ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "James Watt"], 1, "General Knowledge", "Alexander Graham Bell is credited with inventing the telephone."),
  q("The Taj Mahal is located in which Indian city?", ["Delhi", "Agra", "Jaipur", "Lucknow"], 1, "General Knowledge", "The Taj Mahal is located in Agra."),
  q("Which country is known as the Land of the Rising Sun?", ["China", "Japan", "South Korea", "Thailand"], 1, "General Knowledge", "Japan is called the Land of the Rising Sun."),
  q("India's first satellite was named:", ["Chandrayaan", "Aryabhata", "Mangalyaan", "INSAT"], 1, "General Knowledge", "Aryabhata, launched in 1975, was India's first satellite."),
  q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Reasoning", "Each letter shifts +1: D->E, O->P, G->H."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Reasoning", "Differences are 4,6,8,10 — next term is 20+10=30."),
  q("Find the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2, "Reasoning", "Potato is a vegetable, while the others are fruits."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Reasoning", "The series skips one letter each time: A,C,E,G,I."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Reasoning", "Each term is multiplied by 3: 81×3=243."),
  q("Which word does NOT belong: Circle, Square, Triangle, Sphere", ["Circle", "Square", "Triangle", "Sphere"], 3, "Reasoning", "Sphere is a 3D shape, while the others are 2D shapes."),
  q("If Monday falls on the 1st of a month, what day falls on the 15th?", ["Monday", "Tuesday", "Sunday", "Wednesday"], 0, "Reasoning", "15-1=14 days later, exactly 2 weeks, so it's also Monday."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Reasoning", "Since A>B>C in height, C is the shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Reasoning", "These are perfect squares: 1²,2²,3²,4²,5²=25."),
  q("If all Roses are Flowers and all Flowers are Plants, then all Roses are:", ["Plants", "Trees", "Shrubs", "Weeds"], 0, "Reasoning", "By transitive logic, Roses are Plants."),
  q("Find the odd pair: (4,16), (5,25), (6,35), (7,49)", ["(4,16)", "(5,25)", "(6,35)", "(7,49)"], 2, "Reasoning", "In all other pairs, the second number is the square of the first; 6²=36, not 35."),
  q("A clock shows 3:00. What is the angle between the hour and minute hands?", ["45°", "90°", "60°", "75°"], 1, "Reasoning", "At 3:00, the angle between hour and minute hands is 90°."),
  q("Find the missing letter: B, D, F, H, ?", ["I", "J", "K", "L"], 1, "Reasoning", "The series skips one letter each time: B,D,F,H,J."),
  q("Which number should replace the question mark: 7, 14, 28, 56, ?", ["84", "112", "98", "70"], 1, "Reasoning", "Each term doubles: 56×2=112."),
  q("If '5 # 3' means 5+3 and '5 @ 3' means 5-3, what is '8 # 2 @ 1'?", ["9", "11", "7", "10"], 0, "Reasoning", "8#2=10, then 10@1=9."),
  q("Pointing to a man, a woman says, 'His mother is the only daughter of my mother.' How is she related to him?", ["Sister", "Mother", "Aunt", "Grandmother"], 1, "Reasoning", "The only daughter of the woman's mother is the woman herself, so she is the man's mother."),
];

const TESTS = [
  { id: "premium_tnpsc_1", title: "TNPSC Complete Practice Test — Tamil Nadu GK & General Studies", category: "TNPSC", questions: TNPSC_QUESTIONS,
    description: "A full 60-question practice test combining Tamil Nadu-specific general knowledge with core General Studies topics for TNPSC exams." },
  { id: "premium_appsc_1", title: "APPSC Complete Practice Test — Andhra Pradesh GK & General Studies", category: "APPSC", questions: APPSC_QUESTIONS,
    description: "A full 60-question practice test combining Andhra Pradesh-specific general knowledge with core General Studies topics for APPSC exams." },
  { id: "premium_apsc_1", title: "APSC Complete Practice Test — Assam GK & General Studies", category: "APSC", questions: APSC_QUESTIONS,
    description: "A full 60-question practice test combining Assam-specific general knowledge with core General Studies topics for APSC exams." },
  { id: "premium_sscexams_1", title: "SSC Exams Complete Practice Test — English, Quant & GK", category: "SSC Exams", questions: SSCEXAMS_QUESTIONS,
    description: "A full 60-question practice test covering English Language, Quantitative Aptitude, and General Knowledge for various SSC exams." },
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
