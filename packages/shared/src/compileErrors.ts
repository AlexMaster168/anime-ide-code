import type { WandboxCompileResult } from './types/compile';

export interface CompileDiagnostic {
  line: number;
  column?: number;
  severity: 'error' | 'warning' | 'note';
  message: string;
}

/**
 * Парсит stderr/compiler_error из wandbox результата и пытается достать
 * номера строк ошибок. Регулярки натянуты на самые типовые форматы тулчейнов.
 */
export function parseCompileErrors(
  result: WandboxCompileResult,
  langId: string,
): CompileDiagnostic[] {
  const text = [
    result.compiler_error,
    result.compiler_output,
    result.program_error,
  ]
    .filter(Boolean)
    .join('\n');
  if (!text) return [];

  const out: CompileDiagnostic[] = [];
  const seen = new Set<string>();

  const push = (d: CompileDiagnostic) => {
    const k = `${d.line}:${d.column ?? ''}:${d.severity}:${d.message}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push(d);
  };

  // 1) Универсальный формат gcc/clang/go/rust: path:line:col: severity: message
  // e.g. main.cpp:3:10: error: 'foo' was not declared
  // e.g. ./prog.c:5:1: warning: implicit declaration
  for (const m of text.matchAll(
    /(?:^|\n)[^\n:]*?:(\d+):(\d+):\s*(error|warning|note)[:\s]+([^\n]+)/gi,
  )) {
    push({
      line: Number(m[1]),
      column: Number(m[2]),
      severity: m[3].toLowerCase() as CompileDiagnostic['severity'],
      message: m[4].trim(),
    });
  }
  // 2) Формат без колонки: path:line: severity: message (rust, go)
  for (const m of text.matchAll(
    /(?:^|\n)[^\n:]*?:(\d+):\s*(error|warning|note)[:\s]+([^\n]+)/gi,
  )) {
    push({
      line: Number(m[1]),
      severity: m[2].toLowerCase() as CompileDiagnostic['severity'],
      message: m[3].trim(),
    });
  }

  // 3) Python: File "main.py", line 5\n    print(...\n          ^\nSyntaxError: ...
  for (const m of text.matchAll(
    /File "[^"]+", line (\d+)[\s\S]*?\n([A-Z][a-zA-Z]+(?:Error|Warning|Exception)):\s*([^\n]+)/g,
  )) {
    push({
      line: Number(m[1]),
      severity: /Warning/i.test(m[2]) ? 'warning' : 'error',
      message: `${m[2]}: ${m[3].trim()}`,
    });
  }
  // Иногда python "line N, in <module>"
  for (const m of text.matchAll(
    /line (\d+), in [^\n]*\n[\s\S]*?\n([A-Z][a-zA-Z]+Error):\s*([^\n]+)/g,
  )) {
    push({
      line: Number(m[1]),
      severity: 'error',
      message: `${m[2]}: ${m[3].trim()}`,
    });
  }

  // 4) Java: Main.java:7: error: ';' expected
  for (const m of text.matchAll(
    /(?:^|\n)[A-Za-z_][\w]*\.java:(\d+):\s*(error|warning)[:\s]+([^\n]+)/gi,
  )) {
    push({
      line: Number(m[1]),
      severity: m[2].toLowerCase() as CompileDiagnostic['severity'],
      message: m[3].trim(),
    });
  }

  // 5) C#: Program.cs(5,9): error CS1002: ; expected
  for (const m of text.matchAll(
    /\w+\.cs\((\d+),(\d+)\):\s*(error|warning)\s*[A-Z]+\d+:\s*([^\n]+)/gi,
  )) {
    push({
      line: Number(m[1]),
      column: Number(m[2]),
      severity: m[3].toLowerCase() as CompileDiagnostic['severity'],
      message: m[4].trim(),
    });
  }

  // 6) PHP: PHP Parse error: ... in /path/main.php on line 5
  for (const m of text.matchAll(
    /PHP\s+(Parse error|Fatal error|Warning|Notice):\s*([^\n]+?)\s+in\s+[^\n]+?\s+on line\s+(\d+)/gi,
  )) {
    push({
      line: Number(m[3]),
      severity: /Warning|Notice/i.test(m[1]) ? 'warning' : 'error',
      message: `${m[1]}: ${m[2].trim()}`,
    });
  }

  // 7) Ruby: -:5: syntax error, unexpected ...
  for (const m of text.matchAll(
    /(?:^|\n)[^\n:]*?:(\d+):\s*(syntax error|error|warning)[,:]?\s*([^\n]+)/gi,
  )) {
    if (out.some((d) => d.line === Number(m[1]))) continue;
    push({
      line: Number(m[1]),
      severity: /warning/i.test(m[2]) ? 'warning' : 'error',
      message: m[3].trim(),
    });
  }

  // 8) JS/Node: SyntaxError: ... \n    at ... line N column M / file:N:M
  for (const m of text.matchAll(/\bat\b[^\n]*:(\d+):(\d+)/g)) {
    push({
      line: Number(m[1]),
      column: Number(m[2]),
      severity: 'error',
      message: 'runtime error',
    });
  }
  for (const m of text.matchAll(/SyntaxError:[^\n]+\n[\s\S]*?:(\d+)/g)) {
    push({
      line: Number(m[1]),
      severity: 'error',
      message: 'SyntaxError',
    });
  }

  void langId; // зарезервировано на будущее
  return out;
}

export function severityColor(s: CompileDiagnostic['severity']): string {
  switch (s) {
    case 'error':
      return '#FF5C7A';
    case 'warning':
      return '#F5B642';
    default:
      return '#9AA0B0';
  }
}
