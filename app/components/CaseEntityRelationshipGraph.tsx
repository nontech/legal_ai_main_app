"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
import { useTranslations } from "next-intl";
import { litigationSideFromRole } from "@/lib/caseEntityLitigationRole";
import { entityRoleMatchesCase } from "@/lib/caseEntityUserRole";
import type {
  CaseEntityRelationshipEdge,
  CaseEntityRelationshipEntity,
  CaseEntityRelationships,
} from "@/lib/types/caseEntityRelationships";

const DISPUTE_EDGE_RE =
  /dispute|claim|litigation|breach|eviction|lawsuit|alleged|against|owed|arrears|damages|violation|termination/i;

function relationshipHighlightsDispute(rel: CaseEntityRelationshipEdge): boolean {
  const hay = `${rel.relationship_type} ${rel.description ?? ""}`;
  return DISPUTE_EDGE_RE.test(hay);
}

const NODE_WIDTH = 196;
const NODE_HEIGHT = 76;

const TYPE_STYLES: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  person: { border: "#2563eb", bg: "#eff6ff", text: "#1e3a8a" },
  organization: { border: "#7c3aed", bg: "#f5f3ff", text: "#5b21b6" },
  location: { border: "#059669", bg: "#ecfdf5", text: "#047857" },
  court: { border: "#d97706", bg: "#fffbeb", text: "#b45309" },
  government: { border: "#475569", bg: "#f1f5f9", text: "#334155" },
  other: { border: "#64748b", bg: "#f8fafc", text: "#334155" },
};

function typeStyle(entityType: string) {
  return TYPE_STYLES[entityType] ?? TYPE_STYLES.other;
}

function EntityNode({ data }: NodeProps) {
  const t = useTranslations("caseAnalysis.results.entityRelationships");
  const st = typeStyle(String(data.entityType ?? "other"));
  const isUser = Boolean(data.isUserPosition);
  const litigationSide = data.litigationSide as
    | "plaintiff"
    | "defendant"
    | null
    | undefined;
  const summary = [data.label, data.entityType, data.role, data.notes]
    .filter(Boolean)
    .join(" — ");
  const title =
    summary.length > 0
      ? `${summary} · ${t("cardClickHint")}`
      : t("cardClickHint");

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-slate-400"
      />
      <div
        className={`relative min-w-[168px] max-w-[220px] cursor-pointer rounded-lg border-2 px-3 py-2 shadow-sm transition hover:brightness-[0.98] ${
          isUser
            ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-slate-50"
            : ""
        }`}
        style={{ borderColor: st.border, background: st.bg }}
        title={title}
      >
        {litigationSide === "plaintiff" && (
          <span className="absolute -left-1.5 -top-2 rounded-full bg-sky-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            {t("plaintiffBadge")}
          </span>
        )}
        {litigationSide === "defendant" && (
          <span className="absolute -left-1.5 -top-2 rounded-full bg-rose-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            {t("defendantBadge")}
          </span>
        )}
        {isUser && (
          <span className="absolute -right-1.5 -top-2 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            {t("youBadge")}
          </span>
        )}
        <div
          className="text-sm font-semibold leading-tight"
          style={{ color: st.text }}
        >
          {String(data.label ?? "")}
        </div>
        <div className="mt-0.5 text-xs text-slate-600">
          {String(data.entityType ?? "")}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-slate-400"
      />
    </>
  );
}

const nodeTypes = { entity: EntityNode };

function relationshipsForEntity(
  entityId: string,
  graph: CaseEntityRelationships,
  entityById: Map<string, CaseEntityRelationshipEntity>
) {
  const out: Array<{
    rel: CaseEntityRelationshipEdge;
    other: CaseEntityRelationshipEntity;
    direction: "out" | "in" | "loop";
  }> = [];
  for (const rel of graph.relationships) {
    if (rel.source_id === entityId && rel.target_id === entityId) {
      const self = entityById.get(entityId);
      if (self) out.push({ rel, other: self, direction: "loop" });
    } else if (rel.source_id === entityId) {
      const other = entityById.get(rel.target_id);
      if (other) out.push({ rel, other, direction: "out" });
    } else if (rel.target_id === entityId) {
      const other = entityById.get(rel.source_id);
      if (other) out.push({ rel, other, direction: "in" });
    }
  }
  return out;
}

