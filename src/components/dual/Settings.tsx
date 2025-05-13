import React, { useState, lazy, Suspense } from 'react';
import { Page, Card, Text, BlockStack, Button, Box, InlineGrid, TextContainer, Spinner } from '@shopify/polaris';

// Lazy load the form components
const TaxSettingsForm = lazy(() => import('./settings/TaxSettingsForm'));
const AdvancedSettingsForm = lazy(() => import('./settings/AdvancedSettingsForm'));
const DesignSettingsForm = lazy(() => import('./settings/DesignSettingsForm'));

// Define the possible settings views
type SettingsView = 'main' | 'tax' | 'advanced' | 'design';

const Settings: React.FC = () => {
  // State to track which view is currently active
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  
  // Function to handle card clicks
  const handleCardClick = (view: SettingsView) => {
    setCurrentView(view);
  };

  // Function to go back to the main settings view
  const handleBackClick = () => {
    setCurrentView('main');
  };

  // Render the appropriate view based on the current state
  const renderContent = () => {
    switch (currentView) {
      case 'tax':
        return (
          <>
            <Box paddingBlockEnd="400">
              <Button onClick={handleBackClick} variant="plain">← Back to Settings</Button>
            </Box>
            <Suspense fallback={<Box padding="400"><Spinner size="large" /></Box>}>
              <TaxSettingsForm />
            </Suspense>
          </>
        );
      case 'design':
        return (
          <>
            <Box paddingBlockEnd="400">
              <Button onClick={handleBackClick} variant="plain">← Back to Settings</Button>
            </Box>
            <Suspense fallback={<Box padding="400"><Spinner size="large" /></Box>}>
              <DesignSettingsForm />
            </Suspense>
          </>
        );
        case 'advanced':
        return (
          <>
            <Box paddingBlockEnd="400">
              <Button onClick={handleBackClick} variant="plain">← Back to Settings</Button>
            </Box>
            <Suspense fallback={<Box padding="400"><Spinner size="large" /></Box>}>
              <AdvancedSettingsForm />
            </Suspense>
          </>
        );
      default:
        return (
          <InlineGrid columns={{ xs: "1fr", sm: "1fr", md: ["oneThird", "oneThird", "oneThird"] }} gap="400">
            <div onClick={() => handleCardClick('tax')} style={{ cursor: 'pointer' }}>
              <Card padding="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">Tax Settings</Text>
                  <TextContainer>
                    <Text as="p" variant="bodyMd">
                      Configure tax rates, exemptions, and other tax-related settings.
                    </Text>
                  </TextContainer>
                </BlockStack>
              </Card>
            </div>
            
              <div onClick={() => handleCardClick('design')} style={{ cursor: 'pointer' }}>
              <Card padding="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">Design</Text>
                  <TextContainer>
                    <Text as="p" variant="bodyMd">
                      Customize the appearance, themes, and visual elements.
                    </Text>
                  </TextContainer>
                </BlockStack>
              </Card>
            </div>
            
            <div onClick={() => handleCardClick('advanced')} style={{ cursor: 'pointer' }}>
              <Card padding="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">Advanced Settings</Text>
                  <TextContainer>
                    <Text as="p" variant="bodyMd">
                      Configure advanced options, integrations, and system preferences.
                    </Text>
                  </TextContainer>
                </BlockStack>
              </Card>
            </div>
          </InlineGrid>
        );
    }
  };

  // Determine the page title based on the current view
  const getPageTitle = () => {
    switch (currentView) {
      case 'tax':
        return 'Tax Settings';
      case 'advanced':
        return 'Advanced Settings';
      case 'design':
        return 'Design Settings';
      default:
        return 'Dual Settings';
    }
  };

  return (
    <Page title={getPageTitle()}>
      {renderContent()}
    </Page>
  );
};

export default Settings;
