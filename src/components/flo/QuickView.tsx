// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import {
  Page,
  Card,
  InlineStack,
  BlockStack,
  FormLayout,
  Select,
  TextField,
  Button,
  Link,
  Box,
  Divider,
  Text,
  DataTable,
  Toast,
  Badge,
  Tooltip,
  Thumbnail,
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

interface SearchResultItem {
  shopifyId: string;
  variantId: string;
  sku: string;
  title: string;
  inventory: number;
}

export default function QuickView() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>('warehouse1');
  const [sku, setSku] = useState<string>('');
  const [restockQty, setRestockQty] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  
  // Add these new states for advanced search
  const [skuCondition, setSkuCondition] = useState<string>('equal');
  const [advancedSku, setAdvancedSku] = useState<string>('');

  // Toast state
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastError, setToastError] = useState(false);
  const toggleToastActive = () => setToastActive((active) => !active);

  const locations = [
    { label: 'Warehouse 1', value: 'warehouse1' },
    { label: 'Warehouse 2', value: 'warehouse2' },
    { label: 'Storefront', value: 'storefront' },
  ];

  const handleSearch = () => {
    if (!showAdvanced) {
      // Regular search
      if (sku.length < 3) {
        setSearchResults([]);
        setToastContent('Please provide SKU with minimum 3 characters');
        setToastError(true);
        setToastActive(true);
        return;
      }

      if (location === 'warehouse1' && sku.toUpperCase() === 'ABC') {
        setSearchResults([
          {
            shopifyId: '8011199873175',
            variantId: '43120834510999',
            sku: 'ABC',
            title: 'MX ANYWHERE 3 無線高階靜音滑鼠 - 石墨灰',
            inventory: 0,
          },
        ]);
      } else {
        setSearchResults([]);
        setToastContent('No results found');
        setToastError(true);
        setToastActive(true);
      }
    } else {
      // Advanced search
      if (advancedSku.length < 3) {
        setSearchResults([]);
        setToastContent('Please provide SKU with minimum 3 characters');
        setToastError(true);
        setToastActive(true);
        return;
      }

      // Mock data for testing different conditions
      const mockProducts = [
        {
          shopifyId: '8011199873175',
          variantId: '43120834510999',
          sku: 'ABC123',
          title: 'MX ANYWHERE 3 無線高階靜音滑鼠 - 石墨灰',
          inventory: 5,
        },
        {
          shopifyId: '8011199873176',
          variantId: '43120834511000',
          sku: 'ABC456',
          title: 'MX MASTER 3 無線高階滑鼠 - 黑色',
          inventory: 10,
        },
        {
          shopifyId: '8011199873177',
          variantId: '43120834511001',
          sku: 'XYZ123',
          title: 'K380 多工藍牙鍵盤 - 白色',
          inventory: 15,
        }
      ];

      // Filter based on condition
      let filteredResults: SearchResultItem[] = [];
      
      if (skuCondition === 'equal') {
        filteredResults = mockProducts.filter(
          product => product.sku.toUpperCase() === advancedSku.toUpperCase()
        );
      } else if (skuCondition === 'contains') {
        filteredResults = mockProducts.filter(
          product => product.sku.toUpperCase().includes(advancedSku.toUpperCase())
        );
      } else if (skuCondition === 'starts') {
        filteredResults = mockProducts.filter(
          product => product.sku.toUpperCase().startsWith(advancedSku.toUpperCase())
        );
      }

      if (filteredResults.length > 0) {
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
        setToastContent('No results found');
        setToastError(true);
        setToastActive(true);
      }
    }
  };

  const handleAdvancedSearch = () => {
    handleSearch();
  };

  const handleUpdateInventory = () => {
    if (!restockQty || Number(restockQty) < 0) {
      setToastContent('Please enter a valid restock quantity');
      setToastError(true);
      setToastActive(true);
      return;
    }
    if (searchResults.length === 0) {
      setToastContent('No product selected to update');
      setToastError(true);
      setToastActive(true);
      return;
    }

    const updatedResults = searchResults.map(item => ({
      ...item,
      inventory: item.inventory + Number(restockQty),
    }));
    setSearchResults(updatedResults);
    setToastContent('Inventory updated successfully!');
    setToastError(false);
    setToastActive(true);
    setRestockQty('');
  };

  const renderInventoryStatus = (inventory: number) => {
    if (inventory <= 0) {
      return <Badge tone="critical">Out of stock</Badge>;
    } else if (inventory < 5) {
      return <Badge tone="warning">{`Low stock: ${inventory.toString()}`}</Badge>;
    } else {
      return <Badge tone="success">{`In stock: ${inventory.toString()}`}</Badge>;
    }
  };

  // Create a formatted row for each search result
  const rows = searchResults.map((item, index) => [
    String(index + 1), // Convert to string to avoid type errors
    <InlineStack gap="300" align="start" blockAlign="center" key={`product-${item.variantId}`}>
      <Box width="40px">
        <Thumbnail
          source="https://cdn.shopify.com/s/files/1/0757/9955/files/placeholder-image.svg"
          alt={item.title}
          size="small"
        />
      </Box>
      <BlockStack gap="100">
        <Text as="span" variant="bodyMd" fontWeight="bold" truncate>
          {item.title}
        </Text>
        <Text as="span" variant="bodySm" tone="subdued">
          SKU: {item.sku}
        </Text>
      </BlockStack>
    </InlineStack>,
    renderInventoryStatus(item.inventory),
    <InlineStack gap="200" key={`actions-${item.variantId}`}>
      <Button size="slim" onClick={() => {}}>View</Button>
      <Button size="slim" variant="primary" onClick={() => {
        // Pre-fill the restock field with a suggested value (e.g. enough to reach 10 items)
        const suggestedRestock = Math.max(0, 10 - item.inventory);
        setRestockQty(suggestedRestock.toString());
      }}>Restock</Button>
    </InlineStack>
  ]);

  return (
    <Page 
      fullWidth
      title="Quick View and Restock Inventory"
      backAction={{
        content: 'Inventory',
        onAction: () => navigate('/flo/inventory')
      }}
    >
      <BlockStack gap="400">
        <Card>
          <Box padding="400">
            <FormLayout>
              <InlineStack gap="400" wrap blockAlign="center">
                <Box width="300px">
                  <Select
                    label="Location"
                    labelHidden
                    options={locations}
                    value={location}
                    onChange={(value: string) => setLocation(value)}
                  />
                </Box>

                <Box width="300px">
                  <TextField
                    label="SKU"
                    labelHidden
                    value={sku}
                    onChange={(value: string) => setSku(value)}
                    placeholder="Please provide SKU with minimum 3 characters"
                    autoComplete="off"
                  />
                </Box>

                <Button variant="primary" onClick={handleSearch}>
                  Search
                </Button>
              </InlineStack>

              <Box paddingBlockStart="200" paddingBlockEnd="200">
                <Link
                  monochrome
                  url="#"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                >
                  Advanced Search
                </Link>
              </Box>

              {showAdvanced && (
                <Box paddingBlockEnd="200">
                  <Text as="span" variant="headingSm">
                    SKU
                  </Text>
                  <InlineStack gap="400" wrap blockAlign="center">
                    <Box width="180px">
                      <Select
                        label="SKU Condition"
                        labelHidden
                        options={[
                          { label: 'Is equal to', value: 'equal' },
                          { label: 'Contains', value: 'contains' },
                          { label: 'Starts with', value: 'starts' },
                        ]}
                        value={skuCondition}
                        onChange={(value: string) => setSkuCondition(value)}
                      />
                    </Box>

                    <Box width="300px">
                      <TextField
                        label="SKU Input"
                        labelHidden
                        placeholder="Enter SKU"
                        autoComplete="off"
                        value={advancedSku}
                        onChange={(value: string) => setAdvancedSku(value)}
                      />
                    </Box>

                    <Button variant="primary" onClick={handleAdvancedSearch}>Search</Button>
                  </InlineStack>
                </Box>
              )}

              {searchResults.length > 0 && (
                <>
                  <Divider />
                  <Box paddingBlockStart="400">
                    <InlineStack gap="400" blockAlign="center">
                      <Box width="200px">
                        <TextField
                          label="Restock Quantity"
                          value={restockQty}
                          onChange={(value) => setRestockQty(value)}
                          placeholder="Enter quantity"
                          autoComplete="off"
                          type="number"
                          min={0}
                        />
                      </Box>
                      <Box paddingBlockStart="500">
                        <Button variant="primary" onClick={handleUpdateInventory}>
                          Update Inventory
                        </Button>
                      </Box>
                    </InlineStack>
                  </Box>
                  
                  <Box paddingBlockStart="400">
                    <Card padding="0">
                      <DataTable
                        columnContentTypes={['numeric', 'text', 'text', 'text']}
                        headings={['#', 'Product', 'Inventory', 'Actions']}
                        rows={rows}
                        footerContent={`${searchResults.length} items found`}
                        increasedTableDensity
                        showTotalsInFooter={false}
                      />
                    </Card>
                  </Box>
                </>
              )}
            </FormLayout>
          </Box>
        </Card>
      </BlockStack>

      {toastActive && (
        <Toast
          content={toastContent}
          onDismiss={toggleToastActive}
          error={toastError}
        />
      )}
    </Page>
  );
}
