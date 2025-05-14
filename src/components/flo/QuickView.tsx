import React, { useState } from 'react';
import {
  Page,
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
  BlockStack
} from '@shopify/polaris';
import { ArrowLeftIcon } from '@shopify/polaris-icons'; // Import ArrowLeftIcon
import { useNavigate } from 'react-router-dom'; // assuming you use React Router

export default function QuickView() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('warehouse1');
  const [sku, setSku] = useState('');
  const [restockQty, setRestockQty] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const locations = [
    { label: 'Warehouse 1', value: 'warehouse1' },
    { label: 'Warehouse 2', value: 'warehouse2' },
    { label: 'Storefront', value: 'storefront' },
  ];

  const handleSearch = () => {
    if (sku.length < 3) {
      alert('Please provide SKU with minimum 3 characters');
      return;
    }
    console.log('Searching SKU', sku, 'in location', location);
    // Add search logic here
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/flo/inventory'); // Replace with the appropriate route path
  };

  return (
    <Page
      title="Quick View and Restock Inventory"
      secondaryActions={[{ content: 'More info', url: '#' }]}
    >
      <Box padding="400" paddingBlockEnd="0">
        <Button
          icon={ArrowLeftIcon} // Add the left arrow icon here
          onClick={handleBackClick} // Calls handleBackClick for back navigation
          variant="plain"
        >
          Back to Settings
        </Button>
      </Box>
      <BlockStack gap="400">
        <Card>
          <Box padding="400" paddingBlockEnd="0">
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
                  placeholder="Please provide SKU with minimum 3 characters"
                  autoComplete="off"
                />
                <Button variant="primary" onClick={handleSearch}>
                  Search
                </Button>
              </InlineStack>
              <Box paddingBlockStart="100" paddingBlockEnd="200">
                <Link
                  monochrome
                  url="#"
                  onClick={() => setShowAdvanced(prev => !prev)}
                >
                  Advanced Search
                </Link>
              </Box>
              {showAdvanced && (
                <Box paddingBlockEnd="200">
                  <InlineStack gap="200" wrap blockAlign="center">
                    <Select
                      label="SKU Condition"
                      labelHidden
                      options={[
                        { label: 'Is equal to', value: 'equal' },
                        { label: 'Contains', value: 'contains' },
                        { label: 'Starts with', value: 'starts' },
                      ]}
                      value="equal"
                      onChange={() => { }}
                    />
                    <TextField
                      label="SKU Input"
                      labelHidden
                      placeholder="Please provide SKU with minimum 3 characters"
                      autoComplete="off"
                    />
                    <Button variant="primary">Search</Button>
                  </InlineStack>
                </Box>
              )}
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
