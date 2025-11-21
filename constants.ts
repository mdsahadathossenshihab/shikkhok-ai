import { ClassLevel, GroupType, Subject } from './types';

export const CLASS_OPTIONS = Object.values(ClassLevel);

export const GROUP_OPTIONS = [
  { label: 'বিজ্ঞান (Science)', value: GroupType.SCIENCE },
  { label: 'মানবিক (Arts)', value: GroupType.ARTS },
  { label: 'ব্যবসায় শিক্ষা (Commerce)', value: GroupType.COMMERCE },
];

// Helper to generate subjects
const createSubject = (id: string, name: string, icon: string, color: string, prompts: string[], chapters: string[]): Subject => ({
  id, name, icon, color, prompts, chapters
});

// ==========================================
// SSC (Class 9-10) SUBJECTS
// ==========================================

// --- Common (SSC) ---
const BANGLA_1ST_SSC = createSubject('bangla_1st_ssc', 'বাংলা ১ম পত্র', 'BookOpen', 'bg-emerald-600',
  ['সুভা গল্পের মূলভাব কী?', 'বঙ্গবাণী কবিতার প্রেক্ষাপট আলোচনা করো', 'কাকতাড়ুয়া উপন্যাসের বুধা চরিত্র বিশ্লেষণ করো'],
  [
    'গদ্য: শুভা', 'গদ্য: বই পড়া', 'গদ্য: অভাগীর স্বর্গ', 'গদ্য: আম আঁটির ভেঁপু', 'গদ্য: মানুষ মুহম্মদ (সা.)', 'গদ্য: নিমগাছ', 'গদ্য: উপৈক্ষিত শক্তির উদ্বোধন', 'গদ্য: শিক্ষা ও মনুষ্যত্ব', 'গদ্য: প্রবাস বন্ধু', 'গদ্য: মমতাদি', 'গদ্য: একাত্তরের দিনগুলি', 'গদ্য: সাহিত্যের রূপ ও রীতি',
    'কবিতা: বঙ্গবাণী', 'কবিতা: কপোতাক্ষ নদ', 'কবিতা: জীবন-সঙ্গীত', 'কবিতা: জুতা-আবিষ্কার', 'কবিতা: ঝর্ণার গান', 'কবিতা: মানুষ', 'কবিতা: সেই দিন এই মাঠ', 'কবিতা: পল্লিজননী', 'কবিতা: আশা', 'কবিতা: আমি কোনো আগন্তুক নই', 'কবিতা: রানার', 'কবিতা: তোমাকে পাওয়ার জন্য হে স্বাধীনতা', 'কবিতা: আমার পরিচয়', 'কবিতা: স্বাধীনতা, এই শব্দটি কীভাবে আমাদের হলো',
    'উপন্যাস: কাকতাড়ুয়া', 'নাটক: বহিপীর'
  ]
);

const BANGLA_2ND_SSC = createSubject('bangla_2nd_ssc', 'বাংলা ২য় পত্র', 'BookType', 'bg-emerald-700',
  ['সমাস কত প্রকার ও কী কী?', 'সন্ধি বিচ্ছেদ করো: বিদ্যালয়', 'ভাবসম্প্রসারণ লেখার নিয়ম কী?'],
  [
    '১. ভাষা ও বাংলা ভাষা', '২. বাংলা ব্যাকরণ ও এর আলোচ্য বিষয়', '৩. ধ্বনি ও বর্ণ', '৪. সন্ধি', '৫. শব্দ ও পদের গঠন', '৬. সমাস', '৭. উপসর্গ ও অনুসর্গ', '৮. শব্দ ও পদের শ্রেণিবিভাগ', '৯. কারক ও বিভক্তি', '১০. বাক্যতত্ত্ব', '১১. শব্দের অর্থ', '১২. বিরামচিহ্ন',
    'নির্মিতি: সারাংশ ও সারমর্ম', 'নির্মিতি: ভাবসম্প্রসারণ', 'নির্মিতি: অনুচ্ছেদ লিখন', 'নির্মিতি: পত্রলিখন', 'নির্মিতি: প্রতিবেদন প্রণয়ন', 'নির্মিতি: প্রবন্ধ রচনা'
  ]
);

const ENGLISH_1ST_SSC = createSubject('english_1st_ssc', 'English 1st Paper', 'Languages', 'bg-indigo-500',
  ['Summary of "Father of the Nation"', 'Describe the "Pahela Boishakh" festivities'],
  [
    'Unit 1: Father of the Nation', 'Unit 2: Pastime', 'Unit 3: Events and Festivals', 'Unit 4: Are We Aware?', 'Unit 5: Nature and Environment', 
    'Unit 6: Our Neighbours', 'Unit 7: People Who Stand Out', 'Unit 8: World Heritage', 'Unit 9: Unconventional Jobs', 'Unit 10: Dreams', 
    'Unit 11: Renewable Energy', 'Unit 12: Roots', 'Unit 13: Media and Modes of e-communication', 'Unit 14: Pleasure and Purpose'
  ]
);

