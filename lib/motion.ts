import { existsSync } from "node:fs";
import path from "node:path";
import type { Project } from "./projects";

/**
 * Optional generated hero motion for a project (public/media/projects/<slug>/motion.mp4, produced by
 * `npm run animate` through the Higgsfield API). Resolved at render time so a clip is picked up as soon as
 * the file exists; projects without one keep their Ken Burns still.
 */
export function projectMotion(project: Project): { src: string; poster: string } | null {
  if (project.video) return project.video;
  const rel = `/media/projects/${project.slug}/motion.mp4`;
  return existsSync(path.join(process.cwd(), "public", rel)) ? { src: rel, poster: project.hero.src } : null;
}
