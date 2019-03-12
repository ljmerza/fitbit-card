<h1 align="center">Fitbit Card for Home Assistant</h1>

<p align="center">
  <img src='fitbit_card.jpg' />
</p>


<h2>Track Updates</h2>

This custom card can be tracked with the help of [custom-updater](https://github.com/custom-components/custom_updater).

In your configuration.yaml

```yaml
custom_updater:
  card_urls:
    - https://raw.githubusercontent.com/ljmerza/fitbit-card/master/custom_updater.json
```

<h2>Options</h2>

| Name | Type | Requirement | `Default` Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:fitbit-card`
| battery_entity | string | **Optional** | Battery entity to show battery status
| header_entities | list<Object> | **Optional** | `[]` List of fitbit sensors to display in the header
| show_units_header | boolean | **Optional** | `false` Show units for all header entities
| entities | list<Object> | **Optional** | `[]` List of fitbit sensors to display n the body
| max | string | **Optional** | `100` Global maximum value for body entities


<h2>header_entities options</h2>

| Name | Type | Requirement | `Default` Description
| ---- | ---- | ------- | -----------
| entity | string | **Required** | Name of entitiy
| icon_color | string | **Optional** | color of icon next to entity (can be color name or hex value)
| show_units | boolean | **Optional** | `false` show units next to entity value (show_units_header overrides this)
| units | string | **Optional** | override default units with custom units

<h2>entities options</h2>

| Name | Type | Requirement | `Default` Description
| ---- | ---- | ------- | -----------
| entity | string | **Required** | Name of entitiy
| max | number | **Optional** | `global max value` override global maxiumum value for this entity
| color_stops | list | **Optional** | `--primary-color` custom colors for percent circle
| show_units | boolean | **Optional** | `false` show units next to value
| units | string | **Optional** | override default units with custom units


<h2>Configuration</h2>

Download `fitbit-card.js` from the [latest release](https://github.com/ljmerza/fitbit-card/releases/latest/) and upload it your /www folder of your Home Assistant config directory.

In your ui-lovelace.yaml

```yaml
resources:
  - url: /local/fitbit-card.js?track=true
    type: js
```

Add the custom card to views:

```yaml
views:
  - type: 'custom:fitbit-card'
    battery_entity: sensor.versa_battery
    header_entities:
      - entity: sensor.tracker_steps
        icon_color: '#14308D'
      - entity: sensor.distance
        show_units: true
      - entity: sensor.tracker_calories
        icon_color: red
    entities:
      - entity: sensor.minutes_sedentary
        max: 1000
      - entity: sensor.minutes_very_active
        max: 120
      - entity: sensor.minutes_lightly_active
        max: 50
        color_stops:
          '0': red
          '50': yellow
          '90': green
      - entity: sensor.resting_heart_rate
        show_units: true
```