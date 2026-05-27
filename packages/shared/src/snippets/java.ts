import type { LangSnippets } from './index';

export const javaSnippets: LangSnippets = {
  'bubble-sort': `import java.util.Arrays;

class Main {
    static void bubbleSort(int[] a) {
        for (int i = 0; i < a.length; i++)
            for (int j = 0; j < a.length - i - 1; j++)
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                }
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6};
        bubbleSort(a);
        System.out.println(Arrays.toString(a));
    }
}
`,
  'quick-sort': `import java.util.Arrays;

class Main {
    static void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = a[(lo + hi) / 2], i = lo, j = hi;
        while (i <= j) {
            while (a[i] < pivot) i++;
            while (a[j] > pivot) j--;
            if (i <= j) {
                int t = a[i]; a[i] = a[j]; a[j] = t;
                i++; j--;
            }
        }
        quickSort(a, lo, j);
        quickSort(a, i, hi);
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6};
        quickSort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a));
    }
}
`,
  'binary-search': `class Main {
    static int binarySearch(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5, 7, 9, 11};
        System.out.println("index: " + binarySearch(a, 7));
    }
}
`,
  'linked-list': `class Main {
    static class Node {
        int value;
        Node next;
        Node(int v) { value = v; }
    }

    public static void main(String[] args) {
        Node head = null;
        for (int x : new int[]{3, 2, 1}) {
            Node node = new Node(x);
            node.next = head;
            head = node;
        }
        StringBuilder sb = new StringBuilder();
        for (Node cur = head; cur != null; cur = cur.next) {
            sb.append(cur.value);
            if (cur.next != null) sb.append(" -> ");
        }
        System.out.println(sb);
    }
}
`,
  'stack-queue': `import java.util.*;

class Main {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1); stack.push(2); stack.push(3);
        System.out.println("stack pop: " + stack.pop());

        Queue<Integer> queue = new LinkedList<>();
        queue.add(1); queue.add(2); queue.add(3);
        System.out.println("queue pop: " + queue.poll());
    }
}
`,
  'hash-map': `import java.util.*;

class Main {
    public static void main(String[] args) {
        Map<Character, Integer> freq = new TreeMap<>();
        for (char ch : "abracadabra".toCharArray())
            freq.merge(ch, 1, Integer::sum);
        freq.forEach((k, v) -> System.out.println(k + ": " + v));
    }
}
`,
  'binary-tree': `import java.util.*;

class Main {
    static class TreeNode {
        int value;
        TreeNode left, right;
        TreeNode(int v) { value = v; }
    }

    static TreeNode insert(TreeNode root, int value) {
        if (root == null) return new TreeNode(value);
        if (value < root.value) root.left = insert(root.left, value);
        else root.right = insert(root.right, value);
        return root;
    }

    static void inorder(TreeNode root, List<Integer> out) {
        if (root == null) return;
        inorder(root.left, out);
        out.add(root.value);
        inorder(root.right, out);
    }

    public static void main(String[] args) {
        TreeNode root = null;
        for (int x : new int[]{5, 3, 8, 1, 4, 7, 9}) root = insert(root, x);
        List<Integer> res = new ArrayList<>();
        inorder(root, res);
        System.out.println(res);
    }
}
`,
  'graph-bfs-dfs': `import java.util.*;

class Main {
    static Map<String, List<String>> graph = Map.of(
        "A", List.of("B", "C"), "B", List.of("A", "D", "E"),
        "C", List.of("A", "F"), "D", List.of("B"),
        "E", List.of("B", "F"), "F", List.of("C", "E"));

    static void dfs(String node, Set<String> visited, List<String> order) {
        visited.add(node);
        order.add(node);
        for (String n : graph.get(node))
            if (!visited.contains(n)) dfs(n, visited, order);
    }

    public static void main(String[] args) {
        Set<String> visited = new HashSet<>(List.of("A"));
        Queue<String> queue = new LinkedList<>(List.of("A"));
        List<String> bfs = new ArrayList<>();
        while (!queue.isEmpty()) {
            String node = queue.poll();
            bfs.add(node);
            for (String n : graph.get(node))
                if (visited.add(n)) queue.add(n);
        }
        System.out.println("BFS: " + bfs);
        List<String> dfsOrder = new ArrayList<>();
        dfs("A", new HashSet<>(), dfsOrder);
        System.out.println("DFS: " + dfsOrder);
    }
}
`,
  dijkstra: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Map<String, Map<String, Integer>> graph = Map.of(
            "A", Map.of("B", 1, "C", 4),
            "B", Map.of("C", 2, "D", 5),
            "C", Map.of("D", 1),
            "D", Map.of());
        Map<String, Integer> dist = new TreeMap<>();
        for (String node : graph.keySet()) dist.put(node, Integer.MAX_VALUE);
        dist.put("A", 0);
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> x[0] - y[0]);
        List<String> nodes = new ArrayList<>(graph.keySet());
        pq.add(new int[]{0, nodes.indexOf("A")});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            String node = nodes.get(top[1]);
            if (top[0] > dist.get(node)) continue;
            for (var e : graph.get(node).entrySet()) {
                int nd = top[0] + e.getValue();
                if (nd < dist.get(e.getKey())) {
                    dist.put(e.getKey(), nd);
                    pq.add(new int[]{nd, nodes.indexOf(e.getKey())});
                }
            }
        }
        System.out.println(dist);
    }
}
`,
  fibonacci: `import java.util.*;

