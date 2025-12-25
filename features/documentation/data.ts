import { ViewType } from '../../shared/types';

export type Language = 'c' | 'cpp' | 'java' | 'python';

export interface CodeSnippet {
  language: Language;
  code: string;
}

export interface DocContent {
  id: ViewType;
  title: string;
  theory: string;
  operations: string[];
  complexity: {
    time: string;
    space: string;
  };
  snippets: CodeSnippet[];
}

export const DOC_DB: Record<string, DocContent> = {
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    theory: 'Binary Search is the most efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you have narrowed the possible locations to just one. Unlike Linear Search (O(n)), Binary Search reduces the search space logarithmically, making it feasible for massive datasets.',
    operations: ['Standard Search', 'Lower Bound', 'Upper Bound', 'Search in Rotated Array'],
    complexity: { time: 'O(log n)', space: 'O(1)' },
    snippets: [
      { 
        language: 'python', 
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1` 
      },
      { 
        language: 'cpp', 
        code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}` 
      },
      { 
        language: 'java', 
        code: `public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}` 
      },
      { 
        language: 'c', 
        code: `int binarySearch(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}` 
      }
    ]
  },
  'stack': {
    id: 'stack',
    title: 'Stack (LIFO)',
    theory: 'A Stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle. Imagine a stack of cafeteria trays; the last tray placed on top is the first one removed. Stacks are crucial in computer science for function call management (recursion), expression evaluation (parsing), and backtracking algorithms (DFS).',
    operations: ['Push (Insert)', 'Pop (Remove)', 'Peek/Top (View)', 'isEmpty', 'isFull'],
    complexity: { time: 'O(1) per op', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()

    def peek(self):
        if not self.is_empty():
            return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0` 
      },
      { 
        language: 'cpp', 
        code: `#include <stack>
#include <iostream>

int main() {
    std::stack<int> s;
    s.push(10);  // Push
    s.push(20);
    
    int top = s.top(); // Peek (20)
    s.pop();           // Remove 20
    
    bool empty = s.empty(); // Check if empty
    return 0;
}` 
      },
      { 
        language: 'java', 
        code: `import java.util.Stack;

public class StackDemo {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        
        stack.push(10);
        stack.push(20);
        
        int top = stack.peek(); // 20
        stack.pop();            // Removes 20
        
        boolean empty = stack.isEmpty();
    }
}` 
      },
      { 
        language: 'c', 
        code: `#define MAX 100
struct Stack {
    int items[MAX];
    int top;
};

void push(struct Stack* s, int value) {
    if (s->top == MAX - 1) return; // Overflow
    s->items[++s->top] = value;
}

int pop(struct Stack* s) {
    if (s->top == -1) return -1; // Underflow
    return s->items[s->top--];
}` 
      }
    ]
  },
  'queue': {
    id: 'queue',
    title: 'Queue (FIFO)',
    theory: 'A Queue works on the First-In, First-Out (FIFO) principle, similar to a line at a ticket counter. Elements are added at the "rear" (enqueue) and removed from the "front" (dequeue). Queues are fundamental for managing resources in shared environments, such as CPU scheduling, print spooling, and Breadth-First Search (BFS) in graphs.',
    operations: ['Enqueue', 'Dequeue', 'Front', 'Rear', 'isEmpty'],
    complexity: { time: 'O(1) per op', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `from collections import deque

queue = deque()

# Enqueue
queue.append(10)
queue.append(20)

# Dequeue
first = queue.popleft() # Returns 10

# Front
front_element = queue[0] if queue else None` 
      },
      { 
        language: 'cpp', 
        code: `#include <queue>

int main() {
    std::queue<int> q;
    
    q.push(10); // Enqueue
    q.push(20);
    
    int front = q.front(); // Peek 10
    q.pop();               // Dequeue 10
    
    return 0;
}` 
      },
      { 
        language: 'java', 
        code: `import java.util.LinkedList;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<Integer> q = new LinkedList<>();
        
        q.offer(10); // Enqueue
        q.offer(20);
        
        int front = q.peek(); // 10
        q.poll();             // Dequeue 10
    }
}` 
      },
      { 
        language: 'c', 
        code: `#define SIZE 100
