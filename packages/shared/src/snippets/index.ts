// Библиотека сниппетов: алгоритмы и структуры данных по языкам.
// Каждый сниппет — самодостаточная программа, печатает результат (чтобы Wandbox
// его реально выполнил и показал вывод).

export interface SnippetCategory {
  id: string;
  label: string;
}

/** Полный список категорий в порядке отображения, сгруппирован по темам. */
export const SNIPPET_CATEGORIES: SnippetCategory[] = [
  // Сортировки
  { id: 'bubble-sort', label: 'Сортировка: пузырьком' },
  { id: 'selection-sort', label: 'Сортировка: выбором' },
  { id: 'insertion-sort', label: 'Сортировка: вставками' },
  { id: 'merge-sort', label: 'Сортировка: слиянием' },
  { id: 'quick-sort', label: 'Сортировка: быстрая' },
  { id: 'heap-sort', label: 'Сортировка: пирамидальная' },
  { id: 'counting-sort', label: 'Сортировка: подсчётом' },
  // Поиск
  { id: 'binary-search', label: 'Поиск: бинарный' },
  { id: 'kmp', label: 'Поиск подстроки (KMP)' },
  // Структуры данных
  { id: 'linked-list', label: 'Связный список' },
  { id: 'stack-queue', label: 'Стек и очередь' },
  { id: 'hash-map', label: 'Хеш-таблица' },
  { id: 'min-heap', label: 'Куча (приоритетная очередь)' },
  { id: 'binary-tree', label: 'Бинарное дерево' },
  { id: 'trie', label: 'Префиксное дерево (Trie)' },
  { id: 'union-find', label: 'Система непересекающихся множеств' },
  // Графы
  { id: 'graph-bfs-dfs', label: 'Граф: BFS и DFS' },
  { id: 'topological-sort', label: 'Граф: топологическая сортировка' },
  { id: 'dijkstra', label: 'Граф: Дейкстра' },
  // Динамическое программирование
  { id: 'fibonacci', label: 'ДП: Фибоначчи (мемоизация)' },
  { id: 'knapsack', label: 'ДП: рюкзак 0/1' },
  { id: 'lcs', label: 'ДП: наиб. общая подпоследовательность' },
  { id: 'edit-distance', label: 'ДП: расстояние Левенштейна' },
  { id: 'coin-change', label: 'ДП: размен монет' },
  // Математика
  { id: 'gcd', label: 'Математика: НОД (Евклид)' },
  { id: 'sieve', label: 'Математика: решето Эратосфена' },
  { id: 'fast-power', label: 'Математика: быстрая степень' },
  { id: 'prime-check', label: 'Математика: проверка простоты' },
  // Классика
  { id: 'fizzbuzz', label: 'FizzBuzz' },
];

/** langId -> (snippetId -> код). */
export type LangSnippets = Record<string, string>;

import { pythonSnippets } from './python';
import { javascriptSnippets } from './javascript';
import { typescriptSnippets } from './typescript';
import { goSnippets } from './go';
import { rustSnippets } from './rust';
import { cppSnippets } from './cpp';
import { cSnippets } from './c';
import { javaSnippets } from './java';
import { csharpSnippets } from './csharp';
import { rubySnippets } from './ruby';
import { phpSnippets } from './php';
import { bashSnippets } from './bash';

export const SNIPPETS: Record<string, LangSnippets> = {
  python: pythonSnippets,
  javascript: javascriptSnippets,
  typescript: typescriptSnippets,
  go: goSnippets,
  rust: rustSnippets,
  cpp: cppSnippets,
  c: cSnippets,
  java: javaSnippets,
  csharp: csharpSnippets,
  ruby: rubySnippets,
  php: phpSnippets,
  bash: bashSnippets,
};

/** Категории, доступные для конкретного языка (есть код). */
export function snippetsForLang(langId: string): SnippetCategory[] {
  const map = SNIPPETS[langId];
  if (!map) return [];
  return SNIPPET_CATEGORIES.filter((c) => map[c.id]);
}

export function getSnippet(langId: string, snippetId: string): string | null {
  return SNIPPETS[langId]?.[snippetId] ?? null;
}
