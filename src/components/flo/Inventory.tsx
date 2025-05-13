import { Card, BlockStack, Box, Text, Page, Button } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

export default function FlowInventory() {
  const navigate = useNavigate();

  return (
    <Page>
      <BlockStack gap="400">
        {/* Quick View Card */}
        <Card>
          <BlockStack gap="0">
            <Box background="bg-fill-secondary" padding="400" borderRadius="200">
              <Text as="span" variant="bodyMd" fontWeight="medium">
                Quick View
              </Text>
            </Box>
            <Box padding="400">
              <BlockStack gap="400">
                <Text as="span" variant="bodyMd" tone="subdued">
                  Get a quick overview of your inventory status
                </Text>
                <Button variant="primary" onClick={() => navigate('/flo/inventory-quick-view')}>View Quick Summary</Button>
              </BlockStack>
            </Box>
          </BlockStack>
        </Card>

        {/* Detail View Card */}
        <Card>
          <BlockStack gap="0">
            <Box background="bg-fill-secondary" padding="400" borderRadius="200">
              <Text as="span" variant="bodyMd" fontWeight="medium">
                Detail View
              </Text>
            </Box>
            <Box padding="400">
              <BlockStack gap="400">
                <Text as="span" variant="bodyMd" tone="subdued">
                  Access detailed inventory information and analytics
                </Text>
                <Button variant="primary" onClick={() => navigate('/flo/inventory-detail-view')}>View Details</Button>
              </BlockStack>
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
} 