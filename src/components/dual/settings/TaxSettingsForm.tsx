import React from 'react';
import { 
  Card, 
  Text, 
  BlockStack, 
  FormLayout, 
  TextField, 
  Select, 
  Button,
  Box,
  InlineStack,
  Link
} from '@shopify/polaris';

const TaxSettingsForm: React.FC = () => {
  // State for all form fields
  const [taxInclusive, setTaxInclusive] = React.useState('no');
  const [taxRate, setTaxRate] = React.useState('19');
  const [showDualPrice, setShowDualPrice] = React.useState('no');
  const [showPrice, setShowPrice] = React.useState('only_tax_excluded');
  const [marginBetweenPrice, setMarginBetweenPrice] = React.useState('5px');
  const [priceToShowFirst, setPriceToShowFirst] = React.useState('tax_excluded');
  const [showComparePrice, setShowComparePrice] = React.useState('no');
  const [roundOffPrice, setRoundOffPrice] = React.useState('no');

  // Handle changes for all form fields
  const handleTaxInclusiveChange = (value: string) => setTaxInclusive(value);
  const handleTaxRateChange = (value: string) => setTaxRate(value);
  const handleShowDualPriceChange = (value: string) => setShowDualPrice(value);
  const handleShowPriceChange = (value: string) => setShowPrice(value);
  const handleMarginBetweenPriceChange = (value: string) => setMarginBetweenPrice(value);
  const handlePriceToShowFirstChange = (value: string) => setPriceToShowFirst(value);
  const handleShowComparePriceChange = (value: string) => setShowComparePrice(value);
  const handleRoundOffPriceChange = (value: string) => setRoundOffPrice(value);

  const handleSave = () => {
    // Save tax settings logic would go here
    console.log('Tax settings saved:', {
      taxInclusive,
      taxRate,
      showDualPrice,
      showPrice,
      marginBetweenPrice,
      priceToShowFirst,
      showComparePrice,
      roundOffPrice
    });
  };

  // Options for select fields
  const yesNoOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  const showPriceOptions = [
    { label: 'Only Tax Excluded Price', value: 'only_tax_excluded' },
    { label: 'Only Tax Included Price', value: 'only_tax_included' },
    { label: 'Both Prices', value: 'both' }
  ];

  const marginOptions = [
    { label: '5px', value: '5px' },
    { label: '10px', value: '10px' },
    { label: '15px', value: '15px' },
    { label: '20px', value: '20px' }
  ];

  const priceToShowFirstOptions = [
    { label: 'Tax excluded', value: 'tax_excluded' },
    { label: 'Tax included', value: 'tax_included' }
  ];

  return (
    <Card>
      <BlockStack gap="500">
        <div style={{ 
          padding: 'var(--p-space-400)',
          borderBottom: '1px solid var(--p-border-subdued)'
        }}>
          <Text as="h2" variant="headingMd" fontWeight="bold">1. Options</Text>
        </div>

        <Box paddingInlineStart="400" paddingInlineEnd="400">
          <FormLayout>
            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Tax inclusive in Products Base price</Text>
                </Box>
                <Box width="300px">
                  <Select
                    options={yesNoOptions}
                    value={taxInclusive}
                    onChange={handleTaxInclusiveChange}
                    labelHidden
                    label="Tax inclusive in Products Base price"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>

            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Tax rate (%)</Text>
                  <Box paddingBlockStart="100">
                    <Link url="#" monochrome removeUnderline>Know More</Link>
                  </Box>
                </Box>
                <Box width="300px">
                  <TextField
                    type="text"
                    value={taxRate}
                    onChange={handleTaxRateChange}
                    autoComplete="off"
                    labelHidden
                    label="Tax rate"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>

            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Show Dual price only for taxable products</Text>
                  <Box paddingBlockStart="100">
                    <Link url="#" monochrome removeUnderline>Know More</Link>
                  </Box>
                </Box>
                <Box width="300px">
                  <Select
                    options={yesNoOptions}
                    value={showDualPrice}
                    onChange={handleShowDualPriceChange}
                    labelHidden
                    label="Show Dual price only for taxable products"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>

            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Show Price</Text>
                </Box>
                <Box width="300px">
                  <Select
                    options={showPriceOptions}
                    value={showPrice}
                    onChange={handleShowPriceChange}
                    labelHidden
                    label="Show Price"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>

            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Margin between price</Text>
                </Box>
                <Box width="300px">
                  <Select
                    options={marginOptions}
                    value={marginBetweenPrice}
                    onChange={handleMarginBetweenPriceChange}
                    labelHidden
                    label="Margin between price"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>

            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Which price to show first ?</Text>
                </Box>
                <Box width="300px">
                  <Select
                    options={priceToShowFirstOptions}
                    value={priceToShowFirst}
                    onChange={handlePriceToShowFirstChange}
                    labelHidden
                    label="Which price to show first"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>

            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Show Compare Price</Text>
                </Box>
                <Box width="300px">
                  <Select
                    options={yesNoOptions}
                    value={showComparePrice}
                    onChange={handleShowComparePriceChange}
                    labelHidden
                    label="Show Compare Price"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>

            <FormLayout.Group condensed>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Box width="300px">
                  <Text as="span" variant="bodyMd">Round off price</Text>
                </Box>
                <Box width="300px">
                  <Select
                    options={yesNoOptions}
                    value={roundOffPrice}
                    onChange={handleRoundOffPriceChange}
                    labelHidden
                    label="Round off price"
                  />
                </Box>
              </InlineStack>
            </FormLayout.Group>
          </FormLayout>
        </Box>

        <Box paddingBlockStart="400" paddingInlineStart="400" paddingInlineEnd="400" paddingBlockEnd="400">
            <InlineStack align="end">
              <Button variant="primary" onClick={handleSave}>Save</Button>
            </InlineStack>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default TaxSettingsForm;
