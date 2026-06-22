'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  ImageIcon,
  Code,
  Type,
  Undo,
  Redo,
  Eraser,
  Minus,
  Superscript,
  Subscript,
  Indent,
  Outdent,
  Maximize,
  Minimize,
  Palette,
  Highlighter,
  Table,
  Link2Off,
  Eye,
  Image as ImgIcon,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  stickyTop?: string;
}

const FONT_FAMILIES = [
  { label: 'Default Font', value: '' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Courier New', value: "'Courier New', Courier, monospace" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: 'Impact', value: 'Impact, Charcoal, sans-serif' },
];

const FONT_SIZES = [
  { label: 'Small', value: '1' },
  { label: 'Normal', value: '3' },
  { label: 'Large', value: '5' },
  { label: 'Huge', value: '7' },
];

const HEADINGS = [
  { label: 'Paragraph', value: 'P' },
  { label: 'Heading 1', value: 'H1' },
  { label: 'Heading 2', value: 'H2' },
  { label: 'Heading 3', value: 'H3' },
  { label: 'Heading 4', value: 'H4' },
  { label: 'Heading 5', value: 'H5' },
  { label: 'Heading 6', value: 'H6' },
  { label: 'Preformatted', value: 'PRE' },
];

const RichTextEditor = React.memo(function RichTextEditor({
  initialContent,
  onChange,
  placeholder = 'Start writing your amazing blog post here...',
  minHeight = 'min-h-[500px]',
  stickyTop = 'top-0',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Image Resizer State
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imgPos, setImgPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  // We only set the initial HTML once to prevent cursor jumping
  const isInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      if (initialContent) {
        editorRef.current.innerHTML = initialContent;
        updateCounts(initialContent);
      }
      isInitialized.current = true;
    }
  }, [initialContent]);

  const updateCounts = (html: string) => {
    const text = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    setCharCount(text.length);
    setWordCount(text.length > 0 ? text.split(' ').length : 0);
  };

  // Sync content back to parent
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateCounts(html);
      checkActiveFormats();
    }
  }, [onChange]);

  const checkActiveFormats = useCallback(() => {
    const formats: string[] = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    if (document.queryCommandState('strikethrough')) formats.push('strikethrough');
    if (document.queryCommandState('insertUnorderedList')) formats.push('ul');
    if (document.queryCommandState('insertOrderedList')) formats.push('ol');
    if (document.queryCommandState('justifyLeft')) formats.push('alignLeft');
    if (document.queryCommandState('justifyCenter')) formats.push('alignCenter');
    if (document.queryCommandState('justifyRight')) formats.push('alignRight');
    if (document.queryCommandState('justifyFull')) formats.push('alignJustify');
    if (document.queryCommandState('superscript')) formats.push('superscript');
    if (document.queryCommandState('subscript')) formats.push('subscript');

    // Check block formats (like headers)
    try {
      const block = document.queryCommandValue('formatBlock');
      if (block) {
        formats.push(block.toLowerCase());
      }
    } catch (e) {}

    setActiveFormats(formats);
  }, []);

  const execCommand = (command: string, value: string = '') => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const addLink = () => {
    const url = prompt('Enter the link URL (e.g. https://example.com):');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const addImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        editorRef.current?.focus();
        // Give it an id or class so we can potentially select it? No need, it is an img tag
        const imgHtml = `<img src="${base64Url}" alt="Uploaded Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: inline-block; cursor: pointer;" />`;
        document.execCommand('insertHTML', false, imgHtml);
        handleInput();
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const insertTable = () => {
    const rows = prompt('Enter number of rows:', '3');
    const cols = prompt('Enter number of columns:', '3');
    if (rows && cols) {
      let tableHtml =
        '<table style="width: 100%; border-collapse: collapse; margin: 16px 0;"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHtml += `<td style="border: 1px solid #e5e7eb; padding: 8px; min-width: 50px;"><br></td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table><p><br></p>';
      execCommand('insertHTML', tableHtml);
    }
  };

  const insertQuoteBlock = () => {
    const text = prompt('Enter the quote text:');
    if (!text) return;
    const author = prompt('Enter the author or source (optional):');
    
    let html = `<blockquote><p>${text}</p>`;
    if (author) {
      html += `<footer>— ${author}</footer>`;
    }
    html += `</blockquote><p><br></p>`;
    execCommand('insertHTML', html);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    setTimeout(handleInput, 0);
  };

  // --- Image Overlay & Resizing Logic ---
  useEffect(() => {
    const handleEditorClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLImageElement) {
        setSelectedImage(e.target);
      } else {
        setSelectedImage(null);
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        setSelectedImage(null);
      }
    };

    const handleDrop = () => {
      setTimeout(handleInput, 100); // Sync after drop
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedImage) {
          e.preventDefault();
          selectedImage.remove();
          setSelectedImage(null);
          handleInput();
        }
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('click', handleEditorClick);
      editor.addEventListener('keydown', handleKeyDown);
      editor.addEventListener('dragstart', handleDragStart);
      editor.addEventListener('drop', handleDrop);
    }
    return () => {
      if (editor) {
        editor.removeEventListener('click', handleEditorClick);
        editor.removeEventListener('keydown', handleKeyDown);
        editor.removeEventListener('dragstart', handleDragStart);
        editor.removeEventListener('drop', handleDrop);
      }
    };
  }, [selectedImage, handleInput]);

  useEffect(() => {
    if (selectedImage && editorRef.current && containerRef.current) {
      const updatePos = () => {
        const containerRect = containerRef.current!.getBoundingClientRect();
        const imgRect = selectedImage.getBoundingClientRect();

        // We use relative positioning to the scrollable container
        setImgPos({
          top: imgRect.top - containerRect.top + containerRef.current!.scrollTop,
          left: imgRect.left - containerRect.left + containerRef.current!.scrollLeft,
          width: imgRect.width,
          height: imgRect.height,
        });
      };

      updatePos();

      const resizeObserver = new ResizeObserver(updatePos);
      resizeObserver.observe(selectedImage);
      // Observe container too to re-adjust when scrolling
      containerRef.current.addEventListener('scroll', updatePos);

      return () => {
        resizeObserver.disconnect();
        containerRef.current?.removeEventListener('scroll', updatePos);
      };
    }
  }, [selectedImage]);

  const handleResizeStart = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = selectedImage.offsetWidth;
    const startHeight = selectedImage.offsetHeight;
    const ratio = startWidth / startHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let newWidth = startWidth;

      if (corner.includes('right')) {
        newWidth = startWidth + dx;
      } else if (corner.includes('left')) {
        newWidth = startWidth - dx;
      }

      // Constrain minimum width
      newWidth = Math.max(newWidth, 50);

      selectedImage.style.width = `${newWidth}px`;
      selectedImage.style.height = `${newWidth / ratio}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      handleInput();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const alignImage = (alignment: 'left' | 'center' | 'right' | 'inline', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) return;

    // Reset alignment
    selectedImage.style.float = 'none';
    selectedImage.style.display = 'inline-block';
    selectedImage.style.margin = '0';

    if (alignment === 'left') {
      selectedImage.style.float = 'left';
      selectedImage.style.margin = '0 16px 16px 0'; // text wrapping left
    } else if (alignment === 'right') {
      selectedImage.style.float = 'right';
      selectedImage.style.margin = '0 0 16px 16px'; // text wrapping right
    } else if (alignment === 'center') {
      selectedImage.style.display = 'block';
      selectedImage.style.margin = '16px auto'; // centering block
    } else {
      // Inline
      selectedImage.style.margin = '16px 0';
    }
    handleInput();
  };

  const moveImage = (direction: 'up' | 'down', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) return;

    // Find the closest block parent (p, div, etc) of the image
    let currentBlock = selectedImage as HTMLElement;
    while (currentBlock.parentElement && currentBlock.parentElement !== editorRef.current) {
      currentBlock = currentBlock.parentElement;
    }

    if (direction === 'up') {
      const prev = currentBlock.previousElementSibling;
      if (prev) {
        prev.insertAdjacentElement('beforebegin', currentBlock);
      }
    } else {
      const next = currentBlock.nextElementSibling;
      if (next) {
        next.insertAdjacentElement('afterend', currentBlock);
      }
    }

    // We scroll the image into view after move
    setTimeout(() => {
      currentBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Force trigger re-render of overlay
      setSelectedImage(null);
      setTimeout(() => setSelectedImage(selectedImage), 50);
    }, 10);

    handleInput();
  };

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    isActive = false,
    title,
  }: {
    icon: any;
    onClick: () => void;
    isActive?: boolean;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        'p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0',
        isActive
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
      )}
    >
      <Icon size={16} />
    </button>
  );

  const Divider = () => (
    <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1 flex-shrink-0" />
  );

  return (
    <div
      className={cn(
        'flex flex-col transition-all duration-300 bg-white dark:bg-[#151515] relative',
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none'
          : 'border rounded-2xl h-[500px] sm:h-[600px] lg:h-[700px]',
        !isFullscreen && isFocused
          ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-md'
          : !isFullscreen && 'border-gray-200 dark:border-white/10'
      )}
    >
      {/* Hidden Inputs */}
      <input
        type="color"
        ref={colorInputRef}
        onChange={(e) => execCommand('foreColor', e.target.value)}
        className="hidden"
      />
      <input
        type="color"
        ref={bgColorInputRef}
        onChange={(e) => execCommand('hiliteColor', e.target.value)}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Advanced Formatting Toolbar */}
      <div
        className={cn(
          'flex flex-col gap-2 p-2 sm:p-3 bg-gray-50/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 w-full shadow-sm z-10',
          isFullscreen ? 'sticky top-0 rounded-none' : 'rounded-t-2xl flex-shrink-0'
        )}
      >
        {/* Top Row: Selects and primary actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="h-8 md:h-9 text-xs sm:text-sm bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-md px-2 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none max-w-[120px]"
            title="Format"
          >
            {HEADINGS.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => execCommand('fontName', e.target.value)}
            className="h-8 md:h-9 text-xs sm:text-sm bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-md px-2 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none max-w-[120px]"
            title="Font Family"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            className="h-8 md:h-9 text-xs sm:text-sm bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-md px-2 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none"
            title="Font Size"
          >
            {FONT_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <Divider />

          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5"
            title="Text Color"
          >
            <Palette size={16} /> <span className="hidden sm:inline">Color</span>
          </button>
          <button
            type="button"
            onClick={() => bgColorInputRef.current?.click()}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5"
            title="Background Color"
          >
            <Highlighter size={16} /> <span className="hidden sm:inline">Highlight</span>
          </button>

          <div className="flex-grow"></div>

          <ToolbarButton
            icon={isFullscreen ? Minimize : Maximize}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          />
        </div>

        {/* Bottom Row: Icons */}
        <div className="flex flex-wrap items-center gap-1">
          <ToolbarButton icon={Undo} onClick={() => execCommand('undo')} title="Undo" />
          <ToolbarButton icon={Redo} onClick={() => execCommand('redo')} title="Redo" />
          <Divider />

          {/* Text Formats */}
          <ToolbarButton
            icon={Bold}
            onClick={() => execCommand('bold')}
            isActive={activeFormats.includes('bold')}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            icon={Italic}
            onClick={() => execCommand('italic')}
            isActive={activeFormats.includes('italic')}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            icon={Underline}
            onClick={() => execCommand('underline')}
            isActive={activeFormats.includes('underline')}
            title="Underline (Ctrl+U)"
          />
          <ToolbarButton
            icon={Strikethrough}
            onClick={() => execCommand('strikethrough')}
            isActive={activeFormats.includes('strikethrough')}
            title="Strikethrough"
          />
          <ToolbarButton
            icon={Superscript}
            onClick={() => execCommand('superscript')}
            isActive={activeFormats.includes('superscript')}
            title="Superscript"
          />
          <ToolbarButton
            icon={Subscript}
            onClick={() => execCommand('subscript')}
            isActive={activeFormats.includes('subscript')}
            title="Subscript"
          />
          <Divider />

          {/* Alignment */}
          <ToolbarButton
            icon={AlignLeft}
            onClick={() => execCommand('justifyLeft')}
            isActive={activeFormats.includes('alignLeft')}
            title="Align Left"
          />
          <ToolbarButton
            icon={AlignCenter}
            onClick={() => execCommand('justifyCenter')}
            isActive={activeFormats.includes('alignCenter')}
            title="Align Center"
          />
          <ToolbarButton
            icon={AlignRight}
            onClick={() => execCommand('justifyRight')}
            isActive={activeFormats.includes('alignRight')}
            title="Align Right"
          />
          <ToolbarButton
            icon={AlignJustify}
            onClick={() => execCommand('justifyFull')}
            isActive={activeFormats.includes('alignJustify')}
            title="Justify"
          />
          <Divider />

          {/* Lists & Indent */}
          <ToolbarButton
            icon={List}
            onClick={() => execCommand('insertUnorderedList')}
            isActive={activeFormats.includes('ul')}
            title="Bullet List"
          />
          <ToolbarButton
            icon={ListOrdered}
            onClick={() => execCommand('insertOrderedList')}
            isActive={activeFormats.includes('ol')}
            title="Numbered List"
          />
          <ToolbarButton icon={Indent} onClick={() => execCommand('indent')} title="Indent" />
          <ToolbarButton icon={Outdent} onClick={() => execCommand('outdent')} title="Outdent" />
          <ToolbarButton
            icon={Quote}
            onClick={insertQuoteBlock}
            title="Insert Beautiful Quote"
          />
          <Divider />

          {/* Insertions */}
          <ToolbarButton icon={LinkIcon} onClick={addLink} title="Insert Link" />
          <ToolbarButton
            icon={Link2Off}
            onClick={() => execCommand('unlink')}
            title="Remove Link"
          />
          <ToolbarButton icon={ImageIcon} onClick={addImage} title="Upload Image" />
          <ToolbarButton icon={Table} onClick={insertTable} title="Insert Table" />
          <ToolbarButton
            icon={Minus}
            onClick={() => execCommand('insertHorizontalRule')}
            title="Horizontal Line"
          />
          <ToolbarButton
            icon={Code}
            onClick={() => execCommand('formatBlock', 'PRE')}
            isActive={activeFormats.includes('pre')}
            title="Code Block"
          />
          <Divider />

          {/* Clear */}
          <ToolbarButton
            icon={Eraser}
            onClick={() => execCommand('removeFormat')}
            title="Clear All Formatting"
          />
        </div>
      </div>

      {/* Editor Content Area Wrapper (relative for image overlay) */}
      <div
        ref={containerRef}
        className={cn(
          'flex-grow overflow-y-auto relative bg-white dark:bg-[#151515] p-2 sm:p-4',
          isFullscreen ? 'h-[calc(100vh-140px)]' : ''
        )}
      >
        <div
          ref={editorRef}
          className={cn(
            'p-4 sm:p-6 lg:px-12 outline-none max-w-4xl mx-auto w-full text-gray-800 dark:text-gray-200 cursor-text',
            '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:my-4',
            '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:my-3',
            '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:my-2',
            '[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-gray-900 dark:[&_h4]:text-white [&_h4]:my-2',
            '[&_p]:my-2',
            '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2',
            '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2',
            '[&_li]:mb-1',
            '[&_a]:text-indigo-600 [&_a]:underline hover:[&_a]:text-indigo-500',
            '[&_img]:rounded-xl [&_img]:shadow-lg [&_img]:cursor-pointer hover:[&_img]:opacity-90 transition-opacity [&_img]:my-4',
            '[&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_code]:font-mono',
            '[&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-gray-50 dark:[&_blockquote]:bg-white/5 [&_blockquote]:py-1 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-lg [&_blockquote]:my-4',
            '[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-gray-300 dark:[&_th]:border-gray-700 [&_th]:p-2 [&_th]:bg-gray-100 dark:[&_th]:bg-white/10 [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-700 [&_td]:p-2',
            minHeight,
            editorRef.current?.innerHTML === ''
              ? 'before:content-[attr(data-placeholder)] before:text-gray-400 before:cursor-text before:absolute'
              : ''
          )}
          contentEditable
          data-placeholder={placeholder}
          onInput={handleInput}
          onKeyUp={checkActiveFormats}
          onMouseUp={checkActiveFormats}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          style={isFullscreen ? { minHeight: '100%' } : { minHeight: '500px' }}
        />

        {/* Image Resizer Overlay */}
        {selectedImage && (
          <div
            className="absolute z-10 border-2 border-indigo-500 pointer-events-none"
            style={{
              top: imgPos.top,
              left: imgPos.left,
              width: imgPos.width,
              height: imgPos.height,
            }}
          >
            {/* Corners (pointer-events-auto so they can be clicked) */}
            <div
              className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 cursor-nwse-resize pointer-events-auto rounded-full"
              onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            />
            <div
              className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 cursor-nesw-resize pointer-events-auto rounded-full"
              onMouseDown={(e) => handleResizeStart(e, 'top-right')}
            />
            <div
              className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 cursor-nesw-resize pointer-events-auto rounded-full"
              onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
            />
            <div
              className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 cursor-nwse-resize pointer-events-auto rounded-full"
              onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            />

            {/* Image Toolbar */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex gap-1 pointer-events-auto items-center">
              <button
                onClick={(e) => moveImage('up', e)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                title="Move Up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={(e) => moveImage('down', e)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-1" />
              <button
                onClick={(e) => alignImage('left', e)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                title="Wrap Text Left"
              >
                <AlignLeft size={14} />
              </button>
              <button
                onClick={(e) => alignImage('center', e)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                title="Center Image (Break Text)"
              >
                <AlignCenter size={14} />
              </button>
              <button
                onClick={(e) => alignImage('right', e)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                title="Wrap Text Right"
              >
                <AlignRight size={14} />
              </button>
              <button
                onClick={(e) => alignImage('inline', e)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                title="Inline Default"
              >
                <Type size={14} />
              </button>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-1" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  selectedImage.remove();
                  setSelectedImage(null);
                  handleInput();
                }}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"
                title="Delete Image"
              >
                <Eraser size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer / Status Bar */}
      <div className="bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/10 px-4 py-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-1 text-indigo-500">
          <Eye size={12} /> Live Preview
        </div>
      </div>
    </div>
  );
});

export default RichTextEditor;
