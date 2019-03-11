import { css } from 'lit-element';

const style = css`

  ha-card {
    padding: 24px 16px 16px 16px;
  }

  .fitbit-card__header {
    display: flex;
    justify-content: space-between;
    opacity: var(--dark-primary-opacity);
    margin-bottom: 20px;
  }

  .fitbit-card__header .status span {
    font-size: var(--paper-font-headline_-_font-size);
    font-weight: var(--paper-font-headline_-_font-weight);
    letter-spacing: var(--paper-font-headline_-_letter-spacing);
    font-family: var(--paper-font-headline_-_font-family);
    line-height: var(--paper-font-headline_-_line-height);
  }

  .fitbit-card__header .status {
    margin-top: -5px;
  }

  .fitbit-card__header .status ha-icon {
    margin-top: -8px;
  }

  .fitbit-card__rings {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .fitbit-card__ring {
    padding-bottom: 10px;
  }

  .fitbit-card__ring div {
    text-align: center;
    max-width: 90px;
    color: var(--primary-text-color);
  }

  svg {
    margin-left: 50%;
    transform: translateX(-50%);
  }

  circle {
    transition: stroke-dashoffset 1s linear;
  }

  text {
    stroke: var(--primary-text-color);
  }
`;

export default style;
