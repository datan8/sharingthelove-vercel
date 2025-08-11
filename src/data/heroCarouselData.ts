export interface HeroSlide {
  id: number;
  image: string;
  childName: string;
  quote: string;
  age?: number;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "/images/HeroPhotos/507107483_698667549601225_6212224014476634615_n.jpg",
    childName: "Mai",
    quote: "Every day I learn something new at school. Thank you for helping us have books and teachers.",
    age: 8
  },
  {
    id: 2,
    image: "/images/HeroPhotos/509792960_1019029556981994_3770430317161118731_n.jpg",
    childName: "Linh",
    quote: "The organic garden teaches us to grow healthy food. I want to become a farmer when I grow up!",
    age: 10
  },
  {
    id: 3,
    image: "/images/HeroPhotos/507131879_4007629332841305_4163659404685393975_n.jpg",
    childName: "Duc",
    quote: "Having three meals a day makes me strong for playing soccer with my friends.",
    age: 12
  },
  {
    id: 4,
    image: "/images/HeroPhotos/509780362_1766732013878381_6100239691631582297_n.jpg",
    childName: "Hoa",
    quote: "I dream of becoming a teacher to help other children learn and grow.",
    age: 9
  },
  {
    id: 5,
    image: "/images/HeroPhotos/508229421_1413533039692069_6633260446471735816_n.jpg",
    childName: "Minh",
    quote: "The medicine you provide helps me stay healthy and play with my friends every day.",
    age: 7
  },
  {
    id: 6,
    image: "/images/HeroPhotos/507110386_1482465589795875_4647900434545445981_n.jpg",
    childName: "An",
    quote: "Learning to read has opened up a whole new world of stories and adventures for me.",
    age: 11
  }
];
