// Simple string hashing for educational purposes
export const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Convert degrees to radians
export const toRad = (deg: number) => (deg * Math.PI) / 180;

// Calculate position on a circle
export const getPosition = (angle: number, radius: number, center: number) => {
  const rad = toRad(angle - 90); // -90 to start at 12 o'clock
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  };
};

// Find the owner node for a key in a consistent hashing ring
export const findOwnerNode = <T extends { id: string; angle: number }>(keyAngle: number, nodes: T[]) => {
  if (nodes.length === 0) return null;
  
  // Sort nodes by angle
  const sortedNodes = [...nodes].sort((a, b) => a.angle - b.angle);
  
  // Find first node with angle >= keyAngle
  const nextNode = sortedNodes.find((n) => n.angle >= keyAngle);
  
  // If no node found (key is after the last node), it wraps around to the first node
  return nextNode || sortedNodes[0];
};