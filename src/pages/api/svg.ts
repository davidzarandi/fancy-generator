import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

type ApiRequest = NextApiRequest & {
  query: {
    iconURL: string;
    label: string;
    brandColor?: string;
    textColor?: string;
    redirect?: string;
  };
};

const MULTIPLIER = 6.16;
const TEXT_WIDTH_OFFSET = 29;
const DEFAULT_BRAND_COLOR = "e0234e";
const DEFAULT_TEXT_COLOR = "f5f5f5";

export default async function handler(req: ApiRequest, res: NextApiResponse) {
  if (!req.query.iconURL) {
    res.status(400);
    res.send("iconURL query parameter required!");
    return;
  }

  if (!req.query.iconURL) {
    res.status(400);
    res.send("label query parameter required!");
    return;
  }

  const imageResponse = await fetch(req.query.iconURL);
  if (!imageResponse.ok) {
    res.status(400);
    res.send("icon request failed!");
    return;
  }

  const templatePath = path.resolve("./public", "template.svg");
  let template = fs.readFileSync(templatePath, "utf-8");

  const textColor = `#${req.query.textColor ?? DEFAULT_TEXT_COLOR}`;
  template = template.replaceAll("{TEXT_COLOR}", textColor);

  const imageString = (await imageResponse.text()).replace("<svg", `<svg fill="${textColor}"`);
  const imageHash = Buffer.from(imageString).toString("base64");
  template = template.replaceAll("{IMAGE_HASH}", imageHash);

  const label = req.query.label;
  template = template.replaceAll("{LABEL}", label);

  const textWidth = label.length * MULTIPLIER + TEXT_WIDTH_OFFSET;
  template = template.replaceAll("{TEXT_WIDTH}", textWidth.toString(10));

  const brandColor = `#${req.query.brandColor ?? DEFAULT_BRAND_COLOR}`;
  template = template.replaceAll("{BRAND_COLOR}", brandColor);

  const redirect = req.query.redirect ?? "#";
  template = template.replaceAll("{REDIRECT}", redirect);

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200);
  res.send(template);
}
