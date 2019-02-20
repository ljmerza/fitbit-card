<h1 align="center">Fitbit Card for Home Assistant</h1>

<p align="center">
  <img src='https://i.imgur.com/uPgIqFl.png' />
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
| entities | list | **Required** | List of github sensors to display

<h2>Configuration</h2>

Download `fitbit-card.js` from the [latest release](https://github.com/ljmerza/fitbit-card/releases/latest/) and upload it your /www folder of your Home Assistant config directory.

In your ui-lovelace.yaml

```yaml
resources:
  - url: /local/fitbit-card.js?v=1.0.0
    type: js
```

Add the custom card to views:

```yaml
views:
  - type: custom:fitbit-card
    entities:
    - sensor.calendar_card
```