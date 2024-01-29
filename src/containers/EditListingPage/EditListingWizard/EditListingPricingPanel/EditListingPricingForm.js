import React, { useState } from 'react';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { bool, func, number, shape, string } from 'prop-types';

// Import configs and util modules
import appSettings from '../../../../config/settings';
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import * as validators from '../../../../util/validators';
import { formatMoney } from '../../../../util/currency';
import { types as sdkTypes } from '../../../../util/sdkLoader';

// Import shared components
import { Button, Form, FieldCurrencyInput, FieldTextInput, FieldSelect, FieldCheckbox } from '../../../../components';
import IconCard from '../../../../components/SavedCardDetails/IconCard/IconCard';

// Import constant Values
import { priceByGuestCount } from '../../../../constants';

// Import modules from this directory
import css from './EditListingPricingForm.module.css';

const { Money } = sdkTypes;

const getPriceValidators = (listingMinimumPriceSubUnits, marketplaceCurrency, intl) => {
  const priceRequiredMsgId = { id: 'EditListingPricingForm.priceRequired' };
  const priceRequiredMsg = intl.formatMessage(priceRequiredMsgId);
  const priceRequired = validators.required(priceRequiredMsg);

  const minPriceRaw = new Money(listingMinimumPriceSubUnits, marketplaceCurrency);
  const minPrice = formatMoney(intl, minPriceRaw);
  const priceTooLowMsgId = { id: 'EditListingPricingForm.priceTooLow' };
  const priceTooLowMsg = intl.formatMessage(priceTooLowMsgId, { minPrice });
  const minPriceRequired = validators.moneySubUnitAmountAtLeast(
    priceTooLowMsg,
    listingMinimumPriceSubUnits
  );

  return listingMinimumPriceSubUnits
    ? validators.composeValidators(priceRequired, minPriceRequired)
    : priceRequired;
};

const validatePerPersonPrice = (valperPerson)=>{
  const newEnteties = [];
  const filteredRange = priceByGuestCount.filter((option, index) => valperPerson[option.label]);
  for (let i of filteredRange) {
    if (valperPerson[i.key]) {
      newEnteties.push(valperPerson[i.key + "-price"] ? true : false);
    }
  }
  return !filteredRange.length > 0 || newEnteties.includes(false);
}

