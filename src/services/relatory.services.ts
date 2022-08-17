import { DateTime as time } from 'luxon'

export default class ReservationServices {
    Equipment: any
    constructor(Equipment: any) {
        this.Equipment = Equipment
    }

    createAction(actualActions: Actions) {
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

            let newerAction: any
            let lastAction
            userActions.forEach((action) => {
                const actionTime = time.fromFormat(action[0], "HH:mm:ss")

                if (!newerAction) {
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