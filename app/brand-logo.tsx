import Image from "next/image";

type BrandLogoProps = {
  variant?: "wordmark" | "detailed";
  priority?: boolean;
  className?: string;
};

export function BrandLogo({ variant = "wordmark", priority = false, className = "" }: BrandLogoProps) {
  if (variant === "detailed") {
    return <span className={`brand-logo brand-logo-detailed ${className}`.trim()}>
      <Image src="/brand/nyavista-detailed.png" alt="NyaVista — Every story. A clearer view." width={1254} height={1254} priority={priority} sizes="(max-width: 760px) 72vw, 430px" unoptimized />
    </span>;
  }

  return <span className={`brand-logo brand-logo-wordmark ${className}`.trim()} aria-hidden="true">
    <Image src="/brand/nyavista-wordmark.png" alt="" width={1536} height={1024} priority={priority} sizes="(max-width: 800px) 180px, 210px" unoptimized />
  </span>;
}
