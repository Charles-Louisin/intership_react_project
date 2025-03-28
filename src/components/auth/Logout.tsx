import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar/sidebar';

export interface LogoutProps {
  collapsed: boolean;
  className?: string;  // Ajout de className optionnel
}

const Logout = ({ collapsed, className }: LogoutProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"} ${className || ''}`}>
                    <LogOut className="w-10 h-10" />
                    {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default Logout