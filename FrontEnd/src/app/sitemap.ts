import { MetadataRoute } from "next";

interface SitemapProduct {
  _id?: string;
  id?: string;
  updatedAt?: string | number | Date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://asiadronestore.online";

  // Static routes
  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/contact",
    "/privacy",
    "/terms-and-conditions",
    "/help",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const products = await res.json();

    // Check if products is an array or an object containing an array
    const productList: SitemapProduct[] = Array.isArray(products) ? products : (products.products || []);

    productRoutes = productList.map((product: SitemapProduct) => ({
      url: `${baseUrl}/products/${product._id || product.id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
