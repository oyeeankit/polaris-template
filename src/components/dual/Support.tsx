import React from 'react';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

const Support: React.FC = () => {
  return (
    <Page title="Dual Support">
      <Card>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            Get help and support for Dual features here.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Support;
