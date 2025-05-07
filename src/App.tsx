import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AppProvider,
  Frame,
  Navigation,
  TopBar,
} from '@shopify/polaris';
import {
  HomeIcon,
  ChartLineIcon,
  SettingsIcon,
  PersonFilledIcon,
} from '@shopify/polaris-icons';
import enTranslations from '@shopify/polaris/locales/en.json';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Customers from './components/Customers';
import Settings from './components/Settings';


const App: React.FC = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(true);

  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            icon: HomeIcon,
            url: '/',
          },
          {
            label: 'Analytics',
            icon: ChartLineIcon,
            url: '/analytics',
          },
          {
            label: 'Customers',
            icon: PersonFilledIcon,
            url: '/customers',
          },
          {
            label: 'Settings',
            icon: SettingsIcon,
            url: '/settings',
          },
        ]}
      />
    </Navigation>
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      onNavigationToggle={() => setIsNavigationOpen(!isNavigationOpen)}
    />
  );

  return (
    <AppProvider i18n={enTranslations}>
      <Router>
        <Frame
          topBar={topBarMarkup}
          navigation={navigationMarkup}
          showMobileNavigation={isNavigationOpen}
          onNavigationDismiss={() => setIsNavigationOpen(false)}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Frame>
      </Router>
    </AppProvider>
  );
};

export default App; 