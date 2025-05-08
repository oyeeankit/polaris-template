import React from 'react';
import { 
  Card, 
  Text, 
  BlockStack, 
  FormLayout, 
  TextField, 
  Select, 
  Checkbox, 
  Button,
  Box,
  TextContainer,
  ChoiceList
} from '@shopify/polaris';

const AdvancedSettingsForm: React.FC = () => {
  const [apiKey, setApiKey] = React.useState('');
  const [cacheTimeout, setCacheTimeout] = React.useState('60');
  const [logLevel, setLogLevel] = React.useState(['info']);
  const [enableDebugMode, setEnableDebugMode] = React.useState(false);
  const [enableBetaFeatures, setEnableBetaFeatures] = React.useState(false);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
  };

  const handleCacheTimeoutChange = (value: string) => {
    setCacheTimeout(value);
  };

  const handleLogLevelChange = (value: string[]) => {
    setLogLevel(value);
  };

  const handleEnableDebugModeChange = (value: boolean) => {
    setEnableDebugMode(value);
  };

  const handleEnableBetaFeaturesChange = (value: boolean) => {
    setEnableBetaFeatures(value);
  };

  const handleSave = () => {
    // Save advanced settings logic would go here
    console.log('Advanced settings saved:', {
      apiKey,
      cacheTimeout,
      logLevel,
      enableDebugMode,
      enableBetaFeatures
    });
  };

  return (
    <Card>
      <BlockStack gap="500">
        <TextContainer>
          <Text as="h2" variant="headingMd">Advanced Configuration</Text>
          <Text as="p" variant="bodyMd">
            Configure advanced settings for your application.
          </Text>
        </TextContainer>

        <FormLayout>
          <TextField
            label="API Key"
            type="text"
            value={apiKey}
            onChange={handleApiKeyChange}
            autoComplete="off"
            helpText="Your API key for external integrations."
          />

          <TextField
            label="Cache Timeout (minutes)"
            type="number"
            value={cacheTimeout}
            onChange={handleCacheTimeoutChange}
            autoComplete="off"
            helpText="How long to cache data before refreshing."
          />

          <Box paddingBlockEnd="400">
            <ChoiceList
              title="Log Level"
              choices={[
                {label: 'Error', value: 'error'},
                {label: 'Warning', value: 'warning'},
                {label: 'Info', value: 'info'},
                {label: 'Debug', value: 'debug'},
              ]}
              selected={logLevel}
              onChange={handleLogLevelChange}
            />
          </Box>

          <Checkbox
            label="Enable Debug Mode"
            checked={enableDebugMode}
            onChange={handleEnableDebugModeChange}
            helpText="Show additional debugging information in the console."
          />

          <Checkbox
            label="Enable Beta Features"
            checked={enableBetaFeatures}
            onChange={handleEnableBetaFeaturesChange}
            helpText="Enable experimental features that are still in development."
          />
        </FormLayout>

        <Box paddingBlockStart="400">
          <Button variant="primary" onClick={handleSave}>Save Advanced Settings</Button>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default AdvancedSettingsForm;
