import type { LangSnippets } from './index';

export const cppSnippets: LangSnippets = {
  'bubble-sort': `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& a) {
    for (size_t i = 0; i < a.size(); i++)
        for (size_t j = 0; j + i + 1 < a.size(); j++)
            if (a[j] > a[j + 1]) swap(a[j], a[j + 1]);
}

int main() {
    vector<int> a = {5, 2, 9, 1, 5, 6};
    bubbleSort(a);
    for (int x : a) cout << x << ' ';
    cout << endl;
}
`,
  'quick-sort': `#include <iostream>
#include <vector>
using namespace std;

void quickSort(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[(lo + hi) / 2], i = lo, j = hi;
    while (i <= j) {
        while (a[i] < pivot) i++;
        while (a[j] > pivot) j--;
        if (i <= j) swap(a[i++], a[j--]);
    }
    quickSort(a, lo, j);
    quickSort(a, i, hi);
}

int main() {
    vector<int> a = {5, 2, 9, 1, 5, 6};
    quickSort(a, 0, a.size() - 1);
    for (int x : a) cout << x << ' ';
    cout << endl;
}
`,
  'binary-search': `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& a, int target) {
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> a = {1, 3, 5, 7, 9, 11};
    cout << "index: " << binarySearch(a, 7) << endl;
}
`,
  'linked-list': `#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

int main() {
    Node* head = nullptr;
    for (int x : {3, 2, 1}) {
        Node* node = new Node(x);
        node->next = head;
        head = node;
    }
    for (Node* cur = head; cur; cur = cur->next) {
        cout << cur->value;
        if (cur->next) cout << " -> ";
    }
    cout << endl;
}
`,
  'stack-queue': `#include <iostream>
#include <stack>
#include <queue>
using namespace std;

int main() {
    stack<int> st;
    st.push(1); st.push(2); st.push(3);
    cout << "stack pop: " << st.top() << endl;

    queue<int> q;
    q.push(1); q.push(2); q.push(3);
    cout << "queue pop: " << q.front() << endl;
}
`,
  'hash-map': `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<char, int> freq;
    for (char ch : string("abracadabra")) freq[ch]++;
    for (auto& [k, v] : freq) cout << k << ": " << v << endl;
}
`,
  'binary-tree': `#include <iostream>
#include <vector>
using namespace std;

struct TreeNode {
    int value;
    TreeNode *left = nullptr, *right = nullptr;
    TreeNode(int v) : value(v) {}
};

TreeNode* insert(TreeNode* root, int value) {
    if (!root) return new TreeNode(value);
    if (value < root->value) root->left = insert(root->left, value);
    else root->right = insert(root->right, value);
    return root;
}

void inorder(TreeNode* root, vector<int>& out) {
    if (!root) return;
    inorder(root->left, out);
    out.push_back(root->value);
    inorder(root->right, out);
}

int main() {
    TreeNode* root = nullptr;
    for (int x : {5, 3, 8, 1, 4, 7, 9}) root = insert(root, x);
    vector<int> res;
    inorder(root, res);
    for (int x : res) cout << x << ' ';
    cout << endl;
}
`,
  'graph-bfs-dfs': `#include <iostream>
#include <map>
#include <vector>
#include <set>
#include <queue>
#include <string>
using namespace std;

map<string, vector<string>> graph = {
    {"A", {"B", "C"}}, {"B", {"A", "D", "E"}}, {"C", {"A", "F"}},
    {"D", {"B"}}, {"E", {"B", "F"}}, {"F", {"C", "E"}},
};

void dfs(const string& node, set<string>& visited) {
    visited.insert(node);
    cout << node << ' ';
    for (auto& n : graph[node])
        if (!visited.count(n)) dfs(n, visited);
}

int main() {
    set<string> visited{"A"};
    queue<string> q;
    q.push("A");
    cout << "BFS: ";
    while (!q.empty()) {
        string node = q.front(); q.pop();
        cout << node << ' ';
        for (auto& n : graph[node])
            if (!visited.count(n)) { visited.insert(n); q.push(n); }
    }
    cout << "\\nDFS: ";
    set<string> v2;
    dfs("A", v2);
    cout << endl;
}
`,
  dijkstra: `#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <climits>
using namespace std;

int main() {
    map<string, map<string, int>> graph = {
        {"A", {{"B", 1}, {"C", 4}}},
        {"B", {{"C", 2}, {"D", 5}}},
        {"C", {{"D", 1}}},
        {"D", {}},
    };
    map<string, int> dist;
    for (auto& [node, _] : graph) dist[node] = INT_MAX;
    dist["A"] = 0;
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> pq;
    pq.push({0, "A"});
    while (!pq.empty()) {
        auto [d, node] = pq.top(); pq.pop();
        if (d > dist[node]) continue;
        for (auto& [nb, w] : graph[node]) {
            if (d + w < dist[nb]) {
                dist[nb] = d + w;
                pq.push({dist[nb], nb});
            }
        }
    }
    for (auto& [k, v] : dist) cout << k << ": " << v << endl;
}
`,
  fibonacci: `#include <iostream>
#include <map>
using namespace std;

map<int, long long> memo;

long long fib(int n) {
    if (n < 2) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}

int main() {
    for (int i = 0; i < 10; i++) cout << fib(i) << ' ';
    cout << endl;
}
`,
  fizzbuzz: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 20; i++) {
        if (i % 15 == 0) cout << "FizzBuzz\\n";
        else if (i % 3 == 0) cout << "Fizz\\n";
        else if (i % 5 == 0) cout << "Buzz\\n";
        else cout << i << "\\n";
    }
}
`,
  'selection-sort': `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> a = {5, 2, 9, 1, 5, 6};
    for (size_t i = 0; i < a.size(); i++) {
        size_t m = i;
        for (size_t j = i + 1; j < a.size(); j++)
            if (a[j] < a[m]) m = j;
        swap(a[i], a[m]);
    }
    for (int x : a) cout << x << ' ';
    cout << endl;
}
`,
  'insertion-sort': `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> a = {5, 2, 9, 1, 5, 6};
    for (size_t i = 1; i < a.size(); i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
        a[j + 1] = key;
    }
    for (int x : a) cout << x << ' ';
    cout << endl;
}
`,
  'merge-sort': `#include <iostream>
