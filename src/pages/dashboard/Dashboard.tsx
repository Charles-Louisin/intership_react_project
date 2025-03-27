import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar/sidebar';
import AppSidebar from '../../components/dashboard/AppSidebar';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <SidebarProvider className='p-0 m-0 flex justify-center items-center'>
      <div className=" flex min-h-screen w-full">
        {/* Sidebar - fixed width */}
        <div className="flex-shrink-0">
          <AppSidebar />
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto w-full">
          {/* Header/Trigger - only shown on mobile */}
          <div className="lg:hidden fixed  top-0 z-10 bg-transparent p-2  border-gray-200">
            <SidebarTrigger className="p-2 size-9 rounded-md" />
          </div>

          {/* Content container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}