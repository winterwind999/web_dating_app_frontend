import { Link } from "react-router-dom";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { Button } from "../../components/ui/button";

const Header = () => {
  return (
    <nav className="flex items-center justify-around gap-3">
      <Link to="/">
        <img
          src="/assets/Matchy_Icon_Logo.png"
          alt="matchy-logo"
          width={150}
          height={50}
          className="dark:hidden"
        />
        <img
          src="/assets/Matchy_Icon_Logo_DarkMode.png"
          alt="matchy-logo"
          width={150}
          height={50}
          className="hidden dark:block"
        />
      </Link>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />

        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Header;
