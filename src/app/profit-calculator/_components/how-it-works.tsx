import Image from "next/image";

const HowItWorks = () => {
  return (
    <div className="container py-[80px]">
      <div className="mx-auto max-w-[509px] space-y-[8px]">
        <h4 className="text-center font-lexend text-[32px] font-medium leading-[46.4px] text-[#1D3557]">
          How It Works
        </h4>
        <p className="text-center text-[18px] font-normal leading-[26.1px] text-[#374151]">
          Our transparent system ensures every activity is tracked and rewarded.
        </p>
      </div>

      <div className="mt-[88px] grid grid-cols-1 gap-[24px] gap-y-[96px] md:grid-cols-3 md:gap-y-[24px]">
        <div className="relative mx-auto">
          <Card
            number={1}
            title="Share your referral link"
            desc="Sign up, grab your referral link, and share it with your network."
          />
          <Image
            src="https://i.postimg.cc/Fz6Wx6j5/Group-10.png"
            alt="from_bottom"
            width={140}
            height={51.57}
            className="absolute right-[-80px] top-[30px] hidden md:block"
          />
          <Image
            src="https://i.postimg.cc/KcCCBKQK/Group-11.png"
            alt="from_bottom"
            width={140}
            height={51.57}
            className="absolute bottom-[-80px] right-[20px] rotate-90 md:hidden"
          />
        </div>
        <div className="relative mx-auto">
          <Card
            number={2}
            title="Track Your Referrals"
            desc="Monitor referrals as they engage with the platform."
          />
          <Image
            src="https://i.postimg.cc/KcCCBKQK/Group-11.png"
            alt="from_bottom"
            width={140}
            height={51.57}
            className="absolute right-[-80px] top-[30px] hidden md:block"
          />
          <Image
            src="https://i.postimg.cc/Fz6Wx6j5/Group-10.png"
            alt="from_bottom"
            width={140}
            height={51.57}
            className="absolute bottom-[-80px] left-[20px] rotate-90 md:hidden"
          />
        </div>
        <div className="mx-auto">
          <Card
            number={3}
            title="Earn Profits"
            desc="Receive rewards for every successful referral activity."
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

interface Props {
  number: number;
  title: string;
  desc: string;
}

const Card = ({ number, title, desc }: Props) => {
  return (
    <div className="relative flex max-w-[400px] flex-col items-center justify-center">
      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[100px] border-[2px] border-[#839DD1] bg-[#1D3557] text-[24px] text-white">
        {number}
      </div>
      <h3 className="mt-[24px] text-center font-lexend text-[24px] font-normal leading-[34.8px] tracking-[-3%] text-[#1F2937]">
        {title}
      </h3>
      <p className="mt-[8px] text-center font-inter text-[18px] font-normal leading-[26.1px] text-[#374151]">
        {desc}
      </p>
    </div>
  );
};
