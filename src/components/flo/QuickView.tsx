import React, { useState } from 'react';
import {
  Card,
  InlineStack,
  FormLayout,
  Select,
  TextField,
  Button,
  Link,
  Box,
  Text,
  Divider,
  Page,
  BlockStack
} from '@shopify/polaris';

const locations = [
  { label: 'Unit 1 Mercia Way', value: 'unit1' },
  // Add more locations as needed
];

export default function QuickView() {
  const [location, setLocation] = useState('unit1');
  const [sku, setSku] = useState('');
  const [restockQty, setRestockQty] = useState('');

  return (
    <Page>
      <BlockStack gap="400">
    <Card>
      <Box padding="400" paddingBlockEnd="0">
        <InlineStack align="space-between" blockAlign="center">
          <Text as="h2" variant="headingMd">
            Quick View and Restock Inventory
          </Text>
          <Link url="#" monochrome removeUnderline>
            More info
          </Link>
        </InlineStack>
      </Box>
      <Divider />
      <Box padding="400" paddingBlockStart="0">
        <FormLayout>
          <InlineStack gap="200" wrap blockAlign="center">
            <Select
              label="Location"
              labelHidden
              options={locations}
              value={location}
              onChange={setLocation}
            />
            <TextField
              label="SKU"
              labelHidden
              value={sku}
              onChange={setSku}
              placeholder="Provide SKU"
              autoComplete="off"
            />
            <Button variant="primary">Search</Button>
          </InlineStack>
          <Box paddingBlockStart="100" paddingBlockEnd="200">
            <Link url="#" monochrome>
              Advanced Search
            </Link>
          </Box>
          <Divider />
          <Box paddingBlockStart="200">
            <InlineStack gap="200" wrap blockAlign="center">
              <TextField
                label="Restock Quantity"
                labelHidden
                value={restockQty}
                onChange={setRestockQty}
                placeholder="Enter Restock Quantity"
                autoComplete="off"
                type="number"
                min={0}
              />
              <Button variant="primary">Update</Button>
            </InlineStack>
          </Box>
        </FormLayout>
      </Box>
    </Card>
    </BlockStack>
    </Page>
  );
}
