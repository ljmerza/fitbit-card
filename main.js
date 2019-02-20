
import { LitElement, html } from 'lit-element';
import style from './style';


class FitbitCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  constructor() {
    super();
  }

  setConfig(config) {
    if (!config.entities) throw Error('entities required.');

    this.config = {
      ...config,
    };
  }

  /**
   * get the current size of the card
   * @return {Number}
   */
  getCardSize() {
    return 1;
  }

  static get styles() {
    return style;
  }

  /**
   * generates the card HTML
   * @return {TemplateResult}
   */
  render() {
    return html``;
  }

}

customElements.define('fitbit-card', FitbitCard);
