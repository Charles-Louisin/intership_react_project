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
import { LucideChevronLeft, LucideChevronRight, LucideHome, LucideShoppingCart, MessageCircle, MessageSquare, SettingsIcon, ShoppingCartIcon, UserRound } from 'lucide-react';
import Logout from '../auth/Logout';
import HeaderSide from './HeaderSide';
import '../NavLink.css'
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
        icon: ShoppingCartIcon,
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
        icon: UserRound,
    },
    {
        title: "Parametres",
        url: "/dashboard/parametres",
        icon: SettingsIcon,
    },
]


const AppSidebar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const { cartCount } = useCart();

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location]);

    const handleItemClick = (url: string) => {
        setActiveItem(url);
    };

    return (
        <Sidebar collapsible="icon">
            <HeaderSide collapsed={collapsed} />
            <SidebarContent>
                <SidebarGroup />
                {!collapsed && <SidebarGroupLabel>Tableau de bord</SidebarGroupLabel>}
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <RouterNavLink 
                                        to={item.url}
                                        end={item.url === "/dashboard"}
                                        onClick={() => handleItemClick(item.url)}
                                        className={`nav-link relative ${
                                            activeItem === item.url ? "nav-link-active" : ""
                                        } ${collapsed ? "justify-center w-full" : ""}`}
                                    >
                                        <div className="relative">
                                            <item.icon className="w-10 h-10" />
                                            {item.title === "Mon panier" && cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </div>
                                        {!collapsed && <span>{item.title}</span>}
                                    </RouterNavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            <Logout collapsed={collapsed} />
        </Sidebar>
    )
}

export default AppSidebar