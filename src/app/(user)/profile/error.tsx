"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Props = {
  error: Error;
};

export default function Error({ error }: Props) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardContent>
          <p>Error: {error.message}</p>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-center">
            <Button
              type="button"
              variant="default"
              onClick={() => router.replace("/")}
            >
              LOGIN
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
