import type { ComponentProps, ReactNode } from "react";

type GcpImageProps = ComponentProps<"img">;
export function GcpImage({ alt, ...props }: GcpImageProps): ReactNode {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} {...props} />;
}
