import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  compileAndRun,
  fetchCompilers,
  getSnippet,
  LANG_PRESETS,
  parseCompileErrors,
  pickCompilerName,
  snippetsForLang,
} from '@anime-ide-code/shared';
import type {
  CompileDiagnostic,
  WandboxCompileResult,
  WandboxCompiler,
} from '@anime-ide-code/shared';
import { useCompiler } from '../../src/store/compiler';
import { colors } from '../../src/theme/colors';

export default function CompilerScreen() {
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
  const [snippetsOpen, setSnippetsOpen] = useState(false);

  const snippets = useMemo(() => snippetsForLang(langId), [langId]);
  const insertSnippet = (snippetId: string) => {
    const code = getSnippet(langId, snippetId);
    if (code) setSource(langId, code);
    setSnippetsOpen(false);
  };

  useEffect(() => {
    fetchCompilers().then(setCompilers).catch(() => setCompilers([]));
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
        ...(preset.compilerOptionRaw
          ? { 'compiler-option-raw': preset.compilerOptionRaw }
          : {}),
      });
      setResult(res);
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ?? e?.message ?? 'Ошибка запуска',
      );
    } finally {
      setRunning(false);
    }
  };

  const exitCode = result ? parseInt(result.status, 10) : null;
  const hasOutput = Boolean(
    result?.program_output ||
      result?.program_error ||
      result?.compiler_error ||
      result?.compiler_output,
  );
  const diagnostics: CompileDiagnostic[] = useMemo(
    () => (result ? parseCompileErrors(result, preset.id) : []),
    [result, preset.id],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Язык</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.langRow}
        >
          {LANG_PRESETS.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => setLang(p.id)}
              style={[
                styles.chip,
                p.id === langId && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  p.id === langId && styles.chipTextActive,
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.meta}>
          Wandbox: {compilerName ?? '…'}
        </Text>

        <View style={styles.codeLabelRow}>
          <Text style={styles.label}>Код</Text>
          {snippets.length > 0 ? (
            <Pressable
              style={styles.snippetBtn}
              onPress={() => setSnippetsOpen(true)}
            >
              <Text style={styles.snippetBtnText}>📦 Сниппеты ▾</Text>
            </Pressable>
          ) : null}
        </View>
        <TextInput
          value={source}
          onChangeText={(v) => setSource(preset.id, v)}
          multiline
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          style={styles.code}
          placeholder="// сюда код"
          placeholderTextColor={colors.textMuted}
        />

        <Modal
          visible={snippetsOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setSnippetsOpen(false)}
        >
          <View style={styles.snippetBackdrop}>
            <View style={styles.snippetSheet}>
              <View style={styles.snippetHeader}>
                <Text style={styles.snippetTitle}>Сниппеты — {preset.label}</Text>
                <Pressable onPress={() => setSnippetsOpen(false)} hitSlop={10}>
                  <Text style={styles.snippetClose}>✕</Text>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
                {snippets.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.snippetItem}
                    onPress={() => insertSnippet(s.id)}
                  >
                    <Text style={styles.snippetItemText}>{s.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {diagnostics.length > 0 ? (
          <View style={styles.diagsWrap}>
            {diagnostics.slice(0, 8).map((d, i) => (
              <View
                key={i}
                style={[
                  styles.diagChip,
                  d.severity === 'error' && styles.diagChipError,
                  d.severity === 'warning' && styles.diagChipWarn,
                ]}
              >
                <Text
                  style={[
                    styles.diagChipText,
                    {
                      color:
                        d.severity === 'error'
                          ? colors.danger
                          : d.severity === 'warning'
                            ? colors.warn
                            : colors.textDim,
                    },
                  ]}
                >
                  <Text style={{ fontWeight: '800' }}>L{d.line}</Text>
                  {d.column ? <Text>:{d.column}</Text> : null}
                  <Text>  ·  </Text>
                  <Text>{d.message}</Text>
                </Text>
              </View>
            ))}
            {diagnostics.length > 8 ? (
              <Text style={styles.diagMore}>ещё {diagnostics.length - 8}…</Text>
            ) : null}
          </View>
        ) : null}

        <Text style={styles.label}>stdin (необязательно)</Text>
        <TextInput
          value={stdin}
          onChangeText={setStdin}
          multiline
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.code, { minHeight: 70 }]}
          placeholder="ввод программы"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.actions}>
          <Pressable
            onPress={onRun}
            disabled={running || !compilerName}
            style={[styles.btn, (running || !compilerName) && { opacity: 0.6 }]}
          >
            {running ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>▶ Запустить</Text>
            )}
          </Pressable>
          <Pressable
            onPress={resetCurrent}
            style={[styles.btn, styles.btnSecondary]}
          >
            <Text style={[styles.btnText, { color: colors.text }]}>
              Сброс
            </Text>
          </Pressable>
        </View>

        {err ? (
          <View style={[styles.output, { borderColor: colors.danger }]}>
            <Text style={[styles.outputTitle, { color: colors.danger }]}>
              Ошибка
            </Text>
            <Text style={styles.outputText}>{err}</Text>
          </View>
        ) : null}

        {result ? (
          <View style={styles.output}>
            <Text style={styles.outputTitle}>
              exit code: {exitCode ?? '—'}
              {result.signal ? `  signal: ${result.signal}` : ''}
            </Text>
            {result.compiler_error ? (
              <>
                <Text style={[styles.outputLabel, { color: colors.danger }]}>
                  Compile error
                </Text>
                <Text style={[styles.outputText, { color: colors.danger }]}>
                  {result.compiler_error}
                </Text>
              </>
            ) : null}
            {result.program_output ? (
              <>
                <Text style={styles.outputLabel}>stdout</Text>
                <Text style={styles.outputText}>{result.program_output}</Text>
              </>
            ) : null}
            {result.program_error ? (
              <>
                <Text style={[styles.outputLabel, { color: colors.danger }]}>
                  stderr
                </Text>
                <Text style={[styles.outputText, { color: colors.danger }]}>
                  {result.program_error}
                </Text>
              </>
            ) : null}
            {!hasOutput ? (
              <Text style={styles.outputText}>(пустой вывод)</Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  label: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  langRow: { paddingVertical: 4, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  meta: { color: colors.textMuted, fontSize: 11, marginTop: 6, fontFamily: mono },
  code: {
    backgroundColor: colors.bgCard,
    color: colors.text,
    borderRadius: 10,
    padding: 12,
    fontFamily: mono,
    fontSize: 13,
    minHeight: 220,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diagsWrap: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  diagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  diagChipError: {
    borderColor: 'rgba(255,92,122,0.55)',
    backgroundColor: 'rgba(255,92,122,0.10)',
  },
  diagChipWarn: {
    borderColor: 'rgba(245,182,66,0.55)',
    backgroundColor: 'rgba(245,182,66,0.10)',
  },
  diagChipText: { fontFamily: mono, fontSize: 11 },
  diagMore: { color: colors.textMuted, fontSize: 11, alignSelf: 'center' },
  codeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  snippetBtn: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  snippetBtnText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  snippetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  snippetSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '75%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  snippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  snippetTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  snippetClose: { color: colors.text, fontSize: 22, paddingHorizontal: 4 },
  snippetItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  snippetItemText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondary: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  output: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outputTitle: {
    color: colors.text,
    fontFamily: mono,
    fontSize: 12,
    marginBottom: 8,
  },
  outputLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  outputText: { color: colors.text, fontFamily: mono, fontSize: 13 },
});
