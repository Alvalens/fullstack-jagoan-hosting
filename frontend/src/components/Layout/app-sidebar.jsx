import {
	Command,
	Home,
	Settings,
	Users,
  LucideHome
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DollarSign } from "lucide-react";

const menuItems = [
	{
		category: "Menu",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: Home,
			},
			{
				title: "Penghuni",
				url: "/penghuni",
				icon: Users,
			},
      {
        title: "Rumah",
        url: "/rumah",
        icon: LucideHome,
      },
      {
        title: "Pembayaran",
        url: "/pembayaran",
        icon: DollarSign,
      },
		],
	},
	{
		category: "User",
		items: [
			{
				title: "Profile",
				url: "/admin/profile",
				icon: Settings,
			},
		],
	},
];

export function AppSidebar() {
	return (
		<Sidebar variant="inset">
			{/* Sidebar Header */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										SIRT
									</span>
									<span className="truncate text-xs">
										Sistem Informasi RT
									</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* Sidebar Content */}
			<SidebarContent>
				{menuItems.map((category) => (
					<SidebarGroup key={category.category}>
						<SidebarGroupLabel>
							{category.category}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{category.items.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<a href={item.url}>
													<item.icon className="mr-2" />
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
}
