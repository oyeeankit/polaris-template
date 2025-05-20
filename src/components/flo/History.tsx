import {
  Card,
  Page,
  Text,
  Box,
  BlockStack,
  InlineStack, // Add this import
  Link,
  IndexTable,
  Filters,
  Pagination,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

export default function FloHistory() {
  const [queryValue, setQueryValue] = useState('');
  const [showSyncHistory, setShowSyncHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [syncHistory] = useState([
    {
      sku: 'M482M5_CAMOSCIO',
      orderId: '11846775308670',
      orderDate: '14 May 2025 02:17 PM',
      productTitle: 'Stivali in Pelle Marlene - EBANO / 40',
      productVariantId: '49871255077156',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077156',
      syncedItems: [
        {
          title: 'Stivali in Camoscio Marlene - EBANO / 40',
          variantId: '49871244984612',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984612',
        },
      ],
      finalStock: {
        location: 'Warehouse 1',
        quantity: 5,
      },
    },
    {
      sku: 'CAM123_NERO',
      orderId: '11846775308671',
      orderDate: '15 May 2025 03:25 PM',
      productTitle: 'Sneakers Classic - NERO / 42',
      productVariantId: '49871255077157',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077157',
      syncedItems: [
        {
          title: 'Sneakers Classic - NERO / 42',
          variantId: '49871244984613',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984613',
        },
      ],
      finalStock: {
        location: 'Warehouse 2',
        quantity: -2,
      },
    },
    {
      sku: 'TEST_SKU_1',
      orderId: '11846775308672',
      orderDate: '16 May 2025 04:35 PM',
      productTitle: 'Test Product 1',
      productVariantId: '49871255077158',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077158',
      syncedItems: [
        {
          title: 'Test Product 1 - Variant A',
          variantId: '49871244984614',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984614',
        },
      ],
      finalStock: {
        location: 'Warehouse 3',
        quantity: 10,
      },
    },
    {
      sku: 'TEST_SKU_2',
      orderId: '11846775308673',
      orderDate: '17 May 2025 05:45 PM',
      productTitle: 'Test Product 2',
      productVariantId: '49871255077159',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077159',
      syncedItems: [
        {
          title: 'Test Product 2 - Variant B',
          variantId: '49871244984615',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984615',
        },
      ],
      finalStock: {
        location: 'Warehouse 4',
        quantity: 0,
      },
    },
    {
      sku: 'TEST_SKU_3',
      orderId: '11846775308674',
      orderDate: '18 May 2025 06:55 PM',
      productTitle: 'Test Product 3',
      productVariantId: '49871255077160',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077160',
      syncedItems: [
        {
          title: 'Test Product 3 - Variant C',
          variantId: '49871244984616',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984616',
        },
      ],
      finalStock: {
        location: 'Warehouse 5',
        quantity: 3,
      },
    },
    {
      sku: 'TEST_SKU_4',
      orderId: '11846775308675',
      orderDate: '19 May 2025 08:05 PM',
      productTitle: 'Test Product 4',
      productVariantId: '49871255077161',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077161',
      syncedItems: [
        {
          title: 'Test Product 4 - Variant D',
          variantId: '49871244984617',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984617',
        },
      ],
      finalStock: {
        location: 'Warehouse 6',
        quantity: 7,
      },
    },
  ]);

  const handleQueryChange = useCallback((value: string) => {
    setQueryValue(value);
    setCurrentPage(1); // Reset to page 1 on search
  }, []);

  const handleQueryClear = useCallback(() => {
    setQueryValue('');
    setCurrentPage(1);
  }, []);

  const handleRevealHistory = () => setShowSyncHistory(true);

  const filteredData = syncHistory.filter(item =>
    item.sku.toLowerCase().includes(queryValue.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Page title="History">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="0">
            <Box background="bg-fill-secondary" padding="400" borderRadius="200">
              <Text as="span" variant="bodyMd" fontWeight="medium">
                Sync History
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                {' '} (last 6 hours)
              </Text>
            </Box>

            <Box padding="400">
              {!showSyncHistory ? (
                <Box paddingBlockStart="400">
                  <Link onClick={handleRevealHistory} removeUnderline>
                    <Text as="span" variant="bodyMd" tone="subdued">
                      No sync history found
                    </Text>
                  </Link>
                </Box>
              ) : (
                <>
                  <Box paddingBlockEnd="300">
                    <Filters
                      queryValue={queryValue}
                      queryPlaceholder="Search by SKU"
                      onQueryChange={handleQueryChange}
                      onQueryClear={handleQueryClear}
                      filters={[]}
                      onClearAll={handleQueryClear}
                    />
                  </Box>

                  {filteredData.length === 0 ? (
                    <Text as='span' tone="subdued">No SKU Found</Text>
                  ) : (
                    <>
                      <IndexTable
                        resourceName={{ singular: 'sync', plural: 'syncs' }}
                        itemCount={filteredData.length}
                        selectable={false}
                        headings={[
                          { title: 'SKU' },
                          { title: 'Details' },
                          { title: 'Final Stock' },
                        ]}
                      >
                        {paginatedData.map((item, index) => (
                          <IndexTable.Row
                            id={String(index)}
                            key={index}
                            position={index}
                          >
                            <IndexTable.Cell>
                              <Text as="span">{item.sku}</Text>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                              <Box paddingInlineStart="200" paddingInlineEnd="200">
                                <BlockStack gap="300">
                                  {/* Order Info */}
                                  <Text as="span" variant="bodySm">
                                    <Text as="span" fontWeight="medium">Order:</Text> #{item.orderId} 
                                    <Text as="span" tone="subdued"> • {item.orderDate}</Text>
                                  </Text>
                                  
                                  {/* Product Info */}
                                  <Text as="span" variant="bodySm">
                                    <Text as="span" fontWeight="medium">Product:</Text>{' '}
                                    <Link url={item.productAdminLink} external monochrome>
                                      {item.productTitle}
                                    </Link>
                                  </Text>
                                  
                                  {/* Variant ID */}
                                  <Text as="span" variant="bodySm">
                                    <Text as="span" fontWeight="medium">Variant ID:</Text>{' '}
                                    <Link 
                                      url={`https://admin.shopify.com/store/your-store-name/products/${item.productVariantId}`}
                                      external
                                      monochrome
                                    >
                                      {item.productVariantId}
                                    </Link>
                                  </Text>
                                  
                                  {/* Synced Items */}
                                  <BlockStack gap="100">
                                    <Text as="span" variant="bodySm" fontWeight="medium">Synced with:</Text>
                                    {item.syncedItems.map((syncedItem, idx) => (
                                      <Box key={idx} paddingBlockStart="100" paddingBlockEnd="100" paddingInlineStart="200">
                                        <InlineStack gap="200" align="start">
                                          <Text as="span" variant="bodySm">
                                            {idx + 1}.
                                          </Text>
                                          <BlockStack gap="100">
                                            <Text as="span" variant="bodySm">
                                              <Link url={syncedItem.variantAdminLink} external monochrome>
                                                {syncedItem.title}
                                              </Link>
                                            </Text>
                                            <Text as="span" variant="bodySm" tone="subdued">
                                              ID: {syncedItem.variantId}
                                            </Text>
                                          </BlockStack>
                                        </InlineStack>
                                      </Box>
                                    ))}
                                  </BlockStack>
                                </BlockStack>
                              </Box>
                            </IndexTable.Cell>

                            {/* Final Stock - UNCHANGED */}
                            <IndexTable.Cell>
                              <IndexTable
                                resourceName={{ singular: 'stock', plural: 'stocks' }}
                                itemCount={1}
                                headings={[
                                  { title: 'Location' },
                                  { title: 'Quantity' },
                                ]}
                                selectable={false}
                              >
                                <IndexTable.Row id="0" key="0" position={0}>
                                  <IndexTable.Cell>{item.finalStock.location}</IndexTable.Cell>
                                  <IndexTable.Cell>
                                    <Text
                                      as='span'
                                      tone={item.finalStock.quantity < 0 ? 'critical' : undefined}
                                    >
                                      {item.finalStock.quantity}
                                    </Text>
                                  </IndexTable.Cell>
                                </IndexTable.Row>
                              </IndexTable>
                            </IndexTable.Cell>
                          </IndexTable.Row>
                        ))}
                      </IndexTable>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Box paddingBlockStart="400" paddingBlockEnd="200">
                          <Pagination
                            hasPrevious={currentPage > 1}
                            onPrevious={() => setCurrentPage(prev => prev - 1)}
                            hasNext={currentPage < totalPages}
                            onNext={() => setCurrentPage(prev => prev + 1)}
                            type="table"
                            label={`Page ${currentPage} of ${totalPages}`}
                            accessibilityLabel={`Pagination navigation, current page ${currentPage} of ${totalPages}`}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
