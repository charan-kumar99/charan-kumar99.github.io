
/* ==========================================================================
   CHARAN KUMAR PORTFOLIO — 29-ENGINE DSA ARCHITECTURE SUITE
   --------------------------------------------------------------------------
   DSA #1  : Trie (Prefix Tree) -> O(K) Command & Skill Autocomplete
   DSA #2  : Dynamic Programming (Levenshtein Distance) -> O(M*N) Typo Matcher
   DSA #3  : Circular Queue (Ring Buffer) -> O(1) Memory-Efficient Chatbot History
   DSA #4  : Directed Graph (DAG & BFS) -> O(V+E) Skill Tree Traversal
   DSA #5  : Aho-Corasick Automaton -> O(N+L) Multi-Pattern Keyword Matcher
   DSA #6  : QuadTree (Spatial Partitioning) -> O(N log N) 60 FPS Particle Canvas
   DSA #7  : Jaccard Similarity Index -> O(A+B) ATS Match Percentage Engine
   DSA #8  : Topological Sort (Kahn's BFS) -> O(V+E) Database Table Ordering
   DSA #9  : Max-Heap (Priority Queue) -> O(log N) Multi-Factor Project Ranker
   DSA #10 : Circular Doubly Linked List -> O(1) Theme Palette Switcher
   DSA #11 : Bitmasking (Bitwise AND) -> O(1) Multi-Tag Project Filter
   DSA #12 : Binary Search (Lower/Upper Bound) -> O(log N) Date Interval Range
   DSA #13 : LRU Cache (Doubly Linked List + Map) -> O(1) Query & Memory Cache
   DSA #14 : Trie-Based Lexer Stream -> O(N) LaTeX/Markdown Sanitizer
   DSA #15 : Token Bucket Algorithm -> O(1) Client API Rate Limiter
   DSA #16 : Dijkstra's Shortest Path -> O((V+E)log V) Career Path Finder
   DSA #17 : Knuth-Morris-Pratt (KMP) -> O(N+M) Exact Pattern Matcher
   DSA #18 : Disjoint Set Union (DSU) -> O(alpha(N)) Skill Domain Clustering
   DSA #19 : QuickSelect (Hoare's Selection) -> O(N) Top-K Metrics Filter
   DSA #20 : DOM Tree Traversal (DFS & BFS) -> O(N) Structural Element Search
   DSA #21 : Cubic Bézier Interpolation -> O(1) Physical Easing Motion
   DSA #22 : Exponential Backoff & Jitter -> O(1) API Retry Scheduler
   DSA #23 : Byte Pair Encoding (BPE Tokenizer) -> O(N) Prompt Token Estimator
   DSA #24 : First Fit Decreasing Bin Packing -> O(N log N) Resume Page Layout
   DSA #25 : AST Recursive Schema Validator -> O(N) JSON Schema Matcher
   DSA #26 : Key Chord Trie State Machine -> O(K) Shortcut & Easter Egg Listener
   DSA #27 : Matrix Linear Transformation -> O(1) RGB to HSL Color Space
   DSA #28 : Inverted Index (Hash Map) -> O(1) Tokenized Fast Skill Search
   DSA #29 : Finite State Machine (FSM) -> O(1) Project Simulator Transitions
   ========================================================================== */

/* DSA ENGINE #1: TRIE (PREFIX TREE) — O(K) Command Autocomplete */
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.command = null;
    }
}

class CommandTrie {
    constructor() {
        this.root = new TrieNode();
    }
    insert(word) {
        let node = this.root;
        const lower = word.toLowerCase();
        for (const char of lower) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.command = word;
    }
    autocomplete(prefix) {
        let node = this.root;
        const lower = prefix.toLowerCase();
        for (const char of lower) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        return this._collectWords(node);
    }
    _collectWords(node) {
        let results = [];
        if (node.isEndOfWord) results.push(node.command);
        for (const char in node.children) {
            results = results.concat(this._collectWords(node.children[char]));
        }
        return results;
    }
}

/* DSA ENGINE #2: DYNAMIC PROGRAMMING — O(M*N) Levenshtein Distance Typo Matcher */
function levenshteinDistance(a, b) {
    const str1 = a.toLowerCase();
    const str2 = b.toLowerCase();
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }
    return matrix[str2.length][str1.length];
}

function findClosestCandidate(query, candidates, maxDistance = 3) {
    let closest = null;
    let minDistance = Infinity;

    candidates.forEach(cand => {
        const dist = levenshteinDistance(query, cand);
        if (dist < minDistance && dist <= maxDistance) {
            minDistance = dist;
            closest = cand;
        }
    });
    return closest;
}

/* DSA ENGINE #3: CIRCULAR QUEUE (RING BUFFER) — O(1) Memory-Efficient Chatbot History */
class CircularQueue {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.buffer = new Array(capacity);
        this.head = 0;
        this.size = 0;
    }
    enqueue(item) {
        const index = (this.head + this.size) % this.capacity;
        this.buffer[index] = item;
        if (this.size < this.capacity) {
            this.size++;
        } else {
            this.head = (this.head + 1) % this.capacity;
        }
    }
    toArray() {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            result.push(this.buffer[(this.head + i) % this.capacity]);
        }
        return result;
    }
    clear() {
        this.buffer = new Array(this.capacity);
        this.head = 0;
        this.size = 0;
    }
}

/* DSA ENGINE #4: DIRECTED GRAPH (DAG) — O(V+E) Skill Tree Traversal (BFS) */
class SkillGraph {
    constructor() {
        this.adjacencyList = new Map();
    }
    addNode(skill) {
        if (!this.adjacencyList.has(skill)) {
            this.adjacencyList.set(skill, []);
        }
    }
    addEdge(source, destination) {
        this.addNode(source);
        this.addNode(destination);
        this.adjacencyList.get(source).push(destination);
    }
    bfs(startSkill) {
        const startKey = Array.from(this.adjacencyList.keys()).find(
            k => k.toLowerCase() === startSkill.toLowerCase()
        );
        if (!startKey) return [];
        const visited = new Set();
        const queue = [startKey];
        const result = [];
        visited.add(startKey);

        while (queue.length > 0) {
            const current = queue.shift();
            result.push(current);
            const neighbors = this.adjacencyList.get(current) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return result;
    }
}

const portfolioSkillGraph = new SkillGraph();
portfolioSkillGraph.addEdge("C#", "ASP.NET Core");
portfolioSkillGraph.addEdge("ASP.NET Core", "Clean Architecture");
portfolioSkillGraph.addEdge("Clean Architecture", "AGREMATE Property Platform");
portfolioSkillGraph.addEdge("ASP.NET Core", "Microservices Architecture");
portfolioSkillGraph.addEdge("Microservices Architecture", "NTSIPL RTGS/NEFT System");
portfolioSkillGraph.addEdge("PostgreSQL", "Binary COPY Protocol");
portfolioSkillGraph.addEdge("Binary COPY Protocol", "Migration Master");
portfolioSkillGraph.addEdge("JavaScript", "React");
portfolioSkillGraph.addEdge("React", "DevLens AI Analyzer");
portfolioSkillGraph.addEdge("Python", "Flask");
portfolioSkillGraph.addEdge("Flask", "Money Mate");
portfolioSkillGraph.addEdge("Agile", "Jira");
portfolioSkillGraph.addEdge("Jira", "Azure DevOps CI/CD");

/* DSA ENGINE #5: AHO-CORASICK AUTOMATON — O(N+L) Multi-Pattern ATS Keyword Matcher */
class AhoCorasickNode {
    constructor() {
        this.children = {};
        this.fail = null;
        this.output = [];
    }
}

class AhoCorasick {
    constructor(keywords) {
        this.root = new AhoCorasickNode();
        this.buildTrie(keywords);
        this.buildAutomation();
    }
    buildTrie(keywords) {
        keywords.forEach(kw => {
            let node = this.root;
            for (const char of kw.toLowerCase()) {
                if (!node.children[char]) {
                    node.children[char] = new AhoCorasickNode();
                }
                node = node.children[char];
            }
            node.output.push(kw);
        });
    }
    buildAutomation() {
        const queue = [];
        for (const char in this.root.children) {
            const child = this.root.children[char];
            child.fail = this.root;
            queue.push(child);
        }
        while (queue.length > 0) {
            const current = queue.shift();
            for (const char in current.children) {
                const child = current.children[char];
                let failNode = current.fail;
                while (failNode && !failNode.children[char]) {
                    failNode = failNode.fail;
                }
                child.fail = failNode ? failNode.children[char] : this.root;
                child.output = child.output.concat(child.fail.output);
                queue.push(child);
            }
        }
    }
    search(text) {
        let node = this.root;
        const matches = new Set();
        for (const char of text.toLowerCase()) {
            while (node && !node.children[char]) {
                node = node.fail;
            }
            node = node ? node.children[char] || this.root : this.root;
            for (const match of node.output) {
                matches.add(match);
            }
        }
        return Array.from(matches);
    }
}

/* DSA ENGINE #6: QUADTREE (SPATIAL PARTITIONING) — O(N log N) 60 FPS Canvas Animation */
class QuadTreeRectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }
    intersects(range) {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
}

class QuadTree {
    constructor(boundary, capacity = 4) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }
    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w / 2;
        const h = this.boundary.h / 2;

        this.northeast = new QuadTree(new QuadTreeRectangle(x + w, y - h, w, h), this.capacity);
        this.northwest = new QuadTree(new QuadTreeRectangle(x - w, y - h, w, h), this.capacity);
        this.southeast = new QuadTree(new QuadTreeRectangle(x + w, y + h, w, h), this.capacity);
        this.southwest = new QuadTree(new QuadTreeRectangle(x - w, y + h, w, h), this.capacity);

        this.divided = true;
    }
    insert(point) {
        if (!this.boundary.contains(point)) return false;
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }
        if (!this.divided) this.subdivide();
        return (
            this.northeast.insert(point) ||
            this.northwest.insert(point) ||
            this.southeast.insert(point) ||
            this.southwest.insert(point)
        );
    }
    query(range, found = []) {
        if (!this.boundary.intersects(range)) return found;
        for (let p of this.points) {
            if (range.contains(p)) found.push(p);
        }
        if (this.divided) {
            this.northeast.query(range, found);
            this.northwest.query(range, found);
            this.southeast.query(range, found);
            this.southwest.query(range, found);
        }
        return found;
    }
}

/* DSA ENGINE #7: JACCARD SIMILARITY INDEX — O(A+B) ATS Match Percentage Engine */
function calculateJaccardSimilarity(textA, textB) {
    const tokensA = new Set(textA.toLowerCase().split(/[\s,.\-()/]+/).filter(Boolean));
    const tokensB = new Set(textB.toLowerCase().split(/[\s,.\-()/]+/).filter(Boolean));
    const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
    const union = new Set([...tokensA, ...tokensB]);
    return union.size === 0 ? 0 : Math.round((intersection.size / union.size) * 100);
}

/* DSA ENGINE #8: TOPOLOGICAL SORT (KAHN'S BFS) — O(V+E) Database Dependency Ordering */
function topologicalSort(nodes, edges) {
    const inDegree = new Map();
    const adjList = new Map();

    nodes.forEach(node => {
        inDegree.set(node, 0);
        adjList.set(node, []);
    });

    edges.forEach(([u, v]) => {
        if (adjList.has(u) && inDegree.has(v)) {
            adjList.get(u).push(v);
            inDegree.set(v, (inDegree.get(v) || 0) + 1);
        }
    });

    const queue = [];
    inDegree.forEach((deg, node) => {
        if (deg === 0) queue.push(node);
    });

    const result = [];
    while (queue.length > 0) {
        const u = queue.shift();
        result.push(u);
        (adjList.get(u) || []).forEach(v => {
            inDegree.set(v, inDegree.get(v) - 1);
            if (inDegree.get(v) === 0) {
                queue.push(v);
            }
        });
    }
    return result;
}

/* DSA ENGINE #9: MAX-HEAP (PRIORITY QUEUE) — O(log N) Multi-Factor Project Ranker */
class MaxHeap {
    constructor() {
        this.heap = [];
    }
    insert(item) {
        this.heap.push(item);
        this._bubbleUp(this.heap.length - 1);
    }
    extractMax() {
        if (this.heap.length === 0) return null;
        const max = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._sinkDown(0);
        }
        return max;
    }
    _bubbleUp(index) {
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority <= this.heap[parentIndex].priority) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }
    _sinkDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swap = null;

            if (leftChildIndex < length) {
                if (this.heap[leftChildIndex].priority > this.heap[index].priority) {
                    swap = leftChildIndex;
                }
            }
            if (rightChildIndex < length) {
                if (
                    (swap === null && this.heap[rightChildIndex].priority > this.heap[index].priority) ||
                    (swap !== null && this.heap[rightChildIndex].priority > this.heap[swap].priority)
                ) {
                    swap = rightChildIndex;
                }
            }
            if (swap === null) break;
            [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
            index = swap;
        }
    }
}

/* DSA ENGINE #10: CIRCULAR DOUBLY LINKED LIST — O(1) Theme Palette Switcher */
class ThemeNode {
    constructor(name) {
        this.name = name;
        this.next = null;
        this.prev = null;
    }
}

class ThemeCircularLinkedList {
    constructor(themeNames = ['dark', 'cyberpunk', 'emerald', 'light']) {
        this.current = null;
        this.buildList(themeNames);
    }
    buildList(themes) {
        let head = null;
        let prevNode = null;
        themes.forEach((t, i) => {
            const node = new ThemeNode(t);
            if (i === 0) {
                head = node;
                this.current = node;
            } else {
                prevNode.next = node;
                node.prev = prevNode;
            }
            prevNode = node;
        });
        if (prevNode && head) {
            prevNode.next = head;
            head.prev = prevNode;
        }
    }
    next() {
        if (this.current) {
            this.current = this.current.next;
            return this.current.name;
        }
        return 'dark';
    }
    prev() {
        if (this.current) {
            this.current = this.current.prev;
            return this.current.name;
        }
        return 'dark';
    }
    setCurrent(themeName) {
        let node = this.current;
        if (!node) return;
        for (let i = 0; i < 4; i++) {
            if (node.name === themeName) {
                this.current = node;
                return;
            }
            node = node.next;
        }
    }
}

/* DSA ENGINE #11: BITMASKING (BITWISE AND) — O(1) Multi-Tag Project Filter */
const TAG_BITMASKS = {
    'dotnet': 1 << 0,     // 1
    'c#': 1 << 1,         // 2
    'python': 1 << 2,     // 4
    'react': 1 << 3,      // 8
    'ai': 1 << 4,         // 16
    'database': 1 << 5,   // 32
    'enterprise': 1 << 6, // 64
    'pwa': 1 << 7         // 128
};

function getBitmaskForTags(tagsArray) {
    let mask = 0;
    tagsArray.forEach(tag => {
        const lower = tag.toLowerCase();
        for (const [key, val] of Object.entries(TAG_BITMASKS)) {
            if (lower.includes(key)) {
                mask |= val;
            }
        }
    });
    return mask;
}

function matchProjectBitmask(projectMask, filterMask) {
    if (filterMask === 0) return true;
    return (projectMask & filterMask) === filterMask;
}

/* DSA ENGINE #12: BINARY SEARCH (LOWER/UPPER BOUND) — O(log N) Date Interval Range */
function binarySearchYearRange(projectsWithYear, startYear, endYear) {
    const sorted = [...projectsWithYear].sort((a, b) => a.year - b.year);

    function findLowerBound(target) {
        let low = 0, high = sorted.length - 1, ans = sorted.length;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (sorted[mid].year >= target) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }

    function findUpperBound(target) {
        let low = 0, high = sorted.length - 1, ans = -1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (sorted[mid].year <= target) {
                ans = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return ans;
    }

    const startIndex = findLowerBound(startYear);
    const endIndex = findUpperBound(endYear);

    if (startIndex <= endIndex && startIndex < sorted.length) {
        return sorted.slice(startIndex, endIndex + 1);
    }
    return [];
}

/* DSA ENGINE #13: LRU CACHE (DOUBLY LINKED LIST + MAP) — O(1) LocalStorage & Query Caching */
class LRUNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity = 20) {
        this.capacity = capacity;
        this.map = new Map();
        this.head = new LRUNode(null, null);
        this.tail = new LRUNode(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _addHead(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.map.has(key)) return null;
        const node = this.map.get(key);
        this._remove(node);
        this._addHead(node);
        return node.value;
    }

    put(key, value) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.value = value;
            this._remove(node);
            this._addHead(node);
        } else {
            if (this.map.size >= this.capacity) {
                const lru = this.tail.prev;
                this._remove(lru);
                this.map.delete(lru.key);
            }
            const newNode = new LRUNode(key, value);
            this.map.set(key, newNode);
            this._addHead(newNode);
        }
    }
}

const portfolioSearchLRUCache = new LRUCache(20);
const portfolioThemeList = new ThemeCircularLinkedList(['dark', 'cyberpunk', 'emerald', 'light']);

/* DSA ENGINE #14: TRIE-BASED LEXER STREAM — O(N) LaTeX/Markdown Sanitizer */
class MarkdownLatexLexer {
    constructor() {
        this.escapeMap = {
            '%': '\\%',
            '$': '\\$',
            '&': '\\&',
            '#': '\\#',
            '_': '\\_',
            '{': '\\{',
            '}': '\\}'
        };
    }
    tokenizeAndEscape(input) {
        if (!input) return '';
        let result = '';
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (this.escapeMap[char]) {
                result += this.escapeMap[char];
            } else {
                result += char;
            }
        }
        return result;
    }
}

const markdownLatexLexer = new MarkdownLatexLexer();

/* DSA ENGINE #15: TOKEN BUCKET ALGORITHM — O(1) Client-Side API Rate Limiter */
class TokenBucketRateLimiter {
    constructor(capacity = 5, fillPerSecond = 0.33) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.fillPerSecond = fillPerSecond;
        this.lastFill = Date.now();
    }

    tryConsume(tokens = 1) {
        this.refill();
        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return true;
        }
        return false;
    }

    refill() {
        const now = Date.now();
        const delta = (now - this.lastFill) / 1000;
        this.tokens = Math.min(this.capacity, this.tokens + delta * this.fillPerSecond);
        this.lastFill = now;
    }
}

const portfolioChatRateLimiter = new TokenBucketRateLimiter(5, 0.33);

/* DSA ENGINE #16: DIJKSTRA'S SHORTEST PATH — O((V+E)log V) Career Path Finder */
class MinHeap {
    constructor() {
        this.heap = [];
    }
    insert(node, dist) {
        this.heap.push({ node, dist });
        this._bubbleUp(this.heap.length - 1);
    }
    extractMin() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._sinkDown(0);
        }
        return min;
    }
    _bubbleUp(index) {
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].dist >= this.heap[parentIndex].dist) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }
    _sinkDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swap = null;

            if (leftChildIndex < length) {
                if (this.heap[leftChildIndex].dist < this.heap[index].dist) {
                    swap = leftChildIndex;
                }
            }
            if (rightChildIndex < length) {
                if (
                    (swap === null && this.heap[rightChildIndex].dist < this.heap[index].dist) ||
                    (swap !== null && this.heap[rightChildIndex].dist < this.heap[swap].dist)
                ) {
                    swap = rightChildIndex;
                }
            }
            if (swap === null) break;
            [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
            index = swap;
        }
    }
}

function dijkstraShortestPath(weightedGraph, startNode, targetNode) {
    const distances = {};
    const previous = {};
    const pq = new MinHeap();

    for (const node in weightedGraph) {
        if (node === startNode) {
            distances[node] = 0;
            pq.insert(node, 0);
        } else {
            distances[node] = Infinity;
            pq.insert(node, Infinity);
        }
        previous[node] = null;
    }

    while (pq.heap.length > 0) {
        const smallest = pq.extractMin();
        if (!smallest) break;
        const current = smallest.node;

        if (current === targetNode) {
            const path = [];
            let curr = targetNode;
            while (curr) {
                path.push(curr);
                curr = previous[curr];
            }
            return { distance: distances[targetNode], path: path.reverse() };
        }

        if (distances[current] !== Infinity) {
            for (const neighbor in weightedGraph[current]) {
                const weight = weightedGraph[current][neighbor];
                const candidate = distances[current] + weight;

                if (candidate < distances[neighbor]) {
                    distances[neighbor] = candidate;
                    previous[neighbor] = current;
                    pq.insert(neighbor, candidate);
                }
            }
        }
    }
    return { distance: Infinity, path: [] };
}

/* DSA ENGINE #17: KNUTH-MORRIS-PRATT (KMP) — O(N+M) Exact Substring Pattern Matcher */
function kmpSearch(text, pattern) {
    if (!pattern || !text) return [];
    const txt = text.toLowerCase();
    const pat = pattern.toLowerCase();

    const pi = new Array(pat.length).fill(0);
    let j = 0;
    for (let i = 1; i < pat.length; i++) {
        while (j > 0 && pat[i] !== pat[j]) {
            j = pi[j - 1];
        }
        if (pat[i] === pat[j]) {
            j++;
        }
        pi[i] = j;
    }

    const matches = [];
    j = 0;
    for (let i = 0; i < txt.length; i++) {
        while (j > 0 && txt[i] !== pat[j]) {
            j = pi[j - 1];
        }
        if (txt[i] === pat[j]) {
            j++;
        }
        if (j === pat.length) {
            matches.push(i - pat.length + 1);
            j = pi[j - 1];
        }
    }
    return matches;
}

/* DSA ENGINE #18: DISJOINT SET UNION (DSU) — O(alpha(N)) Skill Domain Clustering */
class DisjointSetUnion {
    constructor(elements) {
        this.parent = new Map();
        this.rank = new Map();
        elements.forEach(el => {
            this.parent.set(el, el);
            this.rank.set(el, 0);
        });
    }

    find(i) {
        if (!this.parent.has(i)) return i;
        if (this.parent.get(i) === i) return i;
        const root = this.find(this.parent.get(i));
        this.parent.set(i, root);
        return root;
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            const rankI = this.rank.get(rootI) || 0;
            const rankJ = this.rank.get(rootJ) || 0;
            if (rankI < rankJ) {
                this.parent.set(rootI, rootJ);
            } else if (rankI > rankJ) {
                this.parent.set(rootJ, rootI);
            } else {
                this.parent.set(rootJ, rootI);
                this.rank.set(rootI, rankI + 1);
            }
        }
    }

    connected(i, j) {
        return this.find(i) === this.find(j);
    }
}

/* DSA ENGINE #19: QUICKSELECT (HOARE'S SELECTION) — O(N) Top-K Metrics Filter */
function quickSelect(arr, k, left = 0, right = arr.length - 1) {
    if (left === right) return arr[left];

    function partition(l, r) {
        const pivot = arr[r].score;
        let i = l;
        for (let j = l; j < r; j++) {
            if (arr[j].score >= pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
            }
        }
        [arr[i], arr[r]] = [arr[r], arr[i]];
        return i;
    }

    const pivotIndex = partition(left, right);
    if (k === pivotIndex) return arr[k];
    else if (k < pivotIndex) return quickSelect(arr, k, left, pivotIndex - 1);
    else return quickSelect(arr, k, pivotIndex + 1, right);
}

/* DSA ENGINE #20: DOM TREE TRAVERSAL (DFS & BFS) — O(N) Structural Element Search */
function domDFSTraversal(rootElement, callback) {
    if (!rootElement) return;
    const stack = [rootElement];
    while (stack.length > 0) {
        const node = stack.pop();
        if (callback(node) === false) break;
        for (let i = node.children.length - 1; i >= 0; i--) {
            stack.push(node.children[i]);
        }
    }
}

