import logoFull from './solarqube-logo.png';          // full SOLARQUBE ENERGY wordmark (transparent)
import logoIcon from './solarqube-icon.png';          // swirl "O" mark for small spaces
import logoOnWhite from './solarqube-logo-white.jpg'; // wordmark on solid white (print / proposals)

export const IMAGES = {
  logo: logoFull,
  logoIcon,
  logoOnWhite,
  /** @deprecated kept so older imports keep working — now points at the real logo icon */
  brandMark: logoIcon,
  commercialRooftop: '/src/assets/images/solar_rooftop_commercial_1792499437891.jpg',
  residentialVilla: '/src/assets/images/solar_residential_villa_1792499437378.jpg',
  technicalBlueprint: '/src/assets/images/solar_blueprint_technical_1792500760289.jpg'
};
