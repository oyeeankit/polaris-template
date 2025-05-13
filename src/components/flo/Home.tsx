import React, { useState } from 'react';
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
} from '@shopify/polaris';

const Home: React.FC = () => {
  const [skuSync, setSkuSync] = useState('off');
  const skuSyncOptions = [
    { label: 'Off', value: 'off' },
    { label: 'On', value: 'on' },
  ];

  // Popover state for Add Location
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = () => setPopoverActive((active) => !active);

  // Mock locations
  const locations = [
    { content: 'Warehouse A', onAction: togglePopoverActive },
    { content: 'Warehouse B', onAction: togglePopoverActive },
    { content: 'Storefront', onAction: togglePopoverActive },
  ];

  return (
    <Page>
      <BlockStack gap="400">
        {/* Info Banner */}
        <Banner tone="info">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="span" variant="bodyMd">
              The app helps to keep the duplicate SKUs in sync
            </Text>
            <Button url="#" variant="primary" size="slim">
              Getting Started Guide
            </Button>
          </InlineStack>
        </Banner>

        {/* Duplicate SKU Sync Card */}
        <Card>
          <InlineStack align="start" gap="400">
            <Text as="span" variant="bodyMd" fontWeight="medium">
              Duplicate SKU Sync
            </Text>
            <Select
              options={skuSyncOptions}
              value={skuSync}
              onChange={setSkuSync}
              label="Duplicate SKU Sync"
              labelHidden
            />
          </InlineStack>
        </Card>

        {/* Blacklisted Locations Card */}
        <Card>
          <InlineStack align="space-between" blockAlign="center">
            <Box>
              <Text as="span" variant="bodyMd" fontWeight="medium">
                Blacklisted Locations
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                {' '}
                (Inventory at these locations will not be synced)
              </Text>
            </Box>
            <Link url="#" removeUnderline>
              More info
            </Link>
          </InlineStack>
          <Box paddingBlockStart="400">
            <Popover
              active={popoverActive}
              activator={
                <>
                  <Button variant="secondary" onClick={togglePopoverActive} disclosure>
                    Add Location
                  </Button>
                </>
              }
              onClose={togglePopoverActive}
            >
              <ActionList items={locations} />
            </Popover>
          </Box>
        </Card>

       
      </BlockStack>
    </Page>
  );
};

export default Home;
