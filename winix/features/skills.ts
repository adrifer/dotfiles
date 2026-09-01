import { feature, type HomeHelper } from "@adrifer/winix";
import { readdirSync } from "node:fs";

export interface SkillsOptions {
  exclude?: string[];
}

const skillsDirectory = new URL("../../skills/", import.meta.url);
// Add directory names here to exclude skills from every host.
const excludedSkills: string[] = [];

const skillFiles = (home: HomeHelper, ...names: string[]) =>
  Object.fromEntries(
    names.map((name) => [
      `.agents/skills/${name}`,
      home.symlink(`~/dotfiles/skills/${name}`, { recursive: true }),
    ]),
  );

const skillNames = (excludedNames: string[]) => {
  const excluded = new Set([...excludedSkills, ...excludedNames]);

  return readdirSync(skillsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !excluded.has(entry.name))
    .map((entry) => entry.name)
    .sort();
};

export const skills = feature(
  "skills",
  ({ home }, { exclude = [] }: SkillsOptions = {}) => {
    home.files(skillFiles(home, ...skillNames(exclude)));
  },
);
