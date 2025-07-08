import React, { useCallback } from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineGrid,
  Box,
  Icon,
  Button
} from '@shopify/polaris';
import {
  EmailIcon,
  ChatIcon,
  QuestionCircleIcon
} from '@shopify/polaris-icons';

// TypeScript interface for Tawk_API
declare global {
  interface Window {
    Tawk_API?: {
      toggle?: () => void;
      maximize?: () => void;
    };
  }
}

const ContactSupport: React.FC = () => {
  const openLiveChat = useCallback(() => {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      window.Tawk_API.maximize();
    } else {
      console.error('Tawk.to chat widget not available');
      // Fallback to external link
      window.open('https://tawk.to', '_blank');
    }
  }, []);

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get answers to all your Amazon integration and technical questions.',
      icon: EmailIcon,
      action: {
        content: 'Send an email',
        onAction: () => window.open('mailto:amazon-support@example.com', '_blank'),
        primary: false
      },
      color: 'var(--p-color-bg-success-subdued)'
    },
    {
      title: 'Live Chat',
      description: 'Connect with our Amazon specialists in real-time for immediate assistance.',
      icon: ChatIcon,
      action: {
        content: 'Start live chat',
        onAction: openLiveChat,
        primary: false
      },
      color: 'var(--p-color-bg-highlight-subdued)'
    },
    {
      title: 'Amazon Integration Guide',
      description: 'Browse our comprehensive Amazon setup guides, tutorials, and FAQ.',
      icon: QuestionCircleIcon,
      action: {
        content: 'Browse guides',
        onAction: () => window.open('https://amazon-help.example.com', '_blank'),
        primary: false
      },
      color: 'var(--p-color-bg-info-subdued)'
    },
  ];

  return (
    <Page
      title="Amazon Support Center"
      subtitle="Get help with your Amazon integration and buy button setup"
      fullWidth
    >
      <BlockStack gap="500">
        <InlineGrid columns={{ xs: 1, sm: 1, md: 3 }} gap="500">
          {supportOptions.map((option, index) => (
            <Card key={index} padding="0">
              <div style={{ height: '100%' }}>
                <Box 
                  borderColor="border" 
                  borderRadius="300"
                  paddingInlineStart="0"
                  paddingInlineEnd="0"
                >
                  <BlockStack gap="400">
                    <Box padding="500" paddingBlockEnd="400">
                      <BlockStack gap="300">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--p-space-300)" }}>
                          <div
                            style={{
                              backgroundColor: option.color,
                              borderRadius: "var(--p-border-radius-full)",
                              padding: "var(--p-space-300)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: "40px",
                              minHeight: "40px"
                            }}
                          >
                            <Icon
                              source={option.icon}
                              accessibilityLabel={option.title}
                            />
                          </div>
                          <Text as="h2" variant="headingMd" fontWeight="semibold">
                            {option.title}
                          </Text>
                        </div>

                        <Text as="p" variant="bodyMd">
                          {option.description}
                        </Text>
                      </BlockStack>
                    </Box>
                    
                    <Box padding="500" paddingBlockStart="0" paddingBlockEnd="400">
                      <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <Button
                          onClick={option.action.onAction}
                          variant={option.action.primary ? "primary" : "secondary"}
                        >
                          {option.action.content}
                        </Button>
                      </div>
                    </Box>
                  </BlockStack>
                </Box>
              </div>
            </Card>
          ))}
        </InlineGrid>

        <Box paddingBlockEnd="600">
          {/* This provides the standard 24px bottom spacing using Polaris tokens */}
        </Box>
      </BlockStack>
    </Page>
  );
};

export default ContactSupport;
