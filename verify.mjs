import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const build = (life) => {
  rmSync(".next", { recursive: true, force: true });
  const run = spawnSync("npx", ["next", "build"], {
    encoding: "utf8",
    env: { ...process.env, REPRO_LIFE: life },
  });
  const output = `${run.stdout}${run.stderr}`;
  const routes = [
    ...output.matchAll(/Route "([^"]+)": Unexpected cache miss/g),
  ].map((match) => match[1]);
  console.log(
    `cacheLife("${life}"): build exit ${run.status}, ${routes.length} warning(s)` +
      (routes.length ? `: ${routes.join(", ")}` : ""),
  );
  if (run.status !== 0) {
    console.log(output);
    process.exit(2);
  }
  return routes.length;
};

const shortLived = build("seconds");
const control = build("hours");

if (shortLived > 0 && control === 0) {
  console.log("REPRODUCED: the short-lived shared entry warns; the control is clean.");
  process.exit(0);
}
console.log("NOT REPRODUCED");
process.exit(1);
