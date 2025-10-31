import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BellIcon } from "lucide-react";

const Notifications = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Tooltip>
          <TooltipTrigger className="bg-secondary hover:bg-primary hover:text-light rounded-full p-2">
            <BellIcon />
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
};

export default Notifications;
