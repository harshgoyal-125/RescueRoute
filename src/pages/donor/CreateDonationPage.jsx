import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { FOOD_TYPES, QUANTITY_UNITS } from '../../data/donations';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import RescueRouteMap from '../../components/maps/RescueRouteMap';
import DietaryBadge from '../../components/common/DietaryBadge';

export default function CreateDonationPage() {
  const { addDonation, currentUser } = useApp();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodType: 'Prepared Meals',
    dietaryType: 'Vegetarian',
    foodName: '',
    quantity: '',
    unit: 'meals',
    pickupLocation: currentUser?.address || '142 Market Street, Back Kitchen Dock',
    availableUntil: '',
    description: '',
    contactInfo: `${currentUser?.contactPerson || 'Marcus'} ${currentUser?.phone || '(555) 234-5678'}`
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdItem, setCreatedItem] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food title or name is required (e.g. Vegetable Curry, Sandwiches)';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup address / loading dock location is required';
    }

    if (!formData.availableUntil) {
      newErrors.availableUntil = 'Available until / expiration deadline is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide brief handling instructions or food details';
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact name and phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific field error when typed into
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const created = await addDonation({
        ...formData,
        quantity: Number(formData.quantity)
      });

      setCreatedItem(created);
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Donation Created!',
        message: `${formData.quantity} ${formData.unit} of ${formData.foodName} posted for rescue routing.`
      });
    } catch (err) {
      setServerError(err.message || 'Failed to submit donation to backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }} data-testid="donation-success-message">
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Donation Posted Successfully!
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Your donation of <strong>{createdItem?.quantity} {createdItem?.unit} of {createdItem?.foodName}</strong> has been published to the RescueRoute network. Local shelters within your area will now receive automated match alerts.
            </p>

            <div
              style={{
                backgroundColor: 'var(--slate-50)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Donation ID:</span>
                <span style={{ fontWeight: 600 }}>{createdItem?.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Status:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-info)' }}>POSTED (Awaiting Match)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Dietary Classification:</span>
                <DietaryBadge type={createdItem?.dietaryType || formData.dietaryType} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-500)' }}>Pickup Location:</span>
                <span style={{ fontWeight: 500, color: 'var(--slate-800)' }}>{createdItem?.pickupLocation}</span>
              </div>
            </div>

            {/* Registered Pickup Location Map */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }} data-testid="donor-pickup-map-container">
              <RescueRouteMap
                markers={[
                  {
                    id: `pickup-${createdItem?.id || 'new'}`,
                    type: 'pickup',
                    coordinates: createdItem?.location?.coordinates || currentUser?.location?.coordinates || [-122.4194, 37.7749],
                    title: createdItem?.foodName || 'Donation Pickup',
                    subtitle: `${createdItem?.quantity} ${createdItem?.unit} ready for rescue`,
                    address: createdItem?.pickupLocation
                  }
                ]}
                height="220px"
                title="Registered Pickup Origin"
                subtitle="Exact pickup coordinates registered in RescueRoute database"
                zoom={14}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    foodType: 'Prepared Meals',
                    foodName: '',
                    quantity: '',
                    unit: 'meals',
                    pickupLocation: currentUser?.address || '',
                    availableUntil: '',
                    description: '',
                    contactInfo: `${currentUser?.contactPerson || 'Marcus'} ${currentUser?.phone || ''}`
                  });
                }}
              >
                Post Another Donation
              </Button>

              <Button
                variant="primary"
                onClick={() => navigate('/donor/donations')}
                data-testid="view-donations-btn"
              >
                View My Donations
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="create-donation-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <button
            type="button"
            onClick={() => navigate('/donor')}
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '0.75rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Donor Dashboard</span>
          </button>
          <h1 className="page-title">Create Surplus Food Donation</h1>
          <p className="page-description">
            Share food surplus with verified community shelters before expiration.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate data-testid="create-donation-form">
          {/* Dietary Classification Row */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ marginBottom: '0.4rem', fontWeight: 600 }}>
              {t('dietaryClassification')} *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {[
                { type: 'Vegetarian', icon: '🌱', key: 'vegetarian' },
                { type: 'Eggetarian', icon: '🥚', key: 'eggetarian' },
                { type: 'Non-Vegetarian', icon: '🍗', key: 'nonVegetarian' },
                { type: 'Vegan', icon: '🌿', key: 'vegan' }
              ].map(diet => {
                const isSelected = formData.dietaryType === diet.type;
                return (
                  <button
                    key={diet.type}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, dietaryType: diet.type }))}
                    data-testid={`diet-btn-${diet.type.toLowerCase()}`}
                    aria-pressed={isSelected}
                    className={`dietary-select-btn ${isSelected ? 'selected' : ''}`}
                    style={{
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border-strong)',
                      backgroundColor: isSelected ? 'var(--color-toggle-active-bg)' : 'var(--color-surface)',
                      color: isSelected ? 'var(--color-toggle-active-text)' : 'var(--color-text)',
                      fontWeight: '600'
                    }}
                  >
                    <span aria-hidden="true">{diet.icon}</span>
                    <span style={{ color: 'inherit', fontWeight: 600 }}>{t(diet.key)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Details Row */}
          <div className="form-row">
            <FormField
              id="foodType"
              name="foodType"
              label="Food Category"
              type="select"
              value={formData.foodType}
              onChange={handleChange}
              options={FOOD_TYPES}
              required
            />

            <FormField
              id="foodName"
              name="foodName"
              label="Food Item / Title"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="e.g. Roasted Chicken Bowls, Whole Wheat Bread"
              required
              error={errors.foodName}
            />
          </div>

          {/* Quantity & Unit Row */}
          <div className="form-row">
            <FormField
              id="quantity"
              name="quantity"
              label="Quantity Amount"
              type="number"
              min="1"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
              error={errors.quantity}
            />

            <FormField
              id="unit"
              name="unit"
              label="Unit of Measure"
              type="select"
              value={formData.unit}
              onChange={handleChange}
              options={QUANTITY_UNITS}
              required
            />
          </div>

          {/* Location & Time Row */}
          <div className="form-row">
            <FormField
              id="pickupLocation"
              name="pickupLocation"
              label="Pickup Location / Address"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="e.g. 142 Market Street, Back Dock"
              required
              error={errors.pickupLocation}
              helpText="Specify dock number, security gate, or back alley entry."
            />

            <FormField
              id="availableUntil"
              name="availableUntil"
              label="Available Until (Expiry Deadline)"
              type="datetime-local"
              value={formData.availableUntil}
              onChange={handleChange}
              required
              error={errors.availableUntil}
            />
          </div>

          {/* Description & Packaging */}
          <FormField
            id="description"
            name="description"
            label="Food Description & Temperature Requirements"
            type="textarea"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Prepared in certified commercial kitchen at 12:30 PM. Stored in hotel pans at 40°F. Needs refrigeration."
            required
            error={errors.description}
          />

          {/* Contact Details */}
          <FormField
            id="contactInfo"
            name="contactInfo"
            label="On-site Dispatch Contact (Name & Phone)"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="e.g. Marcus Vance (555) 234-5678"
            required
            error={errors.contactInfo}
            helpText="Driver will text or call this number upon arriving for pickup."
          />

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              borderTop: '1px solid var(--slate-100)',
              paddingTop: '1.25rem',
              marginTop: '1.5rem'
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/donor')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Send}
              data-testid="submit-donation-btn"
            >
              Publish Food Donation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
