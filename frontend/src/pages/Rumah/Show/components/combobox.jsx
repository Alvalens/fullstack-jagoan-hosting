"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function ComboboxDemo({
	data,
	currentValue,
	onSelect,
	disabled = false,
}) {
const [open, setOpen] = React.useState(false);

	const selectedLabel = data.find((item) => item.value === currentValue)?.label || "";
	console.log("data:", data);
	console.log("current:", currentValue);
	console.log("Selected Label:", selectedLabel);

	return (
		<Popover open={disabled ? false : open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className="w-full justify-between">
					{selectedLabel || "Pilih penghuni..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<Command>
					<CommandInput placeholder="Cari penghuni..." />
					<CommandList>
						<CommandEmpty>Tidak ada data.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem
									key={item.value}
									value={item.label}
									onSelect={() => {
										onSelect(item.value);
										setOpen(false);
									}}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											currentValue === item.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{item.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