const ENGLISH_2ND_SSC = createSubject('english_2nd_ssc', 'English 2nd Paper', 'PenTool', 'bg-indigo-600',
  ['Rules of Right form of verbs', 'Change the narration', 'Write a CV for the post of a Teacher'],
  [
    'Gap Filling (with clues)', 'Gap Filling (without clues)', 'Substitution Table', 'Right form of verbs', 'Narrative Style (Narration)', 
    'Changing Sentences', 'Completing Sentences', 'Suffix and Prefix', 'Tag Questions', 'Connectors', 'Punctuation',
    'Composition: CV Writing', 'Composition: Formal Letter/Email', 'Composition: Paragraph', 'Composition: Composition'
  ]
);

const MATH_SSC = createSubject('math_ssc', 'গণিত (General Math)', 'Calculator', 'bg-blue-600',
  ['পিথাগোরাসের উপপাদ্যটি প্রমাণ করো', 'সেট ও ফাংশনের পার্থক্য কী?'],
  ['১. বাস্তব সংখ্যা', '২. সেট ও ফাংশন', '৩. বীজগাণিতিক রাশি', '৪. সূচক ও লগারিদম', '৫. এক চলকবিশিষ্ট সমীকরণ', '৬. রেখা, কোণ ও ত্রিভুজ', '৭. ব্যবহারিক জ্যামিতি', '৮. বৃত্ত', '৯. ত্রিকোণমিতিক অনুপাত', '১০. দূরত্ব ও উচ্চতা', '১১. বীজগাণিতিক অনুপাত ও সমানুপাত', '১২. দুই চলকবিশিষ্ট সরল সহসমীকরণ', '১৩. সসীম ধারা', '১৪. অনুপাত, সদৃশতা ও প্রতিসমতা', '১৫. ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য', '১৬. পরিমিতি', '১৭. পরিসংখ্যান']
);

const ICT_SSC = createSubject('ict_ssc', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'Cpu', 'bg-purple-600',
  ['ডাটাবেজ ব্যবহারের সুবিধা কী?', 'ইন্টারনেট ও ওয়ার্ল্ড ওয়াইড ওয়েবের পার্থক্য'],
  ['১. তথ্য ও যোগাযোগ প্রযুক্তি এবং আমাদের বাংলাদেশ', '২. কম্পিউটার ও কম্পিউটার ব্যবহারকারীর নিরাপত্তা', '৩. ইন্টারনেট ও আমার শিক্ষাকার্যক্রম', '৪. আমার লেখালেখি ও হিসাব (Word & Excel)', '৫. মাল্টিমিডিয়া ও গ্রাফিক্স', '৬. ডেটাবেজ-এর ব্যবহার']
);

const RELIGION_ISLAM_SSC = createSubject('rel_islam_ssc', 'ইসলাম ও নৈতিক শিক্ষা', 'MoonStar', 'bg-teal-600', 
  ['আকাইদ কী?', 'হজ্জের গুরুত্ব আলোচনা করো'], ['১. আকাইদ ও নৈতিক জীবন', '২. শরীয়তের উৎস (ইবাদত)', '৩. ইবাদত', '৪. আখলাক', '৫. আদর্শ জীবনচরিত']
);

// --- Science (SSC) ---
const PHYSICS_SSC = createSubject('physics_ssc', 'পদার্থবিজ্ঞান', 'Atom', 'bg-violet-600',
  ['নিউটনের গতির সূত্রগুলো লেখ', 'গতিশক্তি ও বিভব শক্তির সম্পর্ক'],
  ['১. ভৌত রাশি ও পরিমাপ', '২. গতি', '৩. বল', '৪. কাজ, ক্ষমতা ও শক্তি', '৫. পদার্থের অবস্থা ও চাপ', '৬. বস্তুর ওপর তাপের প্রভাব', '৭. তরঙ্গ ও শব্দ', '৮. আলোর প্রতিফলন', '৯. আলোর প্রতিসরণ', '১০. স্থির তড়িৎ', '১১. চল তড়িৎ', '১২. বিদ্যুতের চৌম্বক ক্রিয়া', '১৩. আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স', '১৪. জীবন বাঁচাতে পদার্থবিজ্ঞান']
);

const CHEMISTRY_SSC = createSubject('chemistry_ssc', 'রসায়ন', 'FlaskConical', 'bg-orange-500',
  ['পর্যায় সারণিতে মৌলের অবস্থান নির্ণয় করো', 'জারণ-বিজারণ বিক্রিয়া ব্যাখ্যা করো'],
  ['১. রসায়নের ধারণা', '২. পদার্থের অবস্থা', '৩. পদার্থের গঠন', '৪. পর্যায় সারণি', '৫. রাসায়নিক বন্ধন', '৬. মোলের ধারণা ও রাসায়নিক গণনা', '৭. রাসায়নিক বিক্রিয়া', '৮. রসায়ন ও শক্তি', '৯. এসিড-ক্ষার সমতা', '১০. খনিজ সম্পদ: ধাতু ও অধাতু', '১১. খনিজ সম্পদ: জীবাশ্ম', '১২. আমাদের জীবনে রসায়ন']
);

