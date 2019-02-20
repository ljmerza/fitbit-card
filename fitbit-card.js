import { LitElement, html } from 'lit-element';
import style from './style';

class FitbitCard extends LitElement {
    constructor() {
        super();
    }

    static get properties() {
        return {
            hass: Object,
            config: Object,
        };
    }

    setConfig(config) {
        this.config = {
            title: `Fitbit Statistics`,
            ...config
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
                    ${this.config.title}
                </div>
				${this.generateSensorCard(90, 'red', 3000)}
			</ha-card>
		`;
    }

    get fitbitStates() {
        return Object.values(this.__hass.states).filter(state => {
            return state.attributes && state.attributes.attribution && /Fitbit/.test(state.attributes.attribution);
        });
    }

    generateSensorCard(progress, color, text) {
        return html`
			<fitbit-progress-ring 
				stroke="4" 
				radius="30" 
				progress="${progress}" 
				color="${color}"
				text="${text}"
			>
			</fitbit-progress-ring>
		`;
    }
}

customElements.define('fitbit-card', FitbitCard);


class FitbitProgressRing extends LitElement {
    constructor() {
        super();
    }

    static get properties() {
        return {
            radius: String,
            stroke: String,
            color: String,
            progress: String,
            text: String,
        }
    }

    static get styles() {
        return style;
    }

    render() {
        const normalizedRadius = this.radius - this.stroke * 2;
        this._circumference = normalizedRadius * 2 * Math.PI;

        return html`
			<svg
				height="${this.radius * 2}"
				width="${this.radius * 2}"
			>
				<circle
					stroke="${this.color}"
					stroke-dasharray="${this._circumference} ${this._circumference}"
					style="stroke-dashoffset:${this._circumference}"
					stroke-width="${this.stroke}"
					fill="transparent"
					r="${normalizedRadius}"
					cx="${this.radius}"
					cy="${this.radius}"
				/>
				<text x="50%" y="50%" text-anchor="middle" fill="black" dy=".3em">${this.text}</text>
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