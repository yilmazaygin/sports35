import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = '' }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[200px] px-3 py-2 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
            <div className="flex flex-wrap gap-1 border-b border-zinc-200 bg-zinc-50 p-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    label="B"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    label="I"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    label="H2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    label="• List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    label="1. List"
                />
            </div>
            <EditorContent editor={editor} placeholder={placeholder} />
        </div>
    );
}

function ToolbarButton({ onClick, active, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded px-2 py-1 text-xs font-medium ${
                active ? 'bg-brand-red text-white' : 'bg-white text-zinc-700 hover:bg-zinc-100'
            }`}
        >
            {label}
        </button>
    );
}
