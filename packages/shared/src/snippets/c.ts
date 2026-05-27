import type { LangSnippets } from './index';

export const cSnippets: LangSnippets = {
  'bubble-sort': `#include <stdio.h>

void bubble_sort(int a[], int n) {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
}

int main(void) {
    int a[] = {5, 2, 9, 1, 5, 6};
    int n = sizeof(a) / sizeof(a[0]);
    bubble_sort(a, n);
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}
`,
  'quick-sort': `#include <stdio.h>

void quick_sort(int a[], int lo, int hi) {
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
    quick_sort(a, lo, j);
    quick_sort(a, i, hi);
}

int main(void) {
    int a[] = {5, 2, 9, 1, 5, 6};
    int n = sizeof(a) / sizeof(a[0]);
    quick_sort(a, 0, n - 1);
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}
`,
  'binary-search': `#include <stdio.h>

int binary_search(int a[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main(void) {
    int a[] = {1, 3, 5, 7, 9, 11};
    printf("index: %d\\n", binary_search(a, 6, 7));
    return 0;
}
`,
  'linked-list': `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node* next;
} Node;

int main(void) {
    Node* head = NULL;
    int items[] = {3, 2, 1};
    for (int i = 0; i < 3; i++) {
        Node* node = malloc(sizeof(Node));
        node->value = items[i];
        node->next = head;
        head = node;
    }
    for (Node* cur = head; cur; cur = cur->next) {
        printf("%d", cur->value);
        if (cur->next) printf(" -> ");
    }
    printf("\\n");
    return 0;
}
`,
  'stack-queue': `#include <stdio.h>

int main(void) {
    int stack[100], top = 0;
    stack[top++] = 1;
    stack[top++] = 2;
    stack[top++] = 3;
    printf("stack pop: %d\\n", stack[--top]);

    int queue[100], head = 0, tail = 0;
    queue[tail++] = 1;
    queue[tail++] = 2;
    queue[tail++] = 3;
    printf("queue pop: %d\\n", queue[head++]);
    return 0;
}
`,
  'binary-tree': `#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int value;
    struct TreeNode *left, *right;
} TreeNode;

TreeNode* insert(TreeNode* root, int value) {
    if (!root) {
        TreeNode* n = malloc(sizeof(TreeNode));
        n->value = value; n->left = n->right = NULL;
        return n;
    }
    if (value < root->value) root->left = insert(root->left, value);
    else root->right = insert(root->right, value);
    return root;
}

void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->value);
    inorder(root->right);
}

int main(void) {
    TreeNode* root = NULL;
    int items[] = {5, 3, 8, 1, 4, 7, 9};
    for (int i = 0; i < 7; i++) root = insert(root, items[i]);
    inorder(root);
    printf("\\n");
    return 0;
}
`,
  fibonacci: `#include <stdio.h>

long long memo[64];

long long fib(int n) {
    if (n < 2) return n;
    if (memo[n]) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}

int main(void) {
    for (int i = 0; i < 10; i++) printf("%lld ", fib(i));
    printf("\\n");
    return 0;
}
`,
  fizzbuzz: `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 20; i++) {
        if (i % 15 == 0) printf("FizzBuzz\\n");
        else if (i % 3 == 0) printf("Fizz\\n");
        else if (i % 5 == 0) printf("Buzz\\n");
        else printf("%d\\n", i);
    }
    return 0;
}
`,
  'selection-sort': `#include <stdio.h>

int main(void) {
    int a[] = {5, 2, 9, 1, 5, 6};
    int n = sizeof(a) / sizeof(a[0]);
    for (int i = 0; i < n; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++) if (a[j] < a[m]) m = j;
        int t = a[i]; a[i] = a[m]; a[m] = t;
    }
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}
`,
  'insertion-sort': `#include <stdio.h>

int main(void) {
    int a[] = {5, 2, 9, 1, 5, 6};
    int n = sizeof(a) / sizeof(a[0]);
    for (int i = 1; i < n; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
        a[j + 1] = key;
    }
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}
`,
  'counting-sort': `#include <stdio.h>

int main(void) {
    int a[] = {5, 2, 9, 1, 5, 6};
    int n = sizeof(a) / sizeof(a[0]), mx = a[0];
    for (int i = 1; i < n; i++) if (a[i] > mx) mx = a[i];
    int count[100] = {0};
    for (int i = 0; i < n; i++) count[a[i]]++;
    for (int v = 0; v <= mx; v++)
        for (int c = 0; c < count[v]; c++) printf("%d ", v);
    printf("\\n");
    return 0;
}
`,
  gcd: `#include <stdio.h>

int gcd(int a, int b) {
    while (b) { int t = b; b = a % b; a = t; }
    return a;
}

int main(void) {
    printf("gcd(48, 36) = %d\\n", gcd(48, 36));
    printf("lcm(4, 6) = %d\\n", 4 * 6 / gcd(4, 6));
    return 0;
}
`,
  sieve: `#include <stdio.h>
#include <string.h>

int main(void) {
    int n = 30;
    int is_prime[31];
    for (int i = 0; i <= n; i++) is_prime[i] = 1;
    is_prime[0] = is_prime[1] = 0;
    for (int i = 2; i * i <= n; i++)
        if (is_prime[i])
            for (int j = i * i; j <= n; j += i) is_prime[j] = 0;
    for (int i = 2; i <= n; i++) if (is_prime[i]) printf("%d ", i);
    printf("\\n");
    return 0;
}
`,
  'fast-power': `#include <stdio.h>

long long fast_power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

int main(void) {
    printf("2^10 = %lld\\n", fast_power(2, 10, 1000000007LL));
    printf("3^200 mod 1e9+7 = %lld\\n", fast_power(3, 200, 1000000007LL));
    return 0;
}
`,
  'prime-check': `#include <stdio.h>

int is_prime(int n) {
    if (n < 2) return 0;
    for (int i = 2; (long long)i * i <= n; i++)
        if (n % i == 0) return 0;
    return 1;
}

int main(void) {
    for (int n = 2; n < 30; n++) if (is_prime(n)) printf("%d ", n);
    printf("\\n");
    return 0;
}
`,
};
