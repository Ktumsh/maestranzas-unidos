import { Metadata } from "next";

import { siteConfig } from "./site.config";

const { url, name, description } = siteConfig;

export const metadataConfig: Metadata = {
  metadataBase: new URL(url),
  applicationName: name,
  title: {
    template: `%s - ${name}`,
    default: name,
  },
  description: description,
};
