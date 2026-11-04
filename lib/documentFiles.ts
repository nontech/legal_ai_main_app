/**
 * File identifiers returned by the analysis API.
 *
 * `address` is whatever the backend expects on later summarize and delete
 * calls. After the GCS migration that value is a signed URL on
 * storage.googleapis.com (bucket thelawthing-legal-docs) or a gs:// URI.
 * Query strings are part of a signed URL and must be kept intact.
 */

export type StoredDocumentFile = {
  name: string;
  address: string;
};

const NAME_KEYS = ["name", "file_name", "filename", "original_filename"] as const;
const OBJECT_ADDRESS_KEYS = [
  "address",
  "file_address",
  "signed_url",
  "url",
  "gcs_uri",
  "gs_uri",
  "public_url",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

function firstList(record: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const list = stringList(record[key]);
    if (list.length > 0) return list;
  }
  return [];
}

function firstField(record: Record<string, unknown>, keys: readonly string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function filesFromObjects(payload: Record<string, unknown>): StoredDocumentFile[] {
  if (!Array.isArray(payload.files)) return [];
  return payload.files
    .filter(isRecord)
    .map((file, index) => ({
      name: firstField(file, NAME_KEYS) || `file-${index + 1}`,
      address: firstField(file, OBJECT_ADDRESS_KEYS),
    }))
    .filter((file) => file.address);
}

function filesFromRecord(payload: Record<string, unknown>): StoredDocumentFile[] {
  const names = firstList(payload, ["file_names", "fileNames", "filenames"]);
  const addresses = firstList(payload, [
    "file_addresses",
    "fileAddresses",
    "signed_urls",
    "signedUrls",
    "file_urls",
    "fileUrls",
    "gcs_uris",
    "gcsUris",
  ]);

  if (names.length > 0 || addresses.length > 0) {
    const count = Math.max(names.length, addresses.length);
    const zipped = Array.from({ length: count }, (_, index) => ({
      name: names[index] || `file-${index + 1}`,
      address: addresses[index] || "",
    })).filter((file) => file.address);

    if (zipped.length > 0) return zipped;
  }

  return filesFromObjects(payload);
}

export function extractUploadedFiles(payload: unknown): StoredDocumentFile[] {
  if (!isRecord(payload)) return [];

  const direct = filesFromRecord(payload);
  if (direct.length > 0) return direct;

  if (isRecord(payload.data)) {
    return filesFromRecord(payload.data);
  }

  return [];
}
