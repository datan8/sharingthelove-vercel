export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  category: string;
}

export interface FAQ {
  question: string;
  answer: string;
} 