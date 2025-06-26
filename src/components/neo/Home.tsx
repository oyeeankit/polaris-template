import React from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Box,
  Divider,
} from '@shopify/polaris';

export default function Home() {
  return (
    <Page
      title="Neo Dashboard"
      subtitle="Welcome to your new home page"
      primaryAction={{
        content: 'Get started',
        onAction: () => {
          console.log('Get started clicked');
        },
      }}
    >
      <BlockStack gap="500">
        {/* Welcome Card */}
        <Card>
          <Box padding="400">
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">
                  Welcome to Neo
                </Text>
                <Badge tone="success">Active</Badge>
              </InlineStack>
              
              <Text as="p" variant="bodyMd" tone="subdued">
                This is a simple test card created with Shopify Polaris components. 
                You can use this as a starting point to build your application.
              </Text>
              
              <Divider />
              
              <InlineStack gap="300">
                <Button variant="primary">
                  Primary Action
                </Button>
                <Button>
                  Secondary Action
                </Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Card>

        {/* Stats Card */}
        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Quick Stats
              </Text>
              
              <InlineStack gap="600" wrap>
                <Box>
                  <BlockStack gap="100">
                    <Text as="p" variant="headingLg">
                      42
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Total Items
                    </Text>
                  </BlockStack>
                </Box>
                
                <Box>
                  <BlockStack gap="100">
                    <Text as="p" variant="headingLg">
                      1,234
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Total Views
                    </Text>
                  </BlockStack>
                </Box>
                
                <Box>
                  <BlockStack gap="100">
                    <Text as="p" variant="headingLg">
                      98%
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Success Rate
                    </Text>
                  </BlockStack>
                </Box>
              </InlineStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </Page>
  );
}
