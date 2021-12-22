var GameParameters;
(function (GameParameters) {
    var Component = /** @class */ (function () {
        function Component() {
        }
        Component.APP_WIDTH = 1200;
        Component.APP_HEIGHT = 720;
        Component.BUTTON_SIZE_W = 220;
        Component.BUTTON_SIZE_H = 80;
        Component.HOME_BUTTONS_BASE_POSITION_X = -16;
        Component.HOME_BUTTONS_BASE_POSITION_Y = 16;
        Component.DEFAULT_ALPHA = 0.5;
        Component.MAP_BIT_SIZE = 78;
        Component.FLEET_ICONS_X = 30;
        Component.FLEET_ICONS_Y = 60;
        Component.ACTION_CMD_BUTTON_X = 32;
        Component.ACTION_CMD_BUTTON_Y = 350;
        return Component;
    }());
    GameParameters.Component = Component;
    var Status = /** @class */ (function () {
        function Status() {
        }
        Status.reset = function () {
            Status.selectedFleetIcon.id = -1;
            Status.selectedFleetIcon.position[0] = -1;
            Status.selectedFleetIcon.position[1] = -1;
            Status.fleetPosition[0].position[0] = -1;
            Status.fleetPosition[0].position[1] = -1;
            Status.fleetPosition[1].position[0] = -1;
            Status.fleetPosition[1].position[1] = -1;
            Status.fleetPosition[2].position[0] = -1;
            Status.fleetPosition[2].position[1] = -1;
        };
        Status.player = {
            name: "TEST USER",
            level: "99"
        };
        Status.soundVolume = {
            music: 0.01,
            se: 0.2,
            voice: 0.2
        };
        Status.selectStage = -1;
        Status.callAnimationId = 'call yet';
        Status.teamLeader = 'bep';
        Status.team = [
            "bep",
            "kirishima",
            "i168"
        ];
        Status.enemyTeam = [
            "1501",
            "1501",
            "1501"
        ];
        Status.selectedFleetIcon = {
            id: -1,
            position: [-1, -1] // [y, x]
        };
        Status.fleetPosition = [
            { id: 0, position: [-1, -1] },
            { id: 1, position: [-1, -1] },
            { id: 2, position: [-1, -1] }
        ];
        Status.selectedMapMask = [-1, -1];
        Status.selectedActionButton = "blank";
        Status.precedence = 0;
        Status.attackStatement = {};
        Status.enemyActionState = {};
        Status.actionPossibleArea = {
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
        Status.fleet = [
            { id: 0, type: "", hp: 1, maxHp: 32, bullet: 3, agility: 10 },
            { id: 1, type: "", hp: 1, maxHp: 60, bullet: 7, agility: 10 },
            { id: 2, type: "", hp: 1, maxHp: 9, bullet: 2, agility: 10 }
        ];
        Status.result = {};
        return Status;
    }());
    GameParameters.Status = Status;
})(GameParameters || (GameParameters = {}));
