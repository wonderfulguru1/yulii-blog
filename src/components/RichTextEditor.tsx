import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor = ({ value, onChange, placeholder = "Write your content...", minHeight = 300 }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Allow rich HTML paste (keep formatting)
    // If you want to sanitize, add a sanitizer here before onChange
    // For now, we let the browser insert HTML, then sync state
    setTimeout(() => handleInput(), 0);
  };

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-muted/50">
        <Button type="button" variant="outline" size="sm" onClick={() => exec("bold")}>B</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("italic")}>I</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("underline")}>U</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("formatBlock", "<h2>")}>H2</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("formatBlock", "<h3>")}>H3</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("insertUnorderedList")}>• List</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("insertOrderedList")}>1. List</Button>
        <div className="mx-2 w-px self-stretch bg-border" />
        <Button type="button" variant="outline" size="sm" onClick={() => exec("justifyLeft")}>Left</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("justifyCenter")}>Center</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("justifyRight")}>Right</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("justifyFull")}>Justify</Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) exec("createLink", url);
          }}
        >
          Link
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const url = window.prompt("Enter image URL");
            if (url) exec("insertImage", url);
          }}
        >
          Image
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("removeFormat")}>Clear</Button>
      </div>
      <div
        ref={editorRef}
        className="p-3 outline-none prose prose-sm max-w-none"
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;


