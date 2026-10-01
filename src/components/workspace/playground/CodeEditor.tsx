import React from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

/** Screen readers announce the editor by name. */
const EDITOR_LABEL = EditorView.contentAttributes.of({ "aria-label": "Code editor" });

type Props = {
  value: string;
  language: "javascript" | "java" | string;
  fontSize: string;
  onChange: (value: string) => void;
};

/** CodeMirror with our theme and languages. Loaded on demand so the problem text renders first. */
const CodeEditor: React.FC<Props> = ({ value, language, fontSize, onChange }) => (
  <CodeMirror
    value={value}
    theme={vscodeDark}
    extensions={[language === "java" ? java() : javascript(), EDITOR_LABEL]}
    style={{ fontSize }}
    onChange={onChange}
  />
);

export default CodeEditor;
