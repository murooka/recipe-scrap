import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, ComponentProps, DragEventHandler, ReactNode } from "react";

import { Button } from "./button";
import { GcpImage } from "./gcp-image";

function useFileDrop(cb: (filelist: FileList) => void) {
  const onDragOver: DragEventHandler<HTMLElement> = useCallback((e) => {
    e.preventDefault();
  }, []);
  const onDrop: DragEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length === 0) return;

      cb(e.dataTransfer.files);
    },
    [cb],
  );

  return { onDragOver, onDrop } as const;
}

type InputImageProps = ComponentProps<"input"> & { defaultImageUrl?: string };
export function InputImage(props: InputImageProps): ReactNode {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((filelist: FileList) => {
    setFile(filelist[0]);
  }, []);

  const buttonDropHandlers = useFileDrop(handleFileChange);
  const imageDropHandlers = useFileDrop(handleFileChange);

  const onButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) setFile(files[0]);
  }, []);

  const inputImageUrl = file ? URL.createObjectURL(file) : null;
  useEffect(() => {
    return () => {
      if (inputImageUrl) URL.revokeObjectURL(inputImageUrl);
    };
  }, [inputImageUrl]);

  const imageUrl = inputImageUrl || props.defaultImageUrl;

  return (
    <div>
      <input ref={inputRef} {...props} type="file" accept="image/*" onChange={onFileInputChange} className="hidden" />
      {imageUrl ? (
        <div className="relative">
          <GcpImage src={imageUrl} {...imageDropHandlers} alt="" className="w-full" />
          <button
            type="button"
            onClick={onButtonClick}
            className="absolute right-4 top-4 rounded bg-neutral-800/50 p-2"
          >
            <RefreshCw className="text-neutral-200" />
          </button>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={onButtonClick} {...buttonDropHandlers}>
          ファイルを選択
        </Button>
      )}
    </div>
  );
}
