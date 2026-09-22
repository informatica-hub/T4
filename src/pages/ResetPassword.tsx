import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import logo from "@/assets/logotipo-t4.png";
import { Seo } from "@/components/seo/Seo";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true); // 👈 nuevo estado
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Intentar recuperar el token del hash de la URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    if (accessToken && type === 'recovery') {
      // Establecer la sesión manualmente con el token
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      })
        .then(({ error }) => {
          setVerifying(false);
          if (error) {
            setError('El enlace no es válido o ha expirado. Solicita uno nuevo.');
          } else {
            // Opcional: limpiar el hash de la URL por seguridad
            window.history.replaceState(null, '', window.location.pathname);
          }
        })
        .catch(() => {
          setVerifying(false);
          setError('Ocurrió un error al verificar el enlace.');
        });
    } else {
      // 2. Si no hay token en el hash, esperar el evento PASSWORD_RECOVERY
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setVerifying(false);
        }
      });

      // También verificar si ya hay una sesión activa (por si el evento ya pasó)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setVerifying(false);
        } else {
          // Si no hay sesión y no hay token, el enlace es inválido
          setVerifying(false);
          setError('No se encontró un enlace de recuperación válido. Solicita uno nuevo.');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate("/auth"), 3000);
    }
    setLoading(false);
  };

  // Mientras se verifica, mostramos un loader en lugar del formulario
  if (verifying) {
    return (
      <div className="min-h-screen bg-muted/40 relative flex items-center justify-center px-4 py-24">
        <Seo title="Recuperar contraseña | T4" description="Recuperación de contraseña del portal intranet." noindex />
        <NucleotideBackground />
        <Card className="w-full max-w-md relative z-10">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <img src={logo} alt="T4" className="h-36 w-auto" />
            </div>
            <h1 className="text-xl font-semibold text-center">Verificando enlace...</h1>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 relative flex items-center justify-center px-4 py-24">
      <Seo title="Recuperar contraseña | T4" description="Recuperación de contraseña del portal intranet." noindex />
      <NucleotideBackground />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="T4" className="h-36 w-auto" />
          </div>
          <h1 className="text-xl font-semibold text-center text-foreground">
            Restablecer contraseña
          </h1>
        </CardHeader>

        <CardContent>
          {success ? (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Contraseña actualizada correctamente. Redirigiendo al inicio de sesión…
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando…
                    </>
                  ) : (
                    "Actualizar contraseña"
                  )}
                </Button>
              </form>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <button onClick={() => navigate("/auth")} className="underline hover:text-foreground">
            Volver al inicio de sesión
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}