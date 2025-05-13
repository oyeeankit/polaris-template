// src/pages/Plans.tsx

import React from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Box,
  TextContainer
} from '@shopify/polaris';

const Plans: React.FC = () => {
  return (
    <Page title="Plans">
    <Box padding="400">
     <div style={{ maxWidth: '400px', margin: '0 auto' }}>
       <Card padding="500">
      <BlockStack gap="300" align="center">
        <Text variant="headingMd" as="h2">Basic Plan</Text>
        <Text variant="heading2xl" as="p">$45</Text>
        <Text variant="bodyMd" as="p" tone="subdued">per year</Text>
        <Text variant="bodyMd" as="p">All features</Text>
        <Text variant="bodyMd" tone="success" fontWeight="semibold" as="p">
          Current Plan
        </Text>
      </BlockStack>
    </Card>
  </div>
</Box>
    </Page>
  );
};

export default Plans;
