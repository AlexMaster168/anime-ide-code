import type { LangSnippets } from './index';

export const rubySnippets: LangSnippets = {
  'bubble-sort': `def bubble_sort(a)
  n = a.length
  (0...n).each do |i|
    (0...n - i - 1).each do |j|
      a[j], a[j + 1] = a[j + 1], a[j] if a[j] > a[j + 1]
    end
  end
  a
end

p bubble_sort([5, 2, 9, 1, 5, 6])
`,
  'quick-sort': `def quick_sort(a)
  return a if a.length <= 1
  pivot = a[a.length / 2]
  left  = a.select { |x| x < pivot }
  mid   = a.select { |x| x == pivot }
  right = a.select { |x| x > pivot }
  quick_sort(left) + mid + quick_sort(right)
end

p quick_sort([5, 2, 9, 1, 5, 6])
`,
  'binary-search': `def binary_search(a, target)
  lo, hi = 0, a.length - 1
  while lo <= hi
    mid = (lo + hi) / 2
    return mid if a[mid] == target
    if a[mid] < target
      lo = mid + 1
    else
      hi = mid - 1
    end
  end
  -1
end

puts "index: #{binary_search([1, 3, 5, 7, 9, 11], 7)}"
`,
  'linked-list': `class Node
  attr_accessor :value, :next
  def initialize(value)
    @value = value
    @next = nil
  end
end

class LinkedList
  def initialize
    @head = nil
  end

  def push(value)
    node = Node.new(value)
    node.next = @head
    @head = node
  end

  def to_s
    out = []
    cur = @head
    while cur
      out << cur.value
      cur = cur.next
    end
    out.join(" -> ")
  end
end

ll = LinkedList.new
[3, 2, 1].each { |x| ll.push(x) }
puts ll
`,
  'stack-queue': `stack = []
stack.push(1, 2, 3)
puts "stack pop: #{stack.pop}"

queue = []
queue.push(1, 2, 3)
puts "queue pop: #{queue.shift}"
`,
  'hash-map': `freq = Hash.new(0)
"abracadabra".each_char { |ch| freq[ch] += 1 }
freq.sort.each { |k, v| puts "#{k}: #{v}" }
`,
  'binary-tree': `class TreeNode
  attr_accessor :value, :left, :right
  def initialize(value)
    @value = value
  end
end

def insert(root, value)
  return TreeNode.new(value) if root.nil?
  if value < root.value
    root.left = insert(root.left, value)
  else
    root.right = insert(root.right, value)
  end
  root
end

def inorder(root, out)
  return unless root
  inorder(root.left, out)
  out << root.value
  inorder(root.right, out)
  out
end

root = nil
[5, 3, 8, 1, 4, 7, 9].each { |x| root = insert(root, x) }
p inorder(root, [])
`,
  fibonacci: `@memo = {}

def fib(n)
  return n if n < 2
  @memo[n] ||= fib(n - 1) + fib(n - 2)
end

p (0...10).map { |i| fib(i) }
`,
  fizzbuzz: `(1..20).each do |i|
  if i % 15 == 0
    puts "FizzBuzz"
  elsif i % 3 == 0
    puts "Fizz"
  elsif i % 5 == 0
    puts "Buzz"
  else
    puts i
  end
end
`,
  'selection-sort': `def selection_sort(a)
  a.each_index do |i|
    m = i
    (i + 1...a.length).each { |j| m = j if a[j] < a[m] }
    a[i], a[m] = a[m], a[i]
  end
  a
end

p selection_sort([5, 2, 9, 1, 5, 6])
`,
  'insertion-sort': `def insertion_sort(a)
  (1...a.length).each do |i|
    key = a[i]
    j = i - 1
    while j >= 0 && a[j] > key
      a[j + 1] = a[j]
      j -= 1
    end
    a[j + 1] = key
  end
  a
end

p insertion_sort([5, 2, 9, 1, 5, 6])
`,
  'merge-sort': `def merge_sort(a)
  return a if a.length <= 1
  mid = a.length / 2
  left = merge_sort(a[0...mid])
  right = merge_sort(a[mid..])
  res = []
  until left.empty? || right.empty?
    res << (left.first <= right.first ? left.shift : right.shift)
  end
  res + left + right
end

p merge_sort([5, 2, 9, 1, 5, 6])
`,
  'counting-sort': `def counting_sort(a)
  mx = a.max
  count = Array.new(mx + 1, 0)
  a.each { |x| count[x] += 1 }
  res = []
  count.each_with_index { |c, v| c.times { res << v } }
  res
end

p counting_sort([5, 2, 9, 1, 5, 6])
`,
  gcd: `def gcd(a, b)
  a, b = b, a % b while b != 0
  a
end

puts "gcd(48, 36) = #{gcd(48, 36)}"
puts "lcm(4, 6) = #{4 * 6 / gcd(4, 6)}"
`,
  sieve: `def sieve(n)
  is_prime = Array.new(n + 1, true)
  is_prime[0] = is_prime[1] = false
  (2..Math.sqrt(n)).each do |i|
    next unless is_prime[i]
    (i * i..n).step(i) { |j| is_prime[j] = false }
  end
  (2..n).select { |i| is_prime[i] }
end

p sieve(30)
`,
  'fast-power': `def fast_power(base, exp, mod = 1_000_000_007)
  result = 1
  base %= mod
  while exp > 0
    result = result * base % mod if exp.odd?
    base = base * base % mod
    exp >>= 1
  end
  result
end

puts "2^10 = #{fast_power(2, 10)}"
puts "3^200 mod 1e9+7 = #{fast_power(3, 200)}"
`,
  'prime-check': `def prime?(n)
  return false if n < 2
  i = 2
  while i * i <= n
    return false if n % i == 0
    i += 1
  end
  true
end

p (2...30).select { |n| prime?(n) }
`,
};
