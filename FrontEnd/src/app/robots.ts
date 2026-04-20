import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/user/", "/auth/", "/checkout/", "/cart/"],
        crawlDelay: 1,
      },
    ],
    sitemap: "https://asiadronestore.online/sitemap.xml",
  };
}
