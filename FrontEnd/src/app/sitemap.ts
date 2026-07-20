import { MetadataRoute } from "next";



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://asiadronestore.com";

  const staticRoutes = [
    { route: "", priority: 1.0, freq: "daily" as const },
    { route: "/products", priority: 0.9, freq: "daily" as const },
    { route: "/about", priority: 0.8, freq: "monthly" as const },
    { route: "/contact", priority: 0.8, freq: "monthly" as const },
    { route: "/privacy", priority: 0.5, freq: "yearly" as const },
    { route: "/terms-and-conditions", priority: 0.5, freq: "yearly" as const },
    { route: "/help", priority: 0.7, freq: "monthly" as const },
  ].map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority: priority,
  }));

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");
    
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    productRoutes = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      // Handle timestamp
      let lastModified = new Date();
      if (data.updatedAt) {
        lastModified = typeof data.updatedAt === 'number' 
          ? new Date(data.updatedAt) 
          : data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
      } else if (data.createdAt) {
        lastModified = typeof data.createdAt === 'number'
          ? new Date(data.createdAt)
          : data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      }

      return {
        url: `${baseUrl}/products/${id}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Error generating product sitemap entries:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
