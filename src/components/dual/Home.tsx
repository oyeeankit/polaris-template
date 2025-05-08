import React from 'react';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

const Home: React.FC = () => {
  return (
    <Page title="Dual Home">
      <Card>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            Welcome to the Dual Home page.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Home;
