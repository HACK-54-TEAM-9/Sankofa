/**
 * Comprehensive Sankofa Chatbot Response System
 * Covers ALL possible user questions across multiple categories
 */

const chatbotResponses = {
  // ==================== GETTING STARTED ====================
  
  howItWorks: `Sankofa transforms plastic pollution into healthcare access! Here's how:

1. **Collectors** gather plastic waste from their communities
2. They bring it to designated **collection hubs**
3. **Hub managers** weigh and record the plastic by type
4. Collectors receive **instant cash payment** (typically GHS 2 per kg)
5. They can also save earnings as "**Savings Tokens**" for future healthcare access
6. The plastic data is analyzed by **AI** to predict health risks in that area

This creates a sustainable cycle where environmental cleanup directly funds healthcare and disease prevention!`,

  mission: `🌍 **Our Mission:**
Sankofa's mission is to create a healthier Africa by:
- Reducing plastic pollution in communities
- Providing income opportunities for waste collectors
- Funding healthcare access for underserved populations
- Using AI to predict and prevent disease outbreaks
- Building sustainable environmental solutions

**"Sankofa" means "go back and fetch it"** - learning from the past to build a better future. We're turning yesterday's plastic waste into tomorrow's healthcare solutions!`,

  whoWeAre: `👥 **About Sankofa:**
Sankofa is a social enterprise that combines environmental cleanup with healthcare access in Ghana and across Africa.

**Founded:** 2024
**Mission:** Transform plastic pollution into healthcare
**Impact:** Over 50,000+ collectors, 100+ hubs, 5 million kg plastic collected
**Technology:** AI-powered health prediction and blockchain-verified transactions

We partner with local communities, health clinics, recycling facilities, and government agencies to create sustainable solutions for both environmental and health challenges.`,

  // ==================== BECOMING A COLLECTOR ====================
  
  becomeCollector: `Becoming a collector is easy! Here's what to do:

1. **Visit a collection hub** in your area
2. **Register** with a hub manager - provide:
   - Phone number (or shared/emergency contact)
   - Full name
   - Neighborhood/area you'll collect from
3. **Receive your collector ID** or physical card
4. **Start collecting!** Gather clean, sorted plastic waste
5. **Bring to hub** and get paid instantly

**No smartphone needed!** Hub managers can register you and help with the process. Even if you can't read or write, they'll guide you through everything.`,

  registrationRequirements: `📝 **What You Need to Register:**

**Required:**
- Full name
- Phone number (yours or a family member's)
- Your neighborhood/area
- Age 16+ (or parental consent if 13-15)

**Optional but helpful:**
- Ghana Card or ID
- Emergency contact
- Preferred payment method

**Not Required:**
- Smartphone or email
- Reading/writing ability
- Previous experience
- Formal education

**Cost:** Registration is **100% FREE!** No hidden fees, ever.`,

  collectorBenefits: `✨ **Benefits of Being a Collector:**

💰 **Financial:**
- Instant cash payments (GHS 2-2.5 per kg)
- Weekly bonuses for top collectors
- Savings tokens for healthcare
- Referral bonuses (GHS 20 per new collector)

🏥 **Healthcare:**
- Free health screenings
- Discounted medical care
- Health insurance subsidies
- Emergency medical fund access

📱 **Support & Training:**
- Free plastic sorting training
- Safety equipment provided
- SMS updates on prices and bonuses
- Community support network

🌟 **Recognition:**
- Collector leaderboards
- Monthly awards and prizes
- Community impact certificates
- Opportunities to become hub manager`,

  ageRequirements: `👶 **Age Requirements:**

**16+ years:** Can register independently
**13-15 years:** Can collect with parental/guardian consent
**Under 13:** Must be accompanied by parent/guardian

**Why these ages?**
- Safety: Collection can involve heavy lifting
- Legal compliance: Ghana labor laws
- Responsibility: Managing earnings and records

**Youth programs:** We offer special youth collection events and environmental education programs for schools!`,

  // ==================== PLASTIC TYPES & SORTING ====================
  
  plasticTypes: `We accept these plastic types (make sure they're clean and sorted):

📦 **PET (Polyethylene Terephthalate) - #1**
   - Water bottles, soda bottles
   - Clear food containers, cooking oil bottles
   - Highest value! (~GHS 2.5/kg)

🥛 **HDPE (High-Density Polyethylene) - #2**
   - Milk jugs, detergent bottles
   - Shampoo bottles, household cleaner bottles
   - (~GHS 2/kg)

🛍️ **LDPE (Low-Density Polyethylene) - #4**
   - Shopping bags, bread bags
   - Garbage bags, squeezable bottles
   - (~GHS 1.5/kg)

🍶 **PP (Polypropylene) - #5**
   - Yogurt containers, bottle caps
   - Food storage containers, medicine bottles
   - (~GHS 2/kg)

☕ **PS (Polystyrene) - #6**
   - Foam containers, cups
   - Disposable plates, takeout containers
   - (~GHS 1/kg)

**Tip:** Sort by type for faster processing and better rates!`,

  howToIdentifyPlastic: `🔍 **How to Identify Plastic Types:**

**Method 1: Look for the number**
- Check the bottom of containers for a triangle with a number (1-7)
- #1 = PET, #2 = HDPE, #4 = LDPE, #5 = PP, #6 = PS

**Method 2: Visual/texture test**
- Clear, rigid bottles = Usually PET
- Opaque milk jugs = Usually HDPE
- Soft, flexible bags = Usually LDPE
- Hard colored containers = Usually PP
- Foam products = PS

**Method 3: Ask at the hub!**
- Hub managers can help identify plastics
- They'll train you on spotting different types
- Free training sessions available

**Don't worry if you're unsure** - bring mixed plastics and hub managers will help sort them!`,

  plasticCleanliness: `🧼 **Cleaning Requirements:**

**PET & HDPE bottles:**
- Rinse out residue (water is fine)
- Remove caps and labels if possible
- Let dry to prevent mold

**Bags & containers:**
- Shake out crumbs/debris
- Wipe clean if greasy
- No need to be spotless!

**Foam products:**
- Remove food particles
- Air dry if wet

**What's acceptable:**
- Slightly stained is OK
- Small labels can stay on
- Caps attached are fine

**What's NOT acceptable:**
- Heavily contaminated with food
- Mixed with garbage/organic waste
- Wet or moldy plastic
- Medical/hazardous waste

**Tip:** Cleaner plastic = faster processing = you get paid quicker!`,

  whatNotToCollect: `❌ **What We DON'T Accept:**

**Hazardous Materials:**
- Medical waste (syringes, medicine packaging)
- Chemical containers (pesticides, acids)
- Batteries or electronics
- Paint containers

**Non-Recyclable:**
- Heavily soiled plastic (food waste mixed in)
- Plastic mixed with metal/glass that can't be separated
- Biodegradable plastics (PLA)
- Multi-layer packaging (chip bags, juice pouches)

**Other Waste:**
- Glass, metal, paper (we only take plastic)
- Organic waste (food, plant matter)
- Textiles or fabric

**Safety First!** Never collect anything that could hurt you or is illegal. When in doubt, ask a hub manager!`,

  sortingTips: `📊 **Pro Sorting Tips:**

**At Home:**
1. Keep 5 bags/containers for each plastic type
2. Rinse as you sort
3. Flatten bottles to save space
4. Remove caps and store separately

**In the Field:**
1. Use a backpack with compartments
2. Sort as you collect (saves time later)
3. Focus on high-value PET bottles first
4. Collect in bulk - bigger loads = better efficiency

**At the Hub:**
1. Pre-sort before weighing
2. Keep different types in separate bags
3. Ask hub manager to verify your sorting
4. Learn from experienced collectors

**Bonus Tip:** Top collectors often specialize in one or two plastic types - find what works best in your area!`,

  // ==================== PAYMENT & EARNINGS ====================
  
  paymentRates: `💰 **Current Payment Rates:**

**By Plastic Type:**
- PET (#1): GHS 2.50 per kg
- HDPE (#2): GHS 2.00 per kg
- PP (#5): GHS 2.00 per kg
- LDPE (#4): GHS 1.50 per kg
- PS (#6): GHS 1.00 per kg

**Bulk Bonuses:**
- 20+ kg in one visit: +10% bonus
- 50+ kg: +15% bonus
- 100+ kg: +20% bonus

**Quality Bonuses:**
- Well-sorted: +GHS 0.20 per kg
- Clean and dry: +GHS 0.10 per kg

**Rates updated:** Monthly based on recycling market
**Price alerts:** SMS notifications when rates change`,

  howPaymentWorks: `💵 **How Payment Works:**

**Step 1: Weighing**
- Hub manager weighs your plastic by type
- You see the weight on the digital scale
- Hub manager calculates your payment

**Step 2: Choose Payment Method**
1. **Instant Cash** (70% of value) - cash in hand immediately
2. **Savings Tokens** (30% of value) - for healthcare later
3. **Split Payment** - customize your ratio!
4. **Mobile Money** - direct transfer (MTN, Vodafone, AirtelTigo)

**Step 3: Confirmation**
- You receive SMS receipt
- Payment recorded in your collector profile
- Can check history anytime

**Processing Time:**
- Cash: Immediate
- Mobile Money: 1-5 minutes
- Savings Tokens: Instant in your account

**No fees, no tricks** - what we quote is what you get!`,

  mobileMoneyPayment: `📱 **Mobile Money Payment:**

**Supported Networks:**
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money

**How to Set Up:**
1. Tell hub manager your mobile money number
2. Choose "Mobile Money" at payment
3. Receive SMS confirmation
4. Money appears in your wallet (1-5 minutes)

**Advantages:**
- No need to carry cash
- Can send money home immediately
- Digital record of all transactions
- Safe and secure

**Fees:** Zero! We cover all transaction fees

**No phone?** You can still use cash or register a family member's number!`,

  savingsTokens: `🏥 **Health Savings Tokens:**

**What are they?**
- Digital currency for healthcare
- Worth 30% more than cash value
- Never expire, always available
- Accepted at partner clinics

**How they work:**
- Choose "Savings Tokens" at payment
- Tokens added to your account instantly
- Use them at any partner clinic
- Can convert back to cash anytime (with 10% fee)

**What you can use them for:**
- Doctor consultations
- Prescriptions and medicine
- Lab tests and diagnostics
- Hospital visits
- Health insurance payments
- Family member healthcare

**Example:**
Collect 10kg PET = GHS 25 value
- Cash option: GHS 17.50 now
- Tokens option: 75 health tokens (GHS 32.50 healthcare value!)

**Smart strategy:** Save tokens during healthy months, use when needed!`,

  maximizeEarnings: `💡 **How to Maximize Your Earnings:**

**1. Focus on High-Value Plastics:**
- PET bottles earn the most (GHS 2.50/kg)
- Learn to spot PET vs. other plastics
- Build relationships with shops/restaurants that generate PET waste

**2. Collect in Bulk:**
- 20kg+ gets you a 10% bonus
- 100kg+ gets you a 20% bonus
- Store plastic at home until you have a big load

**3. Quality Matters:**
- Clean, sorted plastic earns bonuses
- Spend 10 minutes sorting = extra GHS 3-5 per load

**4. Strategic Locations:**
- Beach areas after weekends
- Market places on market days
- Event venues after festivals
- Construction sites

**5. Timing:**
- Early morning (less competition)
- After rain (plastics washed up/exposed)
- End of month (markets busier)

**6. Build Routes:**
- Regular collection from businesses
- Partner with event organizers
- Ask neighbors to save plastic for you

**7. Refer New Collectors:**
- Earn GHS 20 per referral
- Build a collection team
- Share knowledge, grow together

**Top collectors earn GHS 500-800 per month!**`,

  referralProgram: `🤝 **Referral Rewards Program:**

**Earn GHS 20 for each person you refer!**

**How it works:**
1. Tell friends/family about Sankofa
2. They mention your name/ID when registering
3. After their first collection, you get GHS 20
4. No limit on how many you can refer!

**Bonus Tiers:**
- 5 referrals: +GHS 50 bonus
- 10 referrals: +GHS 150 bonus
- 20 referrals: +GHS 400 bonus & become Hub Ambassador

**Why refer?**
- Help your community earn income
- Clean your neighborhood together
- Build a collection team
- Organize group collections
- Share transport costs

**Hub Ambassador Benefits:**
- Special badge and recognition
- Higher referral bonuses (GHS 25 per person)
- Priority access to new opportunities
- Free advanced training

**Growing together makes everyone stronger!**`,

  // ==================== COLLECTION HUBS ====================
  
  collectionHubs: `We have collection hubs across Ghana! Here are the main ones:

🏢 **Accra Central Hub**
   - Location: Osu, Accra (near Oxford Street)
   - Hours: Mon-Sat, 7am-6pm
   - Contact: +233 (0)30 212 3456
   - Hub Manager: Kwame Mensah

🏭 **Tema Industrial Hub**
   - Location: Community 1, Tema
   - Hours: Mon-Sat, 6am-7pm
   - Contact: +233 (0)30 312 4567
   - Hub Manager: Ama Serwaa

🌆 **Kumasi Regional Hub**
   - Location: Adum, Kumasi (near Central Market)
   - Hours: Mon-Sat, 7am-6pm
   - Contact: +233 (0)32 212 5678
   - Hub Manager: Yaw Boateng

🌊 **Takoradi Coastal Hub**
   - Location: Market Circle, Takoradi
   - Hours: Mon-Sat, 7am-5pm
   - Contact: +233 (0)31 212 6789
   - Hub Manager: Efua Asante

📍 **More hubs in:** Cape Coast, Ho, Tamale, Koforidua, Sunyani

**Find nearest hub:**
- Call hotline: +233 (0)30 212 3456
- USSD: *800*726563#
- SMS "HUB" to 1234
- Visit: sankofa.org/hubs`,

  hubHours: `⏰ **Collection Hub Hours:**

**Regular Hours:**
- Monday - Saturday: 7am - 6pm
- Sunday: Closed (most hubs)

**Special Hours:**
- Some urban hubs open until 7pm
- Monthly "Super Saturday": Open 6am - 8pm (last Saturday of month)

**Best Times to Visit:**
- Morning (7am-10am): Less crowded, faster service
- Lunch (12pm-2pm): Sometimes slower
- Late afternoon (4pm-6pm): Busy but energetic atmosphere

**Holidays:** Hubs closed on:
- New Year's Day
- Independence Day (March 6)
- Easter (Friday-Monday)
- Christmas & Boxing Day

**Emergency Collections:**
- Call your hub manager for special arrangements
- Bulk collections (100kg+) can be scheduled outside regular hours`,

  hubManagerRole: `👔 **What Hub Managers Do:**

**Registration & Support:**
- Register new collectors
- Answer questions and provide training
- Help identify and sort plastics
- Update collector information

**Operations:**
- Weigh and record plastic collections
- Process payments (cash, mobile money, tokens)
- Maintain scales and equipment
- Ensure hub cleanliness and safety

**Community Building:**
- Organize collector meetups
- Share best practices
- Recognize top collectors
- Coordinate local cleanup events

**Your hub manager is your main contact** - don't hesitate to ask questions!`,

  becomeHubManager: `🌟 **Become a Hub Manager:**

**Requirements:**
- 21+ years old
- 6+ months experience as collector
- Strong community presence
- Basic numeracy and record-keeping skills
- Leadership and communication abilities
- Reliable and trustworthy

**Responsibilities:**
- Manage daily hub operations
- Register and support collectors
- Process payments accurately
- Maintain records and reports
- Build community relationships

**Compensation:**
- Monthly salary: GHS 800-1,200
- Performance bonuses
- Commission on hub collections
- Training and development opportunities

**How to Apply:**
1. Talk to your current hub manager
2. Complete hub manager training (2 weeks)
3. Demonstrate leadership in collector community
4. Apply when positions open

**Career Path:** Hub Manager → Regional Coordinator → Operations Manager`,

  // ==================== HEALTH & SAFETY ====================
  
  healthPrediction: `🏥 **How Health Prediction Works:**

**The Connection:**
- Plastic accumulation = standing water = mosquito breeding
- Plastic burning = air pollution = respiratory problems
- Blocked drainage = flooding = waterborne diseases
- Pollution hotspots = higher disease rates

**Our AI System:**
1. Analyzes plastic collection data by location
2. Identifies pollution hotspots
3. Correlates with historical disease patterns
4. Predicts outbreaks 2-4 weeks in advance
5. Alerts communities to take preventive action

**What We Predict:**
- Malaria risk (from water-filled plastic containers)
- Cholera & typhoid (from contaminated water)
- Respiratory diseases (from plastic burning)
- Dengue fever (mosquito-borne)

**How It Helps You:**
- SMS alerts for high-risk areas
- Preventive health recommendations
- Free health screenings in high-risk zones
- Priority healthcare access

**Your collection data saves lives!**`,

  privacyDataSecurity: `🔒 **Your Privacy & Data Security:**

**What We Collect:**
- Name, phone number, location (area)
- Collection records (weight, type, date)
- Payment history
- Health token balance

**What We DON'T Collect:**
- Medical records or health history
- Detailed GPS tracking
- Personal conversations
- Family information (unless you provide emergency contact)

**How We Protect Your Data:**
- 256-bit encryption (bank-level security)
- Secure servers (AWS/Google Cloud)
- No data sharing with third parties
- Compliance with Ghana Data Protection Act
- Regular security audits

**Health Prediction Privacy:**
- All data is anonymized before AI analysis
- No individual identifiers in predictions
- Only aggregate community-level data used
- You can opt out anytime

**Your Rights:**
- View your data anytime
- Request data correction
- Request data deletion
- Opt out of health predictions

**Questions?** Contact: privacy@sankofa.org`,

  safetyGuidelines: `⚠️ **Safety Guidelines for Collectors:**

**Personal Protective Equipment:**
- Gloves (provided free at hubs)
- Closed-toe shoes
- Long pants recommended
- Sun hat/cap

**What to Avoid:**
- Never collect medical waste (needles, syringes)
- Avoid broken glass mixed with plastic
- Don't collect from dangerous areas
- Never trespass on private property
- Avoid collection during heavy rain/flooding

**Health & Hygiene:**
- Wash hands after collecting
- Don't touch your face while collecting
- Stay hydrated (drink water regularly)
- Take breaks in shade
- Use sunscreen

**Injury Prevention:**
- Don't overload bags (max 15kg per bag)
- Lift with your legs, not your back
- Watch for sharp edges
- Be aware of traffic when collecting roadside

**Emergency:**
- Hubs have first aid kits
- Free medical care for work-related injuries
- Emergency hotline: 112 (Ghana ambulance)
- Report accidents to hub manager

**Stay safe = sustainable income!**`,

  healthcareAccess: `💊 **Accessing Healthcare with Sankofa:**

**Partner Clinics (100+ nationwide):**
- Community health centers
- Private clinics
- Government hospitals
- Pharmacies

**What's Covered:**
- Doctor consultations
- Prescription medications
- Lab tests and diagnostics
- Preventive care and screenings
- Emergency services
- Maternal and child health

**How to Use Your Tokens:**
1. Visit any partner clinic
2. Show your Sankofa collector ID
3. Tell them you want to use health tokens
4. They verify your balance
5. Services deducted from your token balance
6. Pay any difference in cash if needed

**Token Value:**
- Typical consultation: 20-30 tokens (GHS 5-7)
- Basic medicine: 15-25 tokens (GHS 4-6)
- Lab tests: 30-50 tokens (GHS 8-12)

**Family Access:**
- You can use tokens for immediate family
- Register family members at your hub
- Share your health benefits with those you love

**Emergency Fund:**
- For serious illnesses/accidents
- Apply through hub manager
- Community support available
`,

  // ==================== TECHNOLOGY & INNOVATION ====================
  
  ussdAccess: `📱 **USSD Access (Works on ANY Phone):**

**Dial: *800*726563# (*800*SANKOFA#)**

**Main Menu:**
1. Find nearest hub
2. Check your balance
3. View collection history
4. Current plastic prices
5. Health alerts
6. Contact support

**No smartphone needed!**
- Works on all phones (even old Nokia!)
- No internet required
- No app to download
- Available 24/7

**Step-by-step example:**
1. Dial *800*726563#
2. Select "2" for balance
3. Enter your collector ID
4. See your cash and tokens instantly!

**Language Options:**
- English
- Twi
- Ga
- Ewe
- Dagbani

**Free to use** - no airtime charges for basic queries!`,

  mobileApp: `📱 **Sankofa Mobile App:**

**Available on:**
- Android (Google Play Store)
- iOS (coming Q2 2026)
- Web app: app.sankofa.org

**Features:**
- Real-time collection tracking
- Find nearest hubs with GPS
- View earnings dashboard
- Check health token balance
- Get health alerts and tips
- Chat with hub managers
- Join collector community
- Learn about plastic types
- Track environmental impact

**Requirements:**
- Smartphone with internet
- Android 8.0+ or iOS 14+
- 50MB storage space

**Offline Mode:**
- View saved data without internet
- Auto-syncs when connected
- Download plastic identification guide

**Privacy:**
- Location used only for finding hubs
- Can disable tracking anytime
- All data encrypted

**Download:** Search "Sankofa Collect" in app store`,

  blockchain: `⛓️ **Blockchain & Transparency:**

**What is blockchain?**
- Secure, tamper-proof digital record
- All transactions permanently recorded
- Completely transparent and verifiable
- No one can change past records

**How Sankofa Uses It:**
- Every collection is recorded on blockchain
- Every payment is verified and permanent
- Health tokens are blockchain-based
- Supply chain transparency (plastic → recycling)

**Benefits for You:**
- Proof of all your collections
- Cannot be disputed or altered
- Build your reputation score
- Transfer tokens securely
- View complete transaction history

**Transparency:**
- See where your plastic goes
- Track environmental impact
- Verify recycling certifications
- Community dashboards showing collective impact

**You don't need to understand blockchain to benefit** - it just makes everything more secure and trustworthy!`,

  aiTechnology: `🤖 **AI Technology at Sankofa:**

**1. Health Prediction AI:**
- Analyzes millions of data points
- Predicts disease outbreaks 2-4 weeks early
- 85% accuracy rate
- Improving monthly with more data

**2. Image Recognition:**
- Upload photo of plastic
- AI identifies type automatically
- Estimates weight
- Calculates expected payment

**3. Route Optimization:**
- Suggests best collection routes
- Based on your location and historical data
- Maximizes earnings per hour
- Updates daily

**4. Price Prediction:**
- Forecasts plastic price changes
- Helps you time your collections
- Market trend analysis
- SMS alerts for price increases

**5. Chatbot Assistant (that's me!):**
- 24/7 answers to questions
- Multiple languages
- Learning from every conversation

**All AI is used to help YOU earn more and stay healthier!**`,

  // ==================== COMMUNITY & IMPACT ====================
  
  environmentalImpact: `🌍 **Your Environmental Impact:**

**Collective Achievement (All Sankofa Collectors):**
- 5+ million kg plastic collected since launch
- 50,000+ collectors across Ghana
- 100+ collection hubs nationwide
- Equivalent to 200 million plastic bottles!

**What This Means:**
- Prevented plastic from entering oceans
- Reduced landfill waste by 40% in active areas
- Cleaned 500+ km of coastline
- Protected marine life and ecosystems

**Your Personal Impact:**
- Track your collections in the app
- See total kg collected
- Estimate bottles/bags removed
- Calculate environmental score

**Typical Collector Impact (per month):**
- 50-100 kg plastic collected
- 2,000-4,000 bottles removed from environment
- GHS 100-250 earned
- Contribution to community health

**Recognition:**
- Environmental Impact Certificates
- Community cleanup awards
- National recognition for top collectors
- Invitations to environmental events

**Together, we're making Ghana cleaner, one bottle at a time!**`,

  communityEvents: `🎉 **Community Events & Activities:**

**Monthly Events:**
- **Super Saturday** (last Saturday): Extended hours, bonus payments, food/entertainment
- **Collector of the Month** awards ceremony
- **Beach Cleanup Days** (coastal hubs)
- **Market Cleanup Drives** (urban hubs)

**Quarterly:**
- Regional collector meetups
- Plastic sorting competitions (prizes!)
- Environmental education workshops
- Health screening camps

**Annual:**
- **Sankofa Day** (June 15): National celebration, biggest bonuses, concerts!
- Year-end awards gala
- Environmental summit
- Youth collection challenge

**Special Programs:**
- School partnerships (environmental education)
- Religious institution cleanups
- Festival cleanup crews (earn extra during festivals)
- Corporate sponsorship events

**Join the Community:**
- WhatsApp groups by region
- Facebook: Sankofa Collectors Community
- SMS updates for events

**Events often include:**
- Free food and refreshments
- Entertainment and music
- Prizes and giveaways
- Networking opportunities
- Family fun activities`,

  successStories: `⭐ **Collector Success Stories:**

**Ama's Story (Accra):**
"I started collecting 6 months ago to earn extra income. Now I make GHS 600/month! I've paid for my daughter's school fees, started saving for a small shop, and even helped my sister access healthcare with my tokens. Sankofa changed my life!"

**Kwame's Journey (Kumasi):**
"As a student, I collect after classes. I've earned enough to buy textbooks, pay for internet, and save for university. Plus, I've referred 15 friends - we collect as a team now!"

**Efua's Impact (Takoradi):**
"I became a hub manager after 8 months as a collector. Now I manage our community hub, help 200+ collectors, and earn a steady income. I've also used the health predictions to help my community prepare for rainy season diseases."

**The Youth Team (Tema):**
"Six of us formed a collection crew. We cover different areas and combine our plastic for bulk bonuses. We've collected 500kg+ together and cleaned our entire neighborhood. Now local businesses save plastic for us!"

**Building Dreams:**
- Collectors funding children's education
- Starting small businesses with savings
- Buying land and building homes
- Supporting extended families
- Creating local employment

**You could be next!**`,

  socialMedia: `📱 **Connect with Us:**

**Facebook:**
- Page: @SankofaGhana
- Group: Sankofa Collectors Community (25,000+ members)
- Share your success stories!
- Tips and tricks from experienced collectors
- Event announcements

**WhatsApp:**
- Regional collector groups
- Hub-specific channels
- Direct messaging with hub managers
- Quick updates and alerts

**Instagram:**
- @SankofaCollect
- Follow for inspiration
- Tag us in your collection photos
- Share your environmental impact

**Twitter/X:**
- @SankofaGH
- News and updates
- Price alerts
- Health advisories

**YouTube:**
- Sankofa Ghana
- Tutorial videos
- Plastic identification guides
- Success stories
- How-to content

**TikTok:**
- @SankofaGhana
- Quick tips
- Collection hacks
- Community highlights

**Join the conversation: #SankofaCollector #PlasticToHealth #CleanGhana**`,

  // ==================== TROUBLESHOOTING & SUPPORT ====================
  
  lostCollectorID: `🆔 **Lost Your Collector ID?**

**Don't worry! Easy to recover:**

**Option 1: USSD**
- Dial *800*726563#
- Select "Recover ID"
- Enter your registered phone number
- ID sent via SMS instantly

**Option 2: Visit Any Hub**
- Go to your nearest hub
- Provide name and phone number
- Hub manager looks up your account
- Can issue temporary ID immediately

**Option 3: Call Support**
- Hotline: +233 (0)30 212 3456
- Provide registration details
- ID sent via SMS

**Option 4: Mobile App**
- Log in with phone number
- View your ID in profile section

**Getting a New Card:**
- Request at any hub
- Free replacement for first loss
- GHS 2 fee for subsequent replacements
- Ready in 24 hours

**Temporary Solution:**
- Use phone number at hubs
- Hub managers can look you up
- Continue collecting while awaiting card`,

  paymentIssues: `💰 **Payment Problems? Here's How to Resolve:**

**Payment Not Received:**
1. Check SMS receipt for transaction ID
2. Verify with hub manager immediately
3. Mobile money can take up to 5 minutes
4. Call your mobile money provider
5. Report to hub manager if still not received

**Wrong Amount:**
1. Check the receipt - verify weights and rates
2. Ask hub manager to show scale reading
3. Confirm plastic type classification
4. Request re-weighing if you disagree
5. Hub manager can issue adjustment

**Mobile Money Failed:**
1. Confirm phone number is correct
2. Check if you've reached daily limits
3. Verify network is active
4. Hub manager can retry transaction
5. Can switch to cash if mobile money continues failing

**Tokens Not Added:**
1. Check USSD (*800*726563#) for current balance
2. Allow 1-2 minutes for blockchain confirmation
3. Request transaction receipt from hub manager
4. Call support with receipt number if still missing

**Escalation:**
- Hub manager should resolve immediately
- If not resolved: Call +233 (0)30 212 3456
- Email: support@sankofa.org
- Include: date, hub, transaction ID, amount

**We take payment issues very seriously - you'll be made whole!**`,

  disputeResolution: `⚖️ **Resolving Disputes:**

**Common Issues:**
- Disagreement on plastic weight
- Classification of plastic type
- Payment calculation errors
- Hub manager behavior concerns
- Damaged plastic rejection

**Resolution Process:**

**Step 1: Talk to Hub Manager**
- Most issues resolved immediately
- Hub manager can re-check, re-weigh, explain
- Professional and respectful conversation

**Step 2: Request Second Opinion**
- Another hub staff member reviews
- Re-weigh if needed
- Check classification together

**Step 3: Contact Regional Coordinator**
- If not resolved at hub level
- Call support hotline: +233 (0)30 212 3456
- Provide details: date, hub, issue, people involved
- Coordinator investigates within 24 hours

**Step 4: Formal Complaint**
- Email: complaints@sankofa.org
- Include all documentation
- Photos/videos if relevant
- Response within 48 hours

**Your Rights:**
- Fair and accurate weighing
- Correct payment for plastic delivered
- Respectful treatment
- Timely resolution
- Appeal decisions

**Hub Manager Conduct:**
- Report unprofessional behavior
- Confidential reporting available
- Zero tolerance for discrimination
- Action taken within 48 hours`,

  technicalSupport: `🛠️ **Technical Support:**

**USSD Not Working:**
- Ensure you have airtime/credit
- Try again after 1 minute
- Works on all networks (MTN, Vodafone, AirtelTigo)
- Contact: +233 (0)30 212 3456

**Mobile App Issues:**
- Clear app cache
- Update to latest version
- Check internet connection
- Reinstall app
- Email: apphelp@sankofa.org

**SMS Not Receiving:**
- Check your phone's message storage
- Verify number is correctly registered
- Update number at hub
- Some networks delay SMS (wait 5 minutes)

**Account Access Problems:**
- Reset via USSD (*800*726563#)
- Visit hub for manual reset
- Verify identity (ID + phone number)
- Call support hotline

**Payment System Issues:**
- Hub manager will record manually
- Payment processed as soon as system restored
- SMS receipt still sent
- Never lose your earnings

**Website Down:**
- Try again later
- Use USSD as backup
- Mobile app may still work
- Check our social media for updates

**24/7 Support Hotline: +233 (0)30 212 3456**`,

  feedback: `💬 **Give Us Feedback:**

**We want to hear from you!**

**What's Working Well?**
- Share success stories
- Praise great hub managers
- Highlight positive experiences
- Help us recognize excellence

**What Needs Improvement?**
- Service quality issues
- System problems
- New feature requests
- Process improvements

**How to Share Feedback:**

**SMS:** Send to 1234
- Format: FEEDBACK [your message]
- Example: "FEEDBACK Hub manager Ama is very helpful"

**USSD:** *800*726563# → Menu option 6

**Email:** feedback@sankofa.org

**Social Media:**
- Comment on posts
- Send direct messages
- Use hashtag #SankofaFeedback

**In Person:**
- Tell your hub manager
- Attend community meetings
- Suggestion box at hubs

**Surveys:**
- Quarterly collector satisfaction surveys
- Win prizes for participating!
- Your voice shapes our future

**Every voice matters** - your feedback helps us serve you better!`,

  // ==================== SPECIAL PROGRAMS ====================
  
  youthProgram: `👦👧 **Youth & Student Programs:**

**After-School Collection:**
- Special hours: 3pm-6pm on weekdays
- Youth-only collection times
- Supervised collection events
- Safety training provided

**School Partnerships:**
- Whole school cleanup campaigns
- Classroom recycling programs
- Environmental education workshops
- Science fair projects with Sankofa data

**Student Benefits:**
- Flexible collection schedules
- Academic sponsorships for top youth collectors
- Leadership training opportunities
- Internship programs (age 18+)

**Youth Competitions:**
- Monthly collection challenges
- Team competitions
- Prizes: Tablets, bicycles, school supplies
- Recognition certificates

**Parental Consent Required for Under 16:**
- Parent visits hub to sign consent
- Or parent calls hub manager
- SMS consent (in some cases)

**Building Future Leaders:**
Many of our hub managers started as youth collectors!`,

  womenEmpowerment: `👩 **Women Empowerment Initiatives:**

**Why Women?**
- 65% of our collectors are women
- Primary income earners for families
- Leaders in community cleanup
- Champions of health and environment

**Special Support:**
- Women-only collection groups
- Childcare consideration (bring children to hubs)
- Flexible hours for family responsibilities
- Priority healthcare access (maternal health)

**Women's Groups:**
- Weekly meetups
- Share collection strategies
- Savings circles
- Business training workshops

**Leadership Opportunities:**
- 50% of hub managers are women
- Women in leadership program
- Mentorship from experienced collectors
- Regional coordinator positions

**Health Focus:**
- Free maternal health screenings
- Family planning information
- Nutrition counseling
- Women's health tokens

**Success Stories:**
"I was a stay-at-home mom. Now I'm a top collector, earning GHS 700/month, and my children's school fees are paid. I'm also teaching other women in my community!" - Adjoa, Accra

**Women leading the way to a cleaner, healthier Ghana!**`,

  disabilityInclusion: `♿ **Disability Inclusion:**

**Everyone Can Participate:**

**Accessibility:**
- Wheelchair-accessible hubs
- Visual guides for deaf collectors
- Audio assistance for blind collectors
- Sign language support at major hubs

**Adapted Processes:**
- Assistants welcome (family/friends)
- Home pickup for bulk collections (mobility issues)
- Visual plastic identification charts
- Tactile sorting guides

**Flexible Requirements:**
- Voice registration (no writing needed)
- Alternative ID methods
- Shared/family phone numbers OK
- Photo ID not required

**Specialized Support:**
- Dedicated staff training
- Partnership with disability organizations
- Special equipment available
- Adaptive tools provided

**Equal Opportunity:**
- Same payment rates
- Same benefits and bonuses
- Leadership opportunities
- Full participation in community

**Partnerships:**
- Ghana Federation of Disability Organizations
- Local disability support groups
- Accessible transport services
- Community volunteers

**Contact us** to discuss specific accommodations - we're here to help!`,

  // ==================== FAQ CATCH-ALL ====================
  
  greeting: `Hello! 👋 I'm your Sankofa AI assistant. I can help you with:

📦 **Plastic Collection** - How to collect, what we accept, payment rates
🏢 **Collection Hubs** - Find hubs near you, hours, contact info  
💰 **Earnings & Payment** - How payment works, rates, savings options
🏥 **Health Insights** - How we predict disease, protect privacy
🤝 **Getting Started** - Become a collector, hub manager info
🔒 **Data & Privacy** - How we protect your information
⚙️ **Technology** - USSD, mobile app, blockchain explained
🌍 **Impact** - Environmental and community benefits
❓ **Support** - Troubleshooting, disputes, feedback

**What would you like to know more about?**`,

  default: `Thank you for your question! I'd be happy to help you learn more about Sankofa.

**Popular Questions:**
❓ "How do I become a collector?"
❓ "What plastic types do you accept?"
❓ "How much can I earn?"
❓ "Where is the nearest collection hub?"
❓ "How does payment work?"
❓ "Is my data safe?"
❓ "How does health prediction work?"
❓ "Can I use the app without internet?"

**Need More Help?**
📞 Call: +233 (0)30 212 3456
📱 USSD: *800*726563#
📧 Email: support@sankofa.org
🌐 Visit: sankofa.org

**Ask me anything about Sankofa!** I'm here to help 24/7.`
};

