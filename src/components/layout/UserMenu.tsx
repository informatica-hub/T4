import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, FolderKanban, History, LogIn, Wallet2, Share2, Key, Wallet  } from "lucide-react";

export function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useProject();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/carrito" aria-label="Mi proyecto">
            <FolderKanban className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {itemCount}
              </Badge>
            )}
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to="/auth" className="gap-2">
            <LogIn className="h-4 w-4" />
            Iniciar sesión
          </Link>
        </Button>
      </div>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="flex items-center gap-2">
      {/* Project button with badge */}
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link to="/carrito">
          <FolderKanban className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </Link>
      </Button>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.full_name || "Usuario"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/carrito" className="flex items-center cursor-pointer">
              <FolderKanban className="mr-2 h-4 w-4" />
              Mi Proyecto
              {itemCount > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/mis-proyectos" className="flex items-center cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              Mis Proyectos
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center cursor-pointer">
              <Wallet2 className="mr-2 h-4 w-4" />
              Mi Monedero 
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/cambiar-contraseña" className="flex items-center cursor-pointer">
              <Key className="mr-2 h-4 w-4" />
                 Cambiar contraseña
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/hub" className="flex items-center cursor-pointer">
              <Share2 className="mr-2 h-4 w-4" />
               Hub
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
