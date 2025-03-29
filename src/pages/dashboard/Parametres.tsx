import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Moon, Sun, Settings, Palette, Monitor } from "lucide-react"
import { Button } from "../../components/ui/ProductCard/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/ProductCard/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown/dropdown-menu"
import { useTheme } from "../../context/Theme-context"
import { toast } from "react-hot-toast"

const Parametres = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme()

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast.success(`Fonctionalité à venir`, {
      position: 'top-center',
      style: {
        background: theme === 'dark' ? '#1e1e1e' : '#fff',
        color: theme === 'dark' ? '#fff' : '#1e1e1e',
        border: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`
      }
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl font-semibold">Paramètres</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-8">
              {/* Section Thème */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Apparence</h3>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Thème</p>
                    <p className="text-sm text-muted-foreground">
                      Personnalisez l'apparence de l'application
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full md:w-auto justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          {theme === 'light' ? (
                            <Sun className="h-4 w-4" />
                          ) : theme === 'dark' ? (
                            <Moon className="h-4 w-4" />
                          ) : (
                            <Monitor className="h-4 w-4" />
                          )}
                          <span>
                            {theme === 'light' ? 'Clair' : 
                             theme === 'dark' ? 'Sombre' : 'Système'}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] bg-white">
                      <DropdownMenuItem 
                        onClick={() => handleThemeChange("light")}
                        className="flex items-center space-x-2"
                      >
                        <Sun className="h-4 w-4" />
                        <span>Clair</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleThemeChange("dark")}
                        className="flex items-center space-x-2"
                      >
                        <Moon className="h-4 w-4" />
                        <span>Sombre</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleThemeChange("system")}
                        className="flex items-center space-x-2"
                      >
                        <Monitor className="h-4 w-4" />
                        <span>Système</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Section future */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Préférences</h3>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/10 border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    D'autres paramètres seront disponibles prochainement
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Parametres