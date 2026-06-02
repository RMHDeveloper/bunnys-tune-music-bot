
import { Question } from './types';

export const PRIMARY_COLOR = '#FF8C00'; // Vibrant highlight
export const THEME_BROWN = '#4e342e';   // Deep brown from image
export const THEME_BEIGE = '#f3e5d8';   // Soft beige background from image

export const QUESTIONS: Question[] = [
  {
    id: 'language',
    text: 'Choose your language',
    options: ['Tamil', 'English', 'Hindi', 'Kannada', 'Telugu', 'Malayalam']
  },
  {
    id: 'mood',
    text: "What's your vibe?",
    options: ['Happy/Party', 'Soulful/Sad', 'Romantic', 'Energetic/Workout']
  },
  {
    id: 'directChoice',
    text: 'What type of music are you looking for?',
    options: ['Blockbuster Movie Songs', 'Independent Albums', 'Remix/Mashups', 'Devotional/Classical']
  },
  {
    id: 'occasion',
    text: 'Where are you listening?',
    options: ['Long Drive', 'Gym', 'Relaxing at Home', 'Party']
  },
  {
    id: 'instrument',
    text: 'Do you like more...',
    options: ['Acoustic/Melody', 'Electronic/Heavy Bass']
  }
];

export const LOCALIZED_CONTENT: Record<string, any> = {
  'Tamil': {
    prefix: "Super namba! 😎 Ready-ah?",
    mood: "What's your vibe right now? Happy-ah illa romantic-ah? ❤️",
    directChoice: "Direct Choice: Enna mari paatu venum? Movie songs-ah illa album songs-ah? 🎶",
    occasion: "Enga listening? Rain-ah 🌧️, walking-ah 🚶, or working-ah 💻?",
    instrument: "Melody acoustic pidikuma illa heavy bass-ah? 🔥"
  },
  'English': {
    prefix: "Awesome choice! ✨ Ready to dive in?",
    mood: "What's your vibe today? Happy/Party or Romantic? ✨",
    directChoice: "Direct Choice: What kind of tracks? Movie hits or Indie gems? 🎶",
    occasion: "Where are you now? Rain 🌧️, walking 🚶 or working 💻?",
    instrument: "Acoustic melody or heavy bass? 🔥"
  },
  'Hindi': {
    prefix: "Arre wah! Mast choice. ✨ Shuru karein?",
    mood: "Kya vibe hai aaj? Happy/Party ya romantic? ✨",
    directChoice: "Direct Choice: Kis tarah ke gaane chahiye? Movie hits ya Indie? 🎶",
    occasion: "Abhi kahan ho? Barish 🌧️, walk 🚶 ya kaam pe 💻?",
    instrument: "Acoustic melody ya phir heavy bass? 🔥"
  },
  'Telugu': {
    prefix: "Super guru! ⚡ Ready-aa?",
    mood: "Eeroju mee vibe enti? Happy-ga unnara? ❤️",
    directChoice: "Direct Choice: Elaanti paatalu kaavali? Movies aa leka private albums aa? 🎶",
    occasion: "Ekkada vintunnaru? Varsham-lo 🌧️, walking-aa 🚶, leka work-aa 💻?",
    instrument: "Acoustic-aa leka heavy bass-aa? 🔥"
  },
  'Kannada': {
    prefix: "Sakkath choice! 🌟 Shuru madona?",
    mood: "Nimma vibe hege ide? Sakkath khushi-na? ❤️",
    directChoice: "Direct Choice: Yav thara hadu beku? Cinema hadu-gala illa album-galu? 🎶",
    occasion: "Ellinda kelthidira? Male-li 🌧️, walking-a 🚶, illa work-a 💻?",
    instrument: "Acoustic ishta na illa heavy bass-aa? 🔥"
  },
  'Malayalam': {
    prefix: "Adipoli! 😍 Ready-alle?",
    mood: "Enthaanu vibe? Nalla happy mood-aano? ❤️",
    directChoice: "Direct Choice: Enganulla paattukalaanu vendathu? Movies-o atho albums-o? 🎶",
    occasion: "Evideyanu? Mazha-yatho 🌧️, walking-o 🚶, atho work-o 💻?",
    instrument: "Acoustic mathiyo illa heavy bass veno? 🔥"
  }
};
