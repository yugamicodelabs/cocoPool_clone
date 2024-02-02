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
import Slider from "react-slick";

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


function SampleNextArrow(props) {
  const { className, style, onClick } = props;

  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <svg width="30px" height="30px" viewBox="0 0 0.75 0.75" xmlns="http://www.w3.org/2000/svg"><path fill="#989898" fillRule="evenodd" d="m0.264 0.081 0.272 0.272a0.025 0.025 0 0 1 0.008 0.018 0.026 0.026 0 0 1 -0.008 0.019c-0.098 0.096 -0.193 0.188 -0.284 0.278 -0.005 0.004 -0.023 0.015 -0.038 -0.001 -0.014 -0.016 -0.006 -0.03 0 -0.036l0.265 -0.259 -0.253 -0.253c-0.009 -0.013 -0.008 -0.024 0.002 -0.035 0.011 -0.011 0.023 -0.011 0.036 -0.002Z" /></svg>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;

  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <svg width="30px" height="30px" viewBox="0 0 0.75 0.75" xmlns="http://www.w3.org/2000/svg"><path fill="#989898" fillRule="evenodd" d="M0.271 0.371c0.086 -0.087 0.171 -0.171 0.253 -0.253a0.024 0.024 0 0 0 0 -0.034c-0.012 -0.013 -0.03 -0.012 -0.039 -0.003 -0.085 0.086 -0.175 0.175 -0.268 0.268 -0.007 0.006 -0.011 0.013 -0.011 0.022 0 0.008 0.004 0.016 0.011 0.022l0.281 0.274a0.028 0.028 0 0 0 0.039 -0.001c0.013 -0.013 0.008 -0.027 0.002 -0.033a127.79 127.79 0 0 1 -0.269 -0.262Z" /></svg>
    </div>
  );
}


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
  } = props;

  const { Money } = sdkTypes;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price = new Money(100, "EUR"), publicData } = currentListing.attributes;
  const { location, priceRange, maxGuest } = publicData || {};
  const slug = createSlug(title);
  const author = ensureUser(listing.author);
  const authorName = author.attributes.profile.displayName;
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;
  // const maxGuestRange = priceRange && Array.isArray(priceRange) && priceRange.length && priceRange[priceRange.length - 1].quantityRange.split("-");
  // const maxGuest = maxGuestRange?.length > 1 ? maxGuestRange[1] : maxGuestRange[0];
  const listingLocation = location && location?.address && location?.address?.split(", ")[2];

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

  const settings = {
    speed: 500,
    dots: false,
    arrows: true,
    slidesToShow: 1,
    infinite: false,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dotsClass: "slick-dots slick-thumb",
  };


  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
      {currentListing.images && currentListing.images.length > 1 ?
        <Slider {...settings} className={css.sliderWrapper}>
          {currentListing.images.map((st) => {
            return (
              <AspectRatioWrapper
                width={aspectWidth}
                height={aspectHeight}
                key={st}
                className={css.aspectRatioWrapper}
              >
                <ResponsiveImage
                  rootClassName={css.rootForImage}
                  alt={title}
                  image={st}
                  variants={Object.keys(st?.attributes?.variants).filter(k => k.startsWith(variantPrefix))}
                  sizes={renderSizes}
                />
                <div className={css.priceBox}>
                  <PriceMaybe price={price} publicData={publicData} config={config} intl={intl} />/h
                </div>
              </AspectRatioWrapper>
            )
          })}
        </Slider> :
        <AspectRatioWrapper width={aspectWidth} height={aspectHeight}>
          <ResponsiveImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={variants}
            sizes={renderSizes}
          />
        </AspectRatioWrapper>
      }
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
              <IconCard brand="user" />
            </span>
            <span className={css.locationName}>{maxGuest == "51_above" ? "+51" : maxGuest}</span>
          </div>
          <div className={css.iconHeading}>
            <span className={css.locationIcon}>
              <IconCard brand="locationcard" />
            </span>
            <span className={css.locationName}>{listingLocation}</span>
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
