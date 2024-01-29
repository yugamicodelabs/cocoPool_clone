import React from 'react';
import { bool, node } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import * as validators from '../../../util/validators';
import { Form, PrimaryButton, FieldTextInput, FieldSelect, FieldPhoneNumberInput } from '../../../components';

import css from './SignupForm.module.css';
import { discoveredServiceVia, whatYouWantToDo } from '../../../constants';

const SignupFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress,
        invalid,
        intl,
        termsAndConditions,
      } = fieldRenderProps;

      // email
      const emailRequired = validators.required(
        intl.formatMessage({
          id: 'SignupForm.emailRequired',
        })
      );
      const emailValid = validators.emailFormatValid(
        intl.formatMessage({
          id: 'SignupForm.emailInvalid',
        })
      );

      // password
      const passwordRequiredMessage = intl.formatMessage({
        id: 'SignupForm.passwordRequired',
      });
      const passwordMinLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooShort',
        },
        {
          minLength: validators.PASSWORD_MIN_LENGTH,
        }
      );
      const passwordMaxLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooLong',
        },
        {
          maxLength: validators.PASSWORD_MAX_LENGTH,
        }
      );
      const passwordMinLength = validators.minLength(
        passwordMinLengthMessage,
        validators.PASSWORD_MIN_LENGTH
      );
      const passwordMaxLength = validators.maxLength(
        passwordMaxLengthMessage,
        validators.PASSWORD_MAX_LENGTH
      );
      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
      const passwordValidators = validators.composeValidators(
        passwordRequired,
        passwordMinLength,
        passwordMaxLength
      );

      //Telephone
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
      )

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;


      const optionPlaceHolder = intl.formatMessage({ id: "SignupForm.optionPlaceHolder" })
      const howKnowCocopoolLabel = intl.formatMessage({ id: "SignupForm.howKnowCocopoolLabel" })
      const whatYouWantToDoLabel = intl.formatMessage({ id: "SignupForm.whatYouWantToDoLabel" })
      const howKnowCocopoolRequiredMessage = validators.required(intl.formatMessage({ id: "SignupForm.howKnowCocopoolrequiredMessage" }))
      const whatYouWantToDoRequiredMessage = validators.required(intl.formatMessage({ id: "SignupForm.whatYouWantToDoRequiredMessage" }))
      // console.log(values, 'Values')
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <div>
            <div className={css.name}>
              <FieldTextInput
                className={css.firstNameRoot}
                type="text"
                id={formId ? `${formId}.fname` : 'fname'}
                name="fname"
                autoComplete="given-name"
                label={intl.formatMessage({
                  id: 'SignupForm.firstNameLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'SignupForm.firstNamePlaceholder',
                })}
                validate={validators.required(
                  intl.formatMessage({
                    id: 'SignupForm.firstNameRequired',
                  })
                )}
              />
              <FieldTextInput
                className={css.lastNameRoot}
                type="text"
                id={formId ? `${formId}.lname` : 'lname'}
                name="lname"
                autoComplete="family-name"
                label={intl.formatMessage({
                  id: 'SignupForm.lastNameLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'SignupForm.lastNamePlaceholder',
                })}
                validate={validators.required(
                  intl.formatMessage({
                    id: 'SignupForm.lastNameRequired',
                  })
                )}
              />
            </div>
            <FieldTextInput
              className={css.password}
              type="email"
              id={formId ? `${formId}.email` : 'email'}
              name="email"
              autoComplete="email"
              label={intl.formatMessage({
                id: 'SignupForm.emailLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'SignupForm.emailPlaceholder',
              })}
              validate={validators.composeValidators(emailRequired, emailValid)}
            />
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.password` : 'password'}
              name="password"
              autoComplete="new-password"
              label={intl.formatMessage({
                id: 'SignupForm.passwordLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'SignupForm.passwordPlaceholder',
              })}
              validate={passwordValidators}
            />
            <FieldPhoneNumberInput
              className={css.phoneNumber}
              type="Number"
              id={formId ? `${formId}.phoneNumber` : 'phoneNumber'}
              name="phoneNumber"
              autoComplete="phoneNumber"
              label={intl.formatMessage({
                id: 'SignupForm.phoneNumberLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'SignupForm.phoneNumberPlaceholder',
              })}
              validate={telephoneValidators}
            />
            <FieldSelect
              className={css.password}
              id="discoveredServiceVia"
              name="discoveredServiceVia"
              label={howKnowCocopoolLabel}
              validate={howKnowCocopoolRequiredMessage}
            >
              <option
                disabled
                value=""
              >
                {optionPlaceHolder}
              </option>
              {discoveredServiceVia.map((item) =>
                <option
                  key={item.key}
                  value={item.value}
                >
                  {item.option}
                </option>
              )}
            </FieldSelect>
            <FieldSelect
              className={css.password}
              id="whatToDo"
              name="whatToDo"
              label={whatYouWantToDoLabel}
              validate={whatYouWantToDoRequiredMessage}
            >
              <option disabled value="">{optionPlaceHolder}</option>
              {whatYouWantToDo.map((item) =>
                <option
                  key={item.key}
                  value={item.value}
                >
                  {item.option}
                </option>
              )}
            </FieldSelect>
          </div>
          <div className={css.bottomWrapper}>
            <span className={css.termBox}>{termsAndConditions}</span>
            <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
              <FormattedMessage id="SignupForm.signUp" />
            </PrimaryButton>
          </div>
        </Form>
      );
    }}
  />
);

SignupFormComponent.defaultProps = { inProgress: false };

SignupFormComponent.propTypes = {
  inProgress: bool,
  termsAndConditions: node.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SignupForm = compose(injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;
