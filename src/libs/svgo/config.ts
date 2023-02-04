import { Config as SVGGOConfig } from "svgo";

const CONFIG: SVGGOConfig = {
  multipass: true,
  plugins: [
    "removeTitle"
  ]
};
