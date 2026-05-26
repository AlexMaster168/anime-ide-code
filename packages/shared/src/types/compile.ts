export interface WandboxCompiler {
  name: string;
  version: string;
  language: string;
  ['display-name']: string;
  ['display-compile-command']: string;
  ['compiler-option-raw']: boolean;
  ['runtime-option-raw']: boolean;
}

export interface WandboxCompileRequest {
  compiler: string;
  code: string;
  stdin?: string;
  'compiler-option-raw'?: string;
  'runtime-option-raw'?: string;
  save?: boolean;
}

export interface WandboxCompileResult {
  status: string;
  signal?: string | null;
  compiler_output?: string;
  compiler_error?: string;
  compiler_message?: string;
  program_output?: string;
  program_error?: string;
  program_message?: string;
  permlink?: string;
  url?: string;
}

export interface LangPreset {
  id: string;
  label: string;
  wandboxLanguage: string;
  fileName: string;
  starter: string;
}
