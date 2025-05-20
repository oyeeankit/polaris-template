import React, { useCallback } from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineGrid,
  Box,
  Icon,
  Banner,
  Divider,
  Button
} from '@shopify/polaris';
import {
  EmailIcon,
  ChatIcon,
  QuestionCircleIcon, // Changed from QuestionIcon
  InfoIcon
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
  // Handler for opening Tawk.to chat
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
      description: 'Get answers within 24 hours for all your account and technical questions.',
      icon: EmailIcon,
      availability: '24/7 available',
      action: {
        content: 'Send an email',
        onAction: () => window.open('mailto:support@example.com', '_blank'),
      },
      color: 'var(--p-color-bg-success-subdued)' // Using Polaris variables
    },
    {
      title: 'Live Chat',
      description: 'Connect with our support team in real-time for immediate assistance.',
      icon: ChatIcon,
      availability: 'In working hours',
      action: {
        content: 'Start live chat',
        onAction: openLiveChat,
      },
      color: 'var(--p-color-bg-highlight-subdued)'
    },
    {
      title: 'Knowledge Base',
      description: 'Browse our comprehensive guides, tutorials, and frequently asked questions.',
      icon: QuestionCircleIcon,
      availability: '24/7 available',
      action: {
        content: 'Browse articles',
        onAction: () => window.open('https://thaliaapps.freshdesk.com/a/solutions/categories/29000035439/folders/29000057923', '_blank'),
      },
      color: 'var(--p-color-bg-info-subdued)'
    },
  ];

  const faqs = [
    {
      question: "Dual price not shown for my store?",
      answer: "If Dual Price is not displaying on your site, you need to enable app embedding to get the dual prices displayed on the store. Check the currency formatting configuration steps mentioned in the guide here. If you are still facing the issue, let us know and we will have a look at it."
    }
  ];

  return (
    <Page
      title="Support Center"
      subtitle="We're here to help you succeed with our app"
      fullWidth
    >
      <BlockStack gap="800">
        <Banner
          title="Need help? We're available Monday-Friday, 9am-5pm IST"
          tone="info"
          icon={InfoIcon}
        >
          <p>For urgent matters outside business hours, please email duplicateskusync@newaccount1607938888582.freshdesk.com</p>
        </Banner>

        <InlineGrid columns={{ xs: 1, sm: 1, md: 3 }} gap="500">
          {supportOptions.map((option, index) => (
            <Card key={index} padding="0">
              {/* Wrap everything in a div with height 100% */}
              <div style={{ height: '100%' }}>
                {/* Remove style prop from Box */}
                <Box 
                  borderColor="border" 
                  borderRadius="300"
                  paddingInlineStart="0"
                  paddingInlineEnd="0"
                >
                  <BlockStack gap="400">
                    <div
                      style={{
                        padding: "var(--p-space-500)",
                        paddingBlockEnd: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
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
                      <Text as="span" variant="bodySm" tone="subdued">
                        {option.availability}
                      </Text>
                    </div>
                    
                    <Box padding="400" paddingBlockStart="0" paddingBlockEnd="0">
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingMd" fontWeight="semibold">
                          {option.title}
                        </Text>
                        <Text as="p" variant="bodyMd">
                          {option.description}
                        </Text>
                      </BlockStack>
                    </Box>
                    
                    <Box padding="400" paddingBlockStart="0" paddingBlockEnd="400">
                      <Button
                        onClick={option.action.onAction}
                        variant="primary"
                        fullWidth
                      >
                        {option.action.content}
                      </Button>
                    </Box>
                  </BlockStack>
                </Box>
              </div>
            </Card>
          ))}
        </InlineGrid>

        <Divider />

        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Frequently Asked Questions</Text>
              
              <BlockStack gap="400">
                {faqs.map((faq, index) => (
                  <Box key={index}>
                    <BlockStack gap="200">
                      <Text as="span" variant="headingSm" fontWeight="semibold">
                        {faq.question}
                      </Text>
                      <Text as="p" variant="bodyMd">
                        {faq.answer}
                      </Text>
                    </BlockStack>
                  </Box>
                ))}
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </Page>
  );
};

export default ContactSupport;
