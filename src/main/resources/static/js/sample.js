var put_log = new Array()

$().ready(function(){
    $('#table td').on('click', function (){
        var cell_id = $(this).find('img').attr('id')
        console.log(cell_id);
        if(put_log.length>0){
            var tmp = put_log.pop
            $(tmp).attr('src', "");
            console.log("ok");
        }
         var tmp = "#" + cell_id
        put_log.push(tmp)
        $(tmp).attr('src', "/images/091.png");
    });
    $(document).click(function (e) {
        post("oh yeah!")
    });
});

post = function (value) {
    $.ajax({
        type: 'POST',
        url: '/hogehoge',
        data: value
    })
    console.log(value)
}