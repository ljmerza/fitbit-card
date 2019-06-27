# Fitbit Card for Home Assistant
Show your Fitbit stats

<img src='https://raw.githubusercontent.com/ljmerza/fitbit-card/master/card.jpg' />


## Installation through [HACS](https://github.com/custom-components/hacs)
---
Add the following to resources in your lovelace config:

```yaml
resources:
  - url: /community_plugin/fitbit-card/fitbit-card.js
```

## Configurations:
---
```yaml
type: 'custom:fitbit-card'
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

## Options
---
| Name | Type | Requirement | `Default value` Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:fitbit-card`
| battery_entity | string | **Optional** | Battery entity to show battery status
| header | boolean | **Optional** | `true` Show/hide header
| header_entities | list | **Optional** | `[]` List of fitbit sensors to display in the header
| show_units_header | boolean | **Optional** | `false` Show units for all header entities
| entities | list | **Optional** | `[]` List of fitbit sensors to display in the body
| max | string | **Optional** | `100` Global maximum value for body entities


### header_entities options

| Name | Type | Requirement | `Default value` Description
| ---- | ---- | ------- | -----------
| entity | string | **Required** | Name of entitiy
| icon_color | string | **Optional** | color of icon next to entity (can be color name or hex value)
| show_units | boolean | **Optional** | `false` show units next to entity value (show_units_header overrides this)
| units | string | **Optional** | override default units with custom units

### entities options

| Name | Type | Requirement | `Default value` Description
| ---- | ---- | ------- | -----------
| entity | string | **Required** | Name of entitiy
| max | number | **Optional** | `global max value` override global maxiumum value for this entity
| color_stops | list | **Optional** | `--primary-color` custom colors for percent circle
| show_units | boolean | **Optional** | `false` show units next to value
| units | string | **Optional** | override default units with custom units

---

Enjoy my card? Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/JMISm06AD)


[commits-shield]: https://img.shields.io/github/commit-activity/y/ljmerza/light-entity-card.svg?style=for-the-badge
[commits]: https://github.com/ljmerza/light-entity-card/commits/master
[license-shield]: https://img.shields.io/github/license/ljmerza/light-entity-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Leonardo%20Merza%20%40ljmerza-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/ljmerza/light-entity-card.svg?style=for-the-badge
[releases]: https://github.com/ljmerza/light-entity-card/releases