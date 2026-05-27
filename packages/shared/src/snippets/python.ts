import type { LangSnippets } from './index';

export const pythonSnippets: LangSnippets = {
  'bubble-sort': `def bubble_sort(a):
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a


print(bubble_sort([5, 2, 9, 1, 5, 6]))
`,
  'quick-sort': `def quick_sort(a):
    if len(a) <= 1:
        return a
    pivot = a[len(a) // 2]
    left = [x for x in a if x < pivot]
    mid = [x for x in a if x == pivot]
    right = [x for x in a if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)


print(quick_sort([5, 2, 9, 1, 5, 6]))
`,
  'binary-search': `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


arr = [1, 3, 5, 7, 9, 11]
print("index:", binary_search(arr, 7))
`,
  'linked-list': `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def push(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def __repr__(self):
        out, cur = [], self.head
        while cur:
            out.append(cur.value)
            cur = cur.next
        return " -> ".join(map(str, out))


ll = LinkedList()
for x in [3, 2, 1]:
    ll.push(x)
print(ll)
`,
  'stack-queue': `from collections import deque

stack = []
stack.append(1)
stack.append(2)
stack.append(3)
print("stack pop:", stack.pop())

queue = deque()
queue.append(1)
queue.append(2)
queue.append(3)
print("queue pop:", queue.popleft())
`,
  'hash-map': `freq = {}
for ch in "abracadabra":
    freq[ch] = freq.get(ch, 0) + 1

for k, v in sorted(freq.items()):
    print(f"{k}: {v}")
`,
  'binary-tree': `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return TreeNode(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root


def inorder(root, out):
    if root:
        inorder(root.left, out)
        out.append(root.value)
        inorder(root.right, out)


root = None
for x in [5, 3, 8, 1, 4, 7, 9]:
    root = insert(root, x)

res = []
inorder(root, res)
print(res)
`,
  'graph-bfs-dfs': `from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E'],
}


def bfs(start):
    visited, queue, order = {start}, deque([start]), []
    while queue:
        node = queue.popleft()
        order.append(node)
        for n in graph[node]:
            if n not in visited:
                visited.add(n)
                queue.append(n)
    return order


def dfs(node, visited, order):
    visited.add(node)
    order.append(node)
    for n in graph[node]:
        if n not in visited:
            dfs(n, visited, order)
    return order


print("BFS:", bfs('A'))
print("DFS:", dfs('A', set(), []))
`,
  dijkstra: `import heapq


def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist[node]:
            continue
        for neighbor, weight in graph[node].items():
            nd = d + weight
            if nd < dist[neighbor]:
                dist[neighbor] = nd
                heapq.heappush(pq, (nd, neighbor))
    return dist


graph = {
    'A': {'B': 1, 'C': 4},
    'B': {'C': 2, 'D': 5},
    'C': {'D': 1},
    'D': {},
}
print(dijkstra(graph, 'A'))
`,
  fibonacci: `from functools import lru_cache


@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


print([fib(i) for i in range(10)])
`,
  fizzbuzz: `for i in range(1, 21):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
`,
  'selection-sort': `def selection_sort(a):
    for i in range(len(a)):
        m = i
        for j in range(i + 1, len(a)):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]
    return a


print(selection_sort([5, 2, 9, 1, 5, 6]))
`,
  'insertion-sort': `def insertion_sort(a):
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a


print(insertion_sort([5, 2, 9, 1, 5, 6]))
`,
  'merge-sort': `def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    res, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res


print(merge_sort([5, 2, 9, 1, 5, 6]))
`,
  'heap-sort': `import heapq


def heap_sort(a):
    heapq.heapify(a)
    return [heapq.heappop(a) for _ in range(len(a))]


print(heap_sort([5, 2, 9, 1, 5, 6]))
`,
  'counting-sort': `def counting_sort(a):
    if not a:
        return a
    mx = max(a)
    count = [0] * (mx + 1)
    for x in a:
        count[x] += 1
    res = []
    for v, c in enumerate(count):
        res.extend([v] * c)
    return res


print(counting_sort([5, 2, 9, 1, 5, 6]))
`,
  kmp: `def kmp(text, pattern):
    lps = [0] * len(pattern)
    k = 0
    for i in range(1, len(pattern)):
        while k > 0 and pattern[i] != pattern[k]:
            k = lps[k - 1]
        if pattern[i] == pattern[k]:
            k += 1
        lps[i] = k
    res, k = [], 0
    for i in range(len(text)):
        while k > 0 and text[i] != pattern[k]:
            k = lps[k - 1]
        if text[i] == pattern[k]:
            k += 1
        if k == len(pattern):
            res.append(i - k + 1)
            k = lps[k - 1]
    return res


print("found at:", kmp("abxabcabcaby", "abcaby"))
`,
  'min-heap': `import heapq

heap = []
for x in [5, 2, 9, 1, 5, 6]:
    heapq.heappush(heap, x)

print("min:", heap[0])
print("pop order:", [heapq.heappop(heap) for _ in range(len(heap))])
`,
  trie: `class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['$'] = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node:
                return False
            node = node[ch]
        return '$' in node


t = Trie()
for w in ["cat", "car", "card"]:
    t.insert(w)
print(t.search("car"), t.search("ca"), t.search("card"))
`,
  'union-find': `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        self.parent[self.find(a)] = self.find(b)


uf = UnionFind(6)
uf.union(0, 1)
uf.union(2, 3)
uf.union(1, 3)
print("0 and 3 connected:", uf.find(0) == uf.find(3))
print("0 and 5 connected:", uf.find(0) == uf.find(5))
`,
  'topological-sort': `from collections import deque

graph = {5: [2, 0], 4: [0, 1], 2: [3], 3: [1], 0: [], 1: []}
indeg = {u: 0 for u in graph}
for u in graph:
    for v in graph[u]:
        indeg[v] += 1

queue = deque([u for u in graph if indeg[u] == 0])
order = []
while queue:
    u = queue.popleft()
    order.append(u)
    for v in graph[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            queue.append(v)

print(order)
`,
  knapsack: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
    return dp[n][capacity]


print("max value:", knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))
`,
  lcs: `def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]


print("LCS length:", lcs("AGGTAB", "GXTXAYB"))
`,
  'edit-distance': `def edit_distance(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) + 1):
        dp[i][0] = i
    for j in range(len(b) + 1):
        dp[0][j] = j
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    return dp[len(a)][len(b)]


print("distance:", edit_distance("kitten", "sitting"))
`,
  'coin-change': `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1


print("min coins:", coin_change([1, 2, 5], 11))
`,
  gcd: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


print("gcd(48, 36) =", gcd(48, 36))
print("lcm(4, 6) =", 4 * 6 // gcd(4, 6))
`,
  sieve: `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    return [i for i in range(n + 1) if is_prime[i]]


print(sieve(30))
`,
  'fast-power': `def fast_power(base, exp, mod=10**9 + 7):
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = result * base % mod
        base = base * base % mod
        exp >>= 1
    return result


print("2^10 =", fast_power(2, 10))
print("3^200 mod 1e9+7 =", fast_power(3, 200))
`,
  'prime-check': `def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True


print([n for n in range(2, 30) if is_prime(n)])
`,
};
