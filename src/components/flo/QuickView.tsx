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
  Divider,
  BlockStack,
  Text,
  DataTable,
  Toast,
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

interface SearchResultItem {
  shopifyId: string;
  variantId: string;
  sku: string;
  title: string;
  inventory: number;
}

function ShopifyInfoTable({
  shopifyId,
  variantId,
  sku,
  title,
}: {
  shopifyId: string;
  variantId: string;
  sku: string;
  title: string;
}) {
  return (
    <Card>
      <Box padding="300">
        <Text variant="headingSm" as="h2">
          {title}
        </Text>
      </Box>
      <Box overflowX="scroll" paddingInline="400" paddingBlockEnd="400">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              { label: 'Shopify ID', value: shopifyId },
              { label: 'Variant ID', value: variantId },
              { label: 'SKU', value: sku },
            ].map(({ label, value }) => (
              <tr key={label} style={{ borderBottom: '1px solid #dfe3e8' }}>
                <td style={{ padding: '8px', width: '120px', fontWeight: 'bold' }}>{label}</td>
                <td style={{ padding: '8px' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Card>
  );
}

export default function QuickView() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>('warehouse1');
  const [sku, setSku] = useState<string>('');
  const [restockQty, setRestockQty] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isBackLinkHovered, setIsBackLinkHovered] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

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

  return (
    <Page fullWidth>
      <Box padding="400">
        <Text variant="headingLg" as="h1">
          Quick View and Restock Inventory
        </Text>
      </Box>

      <Box paddingInlineStart="400" paddingBlockEnd="400">
        <span
          onClick={() => navigate('/flo/inventory')}
          onMouseEnter={() => setIsBackLinkHovered(true)}
          onMouseLeave={() => setIsBackLinkHovered(false)}
          style={{
            display: 'inline-block',
            cursor: 'pointer',
            color: '#0066C0',
            textDecoration: isBackLinkHovered ? 'underline' : 'none',
            fontWeight: 600,
          }}
        >
          ← Back to Inventory
        </span>
      </Box>

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
                        value="equal"
                        onChange={() => { }}
                      />
                    </Box>

                    <Box width="300px">
                      <TextField
                        label="SKU Input"
                        labelHidden
                        placeholder="Enter SKU"
                        autoComplete="off"
                      />
                    </Box>

                    <Button variant="primary">Search</Button>
                  </InlineStack>
                </Box>
              )}

              {searchResults.length > 0 && (
                <>
                  <Divider />
                  <Box paddingBlockStart="400">
                    <InlineStack gap="400" wrap blockAlign="center">
                      <Box width="200px">
                        <TextField
                          label="Restock Quantity"
                          labelHidden
                          value={restockQty}
                          onChange={(value: string) => setRestockQty(value)}
                          placeholder="Enter Restock Quantity"
                          autoComplete="off"
                          type="number"
                          min={0}
                        />
                      </Box>
                      <Button variant="primary" onClick={handleUpdateInventory}>
                        Update
                      </Button>
                    </InlineStack>
                  </Box>
                  <DataTable
                    columnContentTypes={['numeric', 'text', 'numeric', 'text']}
                    headings={['#', 'Item', 'Inventory', 'Action']}
                    rows={searchResults.map((item, index) => [
                      index + 1,
                      <Box key={`item-${item.variantId}`}>
                        <a
                          href="#"
                          style={{
                            color: '#108043',
                            fontWeight: 600,
                            textDecoration: 'none',
                            wordBreak: 'break-word',
                          }}
                        >

                        </a>
                        <ShopifyInfoTable
                          shopifyId={item.shopifyId}
                          variantId={item.variantId}
                          sku={item.sku}
                          title={item.title}
                        />
                      </Box>,
                      item.inventory,
                      <InlineStack
                        gap="400"
                        align="center"
                        blockAlign="center"
                        key={`actions-${item.variantId}`}
                      >
                        <Button
                          size="slim"
                          variant="plain"
                          onClick={() =>
                            window.open(
                              `https://admin.shopify.com/store/YOUR_STORE_NAME/products/${item.shopifyId}`,
                              '_blank',
                            )
                          }
                        >
                          View
                        </Button>
                        <Button
                          size="slim"
                          variant="plain"
                          onClick={() =>
                            window.open(
                              `https://admin.shopify.com/store/YOUR_STORE_NAME/products/${item.shopifyId}/edit`,
                              '_blank',
                            )
                          }
                        >
                          Edit
                        </Button>
                      </InlineStack>,
                    ])}
                    verticalAlign="middle"
                    footerContent={`Total items: ${searchResults.length}`}
                    sortable={[false, false, false, false]}
                  />
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
