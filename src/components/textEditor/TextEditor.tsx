import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  ContentState,
  DraftEntityType,
  ContentBlock,
} from "draft-js";
import "draft-js/dist/Draft.css";

const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

const Link = (props: {
  contentState: ContentState;
  entityKey: string;
  children: React.ReactNode;
}) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {props.children}
    </a>
  );
};

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  const [editorState, setEditorState] = useState(
    value
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(value)),
          decorator
        )
      : EditorState.createEmpty(decorator)
  );

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(contentState)));
  };

  const toggleInlineStyle = (style: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const addLink = () => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const url = window.prompt("Enter the URL")?.trim();

    if (url) {
      // Ensure URL has a protocol
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

      const contentStateWithEntity = contentState.createEntity(
        "LINK" as DraftEntityType,
        "MUTABLE",
        { url: formattedUrl }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.push(
        editorState,
        contentStateWithEntity,
        "apply-entity"
      );

      handleEditorChange(
        RichUtils.toggleLink(newEditorState, selection, entityKey)
      );
    }
  };

  return (
    <div className="border rounded p-2">
      <div className="flex space-x-2 mb-2">
        <button
          type="button"
          onClick={() => toggleInlineStyle("BOLD")}
          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => toggleInlineStyle("ITALIC")}
          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => toggleBlockType("ordered-list-item")}
          className="bg-purple-500 text-white px-2 py-1 rounded text-sm"
        >
          OL
        </button>
        <button
          type="button"
          onClick={() => toggleBlockType("unordered-list-item")}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
        >
          UL
        </button>
        <button
          type="button"
          onClick={addLink}
          className="bg-indigo-500 text-white px-2 py-1 rounded text-sm"
        >
          Link
        </button>
      </div>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        placeholder={placeholder}
        readOnly={disabled}
      />
    </div>
  );
};

export default RichTextEditor;
