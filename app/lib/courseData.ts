export interface Course {
    courseCode: string;
    courseName: string;
    department: string;
    track: string;
    credits: number;
    level: string;
    prerequisite1: string;
    prerequisite2: string;
    description: string;
}

// Full CSV data source
const courseDataCSV = `Course Code,Course Name,Department,Track,Credits,Level,Prerequisite 1,Prerequisite 2,Description
MATH 100,Intermediate Algebra,Mathematics,STEM,3,Beginner,None,None,"Algebra review and problem-solving techniques for mathematics"
MATH 112,College Algebra,Mathematics,STEM,3,Beginner,None,None,"Functions, equations, graphing, logarithms"
MATH 113,Precalculus,Mathematics,STEM,4,Beginner,"MATH 112 or placement test",None,"Advanced algebra and trigonometry for calculus preparation"
MATH 122A,Calculus I with Applications,Mathematics,STEM,5,Intermediate,"MATH 113 or ACT Math 28+",None,"Limits, derivatives, applications of derivatives"
MATH 122B,Calculus I,Mathematics,STEM,3,Intermediate,"MATH 113 or placement test",None,"Limits, derivatives, and applications"
MATH 125,Calculus with Analytic Geometry I,Mathematics,STEM,3,Intermediate,"MATH 113 or placement",None,"Differential calculus with analytical approach"
MATH 129,Calculus II,Mathematics,STEM,3,Intermediate,"MATH 122A/B or MATH 125 with C or better",None,"Integration, techniques, applications of integrals"
MATH 223,"Vector Calculus (Calculus III)",Mathematics,STEM,4,Intermediate,"MATH 129 with C or better",None,"Multivariable calculus, partial derivatives, line/surface integrals"
MATH 254,Introduction to Ordinary Differential Equations,Mathematics,STEM,3,Intermediate,"MATH 129 or MATH 223 with C or better",None,"First and second order ODEs, systems, applications"
MATH 263,Matrix Methods and Applications,Mathematics,STEM,3,Intermediate,"MATH 129 or MATH 122B with C or better",None,"Linear algebra, eigenvalues, applications"
MATH 313,Linear Algebra,Mathematics,STEM,3,Intermediate,"MATH 122A or placement",None,"Matrices, vector spaces, linear transformations, eigenvalues"
MATH 415,Differential Equations,Mathematics,STEM,3,Advanced,MATH 223,None,"ODEs, systems of equations, advanced applications"
MATH 425,Methods of Applied Mathematics,Mathematics,STEM,3,Advanced,"MATH 254 or MATH 415",None,"Partial differential equations, complex analysis applications"
CHEM 100,Introductory Chemistry,Chemistry,STEM,3,Beginner,None,None,"Basic chemistry fundamentals, atoms, molecules, reactions"
CHEM 105A,"General Chemistry I (Honors)",Chemistry,STEM,4,Beginner,"Placement or High School Chemistry","CHEM 106A Lab","Atomic structure, bonding, stoichiometry, thermochemistry"
CHEM 105B,"General Chemistry II (Honors)",Chemistry,STEM,4,Beginner,"CHEM 105A or CHEM 151","CHEM 106B Lab","Solutions, equilibrium, acids/bases, redox reactions"
CHEM 151,General Chemistry I,Chemistry,STEM,4,Beginner,"Placement or High School Chemistry",None,"Atomic structure, chemical bonding, stoichiometry, reactions"
CHEM 152,General Chemistry II,Chemistry,STEM,4,Beginner,CHEM 151,None,"Solutions, equilibrium, acid-base chemistry, redox reactions"
CHEM 161,General Chemistry I for Engineers,Chemistry,STEM,4,Beginner,"Placement test or High School Chemistry","CHEM 163 Lab","Fundamentals for engineering applications"
CHEM 162,General Chemistry II for Engineers,Chemistry,STEM,4,Beginner,CHEM 161,"CHEM 164 Lab","Engineering-focused chemistry"
CHEM 206,Chemistry of Life,Chemistry,STEM,3,Beginner,"CHEM 151 or 152",None,"Chemistry applications in biology and medicine"
CHEM 241A,Organic Chemistry I,Chemistry,STEM,3,Intermediate,"CHEM 152 with C or better","CHEM 243A Lab","Alkanes, alkenes, aromatic compounds, mechanisms"
CHEM 241B,Organic Chemistry II,Chemistry,STEM,3,Intermediate,"CHEM 241A with C or better","CHEM 243B Lab","Carbonyl compounds, amines, carboxylic acids"
CHEM 243A,Organic Chemistry I Lab,Chemistry,STEM,1,Intermediate,CHEM 241A,CHEM 241A,"Laboratory techniques and synthesis"
CHEM 243B,Organic Chemistry II Lab,Chemistry,STEM,1,Intermediate,CHEM 243A,CHEM 241B,"Advanced organic lab techniques"
CHEM 271,Physical Chemistry I,Chemistry,STEM,3,Advanced,"CHEM 152, MATH 223, PHYS 142",None,"Thermodynamics, kinetics, quantum chemistry basics"
CHEM 272,Physical Chemistry II,Chemistry,STEM,3,Advanced,CHEM 271,None,"Spectroscopy, electrochemistry, statistical mechanics"
CHEM 280,Environmental Chemistry,Chemistry,STEM,3,Intermediate,"CHEM 151 or CHEM 152",None,"Chemistry of air, water, and environmental processes"
CHEM 380,Chemistry Mathematics Applications,Chemistry,STEM,3,Intermediate,"MATH 122A or higher, CHEM 152",None,"Mathematical techniques for chemical problems"
PHYS 102,"Physics Algebra-Based: Mechanics",Physics,STEM,3,Beginner,"MATH 112 or higher (co-req)","PHYS 181 Lab","Kinematics, dynamics, energy, momentum"
PHYS 103,"Physics Algebra-Based: Electricity & Magnetism",Physics,STEM,3,Beginner,PHYS 102,"PHYS 182 Lab","Electrostatics, circuits, magnetism, waves"
PHYS 104,"Physics Algebra-Based: Modern Physics",Physics,STEM,3,Intermediate,PHYS 103,None,"Atomic structure, quantum mechanics, nuclear physics"
PHYS 141,Introductory Mechanics,Physics,STEM,4,Intermediate,"MATH 122A or 125 (co-requisite)",None,"Kinematics, dynamics, energy, rotational motion, waves"
PHYS 142,Introductory Electricity and Magnetism,Physics,STEM,4,Intermediate,"PHYS 141, MATH 122B or 125",None,"Electrostatics, electric fields, circuits, magnetism"
PHYS 241,Introductory Electricity and Magnetism,Physics,STEM,4,Intermediate,PHYS 141,None,"Detailed E&M theory and applications"
PHYS 261H,"Physics I Honors: Mechanics",Physics,STEM,4,Intermediate,"MATH 122A or 125 (co-requisite)",None,"Honors mechanics course"
PHYS 262H,"Physics II Honors: E&M",Physics,STEM,4,Intermediate,"PHYS 261H or PHYS 141, MATH 223 (co-req)",None,"Honors electricity and magnetism"
PHYS 297,Energy and Environmental Physics,Physics,STEM,3,Intermediate,"PHYS 102 or 141",None,"Physics of renewable energy and climate"
BIO 181H,"Biology I: Molecular & Cellular (Honors)",Biology,STEM,4,Beginner,"High School Biology or placement",None,"Cell structure, DNA, photosynthesis, respiration, genetics"
BIO 182H,"Biology II: Evolution & Ecology (Honors)",Biology,STEM,4,Beginner,BIO 181H,None,"Evolution, genetics, ecology, diversity, behavior"
MCB 181R,Introductory Biology I,Biology,STEM,3,Beginner,None,"MCB 181L Lab","Molecular and cellular biology for majors"
MCB 181L,Introductory Biology I Lab,Biology,STEM,1,Beginner,"MCB 181R (co-requisite)",MCB 181R,"Laboratory techniques in molecular biology"
ECOL 182R,Introductory Biology II,Biology,STEM,3,Beginner,MCB 181R,"ECOL 182L Lab","Ecology and evolution for majors"
ECOL 182L,Introductory Biology II Lab,Biology,STEM,1,Beginner,"ECOL 182R (co-requisite)",ECOL 182R,"Laboratory techniques in ecology"
BIO 206,Cell Structure and Function,Biology,STEM,3,Intermediate,"MCB 181R or BIO 181H",None,"Advanced cell biology, organelles, processes"
BIO 220,General Botany,Biology,STEM,3,Intermediate,"BIO 181H or MCB 181R",None,"Plant structure, physiology, reproduction"
BIO 223,Invertebrate Biology,Biology,STEM,3,Intermediate,"BIO 182H or ECOL 182R",None,"Invertebrate diversity, evolution, ecology"
BIO 230,Evolution and Paleontology,Biology,STEM,3,Intermediate,"BIO 182H or ECOL 182R",None,"Evolutionary mechanisms, fossil record"
BIO 245,Microbiology,Biology,STEM,3,Intermediate,"CHEM 152, MCB 181R or BIO 181H",None,"Bacteria, viruses, fungi, disease, immunity"
BIO 280,Human Anatomy,Biology,STEM,3,Intermediate,"MCB 181R or BIO 181H",None,"Human skeletal, muscular, organ systems"
BIO 281,Genetics,Biology,STEM,3,Intermediate,"MCB 181R or BIO 181H, MATH 112+",None,"Mendelian genetics, molecular genetics, gene regulation"
ECOL 302,Ecology,Biology,STEM,4,Intermediate,"ECOL 182R, MATH 122A+ preferred",None,"Population dynamics, community ecology, ecosystems"
ECOL 320,Genetics,Biology,STEM,4,Intermediate,"ECOL 182R, MATH 129 preferred",None,"Molecular and quantitative genetics"
ECOL 335,Evolutionary Biology,Biology,STEM,4,Intermediate,ECOL 182R,None,"Evolution, natural selection, speciation"
PSIO 201,Human Physiology I,Biology,STEM,3,Intermediate,"BIO 181H or MCB 181R",None,"Cellular physiology, nervous system, endocrine system"
PSIO 202,Human Physiology II,Biology,STEM,3,Intermediate,PSIO 201,None,"Cardiovascular, respiratory, digestive, renal systems"
PSIO 360,Animal Physiology,Biology,STEM,3,Advanced,"PSIO 201 or equivalent",None,"Comparative physiology across animal groups"
BIOC 384,Biochemistry,Biology,STEM,3,Advanced,"CHEM 241B, ECOL 182R",None,"Protein structure, enzymes, metabolism, cellular signaling"
BIOC 485,Advanced Biochemistry,Biology,STEM,3,Advanced,BIOC 384,None,"Protein folding, biotechnology applications"
CSC 100,Computer Science Principles,"Computer Science",STEM,3,Beginner,None,None,"Computational thinking, problem-solving, algorithms"
CSC 110,Introduction to Computer Science,"Computer Science",STEM,3,Beginner,None,None,"Programming fundamentals, data types, control flow"
CSC 130,"Computer Programming I (C/C++)","Computer Science",STEM,3,Beginner,None,None,"Object-oriented programming fundamentals"
CSC 131,Computer Programming II,"Computer Science",STEM,3,Beginner,"CSC 130 or CSC 110",None,"Advanced OOP, data structures, algorithms"
CSC 210,Data Structures,"Computer Science",STEM,3,Intermediate,"CSC 110 or CSC 130",None,"Arrays, linked lists, stacks, queues, trees, sorting"
CSC 220,Introduction to Discrete Mathematics,"Computer Science",STEM,3,Intermediate,MATH 122A+,None,"Logic, sets, functions, graph theory, combinatorics"
CSC 230,Introduction to Computer Organization,"Computer Science",STEM,3,Intermediate,CSC 110,None,"Binary, CPU architecture, memory, assembly"
CSC 315,Principles of Programming Languages,"Computer Science",STEM,3,Advanced,CSC 210,None,"Language design, syntax, semantics, paradigms"
CSC 325,Analysis of Algorithms,"Computer Science",STEM,3,Advanced,"CSC 210, CSC 220",None,"Algorithm complexity, sorting, searching, NP-completeness"
CSC 335,Object-Oriented Programming and Design,"Computer Science",STEM,3,Advanced,CSC 210,None,"Design patterns, SOLID principles, UML"
CSC 343,Interactive Graphics,"Computer Science",STEM,3,Advanced,"CSC 210, MATH 223",None,"3D graphics, rendering, transformations, shaders"
CSC 355,Operating Systems,"Computer Science",STEM,3,Advanced,"CSC 210, CSC 230",None,"Processes, threads, scheduling, memory management"
CSC 372,Introduction to Database Systems,"Computer Science",STEM,3,Advanced,CSC 210,None,"SQL, relational algebra, normalization, transactions"
CSC 436,Software Engineering,"Computer Science",STEM,3,Advanced,CSC 335,None,"SDLC, testing, documentation, team development"
CSC 452,Web Programming,"Computer Science",STEM,3,Advanced,CSC 210,None,"HTML, CSS, JavaScript, frameworks, APIs"
CSC 456,Web Services and API Design,"Computer Science",STEM,3,Advanced,"CSC 210, CSC 372",None,"REST, microservices, cloud deployment"
CSC 465,Software Security,"Computer Science",STEM,3,Advanced,"CSC 210, CSC 230",None,"Cryptography, vulnerabilities, secure coding"
ENGR 100,Introduction to Engineering,Engineering,STEM,3,Beginner,None,None,"Engineering profession, design, problem-solving, teamwork"
ENGR 102,Introduction to Engineering,Engineering,STEM,3,Beginner,MATH 112+,None,"Engineering methods, CAD, design process"
ENGR 102A,Introduction to Engineering Part A,Engineering,STEM,1.5,Beginner,"MATH 112 or higher",None,"Engineering fundamentals part 1"
ENGR 102B,Introduction to Engineering Part B,Engineering,STEM,1.5,Beginner,"MATH 112 or higher (co-req)",None,"Engineering fundamentals part 2"
ENGR 200,Statics,Engineering,STEM,3,Intermediate,"PHYS 141, MATH 122A+",None,"Forces, moments, equilibrium, free body diagrams"
ENGR 300,Dynamics,Engineering,STEM,3,Intermediate,"ENGR 200, MATH 223",None,"Kinematics, kinetics of particles and rigid bodies"
ENGR 356,Thermodynamics,Engineering,STEM,3,Intermediate,"PHYS 142, CHEM 151",None,"First/second laws, cycles, entropy, applications"
ENGR 498A,Cross-disciplinary Design and Engineering Senior Capstone,Engineering,STEM,3,Advanced,"Senior status, completed major courses",None,"Interdisciplinary engineering design project"
ECE 101,Programming I,"Electrical and Computer Engineering",STEM,4,Intermediate,"MATH 112 or higher",None,"Programming fundamentals for engineers"
ECE 175,Computer Programming for Engineering,"Electrical and Computer Engineering",STEM,3,Intermediate,"MATH 122B/125 (co-requisite)","MATH 122B or 125","Programming in engineering context"
ECE 201,Programming II,"Electrical and Computer Engineering",STEM,3,Intermediate,"ECE 101, MATH 112+",None,"Advanced programming for engineers"
ECE 220,Basic Circuits,"Electrical and Computer Engineering",STEM,3,Intermediate,"MATH 122B or 125 (co-req)",None,"Circuit analysis, Kirchhoff's laws, resistive networks"
ECE 274A,Digital Logic,"Electrical and Computer Engineering",STEM,4,Intermediate,"ECE 175, MATH 129 or higher",None,"Boolean algebra, logic gates, combinational logic"
ECE 275,Computer Programming Applications II,"Electrical and Computer Engineering",STEM,3,Intermediate,"ECE 175, MATH 129+",None,"Advanced programming for ECE applications"
ECE 310,Applications of Engineering Mathematics,"Electrical and Computer Engineering",STEM,4,Advanced,"MATH 223, MATH 254",None,"Differential equations, transforms for engineering"
ECE 320A,Circuit Theory,"Electrical and Computer Engineering",STEM,3,Advanced,"ECE 220 or equivalent",None,"AC circuits, impedance, resonance, power analysis"
ECE 340A,Introduction to Communications,"Electrical and Computer Engineering",STEM,3,Advanced,ECE 310,None,"Signal analysis, modulation, communication systems"
ECE 351C,Electronic Circuits,"Electrical and Computer Engineering",STEM,4,Advanced,"ECE 320A, PHYS 142",None,"Transistors, amplifiers, op-amps, digital circuits"
ECE 352,Device Electronics,"Electrical and Computer Engineering",STEM,3,Advanced,"PHYS 142, CHEM 152",None,"Semiconductor physics, diodes, transistors"
ECE 369A,Fundamentals of Computer Organization,"Electrical and Computer Engineering",STEM,4,Advanced,ECE 274A,None,"CPU design, instruction sets, memory hierarchy"
ECE 372A,Microprocessor Organization,"Electrical and Computer Engineering",STEM,4,Advanced,"ECE 274A, CSC 210 or equivalent",None,"Microprocessor architecture, assembly, interfacing"
ECE 373,Object-Oriented Software Design,"Electrical and Computer Engineering",STEM,3,Advanced,"CSC 210 or ECE 201",None,"OOP principles, design patterns for hardware/software"
ECE 381A,Introductory Electromagnetics,"Electrical and Computer Engineering",STEM,4,Advanced,"PHYS 142, MATH 223+",None,"Maxwell's equations, waves, radiation"
ME 200,"Statics and Dynamics (Mechanical Engineering)",Engineering,STEM,3,Intermediate,"PHYS 141, MATH 122A+",None,"Forces, motion, equilibrium for mechanical systems"
ME 212,Introduction to Mechanical Engineering Design,Engineering,STEM,3,Intermediate,"ME 200 or ENGR 200",None,"Design process, CAD, analysis, prototyping"
ME 230,Properties of Materials,Engineering,STEM,3,Intermediate,"CHEM 151, PHYS 142",None,"Material structure, properties, selection, testing"
ME 300,Thermodynamics I,Engineering,STEM,3,Intermediate,"PHYS 142, CHEM 151, MATH 223",None,"First/second laws, cycles, equations of state"
ME 301,Thermodynamics II,Engineering,STEM,3,Advanced,ME 300,None,"Advanced thermodynamic cycles and applications"
ME 320,Fluid Mechanics I,Engineering,STEM,3,Advanced,"ME 200 or ENGR 200, MATH 254",None,"Fluid properties, flow equations, incompressible flow"
ME 340,Heat Transfer I,Engineering,STEM,3,Advanced,"ME 300, ME 320, MATH 254",None,"Conduction, convection, radiation fundamentals"
CHE 200,Introduction to Chemical Engineering,Engineering,STEM,3,Beginner,"CHEM 151, MATH 122A+",None,"Intro to unit operations, material/energy balances"
CHE 210,Material Balances and Process Calculations,Engineering,STEM,3,Intermediate,"CHE 200, MATH 129",None,"Stoichiometry, steady-state material balances"
CHE 320,Chemical Engineering Thermodynamics I,Engineering,STEM,3,Advanced,"CHEM 152, MATH 223, PHYS 142",None,"Thermodynamic principles for CHE applications"
DATA 190,Data Science Fundamentals,"Data Science",STEM,3,Beginner,"CSC 110 or programming experience",None,"Python/R basics, data structures, visualization"
DATA 210,Data Manipulation and Analysis,"Data Science",STEM,3,Intermediate,"DATA 190, STAT 110",None,"Pandas, data cleaning, exploratory analysis"
DATA 230,Machine Learning Fundamentals,"Data Science",STEM,3,Intermediate,"DATA 190, STAT 220 or STAT 110",None,"Supervised/unsupervised learning, model evaluation"
DATA 240,Data Visualization and Communication,"Data Science",STEM,3,Intermediate,"DATA 190, DATA 210",None,"Creating effective visualizations and presentations"
DATA 450,Advanced Machine Learning,"Data Science",STEM,3,Advanced,"DATA 230, MATH 313",None,"Deep learning, NLP, computer vision"
STAT 110,Statistical Methods I,Statistics,STEM,3,Beginner,"MATH 113 or MATH 112+",None,"Descriptive statistics, probability, hypothesis testing"
STAT 220,Statistical Methods II,Statistics,STEM,3,Intermediate,STAT 110,None,"Regression, ANOVA, correlation, non-parametric tests"
STAT 300,Introduction to Probability,Statistics,STEM,3,Intermediate,"MATH 129, STAT 110",None,"Probability theory, random variables, distributions"
STAT 360,Probability and Mathematical Statistics,Statistics,STEM,3,Advanced,"STAT 220, MATH 223",None,"Probability theory, inference, hypothesis testing"
STAT 461,Bayesian Statistics,Statistics,STEM,3,Advanced,"STAT 360 or STAT 220",None,"Bayesian inference, priors, posterior analysis"
ASTR 110,Introductory Astronomy,Astronomy,STEM,3,Beginner,None,None,"Solar system, stars, galaxies, cosmology"
ASTR 310,Stellar Astrophysics,Astronomy,STEM,3,Advanced,"PHYS 142, MATH 223",None,"Stellar structure, evolution, nucleosynthesis"
ASTR 350,Galaxies and Cosmology,Astronomy,STEM,3,Advanced,"ASTR 110 recommended, PHYS 142",None,"Galaxy structure, dark matter, cosmological models"
GEOS 100,Introduction to Geology I (Lecture),Geology,STEM,3,Beginner,None,None,"Earth materials, plate tectonics, Earth history"
GEOS 101,Introduction to Geology I (Lab),Geology,STEM,1,Beginner,"GEOS 100 (co-requisite)",GEOS 100,"Minerals, rocks, field methods"
GEOS 102,Introduction to Geology II (Lecture),Geology,STEM,3,Beginner,GEOS 100,None,"Structural geology, Earth resources, hazards"
GEOS 103,Introduction to Geology II (Lab),Geology,STEM,1,Beginner,"GEOS 102 (co-requisite)",GEOS 102,"Geologic structures, maps, field work"
GEOS 200,Physical Geology,Geology,STEM,4,Intermediate,"GEOS 100, PHYS 102 or PHYS 141",None,"Detailed mineral and rock study"
GEOS 210,Earth History,Geology,STEM,4,Intermediate,GEOS 102,None,"Paleontology, stratigraphy, geological time"
GEOS 320,Mineralogy,Geology,STEM,3,Advanced,"GEOS 200, CHEM 152",None,"Crystal structure, mineral classification"
ECON 181A,Principles of Microeconomics,Economics,Business,3,Beginner,None,None,"Supply and demand, consumer behavior, market structures"
ECON 181B,Principles of Macroeconomics,Economics,Business,3,Beginner,None,None,"GDP, inflation, unemployment, monetary policy"
ECON 200,Basic Economic Issues,Economics,Business,3,Beginner,None,None,"Current economic topics and analysis"
ECON 280,International Economics,Economics,Business,3,Intermediate,"ECON 181A or 181B",None,"International trade, finance, exchange rates"
ECON 281A,Intermediate Microeconomics,Economics,Business,3,Intermediate,"ECON 181A, MATH 113+",None,"Consumer/producer theory, competition, pricing"
ECON 281B,Intermediate Macroeconomics,Economics,Business,3,Intermediate,"ECON 181B, MATH 113+",None,"National accounting, growth, inflation models"
ECON 300,Economic Analysis for Decision Making,Economics,Business,3,Intermediate,"ECON 181A or 181B, MATH 113+",None,"Economic reasoning for business decisions"
ECON 330,Money and Banking,Economics,Business,3,Intermediate,"ECON 181B, ECON 281B recommended",None,"Monetary system, central banks, financial markets"
ECON 360,Environmental Economics,Economics,Business,3,Intermediate,ECON 181A,None,"Environmental issues, externalities, sustainability"
ECON 490,Econometrics,Economics,Business,3,Advanced,"ECON 281A or 281B, STAT 220",None,"Regression analysis, causal inference, forecasting"
ACCT 151,Principles of Accounting I,Accounting,Business,3,Beginner,None,None,"Financial accounting, accounting cycle, financial statements"
ACCT 152,Principles of Accounting II,Accounting,Business,3,Beginner,ACCT 151,None,"Partnerships, corporations, cash flow analysis"
ACCT 200,Introduction to Financial Accounting,Accounting,Business,3,Beginner,None,None,"Accounting fundamentals for business"
ACCT 205,Managerial Accounting,Accounting,Business,3,Beginner,"ACCT 200 or ACCT 201",None,"Cost accounting, budgeting, performance analysis"
ACCT 206,Intermediate Financial Accounting I,Accounting,Business,3,Intermediate,"ACCT 200 or ACCT 205",None,"GAAP, financial reporting, asset valuation"
ACCT 305,Intermediate Financial Accounting II,Accounting,Business,3,Intermediate,ACCT 206,None,"Revenue recognition, liabilities, investments"
ACCT 306,Intermediate Financial Accounting III,Accounting,Business,3,Intermediate,ACCT 305,None,"Equity, taxation, earnings per share"
ACCT 310,Cost and Managerial Accounting,Accounting,Business,3,Intermediate,"ACCT 205 or ACCT 206",None,"Cost allocation, variances, decision-making"
ACCT 390,Federal Income Tax - Individuals,Accounting,Business,3,Intermediate,"ACCT 200 or ACCT 205",None,"Income tax principles, deductions, return preparation"
ACCT 400A,Intermediate Financial Accounting,Accounting,Business,3,Advanced,"ACCT 305 or ACCT 306",None,"Advanced financial reporting topics"
ACCT 407,Advanced Financial Accounting,Accounting,Business,3,Advanced,"ACCT 305 and ACCT 310",None,"Business combinations, consolidated statements"
ACCT 430,Information Quality and Assurance,Accounting,Business,3,Advanced,ACCT 206,None,"Audit principles, internal controls, compliance"
ACCT 490,Accounting Capstone,Accounting,Business,3,Advanced,"Senior status, ACCT 300+",None,"Integration of accounting knowledge"
FIN 200,Introduction to Finance,Finance,Business,3,Beginner,"ACCT 151 or equivalent",None,"Financial markets, valuation, risk basics"
FIN 300,Fundamentals of Finance,Finance,Business,3,Intermediate,"ECON 181A or ECON 181B, ACCT 151+",None,"Time value of money, valuation, portfolio theory"
FIN 315,Corporate Finance,Finance,Business,3,Intermediate,"FIN 300, ACCT 151+",None,"Capital budgeting, financing decisions, risk management"
FIN 330,Investments,Finance,Business,3,Intermediate,"FIN 300 or FIN 315",None,"Asset valuation, portfolio management, derivatives"
FIN 345,Real Estate Principles and Practices,Finance,Business,3,Intermediate,"FIN 300 or FIN 315",None,"Property valuation, markets, investment analysis"
FIN 400,International Financial Management,Finance,Business,3,Advanced,FIN 315,None,"Foreign exchange, international investments, finance"
FIN 410,Financial Institutions and Markets,Finance,Business,3,Advanced,"FIN 300, ECON 281B recommended",None,"Banking, capital markets, financial intermediation"
FIN 490,Derivatives and Risk Management,Finance,Business,3,Advanced,"FIN 330, STAT 220",None,"Options, futures, hedging, VaR analysis"
MGMT 201,Organizational Behavior,Management,Business,3,Intermediate,"BUS 110 or MGMT 100",None,"Individual/group behavior, motivation, teams"
MGMT 301,Organizational Design and Change,Management,Business,3,Intermediate,MGMT 201,None,"Structure, culture, change management, innovation"
MGMT 310A,Management and Leadership,Management,Business,3,Intermediate,"Professional admission required",None,"Leadership styles, decision-making, team management"
MGMT 360,Human Resource Management,Management,Business,3,Intermediate,"MGMT 201 or MGMT 310A",None,"Recruitment, training, compensation, relations"
MGMT 375,Supply Chain Management,Management,Business,3,Intermediate,"MGMT 310A, STAT 110 recommended",None,"Procurement, operations, logistics"
MGMT 390,Strategic Business Analysis,Management,Business,3,Intermediate,"ECON 281A, STAT 110 recommended",None,"Strategic planning, competitive analysis, execution"
MGMT 402,Strategic Management Capstone,Management,Business,3,Advanced,"Senior status, completion of major courses",None,"Integration of functional areas, strategy formulation"
MKTG 200,Introduction to Marketing,Marketing,Business,3,Beginner,None,None,"Marketing mix, consumer behavior, strategy basics"
MKTG 301,Marketing Research,Marketing,Business,3,Intermediate,"MKTG 200, STAT 110",None,"Research design, data analysis, consumer insights"
MKTG 310A,Brand Management and Strategy,Marketing,Business,3,Intermediate,"MKTG 200, ECON 181A",None,"Brand positioning, equity, development"
MKTG 330,Digital Marketing and E-Commerce,Marketing,Business,3,Intermediate,MKTG 200,None,"Online strategy, social media, analytics"
MKTG 345,Consumer Behavior,Marketing,Business,3,Intermediate,"MKTG 200, PSYC 101 recommended",None,"Psychological and sociological factors in decisions"
MKTG 361,International Marketing,Marketing,Business,3,Intermediate,"MKTG 200, ECON 181A+",None,"Global markets, cultural adaptation, entry strategies"
MKTG 400,Integrated Marketing Communications,Marketing,Business,3,Advanced,"MKTG 310A or MKTG 330",None,"Advertising, PR, promotion integration"
MKTG 490,Marketing Strategy Capstone,Marketing,Business,3,Advanced,"Senior status, MKTG 300+",None,"Comprehensive marketing campaign development"
BNAD 200,Career Management in Business,Business Administration,Business,3,Beginner,None,None,"Career planning, professional development"
BNAD 300,Special Topics in Business Administration,Business Administration,Business,3,Intermediate,Professional admission,None,"Rotating current business topics"
BNAD 335,Data Analytics for Business,Business Administration,Business,3,Intermediate,"STAT 110, ECON 181A or 181B",None,"Business analytics, dashboards, insight generation"
BNAD 350,International Business,Business Administration,Business,3,Intermediate,"BNAD 200, ECON 181B",None,"Global business environment, strategy, operations"
BNAD 391,Ethics in Business,Business Administration,Business,3,Intermediate,Professional admission,None,"Business ethics, stakeholder analysis, corporate responsibility"
BNAD 401,Management Information Systems,Business Administration,Business,3,Advanced,"BNAD 200, BNAD 335 recommended",None,"IT strategy, systems implementation, cybersecurity"
BNAD 440,Entrepreneurship and New Venture Development,Business Administration,Business,3,Advanced,"Professional admission, ACCT 200+, MKTG 200+",None,"Business planning, financing, launching ventures"
BNAD 445,Family Business Management,Business Administration,Business,3,Advanced,"MGMT 310A, ACCT 200+",None,"Succession planning, governance, operations"
BNAD 490,Business Strategy Capstone,Business Administration,Business,3,Advanced,"Senior status, completion of major courses",None,"Comprehensive strategic analysis and planning"
ENTR 455,Entrepreneurship Capstone: Business Plan Development,Entrepreneurship,Business,3,Advanced,"ACCT 200, MKTG 200, MGMT 310A+",None,"Develop comprehensive business plan for venture"
COMM 320,Business Communication,Business Administration,Business,3,Intermediate,"ENG 102 or equivalent",None,"Professional writing, presentations, collaboration"
BCOM 314R,Strategic Business Communication,Business Administration,Business,3,Intermediate,"COMM 320 or professional admission",None,"Strategic communication for business advantage"
PRE-MED 100,Pre-Health Sciences Seminar,Pre-Health,Medical,1,Beginner,None,None,"Introduction to pre-health requirements and careers"
PSIO 201,Human Physiology I,Biology,Medical,3,Intermediate,"BIO 181H or MCB 181R",None,"Cellular physiology, nervous, endocrine systems"
PSIO 202,Human Physiology II,Biology,Medical,3,Intermediate,PSIO 201,None,"Cardiovascular, respiratory, digestive, renal systems"
PSIO 360,Animal Physiology,Biology,Medical,3,Advanced,"PSIO 201 or PSIO 202",None,"Comparative physiology across animal groups"
BIOC 384,Biochemistry,Biology,Medical,3,Advanced,"CHEM 241B, ECOL 182R",None,"Protein structure, enzymes, metabolism, signaling"
BIOC 485,Advanced Biochemistry,Biology,Medical,3,Advanced,BIOC 384,None,"Protein engineering, biotechnology applications"
MICB 300,Medical Microbiology,Biology,Medical,3,Advanced,"BIO 245 or MCB 181R, CHEM 152",None,"Pathogenic microorganisms, immune response"
MICB 320,Immunology,Biology,Medical,3,Advanced,"BIO 245 or MICB 300",None,"Antibodies, immune cells, vaccination, disease"
MCB 330,Critical Reasoning in Biomedicine,Biology,Medical,3,Advanced,"Junior/senior status, MCB/ECOL 181R+",None,"Primary literature analysis, scientific method"
CHEM 151,General Chemistry I,Chemistry,Medical,4,Beginner,"Placement or High School Chemistry",None,"Atomic structure, bonding, stoichiometry, reactions"
CHEM 152,General Chemistry II,Chemistry,Medical,4,Beginner,CHEM 151,None,"Solutions, equilibrium, acid-base, redox reactions"
CHEM 241A,Organic Chemistry I,Chemistry,Medical,3,Intermediate,"CHEM 152 with C or better","CHEM 243A Lab","Alkanes, alkenes, aromatic, mechanisms"
CHEM 241B,Organic Chemistry II,Chemistry,Medical,3,Intermediate,"CHEM 241A with C or better","CHEM 243B Lab","Carbonyl, amines, carboxylic acids, synthesis"
PHYS 141,Introductory Mechanics,Physics,Medical,4,Intermediate,"MATH 122A or 125 (co-requisite)",None,"Kinematics, dynamics, energy, momentum, waves"
PHYS 241,Introductory Electricity and Magnetism,Physics,Medical,4,Intermediate,PHYS 141,None,"E&M theory and applications"
PSYC 101,Introduction to Psychology,Psychology,Medical,3,Beginner,None,None,"Research methods, sensation, perception, learning"
PSYC 280,Research Methods in Psychology,Psychology,Medical,3,Intermediate,"PSYC 101, STAT 110",None,"Experimental design, statistics, validity"
SOCL 101,Introduction to Sociology,Sociology,Medical,3,Beginner,None,None,"Social structures, institutions, cultural patterns"
ENGL 101,Composition I,English,Medical,3,Beginner,None,None,"Writing process, argumentation, research"
ENGL 102,Composition II,English,Medical,3,Beginner,ENG 101,None,"Advanced composition, synthesis, analysis"`;

