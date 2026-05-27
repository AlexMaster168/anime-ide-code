import type { LangSnippets } from './index';

export const javascriptSnippets: LangSnippets = {
  'bubble-sort': `function bubbleSort(a) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}

console.log(bubbleSort([5, 2, 9, 1, 5, 6]));
`,
  'quick-sort': `function quickSort(a) {
  if (a.length <= 1) return a;
  const pivot = a[a.length >> 1];
  const left = a.filter((x) => x < pivot);
  const mid = a.filter((x) => x === pivot);
  const right = a.filter((x) => x > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
}

console.log(quickSort([5, 2, 9, 1, 5, 6]));
`,
  'binary-search': `function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

console.log("index:", binarySearch([1, 3, 5, 7, 9, 11], 7));
`,
  'linked-list': `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  push(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
  }
  toString() {
    const out = [];
    let cur = this.head;
    while (cur) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out.join(" -> ");
  }
}

const ll = new LinkedList();
[3, 2, 1].forEach((x) => ll.push(x));
console.log(ll.toString());
`,
  'stack-queue': `const stack = [];
stack.push(1, 2, 3);
console.log("stack pop:", stack.pop());

const queue = [];
queue.push(1, 2, 3);
console.log("queue pop:", queue.shift());
`,
  'hash-map': `const freq = new Map();
for (const ch of "abracadabra") {
  freq.set(ch, (freq.get(ch) ?? 0) + 1);
}

for (const [k, v] of [...freq].sort()) {
  console.log(\`\${k}: \${v}\`);
}
`,
  'binary-tree': `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function insert(root, value) {
  if (!root) return new TreeNode(value);
  if (value < root.value) root.left = insert(root.left, value);
  else root.right = insert(root.right, value);
  return root;
}

function inorder(root, out) {
  if (root) {
    inorder(root.left, out);
    out.push(root.value);
    inorder(root.right, out);
  }
  return out;
}

let root = null;
for (const x of [5, 3, 8, 1, 4, 7, 9]) root = insert(root, x);
console.log(inorder(root, []));
`,
  'graph-bfs-dfs': `const graph = {
  A: ["B", "C"], B: ["A", "D", "E"], C: ["A", "F"],
  D: ["B"], E: ["B", "F"], F: ["C", "E"],
};

function bfs(start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const n of graph[node]) {
      if (!visited.has(n)) { visited.add(n); queue.push(n); }
    }
  }
  return order;
}

function dfs(node, visited, order) {
  visited.add(node);
  order.push(node);
  for (const n of graph[node]) {
    if (!visited.has(n)) dfs(n, visited, order);
  }
  return order;
}

console.log("BFS:", bfs("A"));
console.log("DFS:", dfs("A", new Set(), []));
`,
  dijkstra: `function dijkstra(graph, start) {
  const dist = {};
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;
  const pq = [[0, start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, node] = pq.shift();
    if (d > dist[node]) continue;
    for (const [neighbor, weight] of Object.entries(graph[node])) {
      const nd = d + weight;
      if (nd < dist[neighbor]) {
        dist[neighbor] = nd;
        pq.push([nd, neighbor]);
      }
    }
  }
  return dist;
}

const graph = {
  A: { B: 1, C: 4 }, B: { C: 2, D: 5 }, C: { D: 1 }, D: {},
};
console.log(dijkstra(graph, "A"));
`,
  fibonacci: `function makeFib() {
  const memo = new Map();
  function fib(n) {
    if (n < 2) return n;
    if (memo.has(n)) return memo.get(n);
    const result = fib(n - 1) + fib(n - 2);
    memo.set(n, result);
    return result;
  }
  return fib;
}

const fib = makeFib();
console.log(Array.from({ length: 10 }, (_, i) => fib(i)));
`,
  fizzbuzz: `for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
`,
  'selection-sort': `function selectionSort(a) {
  for (let i = 0; i < a.length; i++) {
    let m = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
    [a[i], a[m]] = [a[m], a[i]];
  }
  return a;
}

console.log(selectionSort([5, 2, 9, 1, 5, 6]));
`,
  'insertion-sort': `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
    a[j + 1] = key;
  }
  return a;
}

console.log(insertionSort([5, 2, 9, 1, 5, 6]));
`,
  'merge-sort': `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const res = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return res.concat(left.slice(i), right.slice(j));
}

console.log(mergeSort([5, 2, 9, 1, 5, 6]));
`,
  'heap-sort': `function heapSort(a) {
  const n = a.length;
  function heapify(n, i) {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(n, largest);
    }
  }
  for (let i = (n >> 1) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }
  return a;
}

console.log(heapSort([5, 2, 9, 1, 5, 6]));
`,
  'counting-sort': `function countingSort(a) {
  if (a.length === 0) return a;
  const max = Math.max(...a);
  const count = new Array(max + 1).fill(0);
  for (const x of a) count[x]++;
  const res = [];
  for (let v = 0; v <= max; v++) for (let c = 0; c < count[v]; c++) res.push(v);
  return res;
}

console.log(countingSort([5, 2, 9, 1, 5, 6]));
`,
  kmp: `function kmp(text, pattern) {
  const lps = new Array(pattern.length).fill(0);
  let k = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (k > 0 && pattern[i] !== pattern[k]) k = lps[k - 1];
    if (pattern[i] === pattern[k]) k++;
    lps[i] = k;
  }
  const res = [];
  k = 0;
  for (let i = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pattern[k]) k = lps[k - 1];
    if (text[i] === pattern[k]) k++;
    if (k === pattern.length) { res.push(i - k + 1); k = lps[k - 1]; }
  }
  return res;
}

console.log("found at:", kmp("abxabcabcaby", "abcaby"));
`,
  'min-heap': `class MinHeap {
  constructor() { this.h = []; }
  push(v) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop() {
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      while (true) {
        let s = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.h.length && this.h[l] < this.h[s]) s = l;
        if (r < this.h.length && this.h[r] < this.h[s]) s = r;
        if (s === i) break;
        [this.h[s], this.h[i]] = [this.h[i], this.h[s]];
        i = s;
      }
    }
    return top;
  }
}

const heap = new MinHeap();
[5, 2, 9, 1, 5, 6].forEach((x) => heap.push(x));
const out = [];
while (heap.h.length) out.push(heap.pop());
console.log(out);
`,
  trie: `class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const ch of word) node = node[ch] ??= {};
    node.$ = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) return false;
      node = node[ch];
    }
    return !!node.$;
  }
}

const t = new Trie();
["cat", "car", "card"].forEach((w) => t.insert(w));
console.log(t.search("car"), t.search("ca"), t.search("card"));
`,
  'union-find': `class UnionFind {
  constructor(n) { this.parent = Array.from({ length: n }, (_, i) => i); }
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a, b) { this.parent[this.find(a)] = this.find(b); }
}

const uf = new UnionFind(6);
uf.union(0, 1); uf.union(2, 3); uf.union(1, 3);
console.log("0 and 3:", uf.find(0) === uf.find(3));
console.log("0 and 5:", uf.find(0) === uf.find(5));
`,
  'topological-sort': `const graph = { 5: [2, 0], 4: [0, 1], 2: [3], 3: [1], 0: [], 1: [] };
const indeg = {};
for (const u in graph) indeg[u] = 0;
for (const u in graph) for (const v of graph[u]) indeg[v]++;

const queue = Object.keys(graph).filter((u) => indeg[u] === 0);
const order = [];
while (queue.length) {
  const u = queue.shift();
  order.push(Number(u));
  for (const v of graph[u]) if (--indeg[v] === 0) queue.push(v);
}
console.log(order);
`,
  knapsack: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][capacity];
}

console.log("max value:", knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7));
`,
  lcs: `function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

console.log("LCS length:", lcs("AGGTAB", "GXTXAYB"));
`,
  'edit-distance': `function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

console.log("distance:", editDistance("kitten", "sitting"));
`,
  'coin-change': `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log("min coins:", coinChange([1, 2, 5], 11));
`,
  gcd: `function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

console.log("gcd(48, 36) =", gcd(48, 36));
console.log("lcm(4, 6) =", (4 * 6) / gcd(4, 6));
`,
  sieve: `function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = false;
  }
  return [...Array(n + 1).keys()].filter((i) => isPrime[i]);
}

console.log(sieve(30));
`,
  'fast-power': `function fastPower(base, exp, mod = 1000000007n) {
  let result = 1n;
  base = BigInt(base) % mod;
  let e = BigInt(exp);
  while (e > 0n) {
    if (e & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    e >>= 1n;
  }
  return result;
}

console.log("2^10 =", fastPower(2, 10).toString());
console.log("3^200 mod 1e9+7 =", fastPower(3, 200).toString());
`,
  'prime-check': `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

console.log([...Array(30).keys()].filter(isPrime));
`,
};
