{
  "intents": [
    {
      "intent": "AMAZON.NavigateSettingsIntent"
    },
    {
      "intent": "AMAZON.MoreIntent"
    },
    {
      "intent": "AMAZON.PageDownIntent"
    },
    {
      "intent": "AMAZON.PageUpIntent"
    },
    {
      "intent": "AMAZON.ScrollRightIntent"
    },
    {
      "intent": "AMAZON.ScrollDownIntent"
    },
    {
      "intent": "AMAZON.ScrollLeftIntent"
    },
    {
      "intent": "AMAZON.ScrollUpIntent"
    },
    {
      "intent": "AMAZON.NextIntent"
    },
    {
      "intent": "AMAZON.PreviousIntent"
    },
    {
      "intent": "AMAZON.ResumeIntent"
    },
    {
      "intent": "AMAZON.PauseIntent"
    },
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
          "name": "Temperature",
          "type": "AMAZON.NUMBER"
        },
        {
          "name": "Unit",
          "type": "AIDEX_TEMPERATURE_UNITS"
        },       
      ],
      "intent": "ClimateSetIntent"
    },
    {
      "intent": "ClimateStatusIntent"
    },
    {
      "intent": "ClimateSetIncIntent"
    },
   
    {
      "intent": "ClimateSetDecIntent"
    },
    {
      "slots": [
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
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
          "name": "FanLevel",
          "type": "AIDEX_FAN_LEVELS"
        }
      ],
      "intent": "FanSetIntent"
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
          "name": "LightLevel",
          "type": "AIDEX_LIGHT_LEVELS"
        }
      ],
      "intent": "LightSetIntent"
    },
    {
      "slots": [
        {
          "name": "Status",
          "type": "AIDEX_STATUS"
        }
      ],
      "intent": "LightControlIntent"
    },
    {
     "intent": "DriveControlIntent"
    },
    {
      "slots": [
        {
          "name": "DriveSpeed",
          "type": "AIDEX_DRIVE_SPEEDS"
        }
      ],
      "intent": "DriveSetIntent"
    },
    {
      "intent": "DriveSetIncIntent"
    },    
    {
      "intent": "DriveSetDecIntent"
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
        }
      ],
      "intent": "DriveTurnIntent"
    },
    {
      "intent": "DriveStatusIntent"
    },    
    {
      "intent": "nullIntent"
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
