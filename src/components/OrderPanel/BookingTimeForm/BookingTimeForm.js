import React, { Component, useEffect } from 'react';
import { array, bool, func, number, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';

import { propTypes } from '../../../util/types';
import { formatMoney } from '../../../util/currency';
import { timestampToDate } from '../../../util/dates';
import { types as sdkTypes } from "../../../util/sdkLoader";
import { FormattedMessage, intlShape, injectIntl } from '../../../util/reactIntl';
import { composeValidators, maxLength, minLength, numberAtLeast, numberAtMax, required } from '../../../util/validators';
import { BOOKING_PROCESS_NAME } from '../../../transactions/transaction';

import { FieldCheckbox, FieldSelect, Form, H6, PrimaryButton } from '../../../components';

import EstimatedCustomerBreakdownMaybe from '../EstimatedCustomerBreakdownMaybe';
import FieldDateAndTimeInput from './FieldDateAndTimeInput';

import css from './BookingTimeForm.module.css';

const { Money } = sdkTypes;


export class BookingTimeFormComponent extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleFormSubmit(e) {
    this.props.onSubmit(e);
  }

  // When the values of the form are updated we need to fetch
  // lineItems from this template's backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the orderData object.
  handleOnChange(formValues) {
    const { bookingStartTime, bookingEndTime, extraItems, guestCount } = formValues.values;
    const startDate = bookingStartTime ? timestampToDate(bookingStartTime) : null;
    const endDate = bookingEndTime ? timestampToDate(bookingEndTime) : null;

    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;
    // Note: we expect values bookingStartTime and bookingEndTime to be strings
    // which is the default case when the value has been selected through the form
    const isStartBeforeEnd = bookingStartTime < bookingEndTime;
    if (
      bookingStartTime &&
      bookingEndTime &&
      guestCount &&
      isStartBeforeEnd &&
      !this.props.fetchLineItemsInProgress
    ) {
      this.props.onFetchTransactionLineItems({
        orderData: { bookingStart: startDate, bookingEnd: endDate, extraItems: extraItems, guestCount },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const {
      rootClassName,
      className,
      price: unitPrice,
      minBookingPrice,
      dayCountAvailableForBooking,
      marketplaceName,
      extraItems,
      ...rest
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            endDatePlaceholder,
            startDatePlaceholder,
            form,
            pristine,
            handleSubmit,
            intl,
            isOwnListing,
            listingId,
            values,
            monthlyTimeSlots,
            onFetchTimeSlots,
            timeZone,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
            priceRange
          } = fieldRenderProps;

          const startTime = values && values.bookingStartTime ? values.bookingStartTime : null;
          const endTime = values && values.bookingEndTime ? values.bookingEndTime : null;
          const extraItem = values && values.extraItems ? values.extraItems : null;
          const startDate = startTime ? timestampToDate(startTime) : null;
          const endDate = endTime ? timestampToDate(endTime) : null;
          const totalGuests = values && values.totalGuests ? values.totalGuests : null;
          const minGuestRange = priceRange && Array.isArray(priceRange) && priceRange.length && priceRange[0].quantityRange.split("-");
          const minGuest = Array.isArray(minGuestRange) ? minGuestRange?.length > 1 && minGuestRange[0] : null;
          const maxGuestRange = priceRange && Array.isArray(priceRange) && priceRange.length && priceRange[priceRange.length - 1].quantityRange.split("-");
          const maxGuest = Array.isArray(maxGuestRange) ? maxGuestRange?.length > 1 ? maxGuestRange[1] : maxGuestRange[0] : null;

          // This is the place to collect breakdown estimation data. See the
          // EstimatedCustomerBreakdownMaybe component to change the calculations
          // for customized payment processes.
          const breakdownData =
            startDate && endDate
              ? {
                startDate,
                endDate,
                extraItem,
                totalGuests,
              }
              : null;
          const showEstimatedBreakdown =
            breakdownData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

          return (
            <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
              {/* <p className={css.submitButton} style={{ color: "blue" }}>
                <FormattedMessage type='submit' inProgress={fetchLineItemsError}
                  id={`Minimum Booking Amount is ${formatMoney(intl, minBookingPrice)}`}
                />
              </p> */}

              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />

              <div className={css.guestCount}>
                <label className={css.guestLabel}>Enter Guest Count</label>
                <div className={css.notCount}>Babies up to +3 do not count</div>
                <FieldSelect
                  id={"totalGuests"}
                  className={css.guestCountInput}
                  name={"guestCount"}
                  label={""}
                  validate={required("this is required")}
                >
                  <option disabled value={""}>Select Package</option>
                  {Array.isArray(priceRange) && priceRange.map((ele, index) => ele.quantityRange.split("-").length > 1 ?
                    <option value={ele.quantityRange} key={index}>
                      Entre {ele.quantityRange.split("-")[0]} y {ele.quantityRange.split("-")[1]} personas {formatMoney(intl, new Money(ele.amount, ele.currency))}
                    </option>
                    :
                    <option value={ele.quantityRange} key={index}>Entre {ele.quantityRange == "51_above" ? "+51" : null} personas {formatMoney(intl, new Money(ele.amount, ele.currency))}</option>)}
                </FieldSelect>
              </div>

              {monthlyTimeSlots && timeZone ? (
                <FieldDateAndTimeInput
                  className={css.inputBox}
                  startDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingStartTitle' }),
                    placeholderText: startDatePlaceholder,
                  }}
                  endDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingEndTitle' }),
                    placeholderText: endDatePlaceholder,
                  }}
                  listingId={listingId}
                  onFetchTimeSlots={onFetchTimeSlots}
                  monthlyTimeSlots={monthlyTimeSlots}
                  values={values}
                  intl={intl}
                  form={form}
                  pristine={pristine}
                  timeZone={timeZone}
                  dayCountAvailableForBooking={dayCountAvailableForBooking}
                />
              ) : null}

              {/* Extra Items */}
              <div className={css.extraBox}>
                <label>Extra's</label>
                {extraItems && extraItems.length ?
                  <div>
                    {extraItems.map((item, index) => {
                      const itemPrice = new Money(item.itemPrice.amount, item.itemPrice.currency)
                      return (
                        <FieldCheckbox
                          className={css.extraItem}
                          key={`extraItem-id${index}`}
                          id={`extraItem-id${index}`}
                          name={`extraItems`}
                          label={`${item.itemName}  ${formatMoney(intl, itemPrice)}`}
                          // class for item price "itemPrice"
                          value={item}
                        />
                      )
                    })}
                  </div> : null}
              </div>

              {showEstimatedBreakdown ? (
                <div className={css.priceBreakdownContainer}>
                  <H6 as="h3" className={css.bookingBreakdownTitle}>
                    <FormattedMessage id="BookingTimeForm.priceBreakdownTitle" />
                  </H6>
                  <hr className={css.totalDivider} />
                  <EstimatedCustomerBreakdownMaybe
                    breakdownData={breakdownData}
                    lineItems={lineItems}
                    timeZone={timeZone}
                    currency={unitPrice.currency}
                    marketplaceName={marketplaceName}
                    processName={BOOKING_PROCESS_NAME}
                  />
                </div>
              ) : null}

              {fetchLineItemsError ? (
                <span className={css.sideBarError}>
                  <FormattedMessage id="BookingTimeForm.fetchLineItemsError" />
                </span>
              ) : null}

              <div className={css.submitButton}>
                <PrimaryButton type="submit" inProgress={fetchLineItemsInProgress}>
                  <FormattedMessage id="BookingTimeForm.requestToBook" />
                </PrimaryButton>
              </div>

              <p className={css.finePrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingTimeForm.ownListing'
                      : 'BookingTimeForm.youWontBeChargedInfo'
                  }
                />
              </p>
            </Form >
          );
        }
        }
      />
    );
  }
}

BookingTimeFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  price: null,
  isOwnListing: false,
  listingId: null,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  monthlyTimeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingTimeFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  marketplaceName: string.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  listingId: propTypes.uuid,
  monthlyTimeSlots: object,
  onFetchTimeSlots: func.isRequired,
  timeZone: string.isRequired,

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,

  dayCountAvailableForBooking: number.isRequired,
};

const BookingTimeForm = compose(injectIntl)(BookingTimeFormComponent);
BookingTimeForm.displayName = 'BookingTimeForm';

export default BookingTimeForm;
