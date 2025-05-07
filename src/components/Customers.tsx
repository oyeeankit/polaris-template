import React from 'react';
import { Page, Card, Text, Layout, ResourceList, ResourceItem, Avatar, BlockStack } from '@shopify/polaris';

interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
}

const Customers: React.FC = () => {
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      location: 'New York',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      location: 'Los Angeles',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      location: 'Chicago',
    },
  ];

  return (
    <Page title="Customers">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Customer List
              </Text>
              <ResourceList
                items={customers}
                renderItem={(customer) => (
                  <ResourceItem
                    id={customer.id}
                    media={<Avatar customer size="md" />}
                    name={customer.name}
                    accessibilityLabel={`View details for ${customer.name}`}
                    onClick={() => {}}
                  >
                    <Text as='p' variant="bodyMd" fontWeight="bold">
                      {customer.name}
                    </Text>
                    <div>{customer.email}</div>
                    <div>{customer.location}</div>
                  </ResourceItem>
                )}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Customers; 