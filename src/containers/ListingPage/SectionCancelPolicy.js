import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { Heading } from '../../components';

import css from './ListingPage.module.css';
import IconCard from '../../components/SavedCardDetails/IconCard/IconCard';

const SectionCancelPolicy = props => {
    const { publicData, metadata = {}, listingConfig, intl } = props;

    return (
        <div className={css.cancelPolicyWrapper}>
            <div className={css.cancelHeading}>
                {/* <span className={css.cancelIcon}>
                    <IconCard brand="cancel" />
                </span> */}
                <span className={css.cancelPolicyHeading}>Cancelation Policies</span>
            </div>
            <div className={css.cancelDescription}>
                Si se cancela con  más de 48 horas de antelación del inicio de la reserva, se reembolsará el coste de la reserva. De lo contrario, no se reembolsará el coste de la reserva.

                En ningún caso se reembolsaran los gastos de servicio de Cocopool.
            </div>
        </div>
    )
};

export default SectionCancelPolicy;
