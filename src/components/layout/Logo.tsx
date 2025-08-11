import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const Logo = ({ variant = "dark", size = "md" }: LogoProps) => {
  const logoHeight = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  }[size];

  return (
    <Link to="/" className="flex items-center">
      <img
        src="/images/logo/Logo.jpg"
        alt="Stylised golden lotus representing shared love"
        className={`${logoHeight} w-auto object-contain`}
      />
    </Link>
  );
};

export default Logo;
