function rhinestoneGetFile(id,callback){
    data = {action:"get-file",fileId:id};
    $.ajax({
        type: 'post',
        url: 'http://localhost:8888/db',
        data: data,
        success: function(response){
                    callback(response.fileData);
                 },
        failure: function(response){
                 },
        dataType: 'json'
    });
}