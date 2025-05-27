// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useCallback } from 'react';
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
  ButtonGroup,
  Thumbnail, // Add this import for product images
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

interface SearchResultItem {
  shopifyId: string;
  variantId: string;
  sku: string;
  title: string;
  inventory: number;
  image?: string; // Add image URL property
  date?: string; // Add date property
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

  // Add this new function to show toast with auto-dismiss
  const showToast = useCallback((content: string, isError: boolean = false) => {
    setToastContent(content);
    setToastError(isError);
    setToastActive(true);
    
    // Auto-dismiss after 3 seconds (3000ms)
    const timer = setTimeout(() => {
      setToastActive(false);
    }, 3000);
    
    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

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
        showToast('Enter SKU with minimum 3 characters', true);
        return;
      }

      if (location === 'warehouse1' && sku.toUpperCase() === 'ABC') {
        setSearchResults([
          {
            shopifyId: '9646363279652',
            variantId: '49865314894116',
            sku: '_CAMOSCIO_EBANO_374_ROT_NOCE+NERO39',
            title: 'Stivali Texani in Camoscio Stivali Texani Stivali Texani in Camoscio Stivali Texani in Camosc Victoria  tivali Texani in Camoscio Victoria- EBANO / 39',
            inventory: 0,
            image: 'https://cdn.shopify.com/s/files/1/0012/3456/7894/products/shoe-sample.jpg',
            date: '2025-05-20',
          },
        ]);
      } else {
        setSearchResults([]);
        showToast('No results found', true);
      }
    } else {
      // Advanced search
      if (advancedSku.length < 3) {
        setSearchResults([]);
        showToast('Please provide SKU with minimum 3 characters', true);
        return;
      }

      // Mock data with added image and date properties
      const mockProducts = [
        {
          shopifyId: '9646363279652',
          variantId: '49865314894116',
          sku: 'M302_CAMOSCIO_EBANO_374_ROT_NOCE+NERO39',
          title: 'Stivali Texani Stivali Texani in Camoscio Victoria - EBANO / 39 in Camoscio Victoria - EBANO / 39',
          inventory: 5,
          image: 'https://cdn.shopify.com/s/files/1/0012/3456/7894/products/shoe-sample.jpg',
          date: '2025-05-20',
        },
        {
          shopifyId: '8011199873176',
          variantId: '43120834511000',
          sku: 'ABC456',
          title: 'MSAMSUNG 32-inch S3 (S39GD) FHD 2025',
          inventory: 10,
          image: 'https://cdn.shopify.com/s/files/1/0012/3456/7894/products/monitor.jpg',
          date: '2025-05-22',
        },
        {
          shopifyId: '8011199873177',
          variantId: '43120834511001',
          sku: 'XYZ123',
          title: 'K380 多工藍牙鍵盤 - 白色',
          inventory: 15,
          image: 'https://cdn.shopify.com/s/files/1/0012/3456/7894/products/keyboard.jpg',
          date: '2025-05-19',
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
        showToast('No results found', true);
      }
    }
  };

  const handleAdvancedSearch = () => {
    handleSearch();
  };

  const handleUpdateInventory = () => {
    if (!restockQty || isNaN(Number(restockQty))) {
      showToast('Enter a valid quantity', true);
      return;
    }
    
    if (searchResults.length === 0) {
      showToast('No product selected', true);
      return;
    }

    // Convert to number once for reuse
    const newQuantity = Number(restockQty);

    const updatedResults = searchResults.map(item => {
      // Set inventory directly to the value entered by the user
      return {
        ...item,
        inventory: newQuantity,
      };
    });
    
    setSearchResults(updatedResults);
    
    // Update the toast message to reflect direct replacement
    showToast(`Inventory updated to ${newQuantity}`, false);
    
    setRestockQty(''); // Clear the input field after update
  };

