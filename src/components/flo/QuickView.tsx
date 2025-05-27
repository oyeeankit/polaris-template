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
  Thumbnail, 
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

// Add this sample image helper function at the top of your component
function getSampleProductImage(productType: string): string {
  // Collection of high-quality sample product images by category
  const sampleImages = {
    shoes: [
      "https://cdn.shopify.com/s/files/1/0533/2089/files/shoes-placeholder.jpg",
      "https://cdn.shopify.com/s/files/1/0533/2089/files/leather-boots-placeholder.jpg",
      "https://cdn.shopify.com/s/files/1/0533/2089/files/sneakers-placeholder.jpg"
    ],
    electronics: [
      "https://cdn.shopify.com/s/files/1/0533/2089/files/monitor-placeholder.jpg",
      "https://cdn.shopify.com/s/files/1/0533/2089/files/laptop-placeholder.jpg",
      "https://cdn.shopify.com/s/files/1/0533/2089/files/headphones-placeholder.jpg"
    ],
    clothing: [
      "https://cdn.shopify.com/s/files/1/0533/2089/files/tshirt-placeholder.jpg",
      "https://cdn.shopify.com/s/files/1/0533/2089/files/jacket-placeholder.jpg",
      "https://cdn.shopify.com/s/files/1/0533/2089/files/dress-placeholder.jpg"
    ],
    default: [
      "https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg",
      "https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg",
      "https://burst.shopifycdn.com/photos/facial-green-clay-mask_373x@2x.jpg",
      "https://burst.shopifycdn.com/photos/blue-t-shirt_373x@2x.jpg",
      "https://burst.shopifycdn.com/photos/wooden-watch-in-box_373x@2x.jpg",
      "https://burst.shopifycdn.com/photos/blue-striped-shirt_373x@2x.jpg",
      "https://burst.shopifycdn.com/photos/coffee-in-white-mug_373x@2x.jpg"
    ]
  };

  // Determine product type from the title or return default
  const title = productType.toLowerCase();
  if (title.includes('shoe') || title.includes('boot') || title.includes('stivali')) {
    return sampleImages.shoes[Math.floor(Math.random() * sampleImages.shoes.length)];
  } else if (title.includes('monitor') || title.includes('samsung') || title.includes('keyboard')) {
    return sampleImages.electronics[Math.floor(Math.random() * sampleImages.electronics.length)];
  } else if (title.includes('shirt') || title.includes('jacket') || title.includes('dress')) {
    return sampleImages.clothing[Math.floor(Math.random() * sampleImages.clothing.length)];
  }
  
  // Default case - random product image
  return sampleImages.default[Math.floor(Math.random() * sampleImages.default.length)];
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
            sku: 'ABC123',
            title: 'Stivali Texani in Camoscio Victoria - EBANO / 39',
            inventory: 0,
            image: "https://burst.shopifycdn.com/photos/leather-boots-with-yellow-laces_373x@2x.jpg",
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

      // Mock data with realistic images
      const mockProducts = [
        {
          shopifyId: '9646363279652',
          variantId: '49865314894116',
          sku: 'ABC123',
          title: 'Stivali Texani in Camoscio Victoria - EBANO / 39',
          inventory: 5,
          image: "https://burst.shopifycdn.com/photos/leather-boots-with-yellow-laces_373x@2x.jpg",
          date: '2025-05-20',
        },
        {
          shopifyId: '8011199873176',
          variantId: '43120834511000',
          sku: 'ABC456',
          title: 'SAMSUNG 32-inch S3 (S39GD) FHD 2025',
          inventory: 10,
          image: "https://burst.shopifycdn.com/photos/widescreen-monitor_373x@2x.jpg",
          date: '2025-05-22',
        },
        {
          shopifyId: '8011199873177',
          variantId: '43120834511001',
          sku: 'ABC789',
          title: 'K380 多工藍牙鍵盤 - 白色',
          inventory: 15,
          image: "https://burst.shopifycdn.com/photos/white-keyboard-top-down_373x@2x.jpg",
          date: '2025-05-19',
        },
        {
          shopifyId: '8011199873178',
          variantId: '43120834511002',
          sku: 'ABC321',
          title: 'Organic Cotton T-Shirt - Blue / XL',
          inventory: 8,
          image: "https://burst.shopifycdn.com/photos/blue-t-shirt_373x@2x.jpg",
          date: '2025-05-18',
        },
        {
          shopifyId: '8011199873179',
          variantId: '43120834511003',
          sku: 'ABC654',
          title: 'Bamboo Water Bottle 750ml',
          inventory: 0,
          image: "https://burst.shopifycdn.com/photos/water-bottle-in-hand_373x@2x.jpg",
          date: '2025-05-17',
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

  // Create a formatted row for each search result with Shopify Admin-like styling
  const rows = searchResults.map((item, index) => [
    // Row number column
    <Box padding="300" key={`num-${item.variantId}`}>
      <div style={{ textAlign: "center" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          {index + 1}
        </Text>
      </div>
    </Box>,
    
    // Product column (unchanged)
    <Box padding="300" key={`product-${item.variantId}`} width="100%">
      <InlineStack gap="400" wrap={false} align="start">
        {/* Enhanced Product thumbnail with better shadow and scaling */}
        <div style={{ 
          width: "70px",
          height: "70px",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid rgba(225, 227, 229, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)",
          position: "relative"
        }}>
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.title}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                objectPosition: "center",
              }} 
              onError={(e) => {
                // More robust fallback for images that fail to load
                console.log(`Image failed to load for ${item.title}, using fallback`);
                const target = e.target as HTMLImageElement;
                // First try category-specific image
                target.src = getSampleProductImage(item.title);
                // If that fails too, set a generic fallback
                target.onerror = () => {
                  target.src = "https://burst.shopifycdn.com/photos/white-box-on-white_373x@2x.jpg";
                  // Prevent infinite error loop
                  target.onerror = null;
                };
              }}
            />
          ) : (
            // For items without images, immediately use the smart fallback system
            <img 
              src={getSampleProductImage(item.title)}
              alt={item.title}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover" 
              }} 
              onError={(e) => {
                // If category matching fails, use a generic product placeholder
                const target = e.target as HTMLImageElement;
                target.src = "https://burst.shopifycdn.com/photos/white-box-on-white_373x@2x.jpg";
                target.onerror = null;
              }}
            />
          )}
        </div>
        
        {/* Product details */}
        <BlockStack gap="100">
          {/* Product title */}
          <Text as="h3" variant="bodyMd" fontWeight="semibold" truncate>
            {item.title}
          </Text>
          
          {/* Product metadata */}
          <InlineStack gap="400" wrap={true}>
            <Text as="span" variant="bodySm" tone="subdued">
              SKU: {item.sku}
            </Text>
            <Text as="span" variant="bodySm" tone="subdued">
              ID: {item.shopifyId}
            </Text>
            {item.date && (
              <Text as="span" variant="bodySm" tone="subdued">
                Updated: {item.date}
              </Text>
            )}
          </InlineStack>
        </BlockStack>
      </InlineStack>
    </Box>,
    
    // Updated inventory column - simple number display
    <Box padding="300" key={`inventory-${item.variantId}`}>
      <div style={{ textAlign: "center" }}>
        <Text 
          as="span" 
          variant="bodyMd"
          tone={item.inventory > 0 ? undefined : "critical"}
          fontWeight="semibold"
        >
          {item.inventory}
        </Text>
      </div>
    </Box>,
    
    // Action buttons matching Shopify's style from the image
    <Box padding="300" key={`actions-${item.variantId}`}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <InlineStack gap="400">
          <Link 
            url={`https://admin.shopify.com/store/your-store/products/${item.shopifyId}`}
            external={true}
            monochrome
          >
            View
          </Link>
          <Link 
            url={`https://admin.shopify.com/store/your-store/products/${item.shopifyId}/edit`}
            external={true}
            monochrome
          >
            Edit
          </Link>
        </InlineStack>
      </div>
    </Box>
  ]);

  // Update your tableStyles to match Shopify Admin
  const tableStyles = `
    /* Global table styling */
    .Polaris-DataTable {
      width: 100% !important;
    }
    
    .Polaris-DataTable__Table {
      width: 100% !important;
      table-layout: fixed !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
    }
    
    /* Column widths */
    .Polaris-DataTable__Cell:nth-child(1),
    .Polaris-DataTable__Cell--header:nth-child(1) {
      width: 40px !important;
      min-width: 40px !important;
      max-width: 40px !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(2),
    .Polaris-DataTable__Cell--header:nth-child(2) {
      width: auto !important;
      min-width: 350px !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(3),
    .Polaris-DataTable__Cell--header:nth-child(3) {
      width: 120px !important;
      min-width: 120px !important;
      text-align: center !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(4),
    .Polaris-DataTable__Cell--header:nth-child(4) {
      width: 120px !important;
      min-width: 120px !important;
      text-align: right !important;
    }
    
    /* Row styling */
    .Polaris-DataTable__Row {
      cursor: pointer !important;
    }
    
    .Polaris-DataTable__Row:hover td {
      background-color: rgba(180, 188, 199, 0.1) !important;
    }
    
    /* Cell styling */
    .Polaris-DataTable__Cell {
      padding: 12px !important;
      border-bottom: 1px solid #E1E3E5 !important;
      background-color: #ffffff !important;
      vertical-align: middle !important;
    }
    
    /* Header styling */
    .Polaris-DataTable__Cell--header {
      padding: 16px 12px !important;
      background-color: #F9FAFB !important;
      border-bottom: 1px solid #C9CCCF !important;
      font-weight: 600 !important;
    }
    
    /* Footer styling */
    .Polaris-DataTable__Footer {
      background-color: #F9FAFB !important;
      padding: 12px !important;
      border-top: 1px solid #E1E3E5 !important;
      font-size: 13px !important;
      color: #637381 !important;
    }
  `;

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
                        borderRadius: '8px',
                        overflow: 'hidden',
                        width: '100%',
                        boxShadow: '0px 1px 3px rgba(63, 63, 68, 0.15)'
                      }}>
                        <DataTable
                          columnContentTypes={['numeric', 'text', 'text', 'text']}
                          headings={[
                            <Text variant="bodySm" as="span" key="col-num" alignment="center">#</Text>,
                            <Text variant="bodySm" as="span" key="col-item" alignment="start">Product</Text>,
                            <Text variant="bodySm" as="span" key="col-inv" alignment="center">Inventory</Text>,
                            <Text variant="bodySm" as="span" key="col-act" alignment="start">Action</Text>
                          ]}
                          rows={rows}
                          footerContent={searchResults.length > 0 ? `${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} found` : ''}
                          verticalAlign="middle"
                          increasedTableDensity={false}
                          hoverable={true}
                        />
                      </div>
                    </Card>
                  </Box>
                </>
              )}
            </FormLayout>
          </Box>
        </Card>
        
        {/* Add bottom spacing div to match Shopify's admin UI */}
        <div style={{ height: '48px' }}></div>
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
