import { Ministry, Volunteer, ServicePlan, Sermon, SermonSeries, ReminderTemplate, ReminderRecipientLog } from '../types';

export const INITIAL_MINISTRIES: Ministry[] = [
  {
    id: 'worship',
    name: 'Worship Band & Vocals',
    iconName: 'Music',
    color: '#6366f1', // Indigo
    description: 'Vocalists, acoustic/electric guitars, keys, drums, bass, and worship leaders.',
    teamLeader: 'Marcus Rivera',
    roles: ['Worship Leader', 'Vocalist (Soprano)', 'Vocalist (Alto)', 'Acoustic Guitar', 'Electric Guitar', 'Keys / Synth', 'Bass Guitar', 'Drums', 'Cello / Strings']
  },
  {
    id: 'production',
    name: 'Audio, Visual & Tech',
    iconName: 'Sliders',
    color: '#0ea5e9', // Sky
    description: 'FOH Sound engineer, Broadcast audio mix, ProPresenter visual graphics, Lighting, and Camera operators.',
    teamLeader: 'David Chen',
    roles: ['FOH Audio Engineer', 'Broadcast Sound', 'ProPresenter Lyrics & Media', 'Lighting Tech', 'Livestream Director', 'Stage Camera 1', 'Stage Camera 2']
  },
  {
    id: 'kids',
    name: 'Kingdom Kids Ministry',
    iconName: 'Smile',
    color: '#10b981', // Emerald
    description: 'Nursery (0-2), Preschool (3-5), Elementary (K-5th), Check-in Kiosk coordinator.',
    teamLeader: 'Sarah Jenkins',
    roles: ['Kids Check-In Host', 'Nursery Caregiver (0-2)', 'Preschool Teacher (3-5)', 'Elementary Lead (K-5)', 'Kids Worship Leader', 'Kids Helper']
  },
  {
    id: 'hospitality',
    name: 'Welcome & Cafe',
    iconName: 'Coffee',
    color: '#f59e0b', // Amber
    description: 'Foyer greeters, Barista coffee station, Newcomers welcome lounge, and Connection corner.',
    teamLeader: 'Elena Rostova',
    roles: ['Main Foyer Greeter', 'Courtyard Host', 'Barista Lead', 'Barista Helper', 'Newcomers Lounge Host', 'Information Desk']
  },
  {
    id: 'ushers',
    name: 'Ushers & Safety Team',
    iconName: 'Shield',
    color: '#8b5cf6', // Purple
    description: 'Auditorium seating, Offering collection, Communion distribution, Headcount tally, and Medical/Safety response.',
    teamLeader: 'Robert Hayes',
    roles: ['Lead Usher', 'Auditorium Usher (Left)', 'Auditorium Usher (Right)', 'Balcony Usher', 'Headcount Counter', 'Safety / First Aid Lead']
  },
  {
    id: 'prayer',
    name: 'Altar & Prayer Ministry',
    iconName: 'HeartHandshake',
    color: '#ec4899', // Pink
    description: 'Post-service prayer partners, altar team, and pre-service prayer intercessors.',
    teamLeader: 'Grace Adebayo',
    roles: ['Pre-Service Intercessor', 'Altar Prayer Team (Men)', 'Altar Prayer Team (Women)', 'Online Prayer Chat Host']
  },
  {
    id: 'youth',
    name: 'Ignite Youth',
    iconName: 'Flame',
    color: '#ef4444', // Red
    description: 'Junior high & High school small group leaders, youth event logistics, and mentorship.',
    teamLeader: 'Jordan Tyler',
    roles: ['Youth Small Group Leader (Guys)', 'Youth Small Group Leader (Girls)', 'Youth Tech & Games', 'Youth Hospitality']
  }
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-1',
    name: 'Marcus Rivera',
    email: 'marcus.rivera@gracechurch.org',
    phone: '(555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ministries: ['worship'],
    roles: ['Worship Leader', 'Acoustic Guitar', 'Vocalist (Soprano)'],
    status: 'active',
    preferredFrequency: 'every_week',
    blockoutDates: [
      { id: 'bo-1', startDate: '2026-09-12', endDate: '2026-09-15', reason: 'Family Vacation' }
    ],
    totalServicesServed: 48,
    joinedDate: '2023-01-15',
    notes: 'Primary worship director. Key of G/D preference.'
  },
  {
    id: 'vol-2',
    name: 'Chloe Bennett',
    email: 'chloe.b@gmail.com',
    phone: '(555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    ministries: ['worship'],
    roles: ['Vocalist (Alto)', 'Worship Leader'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [],
    totalServicesServed: 32,
    joinedDate: '2023-06-10',
    notes: 'Strong harmony lead, also leads acoustic sets.'
  },
  {
    id: 'vol-3',
    name: 'Lucas Sterling',
    email: 'lucas.keys@yahoo.com',
    phone: '(555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ministries: ['worship'],
    roles: ['Keys / Synth', 'Acoustic Guitar'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [
      { id: 'bo-2', startDate: '2026-08-30', endDate: '2026-09-02', reason: 'Out of town conference' }
    ],
    totalServicesServed: 29,
    joinedDate: '2023-04-20',
    notes: 'Nord Stage 3 keyboardist. Handles MainStage ambient pads.'
  },
  {
    id: 'vol-4',
    name: 'David Chen',
    email: 'david.chen.tech@gmail.com',
    phone: '(555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ministries: ['production'],
    roles: ['FOH Audio Engineer', 'Livestream Director'],
    status: 'active',
    preferredFrequency: 'every_week',
    blockoutDates: [],
    totalServicesServed: 64,
    joinedDate: '2022-09-01',
    notes: 'Lead AV Director. Allen & Heath dLive / Dante certified.'
  },
  {
    id: 'vol-5',
    name: 'Maya Patel',
    email: 'maya.patel@outlook.com',
    phone: '(555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    ministries: ['production'],
    roles: ['ProPresenter Lyrics & Media', 'Lighting Tech'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [],
    totalServicesServed: 22,
    joinedDate: '2024-02-11',
    notes: 'ProPresenter 7 wizard. Fast at live sermon scripture changes.'
  },
  {
    id: 'vol-6',
    name: 'Sammy "Groove" Miller',
    email: 'sammy.drums@gmail.com',
    phone: '(555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    ministries: ['worship'],
    roles: ['Drums', 'Bass Guitar'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [],
    totalServicesServed: 41,
    joinedDate: '2023-03-01',
    notes: 'Drums with click track and Ableton Live cues.'
  },
  {
    id: 'vol-7',
    name: 'Sarah Jenkins',
    email: 'sarah.j.kids@gmail.com',
    phone: '(555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ministries: ['kids'],
    roles: ['Elementary Lead (K-5)', 'Kids Check-In Host'],
    status: 'active',
    preferredFrequency: 'every_week',
    blockoutDates: [],
    totalServicesServed: 55,
    joinedDate: '2022-10-15',
    notes: 'Elementary coordinator. Certified background check clear 2026.'
  },
  {
    id: 'vol-8',
    name: 'Hannah Morales',
    email: 'hannah.m@yahoo.com',
    phone: '(555) 901-2345',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ministries: ['kids'],
    roles: ['Preschool Teacher (3-5)', 'Nursery Caregiver (0-2)'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [],
    totalServicesServed: 18,
    joinedDate: '2024-05-19',
    notes: 'Preschool crafts leader.'
  },
  {
    id: 'vol-9',
    name: 'Elena Rostova',
    email: 'elena.cafe@gracechurch.org',
    phone: '(555) 012-3456',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    ministries: ['hospitality'],
    roles: ['Barista Lead', 'Main Foyer Greeter', 'Newcomers Lounge Host'],
    status: 'active',
    preferredFrequency: 'every_week',
    blockoutDates: [],
    totalServicesServed: 50,
    joinedDate: '2023-01-05',
    notes: 'Oversees morning espresso bar and hospitality team supplies.'
  },
  {
    id: 'vol-10',
    name: 'Robert Hayes',
    email: 'robert.hayes.safety@gmail.com',
    phone: '(555) 123-9876',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ministries: ['ushers'],
    roles: ['Lead Usher', 'Safety / First Aid Lead', 'Headcount Counter'],
    status: 'active',
    preferredFrequency: 'every_week',
    blockoutDates: [],
    totalServicesServed: 70,
    joinedDate: '2022-04-10',
    notes: 'CPR & AED certified. Manages door headcount tracking.'
  },
  {
    id: 'vol-11',
    name: 'Grace Adebayo',
    email: 'grace.adebayo@prayerline.org',
    phone: '(555) 234-8765',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    ministries: ['prayer'],
    roles: ['Pre-Service Intercessor', 'Altar Prayer Team (Women)'],
    status: 'active',
    preferredFrequency: 'every_week',
    blockoutDates: [],
    totalServicesServed: 38,
    joinedDate: '2023-08-01',
    notes: 'Coordinates Sunday 8:15 AM prayer circle.'
  },
  {
    id: 'vol-12',
    name: 'Jordan Tyler',
    email: 'jordan.tyler.youth@gmail.com',
    phone: '(555) 345-7654',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    ministries: ['youth', 'production'],
    roles: ['Youth Small Group Leader (Guys)', 'Stage Camera 1'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [],
    totalServicesServed: 26,
    joinedDate: '2024-01-10',
    notes: 'High energy youth leader and camera op.'
  },
  {
    id: 'vol-13',
    name: 'Ethan Wright',
    email: 'ethan.electric@gmail.com',
    phone: '(555) 456-6543',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    ministries: ['worship'],
    roles: ['Electric Guitar', 'Acoustic Guitar'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [],
    totalServicesServed: 24,
    joinedDate: '2024-03-15',
    notes: 'Line 6 Helix modeler. Great with ambient swells and drive.'
  },
  {
    id: 'vol-14',
    name: 'Brianna Fox',
    email: 'brianna.fox@gmail.com',
    phone: '(555) 567-5432',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    ministries: ['hospitality', 'ushers'],
    roles: ['Main Foyer Greeter', 'Auditorium Usher (Left)'],
    status: 'active',
    preferredFrequency: 'every_2_weeks',
    blockoutDates: [],
    totalServicesServed: 19,
    joinedDate: '2024-04-01',
    notes: 'Warm smile, greets first-time families.'
  },
  {
    id: 'vol-15',
    name: 'Pastor Thomas Vance',
    email: 'thomas.vance@gracechurch.org',
    phone: '(555) 999-1122',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    ministries: ['prayer'],
    roles: ['Lead Pastor', 'Altar Prayer Team (Men)'],
    status: 'active',
    preferredFrequency: 'every_week',
    blockoutDates: [],
    totalServicesServed: 95,
    joinedDate: '2020-01-01',
    notes: 'Senior Teaching Pastor.'
  }
];

export const INITIAL_SERMON_SERIES: SermonSeries[] = [
  {
    id: 'series-rooted',
    title: 'Rooted: Unshakable Faith in a Shifting World',
    description: 'A 6-week verse-by-verse exploration through the Epistle to the Colossians, establishing Christ as preeminent over every aspect of modern life.',
    startDate: '2026-08-02',
    endDate: '2026-09-06',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    totalMessages: 6,
    themeColor: '#059669'
  },
  {
    id: 'series-kingdom-generosity',
    title: 'The Generous Life: Treasures of Heaven',
    description: 'Examining what Jesus taught regarding stewardship, open-handed living, and investing in eternal kingdom impact.',
    startDate: '2026-07-05',
    endDate: '2026-07-26',
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    totalMessages: 4,
    themeColor: '#d97706'
  },
  {
    id: 'series-holy-spirit',
    title: 'Breath & Fire: Walking in the Spirit',
    description: 'Understanding the gifts, fruits, and daily empowering presence of the Holy Spirit.',
    startDate: '2026-05-31',
    endDate: '2026-06-28',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    totalMessages: 5,
    themeColor: '#dc2626'
  }
];

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 'sermon-1',
    title: 'Rooted in Christ: Supremacy & Sufficiency',
    seriesId: 'series-rooted',
    seriesTitle: 'Rooted: Unshakable Faith in a Shifting World',
    seriesGraphicUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    speaker: 'Pastor Thomas Vance',
    speakerRole: 'Senior Pastor',
    date: '2026-08-23',
    scripture: 'Colossians 1:15-23',
    summary: 'When culture shakes and identity feels uncertain, our firm anchor is the cosmic preeminence of Jesus Christ. He is before all things, and in Him all things hold together.',
    keyPoints: [
      'Jesus is the visible image of the invisible God and creator of all realms.',
      'Reconciliation is accomplished solely through the blood of His cross.',
      'We are called to continue steadfast and grounded in hope.'
    ],
    attendanceRecord: 342,
    audioDuration: '38:12',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    slidesUrl: 'https://slides.google.com',
    tags: ['Colossians', 'Christology', 'Faith', 'Identity']
  },
  {
    id: 'sermon-2',
    title: 'Mystery Revealed: Christ in You, the Hope of Glory',
    seriesId: 'series-rooted',
    seriesTitle: 'Rooted: Unshakable Faith in a Shifting World',
    seriesGraphicUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    speaker: 'Pastor Thomas Vance',
    speakerRole: 'Senior Pastor',
    date: '2026-08-16',
    scripture: 'Colossians 1:24-2:5',
    summary: 'Paul shares his stewardship and agony for the believers: that their hearts may be encouraged and knit together in love, possessing all riches of full assurance.',
    keyPoints: [
      'Suffering for the Gospel participates in Christ\'s kingdom advancement.',
      'The mystery kept hidden for ages is now indwelling believers.',
      'Maturity means standing firm against enticing, deceptive arguments.'
    ],
    attendanceRecord: 318,
    audioDuration: '36:45',
    tags: ['Colossians', 'Discipleship', 'Mystery', 'Hope']
  },
  {
    id: 'sermon-3',
    title: 'Alive with Him: Nailed to the Cross',
    seriesId: 'series-rooted',
    seriesTitle: 'Rooted: Unshakable Faith in a Shifting World',
    seriesGraphicUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    speaker: 'Guest Speaker Dr. Aris Thorne',
    speakerRole: 'Theological Professor',
    date: '2026-08-09',
    scripture: 'Colossians 2:6-15',
    summary: 'As you received Christ Jesus the Lord, so walk in Him, rooted and built up in Him. The record of debt that stood against us with its legal demands was nailed to the cross.',
    keyPoints: [
      'Beware of vain philosophies built on human traditions rather than Christ.',
      'In Christ dwelleth all the fullness of the Godhead bodily.',
      'The record of guilt has been cancelled completely.'
    ],
    attendanceRecord: 326,
    audioDuration: '41:10',
    tags: ['Cross', 'Colossians', 'Grace', 'Freedom']
  },
  {
    id: 'sermon-4',
    title: 'Open Hands, Open Heart: The Widow\'s Mite',
    seriesId: 'series-kingdom-generosity',
    seriesTitle: 'The Generous Life: Treasures of Heaven',
    seriesGraphicUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    speaker: 'Pastor Thomas Vance',
    speakerRole: 'Senior Pastor',
    date: '2026-07-26',
    scripture: 'Mark 12:41-44',
    summary: 'God measures our generosity not by the quantity of the gift, but by the proportion of trust behind it.',
    keyPoints: [
      'Jesus watches the heart behind giving.',
      'Sacrificial generosity breaks the hold of mammon.',
      'God provides seed to the sower and bread for food.'
    ],
    attendanceRecord: 305,
    audioDuration: '34:20',
    tags: ['Generosity', 'Giving', 'Trust', 'Gospel']
  }
];

export const INITIAL_SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'plan-2026-08-23-contemporary',
    title: 'Sunday Contemporary Service',
    serviceType: 'Sunday Contemporary 11:15 AM',
    date: '2026-08-23',
    serviceStartTime: '11:15',
    callTime: '09:45',
    rehearsalTime: '10:00',
    status: 'published',
    sermonTitle: 'Rooted in Christ: Supremacy & Sufficiency',
    preacher: 'Pastor Thomas Vance',
    scripturePassage: 'Colossians 1:15-23',
    seriesId: 'series-rooted',
    seriesName: 'Rooted: Unshakable Faith',
    themeColor: '#4f46e5',
    notes: 'Baptisms scheduled at 11:45 AM during response song. Audio team please prepare 2 waterproof lavs.',
    runSheet: [
      {
        id: 'item-1',
        type: 'video',
        title: '5-Minute Service Countdown & Opener',
        durationMinutes: 5,
        durationSeconds: 0,
        presenter: 'Production Booth',
        notes: 'Fade house lights to 30% at 1-minute mark. Audio cue track 1.'
      },
      {
        id: 'item-2',
        type: 'welcome',
        title: 'Welcome & Opening Call to Worship',
        durationMinutes: 3,
        durationSeconds: 30,
        presenter: 'Marcus Rivera',
        notes: 'Read Psalm 95:1-3. Welcome first-time guests.'
      },
      {
        id: 'item-3',
        type: 'song',
        title: 'Gratitude (Brandon Lake)',
        durationMinutes: 5,
        durationSeconds: 45,
        presenter: 'Marcus Rivera & Band',
        songDetails: {
          key: 'B',
          bpm: 78,
          timeSig: '6/8',
          author: 'Brandon Lake, Dante Bowe, Benjamin Hastings',
          ccli: '7138599',
          chordChartUrl: 'https://praisecharts.com'
        },
        notes: 'Build into bridge 2 with full dynamic drums.'
      },
      {
        id: 'item-4',
        type: 'song',
        title: 'King of Kings (Hillsong Worship)',
        durationMinutes: 4,
        durationSeconds: 30,
        presenter: 'Chloe Bennett',
        songDetails: {
          key: 'D',
          bpm: 68,
          timeSig: '4/4',
          author: 'Brooke Ligertwood, Jason Ingram, Scott Ligertwood',
          ccli: '7127647'
        },
        notes: 'Chloe leads verse 1 & 2. Acoustic & soft pads only in V1.'
      },
      {
        id: 'item-5',
        type: 'song',
        title: 'Living Hope (Phil Wickham)',
        durationMinutes: 5,
        durationSeconds: 15,
        presenter: 'Marcus & Team',
        songDetails: {
          key: 'Eb',
          bpm: 72,
          timeSig: '4/4',
          author: 'Phil Wickham, Brian Johnson',
          ccli: '7106807'
        },
        notes: 'Direct transition into pastoral prayer.'
      },
      {
        id: 'item-6',
        type: 'prayer',
        title: 'Pastoral Prayer & Ministry Highlight',
        durationMinutes: 4,
        durationSeconds: 0,
        presenter: 'Grace Adebayo',
        notes: 'Pray for city missions team and family camp.'
      },
      {
        id: 'item-7',
        type: 'announcements',
        title: 'Kingdom Kids Dismissal & Announcements',
        durationMinutes: 3,
        durationSeconds: 0,
        presenter: 'Sarah Jenkins',
        notes: 'Play Fall Retreat video clip.'
      },
      {
        id: 'item-8',
        type: 'sermon',
        title: 'Sermon: Rooted in Christ: Supremacy & Sufficiency',
        durationMinutes: 35,
        durationSeconds: 0,
        presenter: 'Pastor Thomas Vance',
        notes: 'Colossians 1:15-23. Display slide cues 1-14 on ProPresenter.'
      },
      {
        id: 'item-9',
        type: 'song',
        title: 'Response / Communion: Christ Our Hope in Life and Death',
        durationMinutes: 6,
        durationSeconds: 0,
        presenter: 'Worship Team',
        songDetails: {
          key: 'G',
          bpm: 76,
          timeSig: '3/4',
          author: 'Keith Getty, Matt Boswell, Jordan Kauflin',
          ccli: '7147502'
        },
        notes: 'Ushers prepare communion trays. Altar prayer team step forward.'
      },
      {
        id: 'item-10',
        type: 'benediction',
        title: 'Benediction & Sending Blessing',
        durationMinutes: 2,
        durationSeconds: 0,
        presenter: 'Pastor Thomas Vance',
        notes: 'Invite newcomers to Cafe lounge for coffee.'
      }
    ],
    positions: [
      {
        id: 'pos-1',
        ministryId: 'worship',
        roleName: 'Worship Leader',
        volunteerId: 'vol-1',
        volunteerName: 'Marcus Rivera',
        volunteerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '09:45',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-2',
        ministryId: 'worship',
        roleName: 'Vocalist (Alto)',
        volunteerId: 'vol-2',
        volunteerName: 'Chloe Bennett',
        volunteerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '09:45',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-3',
        ministryId: 'worship',
        roleName: 'Keys / Synth',
        volunteerId: 'vol-3',
        volunteerName: 'Lucas Sterling',
        volunteerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '09:45',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-4',
        ministryId: 'worship',
        roleName: 'Electric Guitar',
        volunteerId: 'vol-13',
        volunteerName: 'Ethan Wright',
        volunteerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        status: 'unconfirmed',
        callTime: '09:45',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-5',
        ministryId: 'worship',
        roleName: 'Drums',
        volunteerId: 'vol-6',
        volunteerName: 'Sammy "Groove" Miller',
        volunteerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '09:45',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-6',
        ministryId: 'production',
        roleName: 'FOH Audio Engineer',
        volunteerId: 'vol-4',
        volunteerName: 'David Chen',
        volunteerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '09:30',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-7',
        ministryId: 'production',
        roleName: 'ProPresenter Lyrics & Media',
        volunteerId: 'vol-5',
        volunteerName: 'Maya Patel',
        volunteerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '10:00',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-8',
        ministryId: 'kids',
        roleName: 'Elementary Lead (K-5)',
        volunteerId: 'vol-7',
        volunteerName: 'Sarah Jenkins',
        volunteerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '10:30',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-9',
        ministryId: 'hospitality',
        roleName: 'Barista Lead',
        volunteerId: 'vol-9',
        volunteerName: 'Elena Rostova',
        volunteerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '10:15',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-10',
        ministryId: 'ushers',
        roleName: 'Lead Usher',
        volunteerId: 'vol-10',
        volunteerName: 'Robert Hayes',
        volunteerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '10:30',
        reminderSentAt: '2026-08-20 09:00'
      },
      {
        id: 'pos-11',
        ministryId: 'prayer',
        roleName: 'Altar Prayer Team (Women)',
        volunteerId: 'vol-11',
        volunteerName: 'Grace Adebayo',
        volunteerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
        status: 'confirmed',
        callTime: '10:45',
        reminderSentAt: '2026-08-20 09:00'
      }
    ],
    attendance: {
      adults: 215,
      kids: 58,
      youth: 34,
      volunteers: 35,
      online: 112,
      firstTimers: 14,
      givingSnapshot: 8450,
      notes: 'Sunny warm morning. Strong visitor count in foyer lounge.',
      weather: 'Sunny, 74°F',
      recordedAt: '2026-08-23 12:45',
      recordedBy: 'Robert Hayes'
    }
  },
  {
    id: 'plan-2026-08-23-traditional',
    title: 'Sunday Morning Traditional Service',
    serviceType: 'Sunday Traditional 9:00 AM',
    date: '2026-08-23',
    serviceStartTime: '09:00',
    callTime: '08:00',
    rehearsalTime: '08:15',
    status: 'published',
    sermonTitle: 'Rooted in Christ: Supremacy & Sufficiency',
    preacher: 'Pastor Thomas Vance',
    scripturePassage: 'Colossians 1:15-23',
    seriesId: 'series-rooted',
    seriesName: 'Rooted: Unshakable Faith',
    themeColor: '#059669',
    runSheet: [
      {
        id: 't-1',
        type: 'welcome',
        title: 'Organ Prelude & Call to Worship',
        durationMinutes: 4,
        durationSeconds: 0,
        presenter: 'Lucas Sterling',
        notes: 'Choral Introit'
      },
      {
        id: 't-2',
        type: 'song',
        title: 'Great Is Thy Faithfulness',
        durationMinutes: 4,
        durationSeconds: 30,
        presenter: 'Choir & Congregation',
        songDetails: { key: 'D', bpm: 84, timeSig: '3/4', author: 'Thomas Chisholm', ccli: '18723' }
      },
      {
        id: 't-3',
        type: 'prayer',
        title: 'Corporate Confession & Assurance of Pardon',
        durationMinutes: 3,
        durationSeconds: 0,
        presenter: 'Grace Adebayo'
      },
      {
        id: 't-4',
        type: 'song',
        title: 'Be Thou My Vision',
        durationMinutes: 4,
        durationSeconds: 0,
        presenter: 'Congregation',
        songDetails: { key: 'Eb', bpm: 90, timeSig: '3/4', author: 'Eleanor Hull', ccli: '30639' }
      },
      {
        id: 't-5',
        type: 'sermon',
        title: 'Sermon: Rooted in Christ',
        durationMinutes: 30,
        durationSeconds: 0,
        presenter: 'Pastor Thomas Vance'
      },
      {
        id: 't-6',
        type: 'communion',
        title: 'The Lord\'s Supper & Doxology',
        durationMinutes: 8,
        durationSeconds: 0,
        presenter: 'Pastor Vance & Elders'
      }
    ],
    positions: [
      {
        id: 'tpos-1',
        ministryId: 'worship',
        roleName: 'Keys / Synth',
        volunteerId: 'vol-3',
        volunteerName: 'Lucas Sterling',
        status: 'confirmed',
        callTime: '08:00'
      },
      {
        id: 'tpos-2',
        ministryId: 'production',
        roleName: 'FOH Audio Engineer',
        volunteerId: 'vol-4',
        volunteerName: 'David Chen',
        status: 'confirmed',
        callTime: '07:45'
      },
      {
        id: 'tpos-3',
        ministryId: 'ushers',
        roleName: 'Lead Usher',
        volunteerId: 'vol-10',
        volunteerName: 'Robert Hayes',
        status: 'confirmed',
        callTime: '08:15'
      },
      {
        id: 'tpos-4',
        ministryId: 'hospitality',
        roleName: 'Main Foyer Greeter',
        volunteerId: 'vol-14',
        volunteerName: 'Brianna Fox',
        status: 'confirmed',
        callTime: '08:20'
      }
    ],
    attendance: {
      adults: 145,
      kids: 22,
      youth: 10,
      volunteers: 20,
      online: 65,
      firstTimers: 6,
      givingSnapshot: 5900,
      weather: 'Clear, 68°F'
    }
  },
  {
    id: 'plan-2026-08-30-contemporary',
    title: 'Sunday Contemporary Service',
    serviceType: 'Sunday Contemporary 11:15 AM',
    date: '2026-08-30',
    serviceStartTime: '11:15',
    callTime: '09:45',
    rehearsalTime: '10:00',
    status: 'draft',
    sermonTitle: 'Walking Worthy of the Lord',
    preacher: 'Pastor Thomas Vance',
    scripturePassage: 'Colossians 1:9-14',
    seriesId: 'series-rooted',
    seriesName: 'Rooted: Unshakable Faith',
    themeColor: '#4f46e5',
    runSheet: [
      {
        id: 'w2-1',
        type: 'song',
        title: 'Praise You Anywhere (Brandon Lake)',
        durationMinutes: 4,
        durationSeconds: 30,
        presenter: 'Chloe Bennett',
        songDetails: { key: 'C', bpm: 124, timeSig: '4/4', author: 'Brandon Lake, Ben Fielding' }
      },
      {
        id: 'w2-2',
        type: 'song',
        title: 'Firm Foundation (He Won\'t)',
        durationMinutes: 6,
        durationSeconds: 0,
        presenter: 'Chloe Bennett',
        songDetails: { key: 'Bb', bpm: 75, timeSig: '6/8', author: 'Cody Carnes, Austin Davis' }
      },
      {
        id: 'w2-3',
        type: 'sermon',
        title: 'Walking Worthy of the Lord',
        durationMinutes: 35,
        durationSeconds: 0,
        presenter: 'Pastor Thomas Vance'
      }
    ],
    positions: [
      {
        id: 'w2pos-1',
        ministryId: 'worship',
        roleName: 'Worship Leader',
        volunteerId: 'vol-2',
        volunteerName: 'Chloe Bennett',
        status: 'confirmed',
        callTime: '09:45'
      },
      {
        id: 'w2pos-2',
        ministryId: 'worship',
        roleName: 'Electric Guitar',
        volunteerId: 'vol-13',
        volunteerName: 'Ethan Wright',
        status: 'unconfirmed',
        callTime: '09:45'
      },
      {
        id: 'w2pos-3',
        ministryId: 'production',
        roleName: 'Livestream Director',
        volunteerId: 'vol-4',
        volunteerName: 'David Chen',
        status: 'confirmed',
        callTime: '09:30'
      },
      {
        id: 'w2pos-4',
        ministryId: 'kids',
        roleName: 'Preschool Teacher (3-5)',
        volunteerId: 'vol-8',
        volunteerName: 'Hannah Morales',
        status: 'confirmed',
        callTime: '10:30'
      }
    ]
  }
];

export const INITIAL_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'tmpl-3days',
    name: '3-Day Service Reminder & Call Time',
    channel: 'email',
    subject: 'Upcoming Serving Reminder: {{service_name}} on {{service_date}}',
    body: `Hi {{volunteer_name}},

This is a friendly reminder that you are scheduled to serve this coming {{service_date}} as **{{role}}** with the **{{ministry_name}}** team for {{service_name}}.

📅 **Service Date:** {{service_date}}
⏰ **Call / Soundcheck Time:** {{call_time}}
📍 **Location:** Grace Church Sanctuary (Main Building)
🎵 **Order of Service & Rehearsal Files:** Available in your volunteer dashboard

Please confirm your availability if you haven't already by clicking below:
{{confirm_button}}   {{decline_button}}

If you need a sub or have an emergency, please notify your team leader as soon as possible.

Grace & Peace,
The Sanctuary Planning Team`,
    triggerTiming: '3_days_before',
    isActive: true
  },
  {
    id: 'tmpl-sms-24hr',
    name: '24-Hour Quick SMS Check',
    channel: 'sms',
    subject: 'SMS Alert: Serving Tomorrow',
    body: `Grace Church: Hi {{volunteer_name}}, you are serving tomorrow ({{service_date}}) as {{role}} at {{call_time}}. Reply 'YES' to confirm or visit your planner link: {{quick_link}}`,
    triggerTiming: '24_hours_before',
    isActive: true
  },
  {
    id: 'tmpl-urgent-swap',
    name: 'Volunteer Substitution Request Alert',
    channel: 'email',
    subject: 'Open Volunteer Slot Needed for {{service_date}} ({{role}})',
    body: `Hi {{volunteer_name}},

A serving position has opened up for this Sunday ({{service_date}}) in the {{ministry_name}} team for **{{role}}** (Call time: {{call_time}}).

If you are available to step in and serve this week, please click the button below to accept the slot:
{{claim_button}}

Thank you for your generous heart in serving our church family!`,
    triggerTiming: 'manual',
    isActive: true
  }
];

