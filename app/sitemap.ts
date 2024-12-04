import { MetadataRoute } from "next";

type Route = {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://solosaunalepo2.co.kr";

  // Only include public routes
  const routes: Route[] = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "how-to-use", changeFrequency: "monthly", priority: 0.9 },
    { path: "guide", changeFrequency: "monthly", priority: 0.9 },
    { path: "location", changeFrequency: "monthly", priority: 0.9 },
    { path: "community", changeFrequency: "daily", priority: 0.8 },
    { path: "about", changeFrequency: "monthly", priority: 0.7 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path ? `/${path}` : ""}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
