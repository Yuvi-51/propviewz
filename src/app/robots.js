// export default function robots() {
//   return {
//     rules: {
//       userAgent: "*",
//       crawlDelay: 3,
//     },
//     sitemap: [
//       `${process.env.NEXT_PUBLIC_HOST}/pune/sitemap.xml`,
//       `${process.env.NEXT_PUBLIC_HOST}/mumbai/sitemap.xml`,
//     ],
//   };
// }

const HOST = process.env.NEXT_PUBLIC_HOST;

export default function robots() {
  if (HOST === "https://propviewz.com") {
    return {
      rules: [
        {
          userAgent: "*",
          crawlDelay: 3,
        },
      ],
      sitemap: [`${HOST}/pune/sitemap.xml`, `${HOST}/mumbai/sitemap.xml`],
    };
  } else {
    // If HOST is not "https://propviewz.com/", block all crawlers
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }
}
