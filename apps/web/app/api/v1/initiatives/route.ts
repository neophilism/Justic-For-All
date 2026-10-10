import { initiatives } from "@jfa/core";
import { publicApiSuccess } from "../../../../lib/api-response";

export function GET() {
  // Explicit projection only: do not serialize service URLs, internal notes, or contacts.
  const data = initiatives.map(({ slug, name, description, status }) => ({ slug, name, description, status }));
  return publicApiSuccess(data);
}
