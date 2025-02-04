import { DropDownItem } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const VeganSelector = ({
  list,
  selectedValue,
  onValueChange,
}: {
  list: DropDownItem[]; // List of items
  selectedValue: string; // Currently selected value
  onValueChange: (value: string) => void; // Function to handle value change
}) => {
  return (
    <Select
      value={selectedValue}
      onValueChange={(val) => onValueChange(val)} // Update the state on selection
    >
      <SelectTrigger className="h-[40px] rounded-[8px] border-[1px] border-[#99A1AF] text-[#4B5563]">
        <SelectValue placeholder={selectedValue} className="text-[#4B5563]" />
      </SelectTrigger>
      <SelectContent className="w-auto rounded-[8px]">
        <SelectGroup>
          {list.map((item) => (
            <SelectItem key={item.id} value={item.value}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default VeganSelector;