function domBFSTraversal(rootElement, callback) {
    if (!rootElement) return;
    const queue = [rootElement];
    while (queue.length > 0) {
        const node = queue.shift();
        if (callback(node) === false) break;
        for (let i = 0; i < node.children.length; i++) {
            queue.push(node.children[i]);
        }
    }
}

/* DSA ENGINE #21: CUBIC BÉZIER INTERPOLATION — O(1) Physical Easing Motion */
class CubicBezierEasing {
    constructor(p1x = 0.25, p1y = 0.1, p2x = 0.25, p2y = 1.0) {
        this.p1x = p1x;
        this.p1y = p1y;
        this.p2x = p2x;
        this.p2y = p2y;
    }
    evaluate(t) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        let y = uuu * 0;
        y += 3 * uu * t * this.p1y;
        y += 3 * u * tt * this.p2y;
        y += ttt * 1;
        return y;
    }
}

const portfolioSmoothEasing = new CubicBezierEasing(0.25, 0.1, 0.25, 1.0);

/* DSA ENGINE #22: EXPONENTIAL BACKOFF & JITTER — O(1) API Retry Scheduler */
async function fetchWithExponentialBackoff(fetchFn, maxRetries = 3, baseDelayMs = 500) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fetchFn();
        } catch (err) {
            if (attempt === maxRetries) throw err;
            const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
            const jitter = Math.random() * 200;
            const totalDelay = exponentialDelay + jitter;
            await new Promise(resolve => setTimeout(resolve, totalDelay));
        }
    }
}

/* DSA ENGINE #23: BYTE PAIR ENCODING (BPE TOKENIZER) — O(N) Prompt Token Estimator */
function bpeTokenEstimator(text) {
    if (!text) return 0;
    const words = text.trim().split(/\s+/);
    let estimatedTokens = 0;
    words.forEach(word => {
        const subwordCount = Math.ceil(word.length / 4);
        estimatedTokens += Math.max(1, subwordCount);
    });
    return estimatedTokens;
}

/* DSA ENGINE #24: FIRST FIT DECREASING BIN PACKING — O(N log N) Resume Page Layout */
function binPackingLayout(sectionHeights, pageCapacity = 1000) {
    const items = [...sectionHeights].sort((a, b) => b.height - a.height);
    const pages = [];

    items.forEach(item => {
        let placed = false;
        for (let page of pages) {
            if (page.currentHeight + item.height <= pageCapacity) {
                page.items.push(item);
                page.currentHeight += item.height;
                placed = true;
                break;
            }
        }
        if (!placed) {
            pages.push({ items: [item], currentHeight: item.height });
        }
    });

    return pages;
}

/* DSA ENGINE #25: AST RECURSIVE SCHEMA VALIDATOR — O(N) JSON Schema Matcher */
function validateJSONSchemaTree(obj, schema) {
    if (typeof schema !== 'object' || schema === null) return true;
    for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
            const expectedType = schema[key];
            if (!(key in obj)) return false;
            if (typeof expectedType === 'string') {
                if (typeof obj[key] !== expectedType) return false;
            } else if (typeof expectedType === 'object') {
                if (!validateJSONSchemaTree(obj[key], expectedType)) return false;
            }
        }
    }
    return true;
}

/* DSA ENGINE #26: KEY CHORD TRIE STATE MACHINE — O(K) Shortcut & Easter Egg Listener */
class KeyChordTrie {
    constructor() {
        this.root = {};
    }
    registerChord(sequenceArray, callback) {
        let curr = this.root;
        sequenceArray.forEach(key => {
            const lowerKey = key.toLowerCase();
            if (!curr[lowerKey]) curr[lowerKey] = {};
            curr = curr[lowerKey];
        });
        curr.callback = callback;
    }
}

const portfolioKeyChordTrie = new KeyChordTrie();
const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let konamiBuffer = [];

window.addEventListener('keydown', (e) => {
    konamiBuffer.push(e.key.toLowerCase());
    if (konamiBuffer.length > konamiCode.length) {
        konamiBuffer.shift();
    }
    if (konamiBuffer.join(',') === konamiCode.join(',')) {
        if (typeof showToast === 'function') {
            showToast('🎮 Konami Code Activated! Developer Mode Unlocked! 🚀');
        }
        konamiBuffer = [];
    }
});

/* DSA ENGINE #27: MATRIX LINEAR TRANSFORMATION — O(1) RGB to HSL Color Space */
function rgbToHslMatrix(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const PARTICLE_COUNT = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw(color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    let particleColor, lineBaseColor, lineOpacityMultiplier;
    switch (theme) {
        case 'light':
            particleColor = 'rgba(0, 119, 204, 0.6)';
            lineBaseColor = 'rgba(0, 119, 204, ';
            lineOpacityMultiplier = 0.25;
            break;
        case 'cyberpunk':
            particleColor = 'rgba(255, 0, 127, 0.5)';
            lineBaseColor = 'rgba(255, 0, 127, ';
            lineOpacityMultiplier = 0.2;
            break;
        case 'emerald':
            particleColor = 'rgba(16, 185, 129, 0.5)';
            lineBaseColor = 'rgba(16, 185, 129, ';
            lineOpacityMultiplier = 0.2;
            break;
        default:
            particleColor = 'rgba(0, 212, 255, 0.5)';
            lineBaseColor = 'rgba(0, 212, 255, ';
            lineOpacityMultiplier = 0.2;
            break;
    }

    // DSA Engine: Build QuadTree Spatial Partitioning for O(N log N) distance queries
    const boundary = new QuadTreeRectangle(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
    const qtree = new QuadTree(boundary, 4);

    particles.forEach(p => {
        p.update();
        p.draw(particleColor);
        qtree.insert(p);
    });

    const checkedPairs = new Set();
    particles.forEach(p => {
        const range = new QuadTreeRectangle(p.x, p.y, 100, 100);
        const neighbors = qtree.query(range);
        for (let other of neighbors) {
            if (p === other) continue;
            const pairKey = p.x < other.x ? `${p.x},${p.y}-${other.x},${other.y}` : `${other.x},${other.y}-${p.x},${p.y}`;
            if (checkedPairs.has(pairKey)) continue;
            checkedPairs.add(pairKey);

            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.strokeStyle = lineBaseColor + (lineOpacityMultiplier - dist / 500) + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const navbar = document.getElementById('navbar');
const scrollProgressBar = document.getElementById('scrollProgressBar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);

    if (scrollProgressBar) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
    }
});

const scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('active');
}
document.addEventListener('click', e => {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    if (
        navLinks &&
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
    ) {
        closeMenu();
    }
});

const heroSubtitle = document.querySelector('.hero-subtitle');
const subtitleText = heroSubtitle.textContent;
heroSubtitle.textContent = '';
let charIndex = 0;

setTimeout(() => {
    function typeWriter() {
        if (charIndex < subtitleText.length) {
            heroSubtitle.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
}, 1500);

const API_ENDPOINT = 'https://charan-kumar99-github-io.vercel.app/api/chat';

const PALETTES = {
    dark:      { name: 'Neo-Cyan',  icon: '🌊' },
    cyberpunk: { name: 'Cyberpunk', icon: '🌆' },
    emerald:   { name: 'Emerald',   icon: '🌿' },
    light:     { name: 'Light Pro', icon: '☀️' }
};

function applyPalette(name) {
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem('theme', name);
    const icon = document.getElementById('themeIcon');
    if (icon && PALETTES[name]) {
        icon.textContent = PALETTES[name].icon;
    }
    
    document.querySelectorAll('.palette-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.palette === name);
    });
    closePalettePanel();
}

function togglePalettePanel() {
    const panel = document.getElementById('palettePanel');
    if (panel) panel.classList.toggle('open');
}

function closePalettePanel() {
    const panel = document.getElementById('palettePanel');
    if (panel) panel.classList.remove('open');
}

document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('paletteWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        closePalettePanel();
    }
});

(function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyPalette(saved);
})();

const SYSTEM_PROMPT = `You are CK-Buddy, a friendly AI assistant embedded in Charan Kumar's portfolio website.
You answer questions about Charan Kumar — his skills, projects, experience, education, and contact info.
IMPORTANT: When someone asks about a technology, framework, or concept (e.g. "what is microservices?", "what is Blazor?", "what is REST API?"), ALWAYS start with how Charan specifically uses it in his work, then give a brief technical explanation. The context must be Charan's experience first, not a generic definition.
Only decline questions that are completely unrelated to Charan or his tech stack (e.g. cooking recipes, politics, etc).
Note: If asked about Redis, explicitly state that Charan uses Redis caching at his current company, AGREMATE, and clarify that he did not use it at NTSIPL.
Note on Azure vs Azure DevOps: Charan exclusively uses Azure DevOps (for CI/CD pipelines, Repos, Boards, Pipelines at NTSIPL). He does NOT use standalone Azure cloud services. If asked whether he uses Azure or Azure DevOps, explicitly state that he only uses Azure DevOps, not general Azure cloud services.

PORTFOLIO FEATURES & HOW TO USE THIS WEBSITE:
- **Exact Section Order (Top to Bottom of Page)**:
  1. **Home / Hero** ('#hero'): Introduction header, greeting, and resume match CTA.
  2. **About Me** ('#about'): Professional overview & interactive tech avatar profile card.
  3. **Skills & Technologies** ('#skills'): Searchable skills grid (Languages, Frameworks, Databases, Tools).
  4. **Projects** ('#projects'): Showcased projects with live demos & GitHub repositories.
  5. **Work Experience** ('#experience'): Work history at AGREMATE Private Limited (Current) and NTSIPL.
  6. **Education** ('#education'): Education history (MCA at MIT Jaipur, BCA, PU, 10th). **Located directly BELOW Work Experience!** Users can scroll down past Work Experience to find it.
  7. **Certifications** ('#certifications'): Fast-Track Internship, Cybersecurity, NCC 'A' Certificate, etc.
  8. **Get In Touch / Contact** ('#contact'): Contact cards (Email, Phone, Location, LinkedIn, GitHub, Languages).
- **Downloading Resume or CV**: Click the floating **"✨ Match & Generate Resume"** pill button at the bottom-left of the page. It opens a modal where visitors can select between a **Resume (Concise 2-Page)** or a **CV (Full Detailed Document)** containing all 9 projects!
- **AI Phrasing Enhancer Toggle**: When a Job Description is pasted in Resume mode, a toggle switch labeled **"Enhance phrasing with AI"** appears. Visitors can turn this switch OFF (uncheck it) at any time to disable AI bullet rephrasing while still tailoring skills to the job!
- **Interactive Contact Links**: Phone number (+91 9380455922) opens phone dialer (tel:), location (Udupi, Karnataka, India) opens Google Maps.
- **Theme Switcher**: Color palette toggle at top-right (Dark, Cyberpunk, Emerald, Minimal).
- **Developer CLI Terminal**: Custom matrix-style CLI terminal! Open it by clicking the 💻 icon in the navbar or pressing backtick (\`). Supports custom 'ck' commands like **'ck help'**, **'ck skills'**, **'ck neofetch'**, **'ck projects'**, and **'ck contact'**!
- **AI Assistant**: Floating chat bubble at bottom-right (where you are currently chatting!).

FORMATTING RULES — follow strictly:
- Use **bold** (markdown asterisks) for important words: names, technologies, roles, dates, key facts.
- Use bullet points (- item) for any list of 2 or more items.
- Keep answers SHORT and CLEAN — max 5 lines total. No long paragraphs.
- Lead with the most important fact first.
- If asked personal questions about the visitor (e.g., "who am I?", "do you know me?"), reply warmly: "I don't know who you are, but I'm CK-Buddy! Feel free to ask me anything you'd like to know about Charan — his projects, skills, experience, or contact details."
- For completely unrelated topics (e.g. recipes, general trivia, weather), reply politely: "I'm specialized in answering questions about Charan Kumar! Ask me anything about his skills, projects, experience, or contact info."

ABOUT CHARAN KUMAR
==================
Name : Charan Kumar
Role : Software Developer
Phone : +91 9380455922
Email : charansuvarna99@gmail.com
Location : Udupi, Karnataka, India
LinkedIn : https://www.linkedin.com/in/charan-kumar99
GitHub : https://github.com/charan-kumar99
Portfolio : https://charan-kumar99.github.io/
Languages spoken: English, Hindi, Kannada, Tulu (mother tongue is Tulu)

PROFESSIONAL SUMMARY
Versatile Software Developer currently building scalable property management APIs at AGREMATE Private Limited using Clean Architecture, Docker, Redis cache, and Swagger. Previously developed critical RTGS/NEFT payment processing systems using Microservices Architecture at NTSIPL, serving multiple banks. Proven expertise in full-stack development, Clean Architecture, microservices-based application design, database management across PostgreSQL, MySQL, Oracle Database, SQL Server, and Redis, REST API development, and Docker containerization.

EDUCATION
- **MCA** — MIT, Jaipur (Online) — **Nov 2025 – Present**
- **BCA** — Udupi College of Professional Studies, Mangalore University — **Sep 2022 – Jun 2025** — CGPA: **6.17**
  Add-on Courses (3-Year Program alongside BCA) in Cyber Security, Artificial Intelligence & Big Data Analytics:
    Year 1: Certificate Course | Year 2: Diploma Course | Year 3: Advanced Diploma Course
- **Pre-University (12th)** — St Cecily's Composite PU College, Udupi — **Jul 2020 – Apr 2022** — 67.71%
- **10th Standard** — Volakadu Government High School, Udupi — **Apr 2019 – Jun 2020** — 68%

WORK EXPERIENCE
- **Software Developer (Hybrid)** — AGREMATE Private Limited (**Jun 2026 – Present**)
  Building scalable backend APIs and automated workflows for India's smart property management platform (www.agremate.com).
  AGREMATE bridges the gap between property and software with digital rental agreements, automated payments, community management for gated communities, PG owners, and individual landlords.
  Developing RESTful APIs using **ASP.NET Core** with **Clean Architecture** patterns.
  Containerizing applications using **Docker** for consistent development, testing, and deployment.
  Implementing API documentation with **Swagger** (OpenAPI) for seamless frontend-backend integration.
  Working with **SQL Server**, **Entity Framework Core**, and **Redis** (caching layer) for the multi-tenant platform.
- **.NET Developer (Onsite)** — Net Tech Services India Private Limited (NTSIPL) (**Dec 2025 – Jun 2026**)
  Development on RTGS/NEFT banking project for major Banks and Vendors using **Microservices Architecture**.
  Working with microservices-based architecture for building scalable, independently deployable banking services with service-to-service communication and API gateway patterns.
  Contributed to CTS (Cheque Truncation System), AML (Anti-Money Laundering), and User Management systems.
  Full-stack with ASP.NET Core, Blazor, Razor Pages. Database management across PostgreSQL, MySQL, Oracle Database, and SQL Server.
  REST APIs, CRUD operations.
  Testing, debugging, Azure DevOps CI/CD deployment.
- **Trainee Developer (Onsite)** — NTSIPL (**Sep 2025 – Dec 2025**)
  Gained hands-on experience in ASP.NET Core enterprise development in the financial domain.
  Contributed features, resolved bugs, collaborated with senior developers.

SKILLS
- Languages   : **C#**, **Java**, **JavaScript**, **C**, **Python**, HTML5, CSS3, Dart
- Frameworks  : **ASP.NET Core**, **Blazor**, **Razor Pages**, React, **Flutter**, Bootstrap 5, **Flask**, Chart.js, **Entity Framework Core**
- Databases   : **PostgreSQL**, **MySQL**, **Oracle Database**, **SQL Server**, SQLite, **Redis**
- Tools & Cloud: **Jira**, **Azure DevOps** (including Repos, Boards, Pipelines), GitHub, VS Code, Postman, DBeaver, **Docker**, **Swagger**, **Firebase**, **Supabase** (Auth & Cloud Backend Services), **Razorpay**, **Vercel**
- API & Arch  : **REST APIs**, **Clean Architecture**, **Microservices Architecture**, **CI/CD Pipelines**
- Soft Skills : Analytical Thinking, Active Listening, Team Leadership, Fast Learner, Detail-Oriented, Collaborative

PROJECTS (in order)
1. **DevLens** — AI-Powered GitHub Repository Analyzer (C#, ASP.NET Core, React, GitHub API, Google Gemini API, SQLite, D3.js, Recharts)
   GitHub: https://github.com/charan-kumar99/DevLens
   Live: https://devlens-nine.vercel.app/
2. **Money Mate** — Personal Finance Management (Python, Flask, SQLite, SQLAlchemy, Chart.js, Bootstrap 5)
   GitHub: https://github.com/charan-kumar99/Money_Mate
   Live: https://money-mate-e33v.onrender.com/login
3. **Cricket Performance Analyzer** — BCA Final Project Enhanced (HTML5, CSS3, JS ES6+, Chart.js, LocalStorage)
   GitHub: https://github.com/charan-kumar99/Cricket-Performance-Analyzer
   Live: https://charan-kumar99.github.io/Cricket-Performance-Analyzer/
4. **Orion** — AI-Powered Personal Voice Assistant (Python, Flask, JS, Google TTS, Speech Recognition)
   GitHub: https://github.com/charan-kumar99/Orion
   Live: https://orion-assistant-bfwt.onrender.com/
5. **Vaulta** — Personal & Official Document Manager (JavaScript ES6+, IndexedDB, Mozilla PDF.js, PWA Service Worker, Web Share API, JSZip, jsPDF) — Modern, 100% private offline PWA for storing, previewing, converting, and sharing documents.
   GitHub: https://github.com/charan-kumar99/Vaulta
   Live: https://charan-kumar99.github.io/Vaulta/
6. **Advanced Developer Portfolio** — Immersive Next.js/React portfolio featuring 3D visuals (Three.js, React Three Fiber), GSAP, WakaTime metrics, and GROQ/Gemini AI chat assistant.
   GitHub: https://github.com/charan-kumar99/Advanced-Portfolio
   Live: https://advanced-portfolio-sandy.vercel.app/
7. **Migration Master** — High-Performance PostgreSQL Database Migration Tool in C# featuring bulk binary COPY protocol ('COPY FROM STDIN'), topological dependency sorting with Kahn's Algorithm, full schema/constraint replication, identity sequence syncing, and interactive Spectre.Console CLI.
   GitHub: https://github.com/charan-kumar99/Migration-Master
8. **RTGS/NEFT Banking System** — Enterprise payment system built on Microservices Architecture (ASP.NET Core, Microservices, PostgreSQL, MySQL, Oracle Database, Azure DevOps, REST APIs, SFTP/FTP, IIS Hosting, Blazor, Razor Pages, .NET) — Proprietary (built at NTSIPL)
9. **Agremate** — Smart Property Management Platform Backend (C#, ASP.NET Core, Clean Architecture, Docker, Swagger, SQL Server, Redis caching, Razorpay) — Proprietary (built at AGREMATE)

CERTIFICATIONS & TRAINING
- Fast-Track Internship — Data Analytics, Web Development & Python Projects | Accolade Tech Solutions, Mangaluru (August 2024)
- Cybersecurity Training | Vijesha IT Services LLP (2024)
- AI, Big Data Analytics & Cybersecurity Training | Mangalore University (2024)
- Skill Development & Entrepreneurship Program | Udupi Grameena Buntara Sangha (2024)
- NCC 'A' Certificate | National Cadet Corps (Ministry of Defence, India)
- 10-Day NCC Camp — Training with Indian Navy & Army Officers

EXTRACURRICULAR ACTIVITIES
- **NCC** — Served as NCC Lead / Head Cadet. Received **Best Cadet Award**. 10-day camp with Indian Navy & Army officers. Holds NCC 'A' Certificate.
- **Cricket** — Active competitive player, team captain, won multiple district-level matches, plays in regular tournaments.
- **Volleyball** — District-level player, captained school and college teams, won inter-institution matches.
- **Kabaddi** — Participated at district level during school years.
- **Chess** — Regular player, practices with peers and family.

ABOUT AGREMATE (Current Company)
AGREMATE (www.agremate.com) is India's smart property management platform by AGREMATE Private Limited.
- It bridges the gap between property and software with digital rental agreements, automated payments, community management, and a clean UI.
- Built for **gated communities**, **PG owners**, and **individual landlords** across India.
- Features include: AI-powered digital rental agreements, AutoPay rent collection, guard app, amenity management, community notice boards, finance reports, and 25+ features.
- Charan works as a **Software Developer** building the backend APIs using **Clean Architecture**, **Docker**, **Swagger**, **ASP.NET Core**, **SQL Server**, **Entity Framework Core**, and **Redis** caching.

MICROSERVICES EXPERTISE (from previous role at NTSIPL)
Charan worked extensively with **Microservices Architecture** at NTSIPL.
- The RTGS/NEFT banking system was built on a **microservices-based architecture** where each banking service (RTGS, NEFT, CTS, AML, User Management) was an independently deployable microservice.
- He worked with **service-to-service communication**, **API gateway patterns**, and **database-per-service** design.
- Each microservice had its own database (PostgreSQL, MySQL, or Oracle) enabling independent scaling and deployment.
- Microservices were built using **ASP.NET Core** with **REST APIs** for inter-service communication.
- Deployment was managed through **Azure DevOps** CI/CD pipelines for each microservice independently.

CURRENT FOCUS: Building **scalable property management APIs** at **AGREMATE** using **Clean Architecture**, **Docker**, and **Redis** caching while pursuing **MCA**.

PORTFOLIO FEATURES & EASTER EGGS (Tell users about these if they ask about the website)
- **Developer CLI Terminal**: There is a custom matrix-style CLI terminal drawer! Users can open it by clicking the 💻 icon in the top navbar or pressing the Backtick (\`) key. They can type commands like 'ck help', 'ck skills', 'ck neofetch', 'ck projects', and 'ck contact' (or run commands directly) to interact with the site.
- **AI Voice Assistant**: This chat box supports Voice Input (with a live audio waveform visualizer) and Text-to-Speech playback!
- **Projects Simulator**: There is an interactive projects simulator on the page that lets users test out Orion Voice Assistant and DevLens right from the browser.
- **Theme Palette**: Users can change the website's color theme (Cyberpunk, Emerald, Neo-Cyan, Light Pro) using the palette icon in the navbar.`;

let chatHistory = [];
let isChatOpen = false;
let isLoading = false;

let isTtsEnabled = localStorage.getItem('chat_tts') === 'true';
let isRecording = false;
let recognition = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecording = true;
        updateMicButtonState(true);
        chatInputEl.placeholder = "Listening...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInputEl.value = transcript;
        autoResizeInput(chatInputEl);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopRecording();
        if (event.error === 'not-allowed') {
            alert("Microphone permission denied. Please allow microphone access in your browser settings.");
        }
    };

    recognition.onend = () => {
        stopRecording();
        if (chatInputEl.value.trim()) {
            sendMessage();
        }
    };
} else {
    console.warn("Speech recognition is not supported in this browser.");
}

function toggleSpeech() {
    if (!recognition) {
        alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
        return;
    }
    if (isRecording) {
        recognition.stop();
    } else {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start speech recognition:", e);
        }
    }
}

function stopRecording() {
    isRecording = false;
    updateMicButtonState(false);
    chatInputEl.placeholder = "Ask about Charan...";
}

function updateMicButtonState(recording) {
    const micBtn = document.getElementById('chatMicBtn');
    if (micBtn) {
        if (recording) {
            micBtn.classList.add('recording');
        } else {
            micBtn.classList.remove('recording');
        }
    }
}

