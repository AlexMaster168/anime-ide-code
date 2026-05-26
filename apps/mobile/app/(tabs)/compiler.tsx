import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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
  LANG_PRESETS,
  pickCompilerName,
} from '@anime-ide-code/shared';
import type {
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

        <Text style={styles.label}>Код</Text>
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
