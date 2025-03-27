import React, { useState, useEffect } from 'react'
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "../ui/sidebar/sidebar";
import { LucideChevronLeft, LucideChevronRight, LucideHome, LucideShoppingCart, MessageSquare, Settings, User } from 'lucide-react';
import Logout from '../auth/Logout';
import HeaderSide from './HeaderSide';
import { useCart } from '../../context/CartContext';
import { Badge } from '../ui/ProductCard/badge';

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
        icon: LucideShoppingCart,
    },
    {
        title: "Postes",
        url: "/dashboard/postes",
        icon: MessageSquare,
    },
    {
        title: "Mon panier",
        url: "/dashboard/panier",
        icon: LucideShoppingCart
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Paramètres",
        url: "/dashboard/parametres",
        icon: Settings,
    },
]

const AppSidebar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const { state, setState } = useSidebar();
    const collapsed = state === "collapsed";
    const { cartCount } = useCart();

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location]);

    const handleItemClick = (url: string) => {
        setActiveItem(url);
        // Ferme le sidebar uniquement en version mobile (moins de 768px)
        if (window.innerWidth < 768) {
            setState("collapsed");
        }
    };

    return (
        <Sidebar 
            collapsible="icon"
            className="bg-white border-r border-gray-100 transition-all duration-300 ease-in-out pt-3"
        >
            <HeaderSide 
                collapsed={collapsed} 
                className={`p-4 border-b border-gray-100 sm:pt-4 ${window.innerWidth < 768 ? 'pt-16' : ''}`} 
            />
            
            <SidebarContent className="flex-1 overflow-y-auto">
                <SidebarGroup />
                {!collapsed && (
                    <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tableau de bord
                    </SidebarGroupLabel>
                )}
                
                <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 px-2">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <RouterNavLink 
                                        to={item.url}
                                        end={item.url === "/dashboard"}
                                        onClick={() => handleItemClick(item.url)}
                                        className={`
                                            flex items-center 
                                            ${collapsed ? 'justify-center p-3' : 'px-3 py-3'} 
                                            rounded-lg 
                                            transition-colors duration-200
                                            ${activeItem === item.url 
                                                ? 'bg-orange-50 text-orange-600' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                        `}
                                    >
                                        <div className="relative">
                                            <item.icon 
                                                className={`h-5 w-5 ${activeItem === item.url ? 'text-orange-500' : 'text-gray-400'}`} 
                                                strokeWidth={activeItem === item.url ? 2 : 1.5}
                                            />
                                            {item.title === "Mon panier" && cartCount > 0 && (
                                                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                                                    {cartCount}
                                                </Badge>
                                            )}
                                        </div>
                                        {!collapsed && (
                                            <span className="ml-3 text-sm font-medium">
                                                {item.title}
                                            </span>
                                        )}
                                    </RouterNavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>

            <div className={`p-4 border-t border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
                <Logout collapsed={collapsed} className="text-gray-600 hover:text-orange-500" />
            </div>
        </Sidebar>
    )
}

export default AppSidebar