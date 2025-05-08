import React from 'react';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

const Home: React.FC = () => {
  return (
    <Page title="Flo Home">
      <Card>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            Welcome to the Flo Home page.
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Home;