const BIOLOGY_SSC = createSubject('biology_ssc', 'জীববিজ্ঞান', 'Dna', 'bg-emerald-500',
  ['মাইটোকন্ড্রিয়াকে কোষের শক্তিঘর বলা হয় কেন?', 'সালোকসংশ্লেষণ প্রক্রিয়ার ধাপগুলো'],
  ['১. জীবন পাঠ', '২. জীবকোষ ও টিস্যু', '৩. কোষ বিভাজন', '৪. জীবনীশক্তি', '৫. খাদ্য, পুষ্টি ও পরিপাক', '৬. জীবের পরিবহন', '৭. গ্যাসীয় বিনিময়', '৮. জীবের রেচন', '৯. দৃঢ়তা প্রদান ও চলন', '১০. সমন্বয়', '১১. জীবের প্রজনন', '১২. জীবের বংশগতি ও বিবর্তন', '১৩. জীবের পরিবেশ', '১৪. জীবপ্রযুক্তি']
);

const HIGHER_MATH_SSC = createSubject('hm_ssc', 'উচ্চতর গণিত', 'Variable', 'bg-sky-600',
  ['ফাংশনের ডোমেন ও রেঞ্জ নির্ণয় করো', 'দ্বিপদী বিস্তৃতি ব্যাখ্যা করো'],
  ['১. সেট ও ফাংশন', '২. বীজগাণিতিক রাশি', '৩. জ্যামিতি', '৪. জ্যামিতিক অঙ্কন', '৫. সমীকরণ', '৬. অসমতা', '৭. অসীম ধারা', '৮. ত্রিকোণমিতি', '৯. সূচকীয় ও লগারিদমীয় ফাংশন', '১০. দ্বিপদী বিস্তৃতি', '১১. স্থানাঙ্ক জ্যামিতি', '১২. সমতলীয় ভেক্টর', '১৩. ঘন জ্যামিতি', '১৪. সম্ভাবনা']
);

const BGS_SSC = createSubject('bgs_ssc', 'বাংলাদেশ ও বিশ্বপরিচয়', 'Globe', 'bg-amber-600', [], 
  ['১. পূর্ব বাংলার আন্দোলন ও জাতীয়তাবাদের উত্থান', '২. স্বাধীন বাংলাদেশ', '৩. সৌরজগৎ ও ভূমণ্ডল', '৪. বাংলাদেশের ভূপ্রকৃতি ও জলবায়ু', '৫. নদ-নদী ও প্রাকৃতিক সম্পদ', '৬. রাষ্ট্র, নাগরিকতা ও আইন', '৭. বাংলাদেশ সরকারের অঙ্গসমূহ', '৮. গণতন্ত্র ও নির্বাচন', '৯. জাতিসংঘ ও বাংলাদেশ', '১০. টেকসই উন্নয়ন অভীষ্ট (SDG)', '১১. জাতীয় সম্পদ ও অর্থনীতি', '১২. অর্থনৈতিক নির্দেশক', '১৩. ব্যাংক ও অর্থ', '১৪. পরিবার ও সমাজ', '১৫. সামাজিক পরিবর্তন', '১৬. সামাজিক সমস্যা ও প্রতিকার']
);

// --- Arts (SSC) ---
const HISTORY_SSC = createSubject('history_ssc', 'ইতিহাস', 'Landmark', 'bg-amber-700', [], ['ইতিহাস পরিচিতি', 'বিশ্বসভ্যতা', 'প্রাচীন বাংলা', 'মধ্যযুগের বাংলা', 'ইংরেজ শাসন', 'ভাষা আন্দোলন', 'মুক্তিযুদ্ধ']);
const GEOGRAPHY_SSC = createSubject('geography_ssc', 'ভূগোল ও পরিবেশ', 'Globe2', 'bg-cyan-600', [], ['ভূগোল ও পরিবেশ', 'মহাবিশ্ব ও আমাদের পৃথিবী', 'মানচিত্র পঠন ও ব্যবহার', 'পৃথিবীর বাহ্যিক ও অভ্যন্তরীণ গঠন', 'বায়ুমণ্ডল', 'বারিমণ্ডল', 'জনসংখ্যা', 'বাংলাদেশের ভৌগোলিক বিবরণ', 'সম্পদ ও শিল্প', 'দুর্যোগ ব্যবস্থাপনা']);
const CIVICS_SSC = createSubject('civics_ssc', 'পৌরনীতি ও নাগরিকতা', 'Scale', 'bg-slate-600', [], ['পৌরনীতি ও নাগরিকতা', 'নাগরিক ও নাগরিকতা', 'রাষ্ট্র ও সরকার ব্যবস্থা', 'সংবিধান', 'বাংলাদেশের সরকার ব্যবস্থা', 'স্থানীয় সরকার', 'গণতন্ত্র', 'জাতিসংঘ']);

