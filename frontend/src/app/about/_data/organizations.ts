import { readFileSync, readdirSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { kebabCase, sortBy } from "lodash";

import { Organization } from "@/app/_components/Organization";

const files = sortBy(readdirSync(path.join(process.cwd(), "content", "organizations")), (file) => file);

type OrganizationWithExtra = Organization & {
  largeImage?: {
    url?: string | null;
  } | null;
  members?: {
    [key: string]: {
      name: string;
      title: string;
      mail?: string;
      phoneNumber?: string;
    };
  };
};

type OrganizationData = {
  organization: OrganizationWithExtra;
  fileName: string;
  slug: string;
  markdown: string;
};
const unorderedOrganizationData: OrganizationData[] = [];

for (const file of files) {
  const data = parseOrganizationData({ fileName: file });
  unorderedOrganizationData.push(data);
}

const organizationData = sortBy(unorderedOrganizationData, (data) => data.organization.id);
export { organizationData };

function parseOrganizationData(params: { fileName: string }): OrganizationData {
  const markDownWithMetadata = readFileSync(
    path.join(process.cwd(), "content", "organizations", params.fileName)
  ).toString();
  const { data, content } = matter(markDownWithMetadata);
  const slug = kebabCase(data.title);
  const organization: Organization & {
    largeImage?: {
      url?: string | null;
    } | null;
    members?: {
      [key: string]: {
        name: string;
        title: string;
        mail?: string;
        phoneNumber?: string;
      };
    };
  } = {
    id: kebabCase(data.title),
    name: data.title,
    slogan: data.description,
    logo: {
      url: data.logo,
    },
    largeImage: {
      url: data.image,
    },
    members: data.board,
  };
  return { organization, fileName: params.fileName, markdown: content, slug };
}

function getOrganizationData(params: {
  slug: string;
}): { organization: OrganizationWithExtra; markdown: string } | null {
  const organization = organizationData.find((data) => data.slug === params.slug)?.organization;
  const markdown = organizationData.find((data) => data.slug === params.slug)?.markdown;
  if (!organization || !markdown) {
    return null;
  }
  return { organization, markdown };
}

export { getOrganizationData };
