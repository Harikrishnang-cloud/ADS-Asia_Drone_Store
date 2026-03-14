import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  textColor?: string;
}

export const Logo = ({ className = "", width = 120, height = 120, showText = false, textColor = "text-slate-900" }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/log-ads.png"
          alt="ADS Logo"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
};
