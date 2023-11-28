import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import styled from '@emotion/styled';
import { CharacterTreeNodeType } from '../models/character/character-tree-node/types';

interface TreeNode {
    name: string;
    children?: TreeNode[];
    nodeType: CharacterTreeNodeType;
    size?: number;
}

interface TreeLayoutNode<Datum> extends d3.HierarchyNode<Datum> {
    x: number;
    y: number;
}

interface TreeLayoutLink<Datum> extends d3.HierarchyLink<Datum> {
    source: TreeLayoutNode<Datum>;
    target: TreeLayoutNode<Datum>;
}

interface TreeVisualizationProps {
    data: TreeNode;
}

const StyledSVG = styled.svg`
    background-color: #f5f5f5;
`;

const linkStyle = {
    stroke: '#2c3e50',
    strokeWidth: '2px',
};

export function TreeVisualization({ data }: TreeVisualizationProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const nodeSizes = useMemo(() => new Map<TreeNode, number>(), []);

    const calculateNodeSize = (node: TreeNode) => {
        const { children } = node;
        let { size } = new Blob([JSON.stringify(node)]); // Calculate size in bytes

        const compressed = JSON.parse(JSON.stringify(node));
        const branchSize = size;

        if (children) {
            if (compressed.children) {
                children.forEach((child) => {
                    const bSize = calculateNodeSize(child);
                    size -= bSize;
                });
            } else {
                children.forEach((child) => {
                    nodeSizes.set(child, 0);
                });
            }
        }

        nodeSizes.set(node, size);

        return branchSize;
    };

    useEffect(() => {
        if (!svgRef.current) return;

        calculateNodeSize(data); // Call this function to calculate and set size for each node

        // Clear previous rendering
        d3.select(svgRef.current).selectAll('*').remove();

        const margin = { top: 20, right: 40, bottom: 240, left: 40 };
        const svgWidth = 1400;
        const svgHeight = 900;
        const width = svgWidth - margin.top - margin.bottom;
        const height = svgHeight - margin.left - margin.right;

        const svg = d3.select(svgRef.current);

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const root = d3.hierarchy(data);
        const treeLayout = d3.tree<TreeNode>().size([height, width]); // Swap width and height for 90° rotation
        treeLayout(root);

        g.selectAll('.node')
            .data(root.descendants() as TreeLayoutNode<TreeNode>[])
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', 7)
            .attr('cx', (d) => d.y) // Use y for x due to 90° rotation
            .attr('cy', (d) => d.x) // Use x for y due to 90° rotation
            .attr('fill', (d) => {
                if (d.data.nodeType === CharacterTreeNodeType.DECISION) {
                    return 'blue';
                }

                if (d.data.nodeType === CharacterTreeNodeType.EFFECT) {
                    return 'red';
                }

                if (d.data.nodeType === CharacterTreeNodeType.ROOT) {
                    return 'green';
                }

                return '#3498db';
            })
            .attr('stroke', '#2980b9')
            .attr('stroke-width', '1.5px')
            .append('title')
            .text((d) =>
                JSON.stringify(
                    Object.fromEntries(
                        Object.entries(d.data)
                            .filter(
                                ([key]) =>
                                    key !== 'children' &&
                                    key !== 'grants' &&
                                    key !== 'parent',
                            )
                            .map(([key, value]) =>
                                key === 'description' || key === 'progression'
                                    ? [key, '...']
                                    : [key, value],
                            ),
                    ),
                    null,
                    2,
                ),
            );

        g.selectAll('.node-label')
            .data(root.descendants() as TreeLayoutNode<TreeNode>[])
            .enter()
            .append('text')
            .attr('class', 'node-label')
            .attr('x', (d) => d.y - 20) // Use y for x due to 90° rotation
            .attr('y', (d) => d.x + 30) // Use x for y due to 90° rotation
            .text((d) => `${d.data.name}`);

        // g.selectAll('.node-size-label')
        //     .data(root.descendants() as TreeLayoutNode<TreeNode>[])
        //     .enter()
        //     .append('text')
        //     .attr('class', 'node-size-label')
        //     .attr('x', (d) => d.y - 20) // Adjust x and y positions as needed
        //     .attr('y', (d) => d.x + 45)
        //     .text((d) => `${nodeSizes.get(d.data)} bytes`)
        //     .append('title')
        //     .text((d) => {
        //         const { children, ...rest } = d.data;

        //         return Object.entries(rest)
        //             .map(([key, value]) => [
        //                 key,
        //                 new Blob([JSON.stringify(key), JSON.stringify(value)])
        //                     .size,
        //             ])
        //             .sort((a, b) => (b[1] as number) - (a[1] as number))
        //             .map(([key, value]) => `${key}:\t${value} bytes`)
        //             .join('\n');
        //     });

        g.selectAll('.link')
            .data(root.links() as TreeLayoutLink<TreeNode>[])
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', linkStyle.stroke)
            .attr('stroke-width', linkStyle.strokeWidth)
            .attr('x1', (d) => d.source.y) // Use source's y for x1 due to 90° rotation
            .attr('y1', (d) => d.source.x) // Use source's x for y1 due to 90° rotation
            .attr('x2', (d) => d.target.y) // Use target's y for x2 due to 90° rotation
            .attr('y2', (d) => d.target.x); // Use target's x for y2 due to 90° rotation
    }, [data]);

    return <StyledSVG ref={svgRef} width="1400" height="900" />;
}
