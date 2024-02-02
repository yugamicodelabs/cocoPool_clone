import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';
import { types as sdkTypes } from '../../../../util/sdkLoader';

// Import shared components
import { H3, ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingPricingForm from './EditListingPricingForm';
import css from './EditListingPricingPanel.module.css';
import { priceByGuestCount } from '../../../../constants';
import { denormalisePriceRangeValues, normalisePriceRangeValues } from '../../../../util/data';

const { Money } = sdkTypes;

const getInitialValues = params => {
  const { listing } = params;
  const { price, publicData } = listing.attributes || {};
  const { priceRange, extraItems, isDiscount, minimumBookingHours, ...rest } = publicData;
  const updatedInitialData = denormalisePriceRangeValues(priceRange);
  const listExtra = extraItems?.map(item => {
    const { itemPrice, ...rest } = item;
    Object.assign(rest, { itemPrice: new Money(itemPrice?.amount, itemPrice?.currency) })
    return rest
  });

  return {
    // price,
    priceRange: priceByGuestCount || [],
    extraItems: listExtra || [],
    isDiscount:  isDiscount ? isDiscount : "No",
    minimumBookingHours,
    ...updatedInitialData
  };
};

const EditListingPricingPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    marketplaceCurrency,
    listingMinimumPriceSubUnits,
    disabled,
    ready,
    onSubmit,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    values
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const isPublished = listing?.id && listing?.attributes?.state !== LISTING_STATE_DRAFT;
  const initialValues = getInitialValues(props);
  const priceCurrencyValid =
    marketplaceCurrency && initialValues.price instanceof Money
      ? initialValues.price.currency === marketplaceCurrency
      : !!marketplaceCurrency;
  const unitType = listing?.attributes?.publicData?.unitType;

  return (
    <div className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingPricingPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingPricingPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>
      {priceCurrencyValid ? (
        <EditListingPricingForm
          className={css.form}
          initialValues={initialValues}
          onSubmit={values => {
            const { price, priceRange, extraItems, isDiscount, minimumBookingHours, ...rest } = values;
            // New values for listing attributes
            const listExtra = extraItems?.map(item => {
              const { itemPrice, ...rest } = item;
              Object.assign(rest, { itemPrice: { amount: itemPrice?.amount, currency: itemPrice?.currency } })
              return rest;
            });
            const updatedpriceRange = normalisePriceRangeValues(values);
            const maxGuestRange = updatedpriceRange && Array.isArray(updatedpriceRange) && updatedpriceRange.length && updatedpriceRange[updatedpriceRange.length - 1].quantityRange.split("-");
            const maxGuest = maxGuestRange?.length > 1 ? maxGuestRange[1] : maxGuestRange[0];
            const minGuestRange = updatedpriceRange && Array.isArray(updatedpriceRange) && updatedpriceRange.length && updatedpriceRange[0].quantityRange.split("-");
            const minGuest = minGuestRange?.length > 1 && minGuestRange[0];
            const updateValues = {
              price: new Money(updatedpriceRange[0]?.amount, updatedpriceRange[0]?.currency),
              publicData: {
                priceRange: updatedpriceRange,
                extraItems: listExtra,
                isDiscount,
                maxGuest,
                minGuest,
                minimumBookingHours
              }
            };
            onSubmit(updateValues);
          }}
          marketplaceCurrency={marketplaceCurrency}
          unitType={unitType}
          listingMinimumPriceSubUnits={listingMinimumPriceSubUnits}
          saveActionMsg={submitButtonText}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
        />
      ) : (
        <div className={css.priceCurrencyInvalid}>
          <FormattedMessage
            id="EditListingPricingPanel.listingPriceCurrencyInvalid"
            values={{ marketplaceCurrency }}
          />
        </div>
      )}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingPricingPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingPricingPanel;
