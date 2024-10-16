import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@components/button";

export default function Page(): ReactNode {
  return (
    <main className="relative space-y-4 p-4">
      <section className="space-y-4">
        <h2>Buttons</h2>
        <div className="space-x-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">outline</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>
      <section className="space-y-4">
        <h2>Disabled Buttons</h2>
        <div className="space-x-4">
          <Button disabled>Default</Button>
          <Button disabled variant="secondary">
            Secondary
          </Button>
          <Button disabled variant="outline">
            outline
          </Button>
          <Button disabled variant="link">
            Link
          </Button>
        </div>
      </section>
      <section className="space-y-4">
        <h2>Loading Buttons</h2>
        <div className="space-x-4">
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Default
          </Button>
          <Button disabled variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Secondary
          </Button>
          <Button disabled variant="outline">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            outline
          </Button>
          <Button disabled variant="link">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Link
          </Button>
        </div>
      </section>
    </main>
  );
}
