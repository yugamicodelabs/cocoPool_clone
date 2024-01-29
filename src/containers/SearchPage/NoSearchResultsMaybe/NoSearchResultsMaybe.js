import React from 'react';
import { FormattedMessage } from '../../../util/reactIntl';
import { NamedLink } from '../../../components';

import css from './NoSearchResultsMaybe.module.css';
import { PROVIDER } from '../../../util/types';

const NoSearchResultsMaybe = props => {
  const { listingsAreLoaded, totalItems, location, resetAll, userType } = props;
  const hasNoResult = listingsAreLoaded && totalItems === 0;
  const hasSearchParams = location.search?.length > 0;
  return hasNoResult ? (
    <div className={css.noSearchResults}>
      <FormattedMessage id="SearchPage.noResults" />
      <br />
      {hasSearchParams ? (
        <button className={css.resetAllFiltersButton} onClick={e => resetAll(e)}>
          <FormattedMessage id={'SearchPage.resetAllFilters'} />
        </button>
      ) : null}
      <p>
        {userType == PROVIDER ? <NamedLink className={css.createListingLink} name="NewListingPage">
          <FormattedMessage id="SearchPage.createListing" />
        </NamedLink> : null}
      </p>
    </div>
  ) : null;
};

export default NoSearchResultsMaybe;