  // Create a formatted row for each search result
  const rows = searchResults.map((item, index) => [
    // Row number column
    <Box padding="300" key={`num-${item.variantId}`}>
      <div style={{ 
        paddingTop: "8px",
        textAlign: "center"
      }}>
        <Text as="span" variant="bodyMd" fontWeight="medium">
          {index + 1}
        </Text>
      </div>
    </Box>,
    
    // Product column with proper structured display to match image
    <Box padding="300" key={`product-${item.variantId}`} width="100%">
      <Card padding="300">
        <BlockStack gap="100">
          {/* Product title with blue highlight and improved wrapping */}
          <div style={{ 
            fontWeight: "500", 
            fontSize: "16px",
            color: "#2C6ECB",
            marginBottom: "8px",
            wordBreak: "break-word", // Allow wrapping for long titles
            lineHeight: "1.4", // Improve line height for wrapped text
            maxHeight: "none", // Remove any max height that might be causing truncation
            overflow: "visible", // Ensure content isn't hidden
            whiteSpace: "normal", // Allow text to wrap normally
            display: "block" // Make sure it's displayed as a block
          }}>
            {item.title}
          </div>
          
          {/* Product details in table-like format as shown in the image */}
          <div style={{ 
            display: "table",
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
            tableLayout: "fixed" // Force table to respect column widths
          }}>
            {/* Shopify ID row */}
            <div style={{ display: "table-row" }}>
              <div style={{ 
                display: "table-cell", 
                padding: "4px 8px 4px 0", 
                whiteSpace: "nowrap",
                width: "80px",
                color: "#6D7175",
                verticalAlign: "top"
              }}>
                Shopify ID
              </div>
              <div style={{ 
                display: "table-cell", 
                padding: "4px 0", 
                color: "#202223",
                fontWeight: "normal",
                wordBreak: "break-all" // Allow wrapping for long IDs
              }}>
                {item.shopifyId}
              </div>
            </div>
            
            {/* Variant ID row */}
            <div style={{ display: "table-row" }}>
              <div style={{ 
                display: "table-cell", 
                padding: "4px 8px 4px 0", 
                whiteSpace: "nowrap",
                color: "#6D7175",
                verticalAlign: "top"
              }}>
                Variant ID
              </div>
              <div style={{ 
                display: "table-cell", 
                padding: "4px 0", 
                color: "#202223",
                fontWeight: "normal",
                wordBreak: "break-all" // Allow wrapping for long IDs
              }}>
                {item.variantId}
              </div>
            </div>
            
            {/* SKU row */}
            <div style={{ display: "table-row" }}>
              <div style={{ 
                display: "table-cell", 
                padding: "4px 8px 4px 0", 
                whiteSpace: "nowrap",
                width: "80px",
                color: "#6D7175",
                verticalAlign: "top"
              }}>
                SKU
              </div>
              <div style={{ 
                display: "table-cell", 
                padding: "4px 0", 
                color: "#202223",
                fontWeight: "normal",
                wordBreak: "break-all", // Allow SKUs to wrap if very long
                whiteSpace: "normal", // Allow text to wrap naturally
                maxHeight: "none", // Remove any height limitation
                overflow: "visible", // Ensure content isn't hidden
                lineHeight: "1.4" // Improve readability of wrapped text
              }}>
                {item.sku}
              </div>
            </div>
          </div>
        </BlockStack>
      </Card>
    </Box>,
    
    // Inventory column
    <Box padding="300" key={`inventory-${item.variantId}`}>
      <div style={{ 
        textAlign: "center",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "8px"
      }}>
        <Text as="span" variant="bodyMd" fontWeight="medium">
          {item.inventory.toString()}
        </Text>
      </div>
    </Box>,
    
    // Action buttons
    <Box padding="300" key={`actions-${item.variantId}`}>
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100%",
        paddingTop: "8px"
      }}>
        <ButtonGroup variant="segmented">
          <Button 
            size="slim"
            onClick={() => {
              window.open(`https://admin.shopify.com/store/your-store/products/${item.shopifyId}`, '_blank');
            }}
          >
            View
          </Button>
          <Button 
            size="slim"
            onClick={() => {
              window.open(`https://admin.shopify.com/store/your-store/products/${item.shopifyId}/edit`, '_blank');
            }}
          >
            Edit
          </Button>
        </ButtonGroup>
      </div>
    </Box>
  ]);

  // Update your tableStyles with fixed widths for columns
  const tableStyles = `
    /* Force full-width table */
    .Polaris-DataTable {
      width: 100% !important;
    }
    
    .Polaris-DataTable__Table {
      width: 100% !important;
      table-layout: fixed !important;
      border-collapse: collapse !important;
      border-spacing: 0 !important;
    }
    
    /* Fixed column widths */
    .Polaris-DataTable__Cell:nth-child(1),
    .Polaris-DataTable__Cell--header:nth-child(1) {
      width: 50px !important;
      min-width: 50px !important;
      max-width: 50px !important;
      padding-right: 0 !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(2),
    .Polaris-DataTable__Cell--header:nth-child(2) {
      width: calc(100% - 240px) !important;
      min-width: 350px !important;
      padding-right: 8px !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(3),
    .Polaris-DataTable__Cell--header:nth-child(3) {
      width: 80px !important;
      min-width: 80px !important;
      max-width: 80px !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      text-align: center !important;
      vertical-align: middle !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(4),
    .Polaris-DataTable__Cell--header:nth-child(4) {
      width: 110px !important;
      min-width: 110px !important;
      max-width: 110px !important;
      padding-left: 0 !important;
      text-align: center !important;
    }
    
    /* Consistent cell height for better layout with images */
    .Polaris-DataTable__Cell {
      border: none !important;
      border-bottom: 1px solid #E1E3E5 !important;
      vertical-align: middle !important;
      height: 120px !important; /* Increased height to accommodate image cards */
    }
    
    /* Special styling for header cells */
    .Polaris-DataTable__Cell--header {
      border-bottom: 2px solid #E1E3E5 !important;
      background-color: #F9FAFB;
      height: auto !important;
    }
    
    /* Improve card display */
    .Polaris-Card {
      box-shadow: none !important;
      height: 100% !important;
    }
  `;

  return (
    <Page 
      // Remove the fullWidth prop to match other pages
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
                    disabled={showAdvanced}
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
                    disabled={showAdvanced}
                  />
                </Box>

                <Button 
                  onClick={handleSearch}
                  disabled={showAdvanced}
                >
                  Search
                </Button>
              </InlineStack>

              <Box paddingBlockStart="200" paddingBlockEnd="200">
                <InlineStack gap="400" blockAlign="center" wrap>
                  <Link
                    monochrome
                    url="#"
                    onClick={() => {
                      // Clear results when toggling between search modes
                      setSearchResults([]);
                      setShowAdvanced((prev) => !prev);
                    }}
                  >
                    {showAdvanced ? "Basic Search" : "Advanced Search"}
                  </Link>
                </InlineStack>
              </Box>

              {showAdvanced && (
                <Box paddingBlockEnd="200">
                  {/* Use consistent heading style */}
                  <Text as="h2" variant="headingSm" fontWeight="semibold">
                    SKU
                  </Text>
                  <Box paddingBlockStart="300">
                    <InlineStack gap="400" wrap blockAlign="start">
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

                      <Button onClick={handleAdvancedSearch}>Search</Button>
                    </InlineStack>
                  </Box>
                </Box>
              )}

              {searchResults.length > 0 && (
                <>
                  <Divider />
                  <Box paddingBlockStart="400">
                    {/* Add heading to match SKU style */}
                    <Box paddingBlockEnd="300">
                      <Text as="h2" variant="headingSm" fontWeight="semibold">
                        Restock Inventory
                      </Text>
                    </Box>
                    <InlineStack gap="400" blockAlign="end" wrap={false}>
                      <Box width="200px">
                        <TextField
                          label="Quantity" 
                          value={restockQty}
                          onChange={(value) => setRestockQty(value)}
                          placeholder="Enter quantity"
                          autoComplete="off"
                          type="number"
                        />
                      </Box>
                      <Box>
                        <Button
                          onClick={handleUpdateInventory}
                        >
                          Update Inventory
                        </Button>
                      </Box>
                    </InlineStack>
                  </Box>
                  
                  <Box paddingBlockStart="400">
                    <Card padding="0">
                      <style>{tableStyles}</style>
                      <div style={{ 
                        border: '1px solid #DFE3E8',
                        borderRadius: '8px',
                        overflow: 'hidden' 
                      }}>
                        <DataTable
                          columnContentTypes={['numeric', 'text', 'numeric', 'text']}
                          headings={[
                            <Text variant="headingSm" fontWeight="bold" as="span" key="col-num" alignment="center">#</Text>,
                            <Text variant="headingSm" fontWeight="bold" as="span" key="col-item">Item</Text>,
                            <Text variant="headingSm" fontWeight="bold" as="span" key="col-inv" alignment="center">Inventory</Text>,
                            <Text variant="headingSm" fontWeight="bold" as="span" key="col-act" alignment="center">Action</Text>
                          ]}
                          rows={rows}
                          footerContent={searchResults.length > 0 ? `${searchResults.length} item${searchResults.length !== 1 ? 's' : ''} found` : ''}
                          verticalAlign="top"
                          increasedTableDensity={false}
                        />
                      </div>
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
          error={toastError}
          onDismiss={() => setToastActive(false)}
          duration={3000}
        />
      )}
    </Page>
  );
}
