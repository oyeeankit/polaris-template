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
  AppsIcon
} from '@shopify/polaris-icons';
import enTranslations from '@shopify/polaris/locales/en.json';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Customers from './components/Customers';
import Settings from './components/Settings';
import DualHome from './components/dual/Home';
import DualSettings from './components/dual/Settings';
import DualAccounts from './components/dual/Accounts';
import DualSupport from './components/dual/Support';


const App: React.FC = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(true);

  const [isDualExpanded, setIsDualExpanded] = useState<boolean>(false);

  const handleDualToggle = () => {
    setIsDualExpanded(!isDualExpanded);
  };

  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        items={[
         {
            label: 'Dual',
            icon: AppsIcon,
            onClick: handleDualToggle,
            expanded: isDualExpanded,
            matches: false,
          },
          {
            label: 'Home',
            url: '/dual/home',
            icon:AppsIcon
          },
          {
            label: 'Settings',
            url: '/dual/settings',
            icon:AppsIcon
          },
          {
            label: 'Accounts',
            url: '/dual/accounts',
            icon:AppsIcon
          },
          {
            label: 'Support',
            url: '/dual/support',
            icon:AppsIcon
          },
          {
            label: '================',
            icon: SettingsIcon
          },
          {
            label: 'Flo',
            icon: AppsIcon,
            onClick: handleDualToggle,
            expanded: isDualExpanded,
            matches: false,
          },
          {
            label: 'Home',
            icon:AppsIcon,
            url: '/dual/home',
          },
          {
            label: 'Settings',
            icon:AppsIcon,
            url: '/dual/settings',
          },
          {
            label: 'Accounts',
            icon:AppsIcon,
            url: '/dual/accounts',
          },
          {
            label: 'Support',
            icon:AppsIcon,
            url: '/dual/support',
          },
        ]}
      />
      {isDualExpanded && (
        <Navigation.Section
          title="Dual"
          items={[
            {
              label: 'Home',
              url: '/dual/home',
            },
            {
              label: 'Settings',
              url: '/dual/settings',
            },
            {
              label: 'Accounts',
              url: '/dual/accounts',
            },
            {
              label: 'Support',
              url: '/dual/support',
            },
          ]}
        />
      )}
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
            <Route path="/history" element={<div>History Page</div>} />
            <Route path="/dual/home" element={<DualHome />} />
            <Route path="/dual/settings" element={<DualSettings />} />
            <Route path="/dual/accounts" element={<DualAccounts />} />
            <Route path="/dual/support" element={<DualSupport />} />
          </Routes>
        </Frame>
      </Router>
    </AppProvider>
  );
};

export default App;
