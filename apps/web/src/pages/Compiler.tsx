import { useEffect, useMemo, useState } from 'react';
import {
  compileAndRun,
  fetchCompilers,
  LANG_PRESETS,
  parseCompileErrors,
  pickCompilerName,
} from '@anime-ide-code/shared';
import type {
  CompileDiagnostic,
  WandboxCompileResult,
  WandboxCompiler,
} from '@anime-ide-code/shared';
import { useCompiler } from '../store/compiler';
import { CodeEditor } from '../components/CodeEditor';
import { Loader } from '../components/Loader';

export function CompilerPage() {
  const langId = useCompiler((s) => s.langId);
  const sources = useCompiler((s) => s.sources);
  const setLang = useCompiler((s) => s.setLang);
  const setSource = useCompiler((s) => s.setSource);
  const resetCurrent = useCompiler((s) => s.resetCurrent);

  const [compilers, setCompilers] = useState<WandboxCompiler[]>([]);
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<WandboxCompileResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchCompilers()
      .then(setCompilers)
      .catch(() => setCompilers([]));
  }, []);

  const preset = useMemo(
    () => LANG_PRESETS.find((p) => p.id === langId) ?? LANG_PRESETS[0],
    [langId],
  );

  const compilerName = useMemo(
    () => pickCompilerName(compilers, preset.wandboxLanguage),
    [compilers, preset],
  );

  const source = sources[preset.id] ?? preset.starter;

  const diagnostics: CompileDiagnostic[] = useMemo(
    () => (result ? parseCompileErrors(result, preset.id) : []),
    [result, preset.id],
  );

  const onRun = async () => {
    if (!compilerName) {
      setErr('Список компиляторов ещё грузится, подожди пару секунд');
      return;
    }
    setRunning(true);
    setErr(null);
    setResult(null);
    try {
      const res = await compileAndRun({
        compiler: compilerName,
        code: source,
        stdin,
      });
      setResult(res);
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (e instanceof Error ? e.message : 'Ошибка запуска');
      setErr(msg);
    } finally {
      setRunning(false);
    }
  };

  // Сбросить результат и подсветку при смене языка
  useEffect(() => {
    setResult(null);
  }, [preset.id]);

  const exitCode = result ? parseInt(result.status, 10) : null;
  const hasOutput = Boolean(
    result?.program_output ||
      result?.program_error ||
      result?.compiler_error ||
      result?.compiler_output,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-4">
      <div>
        <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
          Язык
        </div>
        <div className="flex flex-wrap gap-2">
          {LANG_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setLang(p.id)}
              className={[
                'px-3.5 py-2 rounded-full text-sm font-semibold border transition-colors',
                p.id === langId
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg-card text-text-dim border-border hover:border-accent/40',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="text-text-muted text-xs mt-2 font-mono">
          Wandbox: {compilerName ?? '…'}
        </div>
      </div>

      <div>
        <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
          Код
        </div>
        <CodeEditor
          langId={preset.id}
          value={source}
          onChange={(v) => setSource(preset.id, v)}
          diagnostics={diagnostics}
          minHeight={380}
        />
        {diagnostics.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {diagnostics.slice(0, 5).map((d, i) => (
              <div
                key={i}
                className={[
                  'px-2.5 py-1 rounded-md border font-mono',
                  d.severity === 'error'
                    ? 'border-danger/60 text-danger bg-danger/10'
                    : d.severity === 'warning'
                      ? 'border-warn/60 text-warn bg-warn/10'
                      : 'border-border text-text-dim bg-bg-card',
                ].join(' ')}
              >
                <span className="font-bold">L{d.line}</span>
                {d.column ? <span className="opacity-60">:{d.column}</span> : null}
                <span className="mx-1.5 opacity-60">·</span>
                <span>{d.message}</span>
              </div>
            ))}
            {diagnostics.length > 5 ? (
              <div className="px-2.5 py-1 text-text-muted">
                ещё {diagnostics.length - 5}…
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
          stdin (необязательно)
        </div>
        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          spellCheck={false}
          rows={3}
          className="w-full bg-bg-card border border-border rounded-xl p-3 font-mono text-sm text-text resize-y outline-none focus:border-accent transition-colors"
          placeholder="ввод программы"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRun}
          disabled={running || !compilerName}
          className="flex-1 bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {running ? <Loader size="sm" className="border-white/30 border-t-white" /> : '▶'}
          <span>{running ? 'Выполняется…' : 'Запустить'}</span>
        </button>
        <button
          type="button"
          onClick={resetCurrent}
          className="px-5 py-3 rounded-xl bg-bg-card border border-border text-text font-semibold hover:border-accent/40 transition-colors"
        >
          Сброс
        </button>
      </div>

      {err ? (
        <div className="p-4 rounded-xl bg-bg-card border border-danger/60">
          <div className="text-danger font-bold text-sm mb-2">Ошибка</div>
          <pre className="font-mono text-sm text-text whitespace-pre-wrap wrap-break-word">
            {err}
          </pre>
        </div>
      ) : null}

      {result ? (
        <div className="p-4 rounded-xl bg-bg-card border border-border space-y-3">
          <div className="text-text font-mono text-xs">
            exit code: {exitCode ?? '—'}
            {result.signal ? `  signal: ${result.signal}` : ''}
          </div>
          {result.compiler_error ? (
            <div>
              <div className="text-danger text-xs font-bold uppercase tracking-wider mb-1">
                Compile error
              </div>
              <pre className="font-mono text-sm text-danger whitespace-pre-wrap wrap-break-word">
                {result.compiler_error}
              </pre>
            </div>
          ) : null}
          {result.program_output ? (
            <div>
              <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-1">
                stdout
              </div>
              <pre className="font-mono text-sm text-text whitespace-pre-wrap wrap-break-word">
                {result.program_output}
              </pre>
            </div>
          ) : null}
          {result.program_error ? (
            <div>
              <div className="text-danger text-xs font-bold uppercase tracking-wider mb-1">
                stderr
              </div>
              <pre className="font-mono text-sm text-danger whitespace-pre-wrap wrap-break-word">
                {result.program_error}
              </pre>
            </div>
          ) : null}
          {!hasOutput ? (
            <div className="font-mono text-sm text-text-muted">(пустой вывод)</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
