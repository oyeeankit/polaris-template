import React, { useState, useMemo, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Select,
  Tabs,
  TextField,
  IndexTable,
  Button,
  Badge,
  Box,
  Text,
  BlockStack,
  InlineStack,
  Grid,
  Modal,
  FormLayout,
  Checkbox,
  Pagination,
  Filters,
  ResourceList,
  Thumbnail,
  Icon
} from '@shopify/polaris';
import { EditIcon, XIcon, SearchIcon, AlertBubbleIcon } from '@shopify/polaris-icons';

// Define product types
type AmazonDomain = 'amazon.com' | 'amazon.ca' | 'amazon.co.uk' | 'amazon.de' | 'amazon.fr' | 
                   'amazon.com.mx' | 'amazon.com.br' | 'amazon.it' | 'amazon.es' | 'amazon.nl' |
                   'amazon.pl' | 'amazon.se' | 'amazon.com.tr' | 'amazon.ae' | 'amazon.sa' |
                   'amazon.in' | 'amazon.co.jp' | 'amazon.sg' | 'amazon.com.au';
type ProductStatus = 'active' | 'inactive';

type RegionStatus = {
  [domain in AmazonDomain]?: ProductStatus;
};

// Helper function to create a default RegionStatus object with all regions inactive
const createDefaultRegionStatus = (): RegionStatus => {
  const status: RegionStatus = {};
  const domains: AmazonDomain[] = [
    'amazon.com', 'amazon.ca', 'amazon.co.uk', 'amazon.de', 'amazon.fr',
    'amazon.com.mx', 'amazon.com.br', 'amazon.it', 'amazon.es', 'amazon.nl',
    'amazon.pl', 'amazon.se', 'amazon.com.tr', 'amazon.ae', 'amazon.sa',
    'amazon.in', 'amazon.co.jp', 'amazon.sg', 'amazon.com.au'
  ];
  
  domains.forEach(domain => {
    status[domain] = 'inactive';
  });
  
  return status;
};

// Product with region-specific status
interface ProductWithRegionStatus {
  id: string;
  title: string;
  image: string;
  clicks: number;
  asin: string;
  keywords: string;
  customLink: string;
  regionStatus: RegionStatus;
}

// Legacy product with single status field
interface LegacyProduct {
  id: string;
  title: string;
  image: string;
  clicks: number;
  asin: string;
  keywords: string;
  customLink: string;
  status: 'active' | 'inactive';
}

