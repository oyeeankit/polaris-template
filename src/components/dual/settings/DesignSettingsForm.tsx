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
  TextContainer,
  ColorPicker,
  RangeSlider,
  Checkbox
} from '@shopify/polaris';

const DesignSettingsForm: React.FC = () => {
  const [primaryColor, setPrimaryColor] = React.useState({
    hue: 215,
    brightness: 1,
    saturation: 1,
    alpha: 1
  });
  const [secondaryColor, setSecondaryColor] = React.useState({
    hue: 250,
    brightness: 1,
    saturation: 0.7,
    alpha: 1
  });
  const [fontFamily, setFontFamily] = React.useState('system');
  const [fontSize, setFontSize] = React.useState(16);
  const [borderRadius, setBorderRadius] = React.useState(4);
  const [enableDarkMode, setEnableDarkMode] = React.useState(false);

  const handlePrimaryColorChange = (color: {hue: number, brightness: number, saturation: number, alpha: number}) => {
    setPrimaryColor(color);
  };

  const handleSecondaryColorChange = (color: {hue: number, brightness: number, saturation: number, alpha: number}) => {
    setSecondaryColor(color);
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
  };

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
  };

  const handleBorderRadiusChange = (value: number) => {
    setBorderRadius(value);
  };

  const handleEnableDarkModeChange = (value: boolean) => {
    setEnableDarkMode(value);
  };

  const handleSave = () => {
    // Save design settings logic would go here
    console.log('Design settings saved:', {
      primaryColor,
      secondaryColor,
      fontFamily,
      fontSize,
      borderRadius,
      enableDarkMode
    });
  };

  return (
    <Card>
      <BlockStack gap="500">
        <TextContainer>
          <Text as="h2" variant="headingMd">Design Configuration</Text>
          <Text as="p" variant="bodyMd">
            Customize the appearance of your application.
          </Text>
        </TextContainer>

        <FormLayout>
          <Box paddingBlockEnd="400">
            <Text as="h3" variant="headingMd">Primary Color</Text>
            <Box maxWidth="100%" overflowX="scroll" paddingBlockStart="200">
              <ColorPicker onChange={handlePrimaryColorChange} color={primaryColor} />
            </Box>
          </Box>

          <Box paddingBlockEnd="400">
            <Text as="h3" variant="headingMd">Secondary Color</Text>
            <Box maxWidth="100%" overflowX="scroll" paddingBlockStart="200">
              <ColorPicker onChange={handleSecondaryColorChange} color={secondaryColor} />
            </Box>
          </Box>

          <Select
            label="Font Family"
            options={[
              { label: 'System Default', value: 'system' },
              { label: 'Arial', value: 'arial' },
              { label: 'Helvetica', value: 'helvetica' },
              { label: 'Georgia', value: 'georgia' },
              { label: 'Times New Roman', value: 'times' }
            ]}
            value={fontFamily}
            onChange={handleFontFamilyChange}
          />

          <RangeSlider
            label="Font Size (px)"
            value={fontSize}
            onChange={handleFontSizeChange}
            min={12}
            max={24}
            output
          />

          <RangeSlider
            label="Border Radius (px)"
            value={borderRadius}
            onChange={handleBorderRadiusChange}
            min={0}
            max={16}
            output
          />

          <Checkbox
            label="Enable Dark Mode"
            checked={enableDarkMode}
            onChange={handleEnableDarkModeChange}
          />
        </FormLayout>

        <Box paddingBlockStart="400">
          <Button variant="primary" onClick={handleSave}>Save Design Settings</Button>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default DesignSettingsForm;
