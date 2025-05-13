import { Card, BlockStack, Box, Text, Button, TextField, Page, Select } from '@shopify/polaris';
import { useState } from 'react';

export default function FlowInventoryDetailView() {
  const [skuFilter, setSkuFilter] = useState('all');
  const skuOptions = [
    { label: 'All SKUs', value: 'all' },
    { label: 'Duplicate SKUs', value: 'duplicate' },
    { label: 'Stock Mismatch', value: 'mismatch' },
  ];

  return (
    <Page>
      <BlockStack gap="400">
        {/* Info Box */}
        <Box background="bg-fill-secondary" padding="400" borderRadius="200">
          <BlockStack gap="200">
            <Text as="span" variant="bodyMd">
              Analyze all products. Detect duplicate SKUs. Verify and correct stock mismatch.
            </Text>
            <Button size="slim" variant="secondary">Know More</Button>
          </BlockStack>
        </Box>
        {/* Analyze Products Card */}
        <Card>
          <BlockStack gap="0">
            <Box background="bg-fill-tertiary" padding="400" borderRadius="200">
              <Text as="span" variant="bodyMd" fontWeight="medium">
                1. Analyze Products
              </Text>
            </Box>
            <Box padding="400">
              <BlockStack gap="400">
                <Select
                  label="SKU Filter"
                  labelHidden
                  options={skuOptions}
                  value={skuFilter}
                  onChange={setSkuFilter}
                />
                <Button variant="primary">Analyze Now</Button>
              </BlockStack>
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