type Product = ProductWithRegionStatus | LegacyProduct;

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
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedSku, setSelectedSku] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [editForm, setEditForm] = useState({
    asin: '',
    customLink: '',
    keywords: '',
    hideOtherBuyButtons: false,
    improveSearchRanking: false,
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
      title: 'Trendy Queen Womens Short Sleeve T Shirts',
      image: 'https://example.com/image1.jpg',
      clicks: 0,
      asin: '-',
      keywords: '-',
      customLink: '-',
      regionStatus: {
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
        'amazon.com': 'active',
        'amazon.ca': 'inactive',
        'amazon.co.uk': 'active',
        'amazon.de': 'active',
        'amazon.fr': 'inactive',
      },
    },
  ]);

  // Handle status toggle based on the selected Amazon domain
  const handleStatusToggle = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          if ('regionStatus' in product) {
            // Safe type assertion for selectedAmazonDomain as a key of RegionStatus
            const domain = selectedAmazonDomain as AmazonDomain;
            // Get current status, defaulting to inactive if not set
            const currentStatus = product.regionStatus[domain] || 'inactive';
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            
            return { 
              ...product, 
              regionStatus: { 
                ...product.regionStatus, 
                [domain]: newStatus
              } 
            } as ProductWithRegionStatus;
          } else {
            // Legacy status field for backward compatibility
            return { 
              ...product, 
              status: product.status === 'active' ? 'inactive' : 'active' 
            } as LegacyProduct;
          }
        }
        return product;
      })
    );
  };

  // Handle edit product
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      asin: product.asin === '-' ? '' : product.asin,
      customLink: product.customLink === '-' ? '' : product.customLink,
      keywords: product.keywords === '-' ? '' : product.keywords,
      hideOtherBuyButtons: false,
      improveSearchRanking: true,
    });
    setEditModalOpen(true);
  };

  // Handle save product with region-specific status updates
  const handleSaveProduct = (enableProduct = false) => {
    if (editingProduct) {
      setProducts(prevProducts =>
        prevProducts.map(product => {
          if (product.id === editingProduct.id) {
            // First, update basic product fields
            const updatedProduct = {
              ...product,
              asin: editForm.asin || '-',
              customLink: editForm.customLink || '-',
              keywords: editForm.keywords || '-',
            };
            
            // For legacy products, convert to the new format with regionStatus
            if (!('regionStatus' in updatedProduct)) {
              const regionStatus = createDefaultRegionStatus();
              // Copy the old status to the currently selected region
              regionStatus[selectedAmazonDomain as AmazonDomain] = updatedProduct.status;
              
              const convertedProduct = {
                ...updatedProduct,
                regionStatus,
              } as unknown as ProductWithRegionStatus;
              
              // Remove the old status property
              delete (convertedProduct as any).status;
              
              // If enable flag is set, set the current region to active
              if (enableProduct) {
                convertedProduct.regionStatus[selectedAmazonDomain as AmazonDomain] = 'active';
              }
              
              return convertedProduct;
            } 
            // For products already using regionStatus
            else {
              // If enable flag is set, update the status for the current region only
              if (enableProduct) {
                return {
                  ...updatedProduct,
                  regionStatus: {
                    ...updatedProduct.regionStatus,
                    [selectedAmazonDomain as AmazonDomain]: 'active' as ProductStatus
                  }
                } as ProductWithRegionStatus;
              }
              
              return updatedProduct as ProductWithRegionStatus;
            }
          }
          return product;
        })
      );
    }
    setEditModalOpen(false);
    setEditingProduct(null);
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
    if ('regionStatus' in product) {
      const domain = selectedAmazonDomain as AmazonDomain;
      // If the region isn't defined for this product, return inactive by default
      return product.regionStatus[domain] || 'inactive';
    } else {
      // Legacy support for old product format
      return product.status;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const status = getProductStatus(product);
      
      if (selectedTab === 1 && status !== 'active') return false;
      if (selectedTab === 2 && status !== 'inactive') return false;
      return product.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [products, selectedTab, searchValue, selectedAmazonDomain]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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

  const handleFilterAdd = (filterType: string, value: string, label: string) => {
    const newFilter = { key: filterType, value, label: `${filterType}: ${label}` };
    setActiveFilters(prev => [...prev, newFilter]);
    
    // Apply the filter
    if (filterType === 'Vendor') setSelectedVendor(value);
    if (filterType === 'Product type') setSelectedProductType(value);
    if (filterType === 'Availability') setSelectedAvailability(value);
    if (filterType === 'Category') setSelectedCategory(value);
    if (filterType === 'Collection') setSelectedCollection(value);
    if (filterType === 'SKU') setSelectedSku(value);
  };

  const handleFilterRemove = (filterToRemove: any) => {
    setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));
    
    // Remove the filter
    if (filterToRemove.key === 'Vendor') setSelectedVendor('');
    if (filterToRemove.key === 'Product type') setSelectedProductType('');
    if (filterToRemove.key === 'Availability') setSelectedAvailability('');
    if (filterToRemove.key === 'Category') setSelectedCategory('');
    if (filterToRemove.key === 'Collection') setSelectedCollection('');
    if (filterToRemove.key === 'SKU') setSelectedSku('');
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedVendor('');
    setSelectedProductType('');
    setSelectedAvailability('');
    setSelectedCategory('');
    setSelectedCollection('');
    setSelectedSku('');
    setPriceRange({ min: '', max: '' });
  };

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

      // Vendor filter
      const matchesVendor = !selectedVendor || product.vendor === selectedVendor;
      
      // Product type filter
      const matchesProductType = !selectedProductType || product.productType === selectedProductType;
      
      // Availability filter
      const matchesAvailability = !selectedAvailability || product.availability === selectedAvailability;
      
      // Category filter
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      // Collection filter
      const matchesCollection = !selectedCollection || product.collection === selectedCollection;
      
      // SKU filter
      const matchesSku = !selectedSku || product.sku === selectedSku;
      
      // Price range filter
      const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                          (!priceRange.max || product.price <= parseFloat(priceRange.max));

      return matchesSearch && matchesVendor && matchesProductType && matchesAvailability && 
             matchesCategory && matchesCollection && matchesSku && matchesPrice;
    });
  };

  // Removed useIndexResourceState hook as its values are unused

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectProductsModalOpen) {
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
  }, [selectProductsModalOpen]);

  return (
    <Page title="Linkr Dashboard">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            
            {/* App Information */}
            <Card>
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
            </Card>
            
            {/* Header Section with Marketplace Selection */}
            <Card>
              <BlockStack gap="400">
                <InlineStack gap="800" blockAlign="center">
                  <Text as="h2" variant="headingMd" fontWeight="semibold">
                    Amazon Region
                  </Text>
                  <div style={{ flex: 1 }}>
                    <Select 
                      label=""
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
                
              </BlockStack>
            </Card>

            {/* Product Management Section */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Tabs 
                    tabs={tabs} 
                    selected={selectedTab} 
                    onSelect={(selectedTabIndex) => {
                      setSelectedTab(selectedTabIndex);
                      setCurrentPage(1); // Reset to first page when changing tabs
                    }} 
                  />
                  <Button variant="primary" onClick={() => setSelectProductsModalOpen(true)}>
                    Select products
                  </Button>
                </InlineStack>
            
            {/* Status Filter Tabs */}

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
              <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                <IndexTable
                  resourceName={{ singular: 'product', plural: 'products' }}
                  itemCount={paginatedProducts.length}
                  selectable={false}
                  headings={[
                    { title: 'Product Name' },
                    { title: 'Clicks' },
                    { title: 'ASIN' },
                    { title: 'Keywords' },
                    { title: 'Custom Link' },
                    { title: `Status (${domainOptions.find(option => option.value === selectedAmazonDomain)?.label || selectedAmazonDomain})` },
                    { title: 'Actions' },
                  ]}
                >
                  {paginatedProducts.map((product, index) => (
                    <IndexTable.Row
                      id={product.id}
                      key={product.id}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text as="span" variant="bodyMd" fontWeight="medium">
                          <div style={{ maxWidth: '200px', minWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.title}
                          </div>
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" variant="bodyMd" tone="subdued">
                          {product.clicks}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" variant="bodyMd" tone={product.asin === '-' ? 'subdued' : undefined}>
                          <div style={{ minWidth: '80px' }}>
                            {product.asin}
                          </div>
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" variant="bodyMd" tone={product.keywords === '-' ? 'subdued' : undefined}>
                          <div style={{ maxWidth: '120px', minWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.keywords}
                          </div>
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" variant="bodyMd" tone={product.customLink === '-' ? 'subdued' : undefined}>
                          <div style={{ maxWidth: '120px', minWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.customLink}
                          </div>
                        </Text>
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
                        <div style={{ minWidth: '60px' }}>
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box paddingBlockStart="500">
                  <InlineStack align="center">
                    <Pagination
                      hasPrevious={currentPage > 1}
                      onPrevious={() => handlePageChange(currentPage - 1)}
                      hasNext={currentPage < totalPages}
                      onNext={() => handlePageChange(currentPage + 1)}
                      label={`${currentPage} of ${totalPages}`}
                    />
                  </InlineStack>
                </Box>
              )}
            </Box>
          </BlockStack>
        </Card>
          </BlockStack>
          
          {/* Explicit bottom gap - increased */}
          <Box paddingBlockStart="800" />
        </Layout.Section>
      </Layout>

        {/* Edit Product Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit product for ${domainOptions.find(option => option.value === selectedAmazonDomain)?.label || selectedAmazonDomain}`}
          primaryAction={{
            content: `Enable for ${selectedAmazonDomain}`,
            onAction: () => handleSaveProduct(true),
          }}
          secondaryActions={[
            {
              content: 'Save',
              onAction: () => handleSaveProduct(false),
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <Text as="p" variant="bodyMd" tone="subdued">
                You are editing settings for the {domainOptions.find(option => option.value === selectedAmazonDomain)?.label || selectedAmazonDomain} marketplace.
                Product status is region-specific.
              </Text>
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
              
              <Checkbox
                label="Improve search ranking"
                checked={editForm.improveSearchRanking}
                onChange={(checked) => setEditForm({ ...editForm, improveSearchRanking: checked })}
              />                  <TextField
                label="Keywords"
                value={editForm.keywords}
                onChange={(value) => setEditForm({ ...editForm, keywords: value })}
                autoComplete="off"
              />
            </FormLayout>
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* Select Products Modal */}
        <Modal
          open={selectProductsModalOpen}
          onClose={() => setSelectProductsModalOpen(false)}
          title="Select Products to Add"
          primaryAction={{
            content: "Add",
            onAction: () => {
              // Add selected products to the main products list with all regions set to inactive by default
              const newProducts = availableProducts
                .filter(product => selectedProductsForAdd.includes(product.id))
                .map(product => ({
                  id: `new_${Date.now()}_${product.id}`,
                  title: product.name,
                  image: product.image,
                  clicks: Math.floor(Math.random() * 100),
                  asin: '-',
                  keywords: '-',
                  customLink: '-',
                  regionStatus: createDefaultRegionStatus()
                }));
              
              setProducts(prev => [...newProducts, ...prev]);
              setSelectedProductsForAdd([]);
              setSelectProductsModalOpen(false);
              setProductSearchValue('');
              clearAllFilters();
            },
            disabled: selectedProductsForAdd.length === 0,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => {
                setSelectProductsModalOpen(false);
                setSelectedProductsForAdd([]);
                setProductSearchValue('');
                clearAllFilters();
              },
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <Filters
                  queryValue={productSearchValue}
                  queryPlaceholder="Search products"
                  onQueryChange={setProductSearchValue}
                  onQueryClear={() => setProductSearchValue('')}
                  filters={[
                  {
                    key: 'vendor',
                    label: 'Vendor',
                    filter: (
                      <Select
                        label=""
                        options={getUniqueVendors()}
                        value={selectedVendor}
                        onChange={(value) => {
                          setSelectedVendor(value);
                          if (value) {
                            // Remove existing vendor filter if any
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Vendor'));
                            // Add new vendor filter
                            const vendor = getUniqueVendors().find(v => v.value === value);
                            if (vendor) {
                              handleFilterAdd('Vendor', value, vendor.label);
                            }
                          } else {
                            // Clear vendor filter when empty value is selected
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Vendor'));
                          }
                        }}
                      />
                    ),
                    shortcut: true,
                  },
                  {
                    key: 'productType',
                    label: 'Product type',
                    filter: (
                      <Select
                        label=""
                        placeholder=""
                        options={getUniqueProductTypes()}
                        value={selectedProductType}
                        onChange={(value) => {
                          setSelectedProductType(value);
                          if (value) {
                            // Remove existing product type filter if any
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Product type'));
                            // Add new product type filter
                            const type = getUniqueProductTypes().find(t => t.value === value);
                            if (type) {
                              handleFilterAdd('Product type', value, type.label);
                            }
                          } else {
                            // Clear product type filter when empty value is selected
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Product type'));
                          }
                        }}
                      />
                    ),
                    shortcut: true,
                  },
                  {
                    key: 'availability',
                    label: 'Availability',
                    filter: (
                      <Select
                        label=""
                        placeholder=""
                        options={getUniqueAvailabilityOptions()}
                        value={selectedAvailability}
                        onChange={(value) => {
                          setSelectedAvailability(value);
                          if (value) {
                            // Remove existing availability filter if any
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Availability'));
                            // Add new availability filter
                            const availability = getUniqueAvailabilityOptions().find(a => a.value === value);
                            if (availability) {
                              handleFilterAdd('Availability', value, availability.label);
                            }
                          } else {
                            // Clear availability filter when empty value is selected
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Availability'));
                          }
                        }}
                      />
                    ),
                    shortcut: true,
                  },
                  {
                    key: 'category',
                    label: 'Category',
                    filter: (
                      <Select
                        label=""
                        placeholder=""
                        options={getUniqueCategories()}
                        value={selectedCategory}
                        onChange={(value) => {
                          setSelectedCategory(value);
                          if (value) {
                            // Remove existing category filter if any
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Category'));
                            // Add new category filter
                            const category = getUniqueCategories().find(c => c.value === value);
                            if (category) {
                              handleFilterAdd('Category', value, category.label);
                            }
                          } else {
                            // Clear category filter when empty value is selected
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Category'));
                          }
                        }}
                      />
                    ),
                    shortcut: true,
                  },
                  {
                    key: 'collection',
                    label: 'Collection',
                    filter: (
                      <Select
                        label=""
                        placeholder=""
                        options={getUniqueCollections()}
                        value={selectedCollection}
                        onChange={(value) => {
                          setSelectedCollection(value);
                          if (value) {
                            // Remove existing collection filter if any
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Collection'));
                            // Add new collection filter
                            const collection = getUniqueCollections().find(c => c.value === value);
                            if (collection) {
                              handleFilterAdd('Collection', value, collection.label);
                            }
                          } else {
                            // Clear collection filter when empty value is selected
                            setActiveFilters(prev => prev.filter(f => f.key !== 'Collection'));
                          }
                        }}
                      />
                    ),
                    shortcut: true,
                  },
                  {
                    key: 'sku',
                    label: 'SKU',
                    filter: (
                      <Select
                        label=""
                        placeholder=""
                        options={getUniqueSKUs()}
                        value={selectedSku}
                        onChange={(value) => {
                          setSelectedSku(value);
                          if (value) {
                            // Remove existing SKU filter if any
                            setActiveFilters(prev => prev.filter(f => f.key !== 'SKU'));
                            // Add new SKU filter
                            const sku = getUniqueSKUs().find(s => s.value === value);
                            if (sku) {
                              handleFilterAdd('SKU', value, sku.label);
                            }
                          } else {
                            // Clear SKU filter when empty value is selected
                            setActiveFilters(prev => prev.filter(f => f.key !== 'SKU'));
                          }
                        }}
                      />
                    ),
                    shortcut: true,
                  },
                  {
                    key: 'price',
                    label: 'Price',
                    filter: (
                      <InlineStack gap="200">
                        <TextField
                          label="Min price"
                          type="number"
                          value={priceRange.min}
                          onChange={(value) => setPriceRange(prev => ({ ...prev, min: value }))}
                          prefix="$"
                          autoComplete="off"
                        />
                        <TextField
                          label="Max price"
                          type="number"
                          value={priceRange.max}
                          onChange={(value) => setPriceRange(prev => ({ ...prev, max: value }))}
                          prefix="$"
                          autoComplete="off"
                        />
                      </InlineStack>
                    ),
                    shortcut: false,
                  },
                ]}
                appliedFilters={activeFilters}
                onClearAll={clearAllFilters}
              />
              
              <div 
                style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto'
                }}
              >
                <ResourceList
                  resourceName={{ singular: 'product', plural: 'products' }}
                  items={getFilteredProducts()}
                  renderItem={(product) => {
                    const isSelected = selectedProductsForAdd.includes(product.id);
                    return (
                      <ResourceList.Item
                        id={product.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedProductsForAdd(prev => 
                              prev.filter(id => id !== product.id)
                            );
                          } else {
                            setSelectedProductsForAdd(prev => [...prev, product.id]);
                          }
                        }}
                      >
                        <InlineStack align="space-between">
                          <BlockStack gap="100">
                            <Text as="h3" variant="headingSm" fontWeight="semibold">
                              {product.name}
                            </Text>
                            <Text as="p" variant="bodyMd" tone="subdued">
                              ${product.price.toFixed(2)} • {product.vendor} • {product.availability}
                            </Text>
                          </BlockStack>
                          <Checkbox 
                            label=""
                            checked={isSelected}
                            onChange={() => {}}
                          />
                        </InlineStack>
                      </ResourceList.Item>
                    );
                  }}
                />
              </div>
              {/* Product count information at bottom */}
              <Box paddingBlockStart="400">
                <InlineStack align="start">
                  <Text variant="bodySm" as="span" tone="subdued">
                    {products.length} total products added. New products will be added with inactive status for all regions.
                  </Text>
                </InlineStack>
              </Box>
              </BlockStack>
          </Modal.Section>
        </Modal>
    </Page>
  );
};

export default AmazonBuyButtonDashboard;
