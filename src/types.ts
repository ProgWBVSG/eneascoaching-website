export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  image: string;
}

export interface SyllabusLevel {
  title: string;
  items: string[];
}
