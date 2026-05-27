import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { csharp } from '@codemirror/legacy-modes/mode/clike';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  dracula,
  tokyoNight,
  monokai,
  githubDark,
  nord,
  vscodeDark,
} from '@uiw/codemirror-themes-all';
import { lintGutter, linter, type Diagnostic } from '@codemirror/lint';
import type { CompileDiagnostic } from '@anime-ide-code/shared';

export const EDITOR_THEMES: { id: string; label: string; ext: Extension }[] = [
  { id: 'one-dark', label: 'One Dark', ext: oneDark },
  { id: 'dracula', label: 'Dracula', ext: dracula },
  { id: 'tokyo-night', label: 'Tokyo Night', ext: tokyoNight },
  { id: 'monokai', label: 'Monokai', ext: monokai },
  { id: 'github-dark', label: 'GitHub Dark', ext: githubDark },
  { id: 'nord', label: 'Nord', ext: nord },
  { id: 'vscode-dark', label: 'VS Code Dark', ext: vscodeDark },
];

function themeById(id: string): Extension {
  return (EDITOR_THEMES.find((t) => t.id === id) ?? EDITOR_THEMES[0]).ext;
}

const langMap: Record<string, () => Extension> = {
  python: () => python(),
  javascript: () => javascript(),
  typescript: () => javascript({ typescript: true }),
  rust: () => rust(),
  go: () => go(),
  c: () => cpp(),
  cpp: () => cpp(),
  java: () => java(),
  csharp: () => StreamLanguage.define(csharp),
  ruby: () => StreamLanguage.define(ruby),
  php: () => php(),
  bash: () => StreamLanguage.define(shell),
};

interface Props {
  langId: string;
  value: string;
  onChange: (v: string) => void;
  diagnostics?: CompileDiagnostic[];
  minHeight?: number;
  themeId?: string;
}

export function CodeEditor({
  langId,
  value,
  onChange,
  diagnostics = [],
  minHeight = 320,
  themeId = 'one-dark',
}: Props) {
  const extensions = useMemo<Extension[]>(() => {
    const ext: Extension[] = [];
    const langFactory = langMap[langId];
    if (langFactory) ext.push(langFactory());
    ext.push(
      EditorView.theme({
        '&': { fontSize: '13px' },
        '.cm-content': { fontFamily: 'var(--font-mono, monospace)' },
        '.cm-gutters': { backgroundColor: 'transparent', borderRight: 'none' },
        '.cm-lineNumbers .cm-gutterElement': { color: '#5B6275' },
      }),
    );
    ext.push(lintGutter());
    ext.push(
      linter(
        (view) => {
          const doc = view.state.doc;
          const result: Diagnostic[] = [];
          for (const d of diagnostics) {
            if (d.line < 1 || d.line > doc.lines) continue;
            const line = doc.line(d.line);
            const from = d.column != null ? line.from + Math.max(0, d.column - 1) : line.from;
            const to = line.to;
            result.push({
              from: Math.min(from, line.to),
              to,
              severity:
                d.severity === 'warning'
                  ? 'warning'
                  : d.severity === 'note'
                    ? 'info'
                    : 'error',
              message: d.message,
            });
          }
          return result;
        },
        { delay: 0 },
      ),
    );
    return ext;
    // diagnostics — массив, его серилизация в JSON слишком дорого; пересчитаем при изменении ссылки
  }, [langId, diagnostics]);

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-bg-card">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={themeById(themeId)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          foldGutter: false,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          indentOnInput: true,
          tabSize: 2,
        }}
        minHeight={`${minHeight}px`}
      />
    </div>
  );
}
