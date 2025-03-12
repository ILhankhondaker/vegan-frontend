"use client";
import VeganTabs, { VeganTab } from "@/components/ui/Vegan-Tab";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import components only when needed
const AboutTab = dynamic(() => import("./about-tab"), { ssr: false });
const ExperienceTab = dynamic(() => import("./experience-tab"), { ssr: false });
const ServicesTab = dynamic(() => import("./services-tab"), { ssr: false });
const LiveStreamTab = dynamic(() => import("./live-stream-tab"), {
  ssr: false,
});
const FAQsTab = dynamic(() => import("./faqs-tab"), { ssr: false });
const ReviewsTab = dynamic(() => import("./reviews-tab"), { ssr: false });

const lists = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "live-stream", label: "Live Stream" },
  { id: "faqs", label: "FAQs" },
  { id: "reviews", label: "Reviews" },
] as VeganTab[];

interface Props {
  professionalId: string;
}

const ProfessionalTab = ({ professionalId }: Props) => {
  const [activeTab, setActiveTab] = useState<string>("about");

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutTab professionalId={professionalId} />;
      case "experience":
        return <ExperienceTab professionalId={professionalId} />;
      case "services":
        return <ServicesTab professionalId={professionalId} />;
      case "live-stream":
        return <LiveStreamTab professionalId={professionalId} />;
      case "faqs":
        return <FAQsTab userId={professionalId} />;
      case "reviews":
        return <ReviewsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-[40px] md:mt-[56px]">
      <div className="no-scrollbar overflow-x-auto">
        <VeganTabs
          tabs={lists}
          defaultActiveTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </div>
      <div className="mt-[40px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeTab} // Ensures a new animation on tab switch
            initial={{ height: 0, opacity: 0.5 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{ overflow: "hidden" }} // Prevents overflow during animation
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfessionalTab;
