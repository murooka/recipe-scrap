/* eslint-disable @next/next/no-img-element */
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";

import { Button } from "./button";

type InputFileProps = ComponentProps<"input">;
export function InputFile(props: InputFileProps): ReactNode {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, []);

  const imageUrl = file ? URL.createObjectURL(file) : null;
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div>
      <input ref={inputRef} {...props} type="file" accept="image/*" onChange={onFileInputChange} className="hidden" />
      {imageUrl ? (
        <div className="relative">
          <img src={imageUrl} alt="" className="w-full" />
          <button
            type="button"
            onClick={onButtonClick}
            className="absolute right-4 top-4 rounded bg-secondary-fg/50 p-2"
          >
            <RefreshCw className="text-secondary" />
          </button>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={onButtonClick}>
          ファイルを選択
        </Button>
      )}
    </div>
  );
}
