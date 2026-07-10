import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export default function Logo({ size = 48, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-sm"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="Lorotext SYM"
          width={size}
          height={size}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {showText && (
        <div className="text-left">
          <div
            className="font-black text-sm leading-tight tracking-tight"
            style={{ color: "#1A8C8C", fontFamily: "'Playfair Display', serif" }}
          >
            LOROTEXT SYM
          </div>
          <div className="text-[10px] text-gray-400 leading-tight tracking-wide">
            El placer de tu hogar
          </div>
        </div>
      )}
    </div>
  );
}
