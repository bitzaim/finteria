const development = [{ UserAgent: "*" }, { Disallow: "/" }];
const production = [
  { UserAgent: "*" },
  { Allow: "/*.css" },
  { Allow: "/*.js" },
  { Allow: "/*.jpg" },
  { Allow: "/*.png" },
  { Allow: "/*.svg" },
  { Allow: "/*.woff2" },
  { Allow: "/*.ttf" },
  { Disallow: "/*earn/" },
  { Disallow: "/*reset/" },
  { Disallow: "/*profile/" },
  { Sitemap: `${useRuntimeConfig().public.META_HOST_URL}sitemap.xml` },
];

export default useRuntimeConfig().public.SENTRY_ENV == "production" ? production : development;
