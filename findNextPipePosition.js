const PIPE_PATHS = {
  horizontal: { left: true, right: true, top: false, bottom: false },
  vertical: { left: false, right: false, top: true, bottom: true },
  'corner-tl': { left: true, right: false, top: true, bottom: false },
  'corner-tr': { left: false, right: true, top: true, bottom: false },
  'corner-bl': { left: true, right: false, top: false, bottom: true },
  'corner-br': { left: false, right: true, top: false, bottom: true },
  cross: { left: true, right: true, top: true, bottom: true }
};

function canConnect(move, nextPipe) {
  const nextConnections = PIPE_PATHS[nextPipe];
  if (!nextConnections) return false;
  return (
    (move.direction === 'left' && nextConnections.right) ||
    (move.direction === 'right' && nextConnections.left) ||
    (move.direction === 'top' && nextConnections.bottom) ||
    (move.direction === 'bottom' && nextConnections.top)
  );
}

function findNextPipePosition(grid, currentX, currentY, previousX, previousY) {
  const GRID_SIZE = grid.length;
  const currentPipe = grid[currentY] && grid[currentY][currentX];
  if (!currentPipe) return null;

  const connections = PIPE_PATHS[currentPipe];
  const possibleMoves = [];

  if (connections.left && currentX > 0) {
    possibleMoves.push({ x: currentX - 1, y: currentY, direction: 'left' });
  }
  if (connections.right && currentX < GRID_SIZE - 1) {
    possibleMoves.push({ x: currentX + 1, y: currentY, direction: 'right' });
  }
  if (connections.top && currentY > 0) {
    possibleMoves.push({ x: currentX, y: currentY - 1, direction: 'top' });
  }
  if (connections.bottom && currentY < GRID_SIZE - 1) {
    possibleMoves.push({ x: currentX, y: currentY + 1, direction: 'bottom' });
  }

  const validMoves = possibleMoves.filter(move => {
    if (previousX === null || previousY === null) return true;
    return !(move.x === previousX && move.y === previousY);
  });

  if (currentPipe === 'cross' && previousX !== null && previousY !== null) {
    const incomingDirection = {
      x: currentX - previousX,
      y: currentY - previousY
    };

    const continueStraight = validMoves.find(move => {
      const moveDirection = {
        x: move.x - currentX,
        y: move.y - currentY
      };
      return moveDirection.x === incomingDirection.x && moveDirection.y === incomingDirection.y;
    });

    if (continueStraight) {
      const nextPipe = grid[continueStraight.y] && grid[continueStraight.y][continueStraight.x];
      if (nextPipe && canConnect(continueStraight, nextPipe)) {
        return { x: continueStraight.x, y: continueStraight.y };
      }
    }
  }

  for (const move of validMoves) {
    const nextPipe = grid[move.y] && grid[move.y][move.x];
    if (nextPipe && canConnect(move, nextPipe)) {
      return { x: move.x, y: move.y };
    }
  }

  return null;
}

module.exports = { findNextPipePosition, PIPE_PATHS };
