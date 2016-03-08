var httpify = {};

httpify.get = function (url, callback) {
    return $.getJSON(url, callback);
};

httpify.post = function (url, data) {
    return $.ajax({
        url: url,
        dataType: 'json',
        method: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
        },
        data: JSON.stringify(data)
    });
};

httpify.put = function (url, data) {
    data._method = 'PUT';
    return http.post(url, data);
};

httpify.patch = function (url, data) {
    data._method = 'PATCH';
    return http.post(url, data);
};

httpify.delete = function (url, data) {
    data._method = 'DELETE';
    return http.post(url, data);
};