int items[SIZE], front = -1, rear = -1;

void enqueue(int value) {
    if (rear == SIZE - 1) return;
    if (front == -1) front = 0;
    items[++rear] = value;
}

int dequeue() {
    if (front == -1) return -1;
    int item = items[front++];
    if (front > rear) front = rear = -1; // Reset
    return item;
}` 
      }
    ]
  },
  'linked-list': {
    id: 'linked-list',
    title: 'Linked List',
    theory: 'A Linked List is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next. It is a dynamic data structure, meaning it can grow and shrink at runtime without reallocating the entire structure. The downside is sequential access (O(n)) rather than random access (O(1)).',
    operations: ['Insert Head', 'Insert Tail', 'Delete Node', 'Reverse List', 'Detect Cycle'],
    complexity: { time: 'O(n) search', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last = self.head
        while last.next:
            last = last.next
        last.next = new_node` 
      },
      { 
        language: 'cpp', 
        code: `struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

void append(Node*& head, int data) {
    Node* newNode = new Node(data);
    if (!head) {
        head = newNode;
        return;
    }
    Node* temp = head;
    while (temp->next) temp = temp->next;
    temp->next = newNode;
}` 
      },
      { 
        language: 'java', 
        code: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}

class LinkedList {
    Node head;
    
    public void append(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        Node last = head;
        while (last.next != null) last = last.next;
        last.next = newNode;
    }
}` 
      },
      { 
        language: 'c', 
        code: `struct Node {
    int data;
    struct Node* next;
};

void append(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    struct Node* last = *head_ref;
    new_node->data = new_data;
    new_node->next = NULL;

    if (*head_ref == NULL) {
        *head_ref = new_node;
        return;
    }
    while (last->next != NULL) last = last->next;
    last->next = new_node;
}` 
      }
    ]
  },
  'binary-tree': {
    id: 'binary-tree',
    title: 'Binary Tree',
    theory: 'A Binary Tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child. It is the basis for Binary Search Trees (BST), Heaps, and Syntax Trees. Traversal refers to the process of visiting each node in the tree exactly once (In-order, Pre-order, Post-order).',
    operations: ['Insert', 'In-Order Traversal', 'Pre-Order Traversal', 'Post-Order Traversal', 'Height'],
    complexity: { time: 'O(n) traverse', space: 'O(h)' },
    snippets: [
      { 
        language: 'python', 
        code: `class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def inorder(root):
    if root:
        inorder(root.left)
        print(root.val)
        inorder(root.right)` 
      },
      { 
        language: 'cpp', 
        code: `struct Node {
    int data;
    Node *left, *right;
    Node(int val) : data(val), left(NULL), right(NULL) {}
};

void inorder(Node* root) {
    if (root == NULL) return;
    inorder(root->left);
    cout << root->data << " ";
    inorder(root->right);
}` 
      },
      { 
        language: 'java', 
        code: `class Node {
    int item;
    Node left, right;
    public Node(int key) {
        item = key;
        left = right = null;
    }
}

void inorder(Node node) {
    if (node == null) return;
    inorder(node.left);
    System.out.print(node.item + " ");
    inorder(node.right);
}` 
      },
      { 
        language: 'c', 
        code: `struct Node {
    int item;
    struct Node* left;
    struct Node* right;
};

