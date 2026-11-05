import { ErrorMessage } from '@hookform/error-message';
import { Editor } from '@tinymce/tinymce-react';
import { capitalizeErrorMessage } from 'helpers';
import React from 'react';
import { get } from 'react-hook-form';
import { ON_PASTE_MULTILINE_SEPARATOR_REGEX } from './helpers';
import { Props } from './types';
import { useTinyMCE } from './useTinyMCE';
import { cn } from 'lib';

const TinyMCE: React.FC<Props> = (props) => {
  const {
    blurHandler,
    focusHandler,
    isEditorVisible,
    labelRef,
    appearedOnce,
    editorRef,
    borderOverlayRef,
    bottomOverlayRef,
    topOverlayRef,
    editorIsMounted,
    setEditorIsMounted,
    editorOnChangeHandler,
    errors,
    value,
    editorEventListeners,
    isEditorLoading,
    setIsEditorLoading,
  } = useTinyMCE(
    props.inputName,
    props.externalOnChangeHandler,
    props.needsDraft,
    props.placeholder,
    props.registerOptions,
  );

  const extraInitConfiguration = props.extraInitConfiguration ?? {};
  const fieldError = get(errors, props.inputName);

  return (
    <label htmlFor={props.inputName} ref={labelRef} className='flex w-full flex-col space-y-2'>
      {appearedOnce || isEditorVisible || props.doesNotNeedScrollObserver ? (
        <>
          {props.labelName && (
            <div className='flex items-center justify-between mb-2'>
              <span
                className={cn(
                  'flex items-center gap-2 text-sm font-medium text-foreground',
                  fieldError && 'text-destructive',
                  props.canNotEdit && 'opacity-50',
                )}
              >
                {props.labelName} {props.required && <span className='text-destructive'>*</span>}
              </span>
            </div>
          )}

          <div
            className={cn(
              'relative rounded-lg border border-input',
              fieldError && ' border-destructive ring-3 ring-destructive/20',
              props.canNotEdit && 'pointer-events-none bg-input/50 opacity-50',
            )}
          >
            {props.needsLoader && !editorIsMounted && (
              <div
                style={{ height: props.height }}
                className='absolute top-0 left-0 z-50 w-full animate-pulse rounded-[10px] bg-gray-300'
              >
                &#8203;
              </div>
            )}
            {props.needsOverlay && (
              <>
                <div
                  ref={borderOverlayRef}
                  className='pointer-events-none absolute top-0 left-0 z-10 h-full w-full border-2 border-white'
                />
                <div
                  ref={topOverlayRef}
                  className='absolute top-0 left-0 z-10 h-15 w-full bg-white'
                />
                <div
                  tabIndex={0}
                  ref={bottomOverlayRef}
                  className='absolute top-full left-0 z-10 h-8 w-full -translate-y-[95%] bg-white'
                />
              </>
            )}
            {isEditorLoading && (
              <div
                className='h-full w-full my-5 bg-zinc-300 transition-opacity opacity-0 animate-pulse rounded-md'
                style={{
                  height: props.height,
                }}
              />
            )}
            <div hidden={isEditorLoading}>
              <Editor
                tinymceScriptSrc='/tinymce/tinymce.min.js'
                onInit={(_e, editor) => {
                  setEditorIsMounted(true);
                  setIsEditorLoading(false);
                  editorRef.current = editor;
                }}
                init={{
                  statusbar: false,
                  inline_styles: true,
                  selector: 'textarea#emoticons',
                  height: props.height,
                  menubar: false,
                  body_class: props.inputName,
                  plugins: `advlist autolink lists emoticons link ${props.extraPlugins ?? ''}`,
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic | ' +
                    'bullist numlist outdent indent | link emoticons',
                  content_style:
                    "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap'); html { cursor: text; } body { font-family: 'DM Sans', sans-serif; font-size: 14px; color: oklch(0.141 0.005 285.823); }",
                  placeholder: props.placeholder,
                  default_link_target: '',
                  link_target_list: false,
                  link_quicklink: true,
                  entity_encoding: 'raw',
                  advlist_bullet_styles: 'disc',
                  smart_paste: true,
                  paste_preprocess: (_editor, args) => {
                    args.content = args.content.replaceAll(
                      ON_PASTE_MULTILINE_SEPARATOR_REGEX,
                      '<p style="margin: 0px 0px 15px; padding: 0px; text-align: justify;"></p>',
                    );
                    args.content = args.content.replace(/style="[^"]*background-color[^"]*"/gi, '');
                  },
                  ...(extraInitConfiguration as any),
                  setup: (editor) => {
                    editorEventListeners(editor);
                    extraInitConfiguration.setup?.(editor);
                  },
                }}
                onEditorChange={editorOnChangeHandler}
                onFocus={focusHandler}
                value={value}
                onBlur={blurHandler}
                disabled={props.canNotEdit}
              />
            </div>
          </div>
          {fieldError && (
            <div className='mt-1 h-4 min-h-4 text-xs text-red-500 text-left'>
              <ErrorMessage
                render={capitalizeErrorMessage}
                name={props.inputName}
                errors={errors}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ height: props.height }} className='block w-full animate-pulse bg-gray-300'>
          &#8203;
        </div>
      )}
    </label>
  );
};

export default TinyMCE;
