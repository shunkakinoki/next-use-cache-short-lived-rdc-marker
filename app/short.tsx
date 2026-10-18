import { cacheLife } from "next/cache";

// Zero-arg cached read shared by every route. REPRO_LIFE picks the profile:
// "seconds" (expire 60s, under the 5-minute prerender floor) reproduces;
// "hours" is the control.
async function readShared() {
  "use cache";
  if (process.env.REPRO_LIFE === "hours") {
    cacheLife("hours");
  } else {
    cacheLife("seconds");
  }
  return "shared";
}

export async function Short() {
  const value = await readShared();
  return <span data-short>{value}</span>;
}
