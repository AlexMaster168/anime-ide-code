import axios from 'axios';
import type {
  LangPreset,
  WandboxCompileRequest,
  WandboxCompileResult,
  WandboxCompiler,
} from '../types/compile';

const BASE_URL = 'https://wandbox.org/api';

export const wandboxClient = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
});

export async function fetchCompilers(): Promise<WandboxCompiler[]> {
  const { data } = await wandboxClient.get<WandboxCompiler[]>('/list.json');
  return data;
}

export async function compileAndRun(
  req: WandboxCompileRequest,
): Promise<WandboxCompileResult> {
  const { data } = await wandboxClient.post<WandboxCompileResult>(
    '/compile.json',
    req,
  );
  return data;
}

export const LANG_PRESETS: LangPreset[] = [
  {
    id: 'python',
    label: 'Python 3',
    wandboxLanguage: 'Python',
    fileName: 'main.py',
    starter: 'print("Hello, Лёха!")\n',
  },
  {
    id: 'javascript',
    label: 'JavaScript (Node)',
    wandboxLanguage: 'JavaScript',
    fileName: 'main.js',
    starter: 'console.log("Hello, Лёха!");\n',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    wandboxLanguage: 'TypeScript',
    fileName: 'main.ts',
    starter: 'const msg: string = "Hello, Лёха!";\nconsole.log(msg);\n',
    compilerOptionRaw: '--target\nes2017',
  },
  {
    id: 'go',
    label: 'Go',
    wandboxLanguage: 'Go',
    fileName: 'main.go',
    starter:
      'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Лёха!")\n}\n',
  },
  {
    id: 'rust',
    label: 'Rust',
    wandboxLanguage: 'Rust',
    fileName: 'main.rs',
    starter: 'fn main() {\n    println!("Hello, Лёха!");\n}\n',
  },
  {
    id: 'c',
    label: 'C',
    wandboxLanguage: 'C',
    fileName: 'main.c',
    starter:
      '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, Лёха!\\n");\n    return 0;\n}\n',
  },
  {
    id: 'cpp',
    label: 'C++',
    wandboxLanguage: 'C++',
    fileName: 'main.cpp',
    starter:
      '#include <iostream>\n\nint main() {\n    std::cout << "Hello, Лёха!" << std::endl;\n    return 0;\n}\n',
  },
  {
    id: 'java',
    label: 'Java',
    wandboxLanguage: 'Java',
    fileName: 'Main.java',
    starter:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Лёха!");\n    }\n}\n',
  },
  {
    id: 'csharp',
    label: 'C#',
    wandboxLanguage: 'C#',
    fileName: 'Program.cs',
    starter:
      'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, Лёха!");\n    }\n}\n',
  },
  {
    id: 'ruby',
    label: 'Ruby',
    wandboxLanguage: 'Ruby',
    fileName: 'main.rb',
    starter: 'puts "Hello, Лёха!"\n',
  },
  {
    id: 'php',
    label: 'PHP',
    wandboxLanguage: 'PHP',
    fileName: 'main.php',
    starter: '<?php\necho "Hello, Лёха!\\n";\n',
  },
  {
    id: 'bash',
    label: 'Bash',
    wandboxLanguage: 'Bash script',
    fileName: 'main.sh',
    starter: 'echo "Hello, Лёха!"\n',
  },
];

export function pickCompilerName(
  compilers: WandboxCompiler[],
  language: string,
): string | null {
  const matches = compilers.filter((c) => c.language === language);
  if (matches.length === 0) return null;
  const stable = matches.find((c) => !/(^|-)head($|-)/i.test(c.name));
  return (stable ?? matches[0]).name;
}
