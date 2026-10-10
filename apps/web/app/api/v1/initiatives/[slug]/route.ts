import { findPublicInitiative } from "@jfa/core";
import { publicApiSuccess, publicApiError } from "../../../../../lib/api-response";

type Context = { params: Promise<{ slug: string }> };
export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) {
    return publicApiError(404, "not_found", "Initiative not found");
  }
  const found = findPublicInitiative(slug);
  if (!found) return publicApiError(404, "not_found", "Initiative not found");
  const { name, description, status } = found;
  return publicApiSuccess({ slug, name, description, status });
}
