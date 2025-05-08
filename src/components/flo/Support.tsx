import React from 'react';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

const Support: React.FC = () => {
  return (
    <Page title="Flo Support">
      <Card>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            This is the Flo Support page.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Support;
