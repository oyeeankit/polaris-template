import {
  Card,
  BlockStack,
  Box,
  Text,
  Page,
  InlineGrid,
  Button,
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

export default function FlowInventory() {
  const navigate = useNavigate();

  // Improved ClickableCard using Polaris components properly
  const ClickableCard = ({
    title,
    description,
    onClick
  }: {
    title: string;
    description: string;
    onClick: () => void;
  }) => (
    <Card padding="400">
      <BlockStack gap="200">
        <Text as="h3" variant="headingMd">
          {title}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          {description}
        </Text>
        <Box paddingBlockStart="300">
          <Button onClick={onClick}>
            View
          </Button>
        </Box>
      </BlockStack>
    </Card>
  );

  return (
    <Page
      title="Inventory Overview"
      primaryAction={{
        content: 'Add inventory',
        onAction: () => navigate('/flo/add-inventory'),
      }}
      backAction={{
        content: 'Dashboard',
        onAction: () => navigate('/flo'),
      }}
    >
      <BlockStack gap="500">
        {/* Description */}
        <Box paddingBlockEnd="400">
          <Text as="p" variant="bodyMd">
            Manage and view your inventory across all locations.
          </Text>
        </Box>

        {/* Card Grid - Using InlineGrid for responsive layout */}
        <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}>
          <ClickableCard
            title="Quick View"
            description="Get a quick overview of your inventory status."
            onClick={() => navigate('/flo/inventory-quick-view')}
          />
          <ClickableCard
            title="Detail View"
            description="Access detailed inventory information and analytics."
            onClick={() => navigate('/flo/inventory-detail-view')}
          />
          <ClickableCard
            title="Inventory History"
            description="View historical inventory changes and audit logs."
            onClick={() => navigate('/flo/inventory-history')}
          />
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