class Main {
    static Map<Integer, Long> memo = new HashMap<>();

    static long fib(int n) {
        if (n < 2) return n;
        if (memo.containsKey(n)) return memo.get(n);
        long result = fib(n - 1) + fib(n - 2);
        memo.put(n, result);
        return result;
    }

    public static void main(String[] args) {
        List<Long> res = new ArrayList<>();
        for (int i = 0; i < 10; i++) res.add(fib(i));
        System.out.println(res);
    }
}
`,
  fizzbuzz: `class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}
`,
  'selection-sort': `import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6};
        for (int i = 0; i < a.length; i++) {
            int m = i;
            for (int j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
            int t = a[i]; a[i] = a[m]; a[m] = t;
        }
        System.out.println(Arrays.toString(a));
    }
}
`,
  'insertion-sort': `import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6};
        for (int i = 1; i < a.length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
            a[j + 1] = key;
        }
        System.out.println(Arrays.toString(a));
    }
}
`,
  'merge-sort': `import java.util.Arrays;

class Main {
    static int[] mergeSort(int[] a) {
        if (a.length <= 1) return a;
        int mid = a.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
        int[] res = new int[a.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length)
            res[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        while (i < left.length) res[k++] = left[i++];
        while (j < right.length) res[k++] = right[j++];
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(mergeSort(new int[]{5, 2, 9, 1, 5, 6})));
    }
}
`,
  'heap-sort': `import java.util.*;

class Main {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6};
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : a) pq.add(x);
        List<Integer> res = new ArrayList<>();
        while (!pq.isEmpty()) res.add(pq.poll());
        System.out.println(res);
    }
}
`,
  'counting-sort': `import java.util.*;

class Main {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6};
        int max = Arrays.stream(a).max().getAsInt();
        int[] count = new int[max + 1];
        for (int x : a) count[x]++;
        List<Integer> res = new ArrayList<>();
        for (int v = 0; v <= max; v++)
            for (int c = 0; c < count[v]; c++) res.add(v);
        System.out.println(res);
    }
}
`,
  kmp: `class Main {
    public static void main(String[] args) {
        String text = "abxabcabcaby", pattern = "abcaby";
        int[] lps = new int[pattern.length()];
        int k = 0;
        for (int i = 1; i < pattern.length(); i++) {
            while (k > 0 && pattern.charAt(i) != pattern.charAt(k)) k = lps[k - 1];
            if (pattern.charAt(i) == pattern.charAt(k)) k++;
            lps[i] = k;
        }
        k = 0;
        for (int i = 0; i < text.length(); i++) {
            while (k > 0 && text.charAt(i) != pattern.charAt(k)) k = lps[k - 1];
            if (text.charAt(i) == pattern.charAt(k)) k++;
            if (k == pattern.length()) {
                System.out.println("found at: " + (i - k + 1));
                k = lps[k - 1];
            }
        }
    }
}
`,
  'min-heap': `import java.util.*;

class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : new int[]{5, 2, 9, 1, 5, 6}) heap.add(x);
        System.out.println("min: " + heap.peek());
        List<Integer> out = new ArrayList<>();
        while (!heap.isEmpty()) out.add(heap.poll());
        System.out.println(out);
    }
}
`,
  trie: `import java.util.*;

