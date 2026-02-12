import logoMoving from "@/public/transit_logos/transit_logo_q.png";
import Image from "next/image";
function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white overflow-hidden">
      <Image src={logoMoving} alt="logo" width={800} height={800} className="w-20 h-20" />
    </div>
  );
}

export default Loading;
