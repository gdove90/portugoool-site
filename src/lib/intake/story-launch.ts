// "What's Your GOAL?" launch switch (owner decision 2026-10-28).
//
// STATE A (default): the campaign page is public and readable, but story
// submissions are closed: the form cannot start an upload and the server
// refuses story starts. Kit Wear quotes and Match Highlights keep their own
// INTAKE_ENABLED behaviour and are not affected.
//
// STATE B: set STORY_INTAKE_OPEN=true in the Netlify production context and
// redeploy, once the participation agreement names the actual operator and
// the owner authorizes public intake. An unset or mistyped value stays closed.
export function storyIntakeOpen(): boolean {
  return process.env.STORY_INTAKE_OPEN === "true";
}