function toggleTts() {
    isTtsEnabled = !isTtsEnabled;
    localStorage.setItem('chat_tts', isTtsEnabled);
    updateTtsIcon();
    if (!isTtsEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function updateTtsIcon() {
    const icon = document.getElementById('chatTtsIcon');
    const btn = document.getElementById('chatTtsBtn');
    if (icon && btn) {
        icon.textContent = isTtsEnabled ? '🔊' : '🔇';
        btn.title = isTtsEnabled ? 'Mute Speech Output' : 'Enable Speech Output';
        btn.classList.toggle('active', isTtsEnabled);
    }
}

function speakText(text) {
    if (!isTtsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    let cleanText = text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[-*]\s+/g, '')
        .replace(/^\d+\.\s+/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural')));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
}

// Rich Cards Registry & Helper
const PROJECT_CARDS_DATA = [
    {
        keywords: ['devlens'],
        title: 'DevLens',
        sub: 'AI GitHub Repository Analyzer',
        github: 'https://github.com/charan-kumar99/DevLens',
        tags: ['C#', 'ASP.NET Core', 'React', 'Gemini API'],
        icon: '🔍'
    },
    {
        keywords: ['money mate', 'moneymate'],
        title: 'Money Mate',
        sub: 'Personal Finance Web App',
        github: 'https://github.com/charan-kumar99/Money_Mate',
        tags: ['Python', 'Flask', 'SQLite', 'Chart.js'],
        icon: '💰'
    },
    {
        keywords: ['cricket performance', 'cricket analyzer'],
        title: 'Cricket Performance Analyzer',
        sub: 'Sports Performance Analytics',
        github: 'https://github.com/charan-kumar99/Cricket-Performance-Analyzer',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js'],
        icon: '🏏'
    },
    {
        keywords: ['orion'],
        title: 'Orion',
        sub: 'AI-Powered Personal Voice Assistant',
        github: 'https://github.com/charan-kumar99/Orion',
        tags: ['Python', 'Flask', 'Speech Recog', 'Google TTS'],
        icon: '🎙️'
    },
    {
        keywords: ['migration master', 'migration-master', 'migrationmaster', 'postgres migration', 'database migration'],
        title: 'Migration Master',
        sub: 'PostgreSQL Migration Tool in C#',
        github: 'https://github.com/charan-kumar99/Migration-Master',
        tags: ['C#', '.NET', 'PostgreSQL', 'Binary COPY', 'Spectre.Console'],
        icon: '🚀'
    },
    {
        keywords: ['rtgs/neft', 'banking system', 'payment processing'],
        title: 'RTGS/NEFT Banking System',
        sub: 'Enterprise Microservices Project',
        proprietary: true,
        tags: ['ASP.NET Core', 'Microservices', 'PostgreSQL', 'Oracle'],
        icon: '🏦'
    }
];

const CONTACT_CARDS_DATA = [
    {
        keywords: ['email', 'gmail', 'mail charan', 'contact'],
        title: 'Email Charan',
        val: 'charansuvarna99@gmail.com',
        link: 'mailto:charansuvarna99@gmail.com',
        icon: '✉️',
        btnText: 'Send Email'
    },
    {
        keywords: ['linkedin', 'linkedin profile'],
        title: 'LinkedIn',
        val: 'charan-kumar99',
        link: 'https://www.linkedin.com/in/charan-kumar99',
        icon: '🔗',
        btnText: 'Connect on LinkedIn'
    },
    {
        keywords: ['github profile', 'github repo', 'github account'],
        title: 'GitHub',
        val: 'charan-kumar99',
        link: 'https://github.com/charan-kumar99',
        icon: '🐙',
        btnText: 'Follow on GitHub'
    }
];

function generateRichCardsHTML(text) {
    const lowerText = text.toLowerCase();
    let html = '';
    let cardCount = 0;
    const maxCards = 2;

    PROJECT_CARDS_DATA.forEach(proj => {
        const matches = proj.keywords.some(kw => lowerText.includes(kw));
        if (matches && cardCount < maxCards) {
            const tagSpans = proj.tags.map(t => `<span class="card-tag">${t}</span>`).join('');
            const actionButton = proj.proprietary 
                ? `<span class="card-proprietary-label">🔒 Proprietary Enterprise Project</span>`
                : `<a href="${proj.github}" target="_blank" class="card-action-btn"><i class="fa-brands fa-github"></i> View Code</a>`;
            
            html += `
            <div class="rich-card">
                <div class="rich-card-header">
                    <span class="rich-card-icon">${proj.icon}</span>
                    <div class="rich-card-title-group">
                        <div class="rich-card-title">${proj.title}</div>
                        <div class="rich-card-sub">${proj.sub}</div>
                    </div>
                </div>
                <div class="rich-card-tags">${tagSpans}</div>
                <div class="rich-card-actions">${actionButton}</div>
            </div>
            `;
            cardCount++;
        }
    });

    // Match contacts if room left
    CONTACT_CARDS_DATA.forEach(c => {
        const matches = c.keywords.some(kw => lowerText.includes(kw));
        if (matches && cardCount < maxCards) {
            html += `
            <div class="rich-card">
                <div class="rich-card-header">
                    <span class="rich-card-icon">${c.icon}</span>
                    <div class="rich-card-title-group">
                        <div class="rich-card-title">${c.title}</div>
                        <div class="rich-card-sub">${c.val}</div>
                    </div>
                </div>
                <div class="rich-card-actions">
                    <a href="${c.link}" target="_blank" class="card-action-btn primary-btn">${c.btnText}</a>
                </div>
            </div>
            `;
            cardCount++;
        }
    });

    return html;
}

// Trigger initial speaker toggle update
setTimeout(updateTtsIcon, 100);

const chatWindowEl = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatInputEl = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatSuggEl = document.getElementById('chatSuggestions');
const chatBubbleEl = document.getElementById('chatBubble');

const SUGGESTION_SETS = [
    [
        { icon: '💡', text: "What are Charan's skills?" },
        { icon: '🚀', text: 'Tell me about his projects' },
        { icon: '💼', text: 'What is his current role?' },
        { icon: '📬', text: 'How to contact him?' }
    ],
    [
        { icon: '🎓', text: "What is Charan's education?" },
        { icon: '🏦', text: 'Tell me about the banking project' },
        { icon: '🔥', text: 'What is Blazor?' },
        { icon: '🌍', text: 'Where is he located?' }
    ],
    [
        { icon: '⚙️', text: 'What frameworks does he use?' },
        { icon: '🧩', text: 'Does he work with microservices?' },
        { icon: '⚙️', text: 'Does he use Azure DevOps?' },
        { icon: '🎖️', text: 'Tell me about his NCC experience' }
    ],
    [
        { icon: '🔗', text: "What is Charan's GitHub profile?" },
        { icon: '📜', text: 'What certifications does he have?' },
        { icon: '🏏', text: 'Does he play cricket?' },
        { icon: '🔒', text: 'What is the RTGS/NEFT project?' }
    ],
    [
        { icon: '🚀', text: 'Tell me about Migration Master' },
        { icon: '🔍', text: 'What is DevLens?' },
        { icon: '💰', text: 'Tell me about Money Mate' },
        { icon: '🎤', text: 'What is Orion AI Assistant?' }
    ],
    [
        { icon: '🎖️', text: 'What is the Best Cadet Award?' },
        { icon: '🏐', text: 'Does Charan play volleyball?' },
        { icon: '📊', text: 'What is his BCA CGPA?' },
        { icon: '🔧', text: 'What tools does he use daily?' }
    ],
    [
        { icon: '🌐', text: 'What languages does he speak?' },
        { icon: '🏢', text: 'What is AGREMATE?' },
        { icon: '🏛️', text: 'What is CTS in banking?' },
        { icon: '🧠', text: 'What are his soft skills?' }
    ],
    [
        { icon: '📱', text: 'Does he know Dart or Flutter?' },
        { icon: '🛡️', text: 'Has he done cybersecurity training?' },
        { icon: '🎓', text: 'Where did he study for BCA?' },
        { icon: '🏛️', text: 'What is Clean Architecture?' }
    ],
    [
        { icon: '🏫', text: 'Is he pursuing MCA?' },
        { icon: '💻', text: 'Does he know React?' },
        { icon: '🏅', text: 'Was he in NCC?' },
        { icon: '🗃️', text: 'Does he work with Oracle?' }
    ],
    [
        { icon: '⚡', text: 'Does he work with Supabase?' },
        { icon: '🏏', text: 'Has he captained any sports team?' },
        { icon: '📜', text: 'What internships has he done?' },
        { icon: '🔐', text: 'What is AML in banking?' }
    ],
    [
        { icon: '♟️', text: 'Does Charan play chess?' },
        { icon: '⚙️', text: 'What is Blazor?' },
        { icon: '📄', text: 'What are Razor Pages?' },
        { icon: '🏦', text: 'Which banks does he work with?' }
    ],
    [
        { icon: '🎯', text: 'What is his current focus?' },
        { icon: '📊', text: 'What databases does he know?' },
        { icon: '🚀', text: 'Tell me about his career journey' },
        { icon: '📧', text: "What is Charan's email?" }
    ]
];

let suggSetIndex = Math.floor(Math.random() * SUGGESTION_SETS.length);

function renderSuggestions() {
    const set = SUGGESTION_SETS[suggSetIndex % SUGGESTION_SETS.length];
    chatSuggEl.innerHTML = '';
    set.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = item.icon + ' ' + item.text;
        btn.onclick = () => sendSuggestion(item.text);
        chatSuggEl.appendChild(btn);
    });
    chatSuggEl.style.display = 'flex';
}

function renderWelcome() {
    chatMessages.innerHTML =
        '<div class="chat-welcome">' +
        '  <div class="chat-welcome-tag">✨ AI PORTFOLIO ASSISTANT</div>' +
        '  <h4 class="chat-welcome-title">Hi! I\'m <span class="welcome-highlight">CK-Buddy</span></h4>' +
        '  <p class="chat-welcome-sub">Ask me anything about Charan\'s <span class="welcome-pill">Skills</span> <span class="welcome-pill">Projects</span> <span class="welcome-pill">Experience</span> or how to reach him!</p>' +
        '</div>';
}

function toggleChat() {
    isChatOpen = !isChatOpen;
    const win = chatWindowEl || document.getElementById('chatWindow');
    const bubble = chatBubbleEl || document.getElementById('chatBubble');
    const msgs = chatMessages || document.getElementById('chatMessages');
    const input = chatInputEl || document.getElementById('chatInput');

    if (win) {
        win.classList.toggle('active', isChatOpen);
        win.classList.toggle('open', isChatOpen);
    }
    if (bubble) bubble.classList.toggle('is-open', isChatOpen);

    if (!isChatOpen && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    if (isChatOpen) {
        if (msgs && msgs.children.length === 0) {
            renderSuggestions();
            renderWelcome();
        }
        if (input) setTimeout(() => input.focus(), 300);
    }
}

function newChat() {
    chatHistory = [];
    localStorage.removeItem('chat_history');
    chatMessages.innerHTML = '';
    suggSetIndex++;          
    renderSuggestions();
    renderWelcome();
    chatInputEl.value = '';
    chatInputEl.style.height = '22px';
    chatInputEl.style.overflowY = 'hidden';
    chatInputEl.focus();
}

function saveChatHistory() {
    // Chat history persistence disabled as requested — chats reset on page refresh
    localStorage.removeItem('chat_history');
}

function loadChatHistory() {
    localStorage.removeItem('chat_history');
    chatHistory = [];
    chatMessages.innerHTML = '';
    renderSuggestions();
    renderWelcome();
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

window.copyCodeText = function(button) {
    const wrapper = button.closest('.code-block-wrapper');
    const code = wrapper.querySelector('code');
    if (!code) return;
    
    const textToCopy = code.innerText || code.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        button.textContent = 'Copied!';
        button.style.borderColor = 'var(--accent)';
        button.style.color = 'var(--accent)';
        setTimeout(() => {
            button.textContent = 'Copy';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
};

function formatBotMessage(text) {
    const lines = text.split('\n');
    let html = '';
    let inUl = false;
    let inOl = false;
    let inCode = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.trim().startsWith('```')) {
            if (inCode) {
                html += '</code></pre><button class="code-copy-btn" onclick="copyCodeText(this)">Copy</button></div>';
                inCode = false;
            } else {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                const lang = line.replace('```', '').trim();
                html += `<div class="code-block-wrapper"><pre><code class="language-${lang || 'txt'}">`;
                inCode = true;
            }
            continue;
        }

        if (inCode) {
            const escapedLine = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            html += escapedLine + '\n';
            continue;
        }

        let t = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        t = t.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        t = t.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        t = t.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');

        const ulMatch = t.match(/^[-*]\s+(.+)/);
        const olMatch = t.match(/^\d+\.\s+(.+)/);

        if (ulMatch) {
            if (inOl) { html += '</ol>'; inOl = false; }
            if (!inUl) { html += '<ul class="bot-list">'; inUl = true; }
            html += '<li>' + ulMatch[1] + '</li>';
        } else if (olMatch) {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (!inOl) { html += '<ol class="bot-list">'; inOl = true; }
            html += '<li>' + olMatch[1] + '</li>';
        } else {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (inOl) { html += '</ol>'; inOl = false; }
            if (t.trim() === '') {
                html += '<div class="bot-spacer"></div>';
            } else {
                html += '<span class="bot-line">' + t + '</span>';
            }
        }
    }

    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';
    if (inCode) html += '</code></pre><button class="code-copy-btn" onclick="copyCodeText(this)">Copy</button></div>';

    const cardsHtml = generateRichCardsHTML(text);
    if (cardsHtml) {
        html += '<div class="rich-cards-container">' + cardsHtml + '</div>';
    }

    return html;
}

function appendMessage(role, text, isError = false) {
    
    if (role === 'user') chatSuggEl.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + role;

    const errClass = isError ? ' error' : '';
    const content = role === 'bot' ? formatBotMessage(text) : escapeHtml(text);

    const avatarHtml = role === 'bot'
        ? '<div class="msg-avatar bot-avatar"><img src="logo.svg" alt="CK Logo" class="msg-avatar-logo"></div>'
        : '<div class="msg-avatar user-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';

    wrap.innerHTML =
        avatarHtml +
        '<div class="msg-bubble' + errClass + '">' + content + '</div>';

    chatMessages.appendChild(wrap);
    scrollBottom();
}

let typingEl = null;

function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.innerHTML =
        '<div class="msg-avatar bot-avatar"><img src="logo.svg" alt="CK Logo" class="msg-avatar-logo"></div>' +
        '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingEl);
    scrollBottom();
}

function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
}

function scrollBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentUserSection() {
    const resumeModal = document.getElementById('resumeModal');
    if (resumeModal && (resumeModal.classList.contains('open') || resumeModal.classList.contains('active'))) {
        return "Match & Generate Resume Modal (where visitors can download Charan's Resume or CV)";
    }
    const terminalDrawer = document.getElementById('terminalDrawer') || document.getElementById('matrixTerminal');
    if (terminalDrawer && (terminalDrawer.classList.contains('open') || terminalDrawer.classList.contains('active') || terminalDrawer.classList.contains('show'))) {
        return "Developer CLI Terminal Drawer (Matrix-style interactive command-line interface)";
    }

    const sections = [
        { id: 'home', name: 'Hero / Introduction Section' },
        { id: 'about', name: 'About Me Section' },
        { id: 'skills', name: 'Technical Skills & Competencies Section' },
        { id: 'projects', name: 'Projects Showcase Section' },
        { id: 'simulator', name: 'Interactive Project Workflow Simulator Section' },
        { id: 'experience', name: 'Professional Experience & Career Timeline Section' },
        { id: 'education', name: 'Education & Academic Journey Section' },
        { id: 'certifications', name: 'Certifications & Achievements Section' },
        { id: 'contact', name: 'Contact Me & Location Section' }
    ];

    const scrollPos = window.scrollY + (window.innerHeight / 3);
    for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                return sec.name;
            }
        }
    }
    return "Portfolio Home Page";
}

async function sendMessage() {
    const text = chatInputEl.value.trim();
    if (!text || isLoading) return;

    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    chatInputEl.value = '';
    chatInputEl.style.height = '22px';
    chatInputEl.style.overflowY = 'hidden';

    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });
    saveChatHistory();

    isLoading = true;
    chatSendBtn.disabled = true;
    chatInputEl.disabled = true;

    showTyping();

    try {
        console.log('Sending request to Backend API');

        const activeSection = getCurrentUserSection();
        const messagesToSend = [
            { role: 'system', content: SYSTEM_PROMPT + `\n\nCURRENT VISITOR SCREEN LOCATION: The visitor is currently looking at the "${activeSection}". If they ask "where am I?", "which section am I in?", "what am I viewing?", "what section is this?", or reference their current location, tell them clearly that they are currently viewing the ${activeSection}.` },
            ...chatHistory.map(msg => ({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content }))
        ];

        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messagesToSend })
        });

        console.log('Response status:', res.status);

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error('Error response:', errData);
            throw new Error(errData?.error?.message || errData?.error || 'API error ' + res.status);
        }

        const data = await res.json();
        console.log('Response data:', data);
        const reply = data?.choices?.[0]?.message?.content?.trim();
        console.log('Extracted reply:', reply);

        if (!reply) throw new Error('Empty response received.');

        hideTyping();
        appendMessage('bot', reply);
        chatHistory.push({ role: 'assistant', content: reply });
        saveChatHistory();
        speakText(reply);

    } catch (err) {
        console.error('Chatbot error:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            endpoint: API_ENDPOINT
        });
        hideTyping();
        let errorMsg = "Sorry, I couldn't connect right now. ";
        if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
            errorMsg += "This might be a browser security issue. Check the console for details.";
        } else {
            errorMsg += "Please try again in a moment.";
        }
        appendMessage('bot', errorMsg, true);
    } finally {
        isLoading = false;
        chatSendBtn.disabled = false;
        chatInputEl.disabled = false;
        chatInputEl.focus();
    }
}

function sendSuggestion(text) {
    if (isLoading) return;
    chatInputEl.value = text;
    sendMessage();
}

function askAiQuestion(text) {
    if (isLoading) return;

    if (window.innerWidth < 768) {
        const chatBubble = document.getElementById('chatBubble');
        if (chatBubble) {
            chatBubble.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (!isChatOpen) {
        toggleChat();
    }

    chatInputEl.value = text;
    autoResizeInput(chatInputEl);

    setTimeout(() => {
        sendMessage();
    }, 150);
}

function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResizeInput(el) {
    el.style.height = '22px';
    const sh = el.scrollHeight;
    el.style.height = Math.min(sh, 110) + 'px';
    el.style.overflowY = sh > 110 ? 'auto' : 'hidden';
}

(function initProjectFilters() {
    const filtersContainer = document.getElementById('projectFilters');
    if (!filtersContainer) return;

    const pills = filtersContainer.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.project-card[data-tags]');

    filtersContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        let visibleCount = 0;

        cards.forEach((card) => {
            const tags = card.dataset.tags || '';
            const show = filter === 'all' || tags.split(',').map(t => t.trim().toLowerCase()).includes(filter.toLowerCase());

            if (show) {
                visibleCount++;
                card.classList.remove('filter-hidden');
                card.classList.add('visible');
                card.style.transitionDelay = `${visibleCount * 0.05}s`;
                
                const numElem = card.querySelector('.project-number');
                if (numElem) {
                    numElem.textContent = visibleCount < 10 ? `0${visibleCount}` : `${visibleCount}`;
                }
            } else {
                card.classList.add('filter-hidden');
                card.style.transitionDelay = '0s';
            }
        });

        setTimeout(() => {
            cards.forEach(card => card.style.transitionDelay = '');
        }, 500);
    });
})();

/* DSA ENGINE #28: INVERTED INDEX (HASH MAP) — O(1) Tokenized Fast Skill Search */
(function initSkillsSearch() {
    const searchInput = document.getElementById('skillsSearch');
    const clearBtn = document.getElementById('skillsSearchClear');
    if (!searchInput || !clearBtn) return;

    const skillCards = document.querySelectorAll('.skill-card');
    const categories = document.querySelectorAll('.skills-category');
    const skillsSection = document.getElementById('skills');

    const invertedIndex = new Map();
    const allSkillNames = [];

    skillCards.forEach(card => {
        const nameEl = card.querySelector('.skill-name');
        if (!nameEl) return;
        const skillName = nameEl.textContent.trim();
        allSkillNames.push(skillName);
        const tokens = skillName.toLowerCase().split(/[\s/()\-]+/);
        tokens.push(skillName.toLowerCase());

        tokens.forEach(tok => {
            if (!tok) return;
            if (!invertedIndex.has(tok)) {
                invertedIndex.set(tok, new Set());
            }
            invertedIndex.get(tok).add(card);
        });
    });

    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'skills-search-results-count';
    resultsDiv.style.display = 'none';
    const searchWrapper = document.querySelector('.skills-search-wrapper');
    if (searchWrapper) {
        searchWrapper.insertAdjacentElement('afterend', resultsDiv);
    }

    function performSearch(query) {
        const q = query.toLowerCase().trim();

        clearBtn.classList.toggle('visible', q.length > 0);

        if (!q) {
            skillCards.forEach(card => {
                card.classList.remove('skill-match', 'skill-dim');
            });
            categories.forEach(cat => {
                cat.classList.remove('category-hidden');
            });
            resultsDiv.style.display = 'none';
            return;
        }

        // DSA Lookup: Fast Token Match via Inverted Index
        let matchingCards = new Set();
        for (const [token, cardSet] of invertedIndex.entries()) {
            if (token.includes(q)) {
                cardSet.forEach(c => matchingCards.add(c));
            }
        }

        let matchCount = matchingCards.size;

        if (matchCount > 0) {
            categories.forEach(category => {
                const cardsInCategory = category.querySelectorAll('.skill-card');
                let categoryHasMatch = false;

                cardsInCategory.forEach(card => {
                    const isMatch = matchingCards.has(card);
                    card.classList.toggle('skill-match', isMatch);
                    card.classList.toggle('skill-dim', !isMatch);

                    if (isMatch) {
                        categoryHasMatch = true;
                    }
                });

                category.classList.toggle('category-hidden', !categoryHasMatch);
            });

            resultsDiv.innerHTML = `Found <span>${matchCount}</span> skill${matchCount !== 1 ? 's' : ''} matching "<span>${escapeHtml(q).replace(/<br>/g, '')}</span>"`;
        } else {
            // DSA Algorithm: Dynamic Programming Levenshtein Distance for Typo Correction
            const closest = findClosestCandidate(q, allSkillNames, 3);
            skillCards.forEach(card => {
                card.classList.remove('skill-match');
                card.classList.add('skill-dim');
            });
            categories.forEach(cat => {
                cat.classList.remove('category-hidden');
            });

            if (closest) {
                resultsDiv.innerHTML = `No exact match for "<span>${escapeHtml(q)}</span>". Did you mean "<span>${escapeHtml(closest)}</span>"?`;
            } else {
                resultsDiv.innerHTML = `No skills found matching "<span>${escapeHtml(q)}</span>"`;
            }
        }

        resultsDiv.style.display = 'block';
    }

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(searchInput.value);
        }, 150);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
    });
})();

