import React from 'react';
import { Page, Card, Text, Layout, BlockStack } from '@shopify/polaris';

const Analytics: React.FC = () => {
  return (
    <Page title="Analytics">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Sales Overview
              </Text>
              <Text variant="bodyMd" as="p">
                Analytics dashboard content will be displayed here.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Analytics; 