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
  SettingToggle,
  TextContainer
} from '@shopify/polaris';

const Home: React.FC = () => {
  const [currencyFormatEnabled, setCurrencyFormatEnabled] = useState(false);
  const [appEmbedEnabled, setAppEmbedEnabled] = useState(false);

  const handleCurrencyFormatToggle = () => {
    setCurrencyFormatEnabled((enabled) => !enabled);
  };

  const handleAppEmbedToggle = () => {
    setAppEmbedEnabled((enabled) => !enabled);
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
              <ProgressBar progress={25} size="small" />
              <Box paddingBlockStart="100">
                <Text as="span" variant="bodySm" tone="subdued">0/2 completed</Text>
              </Box>
            </Box>
          </BlockStack>

          <BlockStack gap="400">
            <SettingToggle
              action={{
                content: currencyFormatEnabled ? 'Disable' : 'Enable',
                onAction: handleCurrencyFormatToggle,
              }}
              enabled={currencyFormatEnabled}
            >
              <BlockStack gap="100">
                <Text as="h3" variant="headingMd">Currency Format Setup</Text>
                <TextContainer>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Configure how currencies are displayed in your store
                  </Text>
                </TextContainer>
                <Box paddingBlockStart="100">
                  <Link url="https://help.shopify.com/manual/payments/currency-formatting" external>
                    View documentation
                  </Link>
                </Box>
              </BlockStack>
            </SettingToggle>

            <SettingToggle
              action={{
                content: appEmbedEnabled ? 'Disable' : 'Enable',
                onAction: handleAppEmbedToggle,
              }}
              enabled={appEmbedEnabled}
            >
              <BlockStack gap="100">
                <Text as="h3" variant="headingMd">App Embed</Text>
                <TextContainer>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Embed the app in your store theme
                  </Text>
                </TextContainer>
                <Box paddingBlockStart="100">
                  <Button variant="tertiary" size="slim">
                    Open theme settings
                  </Button>
                </Box>
              </BlockStack>
            </SettingToggle>
          </BlockStack>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Home;