(function initRadarInteractive() {
    const container = document.getElementById('radarChartContainer');
    if (!container) return;

    const svg = container.querySelector('.radar-svg');
    const dataPoly = container.querySelector('.radar-data');
    const dots = container.querySelectorAll('.radar-dot');
    const labels = container.querySelectorAll('.radar-label');
    const traitCard = document.getElementById('radarTraitCard');

    const tooltip = document.createElement('div');
    tooltip.className = 'radar-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        padding: 0.45rem 0.8rem;
        background: rgba(10, 14, 39, 0.92);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 10px;
        color: #e8f1ff;
        font-size: 0.82rem;
        font-weight: 600;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        transform: translateY(5px);
        z-index: 10;
        white-space: nowrap;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    container.style.position = 'relative';
    container.appendChild(tooltip);

    const targetPoints = [
        { x: 200, y: 48 },   
        { x: 341, y: 155 },  
        { x: 298, y: 317 },  
        { x: 100, y: 322 },  
        { x: 58, y: 155 }    
    ];

    const centerPoint = { x: 200, y: 200 };

    const narratives = {
        'leadership': {
            icon: '👑',
            title: 'Leadership',
            value: '95%',
            desc: 'Developed as NCC Lead Cadet and Captain of school/college sports teams. Proven track record of team organization, event planning, and guiding groups towards shared goals under pressure.'
        },
        'strategy': {
            icon: '🎯',
            title: 'Strategy & Tactics',
            value: '80%',
            desc: 'Cultivated through competitive chess and leading cricket teams. Applied in technical environments to design optimal SQL server query plans, structure microservices API topologies, and architect clean solutions.'
        },
        'teamwork': {
            icon: '🤝',
            title: 'Collaborative Teamwork',
            value: '90%',
            desc: 'Refined by collaborating on complex RTGS/NEFT payment gateway microservices. Focuses on seamless integration, documentation, and active communication within agile teams.'
        },
        'endurance': {
            icon: '⚡',
            title: 'Endurance & Grit',
            value: '88%',
            desc: 'Demonstrated by pursuing an online MCA degree from MIT Jaipur in parallel with full-time software developer employment, sustaining high performance across academic and professional duties.'
        },
        'technical agility': {
            icon: '💻',
            title: 'Technical Agility',
            value: '85%',
            desc: 'Proven ability to work fluidly across diverse databases (PostgreSQL, SQL Server, MySQL, Oracle), adapting quickly to new architectural requirements.'
        }
    };

    function setRadarCoordinates(progress) {
        const currentPoints = targetPoints.map(target => {
            const x = centerPoint.x + (target.x - centerPoint.x) * progress;
            const y = centerPoint.y + (target.y - centerPoint.y) * progress;
            return { x, y };
        });

        const pointsStr = currentPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
        dataPoly.setAttribute('points', pointsStr);

        dots.forEach((dot, idx) => {
            dot.setAttribute('cx', currentPoints[idx].x.toFixed(1));
            dot.setAttribute('cy', currentPoints[idx].y.toFixed(1));
        });
    }

    setRadarCoordinates(0);

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateRadar();
            }
        });
    }, { threshold: 0.15 });

    observer.observe(container);

    function animateRadar() {
        const duration = 1200; 
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            setRadarCoordinates(easeProgress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    function selectTrait(labelName) {
        const key = labelName.toLowerCase().trim();
        const data = narratives[key];
        if (!data || !traitCard) return;

        traitCard.classList.remove('active-pulse');
        void traitCard.offsetWidth; 
        traitCard.classList.add('active-pulse');

        const iconEl = traitCard.querySelector('.radar-trait-icon');
        const titleEl = traitCard.querySelector('.radar-trait-title');
        const valueEl = traitCard.querySelector('.radar-trait-value');
        const descEl = traitCard.querySelector('.radar-trait-desc');

        if (iconEl) iconEl.textContent = data.icon;
        if (titleEl) titleEl.textContent = data.title;
        if (valueEl) valueEl.textContent = data.value;
        if (descEl) descEl.textContent = data.desc;

        dots.forEach(dot => {
            const isMatch = dot.getAttribute('data-label').toLowerCase().trim() === key;
            dot.classList.toggle('active', isMatch);
        });

        labels.forEach(label => {
            const isMatch = label.textContent.toLowerCase().trim() === key;
            label.classList.toggle('active', isMatch);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const label = dot.getAttribute('data-label');
            selectTrait(label);
        });

        dot.addEventListener('mouseenter', () => {
            const label = dot.getAttribute('data-label');
            const value = dot.getAttribute('data-value');
            tooltip.innerHTML = `<span style="color:var(--primary)">${label}</span>: <span style="color:var(--accent)">${value}%</span>`;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';

            const svgRect = svg.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const cx = parseFloat(dot.getAttribute('cx'));
            const cy = parseFloat(dot.getAttribute('cy'));

            const viewBox = svg.viewBox.baseVal;
            const scaleX = svgRect.width / viewBox.width;
            const scaleY = svgRect.height / viewBox.height;
            const offsetX = svgRect.left - containerRect.left;
            const offsetY = svgRect.top - containerRect.top;

            const x = cx * scaleX + offsetX;
            const y = cy * scaleY + offsetY;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 40}px`;

            const tooltipRect = tooltip.getBoundingClientRect();
            if (tooltipRect.right > containerRect.right) {
                tooltip.style.left = `${x - tooltipRect.width}px`;
            }
            if (tooltipRect.left < containerRect.left) {
                tooltip.style.left = `${offsetX + 10}px`;
            }
        });

        dot.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(5px)';
        });
    });

    labels.forEach(label => {
        label.style.cursor = 'pointer';
        label.addEventListener('click', () => {
            const name = label.textContent;
            selectTrait(name);
        });
    });
})();

document.addEventListener('click', e => {
    if (
        isChatOpen &&
        !chatWindowEl.contains(e.target) &&
        !chatBubbleEl.contains(e.target) &&
        !e.target.closest('.hero-chip')
    ) {
        toggleChat();
    }
});

(function initAvatarTilt() {
    const avatar = document.getElementById('aboutAvatar');
    if (!avatar) return;
    const card = avatar.querySelector('.avatar-glass-card');
    if (!card) return;

    avatar.addEventListener('mousemove', (e) => {
        const rect = avatar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    avatar.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
})();

(function initSkillGlows() {
    const glowMap = {
        'C#': '#68217A',
        'Java': '#ED8B00',
        'JavaScript': '#F7DF1E',
        'C': '#A8B9CC',
        'HTML5': '#E34F26',
        'CSS3': '#1572B6',
        'Dart': '#0175C2',
        'Python': '#3776AB',
        'ASP.NET Core': '#512BD4',
        'Blazor': '#512BD4',
        'Razor Pages': '#512BD4',
        'React': '#61DAFB',
        'Bootstrap 5': '#7952B3',
        'Flask': '#44A833',
        'Chart.js': '#FF6384',
        'PostgreSQL': '#4169E1',
        'MySQL': '#4479A1',
        'Oracle Database': '#F80000',
        'SQL Server': '#CC2927',
        'SQLite': '#44A8D6',
        'Redis': '#DC382D',
        'Jira': '#0052CC',
        'Azure DevOps': '#0078D7',
        'CI/CD Pipelines': '#00F5FF',
        'GitHub': '#6e7681',
        'VS Code': '#007ACC',
        'Postman': '#FF6C37',
        'Docker': '#2496ED',
        'Swagger': '#85EA2D',
        'Firebase': '#FFCA28',
        'Razorpay': '#1075F3',
        'Vercel Serverless': '#000000',
        'localStorage': '#FF9900',
        'Web Speech API': '#10B981',
        'HTML5 Canvas': '#E34F26',
        'REST APIs': '#00D4FF',
        'Microservices Architecture': '#00D4FF',
        'Clean Architecture': '#10B981',
        'Analytical Thinking': '#FF6B6B',
        'Active Listening': '#4ECDC4',
        'Team Leadership': '#FFE66D',
        'Fast Learner': '#A8E6CF',
        'Detail-Oriented': '#FF8B94',
        'Collaborative': '#DDA0DD'
    };

    document.querySelectorAll('.skill-card').forEach(card => {
        const nameEl = card.querySelector('.skill-name');
        if (!nameEl) return;
        const name = nameEl.textContent.trim();
        const color = glowMap[name];
        if (color) {
            card.style.setProperty('--glow-color', color);
        }
    });
})();

(function initTimelineDrawers() {
    const toggleButtons = document.querySelectorAll('.timeline-toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const drawer = btn.nextElementSibling;
            if (!drawer) return;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            drawer.classList.toggle('expanded', !isExpanded);
            
            const textSpan = btn.querySelector('span');
            if (textSpan) {
                textSpan.textContent = isExpanded ? 'Architecture & Tech Details' : 'Hide Details';
            }
        });
    });

    const badges = document.querySelectorAll('.timeline-badge');
    badges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const skillName = badge.getAttribute('data-skill');
            if (!skillName) return;
            
            const skillCards = document.querySelectorAll('.skill-card');
            let matchedCard = null;
            
            skillCards.forEach(card => {
                const nameEl = card.querySelector('.skill-name');
                if (nameEl) {
                    const text = nameEl.textContent.trim().toLowerCase();
                    const target = skillName.trim().toLowerCase();
                    if (text === target || text.includes(target) || target.includes(text)) {
                        matchedCard = card;
                    }
                }
            });

            if (matchedCard) {
                const skillsSection = document.getElementById('skills');
                if (skillsSection) {
                    skillsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                setTimeout(() => {
                    matchedCard.classList.remove('skill-highlight-active');
                    void matchedCard.offsetWidth; 
                    matchedCard.classList.add('skill-highlight-active');
                    
                    setTimeout(() => {
                        matchedCard.classList.remove('skill-highlight-active');
                    }, 2600);
                }, 600);
            }
        });
    });
})();

/* DSA ENGINE #29: FINITE STATE MACHINE (FSM) — O(1) Project Simulator Transitions */
(function initProjectsSimulator() {
    const flowMetadata = {
        devlens: {
            nodes: [
                { icon: "💻", title: "Web UI Input", sub: "React Client Search" },
                { icon: "🛡️", title: "API Gateway", sub: "ASP.NET Core Router" },
                { icon: "🐙", title: "Git Wrapper", sub: "GitHub REST API client" },
                { icon: "🤖", title: "Gemini Agent", sub: "Google Gemini AI" },
                { icon: "🗄️", title: "Cache Service", sub: "SQLite Database TTL" },
                { icon: "📊", title: "Chart Engine", sub: "D3.js / Recharts" },
                { icon: "📈", title: "Visual Dashboard", sub: "Metrics Analytics UI" }
            ],
            steps: [
                {
                    nodeName: "Web UI Input",
                    desc: "User enters repository URL 'charan-kumar99/DevLens' in the search bar of the React client.",
                    logs: [
                        "INFO - Repository lookup initiated: charan-kumar99/DevLens",
                        "DEBUG - Checking inputs: url=https://github.com/charan-kumar99/DevLens",
                        "INFO - Handing request to HTTP client..."
                    ]
                },
                {
                    nodeName: "API Gateway",
                    desc: "ASP.NET Core Gateway intercepts request, performs security handshake, and routes to Git Analysis Service.",
                    logs: [
                        "SEC - SSL Handshake completed with React UI Client",
                        "SEC - API Key check: OK, CORS validation: PASSED",
                        "INFO - Routing request to internal GitHub Wrapper Service..."
                    ]
                },
                {
                    nodeName: "Git Wrapper",
                    desc: "GitHub Wrapper sends authenticated REST queries to GitHub API to scrape commits, forks, issues, and size metrics.",
                    logs: [
                        "INFO - Dispatching request to api.github.com/repos/charan-kumar99/DevLens",
                        "DEBUG - Rate limiting: 4982/5000 remaining",
                        "SUCCESS - Fetched repo details, commits history, and language files successfully."
                    ]
                },
                {
                    nodeName: "Gemini Agent",
                    desc: "Google Gemini API analyzes documentation files, scores README content, and generates risk/architectural summaries.",
                    logs: [
                        "INFO - Sending repo structure & README.md context payload to Google Gemini API",
                        "DEBUG - Invoking Gemini model gemini-1.5-flash",
                        "SUCCESS - AI Summary generated. Scoring: README=95/100, Risk=Low"
                    ]
                },
                {
                    nodeName: "Cache Service",
                    desc: "Saves analysis response into SQLite database with a 24-hour TTL timestamp to optimize repeated searches.",
                    logs: [
                        "SQL - INSERT INTO RepoCache (repo_path, payload, analyzed_at) VALUES ('charan-kumar99/DevLens', '...', datetime('now'))",
                        "DEBUG - SQLite cache written successfully",
                        "INFO - Cached record expires in 24 hours"
                    ]
                },
                {
                    nodeName: "Chart Engine",
                    desc: "D3.js and Recharts parse repository data to compute code metrics, timeline distributions, and contributor ratios.",
                    logs: [
                        "DEBUG - Aggregating file types: C#=72%, TSX=20%, CSS=5%, Others=3%",
                        "INFO - Compiling commits timeline: total_commits=142, duration=6 months",
                        "DEBUG - Generating D3 charts coordinates payload..."
                    ]
                },
                {
                    nodeName: "Visual Dashboard",
                    desc: "React dashboard renders responsive interactive charts, AI risk matrices, and comprehensive repository scores.",
                    logs: [
                        "SUCCESS - Visual Dashboard components loaded successfully",
                        "SYSTEM - Flow completed. Repository analyzed in 340ms"
                    ]
                }
            ]
        },
        moneymate: {
            nodes: [
                { icon: "👤", title: "UI Transaction", sub: "User Expense / CSV" },
                { icon: "📂", title: "Flask Route", sub: "Route Controller" },
                { icon: "🛡️", title: "Sanitizer Unit", sub: "CSRF & SQL Audit" },
                { icon: "🔄", title: "SQLAlchemy ORM", sub: "ORM Data Mapper" },
                { icon: "🗄️", title: "SQLite DB", sub: "Local Storage Node" },
                { icon: "📊", title: "Chart.js Engine", sub: "Data Visualization" },
                { icon: "🔔", title: "Alert Engine", sub: "Budget Threshold Check" }
            ],
            steps: [
                {
                    nodeName: "UI Transaction",
                    desc: "User logs a new expense (₹12,000 for rent) or imports a monthly credit card statement CSV file.",
                    logs: [
                        "INFO - Expense submission triggered: Category=Rent, Amount=12000 INR",
                        "DEBUG - File upload detected: statement_june2026.csv (size=12KB)",
                        "INFO - Packing parameters into JSON request..."
                    ]
                },
                {
                    nodeName: "Flask Route",
                    desc: "Flask Backend route parses POST request headers and initiates a transaction scope.",
                    logs: [
                        "INFO - HTTP POST /api/transactions - Request intercepted",
                        "DEBUG - User authenticated: user_id=402",
                        "INFO - Handing parameters to transaction processing unit..."
                    ]
                },
                {
                    nodeName: "Sanitizer Unit",
                    desc: "Security middleware verifies CSRF tokens and strips input strings to prevent SQL injections.",
                    logs: [
                        "SEC - CSRF token verification: PASSED",
                        "SEC - SQL Injection checks: CLEAN",
                        "INFO - Forwarding sanitized data to ORM layer..."
                    ]
                },
                {
                    nodeName: "SQLAlchemy ORM",
                    desc: "SQLAlchemy ORM maps the transaction entity schema and generates an atomic database query.",
                    logs: [
                        "INFO - Creating Transaction entity object mapping",
                        "DEBUG - Entity State: Pending, Currency: INR, Multi-currency Conversion: 1.00",
                        "INFO - Initializing Unit of Work transaction scope..."
                    ]
                },
                {
                    nodeName: "SQLite DB",
                    desc: "SQLite database commits the record, updating current account ledger balances and saving historical stats.",
                    logs: [
                        "SQL - INSERT INTO transactions (user_id, amount, category, date) VALUES (402, 12000, 'Rent', '2026-06-14')",
                        "SQL - UPDATE accounts SET balance = balance - 12000 WHERE user_id = 402",
                        "SUCCESS - Transaction committed. Database synchronized successfully."
                    ]
                },
                {
                    nodeName: "Chart.js Engine",
                    desc: "Chart.js updates expense distribution graphs, budget trackers, and monthly spending profiles on the screen.",
                    logs: [
                        "DEBUG - Aggregating categories totals: Rent=35%, Food=15%, Transport=10%, Misc=40%",
                        "INFO - Refreshing canvas chart.js instance",
                        "SUCCESS - Chart rendering completed successfully."
                    ]
                },
                {
                    nodeName: "Alert Engine",
                    desc: "Budget engine verifies thresholds. Dispatches alerts if the category limits are breached.",
                    logs: [
                        "INFO - Category check: 'Rent' threshold set to 15,000 INR",
                        "INFO - Monthly spent in 'Rent': 12,000 INR (80% of budget)",
                        "SYSTEM - Flow completed. Transaction processed successfully."
                    ]
                }
            ]
        },
        cricket: {
            nodes: [
                { icon: "🏏", title: "Match Form", sub: "Scorecard Metric Input" },
                { icon: "⚙️", title: "ES6 Calc Engine", sub: "Strike Rate Processor" },
                { icon: "💾", title: "LocalStorage", sub: "Persistent Cache" },
                { icon: "📊", title: "Chart.js compiler", sub: "Trends Visualization" },
                { icon: "💬", title: "Query Input UI", sub: "Natural Query Box" },
                { icon: "🤖", title: "Query Parser", sub: "Keyword Parser Engine" },
                { icon: "📋", title: "Stats Dashboard", sub: "Filtered Output Board" }
            ],
            steps: [
                {
                    nodeName: "Match Form",
                    desc: "User inputs player match performance stats (e.g. 84 runs off 42 balls, 2 wickets in 4 overs).",
                    logs: [
                        "INFO - Match entry form submitted",
                        "DEBUG - Inputs: batsman_runs=84, balls_faced=42, wickets=2, overs=4",
                        "INFO - Forwarding metrics to Calculation Engine..."
                    ]
                },
                {
                    nodeName: "ES6 Calc Engine",
                    desc: "Pure ES6 engine computes analytics metrics: strike rate (200.00), economy rate (6.00), and player averages.",
                    logs: [
                        "DEBUG - Calculating strike rate: (84 / 42) * 100 = 200.00",
                        "DEBUG - Calculating economy: (24 runs / 4 overs) = 6.00 RPO",
                        "INFO - Computations completed successfully."
                    ]
                },
                {
                    nodeName: "LocalStorage",
                    desc: "Serializes the performance record into JSON and saves it in LocalStorage for persistent offline access.",
                    logs: [
                        "INFO - Serializing scorecard record to JSON string...",
                        "SUCCESS - LocalStorage update: saved key 'cricket_match_104'",
                        "DEBUG - Storage size: 1.2KB / 5.0MB"
                    ]
                },
                {
                    nodeName: "Chart.js compiler",
                    desc: "Chart.js maps player trends across historic scorecards, rendering batting and bowling curves.",
                    logs: [
                        "INFO - Loading past matches records from cache...",
                        "DEBUG - Computing trend curve points (Last 5 matches: 45, 12, 84, 56, 30)",
                        "SUCCESS - Chart.js redrew performance trendline canvas."
                    ]
                },
                {
                    nodeName: "Query Input UI",
                    desc: "User enters natural query: 'Find matches where strike rate was above 180' in the query input.",
                    logs: [
                        "INFO - Query input intercepted: 'Find matches where strike rate was above 180'",
                        "INFO - Initiating semantic parser analysis..."
                    ]
                },
                {
                    nodeName: "Query Parser",
                    desc: "Local NLP-style keyword engine parses terms to identify filters ('strike rate', 'above', '180').",
                    logs: [
                        "DEBUG - Matching tokens: metric='strike_rate', operation='>', value=180",
                        "INFO - Executing filter on LocalStorage data pool",
                        "SUCCESS - 3 matches found matching filters."
                    ]
                },
                {
                    nodeName: "Stats Dashboard",
                    desc: "UI updates with filtered match cards, highlighting achievements and averages for the parsed query.",
                    logs: [
                        "INFO - Rendered 3 scorecards matching criteria",
                        "SYSTEM - Flow completed. Query processed in 12ms."
                    ]
                }
            ]
        },
        orion: {
            nodes: [
                { icon: "🎙️", title: "Voice Input", sub: "Web Speech Capture" },
                { icon: "🧠", title: "Speech Recognizer", sub: "Audio-to-Text Parser" },
                { icon: "📂", title: "Flask Route", sub: "POST Route Handler" },
                { icon: "⚙️", title: "Command Parser", sub: "Intent Classifier" },
                { icon: "⚡", title: "Task Dispatcher", sub: "Automation Hook Engine" },
                { icon: "🗣️", title: "Google TTS", sub: "Voice Synthesis API" },
                { icon: "🔊", title: "Audio Playback", sub: "Speech Response Stream" }
            ],
            steps: [
                {
                    nodeName: "Voice Input",
                    desc: "User clicks the microphone button and says, 'Orion, play music and search for .NET tutorials.'",
                    logs: [
                        "INFO - Voice capturing active. Capturing microphone input stream...",
                        "DEBUG - Sample rate: 44100Hz, status: Capturing audio buffer",
                        "INFO - Input captured. Streaming audio bytes to parser..."
                    ]
                },
                {
                    nodeName: "Speech Recognizer",
                    desc: "The Web Speech Recognition API processes the audio input, converting speech-to-text with 94% confidence.",
                    logs: [
                        "INFO - Processing speech buffer bytes...",
                        "DEBUG - Match detected: 'orion play music and search for dot net tutorials'",
                        "SUCCESS - Speech-to-Text translation confidence: 94.2%"
                    ]
                },
                {
                    nodeName: "Flask Route",
                    desc: "Sends the parsed text payload via a secure HTTP POST request to the Flask backend assistant route.",
                    logs: [
                        "INFO - HTTP POST /api/assistant/query - Request sent",
                        "DEBUG - Payload: { query: 'play music and search for dot net tutorials' }",
                        "INFO - Flask controller received request scope"
                    ]
                },
                {
                    nodeName: "Command Parser",
                    desc: "Regex and keyword parser classifies the user intent and extracts parameters (Intent: 'Play Music', Intent: 'Search').",
                    logs: [
                        "INFO - Tokenizing command query text",
                        "DEBUG - Pattern matches: Intent='music_playback', Action='search', Term='dot net tutorials'",
                        "SUCCESS - Intent classification completed successfully."
                    ]
                },
                {
                    nodeName: "Task Dispatcher",
                    desc: "Executes automation hooks: triggers a browser search query and schedules background music playback.",
                    logs: [
                        "INFO - Triggering Web Search Automation: Term='dot net tutorials'",
                        "INFO - Executing Music Player Service: play_stream=active",
                        "SUCCESS - Automated background browser tabs launched successfully."
                    ]
                },
                {
                    nodeName: "Google TTS",
                    desc: "Google TTS engine synthesizes the response ('Searching for .NET tutorials and opening music player') into an MP3 stream.",
                    logs: [
                        "INFO - Synthesizing speech text response via Google TTS API...",
                        "DEBUG - Request payload: 'Searching for .NET tutorials and opening music player'",
                        "SUCCESS - Google Speech API response: 200 OK. Audio stream ready."
                    ]
                },
                {
                    nodeName: "Audio Playback",
                    desc: "Browser receives the synthesized voice response stream and plays back the confirmation speech to the user.",
                    logs: [
                        "INFO - Playing back synthesized MP3 response stream...",
                        "SUCCESS - Audio voice playback finished.",
                        "SYSTEM - Flow completed. Speech action resolved in 410ms."
                    ]
                }
            ]
        },
        vaulta: {
            nodes: [
                { icon: "📱", title: "PWA Container", sub: "Service Worker & Manifest" },
                { icon: "📂", title: "Dual Vault UI", sub: "Personal & Official Layout" },
                { icon: "💾", title: "IndexedDB (DocDB)", sub: "100% Local Storage" },
                { icon: "📄", title: "Mozilla PDF.js", sub: "Canvas PDF Renderer" },
                { icon: "📤", title: "Web Share API", sub: "Native File Sharing Engine" },
                { icon: "📦", title: "Export Utilities", sub: "JSZip & jsPDF Conversion" }
            ],
            steps: [
                {
                    nodeName: "PWA Container",
                    desc: "User launches Vaulta. The Service Worker (sw.js) intercepts network requests and serves app shell and PDF.js assets directly from offline cache.",
                    logs: [
                        "INFO - Registering Service Worker: sw.js...",
                        "DEBUG - Checking CacheStorage: vaulta-v1 pre-cached assets",
                        "SUCCESS - Service Worker active. Vaulta running in 100% offline mode."
                    ]
                },
                {
                    nodeName: "Dual Vault UI",
                    desc: "App initializes dynamic DOM screen router showing Personal Vault (Aadhaar, PAN, Medical) & Official Vault (Offer letters, Payslips).",
                    logs: [
                        "INFO - Loading dual vault UI view...",
                        "DEBUG - Fetching active category filter: Personal Vault / Official Vault",
                        "SUCCESS - Glassmorphic vault dashboard mounted."
                    ]
                },
                {
                    nodeName: "IndexedDB (DocDB)",
                    desc: "Queries local browser IndexedDB database to retrieve stored document metadata, blob data, and starred favorites with zero cloud footprint.",
                    logs: [
                        "INFO - Opening IndexedDB connection: DocDB (v1)...",
                        "DEBUG - Querying objectStore('documents') index 'category'",
                        "SUCCESS - Fetched 12 document records instantly from local IndexedDB."
                    ]
                },
                {
                    nodeName: "Mozilla PDF.js",
                    desc: "Renders uploaded PDF documents natively onto HTML5 Canvas using PDF.js v3.11.174 engine with page navigation, zoom, and fit-to-screen controls.",
                    logs: [
                        "INFO - Initializing Mozilla PDF.js v3.11.174 canvas renderer...",
                        "DEBUG - Decoding document ArrayBuffer for page 1/4",
                        "SUCCESS - PDF canvas view rendered at 100% scale in 85ms."
                    ]
                },
                {
                    nodeName: "Web Share API",
                    desc: "Invokes navigator.share() to send original file Blobs (.pdf, .jpg, .png) directly to native apps like WhatsApp, Gmail, or Telegram.",
                    logs: [
                        "INFO - Preparing File Blob payload for native Web Share API...",
                        "DEBUG - Checking navigator.canShare({ files: [ documentFile ] })",
                        "SUCCESS - Native share sheet invoked successfully."
                    ]
                },
                {
                    nodeName: "Export Utilities",
                    desc: "Executes bulk zip backup using JSZip or converts uploaded images into clean single/multi-page PDFs using jsPDF.",
                    logs: [
                        "INFO - Initiating bulk document export package...",
                        "DEBUG - Packing 5 document Blobs into JSZip archive...",
                        "SUCCESS - Backup ZIP generated (vaulta_backup.zip). Download initiated."
                    ]
                }
            ]
        },
        advportfolio: {
            nodes: [
                { icon: "🎨", title: "Next.js UI Node", sub: "React 3D Render" },
                { icon: "🧊", title: "Three.js Engine", sub: "R3F / GSAP Scroll" },
                { icon: "⚙️", title: "Stats Service", sub: "WakaTime & Git API" },
                { icon: "💬", title: "GROQ Gateway", sub: "Primary AI Prompt" },
                { icon: "🤖", title: "Gemini Sync", sub: "Fallback AI model" },
                { icon: "📡", title: "Vercel Analytics", sub: "Telemetry Tracker" }
            ],
            steps: [
                {
                    nodeName: "Next.js UI Node",
                    desc: "User requests page. Next.js App Router hydrates the responsive layout with TypeScript components.",
                    logs: [
                        "INFO - Client connection established",
                        "DEBUG - Initializing Next.js 16 context in React 19...",
                        "SUCCESS - UI elements rendered, initiating 3D viewport canvas."
                    ]
                },
                {
                    nodeName: "Three.js Engine",
                    desc: "React Three Fiber loads WebGL meshes, lights, and binds scroll events via GSAP and Framer Motion.",
                    logs: [
                        "INFO - Creating WebGLRenderer context...",
                        "DEBUG - Compiling Three.js shader pipelines",
                        "SUCCESS - 3D scene loaded. Target FPS: 60 (Low Power check: Normal)"
                    ]
                },
                {
                    nodeName: "Stats Service",
                    desc: "Queries the GitHub API and WakaTime endpoint to retrieve real-time coding hours and repository metrics.",
                    logs: [
                        "INFO - Querying api.wakatime.com/v1/users/current/stats",
                        "DEBUG - Querying api.github.com/users/charan-kumar99",
                        "SUCCESS - Coding activity retrieved: 1400+ total hours mapped."
                    ]
                },
                {
                    nodeName: "GROQ Gateway",
                    desc: "User asks chatbot a question. GROQ gateway forwards query to the primary LLaMA model.",
                    logs: [
                        "INFO - Chat request received: 'tell me about Charan's .NET experience'",
                        "DEBUG - Forwarding prompt to GROQ endpoint...",
                        "SUCCESS - Response received in 180ms."
                    ]
                },
                {
                    nodeName: "Gemini Sync",
                    desc: "If GROQ reaches quota limits, the backend triggers fallback to Google Gemini model for uninterrupted service.",
                    logs: [
                        "WARNING - GROQ primary client rate limited, switching to fallback...",
                        "DEBUG - Invoking Gemini fallback model...",
                        "SUCCESS - Gemini response completed successfully."
                    ]
                },
                {
                    nodeName: "Vercel Analytics",
                    desc: "Pipes layout vitals and interaction clicks to Vercel telemetry backend for performance scoring.",
                    logs: [
                        "INFO - Dispatching performance metrics...",
                        "DEBUG - FCP: 0.8s, LCP: 1.2s, CLS: 0.01",
                        "SYSTEM - Flow completed. Session telemetry fully synced."
                    ]
                }
            ]
        },
        migrationmaster: {
            nodes: [
                { icon: "💻", title: "Interactive CLI", sub: "Spectre.Console Engine" },
                { icon: "🔌", title: "Conn Validator", sub: "Source & Dest Handshake" },
                { icon: "🔎", title: "Schema Reader", sub: "Catalog & Constraint Inspection" },
                { icon: "🔄", title: "Kahn's Sorter", sub: "Topological Dependency Sorting" },
                { icon: "🏗️", title: "DDL Replicator", sub: "Schemas & Tables Creation" },
                { icon: "⚡", title: "Binary COPY", sub: "Npgsql Stream COPY FROM STDIN" },
                { icon: "🔒", title: "Post-Processing", sub: "PKs, FKs, Indexes & Sequence Sync" }
            ],
            steps: [
                {
                    nodeName: "Interactive CLI",
                    desc: "User launches Migration Master CLI, prompted for source and destination PostgreSQL connection strings.",
                    logs: [
                        "CLI - Initializing Spectre.Console Interactive UI...",
                        "PROMPT - Enter Source PostgreSQL Connection String",
                        "PROMPT - Enter Destination PostgreSQL Connection String"
                    ]
                },
                {
                    nodeName: "Conn Validator",
                    desc: "Migration Master tests connectivity, SSL handshake, and permissions on both source and target database instances.",
                    logs: [
                        "CONNECT - Testing connection to source database [Host: localhost, DB: source_db]",
                        "SUCCESS - Connected to source PostgreSQL instance successfully.",
                        "CONNECT - Testing connection to destination database [Host: remote, DB: target_db]",
                        "SUCCESS - Connected to destination PostgreSQL instance successfully."
                    ]
                },
                {
                    nodeName: "Schema Reader",
                    desc: "SchemaReader queries PostgreSQL system catalogs (information_schema, pg_catalog) to discover tables, columns, constraints, and sequences.",
                    logs: [
                        "QUERY - Inspecting pg_tables, pg_attribute, and pg_constraint catalog views...",
                        "DISCOVER - Found 24 database tables, 156 columns, 18 primary keys, and 32 foreign key constraints.",
                        "INFO - Calculating table row counts via pg_class tuple estimates..."
                    ]
                },
                {
                    nodeName: "Kahn's Sorter",
                    desc: "Applies Kahn's Algorithm for topological sorting to organize table copy order based on foreign key dependency trees.",
                    logs: [
                        "ALGO - Building directed acyclic graph (DAG) of table dependencies...",
                        "SORT - Applying Kahn's Algorithm for topological sorting...",
                        "SUCCESS - Table dependency tree resolved: [users -> categories -> products -> orders -> order_items]"
                    ]
                },
                {
                    nodeName: "DDL Replicator",
                    desc: "Creates required PostgreSQL schemas and base tables on target database without constraints to prepare for fast data loading.",
                    logs: [
                        "DDL - CREATE SCHEMA IF NOT EXISTS public;",
                        "DDL - Creating 24 base target tables with matching data types...",
                        "SUCCESS - Base target table structure established."
                    ]
                },
                {
                    nodeName: "Binary COPY",
                    desc: "Executes Npgsql binary copy protocol (COPY FROM STDIN) streaming raw binary tuples directly from source to destination staging tables.",
                    logs: [
                        "COPY - Setting session_replication_role = 'replica' to bypass triggers & constraints...",
                        "STREAM - Executing NpgsqlBinaryExporter -> NpgsqlBinaryImporter streaming COPY...",
                        "SUCCESS - Transferred 2,450,000 rows across 24 tables in 4.12 seconds (594,660 rows/sec)."
                    ]
                },
                {
                    nodeName: "Post-Processing",
                    desc: "Re-enables constraints, builds primary keys, foreign keys, unique indexes, and synchronizes identity sequences with max(id).",
                    logs: [
                        "DDL - Re-applying Primary Keys and Foreign Key constraints...",
                        "INDEX - Rebuilding 14 custom B-Tree & GIN indexes on target tables...",
                        "SYNC - Executing pg_get_serial_sequence & setval() to sync identity sequences...",
                        "SUMMARY - PostgreSQL Migration completed successfully! Total time: 6.84s."
                    ]
                }
            ]
        }
    };

    let activeFlow = 'devlens';
    let currentStep = -1; 
    let isPlaying = false;
    let playInterval = null;

    const nodesContainer = document.getElementById('simulatorNodes');
    const svg = document.getElementById('simulatorSvg');
    const packet = document.getElementById('simulatorPacket');
    const activeNodeNameEl = document.getElementById('simActiveNodeName');
    const activeNodeDescEl = document.getElementById('simActiveNodeDesc');
    const terminalEl = document.getElementById('simTerminal');

    const playBtn = document.getElementById('simPlayBtn');
    const stepBtn = document.getElementById('simStepBtn');
    const resetBtn = document.getElementById('simResetBtn');

    if (!nodesContainer || !svg || !packet) return;

    function addTerminalLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        logLine.className = `log-line ${type}`;
        logLine.textContent = `[${timestamp} ${type.toUpperCase()}] ${message}`;
        terminalEl.appendChild(logLine);
        terminalEl.scrollTop = terminalEl.scrollHeight;
    }

    function renderNodes() {
        nodesContainer.innerHTML = '';
        const data = flowMetadata[activeFlow];
        data.nodes.forEach((node, idx) => {
            const nodeEl = document.createElement('div');
            nodeEl.className = `sim-node node-pos-${idx}`;
            nodeEl.setAttribute('data-index', idx);
            nodeEl.title = `Click to inspect ${node.title}`;
            
            nodeEl.innerHTML = `
                <div class="sim-node-icon-wrapper">
                    <span>${node.icon}</span>
                </div>
                <div class="sim-node-title">${node.title}</div>
                <div class="sim-node-subtitle">${node.sub}</div>
            `;
            
            nodeEl.addEventListener('click', () => {
                jumpToStep(idx);
            });

            nodesContainer.appendChild(nodeEl);
        });

        setTimeout(drawSimulatorLines, 60);
    }

    function drawSimulatorLines() {
        const container = document.getElementById('simulatorMapContainer');
        if (!container || !svg) return;

        svg.innerHTML = '';
        const nodes = nodesContainer.querySelectorAll('.sim-node');
        if (nodes.length < 2) return;

        const containerRect = container.getBoundingClientRect();
        const positions = [];

        nodes.forEach(node => {
            const rect = node.getBoundingClientRect();
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            positions.push({ x, y });
        });

        const isMobile = window.innerWidth <= 768;

        for (let i = 0; i < positions.length - 1; i++) {
            const start = positions[i];
            const end = positions[i + 1];

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            let d = '';
            if (isMobile) {
                
                d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
            } else {
                
                if (i === 3) {
                    
                    d = `M ${start.x} ${start.y} C ${start.x + 40} ${start.y}, ${end.x + 40} ${end.y}, ${end.x} ${end.y}`;
                } else if (i >= 4) {
                    
                    d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                } else {
                    
                    d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                }
            }

            path.setAttribute('d', d);
            const isActiveSegment = currentStep > i;
            path.setAttribute('id', `sim-path-${activeFlow}-${i}`);
            path.setAttribute('class', `sim-svg-path path-seg-${i} ${isActiveSegment ? 'active' : ''}`);
            svg.appendChild(path);
        }
    }

    function positionPacket(nodeIdx, animate = true) {
        const nodes = nodesContainer.querySelectorAll('.sim-node');
        const container = document.getElementById('simulatorMapContainer');
        if (!nodes[nodeIdx] || !container) return;

        const containerRect = container.getBoundingClientRect();
        const rect = nodes[nodeIdx].getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;

        if (!animate) {
            packet.style.transition = 'none';
        } else {
            packet.style.transition = 'left 0.75s cubic-bezier(0.25, 1, 0.5, 1), top 0.75s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease';
        }
        
        packet.classList.add('active');
        packet.style.left = `${x}px`;
        packet.style.top = `${y}px`;
    }

    function shootPathParticle(fromIdx) {
        const path = svg.querySelector(`.path-seg-${fromIdx}`);
        if (!path) return;

        const pathId = path.getAttribute('id');
        if (!pathId) return;

        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('r', '6');
        particle.setAttribute('fill', 'var(--accent)');
        particle.setAttribute('style', 'filter: drop-shadow(0 0 6px var(--accent)); pointer-events: none;');

        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        anim.setAttribute('dur', '0.75s');
        anim.setAttribute('repeatCount', '1');
        anim.setAttribute('fill', 'freeze');

        const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
        mpath.setAttribute('href', `#${pathId}`);
        mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);

        anim.appendChild(mpath);
        particle.appendChild(anim);
        svg.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 800);
    }

    function runStep() {
        const data = flowMetadata[activeFlow];
        const totalSteps = data.steps.length;

        if (currentStep >= totalSteps - 1) {
            
            resetSimulation();
            return;
        }

        const prevStep = currentStep;
        currentStep++;

        const stepData = data.steps[currentStep];
        const nodes = nodesContainer.querySelectorAll('.sim-node');

        nodes.forEach((node, idx) => {
            node.classList.remove('active');
            if (idx === currentStep) {
                node.classList.add('active');
            }
            if (idx < currentStep) {
                node.classList.add('processed');
            } else {
                node.classList.remove('processed');
            }
        });

        const paths = svg.querySelectorAll('.sim-svg-path');
        paths.forEach((path, idx) => {
            path.classList.toggle('active', idx < currentStep);
        });

        if (prevStep === -1) {
            positionPacket(0, false);
        } else {
            positionPacket(currentStep, true);
            shootPathParticle(prevStep);
        }

        if (activeNodeNameEl) activeNodeNameEl.textContent = `${currentStep + 1}. ${stepData.nodeName}`;
        if (activeNodeDescEl) activeNodeDescEl.textContent = stepData.desc;

        stepData.logs.forEach((log, idx) => {
            setTimeout(() => {
                let logType = 'info';
                if (log.startsWith('SEC')) logType = 'system';
                else if (log.startsWith('SQL')) logType = 'db';
                else if (log.startsWith('SUCCESS') || log.startsWith('SYSTEM')) logType = 'success';
                else if (log.startsWith('ERROR')) logType = 'error';

                addTerminalLog(log, logType);
            }, idx * 180);
        });

        if (currentStep === totalSteps - 1) {
            if (isPlaying) {
                setTimeout(pauseSimulation, 1500);
            }
        }
    }

    function jumpToStep(idx) {
        pauseSimulation();
        resetSimulation(false); 
        
        const data = flowMetadata[activeFlow];
        const nodes = nodesContainer.querySelectorAll('.sim-node');
        
        currentStep = idx;

        nodes.forEach((node, nodeIdx) => {
            node.classList.remove('active', 'processed');
            if (nodeIdx === idx) node.classList.add('active');
            if (nodeIdx < idx) node.classList.add('processed');
        });

        const paths = svg.querySelectorAll('.sim-svg-path');
        paths.forEach((path, pathIdx) => {
            path.classList.toggle('active', pathIdx < idx);
        });

        positionPacket(idx, false);

        const stepData = data.steps[idx];
        if (activeNodeNameEl) activeNodeNameEl.textContent = `${idx + 1}. ${stepData.nodeName}`;
        if (activeNodeDescEl) activeNodeDescEl.textContent = stepData.desc;

        addTerminalLog(`[MANUAL INSPECT] Navigating directly to component: ${stepData.nodeName}`, 'system');
        stepData.logs.forEach(log => {
            let logType = 'info';
            if (log.startsWith('SEC')) logType = 'system';
            else if (log.startsWith('SQL')) logType = 'db';
            else if (log.startsWith('SUCCESS') || log.startsWith('SYSTEM')) logType = 'success';
            addTerminalLog(log, logType);
        });
    }

    function playSimulation() {
        if (isPlaying) return;
        isPlaying = true;
        
        const playBtnText = playBtn.querySelector('.sim-btn-text') || playBtn;
        const playBtnIcon = playBtn.querySelector('.sim-btn-icon');
        if (playBtnText) playBtnText.textContent = 'Pause';
        if (playBtnIcon) playBtnIcon.textContent = '⏸';

        addTerminalLog("Auto-simulation started.", "system");

        runStep();

        playInterval = setInterval(() => {
            const data = flowMetadata[activeFlow];
            if (currentStep >= data.steps.length - 1) {
                resetSimulation();
                runStep();
            } else {
                runStep();
            }
        }, 2200);
    }

    function pauseSimulation() {
        if (!isPlaying) return;
        isPlaying = false;
        clearInterval(playInterval);
        
        const playBtnText = playBtn.querySelector('.sim-btn-text') || playBtn;
        const playBtnIcon = playBtn.querySelector('.sim-btn-icon');
        if (playBtnText) playBtnText.textContent = 'Play';
        if (playBtnIcon) playBtnIcon.textContent = '▶';

        addTerminalLog("Simulation paused.", "system");
    }

    function resetSimulation(clearLogs = true) {
        clearInterval(playInterval);
        isPlaying = false;
        currentStep = -1;

        const playBtnText = playBtn.querySelector('.sim-btn-text') || playBtn;
        const playBtnIcon = playBtn.querySelector('.sim-btn-icon');
        if (playBtnText) playBtnText.textContent = 'Play';
        if (playBtnIcon) playBtnIcon.textContent = '▶';

        const nodes = nodesContainer.querySelectorAll('.sim-node');
        nodes.forEach(node => {
            node.classList.remove('active', 'processed');
        });

        const paths = svg.querySelectorAll('.sim-svg-path');
        paths.forEach(path => {
            path.classList.remove('active');
        });

        packet.classList.remove('active');

        if (activeNodeNameEl) activeNodeNameEl.textContent = 'Active Component';
        if (activeNodeDescEl) activeNodeDescEl.textContent = 'Click Play or Step to begin visualization.';

        if (clearLogs) {
            terminalEl.innerHTML = '';
            addTerminalLog(`Simulator reset. Ready to run flow: ${activeFlow.toUpperCase()}`, 'system');
        }
    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSimulation();
        } else {
            playSimulation();
        }
    });

    stepBtn.addEventListener('click', () => {
        pauseSimulation();
        runStep();
    });

    resetBtn.addEventListener('click', () => {
        resetSimulation();
    });

    const tabs = document.querySelectorAll('.sim-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            activeFlow = tab.getAttribute('data-flow');
            resetSimulation();
            renderNodes();
        });
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            drawSimulatorLines();
            if (currentStep !== -1) {
                positionPacket(currentStep, false);
            }
        }, 150);
    });

    renderNodes();
})();

