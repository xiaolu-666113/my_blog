"use client";

import { useCallback, useEffect, useMemo, useRef, type ComponentType } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import { MindMapNode, type SecurityFlowNodeData } from "@/components/security-map/MindMapNode";
import { Toolbar } from "@/components/security-map/Toolbar";
import {
  categoryMeta,
  securityMindmapEdges,
  securityMindmapNodes,
} from "@/data/security-course/mindmapData";

const nodeTypes: NodeTypes = {
  securityMindMapNode: MindMapNode as ComponentType<NodeProps>,
};

function MindMapCanvasInner({
  selectedNodeId,
  matchedNodeIds,
  onSelectNode,
}: {
  selectedNodeId: string | null;
  matchedNodeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
}) {
  const flowWrapperRef = useRef<HTMLDivElement | null>(null);
  const { fitView, setCenter, zoomIn, zoomOut, getNode } = useReactFlow();

  const flowNodes = useMemo<Node<SecurityFlowNodeData>[]>(
    () =>
      securityMindmapNodes.map((node) => ({
        id: node.id,
        type: "securityMindMapNode",
        position: { x: node.x, y: node.y },
        draggable: false,
        selectable: false,
        data: {
          node,
          selected: node.id === selectedNodeId,
          matched: matchedNodeIds.has(node.id),
        },
        zIndex: node.id === selectedNodeId ? 20 : matchedNodeIds.has(node.id) ? 14 : node.level === 0 ? 10 : 1,
      })),
    [matchedNodeIds, selectedNodeId]
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      securityMindmapEdges.map((edge) => {
        const target = securityMindmapNodes.find((node) => node.id === edge.target);
        const selected = edge.source === selectedNodeId || edge.target === selectedNodeId;
        const matched = matchedNodeIds.has(edge.source) || matchedNodeIds.has(edge.target);
        return {
          ...edge,
          type: "smoothstep",
          animated: selected,
          style: {
            stroke: selected || matched ? target?.color ?? "#64748b" : "rgba(100, 116, 139, 0.34)",
            strokeWidth: selected || matched ? 3 : 1.6,
          },
        };
      }),
    [matchedNodeIds, selectedNodeId]
  );

  const focusNode = useCallback(
    (nodeId: string, zoom = 1.05) => {
      const target = getNode(nodeId);
      const data = target?.data as SecurityFlowNodeData | undefined;
      if (!target || !data) return;
      const width = data.node.level === 0 ? 430 : data.node.level === 1 ? 310 : 360;
      const height = data.node.level === 0 ? 210 : data.node.level === 1 ? 150 : 130;
      setCenter(target.position.x + width / 2, target.position.y + height / 2, {
        zoom,
        duration: 650,
      });
    },
    [getNode, setCenter]
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (selectedNodeId) {
        focusNode(selectedNodeId, 1.12);
        return;
      }
      fitView({ duration: 650, padding: 0.12 });
    });
    return () => cancelAnimationFrame(frame);
  }, [fitView, focusNode, selectedNodeId]);

  useEffect(() => {
    if (matchedNodeIds.size === 0) return;
    const first = Array.from(matchedNodeIds)[0];
    const frame = requestAnimationFrame(() => focusNode(first, 1.14));
    return () => cancelAnimationFrame(frame);
  }, [focusNode, matchedNodeIds]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMod = event.metaKey || event.ctrlKey;
      if (isMod && (event.key === "+" || event.key === "=")) {
        event.preventDefault();
        zoomIn({ duration: 180 });
      }
      if (isMod && event.key === "-") {
        event.preventDefault();
        zoomOut({ duration: 180 });
      }
      if (event.key === "0") {
        fitView({ duration: 450, padding: 0.12 });
      }
      if (event.key.toLowerCase() === "f" && selectedNodeId) {
        focusNode(selectedNodeId, 1.18);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fitView, focusNode, selectedNodeId, zoomIn, zoomOut]);

  async function handleFullscreen() {
    const wrapper = flowWrapperRef.current;
    if (!wrapper) return;
    if (document.fullscreenElement === wrapper) {
      await document.exitFullscreen();
      return;
    }
    await wrapper.requestFullscreen();
  }

  return (
    <div ref={flowWrapperRef} className="relative h-[calc(100vh-10rem)] min-h-[760px] overflow-hidden bg-[#f8fafc]">
      <Toolbar
        onZoomIn={() => zoomIn({ duration: 180 })}
        onZoomOut={() => zoomOut({ duration: 180 })}
        onReset={() => fitView({ duration: 500, padding: 0.12 })}
        onCenter={() => {
          if (selectedNodeId) focusNode(selectedNodeId, 1.16);
          else fitView({ duration: 500, padding: 0.12 });
        }}
        onFullscreen={handleFullscreen}
      />

      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.18}
        maxZoom={1.7}
        panOnDrag
        zoomOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        proOptions={{ hideAttribution: true }}
        className="security-mindmap"
      >
        <Background color="rgba(148, 163, 184, 0.28)" gap={32} size={1} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => {
            const data = node.data as SecurityFlowNodeData | undefined;
            return data ? categoryMeta[data.node.category].color : "#64748b";
          }}
          maskColor="rgba(248,250,252,0.72)"
          className="!m-5 !overflow-hidden !rounded-md !border !border-slate-200 !bg-white"
        />
        <Controls className="!m-5 !overflow-hidden !rounded-md !border !border-slate-200 !bg-white" />
      </ReactFlow>
    </div>
  );
}

export function MindMapCanvas(props: {
  selectedNodeId: string | null;
  matchedNodeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
}) {
  return (
    <ReactFlowProvider>
      <MindMapCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