#include <vector>
using namespace std;

vector<int> mergeSort(vector<int> a) {
    if (a.size() <= 1) return a;
    size_t mid = a.size() / 2;
    vector<int> left = mergeSort({a.begin(), a.begin() + mid});
    vector<int> right = mergeSort({a.begin() + mid, a.end()});
    vector<int> res;
    size_t i = 0, j = 0;
    while (i < left.size() && j < right.size())
        res.push_back(left[i] <= right[j] ? left[i++] : right[j++]);
    while (i < left.size()) res.push_back(left[i++]);
    while (j < right.size()) res.push_back(right[j++]);
    return res;
}

int main() {
    for (int x : mergeSort({5, 2, 9, 1, 5, 6})) cout << x << ' ';
    cout << endl;
}
`,
  'heap-sort': `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> a = {5, 2, 9, 1, 5, 6};
    make_heap(a.begin(), a.end());
    sort_heap(a.begin(), a.end());
    for (int x : a) cout << x << ' ';
    cout << endl;
}
`,
  'counting-sort': `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> a = {5, 2, 9, 1, 5, 6};
    int mx = *max_element(a.begin(), a.end());
    vector<int> count(mx + 1, 0);
    for (int x : a) count[x]++;
    for (int v = 0; v <= mx; v++)
        for (int c = 0; c < count[v]; c++) cout << v << ' ';
    cout << endl;
}
`,
  kmp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    string text = "abxabcabcaby", pattern = "abcaby";
    vector<int> lps(pattern.size(), 0);
    int k = 0;
    for (size_t i = 1; i < pattern.size(); i++) {
        while (k > 0 && pattern[i] != pattern[k]) k = lps[k - 1];
        if (pattern[i] == pattern[k]) k++;
        lps[i] = k;
    }
    k = 0;
    for (size_t i = 0; i < text.size(); i++) {
        while (k > 0 && text[i] != pattern[k]) k = lps[k - 1];
        if (text[i] == pattern[k]) k++;
        if (k == (int)pattern.size()) { cout << "found at: " << i - k + 1 << endl; k = lps[k - 1]; }
    }
}
`,
  'min-heap': `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    priority_queue<int, vector<int>, greater<int>> heap;
    for (int x : {5, 2, 9, 1, 5, 6}) heap.push(x);
    cout << "min: " << heap.top() << endl;
    while (!heap.empty()) { cout << heap.top() << ' '; heap.pop(); }
    cout << endl;
}
`,
  trie: `#include <iostream>
#include <map>
#include <string>
using namespace std;

struct TrieNode {
    map<char, TrieNode*> children;
    bool end = false;
};

void insert(TrieNode* root, const string& word) {
    TrieNode* node = root;
    for (char ch : word) {
        if (!node->children.count(ch)) node->children[ch] = new TrieNode();
        node = node->children[ch];
    }
    node->end = true;
}

bool search(TrieNode* root, const string& word) {
    TrieNode* node = root;
    for (char ch : word) {
        if (!node->children.count(ch)) return false;
        node = node->children[ch];
    }
    return node->end;
}

int main() {
    TrieNode* root = new TrieNode();
    for (string w : {"cat", "car", "card"}) insert(root, w);
    cout << search(root, "car") << ' ' << search(root, "ca") << ' '
         << search(root, "card") << endl;
}
`,
  'union-find': `#include <iostream>
#include <vector>
using namespace std;

struct UnionFind {
    vector<int> parent;
    UnionFind(int n) : parent(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        while (parent[x] != x) x = parent[x] = parent[parent[x]];
        return x;
    }
    void unite(int a, int b) { parent[find(a)] = find(b); }
};

int main() {
    UnionFind uf(6);
    uf.unite(0, 1); uf.unite(2, 3); uf.unite(1, 3);
    cout << "0 and 3: " << (uf.find(0) == uf.find(3)) << endl;
    cout << "0 and 5: " << (uf.find(0) == uf.find(5)) << endl;
}
`,
  'topological-sort': `#include <iostream>
#include <map>
#include <vector>
#include <queue>
using namespace std;

int main() {
    map<int, vector<int>> graph = {
        {5, {2, 0}}, {4, {0, 1}}, {2, {3}}, {3, {1}}, {0, {}}, {1, {}}};
    map<int, int> indeg;
    for (auto& [u, _] : graph) indeg[u];
    for (auto& [u, adj] : graph) for (int v : adj) indeg[v]++;
    queue<int> q;
    for (auto& [u, d] : indeg) if (d == 0) q.push(u);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        cout << u << ' ';
        for (int v : graph[u]) if (--indeg[v] == 0) q.push(v);
    }
    cout << endl;
}
`,
  knapsack: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> weights = {1, 3, 4, 5}, values = {1, 4, 5, 7};
    int cap = 7, n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(cap + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= cap; w++) {
            dp[i][w] = dp[i - 1][w];
            if (weights[i - 1] <= w)
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
        }
    cout << "max value: " << dp[n][cap] << endl;
}
`,
  lcs: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string a = "AGGTAB", b = "GXTXAYB";
    vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1, 0));
    for (size_t i = 1; i <= a.size(); i++)
        for (size_t j = 1; j <= b.size(); j++)
            dp[i][j] = (a[i - 1] == b[j - 1])
                ? dp[i - 1][j - 1] + 1
                : max(dp[i - 1][j], dp[i][j - 1]);
    cout << "LCS length: " << dp[a.size()][b.size()] << endl;
}
`,
  'edit-distance': `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string a = "kitten", b = "sitting";
    vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1, 0));
    for (size_t i = 0; i <= a.size(); i++) dp[i][0] = i;
    for (size_t j = 0; j <= b.size(); j++) dp[0][j] = j;
    for (size_t i = 1; i <= a.size(); i++)
        for (size_t j = 1; j <= b.size(); j++) {
            int cost = (a[i - 1] == b[j - 1]) ? 0 : 1;
            dp[i][j] = min({dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost});
        }
    cout << "distance: " << dp[a.size()][b.size()] << endl;
}
`,
  'coin-change': `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> coins = {1, 2, 5};
    int amount = 11;
    vector<int> dp(amount + 1, 1e9);
    dp[0] = 0;
    for (int coin : coins)
        for (int x = coin; x <= amount; x++)
            dp[x] = min(dp[x], dp[x - coin] + 1);
    cout << "min coins: " << dp[amount] << endl;
}
`,
  gcd: `#include <iostream>
using namespace std;

int gcd(int a, int b) {
    while (b) { int t = b; b = a % b; a = t; }
    return a;
}

int main() {
    cout << "gcd(48, 36) = " << gcd(48, 36) << endl;
    cout << "lcm(4, 6) = " << 4 * 6 / gcd(4, 6) << endl;
}
`,
  sieve: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 30;
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i * i <= n; i++)
        if (isPrime[i])
            for (int j = i * i; j <= n; j += i) isPrime[j] = false;
    for (int i = 2; i <= n; i++) if (isPrime[i]) cout << i << ' ';
    cout << endl;
}
`,
  'fast-power': `#include <iostream>
using namespace std;

long long fastPower(long long base, long long exp, long long mod = 1000000007LL) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

int main() {
    cout << "2^10 = " << fastPower(2, 10) << endl;
    cout << "3^200 mod 1e9+7 = " << fastPower(3, 200) << endl;
}
`,
  'prime-check': `#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; (long long)i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int main() {
    for (int n = 2; n < 30; n++) if (isPrime(n)) cout << n << ' ';
    cout << endl;
}
`,
};
