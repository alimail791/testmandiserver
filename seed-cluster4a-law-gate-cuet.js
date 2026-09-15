// Cluster 4a — CLAT, GATE, CUET
// Each test: 60 questions, 60 minutes, ₹99.
//
// Usage:
//   cd testmandi-server
//   node seed-cluster4a-law-gate-cuet.js
//
// Safe to re-run — skips any test whose id already exists.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Official";

const CLAT_QUESTIONS = [
  q("A contract entered into by a minor is:", ["Valid", "Voidable at the minor's option", "Void ab initio", "Illegal"], 2, "Legal Reasoning", "Under Indian contract law, an agreement with a minor is void from the very beginning (void ab initio), per the landmark Mohori Bibee case."),
  q("The principle 'res ipsa loquitur' means:", ["The facts speak for themselves", "Let the buyer beware", "Ignorance of law is no excuse", "The burden of proof lies with the plaintiff always"], 0, "Legal Reasoning", "'Res ipsa loquitur' is a Latin legal doctrine meaning 'the thing speaks for itself,' used in negligence cases."),
  q("Which of the following is an essential element of a valid contract?", ["Free consent", "Written document only", "Registration", "Witness signature always"], 0, "Legal Reasoning", "Free consent of parties is an essential element for a contract to be valid under the Indian Contract Act."),
  q("The term 'ultra vires' refers to an act that is:", ["Within legal power", "Beyond legal power or authority", "Fraudulent", "Criminal"], 1, "Legal Reasoning", "'Ultra vires' means an act done beyond the legal power or authority of a person or entity."),
  q("A tort is best described as:", ["A criminal offense only", "A civil wrong causing harm, giving rise to a claim for damages", "A breach of contract only", "A constitutional violation"], 1, "Legal Reasoning", "A tort is a civil wrong (other than breach of contract) that causes harm and gives rise to legal liability."),
  q("The doctrine of 'stare decisis' relates to:", ["Following judicial precedent", "Presumption of innocence", "Right to silence", "Separation of powers"], 0, "Legal Reasoning", "'Stare decisis' means courts should follow precedents set in earlier similar cases."),
  q("Which principle holds a person strictly liable regardless of fault for certain hazardous activities?", ["Vicarious liability", "Strict liability", "Contributory negligence", "Res judicata"], 1, "Legal Reasoning", "Strict liability holds a party responsible for damages without needing to prove fault or negligence, common in hazardous activities."),
  q("The term 'bail' refers to:", ["Permanent release from all charges", "Temporary release of an accused pending trial", "A type of punishment", "A civil remedy"], 1, "Legal Reasoning", "Bail is the temporary release of an accused person awaiting trial, usually with conditions."),
  q("'Mens rea' in criminal law refers to:", ["The guilty act", "The guilty mind or intent", "The punishment", "The victim's statement"], 1, "Legal Reasoning", "'Mens rea' means the mental element or intent behind committing a crime."),
  q("A void contract is one that:", ["Is voidable at a party's option", "Has no legal effect from the beginning or becomes unenforceable", "Is enforceable only by one party", "Requires court approval to be valid"], 1, "Legal Reasoning", "A void contract has no legal effect and cannot be enforced by either party."),
  q("The Right to Constitutional Remedies is provided under which Article?", ["Article 19", "Article 21", "Article 32", "Article 44"], 2, "Legal Reasoning", "Article 32 provides the Right to Constitutional Remedies, allowing citizens to approach the Supreme Court for enforcement of Fundamental Rights."),
  q("'Actus reus' refers to:", ["The guilty mind", "The guilty act", "The verdict", "The sentence"], 1, "Legal Reasoning", "'Actus reus' is the physical act or conduct constituting a crime."),
  q("A breach of contract entitles the aggrieved party to claim:", ["Only an apology", "Damages or specific performance", "Imprisonment of the other party", "Nothing, unless criminal intent is proven"], 1, "Legal Reasoning", "A breach of contract typically entitles the aggrieved party to claim damages or seek specific performance."),
  q("The concept of 'double jeopardy' protects a person from:", ["Being tried twice for the same offense", "Being denied bail", "Losing property rights", "Being denied legal counsel"], 0, "Legal Reasoning", "Double jeopardy, protected under Article 20(2), prevents prosecution for the same offense twice."),
  q("Which term describes a legal document that transfers property ownership?", ["Affidavit", "Deed", "Summons", "Writ"], 1, "Legal Reasoning", "A deed is a legal document used to transfer ownership of property."),
  q("'Habeas Corpus' is a writ that:", ["Orders release of a person unlawfully detained", "Compels performance of a public duty", "Prevents a lower court from exceeding jurisdiction", "Quashes an order of a lower court"], 0, "Legal Reasoning", "Habeas Corpus orders the production and release of a person unlawfully detained."),
  q("An offer becomes a promise when it is:", ["Made in writing", "Accepted", "Registered", "Notarized"], 1, "Legal Reasoning", "Under contract law, an offer becomes a promise once it is accepted by the offeree."),
  q("The term 'jurisdiction' refers to:", ["The authority of a court to hear a case", "The punishment prescribed", "The lawyer's fee", "The defendant's rights"], 0, "Legal Reasoning", "Jurisdiction is the legal authority of a court to hear and decide a case."),
  q("A minor's agreement is void because minors lack:", ["Physical capacity", "Contractual capacity", "Moral character", "Legal representation"], 1, "Legal Reasoning", "Minors lack the contractual capacity required under law to enter into a binding agreement."),
  q("The 'doctrine of separation of powers' divides government functions into:", ["Legislature, Executive, Judiciary", "Centre and States only", "Union and Union Territories", "Public and Private sectors"], 0, "Legal Reasoning", "The doctrine divides governmental power among the Legislature, Executive, and Judiciary."),
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "English", "'Abundant' means plentiful."),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "English", "Antonym of 'ancient' is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "English", "Correct spelling: 'receive.'"),
  q("Choose the correct meaning of the idiom 'Once in a blue moon':", ["Very frequently", "Rarely", "Every night", "Regularly"], 1, "English", "Means something happening very rarely."),
  q("Choose the correct passive voice: 'She writes a letter.'", ["A letter is written by her.", "A letter was written by her.", "A letter written by her.", "A letter is writing by her."], 0, "English", "Present passive: 'is written.'"),
  q("Choose the correct plural form of 'Child':", ["Childs", "Childes", "Children", "Childrens"], 2, "English", "Correct plural: 'children.'"),
  q("Choose the correct preposition: She is good ___ mathematics.", ["in", "at", "on", "with"], 1, "English", "'Good at' is correct."),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "English", "Correct: 'doesn't like.'"),
  q("Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "English", "'Joyful' is synonym of 'happy.'"),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "English", "Antonym of 'generous' is 'stingy.'"),
  q("Choose the correct article: ___ university is a place of higher learning.", ["A", "An", "The", "No article needed"], 0, "English", "'University' starts with a consonant sound, taking 'a.'"),
  q("Identify the verb in the sentence: 'They played football yesterday.'", ["They", "played", "football", "yesterday"], 1, "English", "'Played' is the verb, indicating the action."),
  q("Choose the correct antonym of 'Optimistic':", ["Hopeful", "Positive", "Pessimistic", "Confident"], 2, "English", "Antonym of 'optimistic' is 'pessimistic.'"),
  q("Choose the correct meaning of 'to break the ice':", ["To cause an argument", "To start a conversation in an awkward situation", "To end a relationship", "To celebrate"], 1, "English", "Means initiating conversation, easing tension."),
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "Current Affairs & GK", "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constitution."),
  q("Which body is responsible for conducting elections in India?", ["Supreme Court", "Election Commission of India", "Parliament", "NITI Aayog"], 1, "Current Affairs & GK", "The Election Commission of India conducts and oversees elections."),
  q("India's Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "Current Affairs & GK", "The Constitution was adopted on 26 November 1949."),
  q("Which is the highest judicial body in India?", ["High Court", "Supreme Court", "District Court", "Tribunal"], 1, "Current Affairs & GK", "The Supreme Court of India is the highest judicial authority in the country."),
  q("The Chief Justice of India is appointed by the:", ["Prime Minister", "President", "Parliament", "Law Minister"], 1, "Current Affairs & GK", "The President appoints the Chief Justice of India, per Article 124."),
  q("Which Article of the Constitution abolishes untouchability?", ["Article 15", "Article 17", "Article 19", "Article 21"], 1, "Current Affairs & GK", "Article 17 abolishes untouchability in any form."),
  q("The Law Commission of India is a body that:", ["Enacts new laws directly", "Recommends legal reforms to the government", "Tries criminal cases", "Appoints judges"], 1, "Current Affairs & GK", "The Law Commission researches and recommends legal reforms, without direct law-making power."),
  q("Which is the minimum age to become a judge of the Supreme Court (in terms of typical high court experience required)?", ["No fixed age, but requires specific judicial/legal experience", "25 years", "30 years", "21 years"], 0, "Current Affairs & GK", "The Constitution specifies experience requirements (like years as a High Court judge or advocate) rather than a fixed minimum age for Supreme Court judges."),
  q("Who is known as the 'Father of the Indian Bar'?", ["Motilal Nehru", "Vithalbhai Patel", "M.C. Setalvad", "None of these commonly holds this exact title"], 3, "Current Affairs & GK", "This isn't a widely standardized title in Indian legal history; various figures are noted for their contributions but no single universally recognized holder exists."),
  q("Which is the apex body for legal education in India?", ["UGC", "Bar Council of India", "AICTE", "NCERT"], 1, "Current Affairs & GK", "The Bar Council of India regulates legal education and the legal profession."),
  q("Public Interest Litigation (PIL) can be filed to:", ["Seek personal compensation only", "Address issues of public interest and social justice", "Challenge only criminal convictions", "Seek promotions in government jobs"], 1, "Current Affairs & GK", "PIL allows any public-spirited citizen to approach courts on matters of public interest."),
  q("Find the odd one out: Contract, Tort, Crime, Marriage", ["Contract", "Tort", "Crime", "Marriage"], 3, "Logical Reasoning", "Contract, Tort, and Crime are all areas of law dealing with obligations/wrongs, while Marriage is a social institution (though it has legal aspects too, this is the intended 'odd one' relative to the legal-wrong theme)."),
  q("If all lawyers are educated and some educated people are wealthy, can we conclude all lawyers are wealthy?", ["Yes, definitely", "No, this cannot be concluded", "Only some lawyers are wealthy", "Cannot be determined without more data"], 1, "Logical Reasoning", "The premises don't logically guarantee lawyers fall into the wealthy subset."),
  q("Statement: All contracts are agreements. All agreements are promises. Conclusion: All contracts are promises.", ["The conclusion follows logically", "The conclusion does not follow", "Cannot be determined", "Only partially true"], 0, "Logical Reasoning", "By transitive logic, this conclusion follows."),
  q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Logical Reasoning", "Next term: 30."),
  q("Complete the series: A, C, E, G, ?", ["H", "I", "J", "K"], 1, "Logical Reasoning", "Next letter: I."),
  q("A is a lawyer, B is A's client. If A always tells the truth to the court, and B lied to A, then:", ["A's statements to the court remain based on what A believes to be true", "A automatically becomes liable for perjury", "The case is automatically dismissed", "B cannot be prosecuted"], 0, "Logical Reasoning", "A lawyer's duty is generally based on information provided, and liability for B's lie typically rests with B."),
  q("If South-East becomes North and North-East becomes West, then South becomes:", ["North-East", "North-West", "South-East", "South-West"], 1, "Logical Reasoning", "Rotated 135° clockwise maps South to North-West."),
  q("Find the missing number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Logical Reasoning", "Next term: 243."),
  q("Which word does NOT belong: Plaintiff, Defendant, Witness, Spectator", ["Plaintiff", "Defendant", "Witness", "Spectator"], 3, "Logical Reasoning", "A 'spectator' has no formal role in legal proceedings, unlike the other three."),
  q("A is taller than B, B is taller than C. Who is the shortest?", ["A", "B", "C", "Cannot be determined"], 2, "Logical Reasoning", "C is the shortest."),
  q("Find the next term: 1, 4, 9, 16, ?", ["20", "24", "25", "22"], 2, "Logical Reasoning", "Next perfect square: 25."),
  q("If all judges are lawyers and no lawyer is dishonest, then no judge is:", ["Educated", "Dishonest", "Experienced", "Respected"], 1, "Logical Reasoning", "By transitive logic, if all judges are lawyers and no lawyer is dishonest, then no judge is dishonest."),
  q("Find the odd pair: (4,16), (5,25), (6,35), (7,49)", ["(4,16)", "(5,25)", "(6,35)", "(7,49)"], 2, "Logical Reasoning", "6²=36, not 35."),
  q("A clock shows 3:00. The angle between the hour and minute hands is:", ["45°", "90°", "60°", "75°"], 1, "Logical Reasoning", "The angle is 90°."),
  q("If '5 # 3' means 5+3 and '5 @ 3' means 5-3, what is '8 # 2 @ 1'?", ["9", "11", "7", "10"], 0, "Logical Reasoning", "8#2=10, then 10@1=9."),
];

