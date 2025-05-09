import React, { useState } from 'react';
import { 
  Page, 
  Card, 
  Text, 
  BlockStack, 
  Box, 
  ProgressBar, 
  Link, 
  Button, 
  InlineStack,
  TextContainer,
  Badge
} from '@shopify/polaris';

const Home: React.FC = () => {
  const [appEmbedEnabled, setAppEmbedEnabled] = useState(false);
  const [documentViewed, setDocumentViewed] = useState(false);
  const [isAppEmbedOn, setIsAppEmbedOn] = useState(false);

  // Calculate completed steps and progress
  const completedSteps = (documentViewed ? 1 : 0) + (isAppEmbedOn ? 1 : 0);
  const progress = completedSteps * 50; // 0%, 50%, or 100%

  const handleViewDocument = () => {
    setDocumentViewed(true);
    window.open("https://help.shopify.com/manual/payments/currency-formatting", "_blank");
  };

  return (
    <Page title="Home">
      <Card>
        <BlockStack gap="500">
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">Setup guide</Text>
            <TextContainer>
              <Text as="p" variant="bodyMd" tone="subdued">
                Use this personalized guide to get your app up and running.
              </Text>
            </TextContainer>
            <Box paddingBlockEnd="400" paddingBlockStart="200">
              <InlineStack align="space-between" blockAlign="center" gap="400">
                <Text as="span" variant="bodySm" tone="subdued">{completedSteps}/2 completed</Text>
                <Box width="80%">
                  <ProgressBar progress={progress} size="small" />
                </Box>
              </InlineStack>
            </Box>
          </BlockStack>

          <BlockStack gap="400">
            <Card>
              <BlockStack gap="100">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="h3" variant="headingMd">Currency Format Setup</Text>
                    {documentViewed && (
                      <Badge tone="success">Read</Badge>
                    )}
                  </InlineStack>
                </InlineStack>
                <TextContainer>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Check currency formatting configuration steps mentioned in the guide below
                  </Text>
                </TextContainer>
                <Box paddingBlockStart="100">
                  <InlineStack gap="200" blockAlign="center">
                    <Button 
                      onClick={handleViewDocument} 
                      variant="plain" 
                      accessibilityLabel="View currency formatting documentation"
                    >
                      View documentation
                    </Button>
                    {documentViewed && (
                      <Text as="span" variant="bodyMd" tone="success" fontWeight="bold">✓</Text>
                    )}
                  </InlineStack>
                </Box>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="100">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="h3" variant="headingMd">App Embed</Text>
                    {isAppEmbedOn && (
                      <Badge tone="success">Enable</Badge>
                    )}
                  </InlineStack>
                </InlineStack>
                <TextContainer>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Embed the app in your store theme
                  </Text>
                </TextContainer>
                <Box paddingBlockStart="100">
                  <InlineStack gap="200" blockAlign="center">
                    <Button 
                      onClick={() => {
                        // Simulate checking if app is embedded in Shopify
                        setAppEmbedEnabled(true);
                        
                        // Check if app embed is enabled in Shopify settings
                        // In a real app, this would be an API call to check Shopify settings
                        // For this example, we'll simulate it by checking appEmbedEnabled
                        setIsAppEmbedOn(true);
                        
                        // In a real app, this would redirect to Shopify admin app embed page
                        window.open("https://admin.shopify.com/settings/apps/embedded", "_blank");
                      }} 
                      variant="primary" 
                      size="medium"
                      accessibilityLabel="Open Shopify app embed settings"
                    >
                      Open theme settings
                    </Button>
                    {appEmbedEnabled && (
                      <Text as="span" variant="bodyMd" tone="success" fontWeight="bold">✓</Text>
                    )}
                  </InlineStack>
                </Box>
              </BlockStack>
            </Card>
          </BlockStack>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Home;
