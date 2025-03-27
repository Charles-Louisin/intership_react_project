import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderSideProps {
    collapsed?: boolean;
}

const HeaderSide = ({ collapsed }: HeaderSideProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"} cursor-pointer`} 
                 onClick={() => navigate('/dashboard/profile')}>
                <img
                    src={user?.image || '/default-avatar.png'} 
                    alt="User avatar" 
                    className="w-12 h-12 rounded-full object-cover"
                />
                {!collapsed && (
                    <span className="font-bold">{`${user?.firstName} ${user?.lastName}`}</span>
                )}
            </div>
        </div>
    );
}

export default HeaderSide