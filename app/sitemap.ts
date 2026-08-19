import type { MetadataRoute } from "next";

const productionUrl = "https://healthcare.dheerajjha.com";

const routes = [
  "",
  "/auth/login",
  "/auth/register",
  "/auth/reset",
  "/auth/new-password",
  "/auth/new-verification",
  "/auth/error",
  "/braintumor",
  "/lungcancer",
  "/skincancer",
  "/chatbot",
  "/news",
  "/videocall",
  "/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${productionUrl}${route}`,
    lastModified: new Date(),
  }));
}
