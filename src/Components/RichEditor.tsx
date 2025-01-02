import { slate_deserialize, slate_serialize } from "@/System/function";
import isHotkey from "is-hotkey";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import {
  BlockButton,
  Element,
  HOTKEYS,
  Leaf,
  LinkButton,
  MarkButton,
  toggleMark,
  Toolbar,
  withInlines,
} from "./RichEditorUtils";

interface RichEditorInterface {
  name: string;
  control: Control;
  rules?: RegisterOptions;
  defaultValue?: any;
  serialize?: "plaintext" | "html" | "json";
}

const RichEditor = forwardRef<HTMLInputElement, RichEditorInterface>(
  function RichEditorFunc(
    { name, control, rules, defaultValue, serialize = "json" },
    ref: any
  ) {
    const input = !!ref ? ref : useRef<HTMLInputElement>(null);
    const renderElement = useCallback(
      (props: any) => <Element {...props} />,
      []
    );
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
    const editor = useMemo(
      () => withHistory(withInlines(withReact(createEditor()))),
      []
    );
    const initialValue = useMemo(
      () => defaultValue || "<p></p><p></p>",
      [defaultValue]
    );
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={initialValue}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <>
              <div className="space-y-2">
                <Slate
                  editor={editor}
                  initialValue={slate_deserialize(value)}
                  onChange={(value) => {
                    const isAstChange = editor.operations.some(
                      (op: any) => "set_selection" !== op.type
                    );
                    if (isAstChange) {
                      let FinaleValue: any = value;
                      if (serialize == "html") {
                        // serialize to html
                        FinaleValue = slate_serialize(FinaleValue);
                      }
                      onChange(FinaleValue || null);
                    }
                  }}
                >
                  <Toolbar>
                    <MarkButton format="bold" icon="fa-solid fa-bold" />
                    <MarkButton format="italic" icon="fa-solid fa-italic" />
                    <MarkButton
                      format="underline"
                      icon="fa-solid fa-underline"
                    />
                    <MarkButton format="code" icon="fa-solid fa-code" />
                    <LinkButton icon="fa-solid fa-link" />
                    <BlockButton format="heading-one" icon="fa-solid fa-1" />
                    <BlockButton format="heading-two" icon="fa-solid fa-2" />
                    <BlockButton
                      format="block-quote"
                      icon="fa-solid fa-quote-left"
                    />
                    <BlockButton
                      format="numbered-list"
                      icon="fa-solid fa-list-ol"
                    />
                    <BlockButton
                      format="bulleted-list"
                      icon="fa-solid fa-list"
                    />
                    <BlockButton format="left" icon="fa-solid fa-align-left" />
                    <BlockButton
                      format="center"
                      icon="fa-solid fa-align-center"
                    />
                    <BlockButton
                      format="right"
                      icon="fa-solid fa-align-right"
                    />
                    <BlockButton
                      format="justify"
                      icon="fa-solid fa-align-justify"
                    />
                  </Toolbar>
                  <Editable
                    ref={input}
                    onBlur={onBlur}
                    style={{ overflowWrap: "anywhere" }}
                    className="rich-editor py-2 px-3 mb-0.5 bg-gray-700 border-none outline-none text-gray-700 dark:text-white text-sm  rounded-lg ring-2 ring-zenos-500 focus:ring-zenos-500 w-full min-h-72"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some rich text…"
                    spellCheck
                    autoFocus
                    onKeyDown={(event) => {
                      for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as any)) {
                          event.preventDefault();
                          const mark = HOTKEYS[hotkey];
                          toggleMark(editor, mark);
                        }
                      }
                    }}
                  />
                </Slate>
              </div>
              {error && (
                <span
                  className="block mt-0.5 mb-2.5 text-xs tracking-wider font-medium underline underline-offset-4 decoration-dotted text-red-500"
                  dangerouslySetInnerHTML={{
                    __html: error.message || "Error encountered with the input",
                  }}
                ></span>
              )}
            </>
          );
        }}
      />
    );
  }
);
export default RichEditor;
