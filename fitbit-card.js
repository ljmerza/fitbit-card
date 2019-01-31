var LitElement = LitElement || Object.getPrototypeOf(customElements.get("hui-error-entity-row"));
var html = LitElement.prototype.html;

class Card extends LitElement {

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
        if (!config.entity) throw Error(`entity required.`);

        this.config = {
            ...config
        };
    }

    /**
     * generates the card HTML
     * @return {TemplateResult}
     */
    render() {
        html`
      <ha-card>
        <style>${this.renderStyle()}</style>
        ${this.createHeader()}
        test
      </ha-card>
    `;
    }

    /**
     * get the current size of the card
     * @return {Number}
     */
    getCardSize() {
        return 1;
    }

    static get styles() {

    }

    /**
     * generates the CSS styles for this card
     * @return {TemplateResult}
     */
    renderStyle() {
        return html`
        ha-card {
          padding: 16px;
        }
    `;
    }

    createHeader() {
        return html`
    `;
    }

}

customElements.define('-card', Card);