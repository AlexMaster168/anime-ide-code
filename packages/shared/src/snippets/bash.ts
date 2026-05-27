import type { LangSnippets } from './index';

export const bashSnippets: LangSnippets = {
  'bubble-sort': `#!/usr/bin/env bash
a=(5 2 9 1 5 6)
n=\${#a[@]}
for ((i = 0; i < n; i++)); do
  for ((j = 0; j < n - i - 1; j++)); do
    if ((a[j] > a[j + 1])); then
      tmp=\${a[j]}; a[j]=\${a[j + 1]}; a[j + 1]=$tmp
    fi
  done
done
echo "\${a[@]}"
`,
  'binary-search': `#!/usr/bin/env bash
a=(1 3 5 7 9 11)
target=7
lo=0; hi=$((\${#a[@]} - 1)); idx=-1
while ((lo <= hi)); do
  mid=$(((lo + hi) / 2))
  if ((a[mid] == target)); then idx=$mid; break
  elif ((a[mid] < target)); then lo=$((mid + 1))
  else hi=$((mid - 1)); fi
done
echo "index: $idx"
`,
  'stack-queue': `#!/usr/bin/env bash
stack=()
stack+=(1 2 3)
echo "stack pop: \${stack[-1]}"
unset 'stack[-1]'

queue=()
queue+=(1 2 3)
echo "queue pop: \${queue[0]}"
queue=("\${queue[@]:1}")
`,
  fibonacci: `#!/usr/bin/env bash
declare -A memo
fib() {
  local n=$1
  if ((n < 2)); then echo "$n"; return; fi
  if [[ -n \${memo[$n]} ]]; then echo "\${memo[$n]}"; return; fi
  local a b
  a=$(fib $((n - 1)))
  b=$(fib $((n - 2)))
  memo[$n]=$((a + b))
  echo "\${memo[$n]}"
}
for ((i = 0; i < 10; i++)); do printf "%s " "$(fib $i)"; done
echo
`,
  fizzbuzz: `#!/usr/bin/env bash
for ((i = 1; i <= 20; i++)); do
  if ((i % 15 == 0)); then echo "FizzBuzz"
  elif ((i % 3 == 0)); then echo "Fizz"
  elif ((i % 5 == 0)); then echo "Buzz"
  else echo "$i"; fi
done
`,
};
