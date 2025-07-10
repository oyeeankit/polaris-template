import React, { useState, useCallback } from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Button,
  Toast,
  IndexTable,
  Modal,
  TextField,
  Select,
  Tag,
  Autocomplete,
  Icon
} from '@shopify/polaris';
import { EditIcon } from '@shopify/polaris-icons';

const Settings: React.FC = () => {
  // Toast state
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Modal state
  const [modalActive, setModalActive] = useState(false);
  const [editingMarketplace, setEditingMarketplace] = useState<{
    id: string;
    name: string;
    buttonText: string;
    countries: string;
    tag: string;
    buttonColor?: string;
  } | null>(null);

  // Country selection state
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countryInputValue, setCountryInputValue] = useState('');
  const [availableCountries] = useState([
    {label: 'United States', value: 'US'},
    {label: 'Canada', value: 'CA'},
    {label: 'United Kingdom', value: 'GB'},
    {label: 'France', value: 'FR'},
    {label: 'Germany', value: 'DE'},
    {label: 'Italy', value: 'IT'},
    {label: 'Spain', value: 'ES'},
    {label: 'Netherlands', value: 'NL'},
    {label: 'Sweden', value: 'SE'},
    {label: 'Poland', value: 'PL'},
    {label: 'Belgium', value: 'BE'},
    {label: 'Australia', value: 'AU'},
    {label: 'Japan', value: 'JP'},
    {label: 'Egypt', value: 'EG'},
    {label: 'India', value: 'IN'},
    {label: 'Singapore', value: 'SG'},
    {label: 'Mexico', value: 'MX'},
    {label: 'Brazil', value: 'BR'},
    {label: 'United Arab Emirates', value: 'AE'},
    {label: 'Saudi Arabia', value: 'SA'},
    {label: 'Turkey', value: 'TR'},
    {label: 'China', value: 'CN'}
  ]);
  
  // Button color options
  const buttonColorOptions = [
    {label: 'Amazon Dark gray', value: 'dark_gray'},
    {label: 'Amazon Orange', value: 'orange'},
    {label: 'Amazon Blue', value: 'blue'},
    {label: 'Amazon Green', value: 'green'},
    {label: 'Amazon Red', value: 'red'}
  ];
  
  // Marketplace data - Amazon only
  const [marketplaces, setMarketplaces] = useState([
    { id: 'amazon_com', name: 'amazon_com', buttonText: 'View on Amazon us', countries: 'US', tag: 'gfgdfgfdg' },
    { id: 'amazon_ca', name: 'amazon_ca', buttonText: 'View on Amazon', countries: 'CA', tag: '' },
    { id: 'amazon_fr', name: 'amazon_fr', buttonText: 'View on Amazon', countries: 'FR', tag: '' },
    { id: 'amazon_de', name: 'amazon_de', buttonText: 'Vergleichen Sie', countries: 'DE', tag: '' },
    { id: 'amazon_it', name: 'amazon_it', buttonText: 'Confrontare', countries: 'IT', tag: '' },
    { id: 'amazon_es', name: 'amazon_es', buttonText: 'Comparar', countries: 'ES', tag: '' },
    { id: 'amazon_co_uk', name: 'amazon_co_uk', buttonText: 'View on Amazon', countries: 'GB', tag: '' },
    { id: 'amazon_se', name: 'amazon_se', buttonText: 'View on Amazon', countries: 'SE', tag: '' },
    { id: 'amazon_pl', name: 'amazon_pl', buttonText: 'View on Amazon', countries: 'PL', tag: '' },
    { id: 'amazon_com_be', name: 'amazon_com_be', buttonText: 'View on Amazon', countries: 'BE', tag: '' },
    { id: 'amazon_nl', name: 'amazon_nl', buttonText: 'Vergelijken', countries: 'NL', tag: '' },
    { id: 'amazon_com_au', name: 'amazon_com_au', buttonText: 'View on Amazon', countries: 'AU', tag: '' },
    { id: 'amazon_co_jp', name: 'amazon_co_jp', buttonText: '比較する', countries: 'JP', tag: '' },
    { id: 'amazon_eg', name: 'amazon_eg', buttonText: 'اشترِ على أمازون', countries: 'EG', tag: '' },
    { id: 'amazon_in', name: 'amazon_in', buttonText: 'तुलना', countries: 'IN', tag: '' },
    { id: 'amazon_sg', name: 'amazon_sg', buttonText: 'View on Amazon', countries: 'SG', tag: '' },
    { id: 'amazon_com_mx', name: 'amazon_com_mx', buttonText: 'Comparar', countries: 'MX', tag: '' },
    { id: 'amazon_com_br', name: 'amazon_com_br', buttonText: 'Comparar', countries: 'BR', tag: '' },
    { id: 'amazon_ae', name: 'amazon_ae', buttonText: 'قارن', countries: 'AE', tag: '' },
    { id: 'amazon_sa', name: 'amazon_sa', buttonText: 'اشترِ على أمازون', countries: 'SA', tag: '' },
    { id: 'amazon_com_tr', name: 'amazon_com_tr', buttonText: 'Karşılaştırmak', countries: 'TR', tag: '' },
    { id: 'amazon_cn', name: 'amazon_cn', buttonText: '相比', countries: 'CN', tag: '' }
  ]);

  // Function to show toast message
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastActive(true);
    
    // Auto-dismiss toast after 3 seconds
    setTimeout(() => {
      setToastActive(false);
    }, 3000);
  }, []);

  const handleToastDismiss = useCallback(() => setToastActive(false), []);

  // Handle edit marketplace
  const handleEditMarketplace = useCallback((marketplaceId: string) => {
    const marketplace = marketplaces.find(m => m.id === marketplaceId);
    if (marketplace) {
      setEditingMarketplace({
        ...marketplace,
        buttonColor: 'dark_gray' // Default color
      });
      // Handle the case where countries might be a single value or comma-separated list
      const countryList = marketplace.countries.includes(',') 
        ? marketplace.countries.split(',') 
        : [marketplace.countries];
      setSelectedCountries(countryList);
      setModalActive(true);
    }
  }, [marketplaces]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setModalActive(false);
    setEditingMarketplace(null);
    setSelectedCountries([]);
    setCountryInputValue('');
  }, []);

  // Handle save marketplace changes
  const handleSaveMarketplace = useCallback(() => {
    if (editingMarketplace) {
      const updatedMarketplaces = marketplaces.map(marketplace => {
        if (marketplace.id === editingMarketplace.id) {
          return {
            ...marketplace,
            buttonText: editingMarketplace.buttonText,
            countries: selectedCountries.join(','),
            tag: editingMarketplace.tag
          };
        }
        return marketplace;
      });

      setMarketplaces(updatedMarketplaces);
      showToast(`Marketplace ${editingMarketplace.name} updated`);
      handleModalClose();
    }
  }, [editingMarketplace, marketplaces, selectedCountries, showToast, handleModalClose]);

  // Update marketplace field values
  const handleMarketplaceFieldChange = useCallback((field: string, value: string) => {
    if (editingMarketplace) {
      setEditingMarketplace({
        ...editingMarketplace,
        [field]: value
      });
    }
  }, [editingMarketplace]);

  // Country selection handling
  const handleCountryRemove = useCallback((country: string) => {
    setSelectedCountries(prev => prev.filter(c => c !== country));
  }, []);

  const updateCountrySelection = useCallback(
    (selected: string) => {
      // Toggle the selection: add if not present, remove if already present
      if (selectedCountries.includes(selected)) {
        setSelectedCountries(prev => prev.filter(country => country !== selected));
      } else {
        setSelectedCountries(prev => [...prev, selected]);
      }
      setCountryInputValue('');
    },
    [selectedCountries]
  );

  const countryTextFieldChange = useCallback(
    (value: string) => {
      setCountryInputValue(value);
    },
    []
  );

  const filteredCountries = availableCountries.filter(country => 
    !selectedCountries.includes(country.value) &&
    country.label.toLowerCase().includes(countryInputValue.toLowerCase())
  );

  // Handle save settings
  const handleSaveSettings = useCallback(() => {
    showToast('Settings saved successfully!');
  }, [showToast]);

  return (
    <Page
      title="Amazon Settings"
      fullWidth
    >
      {toastActive && (
        <Toast content={toastMessage} onDismiss={handleToastDismiss} duration={3000} />
      )}
      
      {/* Edit Marketplace Modal */}
      <Modal
        open={modalActive}
        onClose={handleModalClose}
        title="Edit marketplace"
        primaryAction={{
          content: 'Save',
          onAction: handleSaveMarketplace,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalClose,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            {/* Button Color */}
            <Select
              label="Button color"
              options={buttonColorOptions}
              onChange={(value) => handleMarketplaceFieldChange('buttonColor', value)}
              value={editingMarketplace?.buttonColor || 'dark_gray'}
            />

            {/* Button Text */}
            <TextField
              label="Button text"
              value={editingMarketplace?.buttonText || ''}
              onChange={(value) => handleMarketplaceFieldChange('buttonText', value)}
              autoComplete="off"
            />

            {/* Affiliate Tag */}
            <TextField
              label="Affiliate tag"
              value={editingMarketplace?.tag || ''}
              onChange={(value) => handleMarketplaceFieldChange('tag', value)}
              autoComplete="off"
            />

            {/* Country Selection */}
            <Autocomplete
              allowMultiple
              options={filteredCountries}
              selected={selectedCountries}
              textField={
                <Autocomplete.TextField
                  onChange={countryTextFieldChange}
                  label="Show in countries"
                  value={countryInputValue}
                  placeholder="Search countries"
                  autoComplete="off"
                />
              }
              onSelect={(selected) => {
                // Handle both single string and array of strings
                if (typeof selected === 'string') {
                  updateCountrySelection(selected);
                } else if (Array.isArray(selected) && selected.length > 0) {
                  // Use the last added item in the array
                  const newItem = selected[selected.length - 1];
                  updateCountrySelection(newItem);
                }
              }}
            />
            
            {selectedCountries.length > 0 && (
              <Box paddingBlockStart="200">
                <InlineStack gap="200">
                  {selectedCountries.map(country => {
                    const countryLabel = availableCountries.find(c => c.value === country)?.label || country;
                    return (
                      <Tag key={country} onRemove={() => handleCountryRemove(country)}>
                        {countryLabel}
                      </Tag>
                    );
                  })}
                </InlineStack>
              </Box>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
      
      <BlockStack gap="500">
        {/* Marketplace Settings */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Marketplace Settings
            </Text>

            <IndexTable
              resourceName={{ singular: 'marketplace', plural: 'marketplaces' }}
              itemCount={marketplaces.length}
              headings={[
                { title: 'MARKETPLACE' },
                { title: 'BUTTON TEXT' },
                { title: 'COUNTRIES' },
                { title: 'TAG' },
                { title: 'Edit' },
              ]}
              selectable={false}
            >
              {marketplaces.map((marketplace, index) => (
                <IndexTable.Row
                  id={marketplace.id}
                  key={marketplace.id}
                  position={index}
                >
                  <IndexTable.Cell>
                    <Text as="span" variant="bodyMd">{marketplace.name}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" variant="bodyMd">{marketplace.buttonText}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" variant="bodyMd">{marketplace.countries}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" variant="bodyMd">{marketplace.tag}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Button
                      variant="secondary"
                      size="medium"
                      icon={EditIcon}
                      accessibilityLabel={`Edit marketplace ${marketplace.name}`}
                      onClick={() => handleEditMarketplace(marketplace.id)}
                    />
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </BlockStack>
        </Card>

        {/* Save Button */}
        <Box paddingBlockStart="400">
          <InlineStack align="end">
            <Button
              variant="primary"
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </InlineStack>
        </Box>
        
        {/* Add bottom spacing to match Shopify admin UI */}
        <Box paddingBlockEnd="600">
          {/* This provides the standard 24px bottom spacing using Polaris tokens */}
        </Box>
      </BlockStack>
    </Page>
  );
};

export default Settings;