function EntityDetailModal({
  entity,
  graph,
  caseRole,
  open,
  onClose,
}: {
  entity: CaseEntityRelationshipEntity | null;
  graph: CaseEntityRelationships;
  caseRole?: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("caseAnalysis.results.entityRelationships");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, mounted, onClose]);

  const entityById = useMemo(
    () => new Map(graph.entities.map((e) => [e.id, e])),
    [graph.entities]
  );

  const relRows = useMemo(() => {
    if (!entity) return [];
    return relationshipsForEntity(entity.id, graph, entityById);
  }, [entity, graph, entityById]);

  if (!mounted || !entity || !open) return null;

  const isUser = entityRoleMatchesCase(entity.role_in_case, caseRole);
  const litigationSide = litigationSideFromRole(entity.role_in_case);

  return createPortal(
    <div className="fixed inset-0 z-[10050] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={t("entityDetailClose")}
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-detail-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2
              id="entity-detail-title"
              className="text-lg font-semibold text-slate-900"
            >
              {entity.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {litigationSide === "plaintiff" && (
                <span className="inline-block rounded-full bg-sky-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {t("plaintiffBadge")}
                </span>
              )}
              {litigationSide === "defendant" && (
                <span className="inline-block rounded-full bg-rose-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {t("defendantBadge")}
                </span>
              )}
              {isUser && (
                <span className="inline-block rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {t("youBadge")}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200/80"
          >
            {t("entityDetailClose")}
          </button>
        </div>
        <div className="max-h-[min(72vh,560px)] overflow-y-auto px-4 py-4 sm:px-5">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t("entityDetailType")}
              </dt>
              <dd className="mt-0.5 text-slate-900">{entity.type}</dd>
            </div>
            {entity.role_in_case?.trim() ? (
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t("roleLabel")}
                </dt>
                <dd className="mt-0.5 text-slate-900">{entity.role_in_case}</dd>
              </div>
            ) : null}
            {entity.notes?.trim() ? (
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t("entityDetailNotes")}
                </dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-slate-800">
                  {entity.notes}
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {t("entityDetailRelationships")}
            </h3>
            {relRows.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">{t("noRelationships")}</p>
            ) : (
              <ul className="mt-2 space-y-3">
                {relRows.map(({ rel, other, direction }) => (
                  <li
                    key={rel.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2"
                  >
                    <p className="text-xs font-semibold text-slate-800">
                      {direction === "loop"
                        ? t("entityDetailRelSelf")
                        : direction === "out"
                          ? t("entityDetailRelTo", { name: other.name })
                          : t("entityDetailRelFrom", { name: other.name })}
                      {" · "}
                      <span className="font-medium text-slate-700">
                        {rel.relationship_type}
                      </span>
                    </p>
                    {rel.description?.trim() ? (
                      <div className="mt-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {t("entityDetailDescription")}
                        </p>
                        <p className="mt-0.5 whitespace-pre-wrap text-xs text-slate-700">
                          {rel.description}
                        </p>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function layoutWithDagre(
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB"
): Node[] {
  const n = nodes.length;
  const edgeCount = edges.filter((e) => e.source !== e.target).length;
  const density = n > 1 ? edgeCount / Math.max(1, n - 1) : 0;
  const spread = Math.min(1.45, 1 + Math.max(0, n - 5) * 0.04 + density * 0.08);

  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    align: "UL",
    ranker: "network-simplex",
    acyclicer: "greedy",
    nodesep: Math.round(48 * spread),
    ranksep: Math.round(72 * spread),
    edgesep: 12,
    marginx: 32,
    marginy: 32,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    if (edge.source !== edge.target) {
      g.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(g);

  const positioned = nodes.map((node) => {
    const pos = g.node(node.id);
    if (!pos) {
      return { ...node, position: { x: 0, y: 0 } };
    }
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return normalizeNodePositions(positioned);
}

/** Shift layout to positive coordinates with padding so fitView frames everything evenly. */
function normalizeNodePositions(nodes: Node[]): Node[] {
  if (nodes.length === 0) return nodes;
  let minX = Infinity;
  let minY = Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return nodes;
  }
  const pad = 48;
  const dx = pad - minX;
  const dy = pad - minY;
  if (dx === 0 && dy === 0) return nodes;
  return nodes.map((node) => ({
    ...node,
    position: {
      x: node.position.x + dx,
      y: node.position.y + dy,
    },
  }));
}

const FIT_VIEW_OPTIONS = {
  padding: 0.18,
  maxZoom: 1,
  minZoom: 0.12,
  duration: 280,
} as const;

/** Remount with `key={layoutKey}` when the graph identity changes so the mount effect refits the viewport. */
function AutoFitView() {
  const { fitView, getNodes } = useReactFlow();
  const resizeTimer = useRef<number | undefined>(undefined);

  const runFit = useCallback(() => {
    if (getNodes().length === 0) return;
    requestAnimationFrame(() => {
      fitView({
        ...FIT_VIEW_OPTIONS,
        includeHiddenNodes: false,
      });
    });
  }, [fitView, getNodes]);

  useEffect(() => {
    const t = window.setTimeout(runFit, 48);
    return () => window.clearTimeout(t);
  }, [runFit]);

  useEffect(() => {
    const onResize = () => {
      if (resizeTimer.current !== undefined) {
        window.clearTimeout(resizeTimer.current);
      }
      resizeTimer.current = window.setTimeout(runFit, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer.current !== undefined) {
        window.clearTimeout(resizeTimer.current);
      }
    };
  }, [runFit]);

  return null;
}

function flowSignature(graph: CaseEntityRelationships): string {
  const e = graph.entities
    .map(
      (x) =>
        `${x.id}:${x.name}:${x.type}:${x.role_in_case ?? ""}:${x.notes ?? ""}`
    )
    .join("|");
  const r = graph.relationships
    .map(
      (x) =>
        `${x.id}:${x.source_id}:${x.target_id}:${x.relationship_type}:${x.description ?? ""}`
    )
    .join("|");
  return `${e}#${r}`;
}

function buildFlowElements(
  graph: CaseEntityRelationships,
  caseRole?: string | null
): {
  nodes: Node[];
  edges: Edge[];
} {
  const entityById = new Map(graph.entities.map((e) => [e.id, e]));

  const nodes: Node[] = graph.entities.map((e) => ({
    id: e.id,
    type: "entity",
    position: { x: 0, y: 0 },
    data: {
      label: e.name,
      entityType: e.type,
      role: e.role_in_case,
      notes: e.notes,
      isUserPosition: entityRoleMatchesCase(e.role_in_case, caseRole),
      litigationSide: litigationSideFromRole(e.role_in_case),
    },
  }));

  const edges: Edge[] = graph.relationships
    .filter((r) => entityById.has(r.source_id) && entityById.has(r.target_id))
    .map((r) => {
      const isLoop = r.source_id === r.target_id;
      const label = r.relationship_type;
      const disputeEdge = relationshipHighlightsDispute(r);
      return {
        id: r.id,
        source: r.source_id,
        target: r.target_id,
        type: isLoop ? "bezier" : "smoothstep",
        animated: false,
        label,
        style: disputeEdge
          ? { stroke: "#c2410c", strokeWidth: 2.5 }
          : { stroke: "#64748b", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: disputeEdge ? "#c2410c" : "#64748b",
          width: 18,
          height: 18,
        },
        labelStyle: disputeEdge
          ? { fill: "#9a3412", fontWeight: 700, fontSize: 11 }
          : { fill: "#475569", fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: "#f8fafc", fillOpacity: 0.92 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
        labelShowBg: true,
        data: {
          description: r.description,
        },
      };
    });

  const layoutedNodes = layoutWithDagre(nodes, edges, "TB");

  return { nodes: layoutedNodes, edges };
}

function EntityRelationshipFlowInner({
  graph,
  caseRole,
}: {
  graph: CaseEntityRelationships;
  caseRole?: string | null;
}) {
  const t = useTranslations("caseAnalysis.results.entityRelationships");
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFlowElements(graph, caseRole),
    [graph, caseRole]
  );
  const layoutKey = useMemo(
    () => `${flowSignature(graph)}|${caseRole ?? ""}`,
    [graph, caseRole]
  );
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const selectedEntity = useMemo(
    () =>
      selectedEntityId
        ? (graph.entities.find((e) => e.id === selectedEntityId) ?? null)
        : null,
    [graph.entities, selectedEntityId]
  );

  const onNodeClick = useCallback((_e: unknown, node: Node) => {
    setSelectedEntityId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedEntityId(null);
  }, []);

  const closeEntityDetail = useCallback(() => {
    setSelectedEntityId(null);
  }, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        panOnScroll
        zoomOnScroll
        minZoom={FIT_VIEW_OPTIONS.minZoom}
        maxZoom={1}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        aria-label={t("diagramAria")}
      >
      <AutoFitView key={layoutKey} />
      <Background gap={20} size={1} color="#e2e8f0" />
      <Controls
        showInteractive={false}
        className="!border-border-200 !shadow-md [--xy-controls-button-color:#0f172a] [--xy-controls-button-color-hover:#020617] [--xy-controls-button-background-color:#ffffff] [--xy-controls-button-background-color-hover:#f1f5f9] [--xy-controls-button-border-color:#cbd5e1]"
      />
      <MiniMap
        position="top-right"
        style={{ width: 120, height: 90 }}
        className="!border-border-200 !bg-slate-100/90"
        nodeStrokeWidth={2}
        maskColor="rgb(15 23 42 / 12%)"
        nodeColor={(node) => {
          const d = node.data as {
            isUserPosition?: boolean;
            litigationSide?: "plaintiff" | "defendant" | null;
          };
          if (d.isUserPosition) return "rgb(37 99 235)";
          if (d.litigationSide === "plaintiff") return "rgb(3 105 161)";
          if (d.litigationSide === "defendant") return "rgb(190 18 60)";
          return "rgb(148 163 184)";
        }}
      />
      </ReactFlow>
      <EntityDetailModal
        entity={selectedEntity}
        graph={graph}
        caseRole={caseRole}
        open={selectedEntity !== null}
        onClose={closeEntityDetail}
      />
    </>
  );
}

export default function CaseEntityRelationshipGraph({
  graph,
  caseRole,
}: {
  graph: CaseEntityRelationships;
  /** Case `role` (e.g. plaintiff, tenant); matched to entity `role_in_case` to highlight you. */
  caseRole?: string | null;
}) {
  if (graph.entities.length === 0) {
    return null;
  }

  const providerKey = `${flowSignature(graph)}|${caseRole ?? ""}`;

  return (
    <div className="flex h-[min(76vh,620px)] w-full min-h-[380px] flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 [&_.react-flow\_\_attribution]:hidden">
      <div className="min-h-0 min-w-0 flex-1">
        <ReactFlowProvider key={providerKey}>
          <EntityRelationshipFlowInner graph={graph} caseRole={caseRole} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