void inorderTraversal(struct Node* root) {
    if (root == NULL) return;
    inorderTraversal(root->left);
    printf("%d ", root->item);
    inorderTraversal(root->right);
}` 
      }
    ]
  },
  'avl-tree': {
    id: 'avl-tree',
    title: 'AVL Tree',
    theory: 'An AVL tree is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees cannot be more than one for all nodes. This ensures that the tree remains flat, guaranteeing O(log n) time complexity for search, insert, and delete operations. It uses rotations (Left, Right, Left-Right, Right-Left) to maintain balance.',
    operations: ['Right Rotation', 'Left Rotation', 'Get Balance Factor', 'Insert & Balance'],
    complexity: { time: 'O(log n)', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

def get_height(node):
    if not node: return 0
    return node.height

def right_rotate(y):
    x = y.left
    T2 = x.right
    # Perform rotation
    x.right = y
    y.left = T2
    # Update heights
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    return x` 
      },
      { 
        language: 'cpp', 
        code: `Node *rightRotate(Node *y) {
    Node *x = y->left;
    Node *T2 = x->right;

    // Perform rotation
    x->right = y;
    y->left = T2;

    // Update heights
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;

    return x;
}` 
      },
      { 
        language: 'java', 
        code: `Node rightRotate(Node y) {
    Node x = y.left;
    Node T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = max(height(y.left), height(y.right)) + 1;
    x.height = max(height(x.left), height(x.right)) + 1;

    return x;
}` 
      },
      { 
        language: 'c', 
        code: `struct Node *rightRotate(struct Node *y) {
    struct Node *x = y->left;
    struct Node *T2 = x->right;

    x->right = y;
    y->left = T2;

    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;

    return x;
}` 
      }
    ]
  },
  'heap': {
    id: 'heap',
    title: 'Binary Heap (Priority Queue)',
    theory: 'A Binary Heap is a Complete Binary Tree. In a Min-Heap, the key at the root must be minimum among all keys in the tree. The same property must be recursively true for all nodes in the Binary Tree. Heaps are the most efficient way to implement Priority Queues and are used in Dijkstra’s algorithm and Heap Sort.',
    operations: ['Heapify Up (Swim)', 'Heapify Down (Sink)', 'Extract Min/Max', 'Insert'],
    complexity: { time: 'O(log n) insert', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `import heapq

# Python's default is a Min-Heap
heap = []
heapq.heappush(heap, 10)
heapq.heappush(heap, 1)
heapq.heappush(heap, 5)

smallest = heapq.heappop(heap) # Returns 1` 
      },
      { 
        language: 'cpp', 
        code: `#include <queue>
#include <vector>

int main() {
    // Max Heap by default
    std::priority_queue<int> maxHeap;
    maxHeap.push(10);
    maxHeap.push(30);
    int maxVal = maxHeap.top(); // 30
    
    // Min Heap definition
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    minHeap.push(10);
}` 
      },
      { 
        language: 'java', 
        code: `import java.util.PriorityQueue;

public class HeapDemo {
    public static void main(String args[]) {
        // Min Heap by default
        PriorityQueue<Integer> pQueue = new PriorityQueue<>();
        
        pQueue.add(10);
        pQueue.add(30);
        pQueue.add(20);
        
        int min = pQueue.poll(); // 10
    }
}` 
      },
      { 
        language: 'c', 
        code: `void swap(int *a, int *b) { int temp = *a; *a = *b; *b = temp; }

void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}` 
      }
    ]
  },
  'graph': {
    id: 'graph',
    title: 'Graph (BFS/DFS)',
    theory: 'A Graph is a non-linear data structure consisting of nodes (vertices) and edges. Graphs can be directed or undirected, weighted or unweighted. They model complex relationships like social networks, maps, and internet routing. Traversal algorithms like Breadth-First Search (BFS) explores neighbors first, while Depth-First Search (DFS) explores as far as possible along each branch.',
    operations: ['Add Edge', 'BFS Traversal', 'DFS Traversal', 'Detect Cycle'],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    snippets: [
      { 
        language: 'python', 
        code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)

    while queue:
        vertex = queue.popleft()
        print(vertex, end=" ")

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)` 
      },
      { 
        language: 'cpp', 
        code: `void BFS(int start, vector<vector<int>>& adj, int V) {
    vector<bool> visited(V, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while(!q.empty()) {
        int u = q.front(); q.pop();
        cout << u << " ";

        for(int v : adj[u]) {
            if(!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}` 
      },
      { 
        language: 'java', 
        code: `void BFS(int s) {
    boolean visited[] = new boolean[V];
    LinkedList<Integer> queue = new LinkedList<>();

    visited[s] = true;
    queue.add(s);

    while (queue.size() != 0) {
        s = queue.poll();
        System.out.print(s + " ");

        Iterator<Integer> i = adj[s].listIterator();
        while (i.hasNext()) {
            int n = i.next();
            if (!visited[n]) {
                visited[n] = true;
                queue.add(n);
            }
        }
    }
}` 
      },
      { 
        language: 'c', 
        code: `void BFS(int start) {
    int queue[MAX], front = 0, rear = 0;
    visited[start] = 1;
    queue[rear++] = start;

    while (front < rear) {
        int current = queue[front++];
        printf("%d ", current);

        for (int i = 0; i < V; i++) {
            if (adj[current][i] && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
}` 
      }
    ]
  },
  'hash-table': {
    id: 'hash-table',
    title: 'Hash Table',
    theory: 'A Hash Table implements an associative array abstract data type, a structure that can map keys to values. A hash function computes an index into an array of buckets or slots, from which the desired value can be found. It offers O(1) average time complexity for lookups, making it the go-to structure for caching, indexing, and frequency counting.',
    operations: ['Insert (Put)', 'Search (Get)', 'Delete', 'Handle Collision'],
    complexity: { time: 'O(1) Avg', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `hash_map = {}

# Insert
hash_map["user_id"] = 101
hash_map["score"] = 95

# Access
if "score" in hash_map:
    print(hash_map["score"])

# Delete
del hash_map["user_id"]` 
      },
      { 
        language: 'cpp', 
        code: `#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> umap;

    // Insert
    umap["apple"] = 10;
    umap["banana"] = 20;

    // Search
    if (umap.find("apple") != umap.end()) {
        int val = umap["apple"];
    }

    return 0;
}` 
      },
      { 
        language: 'java', 
        code: `import java.util.HashMap;

public class HashDemo {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();

        map.put("Apple", 10);
        
        if (map.containsKey("Apple")) {
            int val = map.get("Apple");
        }
        
        map.remove("Apple");
    }
}` 
      },
      { 
        language: 'c', 
        code: `// Simple linear probing example
struct Item { int key; int data; };
struct Item* hashArray[SIZE]; 

void insert(int key, int data) {
    struct Item *item = (struct Item*) malloc(sizeof(struct Item));
    item->data = data;  
    item->key = key;

    int hashIndex = key % SIZE;
    while(hashArray[hashIndex] != NULL) {
        ++hashIndex;
        hashIndex %= SIZE;
    }
    hashArray[hashIndex] = item;
}` 
      }
    ]
  },
  'trie': {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    theory: 'A Trie (pronounced "try") is a tree-based data structure used to efficiently store and retrieve keys in a dataset of strings. Unlike a BST, nodes in the Trie do not store their associated key; instead, the node\'s position in the tree defines the key. Tries are extremely fast at prefix-based searches, making them ideal for Autocomplete and Spell Checking.',
    operations: ['Insert Word', 'Search Word', 'Starts With (Prefix)', 'Delete'],
    complexity: { time: 'O(L)', space: 'O(AL * N)' },
    snippets: [
      { 
        language: 'python', 
        code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True` 
      },
      { 
        language: 'cpp', 
        code: `struct TrieNode {
    TrieNode *children[26];
    bool isEndOfWord;
    
    TrieNode() {
        isEndOfWord = false;
        for (int i = 0; i < 26; i++) children[i] = NULL;
    }
};

void insert(TrieNode *root, string key) {
    TrieNode *pCrawl = root;
    for (int i = 0; i < key.length(); i++) {
        int index = key[i] - 'a';
        if (!pCrawl->children[index])
            pCrawl->children[index] = new TrieNode();
        pCrawl = pCrawl->children[index];
    }
    pCrawl->isEndOfWord = true;
}` 
      },
      { 
        language: 'java', 
        code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord;
    TrieNode() {
        isEndOfWord = false;
        for (int i = 0; i < 26; i++) children[i] = null;
    }
}

public void insert(String key) {
    TrieNode pCrawl = root;
    for (int level = 0; level < key.length(); level++) {
        int index = key.charAt(level) - 'a';
        if (pCrawl.children[index] == null)
            pCrawl.children[index] = new TrieNode();
        pCrawl = pCrawl.children[index];
    }
    pCrawl.isEndOfWord = true;
}` 
      },
      { 
        language: 'c', 
        code: `struct TrieNode {
    struct TrieNode *children[26];
    bool isEndOfWord;
};

struct TrieNode *getNode(void) {
    struct TrieNode *pNode = (struct TrieNode *)malloc(sizeof(struct TrieNode));
    pNode->isEndOfWord = false;
    for (int i = 0; i < 26; i++) pNode->children[i] = NULL;
    return pNode;
}

void insert(struct TrieNode *root, const char *key) {
    struct TrieNode *pCrawl = root;
    for (int level = 0; level < strlen(key); level++) {
        int index = key[level] - 'a';
        if (!pCrawl->children[index])
            pCrawl->children[index] = getNode();
        pCrawl = pCrawl->children[index];
    }
    pCrawl->isEndOfWord = true;
}` 
      }
    ]
  },
  'sorting': {
    id: 'sorting',
    title: 'Sorting Algorithms',
    theory: 'Sorting is the process of arranging data in a specific order. Efficient sorting is critical for optimizing other algorithms (like Binary Search). "QuickSort" and "MergeSort" are O(n log n) Divide and Conquer algorithms. QuickSort is generally faster in practice (better cache locality) but has a worst-case of O(n²), while MergeSort is stable and guaranteed O(n log n).',
    operations: ['Quick Sort Partition', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
    complexity: { time: 'O(n log n)', space: 'O(log n)' },
    snippets: [
      { 
        language: 'python', 
        code: `def partition(arr, low, high):
    i = (low - 1)
    pivot = arr[high]
    for j in range(low, high):
        if arr[j] <= pivot:
            i = i + 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return (i+1)

def quick_sort(arr, low, high):
    if len(arr) == 1: return arr
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi-1)
        quick_sort(arr, pi+1, high)` 
      },
      { 
        language: 'cpp', 
        code: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}` 
      },
      { 
        language: 'java', 
        code: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low-1);
    for (int j=low; j<high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i+1];
    arr[i+1] = arr[high];
    arr[high] = temp;
    return i+1;
}` 
      },
      { 
        language: 'c', 
        code: `void swap(int* a, int* b) { int t = *a; *a = *b; *b = t; }

int partition (int arr[], int low, int high) {
    int pivot = arr[high]; 
    int i = (low - 1); 
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++; 
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}` 
      }
    ]
  },
  'dp': {
    id: 'dp',
    title: 'Dynamic Programming',
    theory: 'Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable when the problem has "Overlapping Subproblems" and "Optimal Substructure". There are two approaches: Memoization (Top-Down) and Tabulation (Bottom-Up). Classic examples include the Fibonacci sequence and the Knapsack problem.',
    operations: ['Memoization', 'Tabulation', 'State Transition', 'Space Optimization'],
    complexity: { time: 'O(n*W) Knapsack', space: 'O(n*W)' },
    snippets: [
      { 
        language: 'python', 
        code: `# 0/1 Knapsack Problem (Recursive + Memoization)
def knapSack(W, wt, val, n):
    K = [[0 for x in range(W + 1)] for x in range(n + 1)]

    for i in range(n + 1):
        for w in range(W + 1):
            if i == 0 or w == 0:
                K[i][w] = 0
            elif wt[i-1] <= w:
                K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w])
            else:
                K[i][w] = K[i-1][w]
    return K[n][W]` 
      },
      { 
        language: 'cpp', 
        code: `// Fibonacci with Memoization
