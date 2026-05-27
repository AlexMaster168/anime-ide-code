import type { LangSnippets } from './index';

export const phpSnippets: LangSnippets = {
  'bubble-sort': `<?php
function bubble_sort(array $a): array {
    $n = count($a);
    for ($i = 0; $i < $n; $i++)
        for ($j = 0; $j < $n - $i - 1; $j++)
            if ($a[$j] > $a[$j + 1]) {
                [$a[$j], $a[$j + 1]] = [$a[$j + 1], $a[$j]];
            }
    return $a;
}

print_r(bubble_sort([5, 2, 9, 1, 5, 6]));
`,
  'quick-sort': `<?php
function quick_sort(array $a): array {
    if (count($a) <= 1) return $a;
    $pivot = $a[intdiv(count($a), 2)];
    $left  = array_filter($a, fn($x) => $x < $pivot);
    $mid   = array_filter($a, fn($x) => $x === $pivot);
    $right = array_filter($a, fn($x) => $x > $pivot);
    return array_merge(quick_sort(array_values($left)), array_values($mid), quick_sort(array_values($right)));
}

print_r(quick_sort([5, 2, 9, 1, 5, 6]));
`,
  'binary-search': `<?php
function binary_search(array $a, int $target): int {
    $lo = 0; $hi = count($a) - 1;
    while ($lo <= $hi) {
        $mid = intdiv($lo + $hi, 2);
        if ($a[$mid] === $target) return $mid;
        if ($a[$mid] < $target) $lo = $mid + 1;
        else $hi = $mid - 1;
    }
    return -1;
}

echo "index: " . binary_search([1, 3, 5, 7, 9, 11], 7) . "\\n";
`,
  'linked-list': `<?php
class Node {
    public ?Node $next = null;
    public function __construct(public int $value) {}
}

class LinkedList {
    private ?Node $head = null;
    public function push(int $value): void {
        $node = new Node($value);
        $node->next = $this->head;
        $this->head = $node;
    }
    public function __toString(): string {
        $out = [];
        for ($cur = $this->head; $cur; $cur = $cur->next) $out[] = $cur->value;
        return implode(" -> ", $out);
    }
}

$ll = new LinkedList();
foreach ([3, 2, 1] as $x) $ll->push($x);
echo $ll . "\\n";
`,
  'stack-queue': `<?php
$stack = [];
array_push($stack, 1, 2, 3);
echo "stack pop: " . array_pop($stack) . "\\n";

$queue = [];
array_push($queue, 1, 2, 3);
echo "queue pop: " . array_shift($queue) . "\\n";
`,
  'hash-map': `<?php
$freq = [];
foreach (str_split("abracadabra") as $ch) {
    $freq[$ch] = ($freq[$ch] ?? 0) + 1;
}
ksort($freq);
foreach ($freq as $k => $v) echo "$k: $v\\n";
`,
  fibonacci: `<?php
function fib(int $n, array &$memo = []): int {
    if ($n < 2) return $n;
    return $memo[$n] ??= fib($n - 1, $memo) + fib($n - 2, $memo);
}

$res = [];
for ($i = 0; $i < 10; $i++) $res[] = fib($i);
echo implode(" ", $res) . "\\n";
`,
  fizzbuzz: `<?php
for ($i = 1; $i <= 20; $i++) {
    if ($i % 15 === 0) echo "FizzBuzz\\n";
    elseif ($i % 3 === 0) echo "Fizz\\n";
    elseif ($i % 5 === 0) echo "Buzz\\n";
    else echo "$i\\n";
}
`,
  'selection-sort': `<?php
$a = [5, 2, 9, 1, 5, 6];
$n = count($a);
for ($i = 0; $i < $n; $i++) {
    $m = $i;
    for ($j = $i + 1; $j < $n; $j++) if ($a[$j] < $a[$m]) $m = $j;
    [$a[$i], $a[$m]] = [$a[$m], $a[$i]];
}
echo implode(" ", $a) . "\\n";
`,
  'insertion-sort': `<?php
$a = [5, 2, 9, 1, 5, 6];
for ($i = 1; $i < count($a); $i++) {
    $key = $a[$i];
    $j = $i - 1;
    while ($j >= 0 && $a[$j] > $key) { $a[$j + 1] = $a[$j]; $j--; }
    $a[$j + 1] = $key;
}
echo implode(" ", $a) . "\\n";
`,
  'merge-sort': `<?php
function merge_sort(array $a): array {
    if (count($a) <= 1) return $a;
    $mid = intdiv(count($a), 2);
    $left = merge_sort(array_slice($a, 0, $mid));
    $right = merge_sort(array_slice($a, $mid));
    $res = [];
    $i = $j = 0;
    while ($i < count($left) && $j < count($right)) {
        $res[] = $left[$i] <= $right[$j] ? $left[$i++] : $right[$j++];
    }
    return array_merge($res, array_slice($left, $i), array_slice($right, $j));
}

echo implode(" ", merge_sort([5, 2, 9, 1, 5, 6])) . "\\n";
`,
  'counting-sort': `<?php
$a = [5, 2, 9, 1, 5, 6];
$mx = max($a);
$count = array_fill(0, $mx + 1, 0);
foreach ($a as $x) $count[$x]++;
$res = [];
foreach ($count as $v => $c) for ($k = 0; $k < $c; $k++) $res[] = $v;
echo implode(" ", $res) . "\\n";
`,
  gcd: `<?php
function gcd(int $a, int $b): int {
    while ($b) { $t = $b; $b = $a % $b; $a = $t; }
    return $a;
}

echo "gcd(48, 36) = " . gcd(48, 36) . "\\n";
echo "lcm(4, 6) = " . (4 * 6 / gcd(4, 6)) . "\\n";
`,
  sieve: `<?php
$n = 30;
$is_prime = array_fill(0, $n + 1, true);
$is_prime[0] = $is_prime[1] = false;
for ($i = 2; $i * $i <= $n; $i++) {
    if ($is_prime[$i])
        for ($j = $i * $i; $j <= $n; $j += $i) $is_prime[$j] = false;
}
$primes = [];
for ($i = 2; $i <= $n; $i++) if ($is_prime[$i]) $primes[] = $i;
echo implode(" ", $primes) . "\\n";
`,
  'fast-power': `<?php
function fast_power(int $base, int $exp, int $mod = 1000000007): int {
    $result = 1;
    $base %= $mod;
    while ($exp > 0) {
        if ($exp & 1) $result = $result * $base % $mod;
        $base = $base * $base % $mod;
        $exp >>= 1;
    }
    return $result;
}

echo "2^10 = " . fast_power(2, 10) . "\\n";
echo "3^200 mod 1e9+7 = " . fast_power(3, 200) . "\\n";
`,
  'prime-check': `<?php
function is_prime(int $n): bool {
    if ($n < 2) return false;
    for ($i = 2; $i * $i <= $n; $i++) if ($n % $i === 0) return false;
    return true;
}

$primes = [];
for ($n = 2; $n < 30; $n++) if (is_prime($n)) $primes[] = $n;
echo implode(" ", $primes) . "\\n";
`,
};
