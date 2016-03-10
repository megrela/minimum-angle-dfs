/**
 * Created by gime on 3/9/2016.
 */

/**
 * Minimum Angle DFS algorithm for planar graphs
 *
 * let graph me a set of vertices and edges
 *      each vertex should have structure
 *          Vertex{
 *              x: x coordinate,
 *              y: y coordinate,
 *              id: the index of current vertex in graph.vertices
 *          }
 *      each edge has structure: {a: vertex, b: vertex}
 *      graph.adj - adjacent list of the given graph
 *
 * calculates heuristic minimal path from Vertex[source] to Vertex[tail]
 * source and tails ar IDs
 *
 * fills the local arrays:
 *      visited[id] - rather Vertex[id] is visited or not during iteration, true or false
 *      dist[id] - if visited[id] then heuristic minimum length from source to Vertex[id] else INF
 *      parent[id] - if visited[id] then the id of previous vertex else -1
 */

/**
 * @constructor
 */
function MinimumAngleDfsAlgorithm(graph, source, tail) {
    var me = this;
    me.graph = graph;
    me.n = graph.vertices.length;
    me.source = source;
    me.tail = tail;
}

MinimumAngleDfsAlgorithm.prototype.reset = function () {
    var me = this;
    me.visited = [];
    me.parent = [];
    me.dist = [];
    me.path = [];
    for (var i=0; i<me.n; i++) {
        me.visited.push(false);
        me.parent.push(-1);
        me.dist.push(1<<31);
    }
};

MinimumAngleDfsAlgorithm.prototype.start = function () {
    var me = this;
    me.reset();
    me.dfs(me.source, -1, 0);
};

MinimumAngleDfsAlgorithm.prototype.dfs = function (current, prev, dist) {
    var me = this;
    me.dist[current] = dist;
    me.parent[current] = prev;
    me.visited[current] = true;

    if (current === me.tail) {
        var x = me.tail;
        while (x != me.source) {
            me.path.push(x);
            x = me.parent[x];
        }
        me.path.reverse();
        return;
    }

    var i, adjAngles = [], adj;

    for (i=0; i<me.graph.adj[current].length; i++) {
        adj = me.graph.adj[current][i];
        adjAngles.push({
            adj: adj,
            angle: MinimumAngleDfsAlgorithm.calculateAngle(
                me.graph.vertices[current],
                me.graph.vertices[adj],
                me.graph.vertices[me.tail]
            )
        });
    }

    adjAngles.sort(function (a,b) {
        return a.angle - b.angle;
    });

    for (i=0; i<adjAngles.length; i++) {
        adj = adjAngles[i].adj;
        if (me.visited[adj] === false) {
            me.dfs(adj, current, dist + 1);
            if (me.visited[me.tail]) {
                return;
            }
        }
    }
};

/**
 * calculates cos( angle(s,v,t) )
 * @param s
 * @param v
 * @param t
 */
MinimumAngleDfsAlgorithm.calculateAngle = function (s, v, t) {
    var dxsv = Math.abs(s.x - v.x);
    var dysv = Math.abs(s.y - v.y);
    var sv2 = dxsv * dxsv + dysv * dysv;

    var dxvt = Math.abs(v.x - t.x);
    var dyvt = Math.abs(v.y - t.y);
    var vt2 = dxvt * dxvt + dyvt * dyvt;

    var dxst = Math.abs(s.x - t.x);
    var dyst = Math.abs(s.y - t.y);
    var st2 = dxst * dxst + dyst * dyst;

    /**
     * st^2 = sv^2 + vt^2 - 2 sv vt cos(svt)
     * cos(svt) = (sv^2 + vt^2 - st^2) / 2 * Math.sqrt( sv^2 * vt^2 )
     */

    var cosangle = 1. * (sv2 + vt2 - st2) / (2 * Math.sqrt(sv2 * vt2));
    return cosangle;
};

