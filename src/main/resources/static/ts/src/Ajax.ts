///<reference path="D:\Documents\java\web_sys_prog\battleship_task\battleship_spring\src\main\resources\static\ts\lib\node_modules\@types\jquery\JQuery.d.ts" />

/***                       ***/
/***      Ajax通信関数      ***/
/***                       ***/
module Ajax{
    // POST
    export function post(url, data) {
        return $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            dataType: "json"
        })
    }

    // GET
    export function get(url){
        var result = $.ajax({
            type: 'GET',
            url: url,
            dataType: "json",
            async: false
        }).responseText;
        return result;
    }
}