class Main {
    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean end = false;
    }

    static void insert(TrieNode root, String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray())
            node = node.children.computeIfAbsent(ch, c -> new TrieNode());
        node.end = true;
    }

    static boolean search(TrieNode root, String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node = node.children.get(ch);
            if (node == null) return false;
        }
        return node.end;
    }

    public static void main(String[] args) {
        TrieNode root = new TrieNode();
        for (String w : new String[]{"cat", "car", "card"}) insert(root, w);
        System.out.println(search(root, "car") + " " + search(root, "ca")
            + " " + search(root, "card"));
    }
}
`,
  'union-find': `class Main {
    static int[] parent;

    static int find(int x) {
        while (parent[x] != x) x = parent[x] = parent[parent[x]];
        return x;
    }

    static void union(int a, int b) { parent[find(a)] = find(b); }

    public static void main(String[] args) {
        parent = new int[6];
        for (int i = 0; i < 6; i++) parent[i] = i;
        union(0, 1); union(2, 3); union(1, 3);
        System.out.println("0 and 3: " + (find(0) == find(3)));
        System.out.println("0 and 5: " + (find(0) == find(5)));
    }
}
`,
  'topological-sort': `import java.util.*;

class Main {
    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(5, List.of(2, 0)); graph.put(4, List.of(0, 1));
        graph.put(2, List.of(3)); graph.put(3, List.of(1));
        graph.put(0, List.of()); graph.put(1, List.of());
        Map<Integer, Integer> indeg = new HashMap<>();
        for (int u : graph.keySet()) indeg.put(u, 0);
        for (int u : graph.keySet())
            for (int v : graph.get(u)) indeg.merge(v, 1, Integer::sum);
        Queue<Integer> q = new LinkedList<>();
        for (int u : graph.keySet()) if (indeg.get(u) == 0) q.add(u);
        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : graph.get(u))
                if (indeg.merge(v, -1, Integer::sum) == 0) q.add(v);
        }
        System.out.println(order);
    }
}
`,
  knapsack: `class Main {
    public static void main(String[] args) {
        int[] weights = {1, 3, 4, 5}, values = {1, 4, 5, 7};
        int cap = 7, n = weights.length;
        int[][] dp = new int[n + 1][cap + 1];
        for (int i = 1; i <= n; i++)
            for (int w = 0; w <= cap; w++) {
                dp[i][w] = dp[i - 1][w];
                if (weights[i - 1] <= w)
                    dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            }
        System.out.println("max value: " + dp[n][cap]);
    }
}
`,
  lcs: `class Main {
    public static void main(String[] args) {
        String a = "AGGTAB", b = "GXTXAYB";
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++)
            for (int j = 1; j <= b.length(); j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? dp[i - 1][j - 1] + 1
                    : Math.max(dp[i - 1][j], dp[i][j - 1]);
        System.out.println("LCS length: " + dp[a.length()][b.length()]);
    }
}
`,
  'edit-distance': `class Main {
    public static void main(String[] args) {
        String a = "kitten", b = "sitting";
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;
        for (int i = 1; i <= a.length(); i++)
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost);
            }
        System.out.println("distance: " + dp[a.length()][b.length()]);
    }
}
`,
  'coin-change': `import java.util.*;

class Main {
    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        int amount = 11;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int coin : coins)
            for (int x = coin; x <= amount; x++)
                if (dp[x - coin] != Integer.MAX_VALUE)
                    dp[x] = Math.min(dp[x], dp[x - coin] + 1);
        System.out.println("min coins: " + dp[amount]);
    }
}
`,
  gcd: `class Main {
    static int gcd(int a, int b) {
        while (b != 0) { int t = b; b = a % b; a = t; }
        return a;
    }

    public static void main(String[] args) {
        System.out.println("gcd(48, 36) = " + gcd(48, 36));
        System.out.println("lcm(4, 6) = " + (4 * 6 / gcd(4, 6)));
    }
}
`,
  sieve: `import java.util.*;

class Main {
    public static void main(String[] args) {
        int n = 30;
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int i = 2; i * i <= n; i++)
            if (isPrime[i])
                for (int j = i * i; j <= n; j += i) isPrime[j] = false;
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) if (isPrime[i]) primes.add(i);
        System.out.println(primes);
    }
}
`,
  'fast-power': `class Main {
    static long fastPower(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            base = base * base % mod;
            exp >>= 1;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("2^10 = " + fastPower(2, 10, 1000000007L));
        System.out.println("3^200 mod 1e9+7 = " + fastPower(3, 200, 1000000007L));
    }
}
`,
  'prime-check': `import java.util.*;

class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; (long) i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }

    public static void main(String[] args) {
        List<Integer> primes = new ArrayList<>();
        for (int n = 2; n < 30; n++) if (isPrime(n)) primes.add(n);
        System.out.println(primes);
    }
}
`,
};
