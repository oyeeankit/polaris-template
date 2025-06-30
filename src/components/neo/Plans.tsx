import React, { useState, useEffect } from 'react';
import {
  Page,
  BlockStack,
  InlineGrid,
  Box,
  Card,
  Text,
  Button,
  Icon,
  Divider,
  Banner,
  Toast
} from '@shopify/polaris';
import { CheckIcon } from '@shopify/polaris-icons';

const Plans: React.FC = () => {
  // Simplified plan type for only Paid plan
  type PlanType = 'PAID';
  
  // State to store the current plan
  const [currentPlan, setCurrentPlan] = useState<PlanType>('PAID');
  
  // Add toast state
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Define plan data - only Basic plan
  const plans = [
    {
      id: 'paid',
      name: 'Basic Plan',
      price: '$5',
      isCurrentPlan: currentPlan === 'PAID',
      features: [
        { name: 'Unlimited Product Blocks', included: true },
      ],
    }
  ];
  
  // Function to show toast message
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastActive(true);
    
    // Auto-dismiss toast after 3 seconds
    setTimeout(() => {
      setToastActive(false);
    }, 3000);
  };
  
  const handleToastDismiss = () => setToastActive(false);
  
  // Handle plan upgrade
  const handlePlanButtonClick = (planId: string, isCurrentPlan: boolean) => {
    if (!isCurrentPlan) {
      setCurrentPlan('PAID');
      showToast('Subscribed to Pro Plan!');
    }
  };

  return (
    <Page
      title="Pricing Plan"
      fullWidth
    >
      {toastActive && (
        <Toast content={toastMessage} onDismiss={handleToastDismiss} duration={3000} />
      )}
      
      <BlockStack gap="500">
        <div style={{ maxWidth: "350px", margin: "0" }}>
          <div style={{ position: "relative", height: "100%" }}>
            <Card padding="400">
              <BlockStack gap="300">
                <Box paddingBlockEnd="300">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingLg" fontWeight="semibold" alignment="center">
                      {plans[0].name}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                      Monthly billing
                    </Text>
                    <Text as="p" variant="headingXl" fontWeight="bold" alignment="center">
                      {plans[0].price}
                      <Text as="span" variant="bodyMd">/month</Text>
                    </Text>
                  </BlockStack>
                </Box>

                <Divider />

                <BlockStack gap="200">
                  {plans[0].features.map((feature, featureIndex) => (
                    <div key={featureIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon
                          source={CheckIcon}
                          tone="success"
                        />
                      </div>
                      <Text as="span" variant="bodyMd">
                        {feature.name}
                      </Text>
                    </div>
                  ))}
                </BlockStack>

                <Box paddingBlockStart="300">
                  <Button
                    variant="primary"
                    tone={plans[0].isCurrentPlan ? "success" : undefined}
                    disabled={plans[0].isCurrentPlan}
                    fullWidth
                    onClick={() => handlePlanButtonClick(plans[0].id, plans[0].isCurrentPlan)}
                  >
                    {plans[0].isCurrentPlan ? 'Current Plan' : 'Subscribe to Pro Plan'}
                  </Button>
                </Box>
              </BlockStack>
            </Card>
          </div>
        </div>
        
        {/* Add bottom spacing to match Shopify admin UI */}
        <Box paddingBlockEnd="600">
          {/* This provides the standard 24px bottom spacing using Polaris tokens */}
        </Box>
      </BlockStack>
    </Page>
  );
};

export default Plans;