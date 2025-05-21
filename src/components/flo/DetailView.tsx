import React, { useState, useEffect, useCallback } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Select,
  TextContainer,
  Box,
  Link,
  ProgressBar,
  DataTable,
  Spinner,
  TextField,
  InlineGrid,
  Toast
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import { RefreshIcon } from '@shopify/polaris-icons';

interface AnalysisResult {
  sku: string;
  title: string;
  stock: number;
}

interface SkuLocation {
  mumbai: number | string;
  uniqueSpareWarehouse: number | string;
}

interface SkuItem {
  id: number;
  title: string;
  variantId: string;
  locations: SkuLocation;
}

interface SkuGroup {
  id: number;
  sku: string;
  items: SkuItem[];
}

export default function AnalyzeProductsPage() {
  const [selectedSkuOption, setSelectedSkuOption] = useState('all');
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [variantsScanned, setVariantsScanned] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [totalVariants, setTotalVariants] = useState(300); // Mock total count
  const [duplicateFilterType, setDuplicateFilterType] = useState('all');
  const [searchSku, setSearchSku] = useState('');
  const [filteredSkus, setFilteredSkus] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add new state for tracking inventory updates
  const [inventoryUpdates, setInventoryUpdates] = useState<{[key: string]: {[location: string]: string}}>({});
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const simulateAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setVariantsScanned(0);
    setAnalysisResults([]);

    // Mock data for the analysis results
    const mockResults: AnalysisResult[] = [
      { sku: 'ABC123', title: 'T-Shirt - Blue (Small)', stock: 15 },
      { sku: 'ABC124', title: 'T-Shirt - Blue (Medium)', stock: 8 },
      { sku: 'ABC125', title: 'T-Shirt - Blue (Large)', stock: 23 },
      { sku: 'DEF456', title: 'Denim Jeans (32x32)', stock: 5 },
      { sku: 'GHI789', title: 'Baseball Cap', stock: 42 },
      { sku: 'JKL012', title: 'Wool Sweater (Medium)', stock: 0 },
    ];

    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 5) + 1;
      if (count >= totalVariants) {
        count = totalVariants;
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisResults(mockResults);
        }, 500);
      }
      setVariantsScanned(count);
    }, 100);

    return () => clearInterval(interval);
  }, [totalVariants]);

  const handleAnalyze = () => {
    simulateAnalysis();
  };

  const options = [
    { label: 'All SKUs', value: 'all' },
    { label: 'Active SKUs only', value: 'active' },
  ];

  // Add mock duplicate SKU data
  const duplicateSkuData = [
    {
      id: 1,
      sku: '24-6300',
      items: [
        {
          id: 1,
          title: 'AFH swan neck ring splint, stainless steel',
          variantId: '39424166953037',
          locations: {
            mumbai: 100,
            uniqueSpareWarehouse: 'NA'
          }
        },
        {
          id: 2,
          title: 'AFH swan neck ring splint, stainless steel',
          variantId: '39424166953037',
          locations: {
            mumbai: 100,
            uniqueSpareWarehouse: 'NA'
          }
        }
      ]
    },
    {
      id: 2,
      sku: 'ABC-123',
      items: [
        {
          id: 1,
          title: 'Product with inventory mismatch',
          variantId: '39424166953038',
          locations: {
            mumbai: 20,
            uniqueSpareWarehouse: 50
          }
        },
        {
          id: 2,
          title: 'Product with inventory mismatch',
          variantId: '39424166953038',
          locations: {
            mumbai: 25,
            uniqueSpareWarehouse: 45
          }
        }
      ]
    }
  ];

  // Handle filter change in the dropdown
  const handleFilterChange = useCallback((value: string) => {
    setDuplicateFilterType(value);
    setSearchSku('');
    
    if (value === 'all') {
      setFilteredSkus(duplicateSkuData);
    } else if (value === 'mismatch') {
      // Filter to only show SKUs with inventory mismatches between locations
      const mismatchSkus = duplicateSkuData.filter(skuGroup => {
        // Check if any items in the group have different inventory values across locations
        return skuGroup.items.some((item, idx) => {
          if (idx === 0) return false; // Skip first item (need at least one to compare)
          const firstItem = skuGroup.items[0];
          return (
            item.locations.mumbai !== firstItem.locations.mumbai || 
            item.locations.uniqueSpareWarehouse !== firstItem.locations.uniqueSpareWarehouse
          );
        });
      });
      setFilteredSkus(mismatchSkus);
    }
  }, [duplicateSkuData]);

  // Handle SKU search
  const handleSearch = useCallback(() => {
    setIsSearching(true);
    
    if (searchSku.trim() === '') {
      handleFilterChange(duplicateFilterType);
    } else {
      const results = duplicateSkuData.filter(skuGroup => 
        skuGroup.sku.toLowerCase().includes(searchSku.toLowerCase())
      );
      setFilteredSkus(results);
    }
    
    setIsSearching(false);
  }, [searchSku, duplicateFilterType, handleFilterChange, duplicateSkuData]);

  // Initialize filtered SKUs on component mount
  useEffect(() => {
    setFilteredSkus(duplicateSkuData);
  }, []);

  // Handle inventory field changes
  const handleInventoryChange = useCallback((skuId: number, location: string, value: string) => {
    setInventoryUpdates(prev => ({
      ...prev,
      [skuId]: {
        ...(prev[skuId] || {}),
        [location]: value
      }
    }));
  }, []);
  
  // Handle update button click
  const handleUpdateInventory = useCallback((skuGroup: any) => {
    const updates = inventoryUpdates[skuGroup.id];
    if (!updates) return;
    
    // Update the filtered SKUs with new inventory values
    const updatedSkus = filteredSkus.map(group => {
      if (group.id !== skuGroup.id) return group;
      
      // Create a deep copy of the group to modify
      const updatedGroup = {...group};
      
      // Update locations in all items
      updatedGroup.items = group.items.map((item: any) => {
        const updatedItem = {...item};
        updatedItem.locations = {...item.locations};
        
        // Apply updates for each location
        if (updates.mumbai && updates.mumbai.trim() !== '') {
          updatedItem.locations.mumbai = parseInt(updates.mumbai, 10) || 0;
        }
        
        if (updates.uniqueSpareWarehouse && updates.uniqueSpareWarehouse.trim() !== '') {
          updatedItem.locations.uniqueSpareWarehouse = updates.uniqueSpareWarehouse === 'NA' ? 
            'NA' : (parseInt(updates.uniqueSpareWarehouse, 10) || 0);
        }
        
        return updatedItem;
      });
      
      return updatedGroup;
    });
    
    // Update state and clear the input fields for this SKU
    setFilteredSkus(updatedSkus);
    setInventoryUpdates(prev => {
      const newUpdates = {...prev};
      delete newUpdates[skuGroup.id];
      return newUpdates;
    });
    
    setToastMessage(`Updated inventory for SKU: ${skuGroup.sku}`);
    setToastActive(true);
  }, [filteredSkus, inventoryUpdates]);

  // Add function to export filtered SKUs to CSV
  const exportToCSV = useCallback(() => {
    if (filteredSkus.length === 0) {
      setToastMessage('No data to export');
      setToastActive(true);
      return;
    }

    // Create CSV header row
    let csvContent = 'SKU,Item Title,Variant ID,Mumbai Location,Unique Spare Warehouse\n';

    // Add data rows
    filteredSkus.forEach((skuGroup: SkuGroup) => {
      skuGroup.items.forEach((item: SkuItem) => {
        const row = [
          `"${skuGroup.sku}"`,
          `"${item.title}"`,
          `"${item.variantId}"`,
          `"${item.locations.mumbai}"`,
          `"${item.locations.uniqueSpareWarehouse}"`
        ].join(',');
        csvContent += row + '\n';
      });
    });

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set file name with current date
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `duplicate-skus-${date}.csv`);
    link.style.visibility = 'hidden';
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToastMessage('Export complete');
    setToastActive(true);
  }, [filteredSkus]);

  return (
    <Page
      title="Detailed View"
      backAction={{
        content: 'Back to Inventory',
        onAction: () => navigate('/flo/inventory')
      }}
    >
      {/* Info Box */}
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="400">
              <TextContainer>
                <Box
                  as="div"
                  padding="0"
                >
                  <Text as="p" variant="bodyMd">
                    Analyze all products. Detect duplicate SKUs. Verify and correct stock mismatch.
                  </Text>
                  <Link url="#">Know More</Link>
                </Box>
              </TextContainer>
            </Box>
          </Card>
        </Layout.Section>

        {/* Analyzer */}
        <Layout.Section>
          <Card>
            <Box padding="400">
              <Text as="h3" variant="headingSm">
                1. Analyze Products
              </Text>

              <Box paddingBlockStart="400">
                <Select
                  label="Select SKU Scope"
                  options={options}
                  onChange={setSelectedSkuOption}
                  value={selectedSkuOption}
                  disabled={isAnalyzing}
                />
              </Box>

              <Box paddingBlockStart="400">
                <Button
                  onClick={handleAnalyze}
                  variant="primary"
                  disabled={isAnalyzing}
                >
                  Analyze Now
                </Button>
              </Box>

              {isAnalyzing && (
                <Box paddingBlockStart="400">
                  <Box
                    as="div"
                    paddingBlockEnd="300"


                  >
                    <Box paddingInlineEnd="200">
                      <Spinner size="small" />
                    </Box>
                    <Text variant="bodySm" as="p">
                      <b>{variantsScanned}</b> Variants scanned
                    </Text>
                  </Box>
                  <ProgressBar
                    progress={Math.floor((variantsScanned / totalVariants) * 100)}
                    size="small"
                  />
                </Box>
              )}
            </Box>
          </Card>
        </Layout.Section>

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <Layout.Section>
            <Card>
              <Box padding="400">
                <Text as="h3" variant="headingSm" fontWeight="bold">
                  2. View Duplicates and Update Inventory
                </Text>
                
                <Box paddingBlockStart="400">
                  <InlineGrid columns={{ xs: 1, md: '1fr 1fr auto auto' }} gap="400" alignItems="start">
                    <Select
                      label="Filter"
                      labelHidden
                      options={[
                        { label: 'Show all duplicate SKUs', value: 'all' },
                        { label: 'Show duplicate SKUs with mismatch inventory', value: 'mismatch' }
                      ]}
                      value={duplicateFilterType}
                      onChange={handleFilterChange}
                    />
                    
                    <TextField
                      label="Search SKU"
                      labelHidden
                      placeholder="Provide SKU"
                      autoComplete="off"
                      value={searchSku}
                      onChange={setSearchSku}
                    />
                    
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                    
                    <div style={{ marginLeft: 'auto' }}>
                      <Button variant="primary" onClick={exportToCSV}>Export</Button>
                    </div>
                  </InlineGrid>
                </Box>
                
                <Box paddingBlockStart="500">
                  {filteredSkus.length > 0 ? (
                    <DataTable
                      columnContentTypes={['text', 'text', 'text']}
                      headings={['#', 'Duplicate SKU Chart', 'Action']}
                      rows={filteredSkus.map((skuGroup, index) => {
                        // Create a cell component for the action column that positions the button at the bottom
                        const actionCell = (
                          <Box paddingBlockStart="400">
                            <Button
                              key={`action-update-${skuGroup.id}`}
                              variant="primary"
                              onClick={() => handleUpdateInventory(skuGroup)}
                              disabled={!inventoryUpdates[skuGroup.id]}
                            >
                              Update
                            </Button>
                          </Box>
                        );
                        
                        return [
                          (index + 1).toString(),
                          <Box key={`sku-chart-${skuGroup.id}`} padding="0">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <Text as="span" fontWeight="bold">{skuGroup.sku}</Text>
                              <Button size="slim">Refresh Chart</Button>
                            </div>
                            
                            <Box paddingBlockStart="400">
                              <DataTable
                                columnContentTypes={['text', 'text', 'text', 'text']}
                                headings={['#', 'Items', 'mumbai', 'Unique Spare Warehouse']}
                                rows={[
                                  ...skuGroup.items.map((item: any, itemIndex: number) => [
                                    (itemIndex + 1).toString(),
                                    <div key={`item-${item.id}`}>
                                      <Text as="span">{item.title}</Text>
                                      <div><Text as="span" tone="subdued" variant="bodySm">Variant ID - {item.variantId}</Text></div>
                                    </div>,
                                    item.locations.mumbai.toString(),
                                    item.locations.uniqueSpareWarehouse.toString()
                                  ]),
                                  [
                                    '',
                                    '',
                                    <TextField
                                      key={`qty1-${skuGroup.id}`}
                                      value={inventoryUpdates[skuGroup.id]?.mumbai || ''}
                                      placeholder="0"
                                      type="number"
                                      label=""
                                      autoComplete="off"
                                      onChange={(value) => handleInventoryChange(skuGroup.id, 'mumbai', value)}
                                    />,
                                    <TextField
                                      key={`qty2-${skuGroup.id}`}
                                      value={inventoryUpdates[skuGroup.id]?.uniqueSpareWarehouse || ''}
                                      placeholder="0"
                                      type="number"
                                      label=""
                                      autoComplete="off"
                                      onChange={(value) => handleInventoryChange(skuGroup.id, 'uniqueSpareWarehouse', value)}
                                    />
                                  ]
                                ]}
                                hideScrollIndicator
                              />
                            </Box>
                          </Box>,
                          actionCell
                        ];
                      })}
                      hideScrollIndicator
                    />
                  ) : (
                    <Box padding="400" as="div">
                      <div style={{ textAlign: 'center' }}>
                        <Text as="p" tone="subdued">No duplicate SKUs found matching your criteria</Text>
                      </div>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          </Layout.Section>
        )}
      </Layout>

      {toastActive && (
        <Toast content={toastMessage} onDismiss={() => setToastActive(false)} />
      )}
    </Page>
  );
}