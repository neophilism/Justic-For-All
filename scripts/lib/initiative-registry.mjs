/** Validate the reviewed, public-only initiative metadata source. */
const stages = new Set(["concept", "planning", "building", "paused", "retired"]);
const allowedEntryKeys = new Set(["slug","name","description","overview","status"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateInitiativeRegistry(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Registry must be an object");
  if (Object.keys(value).sort().join(",") !== "initiatives,schema_version" || value.schema_version !== 1) {
    throw new Error("Unsupported initiative registry version or unexpected metadata");
  }
  if (!Array.isArray(value.initiatives) || value.initiatives.length < 1 || value.initiatives.length > 100) {
    throw new Error("Initiative registry must contain between 1 and 100 entries");
  }
  const used = new Set();
  for (const entry of value.initiatives) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error("Invalid entry");
    const keys = Object.keys(entry);
    if (keys.length !== allowedEntryKeys.size || keys.some(k => !allowedEntryKeys.has(k))) {
      throw new Error("Private or unsupported entry fields are prohibited");
    }
    if (typeof entry.slug !== "string" || entry.slug.length > 64 || !slugPattern.test(entry.slug)) throw new Error("Invalid initiative slug");
    if (used.has(entry.slug)) throw new Error("Duplicate initiative slug: " + entry.slug);
    used.add(entry.slug);
    if (!stages.has(entry.status)) throw new Error("Status requires a verified service-release process");
    for (const [key,limit] of [["name",120],["description",350],["overview",1000]]) {
      if (typeof entry[key] !== "string" || entry[key].trim() !== entry[key] || entry[key].length < 20 || entry[key].length > limit) throw new Error("Invalid " + key + " in " + entry.slug);
      if (/[<>]/.test(entry[key])) throw new Error("HTML content prohibited in public registry");
    }
  }
  // Pilot/live statuses are intentionally not accepted from this static source:
  // a future rollout must pass independent connector health and publication controls.
  return value;
}