export const INITIAL_REMINDER_LOGS: ReminderRecipientLog[] = [
  {
    id: 'log-1',
    recipientName: 'Marcus Rivera',
    recipientEmail: 'marcus.rivera@gracechurch.org',
    recipientPhone: '(555) 234-5678',
    role: 'Worship Leader',
    ministry: 'Worship Band & Vocals',
    serviceDate: '2026-08-23',
    serviceName: 'Sunday Contemporary 11:15 AM',
    callTime: '09:45 AM',
    channel: 'both',
    status: 'responded_confirmed',
    sentAt: '2026-08-20 09:00 AM',
    responseAt: '2026-08-20 09:14 AM',
    planId: 'plan-2026-08-23-contemporary',
    positionId: 'pos-1'
  },
  {
    id: 'log-2',
    recipientName: 'Chloe Bennett',
    recipientEmail: 'chloe.b@gmail.com',
    recipientPhone: '(555) 345-6789',
    role: 'Vocalist (Alto)',
    ministry: 'Worship Band & Vocals',
    serviceDate: '2026-08-23',
    serviceName: 'Sunday Contemporary 11:15 AM',
    callTime: '09:45 AM',
    channel: 'email',
    status: 'responded_confirmed',
    sentAt: '2026-08-20 09:00 AM',
    responseAt: '2026-08-20 10:22 AM',
    planId: 'plan-2026-08-23-contemporary',
    positionId: 'pos-2'
  },
  {
    id: 'log-3',
    recipientName: 'Ethan Wright',
    recipientEmail: 'ethan.electric@gmail.com',
    recipientPhone: '(555) 456-6543',
    role: 'Electric Guitar',
    ministry: 'Worship Band & Vocals',
    serviceDate: '2026-08-23',
    serviceName: 'Sunday Contemporary 11:15 AM',
    callTime: '09:45 AM',
    channel: 'both',
    status: 'opened',
    sentAt: '2026-08-20 09:00 AM',
    planId: 'plan-2026-08-23-contemporary',
    positionId: 'pos-4'
  },
  {
    id: 'log-4',
    recipientName: 'David Chen',
    recipientEmail: 'david.chen.tech@gmail.com',
    recipientPhone: '(555) 567-8901',
    role: 'FOH Audio Engineer',
    ministry: 'Audio, Visual & Tech',
    serviceDate: '2026-08-23',
    serviceName: 'Sunday Contemporary 11:15 AM',
    callTime: '09:30 AM',
    channel: 'email',
    status: 'responded_confirmed',
    sentAt: '2026-08-20 09:00 AM',
    responseAt: '2026-08-20 09:05 AM',
    planId: 'plan-2026-08-23-contemporary',
    positionId: 'pos-6'
  },
  {
    id: 'log-5',
    recipientName: 'Sarah Jenkins',
    recipientEmail: 'sarah.j.kids@gmail.com',
    recipientPhone: '(555) 890-1234',
    role: 'Elementary Lead (K-5)',
    ministry: 'Kingdom Kids Ministry',
    serviceDate: '2026-08-23',
    serviceName: 'Sunday Contemporary 11:15 AM',
    callTime: '10:30 AM',
    channel: 'both',
    status: 'responded_confirmed',
    sentAt: '2026-08-20 09:00 AM',
    responseAt: '2026-08-20 09:40 AM',
    planId: 'plan-2026-08-23-contemporary',
    positionId: 'pos-8'
  }
];

export const HISTORICAL_ATTENDANCE = [
  { date: '2026-07-05', traditional: 138, contemporary: 198, kids: 52, youth: 28, online: 95, total: 511 },
  { date: '2026-07-12', traditional: 142, contemporary: 205, kids: 56, youth: 30, online: 104, total: 537 },
  { date: '2026-07-19', traditional: 130, contemporary: 212, kids: 50, youth: 25, online: 88, total: 505 },
  { date: '2026-07-26', traditional: 146, contemporary: 220, kids: 60, youth: 32, online: 110, total: 568 },
  { date: '2026-08-02', traditional: 150, contemporary: 228, kids: 64, youth: 35, online: 115, total: 592 },
  { date: '2026-08-09', traditional: 144, contemporary: 232, kids: 62, youth: 33, online: 108, total: 579 },
  { date: '2026-08-16', traditional: 140, contemporary: 225, kids: 59, youth: 31, online: 102, total: 557 },
  { date: '2026-08-23', traditional: 145, contemporary: 249, kids: 68, youth: 34, online: 112, total: 608 }
];
