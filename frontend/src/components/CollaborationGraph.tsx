import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Customized,
} from 'recharts';
import { Responder } from '../types';
import { ResponderInteraction } from '../utils/responders';

interface Node extends Responder {
  x: number;
  y: number;
}

interface Props {
  responders: Responder[];
  interactions: ResponderInteraction[];
}

const CollaborationGraph: React.FC<Props> = ({ responders, interactions }) => {
  const radius = 100;
  const nodes: Node[] = responders.map((r, idx) => {
    const angle = (2 * Math.PI * idx) / responders.length;
    return { ...r, x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" domain={[-radius - 10, radius + 10]} hide />
        <YAxis type="number" dataKey="y" domain={[-radius - 10, radius + 10]} hide />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Customized
          component={() => (
            <g>
              {interactions.map((i, idx) => {
                const a = nodeMap.get(i.source);
                const b = nodeMap.get(i.target);
                if (!a || !b) return null;
                return (
                  <line
                    key={idx}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#999"
                    strokeWidth={1 + Math.log(i.count + 1)}
                  />
                );
              })}
            </g>
          )}
        />
        <Scatter data={nodes} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CollaborationGraph;
