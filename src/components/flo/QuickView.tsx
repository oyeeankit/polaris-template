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
  
  // Add these new states for the SKU selection feature
  const [uniqueSkus, setUniqueSkus] = useState<string[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [showSkuSelection, setShowSkuSelection] = useState<boolean>(false);

  // Toast state
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastError, setToastError] = useState(false);

  // Add this new function to show toast with auto-dismiss
  const showToast = useCallback((content: string, isError: boolean = false) => {
    setToastContent(content);
    setToastError(isError);
    setToastActive(true);
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
          title: 'T TICCI Pickleball Paddles Set of 2, USAPA Approved Fiberglass Pickle Ball Paddles with 4 Pickleballs, Lightweight Rackets for Adults & Kids, Includes Carry Bag & Net Bag for Men, Women, Beginners,',
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
        setShowSkuSelection(false);
        setSelectedSku('');
        setUniqueSkus([]);
      } else if (skuCondition === 'starts') {
        // Get all products that start with the search term
        filteredResults = mockProducts.filter(
          product => product.sku.toUpperCase().startsWith(advancedSku.toUpperCase())
        );
        
        if (filteredResults.length > 0) {
          // Extract unique SKUs from filtered results
          const skus = Array.from(new Set(filteredResults.map(item => item.sku)));
          setUniqueSkus(skus);
          setShowSkuSelection(true);
          setSelectedSku(''); // Reset selection
          
          // Don't show products yet, just SKU options
          setSearchResults([]);
          return;
        }
      }

      if (filteredResults.length > 0) {
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
        showToast('No results found', true);
      }
    }
  };

  // Add handler for SKU selection
  const handleSkuSelect = (value: string) => {
    setSelectedSku(value);
    
    // Enhanced mock  data with more variants for the same SKUs
    const mockProducts = [
      {
        shopifyId: '9646363279652',
        variantId: '49865314894116',
        sku: 'ABC123',
        title: 'T TICCI Pickleball Paddles Set of 2, USAPA Approved Fiberglass Pickle Ball Paddles',
        inventory: 5,
        image: "https://burst.shopifycdn.com/photos/leather-boots-with-yellow-laces_373x@2x.jpg",
        date: '2025-05-20',
      },
      {
        shopifyId: '9646363279653',
        variantId: '49865314894117',
        sku: 'ABC123',
        title: 'T TICCI Pickleball Paddles Set - Blue/Green Variant',
        inventory: 3,
        image: "https://burst.shopifycdn.com/photos/tennis-racket-on-court_373x@2x.jpg",
        date: '2025-05-20',
      },
      {
        shopifyId: '9646363279654',
        variantId: '49865314894118',
        sku: 'ABC123',
        title: 'T TICCI Pickleball Paddles - Professional Edition',
        inventory: 0,
        image: "https://burst.shopifycdn.com/photos/tennis-ball-on-court_373x@2x.jpg",
        date: '2025-05-21',
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
        shopifyId: '8011199873182',
        variantId: '43120834511006',
        sku: 'ABC456',
        title: 'SAMSUNG 32-inch S3 (S39GD) FHD 2025 - Black',
        inventory: 7,
        image: "https://burst.shopifycdn.com/photos/black-framed-tv-screen_373x@2x.jpg",
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
        shopifyId: '8011199873190',
        variantId: '43120834511014',
        sku: 'ABC789',
        title: 'K380 多工藍牙鍵盤 - 黑色',
        inventory: 8,
        image: "https://burst.shopifycdn.com/photos/workspace-with-keyboard_373x@2x.jpg",
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
      },
      {
        shopifyId: '8011199873180',
        variantId: '43120834511004',
        sku: 'ABC654',
        title: 'Bamboo Water Bottle 500ml',
        inventory: 12,
        image: "https://burst.shopifycdn.com/photos/glass-water-bottle_373x@2x.jpg",
        date: '2025-05-17',
      }
    ];

    // Filter products to get only the ones with exact matching SKU
    const exactMatches = mockProducts.filter(product => product.sku === value);
    
    if (exactMatches.length > 0) {
      setSearchResults(exactMatches);
      showToast(`Found ${exactMatches.length} product${exactMatches.length > 1 ? 's' : ''} with SKU: ${value}`, false);
    } else {
      setSearchResults([]);
      showToast('No results found for the selected SKU', true);
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

    // Convert to number for calculation
    const newQuantity = Number(restockQty);
    
    // Allow negative inventory (if user specifically enters a negative value)
    const updatedResults = searchResults.map(item => {
      return {
        ...item,
        inventory: newQuantity, // Set inventory directly to the entered value
      };
    });
    
    setSearchResults(updatedResults);
    
    // Update toast message to reflect the action
    showToast(`Set inventory to ${newQuantity}`, false);
    
    setRestockQty(''); // Clear the input field after update
  };

  // Create a formatted row for each search result with Shopify Admin-like styling
  const rows = searchResults.map((item, index) => [
    // Row number column
    <Box padding="300" key={`num-${item.variantId}`}>
      <Text as="span" variant="bodySm" tone="subdued">
        {index + 1}
      </Text>
    </Box>,
    
    // Product column (without image)
    <Box padding="300" key={`product-${item.variantId}`} width="100%">
      <BlockStack gap="200">
        {/* Product title with responsive styling - no truncation on desktop */}
        <div style={{ 
          width: "100%", 
          position: "relative",
          overflow: "hidden",
          display: "block",
          whiteSpace: "normal" // Allows text to wrap naturally
        }}>
          <Link
            url={`https://admin.shopify.com/store/your-store/products/${item.shopifyId}`}
            external={true}
            removeUnderline
            monochrome
          >
            <span style={{ color: "#202223" }}>
              <Text as="h3" variant="bodyMd" fontWeight="semibold">
                {/* No truncation - let text wrap naturally */}
                {item.title}
              </Text>
            </span>
          </Link>
        </div>
        
        {/* Product metadata - made more responsive */}
        <InlineStack gap="200" wrap={true}>
          <Text as="span" variant="bodySm" tone="subdued">
            SKU: {item.sku}
          </Text>
          {/* Only show IDs on larger screens */}
          <Text as="span" variant="bodySm" tone="subdued" visuallyHidden>
            ID: {item.shopifyId.substring(0, 8)}...
          </Text>
        </InlineStack>
      </BlockStack>
    </Box>,
    
    // Updated inventory column - matching Shopify admin's stock level formatting
    <Box padding="300" paddingInlineStart="400" key={`inventory-${item.variantId}`}>
      {item.inventory <= 9 ? (
        <Text as="span" variant="bodySm" tone="critical">
          {item.inventory} in stock
        </Text>
      ) : (
        <Text as="span" variant="bodySm">
          {item.inventory} in stock
        </Text>
      )}
    </Box>,
    
    // Action buttons matching Shopify's style
    <Box padding="300" key={`actions-${item.variantId}`}>
      <div className="action-links" style={{ justifyContent: "flex-end", textAlign: "right" }}>
        <Link 
          url={`https://admin.shopify.com/store/your-store/products/${item.shopifyId}`}
          external={true}
          monochrome
        >
          View
        </Link>
        <div style={{ width: "16px" }}></div>
        <Link 
          url={`https://admin.shopify.com/store/your-store/products/${item.shopifyId}/edit`}
          external={true}
          monochrome
        >
          Edit
        </Link>
      </div>
    </Box>
  ]);

  // Replace the tableStyles with this more responsive version:
  const tableStyles = `
    /* Global table styling - closer to Polaris defaults */
    .Polaris-DataTable {
      width: 100% !important;
      border-radius: 8px !important;
      overflow-x: auto !important;
    }
    
    .Polaris-DataTable__Table {
      width: 100% !important;
      table-layout: auto !important;
    }
    
    /* Column widths - more responsive with consistent text alignment */
    .Polaris-DataTable__Cell:nth-child(1),
    .Polaris-DataTable__Cell--header:nth-child(1) {
      width: 40px !important;
      min-width: 40px !important;
      max-width: 40px !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(2),
    .Polaris-DataTable__Cell--header:nth-child(2) {
      width: auto !important;
      min-width: 200px !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(3),
    .Polaris-DataTable__Cell--header:nth-child(3) {
      width: 100px !important;
      min-width: 80px !important;
    }
    
    .Polaris-DataTable__Cell:nth-child(4),
    .Polaris-DataTable__Cell--header:nth-child(4) {
      width: 120px !important;
      min-width: 120px !important;
      text-align: right !important;
    }
    
    /* Make action links display properly but maintain left alignment */
    .action-links {
      display: flex;
      justify-content: flex-start;
      white-space: nowrap;
    }
    
    /* Mobile adjustments */
    @media screen and (max-width: 500px) {
      .action-links {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .Polaris-DataTable__Cell,
      .Polaris-DataTable__Cell--header {
        padding: 8px !important;
      }
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
      <BlockStack gap="500">
        <Card>
          <Box padding="400">
            <FormLayout>
              <InlineStack gap="400" wrap blockAlign="center">
                <Box minWidth="180px" maxWidth="300px" width="100%">
                  <Select
                    label="Location"
                    labelHidden
                    options={locations}
                    value={location}
                    onChange={(value: string) => setLocation(value)}
                    disabled={showAdvanced}
                  />
                </Box>

                <Box minWidth="180px" maxWidth="300px" width="100%">
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
                  <Text as="h2" variant="headingSm" fontWeight="semibold">
                    SKU
                  </Text>
                  <Box paddingBlockStart="300">
                    <InlineStack gap="400" wrap blockAlign="start">
                      <Box minWidth="150px" maxWidth="180px" width="100%">
                        <Select
                          label="SKU Condition"
                          labelHidden
                          options={[
                            { label: 'Is equal to', value: 'equal' },
                            { label: 'Starts with', value: 'starts' },
                          ]}
                          value={skuCondition}
                          onChange={(value: string) => {
                            setSkuCondition(value);
                            setSelectedSku('');
                            setShowSkuSelection(false);
                            setSearchResults([]);
                          }}
                        />
                      </Box>

                      <Box minWidth="180px" maxWidth="300px" width="100%">
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
                  
                  {/* SKU Selection dropdown - show only when we have results and using "starts with" search */}
                  {showSkuSelection && uniqueSkus.length > 0 && (
                    <Box paddingBlockStart="400">
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" fontWeight="semibold">
                          {uniqueSkus.length} matching SKUs found - please select one:
                        </Text>
                        <InlineStack gap="400" wrap blockAlign="center">
                          <Box minWidth="200px" maxWidth="300px" width="100%">
                            <Select
                              label="Select SKU"
                              labelHidden
                              options={uniqueSkus.map(sku => ({ label: sku, value: sku }))}
                              value={selectedSku}
                              onChange={handleSkuSelect}
                              placeholder="Select a SKU"
                            />
                          </Box>
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  )}
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
                    <InlineStack gap="400" blockAlign="end" wrap={true}>
                      <Box minWidth="150px" maxWidth="200px" width="100%">
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
                          variant="primary"
                        >
                          Update Inventory
                        </Button>
                      </Box>
                    </InlineStack>
                  </Box>
                  
                  <Box paddingBlockStart="400">
                    <div style={{ 
                      borderRadius: '6px',
                      overflow: 'hidden',
                      width: '100%'
                    }}>
                      <div style={{
      overflowX: 'auto',
      width: '100%',
      WebkitOverflowScrolling: 'touch' // For smooth scrolling on iOS
    }}>
                          <style>{tableStyles}</style>
                          <DataTable
                            columnContentTypes={['numeric', 'text', 'text', 'text']}
                            headings={[
                              <Text variant="bodyMd" fontWeight="semibold" as="span" key="col-num" alignment="start">#</Text>,
                              <Text variant="bodyMd" fontWeight="semibold" as="span" key="col-item" alignment="start">Product</Text>,
                              <Text variant="bodyMd" fontWeight="semibold" as="span" key="col-inv" alignment="start">Inventory</Text>,
                              <Text variant="bodyMd" fontWeight="semibold" as="span" key="col-act" alignment="start">Action</Text>
                            ]}
                            rows={rows}
                            footerContent={searchResults.length > 0 ? `${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} found` : ''}
                            verticalAlign="middle"
                            increasedTableDensity={false}
                            hoverable={true}
                          />
                        </div>
                      </div>
                    </Box>
                </>
              )}
            </FormLayout>
          </Box>
        </Card>
        
        {/* Using Polaris Box with standard token instead of arbitrary pixel height */}
        <Box paddingBlockEnd="600">
          {/* This provides the standard 24px bottom spacing */}
        </Box>
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
