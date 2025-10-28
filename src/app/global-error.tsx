"use client";

import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

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
            <CardBody>{error.message}</CardBody>
            <CardFooter>
              <Button
                color="default"
                variant="solid"
                aria-label="try-again"
                fullWidth
                onPress={() => reset()}
              >
                Try again
              </Button>
            </CardFooter>
          </Card>
        </main>
      </body>
    </html>
  );
}
