import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardContent>
          <Spinner />
        </CardContent>
      </Card>
    </div>
  );
}