const GATE_QUESTIONS = [
  q("Choose the word most nearly OPPOSITE in meaning to 'Frugal':", ["Thrifty", "Extravagant", "Economical", "Prudent"], 1, "Verbal Ability", "Opposite of 'frugal' is 'extravagant.'"),
  q("Choose the word most nearly SIMILAR in meaning to 'Eloquent':", ["Silent", "Articulate", "Confused", "Shy"], 1, "Verbal Ability", "Similar to 'eloquent' is 'articulate.'"),
  q("Choose the correctly spelled word:", ["Accomodate", "Acommodate", "Accommodate", "Acomodate"], 2, "Verbal Ability", "Correct spelling: 'accommodate.'"),
  q("Identify the grammatically correct sentence:", ["Each of the students have submitted their assignment.", "Each of the students has submitted their assignment.", "Each of the students have submitted his assignment.", "Each of the student has submitted assignment."], 1, "Verbal Ability", "'Each' takes singular verb 'has.'"),
  q("Choose the correct synonym of 'Ambiguous':", ["Clear", "Vague", "Certain", "Precise"], 1, "Verbal Ability", "'Ambiguous' means unclear, similar to 'vague.'"),
  q("Choose the correct antonym of 'Meticulous':", ["Careful", "Precise", "Careless", "Detailed"], 2, "Verbal Ability", "Antonym of 'meticulous' is 'careless.'"),
  q("The idiom 'to read between the lines' means:", ["To read carefully word by word", "To understand a hidden meaning", "To skip parts of a text", "To read quickly"], 1, "Verbal Ability", "Means understanding implied meaning."),
  q("Choose the correct synonym of 'Candid':", ["Deceptive", "Frank", "Secretive", "Reserved"], 1, "Verbal Ability", "'Candid' means open, similar to 'frank.'"),
  q("The phrase 'a blessing in disguise' refers to:", ["An obvious advantage", "Something that seems bad but turns out good", "A hidden threat", "A religious ceremony"], 1, "Verbal Ability", "Means something initially bad turning out good."),
  q("Choose the correct antonym of 'Optimistic':", ["Hopeful", "Positive", "Pessimistic", "Confident"], 2, "Verbal Ability", "Antonym of 'optimistic' is 'pessimistic.'"),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Numerical Ability", "Speed = 10 m/s."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Numerical Ability", "Average = 30."),
  q("If x:y = 2:3 and y:z = 4:5, then x:y:z is:", ["8:12:15", "2:3:5", "4:6:5", "8:6:15"], 0, "Numerical Ability", "Combined ratio: 8:12:15."),
  q("A can complete a work in 10 days and B in 15 days. Together they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Numerical Ability", "Together: 6 days."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Numerical Ability", "12×12=144."),
  q("If A and B are independent events, P(A ∩ B) equals:", ["P(A) + P(B)", "P(A) - P(B)", "P(A) × P(B)", "P(A) / P(B)"], 2, "Numerical Ability", "Independent events: joint probability = product."),
  q("The value of the determinant of a 2x2 identity matrix is:", ["0", "1", "2", "-1"], 1, "Numerical Ability", "Determinant of identity matrix = 1."),
  q("The derivative of x² with respect to x is:", ["x", "2x", "x²", "2"], 1, "Engineering Mathematics", "Power rule: d/dx(x²) = 2x."),
  q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "Engineering Mathematics", "Standard integral: ln|x| + C."),
  q("If a matrix A is singular, its determinant is:", ["1", "Non-zero", "0", "Negative"], 2, "Engineering Mathematics", "A singular matrix has determinant 0."),
  q("The Laplace transform is primarily used to solve:", ["Algebraic equations", "Differential equations", "Matrix inversions", "Probability distributions"], 1, "Engineering Mathematics", "Laplace transforms convert differential equations into algebraic ones for easier solving."),
  q("Eigenvalues of a matrix are found by solving:", ["det(A) = 0", "det(A - λI) = 0", "A × I = A", "A + I = 0"], 1, "Engineering Mathematics", "Eigenvalues are the roots of the characteristic equation det(A - λI) = 0."),
  q("The rank of a matrix refers to:", ["The number of rows", "The number of columns", "The number of linearly independent rows/columns", "The determinant value"], 2, "Engineering Mathematics", "Rank is the maximum number of linearly independent rows or columns."),
  q("A differential equation of the form dy/dx + Py = Q is called:", ["Homogeneous", "Linear first-order differential equation", "Non-linear", "Partial differential equation"], 1, "Engineering Mathematics", "This standard form represents a linear first-order ODE."),
  q("The Fourier series is used to represent:", ["Only polynomial functions", "Periodic functions as a sum of sines and cosines", "Only exponential functions", "Only linear functions"], 1, "Engineering Mathematics", "Fourier series decomposes periodic functions into sums of sinusoidal components."),
  q("Which numerical method is commonly used to find roots of nonlinear equations?", ["Newton-Raphson method", "Gaussian elimination", "Simplex method", "Runge-Kutta method"], 0, "Engineering Mathematics", "The Newton-Raphson method iteratively finds roots of nonlinear equations."),
  q("The probability density function of a continuous random variable must satisfy:", ["Sum to 1 over discrete points", "Integrate to 1 over its entire range", "Always be greater than 1", "Be a constant"], 1, "Engineering Mathematics", "A valid PDF must integrate to 1 over its entire domain."),
  q("In computer science, Big-O notation is used to describe:", ["Memory addresses", "Algorithm time/space complexity", "Programming language syntax", "Database schemas"], 1, "Computer Science Fundamentals", "Big-O notation describes the upper bound of an algorithm's time or space complexity."),
  q("Which data structure uses LIFO (Last In First Out) order?", ["Queue", "Stack", "Array", "Linked List"], 1, "Computer Science Fundamentals", "A stack follows the Last In First Out principle."),
  q("Which data structure uses FIFO (First In First Out) order?", ["Stack", "Queue", "Tree", "Graph"], 1, "Computer Science Fundamentals", "A queue follows the First In First Out principle."),
  q("A binary search algorithm requires the input array to be:", ["Unsorted", "Sorted", "Circular", "Randomized"], 1, "Computer Science Fundamentals", "Binary search only works correctly on a sorted array."),
  q("The time complexity of binary search is:", ["O(n)", "O(log n)", "O(n²)", "O(1)"], 1, "Computer Science Fundamentals", "Binary search has logarithmic time complexity, O(log n)."),
  q("Which sorting algorithm has the best average-case time complexity among common comparison sorts?", ["Bubble sort", "Quick sort / Merge sort (O(n log n))", "Selection sort", "Insertion sort"], 1, "Computer Science Fundamentals", "Quick sort and merge sort typically achieve O(n log n) average-case complexity."),
  q("A relational database primarily organizes data into:", ["Trees", "Graphs", "Tables", "Linked lists"], 2, "Computer Science Fundamentals", "Relational databases organize data into tables (relations)."),
  q("In operating systems, a 'deadlock' occurs when:", ["A process finishes execution", "Two or more processes are waiting indefinitely for resources held by each other", "A process uses too much CPU", "Memory is completely free"], 1, "Computer Science Fundamentals", "Deadlock occurs when processes are stuck waiting on each other's held resources."),
  q("Which of the following is a volatile memory?", ["ROM", "RAM", "Hard Disk", "SSD"], 1, "Computer Science Fundamentals", "RAM is volatile — it loses data when power is removed."),
  q("Which logic gate outputs true only when both inputs are true?", ["OR", "AND", "NOT", "XOR"], 1, "Computer Science Fundamentals", "The AND gate outputs true only if both inputs are true."),
  q("The primary function of a compiler is to:", ["Execute code directly", "Translate source code into machine code", "Manage hardware directly", "Design user interfaces"], 1, "Computer Science Fundamentals", "A compiler translates high-level source code into machine-executable code."),
  q("Which network protocol is used to transfer web pages?", ["FTP", "HTTP", "SMTP", "SNMP"], 1, "Computer Science Fundamentals", "HTTP (Hypertext Transfer Protocol) is used to transfer web pages."),
  q("Normalization in database design primarily aims to:", ["Increase data redundancy", "Reduce data redundancy and improve data integrity", "Slow down queries", "Remove all relationships between tables"], 1, "Computer Science Fundamentals", "Normalization reduces redundancy and improves data integrity in database design."),
  q("A 'thread' in operating systems is best described as:", ["A separate program", "The smallest unit of execution within a process", "A type of hardware", "A network connection"], 1, "Computer Science Fundamentals", "A thread is the smallest schedulable unit of execution within a process."),
  q("Which of these is NOT a programming paradigm?", ["Object-Oriented Programming", "Functional Programming", "Procedural Programming", "Sequential Storage"], 3, "Computer Science Fundamentals", "'Sequential Storage' is a data organization concept, not a programming paradigm."),
  q("The main memory of a computer is also known as:", ["Cache", "RAM", "ROM", "Register"], 1, "Computer Science Fundamentals", "RAM (Random Access Memory) is commonly referred to as main memory."),
  q("Which of the following best describes 'recursion' in programming?", ["A loop that never ends", "A function calling itself to solve a smaller instance of a problem", "A type of variable declaration", "A database query method"], 1, "Computer Science Fundamentals", "Recursion is when a function calls itself to solve smaller sub-problems."),
  q("The Ohm's Law formula relating voltage, current, and resistance is:", ["V = I/R", "V = IR", "V = I + R", "V = I - R"], 1, "General Engineering", "Ohm's Law states V = IR, where V is voltage, I is current, and R is resistance."),
  q("The SI unit of electrical power is:", ["Joule", "Watt", "Ampere", "Volt"], 1, "General Engineering", "Power is measured in watts."),
  q("Which material is commonly used as a semiconductor in electronic devices?", ["Copper", "Silicon", "Aluminum", "Iron"], 1, "General Engineering", "Silicon is the most widely used semiconductor material."),
  q("The efficiency of an ideal Carnot engine depends on:", ["Only the working substance", "The temperatures of the hot and cold reservoirs", "The engine's physical size", "The type of fuel used"], 1, "General Engineering", "Carnot efficiency depends solely on the temperatures of the heat source and sink."),
  q("Young's modulus measures a material's:", ["Density", "Stiffness/elasticity under tensile stress", "Melting point", "Electrical conductivity"], 1, "General Engineering", "Young's modulus quantifies a material's stiffness under axial tension or compression."),
  q("In fluid mechanics, Bernoulli's principle relates pressure to:", ["Temperature", "Fluid velocity and height", "Viscosity only", "Density changes only"], 1, "General Engineering", "Bernoulli's principle relates pressure, velocity, and elevation in a flowing fluid."),
  q("Which quantum number determines the shape of an atomic orbital?", ["Principal", "Azimuthal", "Magnetic", "Spin"], 1, "Engineering Sciences", "The azimuthal quantum number determines orbital shape (s, p, d, f)."),
  q("The unit of thermal conductivity is:", ["W/m·K", "J/K", "W/K", "J/m"], 0, "Engineering Sciences", "Thermal conductivity is measured in watts per meter-kelvin (W/m·K)."),
  q("Which of the following is a vector quantity?", ["Mass", "Speed", "Force", "Energy"], 2, "Engineering Sciences", "Force has both magnitude and direction, making it a vector quantity."),
  q("The stress-strain curve for a ductile material shows a distinct:", ["Brittle fracture point only", "Yield point followed by plastic deformation", "No elastic region", "Only elastic behavior"], 1, "Engineering Sciences", "Ductile materials show a yield point followed by significant plastic deformation before fracture."),
  q("The SI unit of viscosity is:", ["Pascal", "Pascal-second", "Newton", "Joule"], 1, "Engineering Sciences", "Dynamic viscosity is measured in pascal-seconds (Pa·s)."),
  q("In digital electronics, a flip-flop is primarily used for:", ["Amplifying signals", "Storing one bit of data", "Converting AC to DC", "Generating heat"], 1, "Computer Science Fundamentals", "A flip-flop is a basic memory element that stores one bit of binary data."),
  q("Which of the following best describes 'polymorphism' in object-oriented programming?", ["Having multiple unrelated classes", "The ability of a function/object to take multiple forms", "Storing data in arrays", "Compiling code faster"], 1, "Computer Science Fundamentals", "Polymorphism allows objects or functions to behave differently based on context, often via method overriding/overloading."),
  q("The primary key in a database table is used to:", ["Sort data alphabetically", "Uniquely identify each record", "Store duplicate values", "Encrypt the database"], 1, "Computer Science Fundamentals", "A primary key uniquely identifies each row/record in a table."),
  q("A 'stack overflow' error typically occurs due to:", ["Too much available memory", "Excessive or infinite recursion consuming stack memory", "A missing semicolon", "A slow internet connection"], 1, "Computer Science Fundamentals", "Stack overflow often results from excessive recursive calls exhausting available stack memory."),
  q("Which of these is a volatile memory device?", ["ROM", "Hard Disk", "RAM", "Flash memory"], 2, "Computer Science Fundamentals", "RAM loses its contents when power is removed, making it volatile."),
];

