import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/user/", "/auth/", "/checkout/", "/cart/", "/api/"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/user/", "/auth/", "/checkout/", "/cart/", "/api/"],
      }
    ],
    sitemap: "https://asiadronestore.com/sitemap.xml",
  };
}
