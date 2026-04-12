import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  imageClassName?: string;
}

export const Logo = ({ className = "", width = 120, height = 120, imageClassName = "" }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105 w-full">
        <Image src="/log-ads.png" alt="ADS Logo" width={width} height={height} className={`object-contain ${imageClassName}`} priority/>
      </div>
    </Link>
  );
};
