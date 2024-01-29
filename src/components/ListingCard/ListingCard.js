import React from 'react';
import { string, func, bool } from 'prop-types';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';

import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { displayPrice } from '../../util/configHelpers';
import { lazyLoadWithDimensions } from '../../util/uiHelpers';
import { propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import { isBookingProcessAlias } from '../../transactions/transaction';

import { AspectRatioWrapper, NamedLink, ResponsiveImage } from '../../components';
import { types as sdkTypes } from "../../util/sdkLoader";

import css from './ListingCard.module.css';
import IconCard from '../SavedCardDetails/IconCard/IconCard';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, currency, intl) => {
  if (price && price.currency === currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

const LazyImage = lazyLoadWithDimensions(ResponsiveImage, { loadAfterInitialRendering: 3000 });

const PriceMaybe = props => {
  const { price, publicData, config, intl } = props;
  const { listingType } = publicData || {};
  const validListingTypes = config.listing.listingTypes;
  const foundListingTypeConfig = validListingTypes.find(conf => conf.listingType === listingType);
  const showPrice = displayPrice(foundListingTypeConfig);
  if (!showPrice && price) {
    return null;
  };

  const isBookable = isBookingProcessAlias(publicData?.transactionProcessAlias);
  const { formattedPrice, priceTitle } = priceData(price, config.currency, intl);
  return (
    <div className={css.price}>
      <div className={css.priceValue} title={priceTitle}>
        desdos {formattedPrice}
      </div>
      {/* {isBookable ? (
        <div className={css.perUnit}>
          <FormattedMessage id="ListingCard.perUnit" values={{ unitType: publicData?.unitType }} />
        </div>
      ) : null} */}
    </div>
  );
};

export const ListingCardComponent = props => {
  const config = useConfiguration();
  const {
    className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    setActiveListing,
    showAuthorInfo,
    listingIds=[]
  } = props;
  const { Money } = sdkTypes;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price=new Money(100, "EUR"), publicData } = currentListing.attributes;
  const { location, priceRange } = publicData || {};
  const slug = createSlug(title);
  const author = ensureUser(listing.author);
  const authorName = author.attributes.profile.displayName;
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = config.layout.listingImage;
  const variants = firstImage
    ? Object.keys(firstImage?.attributes?.variants).filter(k => k.startsWith(variantPrefix))
    : [];

  const setActivePropsMaybe = setActiveListing
    ? {
      onMouseEnter: () => setActiveListing(currentListing.id),
      onMouseLeave: () => setActiveListing(null),
    }
    : null;

  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }} to={{ search: listingIds.join(",") }}>
      <AspectRatioWrapper
        className={css.aspectRatioWrapper}
        width={aspectWidth}
        height={aspectHeight}
        {...setActivePropsMaybe}
      >
        <LazyImage
          rootClassName={css.rootForImage}
          alt={title}
          image={firstImage}
          variants={variants}
          sizes={renderSizes}
        />
        <div className={css.priceBox}>
          <PriceMaybe price={price} publicData={publicData} config={config} intl={intl} />/h
        </div>
      </AspectRatioWrapper>
      <div className={css.info}>
        <div className={css.title}>
          {richText(title, {
            longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
            longWordClass: css.longWord,
          })}
        </div>
        <div className={css.peopleLocation}>
          <div className={css.iconHeading}>
            <span className={css.locationIcon}>
              <IconCard brand="peoples" />
            </span>
            <span className={css.locationName}>Madrid</span>
          </div>
          <div className={css.iconHeading}>
            <span className={css.locationIcon}>
              <IconCard brand="locationcard" />
            </span>
            <span className={css.locationName}>Madrid</span>
          </div>
        </div>
        <div className={css.reviewsBox}>
          <span>(0)</span>
          <span className={css.starIcon}>
            <IconCard brand="cardstar" />
            <IconCard brand="blankstar" />
          </span>
        </div>
        {/* {showAuthorInfo ? (
            <div className={css.authorInfo}>
              <FormattedMessage id="ListingCard.author" values={{ authorName }} />
            </div>
          ) : null} */}
      </div>
    </NamedLink>
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: null,
  showAuthorInfo: true,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,
  showAuthorInfo: bool,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCardComponent);
