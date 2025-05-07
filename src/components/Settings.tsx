import React from 'react';
import { Page, Card, Text, Layout, FormLayout, TextField, Select, BlockStack } from '@shopify/polaris';

const Settings: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [timezone, setTimezone] = React.useState('UTC');

  const timezoneOptions = [
    { label: 'UTC', value: 'UTC' },
    { label: 'EST', value: 'EST' },
    { label: 'PST', value: 'PST' },
  ];

  return (
    <Page title="Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Profile Settings
              </Text>
              <FormLayout>
                <TextField
                  label="Name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  autoComplete="email"
                />
                <Select
                  label="Timezone"
                  options={timezoneOptions}
                  value={timezone}
                  onChange={setTimezone}
                />
              </FormLayout>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Settings; 