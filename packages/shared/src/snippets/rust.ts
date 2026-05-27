import type { LangSnippets } from './index';

export const rustSnippets: LangSnippets = {
  'bubble-sort': `fn bubble_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for i in 0..n {
        for j in 0..n - i - 1 {
            if a[j] > a[j + 1] {
                a.swap(j, j + 1);
            }
        }
    }
}

fn main() {
    let mut a = vec![5, 2, 9, 1, 5, 6];
    bubble_sort(&mut a);
    println!("{:?}", a);
}
`,
  'quick-sort': `fn quick_sort(a: Vec<i32>) -> Vec<i32> {
    if a.len() <= 1 {
        return a;
    }
    let pivot = a[a.len() / 2];
    let left: Vec<i32> = a.iter().cloned().filter(|&x| x < pivot).collect();
    let mid: Vec<i32> = a.iter().cloned().filter(|&x| x == pivot).collect();
    let right: Vec<i32> = a.iter().cloned().filter(|&x| x > pivot).collect();
    let mut res = quick_sort(left);
    res.extend(mid);
    res.extend(quick_sort(right));
    res
}

fn main() {
    println!("{:?}", quick_sort(vec![5, 2, 9, 1, 5, 6]));
}
`,
  'binary-search': `fn binary_search(a: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i32, a.len() as i32 - 1);
    while lo <= hi {
        let mid = (lo + hi) / 2;
        if a[mid as usize] == target {
            return mid;
        }
        if a[mid as usize] < target {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    -1
}

fn main() {
    let a = [1, 3, 5, 7, 9, 11];
    println!("index: {}", binary_search(&a, 7));
}
`,
  'linked-list': `#[derive(Debug)]
struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

struct LinkedList {
    head: Option<Box<Node>>,
}

impl LinkedList {
    fn new() -> Self {
        LinkedList { head: None }
    }
    fn push(&mut self, value: i32) {
        let node = Box::new(Node { value, next: self.head.take() });
        self.head = Some(node);
    }
    fn print(&self) {
        let mut cur = &self.head;
        let mut parts = vec![];
        while let Some(node) = cur {
            parts.push(node.value.to_string());
            cur = &node.next;
        }
        println!("{}", parts.join(" -> "));
    }
}

fn main() {
    let mut ll = LinkedList::new();
    for x in [3, 2, 1] {
        ll.push(x);
    }
    ll.print();
}
`,
  'stack-queue': `use std::collections::VecDeque;

fn main() {
    let mut stack: Vec<i32> = Vec::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    println!("stack pop: {:?}", stack.pop());

    let mut queue: VecDeque<i32> = VecDeque::new();
    queue.push_back(1);
    queue.push_back(2);
    queue.push_back(3);
    println!("queue pop: {:?}", queue.pop_front());
}
`,
  'hash-map': `use std::collections::BTreeMap;

fn main() {
    let mut freq: BTreeMap<char, i32> = BTreeMap::new();
    for ch in "abracadabra".chars() {
        *freq.entry(ch).or_insert(0) += 1;
    }
    for (k, v) in &freq {
        println!("{}: {}", k, v);
    }
}
`,
  'binary-tree': `struct TreeNode {
    value: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

fn insert(root: Option<Box<TreeNode>>, value: i32) -> Option<Box<TreeNode>> {
    match root {
        None => Some(Box::new(TreeNode { value, left: None, right: None })),
        Some(mut node) => {
            if value < node.value {
                node.left = insert(node.left.take(), value);
            } else {
                node.right = insert(node.right.take(), value);
            }
            Some(node)
        }
    }
}

fn inorder(root: &Option<Box<TreeNode>>, out: &mut Vec<i32>) {
    if let Some(node) = root {
        inorder(&node.left, out);
        out.push(node.value);
        inorder(&node.right, out);
    }
}

fn main() {
    let mut root = None;
    for x in [5, 3, 8, 1, 4, 7, 9] {
        root = insert(root, x);
    }
    let mut res = vec![];
    inorder(&root, &mut res);
    println!("{:?}", res);
}
`,
  fibonacci: `use std::collections::HashMap;

fn fib(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {
    if n < 2 {
        return n;
    }
    if let Some(&v) = memo.get(&n) {
        return v;
    }
    let result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.insert(n, result);
    result
}

fn main() {
    let mut memo = HashMap::new();
    let res: Vec<u64> = (0..10).map(|i| fib(i, &mut memo)).collect();
    println!("{:?}", res);
}
`,
  fizzbuzz: `fn main() {
    for i in 1..=20 {
        match (i % 3, i % 5) {
            (0, 0) => println!("FizzBuzz"),
            (0, _) => println!("Fizz"),
            (_, 0) => println!("Buzz"),
            _ => println!("{}", i),
        }
    }
}
`,
  'selection-sort': `fn main() {
    let mut a = vec![5, 2, 9, 1, 5, 6];
    for i in 0..a.len() {
        let mut m = i;
        for j in i + 1..a.len() {
            if a[j] < a[m] {
                m = j;
            }
        }
        a.swap(i, m);
    }
    println!("{:?}", a);
}
`,
  'insertion-sort': `fn main() {
    let mut a = vec![5, 2, 9, 1, 5, 6];
    for i in 1..a.len() {
        let key = a[i];
        let mut j = i as i32 - 1;
        while j >= 0 && a[j as usize] > key {
            a[(j + 1) as usize] = a[j as usize];
            j -= 1;
        }
        a[(j + 1) as usize] = key;
    }
    println!("{:?}", a);
}
`,
  'merge-sort': `fn merge_sort(a: Vec<i32>) -> Vec<i32> {
    if a.len() <= 1 {
        return a;
    }
    let mid = a.len() / 2;
    let left = merge_sort(a[..mid].to_vec());
    let right = merge_sort(a[mid..].to_vec());
    let mut res = Vec::with_capacity(a.len());
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            res.push(left[i]);
            i += 1;
        } else {
            res.push(right[j]);
            j += 1;
        }
    }
    res.extend_from_slice(&left[i..]);
    res.extend_from_slice(&right[j..]);
    res
}

fn main() {
    println!("{:?}", merge_sort(vec![5, 2, 9, 1, 5, 6]));
}
`,
  'counting-sort': `fn main() {
    let a = vec![5, 2, 9, 1, 5, 6];
    let mx = *a.iter().max().unwrap();
    let mut count = vec![0; (mx + 1) as usize];
    for &x in &a {
        count[x as usize] += 1;
    }
    let mut res = Vec::new();
    for (v, &c) in count.iter().enumerate() {
        for _ in 0..c {
            res.push(v);
        }
    }
    println!("{:?}", res);
}
`,
  gcd: `fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let t = b;
        b = a % b;
        a = t;
    }
    a
}

fn main() {
    println!("gcd(48, 36) = {}", gcd(48, 36));
    println!("lcm(4, 6) = {}", 4 * 6 / gcd(4, 6));
}
`,
  sieve: `fn main() {
    let n = 30;
    let mut is_prime = vec![true; n + 1];
    is_prime[0] = false;
    is_prime[1] = false;
    let mut i = 2;
    while i * i <= n {
        if is_prime[i] {
            let mut j = i * i;
            while j <= n {
                is_prime[j] = false;
                j += i;
            }
        }
        i += 1;
    }
    let primes: Vec<usize> = (2..=n).filter(|&i| is_prime[i]).collect();
    println!("{:?}", primes);
}
`,
  'fast-power': `fn fast_power(mut base: u64, mut exp: u64, modulo: u64) -> u64 {
    let mut result = 1u64;
    base %= modulo;
    while exp > 0 {
        if exp & 1 == 1 {
            result = result * base % modulo;
        }
        base = base * base % modulo;
        exp >>= 1;
    }
    result
}

fn main() {
    println!("2^10 = {}", fast_power(2, 10, 1_000_000_007));
    println!("3^200 mod 1e9+7 = {}", fast_power(3, 200, 1_000_000_007));
}
`,
  'prime-check': `fn is_prime(n: u64) -> bool {
    if n < 2 {
        return false;
    }
    let mut i = 2;
    while i * i <= n {
        if n % i == 0 {
            return false;
        }
        i += 1;
    }
    true
}

fn main() {
    let primes: Vec<u64> = (2..30).filter(|&n| is_prime(n)).collect();
    println!("{:?}", primes);
}
`,
};
