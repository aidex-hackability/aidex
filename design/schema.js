
{
  "intents": [
    {
      "slots": [
        {
          "name": "System",
          "type": "AIDEX_SYSTEMS"
        }
      ],
      "intent": "SystemIntent"
    },
    {
      "slots": [
        {
          "name": "City",
          "type": "AMAZON.US_CITY"
        }
      ],
      "intent": "WeatherIntent"
    },
    {
      "slots": [
        {
          "name": "Temperature",
          "type": "AMAZON.NUMBER"
        }
      ],
      "intent": "ClimateControlIntent"
    },
    {
      "intent": "ClimateStatusIntent"
    },
    {
      "slots": [
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
        },
        {
          "name": "FanLevel",
          "type": "AIDEX_FAN_LEVELS"
        }
      ],
      "intent": "FanControlIntent"
    },
    {
      "slots": [
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
        }
      ],
      "intent": "FanStatusIntent"
    },
    {
      "slots": [
        {
          "name": "PowerSelector",
          "type": "AIDEX_POWER_SELECTORS"
        },
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
        }
      ],
      "intent": "PowerStatusIntent"
    },
    {
      "slots": [
        {
          "name": "PowerSelector",
          "type": "AIDEX_POWER_SELECTORS"
        },
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
        }
      ],
      "intent": "PowerControlIntent"
    },
    {
      "slots": [
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
        }
      ],
      "intent": "LightStatusIntent"
    },
   
    {
      "slots": [
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
        },
        {
          "name": "LightLevel",
          "type": "AIDEX_LIGHT_LEVELS"
        }
      ],
      "intent": "LightControlIntent"
    },
    {
      "slots": [
        {
          "name": "DriveDirection",
          "type": "AIDEX_DRIVE_DIRECTIONS"
        },
        {
          "name": "DriveDegree",
          "type": "AIDEX_DRIVE_DEGREES"
        },
        {
          "name": "DriveSpeed",
          "type": "AIDEX_DRIVE_SPEEDS"         
        }
      ],
      "intent": "DriveControlIntent"
    },
    {
      "intent": "DriveStatusIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    },
    {
      "intent": "AMAZON.StartOverIntent"
    },
    {
      "intent": "AMAZON.HelpIntent"
    }
  ]
}
