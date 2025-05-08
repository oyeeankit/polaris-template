import React from 'react';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

const Accounts: React.FC = () => {
  return (
    <Page title="Dual Accounts">
      <Card>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            Manage your Dual accounts here.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Accounts;
