import Image from "next/image";
import discoverImage1 from "@/public/images/flights/Discover1.png";
import discoverImage2 from "@/public/images/flights/Discover2.png";
import discoverImage3 from "@/public/images/flights/Discover3.png";

type Props = {};

const discoverBanners = [
  {
    id: 1,
    image: discoverImage1,
    alt: "South Korea travel deal",
  },
  {
    id: 2,
    image: discoverImage2,
    alt: "Time to travel banner",
  },
  {
    id: 3,
    image: discoverImage3,
    alt: "China Southern Airlines banner",
  },
];

function Discover({}: Props) {
  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight ">
        Discover what's happening
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {discoverBanners.map((banner) => (
          <article
            key={banner.id}
            className="group relative overflow-hidden rounded-xl cursor-pointer"
          >
            <Image
              src={banner.image}
              alt={banner.alt}
              className="h-auto min-h-[200px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default Discover;
