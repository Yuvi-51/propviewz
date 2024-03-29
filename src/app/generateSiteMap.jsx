"use server";
import { configurations, locationsPune } from "@/constants/landigSlugPune";
import { promises as fs } from "fs";

const {
  getIndexAllProjectsAPI,
} = require("@/connections/get-requests/getIndexAllProjectsAPI");

const puneSitemapFilePath = "public/assets/seo/pune-sitemap.json";
const mumbaiSitemapFilePath = "public/assets/seo/mumbai-sitemap.json";
const landingSlugPuneSitemapPath =
  "public/assets/seo/landingSlugPuneSitemapContent.json";

export default async function generateSitemap() {
  try {
    const puneSitemapData = await getIndexAllProjectsAPI(2209);
    const mumbaiSitemapData = await getIndexAllProjectsAPI(2126);

    //INFO: indexing pune sitemap static json file

    const puneSitemapContent = puneSitemapData.map((item) => ({
      url: `https://propviewz.com/${item?.city_name?.toLowerCase()}/${
        item?.location_slug
      }/${item?.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    }));
    fs.writeFile(
      puneSitemapFilePath,
      JSON.stringify(puneSitemapContent),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    //INFO: indexing mumbai sitemap static json file

    const mumbaiSitemapContent = mumbaiSitemapData.map((item) => ({
      url: `https://propviewz.com/${item?.city_name?.toLowerCase()}/${
        item?.location_slug
      }/${item?.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    }));
    fs.writeFile(
      mumbaiSitemapFilePath,
      JSON.stringify(mumbaiSitemapContent),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    const landingSlugPuneSitemapContent = [];

    configurations.forEach((config) => {
      locationsPune.forEach((location) => {
        landingSlugPuneSitemapContent.push({
          url: `https://propviewz.com/projects/${config.toLowerCase()}-flat-in-${location}-pune`,
          lastModified: new Date(),
          changeFrequency: "weekly",
        });
      });
    });

    fs.writeFile(
      landingSlugPuneSitemapPath,
      JSON.stringify(landingSlugPuneSitemapContent, null, 2),
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Sitemap updated successfully.");
        }
      }
    );

    console.log("Sitemap updated successfully.");
  } catch (error) {
    console.error("Error updating sitemap:", error);
  }
}
