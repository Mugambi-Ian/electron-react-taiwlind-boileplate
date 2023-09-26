export interface ProloxProduct {
  href: string;
  title: string;
  rating: number;
  category: string;
  displayPic: string;
  description: string;
  inventory: Record<string, number>;
  tags: Record<string, string | number>;
  price: { online: number; unit: number };
}

export interface ProloxCategory {
  href: string;
  title: string;
}

export class ProductDTO implements ProloxProduct {
  tags = {};

  href = '';

  title = '';

  rating = 0;

  category = '';

  displayPic = '';

  description = '';

  price = { online: 0, unit: 0 };

  inventory: Record<string, number> = { '12[3j[3121': 0 };
}
