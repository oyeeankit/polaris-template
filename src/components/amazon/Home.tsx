import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Modal,
  IndexTable,
  Badge,
  ButtonGroup,
  TextField,
  Tabs,
  Select,
  Filters,
  Checkbox,
  FormLayout,
  InlineStack,
  Thumbnail,
  Pagination,
  useBreakpoints,
  Box,
  Icon,
  ActionList,
  Popover,
  Toast,
  Link
} from '@shopify/polaris';
import { EditIcon, XIcon, SearchIcon, AlertBubbleIcon, SaveIcon } from '@shopify/polaris-icons';

// Define product types
type AmazonDomain = 'amazon.com' | 'amazon.ca' | 'amazon.co.uk' | 'amazon.de' | 'amazon.fr' | 
                   'amazon.com.mx' | 'amazon.com.br' | 'amazon.it' | 'amazon.es' | 'amazon.nl' |
                   'amazon.pl' | 'amazon.se' | 'amazon.com.tr' | 'amazon.ae' | 'amazon.sa' |
                   'amazon.in' | 'amazon.co.jp' | 'amazon.sg' | 'amazon.com.au';
type ProductStatus = 'active' | 'inactive';

type RegionStatus = {
  [domain in AmazonDomain]: ProductStatus;
};

// Helper function to create a default RegionStatus object with all regions inactive
const createDefaultRegionStatus = (): RegionStatus => {
  return {
    'amazon.com': 'inactive',
    'amazon.ca': 'inactive',
    'amazon.co.uk': 'inactive',
    'amazon.de': 'inactive',
    'amazon.fr': 'inactive',
    'amazon.it': 'inactive',
    'amazon.es': 'inactive',
    'amazon.nl': 'inactive',
    'amazon.pl': 'inactive',
    'amazon.se': 'inactive',
    'amazon.com.tr': 'inactive',
    'amazon.ae': 'inactive',
    'amazon.sa': 'inactive',
    'amazon.in': 'inactive',
    'amazon.co.jp': 'inactive',
    'amazon.com.mx': 'inactive',
    'amazon.com.br': 'inactive',
    'amazon.com.au': 'inactive',
    'amazon.sg': 'inactive'
  };
};
  
// Define the Product interface if not already defined
interface Product {
  id: string;
  title: string;
  image: string;
  clicks: number;
  asin: string;
  keywords: string;
  customLink: string;
  regionStatus: RegionStatus;
}
  
// Define ProductWithRegionStatus interface
interface ProductWithRegionStatus extends Product {
  regionStatus: { [key in AmazonDomain]: ProductStatus };
}
  
// Define LegacyProduct interface for backward compatibility
interface LegacyProduct extends Product {
  status: ProductStatus;
}

// Helper function to get region-specific data for a product and domain
const getRegionSpecificData = (
  product: any, 
  domain: string
): { asin: string; keywords: string; customLink: string; status: string } => {
  // Check if product has regionData property and data for this domain
  if (product.regionData && product.regionData[domain]) {
    return {
      asin: product.regionData[domain].asin || '-',
      keywords: product.regionData[domain].keywords || '-',
      customLink: product.regionData[domain].customLink || '-',
      status: product.regionData[domain].status || 'inactive'
    };
  }
  
  // Otherwise, fall back to global product data
  let status = 'inactive';
  if (product.regionStatus && product.regionStatus[domain]) {
    status = product.regionStatus[domain as AmazonDomain];
  } else if (product.status) {
    status = product.status;
  }
  
  return {
    asin: product.asin || '-',
    keywords: product.keywords || '-',
    customLink: product.customLink || '-',
    status: status
  };
};

// Enhanced product interface with region-specific data
interface RegionSpecificData {
  asin: string;
  keywords: string;
  customLink: string;
  status: ProductStatus;
}

// Enhanced product that stores data per region
interface ProductWithRegionData {
  id: string;
  title: string;
  image: string;
  clicks: number;
  regionData: {
    [domain in AmazonDomain]?: RegionSpecificData;
  };
}