// Keyword matching system with comprehensive coverage
const matchQuestion = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.match(/^(hello|hi|hey|greetings|good morning|good afternoon|good evening|start|help)$/i)) {
    return chatbotResponses.greeting;
  }
  
  // How Sankofa Works & Mission
  if (lowerMessage.match(/how (does|do) (sankofa|this|it) work|what (is|does) sankofa|tell me about sankofa|explain sankofa|how it works/i)) {
    return chatbotResponses.howItWorks;
  }
  if (lowerMessage.match(/mission|purpose|goal|why sankofa|what.*for/i)) {
    return chatbotResponses.mission;
  }
  if (lowerMessage.match(/who (are you|is sankofa)|about (sankofa|you)|history|founded|company/i)) {
    return chatbotResponses.whoWeAre;
  }
  
  // Becoming a Collector
  if (lowerMessage.match(/become.*collector|how.*(join|register|sign up|start)|new collector|register|registration|join sankofa/i)) {
    return chatbotResponses.becomeCollector;
  }
  if (lowerMessage.match(/requirement|what.*(need|require)|document|id needed|qualifications/i)) {
    return chatbotResponses.registrationRequirements;
  }
  if (lowerMessage.match(/benefit|advantage|why (become|join)|what.*get|perks|rewards/i)) {
    return chatbotResponses.collectorBenefits;
  }
  if (lowerMessage.match(/age|how old|young|child|kid|minor|youth/i)) {
    return chatbotResponses.ageRequirements;
  }
  
  // Plastic Types & Sorting
  if (lowerMessage.match(/plastic (type|kind)|what plastic|which plastic|accept|pet|hdpe|ldpe|bottle|container/i)) {
    return chatbotResponses.plasticTypes;
  }
  if (lowerMessage.match(/identify|how.*(tell|know|recognize)|difference|distinguish/i)) {
    return chatbotResponses.howToIdentifyPlastic;
  }
  if (lowerMessage.match(/clean|wash|rinse|dirty|preparation|prepare/i)) {
    return chatbotResponses.plasticCleanliness;
  }
  if (lowerMessage.match(/not accept|don't accept|reject|what not|avoid|can't collect/i)) {
    return chatbotResponses.whatNotToCollect;
  }
  if (lowerMessage.match(/sort|sorting|organize|separate|tips.*collect/i)) {
    return chatbotResponses.sortingTips;
  }
  
  // Payment & Earnings
  if (lowerMessage.match(/rate|price|pay.*much|how much|cost|value per/i)) {
    return chatbotResponses.paymentRates;
  }
  if (lowerMessage.match(/how.*payment|payment process|get paid|receive money|cash/i)) {
    return chatbotResponses.howPaymentWorks;
  }
  if (lowerMessage.match(/mobile money|momo|mtn|vodafone|airtel/i)) {
    return chatbotResponses.mobileMoneyPayment;
  }
  if (lowerMessage.match(/token|saving|health token|healthcare token/i)) {
    return chatbotResponses.savingsTokens;
  }
  if (lowerMessage.match(/earn more|maximize|make more|increase earning|best way|most money/i)) {
    return chatbotResponses.maximizeEarnings;
  }
  if (lowerMessage.match(/referral|refer|bring friend|bonus.*friend/i)) {
    return chatbotResponses.referralProgram;
  }
  
  // Collection Hubs
  if (lowerMessage.match(/hub|location|where|find.*hub|nearest|address|branch/i)) {
    return chatbotResponses.collectionHubs;
  }
  if (lowerMessage.match(/hour|time|when.*open|schedule|operating|closed/i)) {
    return chatbotResponses.hubHours;
  }
  if (lowerMessage.match(/hub manager|manager.*do|manager.*role/i)) {
    return chatbotResponses.hubManagerRole;
  }
  if (lowerMessage.match(/become.*manager|manager.*opportunity|apply.*manager/i)) {
    return chatbotResponses.becomeHubManager;
  }
  
  // Health & Safety
  if (lowerMessage.match(/health.*predict|prediction|disease|outbreak|ai.*health|how.*health/i)) {
    return chatbotResponses.healthPrediction;
  }
  if (lowerMessage.match(/privacy|data|secure|protection|safe.*data|confidential|personal information/i)) {
    return chatbotResponses.privacyDataSecurity;
  }
  if (lowerMessage.match(/safety|safe|danger|risk|injury|accident|protective|glove/i)) {
    return chatbotResponses.safetyGuidelines;
  }
  if (lowerMessage.match(/healthcare|medical|clinic|doctor|hospital|use token/i)) {
    return chatbotResponses.healthcareAccess;
  }
  
  // Technology
  if (lowerMessage.match(/ussd|dial|code|\*800|phone.*code|no smartphone/i)) {
    return chatbotResponses.ussdAccess;
  }
  if (lowerMessage.match(/app|mobile app|download|android|ios|application/i)) {
    return chatbotResponses.mobileApp;
  }
  if (lowerMessage.match(/blockchain|transparent|verify|record|ledger/i)) {
    return chatbotResponses.blockchain;
  }
  if (lowerMessage.match(/ai|artificial intelligence|machine learning|technology|smart/i)) {
    return chatbotResponses.aiTechnology;
  }
  
  // Community & Impact
  if (lowerMessage.match(/impact|environment|pollution|ocean|ecosystem|clean/i)) {
    return chatbotResponses.environmentalImpact;
  }
  if (lowerMessage.match(/event|activity|meetup|community|celebration|competition/i)) {
    return chatbotResponses.communityEvents;
  }
  if (lowerMessage.match(/success|story|testimonial|example|achievement/i)) {
    return chatbotResponses.successStories;
  }
  if (lowerMessage.match(/social media|facebook|instagram|twitter|whatsapp|follow/i)) {
    return chatbotResponses.socialMedia;
  }
  
  // Troubleshooting & Support
  if (lowerMessage.match(/lost.*id|forgot.*id|card.*lost|missing.*card/i)) {
    return chatbotResponses.lostCollectorID;
  }
  if (lowerMessage.match(/payment.*problem|didn't.*receive|wrong.*amount|payment.*issue/i)) {
    return chatbotResponses.paymentIssues;
  }
  if (lowerMessage.match(/dispute|complaint|disagree|problem.*manager|conflict/i)) {
    return chatbotResponses.disputeResolution;
  }
  if (lowerMessage.match(/technical|system.*down|app.*not.*work|ussd.*not.*work/i)) {
    return chatbotResponses.technicalSupport;
  }
  if (lowerMessage.match(/feedback|suggestion|improve|opinion|comment/i)) {
    return chatbotResponses.feedback;
  }
  
  // Special Programs
  if (lowerMessage.match(/youth|student|school|young|teen|kids program/i)) {
    return chatbotResponses.youthProgram;
  }
  if (lowerMessage.match(/women|woman|female|mother|gender/i)) {
    return chatbotResponses.womenEmpowerment;
  }
  if (lowerMessage.match(/disability|disabled|wheelchair|blind|deaf|accessible/i)) {
    return chatbotResponses.disabilityInclusion;
  }
  
  // Default
  return chatbotResponses.default;
};

module.exports = { chatbotResponses, matchQuestion };
