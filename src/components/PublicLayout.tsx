
import { ReactNode } from 'react';
import { Shield, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const navigate = useNavigate();

  const produktSubmenu = [
    { name: 'Features', href: '/produkt/features' },
    { name: 'Preise', href: '/produkt/preise' },
    { name: 'Demo', href: '/produkt/demo' },
  ];

  const rechtlichesSubmenu = [
    { name: 'Datenschutz', href: '/rechtliches/datenschutz' },
    { name: 'Impressum', href: '/rechtliches/impressum' },
    { name: 'AGB', href: '/rechtliches/agb' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <Shield className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  A11y Inspector
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-4">
                  <NavigationMenuItem>
                    <button
                      onClick={() => navigate('/')}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      Home
                    </button>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                      Produkt
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[200px]">
                        {produktSubmenu.map((item) => (
                          <NavigationMenuLink
                            key={item.name}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                            onClick={() => navigate(item.href)}
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                      Rechtliches
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[200px]">
                        {rechtlichesSubmenu.map((item) => (
                          <NavigationMenuLink
                            key={item.name}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                            onClick={() => navigate(item.href)}
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Anmelden
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Kostenlos testen
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Home
          </button>
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-900">Produkt</div>
            {produktSubmenu.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="block w-full text-left px-6 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-900">Rechtliches</div>
            {rechtlichesSubmenu.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="block w-full text-left px-6 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
