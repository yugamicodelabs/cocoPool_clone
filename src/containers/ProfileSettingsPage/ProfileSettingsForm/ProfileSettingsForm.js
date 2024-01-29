import React, { Component, useEffect } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { ensureCurrentUser } from '../../../util/data';
import { propTypes } from '../../../util/types';
import * as validators from '../../../util/validators';
import { isUploadImageOverLimitError } from '../../../util/errors';

import {
  Form,
  Avatar,
  Button,
  ImageFromFile,
  IconSpinner,
  FieldTextInput,
  H4,
  FieldPhoneNumberInput,
  FieldLocationAutocompleteInput,
} from '../../../components';

import css from './ProfileSettingsForm.module.css';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset
const MAX_LENGTH_POSTAL_CODE = 6;
const DNI_NIE_MINIMUM_LENGTH = 10;
const DNI_NIE_MAXIMUM_LENGTH = 10;

class ProfileSettingsFormComponent extends Component {
  constructor(props) {
    super(props);

    this.uploadDelayTimeoutId = null;
    this.state = { uploadDelay: false };
    this.submittedValues = {};
  }

  componentDidUpdate(prevProps) {
    // Upload delay is additional time window where Avatar is added to the DOM,
    // but not yet visible (time to load image URL from srcset)
    if (prevProps.uploadInProgress && !this.props.uploadInProgress) {
      this.setState({ uploadDelay: true });
      this.uploadDelayTimeoutId = window.setTimeout(() => {
        this.setState({ uploadDelay: false });
      }, UPLOAD_CHANGE_DELAY);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.uploadDelayTimeoutId);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        keepDirtyOnReinitialize={true}
        render={fieldRenderProps => {
          const {
            className,
            currentUser,
            handleSubmit,
            intl,
            invalid,
            onImageUpload,
            pristine,
            profileImage,
            rootClassName,
            updateInProgress,
            updateProfileError,
            uploadImageError,
            uploadInProgress,
            form,
            marketplaceName,
            values,
            formId,
            autoFocus
          } = fieldRenderProps;

          const user = ensureCurrentUser(currentUser);

          // First name
          const firstNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameLabel',
          });
          const firstNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNamePlaceholder',
          });
          const firstNameRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameRequired',
          });
          const firstNameRequired = validators.required(firstNameRequiredMessage);

          // Last name
          const lastNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNameLabel',
          });
          const lastNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNamePlaceholder',
          });
          const lastNameRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNameRequired',
          });
          const lastNameRequired = validators.required(lastNameRequiredMessage);

          // Bio
          const bioLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.bioLabel',
          });
          const bioPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.bioPlaceholder',
          });

          // location
          const addressRequiredMessage = intl.formatMessage({
            id: 'EditListingLocationForm.addressRequired',
          });
          const addressNotRecognizedMessage = intl.formatMessage({
            id: 'EditListingLocationForm.addressNotRecognized',
          });
          // Postal code
          const maxLengthMessage = intl.formatMessage(
            { id: "ProfileSettingsForm.postalCodemaxLength" },
            { max: MAX_LENGTH_POSTAL_CODE }
          )
          const maxLength = validators.maxLength(maxLengthMessage, MAX_LENGTH_POSTAL_CODE);
          // Telephone
          const telephoneRequiredMessage = validators.requiredStringNoTrim(intl.formatMessage({
            id: 'SignupForm.phoneNumberRequired',
          }))
          const telephoneMinLength = validators.minLength(
            intl.formatMessage({ id: "SignupForm.telephoneTooShort" }, { minLength: validators.TELEPHONE_MIN_LENGTH }),
            validators.TELEPHONE_MIN_LENGTH,
          )
          const telephoneMaxLength = validators.maxLength(
            intl.formatMessage({ id: "SignupForm.telephoneTooLong" }, { minLength: validators.TELEPHONE_MIN_LENGTH }),
            validators.TELEPHONE_MIN_LENGTH,
          )
          const telephoneValidators = validators.composeValidators(
            telephoneRequiredMessage,
            telephoneMinLength,
            telephoneMaxLength
          );
          const telephoneLabel = intl.formatMessage({ id: "ProfileSettingsForm.telephoneLabel" });
          const telephonePlaceholder = intl.formatMessage({ id: "ProfileSettingsForm.telephonePlaceholder" });
          // USERNAME
          const usernameLabel = intl.formatMessage({ id: "ProfileSettingsForm.usernameLabel" });
          const usernamePlaceholder = intl.formatMessage({ id: "ProfileSettingsForm.usernamePlaceholder" });
          // DNI/NIE number
          const dni_nie_number_label = intl.formatMessage({ id: "ProfileSettingsForm.dni_nie_number_label" });
          const dni_nie_number_placeholder = intl.formatMessage({ id: "ProfileSettingsForm.dni_nie_number_placeholder" });
          const dni_nie_min_length = validators.minLength(
            intl.formatMessage({ id: "ProfileSettingsForm.dni_nie_min_length_error" }, { minLen: DNI_NIE_MINIMUM_LENGTH }),
            DNI_NIE_MINIMUM_LENGTH
          );
          const dni_nie_max_length = validators.maxLength(
            intl.formatMessage({ id: "ProfileSettingsForm.dni_nie_max_length_error" }, { maxLen: DNI_NIE_MAXIMUM_LENGTH }),
            DNI_NIE_MAXIMUM_LENGTH 
          );
          const dni_nie_number_validate = validators.composeValidators(lastNameRequired, dni_nie_max_length, dni_nie_min_length);
          // Birthday
          const birthdayLabel = intl.formatMessage({ id: "ProfileSettingsForm.birthdayLabel" });
          const birthdayPlaceholder = intl.formatMessage({ id: "ProfileSettingsForm.birthdayPlaceholder" });
          // Street
          const streetLabel = intl.formatMessage({ id: "ProfileSettingsForm.streetLabel" });
          const streetplaceholder = intl.formatMessage({ id: "ProfileSettingsForm.streetPlaceholder" });
          // Provence
          const provenceLabel = intl.formatMessage({ id: "ProfileSettingsForm.provenceLabel" });
          const provencePlaceholder = intl.formatMessage({ id: "ProfileSettingsForm.provencePlaceholder" });
          // Number
          const numberLabel = intl.formatMessage({ id: "ProfileSettingsForm.numberLabel" });
          const numberPlaceholder = intl.formatMessage({ id: "ProfileSettingsForm.numberPlaceholder" });
          // City
          const cityLabel = intl.formatMessage({ id: "ProfileSettingsForm.cityLabel" });
          const cityPlaceholder = intl.formatMessage({ id: "ProfileSettingsForm.cityPlaceholder" });
          // Postal Code
          const postalCodeLabel = intl.formatMessage({ id: "ProfileSettingsForm.postalCodeLabel" });
          const postalCodePlaceholder = intl.formatMessage({ id: "ProfileSettingsForm.postalCodePlaceholder" });


          const uploadingOverlay =
            uploadInProgress || this.state.uploadDelay ? (
              <div className={css.uploadingImageOverlay}>
                <IconSpinner />
              </div>
            ) : null;

          const hasUploadError = !!uploadImageError && !uploadInProgress;
          const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });
          const transientUserProfileImage = profileImage.uploadedImage || user.profileImage;
          const transientUser = { ...user, profileImage: transientUserProfileImage };

          // Ensure that file exists if imageFromFile is used
          const fileExists = !!profileImage.file;
          const fileUploadInProgress = uploadInProgress && fileExists;
          const delayAfterUpload = profileImage.imageId && this.state.uploadDelay;
          const imageFromFile =
            fileExists && (fileUploadInProgress || delayAfterUpload) ? (
              <ImageFromFile
                id={profileImage.id}
                className={errorClasses}
                rootClassName={css.uploadingImage}
                aspectWidth={1}
                aspectHeight={1}
                file={profileImage.file}
              >
                {uploadingOverlay}
              </ImageFromFile>
            ) : null;

          // Avatar is rendered in hidden during the upload delay
          // Upload delay smoothes image change process:
          // responsive img has time to load srcset stuff before it is shown to user.
          const avatarClasses = classNames(errorClasses, css.avatar, {
            [css.avatarInvisible]: this.state.uploadDelay,
          });
          const avatarComponent =
            !fileUploadInProgress && profileImage.imageId ? (
              <Avatar
                className={avatarClasses}
                renderSizes="(max-width: 767px) 96px, 240px"
                user={transientUser}
                disableProfileLink
              />
            ) : null;

          const chooseAvatarLabel =
            profileImage.imageId || fileUploadInProgress ? (
              <div className={css.avatarContainer}>
                {imageFromFile}
                {avatarComponent}
                <div className={css.changeAvatar}>
                  <FormattedMessage id="ProfileSettingsForm.changeAvatar" />
                </div>
              </div>
            ) : (
              <div className={css.avatarPlaceholder}>
                <div className={css.avatarPlaceholderText}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePicture" />
                </div>
                <div className={css.avatarPlaceholderTextMobile}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePictureMobile" />
                </div>
              </div>
            );

          const submitError = updateProfileError ? (
            <div className={css.error}>
              <FormattedMessage id="ProfileSettingsForm.updateProfileFailed" />
            </div>
          ) : null;

          const fillRequiredFieldsMessage = intl.formatMessage({ id: "ProfileSettingsForm.requiredFieldsMessage" });

          const classes = classNames(rootClassName || css.root, className);
          const submitInProgress = updateInProgress;
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled = invalid || pristine || pristineSinceLastSubmit || uploadInProgress || submitInProgress;

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              <div className={css.sectionContainer}>
                <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourProfilePicture" />
                </H4>
                <Field
                  accept={ACCEPT_IMAGES}
                  id="profileImage"
                  name="profileImage"
                  label={chooseAvatarLabel}
                  type="file"
                  form={null}
                  uploadImageError={uploadImageError}
                  disabled={uploadInProgress}
                >
                  {fieldProps => {
                    const { accept, id, input, label, disabled, uploadImageError } = fieldProps;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`profileImage`, file);
                      form.blur(`profileImage`);
                      if (file != null) {
                        const tempId = `${file.name}_${Date.now()}`;
                        onImageUpload({ id: tempId, file });
                      }
                    };

                    let error = null;

                    if (isUploadImageOverLimitError(uploadImageError)) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailedFileTooLarge" />
                        </div>
                      );
                    } else if (uploadImageError) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailed" />
                        </div>
                      );
                    }

                    return (
                      <div className={css.uploadAvatarWrapper}>
                        <label className={css.label} htmlFor={id}>
                          {label}
                        </label>
                        <input
                          accept={accept}
                          id={id}
                          name={name}
                          className={css.uploadAvatarInput}
                          disabled={disabled}
                          onChange={onChange}
                          type={type}
                        />
                        {error}
                      </div>
                    );
                  }}
                </Field>
                <div className={css.tip}>
                  <FormattedMessage id="ProfileSettingsForm.tip" />
                </div>
                <div className={css.fileInfo}>
                  <FormattedMessage id="ProfileSettingsForm.fileInfo" />
                </div>
              </div>
              <div className={css.sectionContainer}>
                <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourName" />
                </H4>

                {/* First and Last Name */}
                <div className={css.nameContainer}>
                  <FieldTextInput
                    className={css.firstName}
                    type="text"
                    id="firstName"
                    name="firstName"
                    label={firstNameLabel}
                    placeholder={firstNamePlaceholder}
                    validate={firstNameRequired}
                  />
                  <FieldTextInput
                    className={css.lastName}
                    type="text"
                    id="lastName"
                    name="lastName"
                    label={lastNameLabel}
                    placeholder={lastNamePlaceholder}
                    validate={lastNameRequired}
                  />
                </div>

                {/* Username(optional) */}
                <FieldTextInput
                  className={css.inputBox}
                  type={"text"}
                  id={"username"}
                  name={"username"}
                  label={usernameLabel}
                  placeholder={usernamePlaceholder}
                />

                {/* DNI/NIE Number */}
                <FieldTextInput
                  id={"dni_nie_n umber"}
                  className={css.inputBox}
                  type={"text"}
                  name={"dni_nie_number"}
                  label={dni_nie_number_label}
                  placeholder={dni_nie_number_placeholder}
                  validate={dni_nie_number_validate}
                />

                {/* Birthday */}
                <FieldTextInput
                  className={css.inputBox}
                  id={"birthday"}
                  name={"birthday"}
                  type={"date"}
                  label={birthdayLabel}
                  placeholder={birthdayPlaceholder}
                  validate={lastNameRequired}
                />

                {/* Phone/ Telephone */}
                <FieldPhoneNumberInput
                  className={css.inputBox}
                  id={formId ? `${formId}telephone` : "telephone"}
                  name={"phoneNumber"}
                  type={"number"}
                  label={telephoneLabel}
                  placeholder={telephonePlaceholder}
                  validate={telephoneValidators}
                />

                {/* location */}
                <div>
                  <FieldTextInput
                    className={css.inputBox}
                    id={"street"}
                    name={"street"}
                    type={"address"}
                    label={streetLabel}
                    placeholder={streetplaceholder}
                    validate={lastNameRequired}
                  />
                  <FieldTextInput
                    className={css.inputBox}
                    id={"number"}
                    name={"number"}
                    type={"address"}
                    label={numberLabel}
                    placeholder={numberPlaceholder}
                    validate={lastNameRequired}

                  />
                  <FieldTextInput
                    className={css.inputBox}
                    id={"city"}
                    name={"city"}
                    type={"address"}
                    label={cityLabel}
                    placeholder={cityPlaceholder}
                    validate={lastNameRequired}

                  />
                  <FieldTextInput
                    className={css.inputBox}
                    id={"postalCode"}
                    name={"postalCode"}
                    type={"number"}
                    label={postalCodeLabel}
                    placeholder={postalCodePlaceholder}
                    validate={lastNameRequired}

                  />
                  <FieldTextInput
                    className={css.inputBox}
                    id={"provence"}
                    name={"provence"}
                    type={"address"}
                    label={provenceLabel}
                    placeholder={provencePlaceholder}
                    validate={lastNameRequired}
                  />
                </div>
              </div>
              <div className={classNames(css.sectionContainer, css.lastSection)}>
                <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.bioHeading" />
                </H4>
                <FieldTextInput
                  type="textarea"
                  id="bio"
                  name="bio"
                  label={bioLabel}
                  placeholder={bioPlaceholder}
                />
                <p className={css.bioInfo}>
                  <FormattedMessage id="ProfileSettingsForm.bioInfo" values={{ marketplaceName }} />
                </p>
              </div>
              <p className={css.bioInfo}>
                {fillRequiredFieldsMessage}
              </p>
              {submitError}
              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={pristineSinceLastSubmit}
              >
                <FormattedMessage id="ProfileSettingsForm.saveChanges" />
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

ProfileSettingsFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
};

ProfileSettingsFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  updateProfileReady: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const ProfileSettingsForm = compose(injectIntl)(ProfileSettingsFormComponent);

ProfileSettingsForm.displayName = 'ProfileSettingsForm';

export default ProfileSettingsForm;
