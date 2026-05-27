import type { LangSnippets } from './index';

export const typescriptSnippets: LangSnippets = {
  'bubble-sort': `function bubbleSort(a: number[]): number[] {
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
  'quick-sort': `function quickSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const pivot = a[a.length >> 1];
  const left = a.filter((x) => x < pivot);
  const mid = a.filter((x) => x === pivot);
  const right = a.filter((x) => x > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
}

console.log(quickSort([5, 2, 9, 1, 5, 6]));
`,
  'binary-search': `function binarySearch(a: number[], target: number): number {
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
  'linked-list': `class ListNode<T> {
  next: ListNode<T> | null = null;
  constructor(public value: T) {}
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  push(value: T): void {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
  }
  toString(): string {
    const out: T[] = [];
    let cur = this.head;
    while (cur) { out.push(cur.value); cur = cur.next; }
    return out.join(" -> ");
  }
}

const ll = new LinkedList<number>();
[3, 2, 1].forEach((x) => ll.push(x));
console.log(ll.toString());
`,
  'stack-queue': `const stack: number[] = [];
stack.push(1, 2, 3);
console.log("stack pop:", stack.pop());

const queue: number[] = [];
queue.push(1, 2, 3);
console.log("queue pop:", queue.shift());
`,
  'hash-map': `const freq = new Map<string, number>();
for (const ch of "abracadabra") {
  freq.set(ch, (freq.get(ch) ?? 0) + 1);
}

for (const [k, v] of [...freq].sort()) {
  console.log(\`\${k}: \${v}\`);
}
`,
  'binary-tree': `class TreeNode {
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(public value: number) {}
}

function insert(root: TreeNode | null, value: number): TreeNode {
  if (!root) return new TreeNode(value);
  if (value < root.value) root.left = insert(root.left, value);
  else root.right = insert(root.right, value);
  return root;
}

function inorder(root: TreeNode | null, out: number[]): number[] {
  if (root) {
    inorder(root.left, out);
    out.push(root.value);
    inorder(root.right, out);
  }
  return out;
}

let root: TreeNode | null = null;
for (const x of [5, 3, 8, 1, 4, 7, 9]) root = insert(root, x);
console.log(inorder(root, []));
`,
  'graph-bfs-dfs': `const graph: Record<string, string[]> = {
  A: ["B", "C"], B: ["A", "D", "E"], C: ["A", "F"],
  D: ["B"], E: ["B", "F"], F: ["C", "E"],
};

function bfs(start: string): string[] {
  const visited = new Set([start]);
  const queue: string[] = [start];
  const order: string[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const n of graph[node]) {
      if (!visited.has(n)) { visited.add(n); queue.push(n); }
    }
  }
  return order;
}

function dfs(node: string, visited: Set<string>, order: string[]): string[] {
  visited.add(node);
  order.push(node);
  for (const n of graph[node]) {
    if (!visited.has(n)) dfs(n, visited, order);
  }
  return order;
}

console.log("BFS:", bfs("A"));
console.log("DFS:", dfs("A", new Set<string>(), []));
`,
  dijkstra: `function dijkstra(
  graph: Record<string, Record<string, number>>,
  start: string,
): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;
  const pq: [number, string][] = [[0, start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, node] = pq.shift()!;
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
  fibonacci: `function makeFib(): (n: number) => number {
  const memo = new Map<number, number>();
  function fib(n: number): number {
    if (n < 2) return n;
    if (memo.has(n)) return memo.get(n)!;
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
  'selection-sort': `function selectionSort(a: number[]): number[] {
  for (let i = 0; i < a.length; i++) {
    let m = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
    [a[i], a[m]] = [a[m], a[i]];
  }
  return a;
}

console.log(selectionSort([5, 2, 9, 1, 5, 6]));
`,
  'insertion-sort': `function insertionSort(a: number[]): number[] {
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
  'merge-sort': `function mergeSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const res: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return res.concat(left.slice(i), right.slice(j));
}

console.log(mergeSort([5, 2, 9, 1, 5, 6]));
`,
  'heap-sort': `function heapSort(a: number[]): number[] {
  const n = a.length;
  const heapify = (size: number, i: number): void => {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(size, largest);
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }
  return a;
}

console.log(heapSort([5, 2, 9, 1, 5, 6]));
`,
  'counting-sort': `function countingSort(a: number[]): number[] {
  if (a.length === 0) return a;
  const max = Math.max(...a);
  const count = new Array<number>(max + 1).fill(0);
  for (const x of a) count[x]++;
  const res: number[] = [];
  for (let v = 0; v <= max; v++) for (let c = 0; c < count[v]; c++) res.push(v);
  return res;
}

console.log(countingSort([5, 2, 9, 1, 5, 6]));
`,
  kmp: `function kmp(text: string, pattern: string): number[] {
  const lps = new Array<number>(pattern.length).fill(0);
  let k = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (k > 0 && pattern[i] !== pattern[k]) k = lps[k - 1];
    if (pattern[i] === pattern[k]) k++;
    lps[i] = k;
  }
  const res: number[] = [];
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
  private h: number[] = [];
  get size(): number { return this.h.length; }
  push(v: number): void {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop(): number | undefined {
    const top = this.h[0];
    const last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      for (;;) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
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
const out: number[] = [];
while (heap.size) out.push(heap.pop()!);
console.log(out);
`,
  'union-find': `class UnionFind {
  private parent: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a: number, b: number): void {
    this.parent[this.find(a)] = this.find(b);
  }
}

const uf = new UnionFind(6);
uf.union(0, 1); uf.union(2, 3); uf.union(1, 3);
console.log("0 and 3:", uf.find(0) === uf.find(3));
console.log("0 and 5:", uf.find(0) === uf.find(5));
`,
  knapsack: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(capacity + 1).fill(0));
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
  lcs: `function lcs(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
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
  'edit-distance': `function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
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
  'coin-change': `function coinChange(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) dp[x] = Math.min(dp[x], dp[x - coin] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log("min coins:", coinChange([1, 2, 5], 11));
`,
  gcd: `function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

console.log("gcd(48, 36) =", gcd(48, 36));
console.log("lcm(4, 6) =", (4 * 6) / gcd(4, 6));
`,
  sieve: `function sieve(n: number): number[] {
  const isPrime = new Array<boolean>(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = false;
  }
  return [...Array(n + 1).keys()].filter((i) => isPrime[i]);
}

console.log(sieve(30));
`,
  'prime-check': `function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

console.log([...Array(30).keys()].filter(isPrime));
`,
};
