import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader } from "./ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="min-w-1/5">
        <CardHeader className="flex flex-col">
          <h1>404 - Page Not Found</h1>
          <p>Oops! The page you're looking for doesn't exist.</p>
        </CardHeader>
        <CardFooter>
          <div className="flex w-full justify-center">
            <Button
              color="default"
              aria-label="back"
              onClick={() => navigate(-1)}
            >
              BACK
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
