import { random } from "../utils/helpers.ts";

export const handleOfficeStaffQuestions = (query: string): string | null => {
  const q = query.trim().toLowerCase();

  // Soumya (Office Girl)
  if (q.match(/who is soumya|about soumya|soumya|tell me about soumya/)) {
    return random([
      "Soumya is the lovely office girl of our company, sir! She takes excellent care of the office staff by providing tea and snacks. A true gem! ☕",
      "Ah, Soumya! She's our wonderful office assistant who keeps everyone refreshed with tea and delicious snacks. The office wouldn't be the same without her!",
      "Soumya is our dedicated office girl who ensures all staff members are well taken care of with tea and snacks. She's an essential part of our team! 🍵"
    ]);
  }

  // Swathi (Chief Sweeper)
  if (q.match(/who is swathi|about swathi|swathi|tell me about swathi/)) {
    return random([
      "Swathi is the chief sweeper in our office, sir! She keeps the office clean and neat, ensuring a pleasant working environment for everyone. 🧹",
      "Ah, Swathi! She's our dedicated chief sweeper who maintains the cleanliness and tidiness of our office. Her hard work keeps our workspace spotless!",
      "Swathi is our wonderful chief sweeper who ensures the office remains clean and neat at all times. A true professional in maintaining our workspace! ✨"
    ]);
  }

  // Omsai and Naresh (Gate Watchmans)
  if (q.match(/who is omsai|about omsai|omsai|tell me about omsai/)) {
    return random([
      "Omsai is one of the gate watchmans of our company, sir! He ensures the security and safety of our premises. A vigilant guardian! 🛡️",
      "Ah, Omsai! He's our dedicated gate watchman who keeps a careful eye on everyone entering and leaving our company premises.",
      "Omsai is our reliable gate watchman who ensures the security of our company. His watchful presence keeps us all safe! 👮"
    ]);
  }

  if (q.match(/who is naresh|about naresh|naresh|tell me about naresh/)) {
    return random([
      "Naresh is one of the gate watchmans of our company, sir! He works diligently to maintain security at our entrance. A trustworthy sentinel! 🛡️",
      "Ah, Naresh! He's our dependable gate watchman who ensures only authorized personnel enter our company premises.",
      "Naresh is our faithful gate watchman who stands guard to protect our company. His dedication to security is commendable! 👮"
    ]);
  }

  if (q.match(/who are omsai and naresh|about omsai and naresh|omsai and naresh|tell me about omsai and naresh/)) {
    return random([
      "Omsai and Naresh are the gate watchmans of our company, sir! They work together to ensure the security and safety of our premises. A dynamic duo! 🛡️👮",
      "Ah, Omsai and Naresh! They're our dedicated gate watchmans who keep vigilant watch over our company entrance, ensuring everyone's safety.",
      "Omsai and Naresh are our reliable gate watchmans who guard our company premises with dedication and professionalism. True protectors of our workplace! 🏢"
    ]);
  }

  return null;
};
