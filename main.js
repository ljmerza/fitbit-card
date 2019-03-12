import { LitElement, html } from 'lit-element';
import style from './style';

class FitbitCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  static get primaryColor() {
    return getComputedStyle(document.querySelector('body')).getPropertyValue('--primary-text-color');
  }

  setConfig(config) {
    if (!config.entities) throw new Error('Entities is required');
    if (config.entities && !Array.isArray(config.entities)) throw new Error('entities must be a list');
    if (config.header_entities && !Array.isArray(config.header_entities)) throw new Error('header_entities must be a list');

    if (config.header_entities && config.header_entities.length > 3) throw new Error('Must not have more than three eneties in header_entities');

    this.config = {
      header: true,
      title: '',
      max: 100,
      show_units_header: false,
      header_entities: [],
      entities: [],
      show_units: false,
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
    return html`
      <ha-card>
        <div class='fitbit-card__header'>
          ${this.config.header && this.createHeader()}
        </div>
        <div class='fitbit-card__rings'>
          ${this.generateSensorCards()}
        </div>
      </ha-card>
    `;
  }

  /**
   * Create the over all header for the fitbit card
   * @return {TemplateResult}
   */
  createHeader() {
    const entities = this.getEntities(this.config.header_entities);

    return html`
        ${this.getStatus()}
        ${entities.map(entity => this.getHeaderSensor(entity))}
      </div>
    `;
  }

  /**
   * Given a list of entity names get the entity states from hass
   * @param {Entity[] | String[]} entities
   * @return {SensorEntity[]}
   */
  getEntities(entities) {
    return entities.map((entity) => {
      // if just simple list then return entity state
      if (typeof entity === 'string') {
        return this.hass.states[entity];
      }

      // else we have config for each entity so save config and entity state
      return { ...this.hass.states[entity.entity], ...{ _fitbit: entity } };
    }).filter(Boolean);
  }

  /**
   * get fitbit card status (battery/name)
   * @return {TemplateResult}
   */
  getStatus() {
    if (!this.config.battery_entity && !this.config.title) return html``;

    // try to get battery entity and validate it
    const batteryEntity = this.config.battery_entity
      && this.hass.states[this.config.battery_entity];

    if (this.config.battery_entity && !batteryEntity) {
      console.log(`state for ${this.config.battery_entity} not found`);
      return;
    }

    if (this.config.battery_entity && !batteryEntity.attributes.model) {
      console.log(`state for ${this.config.battery_entity} not found`);
    }

    // create battery icon and color if given icon
    let batteryIcon = '';
    if (batteryEntity.attributes.icon) {
      const { high, medium, low } = this.config.battery_colors || {};

      let iconColor = high || '#10A13C';
      if (batteryEntity.state === 'Medium') iconColor = medium || '#DEE023';
      if (batteryEntity.state === 'Low') iconColor = low || '#DA3116';

      batteryIcon = html`<ha-icon icon="${batteryEntity.attributes.icon}" style="color:${iconColor}"></ha-icon>`;
    }

    return html`
      <div class='status'>
        <span>${this.config.title || batteryEntity.attributes.model || ''}</span>    
        ${batteryIcon}
      </div>
    `;
  }

  /**
   * Generate the card header with sensors if configured
   * @param {SensorEntity} entity
   * @return {TemplateResult}
   */
  getHeaderSensor(entity) {
    if (!entity) return html``;

    const showUnits = this.config.show_units_header
      || (entity._fitbit && entity._fitbit.show_units);

    const unit = showUnits ? (entity._fitbit.units || entity.attributes.unit_of_measurement) : '';

    const iconColor = entity._fitbit && entity._fitbit.icon_color || '';

    return html`
      <div>
        <ha-icon icon="${entity.attributes.icon}" style="color:${iconColor}"></ha-icon>
        <span>${entity.state} ${unit}</span>
      </div>
    `;
  }

  /**
   * From an array of fitbit sensors create a list of fitbit progress ring Elements
   * @return {TemplateResult}
   */
  generateSensorCards() {
    const entities = this.getEntities(this.config.entities);

    return entities.map((entity) => {
      const max = (entity._fitbit && entity._fitbit.max) || this.config.max;
      const progress = 100 - parseInt(((max - entity.state.replace(',', '')) / max) * 100, 0);

      if (Number.isNaN(progress)) {
        console.error(`${entity.state} for ${entity.name} should be a number`);
        return html``;
      }

      const text = (entity._fitbit && entity._fitbit.units) || entity.attributes.friendly_name;
      const unit = (this.config.show_units || (entity._fitbit && entity._fitbit.show_units)) ? entity.attributes.unit_of_measurement : '';
      const value = `${entity.state}${unit ? ` ${unit}` : ''}`;
      const color = this.determineCircleColor(entity, progress);

      return html`
        <div class='fitbit-card__ring'>
          <fitbit-progress-ring 
            stroke="4"
            radius="45" 
            progress="${progress}" 
            value="${value}"
            color=${color}
          >
          </fitbit-progress-ring>
          <div>${text}</div>
        </div>
      `;
    });
  }

  /**
   * get circle outline color based on color theme or config for entity given
   * @param {SensorEntity} entity
   * @param {Number} progress
   * @return {String}
   */
  determineCircleColor(entity, progress) {
    let color = FitbitCard.primaryColor;
    if (!entity._fitbit || !entity._fitbit.color_stops) return color;

    Object.keys(entity._fitbit.color_stops).forEach((colorStop) => {
      if (progress > colorStop) color = entity._fitbit.color_stops[colorStop];
    });

    return color;
  }
}

customElements.define('fitbit-card', FitbitCard);


class FitbitProgressRing extends LitElement {
  static get properties() {
    return {
      radius: String,
      stroke: String,
      progress: String,
      value: String,
      color: String,
    };
  }

  static get styles() {
    return style;
  }

  render() {
    const normalizedRadius = this.radius - this.stroke * 2;
    this._circumference = normalizedRadius * 2 * Math.PI;

    return html`
      <svg height="${this.radius * 2}" width="${this.radius * 2}">
        <circle
          stroke-dasharray="${this._circumference} ${this._circumference}"
          style="stroke-dashoffset:${this._circumference}"
          stroke-width="${this.stroke}"
          fill="transparent"
          r="${normalizedRadius}"
          cx="${this.radius}"
          cy="${this.radius}"
          stroke="${this.color}"
        />
        <text 
          x="50%" 
          y="50%" 
          dy="0.3em" 
          text-anchor="middle"
          stroke-width="1"
          fill="transparent"
        >
          ${this.value}
        </text>
      </svg>
    `;
  }

  updated() {
    const offset = this._circumference - (this.progress / 100 * this._circumference);
    const circle = this.shadowRoot.querySelector('circle');
    circle.style.strokeDashoffset = offset;
  }
}
window.customElements.define('fitbit-progress-ring', FitbitProgressRing);
