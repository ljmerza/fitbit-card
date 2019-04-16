import { LitElement, html } from 'lit-element';
import style from './style-editor';
import { cardDefaults, headerEntityDefaults, bodyEntityDefaults } from './defaults';


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
        this._config = { ...cardDefaults, ...config };
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
            const matchingConfig = this._config.header_entities.find(ent => ent.entity === eid) || {};
            const isChecked = this.selectedHeaderEntities.includes(eid);
            const entity = this.hass.states[eid] || {};
            
            return {
                name: eid,
                checked: isChecked,
                disabled: disableAll && !isChecked,
                ...headerEntityDefaults,
                ...entity.attributes,
                ...matchingConfig,
            }
        });
    }

    get entityBodyOptions() {
        return this.entityOptions.map(eid => {
            const matchingConfig = this._config.entities.find(ent => ent.entity === eid) || {};
            const isChecked = this.selectedBodyEntities.includes(eid);
            const entity = this.hass.states[eid] || {};

            return {
                name: eid,
                checked: isChecked,
                disabled: !isChecked,
                ...bodyEntityDefaults,
                ...entity.attributes,
                ...matchingConfig
            }
        });
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
                <div class='overall-config'>
                    <div class='checkbox-options'>
                        <paper-checkbox @checked-changed="${this._valueChanged}" .checked=${this._config.header}
                            .configValue="${"header"}">Show Header</paper-checkbox>
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
                            ${entity.checked ? this.showHeaderEntityOptions(entity) : ``}
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
                            ${entity.checked ? this.showBodyEntityOptions(entity) : ``}
                        `;
                    })}
                </div>
            </div>
        `;
    }

    showHeaderEntityOptions(entity){
        console.log({ entity });
        
        return html`
            <div class='common-entity-options checkbox-options'>
                <paper-checkbox @checked-changed="${this._valueChanged}" 
                    .checked=${entity.show_units} .entityHeaderConfigKey="${"show_units"}" 
                    .entityName="${entity.name}">Show Units</paper-checkbox>
                ${entity.show_units ?
                    html`<paper-input class='units-input' label="Custom Units" .value="${entity.units || entity.unit_of_measurement}" @value-changed="${this._valueChanged}"
                        .entityHeaderConfigKey="${"units"}" .entityName="${entity.name}">
                    </paper-input>` : ''
                }
            </div>
            <div class='common-entity-options checkbox-options'>
                <paper-input label="Icon Color" .value="${entity.icon_color}" @value-changed="${this._valueChanged}"
                    .entityHeaderConfigKey="${"icon_color"}" .entityName="${entity.name}">
                </paper-input>
            </div>
        `;
    }

    showBodyEntityOptions(entity) {
        return html`
            <div class='common-entity-options checkbox-options'>
                <paper-checkbox @checked-changed="${this._valueChanged}" .checked=${entity.show_units} 
                    .entityBodyConfigKey="${"show_units"}" .entityName="${entity.name}">Show Units</paper-checkbox>
                ${entity.show_units ?
                    html`<paper-input class='units-input' label="Custom Units" .value="${entity.units || entity.unit_of_measurement}" @value-changed="${this._valueChanged}"
                        .entityBodyConfigKey="${"units"}" .entityName="${entity.name}">
                    </paper-input>` : ''
                }
            </div>
            <div class='common-entity-options checkbox-options'>
                <paper-input label="Max" .value="${entity.max}" @value-changed="${this._valueChanged}"
                    .entityBodyConfigKey="${"max"}" .entityName="${entity.name}">
                </paper-input>
                <paper-input label="Max" .value="${entity.color_stops}" @value-changed="${this._valueChanged}"
                    .entityBodyConfigKey="${"color_stops"}" .entityName="${entity.name}">
                </paper-input>
            </div>
        `;
    }

    _valueChanged(ev) {
        if (!this._config || !this.hass || !this._firstRendered) return;
        const { target: { 
            configValue, value, entityName, 
            entityValue, entityHeaderValue,
            entityHeaderConfigKey, entityBodyConfigKey,
        }, detail: { value: checkedValue } } = ev;
        

        // if changing an entity directly -> update config
        if (entityValue || entityHeaderValue) {
            const key = entityHeaderValue ? 'header_entities' : 'entities';
            const changedEntityName = entityValue || entityHeaderValue;

            if (checkedValue) {
                this._config = { ...this._config, [key]: [...this._config[key], { entity: changedEntityName}] };
            } else {
                const newEntities = this._config[key].filter(entity => entity.entity !== changedEntityName);
                this._config = { ...this._config, [key]: newEntities };
            }

        } else if (entityHeaderConfigKey || entityBodyConfigKey) {
            // else if updating an entity's config
            const key = entityHeaderConfigKey ? 'header_entities' : 'entities';
            const entityToChangeIndex = this._config[key].findIndex(entity => entity.entity === entityName);
            const entityToChange = this._config[key][entityToChangeIndex];

            // change entity to new value
            const newValue = (checkedValue !== undefined) ? checkedValue : value;
            const newEntity = { ...entityToChange, [entityHeaderConfigKey || entityBodyConfigKey]: newValue};

            // create new list of entities
            const newEntities = this._config[key].map(entity => {
                if (entity.entity === entityName) return newEntity;
                else return entity;
            });

            // add entity back to new config
            this._config = { ...this._config, [key]: newEntities};

        } else if (checkedValue !== undefined || checkedValue !== null) {
            // else if updating a checkbox config update that
            this._config = { ...this._config, [configValue]: checkedValue };

        } else {
            this._config = { ...this._config, [configValue]: value };
        }

        fireEvent(this, 'config-changed', { config: this._config });
    }
}
