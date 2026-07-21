import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  imageClassName?: string;
}

export const Logo = ({ className = "", width = 120, height = 120 }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`} suppressHydrationWarning>
      <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105 h-full flex items-center">
        <Image
          src="/ads.png"
          alt="ADS Logo"
          width={width}
          height={height}
          className="object-contain w-full h-auto"
          priority
          suppressHydrationWarning
        />
      </div>
    </Link>
  );
};
