import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/how-to-use", "/guide", "/location", "/community"],
        disallow: ["/account/", "/admin/", "/api/"],
      },
    ],
    sitemap: "https://solosaunalepo2.co.kr/sitemap.xml",
  };
} 