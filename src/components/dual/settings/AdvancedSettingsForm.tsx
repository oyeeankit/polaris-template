import React from 'react';
import { 
  Card, 
  Text, 
  BlockStack, 
  FormLayout, 
  TextField, 
  Button,
  Box,
  TextContainer,
  InlineStack,
  Link
} from '@shopify/polaris';

const AdvancedSettingsForm: React.FC = () => {
  const [blacklistSelectors, setBlacklistSelectors] = React.useState('');
  const [cssSelector, setCssSelector] = React.useState('');

  const handleBlacklistSelectorsChange = (value: string) => {
    setBlacklistSelectors(value);
  };

  const handleCssSelectorChange = (value: string) => {
    setCssSelector(value);
  };

  const handleSave = () => {
    // Save advanced settings logic would go here
    console.log('Advanced settings saved:', {
      blacklistSelectors,
      cssSelector
    });
  };

  return (
    <Card>
      <BlockStack gap="500">
        <TextContainer>
          <Text as="h2" variant="headingMd">Advanced Configuration</Text>
        </TextContainer>

        <Box paddingBlockEnd="400">
          {/* Blacklist Selectors Field */}
          <div style={{ display: 'flex', marginBottom: '24px', alignItems: 'flex-start' }}>
            <div style={{ width: '250px' }}>
              <div>
                <Text as="span" variant="bodyMd">Blacklist Selectors</Text>
              </div>
              <div>
                <Link url="#" monochrome removeUnderline>
                  <Text as="span" variant="bodyMd" tone="subdued">Know More</Text>
                </Link>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <TextField
                placeholder=".selector1, #selector2, ..."
                value={blacklistSelectors}
                onChange={handleBlacklistSelectorsChange}
                autoComplete="off"
                label=""
                labelHidden
              />
            </div>
          </div>

          {/* Dual price not visible Field */}
          <div style={{ display: 'flex', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ width: '250px' }}>
              <Text as="p" variant="bodyMd">Dual price not visible on certain pages?</Text>
            </div>
            <div style={{ flex: 1 }}>
              <TextField
                placeholder="Enter the class name/CSS selector where you get product details"
                value={cssSelector}
                onChange={handleCssSelectorChange}
                autoComplete="off"
                label=""
                labelHidden
              />
            </div>
          </div>
        </Box>

        <Box paddingBlockStart="400">
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </div>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default AdvancedSettingsForm;
