export const checkCollision = (r1, r2) => (
  r1.x < r2.x + r2.w && r1.x + r1.w > r2.x &&
  r1.y < r2.y + r2.h && r1.y + r1.h > r2.y
);

export const calculateMovement = (gameMode, effA, effB, currentX) => {
  const SPEED_MOVE = 18.0;
  const GRAVITY_FORCE = 3.5;
  let newX = currentX;

  switch (gameMode) {
    case "FLEXION":
    case "FLEX":
      newX += (effA * SPEED_MOVE) - GRAVITY_FORCE;
      break;
    case "EXTENSION":
    case "EXT":
      newX += GRAVITY_FORCE - (effB * SPEED_MOVE);
      break;
    default:
      newX += (effA - effB) * SPEED_MOVE;
  }
  
  // Límites
  if (newX < 0) newX = 0;
  if (newX > 740) newX = 740;
  
  return newX;
};