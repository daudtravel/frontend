import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
 
 
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
} from "lucide-react";
import { cn } from "@/src/utlis/cn";
import { Toggle } from "../ui/toggle";

const Tiptap = ({ onChange, value, disabled }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "min-h-[150px] focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading")}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          disabled={disabled}
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const RichTextFormField = ({ form, name, label, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Tiptap
              value={field.value}
              onChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RichTextFormField;
