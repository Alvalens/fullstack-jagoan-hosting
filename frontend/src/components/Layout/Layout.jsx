import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/app-sidebar";
import { LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Outlet } from "react-router-dom";


export default function Layout() {
  const user = {
    name: "John Doe",
    email: "test@gmail.com"
  };
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center justify-between">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 h-4"
							/>
							Dashboard
						</div>
						<div className="flex items-center gap-4 px-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Avatar className="h-8 w-8 cursor-pointer">
										<AvatarImage
											src={`https://ui-avatars.com/api/?name=test`}
										/>
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-56"
									align="end"
									forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{user?.name}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user?.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Log out</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</header>
					<main className="flex-1 overflow-y-auto mx-5 p-5">
						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
