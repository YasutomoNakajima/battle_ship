module GameParameters{
    export class Component{
        public static APP_WIDTH: number = 1200;
        public static APP_HEIGHT: number = 720;

        public static BUTTON_SIZE_W: number = 220;
        public static BUTTON_SIZE_H: number = 80;

        public static HOME_BUTTONS_BASE_POSITION_X: number = -16;
        public static HOME_BUTTONS_BASE_POSITION_Y: number = 16;

        public static DEFAULT_ALPHA: number = 0.5;

        public static MAP_BIT_SIZE: number = 78;

        public static FLEET_ICONS_X: number = 30;
        public static FLEET_ICONS_Y: number = 60;

        public static ACTION_CMD_BUTTON_X: number = 32;
        public static ACTION_CMD_BUTTON_Y: number = 350;
    }
    export class Status{
        public static player = {
            name: "TEST USER",
            level: "99"
        };

        public static soundVolume = {
            music: 0.01,
            se: 0.2,
            voice: 0.2
        };

        public static selectStage = -1;

        public static callAnimationId: string = 'call yet';

        public static teamLeader: string = 'bep';

        public static team = [
            "bep",
            "kirishima",
            "i168"
        ];

        public static enemyTeam = [
            "1501",
            "1501",
            "1501"
        ];

        public static selectedFleetIcon = {
            id: -1,
            position: [-1, -1] // [y, x]
        };

        public static fleetPosition = [
            {id: 0, position: [-1, -1]},
            {id: 1, position: [-1, -1]},
            {id: 2, position: [-1, -1]}
        ];

        public static selectedMapMask = [-1, -1];

        public static selectedActionButton = "blank";

        public static precedence = 0;
        public static attackStatement = {};
        public static enemyActionState = {};

        public static actionPossibleArea = {
            attack: [
                { id: 0, positions: [] },
                { id: 1, positions: [] },
                { id: 2, positions: [] }
            ],
            move: [
                { id: 0, positions: [] },
                { id: 1, positions: [] },
                { id: 2, positions: [] }
            ]
        };

        public static fleet = [
            {id: 0, type: "", hp: 1, maxHp: 32, bullet: 3, agility: 10},
            {id: 1, type: "", hp: 1, maxHp: 60, bullet: 7, agility: 10},
            {id: 2, type: "", hp: 1, maxHp: 9, bullet: 2, agility: 10}
        ];

        public static result = {};

        public static reset(){
            Status.selectedFleetIcon.id = -1;
            Status.selectedFleetIcon.position[0] = -1;
            Status.selectedFleetIcon.position[1] = -1;

            Status.fleetPosition[0].position[0] = -1;
            Status.fleetPosition[0].position[1] = -1;
            Status.fleetPosition[1].position[0] = -1;
            Status.fleetPosition[1].position[1] = -1;
            Status.fleetPosition[2].position[0] = -1;
            Status.fleetPosition[2].position[1] = -1;
        }
    }

}