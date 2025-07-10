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
  // Updated plan type to include both FREE and PAID
  type PlanType = 'FREE' | 'PAID';
  
  // State to store the current plan
  const [currentPlan, setCurrentPlan] = useState<PlanType>('FREE');
  
  // Add toast state
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Define plan data - Free and Basic plan
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      isCurrentPlan: currentPlan === 'FREE',
      features: [
        { name: 'Limited Amazon Products (3)', included: true },
        { name: 'Single Marketplace', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Standard Support', included: true },
        { name: 'Manual Link Creation', included: true },
      ],
    },
    {
      id: 'paid',
      name: 'Pro Plan',
      price: '$5',
      isCurrentPlan: currentPlan === 'PAID',
      features: [
        { name: 'Unlimited Amazon Products', included: true },
        { name: 'Multi-Marketplace Support', included: true },
        { name: 'Affiliate Tags', included: true },
        { name: 'Custom Link Management', included: true },
        { name: 'Click tracking', included: true },
        { name: 'Amazon Ranking Improvement', included: true },
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
  
  // Handle plan change
  const handlePlanButtonClick = (planId: string, isCurrentPlan: boolean) => {
    if (!isCurrentPlan) {
      if (planId === 'free') {
        setCurrentPlan('FREE');
        showToast('Switched to Free Plan');
      } else {
        setCurrentPlan('PAID');
        showToast('Subscribed to Amazon Pro Plan!');
      }
    }
  };

  return (
    <Page
      title="Amazon Plans"
      fullWidth
    >
      {toastActive && (
        <Toast content={toastMessage} onDismiss={handleToastDismiss} duration={3000} />
      )}
      
      <BlockStack gap="500">
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          <InlineGrid columns={['oneHalf', 'oneHalf']} gap="500">
            {plans.map((plan) => (
              <div key={plan.id} style={{ position: "relative", height: "100%" }}>
                <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                  <Card padding="400">
                    <BlockStack gap="300">
                      <Box paddingBlockEnd="300">
                        <BlockStack gap="200">
                          <Text as="h2" variant="headingLg" fontWeight="semibold" alignment="center">
                            {plan.name}
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                            {plan.id === 'free' ? 'No credit card required' : 'Monthly billing'}
                          </Text>
                          <Text as="p" variant="headingXl" fontWeight="bold" alignment="center">
                            {plan.price}
                            {plan.id !== 'free' && <Text as="span" variant="bodyMd">/month</Text>}
                          </Text>
                        </BlockStack>
                      </Box>

                      <Divider />

                      <BlockStack gap="200">
                        {plan.features.map((feature, featureIndex) => (
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
                          tone={plan.isCurrentPlan ? "success" : undefined}
                          disabled={plan.isCurrentPlan}
                          fullWidth
                          onClick={() => handlePlanButtonClick(plan.id, plan.isCurrentPlan)}
                        >
                          {plan.isCurrentPlan 
                            ? 'Current Plan' 
                            : plan.id === 'free' 
                              ? 'Switch to Free Plan' 
                              : 'Subscribe to Amazon Pro Plan'}
                        </Button>
                      </Box>
                    </BlockStack>
                  </Card>
                </div>
              </div>
            ))}
          </InlineGrid>
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
