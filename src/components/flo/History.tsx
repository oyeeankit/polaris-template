import { Card, BlockStack, Box, Text, Page } from '@shopify/polaris';

export default function FloHistory() {
  return (
    <Page>
      <BlockStack gap="400">
    <div>
      {/* Sync History Card */}
      <Card>
        <BlockStack gap="0">
          <Box background="bg-fill-secondary" padding="400" borderRadius="200">
            <Text as="span" variant="bodyMd" fontWeight="medium">
              Sync History
            </Text>
            <Text as="span" variant="bodySm" tone="subdued">
              {' '}(last 6 hours)
            </Text>
          </Box>
          <Box padding="400">
            <Text as="span" variant="bodyMd" tone="subdued">
              No sync activity
            </Text>
          </Box>
        </BlockStack>
      </Card>
    </div>
    </BlockStack>
    </Page>
  );
}
