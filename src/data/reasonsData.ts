export interface ReasonItem {
  id: number;
  category: 'soul' | 'smile' | 'moments' | 'future' | 'quirks';
  title: string;
  reason: string;
  poeticNote: string;
}

export const CATEGORY_LABELS: Record<ReasonItem['category'], { label: string; icon: string; color: string }> = {
  soul: { label: 'Her Soul & Essence', icon: '✨', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-200' },
  smile: { label: 'Smile & Presence', icon: '💖', color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-200' },
  moments: { label: 'Quiet Moments', icon: '🌙', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-200' },
  future: { label: 'Future & Dreams', icon: '🔮', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-200' },
  quirks: { label: 'Sweet Quirks', icon: '🌸', color: 'from-amber-400/20 to-rose-400/20 border-amber-400/30 text-amber-100' },
};

export const INITIAL_REASONS: ReasonItem[] = [
  {
    id: 1,
    category: 'smile',
    title: 'The Way Your Smile Softens the Room',
    reason: 'Whenever you smile, the entire atmosphere shifts. It is not just lighting up a room—it makes everything around you feel safe and gentle.',
    poeticNote: 'Like morning sunlight breaking through cold fog.'
  },
  {
    id: 2,
    category: 'soul',
    title: 'Your Rare Kind of Quiet Strength',
    reason: 'You carry yourself with a grace that does not need to shout to be felt. Your strength is steady, calm, and deeply reassuring.',
    poeticNote: 'A deep river that flows with quiet conviction.'
  },
  {
    id: 3,
    category: 'moments',
    title: 'How You Make Silences Feel Like Music',
    reason: 'With you, there is no need to fill every second with words. Sitting quietly near you feels richer than a thousand speeches.',
    poeticNote: 'Peaceful pause between two favorite notes.'
  },
  {
    id: 4,
    category: 'quirks',
    title: 'The Unfiltered Joy in Your Laughter',
    reason: 'When something genuine catches you off guard and you laugh freely, it is the most beautiful sound in the world.',
    poeticNote: 'Pure melody without pretense.'
  },
  {
    id: 5,
    category: 'future',
    title: 'The Thought of Building Tomorrow with You',
    reason: 'Thinking about the years ahead becomes an adventure rather than a mystery when I picture you in them.',
    poeticNote: 'A blueprint written in starlight.'
  },
  {
    id: 6,
    category: 'soul',
    title: 'Your Thoughtfulness in Small Details',
    reason: 'You notice things that most people miss—the subtle shift in someone’s mood, the quiet beauty in small gestures.',
    poeticNote: 'An artist who sees beauty where others see noise.'
  },
  {
    id: 7,
    category: 'smile',
    title: 'The Sparkle in Your Eyes When You Are Excited',
    reason: 'When you speak about something you truly care about, your eyes light up in a way that makes it impossible not to listen.',
    poeticNote: 'Constellations coming alive at dusk.'
  },
  {
    id: 8,
    category: 'moments',
    title: 'The Safety You Bring Without Trying',
    reason: 'Just knowing you are there lowers my heart rate. You are a sanctuary in a world that moves far too fast.',
    poeticNote: 'A quiet harbor during a midnight storm.'
  },
  {
    id: 9,
    category: 'quirks',
    title: 'The Subtle Head Tilt When You Are Thinking',
    reason: 'It is one of those little habits you probably do not even realize you have, but it is impossibly endearing.',
    poeticNote: 'A moment captured in silent poetry.'
  },
  {
    id: 10,
    category: 'future',
    title: 'How You Inspire Me to Be Better',
    reason: 'Without asking me to change, simply being near your light makes me want to grow into a wiser, kinder person.',
    poeticNote: 'Sunlight encouraging a garden to bloom.'
  },
  {
    id: 11,
    category: 'soul',
    title: 'Your Deep Capacity for Empathy',
    reason: 'You feel things deeply and hold space for others with a heart that knows no judgment.',
    poeticNote: 'A warm sanctuary for tired souls.'
  },
  {
    id: 12,
    category: 'smile',
    title: 'The Softness of Your Voice',
    reason: 'Even in a crowded, noisy room, the tone of your voice brings an instant sense of focus and calm.',
    poeticNote: 'A gentle whisper over rough seas.'
  },
  {
    id: 13,
    category: 'moments',
    title: 'Sharing Unspoken Glances',
    reason: 'Those split seconds across a room where our eyes meet, and we both know exactly what the other is thinking.',
    poeticNote: 'A secret language only two hearts speak.'
  },
  {
    id: 14,
    category: 'quirks',
    title: 'The Accent on Words Only You Use',
    reason: 'The unique way you phrase things and the cadence of your speech that makes your conversation distinctly yours.',
    poeticNote: 'A signature rhythm written in warm air.'
  },
  {
    id: 15,
    category: 'future',
    title: 'All the Unmapped Journeys Ahead',
    reason: 'Places we have yet to visit, coffees we have yet to drink, and late nights we have yet to share.',
    poeticNote: 'Unopened letters waiting to be read.'
  },
  {
    id: 16,
    category: 'soul',
    title: 'Your Authentic Honesty',
    reason: 'You do not put on masks. Your honesty is pure, gentle, and profoundly refreshing.',
    poeticNote: 'Crystal clear water running over smooth stones.'
  },
  {
    id: 17,
    category: 'smile',
    title: 'The Shy Smile You Give When Complimented',
    reason: 'That split-second moment where you look down and smile softly when you realize how much you are appreciated.',
    poeticNote: 'A rose blooming in fast-forward.'
  },
  {
    id: 18,
    category: 'moments',
    title: 'Late Night Thoughts That Always Lead to You',
    reason: 'When the world goes quiet and my mind drifts to peace, you are always the destination.',
    poeticNote: 'The North Star in a moonlit sky.'
  },
  {
    id: 19,
    category: 'quirks',
    title: 'Your Cute Reactions to Unexpected Surprises',
    reason: 'The genuine wideness of your eyes and the happy breath you catch when something sweet catches you off guard.',
    poeticNote: 'A delicate spark in the quiet dark.'
  },
  {
    id: 20,
    category: 'future',
    title: 'Growing Old and Wise Together',
    reason: 'Knowing that as time passes, the bond between us will only gain depth, beauty, and history.',
    poeticNote: 'A vintage oak growing stronger through seasons.'
  },
  {
    id: 21,
    category: 'soul',
    title: 'The Way You Forgive with Grace',
    reason: 'You hold a heart that understands human flaws and chooses understanding over bitterness every time.',
    poeticNote: 'Golden light healing broken porcelain.'
  },
  {
    id: 22,
    category: 'smile',
    title: 'Your Mischievous Little Smile',
    reason: 'When you are holding back a joke or teasing softly, that playful twinkle in your expression is unforgettable.',
    poeticNote: 'Starlight playing on morning dew.'
  },
  {
    id: 23,
    category: 'moments',
    title: 'Holding Space for Each Other’s Dreams',
    reason: 'You do not just listen to dreams; you hold them carefully like fragile glass and give them room to grow.',
    poeticNote: 'Gardener of quiet hopes.'
  },
  {
    id: 24,
    category: 'quirks',
    title: 'How You Wrap Your Hands Around Warm Cups',
    reason: 'Holding a warm mug with both hands, taking slow sips—it is such a cozy, peaceful visual of you.',
    poeticNote: 'Comfort personified in a single frame.'
  },
  {
    id: 25,
    category: 'future',
    title: 'Creating Our Own Quiet Traditions',
    reason: 'The small rituals we build together that belong only to us and nobody else.',
    poeticNote: 'Constellations drawn by hand.'
  },
  {
    id: 26,
    category: 'soul',
    title: 'Your Deep Compassion for All Living Things',
    reason: 'The gentleness you show toward nature, animals, and people in need speaks volumes about who you are.',
    poeticNote: 'A gentle hand extended to the wind.'
  },
  {
    id: 27,
    category: 'smile',
    title: 'How Your Smile Touches Your Entire Face',
    reason: 'It isn’t just your lips—it reaches your cheekbones, your eyes, and radiates through your entire energy.',
    poeticNote: 'Sunrise spreading across a calm horizon.'
  },
  {
    id: 28,
    category: 'moments',
    title: 'The Comfort of Unfiltered Conversations',
    reason: 'Talking with you without needing to filter thoughts or censor emotions—just pure raw trust.',
    poeticNote: 'Walking barefoot on soft moss.'
  },
  {
    id: 29,
    category: 'quirks',
    title: 'The Unique Way You React When Focused',
    reason: 'When you are absorbed in a book, a task, or a thought, your concentration is mesmerizing.',
    poeticNote: 'A quiet painter alone with her canvas.'
  },
  {
    id: 30,
    category: 'future',
    title: 'Being Each Other’s Safe Haven Forever',
    reason: 'No matter how chaotic the outside world becomes, knowing we have a sanctuary in each other.',
    poeticNote: 'An anchor cast in calm waters.'
  },
  {
    id: 31,
    category: 'soul',
    title: 'Your Resilience in the Face of Challenges',
    reason: 'Even when things get tough, you carry an inner elegance and dignity that overcomes every hurdle.',
    poeticNote: 'A lotus rising gracefully above murky water.'
  },
  {
    id: 32,
    category: 'smile',
    title: 'The Comfort of Your Warm Greeting',
    reason: 'The instant shift in warmth when you say hello after a long day of silence.',
    poeticNote: 'Coming home after a long journey in the rain.'
  },
  {
    id: 33,
    category: 'moments',
    title: 'Shared Music and Silent Lyrics',
    reason: 'Listening to a song together and knowing that every poetic line describes how I feel about you.',
    poeticNote: 'Melodies carrying hidden confessions.'
  },
  {
    id: 34,
    category: 'quirks',
    title: 'Your Expressive Hand Gestures',
    reason: 'The way you tell stories with your hands adding rhythm and life to every story you share.',
    poeticNote: 'A conductor guiding an orchestra of words.'
  },
  {
    id: 35,
    category: 'future',
    title: 'The Legacy of Kindness We Will Leave',
    reason: 'Knowing that the love and care we cultivate will touch lives around us for years to come.',
    poeticNote: 'Ripples extending across a calm lake.'
  },
  {
    id: 36,
    category: 'soul',
    title: 'Your Intuitive Wisdom',
    reason: 'You see right through pretense and speak truth with incredible emotional intelligence.',
    poeticNote: 'A quiet lantern in a dark woods.'
  },
  {
    id: 37,
    category: 'smile',
    title: 'The Radiance of Your Unplanned Laughs',
    reason: 'Those unexpected moments where a simple silly joke makes you laugh until you catch your breath.',
    poeticNote: 'Fireworks lighting up a midnight sky.'
  },
  {
    id: 38,
    category: 'moments',
    title: 'Walking Side by Side at Dusk',
    reason: 'The simple rhythm of footsteps side-by-side as daylight fades into twilight.',
    poeticNote: 'Two shadows merging into one quiet path.'
  },
  {
    id: 39,
    category: 'quirks',
    title: 'How You Reorganize Things Just Right',
    reason: 'Your subtle need for harmony in your surroundings that brings order and beauty everywhere.',
    poeticNote: 'Arranging wild flowers in a glass vase.'
  },
  {
    id: 40,
    category: 'future',
    title: 'Endless Sunrises Together',
    reason: 'Waking up to a brand-new day knowing that you are the first thought in my mind.',
    poeticNote: 'A fresh page waiting for golden ink.'
  },
  {
    id: 41,
    category: 'soul',
    title: 'Your Unwavering Loyalty',
    reason: 'When you care about someone, your devotion is steadfast and true through every season.',
    poeticNote: 'A lighthouse built upon immovable rock.'
  },
  {
    id: 42,
    category: 'smile',
    title: 'The Soft Glow of Your Smile in Low Light',
    reason: 'Under soft evening lamps or moonlight, your smile takes on an ethereal, timeless beauty.',
    poeticNote: 'A pearl glowing under water.'
  },
  {
    id: 43,
    category: 'moments',
    title: 'Remembering the Exact Moment We Connected',
    reason: 'That instant where a casual interaction turned into something soul-stirring and permanent.',
    poeticNote: 'The precise moment a spark becomes a flame.'
  },
  {
    id: 44,
    category: 'quirks',
    title: 'The Little Hum You Make When Happy',
    reason: 'A soft, subconscious melody you make when enjoying good food, a cozy blanket, or a good song.',
    poeticNote: 'A hummingbird whispering to a rose.'
  },
  {
    id: 45,
    category: 'future',
    title: 'Unpacking Memories Years from Now',
    reason: 'Looking back at these exact words and remembering how deeply you have been cherished from the start.',
    poeticNote: 'Opening a golden time capsule.'
  },
  {
    id: 46,
    category: 'soul',
    title: 'Your Ability to Find Wonder in the Mundane',
    reason: 'You can look at a rainy afternoon or a simple walk and see poetry where others see routine.',
    poeticNote: 'Alchemist turning glass into diamond.'
  },
  {
    id: 47,
    category: 'smile',
    title: 'The Way Your Smile Heals Bad Days',
    reason: 'No matter how heavy a day feels, one glance at your warm expression restores my peace.',
    poeticNote: 'Balm for a tired heart.'
  },
  {
    id: 48,
    category: 'moments',
    title: 'Sharing Secrets Under the Stars',
    reason: 'Whispering deepest hopes and vulnerabilities while looking up at the vast night sky.',
    poeticNote: 'Confessions entrusted to infinity.'
  },
  {
    id: 49,
    category: 'quirks',
    title: 'Your Signature Style and Elegance',
    reason: 'The effortless taste you show in how you dress, carry yourself, and arrange your world.',
    poeticNote: 'Timeless grace in a modern world.'
  },
  {
    id: 50,
    category: 'future',
    title: '50 Reasons Down, 50 More & Forever to Go',
    reason: 'Reaching this milestone and realizing 100 reasons are still not enough to capture all you are.',
    poeticNote: 'Halfway through a song that never ends.'
  },
  {
    id: 51,
    category: 'soul',
    title: 'Your Deep Sense of Honor and Dignity',
    reason: 'You treat people with respect and hold principles that make me admire you more every day.',
    poeticNote: 'Pure silver tested by fire.'
  },
  {
    id: 52,
    category: 'smile',
    title: 'Your Smile When You Win a Small Argument',
    reason: 'That subtle, triumphant grin when you know you were right all along.',
    poeticNote: 'A playful queen holding her crown.'
  },
  {
    id: 53,
    category: 'moments',
    title: 'Re-reading Messages from You',
    reason: 'Going back to read your words when I miss you, feeling your presence in every line.',
    poeticNote: 'Holding pressed flowers in an old book.'
  },
  {
    id: 54,
    category: 'quirks',
    title: 'How You Tuck Your Hair Behind Your Ear',
    reason: 'A simple, unconscious movement that catches my breath every single time.',
    poeticNote: 'A delicate gesture carved in memory.'
  },
  {
    id: 55,
    category: 'future',
    title: 'Creating a Sanctuary Home',
    reason: 'Designing a space filled with art, warmth, laughter, and the gentle scent of home.',
    poeticNote: 'A nest built with love and light.'
  },
  {
    id: 56,
    category: 'soul',
    title: 'Your Inquisitive Mind',
    reason: 'You ask thoughtful questions and never stop wanting to learn, explore, and understand.',
    poeticNote: 'A seeker wandering through starry corridors.'
  },
  {
    id: 57,
    category: 'smile',
    title: 'The Smile You Give Only to Me',
    reason: 'There is a special, intimate version of your smile that is reserved for private moments.',
    poeticNote: 'A secret garden key.'
  },
  {
    id: 58,
    category: 'moments',
    title: 'Watching You Sleep Peacefully',
    reason: 'Seeing you resting peacefully, free from all worries, surrounded by complete tranquility.',
    poeticNote: 'A resting angel guarded by night.'
  },
  {
    id: 59,
    category: 'quirks',
    title: 'The Way You Get Sleepy and Soft',
    reason: 'When fatigue sets in and your voice grows quiet, raspy, and incredibly sweet.',
    poeticNote: 'Twilight melting into quiet night.'
  },
  {
    id: 60,
    category: 'future',
    title: 'Conquering Every Mountain Side by Side',
    reason: 'Knowing that whatever obstacles life brings, we will face them as an unbeatable team.',
    poeticNote: 'Two mountain peaks rising above the clouds.'
  },
  {
    id: 61,
    category: 'soul',
    title: 'Your Pure Heart Free of Malice',
    reason: 'In a world that can often be cynical, your heart remains uncorrupted, sweet, and pure.',
    poeticNote: 'Fresh snow untouched by footprints.'
  },
  {
    id: 62,
    category: 'smile',
    title: 'When Your Smile Defies Bad Weather',
    reason: 'Even on gray, rainy afternoons, your brightness makes it feel like midsummer.',
    poeticNote: 'Sunshine breaking through heavy rain clouds.'
  },
  {
    id: 63,
    category: 'moments',
    title: 'The Scent of Your Presence',
    reason: 'That subtle, lingering fragrance that instantly evokes safety, warmth, and intimacy.',
    poeticNote: 'Wild Jasmine drifting on evening air.'
  },
  {
    id: 64,
    category: 'quirks',
    title: 'Your Passionate Rants About Things You Love',
    reason: 'Listening to you go on about your favorite topic with unstoppable enthusiasm.',
    poeticNote: 'A river overflowing its banks with joy.'
  },
  {
    id: 65,
    category: 'future',
    title: 'Sharing Starlit Evenings in Old Age',
    reason: 'Sitting on a porch years from now, hand in hand, recounting the story of us.',
    poeticNote: 'Golden hours preserved forever.'
  },
  {
    id: 66,
    category: 'soul',
    title: 'Your Quiet Generosity',
    reason: 'You give to others without expecting recognition or applause.',
    poeticNote: 'Rain falling gently on thirsty ground.'
  },
  {
    id: 67,
    category: 'smile',
    title: 'Your Warmth When Meeting Someone New',
    reason: 'How welcoming and inclusive you are, making everyone around you feel valued.',
    poeticNote: 'An open door on a cold night.'
  },
  {
    id: 68,
    category: 'moments',
    title: 'The Feeling of Your Touch',
    reason: 'Even the briefest touch of your hand sends a gentle warmth directly to my soul.',
    poeticNote: 'Electric currents wrapped in velvet.'
  },
  {
    id: 69,
    category: 'quirks',
    title: 'Your Particular Taste in Comfort Foods',
    reason: 'The specific snacks or warm treats that bring an instant happy dance to your shoulders.',
    poeticNote: 'Simple pleasures made sacred.'
  },
  {
    id: 70,
    category: 'future',
    title: 'Being Your Biggest Fan in Every Goal',
    reason: 'Cheering for your achievements and celebrating every milestone you reach in life.',
    poeticNote: 'Wind beneath a soaring eagle’s wings.'
  },
  {
    id: 71,
    category: 'soul',
    title: 'Your Artistic Sensibility',
    reason: 'Whether through words, aesthetics, or choices, you bring an artistic touch to life.',
    poeticNote: 'Living poetry in motion.'
  },
  {
    id: 72,
    category: 'smile',
    title: 'The Giggle You Try to Suppress',
    reason: 'When you try hard not to laugh in a quiet moment, but it bubbles up anyway.',
    poeticNote: 'Champagne bubbles rising to the surface.'
  },
  {
    id: 73,
    category: 'moments',
    title: 'Quiet Mornings with Fresh Coffee',
    reason: 'The peaceful stillness of early morning hours spent sharing thoughts before the world wakes.',
    poeticNote: 'Dawn breaking over calm waters.'
  },
  {
    id: 74,
    category: 'quirks',
    title: 'How You Scrunch Your Nose When Confused',
    reason: 'A fleeting expression when puzzling over something that is impossibly cute.',
    poeticNote: 'A subtle curiosity written in miniature.'
  },
  {
    id: 75,
    category: 'future',
    title: 'Writing Our Own Book of Life',
    reason: 'Every day adding a new paragraph to the most beautiful story ever lived.',
    poeticNote: 'Bound in silk, written in gold.'
  },
  {
    id: 76,
    category: 'soul',
    title: 'Your Ability to Forgive My Imperfections',
    reason: 'You accept me with all my flaws, making me feel worthy of love.',
    poeticNote: 'Grace covering every scar.'
  },
  {
    id: 77,
    category: 'smile',
    title: 'The Joy in Your Eyes When You See Flowers',
    reason: 'The genuine appreciation you have for nature’s simple, delicate beauty.',
    poeticNote: 'A flower recognizing its own kin.'
  },
  {
    id: 78,
    category: 'moments',
    title: 'Recharging Together in Silence',
    reason: 'When both of us are tired, yet just being in the same room recharges our spirits.',
    poeticNote: 'Two flames keeping each other warm.'
  },
  {
    id: 79,
    category: 'quirks',
    title: 'Your Cute Way of Saying Goodbye',
    reason: 'That lingering glance and sweet wave before we part ways for the day.',
    poeticNote: 'A promise disguised as a farewell.'
  },
  {
    id: 80,
    category: 'future',
    title: 'Never Running Out of Things to Discover',
    reason: 'Knowing that even after decades, your soul will still hold endless depths to explore.',
    poeticNote: 'An ocean without a shore.'
  },
  {
    id: 81,
    category: 'soul',
    title: 'Your Gentle Mannerisms',
    reason: 'The careful way you handle soft things, speak to loved ones, and move through space.',
    poeticNote: 'Feathers falling gently on silk.'
  },
  {
    id: 82,
    category: 'smile',
    title: 'When You Smile Through Tears of Emotion',
    reason: 'The beauty of your emotional depth when something touches you to tears.',
    poeticNote: 'A rainbow born from sun and rain.'
  },
  {
    id: 83,
    category: 'moments',
    title: 'The Comfort of Knowing You Are Safe',
    reason: 'Knowing that you are protected, happy, and cared for brings absolute peace to my heart.',
    poeticNote: 'A guardian angel’s quiet promise.'
  },
  {
    id: 84,
    category: 'quirks',
    title: 'Your Habit of Checking Things Twice',
    reason: 'Your meticulous care in ensuring everything is in place before setting off.',
    poeticNote: 'Precision wrapped in patience.'
  },
  {
    id: 85,
    category: 'future',
    title: 'Celebrating Every Anniversary as If First',
    reason: 'Keeping the magic fresh, romantic, and awe-inspiring year after year.',
    poeticNote: 'An eternal spring that never fades.'
  },
  {
    id: 86,
    category: 'soul',
    title: 'Your Modesty and Humility',
    reason: 'You accomplish wonderful things without bragging or seeking empty praise.',
    poeticNote: 'A quiet jewel that sparkles naturally.'
  },
  {
    id: 87,
    category: 'smile',
    title: 'The Way Your Smile Softens Cold Stares',
    reason: 'Your warmth breaks down walls and brings out the best in everyone.',
    poeticNote: 'Spring melting winter’s frost.'
  },
  {
    id: 88,
    category: 'moments',
    title: 'The Unspoken Trust Between Us',
    reason: 'Knowing without a shadow of doubt that we have each other’s backs always.',
    poeticNote: 'A pact forged in celestial light.'
  },
  {
    id: 89,
    category: 'quirks',
    title: 'Your Favorite Cozy Corner',
    reason: 'The way you nestle into your favorite spot with pillows and blankets.',
    poeticNote: 'A butterfly returning to its blossom.'
  },
  {
    id: 90,
    category: 'future',
    title: 'A Universe of Possibilities Waiting',
    reason: 'Every morning bringing new opportunities to cherish, protect, and adore you.',
    poeticNote: 'Endless galaxies in your eyes.'
  },
  {
    id: 91,
    category: 'soul',
    title: 'Your Pure Intentions',
    reason: 'You act from love, truth, and goodwill in everything you do.',
    poeticNote: 'Light unclouded by shadow.'
  },
  {
    id: 92,
    category: 'smile',
    title: 'Your Laughter echoing in my mind',
    reason: 'Long after you leave, the echo of your happy voice stays with me throughout the day.',
    poeticNote: 'A golden bell ringing softly in the distance.'
  },
  {
    id: 93,
    category: 'moments',
    title: 'The Feeling of Belonging',
    reason: 'With you, I never feel out of place. You are home in human form.',
    poeticNote: 'The sanctuary at the end of the world.'
  },
  {
    id: 94,
    category: 'quirks',
    title: 'Your Soft Gasps of Wonder',
    reason: 'When seeing a shooting star, a pretty sunset, or a cute kitten.',
    poeticNote: 'Innocence preserved in amber.'
  },
  {
    id: 95,
    category: 'future',
    title: 'Growing Deeper in Love Every Single Day',
    reason: 'Thought I loved you fully yesterday, today proved love has no upper ceiling with you.',
    poeticNote: 'An infinite climb toward the stars.'
  },
  {
    id: 96,
    category: 'soul',
    title: 'Your Irreplaceable Essence',
    reason: 'There is no one in this world who could ever replicate your spirit, mind, or heart.',
    poeticNote: 'A masterpiece created only once.'
  },
  {
    id: 97,
    category: 'smile',
    title: 'The Way Your Face Lights Up When You See Me',
    reason: 'That split second where your expression transforms into pure welcome.',
    poeticNote: 'A lighthouse turning toward home.'
  },
  {
    id: 98,
    category: 'moments',
    title: 'Knowing Prince is Yours & You are Prince’s',
    reason: 'The serene certainty of belonging together in a world of eight billion souls.',
    poeticNote: 'Two paths meeting at a sacred crossroad.'
  },
  {
    id: 99,
    category: 'quirks',
    title: 'Your Cute Way of Expressing Love',
    reason: 'The tender gestures, subtle texts, and gentle nudges that show you care.',
    poeticNote: 'Love written in golden thread.'
  },
  {
    id: 100,
    category: 'soul',
    title: 'Simply Because You Are You, Anvii',
    reason: 'Above all reasons, calculations, and words—I cherish you simply because you exist, exactly as you are.',
    poeticNote: 'The ultimate truth: You are my heart’s final home.'
  }
];
