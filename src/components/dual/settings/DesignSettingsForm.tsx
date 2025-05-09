import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Text, 
  BlockStack, 
  FormLayout, 
  TextField, 
  Select, 
  Button,
  Box,
  InlineGrid,
  Popover,
  ColorPicker,
  Divider,
  InlineStack
} from '@shopify/polaris';

const DesignSettingsForm: React.FC = () => {
  // Tax Included Price Font Size
  const [taxIncludedHomeFontSize, setTaxIncludedHomeFontSize] = useState('7px');
  const [taxIncludedCollectionFontSize, setTaxIncludedCollectionFontSize] = useState('7px');
  const [taxIncludedProductFontSize, setTaxIncludedProductFontSize] = useState('7px');
  
  // Tax Included Label
  const [taxIncludedLabel, setTaxIncludedLabel] = useState('Tax Inclu.');
  
  // Tax Included Label Font Size
  const [taxIncludedLabelHomeFontSize, setTaxIncludedLabelHomeFontSize] = useState('7px');
  const [taxIncludedLabelCollectionFontSize, setTaxIncludedLabelCollectionFontSize] = useState('7px');
  const [taxIncludedLabelProductFontSize, setTaxIncludedLabelProductFontSize] = useState('7px');
  
  // Tax Included Price Color
  const [taxIncludedPriceColor, setTaxIncludedPriceColor] = useState({
    hue: 0,
    brightness: 0,
    saturation: 0,
    alpha: 1
  });
  
  // Tax Excluded Price Font Size
  const [taxExcludedHomeFontSize, setTaxExcludedHomeFontSize] = useState('7px');
  const [taxExcludedCollectionFontSize, setTaxExcludedCollectionFontSize] = useState('7px');
  const [taxExcludedProductFontSize, setTaxExcludedProductFontSize] = useState('7px');
  
  // Tax Excluded Label
  const [taxExcludedLabel, setTaxExcludedLabel] = useState('Tax Exclu.');
  
  // Tax Excluded Label Font Size
  const [taxExcludedLabelHomeFontSize, setTaxExcludedLabelHomeFontSize] = useState('7px');
  const [taxExcludedLabelCollectionFontSize, setTaxExcludedLabelCollectionFontSize] = useState('7px');
  const [taxExcludedLabelProductFontSize, setTaxExcludedLabelProductFontSize] = useState('7px');
  
  // Tax Excluded Price Color
  const [taxExcludedPriceColor, setTaxExcludedPriceColor] = useState({
    hue: 0,
    brightness: 0,
    saturation: 0,
    alpha: 1
  });

  // Color picker popovers
  const [taxIncludedColorPopoverActive, setTaxIncludedColorPopoverActive] = useState(false);
  const [taxExcludedColorPopoverActive, setTaxExcludedColorPopoverActive] = useState(false);

  const toggleTaxIncludedColorPopover = useCallback(
    () => setTaxIncludedColorPopoverActive((active) => !active),
    [],
  );

  const toggleTaxExcludedColorPopover = useCallback(
    () => setTaxExcludedColorPopoverActive((active) => !active),
    [],
  );

  const fontSizeOptions = [
    { label: '7px', value: '7px' },
    { label: '8px', value: '8px' },
    { label: '9px', value: '9px' },
    { label: '10px', value: '10px' },
    { label: '11px', value: '11px' },
    { label: '12px', value: '12px' },
    { label: '13px', value: '13px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
  ];

  const handleSave = () => {
    // Save design settings logic would go here
    console.log('Design settings saved:', {
      taxIncludedPriceFontSizes: {
        home: taxIncludedHomeFontSize,
        collection: taxIncludedCollectionFontSize,
        product: taxIncludedProductFontSize
      },
      taxIncludedLabel,
      taxIncludedLabelFontSizes: {
        home: taxIncludedLabelHomeFontSize,
        collection: taxIncludedLabelCollectionFontSize,
        product: taxIncludedLabelProductFontSize
      },
      taxIncludedPriceColor,
      taxExcludedPriceFontSizes: {
        home: taxExcludedHomeFontSize,
        collection: taxExcludedCollectionFontSize,
        product: taxExcludedProductFontSize
      },
      taxExcludedLabel,
      taxExcludedLabelFontSizes: {
        home: taxExcludedLabelHomeFontSize,
        collection: taxExcludedLabelCollectionFontSize,
        product: taxExcludedLabelProductFontSize
      },
      taxExcludedPriceColor
    });
  };

  // Helper function to render color preview
  const renderColorPreview = (color: {hue: number, brightness: number, saturation: number, alpha: number}) => {
    const hsbColor = `hsla(${color.hue}, ${color.saturation * 100}%, ${color.brightness * 100}%, ${color.alpha})`;
    return (
      <div 
        style={{
          backgroundColor: hsbColor,
          width: '24px',
          height: '24px',
          borderRadius: '3px',
          border: '1px solid #ddd'
        }}
      />
    );
  };

  return (
    <Card>
      <BlockStack gap="500">
        <FormLayout>
          {/* Tax Included Price Font Size */}
          <Box paddingBlockEnd="400">
            <Text as="h3" variant="headingMd">Tax Included Price Font Size</Text>
            <Divider />
            <Box paddingBlockStart="300">
              <InlineGrid columns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap="300">
                <Box>
                  <Text as="p" variant="bodyMd">Home Page</Text>
                  <Select
                    label="Home Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxIncludedHomeFontSize}
                    onChange={setTaxIncludedHomeFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Collection Page</Text>
                  <Select
                    label="Collection Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxIncludedCollectionFontSize}
                    onChange={setTaxIncludedCollectionFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Product Page</Text>
                  <Select
                    label="Product Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxIncludedProductFontSize}
                    onChange={setTaxIncludedProductFontSize}
                  />
                </Box>
              </InlineGrid>
            </Box>
          </Box>

          {/* Tax Included Label */}
          <Box paddingBlockEnd="400">
            <InlineGrid columns={{ xs: '1fr', sm: '1fr 2fr' }} gap="400">
              <Box>
                <Text as="h3" variant="headingMd">Tax included Label</Text>
              </Box>
              <Box>
                <TextField
                  label="Tax included Label"
                  labelHidden
                  value={taxIncludedLabel}
                  onChange={setTaxIncludedLabel}
                  autoComplete="off"
                  helpText="Upto 100 Characters only and Numeric Values not are accepted"
                />
              </Box>
            </InlineGrid>
          </Box>

          {/* Tax Included Label Font Size */}
          <Box paddingBlockEnd="400">
            <Text as="h3" variant="headingMd">Tax Included Label Font Size</Text>
            <Divider />
            <Box paddingBlockStart="300">
              <InlineGrid columns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap="300">
                <Box>
                  <Text as="p" variant="bodyMd">Home Page</Text>
                  <Select
                    label="Home Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxIncludedLabelHomeFontSize}
                    onChange={setTaxIncludedLabelHomeFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Collection Page</Text>
                  <Select
                    label="Collection Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxIncludedLabelCollectionFontSize}
                    onChange={setTaxIncludedLabelCollectionFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Product Page</Text>
                  <Select
                    label="Product Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxIncludedLabelProductFontSize}
                    onChange={setTaxIncludedLabelProductFontSize}
                  />
                </Box>
              </InlineGrid>
            </Box>
          </Box>

          {/* Tax included Price Color */}
          <Box paddingBlockEnd="400">
            <InlineGrid columns={{ xs: '1fr', sm: '1fr 2fr' }} gap="400">
              <Box>
                <Text as="h3" variant="headingMd">Tax included Price Color</Text>
              </Box>
              <Box>
                <Popover
                  active={taxIncludedColorPopoverActive}
                  activator={
                    <Button onClick={toggleTaxIncludedColorPopover}>
                      Select color
                    </Button>
                  }
                  onClose={toggleTaxIncludedColorPopover}
                >
                  <Popover.Pane>
                    <Box padding="400">
                      <ColorPicker onChange={setTaxIncludedPriceColor} color={taxIncludedPriceColor} />
                    </Box>
                  </Popover.Pane>
                </Popover>
                <Box paddingBlockStart="200">
                  <InlineStack gap="200" align="center">
                    {renderColorPreview(taxIncludedPriceColor)}
                    <Text as="span" variant="bodyMd">Selected color</Text>
                  </InlineStack>
                </Box>
              </Box>
            </InlineGrid>
          </Box>

          {/* Tax Excluded Price Font Size */}
          <Box paddingBlockEnd="400">
            <Text as="h3" variant="headingMd">Tax Excluded Price Font Size</Text>
            <Divider />
            <Box paddingBlockStart="300">
              <InlineGrid columns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap="300">
                <Box>
                  <Text as="p" variant="bodyMd">Home Page</Text>
                  <Select
                    label="Home Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxExcludedHomeFontSize}
                    onChange={setTaxExcludedHomeFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Collection Page</Text>
                  <Select
                    label="Collection Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxExcludedCollectionFontSize}
                    onChange={setTaxExcludedCollectionFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Product Page</Text>
                  <Select
                    label="Product Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxExcludedProductFontSize}
                    onChange={setTaxExcludedProductFontSize}
                  />
                </Box>
              </InlineGrid>
            </Box>
          </Box>

          {/* Tax Excluded Label */}
          <Box paddingBlockEnd="400">
            <InlineGrid columns={{ xs: '1fr', sm: '1fr 2fr' }} gap="400">
              <Box>
                <Text as="h3" variant="headingMd">Tax Excluded Label</Text>
              </Box>
              <Box>
                <TextField
                  label="Tax Excluded Label"
                  labelHidden
                  value={taxExcludedLabel}
                  onChange={setTaxExcludedLabel}
                  autoComplete="off"
                  helpText="Upto 100 Characters only and Numeric Values not are accepted"
                />
              </Box>
            </InlineGrid>
          </Box>

          {/* Tax Excluded Label Font Size */}
          <Box paddingBlockEnd="400">
            <Text as="h3" variant="headingMd">Tax Excluded Label Font Size</Text>
            <Divider />
            <Box paddingBlockStart="300">
              <InlineGrid columns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap="300">
                <Box>
                  <Text as="p" variant="bodyMd">Home Page</Text>
                  <Select
                    label="Home Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxExcludedLabelHomeFontSize}
                    onChange={setTaxExcludedLabelHomeFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Collection Page</Text>
                  <Select
                    label="Collection Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxExcludedLabelCollectionFontSize}
                    onChange={setTaxExcludedLabelCollectionFontSize}
                  />
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd">Product Page</Text>
                  <Select
                    label="Product Page"
                    labelHidden
                    options={fontSizeOptions}
                    value={taxExcludedLabelProductFontSize}
                    onChange={setTaxExcludedLabelProductFontSize}
                  />
                </Box>
              </InlineGrid>
            </Box>
          </Box>

          {/* Tax excluded Price Color */}
          <Box paddingBlockEnd="400">
            <InlineGrid columns={{ xs: '1fr', sm: '1fr 2fr' }} gap="400">
              <Box>
                <Text as="h3" variant="headingMd">Tax excluded Price Color</Text>
              </Box>
              <Box>
                <Popover
                  active={taxExcludedColorPopoverActive}
                  activator={
                    <Button onClick={toggleTaxExcludedColorPopover}>
                      Select color
                    </Button>
                  }
                  onClose={toggleTaxExcludedColorPopover}
                >
                  <Popover.Pane>
                    <Box padding="400">
                      <ColorPicker onChange={setTaxExcludedPriceColor} color={taxExcludedPriceColor} />
                    </Box>
                  </Popover.Pane>
                </Popover>
                <Box paddingBlockStart="200">
                  <InlineStack gap="200" align="center">
                    {renderColorPreview(taxExcludedPriceColor)}
                    <Text as="span" variant="bodyMd">Selected color</Text>
                  </InlineStack>
                </Box>
              </Box>
            </InlineGrid>
          </Box>
        </FormLayout>

        <Box paddingBlockStart="400">
          <Button variant="primary" onClick={handleSave}>Save Design Settings</Button>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default DesignSettingsForm;