// --- Commerce (SSC) ---
const ACCOUNTING_SSC = createSubject('accounting_ssc', 'হিসাববিজ্ঞান', 'Calculator', 'bg-lime-600', [], ['হিসাববিজ্ঞান পরিচিতি', 'লেনদেন', 'দু’তরফা দাখিলা পদ্ধতি', 'মূলধন ও মুনাফাজাতীয় লেনদেন', 'হিসাব', 'জাবেদা', 'খতিয়ান', 'নগদান বই', 'রেওয়ামিল', 'আর্থিক বিবরণী', 'পারিবারিক বাজেট']);
const FINANCE_SSC = createSubject('fin_ssc', 'ফিন্যান্স ও ব্যাংকিং', 'Coins', 'bg-yellow-500', [], ['অর্থায়ন ও ব্যবসায় অর্থায়ন', 'অর্থায়নের উৎস', ' অর্থের সময়মূল্য', 'ঝুঁকি ও অনিশ্চয়তা', 'মূলধনি বাজেটিং', 'মূলধন ব্যয়', 'শেয়ার, বন্ড ও ডিবেঞ্চার', 'মুদ্রা, ব্যাংক ও ব্যাংকিং', 'বাণিজ্যিক ব্যাংক']);
const BUSINESS_ENT_SSC = createSubject('bus_ssc', 'ব্যবসায় উদ্যোগ', 'Briefcase', 'bg-sky-600', [], ['ব্যবসায় পরিচিতি', 'ব্যবসায় উদ্যোগ ও উদ্যোক্তা', 'আত্মকর্মসংস্থান', 'মালিকানার ভিত্তিতে ব্যবসায়', 'ব্যবসায় আইনগত দিক', 'ব্যবসায় পরিকল্পনা', 'বিপণন']);
const GEN_SCIENCE_SSC = createSubject('gen_sci_ssc', 'সাধারণ বিজ্ঞান', 'Atom', 'bg-teal-600', [], ['উন্নততর জীবনধারা', 'জীবনের জন্য পানি', 'হৃদযন্ত্রের যত কথা', 'দেখতে হলে আলো চাই', 'অম্ল, ক্ষার ও লবণ', 'পলিমার', 'দুর্যোগের সাথে বসবাস']);


// ==========================================
// HSC (Class 11-12) SUBJECTS - SPLIT PAPERS
// ==========================================

// --- Common (HSC) ---
const BANGLA_1ST_HSC = createSubject('bangla_1st_hsc', 'বাংলা ১ম পত্র', 'BookOpen', 'bg-green-700',
  ['অপরিচিতা গল্পের অনুপম চরিত্র বিশ্লেষণ', 'সোনার তরী কবিতার রূপক অর্থ', 'লালসালু উপন্যাসে মজিদের ভণ্ডামি'],
  [
    'গদ্য: অপরিচিতা', 'গদ্য: বিলাসী', 'গদ্য: গৃহ', 'গদ্য: আহ্বান', 'গদ্য: আমার পথ', 'গদ্য: মানব-কল্যাণ', 'গদ্য: মাসি-পিসি', 'গদ্য: বায়ান্নর দিনগুলো', 'গদ্য: রেইনকোট', 'গদ্য: মহাজাগতিক কিউরেটর', 'গদ্য: নেকলেস',
    'কবিতা: বিভীষণের প্রতি মেঘনাদ', 'কবিতা: সোনার তরী', 'কবিতা: বিদ্রোহী', 'কবিতা: প্রতিদান', 'কবিতা: সুচেতনা', 'কবিতা: তাহারে মনে পড়ে', 'কবিতা: পদ্মা', 'কবিতা: আঠারো বছর বয়স', 'কবিতা: ফেব্রুয়ারি ১৯৬৯', 'কবিতা: আমি কিংবদন্তির কথা বলছি',
    'উপন্যাস: লালসালু', 'নাটক: সিরাজউদ্দৌলা'
  ]
);

const BANGLA_2ND_HSC = createSubject('bangla_2nd_hsc', 'বাংলা ২য় পত্র', 'BookType', 'bg-green-800',
  ['বাংলা উচ্চারণের ৫টি নিয়ম লেখ', 'দিনলিপি লেখার নিয়ম', 'সারাংশ লেখ'],
  [
    '১. বাংলা উচ্চারণের নিয়ম', '২. বাংলা বানানের নিয়ম', '৩. বাংলা ভাষার ব্যাকরণিক শব্দশ্রেণি', '৪. বাংলা শব্দগঠন (উপসর্গ, সমাস)', '৫. বাক্যতত্ত্ব', '৬. বাংলা ভাষার অপপ্রয়োগ ও শুদ্ধপ্রয়োগ',
    '৭. পারিভাষিক শব্দ', '৮. অনুবাদ', '৯. দিনলিপি লিখন', '১০. প্রতিবেদন রচনা', '১১. বৈদ্যুতিন চিঠি ও আবেদনপত্র', '১২. সারাংশ ও সারমর্ম', '১৩. ভাবসম্প্রসারণ', '১৪. সংলাপ রচনা', '১৫. খুদেগল্প রচনা', '১৬. প্রবন্ধ রচনা'
  ]
);

const ENGLISH_1ST_HSC = createSubject('english_1st_hsc', 'English 1st Paper', 'Languages', 'bg-indigo-600',
  ['Significance of 7th March Speech', 'Etiquette and Manners summary'],
  [
    'Unit 1: People or Institutions Making History', 'Unit 2: Dreams', 'Unit 3: Lifestyle', 'Unit 4: Traffic Education', 'Unit 5: Food Adulteration', 
    'Unit 6: Adolescence', 'Unit 7: Human Rights', 'Unit 8: Environment and Nature', 'Unit 9: Myths and Literature', 'Unit 10: Peace and Conflict',
    'Unit 11: Tours and Travels', 'Unit 12: Education and Life', 'Unit 13: Art and Music'
  ]
);