export const EditListingPricingFormComponent = props => (
  <FinalForm
    {...props}
    keepDirtyOnReinitialize={true}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        formId,
        autoFocus,
        className,
        disabled,
        ready,
        handleSubmit,
        marketplaceCurrency,
        unitType,
        listingMinimumPriceSubUnits,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        values,
        form
      } = formRenderProps;

      const [openItem, setOpenItem] = useState(null);

      const handleToggle = (id) => {
        setOpenItem(openItem === id ? null : id);
      };

      const priceValidators = getPriceValidators(
        listingMinimumPriceSubUnits,
        marketplaceCurrency,
        intl
      );

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress || validatePerPersonPrice(values);
      const { updateListingError, showListingsError } = fetchErrors || {};
      const discountText = intl.formatMessage({ id: "EditListingPricingForm.discountText" });
      const extraItemLabel = intl.formatMessage({ id: "EditListingPricingForm.extraItemText" });
      const addExtraItemText = intl.formatMessage({ id: "EditListingPricingForm.addExtraItemText" });
      const price_per_person_per_hourLabel = intl.formatMessage({ id: "EditListingpricingForm.price_per_person_per_hour_label" });

      return (
        <Form onSubmit={handleSubmit} className={classes}>

          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.updateFailed" />
            </p>
          ) : null}

          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.showListingFailed" />
            </p>
          ) : null}

          {/* currency per persons */}
          <div>
            <div className={css.pricingHeading}>{price_per_person_per_hourLabel}</div>
            {priceByGuestCount.map((option, index) => {
              return (
                <div key={option.label + '-' + index} className={css.inlineRow}>
                  <FieldCheckbox
                    id={formId ? `${formId}.guestCount.${option.label}` : "guestCount-" + option.label}
                    name={option.value}
                    label={option.label + ' personas'}
                  />
                  <span className={css.secondInput}>
                    <FieldCurrencyInput
                      id={`${formId}price`}
                      name={option.value + '-price'}
                      className={css.inputBox}
                      autoFocus={autoFocus}
                      label={""}
                      disabled={!values[option.value]}  
                      placeholder={"Escribe un precio por hora"}
                      currencyConfig={appSettings.getCurrencyFormatting(marketplaceCurrency)}
                    />
                    <span>/h</span>
                  </span>
                </div>
              )
            })}
          </div>

          {/* Minimum Booking Amount */}
          <div className={css.minmaxPrice}>
            <label className={css.priceLabel}>
              <FormattedMessage id="EditListingPricingForm.minPricePerProduct" />
            </label>
            <div className={css.priceSubHeading}><FormattedMessage id="EditListingPricingForm.minPriceSubHeading"/></div>
            <FieldCurrencyInput
              id={`${formId}minimumBookingAmount`}
              name="minimumBookingAmount"
              autoFocus={autoFocus}
              placeholder={intl.formatMessage({ id: 'EditListingPricingForm.priceInputPlaceholder' })}
              currencyConfig={appSettings.getCurrencyFormatting(marketplaceCurrency)}
              // validate={priceValidators}
            />
          </div>

          {/* Extra Items */}
          <div key={'extraItem'} className={css.accordanceHeading}>
            <h4 className={css.extraHeading}>{extraItemLabel}</h4>
            <h5 className={css.subHeading}><FormattedMessage id="EditListingPricingForm.extraItemsSubHeading" /></h5>
            <FieldArray name="extraItems">
              {({ fields }) => fields.map((name, index, key) => (
                <div className={css.accordanceBoxWraper} key={name + index}>
                  <details
                    key={key}
                    className={`${css.accordanceBox} ${openItem === key ? css.open : ''}`}
                    onClick={() => handleToggle(key)}
                  >
                    <summary className={css.accordionTitle} >
                      <div className={css.leftBox}>
                        <div className={css.accordionDetail}>
                          <h4>{values && values?.extraItems[index]?.itemName ? values?.extraItems[index]?.itemName : `Item-${index + 1}`}</h4>
                          <div
                            onClick={() => fields.remove(index)}
                            className={css.trashButton}
                          >
                            <IconCard brand="trash" />
                          </div>
                        </div>
                      </div>
                    </summary>
                    <div key={`${name}${index}`} className={css.accordanceBody}>

                      <FieldTextInput
                        id={formId ? `${formId}.itemName` : 'itemName'}
                        className={css.inputBox}
                        name={`${name}.itemName`}
                        type={"text"}
                        label={`Item-Name`}
                        placeholder="Add Item"
                        validate={validators.required(intl.formatMessage({ id: "EditListingPricingForm.isDiscountRequired" }))}
                      />
                      <FieldCurrencyInput
                        id={formId ? `${formId}.itemPrice` : 'itemPrice'}
                        name={`${name}.itemPrice`}
                        className={css.inputBox}
                        label={`Price`}
                        placeholder="Item Price"
                        currencyConfig={appSettings.getCurrencyFormatting(marketplaceCurrency)}
                        validate={validators.required(intl.formatMessage({ id: "EditListingPricingForm.isDiscountRequired" }))}
                      />
                    </div>
                  </details>
                </div>
              ))}
            </FieldArray>
            <Button
              type="button"
              onClick={() => form.change("extraItems", [...values.extraItems, {}])}
              className={css.addExtraButton}
            >
              <span className={css.plusIcon}>
                <IconCard brand="plus" />
              </span>
              {addExtraItemText}
            </Button>
          </div>

          {/* Discount */}
          <div>
            <FieldSelect
              className={css.discountInput}
              id="isDiscount"
              name="isDiscount"
              label={intl.formatMessage({ id: "EditListingPricingForm.isDiscountLabel" })}
              validate={validators.required(intl.formatMessage({ id: "EditListingPricingForm.isDiscountRequired" }))}
            >
              <option disabled value="">{intl.formatMessage({ id: "EditListingPricingForm.isDiscountPlaceholder" })}</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </FieldSelect>
            <div className={css.discountBox}>
              {discountText}
            </div>
          </div>

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form >
      );
    }}
  />
);

EditListingPricingFormComponent.defaultProps = {
  fetchErrors: null,
  listingMinimumPriceSubUnits: 0,
  formId: 'EditListingPricingForm',
};

EditListingPricingFormComponent.propTypes = {
  formId: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  marketplaceCurrency: string.isRequired,
  unitType: string.isRequired,
  listingMinimumPriceSubUnits: number,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
