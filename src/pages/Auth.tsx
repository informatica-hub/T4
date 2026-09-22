import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useProject } from "@/contexts/ProjectContext";
import { consumePendingAdd } from "@/hooks/useAddToProject";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, ArrowLeft, CheckCircle, User, Shield } from "lucide-react";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import logo from "@/assets/logotipo-t4.png";
import { Seo } from "@/components/seo/Seo";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Ingresa tu nombre completo").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

type Mode = "login" | "signup" | "forgot";

export default function Auth() {
  const { user, signIn, signUp, signOut } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { addItem } = useProject();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect") || "";

  const [tab, setTab] = useState<"user" | "admin">("user");
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupOk, setSignupOk] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendOk, setResendOk] = useState(false);

  // Admin tab state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [pendingAdminCheck, setPendingAdminCheck] = useState(false);

  // Redirect once authenticated
  useEffect(() => {
    if (!user) return;

    // Admin login flow validation
    if (pendingAdminCheck) {
      if (roleLoading) return;
      if (isAdmin) {
        setPendingAdminCheck(false);
        navigate("/admin", { replace: true });
      } else {
        // Not admin → sign out and show error
        signOut().then(() => {
          setPendingAdminCheck(false);
          setAdminError("Esta cuenta no tiene permisos de administrador.");
        });
      }
      return;
    }

    // Standard user flow
    const pendingRedirect = consumePendingAdd(addItem);
    const target = pendingRedirect || redirectTo || (isAdmin ? "/admin" : "/mis-proyectos");
    navigate(target, { replace: true });
  }, [user, isAdmin, roleLoading, pendingAdminCheck, addItem, navigate, redirectTo, signOut]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsConfirm(false);
    setResendOk(false);
    const { error } = await signIn(email, password);
    if (error) {
      const isUnconfirmed = error.message === "Email not confirmed";
      setNeedsConfirm(isUnconfirmed);
      setError(
        error.message === "Invalid login credentials"
          ? "Credenciales incorrectas. Verifica tu email y contraseña."
          : isUnconfirmed
            ? "Debes confirmar tu correo antes de iniciar sesión."
            : error.message,
      );
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Ingresa tu correo para reenviar la confirmación.");
      return;
    }
    setResendLoading(true);
    setResendOk(false);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setError(error.message);
    } else {
      setResendOk(true);
      setError(null);
    }
    setResendLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = signupSchema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.fullName);
    if (error) {
      setError(error.message);
    } else {
      setSignupOk(true);
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setResetSent(true);
    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError(null);
    const { error } = await signIn(adminEmail, adminPassword);
    if (error) {
      setAdminError(
        error.message === "Invalid login credentials"
          ? "Credenciales incorrectas."
          : error.message,
      );
      setAdminLoading(false);
      return;
    }
    setPendingAdminCheck(true);
    setAdminLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/40 relative flex items-center justify-center px-4 py-24">
      <Seo title="Acceso | T4" description="Acceso a la plataforma T4." noindex />
      <NucleotideBackground />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="T4" className="h-28 w-auto" />
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={tab} onValueChange={(v) => { setTab(v as "user" | "admin"); setError(null); setAdminError(null); }}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="user" className="gap-2">
                <User className="h-4 w-4" /> Usuario
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2">
                <Shield className="h-4 w-4" /> Administrador
              </TabsTrigger>
            </TabsList>

            {/* USER TAB */}
            <TabsContent value="user">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {mode === "forgot" ? (
                resetSent ? (
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Si el correo existe, recibirás un enlace para restablecer tu contraseña.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                    <FieldEmail value={email} onChange={setEmail} />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando…</> : "Enviar enlace"}
                    </Button>
                  </form>
                )
              ) : mode === "signup" ? (
                signupOk ? (
                  <div className="text-center space-y-4 py-4">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                    <h3 className="font-semibold">Cuenta creada</h3>
                    <p className="text-sm text-muted-foreground">
                      Revisa tu bandeja de entrada y confirma tu correo electrónico para poder iniciar sesión.
                    </p>
                    <Button
                      onClick={() => { setMode("login"); setSignupOk(false); setPassword(""); }}
                      className="w-full"
                    >
                      Ir a iniciar sesión
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="su-name">Nombre completo *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="su-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          placeholder="Nombre y apellido"
                          required
                        />
                      </div>
                    </div>
                    <FieldEmail value={email} onChange={setEmail} />
                    <FieldPassword value={password} onChange={setPassword} placeholder="Mínimo 8 caracteres" />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando…</> : "Crear cuenta"}
                    </Button>
                  </form>
                )
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <FieldEmail value={email} onChange={setEmail} />
                  <FieldPassword value={password} onChange={setPassword} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Iniciando sesión…</> : "Iniciar sesión"}
                  </Button>
                  {resendOk && (
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        Correo de confirmación reenviado. Revisa tu bandeja de entrada y spam.
                      </AlertDescription>
                    </Alert>
                  )}
                  {needsConfirm && !resendOk && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleResendConfirmation}
                      disabled={resendLoading}
                    >
                      {resendLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Reenviando…</>
                      ) : (
                        "Reenviar correo de confirmación"
                      )}
                    </Button>
                  )}
                </form>
              )}
            </TabsContent>


            {/* ADMIN TAB */}
            <TabsContent value="admin">
              {adminError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{adminError}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Acceso restringido al equipo administrador de T4.
                </p>
                <FieldEmail value={adminEmail} onChange={setAdminEmail} idPrefix="admin" />
                <FieldPassword value={adminPassword} onChange={setAdminPassword} idPrefix="admin" />
                <Button type="submit" className="w-full" disabled={adminLoading || pendingAdminCheck}>
                  {adminLoading || pendingAdminCheck ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verificando…</>
                  ) : (
                    "Iniciar sesión como admin"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          {tab === "user" && mode === "login" && (
            <>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); }}
                className="hover:text-foreground underline"
              >
                ¿No tienes cuenta? Crear cuenta
              </button>
              <button
                type="button"
                onClick={() => { setMode("forgot"); setError(null); setResetSent(false); }}
                className="hover:text-foreground underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </>
          )}
          {tab === "user" && mode !== "login" && (
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); setResetSent(false); setSignupOk(false); }}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Volver a iniciar sesión
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function FieldEmail({ value, onChange, idPrefix = "user" }: { value: string; onChange: (v: string) => void; idPrefix?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-email`}>Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="tu@correo.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          required
        />
      </div>
    </div>
  );
}

function FieldPassword({ value, onChange, idPrefix = "user", placeholder = "••••••••" }: { value: string; onChange: (v: string) => void; idPrefix?: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-password`}>Contraseña</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={`${idPrefix}-password`}
          type="password"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          required
        />
      </div>
    </div>
  );
}