const ENGLISH_2ND_HSC = createSubject('english_2nd_hsc', 'English 2nd Paper', 'PenTool', 'bg-indigo-700',
  ['Use of Modifiers', 'Synonyms and Antonyms practice'],
  [
    '1. Prepositions', '2. Special uses of words/phrases', '3. Completing Sentences', '4. Right form of verbs', '5. Narration', 
    '6. Modifiers', '7. Sentence Connectors', '8. Synonyms and Antonyms', '9. Punctuation',
    '10. Formal Letter/Application', '11. Report Writing', '12. Paragraph Writing', '13. Composition'
  ]
);

const ICT_HSC = createSubject('ict_hsc', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'Cpu', 'bg-purple-700',
  ['কৃত্রিম বুদ্ধিমত্তা কী?', 'HTML এর মৌলিক কাঠামো', 'C ভাষায় লুপ কত প্রকার?'],
  ['১. তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত', '২. কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', '৩. সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', '৪. ওয়েব ডিজাইন পরিচিতি এবং HTML', '৫. প্রোগ্রামিং ভাষা (C)', '৬. ডেটাবেজ ম্যানেজমেন্ট সিস্টেম']
);

// --- Science (HSC) ---
const PHYSICS_1ST_HSC = createSubject('physics_1st_hsc', 'পদার্থবিজ্ঞান ১ম পত্র', 'Atom', 'bg-violet-700',
  ['ভেক্টর ও স্কেলার রাশির পার্থক্য', 'নিউটনের গতিসূত্র', 'মহাকর্ষ ধ্রুবক G এর তাৎপর্য'],
  ['১. ভৌতজগৎ ও পরিমাপ', '২. ভেক্টর', '৩. গতিবিদ্যা', '৪. নিউটনিয়ান বলবিদ্যা', '৫. কাজ, শক্তি ও ক্ষমতা', '৬. মহাকর্ষ ও অভিকর্ষ', '৭. পদার্থের গাঠনিক ধর্ম', '৮. পর্যায়বৃত্ত গতি', '৯. আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব']
);

const PHYSICS_2ND_HSC = createSubject('physics_2nd_hsc', 'পদার্থবিজ্ঞান ২য় পত্র', 'Atom', 'bg-violet-800',
  ['তাপগতিবিদ্যার প্রথম সূত্র', 'কার্শফের সূত্রগুলো লেখ', 'সেমিকন্ডাক্টর কী?'],
  ['১. তাপগতিবিদ্যা', '২. স্থির তড়িৎ', '৩. চল তড়িৎ', '৪. তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব', '৫. তাড়িতচৌম্বক আবেশ ও দিক পরিবর্তী প্রবাহ', '৬. জ্যামিতিক আলোকবিজ্ঞান', '৭. ভৌত আলোকবিজ্ঞান', '৮. আধুনিক পদার্থবিজ্ঞানের সূচনা', '৯. পরমাণুর মডেল ও নিউক্লীয় পদার্থবিজ্ঞান', '১০. সেমিকন্ডাক্টর ও ইলেকট্রনিকস']
);

const CHEMISTRY_1ST_HSC = createSubject('chemistry_1st_hsc', 'রসায়ন ১ম পত্র', 'FlaskConical', 'bg-orange-600',
  ['বোর পরমাণু মডেল', 'হাইব্রিডাইজেশন বা সংকরণ কী?'],
  ['১. ল্যাবরেটরির নিরাপদ ব্যবহার', '২. গুণগত রসায়ন', '৩. মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন', '৪. রাসায়নিক পরিবর্তন', '৫. কর্মমুখী রসায়ন']
);

const CHEMISTRY_2ND_HSC = createSubject('chemistry_2nd_hsc', 'রসায়ন ২য় পত্র', 'FlaskConical', 'bg-orange-700',
  ['গ্যাস সূত্রগুলো লেখ', 'জৈব যৌগের নামকরণ', 'তড়িৎ বিশ্লেষণ কী?'],
  ['১. পরিবেশ রসায়ন', '২. জৈব রসায়ন', '৩. পরিমাণগত রসায়ন', '৪. তড়িৎ রসায়ন', '৫. অর্থনৈতিক রসায়ন']
);

const MATH_1ST_HSC = createSubject('math_1st_hsc', 'উচ্চতর গণিত ১ম পত্র', 'Calculator', 'bg-blue-600',
  ['ম্যাট্রিক্সের গুণন', 'অন্তরীকরণের মূল নিয়ম'],
  ['১. ম্যাট্রিক্স ও নির্ণায়ক', '২. ভেক্টর', '৩. সরলরেখা', '৪. বৃত্ত', '৫. বিন্যাস ও সমাবেশ', '৬. ত্রিকোণমিতিক অনুপাত', '৭. সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত', '৮. ফাংশন ও ফাংশনের লেখচিত্র', '৯. অন্তরীকরণ', '১০. যোগজীকরণ']
);

