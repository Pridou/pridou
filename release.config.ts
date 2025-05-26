import type { GlobalConfig } from "semantic-release";

export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "package-lock.json"],
      },
    ],
  ],
} satisfies Partial<GlobalConfig>;
