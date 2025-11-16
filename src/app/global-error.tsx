"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type Props = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  return (
    <html>
      <body>
        <main className="flex min-h-screen items-center justify-center">
          <Card>
            <CardHeader>Something went wrong!</CardHeader>
            <CardContent>{error.message}</CardContent>
            <CardFooter>
              <div className="flex w-full justify-center">
                <Button
                  type="button"
                  color="default"
                  aria-label="try-again"
                  onClick={() => reset()}
                >
                  Try again
                </Button>
              </div>
            </CardFooter>
          </Card>
        </main>
      </body>
    </html>
  );
}
