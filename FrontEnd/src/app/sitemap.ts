import { MetadataRoute } from "next";



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
        changeFrequency: "daily" as const,
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error("Error generating product sitemap entries:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
