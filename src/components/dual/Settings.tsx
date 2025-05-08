import React from 'react';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

const Settings: React.FC = () => {
  return (
    <Page title="Dual Settings">
      <Card>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            This is the Dual Settings page.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Settings;