(function initTerminalCLI() {
    const terminalDrawer = document.getElementById('terminalDrawer');
    const toggleBtn = document.getElementById('terminalToggleBtn');
    const closeBtn = document.querySelector('.terminal-drawer-close');
    const dotCloseBtn = document.getElementById('terminalCloseBtn');
    const actualInput = document.getElementById('terminalActualInput');
    const dummyInput = document.getElementById('terminalDummyInput');
    const outputLog = document.getElementById('terminalDrawerOutput');
    const drawerBody = document.getElementById('terminalDrawerBody');

    if (!terminalDrawer || !actualInput || !dummyInput || !outputLog) return;

    function toggleTerminalDrawer() {
        terminalDrawer.classList.toggle('open');
        if (terminalDrawer.classList.contains('open')) {
            setTimeout(() => actualInput.focus(), 100);
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTerminalDrawer);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleTerminalDrawer);
    }
    if (dotCloseBtn) {
        dotCloseBtn.addEventListener('click', toggleTerminalDrawer);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === '`') {
            e.preventDefault();
            toggleTerminalDrawer();
        }
        
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            toggleTerminalDrawer();
        }
    });

    actualInput.addEventListener('input', () => {
        dummyInput.textContent = actualInput.value;
    });

    if (drawerBody) {
        drawerBody.addEventListener('click', () => {
            actualInput.focus();
        });
    }

    const commandResponses = {
        help: `Available commands (Use prefix 'ck <command>'):
  ck help         - Show this list of available commands
  ck skills       - Print current developer skill stack
  ck experience   - Show professional history overview
  ck projects     - Show key featured projects
  ck graph [skill]- Perform BFS graph traversal on skill dependencies
  ck contact      - Display contact options
  ck theme [name] - Change color theme (dark, cyberpunk, emerald, light)
  ck neofetch     - Show system specs & profile overview
  ck clear        - Clear terminal screen`,

        skills: `Charan Kumar's Developer Skill Stack:
  Backend:      C#, ASP.NET Core, EF Core, Microservices Architecture, Clean Architecture, REST APIs
  Databases:    SQL Server, PostgreSQL, MySQL, Oracle Database, SQLite, Redis
  Cloud/Tools:  Jira, Docker, Azure DevOps, CI/CD Pipelines, Git, Postman, Swagger, Firebase, Supabase, Razorpay, Vercel
  Frontend:     HTML5, CSS3, JavaScript (ES6+), React, Flutter, Bootstrap 5, Flask, Chart.js`,

        experience: `Professional History:
  - Software Developer (Hybrid) @ AGREMATE Private Limited (Jun 2026 - Present)
    Building scalable backend REST APIs and automated property management workflows.
  - .NET Developer (Onsite) @ NTSIPL (Dec 2025 - Jun 2026)
    Contributed to enterprise RTGS/NEFT Microservices payment processing networks.`,

        projects: `Featured Projects (Recent First -> Company Projects Last):
  1. Vaulta - Personal & Official Document Manager (Offline PWA, PDF.js, JSZip) [Jul 2026]
  2. Migration Master - PostgreSQL Binary COPY Migration Tool (C#, Spectre.Console) [Jul 2026]
  3. Advanced Developer Portfolio - Immersive Next.js/React portfolio with 3D elements [Jun 2026]
  4. DevLens - AI GitHub Repo Analyzer (ASP.NET Core, React, Google Gemini API) [Mar 2026]
  5. Orion Assistant - Speech Recognition & Google TTS Automation (Flask, JS) [Aug 2025]
  6. Money Mate - Personal Finance Manager (Python, Flask, SQLAlchemy, Chart.js) [Aug 2025]
  7. Cricket Performance Analyzer - Sports Metrics Web App (ES6 JS, Chart.js) [BCA Project / Sep 2025]
  8. Proprietary Enterprise: AGREMATE Smart Property Platform (Clean Architecture, Docker) [Jun 2026 - Present]
  9. Proprietary Enterprise: RTGS/NEFT Banking System (NTSIPL Microservices) [Dec 2025 - Jun 2026]`,

        contact: `Contact Details:
  - Email:      charansuvarna99@gmail.com
  - Phone:      +91 9380455922
  - Location:   Udupi, Karnataka, India
  - GitHub:     https://github.com/charan-kumar99
  - LinkedIn:   https://www.linkedin.com/in/charan-kumar99
  - Advanced Portfolio: https://advanced-portfolio-sandy.vercel.app/`
    };

    function appendTerminalLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        outputLog.appendChild(line);
        
        if (drawerBody) {
            drawerBody.scrollTop = drawerBody.scrollHeight;
        }
    }

    const commandHistory = [];
    let historyIndex = -1;

    // DSA Engine 1: Trie Data Structure for O(K) Command Autocomplete
    const commandTrie = new CommandTrie();
    const rawCommands = [
        'ck', 'ck help', 'ck skills', 'ck experience', 'ck projects', 'ck graph', 'ck tree', 'ck contact', 'ck clear', 'ck theme', 'ck neofetch'
    ];
    rawCommands.forEach(cmd => commandTrie.insert(cmd));

    actualInput.addEventListener('keydown', (e) => {
        
        if (e.key === 'Tab') {
            e.preventDefault();
            const inputVal = actualInput.value.trim().toLowerCase();
            if (!inputVal) return;
            // Trie Autocomplete Lookup O(K)
            const matches = commandTrie.autocomplete(inputVal);
            if (matches.length > 0) {
                actualInput.value = matches[0];
                dummyInput.textContent = matches[0];
            }
        }
        
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                actualInput.value = commandHistory[historyIndex];
                dummyInput.textContent = commandHistory[historyIndex];
            }
        }
        
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                actualInput.value = commandHistory[historyIndex];
                dummyInput.textContent = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                actualInput.value = '';
                dummyInput.textContent = '';
            }
        }
        
        else if (e.key === 'Enter') {
            const rawVal = actualInput.value;
            const command = rawVal.trim();
            const lowerCommand = command.toLowerCase();
            actualInput.value = '';
            dummyInput.textContent = '';

            appendTerminalLine(`guest@charankumar:~$ ${rawVal}`, 'input-echo');

            if (command === '') {
                return;
            }

            commandHistory.push(rawVal);
            historyIndex = commandHistory.length;

            let parsedCmd = command;
            let lowerCmd = lowerCommand;

            // Enforce 'ck' prefix (e.g. 'ck skills', 'ck help', or just 'ck')
            if (lowerCmd === 'ck') {
                appendTerminalLine("⚡ CK CLI [v1.0.0] — Charan's Custom Developer Shell", "system");
                appendTerminalLine("Usage: ck <command> (e.g., 'ck skills', 'ck help', 'ck graph C#', 'ck neofetch')", "system");
                appendTerminalLine("Type 'ck help' to see all available commands.", "system");
                appendTerminalLine('', 'spacer');
                return;
            }

            if (!lowerCmd.startsWith('ck ')) {
                const knownSubCmds = ['help', 'skills', 'experience', 'projects', 'graph', 'tree', 'contact', 'clear', 'theme', 'neofetch'];
                const firstWord = lowerCmd.split(/\s+/)[0];
                
                if (knownSubCmds.includes(firstWord)) {
                    appendTerminalLine(`[CK Shell] Command requires 'ck' prefix. Try: 'ck ${command}'`, "system");
                } else {
                    // DSA Levenshtein Typo Matcher
                    const typoMatch = findClosestCandidate(firstWord, knownSubCmds, 3);
                    if (typoMatch) {
                        appendTerminalLine(`Command not found: '${command}'. Did you mean 'ck ${typoMatch}'?`, "system");
                    } else {
                        appendTerminalLine(`Command not found: '${command}'. Type 'ck help' for available commands.`, "system");
                    }
                }
                appendTerminalLine('', 'spacer');
                return;
            }

            // Strip 'ck ' prefix
            parsedCmd = command.substring(3).trim();
            lowerCmd = parsedCmd.toLowerCase();

            if (lowerCmd === 'clear') {
                outputLog.innerHTML = '';
                appendTerminalLine("Welcome to Charan's Interactive CLI! [v1.0.0]", "system");
                appendTerminalLine("Type 'ck help' to see all available commands. Press ` (backtick) or click the nav button to toggle.", "system");
                const spacer = document.createElement('div');
                spacer.className = 'terminal-line spacer';
                outputLog.appendChild(spacer);
                return;
            }

            // DSA Engine 4: Skill Graph BFS Traversal Command
            if (lowerCmd.startsWith('graph') || lowerCmd.startsWith('tree')) {
                const parts = parsedCmd.split(/\s+/);
                const startSkill = parts[1] || 'C#';
                const path = portfolioSkillGraph.bfs(startSkill);
                if (path.length > 0) {
                    appendTerminalLine(`⚡ Skill Graph BFS Traversal from '${startSkill}':`, 'system');
                    appendTerminalLine(path.join(' ➔ '), 'success');
                } else {
                    appendTerminalLine(`No graph node found for '${startSkill}'. Available starting nodes: C#, PostgreSQL, JavaScript, Python, Agile`, 'error');
                }
                appendTerminalLine('', 'spacer');
                return;
            }

            if (lowerCmd.startsWith('theme')) {
                const parts = parsedCmd.split(/\s+/);
                if (parts.length < 2) {
                    appendTerminalLine("Usage: ck theme [name]");
                    appendTerminalLine("Available themes: dark (Neo-Cyan), cyberpunk, emerald, light (Light Pro)");
                } else {
                    const themeName = parts[1].toLowerCase();
                    if (['dark', 'cyberpunk', 'emerald', 'light'].includes(themeName)) {
                        if (typeof applyPalette === 'function') {
                            applyPalette(themeName);
                            appendTerminalLine(`Successfully switched theme to '${themeName}'!`, 'success');
                        } else {
                            appendTerminalLine("Error: Theme changer not available.", 'error');
                        }
                    } else {
                        appendTerminalLine(`Unknown theme: '${themeName}'. Available: dark, cyberpunk, emerald, light`, 'error');
                    }
                }
                appendTerminalLine('', 'spacer');
                return;
            }

            if (lowerCmd === 'neofetch') {
                const uptimeSeconds = Math.floor(performance.now() / 1000);
                const mins = Math.floor(uptimeSeconds / 60);
                const secs = uptimeSeconds % 60;
                const uptimeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                const neofetchText = `         .----.         charan@portfolio
       .'      '.       ----------------
      /          \\      OS: Portfolio Web CLI v1.0.0 (CK Shell)
     |   .----.   |     Host: charan-kumar99.github.io
    |   /      \\   |    Kernel: Vanilla JS / HTML5 / CSS3
    |  |   .NET |  |    Uptime: ${uptimeStr}
    |   \\      /   |    Shell: CK Custom JS CLI (ck <cmd>)
     |   '----'   |     Education: MCA Student @ MIT Jaipur
      \\          /      Role: Software Developer | .NET & Full-Stack Developer
       '.      .'       Backend: C# / ASP.NET Core / EF Core
         '----'         Databases: SQL Server / PostgreSQL
                        DevOps: Azure DevOps / Docker / CI-CD`;
                
                appendTerminalLine(neofetchText);
                appendTerminalLine('', 'spacer');
                return;
            }

            const response = commandResponses[lowerCmd];
            if (response) {
                appendTerminalLine(response);
            } else {
                const knownSubCmds = ['help', 'skills', 'experience', 'projects', 'graph', 'tree', 'contact', 'clear', 'theme', 'neofetch'];
                const closest = findClosestCandidate(lowerCmd, knownSubCmds, 3);
                if (closest) {
                    appendTerminalLine(`Command not found: '${command}'. Did you mean 'ck ${closest}'?`, 'system');
                } else {
                    appendTerminalLine(`Command not found: '${command}'. Type 'ck help' for available commands.`, 'system');
                }
            }

            appendTerminalLine('', 'spacer');
        }
    });
})();

