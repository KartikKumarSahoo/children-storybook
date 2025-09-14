export interface PreDefinedValues {
  traits: string[];
  interests: string[];
  physicalTraits: {
    hairColors: string[];
    eyeColors: string[];
    favoriteColors: string[];
  };
}

// Unified physicalTraits for all age groups
const UNIFIED_PHYSICAL_TRAITS = {
  hairColors: [
    "brown",
    "blonde",
    "black",
    "red",
    "dark brown",
    "light brown"
  ],
  eyeColors: [
    "black",
    "brown",
    "blue",
    "green",
    "hazel",
    "gray",
    "amber"
  ],
  favoriteColors: [
    "red",
    "blue",
    "yellow",
    "pink",
    "green",
    "purple",
    "orange",
    "teal",
    "black"
  ]
};

export const AGE_APPROPRIATE_VALUES: Record<string, PreDefinedValues> = {
  // Ages 3-5: Simple, gentle traits and interests
  "3-5": {
    traits: ["kind", "curious", "playful", "gentle", "happy", "brave"],
    interests: [
      "animals",
      "toys",
      "music",
      "colors",
      "blocks",
      "bubbles",
      "books",
      "dancing",
    ],
    physicalTraits: UNIFIED_PHYSICAL_TRAITS,
  },

  // Ages 6-8: More complex interests and social traits
  "6-8": {
    traits: [
      "adventurous",
      "creative",
      "funny",
      "helpful",
      "smart",
      "friendly",
      "brave",
      "curious",
    ],
    interests: [
      "dinosaurs",
      "space",
      "art",
      "sports",
      "superheroes",
      "animals",
      "music",
      "puzzles",
      "cooking",
      "nature",
    ],
    physicalTraits: UNIFIED_PHYSICAL_TRAITS,
  },

  // Ages 9-12: Advanced interests and personality traits
  "9-12": {
    traits: [
      "determined",
      "creative",
      "intelligent",
      "compassionate",
      "independent",
      "confident",
      "adventurous",
      "artistic",
    ],
    interests: [
      "science",
      "technology",
      "sports",
      "music",
      "art",
      "reading",
      "gaming",
      "cooking",
      "friendship",
      "mystery",
      "adventure",
    ],
    physicalTraits: UNIFIED_PHYSICAL_TRAITS,
  },
};

export function getAgeGroup(age: number): string {
  if (age >= 3 && age <= 5) return "3-5";
  if (age >= 6 && age <= 8) return "6-8";
  if (age >= 9 && age <= 12) return "9-12";
  return "6-8"; // default fallback
}

export function getRandomSelection<T>(array: T[], count: number = 3): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

export function generateAgeAppropriateSuggestions(age: number) {
  const ageGroup = getAgeGroup(age);
  const values = AGE_APPROPRIATE_VALUES[ageGroup];

  return {
    traits: getRandomSelection(values.traits, 3),
    interests: getRandomSelection(values.interests, 3),
    physicalTraits: {
      hairColor: getRandomSelection(values.physicalTraits.hairColors, 1)[0],
      eyeColor: getRandomSelection(values.physicalTraits.eyeColors, 1)[0],
      favoriteColor: getRandomSelection(
        values.physicalTraits.favoriteColors,
        1
      )[0],
    },
  };
}
