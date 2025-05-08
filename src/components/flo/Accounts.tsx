import React from 'react';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

const Accounts: React.FC = () => {
  return (
    <Page title="Flo Accounts">
      <Card>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            This is the Flo Accounts page.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Accounts;