const AmazonBuyButtonDashboard = () => {
  const [selectedAmazonDomain, setSelectedAmazonDomain] = useState('amazon.com');
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectProductsModalOpen, setSelectProductsModalOpen] = useState(false);
  const [selectedProductsForAdd, setSelectedProductsForAdd] = useState<string[]>([]);
  const [productSearchValue, setProductSearchValue] = useState('');
  const [searchBy, setSearchBy] = useState('all');
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<Record<string, string[]>>({
    Vendor: [],
    'Product type': [],
    Availability: [],
    Category: [],
    Collection: [],
    SKU: []
  });
  const [currentFilterCategory, setCurrentFilterCategory] = useState<string | null>(null);
  const [filterPopoverActive, setFilterPopoverActive] = useState(false);
  const [valuePopoverActive, setValuePopoverActive] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  // Toast state and handlers
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState(false);
  
  // Function to show toast message
  const showToast = useCallback((message: string, isError = false) => {
    setToastMessage(message);
    setToastError(isError);
    setToastActive(true);
    
    // Auto-dismiss toast after 3 seconds
    setTimeout(() => {
      setToastActive(false);
    }, 3000);
  }, []);
  
  const handleToastDismiss = useCallback(() => setToastActive(false), []);
  
  // Add view modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  
  // State for inline editing fields in the view modal - region-specific data
  const [editingFields, setEditingFields] = useState<{
    [domain: string]: {
      asin: string;
      keywords: string;
      customLink: string;
    }
  }>({});
  
  // Single editForm state declaration
  const [editForm, setEditForm] = useState({
    asin: '',
    customLink: '',
    keywords: '',
    hideOtherBuyButtons: false,
    improveSearchRanking: false,
  });
  
  const [showWelcomeCard, setShowWelcomeCard] = useState(() => {
    // Check localStorage to see if user has previously hidden the welcome card
    const storedPreference = localStorage.getItem('linkr_hideWelcomeCard');
    return storedPreference !== 'true'; // Show card by default unless explicitly hidden
  });
  
  // Sample available products for selection with additional filter properties
  const availableProducts = [
    { id: '1001', name: 'Wireless Bluetooth Headphones', price: 79.99, image: 'https://via.placeholder.com/150', vendor: 'TechCorp', productType: 'Electronics', availability: 'In stock', category: 'Audio & Music', collection: 'Tech Essentials', sku: 'TC-WBH-001', tags: ['wireless', 'bluetooth', 'audio'] },
    { id: '1002', name: 'Smartphone Case - Clear', price: 15.99, image: 'https://via.placeholder.com/150', vendor: 'AccessoryPro', productType: 'Accessories', availability: 'In stock', category: 'Phone Accessories', collection: 'Mobile Protection', sku: 'AP-SC-002', tags: ['phone', 'case', 'clear'] },
    { id: '1003', name: 'Portable Charger 10000mAh', price: 29.99, image: 'https://via.placeholder.com/150', vendor: 'PowerTech', productType: 'Electronics', availability: 'Low stock', category: 'Power & Charging', collection: 'Power Solutions', sku: 'PT-PC-003', tags: ['charger', 'portable', 'power'] },
    { id: '1004', name: 'USB-C Cable 6ft', price: 12.99, image: 'https://via.placeholder.com/150', vendor: 'CableCo', productType: 'Accessories', availability: 'In stock', category: 'Cables & Adapters', collection: 'Connectivity', sku: 'CC-UC-004', tags: ['cable', 'usb-c', 'charging'] },
    { id: '1005', name: 'Laptop Stand Adjustable', price: 45.99, image: 'https://via.placeholder.com/150', vendor: 'DeskWare', productType: 'Office', availability: 'In stock', category: 'Desk Accessories', collection: 'Workspace Essentials', sku: 'DW-LS-005', tags: ['laptop', 'stand', 'adjustable'] },
    { id: '1006', name: 'Wireless Mouse', price: 24.99, image: 'https://via.placeholder.com/150', vendor: 'TechCorp', productType: 'Electronics', availability: 'Out of stock', category: 'Computer Accessories', collection: 'Tech Essentials', sku: 'TC-WM-006', tags: ['mouse', 'wireless', 'computer'] },
    { id: '1007', name: 'Bluetooth Speaker', price: 59.99, image: 'https://via.placeholder.com/150', vendor: 'AudioMax', productType: 'Electronics', availability: 'In stock', category: 'Audio & Music', collection: 'Premium Audio', sku: 'AM-BS-007', tags: ['speaker', 'bluetooth', 'audio'] },
    { id: '1008', name: 'Phone Mount for Car', price: 19.99, image: 'https://via.placeholder.com/150', vendor: 'AccessoryPro', productType: 'Automotive', availability: 'In stock', category: 'Car Accessories', collection: 'Mobile Car', sku: 'AP-PM-008', tags: ['phone', 'mount', 'car'] },
    { id: '1009', name: 'Screen Protector 2-Pack', price: 9.99, image: 'https://via.placeholder.com/150', vendor: 'ProtectPlus', productType: 'Accessories', availability: 'In stock', category: 'Phone Accessories', collection: 'Mobile Protection', sku: 'PP-SP-009', tags: ['screen', 'protector', 'phone'] },
    { id: '1010', name: 'Wireless Keyboard', price: 69.99, image: 'https://via.placeholder.com/150', vendor: 'TechCorp', productType: 'Electronics', availability: 'Low stock', category: 'Computer Accessories', collection: 'Tech Essentials', sku: 'TC-WK-010', tags: ['keyboard', 'wireless', 'computer'] },
    { id: '1011', name: 'Gaming Headset', price: 89.99, image: 'https://via.placeholder.com/150', vendor: 'GameGear', productType: 'Gaming', availability: 'In stock', category: 'Gaming Accessories', collection: 'Pro Gaming', sku: 'GG-GH-011', tags: ['gaming', 'headset', 'audio'] },
    { id: '1012', name: 'Webcam HD 1080p', price: 49.99, image: 'https://via.placeholder.com/150', vendor: 'StreamTech', productType: 'Electronics', availability: 'In stock', category: 'Video & Streaming', collection: 'Streaming Setup', sku: 'ST-WC-012', tags: ['webcam', 'hd', 'video'] },
    { id: '1013', name: 'Desk Organizer', price: 34.99, image: 'https://via.placeholder.com/150', vendor: 'DeskWare', productType: 'Office', availability: 'In stock', category: 'Desk Accessories', collection: 'Workspace Essentials', sku: 'DW-DO-013', tags: ['organizer', 'desk', 'office'] },
    { id: '1014', name: 'LED Desk Lamp', price: 39.99, image: 'https://via.placeholder.com/150', vendor: 'LightCo', productType: 'Office', availability: 'Out of stock', category: 'Lighting', collection: 'Office Lighting', sku: 'LC-DL-014', tags: ['lamp', 'led', 'desk'] },
    { id: '1015', name: 'Travel Adapter Universal', price: 22.99, image: 'https://via.placeholder.com/150', vendor: 'TravelTech', productType: 'Travel', availability: 'In stock', category: 'Travel Accessories', collection: 'Travel Essentials', sku: 'TT-TA-015', tags: ['adapter', 'travel', 'universal'] },
  ];

  const itemsPerPage = 10;
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      title: 'Trendy Queen Womens Short Sleeve T Shirts rt Sleeve T Shirts  ',
      image: 'https://example.com/image1.jpg',
      clicks: 0,
      asin: '-',
      keywords: '-',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'inactive',
        'amazon.co.uk': 'active',
        'amazon.de': 'inactive',
        'amazon.fr': 'active',
      },
    },
    {
      id: '2',
      title: '"OCCASIONS" 240 Plates Pack (120 Guests)',
      image: 'https://example.com/image2.jpg',
      clicks: 0,
      asin: '-',
      keywords: '-',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'inactive',
        'amazon.ca': 'active',
        'amazon.co.uk': 'inactive',
        'amazon.de': 'active',
        'amazon.fr': 'inactive',
      },
    },
    {
      id: '3',
      title: 'Wireless Bluetooth Headphones',
      image: 'https://example.com/image3.jpg',
      clicks: 15,
      asin: 'B08EXAMPLE',
      keywords: 'bluetooth, headphones',
      customLink: 'https://custom-link.com',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'active',
        'amazon.co.uk': 'active',
        'amazon.de': 'inactive',
        'amazon.fr': 'active',
      },
    },
    {
      id: '4',
      title: 'Premium Coffee Beans 1lb Bag',
      image: 'https://example.com/image4.jpg',
      clicks: 8,
      asin: '-',
      keywords: 'coffee, premium',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'inactive',
        'amazon.co.uk': 'inactive',
        'amazon.de': 'active',
        'amazon.fr': 'inactive',
      },
    },
    {
      id: '5',
      title: 'Gaming Mouse with RGB Lighting',
      image: 'https://example.com/image5.jpg',
      clicks: 22,
      asin: 'B09GAMING',
      keywords: 'gaming, mouse, RGB',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'inactive',
        'amazon.ca': 'active',
        'amazon.co.uk': 'inactive',
        'amazon.de': 'inactive',
        'amazon.fr': 'active',
      },
    },
    {
      id: '6',
      title: 'Organic Skincare Set',
      image: 'https://example.com/image6.jpg',
      clicks: 5,
      asin: '-',
      keywords: 'skincare, organic',
      customLink: 'https://skincare-link.com',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'active',
        'amazon.co.uk': 'active',
        'amazon.de': 'inactive',
        'amazon.fr': 'active',
      },
    },
    {
      id: '7',
      title: 'Professional Yoga Mat',
      image: 'https://example.com/image7.jpg',
      clicks: 12,
      asin: 'B07YOGAMAT',
      keywords: 'yoga, fitness',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'inactive',
        'amazon.co.uk': 'active',
        'amazon.de': 'inactive',
        'amazon.fr': 'active',
      },
    },
    {
      id: '8',
      title: 'Kitchen Knife Set 5-Piece',
      image: 'https://example.com/image8.jpg',
      clicks: 18,
      asin: '-',
      keywords: 'kitchen, knives',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'inactive',
        'amazon.ca': 'inactive',
        'amazon.co.uk': 'inactive',
        'amazon.de': 'inactive',
        'amazon.fr': 'inactive',
      },
    },
    {
      id: '9',
      title: 'Portable Phone Charger 10000mAh',
      image: 'https://example.com/image9.jpg',
      clicks: 30,
      asin: 'B08CHARGER',
      keywords: 'charger, portable',
      customLink: 'https://charger-link.com',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'active',
        'amazon.co.uk': 'inactive',
        'amazon.de': 'active',
        'amazon.fr': 'active',
      },
    },
    {
      id: '10',
      title: 'LED Desk Lamp with USB Port',
      image: 'https://example.com/image10.jpg',
      clicks: 7,
      asin: '-',
      keywords: 'lamp, LED, desk',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'active',
        'amazon.co.uk': 'active',
        'amazon.de': 'active',
        'amazon.fr': 'inactive',
      },
    },
    {
      id: '11',
      title: 'Waterproof Hiking Backpack',
      image: 'https://example.com/image11.jpg',
      clicks: 14,
      asin: 'B09BACKPACK',
      keywords: 'hiking, backpack',
      customLink: '-',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'inactive',
        'amazon.ca': 'inactive',
        'amazon.co.uk': 'inactive',
        'amazon.de': 'active',
        'amazon.fr': 'active',
      },
    },
    {
      id: '12',
      title: 'Smart Home Security Camera',
      image: 'https://example.com/image12.jpg',
      clicks: 25,
      asin: 'B08SECURITY',
      keywords: 'security, camera, smart',
      customLink: 'https://security-link.com',
      regionStatus: {
        ...createDefaultRegionStatus(),
        'amazon.com': 'active',
        'amazon.ca': 'inactive',
        'amazon.co.uk': 'active',
        'amazon.de': 'active',
        'amazon.fr': 'inactive',
      },
    },
  ]);

  // Add helper function to extract Shopify product ID from internal ID format
  const extractShopifyProductId = (internalId: string) => {
    // If the ID follows the format new_timestamp_originalId
    if (internalId.startsWith('new_')) {
      const parts = internalId.split('_');
      // Return the original ID (the part after the timestamp)
      return parts.slice(2).join('_');
    }
    // If it's already a Shopify product ID
    return internalId;
  };

  // Function to check if a product is already added to the products list
  const isProductAlreadyAdded = useCallback((productId: string, productName: string) => {
    // Check if any product in the products list matches this ID (for newly added products)
    const matchById = products.some(product => product.id.includes(productId));
    
    // Check if any product has a matching title (for products that might have been added differently)
    const matchByTitle = products.some(product => 
      product.title.toLowerCase() === productName.toLowerCase()
    );
    
    return matchById || matchByTitle;
  }, [products]);

  // Add this state declaration near your other state declarations (around line 69)
  const [activeEditingCell, setActiveEditingCell] = useState<string | null>(null);

  // Handle status toggle based on the selected Amazon domain
  const handleStatusToggle = (productId: string) => {
    let updatedStatus = '';
    let productTitle = '';
    
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          // Store product title for toast message
          productTitle = product.title;
          
          // Safe type assertion for selectedAmazonDomain as a key of RegionStatus
          const domain = selectedAmazonDomain as AmazonDomain;
          // Get current status, defaulting to inactive if not set
          const currentStatus = product.regionStatus[domain];
          const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
          // Store the new status for toast message
          updatedStatus = newStatus;
          return { 
            ...product, 
            regionStatus: { 
              ...product.regionStatus, 
              [domain]: newStatus
            } 
          };
        }
        return product;
      })
    );
    
    // Show toast message after status change
    const domain = selectedAmazonDomain.replace('amazon.', '');
    const statusText = updatedStatus === 'active' ? 'enabled' : 'disabled';
    showToast(`Product ${statusText} for ${domain}`, false);
  };

  // Handle edit product
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    
    // Get region-specific data for the currently selected domain
    const regionData = getRegionSpecificData(product, selectedAmazonDomain);
    
    // Check if keywords exist for this region to set improveSearchRanking checkbox
    const hasKeywords = regionData.keywords !== '-' && regionData.keywords !== '';
    
    setEditForm({
      asin: regionData.asin === '-' ? '' : regionData.asin,
      customLink: regionData.customLink === '-' ? '' : regionData.customLink,
      keywords: regionData.keywords === '-' ? '' : regionData.keywords,
      hideOtherBuyButtons: false,
      improveSearchRanking: hasKeywords, // Enable if keywords exist
    });
    setEditModalOpen(true);
  };
  
  // Add view product handler with region-specific data support
  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setViewModalOpen(true);
    
    // Initialize editing fields for all domains with region-specific data
    const initialFields: { [key: string]: { asin: string; keywords: string; customLink: string } } = {};
    
    // For each domain, initialize with the appropriate region-specific data
    domainOptions.forEach(domain => {
      // Get region-specific data using our helper
      const regionData = getRegionSpecificData(product, domain.value);
      
      // Set the initial field values, converting '-' to empty string for better UX
      initialFields[domain.value] = {
        asin: regionData.asin === '-' ? '' : regionData.asin,
        keywords: regionData.keywords === '-' ? '' : regionData.keywords,
        customLink: regionData.customLink === '-' ? '' : regionData.customLink
      };
    });
    
    setEditingFields(initialFields);
    setOriginalEditingFields(JSON.parse(JSON.stringify(initialFields)));
    setHasUnsavedChanges(false);
  };

  // Update close view modal handler
  const handleCloseViewModal = () => {
    // If there are unsaved changes, show a confirmation dialog
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        setViewModalOpen(false);
        setViewingProduct(null);
        setEditingFields({});
        setActiveEditingCell(null);
        setHasUnsavedChanges(false);
      }
    } else {
      setViewModalOpen(false);
      setViewingProduct(null);
      setEditingFields({});
      setActiveEditingCell(null);
    }
  };
  
  // Add state for tracking changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalEditingFields, setOriginalEditingFields] = useState<{
    [key: string]: {
      asin: string;
      keywords: string;
      customLink: string;
    }
  }>({});
  
  // Add a custom inline editable cell component that only shows input when active
  const InlineEditableCell = ({ 
    value, 
    onChange, 
    placeholder, 
    minWidth = '120px',
    isActive = false,
    onFocus,
    onBlur
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    minWidth?: string;
    isActive?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
  }) => {
    // Use fixed dimensions to ensure absolutely no layout shifts
    const commonStyles = {
      minWidth,
      maxWidth: minWidth,
      width: minWidth,
      height: '32px', // Reduced height
      padding: '0px',
      margin: '0px',
      boxSizing: 'border-box' as 'border-box',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative' as 'relative',
    };

    if (isActive) {
      return (
        <div style={{
          ...commonStyles,
          border: '1px solid #008060',
        }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            autoFocus
            onBlur={onBlur}
            style={{
              width: '100%',
              height: '30px', // Reduced height to fit inside container
              padding: '0 6px', // Reduced padding
              margin: '0px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px', // Smaller font size
              lineHeight: '1.4',
              boxSizing: 'border-box',
            }}
          />
        </div>
      );
    } else {
      return (
        <div 
          style={{
            ...commonStyles,
            cursor: 'pointer',
            border: '1px solid transparent',
            padding: '0 6px', // Reduced padding
          }}
          onClick={onFocus}
        >
          <div style={{ 
            width: '100%', 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '13px', // Smaller font size
          }}>
            {value || <span style={{ color: '#8C9196' }}>{placeholder}</span>}
          </div>
        </div>
      );
    }
  };

  // Update inline field updates to track changes
  const handleInlineFieldUpdate = (domain: string, field: 'asin' | 'keywords' | 'customLink', value: string) => {
    setEditingFields(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [field]: value
      }
    }));
    
    setHasUnsavedChanges(true);
  };

  // Save changes handler with region-specific data support
  const handleSaveViewChanges = () => {
    if (viewingProduct) {
      // Update products with region-specific data
      setProducts(prevProducts => 
        prevProducts.map(product => {
          if (product.id === viewingProduct.id) {
            // Create a new product object with the updated values
            const updatedProduct = { ...product };
            
            // Convert the existing product to support region-specific data if needed
            if (!('regionData' in updatedProduct)) {
              // Add regionData property to store region-specific information
              (updatedProduct as any).regionData = {};
            }
            
            // For each domain in the editing fields, update the corresponding region data
            Object.keys(editingFields).forEach(domain => {
              const domainData = editingFields[domain];
              
              // Ensure regionData exists for this domain
              if (!(updatedProduct as any).regionData[domain]) {
                (updatedProduct as any).regionData[domain] = {};
              }
              
              // Always get the latest status from the viewing product's regionStatus first (which gets updated by toggle)
              // and then fall back to regionData if needed
              const status = 'regionStatus' in viewingProduct 
                ? viewingProduct.regionStatus[domain as AmazonDomain]
                : (viewingProduct as any).regionData && 
                  (viewingProduct as any).regionData[domain] && 
                  (viewingProduct as any).regionData[domain].status
                  ? (viewingProduct as any).regionData[domain].status
                  : 'inactive';
                
              // Update the region-specific data
              (updatedProduct as any).regionData[domain] = {
                asin: domainData.asin || '-',
                keywords: domainData.keywords || '-',
                customLink: domainData.customLink || '-',
                status: status
              };
            });
            
            // Also update region status if available from the viewing product
            if ('regionStatus' in viewingProduct) {
              if (!('regionStatus' in updatedProduct)) {
                (updatedProduct as any).regionStatus = {};
              }
              
              // Make sure to copy ALL region statuses from the viewing product
              (updatedProduct as any).regionStatus = {
                ...(updatedProduct as any).regionStatus,
                ...viewingProduct.regionStatus
              };
              
              console.log('Saving updated region statuses:', viewingProduct.regionStatus);
            }
            
            // Keep global values as the currently selected domain's values for backward compatibility
            const currentDomain = selectedAmazonDomain;
            const currentDomainData = editingFields[currentDomain];
            if (currentDomainData) {
              updatedProduct.asin = currentDomainData.asin || '-';
              updatedProduct.keywords = currentDomainData.keywords || '-';
              updatedProduct.customLink = currentDomainData.customLink || '-';
            }
            
            return updatedProduct;
          }
          return product;
        })
      );

      // Update viewing product state with current domain's values
      const currentDomain = selectedAmazonDomain;
      const currentDomainData = editingFields[currentDomain];
      
      const updatedViewingProduct = {
        ...viewingProduct,
        asin: currentDomainData?.asin || '-',
        keywords: currentDomainData?.keywords || '-',
        customLink: currentDomainData?.customLink || '-',
      };
      
      // Add regionData property using type assertion
      (updatedViewingProduct as any).regionData = {
        ...((viewingProduct as any).regionData || {}),
        // Update regionData for all domains
        ...Object.fromEntries(
          Object.entries(editingFields).map(([domain, data]) => [
            domain,
            {
              asin: data.asin || '-',
              keywords: data.keywords || '-',
              customLink: data.customLink || '-',
              // Always use the most up-to-date status from regionStatus (which gets updated by toggle)
              status: 'regionStatus' in viewingProduct ? 
                viewingProduct.regionStatus[domain as AmazonDomain] || 'inactive' : 
                'inactive'
            }
          ])
        )
      };
      
      setViewingProduct(updatedViewingProduct);
      
      // Reset changed state
      setHasUnsavedChanges(false);
      setOriginalEditingFields(JSON.parse(JSON.stringify(editingFields)));
      
      // Show success toast message
      showToast("Product details saved", false);
    }
  };
  
  // Save product handler for the edit modal
  const handleSaveProduct = (enableProduct: boolean) => {
    if (editingProduct) {
      setProducts(prevProducts => 
        prevProducts.map(product => {
          if (product.id === editingProduct.id) {
            // Create updated product
            const updatedProduct = { ...product };
            
            // Convert the existing product to support region-specific data if needed
            if (!('regionData' in updatedProduct)) {
              // Add regionData property to store region-specific information
              (updatedProduct as any).regionData = {};
            }
            
            // Ensure regionData exists for the current domain
            const domain = selectedAmazonDomain;
            if (!(updatedProduct as any).regionData[domain]) {
              (updatedProduct as any).regionData[domain] = {
                // Initialize with existing global values if available
                asin: updatedProduct.asin || '-',
                keywords: updatedProduct.keywords || '-',
                customLink: updatedProduct.customLink || '-',
                status: 'inactive'
              };
            }
            
            // Update the region-specific data for the current domain only
            (updatedProduct as any).regionData[domain] = {
              // Keep existing values for properties not edited
              ...(updatedProduct as any).regionData[domain],
              asin: editForm.asin || '-',
              keywords: editForm.keywords || '-',
              customLink: editForm.customLink || '-',
              // Preserve existing status or default to inactive
              status: 'regionStatus' in updatedProduct ? 
                updatedProduct.regionStatus[domain as AmazonDomain] : 
                ((updatedProduct as any).regionData[domain]?.status || 'inactive')
            };
            
            // We're fully region-specific now, don't update global fields
            
            // Update status if enableProduct is true
            if (enableProduct) {
              // Ensure regionStatus exists
              if (!('regionStatus' in updatedProduct)) {
                (updatedProduct as any).regionStatus = {};
              }
              
              // Update regionStatus for the current domain
              (updatedProduct as any).regionStatus = {
                ...(updatedProduct as any).regionStatus,
                [selectedAmazonDomain as AmazonDomain]: 'active'
              };
              
              // Also update in region data
              if ((updatedProduct as any).regionData && (updatedProduct as any).regionData[selectedAmazonDomain]) {
                (updatedProduct as any).regionData[selectedAmazonDomain].status = 'active';
              }
            }
            
            return updatedProduct;
          }
          return product;
        })
      );
      
      // Close modal
      setEditModalOpen(false);
      setEditingProduct(null);
      
      // Reset form
      setEditForm({
        asin: '',
        customLink: '',
        keywords: '',
        hideOtherBuyButtons: false,
        improveSearchRanking: false,
      });
      
      // Show success toast
      showToast(enableProduct ? "Product updated and enabled" : "Product updated", false);
    }
  };
  
  const domainOptions = [
    { label: 'United States', value: 'amazon.com' },
    { label: 'Canada', value: 'amazon.ca' },
    { label: 'Mexico', value: 'amazon.com.mx' },
    { label: 'Brazil', value: 'amazon.com.br' },
    { label: 'United Kingdom', value: 'amazon.co.uk' },
    { label: 'Germany', value: 'amazon.de' },
    { label: 'France', value: 'amazon.fr' },
    { label: 'Italy', value: 'amazon.it' },
    { label: 'Spain', value: 'amazon.es' },
    { label: 'Netherlands', value: 'amazon.nl' },
    { label: 'Poland', value: 'amazon.pl' },
    { label: 'Sweden', value: 'amazon.se' },
    { label: 'Turkey', value: 'amazon.com.tr' },
    { label: 'United Arab Emirates', value: 'amazon.ae' },
    { label: 'Saudi Arabia', value: 'amazon.sa' },
    { label: 'India', value: 'amazon.in' },
    { label: 'Japan', value: 'amazon.co.jp' },
    { label: 'Singapore', value: 'amazon.sg' },
    { label: 'Australia', value: 'amazon.com.au' },
  ];

  const tabs = [
    { id: 'all', content: 'All' },
    { id: 'active', content: 'Active' },
    { id: 'inactive', content: 'Inactive' },
  ];

  // Helper function to get product status based on selected domain
  const getProductStatus = (product: Product): ProductStatus => {
    // Try to get region-specific status first
    if ('regionStatus' in product) {
      const domain = selectedAmazonDomain as AmazonDomain;
      // If the region isn't defined for this product, return inactive by default
      return product.regionStatus[domain as AmazonDomain];
    } 
    // If product has regionData and this domain has a status
    else if ((product as any).regionData && 
             (product as any).regionData[selectedAmazonDomain] &&
             (product as any).regionData[selectedAmazonDomain].status) {
      return (product as any).regionData[selectedAmazonDomain].status;
    } 
    // Legacy support for old product format
    else {
      return (product as LegacyProduct).status;
    }
  };
  
  // Helper function to get region-specific field value based on selected domain
  const getRegionSpecificField = (product: Product, field: 'asin' | 'keywords' | 'customLink'): string => {
    // If product has regionData and this domain has the field, use that
    if ((product as any).regionData && 
        (product as any).regionData[selectedAmazonDomain] &&
        (product as any).regionData[selectedAmazonDomain][field]) {
      return (product as any).regionData[selectedAmazonDomain][field];
    }
    // Otherwise fall back to global value
    return product[field];
  };
  
  // We're using the getRegionSpecificData function declared at the top of the file

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const status = getProductStatus(product);
      
      if (selectedTab === 1 && status !== 'active') return false;
      if (selectedTab === 2 && status !== 'inactive') return false;
      return product.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [products, selectedTab, searchValue, selectedAmazonDomain]);
  
  // Calculate total pages after filteredProducts is defined
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter functions for product selection modal
  const getUniqueVendors = () => {
    const vendors = Array.from(new Set(availableProducts.map(product => product.vendor)));
    return vendors.map(vendor => ({ label: vendor, value: vendor }));
  };

  const getUniqueProductTypes = () => {
    const types = Array.from(new Set(availableProducts.map(product => product.productType)));
    return types.map(type => ({ label: type, value: type }));
  };

  const getUniqueAvailabilityOptions = () => {
    const availability = Array.from(new Set(availableProducts.map(product => product.availability)));
    return availability.map(status => ({ label: status, value: status }));
  };

  const getUniqueCategories = () => {
    const categories = Array.from(new Set(availableProducts.map(product => product.category)));
    return categories.map(category => ({ label: category, value: category }));
  };

  const getUniqueCollections = () => {
    const collections = Array.from(new Set(availableProducts.map(product => product.collection)));
    return collections.map(collection => ({ label: collection, value: collection }));
  };

  const getUniqueSKUs = () => {
    const skus = Array.from(new Set(availableProducts.map(product => product.sku)));
    return skus.map(sku => ({ label: sku, value: sku }));
  };

  const handleFilterCategorySelect = (filterType: string) => {
    setCurrentFilterCategory(filterType);
    setFilterPopoverActive(false);
    setValuePopoverActive(true);
  };

  const handleFilterValueSelect = (value: string, label: string) => {
    if (!currentFilterCategory) return;
    
    // Check if value is already selected for this category
    const currentValues = selectedFilterValues[currentFilterCategory] || [];
    if (currentValues.includes(value)) return;
    
    // Add value to selected values for this category
    setSelectedFilterValues(prev => ({
      ...prev,
      [currentFilterCategory]: [...(prev[currentFilterCategory] || []), value]
    }));
    
    // Add to active filters
    const newFilter = { 
      key: currentFilterCategory, 
      value, 
      label: `${currentFilterCategory}: ${label}` 
    };
    setActiveFilters(prev => [...prev, newFilter]);
  };

  const handleFilterRemove = (filterToRemove: any) => {
    // Remove from active filters
    setActiveFilters(prev => prev.filter(filter => 
      !(filter.key === filterToRemove.key && filter.value === filterToRemove.value)
    ));
    
    // Remove from selected values
    setSelectedFilterValues(prev => ({
      ...prev,
      [filterToRemove.key]: prev[filterToRemove.key].filter(val => val !== filterToRemove.value)
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedFilterValues({
      Vendor: [],
      'Product type': [],
      Availability: [],
      Category: [],
      Collection: [],
      SKU: []
    });
    setPriceRange({ min: '', max: '' });
  };

  // We're using the createDefaultRegionStatus function declared at the top of the file
  
  const getFilteredProducts = () => {
    return availableProducts.filter(product => {
      // Search filter
      const searchTerm = productSearchValue.toLowerCase();
      const matchesSearch = searchBy === 'all' 
        ? product.name.toLowerCase().includes(searchTerm) || product.id.toLowerCase().includes(searchTerm)
        : searchBy === 'product_title' 
        ? product.name.toLowerCase().includes(searchTerm)
        : searchBy === 'product_id'
        ? product.id.toLowerCase().includes(searchTerm)
        : product.name.toLowerCase().includes(searchTerm);

      // Check all filter categories
      const vendorValues = selectedFilterValues['Vendor'];
      const matchesVendor = vendorValues.length === 0 || vendorValues.includes(product.vendor);
      
      const productTypeValues = selectedFilterValues['Product type'];
      const matchesProductType = productTypeValues.length === 0 || productTypeValues.includes(product.productType);
      
      const availabilityValues = selectedFilterValues['Availability'];
      const matchesAvailability = availabilityValues.length === 0 || availabilityValues.includes(product.availability);
      
      const categoryValues = selectedFilterValues['Category'];
      const matchesCategory = categoryValues.length === 0 || categoryValues.includes(product.category);
      
      const collectionValues = selectedFilterValues['Collection'];
      const matchesCollection = collectionValues.length === 0 || collectionValues.includes(product.collection);
      
      const skuValues = selectedFilterValues['SKU'];
      const matchesSku = skuValues.length === 0 || skuValues.includes(product.sku);
      
      // Price range filter
      const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                          (!priceRange.max || product.price <= parseFloat(priceRange.max));

      return matchesSearch && matchesVendor && matchesProductType && matchesAvailability && 
             matchesCategory && matchesCollection && matchesSku && matchesPrice;
    });
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectProductsModalOpen || viewModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [selectProductsModalOpen, viewModalOpen]);

  // Toggle modal function using useCallback
  const toggleProductModal = useCallback(() => {
    const isOpening = !selectProductsModalOpen;
    
    if (!isOpening) {
      // When closing the modal, always reset the selected products
      setSelectedProductsForAdd([]);
    }
    
    setSelectProductsModalOpen(isOpening);
    
    if (isOpening) {
      // Reset states when opening
      setSelectedProductsForAdd([]);
      setProductSearchValue('');
      setSearchBy('all');
      clearAllFilters();
    }
  }, [selectProductsModalOpen]);

  // Handle single product selection (like the pop code example)
  const handleSelectSingleProduct = useCallback((product: any) => {
    // Check if product is already added
    if (isProductAlreadyAdded(product.id, product.name)) {
      // Show warning toast
      showToast(`${product.name} is already in your list`, true);
      return;
    }
    
    const newProduct = {
      id: `new_${Date.now()}_${product.id}`,
      title: product.name,
      image: product.image,
      clicks: Math.floor(Math.random() * 100),
      asin: '-',
      keywords: '-',
      customLink: '-',
      regionStatus: createDefaultRegionStatus()
    };
    
    setProducts(prev => [newProduct, ...prev]);
    setSelectProductsModalOpen(false);
    setSelectedProductsForAdd([]);
    setProductSearchValue('');
    setSearchBy('all');
    clearAllFilters();
    
    // Show success toast
    showToast(`${product.name} added`, false);
  }, [showToast, isProductAlreadyAdded]);
  
  // Add this function to reset the welcome card
  const resetWelcomeCard = () => {
    localStorage.removeItem('linkr_hideWelcomeCard');
    setShowWelcomeCard(true);
  };

  // Cell focus and blur handlers
  const handleCellFocus = (domain: string, field: 'asin' | 'keywords' | 'customLink') => {
    setActiveEditingCell(`${domain}-${field}`);
  };

  const handleCellBlur = () => {
    // Small delay to allow the onChange to complete before losing focus
    setTimeout(() => {
      setActiveEditingCell(null);
    }, 100);
  };

  // Region status toggle handler
  const handleRegionStatusToggle = (productId: string, domain: AmazonDomain) => {
    if (viewingProduct) {
      // Create a copy of the product's regionStatus
      const updatedRegionStatus: RegionStatus = {
        ...createDefaultRegionStatus(),
        ...(viewingProduct && 'regionStatus' in viewingProduct ? viewingProduct.regionStatus : {})
      };
      // Get the current status
      const currentStatus = updatedRegionStatus[domain as AmazonDomain];
      // Toggle the status for the specified domain
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      updatedRegionStatus[domain as AmazonDomain] = newStatus;
      
      // Create updated viewing product
      const updatedViewingProduct = {
        ...viewingProduct,
        regionStatus: updatedRegionStatus
      };
      
      // Also update the regionData to keep everything in sync
      if (!('regionData' in updatedViewingProduct)) {
        (updatedViewingProduct as any).regionData = {};
      }
      
      // Ensure regionData exists for this domain
      if (!((updatedViewingProduct as any).regionData[domain])) {
        (updatedViewingProduct as any).regionData[domain] = {
          asin: viewingProduct.asin || '-',
          keywords: viewingProduct.keywords || '-',
          customLink: viewingProduct.customLink || '-',
          status: 'inactive'
        };
      }
      
      // Update the status in regionData
      (updatedViewingProduct as any).regionData[domain].status = updatedRegionStatus[domain];
      
      // Update the product in the products state
      setViewingProduct(updatedViewingProduct);
      
      // Update the product in the products array
      setProducts(prevProducts => {
        return prevProducts.map(p => p.id === productId ? updatedViewingProduct : p);
      });
      
      // Show toast message
      const statusText = newStatus === 'active' ? 'enabled' : 'disabled';
      showToast(`Product ${statusText} for ${domain}`, false);
    }
  };

  // Toast state and handlers are defined at the top of the component

  return (
    <Page title="Linkr Dashboard">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            
            {/* App Information */}
            {showWelcomeCard && (
              <Card>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '0', right: '0' }}>
                    <Button
                      variant="plain"
                      size="slim"
                      onClick={() => {
                        setShowWelcomeCard(false);
                        localStorage.setItem('linkr_hideWelcomeCard', 'true');
                      }}
                    >
                      Don't show again
                    </Button>
                  </div>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd" fontWeight="semibold">
                      🎉 Welcome to Linkr!
                    </Text>
                    <BlockStack gap="300">
                      <Text as="p" variant="bodyMd">
                        Linkr blocks have been automatically added to your Shopify theme. You can find these app blocks in your theme editor and place them anywhere you like. Linkr helps elevate your sales with the Amazon Buy Now button — a powerful tool to improve your Amazon organic rankings and drive more sales on both your Amazon listings and Shopify store.
                      </Text>
                      <Text as="p" variant="bodyMd">
                        Start turning traffic into conversions with a seamless shopping experience your customers trust.
                      </Text>
                    </BlockStack>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                      <Button url="https://help.linkr.com/getting-started" external variant="primary">
                        Getting Started Guide
                      </Button>
                    </div>
                  </BlockStack>
                </div>
              </Card>
            )}
            
            {/* Combined Product Management Section with Amazon Region Selection */}
            <Card>
              <BlockStack gap="500">
                {/* First row: Amazon Region selection */}
                <div>
                  <InlineStack align="space-between" blockAlign="center" gap="200">
                    <div style={{ flexShrink: 0, marginRight: '-10px' }}>
                      <Text as="h2" variant="headingMd" fontWeight="semibold">
                        Amazon Region
                      </Text>
                    </div>
                    <div style={{ width: '100%', maxWidth: '800px' }}>
                      <Select 
                        label=""
                        labelHidden
                        options={domainOptions}
                        onChange={(value) => {
                          setSelectedAmazonDomain(value);
                          // Reset to first page when changing regions to make status change more apparent
                          setCurrentPage(1);
                        }}
                        value={selectedAmazonDomain}
                      />
                    </div>
                  </InlineStack>
                </div>
                
                {/* Second row: Tabs for filtering with Select products button */}
                <InlineStack align="space-between" blockAlign="center">
                  <div style={{ flexGrow: 1 }}>
                    <Tabs 
                      tabs={tabs} 
                      selected={selectedTab} 
                      onSelect={(selectedTabIndex) => {
                        setSelectedTab(selectedTabIndex);
                        setCurrentPage(1); // Reset to first page when changing tabs
                      }} 
                    />
                  </div>
                  <Button variant="primary" onClick={() => setSelectProductsModalOpen(true)}>
                    Select products
                  </Button>
                </InlineStack>
            
            {/* Search Filter - Just above table */}
            <TextField
              label=""
              placeholder="Search by product name, ASIN, or keywords..."
              value={searchValue}
              onChange={(value) => {
                setSearchValue(value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              autoComplete="off"
            />

            {/* Products Table */}
            <Box paddingBlockStart="400">
              <div style={{ 
                overflowX: 'auto', 
                overflowY: 'hidden', 
                width: '100%',
                maxWidth: '100%',
                padding: '0'
              }}>
                <div style={{ 
                  width: '100%',
                  display: 'table',
                  tableLayout: 'fixed',
                  borderCollapse: 'collapse',
                  marginRight: '0',
                  paddingRight: '0'
                }}>
                <IndexTable
                  resourceName={{ singular: 'product', plural: 'products' }}
                  itemCount={filteredProducts.length}
                  selectable={false}
                  headings={[
                    { title: 'Product Name' },
                    { title: 'Clicks' },
                    { title: 'ASIN' },
                    { title: 'Keywords' },
                    { title: 'Custom Link' },
                    { title: 'Status' },
                    { title: 'Actions' },
                  ]}
                  pagination={totalPages > 1 ? {
                    hasPrevious: currentPage > 1,
                    onPrevious: () => handlePageChange(currentPage - 1),
                    hasNext: currentPage < totalPages,
                    onNext: () => handlePageChange(currentPage + 1),
                    label: `${currentPage} of ${totalPages}`,
                    accessibilityLabel: `Pagination navigation, current page ${currentPage} of ${totalPages}`
                  } : undefined}
                >
                  {paginatedProducts.map((product, index) => (
                    <IndexTable.Row
                      id={product.id}
                      key={product.id}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text as="span" variant="bodyMd" fontWeight="medium">
                          <div style={{ 
                            maxWidth: '250px', 
                            width: '100%', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap'
                          }} title={product.title}>
                            <Link 
                              url={`https://admin.shopify.com/products/${extractShopifyProductId(product.id)}`}
                              external
                              removeUnderline
                              monochrome={false}  
                            >
                              {product.title.length > 45 ? `${product.title.substring(0, 45)}...` : product.title}
                            </Link>
                          </div>
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" variant="bodyMd" tone="subdued">
                          <div style={{ width: '50px', textAlign: 'center' }}>
                            {product.clicks}
                          </div>
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        {(() => {
                          // Get region-specific data for the selected domain
                          const regionData = getRegionSpecificData(product, selectedAmazonDomain);
                          return (
                            <Text as="span" variant="bodyMd" tone={regionData.asin === '-' ? 'subdued' : undefined}>
                              <div style={{ 
                                width: '80px'
                              }} title={regionData.asin}>
                                {regionData.asin}
                              </div>
                            </Text>
                          );
                        })()}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        {(() => {
                          // Get region-specific data for the selected domain
                          const regionData = getRegionSpecificData(product, selectedAmazonDomain);
                          return (
                            <Text as="span" variant="bodyMd" tone={regionData.keywords === '-' ? 'subdued' : undefined}>
                              <div style={{ 
                                width: '100px', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap'
                              }} title={regionData.keywords}>
                                {regionData.keywords === '-' ? '-' : 
                                 regionData.keywords.length > 15 ? `${regionData.keywords.substring(0, 15)}...` : regionData.keywords}
                              </div>
                            </Text>
                          );
                        })()}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        {(() => {
                          // Get region-specific data for the selected domain
                          const regionData = getRegionSpecificData(product, selectedAmazonDomain);
                          return (
                            <Text as="span" variant="bodyMd" tone={regionData.customLink === '-' ? 'subdued' : undefined}>
                              <div style={{ 
                                width: '120px', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap'
                              }} title={regionData.customLink}>
                                {regionData.customLink === '-' ? '-' : 
                                 regionData.customLink.length > 20 ? `${regionData.customLink.substring(0, 20)}...` : regionData.customLink}
                              </div>
                            </Text>
                          );
                        })()}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <div 
                          onClick={() => handleStatusToggle(product.id)}
                          style={{
                            width: '40px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: getProductStatus(product) === 'active' ? '#008060' : '#E4E5E7',
                            position: 'relative',
                            transition: 'background-color 0.2s ease',
                            cursor: 'pointer'
                          }}
                          role="switch"
                          aria-checked={getProductStatus(product) === 'active'}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleStatusToggle(product.id);
                            }
                          }}
                        >
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            position: 'absolute',
                            top: '2px',
                            left: getProductStatus(product) === 'active' ? '22px' : '2px',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                          }} />
                        </div>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <div style={{ 
                          width: '100%', 
                          display: 'flex', 
                          gap: '8px', 
                          justifyContent: 'flex-start',
                          paddingRight: '0'
                        }}>
                          <Button 
                            variant="plain" 
                            accessibilityLabel="View product details"
                            onClick={() => handleViewProduct(product)}
                            size="slim"
                          >
                            View
                          </Button>
                          <Button 
                            variant="plain" 
                            accessibilityLabel="Edit product"
                            onClick={() => handleEditProduct(product)}
                            size="slim"
                          >
                            Edit
                          </Button>
                        </div>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  ))}
                </IndexTable>
                </div>
              </div>
              
              {/* Add custom styles to hide scrollbar and fix table width */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  .Polaris-IndexTable {
                    width: 100%;
                    margin-right: 0;
                    padding-right: 0;
                  }
                  .Polaris-IndexTable-ScrollContainer {
                    overflow-x: hidden;
                    width: 100%;
                    padding-right: 0;
                  }
                  .Polaris-IndexTable-TableRow {
                    width: 100%;
                    padding-right: 0;
                  }
                  .Polaris-IndexTable-TableCell:last-child {
                    padding-right: 0;
                  }
                  .Polaris-IndexTable-Pagination {
                    padding: 16px 0;
                    margin-top: 0;
                  }
                `
              }} />
            </Box>
          </BlockStack>
        </Card>
          </BlockStack>
          
          {/* Explicit bottom gap - increased */}
          <Box paddingBlockStart="800">
            <div style={{ textAlign: 'center' }}>
              <Button
                variant="plain"
                size="slim"
                onClick={resetWelcomeCard}
              >
                Show welcome message
              </Button>
            </div>
          </Box>
        </Layout.Section>
      </Layout>

        {/* Edit Product Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit product for ${domainOptions.find(option => option.value === selectedAmazonDomain)?.label || selectedAmazonDomain}`}
          primaryAction={{
            content: 'Save',
            onAction: () => handleSaveProduct(false),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => setEditModalOpen(false),
            }
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <FormLayout>
                <TextField
                  label="ASIN"
                  value={editForm.asin}
                  onChange={(value) => setEditForm({ ...editForm, asin: value })}
                  autoComplete="off"
                />
              
              <TextField
                label="Custom Link"
                value={editForm.customLink}
                onChange={(value) => setEditForm({ ...editForm, customLink: value })}
                autoComplete="off"
              />
              
              <Checkbox
                label="Hide other Buy Buttons"
                checked={editForm.hideOtherBuyButtons}
                onChange={(checked) => setEditForm({ ...editForm, hideOtherBuyButtons: checked })}
              />
              
              <div>
                <Checkbox
                  label={
                    <span>
                      Improve search ranking
                      <span style={{ marginLeft: '8px' }}>
                        <Link
                          url="https://help.linkr.com/amazon-search-ranking"
                          external
                          removeUnderline
                        >
                          Learn more
                        </Link>
                      </span>
                    </span>
                  }
                  checked={editForm.improveSearchRanking}
                  onChange={(checked) => setEditForm({ 
                    ...editForm, 
                    improveSearchRanking: checked,
                    // Don't clear keywords when turning off search ranking improvement
                  })}
                />
              </div>
              
              <TextField
                label="Keywords"
                value={editForm.keywords}
                onChange={(value) => setEditForm({ ...editForm, keywords: value })}
                autoComplete="off"
                disabled={!editForm.improveSearchRanking}
              />
            </FormLayout>
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* View Product Details Modal */}
        {viewModalOpen && viewingProduct && (
          <Modal
            open={viewModalOpen}
            onClose={handleCloseViewModal}
            title="List of Regions"
            primaryAction={{
              content: 'Save',
              onAction: handleSaveViewChanges,
              disabled: !hasUnsavedChanges
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: handleCloseViewModal
              }
            ]}
            size="large"
          >
            <Modal.Section>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Product Title: {viewingProduct.title}</Text>
                
                {/* All Regions Table */}
                <IndexTable
                  resourceName={{ singular: 'region', plural: 'regions' }}
                  itemCount={domainOptions.length}
                  selectable={false}
                  headings={[
                    { title: 'Region' },
                    { title: 'ASIN' },
                    { title: 'Keywords' },
                    { title: 'Custom Link' },
                    { title: 'Status' }
                  ]}
                >
                  {domainOptions.map((domain, index) => {
                    // Get region-specific data using our helper function
                    const regionData = getRegionSpecificData(viewingProduct, domain.value);

                    return (
                      <IndexTable.Row
                        id={`region-${index}`}
                        key={`region-${index}`}
                        position={index}
                      >
                        <IndexTable.Cell>
                          <Text as="span" variant="bodyMd" fontWeight="medium">
                            {domain.label}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <InlineEditableCell
                            value={editingFields[domain.value]?.asin || ''}
                            onChange={(value) => handleInlineFieldUpdate(domain.value, 'asin', value)}
                            placeholder="Enter ASIN"
                            minWidth="120px"
                            isActive={activeEditingCell === `${domain.value}-asin`}
                            onFocus={() => handleCellFocus(domain.value, 'asin')}
                            onBlur={handleCellBlur}
                          />
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <InlineEditableCell
                            value={editingFields[domain.value]?.keywords || ''}
                            onChange={(value) => handleInlineFieldUpdate(domain.value, 'keywords', value)}
                            placeholder="Enter keywords"
                            minWidth="150px"
                            isActive={activeEditingCell === `${domain.value}-keywords`}
                            onFocus={() => handleCellFocus(domain.value, 'keywords')}
                            onBlur={handleCellBlur}
                          />
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <InlineEditableCell
                            value={editingFields[domain.value]?.customLink || ''}
                            onChange={(value) => handleInlineFieldUpdate(domain.value, 'customLink', value)}
                            placeholder="Enter custom link"
                            minWidth="200px"
                            isActive={activeEditingCell === `${domain.value}-customLink`}
                            onFocus={() => handleCellFocus(domain.value, 'customLink')}
                            onBlur={handleCellBlur}
                          />
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <div 
                            onClick={() => handleRegionStatusToggle(viewingProduct.id, domain.value as AmazonDomain)}
                            role="switch" 
                            aria-checked={regionData.status === 'active'} 
                            tabIndex={0} 
                            style={{
                              width: '40px', 
                              height: '20px', 
                              borderRadius: '10px', 
                              backgroundColor: regionData.status === 'active' ? 'rgb(0, 128, 96)' : '#E4E5E7', 
                              position: 'relative', 
                              transition: 'background-color 0.2s ease', 
                              cursor: 'pointer'
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleRegionStatusToggle(viewingProduct.id, domain.value as AmazonDomain);
                              }
                            }}
                          >
                            <div style={{
                              width: '16px', 
                              height: '16px', 
                              borderRadius: '50%', 
                              backgroundColor: 'rgb(255, 255, 255)', 
                              position: 'absolute', 
                              top: '2px', 
                              left: regionData.status === 'active' ? '22px' : '2px', 
                              transition: 'left 0.2s ease', 
                              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px'
                            }} />
                          </div>
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    );
                  })}
                </IndexTable>
              </BlockStack>
            </Modal.Section>
          </Modal>
        )}

        {/* Select Products Modal */}
        <Modal
          open={selectProductsModalOpen}
          onClose={() => {
            setSelectedProductsForAdd([]);
            toggleProductModal();
          }}
          title="Edit products"
          primaryAction={{
            content: "Add",
            onAction: () => {
              if (selectedProductsForAdd.length > 0) {
                // Filter out any products that are already in the list
                const productsToAdd = availableProducts
                  .filter(product => 
                    selectedProductsForAdd.includes(product.id) && 
                    !isProductAlreadyAdded(product.id, product.name)
                  );
                
                if (productsToAdd.length === 0) {
                  showToast("All selected products are already in your list", true);
                  // Clear selections before closing
                  setSelectedProductsForAdd([]);
                  toggleProductModal();
                  return;
                }
                
                // Create new product objects
                const newProducts = productsToAdd.map(product => ({
                  id: `new_${Date.now()}_${product.id}`,
                  title: product.name,
                  image: product.image,
                  clicks: Math.floor(Math.random() * 100),
                  asin: '-',
                  keywords: '-',
                  customLink: '-',
                  regionStatus: createDefaultRegionStatus()
                }));
                
                // Add new products to the beginning of the list
                setProducts(prev => [...newProducts, ...prev]);
                
                // Show success toast
                showToast(`${newProducts.length} product${newProducts.length > 1 ? 's' : ''} added successfully`);
              }
              
              // Clear selections before closing
              setSelectedProductsForAdd([]);
              toggleProductModal();
            },
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => {
                setSelectedProductsForAdd([]);
                toggleProductModal();
              },
            },
          ]}
          size="large"
        >
          <Modal.Section>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Search and Filter Section */}
            <BlockStack gap="400">
              {/* Search Row */}
              <InlineStack gap="400" blockAlign="center">
              <div style={{ flex: 1 }}>
                <TextField
                  label=""
                  labelHidden
                  placeholder="Search products"
                  value={productSearchValue}
                  onChange={setProductSearchValue}
                  prefix={<Icon source={SearchIcon} />}
                  autoComplete="off"
                />
              </div>
              <div style={{ width: '160px', flexShrink: 0 }}>
                <Select
                  label=""
                  labelHidden
                  options={[
                    { label: 'All', value: 'all' },
                    { label: 'Product title', value: 'product_title' },
                    { label: 'SKU', value: 'sku' },
                  ]}
                  value={searchBy}
                  onChange={setSearchBy}
                />
              </div>
            </InlineStack>

              {/* Polaris-style Filter UI */}
              <div className="Polaris-Filters__FiltersWrapper Polaris-Filters__FiltersWrapperWithAddButton" aria-live="polite" style={{ overflow: 'visible' }}>
                <div className="Polaris-Filters__FiltersInner" style={{ overflow: 'visible' }}>
                  <div className="Polaris-Filters__FiltersStickyArea" style={{ overflow: 'visible' }}>
                    {/* Active Filter Pills */}
                    {activeFilters.map((filter) => (
                      <div key={`${filter.key}-${filter.value}`}>
                        <div>
                          <div className="Polaris-Filters-FilterPill__FilterButton Polaris-Filters-FilterPill__ActiveFilterButton">
                            <div className="Polaris-InlineStack" style={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', gap: '0' }}>
                              <button className="Polaris-Filters-FilterPill__PlainButton Polaris-Filters-FilterPill__ToggleButton" aria-label={filter.label} type="button">
                                <div className="Polaris-InlineStack" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap', flexDirection: 'row', gap: '0' }}>
                                  <div className="Polaris-Box" style={{ paddingLeft: '4px' }}>
                                    <div className="Polaris-InlineStack" style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                                      <span className="Polaris-Text--root Polaris-Text--bodySm">{filter.label}</span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                              <button className="Polaris-Filters-FilterPill__PlainButton Polaris-Filters-FilterPill--clearButton" 
                                aria-label={`Clear ${filter.label}`} 
                                type="button"
                                onClick={() => handleFilterRemove(filter)}
                              >
                                <div className="Polaris-Filters-FilterPill__IconWrapper">
                                  <span className="Polaris-Icon">
                                    <Icon source={XIcon} />
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Clear All Button - Only show if there are active filters */}
                    {activeFilters.length > 0 && (
                      <div className="Polaris-Filters__ClearButton">
                        <Button
                          size="slim"
                          onClick={clearAllFilters}
                          variant="plain"
                          accessibilityLabel="Clear all filters"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                    
                    {/* Add Filter Button */}
                    <div className="Polaris-Filters__AddFilterActivatorMultiple">
                      <div>
                        <div>
                          <Popover
                            active={filterPopoverActive}
                            activator={
                              <button 
                                className="Polaris-Filters__AddFilter" 
                                aria-label="Add filter" 
                                type="button" 
                                onClick={() => setFilterPopoverActive(!filterPopoverActive)}
                              >
                                <span className="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--base">Add filter </span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75h-3.5v-3.5Z"></path>
                                </svg>
                              </button>
                            }
                            onClose={() => setFilterPopoverActive(false)}
                          >
                            <ActionList
                              actionRole="menuitem"
                              items={[
                                {
                                  content: 'Category',
                                  onAction: () => handleFilterCategorySelect('Category'),
                                },
                                {
                                  content: 'Vendor',
                                  onAction: () => handleFilterCategorySelect('Vendor'),
                                },
                                {
                                  content: 'Product type',
                                  onAction: () => handleFilterCategorySelect('Product type'),
                                },
                                {
                                  content: 'Availability',
                                  onAction: () => handleFilterCategorySelect('Availability'),
                                },
                                {
                                  content: 'Collection',
                                  onAction: () => handleFilterCategorySelect('Collection'),
                                },
                                {
                                  content: 'SKU',
                                  onAction: () => handleFilterCategorySelect('SKU'),
                                },
                              ]}
                            />
                          </Popover>
                        </div>
                      </div>
                    </div>
                    
                    {/* Value Selection Popover */}
                    <Popover
                      active={valuePopoverActive}
                      activator={<div></div>} /* Hidden activator */
                      onClose={() => setValuePopoverActive(false)}
                    >
                      <div style={{ minWidth: '200px', padding: '12px' }}>
                        <BlockStack gap="400">
                          <Text variant="headingMd" as="h3">
                            {currentFilterCategory}
                          </Text>
                          
                          {currentFilterCategory === 'Category' && (
                            <div>
                              <Text variant="bodyMd" as="p">Select categories</Text>
                              <ActionList
                                actionRole="menuitem"
                                items={getUniqueCategories().map(option => ({
                                  content: option.label,
                                  onAction: () => {
                                    handleFilterValueSelect(option.value, option.label);
                                    setValuePopoverActive(false);
                                  },
                                  active: selectedFilterValues['Category']?.includes(option.value)
                                }))}
                              />
                            </div>
                          )}
                          
                          {currentFilterCategory === 'Vendor' && (
                            <div>
                              <Text variant="bodyMd" as="p">Select vendors</Text>
                              <ActionList
                                actionRole="menuitem"
                                items={getUniqueVendors().map(option => ({
                                  content: option.label,
                                  onAction: () => {
                                    handleFilterValueSelect(option.value, option.label);
                                    setValuePopoverActive(false);
                                  },
                                  active: selectedFilterValues['Vendor']?.includes(option.value)
                                }))}
                              />
                            </div>
                          )}
                          
                          {currentFilterCategory === 'Product type' && (
                            <div>
                              <Text variant="bodyMd" as="p">Select product types</Text>
                                                           <ActionList
                                actionRole="menuitem"
                                items={getUniqueProductTypes().map(option => ({
                                  content: option.label,
                                  onAction: () => {
                                    handleFilterValueSelect(option.value, option.label);
                                    setValuePopoverActive(false);
                                  },
                                  active: selectedFilterValues['Product type']?.includes(option.value)
                                }))}
                              />
                            </div>
                          )}
                          
                          {currentFilterCategory === 'Availability' && (
                            <div>
                              <Text variant="bodyMd" as="p">Select availability</Text>
                              <ActionList
                                actionRole="menuitem"
                                items={getUniqueAvailabilityOptions().map(option => ({
                                  content: option.label,
                                  onAction: () => {
                                    handleFilterValueSelect(option.value, option.label);
                                    setValuePopoverActive(false);
                                  },
                                  active: selectedFilterValues['Availability']?.includes(option.value)
                                }))}
                              />
                            </div>
                          )}
                          
                          {currentFilterCategory === 'Collection' && (
                            <div>
                              <Text variant="bodyMd" as="p">Select collections</Text>
                              <ActionList
                                actionRole="menuitem"
                                items={getUniqueCollections().map(option => ({
                                  content: option.label,
                                  onAction: () => {
                                    handleFilterValueSelect(option.value, option.label);
                                    setValuePopoverActive(false);
                                  },
                                  active: selectedFilterValues['Collection']?.includes(option.value)
                                }))}
                              />
                            </div>
                          )}
                          
                          {currentFilterCategory === 'SKU' && (
                            <div>
                              <Text variant="bodyMd" as="p">Select SKUs</Text>
                              <ActionList
                                actionRole="menuitem"
                                items={getUniqueSKUs().map(option => ({
                                  content: option.label,
                                  onAction: () => {
                                    handleFilterValueSelect(option.value, option.label);
                                    setValuePopoverActive(false);
                                  },
                                  active: selectedFilterValues['SKU']?.includes(option.value)
                                }))}
                              />
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Button variant="plain" onClick={() => setValuePopoverActive(false)}>Cancel</Button>
                            <Button variant="primary" onClick={() => setValuePopoverActive(false)}>Done</Button>
                          </div>
                        </BlockStack>
                      </div>
                    </Popover>
                  </div>
                </div>
              </div>
            </BlockStack>

            {/* Product List - Only this section is scrollable */}
            <Box paddingBlockStart="400">
              <div style={{ 
                height: '350px', 
                maxHeight: '45vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '10px', /* Add some padding to prevent content touching scrollbar */
                /* Custom scrollbar styling for better appearance */
                scrollbarWidth: 'thin',
                scrollbarColor: '#c4cdd5 #f4f6f8',
                marginBottom: '8px' /* Add a small margin to separate from footer */
              }}>
                {getFilteredProducts().map((product) => {
                  const isSelected = selectedProductsForAdd.includes(product.id);
                  const isAlreadyAdded = isProductAlreadyAdded(product.id, product.name);
                  return (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #e1e3e5',
                        cursor: isAlreadyAdded ? 'default' : 'pointer',
                        opacity: isAlreadyAdded ? 0.7 : 1,
                      }}
                      onClick={() => {
                        if (isAlreadyAdded) return; // Don't allow selecting already added products
                        if (isSelected) {
                          setSelectedProductsForAdd(prev => 
                            prev.filter(id => id !== product.id)
                          );
                        } else {
                          setSelectedProductsForAdd(prev => [...prev, product.id]);
                        }
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{ marginRight: '12px' }}>
                        <Checkbox
                          label=""
                          labelHidden
                          checked={isSelected || isAlreadyAdded}
                          disabled={isAlreadyAdded}
                          onChange={() => {}} // Handled by parent onClick
                        />
                      </div>
                      
                      {/* Product Image */}
                      <div style={{ marginRight: '12px' }}>
                        <Thumbnail
                          source={product.image}
                          alt={product.name}
                          size="small"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div style={{ flex: 1 }}>
                        <Text as="span" variant="bodyMd" fontWeight="medium">
                          <Link 
                            url={`https://admin.shopify.com/products/${extractShopifyProductId(product.id)}`}
                            external
                            removeUnderline
                            monochrome={false}
                          >
                            {product.name}
                          </Link>
                        </Text>
                      </div>
                    </div>
                  );
                })}
                
                {/* Empty State */}
                {getFilteredProducts().length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      No products found
                    </Text>
                  </div>
                )}
              </div>
            </Box>
            </div>
          </Modal.Section>
        </Modal>

        {/* Custom styling to prevent overflow in modal */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset to Polaris default modal behaviors with minimal overrides */
            .Polaris-Modal-Dialog__Modal {
              overflow-y: visible;
              display: flex;
              flex-direction: column;
            }
            
            /* Ensure modal section doesn't force scrolling */
            .Polaris-Modal-Section {
              overflow: visible;
              padding-bottom: 8px;
              padding-top: 16px;
            }
            
            /* Ensure body doesn't force scrolling */
            .Polaris-Modal__Body {
              overflow-y: visible;
              padding-bottom: 16px; /* Reduced padding to eliminate large gap */
            }
            
            /* Style large modals */
            .Polaris-Modal--sizeLarge .Polaris-Modal-Dialog__Container {
              width: 95%;
              max-width: 900px !important;
              max-height: 80vh !important;
            }
            
            /* Ensure footer is always visible at the bottom */
            .Polaris-Modal-Footer {
              border-top: 1px solid #e1e3e5;
              padding: 12px 24px;
              display: flex;
              justify-content: flex-end;
              position: sticky;
              bottom: 0;
              z-index: 10;
              background-color: #ffffff;
              margin-top: 0;
            }
            
            /* Fix button spacing in footer */
            .Polaris-Modal-Footer .Polaris-Button + .Polaris-Button {
              margin-left: 8px;
            }
          `
        }} />

        {/* Toast for notifications */}
        {toastActive && (
          <Toast
            content={toastMessage}
            onDismiss={handleToastDismiss}
            duration={3000}
            error={toastError}
          />
        )}
    </Page>
  );
};

export default AmazonBuyButtonDashboard;
