import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeaderSide = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="p-4 bg-gray-100">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                <img
                    src={user?.image || ''} 
                    alt="User avatar" 
                    className="size-10"
                />
                <span className="font-bold">{`${user?.firstName} ${user?.lastName}`}</span>
            </div>
        </div>
    );
}

export default HeaderSide