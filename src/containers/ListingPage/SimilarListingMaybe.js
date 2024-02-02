import React from "react";
import { H2, ListingCard } from "../../components";
import css from "./ListingPage.module.css";
import { getListingsById } from "../../ducks/marketplaceData.duck";

const SimilarListingMaybe = props => {
  const { listings, currentListingId, setActiveListing, isMapVariant } = props;
  const cardRenderSizes = isMapVariant => {
    if (isMapVariant) {
      // Panel width relative to the viewport
      const panelMediumWidth = 50;
      const panelLargeWidth = 62.5;
      return [
        '(max-width: 767px) 100vw',
        `(max-width: 1023px) ${panelMediumWidth}vw`,
        `(max-width: 1920px) ${panelLargeWidth / 2}vw`,
        `${panelLargeWidth / 3}vw`,
      ].join(', ');
    } else {
      // Panel width relative to the viewport
      const panelMediumWidth = 50;
      const panelLargeWidth = 62.5;
      return [
        '(max-width: 549px) 100vw',
        '(max-width: 767px) 50vw',
        `(max-width: 1439px) 26vw`,
        `(max-width: 1920px) 18vw`,
        `14vw`,
      ].join(', ');
    }
  };

  return (
    <div>
      {listings.length > 1 ?
        <div className={css.similarHeading}>
          <h2 className={css.similarTitle}>Similar Listings</h2>
          <div className={css.similarCardGrid}>
            {listings.filter(l => l.id.uuid != currentListingId.uuid).map(l => (
              <ListingCard
                className={css.listingCard}
                key={l.id.uuid}
                listing={l}
                renderSizes={cardRenderSizes(isMapVariant)}
                setActiveListing={setActiveListing}
                listings={listings}
              />
            ))}
          </div>
        </div>
        : null}
    </div>
  )
};

export default SimilarListingMaybe;