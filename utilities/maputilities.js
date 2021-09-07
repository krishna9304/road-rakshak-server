const distanceBtw = (coords1, coords2) => {
  const R = 6371e3; // metres
  const φ1 = (coords1[1] * Math.PI) / 180; // φ, λ in radians
  const φ2 = (coords2[1] * Math.PI) / 180;
  const Δφ = ((coords2[1] - coords1[1]) * Math.PI) / 180;
  const Δλ = ((coords2[0] - coords1[0]) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // in metres
  return d;
};
module.exports = {
  distanceBtw,
};
