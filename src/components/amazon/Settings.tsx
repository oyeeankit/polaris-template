import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  Icon,
  DropZone,
  Banner,
  List,
  Link
} from '@shopify/polaris';
import { EditIcon, ImportIcon, NoteIcon } from '@shopify/polaris-icons';

// Utility hook to prevent background scroll when modal is open
const usePreventBackgroundScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Keep scrollbar to prevent layout shift
      
      return () => {
        // Remove the styles when the modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
    return undefined;
  }, [isOpen]);
};

const Settings: React.FC = () => {
  // Toast state
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Modal states
  const [modalActive, setModalActive] = useState(false);
  const [csvModalActive, setCsvModalActive] = useState(false);
  
  // Apply the background scroll prevention when any modal is open
  usePreventBackgroundScroll(modalActive || csvModalActive);
  
  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploadError, setCsvUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCsvRegion, setSelectedCsvRegion] = useState('amazon_com');
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Function to create and download CSV template
  const downloadCsvTemplate = useCallback(() => {
    // Define headers
    const headers = ['product_handle', 'ASIN', 'Keywords', 'custom_link', 'status'];
    
    // Define sample data (3 rows)
    const sampleData = [
      ['best-seller-product-2023', 'B07X5FHWSG', 'kitchen gadget', 'https://amazon.com/dp/B07X5FHWSG', '1'],
      ['everyday-essentials-set', 'B08CZTD6JK', 'daily use', 'https://amazon.com/dp/B08CZTD6JK', '1'],
      ['limited-edition-item', 'B09NJDWZXP', 'special edition', 'https://amazon.com/dp/B09NJDWZXP', '0']
    ];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    sampleData.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'amazon_products_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('CSV template downloaded successfully');
  }, [showToast]);

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

  // CSV upload handlers
  const handleCsvModalOpen = useCallback(() => {
    setCsvModalActive(true);
    setCsvFile(null);
    setCsvUploadError(null);
    setSelectedCsvRegion('amazon_com'); // Default to amazon.com
  }, []);

  const handleCsvModalClose = useCallback(() => {
    setCsvModalActive(false);
    setCsvFile(null);
    setCsvUploadError(null);
    // Reset the file input to prevent reopening issues
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Create a ref for the file input to control when it opens
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setCsvFile(files[0]);
      setCsvUploadError(null);
    }
    // Important: Don't reset value here as it causes issues in some browsers
  }, []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setCsvFile(acceptedFiles[0]);
        setCsvUploadError(null);
      }
    },
    []
  );

  const validateCsvFile = (file: File | null): boolean => {
    if (!file) {
      setCsvUploadError('Please select a CSV file to upload.');
      return false;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvUploadError('Only CSV files are supported.');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setCsvUploadError('File size exceeds 5MB limit.');
      return false;
    }

    return true;
  };

  const handleCsvUpload = useCallback(() => {
    if (!validateCsvFile(csvFile)) {
      return;
    }

    setIsUploading(true);
    
    // Get the selected marketplace name for the toast message
    const selectedMarketplace = marketplaces.find(m => m.id === selectedCsvRegion);
    const marketplaceName = selectedMarketplace ? selectedMarketplace.name : selectedCsvRegion;

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      handleCsvModalClose();
      showToast(`CSV file uploaded successfully. Products for ${marketplaceName} will be updated shortly.`);
    }, 1500);

    // In a real application, you would use fetch or axios to upload the file:
    /*
    const formData = new FormData();
    if (csvFile) {
      formData.append('file', csvFile);
      formData.append('region', selectedCsvRegion); // Add the selected region to the form data
    }
    
    fetch('/api/products/bulk-update', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      setIsUploading(false);
      handleCsvModalClose();
      showToast(`CSV file uploaded successfully. ${data.updatedCount} products will be updated.`);
    })
    .catch(error => {
      setIsUploading(false);
      setCsvUploadError('An error occurred while uploading the file. Please try again.');
      console.error('Upload error:', error);
    });
    */
  }, [csvFile, handleCsvModalClose, showToast, selectedCsvRegion, marketplaces]);

  // Save functionality is handled per-marketplace in the edit modal

  return (
    <Page
      title="Amazon Settings"
      fullWidth
    >
      {toastActive && (
        <Toast content={toastMessage} onDismiss={handleToastDismiss} duration={3000} />
      )}
      
      {/* Hidden file input for controlled file selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          handleFileInputChange(e);
          // Stop event propagation
          e.stopPropagation();
        }}
        onClick={(e) => {
          // Prevent bubbling that could cause multiple dialogs
          e.stopPropagation();
        }}
        accept=".csv"
        style={{ display: 'none' }}
      />

      {/* CSV Upload Modal */}
      <Modal
        open={csvModalActive}
        onClose={handleCsvModalClose}
        title="Bulk update products via CSV"
        primaryAction={{
          content: 'Upload',
          onAction: handleCsvUpload,
          loading: isUploading,
          disabled: !csvFile || isUploading
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => {
              // Just call the close handler - no event to handle in onAction
              handleCsvModalClose();
            },
            disabled: isUploading
          }
        ]}
      >
        <Modal.Section>
            <BlockStack gap="400">
            <Banner
              title="CSV format requirements"
              tone="info"
              icon={NoteIcon}
            >
              <List>
                <List.Item>First row must contain column headers</List.Item>
                <List.Item>Required columns: product_handle, ASIN, Keywords, custom_link, status</List.Item>
                <List.Item>Status values: 1 for active, 0 for inactive</List.Item>
                <List.Item>Maximum file size: 5MB</List.Item>
              </List>
              <Box paddingBlockStart="200">
                <Link onClick={downloadCsvTemplate}>Download CSV template</Link>
              </Box>
            </Banner>
            
            {/* Region Selection Dropdown - Inline Layout with better alignment */}
            <InlineStack gap="400" blockAlign="center" align="center">
              <div style={{width: "200px"}}>
                <Text as="span" fontWeight="medium">Select Region for Upload:</Text>
              </div>
              <div style={{flexGrow: 1}}>
                <Select
                  labelHidden
                  label="Select Region for Upload"
                  options={marketplaces.map(marketplace => ({ 
                    label: marketplace.name.replace('_', '.').replace('_', ' '), 
                    value: marketplace.id 
                  }))}
                  onChange={setSelectedCsvRegion}
                  value={selectedCsvRegion}
                />
              </div>
            </InlineStack>
            
            <DropZone
              accept=".csv"
              type="file"
              onDrop={handleDropZoneDrop}
              errorOverlayText="File type must be .csv"
              allowMultiple={false}
              onClick={(e) => {
                // Prevent the default DropZone behavior of opening a file dialog
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {csvFile ? (
                <BlockStack gap="200" inlineAlign="center">
                  <div style={{ padding: '1rem' }}>
                    <Text as="span" fontWeight="bold">{csvFile.name}</Text>
                    <Text as="span" tone="subdued"> ({(csvFile.size / 1024).toFixed(2)} KB)</Text>
                  </div>
                  <Button onClick={() => {
                    setCsvFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}>Remove file</Button>
                </BlockStack>
              ) : (
                <BlockStack gap="300" inlineAlign="center">
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Text as="p">Drag and drop a CSV file here or</Text>
                    <Box paddingBlockStart="300">
                      <Button 
                        onClick={() => {
                          // Only open if the modal is still active
                          if (csvModalActive && fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        Add file
                      </Button>
                    </Box>
                  </div>
                </BlockStack>
              )}
            </DropZone>
            
            {csvUploadError && (
              <Banner tone="critical">
                {csvUploadError}
              </Banner>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
      
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
                  })}              </InlineStack>
            </Box>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
      
      <BlockStack gap="500">
        {/* Marketplace Settings */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Marketplace Settings
              </Text>
              <Button 
                icon={ImportIcon} 
                onClick={handleCsvModalOpen}
                variant="secondary"
              >
                Bulk Update Products
              </Button>
            </InlineStack>

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

        {/* Add bottom spacing to match Shopify admin UI */}
        <Box paddingBlockEnd="600">
          {/* This provides the standard 24px bottom spacing using Polaris tokens */}
        </Box>
      </BlockStack>
    </Page>
  );
};

export default Settings;
