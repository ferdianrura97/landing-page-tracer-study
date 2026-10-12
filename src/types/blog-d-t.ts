export type IBlogDT = {
  id: number;
  img: string;
  tag: string;
  tags?: Array<{ id: number; nama: string; slug: string }>;
  title: string;
  author: string;
  author_img?: string;
  author_location?: string;
  desc?: string;
  date: string;
  postboxQuote1?: boolean;
  postboxQuote2?: boolean;
  link?: string;
};
