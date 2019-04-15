import { LitElement, html } from 'lit-element';
import style from './style-editor';
import configDefaults from './defaults';


const fireEvent = (node, type, detail = {}, options = {}) => {
    const event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed,
    });

    event.detail = detail;
    node.dispatchEvent(event);
    return event;
};


export default class FitbitCardEditor extends LitElement {
    static get styles() {
        return style;
    }

    static get properties() {
        return { hass: {}, _config: {} };
    }

    setConfig(config) {
        this._config = { ...configDefaults, ...config };
        console.log(this._config);
    }

    get selectedHeaderEntities(){
        return this._config.header_entities.map(entity => entity.entity)
    }

    get selectedBodyEntities(){
        return this._config.entities.map(entity => entity.entity)

    }

    get entityOptions() {
        return Object.keys(this.hass.states).filter(eid => {
            const entity = this.hass.states[eid];
            if (entity && entity.attributes && entity.attributes.attribution && entity.attributes.attribution.includes('Fitbit.com')) return true;
            return false;
        });
    }

    get disableHeaderOptions(){
        return this.selectedHeaderEntities.length >= 3;
    }

    get entityHeaderOptions() {
        const disableAll = this.disableHeaderOptions;
        return this.entityOptions.map(eid => {
            const isChecked = this.selectedHeaderEntities.includes(eid);
            return {
                name: eid, 
                checked: isChecked, 
                disabled: !isChecked && disableAll
            }
        });
    }

    get entityBodyOptions() {
        return this.entityOptions.map(eid => ({ name: eid, checked: this.selectedBodyEntities.includes(eid), disabled: false }));
    }

    firstUpdated() {
        this._firstRendered = true;
    }

    render() {
        if (!this.hass) {
            return html``;
        }

        return html`
            <div class="card-config">
                <div class=overall-config'>
                    <div class='checkbox-options'>
                        <paper-checkbox @checked-changed="${this._valueChanged}" .checked=${this._config.header}
                            .configValue="${" header"}">Show Header</paper-checkbox>
                        <paper-checkbox @checked-changed="${this._valueChanged}" .checked=${this._config.title}
                            .configValue="${"title"}">Show Title</paper-checkbox>
                    </div>
                    <div class='checkbox-options'>
                        <paper-checkbox @checked-changed="${this._valueChanged}" .checked=${this._config.show_units_header}
                            .configValue="${"show_units_header"}">Show Header Units</paper-checkbox>
                        <paper-checkbox @checked-changed="${this._valueChanged}" .checked=${this._config.show_units}
                            .configValue="${"show_units"}">Show Body Units</paper-checkbox>
                    </div>
                </div>
 
                <div class='entities'>
                <h3>Header Entities ${this.disableHeaderOptions ? html`<span class='header-max'>&nbsp;(Max 3 Entities)</span>` : ``}</h3>
                    ${this.entityHeaderOptions.map(entity => {
                        return html`
                            <paper-checkbox @checked-changed="${this._valueChanged}" ?disabled=${entity.disabled} .checked=${entity.checked}
                                .entityHeaderValue="${entity.name}">
                                ${entity.name}
                            </paper-checkbox>
                            ${entity.checked ? this.showHeaderEntityOptions() : ``}
                        `;
                    })}   
                </div>
            
                <div class='entities'>
                    <h3>Body Entities</h3>
                    ${this.entityBodyOptions.map(entity => {
                        return html`
                            <paper-checkbox 
                                @checked-changed="${this._valueChanged}" 
                                ?disabled=${entity.disabled}
                                .checked=${entity.checked} 
                                .entityValue="${entity.name}"
                            >
                                ${entity.name}
                            </paper-checkbox>
                            ${entity.checked ? this.showBodyEntityOptions() : ``}
                        `;
                    })}
                </div>
            </div>
        `;
    }

    showHeaderEntityOptions(){
        return html``;
    }

    showBodyEntityOptions() {
        return html``;
    }

    createCommonEntityOptions(){
        return html``;
    }

    _valueChanged(ev) {
        if (!this._config || !this.hass || !this._firstRendered) return;
        const { target: { configValue, value, entityValue, entityHeaderValue, entityConfigValue }, detail: { value: checkedValue } } = ev;

        // if changing an entity update config
        if (entityValue || entityHeaderValue) {
            const key = entityHeaderValue ? 'header_entities' : 'entities';
            const changedEntityName = entityValue || entityHeaderValue;

            if (checkedValue) {
                this._config = { ...this._config, [key]: [...this._config[key], { entity: changedEntityName}] };
            } else {
                const newEntities = this._config[key].filter(entity => entity.entity !== changedEntityName);
                this._config = { ...this._config, [key]: newEntities };
            }

        } else if (checkedValue !== undefined || checkedValue !== null) {
            // else if updating a checkbox config update that
            this._config = { ...this._config, [configValue]: checkedValue };

        } else if (entityConfigValue) {
            // else if updating an entity's config
            console.log({ entityConfigValue });
            

        } else {
            this._config = { ...this._config, [configValue]: value };
        }

        fireEvent(this, 'config-changed', { config: this._config });
    }
}
