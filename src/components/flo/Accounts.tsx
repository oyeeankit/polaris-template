import React, { useState } from 'react';
import {
  Page,
  TextField,
  Select,
  Button,
  FormLayout,
  Card,
  Layout,
  Box,
} from '@shopify/polaris';

const AccountDetails: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('(GMT+05:30) New Delhi');

  const timezones = [
    { label: '(GMT+00:00) UTC', value: '(GMT+00:00) UTC' },
    { label: '(GMT+01:00) Rome', value: '(GMT+01:00) Rome' },
    { label: '(GMT+05:30) New Delhi', value: '(GMT+05:30) New Delhi' },
    { label: '(GMT+08:00) Beijing', value: '(GMT+08:00) Beijing' },
    { label: '(GMT+10:00) Sydney', value: '(GMT+10:00) Sydney' },
  ];

  const handleSave = () => {
    console.log('Saved:', { name, email, timezone });
    // TODO: Add save logic
  };

  return (
    <Page title="Account Details">
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="400">
              <FormLayout>
                <TextField
                  label="Name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
                <TextField
                  label="Store name"
                  value="mane-production1.myshopify.com"
                  disabled
                  autoComplete="off"
                />
                <Select
                  label="Timezone"
                  options={timezones}
                  onChange={setTimezone}
                  value={timezone}
                />
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </FormLayout>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default AccountDetails;
