const time = require("luxon").DateTime
let db

module.exports = class RelatoryService {
    constructor(app) {
        db = app.db

        return {
            name: "relatory",
            functions: {
                createAction: this.createAction
            }
        }
    }

    createAction(actualActions) {
        const newActionDay = time.local({ zone: "America/Fortaleza" }).toFormat("dd/MM/yyyy")
        const newActionTime = time.local({ zone: "America/Fortaleza" }).toFormat("HH:mm:ss")

        let newAction
        if (actualActions == null) {
            newAction = {
                [newActionDay]: {
                    [newActionTime]: "Entrada"
                }
            }

            return {
                newAction: newAction,
                action: "Entrada",
                newActionDateTime: { day: newActionDay, time: newActionTime }
            }
        }
        else {
            const userActions = Object.entries(actualActions[newActionDay])

            let newerAction = 0
            let lastAction
            userActions.forEach((action) => {
                const actionTime = time.fromFormat(action[0], "HH:mm:ss")

                if (newerAction == 0) {
                    newAction = actionTime
                    lastAction = action[1]
                }
                else {
                    if (actionTime.toMillis() >= newerAction.toMillis()) {
                        newerAction = actionTime.toFormat("HH:mm:ss")
                        lastAction = action[1]
                    }
                }
            })

            const action = lastAction == "Entrada" ? "Saida" : "Entrada"

            newAction = {
                ...actualActions,
                [newActionDay]: {
                    ...actualActions[newActionDay] || {},
                    [newActionTime]: action
                }
            }

            return {
                newAction: newAction,
                action: action,
                newActionDateTime: { day: newActionDay, time: newActionTime }
            }
        }
    }
}