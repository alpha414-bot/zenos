// builders/sitemap.js

import GenerateSitemap from "react-router-sitemap-maker";
import router from "./Services/Router";

const sitemapData = await GenerateSitemap(router as any, {
	baseUrl: "https://zenos.web.app",
	hashrouting: true,
	changeFrequency: "monthly"
});

sitemapData.toFile("./dist/sitemap.xml");