// Parse CSV string to Course array
function parseCSV(csv: string): Course[] {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const courses: Course[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        // Handle quoted fields properly
        const values = line.match(/(".*?"|[^,]+)/g) || [];

        if (values.length >= 9) {
            const course: Course = {
                courseCode: values[0]!.replace(/"/g, '').trim(),
                courseName: values[1]!.replace(/"/g, '').trim(),
                department: values[2]!.replace(/"/g, '').trim(),
                track: values[3]!.replace(/"/g, '').trim(),
                credits: parseFloat(values[4]!.replace(/"/g, '').trim()), // Use parseFloat for credits just in case
                level: values[5]!.replace(/"/g, '').trim(),
                prerequisite1: values[6]!.replace(/"/g, '').trim(),
                prerequisite2: values[7]!.replace(/"/g, '').trim(),
                description: values[8]!.replace(/"/g, '').trim()
            };
            courses.push(course);
        }
    }

    return courses;
}

// Load and cache courses
let coursesCache: Course[] | null = null;

export function getCourses(): Course[] {
    if (!coursesCache) {
        coursesCache = parseCSV(courseDataCSV);
    }
    return coursesCache;
}

// Search courses by code
export function searchCourseByCode(code: string): Course | undefined {
    const courses = getCourses();
    return courses.find(c =>
        c.courseCode.toUpperCase() === code.toUpperCase()
    );
}

// Search courses by name (partial match)
export function searchCoursesByName(name: string): Course[] {
    const courses = getCourses();
    const searchLower = name.toLowerCase();
    return courses.filter(c =>
        c.courseName.toLowerCase().includes(searchLower) ||
        c.courseCode.toLowerCase().includes(searchLower) ||
        c.department.toLowerCase().includes(searchLower)
    );
}

// Get prerequisites for a course
export function getPrerequisites(courseCode: string): Course[] {
    const course = searchCourseByCode(courseCode);
    if (!course) return [];

    const courses = getCourses();
    const prerequisites: Course[] = [];

    // Parse prerequisite strings and find matching courses
    const parsePrereqString = (prereqStr: string): string[] => {
        if (!prereqStr || prereqStr === 'None') return [];

        // Handle "OR" separated prerequisites
        return prereqStr
            .split(' or ')
            .map(p => {
                // Extract course code (e.g., "MATH 113" from "MATH 113 or placement test")
                const match = p.match(/[A-Z]{2,4}\s\d{3}[A-Z]?/);
                return match ? match[0] : '';
            })
            .filter(code => code !== '');
    };

    const prereqCodes = [
        ...parsePrereqString(course.prerequisite1),
        ...parsePrereqString(course.prerequisite2)
    ];

    prereqCodes.forEach(code => {
        const prereq = searchCourseByCode(code);
        if (prereq && !prerequisites.find(p => p.courseCode === prereq.courseCode)) {
            prerequisites.push(prereq);
        }
    });

    return prerequisites;
}

// Get all courses in a department
export function getCoursesByDepartment(department: string): Course[] {
    const courses = getCourses();
    return courses.filter(c =>
        c.department.toLowerCase() === department.toLowerCase()
    );
}

// Get all courses of a certain level
export function getCoursesByLevel(level: string): Course[] {
    const courses = getCourses();
    return courses.filter(c =>
        c.level.toLowerCase() === level.toLowerCase()
    );
}

// Get all unique departments
export function getDepartments(): string[] {
    const courses = getCourses();
    return [...new Set(courses.map(c => c.department))].sort();
}

interface BatchRecommendation {
    name: string;
    description: string;
}

export function getBatchRecommendation(percentage: number): BatchRecommendation {
    if (percentage >= 90) {
        return {
            name: 'Fast Track',
            description: 'You have demonstrated mastery. Eligible for the accelerated 7-week track.'
        };
    } else if (percentage >= 75) {
        return {
            name: 'Standard Track',
            description: 'You are well-prepared. Recommended for the standard full-semester track.'
        };
    } else {
        // Both < 75% go to supported, technically <60 is intensive but we main buckets are A/B/C
        // Let's map 60-74 to Supported and <60 also to Supported but maybe with stronger wording?
        // For consistency with Dashboard, we'll keep it simple:
        return {
            name: 'Supported Track',
            description: 'Additional support recommended. Full semester track with tutoring included.'
        };
    }
}