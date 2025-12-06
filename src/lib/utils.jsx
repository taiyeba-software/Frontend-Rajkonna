import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// Normalize various MongoDB/id shapes to a plain string id
export function normalizeId(idOrObj) {
  if (!idOrObj && idOrObj !== 0) return null;
  // if it's already a string, return it
  if (typeof idOrObj === "string") return idOrObj;
  // common mongodb export shape: { $oid: '...' }
  if (idOrObj && typeof idOrObj === "object") {
    if (typeof idOrObj.toString === "function" && Object.keys(idOrObj).length === 0) return idOrObj.toString();
    if (idOrObj.$oid) return idOrObj.$oid;
    if (idOrObj._id) return normalizeId(idOrObj._id);
    if (idOrObj.id) return normalizeId(idOrObj.id);
    if (idOrObj.$id) return idOrObj.$id;
    // fallback to JSON string
    try {
      return String(idOrObj);
    } catch (e) {
      return null;
    }
  }
  return String(idOrObj);
}
