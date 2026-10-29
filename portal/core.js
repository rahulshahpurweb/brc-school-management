// core.js - Central Source of Truth & Live Bridge for BRC Shahpur Portal

window.MASTER_SCHOOLS = [
  {name: "GPS DHODHARAMOHAR", udise: "23351008101", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) HAWAL DARDHANA", udise: "23351008202", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS GURGUNDA 1 TO 8", udise: "23351008203", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bhoura"},
  {name: "GPS CHIRMATEKRI", udise: "23351008301", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GOVT. HS DHAR 1 TO 10", udise: "23351008403", category: "Primary to High School (Class 1 to 10)", jsk: "Bhoura"},
  {name: "GPS CHIMDI", udise: "23351011601", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS DENDUPURA", udise: "23351011901", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS GUVADI 1 TO 8", udise: "23351012102", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bhoura"},
  {name: "GOVT. HSS DHAPADA 1 TO 12", udise: "23351012204", category: "Primary to Higher Secondary School(Class 1 to 12)", jsk: "Bhoura"},
  {name: "GMS NEW CHIKHALDA BUJURG 1 TO 8", udise: "23351012302", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bhoura"},
  {name: "GPS(U) KOYAL BUDDI", udise: "23351015501", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) DHAPADA RAIYAT", udise: "23351016701", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS NAYA NISHAN 1 TO 8", udise: "23351017202", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bhoura"},
  {name: "GPS HANDIPANI", udise: "23351002901", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS NEW HANDIPANI", udise: "23351002902", category: "Middle School (Class 6 to 8)", jsk: "Bhoura"},
  {name: "GPS SONADHEH", udise: "23351003001", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) JHIRIYA DOL", udise: "23351003002", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS BANABEHDA", udise: "23351003101", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS BANABEHDA", udise: "23351003102", category: "Middle School (Class 6 to 8)", jsk: "Bhoura"},
  {name: "GPS TWD KALAPANI", udise: "23351004803", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS KOYLARI", udise: "23351005001", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS KOYLARI", udise: "23351005003", category: "Middle School (Class 6 to 8)", jsk: "Bhoura"},
  {name: "GPS JHAPDI", udise: "23351005101", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS JHAPDI", udise: "23351005102", category: "Middle School (Class 6 to 8)", jsk: "Bhoura"},
  {name: "GPS(U) MAGRA PURA", udise: "23351005103", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GOVT. HS KACHHAR 1 TO 10", udise: "23351005204", category: "Primary to High School (Class 1 to 10)", jsk: "Bhoura"},
  {name: "GPS KHAPA JHAPDI", udise: "23351005301", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) KHAPA DHANA", udise: "23351005302", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) KOCHAMAU", udise: "23351005303", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS (U) VIRGUWADI", udise: "23351005304", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS BEHRAPURA", udise: "23351005401", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS MANSINGPURA", udise: "23351005501", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) NAYAPURA", udise: "23351005502", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) SEMALPURA", udise: "23351005503", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS SALIMET 1 TO 8", udise: "23351005602", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bhoura"},
  {name: "GPS(U) POLAPATHAR", udise: "23351005603", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS(U) BODIPANI", udise: "23351005604", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS JODIYAMAU", udise: "23351005701", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS BHORADHANA", udise: "23351008003", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GPS GIRLS ASHRAM BHORA", udise: "23351008006", category: "Primary School (Class 1 to 5)", jsk: "Bhoura"},
  {name: "GMS GIRLS BHORA 1 TO 8", udise: "23351008008", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bhoura"},
  {name: "GOVT. HSS GIRL'S BHOURA 6 TO 12", udise: "23351008014", category: "Middle to Higher Secondary School (Class 6 to 12)", jsk: "Bhoura"},
  {name: "GMS KOTHA 1 TO 8", udise: "23351003502", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bijadehi"},
  {name: "GPS(U) JAKA DHANA", udise: "23351005803", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GOVT.HSS BIJADEHI 1 TO 12", udise: "23351005804", category: "Primary to Higher Secondary School(Class 1 to 12)", jsk: "Bijadehi"},
  {name: "GPS KANJITALAB", udise: "23351005901", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "MS KANJITALAB", udise: "23351005902", category: "Middle School (Class 6 to 8)", jsk: "Bijadehi"},
  {name: "GPS SELDA", udise: "23351006001", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS KAJLI", udise: "23351006101", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GMS KAJLI", udise: "23351006102", category: "Middle School (Class 6 to 8)", jsk: "Bijadehi"},
  {name: "GPS DUDAR", udise: "23351006201", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS MENDHAKHEDA", udise: "23351006301", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS SITADONGRI", udise: "23351006401", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GMS SITADONGRI", udise: "23351006402", category: "Middle School (Class 6 to 8)", jsk: "Bijadehi"},
  {name: "GPS(U) TANGNA RAIYAT", udise: "23351006502", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GNMS TANGNAMAL 1 TO 8", udise: "23351006504", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bijadehi"},
  {name: "GPS TENDUKHEDA", udise: "23351006701", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GMS TENDUKHEDA", udise: "23351006703", category: "Middle School (Class 6 to 8)", jsk: "Bijadehi"},
  {name: "GMS BARJORPUR 1 TO 8", udise: "23351006802", category: "Primary with Middle School (Class 1 to 8)", jsk: "Bijadehi"},
  {name: "GPS RATAMDHANA", udise: "23351006901", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS KAWLIKHEDA", udise: "23351007001", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS DHAMNYA", udise: "23351001801", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS(U) CHAK SANGWANI", udise: "23351001902", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS PANDAJHIRI", udise: "23351002001", category: "Primary School (Class 1 to 5)", jsk: "Bijadehi"},
  {name: "GPS PHOPHLYA (MAL)", udise: "23351016601", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GMS TARAMKHEDA RAIYAT 1 TO 8", udise: "23351017001", category: "Primary with Middle School (Class 1 to 8)", jsk: "Dhodhramau"},
  {name: "GMS BOD 1 TO 8", udise: "23351003602", category: "Primary with Middle School (Class 1 to 8)", jsk: "Dhodhramau"},
  {name: "GPS DHODHARAMAHU", udise: "23351007101", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS(U) BHIMPURA", udise: "23351007103", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS(U) PANDRA SEL", udise: "23351007104", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GOVT. HS DHODHRAMAU 6 TO 10", udise: "23351007105", category: "Middle to High School (Class 6 to 10)", jsk: "Dhodhramau"},
  {name: "GPS KHARWAR", udise: "23351007201", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS(U) BANDIDHANA", udise: "23351007302", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GMS TIMARNI 1 TO 8", udise: "23351007303", category: "Primary with Middle School (Class 1 to 8)", jsk: "Dhodhramau"},
  {name: "GMS PAT 1 TO 8", udise: "23351007402", category: "Primary with Middle School (Class 1 to 8)", jsk: "Dhodhramau"},
  {name: "GOVT. HS DABRI 1 to 10", udise: "23351007503", category: "Primary to High School (Class 1 to 10)", jsk: "Dhodhramau"},
  {name: "GPS(U) RUMAKOL", udise: "23351007504", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS(U) DONDIYA KAU", udise: "23351007505", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS DHANVAR", udise: "23351007601", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS TARAMKHEDA", udise: "23351007701", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS SAWRIDA", udise: "23351007801", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS DHUTTAPURA", udise: "23351007901", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS PHOPHLYA", udise: "23351001601", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GOVT. HS PHOPHLYA 6 TO 10", udise: "23351001604", category: "Middle to High School (Class 6 to 10)", jsk: "Dhodhramau"},
  {name: "GPS NIMIYA", udise: "23351001701", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "PS SANGWANI", udise: "23351001901", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GPS BUDIMAI", udise: "23351002201", category: "Primary School (Class 1 to 5)", jsk: "Dhodhramau"},
  {name: "GMS KESIYA 1 TO 8", udise: "23351008502", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kesiya"},
  {name: "GPS(U) PINJARA DHANA", udise: "23351008503", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS(U) OOJHA DHANA", udise: "23351008504", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS BONDRI", udise: "23351008601", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GMS SEHRA 1 TO 8", udise: "23351008702", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kesiya"},
  {name: "GMS KANHEGAON 1 TO 8", udise: "23351008803", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kesiya"},
  {name: "GPS(U) GONDIDHANA", udise: "23351009002", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS(U) TEKRI DHANA", udise: "23351009004", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GOVT. HS MANDAI BUJURGE 1 to 10", udise: "23351009005", category: "Primary to High School (Class 1 to 10)", jsk: "Kesiya"},
  {name: "GPS BHAGUDHANA", udise: "23351009701", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS DHOLYADHANA", udise: "23351010001", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GOVT. HSS RAMPUR MAL 1 TO 12", udise: "23351010903", category: "Primary to Higher Secondary School(Class 1 to 12)", jsk: "Kesiya"},
  {name: "GMS KHOKRA 1 TO 8", udise: "23351011002", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kesiya"},
  {name: "GPS(U) NAKADHANA", udise: "23351011003", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GMS SITALJHIRI 1 TO 8", udise: "23351011102", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kesiya"},
  {name: "GPS(U) NAVALSINGH DHANA", udise: "23351011103", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS THAPPA", udise: "23351011201", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS(U) KHEDA DHANA", udise: "23351011202", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS HATHIKUND", udise: "23351011301", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS RAMPUR RAIYAT", udise: "23351011401", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS(U) BADA DHANA", udise: "23351011402", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS TEMRA", udise: "23351011501", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GMS NEW TEMRA MAL", udise: "23351011503", category: "Middle School (Class 6 to 8)", jsk: "Kesiya"},
  {name: "GPS(U) TEMRA RAIYAT", udise: "23351014201", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS(U) GAOLIDHANA", udise: "23351017101", category: "Primary School (Class 1 to 5)", jsk: "Kesiya"},
  {name: "GPS (S) NAVRANGDHANA", udise: "23351010103", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GOVT. HS KUNDI 1 TO 10", udise: "23351010104", category: "Primary to High School (Class 1 to 10)", jsk: "Kundi"},
  {name: "GPS MAGARDOH", udise: "23351010201", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS KAMTI", udise: "23351010301", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS BANKAKHODRI", udise: "23351010401", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS(U) KHODRI", udise: "23351010402", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS (U) THANIKHEDA", udise: "23351010403", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS NEW BANKAKHODRI", udise: "23351010404", category: "Middle School (Class 6 to 8)", jsk: "Kundi"},
  {name: "GPS KUSMARI", udise: "23351010501", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS MARDANPUR 1 TO 8", udise: "23351010602", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kundi"},
  {name: "GPS DAODI", udise: "23351010701", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS BHUMKADHANA", udise: "23351010801", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS NEW DHASAI 1 TO 8", udise: "23351011702", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kundi"},
  {name: "GMS RANAPURA 1 TO 8", udise: "23351011802", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kundi"},
  {name: "GPS BHATNA", udise: "23351012001", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS(U) HEERAWADI", udise: "23351015001", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS(U) JAMNAGRI", udise: "23351015201", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS KUPPA 1 TO 8", udise: "23351003303", category: "Primary with Middle School (Class 1 to 8)", jsk: "Kundi"},
  {name: "GPS TETARMAL", udise: "23351003401", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS BANKABHARDA", udise: "23351004301", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS PATWAPURA", udise: "23351000103", category: "Middle School (Class 6 to 8)", jsk: "Kundi"},
  {name: "GPS CHIKHALDA (KHURD)", udise: "23351000201", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "PS CHAPDA (RAIYAT)", udise: "23351000301", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS JHILPA", udise: "23351000501", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS PHAWADI", udise: "23351000601", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS PHAWADI", udise: "23351000602", category: "Middle School (Class 6 to 8)", jsk: "Kundi"},
  {name: "PS(U) CHILAM TEKRI", udise: "23351000603", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS(U) TEKRIPURA", udise: "23351000704", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GOVT. HS RAIPUR 1 TO 10", udise: "23351000705", category: "Primary to High School (Class 1 to 10)", jsk: "Kundi"},
  {name: "GPS JAMUNDHANA", udise: "23351000801", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS JAMUNDHANA", udise: "23351000802", category: "Middle School (Class 6 to 8)", jsk: "Kundi"},
  {name: "GPS SEMARPUR", udise: "23351000901", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GOVT. HS PAWAR JHANDA 1 TO 10", udise: "23351001004", category: "Primary to High School (Class 1 to 10)", jsk: "Kundi"},
  {name: "GPS MUDHA", udise: "23351001101", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GMS MUDHA", udise: "23351001102", category: "Middle School (Class 6 to 8)", jsk: "Kundi"},
  {name: "GPS(SATT) MUDHA", udise: "23351001103", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS AAMDHANA", udise: "23351001201", category: "Primary School (Class 1 to 5)", jsk: "Kundi"},
  {name: "GPS(U) GAONAPUR", udise: "23351012401", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS(U) CHAOKIDHANA", udise: "23351002304", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS(U) JILERI", udise: "23351002305", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GOVT HS BHAYAWADI 1 TO 10", udise: "23351002307", category: "Primary to High School (Class 1 to 10)", jsk: "Shahpur"},
  {name: "GPS DESHAWADI", udise: "23351002401", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GMS DESHAWADI", udise: "23351002402", category: "Middle School (Class 6 to 8)", jsk: "Shahpur"},
  {name: "GPS(U) ADMADHANA", udise: "23351002403", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS MOKHAMAL", udise: "23351002501", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS MOKHARAIYAT", udise: "23351002601", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS(U) CHITARIBAD", udise: "23351002602", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GMS MALI SILPATI 1 TO 8", udise: "23351002702", category: "Primary with Middle School (Class 1 to 8)", jsk: "Shahpur"},
  {name: "GPS BARETHA", udise: "23351002801", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GMS BARETHA", udise: "23351002802", category: "Middle School (Class 6 to 8)", jsk: "Shahpur"},
  {name: "GPS NISHANA", udise: "23351003701", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS(U) DEHRI PATHAR", udise: "23351003804", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GOVT. HS SILPATI 1 TO 10", udise: "23351003807", category: "Primary to High School (Class 1 to 10)", jsk: "Shahpur"},
  {name: "GMS BOYS SHAHPUR 1 TO 8", udise: "23351003907", category: "Primary with Middle School (Class 1 to 8)", jsk: "Shahpur"},
  {name: "GPS SOHAGPUR DHANA", udise: "23351004001", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS KOTMI", udise: "23351004101", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GMS KOTMI 1 TO 8", udise: "23351004102", category: "Primary with Middle School (Class 1 to 8)", jsk: "Shahpur"},
  {name: "GPS KANTAWADI", udise: "23351004201", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GMS KANTAWADI", udise: "23351004202", category: "Middle School (Class 6 to 8)", jsk: "Shahpur"},
  {name: "GPS BHAKTANDHANA", udise: "23351004501", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS PATAI", udise: "23351004601", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GOVT. HS PATAI 6 TO 10", udise: "23351004603", category: "Middle to High School (Class 6 to 10)", jsk: "Shahpur"},
  {name: "GPS PALASPANI", udise: "23351004701", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS KALAPANI", udise: "23351004801", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GPS GENDIDHANA", udise: "23351004901", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GOVT.HSS MODEL (RMSA) SHAHPUR", udise: "23351003914", category: "Middle to Higher Secondary School (Class 6 to 12)", jsk: "Shahpur"},
  {name: "GPS BARBATPUR", udise: "23351000401", category: "Primary School (Class 1 to 5)", jsk: "Shahpur"},
  {name: "GOVT. HS GHISIBAGLA 6 TO 10", udise: "23351009103", category: "Middle to High School (Class 6 to 10)", jsk: "Tara"},
  {name: "GPS(U) RUMA DHANA", udise: "23351008802", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS AAVRIYA", udise: "23351008901", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS(U) MADIYA DHANA", udise: "23351009003", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS GHISIBAGLA", udise: "23351009101", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS TARA", udise: "23351009201", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GMS TARA", udise: "23351009202", category: "Middle School (Class 6 to 8)", jsk: "Tara"},
  {name: "GPS(U) BATTI DHANA", udise: "23351009203", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS(U) TENDUDHANA", udise: "23351009204", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS CHIKHALI RAIYAT", udise: "23351009301", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GMS CHIKHALI RAIYAT", udise: "23351009302", category: "Middle School (Class 6 to 8)", jsk: "Tara"},
  {name: "GPS(U) JARGAL DHANA", udise: "23351009303", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS(U) BAGAT DHANA", udise: "23351009304", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS CHIKHALI MAL", udise: "23351009401", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GMS CHIKHALI MAL", udise: "23351009402", category: "Middle School (Class 6 to 8)", jsk: "Tara"},
  {name: "GPS THUMKA", udise: "23351009501", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS(U) GAOLAN DHANA", udise: "23351009502", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GMS THUMKA RAIYAT", udise: "23351009504", category: "Middle School (Class 6 to 8)", jsk: "Tara"},
  {name: "GPS KAODIYA", udise: "23351009601", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS BAGLADHANA", udise: "23351009801", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GMS MANJIRADHANA 1 TO 8", udise: "23351009902", category: "Primary with Middle School (Class 1 to 8)", jsk: "Tara"},
  {name: "GPS(U) MATHI GARH", udise: "23351016501", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS CHIROTIYA", udise: "23351006601", category: "Primary School (Class 1 to 5)", jsk: "Tara"},
  {name: "GPS KHAPARWADI", udise: "23351002101", category: "Primary School (Class 1 to 5)", jsk: "Tara"}
];

window.CoreApp = {
  cloudApiUrl: "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec",
  MASTER_SCHOOLS: window.MASTER_SCHOOLS,

  // Strict Live Enrollment Fetcher from Session Storage / Local Storage (No Hard-coded estimates)
  getLiveEnrollment(udise) {
    try {
      if (!udise) return 0;
      let targetUdise = String(udise).trim();
      let schools = [];

      // 1. Check Session active storage first
      let activeSess = localStorage.getItem("brc_active_session") || "2026-27";
      let sessionKey = "brc_schools_" + activeSess;
      let sessionData = localStorage.getItem(sessionKey);
      
      if (sessionData) {
        try {
          let parsed = JSON.parse(sessionData);
          if (Array.isArray(parsed)) schools = parsed;
        } catch(e) {}
      }

      // 2. Fallback to other saved school keys if session data is empty
      if (schools.length === 0) {
        for (let i = 0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          if (key && (key.includes("brc_schools") || key.includes("saved_schools"))) {
            try {
              let val = JSON.parse(localStorage.getItem(key));
              if (Array.isArray(val) && val.length > 0) {
                schools = val;
                break;
              }
            } catch(e) {}
          }
        }
      }

      if (schools.length === 0) {
        schools = window.MASTER_SCHOOLS || [];
      }

      let school = schools.find(s => String(s.udise || "").trim() === targetUdise);
      if (!school || !school.classes) return 0;

      let total = 0;
      for (let c in school.classes) {
        let cl = school.classes[c] || {};
        let bSum = (parseInt(cl.scB) || 0) + (parseInt(cl.stB) || 0) + (parseInt(cl.obcB) || 0) + (parseInt(cl.genB) || 0);
        let gSum = (parseInt(cl.scG) || 0) + (parseInt(cl.stG) || 0) + (parseInt(cl.obcG) || 0) + (parseInt(cl.genG) || 0);
        total += (bSum + gSum);
      }
      return total;

    } catch (e) {
      return 0;
    }
  },

  async fetchCloudData() {
    try {
      let res = await fetch(this.cloudApiUrl + "?t=" + new Date().getTime());
      if (res.ok) {
        let data = await res.json();
        return data;
      }
    } catch(e) {}
    return null;
  }
};
