import { truncateText } from "@/lib/helper";
import { OrganizationProfile } from "@/types/organization";
import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  data?: OrganizationProfile;
}

const OrganizationCard = ({ data }: Props) => {
  let text = data?.shortDescriptionOfOrganization ?? "";

  text = truncateText(text, 90);
  return (
    <div className="h-[530px] w-full rounded-[16px] bg-white p-[24px] md:h-[553px] md:w-[400px]">
      <div className="relative h-[232px] w-full rounded-[12px]">
        <Image
          src={
            data?.profilePhoto ?? "https://i.postimg.cc/Gm5rJB66/image-fx-6.png"
          }
          alt={data?.organizationName ?? ""}
          fill
          className="rounded-[12px] object-cover"
        />
      </div>
      <div className="mt-[24px] flex h-[226px] w-full flex-col justify-between md:h-[249px]">
        <div className="space-y-[8px]">
          <h3 className="font-lexend text-[18px] font-normal leading-[22.5px] text-[#1D3557]">
            {data?.organizationName}
          </h3>
          <p className="text-[16px] font-normal leading-[19.36px] text-[#4B5563]">
            {text}
          </p>
        </div>
        <div className="space-y-[8px] md:space-y-[12px]">
          <p className="flex items-center gap-x-[6px] font-inter text-[14px] font-normal leading-[16.94px] text-[#4B5563] md:text-[16px]">
            <MapPin className="h-[16.3px] w-[13.5px] text-[#4B5563] md:h-[20px] md:w-[20px]" />{" "}
            {data?.address}
          </p>
          <p className="flex items-center gap-x-[6px] font-inter text-[14px] font-normal leading-[16.94px] text-[#4B5563] md:text-[16px]">
            <CalendarDays className="h-[16.3px] w-[13.5px] text-[#4B5563] md:h-[20px] md:w-[20px]" />{" "}
            {data?.totalEvents} Total Events
          </p>
        </div>
        <Link
          href={`/organizations/${data?._id}`}
          className="flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#1D3557] text-[16px] font-medium leading-[19.36px] text-white transition-colors duration-300 hover:bg-[#1D3557]/90"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrganizationCard;
