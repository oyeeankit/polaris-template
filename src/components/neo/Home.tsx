import React, { useState, useEffect } from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Box,
  Divider,
  Link,
} from '@shopify/polaris';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleAddBlock = () => {
    // Redirect to Shopify theme customization
    window.open('/admin/themes/current/editor', '_blank');
  };

  return (
    <Page title="Neo Dashboard">
      <Box paddingInlineStart={isMobile ? "400" : "0"} paddingInlineEnd={isMobile ? "400" : "0"}>
        <BlockStack gap="500">
          {/* Neo Blocks Info Card */}
          <Card>
            <Box padding="300" paddingInlineStart="400" paddingInlineEnd="400">
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  🎉 Welcome to Neo Blocks!
                </Text>
                <div style={{ textAlign: 'justify' }}>
                  <Text as="p" variant="bodyMd">
                    Neo Blocks have been automatically added to your Shopify theme. You can find these app blocks in your theme editor and place them anywhere you like. We've optimized them for your product pages to keep your customers engaged and help boost your conversions effortlessly.
                  </Text>
                </div>
                <div style={{ textAlign: 'justify' }}>
                  <Text as="p" variant="bodyMd">
                    Start exploring Neo Blocks today to enhance your store's experience!
                  </Text>
                </div>
                
                <InlineStack gap="300" wrap>
                  <Button variant="primary">
                    Getting started guide
                  </Button>
                </InlineStack>
              </BlockStack>
            </Box>
          </Card>

          {/* Variant Cards List */}
          <BlockStack gap="400">
            {/* Variant Description Block Option Card */}
            <Card>
              <Box padding="300" paddingInlineStart="400" paddingInlineEnd="400">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '20px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  {/* Image Section */}
                  <div style={{ 
                    flexShrink: 0,
                    width: isMobile ? '100%' : 'auto',
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}>
                    <div style={{ 
                      width: isMobile ? '100%' : '200px',
                      maxWidth: '400px',
                      height: isMobile ? '140px' : '120px',
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#fff',
                        padding: '8px',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        width: 'fit-content'
                      }}>
                        {/* Product Image */}
                        <div style={{
                          width: isMobile ? '80px' : '60px',
                          height: isMobile ? '80px' : '60px',
                          backgroundColor: '#5DADE2',
                          borderRadius: '4px',
                          flexShrink: 0
                        }}></div>
                        
                        {/* Product Details */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          flexShrink: 0
                        }}>
                          <Text as="h3" variant={isMobile ? 'bodyMd' : 'bodySm'} fontWeight="bold">NEW T-shirt</Text>
                          <div style={{ display: 'flex', gap: '1px' }}>
                            <Text as="span" variant={isMobile ? 'bodyMd' : 'bodySm'} fontWeight="bold" tone="success">$29.99</Text>
                          </div>
                          <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #ccc' }}></div>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#E74C3C' }}></div>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#3498DB' }}></div>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#9B59B6' }}></div>
                          </div>
                          <div style={{ marginTop: '6px' }}>
                            <div style={{ width: isMobile ? '90px' : '70px', height: isMobile ? '4px' : '3px', backgroundColor: '#5DADE2', borderRadius: '2px', marginBottom: '2px' }}></div>
                            <div style={{ width: isMobile ? '70px' : '50px', height: isMobile ? '4px' : '3px', backgroundColor: '#5DADE2', borderRadius: '2px' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div style={{ 
                    flex: 1, 
                    paddingTop: isMobile ? '16px' : '0',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        Variant Description
                      </Text>
                      <div style={{ textAlign: 'justify' }}>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Add unique descriptions to each variant to better inform customers and increase sales. Simply create the metafield, then edit each variant's description directly in your Shopify product admin.
                        </Text>
                      </div>
                      
                      {/* Button Section moved here */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '8px', 
                        alignItems: isMobile ? 'stretch' : 'flex-start',
                        justifyContent: 'flex-start',
                        paddingTop: '8px'
                      }}>
                        <Button variant="secondary" size="medium" fullWidth={isMobile}>
                          More info
                        </Button>
                        <Button variant="secondary" size="medium" fullWidth={isMobile}>
                          Setup Metafield
                        </Button>
                        <Button variant="primary" onClick={handleAddBlock} size="medium" fullWidth={isMobile}>
                          View/Edit block
                        </Button>
                      </div>
                    </BlockStack>
                  </div>
                </div>
              </Box>
            </Card>

            {/* Variant Galleries Card */}
            <Card>
              <Box padding="300" paddingInlineStart="400" paddingInlineEnd="400">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '20px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  {/* Image Section */}
                  <div style={{ 
                    flexShrink: 0,
                    width: isMobile ? '100%' : 'auto',
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}>
                    <div style={{ 
                      width: isMobile ? '100%' : '200px',
                      maxWidth: '400px',
                      height: isMobile ? '140px' : '120px',
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#fff',
                        padding: '8px',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        width: 'fit-content'
                      }}>
                        {/* Product Image */}
                        <div style={{
                          width: isMobile ? '80px' : '60px',
                          height: isMobile ? '80px' : '60px',
                          backgroundColor: '#5DADE2',
                          borderRadius: '4px',
                          flexShrink: 0
                        }}></div>
                        
                        {/* Product Details */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          flexShrink: 0
                        }}>
                          <Text as="h3" variant={isMobile ? 'bodyMd' : 'bodySm'} fontWeight="bold">NEW T-shirt</Text>
                          <div style={{ display: 'flex', gap: '1px' }}>
                            <Text as="span" variant={isMobile ? 'bodyMd' : 'bodySm'} fontWeight="bold" tone="success">$29.99</Text>
                          </div>
                          
                          {/* Color variants */}
                          <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #ccc' }}></div>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#E74C3C' }}></div>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#3498DB' }}></div>
                            <div style={{ width: isMobile ? '10px' : '8px', height: isMobile ? '10px' : '8px', borderRadius: '50%', backgroundColor: '#9B59B6' }}></div>
                          </div>
                          
                          {/* Gallery thumbnails - 2x2 grid */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '2px',
                            marginTop: '2px',
                            width: isMobile ? '60px' : '50px'
                          }}>
                            <div style={{
                              width: isMobile ? '28px' : '22px',
                              height: isMobile ? '18px' : '15px',
                              backgroundColor: '#7FB3D3',
                              borderRadius: '1px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: isMobile ? '8px' : '6px',
                              fontWeight: 'bold',
                              color: '#fff'
                            }}>1</div>
                            
                            <div style={{
                              width: isMobile ? '28px' : '22px',
                              height: isMobile ? '18px' : '15px',
                              backgroundColor: '#A8E6CF',
                              borderRadius: '1px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: isMobile ? '8px' : '6px',
                              fontWeight: 'bold',
                              color: '#fff'
                            }}>2</div>
                            
                            <div style={{
                              width: isMobile ? '28px' : '22px',
                              height: isMobile ? '18px' : '15px',
                              backgroundColor: '#FFB6C1',
                              borderRadius: '1px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: isMobile ? '8px' : '6px',
                              fontWeight: 'bold',
                              color: '#fff'
                            }}>3</div>
                            
                            <div style={{
                              width: isMobile ? '28px' : '22px',
                              height: isMobile ? '18px' : '15px',
                              backgroundColor: '#DDA0DD',
                              borderRadius: '1px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: isMobile ? '8px' : '6px',
                              fontWeight: 'bold',
                              color: '#fff'
                            }}>4</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div style={{ 
                    flex: 1, 
                    paddingTop: isMobile ? '16px' : '0',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        Variant Galleries
                      </Text>
                      <div style={{ textAlign: 'justify' }}>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Boost sales by showcasing images and videos unique to each variant. Create the metafield, then easily add specific media for each variant in your Shopify product admin.
                        </Text>
                      </div>
                      
                      {/* Button Section moved here */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '8px', 
                        alignItems: isMobile ? 'stretch' : 'flex-start',
                        justifyContent: 'flex-start',
                        paddingTop: '8px'
                      }}>
                        <Button variant="secondary" size="medium" fullWidth={isMobile}>
                          More info
                        </Button>
                        <Button variant="secondary" size="medium" fullWidth={isMobile}>
                          Setup Metafield
                        </Button>
                        <Button variant="primary" onClick={handleAddBlock} size="medium" fullWidth={isMobile}>
                          View/Edit block
                        </Button>
                      </div>
                    </BlockStack>
                  </div>
                </div>
              </Box>
            </Card>
          </BlockStack>
          
          {/* Bottom spacing */}
          <Box paddingBlockStart="500"></Box>
        </BlockStack>
      </Box>
    </Page>
  );
}
