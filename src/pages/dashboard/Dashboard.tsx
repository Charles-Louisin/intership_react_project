import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar/sidebar';
import AppSidebar from '../../components/dashboard/AppSidebar';
import { Outlet } from 'react-router-dom';


export default function Dashboard() {
  return (
    <SidebarProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <AppSidebar />
        <main style={{ flex: 1, padding: '20px' }}>
          <SidebarTrigger />
          <div style={{ marginTop: '20px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

