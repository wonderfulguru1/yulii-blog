import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink } from "lucide-react";

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

  const insertYouTubeVideo = () => {
    const videoUrl = window.prompt("Enter YouTube video URL (e.g., https://youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)");
    if (videoUrl) {
      // Extract video ID from various YouTube URL formats
      let videoId = '';
      
      // Handle different YouTube URL formats
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1].split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      } else if (videoUrl.includes('youtube.com/embed/')) {
        videoId = videoUrl.split('embed/')[1].split('?')[0];
      } else {
        // If it's just a video ID, use it directly
        videoId = videoUrl.replace(/[^a-zA-Z0-9_-]/g, '');
      }
      
      if (videoId) {
        // Create responsive YouTube embed
        const youtubeEmbed = `
          <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 16px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              title="YouTube video player">
            </iframe>
          </div>
        `;
        
        exec('insertHTML', youtubeEmbed);
      } else {
        alert('Please enter a valid YouTube video URL');
      }
    }
  };

  const insertExternalLink = () => {
    const url = window.prompt("Enter external URL");
    const linkText = window.prompt("Enter link text (optional)", "");
    
    if (url) {
      // Validate URL
      let validUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        validUrl = `https://${url}`;
      }
      
      const displayText = linkText || url;
      
      // Create simple hyperlink
      const externalLink = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${displayText}</a>`;
      
      exec('insertHTML', externalLink);
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertYouTubeVideo}
          className="text-red-600 hover:text-red-700"
        >
          <Youtube className="h-4 w-4 mr-1" />
          Video
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertExternalLink}
          className="text-blue-600 hover:text-blue-700"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Link
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