int memo[1000];

int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    
    return memo[n] = fib(n - 1) + fib(n - 2);
}

int main() {
    fill(memo, memo + 1000, -1);
    cout << fib(10);
}` 
      },
      { 
        language: 'java', 
        code: `// Bottom Up Fibonacci
public int fib(int n) {
    if(n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    
    for(int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}` 
      },
      { 
        language: 'c', 
        code: `// Longest Common Subsequence (Tabulation)
int lcs(char *X, char *Y, int m, int n) {
    int L[m+1][n+1];
    int i, j;

    for (i=0; i<=m; i++) {
        for (j=0; j<=n; j++) {
            if (i == 0 || j == 0)
                L[i][j] = 0;
            else if (X[i-1] == Y[j-1])
                L[i][j] = L[i-1][j-1] + 1;
            else
                L[i][j] = max(L[i-1][j], L[i][j-1]);
        }
    }
    return L[m][n];
}` 
      }
    ]
  },
  'segment-tree': {
    id: 'segment-tree',
    title: 'Segment Tree',
    theory: 'A Segment Tree is a versatile data structure used to store information about intervals or segments. It allows querying which segment contains a given point and querying associations (like sum, min, max) over a range in logarithmic time. It is essentially a binary tree where each node represents an interval.',
    operations: ['Build Tree', 'Range Query', 'Point Update', 'Lazy Propagation'],
    complexity: { time: 'O(log n) Query', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `def build(node, start, end):
    if start == end:
        tree[node] = arr[start]
    else:
        mid = (start + end) // 2
        build(2*node, start, mid)
        build(2*node+1, mid+1, end)
        tree[node] = tree[2*node] + tree[2*node+1]

def query(node, start, end, l, r):
    if r < start or end < l: return 0
    if l <= start and end <= r: return tree[node]
    mid = (start + end) // 2
    return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r)` 
      },
      { 
        language: 'cpp', 
        code: `void build(int node, int start, int end) {
    if(start == end) {
        tree[node] = A[start];
    } else {
        int mid = (start + end) / 2;
        build(2*node, start, mid);
        build(2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}

int query(int node, int start, int end, int l, int r) {
    if(r < start || end < l) return 0;
    if(l <= start && end <= r) return tree[node];
    int mid = (start + end) / 2;
    return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r);
}` 
      },
      { 
        language: 'java', 
        code: `void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
    } else {
        int mid = (start + end) / 2;
        if (start <= idx && idx <= mid)
            update(2 * node, start, mid, idx, val);
        else
            update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
}` 
      },
      { 
        language: 'c', 
        code: `// Array based implementation assuming size 4*N
int tree[40000];
int A[10000];

void build(int node, int start, int end) {
    if(start == end) {
        tree[node] = A[start];
    } else {
        int mid = (start + end) / 2;
        build(2*node, start, mid);
        build(2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}` 
      }
    ]
  },
  'pathfinding': {
    id: 'pathfinding',
    title: 'Pathfinding (Dijkstra)',
    theory: 'Pathfinding algorithms are designed to find the shortest route between two nodes in a graph. Dijkstra’s Algorithm is the gold standard for finding the shortest path from a starting node to all other nodes in a graph with non-negative edge weights. It uses a Priority Queue to always explore the nearest unvisited node first.',
    operations: ['Relax Edge', 'Extract Min', 'Update Distance', 'Reconstruct Path'],
    complexity: { time: 'O(E + V log V)', space: 'O(V)' },
    snippets: [
      { 
        language: 'python', 
        code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))` 
      },
      { 
        language: 'cpp', 
        code: `void dijkstra(int s, vector<vector<pair<int,int>>> adj, int V) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> dist(V, INF);

    pq.push({0, s});
    dist[s] = 0;

    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();

        for (auto x : adj[u]) {
            int v = x.first;
            int weight = x.second;
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}` 
      },
      { 
        language: 'java', 
        code: `public void dijkstra(int src) {
    PriorityQueue<Node> pq = new PriorityQueue<>(V, new Node());
    int dist[] = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);

    pq.add(new Node(src, 0));
    dist[src] = 0;

    while (pq.size() != 0) {
        int u = pq.remove().node;
        for (int i = 0; i < adj.get(u).size(); i++) {
            Node v = adj.get(u).get(i);
            if (dist[v.node] > dist[u] + v.cost) {
                dist[v.node] = dist[u] + v.cost;
                pq.add(new Node(v.node, dist[v.node]));
            }
        }
    }
}` 
      },
      { 
        language: 'c', 
        code: `// Simple Dijkstra for Adjacency Matrix
int minDistance(int dist[], bool sptSet[]) {
    int min = INT_MAX, min_index;
    for (int v = 0; v < V; v++)
        if (sptSet[v] == false && dist[v] <= min)
            min = dist[v], min_index = v;
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V]; 
    bool sptSet[V]; 
    // Initialize & loop logic...
}` 
      }
    ]
  },
  'matrix': {
    id: 'matrix',
    title: 'Matrix Operations',
    theory: 'A Matrix is a 2D array of numbers arranged in rows and columns. Matrices are fundamental in computer graphics (transformations), graph representation (adjacency matrices), and dynamic programming (grid problems). A key operation is Traversal, where every element is visited, or Transposition, where rows are swapped with columns.',
    operations: ['Transpose', 'Rotate 90°', 'Spiral Traversal', 'Diagonal Sum'],
    complexity: { time: 'O(R * C)', space: 'O(1) in-place' },
    snippets: [
      { 
        language: 'python', 
        code: `# Transpose a matrix
X = [[12,7],
    [4 ,5],
    [3 ,8]]

result = [[X[j][i] for j in range(len(X))] for i in range(len(X[0]))]

for r in result:
    print(r)` 
      },
      { 
        language: 'cpp', 
        code: `// Transpose of a Square Matrix in-place
void transpose(int A[][N]) {
    for (int i = 0; i < N; i++)
        for (int j = i + 1; j < N; j++)
            swap(A[i][j], A[j][i]);
}` 
      },
      { 
        language: 'java', 
        code: `public void rotate(int[][] matrix) {
    // 1. Transpose
    for(int i=0; i<matrix.length; i++){
        for(int j=i; j<matrix[0].length; j++){
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    // 2. Reverse each row to rotate 90 deg clockwise
    // ...
}` 
      },
      { 
        language: 'c', 
        code: `void printMatrix(int mat[R][C]) {
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++)
            printf("%d ", mat[i][j]);
        printf("\\n");
    }
}` 
      }
    ]
  },
  'convex-hull': {
    id: 'convex-hull',
    title: 'Convex Hull',
    theory: 'The Convex Hull of a set of points is the smallest convex polygon that contains all the points. Imagine stretching a rubber band around the points; the shape it takes is the Convex Hull. This is used in collision detection, shape analysis, and pattern recognition. The Jarvis March (Gift Wrapping) and Graham Scan are popular algorithms.',
    operations: ['Graham Scan', 'Jarvis March', 'Orientation Test', 'Cross Product'],
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    snippets: [
      { 
        language: 'python', 
        code: `# Orientation: 0=collinear, 1=cw, 2=ccw
def orientation(p, q, r):
    val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
    if val == 0: return 0
    return 1 if val > 0 else 2

def convex_hull(points, n):
    if n < 3: return
    hull = []
    l = 0 # Find leftmost point
    # ... Jarvis March logic` 
      },
      { 
        language: 'cpp', 
        code: `struct Point { int x, y; };

int orientation(Point p, Point q, Point r) {
    int val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0;  // collinear
    return (val > 0)? 1: 2; // clock or counterclock wise
}` 
      },
      { 
        language: 'java', 
        code: `class Point { int x, y; }

public static int orientation(Point p, Point q, Point r) {
    int val = (q.y - p.y) * (r.x - q.x) - 
              (q.x - p.x) * (r.y - q.y);
    
    if (val == 0) return 0;
    return (val > 0) ? 1 : 2;
}` 
      },
      { 
        language: 'c', 
        code: `struct Point { int x, y; };

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
int orientation(struct Point p, struct Point q, struct Point r) {
    int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0; 
    return (val > 0)? 1: 2; 
}` 
      }
    ]
  }
};