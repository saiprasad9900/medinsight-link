import { random } from "../utils/helpers.ts";

export const handleTollywoodQuestions = (query: string): string | null => {
  const q = query.trim().toLowerCase();

  // Popular Actors
  if (q.match(/prabhas|rebel star|darling/)) {
    return random([
      "Prabhas, the Rebel Star! Famous for Baahubali series, Saaho, and Radhe Shyam. A pan-Indian superstar, sir! 🎬",
      "Prabhas brought Telugu cinema to global recognition with Baahubali. Truly a darling of millions!",
      "The man who made 'Why Kattappa killed Baahubali' a worldwide question - Prabhas, our Rebel Star! 👑"
    ]);
  }

  if (q.match(/mahesh babu|superstar|prince/)) {
    return random([
      "Mahesh Babu, the Prince of Tollywood! Known for Pokiri, Dookudu, and Srimanthudu. Style personified! ✨",
      "Superstar Mahesh Babu - the man with the perfect smile and incredible acting prowess, sir!",
      "From Rajakumarudu to Guntur Kaaram, Mahesh Babu has been ruling hearts for decades! 🌟"
    ]);
  }

  if (q.match(/jr ntr|tarak|young tiger/)) {
    return random([
      "Jr. NTR, the Young Tiger! Incredible in RRR, Temper, and Aravinda Sametha. A powerhouse performer! 🐅",
      "Tarak's dance moves and acting skills are simply extraordinary. RRR made him a global icon!",
      "From Student No. 1 to RRR, Jr. NTR has shown remarkable versatility. A true heir to the NTR legacy! 💪"
    ]);
  }

  if (q.match(/ram charan|mega power star|cherry/)) {
    return random([
      "Ram Charan, the Mega Power Star! His performance in RRR alongside Jr. NTR was absolutely magnificent! 🔥",
      "Cherry's journey from Chirutha to RRR has been spectacular. A worthy successor to Megastar Chiranjeevi!",
      "Ram Charan's dedication and hard work paid off beautifully in RRR. Global recognition well deserved! 🌍"
    ]);
  }

  if (q.match(/allu arjun|stylish star|bunny/)) {
    return random([
      "Allu Arjun, the Stylish Star! Pushpa made him a pan-Indian sensation. 'Pushpa ante flower anukoku, fire!' 🔥",
      "Bunny's style and swag are unmatched. From Arya to Pushpa, he's been consistently brilliant!",
      "The man who made 'Thaggede Le' a national catchphrase - Allu Arjun, our Stylish Star! 💯"
    ]);
  }

  if (q.match(/chiranjeevi|megastar|chiru/)) {
    return random([
      "Megastar Chiranjeevi - the undisputed king of Telugu cinema! A legend who redefined mass entertainment! 👑",
      "Chiru garu's contribution to Tollywood is immeasurable. From Khaidi to Waltair Veerayya, always entertaining!",
      "The man who gave us countless memorable characters and dance moves - Megastar Chiranjeevi! 🕺"
    ]);
  }

  if (q.match(/pawan kalyan|power star|pk/)) {
    return random([
      "Pawan Kalyan, the Power Star! Known for Gabbar Singh, Attarintiki Daredi, and his unique style! ⚡",
      "PK's fan following is phenomenal. His movies are always special events in Tollywood!",
      "From Tholi Prema to Bheemla Nayak, Pawan Kalyan has given us many memorable performances! 💪"
    ]);
  }

  // Directors
  if (q.match(/rajamouli|jakkanna|baahubali director/)) {
    return random([
      "S.S. Rajamouli - Jakkanna! The visionary behind Baahubali and RRR. He put Telugu cinema on the world map! 🌍",
      "Rajamouli's storytelling and grandeur are unparalleled. From Magadheera to RRR, pure brilliance!",
      "The man who made Hollywood notice Tollywood - S.S. Rajamouli, our pride! 🏆"
    ]);
  }

  if (q.match(/trivikram|guruji|trivikram srinivas/)) {
    return random([
      "Trivikram Srinivas - Guruji! Master of witty dialogues and family emotions. Athadu, Khaleja, Ala Vaikunthapurramuloo! ✍️",
      "Trivikram's pen is mightier than any sword. His dialogues are poetry in motion!",
      "The wizard of words - Trivikram Srinivas. His movies are a perfect blend of entertainment and emotion! 🎭"
    ]);
  }

  // Movies
  if (q.match(/baahubali|why kattappa killed|amarendra|mahendra/)) {
    return random([
      "Baahubali - the pride of Indian cinema! The movie that made the world ask 'Why Kattappa killed Baahubali?' 🗡️",
      "Rajamouli's magnum opus! Baahubali redefined Indian cinema on a global scale. Jai Mahishmati! 👑",
      "The epic that broke all records and barriers. Baahubali is not just a movie, it's an emotion! 🏰"
    ]);
  }

  if (q.match(/rrr|ram charan jr ntr|naatu naatu/)) {
    return random([
      "RRR - Rise, Roar, Revolt! The movie that won an Oscar and made every Indian proud! 🏆",
      "Rajamouli's international masterpiece! Ram Charan and Jr. NTR's bromance was legendary!",
      "From 'Naatu Naatu' to the Golden Globes - RRR conquered the world! What a spectacular film! 🌟"
    ]);
  }

  if (q.match(/pushpa|allu arjun fire|thaggede le/)) {
    return random([
      "Pushpa - The Rise! Allu Arjun's swag and Sukumar's direction created magic. 'Pushpa ante flower anukoku!' 🔥",
      "The movie that made 'Thaggede Le' a national phenomenon. Pushpa's attitude is unmatched!",
      "Sukumar and Allu Arjun's collaboration resulted in a pan-Indian blockbuster. Pushpa's rule! 👑"
    ]);
  }

  // General Tollywood
  if (q.match(/tollywood|telugu cinema|telugu movies/)) {
    return random([
      "Tollywood - the heart of Indian cinema! Known for its grand storytelling and emotional depth! 🎬",
      "Telugu cinema has given India some of its biggest blockbusters and finest actors!",
      "From mythological epics to modern blockbusters, Tollywood never fails to entertain! 🌟"
    ]);
  }

  return null;
};
