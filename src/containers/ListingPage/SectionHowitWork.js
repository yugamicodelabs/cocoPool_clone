import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.module.css';
import IconCard from '../../components/SavedCardDetails/IconCard/IconCard';

const howItwork = [
    {
        icon: <IconCard brand="mail" />,
        heading: "Comprueba si el espacio tiene disponibilidad haciendo una solicitud de reserva. Envía un mensaje al anfitrión a modo presentación explicando cuál es el plan."
    },
    {
        icon: <IconCard brand="message" />,
        heading: "El anfitrión tiene 24h para aceptar tu solicitud, solo se te cobrará si el anfitrión acepta tu solicitud."
    },
    {
        icon: <IconCard brand="roundcheck" />,
        heading: "Recibe la confirmación de la reserva con la dirección exacta del espacio y toda la información necesaria de tu reserva."
    }
]

const SectionHowitWork = props => {
    const { publicData, metadata = {}, listingConfig, intl } = props;

    return (
        <div className={css.howItWorkWrapper}>
            <div className={css.howItWorkHeading}>How it works</div>
            <div className={css.workGrid}>
                {howItwork.map((item, i) => {
                    return (
                        <div
                            key={i}
                            className={css.colSection}
                        >
                            <div className={css.workImage}>{item.icon}</div>
                            <div className={css.headingName}>{item.heading}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default SectionHowitWork;
