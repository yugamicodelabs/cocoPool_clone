import React from 'react';
import { bool, func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';

import SectionContainer from '../SectionContainer';
import SearchComponent from './SeachFieldForm/SearchFieldForm';
import css from './SectionHero.module.css';
import { compose } from 'redux';
import { injectIntl, useIntl } from 'react-intl';
import { useConfiguration } from '../../../../context/configurationContext';
import { useRouteConfiguration } from '../../../../context/routeConfigurationContext';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { withViewport } from '../../../../util/uiHelpers';
import { isMainSearchTypeKeywords, isOriginInUse } from '../../../../util/search';
import moment from 'moment';
import { createResourceLocatorString } from '../../../../util/routes';

// Section component for a website's hero section
// The Section Hero doesn't have any Blocks by default, all the configurations are made in the Section Hero settings
const SectionHero = props => {
  const {
    sectionId,
    className,
    rootClassName,
    defaultClasses,
    title,
    description,
    appearance,
    callToAction,
    options,
    sectionName,
  } = props;

  const config = useConfiguration();
  const routeConfiguration = useRouteConfiguration();
  const intl = useIntl();

  const handleSeachSubmit = (values) =>{
    console.log(values, "myVal");
    const { location, bookingDate, totalPersons, keywords } = values;
    const { currentSearchParams, history } = props;

    const topbarSearchParams = () => {
      if (isMainSearchTypeKeywords(config)) {
        return { keywords: keywords };
      }
      // topbar search defaults to 'location' search
      const { search, selectedPlace } = location;
      const { origin, bounds } = selectedPlace;
      const originMaybe = isOriginInUse(config) ? { origin } : {};
      const dates = moment(bookingDate.date).format("YYYY-MM-DD");
      const guestCount = totalPersons.split("-").length > 1 ? totalPersons.split("-")[1] : totalPersons.split("-")[0];

      return {
        ...originMaybe,
        address: search,
        bounds,
        pub_maxGuest: guestCount,
        dates: `${dates},${dates}`
      };
    };
    const searchParams = {
      ...currentSearchParams,
      ...topbarSearchParams(),
    };
    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, searchParams));
  };

  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };

  const hasHeaderFields = hasDataInFields([title, description, callToAction], fieldOptions);

  return (
    <SectionContainer
      id={sectionId}
      className={className}
      rootClassName={classNames(rootClassName || css.root)}
      appearance={appearance}
      options={fieldOptions}
    >
      {hasHeaderFields ? (
        <header className={defaultClasses.sectionDetails}>
          <Field data={title} className={defaultClasses.title} options={fieldOptions} />
          <Field data={description} className={defaultClasses.description} options={fieldOptions} />
          <Field data={callToAction} className={defaultClasses.ctaButton} options={fieldOptions} />
        </header>
      ) : null}
      {/* Search Fields */}
      {sectionName === "landing-hero" ?
        <SearchComponent
          onSubmit={(values) => handleSeachSubmit(values)}
          intl={intl}
        />
        : null}
    </SectionContainer>
  );
};

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
});

SectionHero.defaultProps = {
  className: null,
  rootClassName: null,
  defaultClasses: null,
  textClassName: null,
  title: null,
  description: null,
  appearance: null,
  callToAction: null,
  isInsideContainer: false,
  options: null,
};

SectionHero.propTypes = {
  sectionId: string.isRequired,
  className: string,
  rootClassName: string,
  defaultClasses: shape({
    sectionDetails: string,
    title: string,
    description: string,
    ctaButton: string,
  }),
  title: object,
  description: object,
  appearance: object,
  callToAction: object,
  isInsideContainer: bool,
  options: propTypeOption,
};

export default compose(injectIntl, withRouter, withViewport)(SectionHero);