const CUET_QUESTIONS = [
  q("Choose the correct synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "Language", "'Abundant' means plentiful."),
  q("Choose the correct antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "Language", "Antonym of 'ancient' is 'modern.'"),
  q("Identify the correctly spelled word:", ["Recieve", "Receive", "Receeve", "Receve"], 1, "Language", "Correct spelling: 'receive.'"),
  q("Choose the correct meaning of the idiom 'Once in a blue moon':", ["Very frequently", "Rarely", "Every night", "Regularly"], 1, "Language", "Means something happening very rarely."),
  q("Choose the correct passive voice: 'She writes a letter.'", ["A letter is written by her.", "A letter was written by her.", "A letter written by her.", "A letter is writing by her."], 0, "Language", "Present passive: 'is written.'"),
  q("Choose the correct plural form of 'Child':", ["Childs", "Childes", "Children", "Childrens"], 2, "Language", "Correct plural: 'children.'"),
  q("Choose the correct preposition: She is good ___ mathematics.", ["in", "at", "on", "with"], 1, "Language", "'Good at' is correct."),
  q("Choose the correct sentence:", ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], 2, "Language", "Correct: 'doesn't like.'"),
  q("Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "Language", "'Joyful' is synonym of 'happy.'"),
  q("Choose the correct antonym of 'Generous':", ["Kind", "Stingy", "Giving", "Charitable"], 1, "Language", "Antonym of 'generous' is 'stingy.'"),
  q("Choose the correct article: ___ university is a place of higher learning.", ["A", "An", "The", "No article needed"], 0, "Language", "'University' starts with a consonant sound, taking 'a.'"),
  q("Identify the verb in the sentence: 'They played football yesterday.'", ["They", "played", "football", "yesterday"], 1, "Language", "'Played' is the verb, indicating the action."),
  q("Choose the correct antonym of 'Optimistic':", ["Hopeful", "Positive", "Pessimistic", "Confident"], 2, "Language", "Antonym of 'optimistic' is 'pessimistic.'"),
  q("Choose the correct meaning of 'to break the ice':", ["To cause an argument", "To start a conversation in an awkward situation", "To end a relationship", "To celebrate"], 1, "Language", "Means initiating conversation, easing tension."),
  q("Choose the correct synonym of 'Diligent':", ["Lazy", "Hardworking", "Careless", "Slow"], 1, "Language", "'Diligent' means hardworking."),
  q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quantitative Aptitude", "Speed = 10 m/s."),
  q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quantitative Aptitude", "SI = Rs.200."),
  q("The average of 10, 20, 30, 40, 50 is:", ["25", "30", "35", "40"], 1, "Quantitative Aptitude", "Average = 30."),
  q("The LCM of 12 and 18 is:", ["24", "36", "72", "6"], 1, "Quantitative Aptitude", "LCM = 36."),
  q("If 20% of a number is 50, the number is:", ["200", "250", "100", "150"], 1, "Quantitative Aptitude", "x = 250."),
  q("The value of 15% of 200 is:", ["20", "30", "25", "35"], 1, "Quantitative Aptitude", "15% of 200 = 30."),
  q("A shopkeeper sells an item for Rs.550 at a profit of 10%. The cost price is:", ["Rs.500", "Rs.495", "Rs.540", "Rs.505"], 0, "Quantitative Aptitude", "CP = Rs.500."),
  q("The square root of 144 is:", ["11", "12", "13", "14"], 1, "Quantitative Aptitude", "12×12=144."),
  q("A can complete a work in 10 days and B in 15 days. Together they complete it in:", ["5 days", "6 days", "8 days", "12 days"], 1, "Quantitative Aptitude", "Together: 6 days."),
  q("The perimeter of a square with side 8 cm is:", ["32 cm", "64 cm", "16 cm", "24 cm"], 0, "Quantitative Aptitude", "Perimeter = 32 cm."),
  q("A number when increased by 20% gives 60. The original number is:", ["48", "50", "45", "40"], 1, "Quantitative Aptitude", "x = 50."),
  q("The HCF of 12 and 18 is:", ["2", "6", "36", "4"], 1, "Quantitative Aptitude", "HCF = 6."),
  q("If the ratio of two numbers is 3:4 and their sum is 63, the numbers are:", ["27 and 36", "21 and 42", "30 and 33", "18 and 45"], 0, "Quantitative Aptitude", "Numbers: 27, 36."),
  q("A person covers a distance at 40 km/h and returns at 60 km/h. The average speed is:", ["50 km/h", "48 km/h", "45 km/h", "52 km/h"], 1, "Quantitative Aptitude", "Average speed = 48 km/h."),
  q("A sum doubles itself in 8 years at simple interest. The rate is:", ["10%", "12.5%", "8%", "15%"], 1, "Quantitative Aptitude", "Rate = 12.5%."),
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
  q("Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "General Test / GK", "Dr. B.R. Ambedkar chaired the Drafting Committee."),
  q("The national bird of India is the:", ["Peacock", "Sparrow", "Eagle", "Parrot"], 0, "General Test / GK", "The peacock is India's national bird."),
  q("Which is the smallest planet in the solar system?", ["Mars", "Mercury", "Venus", "Earth"], 1, "General Test / GK", "Mercury is the smallest planet."),
  q("The headquarters of the United Nations is located in:", ["Geneva", "New York", "Paris", "London"], 1, "General Test / GK", "The UN headquarters is in New York City."),
  q("Who wrote India's national anthem?", ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Subhas Chandra Bose"], 1, "General Test / GK", "Rabindranath Tagore wrote 'Jana Gana Mana.'"),
  q("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "General Test / GK", "Nitrogen makes up about 78% of Earth's atmosphere."),
  q("The first Prime Minister of India was:", ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi", "Rajendra Prasad"], 0, "General Test / GK", "Jawaharlal Nehru was India's first Prime Minister."),
  q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "General Test / GK", "The Pacific Ocean is the largest ocean."),
  q("Who invented the telephone?", ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "James Watt"], 1, "General Test / GK", "Alexander Graham Bell invented the telephone."),
  q("The Taj Mahal is located in which Indian city?", ["Delhi", "Agra", "Jaipur", "Lucknow"], 1, "General Test / GK", "The Taj Mahal is located in Agra."),
  q("Which is the highest mountain peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Nanga Parbat"], 2, "General Test / GK", "Mount Everest is the highest peak."),
  q("India's first satellite was named:", ["Chandrayaan", "Aryabhata", "Mangalyaan", "INSAT"], 1, "General Test / GK", "Aryabhata was India's first satellite."),
  q("The Reserve Bank of India was established in the year:", ["1935", "1947", "1950", "1969"], 0, "General Test / GK", "RBI was established in 1935."),
  q("GST in India was implemented in the year:", ["2015", "2016", "2017", "2019"], 2, "General Test / GK", "GST implemented on 1 July 2017."),
  q("Which Indian city is known as the 'Silicon Valley of India'?", ["Mumbai", "Bengaluru", "Chennai", "Hyderabad"], 1, "General Test / GK", "Bengaluru is called India's Silicon Valley."),
  q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "General Test / GK", "Mars is known as the Red Planet."),
];

const TESTS = [
  { id: "premium_clat_1", title: "CLAT Complete Practice Test — Legal Reasoning, English & GK", category: "CLAT", questions: CLAT_QUESTIONS,
    description: "A full 60-question CLAT-pattern practice test covering Legal Reasoning, English, Current Affairs & GK, and Logical Reasoning." },
  { id: "premium_gate_1", title: "GATE Complete Practice Test — Aptitude, Engineering Maths & CS Fundamentals", category: "GATE", questions: GATE_QUESTIONS,
    description: "A full 60-question GATE-pattern practice test covering General Aptitude, Engineering Mathematics, and core Computer Science / Engineering fundamentals." },
  { id: "premium_cuet_1", title: "CUET Complete Practice Test — Language, Quant, Reasoning & GK", category: "CUET", questions: CUET_QUESTIONS,
    description: "A full 60-question CUET-pattern practice test covering Language, Quantitative Aptitude, Reasoning, and the General Test." },
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
