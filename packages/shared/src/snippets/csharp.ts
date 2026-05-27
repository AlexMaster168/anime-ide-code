import type { LangSnippets } from './index';

export const csharpSnippets: LangSnippets = {
  'bubble-sort': `using System;

class Program {
    static void BubbleSort(int[] a) {
        for (int i = 0; i < a.Length; i++)
            for (int j = 0; j < a.Length - i - 1; j++)
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                }
    }

    static void Main() {
        int[] a = {5, 2, 9, 1, 5, 6};
        BubbleSort(a);
        Console.WriteLine(string.Join(" ", a));
    }
}
`,
  'quick-sort': `using System;
using System.Linq;

class Program {
    static int[] QuickSort(int[] a) {
        if (a.Length <= 1) return a;
        int pivot = a[a.Length / 2];
        return QuickSort(a.Where(x => x < pivot).ToArray())
            .Concat(a.Where(x => x == pivot))
            .Concat(QuickSort(a.Where(x => x > pivot).ToArray()))
            .ToArray();
    }

    static void Main() {
        Console.WriteLine(string.Join(" ", QuickSort(new[] {5, 2, 9, 1, 5, 6})));
    }
}
`,
  'binary-search': `using System;

class Program {
    static int BinarySearch(int[] a, int target) {
        int lo = 0, hi = a.Length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    static void Main() {
        int[] a = {1, 3, 5, 7, 9, 11};
        Console.WriteLine("index: " + BinarySearch(a, 7));
    }
}
`,
  'linked-list': `using System;
using System.Text;

class Program {
    class Node {
        public int Value;
        public Node Next;
        public Node(int v) { Value = v; }
    }

    static void Main() {
        Node head = null;
        foreach (int x in new[] {3, 2, 1}) {
            head = new Node(x) { Next = head };
        }
        var sb = new StringBuilder();
        for (var cur = head; cur != null; cur = cur.Next) {
            sb.Append(cur.Value);
            if (cur.Next != null) sb.Append(" -> ");
        }
        Console.WriteLine(sb);
    }
}
`,
  'stack-queue': `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        var stack = new Stack<int>();
        stack.Push(1); stack.Push(2); stack.Push(3);
        Console.WriteLine("stack pop: " + stack.Pop());

        var queue = new Queue<int>();
        queue.Enqueue(1); queue.Enqueue(2); queue.Enqueue(3);
        Console.WriteLine("queue pop: " + queue.Dequeue());
    }
}
`,
  'hash-map': `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        var freq = new SortedDictionary<char, int>();
        foreach (char ch in "abracadabra")
            freq[ch] = freq.GetValueOrDefault(ch, 0) + 1;
        foreach (var kv in freq)
            Console.WriteLine($"{kv.Key}: {kv.Value}");
    }
}
`,
  'binary-tree': `using System;
using System.Collections.Generic;

class Program {
    class TreeNode {
        public int Value;
        public TreeNode Left, Right;
        public TreeNode(int v) { Value = v; }
    }

    static TreeNode Insert(TreeNode root, int value) {
        if (root == null) return new TreeNode(value);
        if (value < root.Value) root.Left = Insert(root.Left, value);
        else root.Right = Insert(root.Right, value);
        return root;
    }

    static void Inorder(TreeNode root, List<int> outp) {
        if (root == null) return;
        Inorder(root.Left, outp);
        outp.Add(root.Value);
        Inorder(root.Right, outp);
    }

    static void Main() {
        TreeNode root = null;
        foreach (int x in new[] {5, 3, 8, 1, 4, 7, 9}) root = Insert(root, x);
        var res = new List<int>();
        Inorder(root, res);
        Console.WriteLine(string.Join(" ", res));
    }
}
`,
  fibonacci: `using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static Dictionary<int, long> memo = new Dictionary<int, long>();

    static long Fib(int n) {
        if (n < 2) return n;
        if (memo.ContainsKey(n)) return memo[n];
        return memo[n] = Fib(n - 1) + Fib(n - 2);
    }

    static void Main() {
        Console.WriteLine(string.Join(" ", Enumerable.Range(0, 10).Select(Fib)));
    }
}
`,
  fizzbuzz: `using System;

class Program {
    static void Main() {
        for (int i = 1; i <= 20; i++) {
            if (i % 15 == 0) Console.WriteLine("FizzBuzz");
            else if (i % 3 == 0) Console.WriteLine("Fizz");
            else if (i % 5 == 0) Console.WriteLine("Buzz");
            else Console.WriteLine(i);
        }
    }
}
`,
  'selection-sort': `using System;

class Program {
    static void Main() {
        int[] a = {5, 2, 9, 1, 5, 6};
        for (int i = 0; i < a.Length; i++) {
            int m = i;
            for (int j = i + 1; j < a.Length; j++) if (a[j] < a[m]) m = j;
            int t = a[i]; a[i] = a[m]; a[m] = t;
        }
        Console.WriteLine(string.Join(" ", a));
    }
}
`,
  'insertion-sort': `using System;

class Program {
    static void Main() {
        int[] a = {5, 2, 9, 1, 5, 6};
        for (int i = 1; i < a.Length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
            a[j + 1] = key;
        }
        Console.WriteLine(string.Join(" ", a));
    }
}
`,
  'merge-sort': `using System;
using System.Linq;

class Program {
    static int[] MergeSort(int[] a) {
        if (a.Length <= 1) return a;
        int mid = a.Length / 2;
        int[] left = MergeSort(a.Take(mid).ToArray());
        int[] right = MergeSort(a.Skip(mid).ToArray());
        var res = new int[a.Length];
        int i = 0, j = 0, k = 0;
        while (i < left.Length && j < right.Length)
            res[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        while (i < left.Length) res[k++] = left[i++];
        while (j < right.Length) res[k++] = right[j++];
        return res;
    }

    static void Main() {
        Console.WriteLine(string.Join(" ", MergeSort(new[] {5, 2, 9, 1, 5, 6})));
    }
}
`,
  'counting-sort': `using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main() {
        int[] a = {5, 2, 9, 1, 5, 6};
        int max = a.Max();
        int[] count = new int[max + 1];
        foreach (int x in a) count[x]++;
        var res = new List<int>();
        for (int v = 0; v <= max; v++)
            for (int c = 0; c < count[v]; c++) res.Add(v);
        Console.WriteLine(string.Join(" ", res));
    }
}
`,
  gcd: `using System;

class Program {
    static int Gcd(int a, int b) {
        while (b != 0) { int t = b; b = a % b; a = t; }
        return a;
    }

    static void Main() {
        Console.WriteLine("gcd(48, 36) = " + Gcd(48, 36));
        Console.WriteLine("lcm(4, 6) = " + (4 * 6 / Gcd(4, 6)));
    }
}
`,
  sieve: `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        int n = 30;
        bool[] isPrime = new bool[n + 1];
        for (int i = 2; i <= n; i++) isPrime[i] = true;
        for (int i = 2; i * i <= n; i++)
            if (isPrime[i])
                for (int j = i * i; j <= n; j += i) isPrime[j] = false;
        var primes = new List<int>();
        for (int i = 2; i <= n; i++) if (isPrime[i]) primes.Add(i);
        Console.WriteLine(string.Join(" ", primes));
    }
}
`,
  'fast-power': `using System;

class Program {
    static long FastPower(long b, long e, long mod) {
        long result = 1;
        b %= mod;
        while (e > 0) {
            if ((e & 1) == 1) result = result * b % mod;
            b = b * b % mod;
            e >>= 1;
        }
        return result;
    }

    static void Main() {
        Console.WriteLine("2^10 = " + FastPower(2, 10, 1000000007L));
        Console.WriteLine("3^200 mod 1e9+7 = " + FastPower(3, 200, 1000000007L));
    }
}
`,
  'prime-check': `using System;
using System.Collections.Generic;

class Program {
    static bool IsPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; (long) i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }

    static void Main() {
        var primes = new List<int>();
        for (int n = 2; n < 30; n++) if (IsPrime(n)) primes.Add(n);
        Console.WriteLine(string.Join(" ", primes));
    }
}
`,
};
