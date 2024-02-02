import React, { useState } from "react";
import { compose } from "redux";
import { injectIntl } from "react-intl";
import { Form as FinalForm } from "react-final-form";
import * as validators from "../../../../../util/validators";
import { Button, FieldDateInput, FieldDateRangeInput, FieldLocationAutocompleteInput, FieldSelect, FieldTextInput, Form } from "../../../../../components";
import { priceByGuestCount } from "../../../../../constants";
import IconCard from "../../../../../components/SavedCardDetails/IconCard/IconCard";
import classNames from "classnames";
import css from "./SearchFieldForm.module.css";
const identity = (v) => v;

const SearchFieldsFormComponent = props => (
    <FinalForm
        {...props}
        keepDirtyOnReinitialize={true}
        render={fieldRenderProps => {
            const {
                rootClassName,
                className,
                handleSubmit,
                form,
                formId,
                values,
                autoFocus,
                intl,
                invalid
            } = fieldRenderProps;
            const classes = classNames(rootClassName || css.root, className);
            // location
            const addressRequiredMessage = intl.formatMessage({
                id: 'EditListingLocationForm.addressRequired',
            });
            const addressNotRecognizedMessage = intl.formatMessage({
                id: 'EditListingLocationForm.addressNotRecognized',
            });
            // search Label
            const searchLabel = intl.formatMessage({
                id: "SearchFieldsForm.searchButtonLabel"
            });
            // Disbaled values can be changed here.
            const disabled = !values?.location && !values?.bookingDate && !values?.totalPersons;

            return (
                <Form className={classes} onSubmit={handleSubmit}>
                    <div className={css.heroSearchBox}>
                        <div className={css.heroSlider}>
                            <div className={css.searchBarSlider}>
                                <div className={css.locationInput}>
                                    <span className={css.searchIcon}>
                                        <IconCard brand="search" />
                                    </span>
                                    <FieldLocationAutocompleteInput
                                        className={css.inputBox}
                                        rootClassName={css.locationAddress}
                                        inputClassName={css.locationAutocompleteInput}
                                        iconClassName={css.locationAutocompleteInputIcon}
                                        predictionsClassName={css.predictionsRoot}
                                        validClassName={css.validLocation}
                                        autoFocus={autoFocus}
                                        name={formId ? `${formId}.location` : "location"}
                                        //label={intl.formatMessage({ id: 'SearchFieldForm.address' })}
                                        label={""}
                                        placeholder={intl.formatMessage({
                                            id: 'SearchFieldForm.addressPlaceholder',
                                        })}
                                        useDefaultPredictions={true}
                                        format={identity}
                                        valueFromForm={values.location}
                                    />
                                </div>
                                <div className={css.selectDate}>
                                    <FieldDateInput
                                        className={css.datePickerInput}
                                        id={"date"}
                                        name={"bookingDate"}
                                        placeholder={intl.formatMessage({ id: "FieldDateInput.placeholder" })}
                                        value={"bookingDate"}
                                        label={""}
                                    />
                                </div>
                                <div className={css.dropdownBox}>
                                    <span className={css.peopleIcon}>
                                        <IconCard brand="user" />
                                    </span>
                                    {/* <FieldTextInput
                                        id={formId ? `${formId}.totalPersons` : "totalPersons"}
                                        className={css.inputBox}
                                        name={"totalPersons"}
                                        type={"number"}
                                        placeholder={intl.formatMessage({ id: "SearchFieldForm.totalPersonsPlaceholder" })}
                                    /> */}
                                    <FieldSelect
                                        id={"totalGuests"}
                                        name={"totalPersons"}
                                        className={css.inputBox}
                                        placeholder={intl.formatMessage({ id: "SearchFieldForm.totalPersonsPlaceholder" })}
                                    >
                                        <option value={""} disabled>{intl.formatMessage({ id: "SearchFieldForm.totalPersonsPlaceholder" })}</option>
                                        {priceByGuestCount.map((item, index) =>{
                                            return(<option value={item.value} key={index}>{item.label}</option>)
                                        })}
                                    </FieldSelect>
                                </div>
                                <div className={css.submitButton}>
                                    <Button disabled={disabled}>{searchLabel}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            )
        }}
    />
);

const SearchComponent = compose(injectIntl)(SearchFieldsFormComponent);
SearchComponent.displayName = "Search Component";
export default SearchComponent;