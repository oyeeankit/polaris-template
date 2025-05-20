import React, { useState, useEffect } from 'react';
import {
  Page,
  TextField,
  Select,
  FormLayout,
  Card,
  Layout,
  Box,
  Toast,
  ContextualSaveBar,
  Spinner,
} from '@shopify/polaris';

const Accounts: React.FC = () => {
  // Add loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('(GMT+05:30) New Delhi');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace this with your actual API call to get shop/user data
        // const response = await fetch('/api/shop-data');
        // const data = await response.json();

        // For now, simulate data from Shopify
        const shopifyData = {
          name: 'Shop Owner',
          email: 'owner@example.com',
          // timezone could also come from Shopify
        };

        setName(shopifyData.name);
        setEmail(shopifyData.email);
        // If you get timezone from Shopify too
        // setTimezone(shopifyData.timezone);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Reset isDirty when we first load data
  useEffect(() => {
    if (!isLoading) {
      setIsDirty(false);
    }
  }, [isLoading]);

  const timezones = [
    { label: '(GMT+00:00) UTC', value: '(GMT+00:00) UTC' },
    { label: '(GMT+01:00) Rome', value: '(GMT+01:00) Rome' },
    { label: '(GMT+05:30) New Delhi', value: '(GMT+05:30) New Delhi' },
    { label: '(GMT+08:00) Beijing', value: '(GMT+08:00) Beijing' },
    { label: '(GMT+10:00) Sydney', value: '(GMT+10:00) Sydney' },
  ];

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsSaving(true);
      try {
        // API call here
        console.log('Saved:', { name, email, timezone });
        setShowToast(true);
      } catch (error) {
        console.error('Error saving account details:', error);
        // Show error notification
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setIsDirty(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsDirty(true);
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    setIsDirty(true);
  };

  // Show loading state while fetching initial data
  if (isLoading) {
    return (
      <Page title="Account Details">
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="400">
                <Spinner size="large" />
                <p>Loading account details...</p>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <>
      {isDirty && (
        <ContextualSaveBar
          message="Unsaved changes"
          saveAction={{
            onAction: handleSave,
            loading: isSaving,
            disabled: isSaving,
          }}
          discardAction={{
            onAction: () => {
              // You may want to reset to the initial fetched values instead
              // If you store them in state variables
              setName('Shop Owner'); // Replace with initial fetched value
              setEmail('owner@example.com'); // Replace with initial fetched value
              setTimezone('(GMT+05:30) New Delhi');
              setIsDirty(false);
            },
          }}
        />
      )}
      <Page title="Account Details">
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="400">
                <FormLayout>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    autoComplete="name"
                    error={nameError}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="email"
                    error={emailError}
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
                    onChange={handleTimezoneChange}
                    value={timezone}
                  />
                  {/* Remove the Save button from here since we have ContextualSaveBar */}
                </FormLayout>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
        {showToast && (
          <Toast content="Account details saved successfully" onDismiss={() => setShowToast(false)} />
        )}
      </Page>
    </>
  );
};

export default Accounts;
