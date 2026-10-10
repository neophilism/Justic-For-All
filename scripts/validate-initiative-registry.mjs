import {readFileSync} from "node:fs";
import {validateInitiativeRegistry} from "./lib/initiative-registry.mjs";
const path = new URL("../config/initiative-registry.v1.json",import.meta.url);
const parsed = validateInitiativeRegistry(JSON.parse(readFileSync(path,"utf8")));
process.stdout.write("Validated public initiative manifest v"+parsed.schema_version+": "+parsed.initiatives.length+" entries\n");
