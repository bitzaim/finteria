import { Picture } from "@/types/image.type";

export type News = {
  id: number;
  title: string;
  logo: Picture | string;
  backgroundColor?: string;
  width: number;
  height: number;
  alt: string;
  date?: string;
  description: string;
  link: string;
};

export const PRESS_MEDIA_NEWS: News[] = [
  {
    id: 1,
    title: "What Is a Trading Platform? Definition, Features and Advantages",
    logo: "/img/press-and-media/trading-education.svg",
    width: 198,
    height: 53,
    alt: "Trading Education Logo",
    date: "2023-03-13",
    description:
      "Trading platforms are crucial for anyone who invests in the financial markets. A trading platform is a software application",
    link: "https://trading-education.com/what-is-a-trading-platform",
  },
  {
    id: 2,
    title: "What is cryptocurrency trading and how does it work?",
    logo: {
      original: "/img/press-and-media/analytics-insight.png",
      webp: "/img/press-and-media/webp/analytics-insight.webp",
      avif: "/img/press-and-media/avif/analytics-insight.avif",
    },
    width: 250,
    height: 33,
    alt: "Analytics Insight",
    date: "2023-03-14",
    description:
      "Are you interested to start a journey in the exciting world of cryptocurrency trading? Look no further than Finteria, a trusted investing broker",
    link: "https://www.analyticsinsight.net/what-is-cryptocurrency-trading-and-how-does-it-work/",
  },
  {
    id: 6,
    title: "Is It Possible To Become Rich By Currency Trading?",
    logo: "/img/press-and-media/california-journal.svg",
    width: 275,
    height: 30,
    alt: "California Business Journal",
    date: "2023-03-22",
    description:
      "The forex market is the largest financial market globally, with trillions of dollars in daily transactions. Forex trading involves",
    link: "https://calbizjournal.com/is-it-possible-to-become-rich-by-currency-trading/",
  },
  {
    id: 8,
    title: "How to Start Online Trading in 4 Simple Steps",
    logo: "/img/press-and-media/cryptwerk.svg",
    width: 275,
    height: 30,
    alt: "Cryptwerk",
    date: "2023-03-29",
    description:
      "In today's digital world, online trading has become increasingly popular among investors, providing flexibility and convenience",
    link: "https://cryptwerk.com/post/how-to-start-online-trading-in-4-simple-steps/",
  },
  {
    id: 13,
    title: "Insider Secrets of a Successful Crypto Trader: Strategies for Profitable Trading",
    logo: "/img/press-and-media/wallet-investor.svg",
    width: 84,
    height: 40,
    alt: "Wallet Investor",
    date: "2023-03-06",
    description:
      "Trading is a complex endeavor that requires a high degree of skill and expertise, regardless of whether you’re an experienced trader or just starting out.",
    link: "https://walletinvestor.com/magazine/insider-secrets-of-a-successful-crypto-trader-strategies-for-profitable-trading",
  },
  {
    id: 14,
    title: "The Life of a Finteria Forex Trader: Insider Tips for Profitable Trading",
    logo: "/img/press-and-media/fx-trading-revolution.svg",
    width: 212,
    height: 70,
    alt: "FX Trading Revolution",
    date: "2023-02-17",
    description:
      "As a forex trader, my day starts with a review of my personalized watchlist to identify any changes that could affect my open or anticipated positions.",
    link: "https://www.fxtradingrevolution.com/forex-blog/the-life-of-a-finteria-forex-trader-insider-tips-for-profitable-trading",
  },
  {
    id: 15,
    title: "Finteria – The High-Leverage Crypto Trading Platform",
    logo: {
      original: "/img/press-and-media/the-crypto-basic.png",
      webp: "/img/press-and-media/webp/the-crypto-basic.webp",
      avif: "/img/press-and-media/avif/the-crypto-basic.avif",
    },
    width: 128,
    height: 37,
    alt: "The Crypto Basic",
    date: "2023-02-17",
    description:
      "Are you a crypto trader looking for a platform that offers high leverage? Look no further than Finteria!",
    link: "https://thecryptobasic.com/2023/02/17/finteria-the-high-leverage-crypto-trading-platform/",
  },
  {
    id: 16,
    title: "How Finteria Trading Platform Helps Maximize Profits",
    logo: {
      original: "/img/press-and-media/money-mini-blog.png",
      webp: "/img/press-and-media/webp/money-mini-blog.webp",
      avif: "/img/press-and-media/avif/money-mini-blog.avif",
    },
    width: 270,
    height: 64,
    alt: "Money Mini Blog",
    date: "2023-02-17",
    description:
      "Cryptocurrency trading has been one of the most profitable ventures in recent years, with the market witnessing exponential growth.",
    link: "https://moneyminiblog.com/cryptocurrency/finteria-trading-platform-helps-maximize-profits/",
  },
  {
    id: 19,
    title: "Join Finteria and trade Crypto, Forex, and CFDs.",
    logo: "/img/press-and-media/cryptwerk.svg",
    width: 275,
    height: 30,
    alt: "Cryptwerk",
    description: "Finteria is a crypto broker that offers a variety of trading options to clients.",
    link: "https://cryptwerk.com/company/finteria/",
  },
];
