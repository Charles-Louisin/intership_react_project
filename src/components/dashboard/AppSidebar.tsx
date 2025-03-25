import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar/sidebar";
import { LucideHome, MessageCircle, MessageSquare, SettingsIcon, ShoppingCartIcon, UserRound } from 'lucide-react';
import Logout from '../auth/Logout';
import HeaderSide from './HeaderSide';



// Menu items.
const items = [
    {
        title: "Accueil",
        url: "/dashboard",
        icon: LucideHome,
    },
    {
        title: "Produits",
        url: "/dashboard/produits",
        icon: ShoppingCartIcon,
    },
    {
        title: "Postes",
        url: "/dashboard/postes",
        icon: MessageSquare,
    },
    {
        title: "Commentaires",
        url: "/dashboard/commentaires",
        icon: MessageCircle,
    },
    {
        title: "Parametres",
        url: "/dashboard/parametres",
        icon: SettingsIcon,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: UserRound,
    },
]


const AppSidebar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location]);

    const handleItemClick = (url: string) => {
        setActiveItem(url);
    };

    return (
        <Sidebar className="h-screen">
            <HeaderSide />
            <SidebarContent className="flex-1">
                <SidebarGroup />
                <SidebarGroupLabel>Tableau de bord</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu className='gap-1'>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title} >
                                <SidebarMenuButton asChild>
                                    <NavLink 
                                        to={item.url}
                                        onClick={() => handleItemClick(item.url)}
                                        className={`flex items-center gap-2 w-full h-14 rounded-none px-4 hover:bg-orange-400 hover:text-white ${
                                            activeItem === item.url 
                                            ? "bg-orange-400 text-white font-bold" 
                                            : "text-gray-500"
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            <Logout />
        </Sidebar>
    )
}

export default AppSidebar