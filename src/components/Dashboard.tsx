import React from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Badge,
  DataTable,
  BlockStack,
} from '@shopify/polaris';

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: 'Completed' | 'Processing';
  date: string;
}

const Dashboard: React.FC = () => {
  const recentOrders: Order[] = [
    {
      id: '1',
      customer: 'John Doe',
      amount: '$120.00',
      status: 'Completed',
      date: '2024-03-15',
    },
    {
      id: '2',
      customer: 'Jane Smith',
      amount: '$85.50',
      status: 'Processing',
      date: '2024-03-14',
    },
    {
      id: '3',
      customer: 'Bob Johnson',
      amount: '$200.00',
      status: 'Completed',
      date: '2024-03-14',
    },
  ];

  const rows = recentOrders.map((order) => [
    order.id,
    order.customer,
    order.amount,
    <Badge key={order.id} tone={order.status === 'Completed' ? 'success' : 'warning'}>
      {order.status}
    </Badge>,
    order.date,
  ]);

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Recent Orders
              </Text>
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={['Order ID', 'Customer', 'Amount', 'Status', 'Date']}
                rows={rows}
              />
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Quick Stats
              </Text>
              <Layout>
                <Layout.Section>
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingLg" as="h3">
                        $1,234
                      </Text>
                      <Text variant="bodyMd" as="p">
                        Total Sales
                      </Text>
                    </BlockStack>
                  </Card>
                </Layout.Section>
                <Layout.Section>
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingLg" as="h3">
                        42
                      </Text>
                      <Text variant="bodyMd" as="p">
                        New Customers
                      </Text>
                    </BlockStack>
                  </Card>
                </Layout.Section>
              </Layout>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard; 