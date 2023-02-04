import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { nanoid } from "nanoid";

import { s3UploadFile } from "@/libs/s3/uploadFile";
import getBoundingBox from "@/libs/opentype/getBoundingBox";
import getSVG from "@/libs/opentype/getSVG";
import getFont from "@/libs/opentype/getFont";

type ApiRequest = NextApiRequest & {
  query: {
    iconURL: string;
    label: string;
    brandColor?: string;
    textColor?: string;
  };
};

const IMAGE_WIDTH_OFFSET = 2.5;
const DEFAULT_BRAND_COLOR = "e0234e";
const DEFAULT_TEXT_COLOR = "f5f5f5";

export default async function handler(req: ApiRequest, res: NextApiResponse) {
  if (!req.query.iconURL) {
    res.status(400).json({ error: "iconURL query parameter required!" });
    return;
  }

  if (!req.query.iconURL) {
    res.status(400).json({ error: "label query parameter required!" });
    return;
  }
  // TODO: limit the number of characters to 255

  const imageResponse = await fetch(req.query.iconURL);
  if (!imageResponse.ok) {
    console.error("Image fetch failed");
    res.status(400).json({ error: "icon request failed!" });
    return;
  }

  const templatePath = path.resolve("public", "badge_template.svg");
  let template = fs.readFileSync(templatePath, "utf-8");

  const textColor = `#${req.query.textColor ?? DEFAULT_TEXT_COLOR}`;
  template = template.replaceAll("{TEXT_COLOR}", textColor);

  const imageString = (await imageResponse.text()).replace("<svg", `<svg fill="${textColor}"`);
  const imageHash = Buffer.from(imageString).toString("base64");
  template = template.replaceAll("{IMAGE_HASH}", imageHash);

  const font = getFont();
  const text = req.query.label;
  const textSVG = getSVG(text, font);
  template = template.replaceAll("{TEXT_SVG}", textSVG);

  const imageWidth = getBoundingBox(text, font);
  template = template.replaceAll("{IMAGE_WIDTH}", (imageWidth.x2 + IMAGE_WIDTH_OFFSET).toString(10));

  const brandColor = `#${req.query.brandColor ?? DEFAULT_BRAND_COLOR}`;
  template = template.replaceAll("{BRAND_COLOR}", brandColor);

  let fileURL = "";
  let key = `${nanoid()}.svg`;
  try {
    fileURL = await s3UploadFile(key, template, "image/svg+xml");
  } catch (e) {
    console.error("S3 file upload failed", e);
    res
      .status(500)
      .json({ error: "Something went wrong with the file upload, please try again later." });
    return;
  }

  res.status(200).json({ fileURL });
}
