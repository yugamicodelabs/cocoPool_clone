import React from 'react';
import { bool, func, node, number, string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';

import PopupOpenerButton from '../PopupOpenerButton/PopupOpenerButton';

import css from './SearchFiltersPrimary.module.css';

const SearchFiltersPrimaryComponent = props => {
  const {
    rootClassName,
    className,
    children,
    isSecondaryFiltersOpen,
    toggleSecondaryFiltersOpen,
    selectedSecondaryFiltersCount,
  } = props;

  const showFilterByOrder = (filters) => {
    const updatedFilter = [];
    const filterNameArray = filters.map(filter => filter.key.split(".")[filter.key.split(".").length - 1]);
    const desiredArray = ["dates", "maxGuest", "category", "Regulation", "extras", "ownerPresent", "poolMaintenance", "privacy", "price"];
    function customSort(a, b) {
      return desiredArray.indexOf(a) - desiredArray.indexOf(b);
    }
    filterNameArray.sort(customSort);
    for (let i of filterNameArray) {
      for (let j of filters) {
        if (i == j.key.split(".")[j.key.split(".").length - 1]) {
          updatedFilter.push(j);
        }
      }
    }
    return updatedFilter;
  };

  const classes = classNames(rootClassName || css.root, className);

  const toggleSecondaryFiltersOpenButton = toggleSecondaryFiltersOpen ? (
    <PopupOpenerButton
      isSelected={isSecondaryFiltersOpen || selectedSecondaryFiltersCount > 0}
      toggleOpen={() => {
        toggleSecondaryFiltersOpen(!isSecondaryFiltersOpen);
      }}
    >
      <FormattedMessage
        id="SearchFiltersPrimary.moreFiltersButton"
        values={{ count: selectedSecondaryFiltersCount }}
      />
    </PopupOpenerButton>
  ) : null;

  return (
    <div className={classes}>
      <div className={css.filters}>
        {/* {children} */}
        {showFilterByOrder(children)}
        {toggleSecondaryFiltersOpenButton}
      </div>
    </div>
  );
};

SearchFiltersPrimaryComponent.defaultProps = {
  rootClassName: null,
  className: null,
  isSecondaryFiltersOpen: false,
  toggleSecondaryFiltersOpen: null,
  selectedSecondaryFiltersCount: 0,
};

SearchFiltersPrimaryComponent.propTypes = {
  rootClassName: string,
  className: string,
  isSecondaryFiltersOpen: bool,
  toggleSecondaryFiltersOpen: func,
  selectedSecondaryFiltersCount: number,
};

const SearchFiltersPrimary = SearchFiltersPrimaryComponent;

export default SearchFiltersPrimary;