const MATH_2ND_HSC = createSubject('math_2nd_hsc', 'উচ্চতর গণিত ২য় পত্র', 'Calculator', 'bg-blue-700',
  ['জটিল সংখ্যার মডুলাস ও আর্গুমেন্ট', 'কনিকের প্রকারভেদ'],
  ['১. বাস্তব সংখ্যা ও অসমতা', '২. যোগাশ্রয়ী প্রোগ্রাম', '৩. জটিল সংখ্যা', '৪. বহুপদী ও বহুপদী সমীকরণ', '৫. দ্বিপদী বিস্তৃতি', '৬. কনিক', '৭. বিপরীত ত্রিকোণমিতিক ফাংশন ও ত্রিকোণমিতিক সমীকরণ', '৮. স্থিতিবিদ্যা', '৯. সমতলে বস্তুকণার গতি', '১০. বিস্তার পরিমাপ ও সম্ভাবনা']
);

const BIOLOGY_1ST_HSC = createSubject('bio_1st_hsc', 'জীববিজ্ঞান ১ম পত্র (উদ্ভিদ)', 'Dna', 'bg-emerald-600',
  ['DNA এর গঠন', 'মাইটোসিস কোষ বিভাজন', 'সালোকসংশ্লেষণ'],
  ['১. কোষ ও এর গঠন', '২. কোষ বিভাজন', '৩. কোষ রসায়ন', '৪. অণুজীব', '৫. শৈবাল ও ছত্রাক', '৬. ব্রায়োফাইটা ও টেরিডোফাইটা', '৭. নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', '৮. টিস্যু ও টিস্যুতন্ত্র', '৯. উদ্ভিদ শারীরতত্ত্ব', '১০. উদ্ভিদ প্রজনন', '১১. জীবপ্রযুক্তি', '১২. জীবের পরিবেশ']
);

const BIOLOGY_2ND_HSC = createSubject('bio_2nd_hsc', 'জীববিজ্ঞান ২য় পত্র (প্রাণি)', 'Bug', 'bg-emerald-700',
  ['রুই মাছের গঠন', 'মানবদেহে রক্ত সঞ্চালন', 'জিনতত্ত্ব কী?'],
  ['১. প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', '২. প্রাণীর পরিচিতি (হাইড্রা, ঘাসফড়িং, রুই মাছ)', '৩. মানব শারীরতত্ত্ব: পরিপাক ও শোষণ', '৪. মানব শারীরতত্ত্ব: রক্ত ও সংবহন', '৫. মানব শারীরতত্ত্ব: শ্বসন ও শ্বাসক্রিয়া', '৬. মানব শারীরতত্ত্ব: বর্জ্য ও নিষ্কাশন', '৭. মানব শারীরতত্ত্ব: চলন ও অঙ্গচালনা', '৮. মানব শারীরতত্ত্ব: সমন্বয় ও নিয়ন্ত্রণ', '৯. মানব জীবনের ধারাবাহিকতা', '১০. মানবদেহের প্রতিরক্ষা', '১১. জিনতত্ত্ব ও বিবর্তন', '১২. প্রাণীর আচরণ']
);

// --- Arts (HSC) ---
const HISTORY_1ST_HSC = createSubject('hist_1st_hsc', 'ইতিহাস ১ম পত্র', 'Landmark', 'bg-amber-600', [], ['১. ভারতবর্ষের ইতিহাস', '২. ইংরেজ ঔপনিবেশিক শাসন', '৩. ইংরেজ ঔপনিবেশিক শাসনের বিরুদ্ধে আন্দোলন', '৪. পাকিস্তান আমলের বাংলা', '৫. পূর্ব বাংলার স্বাধিকার আন্দোলন', '৬. মুক্তিযুদ্ধ', '৭. জাতিসমূহ', '৮. মুক্তিযুদ্ধ ও বাংলাদেশ']);
const HISTORY_2ND_HSC = createSubject('hist_2nd_hsc', 'ইতিহাস ২য় পত্র', 'Landmark', 'bg-amber-700', [], ['১. শিল্প বিপ্লব', '২. ফরাসি বিপ্লব', '৩. প্রথম বিশ্বযুদ্ধ', '৪. বলশেভিক বিপ্লব', '৫. হিটলার ও মুসোলিনির উত্থান', '৬. দ্বিতীয় বিশ্বযুদ্ধ', '৭. স্নায়ুযুদ্ধ', '৮. জাতিসংঘ']);

