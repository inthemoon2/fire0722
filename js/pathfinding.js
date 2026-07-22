// A* 탐색 알고리즘입니다.
// 위험도가 높은 센서는 지나가기 어렵도록 비용을 크게 올립니다.
(function () {
  function pointOf(node) {
    return window.SIM_MAP.sensors[node] || window.SIM_MAP.exits[node];
  }

  function distance(a, b) {
    const pa = pointOf(a);
    const pb = pointOf(b);
    return Math.hypot(pa.x - pb.x, pa.y - pb.y) / 10;
  }

  function buildGraph() {
    const graph = {};
    const add = (a, b) => {
      graph[a] ||= [];
      graph[a].push({ node: b, distance: distance(a, b) });
    };
    window.SIM_MAP.edges.forEach(([a, b]) => {
      add(a, b);
      add(b, a);
    });
    return graph;
  }

  const graph = buildGraph();

  function heuristic(node, goal) {
    return distance(node, goal);
  }

  function reconstruct(cameFrom, current) {
    const path = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      path.unshift(current);
    }
    return path;
  }

  function aStar(start, goal, risks) {
    const open = new Set([start]);
    const cameFrom = {};
    const g = { [start]: 0 };
    const f = { [start]: heuristic(start, goal) };

    while (open.size > 0) {
      let current = [...open].reduce((best, node) =>
        (f[node] ?? Infinity) < (f[best] ?? Infinity) ? node : best
      );

      if (current === goal) {
        return { path: reconstruct(cameFrom, current), cost: g[current] };
      }

      open.delete(current);
      for (const edge of graph[current] || []) {
        const next = edge.node;
        const risk = next.startsWith("S") ? (risks[next] || 0) : 0;
        if (risk >= 95 && next !== start) continue;

        // 위험도 0~100을 통행 비용으로 바꿉니다.
        const riskCost = Math.pow(risk / 32, 2);
        const tentative = (g[current] ?? Infinity) + edge.distance + riskCost;
        if (tentative < (g[next] ?? Infinity)) {
          cameFrom[next] = current;
          g[next] = tentative;
          f[next] = tentative + heuristic(next, goal);
          open.add(next);
        }
      }
    }
    return null;
  }

  function findSafestExit(start, risks) {
    const results = Object.keys(window.SIM_MAP.exits)
      .map(exit => ({ exit, result: aStar(start, exit, risks) }))
      .filter(item => item.result);
    if (!results.length) return null;
    results.sort((a, b) => a.result.cost - b.result.cost);
    return { exit: results[0].exit, ...results[0].result };
  }

  function graphDistances(start) {
    const distances = { [start]: 0 };
    const queue = [start];
    while (queue.length) {
      const current = queue.shift();
      for (const edge of graph[current] || []) {
        if (!edge.node.startsWith("S")) continue;
        if (distances[edge.node] === undefined) {
          distances[edge.node] = distances[current] + 1;
          queue.push(edge.node);
        }
      }
    }
    return distances;
  }

  window.PathFinder = { findSafestExit, graphDistances };
})();
