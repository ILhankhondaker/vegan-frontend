
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FAQResponse } from "@/types/professional";

interface Props {
  userId: string;
}

const FAQSection = ({userId}: Props) => {
 

  const { data, isError, isLoading, error } = 
  useQuery<FAQResponse>({
    queryKey: ["single-merchant-profile", userId],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/faqs/${userId}`,
      ).then((res) => res.json()),
     
  });
  
  console.log("response data:", data);
  console.log(data?.data);

  if (isLoading) return <p className="text-center text-gray-500">Loading FAQs...</p>;
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>;


  const faqs = data?.data || [];





  return (
    <div className="max-w-[848px] p-4">
      <h1 className="mb-6 font-lexend text-xl font-medium leading-[25px] text-[#1D3557]">
        Frequently Asked Questions
      </h1>

      <Accordion type="single" collapsible className="space-y-6">
        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <AccordionItem
              key={faq._id} // Using unique _id instead of index
              value={`item-${index}`}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <AccordionTrigger className="py-0 text-left font-inter text-base font-medium leading-[24px] text-[#1F2937] hover:no-underline md:text-lg md:leading-[22px]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-0 pt-4 font-inter text-sm font-normal leading-[24px] text-[#374151] md:text-base md:leading-[28px]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <p className="text-center text-gray-500">No FAQs available.</p>
        )}
      </Accordion>

      <div className="mt-[68px]">
        <h3 className="mb-6 font-inter text-lg font-medium leading-[21.78px] text-[#1E2939]">
          Still have a question that is not on the list?
        </h3>
        <Button className="rounded-[8px] bg-[#1D3557] px-[20px] py-[10px] text-center font-lexend text-sm font-medium leading-[20.3px] tracking-[-3%]">
          Contact Me
        </Button>
      </div>
    </div>
  );
};

export default FAQSection;
