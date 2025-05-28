import React, { useState, useEffect } from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  Banner,
  Button,
  Select,
  InlineStack,
  Link,
  Box,
  Popover,
  ActionList,
  Toast,
  Spinner
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';

const Home: React.FC = () => {
  const [skuSync, setSkuSync] = useState('OFF');
  const skuSyncOptions = [
    { label: 'OFF', value: 'OFF' },
    { label: 'Limited sync', value: 'limited' },
    { label: 'Full sync', value: 'full' },
  ];

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = () => setPopoverActive((active) => !active);

  // Updated location options 
  const locationOptions = ['Location 1', 'Location 2', 'Location 3'];

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [toastActive, setToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add effect to auto-dismiss toast after 3 seconds
  useEffect(() => {
    let toastTimer: NodeJS.Timeout;
    
    if (toastActive) {
      toastTimer = setTimeout(() => {
        setToastActive(false);
      }, 3000); // 3 seconds (changed from 1000)
    }
    
    // Cleanup function to clear the timer if component unmounts
    // or if toast is dismissed manually before timeout
    return () => {
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, [toastActive]);

  const handleSelectLocation = (location: string) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location]);
    }
    setPopoverActive(false);
  };

  const handleRemoveLocation = (location: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc !== location));
  };

  const locationActions = locationOptions.map((loc) => ({
    content: loc,
    onAction: () => handleSelectLocation(loc),
  }));

  const handleSkuSyncChange = async (value: string) => {
    setIsLoading(true);
    try {
      setSkuSync(value);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setToastActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <BlockStack gap="500"> {/* Changed from 400 to 500 to match Shopify spacing */}
        {/* App Title */}
        <Box paddingBlockEnd="400">
          <Text as="h1" variant="headingLg" fontWeight="bold">
            Flo App
          </Text>
        </Box>

        {/* Info Banner */}
        <Banner tone="info">
          <InlineStack gap="400" blockAlign="center" wrap={false}>
            <Box width="fill">
              <Text as="span" variant="bodyMd">
                The app helps to keep the Duplicate SKUs in sync.
              </Text>
            </Box>
            <Button url="#" variant="primary" size="slim">
              Getting Started Guide
            </Button>
          </InlineStack>
        </Banner>

        {/* Duplicate SKU Sync */}
        <Card padding="400">
          <InlineStack align="space-between" blockAlign="center" gap="400">
            <Text as="h2" variant="headingSm" fontWeight="medium">
              Duplicate SKU Sync
            </Text>
            <Box minWidth="200px">
              <Select
                options={skuSyncOptions}
                value={skuSync}
                onChange={handleSkuSyncChange}
                label="Sync mode"
                labelHidden
                disabled={isLoading}
              />
            </Box>
          </InlineStack>
        </Card>

        {/* Blacklisted Locations */}
        <Card padding="400">
          <BlockStack gap="400">
            <BlockStack gap="200">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingSm" fontWeight="medium">
                  Blacklisted Locations
                </Text>
                <Popover
                  active={popoverActive}
                  activator={
                    <Button
                      variant="secondary"
                      onClick={togglePopoverActive}
                      disclosure
                      aria-label="Select a location to blacklist"
                    >
                      Add Location
                    </Button>
                  }
                  onClose={togglePopoverActive}
                >
                  <ActionList items={locationActions} />
                </Popover>
              </InlineStack>
              
              <Text as="p" variant="bodySm" tone="subdued">
                Inventory at these locations will not be synced.
                <Link url="#" removeUnderline> More info</Link>
              </Text>
            </BlockStack>

            {/* Table to show selected locations */}
            {selectedLocations.length > 0 && (
              <BlockStack gap="300">
                {/* Table Header */}
                <InlineStack align="space-between" blockAlign="center">
                  <Box width="60%">
                    <Text as="span" variant="bodySm" fontWeight="bold">
                      Location
                    </Text>
                  </Box>
                  <Box width="40%" paddingInlineStart="300">
                    <Text as="span" variant="bodySm" fontWeight="bold">
                      Action
                    </Text>
                  </Box>
                </InlineStack>

                <Box borderBlockEndWidth="025" borderColor="border" />

                {/* Table Rows */}
                {selectedLocations.map((loc) => (
                  <InlineStack
                    key={loc}
                    align="space-between"
                    blockAlign="center"
                    gap="200"
                    wrap={false}
                  >
                    <Box width="60%">
                      <Text as="span" variant="bodySm">
                        {loc}
                      </Text>
                    </Box>
                    <Box width="40%">
                      <Button
                        onClick={() => handleRemoveLocation(loc)}
                        variant="plain"
                        icon={DeleteIcon}
                      >
                        Remove
                      </Button>
                    </Box>
                  </InlineStack>
                ))}
              </BlockStack>
            )}
            
            {selectedLocations.length === 0 && (
              <Box padding="400" background="bg-surface-secondary" borderRadius="100">
                <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                  No locations blacklisted.
                </Text>
              </Box>
            )}
          </BlockStack>
        </Card>
        
        {/* Add bottom spacing to match Shopify admin UI */}
        <Box paddingBlockEnd="600">
          {/* This provides the standard 24px bottom spacing using Polaris tokens */}
        </Box>
      </BlockStack>

      {/* Toast Message */}
      {toastActive && (
        <Toast content="Sync setting saved successfully" onDismiss={() => setToastActive(false)} />
      )}
      
      {isLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 1000 }}>
          <Spinner size="large" />
        </div>
      )}
    </Page>
  );
};

export default Home;
