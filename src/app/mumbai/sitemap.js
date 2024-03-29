"use server";
import { promises as fs } from "fs";

export default async function sitemap() {
  const data = fs.readFile(
    "public/assets/seo/mumbai-sitemap.json",
    "utf8",
    (err, data) => {
      if (err) throw err;
      return data;
    }
  );

  // console.log(await data);
  const validObject = await data;
  return await JSON.parse(validObject);
}
