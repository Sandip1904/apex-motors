import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import ToastContainer from './components/common/ToastContainer';
import ConfirmDialog from './components/common/ConfirmDialog';
import SaveBuildModal from './components/configurator/SaveBuildModal';
import { useUrlConfigSync } from './hooks/useUrlConfigSync';

// Lazy-loaded route pages for optimal initial bundle size
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ShowroomPage = lazy(() => import('./pages/ShowroomPage'));
const ConfigurePage = lazy(() => import('./pages/ConfigurePage'));
const InteriorPage = lazy(() => import('./pages/InteriorPage'));
const PerformancePage = lazy(() => import('./pages/PerformancePage'));
const MyBuildsPage = lazy(() => import('./pages/MyBuildsPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppShell() {
  useUrlConfigSync();

  return (
    <div className="flex min-h-screen flex-col bg-apex-obsidian text-apex-platinum">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/showroom" element={<ShowroomPage />} />
              <Route path="/configure" element={<ConfigurePage />} />
              <Route path="/interior" element={<InteriorPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/my-builds" element={<MyBuildsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <SaveBuildModal />
      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