const CIVICS_1ST_HSC = createSubject('civ_1st_hsc', 'পৌরনীতি ও সুশাসন ১ম পত্র', 'Scale', 'bg-slate-600', [], ['১. পৌরনীতি পরিচিতি', '২. সুশাসন', '৩. মূল্যবোধ, আইন, স্বাধীনতা', '৪. ই-গভর্ন্যান্স', '৫. নাগরিক অধিকার ও মানবাধিকার', '৬. রাজনৈতিক দল', '৭. সরকার কাঠামো', '৮. জনমত ও রাজনৈতিক সংস্কৃতি', '৯. আমলাতন্ত্র', '১০. দেশপ্রেম ও জাতীয়তা']);
const CIVICS_2ND_HSC = createSubject('civ_2nd_hsc', 'পৌরনীতি ও সুশাসন ২য় পত্র', 'Scale', 'bg-slate-700', [], ['১. ব্রিটিশ ভারতে প্রতিনিধিত্বশীল সরকার', '২. পাকিস্তান থেকে বাংলাদেশ', '৩. রাজনৈতিক ব্যক্তিত্ব', '৪. বাংলাদেশের সংবিধান', '৫. বাংলাদেশের সরকার কাঠামো', '৬. স্থানীয় শাসন', '৭. সাংবিধানিক প্রতিষ্ঠান', '৮. নির্বাচন ব্যবস্থা', '৯. বৈদেশিক নীতি', '১০. নাগরিক সমস্যা']);

// --- Commerce (HSC) ---
const ACC_1ST_HSC = createSubject('acc_1st_hsc', 'হিসাববিজ্ঞান ১ম পত্র', 'Calculator', 'bg-lime-600', [], ['১. হিসাববিজ্ঞান পরিচিতি', '২. হিসাবের বইসমূহ', '৩. ব্যাংক সমন্বয় বিবরণী', '৪. রেওয়ামিল', '৫. হিসাববিজ্ঞানের নীতিমালা', '৬. প্রাপ্য হিসাবসমূহের হিসাবরক্ষণ', '৭. কার্যপত্র', '৮. দৃশ্যমান ও অদৃশ্যমান সম্পদের হিসাব', '৯. আর্থিক বিবরণী', '১০. একতরফা দাখিলা পদ্ধতি']);
const ACC_2ND_HSC = createSubject('acc_2nd_hsc', 'হিসাববিজ্ঞান ২য় পত্র', 'Calculator', 'bg-lime-700', [], ['১. অব্যবসায়ী প্রতিষ্ঠানের হিসাব', '২. অংশীদারি কারবারের হিসাব', '৩. নগদ প্রবাহ বিবরণী', '৪. যৌথ মূলধনী কোম্পানির মূলধন', '৫. যৌথ মূলধনী কোম্পানির আর্থিক বিবরণী', '৬. আর্থিক বিবরণী বিশ্লেষণ', '৭. উৎপাদন ব্যয় হিসাব', '৮. মজুদ পণ্যের হিসাবরক্ষণ']);

const FIN_1ST_HSC = createSubject('fin_1st_hsc', 'ফিন্যান্স ও ব্যাংকিং ১ম পত্র', 'Coins', 'bg-yellow-600', [], ['১. অর্থায়নের সূচনা', '২. অর্থায়নের উৎস', '৩. অর্থের সময়মূল্য', '৪. আর্থিক বিশ্লেষণ', '৫. স্বল্পমেয়াদী অর্থায়ন', '৬. দীর্ঘমেয়াদী অর্থায়ন', '৭. মূলধন ব্যয়', '৮. মূলধনী বাজেটিং', '৯. ঝুঁকি ও মুনাফার হার']);
const FIN_2ND_HSC = createSubject('fin_2nd_hsc', 'ফিন্যান্স ও ব্যাংকিং ২য় পত্র', 'Landmark', 'bg-yellow-700', [], ['১. ব্যাংক ব্যবস্থার প্রাথমিক ধারণা', '২. কেন্দ্রীয় ব্যাংক', '৩. বাণিজ্যিক ব্যাংক', '৪. ব্যাংক হিসাব', '৫. হস্তান্তরযোগ্য ঋণের দলিল', '৬. চেক, বিল অফ এক্সচেঞ্জ', '৭. ইলেকট্রনিক ব্যাংকিং', '৮. বীমা', '৯. জীবন বীমা', '১০. নৌ বীমা', '১১. অগ্নি বীমা']);


// ==========================================
// MAPPING LOGIC
// ==========================================

