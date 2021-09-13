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

const arrange = (hurdles, origin) => {
  let finalHurdles = [];
  for (let _hurdle of hurdles) {
    let leastDist = {
      hurdle: null,
      distance: Infinity,
    };
    for (let hurdle of hurdles) {
      if (!finalHurdles.includes(hurdle)) {
        const c1 = [
          hurdle.locationCoords.longitude,
          hurdle.locationCoords.latitude,
        ];
        const d = distanceBtw(c1, origin);
        if (leastDist.distance > d) {
          leastDist.hurdle = hurdle;
          leastDist.distance = d;
        }
      }
    }
    finalHurdles.push(leastDist.hurdle);
  }
  return finalHurdles;
};

const getNearestHurdle = (coords, hurdles) => {
  let nearestHurdle = { distance: Infinity };
  for (let hurdle of hurdles) {
    const c1 = [
      hurdle.locationCoords.longitude,
      hurdle.locationCoords.latitude,
    ];
    const d = distanceBtw(c1, coords);
    if (nearestHurdle.distance > d && d < 200) {
      nearestHurdle = { distance: d, hurdle: hurdle };
    }
  }
  return nearestHurdle;
};

module.exports = {
  distanceBtw,
  arrange,
  getNearestHurdle,
};
