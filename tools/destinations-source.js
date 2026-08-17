/* ============================================================================
   GHURAGHURI - EXPANDED DESTINATION SOURCE (compact form)
   This is the human-editable source used by tools/build-destinations.js to
   generate data/destinations-extra.js. Each entry describes one real
   destination in Bangladesh. Field aliases are expanded by the build script.
   ============================================================================ */

window.GHURAGHURI_SOURCE = [

/* ============================ CHATTOGRAM DIVISION ============================ */

/* ---- Cox's Bazar ---- */
{
    s: "marine-drive", n: "Marine Drive", nb: "মেরিন ড্রাইভ", d: "Chattogram", t: "Cox's Bazar", u: "Ramu",
    c: ["Beach", "Adventure"], la: 21.20, lo: 92.05,
    sd: "A scenic 80 km coastal highway hugging the Bay of Bengal between Cox's Bazar and Teknaf.",
    de: "Marine Drive is one of South Asia's most scenic coastal roads, running 80 km from Cox's Bazar's Laboni Point to Teknaf with the sea on one side and forests and hills on the other. It links Himchari, Inani and the sandbanks of the bay, making it the perfect way to explore the southern coast by car, motorbike or bicycle.",
    b: "October – March", dy: "3 – 5 hours drive", df: "Easy", ra: 4.6, rv: 540,
    tt: "Friends, Couples, Road trip", feat: true,
    tags: ["coastal road", "scenic drive", "bay of bengal"],
    act: ["Drive the full Cox's Bazar–Teknaf coastal road", "Stop at Himchari viewpoint", "Swim at quieter beaches", "Sunset photography"],
    att: ["Laboni Point", "Himchari", "Inani Beach", "Rakhine fishing villages"],
    tips: ["Start early to enjoy empty roads", "Carry water and snacks — stops are sparse", "Watch for monsoon waves near the road"],
    ti: { from: "Dhaka", km: 415, dur: "10 – 12 hours", route: "Dhaka → Chattogram → Cox's Bazar", tr: ["Bus", "Private Car", "Bicycle"], fl: null },
    nearby: ["inani-beach", "himchari-national-park", "coxs-bazar", "teknaf"]
},
{
    s: "naf-river", n: "Naf River", nb: "নাফ নদী", d: "Chattogram", t: "Cox's Bazar", u: "Teknaf",
    c: ["River", "Nature"], la: 20.87, lo: 92.30,
    sd: "The calm river that forms Bangladesh's southern border with Myanmar near Teknaf.",
    de: "The Naf River separates Teknaf from Myanmar and is a serene waterway lined with villages, fishing boats and mangroves. Boat trips offer views of the St. Martin's channel, the rocky island of Shahpari and daily life along the border. It is at its most photogenic at sunrise.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.3, rv: 180,
    tt: "Family, Solo, Nature lovers",
    tags: ["river", "border", "boat trip"],
    act: ["Boat ride on the Naf", "See Shahpari Island", "Sunrise photography", "Border village walk"],
    att: ["Teknaf Ghat", "Shahpari Island", "Myanmar border view", "Mangrove banks"],
    tips: ["Carry identification near the border area", "Negotiate boat fares beforehand", "Respect border security rules"],
    ti: { from: "Cox's Bazar", km: 90, dur: "2 – 3 hours", route: "Cox's Bazar → Teknaf", tr: ["Bus", "CNG", "Boat"], fl: null },
    nearby: ["teknaf", "saint-martins-island", "marine-drive", "inani-beach"]
},
{
    s: "chandranath-hill", n: "Chandranath Hill", nb: "চন্দ্রনাথ পাহাড়", d: "Chattogram", t: "Chattogram", u: "Sitakunda",
    c: ["Hill", "Religious", "Adventure"], la: 22.61, lo: 91.69,
    sd: "A 350 m hill in Sitakunda crowned by a Shiva temple and sweeping views of the coast.",
    de: "Chandranath Hill is one of Bangladesh's most important Hindu pilgrimage sites, topped by the Chandra Shekhar Shiva temple built in the 4th century. Climbing roughly 3,000 steps rewards visitors with panoramic views over Sitakunda Eco Park, the Karnaphuli river and the distant Bay of Bengal.",
    b: "October – February", dy: "Half day", df: "Moderate", ra: 4.5, rv: 410,
    tt: "Pilgrims, Adventure, Nature lovers", feat: true,
    tags: ["hill", "shiva temple", "pilgrimage", "hiking"],
    act: ["Climb the steps to the temple", "Visit Sitakunda Eco Park", "Photograph the coastline", "Attend Shivaratri festival"],
    att: ["Chandra Shekhar Temple", "Sitakunda Eco Park", "Panoramic viewpoints"],
    tips: ["Carry drinking water for the climb", "Wear sturdy shoes", "Avoid the monsoon season"],
    ti: { from: "Chattogram", km: 45, dur: "1 – 1.5 hours", route: "Chattogram → Sitakunda", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["sitakunda", "foys-lake", "bhatiari-lake", "patenga-beach"]
},
{
    s: "bhatiari-lake", n: "Bhatiari Lake", nb: "ভাটিয়ারী লেক", d: "Chattogram", t: "Chattogram", u: "Bhatiari",
    c: ["Lake", "Picnic Spot"], la: 22.41, lo: 91.76,
    sd: "A peaceful boating lake near the Bhatiari Navy zone in Chittagong.",
    de: "Bhatiari Lake sits beside the Bangladesh Navy zone in Chittagong and is a popular weekend escape for city residents. Rowing and pedal boats drift across calm water while gardens and picnic shelters line the shore. It is close to Foy's Lake and easy to combine into a day trip.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.1, rv: 240,
    tt: "Family, Picnic",
    tags: ["lake", "boating", "picnic"],
    act: ["Boat ride", "Picnic by the shore", "Walk the gardens"],
    att: ["Boating lake", "Navy zone viewpoints", "Picnic lawns"],
    tips: ["Check boat availability on weekdays", "Carry sunscreen", "Combine with Foy's Lake visit"],
    ti: { from: "Chattogram", km: 20, dur: "40 minutes", route: "Chattogram city → Bhatiari", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["foys-lake", "chandranath-hill", "patenga-beach", "sitakunda"]
},
{
    s: "ethnological-museum-chattogram", n: "Ethnological Museum", nb: "নৃতাত্ত্বিক জাদুঘর", d: "Chattogram", t: "Chattogram", u: "Agrabad",
    c: ["Museum", "Cultural"], la: 22.34, lo: 91.83,
    sd: "Bangladesh's only museum dedicated to the lives and crafts of its ethnic groups.",
    de: "The Ethnological Museum in Chittagong is the country's first and only museum devoted to indigenous communities. Galleries display tribal life-size models, traditional houses, musical instruments, fishing tools, costumes and crafts from the Chittagong Hill Tracts, the coastal belt and beyond.",
    b: "Year-round", dy: "1 – 2 hours", df: "Easy", ra: 4.4, rv: 320,
    tt: "Families, Culture, Students",
    tags: ["museum", "tribal culture", "indigenous"],
    act: ["Explore tribal exhibits", "See traditional house models", "Photograph the artifacts"],
    att: ["Life-size tribal dioramas", "Traditional house models", "Craft collection"],
    tips: ["Visit on weekdays to avoid crowds", "Photography rules apply inside", "Combine with a Chattogram city tour"],
    ti: { from: "Chattogram", km: 3, dur: "15 minutes", route: "Agrabad → Ethno Museum", tr: ["Rickshaw", "CNG", "Taxi"], fl: null },
    nearby: ["foys-lake", "bayazid-bostami-shrine", "patenga-beach", "chattogram-war-cemetery"]
},

/* ---- Bandarban ---- */
{
    s: "nilgiri", n: "Nilgiri", nb: "নীলগিরি", d: "Chattogram", t: "Bandarban", u: "Thanchi",
    c: ["Hill", "Mountain", "Adventure"], la: 21.80, lo: 92.43,
    sd: "One of Bangladesh's highest accessible peaks, at 2,000 ft with cloud-sea views.",
    de: "Nilgiri is one of the highest tourist-accessible peaks in Bangladesh at around 2,000 feet, offering a grandstand view over the mountains of Bandarban and Myanmar beyond. A viewpoint, resort and observation deck sit on the summit, and on clear mornings the entire valley is visible below a sea of clouds.",
    b: "October – April", dy: "1 day", df: "Moderate", ra: 4.7, rv: 680,
    tt: "Adventure, Couples, Friends", feat: true,
    tags: ["peak", "viewpoint", "clouds", "hill"],
    act: ["Sunrise from the peak", "Viewpoint photography", "Explore Thanchi valley", "Visit nearby Meghla"],
    att: ["Nilgiri peak", "Observation tower", "Cloud sea view"],
    tips: ["Arrive early for sunrise", "The road is steep — use a chander gari", "Carry warm layers in winter"],
    ti: { from: "Bandarban town", km: 47, dur: "2 – 2.5 hours", route: "Bandarban → Thanchi → Nilgiri", tr: ["Chander Gari", "Private Car"], fl: null },
    nearby: ["meghla", "nilachal", "boga-lake", "chimbuk-hill"]
},
{
    s: "boga-lake", n: "Boga Lake", nb: "বগা লেক", d: "Chattogram", t: "Bandarban", u: "Ruma",
    c: ["Lake", "Mountain", "Adventure"], la: 21.95, lo: 92.49,
    sd: "A high-altitude emerald lake at 1,200 m reached by a demanding 4-hour trek.",
    de: "Boga Lake is one of Bangladesh's most beautiful high-altitude lakes, sitting at roughly 1,200 metres above sea level in the mountains above Ruma. The trek to the lake passes through Mru and Bawm villages, bamboo bridges and rainforest. Camping by the water is the highlight for many adventurers.",
    b: "October – April", dy: "2 days", df: "Challenging", ra: 4.8, rv: 520,
    tt: "Trekking, Adventure, Solo",
    tags: ["lake", "trek", "high altitude", "camping"],
    act: ["Trek to the lake", "Camp overnight by the shore", "Swim in cool water", "Visit Mru villages"],
    att: ["Boga Lake", "Rainforest trails", "Mru tribal villages"],
    tips: ["Hire a local guide for the trek", "Carry food and water", "Expect rough trails and steep climbs"],
    ti: { from: "Bandarban town", km: 70, dur: "3 hours + 4 hour trek", route: "Bandarban → Ruma → Boga Lake (trek)", tr: ["Chander Gari", "Walk"], fl: null },
    nearby: ["nilgiri", "keokradong", "nafakhum", "remakri"]
},
{
    s: "keokradong", n: "Keokradong", nb: "কেওক্রাডং", d: "Chattogram", t: "Bandarban", u: "Ruma",
    c: ["Mountain", "Adventure"], la: 21.95, lo: 92.52,
    sd: "Bangladesh's second-highest peak at 1,240 m, a classic overnight trek.",
    de: "Keokradong, at around 1,240 metres, is one of Bangladesh's highest peaks and a classic trekking destination. The multi-hour climb winds through villages, bamboo groves and cloud forest to a summit marked by a small shelter. Sunrise from the top is considered one of the country's great experiences.",
    b: "October – April", dy: "2 – 3 days", df: "Challenging", ra: 4.7, rv: 430,
    tt: "Trekking, Adventure",
    tags: ["peak", "trek", "sunrise"],
    act: ["Summit trek", "Overnight camping", "Sunrise at the top"],
    att: ["Keokradong summit", "Cloud forest", "Mru and Bawm villages"],
    tips: ["Trekking in a group is recommended", "Book a guide and porter in advance", "Carry rain gear year-round"],
    ti: { from: "Bandarban town", km: 76, dur: "3 hours + 5 hour trek", route: "Bandarban → Ruma → Keokradong", tr: ["Chander Gari", "Walk"], fl: null },
    nearby: ["boga-lake", "nafakhum", "remakri", "thanchi"]
},
{
    s: "nafakhum", n: "Nafakhum", nb: "নাফাখুম", d: "Chattogram", t: "Bandarban", u: "Thanchi",
    c: ["Waterfall", "Adventure"], la: 21.85, lo: 92.55,
    sd: "Bangladesh's largest waterfall, where the Sangu river thunders over a 100 ft cliff.",
    de: "Nafakhum is often called the largest waterfall in Bangladesh, formed where the Sangu (Shangu) river drops over a sheer cliff in a deafening white curtain. Reaching it involves a rough jeep ride and a hike through the forest, but the sight of the wide falls is unforgettable.",
    b: "October – March", dy: "1 – 2 days", df: "Challenging", ra: 4.8, rv: 350,
    tt: "Adventure, Trekking",
    tags: ["waterfall", "sangu river", "forest"],
    act: ["Hike to the falls", "Photograph the Sangu river", "Swim in the plunge pool"],
    att: ["Nafakhum falls", "Sangu river gorge", "Rainforest trail"],
    tips: ["The road to Remakri is very rough", "Use a local guide", "Best seen in winter when water is clear"],
    ti: { from: "Bandarban town", km: 95, dur: "3 – 4 hours", route: "Bandarban → Thanchi → Remakri → trek to Nafakhum", tr: ["Chander Gari", "Walk"], fl: null },
    nearby: ["amiakhum", "remakri", "boga-lake", "keokradong"]
},
{
    s: "amiakhum", n: "Amiakhum", nb: "আমিয়াখুম", d: "Chattogram", t: "Bandarban", u: "Ruma",
    c: ["Waterfall", "Adventure"], la: 21.93, lo: 92.50,
    sd: "A twin-stream waterfall cascading over rock steps in the Ruma hills.",
    de: "Amiakhum is a beautiful multi-tiered waterfall in the Ruma upazila of Bandarban, where water splits into two streams over mossy rocks. It is less crowded than Nafakhum and a rewarding add-on to a Boga Lake or Keokradong trek.",
    b: "October – March", dy: "Half day trek", df: "Challenging", ra: 4.5, rv: 160,
    tt: "Adventure, Trekking",
    tags: ["waterfall", "trek", "hills"],
    act: ["Trek to the falls", "Photography", "Picnic by the stream"],
    att: ["Amiakhum twin falls", "Hill streams", "Bawm villages"],
    tips: ["Combine with Boga Lake trek", "Carry water and snacks", "Wear grippy footwear"],
    ti: { from: "Bandarban town", km: 65, dur: "2.5 hours + trek", route: "Bandarban → Ruma → Amiakhum", tr: ["Chander Gari", "Walk"], fl: null },
    nearby: ["boga-lake", "keokradong", "nafakhum"]
},
{
    s: "shoilo-propat", n: "Shoilo Propat", nb: "শৈলপ্রপাত", d: "Chattogram", t: "Bandarban", u: "Chimbuk",
    c: ["Waterfall", "Nature"], la: 22.04, lo: 92.22,
    sd: "A graceful cascading waterfall on the Bandarban–Chimbuk road.",
    de: "Shoilo Propat is one of the most accessible waterfalls in Bandarban, located along the road to Chimbuk hill. Water tumbles down a mossy rock face into a small pool, making it a popular photo stop on the way to Meghla or Chimbuk.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.3, rv: 300,
    tt: "Family, Couples, Nature lovers",
    tags: ["waterfall", "roadside", "nature"],
    act: ["Photograph the falls", "Dip in the pool", "Combine with Chimbuk visit"],
    att: ["Shoilo Propat falls", "Chimbuk road scenery"],
    tips: ["Best flow in the rainy season", "Park safely on the roadside", "Combine with Meghla and Chimbuk"],
    ti: { from: "Bandarban town", km: 14, dur: "30 minutes", route: "Bandarban → Shoilo Propat", tr: ["Chander Gari", "Private Car", "Bike"], fl: null },
    nearby: ["chimbuk-hill", "meghla", "nilachal", "buddha-dhatu-jadi"]
},
{
    s: "sangu-river", n: "Sangu River", nb: "সাঙ্গু নদী", d: "Chattogram", t: "Bandarban", u: "Bandarban Sadar",
    c: ["River", "Adventure"], la: 22.02, lo: 92.20,
    sd: "The main river of the Chittagong Hill Tracts, perfect for boat trips and rafting.",
    de: "The Sangu (Shangu) river is the lifeblood of Bandarban, winding through deep green valleys from the hills to the Bay of Bengal. Traditional wooden boats ferry travellers between villages, while the upper reaches offer some of the country's few white-water rafting stretches.",
    b: "October – March", dy: "Half day", df: "Easy to Moderate", ra: 4.4, rv: 220,
    tt: "Family, Adventure, Culture",
    tags: ["river", "boating", "rafting"],
    act: ["Boat ride on the Sangu", "Rafting on upper stretches", "Visit riverside villages"],
    att: ["Sangu river valley", "Bamboo bridges", "Tribal villages"],
    tips: ["Ask about rafting conditions", "Carry a life jacket on boats", "Best light for photos in late afternoon"],
    ti: { from: "Bandarban town", km: 0, dur: "On-site", route: "Boats depart from Bandarban town", tr: ["Boat", "Walk"], fl: null },
    nearby: ["bandarban", "nilgiri", "thanchi", "remakri"]
},
{
    s: "thanchi", n: "Thanchi", nb: "থানচি", d: "Chattogram", t: "Bandarban", u: "Thanchi",
    c: ["Village", "Eco Tourism", "Adventure"], la: 21.78, lo: 92.43,
    sd: "The remote southern gateway to the waterfalls and peaks of southern Bandarban.",
    de: "Thanchi is a remote upazila of Bandarban bordering Myanmar, known as the base camp for treks to Nilgiri, Remakri, Nafakhum and beyond. The road to Thanchi is a spectacular ride along the Sangu river, past hanging bamboo bridges and tribal villages.",
    b: "October – April", dy: "1 – 2 days", df: "Moderate", ra: 4.5, rv: 200,
    tt: "Adventure, Trekking, Backpackers",
    tags: ["remote", "trek base", "tribal"],
    act: ["Trek to nearby waterfalls", "Visit tribal villages", "Cross bamboo bridges"],
    att: ["Sangu river valley", "Bawm and Mru villages", "Bamboo bridges"],
    tips: ["Use a guide in this remote area", "Prepare for limited facilities", "Carry cash and supplies"],
    ti: { from: "Bandarban town", km: 60, dur: "2.5 – 3 hours", route: "Bandarban → Thanchi", tr: ["Chander Gari", "Private Car"], fl: null },
    nearby: ["nilgiri", "remakri", "nafakhum", "sangu-river"]
},
{
    s: "remakri", n: "Remakri", nb: "রেমাক্রি", d: "Chattogram", t: "Bandarban", u: "Thanchi",
    c: ["Village", "Eco Tourism", "Adventure"], la: 21.83, lo: 92.50,
    sd: "The last Bangladeshi settlement before Myanmar, ringed by forest and waterfalls.",
    de: "Remakri is the southernmost Bangladeshi village along the Sangu river, near the Myanmar border. It is the trailhead for Nafakhum and offers simple stays, tribal culture and the feeling of being at the very edge of the country.",
    b: "October – April", dy: "1 – 2 days", df: "Challenging", ra: 4.6, rv: 140,
    tt: "Adventure, Trekking",
    tags: ["border", "remote", "trek base"],
    act: ["Trek to Nafakhum", "Stay in a tribal homestay", "Explore the Sangu river"],
    att: ["Nafakhum trailhead", "Mru villages", "Sangu river"],
    tips: ["Arrange permits and guides in Bandarban", "Prepare for very basic accommodation", "Carry supplies"],
    ti: { from: "Bandarban town", km: 90, dur: "3.5 – 4 hours", route: "Bandarban → Thanchi → Remakri", tr: ["Chander Gari", "Walk"], fl: null },
    nearby: ["nafakhum", "amiakhum", "thanchi", "boga-lake"]
},

/* ---- Rangamati ---- */
{
    s: "hanging-bridge-rangamati", n: "Hanging Bridge", nb: "ঝুলন্ত সেতু", d: "Chattogram", t: "Rangamati", u: "Rangamati Sadar",
    c: ["Historical", "Lake"], la: 22.65, lo: 92.20,
    sd: "Rangamati's iconic suspension bridge linking the hill town to Kaptai lake villages.",
    de: "The Hanging Bridge is the most photographed landmark of Rangamati, a pedestrian suspension bridge built in 2003 that crosses a narrow arm of Kaptai lake. Walking across it sways gently above the water and connects the town to tribal villages on the far shore.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.5, rv: 610,
    tt: "Family, Couples, Everyone",
    tags: ["bridge", "lake", "landmark"],
    act: ["Walk across the bridge", "Photograph Kaptai lake", "Visit the far-shore villages"],
    att: ["Hanging Bridge", "Kaptai lake views"],
    tips: ["Go early morning to avoid crowds", "Watch your step — the deck sways", "Best photos from the far side"],
    ti: { from: "Dhaka", km: 350, dur: "8 – 10 hours", route: "Dhaka → Chattogram → Rangamati", tr: ["Bus", "Train", "Private Car"], fl: null },
    nearby: ["rangamati", "kaptai-lake", "shuvolong-waterfall", "rajban-bihar"]
},
{
    s: "shuvolong-waterfall", n: "Shuvolong Waterfall", nb: "শুভলং ঝরনা", d: "Chattogram", t: "Rangamati", u: "Kaptai",
    c: ["Waterfall", "Lake"], la: 22.57, lo: 92.20,
    sd: "A waterfall that plunges straight into Kaptai lake, seen by boat.",
    de: "Shuvolong is a picturesque waterfall that pours directly into Kaptai lake, making it a highlight of the Rangamati boat circuit. Boats pause so visitors can swim in the cool water where the falls meet the lake, surrounded by forested hills.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.5, rv: 380,
    tt: "Family, Friends, Nature lovers",
    tags: ["waterfall", "lake", "boat trip"],
    act: ["Boat ride to the falls", "Swim near the falls", "Visit Kaptai lake village"],
    att: ["Shuvolong falls", "Kaptai lake", "Hanging cottages"],
    tips: ["Take a shared boat from Rangamati jetty", "Carry a change of clothes", "Avoid after heavy rain"],
    ti: { from: "Rangamati", km: 20, dur: "1 hour boat ride", route: "Rangamati jetty → Shuvolong by boat", tr: ["Boat"], fl: null },
    nearby: ["kaptai-lake", "hanging-bridge-rangamati", "rangamati", "kaptai-national-park"]
},
{
    s: "kaptai-national-park", n: "Kaptai National Park", nb: "কাপ্তাই জাতীয় উদ্যান", d: "Chattogram", t: "Rangamati", u: "Kaptai",
    c: ["National Park", "Forest", "Wildlife"], la: 22.62, lo: 92.17,
    sd: "A protected forest with spotted deer, gibbons and a canopy of tall trees.",
    de: "Kaptai National Park protects tropical evergreen forest along Kaptai lake, home to spotted deer, barking deer, capped langurs and birds. Walking trails lead through the trees, and the lake edge offers peaceful picnic spots.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.2, rv: 260,
    tt: "Family, Nature lovers",
    tags: ["national park", "forest", "deer"],
    act: ["Walk the forest trails", "Look for deer and gibbons", "Picnic by the lake"],
    att: ["Forest trails", "Kaptai lake edge", "Wildlife"],
    tips: ["Wear long sleeves for the forest", "Visit in the morning for wildlife", "Hire a local nature guide"],
    ti: { from: "Rangamati", km: 22, dur: "1 hour", route: "Rangamati → Kaptai → park", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["kaptai-lake", "shuvolong-waterfall", "rangamati", "hanging-bridge-rangamati"]
},
{
    s: "rajban-bihar", n: "Rajban Bihar", nb: "রাজবন বিহার", d: "Chattogram", t: "Rangamati", u: "Rangamati Sadar",
    c: ["Religious", "Cultural", "Historical"], la: 22.65, lo: 92.18,
    sd: "A 300-year-old Buddhist monastery in the heart of Rangamati.",
    de: "Rajban Bihar is a historic Theravada Buddhist monastery in Rangamati town, said to be around three centuries old. Its serene compound, golden stupas and prayer halls make it both a place of worship and a tranquil stop for visitors.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.4, rv: 210,
    tt: "Culture, Spiritual, Everyone",
    tags: ["buddhist", "monastery", "heritage"],
    act: ["Explore the monastery", "Learn about Buddhist heritage", "Photograph the stupas"],
    att: ["Bihar buildings", "Stupas", "Chakma heritage"],
    tips: ["Dress modestly", "Remove shoes before entering", "Respect worshippers"],
    ti: { from: "Rangamati", km: 2, dur: "10 minutes", route: "Rangamati town centre → Rajban Bihar", tr: ["Rickshaw", "Walk"], fl: null },
    nearby: ["rangamati", "hanging-bridge-rangamati", "tribal-cultural-institute", "kaptai-lake"]
},
{
    s: "tribal-cultural-institute", n: "Tribal Cultural Institute", nb: "উপজাতি সাংস্কৃতিক ইনস্টিটিউট", d: "Chattogram", t: "Rangamati", u: "Rangamati Sadar",
    c: ["Museum", "Cultural"], la: 22.65, lo: 92.20,
    sd: "A museum of Chakma, Marma and other Hill Tracts cultures.",
    de: "The Tribal Cultural Institute in Rangamati showcases the heritage of the Chakma, Marma, Tripura and other hill peoples through life-size models, costumes, musical instruments and household tools. It is the best single stop to understand the culture of the Chittagong Hill Tracts.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.4, rv: 190,
    tt: "Culture, Students, Families",
    tags: ["museum", "tribal culture"],
    act: ["See cultural exhibits", "View traditional costumes", "Learn about hill peoples"],
    att: ["Cultural galleries", "Tribal model displays"],
    tips: ["Check opening hours before visiting", "Photography rules may apply", "Combine with a Rangamati town tour"],
    ti: { from: "Rangamati", km: 1, dur: "5 minutes", route: "Rangamati town → institute", tr: ["Rickshaw", "Walk"], fl: null },
    nearby: ["rangamati", "hanging-bridge-rangamati", "rajban-bihar", "kaptai-lake"]
},

/* ---- Khagrachhari ---- */
{
    s: "dighinala", n: "Dighinala", nb: "দিঘিনালা", d: "Chattogram", t: "Khagrachhari", u: "Dighinala",
    c: ["Hill", "Eco Tourism"], la: 23.27, lo: 91.94,
    sd: "A lush hill valley in Khagrachhari, gateway to Ruilui Para and hill views.",
    de: "Dighinala is a scenic upazila of Khagrachhari known for rolling hills, rivers and indigenous villages. It is the staging point for the journey toward Sajek Valley and offers its own viewpoints over the surrounding green mountains.",
    b: "October – April", dy: "1 day", df: "Easy to Moderate", ra: 4.3, rv: 180,
    tt: "Nature, Adventure",
    tags: ["hills", "valley", "tribal"],
    act: ["Hill viewpoint walks", "Visit tribal villages", "Scenic drives"],
    att: ["Green hills", "River valleys", "Indigenous villages"],
    tips: ["Travel by chander gari in the hills", "Ask locally before trekking", "Carry rain gear"],
    ti: { from: "Khagrachhari", km: 40, dur: "1.5 hours", route: "Khagrachhari → Dighinala", tr: ["Bus", "CNG", "Chander Gari"], fl: null },
    nearby: ["alutila-cave", "richhang-waterfall", "sajek-valley"]
},
{
    s: "panchari", n: "Panchari", nb: "পানছড়ি", d: "Chattogram", t: "Khagrachhari", u: "Panchari",
    c: ["Village", "Eco Tourism"], la: 23.27, lo: 91.89,
    sd: "A tranquil tribal upazila with streams, hills and village homestays.",
    de: "Panchari is a quiet upazila of Khagrachhari where green hills, small streams and indigenous communities offer an unhurried escape. It is less visited than Sajek or Dighinala, appealing to travellers who want authentic hill-country life.",
    b: "October – April", dy: "1 – 2 days", df: "Moderate", ra: 4.2, rv: 120,
    tt: "Nature, Solo, Backpackers",
    tags: ["village", "hills", "tribal"],
    act: ["Village walks", "Streamside relaxation", "Tribal culture experience"],
    att: ["Hill villages", "Streams", "Indigenous culture"],
    tips: ["Respect local customs", "Use a guide for remote areas", "Limited facilities — carry supplies"],
    ti: { from: "Khagrachhari", km: 35, dur: "1.5 hours", route: "Khagrachhari → Panchari", tr: ["Bus", "CNG", "Chander Gari"], fl: null },
    nearby: ["alutila-cave", "dighinala", "sajek-valley"]
},

/* ---- Cumilla ---- */
{
    s: "salban-vihara", n: "Salban Vihara", nb: "শালবন বিহার", d: "Chattogram", t: "Cumilla", u: "Mainamati",
    c: ["Archaeological", "Historical", "Religious"], la: 23.46, lo: 91.11,
    sd: "An 8th-century Buddhist monastery complex at Mainamati.",
    de: "Salban Vihara is the best-known structure of the Mainamati archaeological site, an 8th-century Buddhist monastery built by the Chandra dynasty. Excavated ruins reveal a central shrine, cells for monks and a great courtyard, part of a large monastic city that flourished here centuries ago.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.5, rv: 400,
    tt: "History, Students, Families", feat: true,
    tags: ["buddhist", "archaeology", "monastery", "unesco tentative"],
    act: ["Explore the ruins", "Visit Mainamati museum", "Photograph the stupas"],
    att: ["Salban Vihara", "Mainamati museum", "Kotila Mura", "Shalban pond"],
    tips: ["Wear comfortable walking shoes", "Hire a guide for history", "Combine with the Mainamati museum"],
    ti: { from: "Cumilla", km: 8, dur: "20 minutes", route: "Cumilla → Mainamati", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["mainamati", "lalmai-hills", "mainamati-museum", "cumilla-war-cemetery"]
},
{
    s: "mainamati-museum", n: "Mainamati Museum", nb: "ময়নামতি জাদুঘর", d: "Chattogram", t: "Cumilla", u: "Mainamati",
    c: ["Museum", "Archaeological"], la: 23.46, lo: 91.11,
    sd: "A museum displaying artifacts from the Buddhist monastic city of Mainamati.",
    de: "The Mainamati Museum houses sculptures, coins, terracotta plaques and pottery recovered from the Salban Vihara and nearby archaeological sites. Its collection illustrates the Buddhist and Buddhist-influenced culture that shaped this region of Bengal between the 8th and 12th centuries.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.4, rv: 230,
    tt: "History, Students, Families",
    tags: ["museum", "archaeology"],
    act: ["View the artifact collection", "Learn the site history", "Combine with Salban Vihara"],
    att: ["Terracotta plaques", "Sculptures", "Coins and pottery"],
    tips: ["Check opening hours", "Photography rules apply", "Start with the museum before the ruins"],
    ti: { from: "Cumilla", km: 8, dur: "20 minutes", route: "Cumilla → Mainamati", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["salban-vihara", "mainamati", "lalmai-hills"]
},
{
    s: "cumilla-war-cemetery", n: "Cumilla War Cemetery", nb: "কুমিল্লা ওয়ার সেমেট্রি", d: "Chattogram", t: "Cumilla", u: "Cumilla Sadar",
    c: ["Historical", "Heritage"], la: 23.46, lo: 91.18,
    sd: "A beautifully kept Commonwealth cemetery from World War II.",
    de: "Cumilla War Cemetery, managed by the Commonwealth War Graves Commission, holds more than 700 graves of soldiers who died in the Burma campaign of World War II. Rows of identical headstones and clipped lawns give it a moving, serene atmosphere.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.5, rv: 170,
    tt: "History, Reflection, Families",
    tags: ["war cemetery", "world war ii", "heritage"],
    act: ["Walk the grounds", "Read the headstones", "Reflect on history"],
    att: ["War graves", "Memorial gardens"],
    tips: ["Visit during opening hours", "Be respectful — it is an active cemetery", "Combine with Mainamati"],
    ti: { from: "Cumilla", km: 3, dur: "15 minutes", route: "Cumilla town → war cemetery", tr: ["Rickshaw", "CNG", "Private Car"], fl: null },
    nearby: ["mainamati", "salban-vihara", "lalmai-hills"]
},
{
    s: "lalmai-hills", n: "Lalmai Hills", nb: "লালমাই পাহাড়", d: "Chattogram", t: "Cumilla", u: "Mainamati",
    c: ["Hill", "Archaeological", "Nature"], la: 23.43, lo: 91.12,
    sd: "Low red-clay hills west of Cumilla dotted with ancient ruins.",
    de: "The Lalmai Hills are a chain of low hills near Cumilla that once carried an entire Buddhist monastic complex. Today they are partly quarried, yet walking the remaining slopes still reveals brick ruins, forested valleys and open views of the surrounding plain.",
    b: "October – March", dy: "Half day", df: "Easy to Moderate", ra: 4.1, rv: 150,
    tt: "Nature, History",
    tags: ["hills", "ruins", "archaeology"],
    act: ["Walk the hill trails", "Spot archaeological remains", "Picnic on the slopes"],
    att: ["Lalmai ridges", "Ruined monasteries", "Scenic views"],
    tips: ["Some areas are quarries — stick to marked paths", "Best in winter mornings", "Combine with Mainamati sites"],
    ti: { from: "Cumilla", km: 7, dur: "20 minutes", route: "Cumilla → Lalmai", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["mainamati", "salban-vihara", "mainamati-museum"]
},

/* ---- Chandpur ---- */
{
    s: "chandpur-three-rivers", n: "Padma–Meghna Confluence", nb: "ত্রিমোহনা", d: "Chattogram", t: "Chandpur", u: "Chandpur Sadar",
    c: ["River", "Nature"], la: 23.23, lo: 90.66,
    sd: "The point where the Padma and Meghna meet in a wide water vista at Chandpur.",
    de: "Chandpur sits at the meeting of the Padma (Lower Ganges) and Meghna rivers, a broad stretch of water busy with launches, ferries and fishing boats. The riverfront is a classic photo spot, especially at sunset when the water glows orange.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.3, rv: 210,
    tt: "Family, Everyone",
    tags: ["river", "confluence", "sunset"],
    act: ["Watch boats on the confluence", "Sunset photography", "Ride a launch briefly"],
    att: ["Padma–Meghna confluence", "Chandpur riverfront"],
    tips: ["Best views in late afternoon", "Keep belongings close at the ghat", "Combine with Mini Cox's Bazar"],
    ti: { from: "Dhaka", km: 84, dur: "2 – 3 hours", route: "Dhaka → Chandpur", tr: ["Bus", "Launch", "Private Car"], fl: null },
    nearby: ["mini-coxs-bazar-chandpur", "haimchar", "padma-bridge", "bhola-island"]
},
{
    s: "mini-coxs-bazar-chandpur", n: "Chandpur Sandbar (Mini Cox's Bazar)", nb: "মিনি কক্সবাজার", d: "Chattogram", t: "Chandpur", u: "Haimchar",
    c: ["River", "Picnic Spot", "Beach"], la: 23.16, lo: 90.72,
    sd: "A wide sandbar on the Meghna nicknamed 'Mini Cox's Bazar'.",
    de: "The sandbar on the Meghna river near Chandpur is locally nicknamed 'Mini Cox's Bazar' because of its wide, open sand field that appears at low tide. It draws picnickers and photographers looking for a beach-like experience along the river.",
    b: "November – April", dy: "Half day", df: "Easy", ra: 4.0, rv: 130,
    tt: "Family, Picnic",
    tags: ["sandbar", "meghna", "picnic"],
    act: ["Walk the sandbar", "Picnic with a river view", "Photograph the Meghna"],
    att: ["Meghna sandbar", "River horizon"],
    tips: ["Timing depends on tides", "The sandbar is exposed at low tide", "Carry sun protection"],
    ti: { from: "Chandpur", km: 20, dur: "40 minutes", route: "Chandpur → Haimchar sandbar", tr: ["Bus", "CNG", "Boat"], fl: null },
    nearby: ["chandpur-three-rivers", "haimchar", "bhola-island"]
},
{
    s: "haimchar", n: "Haimchar", nb: "হাইমচর", d: "Chattogram", t: "Chandpur", u: "Haimchar",
    c: ["River", "Village"], la: 23.32, lo: 90.80,
    sd: "A riverine upazila of Chandpur surrounded by the Meghna.",
    de: "Haimchar is a riverine upazila of Chandpur where the Meghna splits into channels around low-lying chars. Village ferries, fishing boats and floating markets offer an authentic look at river life in the delta.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 80,
    tt: "Culture, Solo",
    tags: ["river", "village", "chars"],
    act: ["Ferry rides", "Village walks", "Fishing village photos"],
    att: ["Meghna channels", "Char villages"],
    tips: ["Carry identification", "Ask locals before wandering", "Best explored on foot"],
    ti: { from: "Chandpur", km: 25, dur: "1 hour", route: "Chandpur → Haimchar", tr: ["Bus", "CNG", "Boat"], fl: null },
    nearby: ["chandpur-three-rivers", "mini-coxs-bazar-chandpur", "bhola-island"]
},

/* ---- Brahmanbaria ---- */
{
    s: "haripur-barabari", n: "Haripur Barabari", nb: "হরিপুর বাড়বাড়ি", d: "Chattogram", t: "Brahmanbaria", u: "Nasirnagar",
    c: ["Historical", "Heritage", "Palace"], la: 23.99, lo: 91.14,
    sd: "A grand 17th-century zamindar mansion of the Haripur zamindars.",
    de: "Haripur Barabari is a large 17th-century zamindar (landlord) mansion built by the wealthy Haripur family in Nasirnagar, Brahmanbaria. Its ornate facade, courtyards and decorative interiors are among the finest surviving examples of zamindari architecture in eastern Bengal.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.3, rv: 140,
    tt: "History, Architecture lovers",
    tags: ["zamindar bari", "mansion", "heritage"],
    act: ["Explore the mansion", "Photograph the architecture", "Learn zamindar history"],
    att: ["Barabari mansion", "Ornate interiors"],
    tips: ["Ask caretakers before entering rooms", "Best light for photos in the morning", "Combine with Titas river sites"],
    ti: { from: "Brahmanbaria", km: 25, dur: "1 hour", route: "Brahmanbaria → Nasirnagar → Haripur", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["titas-river-brahmanbaria", "pakutia-zamindar-bari", "sonargaon"]
},
{
    s: "titas-river-brahmanbaria", n: "Titas River", nb: "তিতাস নদী", d: "Chattogram", t: "Brahmanbaria", u: "Brahmanbaria Sadar",
    c: ["River", "Cultural", "Village"], la: 23.65, lo: 91.03,
    sd: "The river immortalised in Bengali literature, threading through Brahmanbaria.",
    de: "The Titas river is a branch of the Meghna that runs through Brahmanbaria, made famous by Adwaita Mallabarman's novel 'A River Called Titas' and the classic film based on it. Its banks hold fishing villages, ghats and the everyday river life of rural Bangladesh.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.2, rv: 160,
    tt: "Culture, Nature, Solo",
    tags: ["river", "literature", "village life"],
    act: ["Boat ride on the Titas", "Visit riverside villages", "Photograph the ghats"],
    att: ["Titas river", "Fisher villages", "Boat ghats"],
    tips: ["Best in winter when water is calm", "Take a local boat for the full experience", "Bring snacks for village walks"],
    ti: { from: "Brahmanbaria", km: 2, dur: "10 minutes", route: "Brahmanbaria town → Titas ghat", tr: ["Rickshaw", "CNG", "Boat"], fl: null },
    nearby: ["haripur-barabari", "chandpur-three-rivers", "sonargaon"]
},

/* ---- Feni ---- */
{
    s: "muhurir-char", n: "Muhurir Char", nb: "মুহুরির চর", d: "Chattogram", t: "Feni", u: "Feni Sadar",
    c: ["River", "Picnic Spot"], la: 22.98, lo: 91.40,
    sd: "A riverside char near Feni town, popular for picnics and boating.",
    de: "Muhurir Char is a sandbar and riverside area along the Muhuri river near Feni town. Locals visit for picnics, boating and fishing, making it a pleasant weekend escape close to the city.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 90,
    tt: "Family, Picnic",
    tags: ["char", "river", "picnic"],
    act: ["Picnic by the river", "Boating", "Fishing"],
    att: ["Muhuri river", "Sandbar"],
    tips: ["Best in the dry season", "Carry your own picnic supplies", "Check local access"],
    ti: { from: "Feni", km: 10, dur: "30 minutes", route: "Feni → Muhuri river char", tr: ["CNG", "Private Car"], fl: null },
    nearby: ["sonagazi", "ramgati-lakshmipur", "chandpur-three-rivers"]
},
{
    s: "sonagazi", n: "Sonagazi", nb: "সোনাগাজী", d: "Chattogram", t: "Feni", u: "Sonagazi",
    c: ["River", "Coastal", "Village"], la: 22.85, lo: 91.40,
    sd: "A coastal upazila of Feni with rivers, chars and rural waterways.",
    de: "Sonagazi is a coastal upazila of Feni district where the landscape turns to rivers, chars and low farmland near the Bay of Bengal. It offers a quiet, authentic look at coastal Bangladesh away from tourist routes.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.8, rv: 60,
    tt: "Solo, Nature, Culture",
    tags: ["coastal", "river", "village"],
    act: ["Village walks", "Riverbank views", "Watch fishing boats"],
    att: ["River channels", "Coastal chars"],
    tips: ["Limited facilities — carry water", "Best visited as a day trip", "Ask locals for directions"],
    ti: { from: "Feni", km: 22, dur: "1 hour", route: "Feni → Sonagazi", tr: ["Bus", "CNG"], fl: null },
    nearby: ["muhurir-char", "ramgati-lakshmipur", "nijhum-dwip"]
},

/* ---- Lakshmipur ---- */
{
    s: "ramgati-lakshmipur", n: "Ramgati", nb: "রামগতি", d: "Chattogram", t: "Lakshmipur", u: "Ramgati",
    c: ["River", "Coastal"], la: 22.61, lo: 90.99,
    sd: "A riverine upazila of Lakshmipur along the banks of the Meghna.",
    de: "Ramgati is a low-lying upazila of Lakshmipur district facing the Meghna river and the islands of Bhola across the water. Its riverside villages, ferries and views over the wide Meghna make it a quiet stop for travellers exploring the delta.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 70,
    tt: "Nature, Solo",
    tags: ["meghna", "river", "delta"],
    act: ["Meghna river views", "Village walks", "Ferry rides"],
    att: ["Meghna river", "Delta villages"],
    tips: ["Best views from the riverbank", "Local ferries connect to islands", "Carry cash"],
    ti: { from: "Lakshmipur", km: 30, dur: "1 hour", route: "Lakshmipur → Ramgati", tr: ["Bus", "CNG"], fl: null },
    nearby: ["bhola-island", "monpura", "sonagazi", "nijhum-dwip"]
},

/* ============================ SYLHET DIVISION ============================ */

/* ---- Sylhet ---- */
{
    s: "sada-pathor", n: "Sada Pathor", nb: "সাদা পাথর", d: "Sylhet", t: "Sylhet", u: "Bholaganj",
    c: ["River", "Nature", "Picnic Spot"], la: 25.12, lo: 91.73,
    sd: "A white-stone riverbed at Bholaganj where the crystal-clear stream sparkles.",
    de: "Sada Pathor ('white stone') is the famous stone-littered bed of the river at Bholaganj, near the border with Meghalaya. Clear water tumbles over white and grey boulders, making it a favourite spot for wading, photography and riverside picnics.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.5, rv: 480,
    tt: "Friends, Couples, Families", feat: true,
    tags: ["white stone", "river", "bholaganj", "stones"],
    act: ["Wade in the clear water", "Photograph the stone bed", "Picnic on the boulders"],
    att: ["Sada Pathor riverbed", "Stone quarry area", "Bholaganj river"],
    tips: ["Stones are slippery — wear grip footwear", "Go early to avoid crowds", "Best in winter"],
    ti: { from: "Sylhet", km: 55, dur: "1.5 – 2 hours", route: "Sylhet → Bholaganj", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["jaflong", "ratargul-swamp-forest", "bichanakandi", "lalakhal"]
},
{
    s: "shah-jalal-mazar", n: "Hazrat Shah Jalal Mazar", nb: "হযরত শাহজালাল মাজার", d: "Sylhet", t: "Sylhet", u: "Sylhet Sadar",
    c: ["Shrine", "Religious", "Heritage"], la: 24.89, lo: 91.87,
    sd: "The revered shrine of the great Sufi saint who brought Islam to Sylhet.",
    de: "The mazar (shrine) of Hazrat Shah Jalal (R) is one of the most important Islamic pilgrimage sites in Bangladesh. The saint, who spread Islam in Sylhet in the early 14th century, rests beneath a domed mausoleum visited by thousands of devotees daily.",
    b: "Year-round", dy: "1 – 2 hours", df: "Easy", ra: 4.7, rv: 980,
    tt: "Pilgrims, Culture, Everyone", feat: true,
    tags: ["sufi saint", "shrine", "pilgrimage"],
    act: ["Offer prayers at the shrine", "Experience the courtyard atmosphere", "See the sacred pond"],
    att: ["Shah Jalal dargah", "Mazar complex"],
    tips: ["Dress modestly", "Remove shoes at the entrance", "Sit quietly in the prayer area"],
    ti: { from: "Sylhet", km: 1, dur: "10 minutes", route: "Sylhet city → mazar", tr: ["Rickshaw", "CNG", "Walk"], fl: null },
    nearby: ["sylhet", "shah-paran-mazar", "lakkatura-tea-estate", "osmani-museum-sylhet"]
},
{
    s: "shah-paran-mazar", n: "Hazrat Shah Paran Mazar", nb: "হযরত শাহপরান মাজার", d: "Sylhet", t: "Sylhet", u: "Sylhet Sadar",
    c: ["Shrine", "Religious", "Heritage"], la: 24.88, lo: 91.87,
    sd: "The shrine of Shah Jalal's nephew, set on a hill above Sylhet city.",
    de: "Hazrat Shah Paran (R), the nephew of Hazrat Shah Jalal, is buried at a shrine on a low hill overlooking Sylhet. The peaceful complex, with its white dome and gardens, is an important pilgrimage site and offers a fine view of the city below.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.5, rv: 520,
    tt: "Pilgrims, Culture, Everyone",
    tags: ["shrine", "sufi saint", "hill"],
    act: ["Visit the shrine", "Enjoy the hilltop view", "Walk the gardens"],
    att: ["Shah Paran dargah", "Hilltop view of Sylhet"],
    tips: ["Dress modestly", "Best light for photos in late afternoon", "Combines easily with Shah Jalal Mazar"],
    ti: { from: "Sylhet", km: 4, dur: "15 minutes", route: "Sylhet city → Shah Paran", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["sylhet", "shah-jalal-mazar", "lakkatura-tea-estate", "osmani-museum-sylhet"]
},
{
    s: "osmani-museum-sylhet", n: "Osmani Museum", nb: "ওসমানী জাদুঘর", d: "Sylhet", t: "Sylhet", u: "Sylhet Sadar",
    c: ["Museum", "Historical"], la: 24.89, lo: 91.87,
    sd: "A museum dedicated to General M.A.G. Osmani, commander of the 1971 liberation forces.",
    de: "The Osmani Museum in Sylhet honours General M.A.G. Osmani, the commander-in-chief of the Bangladesh Forces during the 1971 Liberation War. Personal belongings, photographs and documents trace his life and the struggle for independence.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.4, rv: 210,
    tt: "History, Students",
    tags: ["museum", "liberation war", "osmani"],
    act: ["Explore the exhibits", "Learn 1971 history", "Photograph the memorial"],
    att: ["Osmani memorabilia", "Liberation war exhibits"],
    tips: ["Check opening hours", "Be respectful — a memorial site", "Combine with the mazars"],
    ti: { from: "Sylhet", km: 2, dur: "10 minutes", route: "Sylhet city → Osmani Museum", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["sylhet", "shah-jalal-mazar", "shah-paran-mazar"]
},

/* ---- Sunamganj ---- */
{
    s: "jadukata-river", n: "Jadukata River", nb: "জাদুকাটা নদী", d: "Sylhet", t: "Sunamganj", u: "Tahirpur",
    c: ["River", "Nature"], la: 25.05, lo: 91.66,
    sd: "A crystal-clear river flowing into Tanguar Haor, great for boat trips.",
    de: "The Jadukata is a clear, shallow river that drains into Tanguar Haor in Sunamganj. Boat trips along its winding course pass sandy islets, paddy fields and haor villages, especially rewarding during the winter bird migration season.",
    b: "November – February", dy: "Half day", df: "Easy", ra: 4.4, rv: 190,
    tt: "Nature, Solo, Birdwatchers",
    tags: ["river", "haor", "boat"],
    act: ["Boat ride on the Jadukata", "Bird watching", "Haor village visits"],
    att: ["Jadukata river", "Tanguar Haor approach", "Sandy islets"],
    tips: ["Best in winter with migratory birds", "Take a local boat", "Carry water"],
    ti: { from: "Sunamganj", km: 45, dur: "1.5 – 2 hours", route: "Sunamganj → Tahirpur → Jadukata", tr: ["Bus", "CNG", "Boat"], fl: null },
    nearby: ["tanguar-haor", "niladri-lake-sunamganj", "shimul-bagan", "barikka-tila"]
},
{
    s: "shimul-bagan", n: "Shimul Bagan", nb: "শিমুল বাগান", d: "Sylhet", t: "Sunamganj", u: "Tahirpur",
    c: ["Nature", "Picnic Spot"], la: 25.08, lo: 91.67,
    sd: "A red-cotton-tree (shimul) grove that blooms fiery orange in late winter.",
    de: "Shimul Bagan is a plantation of shimul (silk-cotton) trees near Tahirpur in Sunamganj. In February, the trees burst into vivid red-orange blossom, carpeting the ground and drawing photographers and picnickers to this quiet countryside spot.",
    b: "February", dy: "Half day", df: "Easy", ra: 4.4, rv: 150,
    tt: "Nature, Photography, Families",
    tags: ["shimul tree", "blossom", "picnic"],
    act: ["Photograph the blooming trees", "Picnic under the shimul", "Walk the grove"],
    att: ["Shimul groves", "Blossom carpet"],
    tips: ["Visit in February for full bloom", "Go early for soft light", "Respect the private groves"],
    ti: { from: "Sunamganj", km: 48, dur: "2 hours", route: "Sunamganj → Tahirpur → Shimul Bagan", tr: ["Bus", "CNG"], fl: null },
    nearby: ["jadukata-river", "tanguar-haor", "barikka-tila", "niladri-lake-sunamganj"]
},
{
    s: "barikka-tila", n: "Barikka Tila", nb: "বরিক্কা টিলা", d: "Sylhet", t: "Sunamganj", u: "Tahirpur",
    c: ["Hill", "Nature"], la: 25.07, lo: 91.70,
    sd: "A wooded hill in Sunamganj with views over the surrounding haors.",
    de: "Barikka Tila is one of the few elevations in flat Sunamganj, a forested hill rising beside the haor wetlands. Climbing it gives a bird's-eye view of the water bodies and green fields that stretch to the horizon.",
    b: "October – March", dy: "2 – 3 hours", df: "Moderate", ra: 4.2, rv: 100,
    tt: "Nature, Adventure",
    tags: ["hill", "haor view"],
    act: ["Climb the tila", "Photograph the haor landscape", "Forest walk"],
    att: ["Barikka Tila summit", "Haor panorama"],
    tips: ["Wear sturdy shoes", "Carry water for the climb", "Combine with Shimul Bagan"],
    ti: { from: "Sunamganj", km: 50, dur: "2 hours", route: "Sunamganj → Tahirpur → Barikka", tr: ["Bus", "CNG"], fl: null },
    nearby: ["tanguar-haor", "jadukata-river", "shimul-bagan"]
},
{
    s: "niladri-lake-sunamganj", n: "Niladri Lake", nb: "নীলাদ্রি লেক", d: "Sylhet", t: "Sunamganj", u: "Dhirai",
    c: ["Lake", "Eco Tourism"], la: 25.05, lo: 91.60,
    sd: "A secluded lake near Dhirai in Sunamganj, ideal for quiet boating.",
    de: "Niladri Lake is a tranquil oxbow lake in the Dhirai area of Sunamganj, its name meaning 'blue hill'. Surrounded by village fields and dotted with water lilies, it offers peaceful boating far from tourist crowds.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.1, rv: 90,
    tt: "Nature, Solo",
    tags: ["lake", "boating"],
    act: ["Boat on the lake", "Bird watching", "Village walk"],
    att: ["Niladri Lake", "Water lilies", "Village scenery"],
    tips: ["Ask locals to arrange a boat", "Best in the early morning", "Limited facilities"],
    ti: { from: "Sunamganj", km: 40, dur: "1.5 hours", route: "Sunamganj → Dhirai", tr: ["Bus", "CNG"], fl: null },
    nearby: ["tanguar-haor", "jadukata-river", "shimul-bagan"]
},

/* ============================ DHAKA DIVISION ============================ */

/* ---- Dhaka ---- */
{
    s: "hatirjheel", n: "Hatirjheel", nb: "হাতিরঝিল", d: "Dhaka", t: "Dhaka", u: "Tejgaon",
    c: ["Lake", "City", "Picnic Spot"], la: 23.77, lo: 90.40,
    sd: "Dhaka's urban lake park with jogging paths, boats and skyline views.",
    de: "Hatirjheel is a man-made lake in the heart of Dhaka, transformed into a large urban park with walkways, a musical fountain, boating and an amphitheatre. At night its bridges are lit, and by day it is a favourite for walking, jogging and family outings.",
    b: "Year-round", dy: "1 – 2 hours", df: "Easy", ra: 4.3, rv: 720,
    tt: "Families, Couples, City walkers",
    tags: ["lake", "urban park", "boating"],
    act: ["Walk or jog the lake circuit", "Boat on the water", "Watch the musical fountain"],
    att: ["Hatirjheel lake", "Lighted bridges", "Amphitheatre"],
    tips: ["Best in the evening when lights are on", "Entry is free", "Go on weekdays for fewer crowds"],
    ti: { from: "Dhaka", km: 0, dur: "On-site", route: "Located in central Dhaka", tr: ["Rickshaw", "Metro Rail", "CNG", "Bus"], fl: null },
    nearby: ["old-dhaka", "ramna-park-dhaka", "national-parliament-house", "ahsan-manzil"]
},
{
    s: "ramna-park-dhaka", n: "Ramna Park", nb: "রমনা পার্ক", d: "Dhaka", t: "Dhaka", u: "Ramna",
    c: ["City", "Nature", "Picnic Spot"], la: 23.74, lo: 90.40,
    sd: "The green lung of Dhaka, a leafy park beside the Ramna Lake.",
    de: "Ramna Park is one of Dhaka's oldest and largest parks, surrounding the lovely Ramna Lake. Ancient trees, lawns, flower gardens and walking paths make it a calm retreat in the middle of the city, popular with joggers, families and couples.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.4, rv: 510,
    tt: "Families, Joggers, Everyone",
    tags: ["park", "lake", "green space"],
    act: ["Walk by Ramna Lake", "Jog the shaded paths", "Picnic on the lawns"],
    att: ["Ramna Lake", "Mature trees", "Flower gardens"],
    tips: ["Best in the early morning", "Entry is free", "Keep the area clean"],
    ti: { from: "Dhaka", km: 0, dur: "On-site", route: "Beside Ramna, central Dhaka", tr: ["Rickshaw", "Bus", "Metro Rail"], fl: null },
    nearby: ["suhrawardy-udyan", "national-parliament-house", "hatirjheel", "bangladesh-national-museum"]
},
{
    s: "liberation-war-museum", n: "Liberation War Museum", nb: "মুক্তিযুদ্ধ জাদুঘর", d: "Dhaka", t: "Dhaka", u: "Agargaon",
    c: ["Museum", "Historical"], la: 23.78, lo: 90.40,
    sd: "Bangladesh's premier museum of the 1971 Liberation War.",
    de: "The Liberation War Museum in Agargaon is the country's central museum dedicated to the 1971 war of independence. Powerful galleries hold weapons, photographs, documents, sculptures and personal stories of freedom fighters, tracing the nation's path to independence.",
    b: "Year-round", dy: "2 – 3 hours", df: "Easy", ra: 4.8, rv: 890,
    tt: "Families, Students, History lovers", feat: true,
    tags: ["liberation war", "museum", "1971"],
    act: ["Explore the permanent galleries", "See the sculpture plaza", "Watch archival films"],
    att: ["War galleries", "Gallery of martyrs", "Sculpture courtyard"],
    tips: ["Set aside 2–3 hours", "Check entry fees and hours", "Photography restrictions may apply"],
    ti: { from: "Dhaka", km: 5, dur: "20 minutes", route: "Agargaon, central Dhaka", tr: ["Metro Rail", "Bus", "Rickshaw"], fl: null },
    nearby: ["central-shaheed-minar", "national-parliament-house", "bangladesh-national-museum"]
},
{
    s: "panam-city", n: "Panam City", nb: "পানাম নগর", d: "Dhaka", t: "Narayanganj", u: "Sonargaon",
    c: ["Historical", "Heritage", "City"], la: 23.65, lo: 90.60,
    sd: "The deserted 19th-century merchant quarter of Sonargaon, frozen in time.",
    de: "Panam City is a 19th-century trading town built by wealthy Hindu cloth merchants in Sonargaon. Its grand abandoned buildings along a single wide street blend British, Mughal and Bengali styles, and today it is a haunting, photogenic heritage site.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.5, rv: 560,
    tt: "History, Photography, Architecture",
    tags: ["heritage", "abandoned city", "architecture"],
    act: ["Walk Panam Street", "Photograph the mansions", "Visit the adjacent museum"],
    att: ["Panam mansions", "British-era facades", "Folk art museum nearby"],
    tips: ["Go early to beat crowds", "Buildings are fragile — do not climb", "Best photos in soft morning light"],
    ti: { from: "Dhaka", km: 30, dur: "1 hour", route: "Dhaka → Sonargaon → Panam City", tr: ["Bus", "Private Car", "CNG"], fl: null },
    nearby: ["sonargaon", "folk-art-museum", "goaldi-mosque", "narayanganj"]
},
{
    s: "folk-art-museum", n: "Bangladesh Folk Art Museum", nb: "লোকশিল্প জাদুঘর", d: "Dhaka", t: "Narayanganj", u: "Sonargaon",
    c: ["Museum", "Cultural"], la: 23.65, lo: 90.60,
    sd: "A museum of village crafts housed in the old Sonargaon panch bari.",
    de: "The Bangladesh Folk Art Museum in Sonargaon occupies a historic panch bari (five-house) complex and displays an outstanding collection of rural crafts — terracotta, brass, jute, bamboo, nakshi kantha embroidery and folk instruments.",
    b: "Year-round", dy: "1 – 2 hours", df: "Easy", ra: 4.5, rv: 380,
    tt: "Families, Culture, Students",
    tags: ["museum", "folk art", "crafts"],
    act: ["See the craft collection", "Photograph the panch bari", "Buy crafts at the market"],
    att: ["Folk art galleries", "Panch bari architecture"],
    tips: ["Check opening hours", "Combine with Panam City", "Guided tours available"],
    ti: { from: "Dhaka", km: 30, dur: "1 hour", route: "Dhaka → Sonargaon", tr: ["Bus", "Private Car", "CNG"], fl: null },
    nearby: ["panam-city", "sonargaon", "goaldi-mosque", "narayanganj"]
},
{
    s: "goaldi-mosque", n: "Goaldi Mosque", nb: "গোয়ালদি মসজিদ", d: "Dhaka", t: "Narayanganj", u: "Sonargaon",
    c: ["Mosque", "Archaeological", "Historical"], la: 23.64, lo: 90.60,
    sd: "A 16th-century single-domed mosque in the heart of old Sonargaon.",
    de: "Goaldi Mosque was built in 1519 during the Husain Shahi dynasty, one of the few surviving medieval monuments of Sonargaon. Its single dome and carved terracotta decoration are fine examples of Sultanate-era Bengali architecture.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.3, rv: 180,
    tt: "History, Architecture, Culture",
    tags: ["mosque", "sultanate", "terracotta"],
    act: ["See the terracotta decoration", "Photograph the mosque", "Learn Sonargaon history"],
    att: ["Goaldi Mosque", "Terracotta panels"],
    tips: ["Respect prayer times", "Combine with Panam City and the museum", "Best light in the morning"],
    ti: { from: "Dhaka", km: 30, dur: "1 hour", route: "Dhaka → Sonargaon → Goaldi", tr: ["Bus", "Private Car", "CNG"], fl: null },
    nearby: ["sonargaon", "panam-city", "folk-art-museum", "narayanganj"]
},
{
    s: "mawa-ferry-ghat", n: "Mawa Ghat & Padma Riverfront", nb: "মাওয়া ঘাট", d: "Dhaka", t: "Munshiganj", u: "Louhajang",
    c: ["River", "Picnic Spot"], la: 23.47, lo: 90.31,
    sd: "The historic Padma river crossing at Mawa, beside the Padma Bridge.",
    de: "Mawa Ghat on the Padma river was the main Dhaka–Faridpur ferry crossing for decades and remains a lively riverfront beside the new Padma Bridge. Visitors come for river views, launches, and the sight of the country's largest bridge overhead.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.2, rv: 340,
    tt: "Families, Everyone",
    tags: ["padma river", "ferry ghat", "bridge"],
    act: ["See the Padma Bridge", "Watch ferries on the river", "Photograph the riverfront"],
    att: ["Padma Bridge", "Mawa ghat", "Padma river"],
    tips: ["Best views at sunset", "Combine with Padma Bridge viewpoints", "Carry cash for snacks"],
    ti: { from: "Dhaka", km: 40, dur: "1 – 1.5 hours", route: "Dhaka → Mawa", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["padma-bridge", "idrakpur-fort", "sonargaon", "bikrampur-munshiganj"]
},
{
    s: "bikrampur-munshiganj", n: "Bikrampur", nb: "বিক্রমপুর", d: "Dhaka", t: "Munshiganj", u: "Munshiganj Sadar",
    c: ["Archaeological", "Historical"], la: 23.55, lo: 90.52,
    sd: "The ancient capital of Bengal, rich with archaeological mounds.",
    de: "Bikrampur, around Munshiganj, was a capital of ancient Bengal and a major centre of Buddhism and learning. Numerous archaeological mounds have yielded Buddhist stupas and artifacts, and its temples and history make it a rewarding heritage circuit.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.1, rv: 130,
    tt: "History, Students, Culture",
    tags: ["archaeology", "ancient capital", "buddhist"],
    act: ["Explore archaeological mounds", "Visit historic temples", "Learn ancient Bengal history"],
    att: ["Buddhist stupa sites", "Historic temples"],
    tips: ["Hire a guide for the archaeology", "Many sites are on farmland", "Combine with Mawa and Idrakpur"],
    ti: { from: "Dhaka", km: 35, dur: "1 hour", route: "Dhaka → Munshiganj (Bikrampur)", tr: ["Bus", "Private Car", "CNG"], fl: null },
    nearby: ["idrakpur-fort", "mawa-ferry-ghat", "padma-bridge", "sonargaon"]
},

/* ---- Gazipur ---- */
{
    s: "bangabandhu-safari-park-gazipur", n: "Bangabandhu Safari Park", nb: "বঙ্গবন্ধু সাফারি পার্ক", d: "Dhaka", t: "Gazipur", u: "Safipur",
    c: ["Wildlife", "Family", "Forest"], la: 24.06, lo: 90.40,
    sd: "Bangladesh's largest safari park, home to lions, tigers, giraffes and more.",
    de: "Bangabandhu Sheikh Mujib Safari Park at Gazipur is Bangladesh's biggest safari park, where animals roam in large natural enclosures. A guided park bus passes lions, Bengal tigers, giraffes, zebras and bears, while walkways show monkeys, reptiles and native deer.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.4, rv: 640,
    tt: "Families, Kids, Nature lovers", feat: true,
    tags: ["safari park", "wildlife", "animals"],
    act: ["Safari bus tour", "See lions and tigers", "Walk the animal enclosures"],
    att: ["Safari zone", "Tiger and lion enclosures", "Picnic grounds"],
    tips: ["Reach early — queues grow fast", "Follow park bus rules", "Carry water and snacks"],
    ti: { from: "Dhaka", km: 40, dur: "1 – 1.5 hours", route: "Dhaka → Gazipur → Safari Park", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["bhawal-national-park", "nuhash-palli", "bhawal-rajbari-gazipur", "national-botanical-garden"]
},
{
    s: "nuhash-palli", n: "Nuhash Palli", nb: "নুহাশ পল্লী", d: "Dhaka", t: "Gazipur", u: "Gazipur Sadar",
    c: ["Resort Area", "Family", "Cultural"], la: 24.04, lo: 90.40,
    sd: "The famous film village built by Humayun Ahmed near Gazipur.",
    de: "Nuhash Palli is the picturesque film village built by the late writer Humayun Ahmed near Gazipur, the setting for beloved films like 'Srabon Megher Din'. Visitors walk the rustic sets, ponds and gardens that once appeared on screen.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.4, rv: 380,
    tt: "Families, Film lovers, Culture",
    tags: ["film village", "humayun ahmed", "cultural"],
    act: ["Walk the film sets", "Photograph the rustic scenery", "Enjoy the gardens"],
    att: ["Nuhash Palli sets", "Ponds and gardens"],
    tips: ["Check if the site is open to visitors", "Go on weekends with the family", "Combine with safari park"],
    ti: { from: "Dhaka", km: 40, dur: "1 – 1.5 hours", route: "Dhaka → Gazipur → Nuhash Palli", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["bangabandhu-safari-park-gazipur", "bhawal-national-park", "bhawal-rajbari-gazipur"]
},
{
    s: "bhawal-rajbari-gazipur", n: "Bhawal Rajbari", nb: "ভাওয়াল রাজবাড়ী", d: "Dhaka", t: "Gazipur", u: "Gazipur Sadar",
    c: ["Palace", "Historical", "Heritage"], la: 24.00, lo: 90.42,
    sd: "The royal residence of the Bhawal zamindars near Gazipur town.",
    de: "Bhawal Rajbari is the estate of the Bhawal zamindar family near Gazipur. Though partly in ruins, the palace compound, temples and grounds preserve the grandeur of this once-powerful landlord family, with Bhawal National Park just to the north.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.0, rv: 140,
    tt: "History, Architecture, Culture",
    tags: ["rajbari", "palace", "zamindar"],
    act: ["Explore the palace ruins", "Photograph the estate", "Combine with Bhawal park"],
    att: ["Bhawal Rajbari", "Estate temples"],
    tips: ["Ask caretakers before entering rooms", "Best in the morning light", "Combine with Bhawal National Park"],
    ti: { from: "Dhaka", km: 35, dur: "1 hour", route: "Dhaka → Gazipur → Bhawal Rajbari", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["bhawal-national-park", "bangabandhu-safari-park-gazipur", "madhupur-national-park"]
},

/* ---- Manikganj ---- */
{
    s: "teota-zamindar-bari", n: "Teota Zamindar Bari", nb: "তেওতা জমিদার বাড়ি", d: "Dhaka", t: "Manikganj", u: "Harirampur",
    c: ["Palace", "Historical", "Heritage"], la: 23.86, lo: 90.09,
    sd: "A riverside zamindar mansion on the Dhaleshwari near Manikganj.",
    de: "Teota Zamindar Bari is a grand early-20th-century mansion built by the Teota zamindars on the bank of the Dhaleshwari river. The palace, with its domes and colonnades, was partly demolished but its structure still impresses.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.1, rv: 120,
    tt: "History, Architecture, Culture",
    tags: ["zamindar bari", "palace", "dhaleshwari"],
    act: ["Explore the mansion", "See the Dhaleshwari riverbank", "Photograph the architecture"],
    att: ["Teota mansion", "Dhaleshwari river"],
    tips: ["Ask locals for access", "Combine with Baliati Palace", "Carry your own transport"],
    ti: { from: "Dhaka", km: 60, dur: "2 hours", route: "Dhaka → Manikganj → Teota", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["baliati-palace", "bangladesh-national-zoo", "mawa-ferry-ghat"]
},

/* ---- Tangail ---- */
{
    s: "atia-mosque", n: "Atia Mosque", nb: "আতিয়া মসজিদ", d: "Dhaka", t: "Tangail", u: "Delduar",
    c: ["Mosque", "Archaeological", "Historical"], la: 24.16, lo: 89.94,
    sd: "A jewel of Sultanate architecture from 1609 near Tangail.",
    de: "Atia Mosque was built in 1609 during Mughal rule and is considered one of the finest examples of Sultanate–Mughal mosque architecture in Bengal. Its three domes, glazed tiles and terracotta work remain remarkably well preserved.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.5, rv: 260,
    tt: "History, Architecture, Culture",
    tags: ["mosque", "sultanate", "heritage"],
    act: ["Admire the terracotta art", "Photograph the domes", "Explore the village setting"],
    att: ["Atia Mosque", "Terracotta decoration"],
    tips: ["Respect prayer times", "Best light in the afternoon", "Combine with Pakutia Rajbari"],
    ti: { from: "Dhaka", km: 70, dur: "2 hours", route: "Dhaka → Tangail → Atia", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["pakutia-zamindar-bari", "madhupur-national-park", "bangabandhu-bridge"]
},
{
    s: "pakutia-zamindar-bari", n: "Pakutia Zamindar Bari", nb: "পাকুটিয়া জমিদার বাড়ি", d: "Dhaka", t: "Tangail", u: "Delduar",
    c: ["Palace", "Historical", "Heritage"], la: 24.16, lo: 89.95,
    sd: "The stately zamindar mansion at Pakutia, Delduar.",
    de: "Pakutia Zamindar Bari in Delduar, Tangail, was the estate of the Pakutia zamindar family. The large two-storey palace, tanks and gardens are a fine example of the region's landlord-era architecture and a quiet heritage stop.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.1, rv: 120,
    tt: "History, Architecture",
    tags: ["zamindar bari", "palace", "heritage"],
    act: ["Explore the mansion", "Photograph the facade", "Combine with Atia Mosque"],
    att: ["Pakutia mansion", "Estate grounds"],
    tips: ["Best in the morning", "Combine with Atia Mosque", "Ask caretakers for access"],
    ti: { from: "Tangail", km: 15, dur: "30 minutes", route: "Tangail → Delduar → Pakutia", tr: ["CNG", "Private Car"], fl: null },
    nearby: ["atia-mosque", "madhupur-national-park", "bangabandhu-bridge"]
},

/* ---- Kishoreganj ---- */
{
    s: "nikli-haor", n: "Nikli Haor", nb: "নিকলি হাওর", d: "Dhaka", t: "Kishoreganj", u: "Nikli",
    c: ["Haor", "Nature", "Eco Tourism"], la: 24.44, lo: 90.95,
    sd: "A vast wetland of the Haor region, flooded in monsoon and full of birds in winter.",
    de: "Nikli Haor is one of the large wetland basins of the Haor region in Kishoreganj. In the monsoon it becomes an inland sea of water and floating vegetation; in winter it dries to meadows grazed by cattle and visited by migratory birds.",
    b: "November – April", dy: "Half day", df: "Easy", ra: 4.2, rv: 180,
    tt: "Nature, Birdwatchers, Solo",
    tags: ["haor", "wetland", "birds"],
    act: ["Boat on the haor", "Watch migratory birds", "Visit haor villages"],
    att: ["Nikli Haor waters", "Winter grasslands", "Village islands"],
    tips: ["Visit in winter for dry land access", "Hire a local boat", "Carry binoculars for birds"],
    ti: { from: "Kishoreganj", km: 25, dur: "1 hour", route: "Kishoreganj → Nikli", tr: ["Bus", "CNG", "Boat"], fl: null },
    nearby: ["egarosindur", "mithamain", "austagram", "tanguar-haor"]
},
{
    s: "mithamain", n: "Mithamain Haor", nb: "মিঠামইন", d: "Dhaka", t: "Kishoreganj", u: "Mithamain",
    c: ["Haor", "Nature"], la: 24.42, lo: 91.06,
    sd: "A beautiful haor area known for winter duck hunting and boat trips.",
    de: "Mithamain is a haor upazila of Kishoreganj famous for its wetlands and the traditional winter duck hunting that once drew shooters from around the world. Today it is a peaceful place for boating and watching waterbirds.",
    b: "November – April", dy: "Half day", df: "Easy", ra: 4.1, rv: 100,
    tt: "Nature, Birdwatchers",
    tags: ["haor", "duck hunting", "wetland"],
    act: ["Boat trips on the haor", "Bird watching", "Village visits"],
    att: ["Haor waters", "Winter bird flocks"],
    tips: ["Winter is the best season", "Hire a local boat", "Respect local communities"],
    ti: { from: "Kishoreganj", km: 40, dur: "1.5 hours", route: "Kishoreganj → Mithamain", tr: ["Bus", "CNG"], fl: null },
    nearby: ["nikli-haor", "austagram", "egarosindur", "tanguar-haor"]
},
{
    s: "austagram", n: "Austagram Haor", nb: "অষ্টগ্রাম", d: "Dhaka", t: "Kishoreganj", u: "Austagram",
    c: ["Haor", "Nature", "Village"], la: 24.28, lo: 91.12,
    sd: "A quiet haor area of Kishoreganj with floating villages.",
    de: "Austagram is a haor upazila in the far east of Kishoreganj where villages sit on raised mounds surrounded by seasonal water. The area offers an authentic glimpse of Haor-region life and winter bird migration.",
    b: "November – April", dy: "Half day", df: "Easy", ra: 4.0, rv: 80,
    tt: "Nature, Solo, Culture",
    tags: ["haor", "village", "wetland"],
    act: ["Boat around village islands", "Watch birds", "Experience haor life"],
    att: ["Floating villages", "Haor wetlands"],
    tips: ["Best visited with a guide", "Carry supplies", "Winter is easiest for access"],
    ti: { from: "Kishoreganj", km: 45, dur: "1.5 hours", route: "Kishoreganj → Austagram", tr: ["Bus", "CNG"], fl: null },
    nearby: ["mithamain", "nikli-haor", "tanguar-haor", "egarosindur"]
},

/* ---- Faridpur ---- */
{
    s: "faridpur-rajbari", n: "Faridpur Zamindar Palace", nb: "ফরিদপুর জমিদার বাড়ি", d: "Dhaka", t: "Faridpur", u: "Faridpur Sadar",
    c: ["Palace", "Historical", "Heritage"], la: 23.60, lo: 89.84,
    sd: "The historic zamindar estate buildings of old Faridpur town.",
    de: "Faridpur town preserves several zamindar (landlord) palaces and heritage buildings along the Padma region, remnants of the district's prosperous landlord families. Their ornate facades and courtyards offer a window into colonial-era Faridpur.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 3.9, rv: 70,
    tt: "History, Architecture",
    tags: ["zamindar bari", "palace", "heritage"],
    act: ["Explore the heritage buildings", "Photograph the facades", "Visit the district museum"],
    att: ["Zamindar palaces", "Heritage architecture"],
    tips: ["Ask locals for directions", "Best in the morning", "Limited formal tourism — explore independently"],
    ti: { from: "Dhaka", km: 90, dur: "2.5 – 3 hours", route: "Dhaka → Faridpur", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["mawa-ferry-ghat", "padma-bridge", "bikrampur-munshiganj"]
},

/* ---- Madaripur ---- */
{
    s: "arial-khan-river-madaripur", n: "Arial Khan River", nb: "আড়িয়াল খাঁ নদী", d: "Dhaka", t: "Madaripur", u: "Madaripur Sadar",
    c: ["River", "Nature"], la: 23.16, lo: 90.19,
    sd: "The branch of the Padma that flows through Madaripur district.",
    de: "The Arial Khan river branches off the Padma and runs through Madaripur, carrying the district's boats and river life. Its wide, calm stretches are popular for sunset views and short boat rides around the town.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.0, rv: 80,
    tt: "Nature, Solo",
    tags: ["river", "padma branch"],
    act: ["Boat ride on the Arial Khan", "Sunset photography", "Visit river villages"],
    att: ["Arial Khan river", "Madaripur ghats"],
    tips: ["Best in the afternoon light", "Take a local boat", "Limited facilities"],
    ti: { from: "Dhaka", km: 70, dur: "2 hours", route: "Dhaka → Madaripur", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["rajbari-goalanda", "mawa-ferry-ghat", "padma-bridge"]
},

/* ---- Rajbari ---- */
{
    s: "rajbari-goalanda", n: "Goalanda Ghat", nb: "গোয়ালন্দ ঘাট", d: "Dhaka", t: "Rajbari", u: "Goalanda",
    c: ["River", "Historical"], la: 23.74, lo: 89.77,
    sd: "The historic river port where the Padma and Jamuna were joined by rail.",
    de: "Goalanda Ghat in Rajbari was once one of the busiest river ports in South Asia, connecting the Padma steamer route with the Darjeeling railway. The ghat and its heritage infrastructure are a nostalgic window into Bengal's old river transport era.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.1, rv: 110,
    tt: "History, Culture, Solo",
    tags: ["river port", "heritage", "steamer"],
    act: ["See the old ghat", "Watch ferries", "Photograph the river"],
    att: ["Goalanda ghat", "Padma river"],
    tips: ["Best in the morning", "Combine with Padma river views", "Keep belongings safe"],
    ti: { from: "Dhaka", km: 80, dur: "2.5 hours", route: "Dhaka → Faridpur → Goalanda", tr: ["Bus", "Private Car", "Boat"], fl: null },
    nearby: ["padma-bridge", "mawa-ferry-ghat", "faridpur-rajbari"]
},

/* ---- Shariatpur ---- */
{
    s: "zajira-padma", n: "Zajira Padma Riverfront", nb: "জাজিরা", d: "Dhaka", t: "Shariatpur", u: "Zajira",
    c: ["River", "Picnic Spot"], la: 23.46, lo: 90.27,
    sd: "The Padma riverfront town of Zajira, across from Mawa.",
    de: "Zajira is the Shariatpur riverfront town facing Mawa across the Padma. The banks offer wide river views and ferry activity, and the town is close to the southern approach of the Padma Bridge.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 60,
    tt: "Family, Solo",
    tags: ["padma river", "riverfront"],
    act: ["River views", "Watch ferries", "Photograph the bridge"],
    att: ["Zajira riverfront", "Padma river"],
    tips: ["Best at sunset", "Keep belongings close", "Combine with Padma Bridge viewpoints"],
    ti: { from: "Dhaka", km: 50, dur: "1.5 hours", route: "Dhaka → Mawa → Zajira", tr: ["Bus", "Private Car", "Boat"], fl: null },
    nearby: ["padma-bridge", "mawa-ferry-ghat", "bikrampur-munshiganj"]
},

/* ---- Narsingdi ---- */
{
    s: "wari-bateshwar", n: "Wari-Bateshwar", nb: "ওয়ারী-বটেশ্বর", d: "Dhaka", t: "Narsingdi", u: "Palash",
    c: ["Archaeological", "Historical"], la: 24.09, lo: 90.63,
    sd: "One of Bangladesh's oldest archaeological sites, dating to the Iron Age.",
    de: "Wari-Bateshwar near Narsingdi is one of the most important archaeological sites in Bangladesh, revealing an urban settlement with punch-marked coins, stone beads and pottery dating back over 2,000 years. Excavations suggest it was a thriving trade centre.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.2, rv: 140,
    tt: "History, Students, Archaeology",
    tags: ["archaeology", "ancient", "trade"],
    act: ["See the excavation sites", "View artefacts", "Learn ancient Bengal history"],
    att: ["Excavation mounds", "Archaeological museum displays"],
    tips: ["Hire a guide for the archaeology", "Check excavation access", "Combine with Sonargaon"],
    ti: { from: "Dhaka", km: 45, dur: "1.5 hours", route: "Dhaka → Narsingdi → Wari-Bateshwar", tr: ["Bus", "Private Car", "CNG"], fl: null },
    nearby: ["sonargaon", "panam-city", "goaldi-mosque", "bikrampur-munshiganj"]
},

/* ============================ RAJSHAHI DIVISION ============================ */

/* ---- Rajshahi ---- */
{
    s: "puthia-rajbari", n: "Puthia Rajbari", nb: "পুঠিয়া রাজবাড়ী", d: "Rajshahi", t: "Rajshahi", u: "Puthia",
    c: ["Palace", "Historical", "Heritage"], la: 24.36, lo: 88.84,
    sd: "The elegant palace of the Puthia zamindars beside the temple complex.",
    de: "Puthia Rajbari is the ornate early-19th-century palace of the Puthia zamindar family, standing beside the famous Puthia temple complex. Its terracotta-decorated facade and residential quarters were also once an indigo trading house.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.4, rv: 210,
    tt: "History, Architecture",
    tags: ["rajbari", "palace", "terracotta"],
    act: ["Explore the palace", "Photograph the terracotta", "Combine with the temples"],
    att: ["Puthia Rajbari", "Temple complex view"],
    tips: ["Combine with Puthia temple complex", "Best light in the morning", "Ask caretakers for access"],
    ti: { from: "Rajshahi", km: 27, dur: "45 minutes", route: "Rajshahi → Puthia", tr: ["Bus", "Private Car", "CNG"], fl: null },
    nearby: ["puthia-temple-complex", "bagha-mosque", "padma-river-rajshahi", "shah-makhdum-mazar"]
},
{
    s: "padma-river-rajshahi", n: "Padma Riverfront, Rajshahi", nb: "পদ্মা নদী", d: "Rajshahi", t: "Rajshahi", u: "Rajshahi Sadar",
    c: ["River", "Picnic Spot"], la: 24.37, lo: 88.60,
    sd: "Rajshahi's beautiful Padma riverfront, famous for sunset views.",
    de: "Rajshahi town lies along a magnificent bend of the Padma (Ganges) river. The riverfront, near the Rajshahi city centre, is famous for wide sunset views, mango orchards along the banks and the gentle bustle of boats.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.5, rv: 390,
    tt: "Couples, Families, Everyone",
    tags: ["padma river", "sunset", "riverfront"],
    act: ["Watch the Padma sunset", "Boat rides", "Walk the riverbank"],
    att: ["Padma river", "Rajshahi ghats", "Mango orchards"],
    tips: ["Best just before sunset", "Carry a camera", "Combine with Varendra Museum"],
    ti: { from: "Dhaka", km: 250, dur: "5 – 6 hours", route: "Dhaka → Rajshahi", tr: ["Bus", "Train", "Private Car"], fl: null },
    nearby: ["rajshahi", "varendra-museum", "shah-makhdum-mazar", "puthia-temple-complex"]
},
{
    s: "shah-makhdum-mazar", n: "Hazrat Shah Makhdum Mazar", nb: "শাহ মখদুম মাজার", d: "Rajshahi", t: "Rajshahi", u: "Rajshahi Sadar",
    c: ["Shrine", "Religious", "Heritage"], la: 24.37, lo: 88.62,
    sd: "The medieval shrine of the Sufi saint who spread Islam in Rajshahi.",
    de: "The mazar of Hazrat Shah Makhdum (R) is a major Sufi shrine in Rajshahi, dating from the medieval period. Its historic architecture, tomb and mosque draw pilgrims and visitors interested in the religious heritage of north Bengal.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.3, rv: 220,
    tt: "Pilgrims, Culture, History",
    tags: ["shrine", "sufi saint", "medieval"],
    act: ["Visit the shrine", "See the historic mosque", "Learn local history"],
    att: ["Shah Makhdum dargah", "Medieval mosque"],
    tips: ["Dress modestly", "Respect prayer times", "Combine with a city tour"],
    ti: { from: "Rajshahi", km: 3, dur: "15 minutes", route: "Rajshahi city → mazar", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["rajshahi", "padma-river-rajshahi", "varendra-museum", "puthia-temple-complex"]
},

/* ---- Chapainawabganj ---- */
{
    s: "darasbari-mosque", n: "Darasbari Mosque", nb: "দারাসবাড়ি মসজিদ", d: "Rajshahi", t: "Chapainawabganj", u: "Shibganj",
    c: ["Mosque", "Archaeological", "Historical"], la: 24.82, lo: 88.15,
    sd: "A grand Sultanate mosque from 1479 near the ancient capital Gaur.",
    de: "Darasbari Mosque was built in 1479 during the reign of Sultan Shamsuddin Yusuf Shah, at the time the largest mosque in Bengal. Its monumental facade and domes mark it as a masterpiece of the Gaur Sultanate period.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.4, rv: 170,
    tt: "History, Architecture, Culture",
    tags: ["mosque", "sultanate", "gaur"],
    act: ["Admire the Sultanate architecture", "Photograph the monument", "Explore nearby Gaur sites"],
    att: ["Darasbari Mosque", "Sultanate facade"],
    tips: ["Combine with Chhoto Sona Mosque", "Best in the morning light", "Wear modest clothing"],
    ti: { from: "Chapainawabganj", km: 25, dur: "45 minutes", route: "Chapainawabganj → Shibganj → Darasbari", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["chhoto-sona-masjid", "tahkhana-complex", "mahananda-river", "puthia-temple-complex"]
},
{
    s: "tahkhana-complex", n: "Tahkhana Complex", nb: "তাহখানা কমপ্লেক্স", d: "Rajshahi", t: "Chapainawabganj", u: "Shibganj",
    c: ["Historical", "Fort", "Heritage"], la: 24.80, lo: 88.16,
    sd: "The 17th-century Mughal complex at the ancient city of Gaur.",
    de: "The Tahkhana Complex at Shibganj, Chapainawabganj, is a Mughal-era group of buildings including a darbar (audience hall), hammam (bathhouse) and tahkhana (underground cool chamber). It was part of the old city of Gaur.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.2, rv: 130,
    tt: "History, Architecture",
    tags: ["mughal", "gaur", "heritage"],
    act: ["Explore the Mughal buildings", "See the underground chamber", "Photograph the complex"],
    att: ["Darbar hall", "Hammam", "Tahkhana chamber"],
    tips: ["Combine with the mosques of Gaur", "Hire a guide for history", "Best in the morning"],
    ti: { from: "Chapainawabganj", km: 20, dur: "40 minutes", route: "Chapainawabganj → Shibganj → Tahkhana", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["chhoto-sona-masjid", "darasbari-mosque", "mahananda-river"]
},
{
    s: "mahananda-river", n: "Mahananda River", nb: "মহানন্দা নদী", d: "Rajshahi", t: "Chapainawabganj", u: "Shibganj",
    c: ["River", "Nature"], la: 24.70, lo: 88.20,
    sd: "The river of the mango belt, flowing past the old capital Gaur.",
    de: "The Mahananda river flows through the mango-growing belt of Chapainawabganj, past the ruins of the ancient capital Gaur. Its banks are lined with mango orchards and, during the harvest season, colourful roadside markets.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.0, rv: 90,
    tt: "Nature, Culture",
    tags: ["river", "mango", "gaur"],
    act: ["River views", "Mango orchard walks", "Visit roadside markets"],
    att: ["Mahananda river", "Mango orchards"],
    tips: ["Visit in summer for mango season", "Best river light at sunset", "Combine with Gaur sites"],
    ti: { from: "Chapainawabganj", km: 15, dur: "30 minutes", route: "Chapainawabganj → Shibganj", tr: ["Bus", "CNG"], fl: null },
    nearby: ["chhoto-sona-masjid", "darasbari-mosque", "tahkhana-complex"]
},

/* ---- Naogaon ---- */
{
    s: "kusumba-mosque", n: "Kusumba Mosque", nb: "কুসুম্বা মসজিদ", d: "Rajshahi", t: "Naogaon", u: "Manda",
    c: ["Mosque", "Archaeological", "Historical"], la: 24.92, lo: 88.68,
    sd: "A 1558 Sultanate mosque, the 'Black Gem' of the Naogaon countryside.",
    de: "Kusumba Mosque, built in 1558, is a superb Sultanate-era stone mosque in the Naogaon countryside, often called the 'Black Gem' for its dark basalt. Its domes, arches and stone carvings make it one of the finest mosques of the period.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.4, rv: 200,
    tt: "History, Architecture, Culture",
    tags: ["mosque", "sultanate", "stone"],
    act: ["Admire the stone architecture", "Photograph the mosque", "Explore the village setting"],
    att: ["Kusumba Mosque", "Stone carvings"],
    tips: ["Best light in the afternoon", "Respect prayer times", "Combine with Paharpur"],
    ti: { from: "Naogaon", km: 25, dur: "45 minutes", route: "Naogaon → Manda → Kusumba", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["paharpur", "patisar-naogaon", "rajshahi"]
},
{
    s: "patisar-naogaon", n: "Patisar", nb: "পাতিসর", d: "Rajshahi", t: "Naogaon", u: "Atrai",
    c: ["Historical", "Heritage", "River"], la: 24.70, lo: 89.10,
    sd: "The riverside village where Rabindranath Tagore managed the family estate.",
    de: "Patisar, beside the Atrai river in Naogaon, is where Rabindranath Tagore managed his family's zamindari estate and wrote several famous works. The Kishori Mohan temple and riverside views recall Tagore's deep connection to rural Bengal.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.2, rv: 120,
    tt: "History, Culture, Tagore fans",
    tags: ["tagore", "river", "heritage"],
    act: ["Visit the Tagore-related sites", "See the Kishori Mohan temple", "Walk by the Atrai river"],
    att: ["Patisar temple", "Atrai riverbank"],
    tips: ["Combine with Kusumba Mosque", "Ask locals for the Tagore sites", "Best in winter"],
    ti: { from: "Naogaon", km: 35, dur: "1 hour", route: "Naogaon → Atrai → Patisar", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["kusumba-mosque", "paharpur", "mahasthangarh"]
},

/* ---- Bogura ---- */
{
    s: "gokul-medh", n: "Gokul Medh", nb: "গোকুল মেধ", d: "Rajshahi", t: "Bogura", u: "Shibganj",
    c: ["Archaeological", "Historical"], la: 24.96, lo: 89.34,
    sd: "A giant cruciform Buddhist stupa mound at Mahasthangarh.",
    de: "Gokul Medh is one of the largest and most impressive structures of the ancient Mahasthangarh complex, a towering cruciform Buddhist stupa. Excavations have revealed its terraced brick form rising over the surrounding farmland.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.4, rv: 180,
    tt: "History, Archaeology, Culture",
    tags: ["stupa", "mahasthangarh", "archaeology"],
    act: ["Climb around the stupa", "Photograph the terraces", "Combine with the Mahasthangarh circuit"],
    att: ["Gokul Medh stupa", "Mahasthangarh surroundings"],
    tips: ["Combine with other Mahasthangarh sites", "Wear comfortable shoes", "Hire a guide for history"],
    ti: { from: "Bogura", km: 13, dur: "30 minutes", route: "Bogura → Mahasthangarh → Gokul Medh", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["mahasthangarh", "behula-lakshindar-basor-ghor", "vasu-bihar", "bogura-heritage-park"]
},
{
    s: "behula-lakshindar-basor-ghor", n: "Behula Lakshindar Basor Ghor", nb: "বেহুলা-লক্ষীন্দরের বাসর ঘর", d: "Rajshahi", t: "Bogura", u: "Shibganj",
    c: ["Archaeological", "Historical", "Cultural"], la: 24.96, lo: 89.35,
    sd: "Ruins tied to the folk legend of Behula and Lakshindar at Mahasthangarh.",
    de: "Behula Lakshindar Basor Ghor is the name given to a ruined structure at Mahasthangarh, traditionally linked to the famous Bengali folk legend of Behula and Lakshindar. Local lore tells of the bridal chamber of the lovers in this ancient settlement.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.2, rv: 120,
    tt: "History, Culture, Folklore",
    tags: ["folklore", "mahasthangarh", "ruins"],
    act: ["See the legendary ruins", "Photograph the site", "Hear the local legend"],
    att: ["Behula-Lakshindar ruins", "Mahasthangarh circuit"],
    tips: ["Combine with Gokul Medh", "Ask guides for the legend", "Best in the morning"],
    ti: { from: "Bogura", km: 13, dur: "30 minutes", route: "Bogura → Mahasthangarh", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["mahasthangarh", "gokul-medh", "vasu-bihar", "bogura-heritage-park"]
},
{
    s: "vasu-bihar", n: "Vasu Bihar", nb: "বসু বিহার", d: "Rajshahi", t: "Bogura", u: "Shibganj",
    c: ["Archaeological", "Historical", "Religious"], la: 24.92, lo: 89.34,
    sd: "An ancient Buddhist monastery south of Mahasthangarh.",
    de: "Vasu Bihar is a Buddhist monastery and temple complex dating from the Gupta and Pala periods, located just south of Mahasthangarh. Excavations have revealed shrines, stupas and a well, echoing the region's rich Buddhist heritage.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.2, rv: 130,
    tt: "History, Archaeology",
    tags: ["buddhist", "monastery", "archaeology"],
    act: ["Explore the excavated ruins", "Photograph the site", "Learn Buddhist history"],
    att: ["Vasu Bihar ruins", "Stupas and shrines"],
    tips: ["Combine with Mahasthangarh", "Wear comfortable shoes", "Best in the morning"],
    ti: { from: "Bogura", km: 14, dur: "30 minutes", route: "Bogura → Mahasthangarh → Vasu Bihar", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["mahasthangarh", "gokul-medh", "behula-lakshindar-basor-ghor", "bogura-heritage-park"]
},
{
    s: "bogura-heritage-park", n: "Mahasthangarh Heritage Park", nb: "মহাস্থানগড় হেরিটেজ পার্ক", d: "Rajshahi", t: "Bogura", u: "Shibganj",
    c: ["Museum", "Archaeological", "Family"], la: 24.96, lo: 89.34,
    sd: "A landscaped museum park beside the ancient city of Mahasthangarh.",
    de: "Mahasthangarh Heritage Park is a landscaped complex near the ancient citadel with a museum of excavated artefacts, model ancient houses and walkways. It presents the 2,500-year history of the oldest known city in Bangladesh.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.3, rv: 160,
    tt: "Families, Students, History lovers",
    tags: ["museum", "heritage park", "mahasthangarh"],
    act: ["Tour the museum", "Walk the park", "See model ancient dwellings"],
    att: ["Heritage museum", "Model dwellings", "Ancient city view"],
    tips: ["Combine with the main Mahasthangarh citadel", "Good for families", "Best in winter"],
    ti: { from: "Bogura", km: 12, dur: "30 minutes", route: "Bogura → Mahasthangarh", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["mahasthangarh", "gokul-medh", "vasu-bihar"]
},

/* ---- Joypurhat ---- */
{
    s: "joypurhat-panchbibi", n: "Panchbibi (Joypurhat)", nb: "পাঁচবিবি", d: "Rajshahi", t: "Joypurhat", u: "Panchbibi",
    c: ["Historical", "Village"], la: 25.02, lo: 89.01,
    sd: "The town near Paharpur, with colonial-era heritage buildings.",
    de: "Panchbibi is a historic town in Joypurhat district, close to the Paharpur World Heritage site across the border in Naogaon. The area retains colonial-era buildings and is a common overnight stop for visitors to the great monastery.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 70,
    tt: "History, Culture",
    tags: ["town", "heritage", "gateway"],
    act: ["Explore the old town", "See heritage buildings", "Combine with Paharpur"],
    att: ["Colonial-era buildings", "Paharpur approach"],
    tips: ["Best as a stop en route to Paharpur", "Limited facilities", "Ask locals for history"],
    ti: { from: "Joypurhat", km: 25, dur: "45 minutes", route: "Joypurhat → Panchbibi", tr: ["Bus", "CNG"], fl: null },
    nearby: ["paharpur", "mahasthangarh", "kusumba-mosque"]
},

/* ---- Pabna ---- */
{
    s: "hardinge-bridge", n: "Hardinge Bridge", nb: "হার্ডিঞ্জ ব্রিজ", d: "Rajshahi", t: "Pabna", u: "Ishwardi",
    c: ["Historical", "River", "Heritage"], la: 24.07, lo: 89.03,
    sd: "A historic 1915 railway bridge across the Padma at Paksey.",
    de: "Hardinge Bridge, opened in 1915, is a historic railway bridge carrying trains across the Padma (Ganges) at Paksey, Ishwardi. Its massive steel spans and river setting make it a notable engineering heritage site.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.3, rv: 160,
    tt: "History, Train lovers, Families",
    tags: ["railway bridge", "padma", "heritage"],
    act: ["See trains cross the bridge", "Photograph the steel spans", "Visit the riverbank"],
    att: ["Hardinge Bridge", "Padma river at Paksey"],
    tips: ["Check train timings for photo moments", "Keep a safe distance", "Combine with Rooppur viewpoints"],
    ti: { from: "Pabna", km: 35, dur: "1 hour", route: "Pabna → Ishwardi → Paksey", tr: ["Bus", "Train", "Private Car"], fl: null },
    nearby: ["padma-river-rajshahi", "puthia-temple-complex", "uttara-gano-bhaban"]
},

/* ---- Sirajganj ---- */
{
    s: "shahjadpur-kuthibari", n: "Shahjadpur Kuthibari", nb: "শাহজাদপুর কুঠিবাড়ি", d: "Rajshahi", t: "Sirajganj", u: "Shahjadpur",
    c: ["Historical", "Heritage", "Cultural"], la: 24.16, lo: 89.61,
    sd: "The Tagore family residence on the banks of the Karatoya.",
    de: "Shahjadpur Kuthibari is the house where Rabindranath Tagore stayed while managing the family zamindari estate in Sirajganj. The beautifully restored riverside building is now a museum of Tagore's life and work in Bengal.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.4, rv: 180,
    tt: "History, Tagore fans, Culture",
    tags: ["tagore", "kuthibari", "museum"],
    act: ["Tour the museum", "Walk the gardens", "See the Karatoya river"],
    att: ["Shahjadpur Kuthibari", "Tagore memorabilia", "Riverside setting"],
    tips: ["Check museum hours", "Combine with Bangabandhu Bridge", "Best in winter"],
    ti: { from: "Sirajganj", km: 30, dur: "1 hour", route: "Sirajganj → Shahjadpur", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["bangabandhu-bridge", "madhupur-national-park", "patisar-naogaon"]
},

/* ============================ KHULNA DIVISION ============================ */

/* ---- Khulna ---- */
{
    s: "rupsha-river", n: "Rupsha River", nb: "রূপসা নদী", d: "Khulna", t: "Khulna", u: "Khulna Sadar",
    c: ["River", "Nature"], la: 22.85, lo: 89.55,
    sd: "The river that links Khulna city to the Sundarbans and the Bay of Bengal.",
    de: "The Rupsha river flows past Khulna city, forming the main water route into the Sundarbans. Its wide channel, bridges and boat traffic make it a lively setting, especially at sunset when wooden launches head out toward the mangrove forest.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.2, rv: 180,
    tt: "Nature, Everyone",
    tags: ["river", "sundarbans gateway"],
    act: ["See the Rupsha bridges", "Watch launches and boats", "Sunset photography"],
    att: ["Rupsha river", "Khulna riverfront"],
    tips: ["Best at sunset", "Combine with a Sundarbans trip", "Keep belongings safe at ghats"],
    ti: { from: "Khulna", km: 0, dur: "On-site", route: "River runs through Khulna city", tr: ["Boat", "Launch", "CNG"], fl: null },
    nearby: ["sundarbans", "bagerhat", "shatgambuj-mosque", "rupsha-river"]
},
{
    s: "batiaghata", n: "Batiaghata", nb: "বটিয়াঘাটা", d: "Khulna", t: "Khulna", u: "Batiaghata",
    c: ["Village", "River", "Eco Tourism"], la: 22.73, lo: 89.52,
    sd: "A riverside upazila of Khulna, gateway to the Sundarbans by boat.",
    de: "Batiaghata is a riverine upazila of Khulna district along the Pasur and other tidal rivers leading into the Sundarbans. Villages, river channels and mangrove-lined waterways make it a starting point for exploring the delta.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 60,
    tt: "Nature, Solo",
    tags: ["river", "delta", "sundarbans gateway"],
    act: ["Boat along the tidal rivers", "Visit river villages", "Bird watching"],
    att: ["Tidal rivers", "Mangrove banks"],
    tips: ["Best by boat", "Ask locals to arrange trips", "Carry supplies"],
    ti: { from: "Khulna", km: 20, dur: "45 minutes", route: "Khulna → Batiaghata", tr: ["Bus", "CNG", "Boat"], fl: null },
    nearby: ["sundarbans", "rupsha-river", "bagerhat"]
},

/* ---- Bagerhat ---- */
{
    s: "shatgambuj-mosque", n: "Sixty Dome Mosque (Shat Gambuj)", nb: "ষাট গম্বুজ মসজিদ", d: "Khulna", t: "Bagerhat", u: "Bagerhat Sadar",
    c: ["Mosque", "Archaeological", "Heritage"], la: 22.67, lo: 89.74,
    sd: "The majestic 15th-century mosque at the heart of the UNESCO city of Bagerhat.",
    de: "The Sixty Dome Mosque, built by Khan Jahan Ali in the 15th century, is the largest mosque in Bangladesh and the centrepiece of the UNESCO World Heritage 'Historic Mosque City of Bagerhat'. Its 77 domes and massive pillars are a masterpiece of Bengali–Tughlaq architecture.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.8, rv: 900,
    tt: "History, Architecture, Culture", feat: true,
    tags: ["mosque", "unesco", "khan jahan ali", "heritage"],
    act: ["Walk through the great mosque", "Photograph the domes", "Combine with the tomb complex"],
    att: ["Sixty Dome Mosque", "Khan Jahan Ali tomb", "Historic mosque city"],
    tips: ["Go early to avoid crowds", "Wear modest clothing", "Hire a guide for history"],
    ti: { from: "Khulna", km: 30, dur: "1 hour", route: "Khulna → Bagerhat", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["bagerhat", "nine-dome-mosque", "khan-jahan-ali-mazar", "singair-mosque"]
},
{
    s: "khan-jahan-ali-mazar", n: "Khan Jahan Ali's Tomb", nb: "খান জাহান আলীর মাজার", d: "Khulna", t: "Bagerhat", u: "Bagerhat Sadar",
    c: ["Shrine", "Religious", "Heritage"], la: 22.67, lo: 89.74,
    sd: "The resting place of the great saint and builder of Bagerhat.",
    de: "The tomb of Khan Jahan Ali (d. 1459), the warrior-saint who founded Bagerhat, lies beside a large tank near the Sixty Dome Mosque. The simple stone tomb on a raised platform is a deeply revered pilgrimage site.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.6, rv: 520,
    tt: "Pilgrims, History, Culture",
    tags: ["shrine", "sufi saint", "bagerhat"],
    act: ["Visit the tomb", "See the great tank (Dighi)", "Pray at the shrine"],
    att: ["Khan Jahan Ali tomb", "Sacred tank"],
    tips: ["Dress modestly", "Remove shoes at the tomb", "Combine with Sixty Dome Mosque"],
    ti: { from: "Khulna", km: 30, dur: "1 hour", route: "Khulna → Bagerhat", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["shatgambuj-mosque", "bagerhat", "nine-dome-mosque", "singair-mosque"]
},
{
    s: "nine-dome-mosque", n: "Nine Dome Mosque", nb: "নয় গম্বুজ মসজিদ", d: "Khulna", t: "Bagerhat", u: "Bagerhat Sadar",
    c: ["Mosque", "Archaeological", "Historical"], la: 22.66, lo: 89.77,
    sd: "An elegant nine-domed mosque of the Bagerhat mosque city.",
    de: "The Nine Dome Mosque is one of the smaller but most elegant monuments of the Bagerhat mosque city, built in the same 15th-century Sultanate style as the Sixty Dome Mosque. Its graceful arches and domes are a photogenic addition to the heritage circuit.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.3, rv: 180,
    tt: "History, Architecture",
    tags: ["mosque", "bagerhat", "heritage"],
    act: ["Photograph the mosque", "See the Sultanate style", "Combine with the heritage circuit"],
    att: ["Nine Dome Mosque", "Sultanate arches"],
    tips: ["Combine with Sixty Dome Mosque", "Best light in the afternoon", "Respect prayer times"],
    ti: { from: "Khulna", km: 32, dur: "1 hour", route: "Khulna → Bagerhat → Nine Dome", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["shatgambuj-mosque", "bagerhat", "khan-jahan-ali-mazar", "singair-mosque"]
},
{
    s: "singair-mosque", n: "Singair Mosque", nb: "সিঙ্গাইর মসজিদ", d: "Khulna", t: "Bagerhat", u: "Bagerhat Sadar",
    c: ["Mosque", "Archaeological", "Historical"], la: 22.67, lo: 89.76,
    sd: "A restored single-domed mosque of the Bagerhat mosque city.",
    de: "Singair Mosque is one of the monuments of the historic mosque city of Bagerhat, a compact single-domed structure built in the Sultanate style of Khan Jahan Ali's era. It sits within the UNESCO heritage zone, easy to visit with the other mosques.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.1, rv: 110,
    tt: "History, Architecture",
    tags: ["mosque", "bagerhat", "heritage"],
    act: ["See the restored mosque", "Photograph the structure", "Explore the heritage zone"],
    att: ["Singair Mosque", "Mosque city surroundings"],
    tips: ["Combine with the heritage circuit", "Best in the morning", "Respect prayer times"],
    ti: { from: "Khulna", km: 31, dur: "1 hour", route: "Khulna → Bagerhat", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["shatgambuj-mosque", "bagerhat", "nine-dome-mosque", "khan-jahan-ali-mazar"]
},

/* ---- Satkhira ---- */
{
    s: "kaliganj-satkhira", n: "Kaliganj Sundarbans", nb: "কালীগঞ্জ", d: "Khulna", t: "Satkhira", u: "Kaliganj",
    c: ["Forest", "Eco Tourism", "Wildlife"], la: 22.45, lo: 89.05,
    sd: "A gateway to the western Sundarbans from Satkhira district.",
    de: "Kaliganj is a western gateway to the Sundarbans from Satkhira, giving access to the reserve forest's riverine interior. Boat trips from here pass canals, mudflats and wildlife toward the mangroves of the Sundarbans West zone.",
    b: "November – February", dy: "1 – 2 days", df: "Moderate", ra: 4.3, rv: 150,
    tt: "Nature, Adventure",
    tags: ["sundarbans", "mangrove", "boat"],
    act: ["Boat trips into the mangroves", "Watch wildlife", "Explore the rivers"],
    att: ["Sundarbans West", "Mangrove rivers"],
    tips: ["Permits are needed inside the reserve", "Arrange a boat and guide", "Carry supplies"],
    ti: { from: "Satkhira", km: 40, dur: "1.5 hours", route: "Satkhira → Kaliganj", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["sundarbans", "burigoalini", "munshiganj-eco-tourism", "rupsha-river"]
},
{
    s: "burigoalini", n: "Burigoalini", nb: "বুড়িগোয়ালিনী", d: "Khulna", t: "Satkhira", u: "Shyamnagar",
    c: ["Forest", "Eco Tourism"], la: 22.29, lo: 89.19,
    sd: "A village launch point on the edge of the western Sundarbans.",
    de: "Burigoalini, in Shyamnagar upazila of Satkhira, is a riverside village on the edge of the Sundarbans West. It is a quieter alternative gateway for exploring the mangroves, with boat trips passing through forest-fringed channels.",
    b: "November – February", dy: "1 – 2 days", df: "Moderate", ra: 4.1, rv: 90,
    tt: "Nature, Adventure, Solo",
    tags: ["sundarbans", "mangrove", "village"],
    act: ["Boat through mangrove channels", "Watch birds", "Experience village life"],
    att: ["Mangrove channels", "Riverside villages"],
    tips: ["Arrange boats with locals", "Carry permits for the reserve", "Limited facilities"],
    ti: { from: "Satkhira", km: 55, dur: "2 hours", route: "Satkhira → Shyamnagar → Burigoalini", tr: ["Bus", "CNG", "Boat"], fl: null },
    nearby: ["sundarbans", "kaliganj-satkhira", "munshiganj-eco-tourism"]
},
{
    s: "munshiganj-eco-tourism", n: "Munshiganj Eco Tourism Area", nb: "মুন্সীগঞ্জ ইকো-ট্যুরিজম", d: "Khulna", t: "Satkhira", u: "Shyamnagar",
    c: ["Eco Tourism", "Forest", "Village"], la: 22.32, lo: 89.26,
    sd: "A community eco-tourism village beside the Sundarbans West.",
    de: "Munshiganj in Shyamnagar is an eco-tourism village developed by the community on the edge of the Sundarbans West. Visitors enjoy mangroves, crab farming villages, cycling and village homestays in a low-impact setting.",
    b: "November – February", dy: "1 – 2 days", df: "Easy to Moderate", ra: 4.2, rv: 110,
    tt: "Nature, Family, Eco travellers",
    tags: ["eco tourism", "community", "sundarbans"],
    act: ["Mangrove walks", "Village homestays", "Cycle the countryside"],
    att: ["Mangrove edge", "Community village", "Crab farms"],
    tips: ["Support local homestays", "Book through community groups", "Best in winter"],
    ti: { from: "Satkhira", km: 60, dur: "2 – 2.5 hours", route: "Satkhira → Shyamnagar → Munshiganj", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["burigoalini", "kaliganj-satkhira", "sundarbans"]
},

/* ---- Jashore ---- */
{
    s: "mothbari-neelkuthi", n: "Mothbari Neelkuthi", nb: "মঠবাড়ি নীলকুঠি", d: "Khulna", t: "Jashore", u: "Jashore Sadar",
    c: ["Historical", "Heritage"], la: 23.16, lo: 89.21,
    sd: "The last surviving indigo kuthi (estate house) of Jashore.",
    de: "Mothbari Neelkuthi is one of the last surviving indigo plantation houses (kuthi) of British-era Jashore, where indigo was processed for export. Its sturdy brick structure stands as a rare monument to the region's colonial indigo economy.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.0, rv: 90,
    tt: "History, Architecture",
    tags: ["indigo", "colonial", "heritage"],
    act: ["Explore the old kuthi", "Photograph the building", "Learn indigo history"],
    att: ["Mothbari Neelkuthi", "Colonial architecture"],
    tips: ["Ask locals for access", "Best in the morning", "Combine with a Jashore city tour"],
    ti: { from: "Jashore", km: 5, dur: "15 minutes", route: "Jashore town → Mothbari", tr: ["CNG", "Private Car"], fl: null },
    nearby: ["khan-jahan-ali-mazar", "shatgambuj-mosque", "mujibnagar", "rupsha-river"]
},

/* ---- Jhenaidah ---- */
{
    s: "naldanga-zamindar-bari", n: "Naldanga Zamindar Bari", nb: "নলডাঙ্গা জমিদার বাড়ি", d: "Khulna", t: "Jhenaidah", u: "Kaliganj",
    c: ["Palace", "Historical", "Heritage"], la: 23.70, lo: 89.08,
    sd: "A palace of the Naldanga zamindars in Jhenaidah.",
    de: "Naldanga Zamindar Bari is a 19th-century palace complex of the Naldanga zamindar family in Jhenaidah district. The large two-storey mansion, temples and grounds reflect the prosperity of the region's landlord era.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.0, rv: 80,
    tt: "History, Architecture",
    tags: ["zamindar bari", "palace", "heritage"],
    act: ["Explore the palace", "Photograph the architecture", "See the estate temples"],
    att: ["Naldanga mansion", "Estate temples"],
    tips: ["Ask caretakers for access", "Best in the morning", "Combine with a Jhenaidah tour"],
    ti: { from: "Jhenaidah", km: 15, dur: "30 minutes", route: "Jhenaidah → Kaliganj → Naldanga", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["mothbari-neelkuthi", "shilaidaha-kuthibari", "lalon-shah-shrine"]
},

/* ---- Magura ---- */
{
    s: "magura-nabaganga", n: "Nabaganga River (Magura)", nb: "নবগঙ্গা নদী", d: "Khulna", t: "Magura", u: "Magura Sadar",
    c: ["River", "Nature"], la: 23.49, lo: 89.42,
    sd: "The river that flows through the heart of Magura district.",
    de: "The Nabaganga river runs through Magura district, carrying the region's boat traffic and shaping its low, green landscape. Its quiet banks are a place for leisurely walks and sunset views away from tourist routes.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.8, rv: 50,
    tt: "Nature, Solo",
    tags: ["river", "nabaganga"],
    act: ["Walk the riverbank", "Boat rides", "Sunset photography"],
    att: ["Nabaganga river", "Magura countryside"],
    tips: ["Limited tourism — explore independently", "Best in the afternoon", "Ask locals for boat trips"],
    ti: { from: "Jashore", km: 40, dur: "1 hour", route: "Jashore → Magura", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["naldanga-zamindar-bari", "shilaidaha-kuthibari", "mujibnagar"]
},

/* ---- Narail ---- */
{
    s: "narail-chitra-river", n: "Chitra River (Narail)", nb: "চিত্রা নদী", d: "Khulna", t: "Narail", u: "Narail Sadar",
    c: ["River", "Nature"], la: 23.17, lo: 89.50,
    sd: "The birthplace-region river of the three martyrs, flowing through Narail.",
    de: "The Chitra river flows through Narail, the birthplace district of the Liberation War martyrs Binoy, Badal and Dinesh. Its quiet riverbanks and green countryside honour the region's deep connection to Bangladesh's history.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.8, rv: 50,
    tt: "Nature, History, Solo",
    tags: ["river", "history"],
    act: ["Walk the riverbank", "Visit the martyrs' memorials", "Enjoy the countryside"],
    att: ["Chitra river", "Narail heritage sites"],
    tips: ["Ask locally for directions", "Limited facilities", "Best in winter"],
    ti: { from: "Khulna", km: 55, dur: "1.5 hours", route: "Khulna → Narail", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["magura-nabaganga", "mothbari-neelkuthi", "shilaidaha-kuthibari"]
},

/* ---- Chuadanga ---- */
{
    s: "chuadanga-heritage", n: "Chuadanga Heritage", nb: "চুয়াডাঙ্গা", d: "Khulna", t: "Chuadanga", u: "Chuadanga Sadar",
    c: ["Historical", "Village"], la: 23.64, lo: 88.86,
    sd: "The historic border district known for its Durga Puja pandals and rivers.",
    de: "Chuadanga is a historic border district of Khulna division known for grand Durga Puja celebrations and its position on the Matabhanga river. Its heritage buildings and riverbanks offer a calm, authentic slice of rural Bangladesh.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.7, rv: 40,
    tt: "Culture, Solo",
    tags: ["border district", "river", "culture"],
    act: ["See the riverside", "Explore heritage buildings", "Visit during Puja season"],
    att: ["Matabhanga river", "Heritage town"],
    tips: ["Limited formal tourism", "Best during Durga Puja", "Ask locals for directions"],
    ti: { from: "Jashore", km: 55, dur: "1.5 hours", route: "Jashore → Chuadanga", tr: ["Bus", "Private Car"], fl: null },
    nearby: ["mujibnagar", "mothbari-neelkuthi", "naldanga-zamindar-bari"]
},

/* ============================ BARISHAL DIVISION ============================ */

/* ---- Barishal ---- */
{
    s: "oxford-mission-church", n: "Oxford Mission Church", nb: "অক্সফোর্ড মিশন চার্চ", d: "Barishal", t: "Barishal", u: "Barishal Sadar",
    c: ["Heritage", "Religious", "Historical"], la: 22.70, lo: 90.37,
    sd: "A striking 19th-century Anglican church in Barishal town.",
    de: "Oxford Mission Church of the Epiphany was built in 1903 by the Oxford Mission in Barishal. Its brick exterior, tall tower and serene grounds make it one of the most striking colonial-era churches in Bangladesh.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.3, rv: 170,
    tt: "History, Architecture, Culture",
    tags: ["church", "colonial", "heritage"],
    act: ["See the church architecture", "Photograph the tower", "Walk the grounds"],
    att: ["Oxford Mission Church", "Colonial architecture"],
    tips: ["Respect worship times", "Combine with a Barishal city tour", "Best in the morning"],
    ti: { from: "Barishal", km: 2, dur: "10 minutes", route: "Barishal town → Oxford Mission", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["durga-sagar", "guthia-mosque", "floating-guava-market", "barishal-bell-park"]
},
{
    s: "barishal-bell-park", n: "Bell's Park", nb: "বেলস পার্ক", d: "Barishal", t: "Barishal", u: "Barishal Sadar",
    c: ["City", "Picnic Spot"], la: 22.70, lo: 90.37,
    sd: "Barishal's green urban park by the Kirtankhola river.",
    de: "Bell's Park is one of Barishal's oldest public parks, set beside the Kirtankhola river. Shaded paths, lawns and river views make it a pleasant spot for an evening walk or picnic in the heart of the city.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.1, rv: 140,
    tt: "Families, Couples, Everyone",
    tags: ["park", "river", "city"],
    act: ["Walk the shaded paths", "Enjoy the river view", "Picnic on the lawns"],
    att: ["Bell's Park", "Kirtankhola river"],
    tips: ["Best in the late afternoon", "Entry is low-cost", "Combine with the floating guava market"],
    ti: { from: "Barishal", km: 1, dur: "5 minutes", route: "Barishal town → Bell's Park", tr: ["Rickshaw", "Walk"], fl: null },
    nearby: ["oxford-mission-church", "durga-sagar", "floating-guava-market", "guthia-mosque"]
},
{
    s: "floating-guava-market", n: "Floating Guava Market", nb: "ভাসমান পেয়ারা বাজার", d: "Barishal", t: "Jhalokathi", u: "Nalchity",
    c: ["Cultural", "River", "Village"], la: 22.68, lo: 90.25,
    sd: "Guavas traded from boats on the Kirtankhola river.",
    de: "The floating guava market is a unique riverine bazaar where farmers bring baskets of guavas by boat and sell them directly to traders on the water. It is a beloved cultural experience, most vibrant between July and November.",
    b: "July – November", dy: "Half day", df: "Easy", ra: 4.4, rv: 260,
    tt: "Culture, Families, Photographers",
    tags: ["floating market", "guava", "river"],
    act: ["Watch the floating trade", "Buy fresh guavas", "Photograph the boats"],
    att: ["Floating guava bazaar", "Kirtankhola river"],
    tips: ["Best in the guava season", "Go early morning", "Ask permission before photographing people"],
    ti: { from: "Barishal", km: 30, dur: "1 hour", route: "Barishal → Nalchity → river market", tr: ["Bus", "Boat"], fl: null },
    nearby: ["barishal-bell-park", "durga-sagar", "guthia-mosque", "sugandha-river"]
},

/* ---- Bhola ---- */
{
    s: "monpura", n: "Monpura Island", nb: "মনপুরা দ্বীপ", d: "Barishal", t: "Bhola", u: "Monpura",
    c: ["Island", "Village", "River"], la: 22.28, lo: 90.89,
    sd: "A remote river island of Bhola made famous by the film 'Monpura'.",
    de: "Monpura is a remote island in the Meghna estuary of Bhola district, made famous by the classic film 'Monpura'. Life here revolves around the river — boats, fishing and low green fields — offering a genuinely off-grid slice of delta Bangladesh.",
    b: "October – March", dy: "1 – 2 days", df: "Moderate", ra: 4.1, rv: 120,
    tt: "Solo, Culture, Adventure",
    tags: ["island", "meghna", "film"],
    act: ["Boat trips around the island", "Visit fishing villages", "Experience island life"],
    att: ["Monpura village", "Meghna estuary"],
    tips: ["Reach by launch from Bhola", "Very basic facilities", "Carry supplies and cash"],
    ti: { from: "Bhola", km: 40, dur: "2 hours by launch", route: "Bhola → Monpura by boat", tr: ["Launch", "Boat"], fl: null },
    nearby: ["char-kukri-mukri", "dhal-char-bhola", "ramgati-lakshmipur", "hatiya-island"]
},
{
    s: "dhal-char-bhola", n: "Dhal Char", nb: "ঢাল চর", d: "Barishal", t: "Bhola", u: "Dhal Char",
    c: ["Island", "River", "Picnic Spot"], la: 22.22, lo: 90.78,
    sd: "A developing island of Bhola with open river beaches.",
    de: "Dhal Char is one of the newer islands of Bhola district, rising from the Meghna estuary. Its open river beaches, wide skies and fishing villages make it a growing destination for those seeking a genuinely remote island experience.",
    b: "October – March", dy: "1 day", df: "Moderate", ra: 3.9, rv: 70,
    tt: "Adventure, Solo, Nature",
    tags: ["island", "river beach", "remote"],
    act: ["Walk the river beaches", "Boat rides", "Village visits"],
    att: ["River beaches", "Estuary views"],
    tips: ["Reach by local boat", "Very basic facilities", "Check boat schedules"],
    ti: { from: "Bhola", km: 30, dur: "1.5 hours by boat", route: "Bhola → Dhal Char by boat", tr: ["Launch", "Boat"], fl: null },
    nearby: ["monpura", "char-kukri-mukri", "ramgati-lakshmipur"]
},

/* ---- Barguna ---- */
{
    s: "taltali-barguna", n: "Taltali", nb: "তালতলী", d: "Barishal", t: "Barguna", u: "Taltali",
    c: ["Coastal", "River", "Village"], la: 22.06, lo: 90.12,
    sd: "A coastal upazila of Barguna along the Payra river.",
    de: "Taltali is a coastal upazila of Barguna district where the Payra river meets the seaward channels of the delta. Its riverside villages, boats and open skies capture the quiet rhythm of Bangladesh's southern coast.",
    b: "October – March", dy: "1 day", df: "Easy to Moderate", ra: 3.9, rv: 60,
    tt: "Nature, Solo",
    tags: ["coastal", "river", "payra"],
    act: ["River views", "Village walks", "Watch fishing boats"],
    att: ["Payra river", "Coastal villages"],
    tips: ["Reach by road from Barguna", "Limited facilities", "Best in winter"],
    ti: { from: "Barguna", km: 40, dur: "1.5 hours", route: "Barguna → Taltali", tr: ["Bus", "CNG"], fl: null },
    nearby: ["fatrar-char", "kuakata", "payra-river-barguna"]
},
{
    s: "payra-river-barguna", n: "Payra River", nb: "পায়রা নদী", d: "Barishal", t: "Barguna", u: "Barguna Sadar",
    c: ["River", "Nature"], la: 22.18, lo: 90.13,
    sd: "The river flowing through Barguna toward the Bay of Bengal.",
    de: "The Payra river runs through Barguna district before reaching the sea, its wide waters busy with fishing boats and coastal launches. The riverside offers peaceful views and a glimpse of delta life on Bangladesh's southern coast.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 60,
    tt: "Nature, Solo",
    tags: ["river", "coastal"],
    act: ["Boat rides", "Riverbank walks", "Sunset photography"],
    att: ["Payra river", "Barguna ghats"],
    tips: ["Best in the afternoon", "Ask locals for boat trips", "Limited facilities"],
    ti: { from: "Barguna", km: 2, dur: "10 minutes", route: "Barguna town → river", tr: ["Rickshaw", "Walk", "Boat"], fl: null },
    nearby: ["taltali-barguna", "fatrar-char", "kuakata"]
},
{
    s: "fatrar-char", n: "Fatrar Char", nb: "ফাতরার চর", d: "Barishal", t: "Patuakhali", u: "Kalapara",
    c: ["Island", "Beach", "Coastal"], la: 21.85, lo: 90.05,
    sd: "A wild sandbank and beach near Kuakata with sea views.",
    de: "Fatrar Char is a sandbar island off the coast near Kuakata in Patuakhali, reached by boat across the Bay of Bengal's inshore waters. Its empty beaches, dunes and fishing boats offer a raw, wild coastal experience.",
    b: "October – March", dy: "1 day", df: "Moderate", ra: 4.2, rv: 110,
    tt: "Adventure, Nature, Solo",
    tags: ["char", "beach", "bay of bengal"],
    act: ["Boat trip to the char", "Walk the wild beaches", "Watch fishing boats"],
    att: ["Fatrar Char beach", "Sea views"],
    tips: ["Arrange boats from Kuakata", "Check tides", "Carry supplies"],
    ti: { from: "Kuakata", km: 15, dur: "1 hour by boat", route: "Kuakata → Fatrar Char by boat", tr: ["Boat"], fl: null },
    nearby: ["kuakata", "rangabali-island", "taltali-barguna"]
},

/* ---- Pirojpur ---- */
{
    s: "swarupkathi", n: "Swarupkathi", nb: "স্বরূপকাঠি", d: "Barishal", t: "Pirojpur", u: "Swarupkathi",
    c: ["River", "Village", "Cultural"], la: 22.74, lo: 90.25,
    sd: "A river town of Pirojpur known for guava orchards and waterways.",
    de: "Swarupkathi is a riverine town in Pirojpur district surrounded by guava orchards and canals. It is one of the centres of the region's famous floating guava trade and a calm base for exploring delta rivers.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.0, rv: 90,
    tt: "Culture, Nature",
    tags: ["river", "guava", "town"],
    act: ["Visit guava orchards", "Boat on the canals", "Explore the town"],
    att: ["Guava orchards", "River canals"],
    tips: ["Best in the guava season", "Ask locals for boat trips", "Limited facilities"],
    ti: { from: "Barishal", km: 25, dur: "1 hour", route: "Barishal → Swarupkathi", tr: ["Bus", "Boat"], fl: null },
    nearby: ["floating-guava-market", "sugandha-river", "guthia-mosque", "durga-sagar"]
},
{
    s: "sugandha-river", n: "Sugandha River", nb: "সুগন্ধা নদী", d: "Barishal", t: "Jhalokathi", u: "Nalchity",
    c: ["River", "Nature"], la: 22.63, lo: 90.20,
    sd: "The river that runs through Jhalokathi's guava country.",
    de: "The Sugandha river winds through Jhalokathi district, past the guava orchards that make the area famous. Its slow-moving waters and riverbank villages are ideal for short boat trips and quiet afternoons.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.9, rv: 60,
    tt: "Nature, Solo",
    tags: ["river", "guava country"],
    act: ["Boat on the Sugandha", "Village walks", "Guava orchard visits"],
    att: ["Sugandha river", "Riverbank villages"],
    tips: ["Best in winter", "Ask locals to arrange boats", "Carry water"],
    ti: { from: "Barishal", km: 30, dur: "1 hour", route: "Barishal → Nalchity", tr: ["Bus", "Boat"], fl: null },
    nearby: ["floating-guava-market", "swarupkathi", "durga-sagar"]
},

/* ============================ RANGPUR DIVISION ============================ */

/* ---- Dinajpur ---- */
{
    s: "nayabad-mosque", n: "Nayabad Mosque", nb: "নয়াবাদ মসজিদ", d: "Rangpur", t: "Dinajpur", u: "Dinajpur Sadar",
    c: ["Mosque", "Historical", "Heritage"], la: 25.63, lo: 88.64,
    sd: "An 18th-century stone mosque near Dinajpur town.",
    de: "Nayabad Mosque, built in 1793, is one of the finest stone mosques of Dinajpur, ornamented with intricate terracotta and floral designs. It stands amid green fields just outside the district town.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.3, rv: 140,
    tt: "History, Architecture",
    tags: ["mosque", "stone", "terracotta"],
    act: ["Admire the terracotta art", "Photograph the mosque", "Walk the fields"],
    att: ["Nayabad Mosque", "Stone carvings"],
    tips: ["Respect prayer times", "Combine with Kantajew Temple", "Best in the morning"],
    ti: { from: "Dinajpur", km: 5, dur: "15 minutes", route: "Dinajpur town → Nayabad", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["kantajew-temple", "ramsagar", "dinajpur-rajbari"]
},
{
    s: "dinajpur-rajbari", n: "Dinajpur Rajbari", nb: "দিনাজপুর রাজবাড়ী", d: "Rangpur", t: "Dinajpur", u: "Dinajpur Sadar",
    c: ["Palace", "Historical", "Heritage"], la: 25.63, lo: 88.64,
    sd: "The former palace of the Dinajpur zamindar family.",
    de: "Dinajpur Rajbari is the estate complex of the Dinajpur zamindar family, partly preserved with grand buildings and a museum of royal memorabilia. It offers a glimpse of the landlord-era grandeur of north Bengal.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.2, rv: 120,
    tt: "History, Architecture",
    tags: ["rajbari", "palace", "zamindar"],
    act: ["Explore the palace", "Visit the museum", "Photograph the complex"],
    att: ["Dinajpur Rajbari", "Zamindar museum"],
    tips: ["Check museum hours", "Combine with Kantajew Temple", "Best in the morning"],
    ti: { from: "Dinajpur", km: 2, dur: "10 minutes", route: "Dinajpur town → Rajbari", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["kantajew-temple", "ramsagar", "nayabad-mosque"]
},

/* ---- Rangpur ---- */
{
    s: "pairaband-rangpur", n: "Pairaband", nb: "পায়রাবন্দ", d: "Rangpur", t: "Rangpur", u: "Mithapukur",
    c: ["Historical", "Village"], la: 25.58, lo: 89.20,
    sd: "The birthplace village of Begum Rokeya, pioneer of women's education.",
    de: "Pairaband in Mithapukur, Rangpur, is the birthplace of Begum Rokeya Sakhawat Hossain, the pioneering feminist writer and educationist. The village is a place of quiet pilgrimage for those inspired by her legacy.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.0, rv: 90,
    tt: "History, Culture, Students",
    tags: ["begum rokeya", "birthplace", "heritage"],
    act: ["Visit the birth site", "Learn Rokeya's legacy", "Walk the village"],
    att: ["Pairaband village", "Rokeya memorials"],
    tips: ["Ask locals for directions", "Combine with Tajhat Palace", "Best in winter"],
    ti: { from: "Rangpur", km: 20, dur: "40 minutes", route: "Rangpur → Mithapukur → Pairaband", tr: ["Bus", "CNG"], fl: null },
    nearby: ["tajhat-palace", "ramsagar", "kantajew-temple"]
},
{
    s: "keranirhat", n: "Keranirhat", nb: "কেরানীর হাট", d: "Rangpur", t: "Rangpur", u: "Rangpur Sadar",
    c: ["Historical", "Heritage", "Cultural"], la: 25.79, lo: 89.19,
    sd: "A historic market town near Rangpur with old buildings.",
    de: "Keranirhat is a historic area near Rangpur city known for its old market and colonial-era buildings. It reflects the trading heritage of north Bengal and is a pleasant place for a short heritage walk.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 3.8, rv: 50,
    tt: "History, Culture",
    tags: ["market", "heritage"],
    act: ["Explore the old market", "See heritage buildings", "Photograph the area"],
    att: ["Keranirhat market", "Colonial buildings"],
    tips: ["Combine with Tajhat Palace", "Ask locals for history", "Best in the morning"],
    ti: { from: "Rangpur", km: 10, dur: "20 minutes", route: "Rangpur → Keranirhat", tr: ["Bus", "CNG"], fl: null },
    nearby: ["tajhat-palace", "pairaband-rangpur", "ramsagar"]
},

/* ---- Thakurgaon ---- */
{
    s: "tangon-river-thakurgaon", n: "Tangon River", nb: "টাঙ্গন নদী", d: "Rangpur", t: "Thakurgaon", u: "Thakurgaon Sadar",
    c: ["River", "Nature"], la: 26.03, lo: 88.47,
    sd: "The river of Thakurgaon, with seasonal sandbars and green banks.",
    de: "The Tangon river flows through Thakurgaon district, its wide seasonal channel exposing sandbars in the dry months. It is a quiet riverine setting for walks and rural scenery in the far north-west of Bangladesh.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 3.8, rv: 50,
    tt: "Nature, Solo",
    tags: ["river", "north bengal"],
    act: ["Walk the riverbank", "See the seasonal sandbars", "Village visits"],
    att: ["Tangon river", "Rural landscape"],
    tips: ["Limited facilities", "Best in winter", "Ask locals for directions"],
    ti: { from: "Thakurgaon", km: 3, dur: "10 minutes", route: "Thakurgaon town → river", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["ramsagar", "nayabad-mosque", "kantajew-temple"]
},
{
    s: "haripur-rajbari-thakurgaon", n: "Haripur Rajbari", nb: "হরিপুর রাজবাড়ী", d: "Rangpur", t: "Thakurgaon", u: "Baliadangi",
    c: ["Palace", "Historical"], la: 26.08, lo: 88.34,
    sd: "The ruined zamindar palace at Haripur, Thakurgaon.",
    de: "Haripur Rajbari in Baliadangi, Thakurgaon, is the ruined estate of the Haripur zamindar family. Its crumbling walls and ponds hint at past grandeur in this quiet corner of north-west Bangladesh.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 3.8, rv: 40,
    tt: "History, Architecture",
    tags: ["rajbari", "ruins", "zamindar"],
    act: ["Explore the ruins", "Photograph the palace", "Walk the grounds"],
    att: ["Haripur Rajbari ruins", "Estate ponds"],
    tips: ["Ask locals for access", "Best in the morning", "Combine with the Tangon river"],
    ti: { from: "Thakurgaon", km: 25, dur: "45 minutes", route: "Thakurgaon → Baliadangi → Haripur", tr: ["Bus", "CNG"], fl: null },
    nearby: ["tangon-river-thakurgaon", "ramsagar", "kantajew-temple"]
},

/* ---- Gaibandha ---- */
{
    s: "gaibandha-jamuna", n: "Jamuna Charlands (Gaibandha)", nb: "গাইবান্ধা চর", d: "Rangpur", t: "Gaibandha", u: "Gaibandha Sadar",
    c: ["River", "Island", "Village"], la: 25.33, lo: 89.55,
    sd: "The vast sandbar islands of the Jamuna around Gaibandha.",
    de: "The Jamuna river around Gaibandha is famous for its shifting sandbar islands (chars), home to resilient river communities. Boats ferry between the chars, offering a raw look at life on the country's largest river.",
    b: "October – March", dy: "Half day", df: "Easy to Moderate", ra: 3.9, rv: 70,
    tt: "Nature, Culture, Solo",
    tags: ["jamuna", "char", "river"],
    act: ["Ferry to the chars", "Visit river villages", "Watch sandbank life"],
    att: ["Jamuna chars", "River islands"],
    tips: ["Use local ferries", "Carry supplies", "Best in winter when chars are exposed"],
    ti: { from: "Gaibandha", km: 15, dur: "30 minutes", route: "Gaibandha → Jamuna chars by boat", tr: ["Bus", "Boat"], fl: null },
    nearby: ["ramsagar", "teesta-barrage", "nayabad-mosque"]
},

/* ---- Kurigram ---- */
{
    s: "chilmari-kurigram", n: "Chilmari", nb: "চিলমারী", d: "Rangpur", t: "Kurigram", u: "Chilmari",
    c: ["River", "Historical"], la: 25.28, lo: 89.70,
    sd: "The historic river port on the Brahmaputra in Kurigram.",
    de: "Chilmari is an historic river port on the Brahmaputra (Jamuna) in Kurigram district, once a key stop for steamers and trade. Today its ghats, ferries and river views preserve the romance of Bengal's old water routes.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.0, rv: 80,
    tt: "History, Culture, Solo",
    tags: ["river port", "brahmaputra", "heritage"],
    act: ["See the old ghat", "Watch ferries", "Photograph the river"],
    att: ["Chilmari ghat", "Brahmaputra river"],
    tips: ["Best in the morning", "Keep belongings safe", "Combine with river views"],
    ti: { from: "Kurigram", km: 20, dur: "40 minutes", route: "Kurigram → Chilmari", tr: ["Bus", "CNG"], fl: null },
    nearby: ["gaibandha-jamuna", "teesta-barrage", "ramsagar"]
},

/* ---- Panchagarh ---- */
{
    s: "banglabandha", n: "Banglabandha", nb: "বাংলাবান্ধা", d: "Rangpur", t: "Panchagarh", u: "Tentulia",
    c: ["Historical", "Village"], la: 26.63, lo: 88.52,
    sd: "Bangladesh's northernmost point, a historic border gateway.",
    de: "Banglabandha is the northernmost point of Bangladesh, a land border crossing between Bangladesh, India and Nepal. The zero-point border area has historic significance and is visited for its frontier atmosphere and views.",
    b: "October – March", dy: "1 hour", df: "Easy", ra: 4.0, rv: 90,
    tt: "History, Solo, Everyone",
    tags: ["border", "northernmost", "zero point"],
    act: ["See the border crossing", "Visit the zero point", "Photograph the frontier"],
    att: ["Banglabandha border", "Three-country viewpoint"],
    tips: ["Carry identification", "Respect border security", "Combine with Tetulia tea gardens"],
    ti: { from: "Panchagarh", km: 35, dur: "1 hour", route: "Panchagarh → Banglabandha", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["tetulia", "mahananda-river-panchagarh", "nayabad-mosque"]
},
{
    s: "mahananda-river-panchagarh", n: "Mahananda River (Panchagarh)", nb: "মহানন্দা নদী", d: "Rangpur", t: "Panchagarh", u: "Tentulia",
    c: ["River", "Nature"], la: 26.35, lo: 88.42,
    sd: "The river that flows from the Himalayas through Panchagarh.",
    de: "The Mahananda river enters Bangladesh from the Himalayas through Panchagarh, flowing past the district's tea gardens and green farmland. Its clear channels and shingled banks are a scenic feature of Bangladesh's far north.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.1, rv: 80,
    tt: "Nature, Solo",
    tags: ["river", "himalayan"],
    act: ["Walk the riverbank", "Photograph the shingle beds", "Combine with tea gardens"],
    att: ["Mahananda river", "Northern landscape"],
    tips: ["Best in winter", "Combine with Tetulia tea", "Ask locals for boat trips"],
    ti: { from: "Panchagarh", km: 20, dur: "40 minutes", route: "Panchagarh → Tentulia", tr: ["Bus", "CNG"], fl: null },
    nearby: ["tetulia", "banglabandha", "nayabad-mosque"]
},

/* ============================ MYMENSINGH DIVISION ============================ */

/* ---- Mymensingh ---- */
{
    s: "zainul-abedin-museum", n: "Zainul Abedin Museum", nb: "জয়নুল আবেদিন জাদুঘর", d: "Mymensingh", t: "Mymensingh", u: "Mymensingh Sadar",
    c: ["Museum", "Cultural"], la: 24.76, lo: 90.40,
    sd: "A museum honouring Shilpacharya Zainul Abedin beside the Brahmaputra.",
    de: "The Zainul Abedin Museum in Mymensingh celebrates the life and art of Shilpacharya Zainul Abedin, pioneer of modern Bangladeshi art. Works and sketches are displayed in a riverside gallery named after the great painter.",
    b: "Year-round", dy: "1 hour", df: "Easy", ra: 4.4, rv: 180,
    tt: "Art lovers, Students, Culture",
    tags: ["museum", "art", "zainul abedin"],
    act: ["View the art collection", "See the Brahmaputra view", "Learn art history"],
    att: ["Zainul Abedin works", "Riverside gallery"],
    tips: ["Check opening hours", "Combine with Shashi Lodge", "Photography rules may apply"],
    ti: { from: "Mymensingh", km: 1, dur: "5 minutes", route: "Mymensingh town → museum", tr: ["Rickshaw", "CNG"], fl: null },
    nearby: ["shashi-lodge", "muktagacha-zamindar-bari", "brahmaputra-river-mymensingh", "madhabtila-eco-park"]
},
{
    s: "brahmaputra-river-mymensingh", n: "Brahmaputra River (Mymensingh)", nb: "ব্রহ্মপুত্র নদী", d: "Mymensingh", t: "Mymensingh", u: "Mymensingh Sadar",
    c: ["River", "Nature", "Picnic Spot"], la: 24.75, lo: 90.40,
    sd: "The great river that flows past Mymensingh town.",
    de: "The old Brahmaputra river flows beside Mymensingh town, its wide channel forming a popular riverside promenade. Boats, ghats and the calm water make it a lovely spot for an evening walk or sunset boat ride.",
    b: "October – March", dy: "1 – 2 hours", df: "Easy", ra: 4.2, rv: 170,
    tt: "Families, Couples, Everyone",
    tags: ["river", "brahmaputra", "sunset"],
    act: ["Walk the riverbank", "Boat rides", "Sunset photography"],
    att: ["Brahmaputra river", "Mymensingh ghats"],
    tips: ["Best at sunset", "Combine with Zainul Abedin Museum", "Keep belongings safe"],
    ti: { from: "Mymensingh", km: 0, dur: "On-site", route: "River runs beside the town", tr: ["Rickshaw", "Boat"], fl: null },
    nearby: ["zainul-abedin-museum", "shashi-lodge", "muktagacha-zamindar-bari"]
},

/* ---- Netrokona ---- */
{
    s: "china-clay-hills", n: "China Clay Hills (Birishiri)", nb: "চায়না ক্লে পাহাড়", d: "Mymensingh", t: "Netrokona", u: "Durgapur",
    c: ["Hill", "Nature", "Adventure"], la: 25.02, lo: 90.83,
    sd: "Striking white and red clay hills beside the Someshwari river.",
    de: "The China Clay Hills near Birishiri in Durgapur, Netrokona, are a striking landscape of white and reddish clay layers carved by mining. They rise beside the Someshwari river, creating a surreal, otherworldly scene popular with photographers.",
    b: "October – March", dy: "Half day", df: "Moderate", ra: 4.6, rv: 430,
    tt: "Adventure, Nature, Photography", feat: true,
    tags: ["clay hills", "birishiri", "mining"],
    act: ["Climb the clay hills", "Photograph the layered cliffs", "Cross the Someshwari"],
    att: ["China clay hills", "Someshwari river"],
    tips: ["Wear shoes — clay can be slippery", "Combine with Birishiri", "Best light in the morning"],
    ti: { from: "Netrokona", km: 40, dur: "1.5 hours", route: "Netrokona → Durgapur → Birishiri", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["birishiri", "someshwari-river", "ranikhong", "shashi-lodge"]
},
{
    s: "someshwari-river", n: "Someshwari River", nb: "সোমেশ্বরী নদী", d: "Mymensingh", t: "Netrokona", u: "Durgapur",
    c: ["River", "Nature"], la: 25.02, lo: 90.81,
    sd: "The clear river running beside the Birishiri hills.",
    de: "The Someshwari river flows out of the Meghalaya hills past Birishiri in Netrokona, its clear water and rocky shallows perfect for wading and photography. It is the scenic backbone of the Durgapur area.",
    b: "October – March", dy: "Half day", df: "Easy", ra: 4.4, rv: 260,
    tt: "Nature, Families, Photography",
    tags: ["river", "clear water"],
    act: ["Wade in the shallows", "Photograph the river", "Picnic on the banks"],
    att: ["Someshwari river", "Rocky shallows"],
    tips: ["Best in winter when water is clear", "Combine with China Clay Hills", "Carry water"],
    ti: { from: "Netrokona", km: 40, dur: "1.5 hours", route: "Netrokona → Durgapur → Someshwari", tr: ["Bus", "CNG"], fl: null },
    nearby: ["china-clay-hills", "birishiri", "ranikhong"]
},
{
    s: "ranikhong", n: "Ranikhong", nb: "রাণীখং", d: "Mymensingh", t: "Netrokona", u: "Durgapur",
    c: ["Village", "Nature"], la: 25.05, lo: 90.78,
    sd: "A hill village near Birishiri with tribal culture and views.",
    de: "Ranikhong is a small hill village near Birishiri in Netrokona where indigenous communities live amid forested slopes. It offers village homestays, tribal culture and peaceful walks in the hills.",
    b: "October – March", dy: "1 day", df: "Moderate", ra: 4.2, rv: 130,
    tt: "Culture, Nature, Solo",
    tags: ["village", "tribal", "hills"],
    act: ["Village walks", "Tribal culture experience", "Hill viewpoints"],
    att: ["Ranikhong village", "Hill forests"],
    tips: ["Respect local customs", "Use a guide", "Carry supplies"],
    ti: { from: "Netrokona", km: 42, dur: "1.5 hours", route: "Netrokona → Durgapur → Ranikhong", tr: ["Bus", "CNG"], fl: null },
    nearby: ["china-clay-hills", "birishiri", "someshwari-river"]
},

/* ============================ REMAINING KHULNA/BARISHAL (Patuakhali etc) ============================ */

/* ---- Bagerhat done; Patuakhali Kuakata done. Add Rakhine village --- */

/* ---- Habiganj (tea gardens & Madhabpur already in Moulvibazar) ---- */
{
    s: "habiganj-tea-gardens", n: "Habiganj Tea Gardens", nb: "হবিগঞ্জ চা বাগান", d: "Sylhet", t: "Habiganj", u: "Chunarughat",
    c: ["Tea Garden", "Nature"], la: 24.06, lo: 91.55,
    sd: "Lush tea estates in the Chunarughat belt of Habiganj.",
    de: "The Chunarughat area of Habiganj is dotted with tea estates producing some of Bangladesh's finest leaves. Rolling green rows of tea bushes, misty mornings and village estates make this a quiet alternative to the busier Moulvibazar gardens.",
    b: "November – February", dy: "Half day", df: "Easy", ra: 4.2, rv: 130,
    tt: "Nature, Tea lovers",
    tags: ["tea garden", "chunarughat"],
    act: ["Walk the tea rows", "Visit a tea estate", "Photograph the green hills"],
    att: ["Tea estates", "Green landscape"],
    tips: ["Best in the morning mist", "Combine with Satchari National Park", "Ask estate permission"],
    ti: { from: "Habiganj", km: 30, dur: "1 hour", route: "Habiganj → Chunarughat", tr: ["Bus", "CNG", "Private Car"], fl: null },
    nearby: ["satchari-national-park", "rema-kalenga-wildlife-sanctuary", "madhabpur-lake"]
}
];
