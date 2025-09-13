import { useState } from "react";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { TeacherList } from "./components/TeacherList";
import { Navigation } from "./components/Navigation";
import { AuthScreen } from "./components/AuthScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { GroupSelector } from "./components/GroupSelector";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { DevToolsPanel } from "./components/DevToolsPanel";
import { BackendStatus } from "./components/BackendStatus";
import { useAppInitialization } from "./utils/useAppInitialization";
import { useAuthState } from "./utils/useAuthState";
import { handleDevReset } from "./utils/devReset";
// import logoInstitucional from "figma:asset/ee70fd1003ccb4c67c2394418297db8dbbf0d634.png";
import {
  isDevelopment,
  type View,
  type Teacher,
} from "./utils/types";

export default function App() {
  const [activeView, setActiveView] =
    useState<View>("dashboard");
  const [showGroupSelector, setShowGroupSelector] =
    useState(false);
  const [resetInProgress, setResetInProgress] = useState(false);

  const { dbInitialized, initError, isFirstInstall } =
    useAppInitialization();
  const {
    authState,
    currentTeacher,
    setAuthState,
    handleLogin,
    handleLogout,
    handleGroupSelect,
    updateCurrentTeacher,
  } = useAuthState();

  const onDevReset = () =>
    handleDevReset(setResetInProgress, () => {
      setActiveView("dashboard");
      setShowGroupSelector(false);
      handleLogout();
    });

  const handleGroupSelectWrapper = async (group: string) => {
    await handleGroupSelect(group);
    setShowGroupSelector(false);
  };

  // Verificar roles
  const isAdmin = currentTeacher?.role === "admin";

  // Mostrar pantallas de carga/error
  if (initError) {
    return (
      <ErrorScreen
        error={initError}
        isDevelopment={isDevelopment()}
        onDevReset={onDevReset}
        resetInProgress={resetInProgress}
      />
    );
  }

  if (!dbInitialized) {
    return (
      <LoadingScreen
        isFirstInstall={isFirstInstall}
        isDevelopment={isDevelopment()}
        onDevReset={onDevReset}
        resetInProgress={resetInProgress}
      />
    );
  }

  // Renderizar contenido principal
  const renderContent = () => {
    if (authState !== "authenticated" || !currentTeacher) {
      return (
        <AuthScreen
          authState={authState}
          onStateChange={setAuthState}
          onLogin={handleLogin}
        />
      );
    }

    if (showGroupSelector) {
      return (
        <GroupSelector
          currentGroup={currentTeacher.selectedGroup}
          onGroupSelect={handleGroupSelectWrapper}
          onBack={() => setShowGroupSelector(false)}
          teacherId={currentTeacher.id}
        />
      );
    }

    switch (activeView) {
      case "dashboard":
        return (
          <TeacherDashboard
            teacher={currentTeacher}
            onGroupSelect={() => setShowGroupSelector(true)}
          />
        );
      case "teachers":
        return <TeacherList />;
      case "profile":
        return (
          <ProfileScreen
            teacher={currentTeacher}
            onLogout={handleLogout}
            onBack={() => setActiveView("dashboard")}
            onTeacherUpdate={updateCurrentTeacher}
          />
        );
      case "admin":
        if (isAdmin) {
          return (
            <AdminDashboard
              teacher={currentTeacher}
              onBack={() => setActiveView("dashboard")}
            />
          );
        } else {
          setActiveView("dashboard");
          return null;
        }
      default:
        return (
          <TeacherDashboard
            teacher={currentTeacher}
            onGroupSelect={() => setShowGroupSelector(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Logo institucional en esquina superior derecha */}
      {/* <div className="fixed top-4 right-4 z-50">
        <img 
          src={logoInstitucional} 
          alt="Institución Educativa Nuevo Latir" 
          className="h-12 w-auto drop-shadow-sm"
        />
      </div> */}

      <main
        className={authState === "authenticated" ? "pb-16" : ""}
      >
        {renderContent()}
      </main>

      {authState === "authenticated" && (
        <Navigation
          activeView={activeView}
          onViewChange={setActiveView}
          userRole={currentTeacher?.role || "teacher"}
        />
      )}

      {isDevelopment() && (
        <DevToolsPanel
          isFirstInstall={isFirstInstall}
          currentTeacher={currentTeacher}
          authState={authState}
          onDevReset={onDevReset}
          resetInProgress={resetInProgress}
        />
      )}

      <BackendStatus />
    </div>
  );
}

export type { Teacher };

// Nota de archivos obsoletos que se pueden eliminar después de confirmar que todo funciona:
// Los siguientes archivos ya no se usan en el sistema simplificado:
// - /components/QRGenerator.tsx (sistema QR eliminado)
// - /components/QRLandingPage.tsx (sistema QR eliminado)
// - /components/QRScanner.tsx (sistema QR eliminado)
// - /components/Dashboard.tsx (reemplazado por TeacherDashboard)
// - /components/MenuManagement.tsx (funcionalidad incorporada en AdminDashboard)
// - /components/ScheduleView.tsx (funcionalidad incorporada en AdminDashboard)
// - /components/Sidebar.tsx (no se usa en el diseño móvil)
// - /components/StaffSchedule.tsx (funcionalidad incorporada en AdminDashboard)
// - /utils/cameraUtils.ts (sistema de cámara QR eliminado)
// - /utils/scheduleUtils.ts (lógica incorporada en database.ts)