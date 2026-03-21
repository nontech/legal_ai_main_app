/**
 * Mirrors the backend `case_entity_relationships` object (stored in DB column `entity_relationship` JSONB).
 * API field names are preserved for round-trip fidelity.
 */

export type CaseEntityType =
  | "person"
  | "organization"
  | "location"
  | "court"
  | "government"
  | "other";

export interface CaseEntityRelationshipEntity {
  id: string;
  name: string;
  type: CaseEntityType;
  role_in_case?: string;
  notes?: string;
}

export interface CaseEntityRelationshipEdge {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  description?: string;
}

export interface CaseEntityRelationships {
  entities: CaseEntityRelationshipEntity[];
  relationships: CaseEntityRelationshipEdge[];
  /** Extraction note; optional on persisted/API payloads. */
  reasoning?: string;
  /** Optional: short label for the dispute (from extraction). */
  dispute_subject?: string;
  /** Optional: longer dispute summary (from extraction). */
  dispute_summary?: string;
}

export function parseCaseEntityRelationships(
  value: unknown
): CaseEntityRelationships | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  if (!Array.isArray(o.entities) || !Array.isArray(o.relationships)) return null;
  return value as CaseEntityRelationships;
}

/**
 * True when the payload has at least one entity or relationship so the backend
 * should reuse the graph as-is (skip entity-relationship LLM extraction).
 */
export function isSubstantiveCaseEntityRelationships(
  value: unknown
): boolean {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  const entities = Array.isArray(o.entities) ? o.entities : [];
  const relationships = Array.isArray(o.relationships) ? o.relationships : [];
  return entities.length > 0 || relationships.length > 0;
}
