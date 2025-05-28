import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  Banner,
  Text
} from '@shopify/polaris';

const Accounts: React.FC = () => {
  // Add loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [initialName, setInitialName] = useState('');
  const [email, setEmail] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [storeName, setStoreName] = useState(''); // Add state for store name
  const [timezone, setTimezone] = useState('(GMT+05:30) New Delhi');
  const [initialTimezone, setInitialTimezone] = useState('(GMT+05:30) New Delhi');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Account details saved successfully');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
          storeName: 'my-store.myshopify.com', // Add store name to the mock data
          timezone: '(GMT+05:30) New Delhi'
        };

        // Set current values
        setName(shopifyData.name);
        setEmail(shopifyData.email);
        setStoreName(shopifyData.storeName); // Set the store name
        setTimezone(shopifyData.timezone || '(GMT+05:30) New Delhi');
        
        // Store initial values for reset functionality
        setInitialName(shopifyData.name);
        setInitialEmail(shopifyData.email);
        setInitialTimezone(shopifyData.timezone || '(GMT+05:30) New Delhi');
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

  const validateForm = useCallback(() => {
    let isValid = true;
    let focusSet = false;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
      // Focus management removed: Polaris TextField does not support inputRef
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
      // Focus management removed: Polaris TextField does not support inputRef
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
      // Focus management removed: Polaris TextField does not support inputRef
    } else {
      setEmailError('');
    }

    return isValid;
  }, [name, email]);

  const handleSave = useCallback(async () => {
    if (validateForm()) {
      setIsSaving(true);
      setSaveError(null);
      
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // API call would go here
        console.log('Saved:', { name, email, timezone });
        
        // Update initial values after successful save
        setInitialName(name);
        setInitialEmail(email);
        setInitialTimezone(timezone);
        
        setToastMessage('Account details saved successfully');
        setShowToast(true);
        setIsDirty(false);
      } catch (error) {
        console.error('Error saving account details:', error);
        setSaveError('There was a problem saving your account details. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  }, [name, email, timezone, validateForm]);

  const handleDiscard = useCallback(() => {
    // Reset to initial values
    setName(initialName);
    setEmail(initialEmail);
    setTimezone(initialTimezone);
    setNameError('');
    setEmailError('');
    setIsDirty(false);
    setSaveError(null);
  }, [initialName, initialEmail, initialTimezone]);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setIsDirty(true);
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setIsDirty(true);
  }, []);

  const handleTimezoneChange = useCallback((value: string) => {
    setTimezone(value);
    setIsDirty(true);
  }, []);

  const dismissToast = useCallback(() => {
    setShowToast(false);
  }, []);

  // Show loading state with SkeletonPage while fetching initial data
  if (isLoading) {
    return (
      <SkeletonPage title="Account Details">
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="400">
                <SkeletonDisplayText size="small" />
                <Box paddingBlockStart="400">
                  <SkeletonBodyText lines={4} />
                </Box>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
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
            onAction: handleDiscard,
          }}
        />
      )}
      <Page title="Account Details">
        <Layout>
          <Layout.Section>
            {saveError && (
              <Box paddingBlockEnd="400">
                <Banner tone="critical" onDismiss={() => setSaveError(null)}>
                  {saveError}
                </Banner>
              </Box>
            )}
            <Card>
              <Box padding="400">
                <FormLayout>
                  <Text variant="headingMd" as="h2">Personal Information</Text>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    autoComplete="name"
                    error={nameError}
                    requiredIndicator
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="email"
                    error={emailError}
                    requiredIndicator
                  />
                  {/* Add the read-only store name field */}
                  <TextField
                    label="Store name"
                    value={storeName}
                    disabled
                    autoComplete="off"
                  />
                  <Select
                    label="Timezone"
                    options={timezones}
                    value={timezone}
                    onChange={handleTimezoneChange}
                  />
                </FormLayout>
              </Box>
            </Card>
          </Layout.Section>
          
          {/* Add bottom spacing to match Shopify admin UI */}
          <Layout.Section>
            <Box paddingBlockEnd="600">
              {/* This provides the standard 24px bottom spacing using Polaris tokens */}
            </Box>
          </Layout.Section>
        </Layout>
        
        {showToast && (
          <Toast content={toastMessage} onDismiss={dismissToast} duration={4000} />
        )}
      </Page>
    </>
  );
};

export default Accounts;
