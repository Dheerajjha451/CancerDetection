import type { MetadataRoute } from "next";

const productionUrl = "https://healthcare.dheerajjha.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${productionUrl}/`,
      lastModified: new Date(),
    },
  ];
}
