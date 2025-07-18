import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
  AppsIcon,
  CreditCardIcon,
  InventoryIcon,
  PageClockIcon
} from '@shopify/polaris-icons';
import enTranslations from '@shopify/polaris/locales/en.json';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Customers from './components/Customers';
import Settings from './components/Settings';
import DualHome from './components/dual/Home';
import DualSettings from './components/dual/Settings';
import DualAccounts from './components/dual/Accounts';
import DualPlans from './components/dual/Plans';
import DualSupport from './components/dual/Support';
import FloHome from './components/flo/Home';
import FloPlans from './components/flo/Plans'; // Change from dual to flo
import FloAccounts from './components/flo/Accounts';
import FloSupport from './components/flo/Support'; 
import FloHistory from './components/flo/History';
import FlowInventory from './components/flo/Inventory';
import FlowInventoryDetailView from './components/flo/DetailView';
import QuickView from './components/flo/QuickView';
import NeoHome from './components/neo/Home';
import NeoPlans from './components/neo/Plans';
import NeoAccounts from './components/neo/Accounts';
import NeoSupport from './components/neo/Support';
import AmazonHome from './components/amazon/Home';
import AmazonPlans from './components/amazon/Plans';
import AmazonSupport from './components/amazon/Support';
import AmazonSettings from './components/amazon/Settings';
// Wrapper component to access location
const AppContent: React.FC = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(true);
  const [isDualExpanded, setIsDualExpanded] = useState<boolean>(false);
  const [isFloExpanded, setIsFloExpanded] = useState<boolean>(false);
  const [isNeoExpanded, setIsNeoExpanded] = useState<boolean>(false);
  const [isAmazonExpanded, setIsAmazonExpanded] = useState<boolean>(false);
  const location = useLocation();
  
  // Check if URL contains '/dual/' or '/flo/' and set expanded state accordingly
  useEffect(() => {
    if (location.pathname.includes('/dual/')) {
      setIsDualExpanded(true);
    }
    if (location.pathname.includes('/flo/')) {
      setIsFloExpanded(true);
    }
    if (location.pathname.includes('/neo/')) {
      setIsNeoExpanded(true);
    }
    if (location.pathname.includes('/amazon/')) {
      setIsAmazonExpanded(true);
    }
  }, [location.pathname]);
 
  const handleDualToggle = () => {
    setIsDualExpanded(!isDualExpanded);
  };

  const handleFloToggle = () => {
    setIsFloExpanded(!isFloExpanded);
  };

  const handleNeoToggle = () => {
    setIsNeoExpanded(!isNeoExpanded);
  };

  const handleAmazonToggle = () => {
    setIsAmazonExpanded(!isAmazonExpanded);
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
            label: 'Flo',
            icon: AppsIcon,
            onClick: handleFloToggle,
            expanded: isFloExpanded,
            matches: false,
          },
         {
            label: 'Neo',
            icon: AppsIcon,
            onClick: handleNeoToggle,
            expanded: isNeoExpanded,
            matches: false,
          },
         {
            label: 'Amazon',
            icon: AppsIcon,
            onClick: handleAmazonToggle,
            expanded: isAmazonExpanded,
            matches: false,
          }
        ]}
      />
      {isDualExpanded && (
        <Navigation.Section
          title="Dual"
          items={[
            {
              label: 'Home',
              url: '/dual/home',
              icon: HomeIcon,
            },
            {
              label: 'Settings',
              url: '/dual/settings',
              icon: SettingsIcon,
            },
            {
              label: 'Accounts',
              url: '/dual/accounts',
              icon: PersonFilledIcon,
            },
            {
              label: 'Plans',
              url: '/dual/plans',
              icon: CreditCardIcon,
            },
            {
              label: 'Support',
              url: '/dual/support',
              icon: ChartLineIcon,
            },
          ]}
        />
      )}
      {isFloExpanded && (
        <Navigation.Section
          title="Flo"
          items={[
            {
              label: 'Home',
              url: '/flo/home',
              icon: HomeIcon,
            },
            {
              label: 'History',
              url: '/flo/history',
              icon: PageClockIcon,
            },{
              label: 'Inventory',
              url: '/flo/inventory',
              icon: InventoryIcon,
            },
            {
              label: 'Plans',  // Add this item
              url: '/flo/plans',
              icon: CreditCardIcon,
            },
            {
              label: 'Accounts',
              url: '/flo/accounts',
              icon: PersonFilledIcon,
            },
            {
              label: 'Support',
              url: '/flo/support',
              icon: ChartLineIcon,
            },
          ]}
        />
      )}
      {isNeoExpanded && (
        <Navigation.Section
          title="Neo"
          items={[
            {
              label: 'Home',
              url: '/neo/home',
              icon: HomeIcon,
            },
            {
              label: 'Plans',
              url: '/neo/plans',
              icon: CreditCardIcon,
            },
            {
              label: 'Accounts',
              url: '/neo/accounts',
              icon: PersonFilledIcon,
            },
            {
              label: 'Support',
              url: '/neo/support',
              icon: ChartLineIcon,
            },
          ]}
        />
      )}
      {isAmazonExpanded && (
        <Navigation.Section
          title="Amazon"
          items={[
            {
              label: 'Home',
              url: '/amazon/home',
              icon: HomeIcon,
            },
            {
              label: 'Settings',
              url: '/amazon/settings',
              icon: SettingsIcon,
            },
            {
              label: 'Plans',
              url: '/amazon/plans',
              icon: CreditCardIcon,
            },
            {
              label: 'Support',
              url: '/amazon/support',
              icon: ChartLineIcon,
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
            <Route path="/dual/plans" element={<DualPlans/>} />
            <Route path="/dual/support" element={<DualSupport />} />
            <Route path="/flo/home" element={<FloHome />} />
            <Route path="/flo/plans" element={<FloPlans />} />
            <Route path="/flo/history" element={<FloHistory />} />
            <Route path="/flo/inventory" element={<FlowInventory />} />
            <Route path="/flo/accounts" element={<FloAccounts />} />
            <Route path="/flo/support" element={<FloSupport />} />
           <Route path="/flo/inventory-quick-view" element={<QuickView />} />
           <Route path="/flo/inventory-detail-view" element={<FlowInventoryDetailView />} />
           <Route path="/neo/home" element={<NeoHome />} />
           <Route path="/neo/plans" element={<NeoPlans />} />
           <Route path="/neo/accounts" element={<NeoAccounts />} />
           <Route path="/neo/support" element={<NeoSupport />} />
           <Route path="/amazon/home" element={<AmazonHome />} />
           <Route path="/amazon/settings" element={<AmazonSettings />} />
           <Route path="/amazon/plans" element={<AmazonPlans />} />
           <Route path="/amazon/support" element={<AmazonSupport />} />
          </Routes>
    </Frame>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <AppProvider i18n={enTranslations}>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
