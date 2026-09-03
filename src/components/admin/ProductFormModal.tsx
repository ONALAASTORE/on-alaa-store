import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Tag, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Product } from '../../types';


interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (product: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}) => {
  // Base fields
  const [name, setName] = useState(productToEdit?.name || '');
  const [brand, setBrand] = useState(productToEdit?.brand || 'Apple');
  const [category, setCategory] = useState(productToEdit?.category || 'smartphones');
  const [basePriceUSD, setBasePriceUSD] = useState<number>(productToEdit?.basePriceUSD || 0);
  const [originalPriceUSD, setOriginalPriceUSD] = useState<number | ''>(
    productToEdit?.originalPriceUSD || ''
  );
  const [image, setImage] = useState(productToEdit?.image || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [inStock, setInStock] = useState<boolean>(productToEdit ? productToEdit.inStock : true);
  const [condition, setCondition] = useState<'Brand New (Sealed)' | 'Open Box' | 'Certified Pre-Owned'>(
    productToEdit?.condition || 'Brand New (Sealed)'
  );
  const [warranty, setWarranty] = useState(productToEdit?.warranty || '1 Year Official Agency Warranty');

  // Bulleted Description Points / Features
  const [features, setFeatures] = useState<string[]>(
    productToEdit?.features && productToEdit.features.length > 0
      ? [...productToEdit.features]
      : ['Official Agency Warranty included', 'High performance battery', 'Original sealed packaging']
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // Dynamic Custom Key-Value Columns / Attributes (e.g. Color, Storage, Warranty, RAM, Screen)
  const initialSpecs = productToEdit?.specs
    ? Object.entries(productToEdit.specs).map(([key, value]) => ({ key, value }))
    : [
        { key: 'Storage', value: '256GB' },
        { key: 'Color', value: 'Black Titanium' },
        { key: 'Warranty', value: '1 Year Official Lebanese Warranty' }
      ];
  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>(initialSpecs);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Error validation
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handlers for Features / Bullet points
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Handlers for Dynamic Attributes
  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setSpecsList([...specsList, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (index: number) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  const handleUpdateSpec = (index: number, key: string, value: string) => {
    const updated = [...specsList];
    updated[index] = { key, value };
    setSpecsList(updated);
  };

  // Save product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product title is required');
      return;
    }
    if (basePriceUSD <= 0) {
      setErrorMsg('Please specify a valid price in USD (greater than 0)');
      return;
    }

    const fallbackImage = image.trim() || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80';

    // Compile dynamic specs object
    const compiledSpecs: Record<string, string> = {};
    specsList.forEach(({ key, value }) => {
      if (key.trim()) {
        compiledSpecs[key.trim()] = value.trim();
      }
    });

    const newId = productToEdit?.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const savedProduct: Product = {
      id: newId,
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim(),
      subcategory: productToEdit?.subcategory || 'Electronics',
      description: description.trim() || `${name} with official Lebanese warranty and nationwide express delivery.`,
      features: features.length > 0 ? features : ['Official Lebanese Agency Warranty', 'Brand New Original Unit'],
      specs: compiledSpecs,
      image: fallbackImage,
      galleryImages: productToEdit?.galleryImages?.length ? productToEdit.galleryImages : [fallbackImage],
      basePriceUSD: Number(basePriceUSD),
      originalPriceUSD: originalPriceUSD !== '' && Number(originalPriceUSD) > Number(basePriceUSD) ? Number(originalPriceUSD) : undefined,
      variants: productToEdit?.variants?.length 
        ? productToEdit.variants 
        : [
            {
              id: `${newId}-standard`,
              name: 'Standard Option',
              priceUSD: Number(basePriceUSD),
              inStock: inStock
            }
          ],
      rating: productToEdit?.rating || 4.9,
      reviewCount: productToEdit?.reviewCount || 12,
      condition: condition,
      warranty: warranty.trim() || '1 Year Official Agency Warranty',
      inStock: inStock,
      isFeatured: productToEdit?.isFeatured ?? true,
      tags: productToEdit?.tags || [brand, category, 'Trending'],
      freeDelivery: basePriceUSD >= 150
    };

    onSave(savedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{productToEdit ? 'Edit Product' : 'Add New Product'}</span>
          </div>
          <h3 className="text-2xl font-black text-white font-display">
            {productToEdit ? `Updating: ${productToEdit.name}` : 'Create Catalog Product'}
          </h3>
          <p className="text-xs text-slate-400">
            Fill in the details below. All updates reflect instantly on the public store.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF0000] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Product Title / Model Name <span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple iPhone 16 Pro Max 256GB"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-[#FF0000] outline-none"
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Sony">Sony (PlayStation & Audio)</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Honor">Honor</option>
                <option value="Anker">Anker</option>
                <option value="Google">Google Pixel</option>
                <option value="Nintendo">Nintendo</option>
                <option value="Other">Other Brand</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-[#FF0000] outline-none"
              >
                <option value="smartphones">Smartphones</option>
                <option value="tablets">iPads & Tablets</option>
                <option value="laptops">MacBooks & Laptops</option>
                <option value="gaming">PlayStation & Gaming</option>
                <option value="audio">AirPods & Headphones</option>
                <option value="wearables">Apple Watch & Smartwatches</option>
                <option value="chargers">Fast Chargers & GaN Power</option>
                <option value="accessories">Cases & Screen Protectors</option>
              </select>
            </div>

            {/* Base Price USD */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Base Price (USD) <span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  value={basePriceUSD || ''}
                  onChange={(e) => setBasePriceUSD(parseFloat(e.target.value) || 0)}
                  placeholder="1280"
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:border-[#FF0000] outline-none"
                />
              </div>
            </div>

            {/* Discount / Original Price USD */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Original / Strike Price (USD) <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  value={originalPriceUSD}
                  onChange={(e) => setOriginalPriceUSD(e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="1350"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:border-[#FF0000] outline-none"
                />
              </div>
            </div>

            {/* Image URL with live preview thumbnail */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Primary Product Image URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or CDN link"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none"
                />
                {image && (
                  <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-contain rounded" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Condition & Inventory Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-[#FF0000] outline-none"
              >
                <option value="Brand New (Sealed)">Brand New (Sealed)</option>
                <option value="Open Box">Open Box</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Inventory Stock Status
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex-1">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF0000] focus:ring-[#FF0000] bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    {inStock ? 'Available In Stock' : 'Mark Out of Stock'}
                  </span>
                </label>
              </div>
            </div>

            {/* Warranty field */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Official Warranty Policy
              </label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="1 Year Official Agency Warranty (Apple / Samsung / Sony)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Overview Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary highlighting the key flagship features..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none resize-none"
              />
            </div>
          </div>

          {/* Section: Bulleted Description Points / Highlights */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Bulleted Feature Points ({features.length})</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Key highlights shown on the product card & detailed specs page
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-slate-500 font-bold">•</span>
                  <span className="flex-1 text-slate-200 truncate">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new feature input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add bullet highlight (e.g. 48MP Main Camera with 5x Optical Zoom)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>
          </div>

          {/* Section: Dynamic Key-Value Columns / Attributes */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Dynamic Custom Columns & Attributes ({specsList.length})</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Custom properties such as Color, Storage, RAM, Battery, Camera, Display
                </p>
              </div>
            </div>

            {/* List of custom key-value pairs */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {specsList.map((spec, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleUpdateSpec(idx, e.target.value, spec.value)}
                      placeholder="Attribute Name"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs focus:border-[#FF0000] outline-none"
                    />
                  </div>
                  <div className="col-span-7">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, spec.key, e.target.value)}
                      placeholder="Attribute Value"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-[#FF0000] outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new attribute input row */}
            <div className="grid grid-cols-12 gap-2 pt-1">
              <div className="col-span-4">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="New Column (e.g. Storage)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none"
                />
              </div>
              <div className="col-span-6">
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g. 512GB NVMe)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
