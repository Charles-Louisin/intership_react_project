import React from 'react'
import { Button } from '../ui/sidebar/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar/sidebar';


const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <SidebarMenu className="flex flex-col justify-end bg-gray-100 p-4">
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className='text-red-500 font-medium hover:text-red-500 hover:font-bold'>
                    <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>

    )
}

export default Logout