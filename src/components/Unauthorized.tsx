import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader } from "./ui/card";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="min-w-1/5">
        <CardHeader>UNAUTHORIZED ACCESS</CardHeader>
        <CardFooter>
          <div className="flex w-full justify-center">
            <Button
              color="default"
              aria-label="login"
              onClick={() => navigate("/")}
            >
              LOGIN
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
