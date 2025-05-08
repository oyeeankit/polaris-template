import React, { useState } from 'react';
import {
  Page,
  Card,
  RadioButton,
  DataTable,
  Text,
  Button,
  Badge,
  BlockStack,
  InlineStack,
  Icon,
  Layout,
} from '@shopify/polaris';
import { CheckIcon, MinusIcon } from '@shopify/polaris-icons';

const Plans: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleBillingPeriodChange = (checked: boolean, newValue: string) => {
    if (checked) {
      setBillingPeriod(newValue as 'monthly' | 'yearly');
    }
  };

  // Define plan tiers
  const tiers = [
    {
      name: 'Sandbox',
      color: 'success',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      features: {
        sheets: 'unlimited',
        imports: '100',
        maxRows: '5',
        dataResidency: 'US or EU',
        removeBranding: false,
        customStyling: false,
        aiBulkTransforms: false,
        teamMembers: '3',
      },
    },
    {
      name: 'Startup',
      color: 'info',
      monthlyPrice: '$19',
      yearlyPrice: '$15',
      features: {
        sheets: 'unlimited',
        imports: '1K',
        maxRows: '10K',
        dataResidency: 'US or EU',
        removeBranding: true,
        customStyling: false,
        aiBulkTransforms: false,
        teamMembers: '3',
      },
    },
    {
      name: 'Pro',
      color: 'warning',
      monthlyPrice: '$49',
      yearlyPrice: '$39',
      features: {
        sheets: 'unlimited',
        imports: '5K',
        maxRows: '50K',
        dataResidency: 'US or EU',
        removeBranding: true,
        customStyling: true,
        aiBulkTransforms: true,
        teamMembers: '5',
      },
    },
    {
      name: 'Growth',
      color: 'attention',
      monthlyPrice: '$99',
      yearlyPrice: '$79',
      features: {
        sheets: 'unlimited',
        imports: '10K',
        maxRows: '100K',
        dataResidency: 'US or EU',
        removeBranding: true,
        customStyling: true,
        aiBulkTransforms: true,
        teamMembers: '7',
      },
    },
    {
      name: 'Plus',
      color: 'critical',
      monthlyPrice: '$199',
      yearlyPrice: '$159',
      features: {
        sheets: 'unlimited',
        imports: '10K',
        maxRows: '500K',
        dataResidency: 'US or EU',
        removeBranding: true,
        customStyling: true,
        aiBulkTransforms: true,
        teamMembers: '10',
      },
    },
  ];

  // Create table rows for each feature
  const createFeatureRow = (featureName: string, featureKey: keyof typeof tiers[0]['features']) => {
    return [
      <Text key={`${featureKey}-label`} variant="bodyMd" fontWeight="bold" as="p">{featureName}</Text>,
      ...tiers.map((tier, index) => {
        const feature = tier.features[featureKey];
        
        if (typeof feature === 'boolean') {
          return feature ? 
            <Icon key={`${featureKey}-${index}`} source={CheckIcon} /> : 
            <Icon key={`${featureKey}-${index}`} source={MinusIcon} />;
        }
        
        return <Text key={`${featureKey}-${index}`} variant="bodyMd" as="p" alignment="center">{feature}</Text>;
      }),
    ];
  };

  // Create header row with plan names
  const headerRow = [
    '',
    ...tiers.map((tier) => (
      <BlockStack key={tier.name} gap="200" align="center">
        <Badge tone={tier.color as any}>{tier.name}</Badge>
      </BlockStack>
    )),
  ];

  // Create price row
  const priceRow = [
    <Text key="price-label" variant="bodyMd" fontWeight="bold" as="p">Price per month</Text>,
    ...tiers.map((tier, index) => (
      <Text key={`price-${index}`} variant="headingLg" fontWeight="bold" as="p" alignment="center">
        {billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
      </Text>
    )),
  ];

  // Create action row with select buttons
  const actionRow = [
    '',
    ...tiers.map((tier, index) => (
      index === 0 ? '' : <Button key={`action-${index}`} variant="primary">Select</Button>
    )),
  ];

  // Combine all rows
  const rows = [
    priceRow,
    createFeatureRow('Sheets', 'sheets'),
    createFeatureRow('Imports', 'imports'),
    createFeatureRow('Max rows', 'maxRows'),
    createFeatureRow('Data Residency', 'dataResidency'),
    createFeatureRow('Remove Branding', 'removeBranding'),
    createFeatureRow('Custom Styling', 'customStyling'),
    createFeatureRow('AI Bulk Transforms', 'aiBulkTransforms'),
    createFeatureRow('Team Members', 'teamMembers'),
    actionRow,
  ];

  return (
    <Page title="Pricing Plans">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="500">
                <RadioButton
                  label="Pay monthly"
                  checked={billingPeriod === 'monthly'}
                  id="monthly"
                  name="billing"
                  onChange={handleBillingPeriodChange}
                />
                <InlineStack gap="200" align="center">
                  <RadioButton
                    label="Pay yearly"
                    checked={billingPeriod === 'yearly'}
                    id="yearly"
                    name="billing"
                    onChange={handleBillingPeriodChange}
                  />
                  <Text variant="bodyMd" as="span" tone="critical">$$</Text>
                </InlineStack>
              </InlineStack>
            </BlockStack>
            <DataTable
              columnContentTypes={Array(tiers.length + 1).fill('text')}
              headings={headerRow}
              rows={rows}
              showTotalsInFooter={false}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Plans;