export const getSubjectsForUser = (classLevel: ClassLevel, group: GroupType): { groupSubjects: Subject[], commonSubjects: Subject[] } => {
  
  // Honours (Generic)
  if (classLevel === ClassLevel.HONOURS) {
     const genericSubjects = [
       createSubject('hon_generic', 'মেজর সাবজেক্ট', 'Book', 'bg-slate-700', [], ['Introduction', 'Advanced Theory', 'Research Methodology', 'Case Studies', 'Applied Concepts']),
       createSubject('hon_res', 'গবেষণা (Research)', 'GraduationCap', 'bg-pink-600', [], ['গবেষণা প্রস্তাবনা', 'লিটারেচার রিভিউ', 'মেথডলজি', 'ডেটা অ্যানালাইসিস', 'থিসিস রাইটিং']),
     ];
     return { groupSubjects: genericSubjects, commonSubjects: [] };
  }

  // Classes 6-8 (Junior) - No Group
  if ([ClassLevel.CLASS_6, ClassLevel.CLASS_7, ClassLevel.CLASS_8].includes(classLevel)) {
    const juniorSubjects = [
      createSubject('ban_jun', 'বাংলা', 'BookOpen', 'bg-green-600', [], ['গদ্য', 'কবিতা', 'আনন্দপাঠ', 'ব্যাকরণ', 'নির্মিতি']),
      createSubject('eng_jun', 'ইংরেজি', 'Languages', 'bg-indigo-500', [], ['English For Today', 'Grammar', 'Composition']),
      MATH_SSC, // Reuse generic math or simplify
      createSubject('sci_jun', 'বিজ্ঞান', 'Atom', 'bg-teal-500', [], ['বৈজ্ঞানিক প্রক্রিয়া ও পরিমাপ', 'জীবজগৎ', 'পরমাণুর গঠন', 'তড়িৎ ও চুম্বক', 'অম্ল, ক্ষার ও লবণ', 'আলো']),
      createSubject('bgs_jun', 'বাংলাদেশ ও বিশ্বপরিচয়', 'Map', 'bg-amber-500', [], ['বাংলাদেশের ইতিহাস', 'বাংলাদেশের অর্থনীতি', 'সমাজ ও সংস্কৃতি', 'জলবায়ু']),
      createSubject('ict_jun', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'Cpu', 'bg-purple-600', [], ['তথ্য প্রযুক্তির ধারণা', 'কম্পিউটার নেটওয়ার্ক', 'ইন্টারনেটের ব্যবহার']),
      createSubject('rel_jun', 'ধর্ম শিক্ষা', 'MoonStar', 'bg-teal-600', [], ['আকাইদ', 'ইবাদত', 'আখলাক', 'আদর্শ জীবনচরিত']),
    ];
    return { groupSubjects: juniorSubjects, commonSubjects: [] };
  }

  // SSC (9-10)
  if ([ClassLevel.CLASS_9, ClassLevel.CLASS_10].includes(classLevel)) {
    const common = [BANGLA_1ST_SSC, BANGLA_2ND_SSC, ENGLISH_1ST_SSC, ENGLISH_2ND_SSC, MATH_SSC, ICT_SSC, RELIGION_ISLAM_SSC];
    
    let groupSubs: Subject[] = [];
    if (group === GroupType.SCIENCE) {
      groupSubs = [PHYSICS_SSC, CHEMISTRY_SSC, BIOLOGY_SSC, HIGHER_MATH_SSC, BGS_SSC];
    } else if (group === GroupType.ARTS) {
      groupSubs = [HISTORY_SSC, GEOGRAPHY_SSC, CIVICS_SSC, GEN_SCIENCE_SSC];
    } else if (group === GroupType.COMMERCE) {
      groupSubs = [ACCOUNTING_SSC, FINANCE_SSC, BUSINESS_ENT_SSC, GEN_SCIENCE_SSC];
    }

    return { groupSubjects: groupSubs, commonSubjects: common };
  }

  // HSC (11-12)
  if ([ClassLevel.CLASS_11, ClassLevel.CLASS_12].includes(classLevel)) {
    const common = [BANGLA_1ST_HSC, BANGLA_2ND_HSC, ENGLISH_1ST_HSC, ENGLISH_2ND_HSC, ICT_HSC];
    
    let groupSubs: Subject[] = [];
    if (group === GroupType.SCIENCE) {
      groupSubs = [
        PHYSICS_1ST_HSC, PHYSICS_2ND_HSC, 
        CHEMISTRY_1ST_HSC, CHEMISTRY_2ND_HSC, 
        MATH_1ST_HSC, MATH_2ND_HSC, 
        BIOLOGY_1ST_HSC, BIOLOGY_2ND_HSC
      ];
    } else if (group === GroupType.ARTS) {
      groupSubs = [
        HISTORY_1ST_HSC, HISTORY_2ND_HSC,
        CIVICS_1ST_HSC, CIVICS_2ND_HSC,
        createSubject('soc_1st_hsc', 'সমাজবিজ্ঞান ১ম পত্র', 'Users', 'bg-pink-600', [], ['সমাজবিজ্ঞানের উৎপত্তি', 'সমাজবিজ্ঞানের বৈজ্ঞানিক মর্যাদা', 'সামাজিক প্রতিষ্ঠান']),
        createSubject('soc_2nd_hsc', 'সমাজবিজ্ঞান ২য় পত্র', 'Users', 'bg-pink-700', [], ['বাংলাদেশের সমাজ', 'বাংলাদেশের নৃগোষ্ঠী', 'বাংলাদেশের সামাজিক পরিবর্তন'])
      ];
    } else if (group === GroupType.COMMERCE) {
      groupSubs = [
        ACC_1ST_HSC, ACC_2ND_HSC,
        FIN_1ST_HSC, FIN_2ND_HSC,
        createSubject('mkt_1st_hsc', 'উৎপাদন ব্যবস্থাপনা ১ম পত্র', 'ShoppingBag', 'bg-orange-500', [], ['উৎপাদন', 'উৎপাদনের উপকরণ', 'উৎপাদন ক্ষমতা']),
        createSubject('mkt_2nd_hsc', 'বিপণন ২য় পত্র (Marketing)', 'ShoppingBag', 'bg-orange-600', [], ['বিপণন পরিচিতি', 'বিপণন পরিবেশ', 'পণ্য ও মূল্য'])
      ];
    }

    return { groupSubjects: groupSubs, commonSubjects: common };
  }

  return { groupSubjects: [], commonSubjects: [] };
};