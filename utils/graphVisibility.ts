import { GraphNode, GraphEdge } from '../types';

/**
 * Marks nodes that are in the direct lineage from the root (searched entity)
 * Direct lineage = all ancestors (upstream) + all direct descendants (downstream)
 * Also keeps track of ALL nodes in memory so siblings can be revealed on expansion
 */
export const markDirectLineage = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    rootId: string
): GraphNode[] => {
    const directLineageIds = new Set<string>();
    directLineageIds.add(rootId);

    // Walk UP: Find all parents recursively
    const findParents = (nodeId: string) => {
        edges.forEach(edge => {
            if (edge.target === nodeId && !directLineageIds.has(edge.source)) {
                directLineageIds.add(edge.source);
                findParents(edge.source); // Recursive
            }
        });
    };

    // Walk DOWN: Find all DIRECT children recursively (only through the target's own descendants)
    const findDirectChildren = (nodeId: string) => {
        edges.forEach(edge => {
            if (edge.source === nodeId && !directLineageIds.has(edge.target)) {
                directLineageIds.add(edge.target);
                findDirectChildren(edge.target); // Recursive
            }
        });
    };

    findParents(rootId);
    findDirectChildren(rootId);

    // Mark nodes - ALL nodes remain in the array (they were already fetched)
    // We just mark which ones are visible by default (direct lineage only)
    return nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            isDirectLineage: directLineageIds.has(node.id),
            isVisible: directLineageIds.has(node.id), // Only direct lineage visible by default
            isBranchExpanded: false
        }
    }));
};

/**
 * Calculates how many descendants are hidden for each node
 */
export const calculateHiddenDescendants = (
    nodes: GraphNode[],
    edges: GraphEdge[]
): GraphNode[] => {
    const countHiddenDescendants = (nodeId: string, visited = new Set<string>()): number => {
        if (visited.has(nodeId)) return 0;
        visited.add(nodeId);

        let count = 0;

        // Find all children
        edges.forEach(edge => {
            if (edge.source === nodeId) {
                const childNode = nodes.find(n => n.id === edge.target);
                if (childNode && !childNode.data.isVisible) {
                    count += 1; // This child is hidden
                    count += countHiddenDescendants(edge.target, visited); // Add its hidden descendants
                }
            }
        });

        return count;
    };


    return nodes.map(node => {
        const count = countHiddenDescendants(node.id);
        return {
            ...node,
            data: {
                ...node.data,
                hiddenDescendantCount: count > 0 ? count : undefined
            }
        };
    });
};

/**
 * Expands a node's full subtree (makes all descendants visible)
 * This includes ALL immediate children of the node, plus their descendants
 */
export const expandNodeSubtree = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    nodeId: string
): GraphNode[] => {
    const descendantIds = new Set<string>();

    // CRITICAL: Find ALL direct children of this node first
    // This ensures siblings (multiple children of same parent) are all revealed
    const directChildren = edges
        .filter(edge => edge.source === nodeId)
        .map(edge => edge.target);

    // Add all direct children
    directChildren.forEach(childId => descendantIds.add(childId));

    // Then recursively find descendants of each child
    const findAllDescendants = (id: string) => {
        edges.forEach(edge => {
            if (edge.source === id && !descendantIds.has(edge.target)) {
                descendantIds.add(edge.target);
                findAllDescendants(edge.target); // Recursive
            }
        });
    };

    // Recursively expand each direct child's subtree
    directChildren.forEach(childId => findAllDescendants(childId));

    return nodes.map(node => {
        if (node.id === nodeId) {
            return {
                ...node,
                data: { ...node.data, isBranchExpanded: true }
            };
        }
        if (descendantIds.has(node.id)) {
            return {
                ...node,
                data: { ...node.data, isVisible: true }
            };
        }
        return node;
    });
};

/**
 * Collapses a node's subtree (hides non-direct-lineage descendants)
 */
export const collapseNodeSubtree = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    nodeId: string
): GraphNode[] => {
    const descendantIds = new Set<string>();

    const findAllDescendants = (id: string) => {
        edges.forEach(edge => {
            if (edge.source === id && !descendantIds.has(edge.target)) {
                descendantIds.add(edge.target);
                findAllDescendants(edge.target);
            }
        });
    };

    findAllDescendants(nodeId);

    return nodes.map(node => {
        if (node.id === nodeId) {
            return {
                ...node,
                data: { ...node.data, isBranchExpanded: false }
            };
        }
        if (descendantIds.has(node.id) && !node.data.isDirectLineage) {
            return {
                ...node,
                data: { ...node.data, isVisible: false }
            };
        }
        return node;
    });
};
