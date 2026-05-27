import type { LangSnippets } from './index';

export const goSnippets: LangSnippets = {
  'bubble-sort': `package main

import "fmt"

func bubbleSort(a []int) {
	for i := 0; i < len(a); i++ {
		for j := 0; j < len(a)-i-1; j++ {
			if a[j] > a[j+1] {
				a[j], a[j+1] = a[j+1], a[j]
			}
		}
	}
}

func main() {
	a := []int{5, 2, 9, 1, 5, 6}
	bubbleSort(a)
	fmt.Println(a)
}
`,
  'quick-sort': `package main

import "fmt"

func quickSort(a []int) []int {
	if len(a) <= 1 {
		return a
	}
	pivot := a[len(a)/2]
	var left, mid, right []int
	for _, x := range a {
		switch {
		case x < pivot:
			left = append(left, x)
		case x == pivot:
			mid = append(mid, x)
		default:
			right = append(right, x)
		}
	}
	res := append(quickSort(left), mid...)
	return append(res, quickSort(right)...)
}

func main() {
	fmt.Println(quickSort([]int{5, 2, 9, 1, 5, 6}))
}
`,
  'binary-search': `package main

import "fmt"

func binarySearch(a []int, target int) int {
	lo, hi := 0, len(a)-1
	for lo <= hi {
		mid := (lo + hi) / 2
		if a[mid] == target {
			return mid
		}
		if a[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return -1
}

func main() {
	fmt.Println("index:", binarySearch([]int{1, 3, 5, 7, 9, 11}, 7))
}
`,
  'linked-list': `package main

import (
	"fmt"
	"strings"
)

type Node struct {
	value int
	next  *Node
}

type LinkedList struct{ head *Node }

func (l *LinkedList) Push(v int) {
	l.head = &Node{value: v, next: l.head}
}

func (l *LinkedList) String() string {
	var parts []string
	for cur := l.head; cur != nil; cur = cur.next {
		parts = append(parts, fmt.Sprint(cur.value))
	}
	return strings.Join(parts, " -> ")
}

func main() {
	ll := &LinkedList{}
	for _, x := range []int{3, 2, 1} {
		ll.Push(x)
	}
	fmt.Println(ll)
}
`,
  'stack-queue': `package main

import "fmt"

func main() {
	stack := []int{}
	stack = append(stack, 1, 2, 3)
	top := stack[len(stack)-1]
	stack = stack[:len(stack)-1]
	fmt.Println("stack pop:", top)

	queue := []int{}
	queue = append(queue, 1, 2, 3)
	front := queue[0]
	queue = queue[1:]
	fmt.Println("queue pop:", front)
}
`,
  'hash-map': `package main

import (
	"fmt"
	"sort"
)

func main() {
	freq := map[rune]int{}
	for _, ch := range "abracadabra" {
		freq[ch]++
	}
	keys := make([]string, 0, len(freq))
	for k := range freq {
		keys = append(keys, string(k))
	}
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Printf("%s: %d\\n", k, freq[rune(k[0])])
	}
}
`,
  'binary-tree': `package main

import "fmt"

type TreeNode struct {
	value       int
	left, right *TreeNode
}

func insert(root *TreeNode, value int) *TreeNode {
	if root == nil {
		return &TreeNode{value: value}
	}
	if value < root.value {
		root.left = insert(root.left, value)
	} else {
		root.right = insert(root.right, value)
	}
	return root
}

func inorder(root *TreeNode, out *[]int) {
	if root != nil {
		inorder(root.left, out)
		*out = append(*out, root.value)
		inorder(root.right, out)
	}
}

func main() {
	var root *TreeNode
	for _, x := range []int{5, 3, 8, 1, 4, 7, 9} {
		root = insert(root, x)
	}
	var res []int
	inorder(root, &res)
	fmt.Println(res)
}
`,
  'graph-bfs-dfs': `package main

import "fmt"

var graph = map[string][]string{
	"A": {"B", "C"}, "B": {"A", "D", "E"}, "C": {"A", "F"},
	"D": {"B"}, "E": {"B", "F"}, "F": {"C", "E"},
}

func bfs(start string) []string {
	visited := map[string]bool{start: true}
	queue, order := []string{start}, []string{}
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		order = append(order, node)
		for _, n := range graph[node] {
			if !visited[n] {
				visited[n] = true
				queue = append(queue, n)
			}
		}
	}
	return order
}

func dfs(node string, visited map[string]bool, order *[]string) {
	visited[node] = true
	*order = append(*order, node)
	for _, n := range graph[node] {
		if !visited[n] {
			dfs(n, visited, order)
		}
	}
}

func main() {
	fmt.Println("BFS:", bfs("A"))
	var order []string
	dfs("A", map[string]bool{}, &order)
	fmt.Println("DFS:", order)
}
`,
  fibonacci: `package main

import "fmt"

var memo = map[int]int{}

func fib(n int) int {
	if n < 2 {
		return n
	}
	if v, ok := memo[n]; ok {
		return v
	}
	memo[n] = fib(n-1) + fib(n-2)
	return memo[n]
}

func main() {
	res := []int{}
	for i := 0; i < 10; i++ {
		res = append(res, fib(i))
	}
	fmt.Println(res)
}
`,
  fizzbuzz: `package main

import "fmt"

func main() {
	for i := 1; i <= 20; i++ {
		switch {
		case i%15 == 0:
			fmt.Println("FizzBuzz")
		case i%3 == 0:
			fmt.Println("Fizz")
		case i%5 == 0:
			fmt.Println("Buzz")
		default:
			fmt.Println(i)
		}
	}
}
`,
  'selection-sort': `package main

import "fmt"

func main() {
	a := []int{5, 2, 9, 1, 5, 6}
	for i := 0; i < len(a); i++ {
		m := i
		for j := i + 1; j < len(a); j++ {
			if a[j] < a[m] {
				m = j
			}
		}
		a[i], a[m] = a[m], a[i]
	}
	fmt.Println(a)
}
`,
  'insertion-sort': `package main

import "fmt"

func main() {
	a := []int{5, 2, 9, 1, 5, 6}
	for i := 1; i < len(a); i++ {
		key, j := a[i], i-1
		for j >= 0 && a[j] > key {
			a[j+1] = a[j]
			j--
		}
		a[j+1] = key
	}
	fmt.Println(a)
}
`,
  'merge-sort': `package main

import "fmt"

func mergeSort(a []int) []int {
	if len(a) <= 1 {
		return a
	}
	mid := len(a) / 2
	left := mergeSort(a[:mid])
	right := mergeSort(a[mid:])
	res := []int{}
	i, j := 0, 0
	for i < len(left) && j < len(right) {
		if left[i] <= right[j] {
			res = append(res, left[i])
			i++
		} else {
			res = append(res, right[j])
			j++
		}
	}
	res = append(res, left[i:]...)
	res = append(res, right[j:]...)
	return res
}

func main() {
	fmt.Println(mergeSort([]int{5, 2, 9, 1, 5, 6}))
}
`,
  'counting-sort': `package main

import "fmt"

func main() {
	a := []int{5, 2, 9, 1, 5, 6}
	mx := a[0]
	for _, x := range a {
		if x > mx {
			mx = x
		}
	}
	count := make([]int, mx+1)
	for _, x := range a {
		count[x]++
	}
	res := []int{}
	for v, c := range count {
		for ; c > 0; c-- {
			res = append(res, v)
		}
	}
	fmt.Println(res)
}
`,
  knapsack: `package main

import "fmt"

func main() {
	weights := []int{1, 3, 4, 5}
	values := []int{1, 4, 5, 7}
	cap, n := 7, 4
	dp := make([][]int, n+1)
	for i := range dp {
		dp[i] = make([]int, cap+1)
	}
	for i := 1; i <= n; i++ {
		for w := 0; w <= cap; w++ {
			dp[i][w] = dp[i-1][w]
			if weights[i-1] <= w {
				v := dp[i-1][w-weights[i-1]] + values[i-1]
				if v > dp[i][w] {
					dp[i][w] = v
				}
			}
		}
	}
	fmt.Println("max value:", dp[n][cap])
}
`,
  lcs: `package main

import "fmt"

func main() {
	a, b := "AGGTAB", "GXTXAYB"
	dp := make([][]int, len(a)+1)
	for i := range dp {
		dp[i] = make([]int, len(b)+1)
	}
	for i := 1; i <= len(a); i++ {
		for j := 1; j <= len(b); j++ {
			if a[i-1] == b[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else if dp[i-1][j] > dp[i][j-1] {
				dp[i][j] = dp[i-1][j]
			} else {
				dp[i][j] = dp[i][j-1]
			}
		}
	}
	fmt.Println("LCS length:", dp[len(a)][len(b)])
}
`,
  'edit-distance': `package main

import "fmt"

func min3(a, b, c int) int {
	m := a
	if b < m {
		m = b
	}
	if c < m {
		m = c
	}
	return m
}

func main() {
	a, b := "kitten", "sitting"
	dp := make([][]int, len(a)+1)
	for i := range dp {
		dp[i] = make([]int, len(b)+1)
		dp[i][0] = i
	}
	for j := 0; j <= len(b); j++ {
		dp[0][j] = j
	}
	for i := 1; i <= len(a); i++ {
		for j := 1; j <= len(b); j++ {
			cost := 1
			if a[i-1] == b[j-1] {
				cost = 0
			}
			dp[i][j] = min3(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)
		}
	}
	fmt.Println("distance:", dp[len(a)][len(b)])
}
`,
  'coin-change': `package main

import "fmt"

func main() {
	coins := []int{1, 2, 5}
	amount := 11
	const INF = 1 << 30
	dp := make([]int, amount+1)
	for i := 1; i <= amount; i++ {
		dp[i] = INF
	}
	for _, coin := range coins {
		for x := coin; x <= amount; x++ {
			if dp[x-coin]+1 < dp[x] {
				dp[x] = dp[x-coin] + 1
			}
		}
	}
	fmt.Println("min coins:", dp[amount])
}
`,
  gcd: `package main

import "fmt"

func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}

func main() {
	fmt.Println("gcd(48, 36) =", gcd(48, 36))
	fmt.Println("lcm(4, 6) =", 4*6/gcd(4, 6))
}
`,
  sieve: `package main

import "fmt"

func main() {
	n := 30
	isPrime := make([]bool, n+1)
	for i := 2; i <= n; i++ {
		isPrime[i] = true
	}
	for i := 2; i*i <= n; i++ {
		if isPrime[i] {
			for j := i * i; j <= n; j += i {
				isPrime[j] = false
			}
		}
	}
	primes := []int{}
	for i := 2; i <= n; i++ {
		if isPrime[i] {
			primes = append(primes, i)
		}
	}
	fmt.Println(primes)
}
`,
  'fast-power': `package main

import "fmt"

func fastPower(base, exp, mod int64) int64 {
	result := int64(1)
	base %= mod
	for exp > 0 {
		if exp&1 == 1 {
			result = result * base % mod
		}
		base = base * base % mod
		exp >>= 1
	}
	return result
}

func main() {
	fmt.Println("2^10 =", fastPower(2, 10, 1000000007))
	fmt.Println("3^200 mod 1e9+7 =", fastPower(3, 200, 1000000007))
}
`,
  'prime-check': `package main

import "fmt"

func isPrime(n int) bool {
	if n < 2 {
		return false
	}
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			return false
		}
	}
	return true
}

func main() {
	primes := []int{}
	for n := 2; n < 30; n++ {
		if isPrime(n) {
			primes = append(primes, n)
		}
	}
	fmt.Println(primes)
}
`,
};
