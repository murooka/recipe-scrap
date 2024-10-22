/* eslint-disable @next/next/no-img-element */
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";

import { Button } from "./button";

type InputImageProps = ComponentProps<"input"> & { defaultImageUrl?: string };
export function InputImage(props: InputImageProps): ReactNode {
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
          <img src={imageUrl} alt="" className="w-full" />
          <button
            type="button"
            onClick={onButtonClick}
            className="absolute right-4 top-4 rounded bg-neutral-800/50 p-2"
          >
            <RefreshCw className="text-neutral-200" />
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