(function() {
    if (typeof loadChatHistory === 'function') {
        loadChatHistory();
    }
})();

(function() {
    
    const SYNONYMS = {
        "postgres": ["postgresql", "postgres", "pg", "postgre sql"],
        "postgresql": ["postgresql", "postgres", "pg", "postgre sql"],
        "dotnet": ["dotnet", ".net", "asp.net", "c#", "csharp"],
        "c#": ["c#", "csharp", "dotnet", ".net"],
        "csharp": ["c#", "csharp", "dotnet", ".net"],
        "asp.net": ["asp.net", "asp.net core", "dotnet", ".net"],
        "sql server": ["sql server", "mssql", "microsoft sql server", "sqlserver"],
        "mssql": ["sql server", "mssql", "microsoft sql server", "sqlserver"],
        "react": ["react", "react.js", "reactjs"],
        "reactjs": ["react", "react.js", "reactjs"],
        "react.js": ["react", "react.js", "reactjs"],
        "next.js": ["next.js", "nextjs", "next"],
        "nextjs": ["next.js", "nextjs", "next"],
        "three.js": ["three.js", "threejs", "r3f", "react three fiber", "webgl"],
        "threejs": ["three.js", "threejs", "r3f", "react three fiber", "webgl"],
        "javascript": ["javascript", "js", "es6", "ecmascript"],
        "js": ["javascript", "js", "es6"],
        "typescript": ["typescript", "ts"],
        "ts": ["typescript", "ts"],
        "jira": ["jira", "atlassian", "agile", "scrum", "issue tracking", "ticket management", "sprint"],
        "azure devops": ["azure devops", "azure", "devops", "ci/cd", "ci-cd"],
        "ci/cd": ["ci/cd", "ci-cd", "pipelines", "pipeline", "github actions", "devops"],
        "pipelines": ["ci/cd", "ci-cd", "pipelines", "pipeline", "github actions", "devops"],
        "docker": ["docker", "containerization", "containers", "containerized"],
        "containers": ["docker", "containerization", "containers", "containerized"],
        "rest api": ["rest api", "restful", "apis", "api", "web api", "webapis", "endpoints"],
        "apis": ["rest api", "restful", "apis", "api", "web api", "webapis"],
        "api": ["rest api", "restful", "apis", "api", "web api", "webapis"],
        "microservices": ["microservices", "microservice", "distributed systems"],
        "clean architecture": ["clean architecture", "onion architecture", "hexagonal architecture", "ddd"],
        "ef core": ["ef core", "entity framework", "entity framework core", "orm"],
        "entity framework": ["ef core", "entity framework", "entity framework core", "orm"]
    };

    let resumeData = null;
    async function loadResumeData() {
        if (resumeData) return resumeData;
        try {
            const response = await fetch('./resume-data.json');
            if (!response.ok) throw new Error('Failed to load resume data.');
            resumeData = await response.json();
            return resumeData;
        } catch (error) {
            console.error('Error loading resume data:', error);
            alert('Could not load resume data. Please try again.');
            return null;
        }
    }

    function matchTag(text, tag) {
        const term = tag.toLowerCase();
        
        if (term === "c#" || term === "csharp") {
            return text.includes("c#") || text.includes("csharp");
        }
        if (term === ".net" || term === "dotnet") {
            return text.includes(".net") || text.includes("dotnet");
        }
        
        const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#\\.\\-+])` + escaped + `(?:$|[^a-zA-Z0-9_#\\.\\-+])`, 'i');
        return regex.test(text);
    }

    function extractKeywords(jdText) {
        const jdLower = jdText.toLowerCase();
        const foundKeywords = new Set();
        
        const allTags = [
            "asp.net core", ".net", "backend", "api", "property management", "automation", "workflow", "c#", 
            "clean architecture", "design patterns", "docker", "containerization", "deployment", "devops", 
            "swagger", "openapi", "api documentation", "testing", "sql server", "ef core", "redis", "caching", 
            "azure", "multi-tenant", "database", "banking", "rtgs", "neft", "microservices", "payment processing", 
            "service-to-service", "api gateway", "scalability", "cts", "aml", "user management", "blazor", 
            "razor pages", "fullstack", "web applications", "postgresql", "mysql", "oracle database", 
            "query optimization", "rest api", "crud", 
            "ci/cd", "azure devops", "git", "version control", "enterprise application", "financial", 
            "feature development", "bug fixing", "collaboration", "best practices", "security", "react", 
            "sqlite", "metrics", "gemini api", "ai", "google gemini", "d3.js", "recharts", "visualization", 
            "performance", "python", "flask", "chart.js", "finance", "sqlalchemy", "csv", "sql injection", 
            "javascript", "cricket", "analytics", "localstorage", "natural language", "academic", "final project", 
            "speech recognition", "voice assistant", "tts", "web interface", "flutter", "dart", "mobile app", 
            "dashboard", "glassmorphism", "firebase", "firestore", "sharedpreferences", "local notifications", 
            "push alerts", "scheduling", "next.js", "three.js", "ai assistant", "framer motion", "tailwind css", 
            "gsap", "webgl", "react three fiber", "groq api", "ai chat", "wakatime api", "sftp", "ftp", "iis", 
            "razorpay", "payment gateway", "integration", "c", "java", "html5", "css3", "bootstrap 5"
        ];
        
        for (const tag of allTags) {
            if (matchTag(jdLower, tag)) {
                foundKeywords.add(tag);
                const syns = SYNONYMS[tag];
                if (syns) syns.forEach(s => foundKeywords.add(s));
            }
        }
        
        for (const key in SYNONYMS) {
            if (matchTag(jdLower, key)) {
                SYNONYMS[key].forEach(s => foundKeywords.add(s));
            }
        }
        
        return foundKeywords;
    }

    function guessRoleTitle(jdText) {
        const lines = jdText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const patterns = [
            /\b(\.?net\s+(?:core\s+)?developer)\b/i,
            /\b(full\s*stack\s+developer)\b/i,
            /\b(backend\s+developer)\b/i,
            /\b(frontend\s+developer)\b/i,
            /\b(software\s+engineer)\b/i,
            /\b(software\s+developer)\b/i,
            /\b(web\s+developer)\b/i,
            /\b(\.?net\s+engineer)\b/i,
            /\b(c#\s+developer)\b/i
        ];
        
        for (const line of lines) {
            if (/^(?:job\s+)?(?:title|role|position|job)\s*:\s*(.+)$/i.test(line)) {
                const match = line.match(/^(?:job\s+)?(?:title|role|position|job)\s*:\s*(.+)$/i);
                if (match && match[1].trim().length > 3) {
                    return cleanTitle(match[1].trim());
                }
            }
        }
        
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            for (const pattern of patterns) {
                const match = lines[i].match(pattern);
                if (match) return cleanTitle(match[1]);
            }
        }
        
        for (const pattern of patterns) {
            const match = jdText.match(pattern);
            if (match) return cleanTitle(match[1]);
        }
        
        return ".NET Developer";
    }

    function cleanTitle(title) {
        return title
            .split(/[-|–(]/)[0]
            .trim()
            .replace(/\b(hiring|immediate|vacancy|opening)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function isSkillMatched(skill, foundKeywords) {
        const lower = skill.toLowerCase();
        if (foundKeywords.has(lower)) return true;
        const syns = SYNONYMS[lower];
        if (syns && syns.some(s => foundKeywords.has(s))) return true;
        return false;
    }

    function filterAndReorderSkills(skillsList, foundKeywords, jdText = '', maxCount = 5) {
        const jdLower = (jdText || '').toLowerCase();
        
        const matched = skillsList.filter(s => isSkillMatched(s, foundKeywords));
        const nonMatched = skillsList.filter(s => !isSkillMatched(s, foundKeywords));
        
        matched.sort((a, b) => {
            const posA = jdLower.indexOf(a.toLowerCase());
            const posB = jdLower.indexOf(b.toLowerCase());
            if (posA !== -1 && posB !== -1) return posA - posB;
            if (posA !== -1) return -1;
            if (posB !== -1) return 1;
            return 0;
        });
        
        const combined = [...matched, ...nonMatched];
        return combined.slice(0, maxCount);
    }

    function matchResumeData(data, foundKeywords, jdText) {
        const result = JSON.parse(JSON.stringify(data)); 

        if (result.skills) {
            result.skills.languages = filterAndReorderSkills(result.skills.languages || [], foundKeywords, jdText, 5);
            result.skills.frameworks = filterAndReorderSkills(result.skills.frameworks || [], foundKeywords, jdText, 5);
            result.skills.databases = filterAndReorderSkills(result.skills.databases || [], foundKeywords, jdText, 4);
            result.skills.tools = filterAndReorderSkills(result.skills.tools || [], foundKeywords, jdText, 5);
            result.skills.architecture = filterAndReorderSkills(result.skills.architecture || ["Microservices Architecture", "Clean Architecture", "REST APIs", "System Design"], foundKeywords, jdText, 4);
        }

        result.experience = result.experience.map(job => {
            
            const scoredBullets = job.bullets.map((b, index) => {
                let score = 0;
                b.tags.forEach(t => {
                    if (foundKeywords.has(t.toLowerCase())) {
                        score += 2;
                    }
                });
                return { bullet: b, score, originalIndex: index };
            });

            scoredBullets.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.originalIndex - b.originalIndex;
            });

            const limit = 3;
            const selectedScored = scoredBullets.slice(0, limit);

            selectedScored.sort((a, b) => a.originalIndex - b.originalIndex);

            return {
                ...job,
                bullets: selectedScored.map(sb => sb.bullet)
            };
        });

        const scoredProjects = result.projects.map((proj, index) => {
            let score = 0;
            proj.techStack.forEach(t => {
                if (isSkillMatched(t, foundKeywords)) score += 3;
            });
            proj.bullets.forEach(b => {
                b.tags.forEach(t => {
                    if (foundKeywords.has(t.toLowerCase())) score += 2;
                });
            });
            return { project: proj, score, originalIndex: index };
        });

        scoredProjects.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.originalIndex - b.originalIndex;
        });

        const selectedScoredProjects = scoredProjects.slice(0, 3);
        selectedScoredProjects.sort((a, b) => a.originalIndex - b.originalIndex);
        result.projects = selectedScoredProjects.map(sp => sp.project);

        const deduplicatedKeywords = [];
        const seenSynonymGroups = new Set();
        for (const kw of foundKeywords) {
            const groupKey = SYNONYMS[kw] ? SYNONYMS[kw].sort().join('|') : kw;
            if (!seenSynonymGroups.has(groupKey)) {
                seenSynonymGroups.add(groupKey);
                deduplicatedKeywords.push(kw);
            }
        }
        const topKeywordsArr = deduplicatedKeywords.slice(0, 5);

        result._topKeywords = topKeywordsArr;
        result._jdText = jdText;

        return result;
    }

    function escapeLatex(str) {
        if (!str) return '';
        return String(str)
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/&/g, '\\&')
            .replace(/%/g, '\\%')
            .replace(/\$/g, '\\$')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');
    }

    function buildLatexCode(data, docType = 'resume') {
        const isCV = docType === 'cv';
        const summary = escapeLatex(data?.tailoredSummary || "Software Developer & .NET / Full-Stack Engineer with hands-on experience building enterprise-grade web applications, REST APIs, and microservices using C#, ASP.NET Core, React, and database systems across PostgreSQL, SQL Server, and Redis. Proven track record in clean architecture and automated CI/CD deployments. Currently pursuing MCA while working full-time.");

        const defaultHighlights = [
            "1+ year experience in enterprise banking systems (RTGS/NEFT, CTS, AML)",
            "Built microservices-based applications serving multiple banks",
            "Developed AI-powered GitHub analyzer (DevLens) with 40+ metrics",
            "Strong full-stack expertise in ASP.NET Core, React, and SQL"
        ];
        const highlights = data?.tailoredHighlights || defaultHighlights;
        const highlightsTex = highlights.map(h => `    \\item ${escapeLatex(h)}`).join('\n');

        const expTex = (data?.experience || []).map(job => `
\\vspace{2pt}
\\noindent
\\textbf{${escapeLatex(job.role)}} \\hfill \\textbf{${escapeLatex(job.dates || '')}} \\\\
\\textit{${escapeLatex(job.company)}}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{0pt}
    \\setlength{\\parskip}{0pt}
${(isCV ? (job.bullets || []) : (job.bullets || []).slice(0, 3)).map(b => `    \\item ${escapeLatex(b.text)}`).join('\n')}
\\end{itemize}`).join('\n');

        const lang = (data?.skills?.languages || ["C#", "JavaScript", "Java", "C", "Python"]).map(escapeLatex).join(", ");
        const fw = (data?.skills?.frameworks || ["ASP.NET Core", "Blazor", "React", "Flutter", "Razor Pages"]).map(escapeLatex).join(", ");
        const db = (data?.skills?.databases || ["PostgreSQL", "SQL Server", "MySQL", "Redis"]).map(escapeLatex).join(", ");
        const tools = (data?.skills?.tools || ["Jira", "Azure DevOps", "Docker", "GitHub", "CI/CD Pipelines", "Firebase"]).map(escapeLatex).join(", ");
        const arch = (data?.skills?.architecture || ["Clean Architecture", "Microservices Architecture", "REST APIs", "System Design"]).map(escapeLatex).join(", ");

        const projTex = (isCV ? (data?.projects || []) : (data?.projects || []).slice(0, 3)).map(proj => `
\\vspace{2pt}
\\noindent
\\textbf{${escapeLatex(proj.name)}} \\\\
\\textbf{Tech:} ${proj.techStack ? proj.techStack.map(escapeLatex).join(", ") : ""}
\\vspace{-4pt}
\\begin{itemize}
    \\setlength{\\itemsep}{0pt}
    \\setlength{\\parskip}{0pt}
${(isCV ? (proj.bullets || []) : (proj.bullets || []).slice(0, 3)).map(b => `    \\item ${escapeLatex(b.text)}`).join('\n')}
\\end{itemize}
${proj.links?.github ? `\\vspace{-2pt}\n\\small \\textbf{GitHub:} \\url{${proj.links.github}}` : ''}`).join('\n');

        return `\\documentclass[10pt,letterpaper]{article}
\\usepackage[top=0.5in,bottom=0.5in,left=0.5in,right=0.5in]{geometry}
\\usepackage{ebgaramond}
\\usepackage[dvipsnames,svgnames,x11names]{xcolor}
\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{parskip}

\\hypersetup{
    colorlinks=true,
    urlcolor=black,
    pdfauthor={Charan Kumar},
    pdftitle={Charan Kumar - Resume}
}

\\setlength{\\parindent}{0pt}
\\pagestyle{empty}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{4pt}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{CHARAN KUMAR}}\\\\[4pt]
    {\\large \\textit{Software Developer}}\\\\[6pt]
    \\small
    \\href{mailto:charansuvarna99@gmail.com}{charansuvarna99@gmail.com} \\quad $|$ \\quad
    \\href{tel:+919380455922}{+91 9380455922} \\quad $|$ \\quad
    \\href{https://maps.google.com/?q=Udupi,+Karnataka,+India}{Udupi, Karnataka, India}\\\\[3pt]
    \\href{https://www.linkedin.com/in/charan-kumar99}{LinkedIn} \\quad $|$ \\quad
    \\href{https://github.com/charan-kumar99}{GitHub} \\quad $|$ \\quad
    \\href{https://charan-kumar99.github.io}{Portfolio}
\\end{center}

\\vspace{-4pt}

\\section{PROFESSIONAL SUMMARY}
${summary}

\\section{TECHNICAL SKILLS}
\\vspace{2pt}
\\noindent \\textbf{Languages:} ${lang} \\\\
\\textbf{Frameworks:} ${fw} \\\\
\\textbf{Databases:} ${db} \\\\
\\textbf{Tools:} ${tools} \\\\
\\textbf{Architecture \\& Concepts:} ${arch}

\\section{PROFESSIONAL EXPERIENCE}
${expTex}

\\section{PROJECTS}
${projTex}

\\section{EDUCATION}
\\vspace{2pt}
\\noindent
\\textbf{Master of Computer Applications (MCA)} \\hfill \\textbf{Nov 2025 -- Present} \\\\
MIT, Jaipur (Online) | Currently pursuing MCA while working full-time.

\\vspace{4pt}
\\noindent
\\textbf{Bachelor of Computer Applications (BCA)} \\hfill \\textbf{Sep 2022 -- Jun 2025} \\\\
Udupi College of Professional Studies, Mangalore University | CGPA: 6.17 |\\\\[2pt]
\\textbf{Add-on Courses:}~Cybersecurity, Artificial Intelligence \\& Big Data Analytics.

\\section{CERTIFICATIONS}
\\vspace{-2pt}
\\begin{itemize}
    \\setlength{\\itemsep}{0pt}
    \\setlength{\\parskip}{0pt}
    \\item Data Analytics \\& Web Dev Internship -- Accolade Tech Solutions (2024)
    \\item Cybersecurity \\& AI Training -- Mangalore University (2024)
    \\item NCC 'A' Certificate | Best Cadet Award -- National Cadet Corps (NCC)
    \\item District-level player in Cricket and Volleyball
\\end{itemize}

\\end{document}`;
    }

    function generatePdfResume(data, filenameRole, docType = 'resume') {
        const isCV = docType === 'cv';
        
        const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
        
        const marginX = 54; 
        const marginTop = 54; 
        let currentY = marginTop + 14; 
        const pageWidth = 612;
        const pageHeight = 792;
        const printableWidth = 504; 

        function checkPageSpace(heightNeeded) {
            if (currentY + heightNeeded > pageHeight - marginTop) {
                doc.addPage();
                currentY = marginTop + 14;
            }
        }

        function drawClickableLink(text, url, x, y, options = {}) {
            doc.text(text, x, y, options);
            const textWidth = doc.getTextWidth(text);
            let startX = x;
            if (options.align === 'center') {
                startX = x - textWidth / 2;
            } else if (options.align === 'right') {
                startX = x - textWidth;
            }
            const fontSize = doc.getFontSize();
            doc.link(startX, y - fontSize + 2, textWidth, fontSize + 2, { url: url });
            return textWidth;
        }

        doc.setFont('times', 'bold');
        doc.setFontSize(21);
        doc.setTextColor(0, 0, 0);
        doc.text("CHARAN KUMAR", pageWidth / 2, currentY, { align: 'center' });
        currentY += 22;

        doc.setFont('times', 'italic');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text("Software Developer", pageWidth / 2, currentY, { align: 'center' });
        currentY += 20;

        function drawEnvelope(x, y) {
            
            doc.setDrawColor(0, 0, 0);
            doc.setFillColor(0, 0, 0);
            doc.setLineWidth(0.6);
            doc.rect(x, y - 6.5, 9, 6.5, 'FD');
            doc.setFillColor(255, 255, 255);
            doc.triangle(x + 0.5, y - 6, x + 8.5, y - 6, x + 4.5, y - 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.line(x, y - 6.5, x + 4.5, y - 3);
            doc.line(x + 4.5, y - 3, x + 9, y - 6.5);
        }

        function drawPhone(x, y) {
            
            doc.setFillColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(1.2);
            doc.line(x + 1, y - 6.5, x + 3.5, y - 6.5);
            doc.line(x + 3.5, y - 6.5, x + 3.5, y - 4);
            doc.line(x + 3.5, y - 4, x + 5.5, y - 2);
            doc.line(x + 5.5, y - 2, x + 7.5, y - 2);
            doc.line(x + 7.5, y - 2, x + 7.5, y - 0.5);
            doc.circle(x + 2, y - 6.5, 1, 'F');
            doc.circle(x + 7.5, y - 1, 1, 'F');
        }

        function drawPin(x, y) {
            
            doc.setFillColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
            doc.circle(x + 3.5, y - 4.5, 2.5, 'F');
            doc.triangle(x + 1, y - 4, x + 6, y - 4, x + 3.5, y, 'F');
            doc.setFillColor(255, 255, 255);
            doc.circle(x + 3.5, y - 4.5, 0.8, 'F');
        }

        function drawLinkedInBox(x, y) {
            
            doc.setFillColor(0, 0, 0);
            doc.roundedRect(x, y - 7, 7.5, 7.5, 1, 1, 'F');
            doc.setFont('times', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text("in", x + 1.1, y - 1.2);
            doc.setTextColor(0, 0, 0);
            doc.setFont('times', 'normal');
            doc.setFontSize(9.5);
        }

        function drawGitIcon(x, y) {
            
            doc.setFillColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
            doc.circle(x + 4, y - 3.8, 3.2, 'F');
            doc.triangle(x + 1.2, y - 5.5, x + 3, y - 6.8, x + 3.4, y - 5, 'F');
            doc.triangle(x + 4.6, y - 5, x + 5, y - 6.8, x + 6.8, y - 5.5, 'F');
            doc.setFillColor(255, 255, 255);
            doc.ellipse(x + 4, y - 2.8, 1.6, 1.2, 'F');
        }

        function drawLinkChain(x, y) {
            
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.85);
            doc.ellipse(x + 2.5, y - 3.5, 2.2, 1.25, 'S');
            doc.ellipse(x + 5.5, y - 3.5, 2.2, 1.25, 'S');
        }

        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const emailStr = "charansuvarna99@gmail.com";
        const phoneStr = "+91 9380455922";
        const locStr = "Udupi, Karnataka, India";
        const pipeSep = "  |  ";

        const wEmail = doc.getTextWidth(emailStr);
        const wPhone = doc.getTextWidth(phoneStr);
        const wLoc = doc.getTextWidth(locStr);
        const wPipe = doc.getTextWidth(pipeSep);

        const totalRow1W = wEmail + wPipe + wPhone + wPipe + wLoc;
        let startX1 = (pageWidth - totalRow1W) / 2;

        drawClickableLink(emailStr, "mailto:charansuvarna99@gmail.com", startX1, currentY);
        startX1 += wEmail;
        doc.text(pipeSep, startX1, currentY);
        startX1 += wPipe;

        drawClickableLink(phoneStr, "tel:+919380455922", startX1, currentY);
        startX1 += wPhone;
        doc.text(pipeSep, startX1, currentY);
        startX1 += wPipe;

        drawClickableLink(locStr, "https://maps.google.com/?q=Udupi,+Karnataka,+India", startX1, currentY);
        currentY += 17;

        const liStr = "LinkedIn";
        const ghStr = "GitHub";
        const portStr = "Portfolio";

        const wLi = doc.getTextWidth(liStr);
        const wGh = doc.getTextWidth(ghStr);
        const wPort = doc.getTextWidth(portStr);

        const totalRow2W = wLi + wPipe + wGh + wPipe + wPort;
        let startX2 = (pageWidth - totalRow2W) / 2;

        drawClickableLink(liStr, "https://www.linkedin.com/in/charan-kumar99", startX2, currentY);
        startX2 += wLi;
        doc.text(pipeSep, startX2, currentY);
        startX2 += wPipe;

        drawClickableLink(ghStr, "https://github.com/charan-kumar99", startX2, currentY);
        startX2 += wGh;
        doc.text(pipeSep, startX2, currentY);
        startX2 += wPipe;

        drawClickableLink(portStr, "https://charan-kumar99.github.io", startX2, currentY);
        currentY += 24;

        drawSectionHeader("PROFESSIONAL SUMMARY");

        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(20, 20, 20);
        
        const summaryText = data.tailoredSummary || ".NET Developer with hands-on experience building enterprise-grade banking applications (RTGS/NEFT, CTS, AML) using ASP.NET Core and Microservices Architecture. Skilled in full-stack development, REST APIs, and database management across PostgreSQL, MySQL, Oracle, and SQL Server. Proven ability to deliver scalable, secure systems while managing end-to-end development and deployments via Azure DevOps. Currently pursuing MCA while working full-time.";
        const wrappedSummary = doc.splitTextToSize(summaryText, printableWidth);
        wrappedSummary.forEach(line => {
            checkPageSpace(13);
            doc.text(line, marginX, currentY);
            currentY += 13;
        });
        currentY += 8;

        drawSectionHeader("TECHNICAL SKILLS");

        const skillsFormat = [
            { label: "Languages:", list: data.skills && data.skills.languages ? (isCV ? data.skills.languages.join(", ") : data.skills.languages.slice(0, 5).join(", ")) : "C#, JavaScript, Java, C, Python" },
            { label: "Frameworks:", list: data.skills && data.skills.frameworks ? (isCV ? data.skills.frameworks.join(", ") : data.skills.frameworks.slice(0, 5).join(", ")) : "ASP.NET Core, Blazor, React, Flutter, Razor Pages" },
            { label: "Databases:", list: data.skills && data.skills.databases ? (isCV ? data.skills.databases.join(", ") : data.skills.databases.slice(0, 4).join(", ")) : "PostgreSQL, SQL Server, MySQL, Redis" },
            { label: "Tools:", list: data.skills && data.skills.tools ? (isCV ? data.skills.tools.join(", ") : data.skills.tools.slice(0, 5).join(", ")) : "Jira, Azure DevOps, Docker, GitHub, CI/CD Pipelines" },
            { label: "Architecture & Concepts:", list: data.skills && data.skills.architecture ? (isCV ? data.skills.architecture.join(", ") : data.skills.architecture.slice(0, 4).join(", ")) : "Clean Architecture, Microservices Architecture, REST APIs, System Design" }
        ];

        skillsFormat.forEach(skillLine => {
            checkPageSpace(14);
            doc.setFont('times', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const labelText = skillLine.label + " ";
            doc.text(labelText, marginX, currentY);
            
            const labelW = doc.getTextWidth(labelText);
            doc.setFont('times', 'normal');
            doc.setTextColor(30, 30, 30);
            doc.text(skillLine.list, marginX + labelW, currentY);
            currentY += 14;
        });
        currentY += 6;

        drawSectionHeader("PROFESSIONAL EXPERIENCE");

        data.experience.forEach(job => {
            checkPageSpace(28);
            doc.setFont('times', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(0, 0, 0);
            doc.text(job.role, marginX, currentY);
            
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            const dateStr = job.dates || "";
            const rightWidth = doc.getTextWidth(dateStr);
            doc.text(dateStr, pageWidth - marginX - rightWidth, currentY);
            currentY += 14;

            doc.setFont('times', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(job.company, marginX, currentY);
            currentY += 14;

            (isCV ? job.bullets : job.bullets.slice(0, 3)).forEach(bullet => {
                drawBulletPoint(bullet.text);
            });
            currentY += 8;
        });

        drawSectionHeader("PROJECTS");

        (isCV ? data.projects : data.projects.slice(0, 3)).forEach(project => {
            checkPageSpace(26);
            doc.setFont('times', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(0, 0, 0);
            doc.text(project.name, marginX, currentY);
            currentY += 14;
            
            doc.setFont('times', 'bold');
            doc.setFontSize(10);
            const techLabel = "Tech: ";
            doc.text(techLabel, marginX, currentY);
            const techLabelW = doc.getTextWidth(techLabel);
            
            doc.setFont('times', 'normal');
            doc.setTextColor(40, 40, 40);
            const techText = project.techStack.join(", ");
            const techWrapped = doc.splitTextToSize(techText, printableWidth - techLabelW);
            techWrapped.forEach((line, idx) => {
                doc.text(line, marginX + (idx === 0 ? techLabelW : 0), currentY);
                if (idx < techWrapped.length - 1) currentY += 13;
            });
            currentY += 14;

            (isCV ? project.bullets : project.bullets.slice(0, 3)).forEach(bullet => {
                drawBulletPoint(bullet.text);
            });

            if (project.links && project.links.github) {
                checkPageSpace(12);
                doc.setFont('times', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                
                const ghLabel = "GitHub: ";
                doc.text(ghLabel, marginX, currentY);
                
                const labelW = doc.getTextWidth(ghLabel);
                doc.setFont('times', 'normal');
                doc.setTextColor(30, 30, 30);
                drawClickableLink(project.links.github, project.links.github, marginX + labelW, currentY);
                currentY += 14;
            }
            currentY += 8;
        });

        drawSectionHeader("EDUCATION");

        checkPageSpace(24);
        doc.setFont('times', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(0, 0, 0);
        doc.text("Master of Computer Applications (MCA)", marginX, currentY);
        
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const mcaDate = "Nov 2025 – Present";
        doc.text(mcaDate, pageWidth - marginX - doc.getTextWidth(mcaDate), currentY);
        currentY += 14;

        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text("MIT, Jaipur (Online) | Currently pursuing MCA while working full-time.", marginX, currentY);
        currentY += 18;

        checkPageSpace(32);
        doc.setFont('times', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(0, 0, 0);
        doc.text("Bachelor of Computer Applications (BCA)", marginX, currentY);
        
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const bcaDate = "Sep 2022 – Jun 2025";
        doc.text(bcaDate, pageWidth - marginX - doc.getTextWidth(bcaDate), currentY);
        currentY += 14;

        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text("Udupi College of Professional Studies, Mangalore University | CGPA: 6.17 |", marginX, currentY);
        currentY += 14;

        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const labelAddon = "Add-on Courses: ";
        const addonW = doc.getTextWidth(labelAddon);
        doc.text(labelAddon, marginX, currentY);

        doc.setFont('times', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text("Cybersecurity, Artificial Intelligence & Big Data Analytics.", marginX + addonW, currentY);
        currentY += 14;

        if (isCV) {
            
            checkPageSpace(24);
            doc.setFont('times', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(0, 0, 0);
            doc.text("Pre-University (12th)", marginX, currentY);
            
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            const puDate = "Jul 2020 – Apr 2022";
            doc.text(puDate, pageWidth - marginX - doc.getTextWidth(puDate), currentY);
            currentY += 14;

            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(30, 30, 30);
            doc.text("St Cecily's Composite PU College, Udupi | Percentage: 67.71%", marginX, currentY);
            currentY += 18;

            checkPageSpace(24);
            doc.setFont('times', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(0, 0, 0);
            doc.text("10th Standard (SSLC)", marginX, currentY);
            
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            const sslcDate = "Apr 2019 – Jun 2020";
            doc.text(sslcDate, pageWidth - marginX - doc.getTextWidth(sslcDate), currentY);
            currentY += 14;

            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(30, 30, 30);
            doc.text("Volakadu Government High School, Udupi | Percentage: 68%", marginX, currentY);
            currentY += 18;
        }

        drawSectionHeader("CERTIFICATIONS & TRAINING");
        drawBulletPoint("Fast-Track Internship – Data Analytics, Web Development & Python Projects | Accolade Tech Solutions (2024)");
        drawBulletPoint("Cybersecurity & AI Training – Mangalore University (2024)");
        drawBulletPoint("AI, Big Data Analytics & Cybersecurity Training – Mangalore University (2024)");
        drawBulletPoint("Skill Development & Entrepreneurship Program – Udupi Grameena Buntara Sangha (2024)");
        drawBulletPoint("NCC 'A' Certificate | National Cadet Corps (Ministry of Defence, India)");
        currentY += 4;

        if (isCV) {
            
            drawSectionHeader("ACTIVITIES & INTERESTS");
            drawBulletPoint("NCC Cadet Lead: Served as Head Cadet; recipient of Best Cadet Award; completed 10-day intensive training camp with Indian Navy & Army Officers.");
            drawBulletPoint("Cricket: Competitive player & team captain; led teams to victories in district-level tournaments.");
            drawBulletPoint("Volleyball: District-level player & college team captain; won inter-institution championships.");
            drawBulletPoint("Kabaddi & Chess: Participated in district-level kabaddi tournaments; regular chess player.");
            currentY += 4;
        }

        function drawSectionHeader(title) {
            checkPageSpace(28);
            currentY += 12;
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(title, marginX, currentY);
            
            currentY += 5;
            doc.setLineWidth(1.2);
            doc.setDrawColor(0, 0, 0);
            doc.line(marginX, currentY, pageWidth - marginX, currentY);
            currentY += 15;
        }

        function drawBulletPoint(text) {
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(20, 20, 20);
            
            const bulletSymbol = "•";
            const indent = 10;
            const wrappedLines = doc.splitTextToSize(text, printableWidth - indent);
            const lineHeight = 13;
            const heightNeeded = wrappedLines.length * lineHeight;
            
            checkPageSpace(heightNeeded);
            doc.text(bulletSymbol, marginX + 2, currentY);
            
            wrappedLines.forEach((line, index) => {
                doc.text(line, marginX + indent, currentY + (index * lineHeight));
            });
            
            currentY += heightNeeded + 3;
        }

        let sanitizedRole = filenameRole
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_');

        if (!sanitizedRole || sanitizedRole.length < 2) {
            sanitizedRole = "NET_Developer";
        }

        const filename = isCV ? "Charan_Kumar_CV.pdf" : "Charan_Kumar_Resume.pdf";

        try {
            doc.save(filename);
        } catch (e) {
            console.warn("jsPDF doc.save failed, falling back to Data URI download:", e);
            const dataUrl = doc.output('datauristring');
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                if (document.body.contains(a)) {
                    document.body.removeChild(a);
                }
            }, 1000);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const resumeModal = document.getElementById("resumeModal");
        const floatingBtn = document.getElementById("floatingResumeBtn");
        const navBtn = document.getElementById("navTailoredResumeBtn");
        const heroBtn = document.getElementById("heroTailoredResumeBtn");
        const closeBtn = document.getElementById("closeResumeModal");
        const cancelBtn = document.getElementById("cancelResumeBtn");
        const generateBtn = document.getElementById("generateResumeBtn");
        const jdInput = document.getElementById("jobDescriptionInput");
        const aiToggle = document.getElementById("aiEnhanceToggle");
        const loadingOverlay = document.getElementById("resumeLoadingOverlay");

        try {
            localStorage.removeItem("resume_cooldown_timestamp");
        } catch (e) {}

        const openModal = async (e) => {
            e.preventDefault();
            generateBtn.disabled = false;
            if (aiToggle) aiToggle.checked = true;
            
            resumeModal.classList.add("open");
            jdInput.focus();
            
            await loadResumeData();
        };

        if (floatingBtn) floatingBtn.addEventListener("click", openModal);
        if (navBtn) navBtn.addEventListener("click", openModal);
        if (heroBtn) heroBtn.addEventListener("click", openModal);

        const atsScoreCard = document.getElementById("atsScoreCard");
        const atsGaugeProgress = document.getElementById("atsGaugeProgress");
        const atsScorePercent = document.getElementById("atsScorePercent");
        let atsDebounceTimer = null;

        const CANONICAL_SKILLS_MAP = {
            // .NET & C#
            "c#": "ASP.NET Core / C#",
            "csharp": "ASP.NET Core / C#",
            ".net": "ASP.NET Core / C#",
            "dotnet": "ASP.NET Core / C#",
            "asp.net": "ASP.NET Core / C#",
            "asp.net core": "ASP.NET Core / C#",
            "blazor": "Blazor",
            "razor pages": "Razor Pages",

            // SQL & Databases
            "sql server": "SQL Server",
            "mssql": "SQL Server",
            "microsoft sql server": "SQL Server",
            "ms sql": "SQL Server",
            "t-sql": "SQL Server",
            "postgresql": "PostgreSQL",
            "postgres": "PostgreSQL",
            "psql": "PostgreSQL",
            "mysql": "MySQL",
            "oracle": "Oracle Database",
            "oracle database": "Oracle Database",
            "sqlite": "SQLite",
            "redis": "Redis Caching",
            "caching": "Redis Caching",

            // Architecture & Concepts
            "clean architecture": "Clean Architecture",
            "onion architecture": "Clean Architecture",
            "layered architecture": "Clean Architecture",
            "microservices": "Microservices",
            "microservices architecture": "Microservices",
            "rest api": "REST APIs",
            "rest apis": "REST APIs",
            "api": "REST APIs",
            "backend": "Backend APIs",
            "system design": "System Design",
            "design patterns": "Design Patterns",

            // Tools & Cloud
            "docker": "Docker",
            "containerization": "Docker",
            "azure": "Azure DevOps / Cloud",
            "azure devops": "Azure DevOps / CI/CD",
            "ci/cd": "Azure DevOps / CI/CD",
            "git": "Git / GitHub",
            "github": "Git / GitHub",
            "swagger": "Swagger / OpenAPI",
            "openapi": "Swagger / OpenAPI",
            "ef core": "EF Core",
            "entity framework": "EF Core",

            // Frontend & Fullstack
            "react": "React",
            "react.js": "React",
            "reactjs": "React",
            "javascript": "JavaScript",
            "flutter": "Flutter (Mobile)",
            "dart": "Flutter (Mobile)",
            "mobile app": "Flutter (Mobile)",
            "mobile app developer": "Flutter (Mobile)",
            "python": "Python / Flask",
            "flask": "Python / Flask",

            // Enterprise Domains
            "banking": "FinTech / Banking (RTGS/NEFT)",
            "rtgs": "FinTech / Banking (RTGS/NEFT)",
            "neft": "FinTech / Banking (RTGS/NEFT)",
            "payment processing": "Payment Systems",
            "property management": "Property Management",
            "gemini api": "Gemini AI API",
            "ai": "Multi-LLM AI"
        };

        function updateAtsMatchScore() {
            const jdText = jdInput.value.trim();
            const isCV = selectedDocType === 'cv';

            if (!atsScoreCard) return;

            if (isCV || !jdText || jdText.length < 8) {
                atsScoreCard.style.display = "none";
                return;
            }

            const keywords = extractKeywords(jdText);
            const canonicalMatched = new Set();

            keywords.forEach(kw => {
                const lower = kw.toLowerCase();
                if (CANONICAL_SKILLS_MAP[lower]) {
                    canonicalMatched.add(CANONICAL_SKILLS_MAP[lower]);
                }
            });

            // Also check all canonical keys against raw JD text directly
            const jdLower = jdText.toLowerCase();
            for (const key in CANONICAL_SKILLS_MAP) {
                if (jdLower.includes(key)) {
                    canonicalMatched.add(CANONICAL_SKILLS_MAP[key]);
                }
            }

            const matchedArray = Array.from(canonicalMatched);
            const matchedCount = matchedArray.length;

            let scorePct = 0;
            if (matchedCount === 0) {
                scorePct = Math.min(30, Math.max(15, Math.round(jdText.split(/\s+/).length * 1.5)));
            } else {
                scorePct = Math.min(100, Math.max(40, Math.round(40 + (matchedCount * 9))));
            }

            // Apply Dynamic Color Scheme based on Score Percentage
            atsScoreCard.classList.remove('score-green', 'score-cyan', 'score-yellow', 'score-orange', 'score-red');

            if (scorePct >= 85) {
                atsScoreCard.classList.add('score-green'); // Green for 85%+
            } else if (scorePct >= 70) {
                atsScoreCard.classList.add('score-cyan'); // Cyan for 70%-84%
            } else if (scorePct >= 55) {
                atsScoreCard.classList.add('score-yellow'); // Yellow for 55%-69%
            } else if (scorePct >= 40) {
                atsScoreCard.classList.add('score-orange'); // Orange for 40%-54%
            } else {
                atsScoreCard.classList.add('score-red'); // Red for <40%
            }

            atsScoreCard.style.display = "inline-flex";
            if (atsScorePercent) {
                atsScorePercent.textContent = `${scorePct}%`;
            }
            if (atsGaugeProgress) {
                atsGaugeProgress.setAttribute("stroke-dasharray", `${scorePct}, 100`);
            }
        }

        const closeModal = () => {
            resumeModal.classList.remove("open");
            jdInput.value = "";
            if (atsScoreCard) atsScoreCard.style.display = "none";
        };

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

        function showStep(stepNum) {
            const isCV = selectedDocType === 'cv';
            const stepTexts = isCV ? {
                1: "📋 Preparing Complete Curriculum Vitae...",
                2: "📊 Loading all 9 projects & full experience...",
                3: "🧠 Preparing CV content...",
                4: "📄 Rendering Full Detailed CV PDF...",
                5: "⬇️ Downloading Charan's CV..."
            } : {
                1: "🔍 Analyzing Job Description...",
                2: "🎯 Matching keywords & experiences...",
                3: "🧠 Rephrasing bullets with AI...",
                4: "📄 Rendering ATS-friendly PDF...",
                5: "⬇️ Downloading Resume..."
            };

            for (let i = 1; i <= 5; i++) {
                const el = document.getElementById(`loadingStep${i}`);
                if (el) {
                    el.style.display = i === stepNum ? "block" : "none";
                    if (i === stepNum && stepTexts[i]) {
                        el.textContent = stepTexts[i];
                    }
                }
            }
        }

        const pillResume = document.getElementById("pillResume");
        const pillCV = document.getElementById("pillCV");
        const jdInputGroup = document.getElementById("jdInputGroup");
        const aiToggleWrapper = document.getElementById("aiToggleWrapper");
        let selectedDocType = 'resume';

        function updateDocTypeUI(type) {
            selectedDocType = type;
            const isCV = type === 'cv';
            
            if (pillResume && pillCV) {
                if (isCV) {
                    pillCV.classList.add("active");
                    pillResume.classList.remove("active");
                    const cvRadio = pillCV.querySelector("input");
                    if (cvRadio) cvRadio.checked = true;
                    if (jdInputGroup) jdInputGroup.style.display = "none";
                    if (atsScoreCard) atsScoreCard.style.display = "none";
                } else {
                    pillResume.classList.add("active");
                    pillCV.classList.remove("active");
                    const resumeRadio = pillResume.querySelector("input");
                    if (resumeRadio) resumeRadio.checked = true;
                    if (jdInputGroup) jdInputGroup.style.display = "block";
                    updateAtsMatchScore();
                }
            }
            updateModalBtnLabel();
        }

        if (pillResume) pillResume.addEventListener("click", () => updateDocTypeUI('resume'));
        if (pillCV) pillCV.addEventListener("click", () => updateDocTypeUI('cv'));

        const askAiModalBtn = document.getElementById("askAiModalBtn");
        if (askAiModalBtn) {
            askAiModalBtn.addEventListener("click", () => {
                closeModal();
                if (typeof toggleChat === 'function') {
                    const chatWin = document.getElementById("chatWindow");
                    if (!chatWin || !chatWin.classList.contains("active")) {
                        toggleChat();
                    }
                }
                const chatInput = document.getElementById("chatInput");
                if (chatInput) {
                    chatInput.value = "What is the difference between Charan's Resume and CV?";
                    chatInput.focus();
                    if (typeof sendMessage === 'function') {
                        setTimeout(() => {
                            sendMessage();
                        }, 300);
                    }
                }
            });
        }

        function updateModalBtnLabel() {
            const btnSpan = generateBtn.querySelector("span");
            const isCV = selectedDocType === 'cv';
            const hasJDText = Boolean(jdInput.value.trim());

            if (aiToggleWrapper) {
                aiToggleWrapper.style.display = (!isCV && hasJDText) ? "flex" : "none";
            }

            if (!btnSpan) return;
            if (isCV) {
                btnSpan.textContent = "⚡ Download Full CV";
            } else if (hasJDText) {
                btnSpan.textContent = "⚡ Generate Tailored Resume";
            } else {
                btnSpan.textContent = "⚡ Download Primary Resume";
            }
        }
        jdInput.addEventListener("input", () => {
            clearTimeout(atsDebounceTimer);
            atsDebounceTimer = setTimeout(updateAtsMatchScore, 180);
            updateModalBtnLabel();
        });
        updateModalBtnLabel();

        generateBtn.addEventListener("click", async () => {
            const jdText = jdInput.value.trim();

            loadingOverlay.classList.add("active");
            showStep(1);

            try {
                
                await new Promise(r => setTimeout(r, 600));
                
                showStep(2);
                const keywords = jdText ? extractKeywords(jdText) : new Set();
                const roleTitle = jdText ? guessRoleTitle(jdText) : "Software Developer";
                const sourceData = await loadResumeData();
                
                if (!sourceData) {
                    throw new Error("Could not load source resume data.");
                }

                let finalData = matchResumeData(sourceData, keywords, jdText);

                if (selectedDocType === 'cv') {
                    finalData.projects = sourceData.projects;
                    finalData.skills = sourceData.skills;
                }

                if (!jdText) {
                    finalData.tailoredSummary = "Software Developer & .NET / Full-Stack Engineer with hands-on experience building enterprise-grade web applications, REST APIs, and microservices using C#, ASP.NET Core, React, and database systems across PostgreSQL, SQL Server, and Redis. Proven track record in clean architecture and automated CI/CD deployments. Currently pursuing MCA while working full-time.";
                }
                
                if (jdText && aiToggle.checked) {
                    showStep(3);

                    try {
                        const experienceSummary = finalData.experience.map(j => `${j.role} at ${j.company} (${j.dates})`).join('; ');
                        const skillsList = [
                            ...(finalData.skills?.languages || []),
                            ...(finalData.skills?.frameworks || []),
                            ...(finalData.skills?.databases || [])
                        ].join(', ');

                        const summaryPrompt = `You are an expert resume writer. Based on the job description and the candidate's actual background below, generate a professional summary and key highlights.

STRICT FACTUAL & IDENTITY RULES:
1. CANDIDATE ROLE TITLE: Always refer to the candidate as a "Software Developer" or "Full-Stack Developer".
2. ACCURATE PROJECT AUTHORSHIP: For the DevLens project, state that the candidate "designed and built DevLens from scratch as sole developer" or "created DevLens as sole author". NEVER write "contributed to DevLens"—the candidate created the entire application independently.
3. SKILLS & KNOWLEDGE: The candidate has learned skills in Flutter, Dart, React, C#, Java, Python, ASP.NET Core, REST APIs, and databases. Mention Flutter or Dart naturally if the JD asks for them, but do NOT invent fake past work roles (e.g. do not call past employment "Flutter Developer").
4. Summary format: Write exactly 3-4 concise lines (around 40-50 words total). Use standard professional resume style starting naturally (e.g., "Software Developer with experience..."). Do NOT exceed 4 lines. Keep it tight and impactful. Avoid repeating "The Software Developer" or "The candidate" unnaturally.
5. Return ONLY valid JSON in this exact structure:
{"summary": "..."}

Job Description:
"""
${jdText.substring(0, 1500)}
"""

Candidate Actual Background:
- Role Identity: Software Developer / Full-Stack Developer
- Experience: ${experienceSummary}
- Actual Core Skills: ${skillsList}
- Education: MCA (pursuing), BCA (completed)
- Key Projects: DevLens (AI GitHub Analyzer - Sole Creator), Money Mate (Finance App), RTGS/NEFT Banking System`;

                        const chatResponse = await fetch('./api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                messages: [
                                    { role: 'system', content: 'You are an expert resume writer. Return ONLY valid JSON, no markdown, no code fences.' },
                                    { role: 'user', content: summaryPrompt }
                                ]
                            })
                        });

                        if (chatResponse.ok) {
                            const chatData = await chatResponse.json();
                            let aiText = chatData.choices?.[0]?.message?.content || '';
                            
                            aiText = aiText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
                            try {
                                const parsed = JSON.parse(aiText);
                                if (parsed.summary && typeof parsed.summary === 'string') {
                                    finalData.tailoredSummary = parsed.summary;
                                }
                            } catch (parseErr) {
                                console.warn('AI summary JSON parse failed, using default summary:', parseErr);
                            }
                        }
                    } catch (summaryErr) {
                        console.warn('AI summary generation failed, using default summary:', summaryErr);
                    }
                    showStep(3);
                    try {
                        const polishResponse = await fetch('./api/polish', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                jobDescription: jdText,
                                experience: finalData.experience.map(j => ({
                                    company: j.company,
                                    role: j.role,
                                    bullets: j.bullets.map(b => ({ text: b.text }))
                                }))
                            })
                        });

                        if (polishResponse.ok) {
                            const polishedJson = await polishResponse.json();
                            if (polishedJson && polishedJson.experience) {
                                
                                finalData.experience = finalData.experience.map(originalJob => {
                                    const polishedJob = polishedJson.experience.find(pj => pj.company === originalJob.company);
                                    if (polishedJob && polishedJob.bullets) {
                                        return {
                                            ...originalJob,
                                            bullets: originalJob.bullets.map((b, bIdx) => {
                                                const polishedB = polishedJob.bullets[bIdx];
                                                return {
                                                    text: polishedB ? polishedB.text : b.text,
                                                    tags: b.tags
                                                };
                                            })
                                        };
                                    }
                                    return originalJob;
                                });
                            }
                        } else {
                            console.warn("AI Polishing endpoint failed, falling back to local matches.", await polishResponse.text());
                        }
                    } catch (aiErr) {
                        console.error("AI Polish failed, using matched resume copy:", aiErr);
                    }
                }

                showStep(4);
                let latexPdfDownloaded = false;
                
                try {
                    const latexResponse = await fetch('./api/latex', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: finalData, jobDescription: jdText, docType: selectedDocType })
                    });
                    
                    if (latexResponse.ok && latexResponse.headers.get('content-type')?.includes('application/pdf')) {
                        const pdfBlob = await latexResponse.blob();
                        const blobUrl = URL.createObjectURL(pdfBlob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = blobUrl;
                        a.download = selectedDocType === 'cv' ? 'Charan_Kumar_CV.pdf' : 'Charan_Kumar_Resume.pdf';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            URL.revokeObjectURL(blobUrl);
                            if (document.body.contains(a)) document.body.removeChild(a);
                        }, 1000);
                        latexPdfDownloaded = true;
                    }
                } catch (latexErr) {
                    console.warn("Server LaTeX PDF compilation failed, trying direct compile:", latexErr);
                }

                if (!latexPdfDownloaded) {
                    try {
                        const latexCode = buildLatexCode(finalData, selectedDocType);
                        const compileRes = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(latexCode)}`);
                        if (compileRes.ok && compileRes.headers.get('content-type')?.includes('application/pdf')) {
                            const pdfBlob = await compileRes.blob();
                            const blobUrl = URL.createObjectURL(pdfBlob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = blobUrl;
                            a.download = selectedDocType === 'cv' ? 'Charan_Kumar_CV.pdf' : 'Charan_Kumar_Resume.pdf';
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(() => {
                                URL.revokeObjectURL(blobUrl);
                                if (document.body.contains(a)) document.body.removeChild(a);
                            }, 1000);
                            latexPdfDownloaded = true;
                        }
                    } catch (directErr) {
                        console.warn("Direct LaTeX compilation failed, falling back to jsPDF:", directErr);
                    }
                }

                if (!latexPdfDownloaded) {
                    generatePdfResume(finalData, roleTitle, selectedDocType);
                }

                showStep(5);
                await new Promise(r => setTimeout(r, 400));
                
                loadingOverlay.classList.remove("active");
                closeModal();
            } catch (error) {
                console.error("Generator failed:", error);
                alert("An error occurred during resume generation. Please try again.");
                loadingOverlay.classList.remove("active");
            }
        });
    });
})();

/* ==========================================================================
   GLOBAL TOAST NOTIFICATIONS & 1-CLICK CLIPBOARD HANDLERS
   ========================================================================== */
window.showToast = function(msg, icon = '✅') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        if (container.contains(toast)) {
            container.removeChild(toast);
        }
    }, 3100);
};

window.copyEmailToClipboard = function() {
    const email = 'charansuvarna99@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard! (charansuvarna99@gmail.com)', '📋');
    }).catch(() => {
        showToast('charansuvarna99@gmail.com', '✉️');
    });
};

window.copyPhoneToClipboard = function() {
    const phone = '+91 9380455922';
    navigator.clipboard.writeText(phone).then(() => {
        showToast('Phone copied to clipboard! (+91 9380455922)', '📞');
    }).catch(() => {
        showToast('+91 9380455922', '📞');
    });
};

/* ==========================================================================
   GLOBAL COMMAND PALETTE (Ctrl + K / ⌘K)
   ========================================================================== */
(function initCommandPalette() {
    const backdrop = document.getElementById('cmdPaletteBackdrop');
    const input = document.getElementById('cmdPaletteInput');
    const resultsContainer = document.getElementById('cmdPaletteResults');
    const triggerBtn = document.getElementById('cmdKBtn');

    if (!backdrop || !input || !resultsContainer) return;

    let selectedIndex = 0;
    let filteredCommands = [];

    const COMMANDS_REGISTRY = [
        // Navigation
        { category: 'Navigation', title: 'Home', desc: 'Jump to Hero greeting & intro', icon: '🏠', action: () => scrollToSection('#hero') },
        { category: 'Navigation', title: 'About Me', desc: 'Read bio, background & core competencies', icon: '👤', action: () => scrollToSection('#about') },
        { category: 'Navigation', title: 'Skills & Technologies', desc: 'Search 30+ tools, databases & frameworks', icon: '⚡', action: () => scrollToSection('#skills') },
        { category: 'Navigation', title: 'Featured Projects', desc: 'Explore 9 production & enterprise apps', icon: '🚀', action: () => scrollToSection('#projects') },
        { category: 'Navigation', title: 'Project Simulator', desc: 'Step-by-step interactive workflow map & logs', icon: '⚙️', action: () => scrollToSection('#simulator') },
        { category: 'Navigation', title: 'Work Experience', desc: 'AGREMATE & NTSIPL career journey', icon: '💼', action: () => scrollToSection('#experience') },
        { category: 'Navigation', title: 'Education & Add-ons', desc: 'MCA MIT Jaipur & Mangalore University BCA', icon: '🎓', action: () => scrollToSection('#education') },
        { category: 'Navigation', title: 'Certifications', desc: 'Accolade Tech, University training & NCC', icon: '📜', action: () => scrollToSection('#certifications') },
        { category: 'Navigation', title: 'Get In Touch', desc: 'Email, LinkedIn, Phone & GitHub contact links', icon: '📬', action: () => scrollToSection('#contact') },

        // Quick Actions
        { category: 'Quick Actions', title: 'Match & Generate Tailored Resume', desc: 'Open dual-mode ATS resume / CV compiler', icon: '✨', action: () => triggerResumeModal('resume') },
        { category: 'Quick Actions', title: 'Download Full Detailed CV', desc: 'Complete 9-project curriculum vitae', icon: '📄', action: () => triggerResumeModal('cv') },
        { category: 'Quick Actions', title: 'Open Developer CLI Matrix Terminal', desc: 'Run custom ck commands in interactive shell', icon: '💻', action: () => toggleTerminal() },
        { category: 'Quick Actions', title: 'Ask AI Chatbot (CK-Buddy)', desc: '6-Tier multi-LLM candidate Q&A assistant', icon: '🤖', action: () => toggleChat() },
        { category: 'Quick Actions', title: 'Copy Email Address', desc: 'Copy charansuvarna99@gmail.com to clipboard', icon: '📋', action: () => copyEmailToClipboard() },
        { category: 'Quick Actions', title: 'Copy Phone Number', desc: 'Copy +91 9380455922 to clipboard', icon: '📞', action: () => copyPhoneToClipboard() },

        // Featured Projects
        { category: 'Featured Projects', title: 'DevLens — AI GitHub Analyzer', desc: 'C#, ASP.NET Core, React & Gemini API', icon: '🔍', action: () => window.open('https://devlens-nine.vercel.app/', '_blank') },
        { category: 'Featured Projects', title: 'Migration Master — PostgreSQL Tool', desc: 'Binary COPY, Kahn Topological Sort in C#', icon: '🚀', action: () => window.open('https://github.com/charan-kumar99/Migration-Master', '_blank') },
        { category: 'Featured Projects', title: 'Vaulta — Document Manager PWA', desc: '100% Offline IndexedDB & PDF.js pipeline', icon: '🔒', action: () => window.open('https://charan-kumar99.github.io/Vaulta/', '_blank') },
        { category: 'Featured Projects', title: 'Money Mate — Personal Finance', desc: 'Flask, SQLite, SQLAlchemy, Chart.js', icon: '💰', action: () => window.open('https://money-mate-e33v.onrender.com/login', '_blank') },
        { category: 'Featured Projects', title: 'Orion — Voice Assistant', desc: 'Python, Flask, Google TTS & Speech Recog', icon: '🎙️', action: () => window.open('https://orion-assistant-bfwt.onrender.com/', '_blank') },
        { category: 'Featured Projects', title: 'Agremate — Property Backend', desc: 'ASP.NET Core, Clean Architecture, Docker', icon: '🏢', action: () => scrollToSection('#projects') },
        { category: 'Featured Projects', title: 'RTGS/NEFT — Banking Microservices', desc: 'Enterprise microservices for major banks', icon: '🏦', action: () => scrollToSection('#projects') },

        // Theme Switcher
        { category: 'Color Theme', title: 'Neo-Cyan Dark Theme', desc: 'Default sleek cyber dark mode', icon: '🌌', action: () => applyPalette('dark') },
        { category: 'Color Theme', title: 'Cyberpunk Neon Theme', desc: 'Vibrant magenta & purple neon glow', icon: '⚡', action: () => applyPalette('cyberpunk') },
        { category: 'Color Theme', title: 'Emerald Minimalist Theme', desc: 'Fresh deep green & mint accents', icon: '🌿', action: () => applyPalette('emerald') },
        { category: 'Color Theme', title: 'Light Mode Pro Theme', desc: 'High-contrast clean corporate light palette', icon: '☀️', action: () => applyPalette('light') }
    ];

    function scrollToSection(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function triggerResumeModal(type) {
        const btn = document.getElementById('floatingResumeBtn');
        if (btn) btn.click();
        if (type === 'cv') {
            const pillCV = document.getElementById('pillCV');
            if (pillCV) pillCV.click();
        }
    }

    function openPalette() {
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        input.value = '';
        selectedIndex = 0;
        renderResults('');
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
    }

    function renderResults(query) {
        const q = query.toLowerCase().trim();
        if (!q) {
            filteredCommands = COMMANDS_REGISTRY;
        } else {
            filteredCommands = COMMANDS_REGISTRY.filter(cmd => 
                cmd.title.toLowerCase().includes(q) || 
                cmd.desc.toLowerCase().includes(q) ||
                cmd.category.toLowerCase().includes(q)
            );
        }

        if (filteredCommands.length === 0) {
            resultsContainer.innerHTML = `
                <div class="cmd-palette-empty">
                    <p>No commands found matching "<strong>${escapeHtml(query)}</strong>"</p>
                </div>
            `;
            return;
        }

        if (selectedIndex >= filteredCommands.length) selectedIndex = 0;

        let html = '';
        let currentCategory = '';

        filteredCommands.forEach((cmd, idx) => {
            if (cmd.category !== currentCategory) {
                currentCategory = cmd.category;
                html += `<div class="cmd-category-header">${currentCategory}</div>`;
            }

            const isSelected = idx === selectedIndex;
            html += `
                <div class="cmd-palette-item ${isSelected ? 'active' : ''}" data-index="${idx}">
                    <div class="cmd-item-left">
                        <span class="cmd-item-icon">${cmd.icon}</span>
                        <div>
                            <div class="cmd-item-title">${escapeHtml(cmd.title)}</div>
                            <div class="cmd-item-desc">${escapeHtml(cmd.desc)}</div>
                        </div>
                    </div>
                    <span class="cmd-item-action-badge">Run ↵</span>
                </div>
            `;
        });

        resultsContainer.innerHTML = html;

        resultsContainer.querySelectorAll('.cmd-palette-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const idx = parseInt(item.getAttribute('data-index'), 10);
                selectedIndex = idx;
                updateActiveSelection();
            });
            item.addEventListener('click', () => {
                const idx = parseInt(item.getAttribute('data-index'), 10);
                executeCommand(idx);
            });
        });
    }

    function updateActiveSelection() {
        const items = resultsContainer.querySelectorAll('.cmd-palette-item');
        items.forEach((item) => {
            const itemIdx = parseInt(item.getAttribute('data-index'), 10);
            item.classList.toggle('active', itemIdx === selectedIndex);
            if (itemIdx === selectedIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    function executeCommand(idx) {
        if (filteredCommands[idx]) {
            closePalette();
            try {
                filteredCommands[idx].action();
            } catch (e) {
                console.error('Command execution failed:', e);
            }
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Global keyboard listener
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (backdrop.classList.contains('open')) {
                closePalette();
            } else {
                openPalette();
            }
        } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
            closePalette();
        }
    });

    if (triggerBtn) {
        triggerBtn.addEventListener('click', openPalette);
    }

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closePalette();
    });

    input.addEventListener('input', (e) => {
        selectedIndex = 0;
        renderResults(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
        if (filteredCommands.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % filteredCommands.length;
            updateActiveSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
            updateActiveSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(selectedIndex);
        }
    });
})();

/* ==========================================================================
   DYNAMIC HERO METRICS (LIVE CAREER EXPERIENCE & FEATURED PROJECTS COUNT)
   ========================================================================== */
function initDynamicHeroMetrics() {
    // Career Start Date: September 11, 2025
    const careerStart = new Date(2025, 8, 11);
    const now = new Date();

    let years = now.getFullYear() - careerStart.getFullYear();
    let months = now.getMonth() - careerStart.getMonth();
    let days = now.getDate() - careerStart.getDate();

    if (days < 0) {
        months -= 1;
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    const totalMonths = (years * 12) + months;
    const expValEl = document.getElementById("heroExpYears");
    const expUnitEl = document.getElementById("heroExpUnit");

    if (totalMonths < 12) {
        if (expValEl) expValEl.textContent = `${Math.max(1, totalMonths)}+`;
        if (expUnitEl) expUnitEl.textContent = "Mo";
    } else {
        const remainingMonths = totalMonths % 12;
        let formattedYears = `${years}`;
        if (remainingMonths >= 6) {
            formattedYears = `${years}.5`;
        }
        if (expValEl) expValEl.textContent = `${formattedYears}+`;
        if (expUnitEl) expUnitEl.textContent = "Yrs";
    }

    // Dynamic Projects Count (Automatically counts .project-card elements in DOM)
    const projectCards = document.querySelectorAll(".project-card");
    const countEl = document.getElementById("heroProjectsCount");
    if (countEl && projectCards.length > 0) {
        countEl.textContent = projectCards.length;
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDynamicHeroMetrics);
} else {
    initDynamicHeroMetrics();
}

