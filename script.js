$('#load').on('click', loadFriends);

var friendsList = null;
var sortFIOAB = false;
var sortIDAB = false;

function acceptFilter() {
    var friendsListFilteredSex = null;
    var friendsListFilteredStatus = null;
    filterSex();
    filterStatus();
}
function filterSex() {
    var sex = window.document.getElementById('select-sex').value;

    friendsListFilteredSex = friendsList.filter(function (item) {
        if (sex === 'all') { return item }
        return getSex(item.sex) === sex;
    });
}

function filterStatus() {
    var status = window.document.getElementById('select-status').value;

    var friendsListFilteredStatus = friendsListFilteredSex.filter(function (item) {
        if (status === 'all') { return item }
        return getStatus(item.online) === status;
    });
    drawFriends(friendsListFilteredStatus);
}

function sortByFIO() {
    function compareAB(a, b) {
        if (a.last_name > b.last_name) return 1;
        if (a.last_name < b.last_name) return -1;
    }
    function compareBA(a, b) {
        if (a.last_name < b.last_name) return 1;
        if (a.last_name > b.last_name) return -1;
    }

    if (sortFIOAB) {
        friendsList.sort(compareAB);
    }
    else {
        friendsList.sort(compareBA);
    }
    sortFIOAB = !sortFIOAB;
    acceptFilter();
    //drawFriends(friendsList);
}

function sortByID() {
    function compareAB(a, b) {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
    }
    function compareBA(a, b) {
        if (a.id < b.id) return 1;
        if (a.id > b.id) return -1;
    }
    if (sortIDAB) {
        friendsList.sort(compareAB);
    }
    else {
        friendsList.sort(compareBA);
    }
    sortIDAB = !sortIDAB;
    acceptFilter();
    //drawFriends(friendsList);
}

function getUrl(method, params) {
    if (!method) throw new Error('Вы не указали метод!');
    params = params || {};
    params['access_token'] = '7004cbff11dc7ef172da1074f37ff25238476e8b687eaf7aac59ec6003c9a762ddcf7a762181c8d555050';
    return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}

function sendRequest(method, params, func) {
    $.ajax({
        url: getUrl(method, params),
        method: 'GET',
        dataType: 'JSONP',
        success: func
    });
    console.log(getUrl(method, params));
}

function loadFriends() {
    var search = window.document.getElementById('search').value;
    sendRequest('friends.search', { count: 50, fields: 'photo_100,online,sex,bdate', q: search }, function (data) {
        friendsList = data.response.items;
        drawFriends(friendsList);
    });
}
loadFriends();
function drawFriends(friends) {
    //console.log(friends);
    var html = '';
    var htmltr = '';
    for (var i = 0; i < friends.length; i++) {
        var friend = friends[i];
        var online = getStatus(friend.online); //friend.online ? 'Online' : 'Offline';
        var sex = getSex(friend.sex);
        html += '<li>' +
            '<a target="_blank" href="https://vk.com/id' + friend.id + '">'
            + '<img src="' + friend.photo_100 + '"/>'
            + '<div>'
            + '<h4>' + friend.first_name + ' ' + friend.last_name + '</h4>'
            + '<p>' + online + ' ' + sex + '</p>'
            + '<button>Написать</button>'
            + '</div>'
            + '</a>'
            + '</li>';
        htmltr += '<tr>'

            + '<td>' + i + '</td>'
            + '<td>' + friend.id + '</td>'
            + '<td>'
            + '<a target="_blank" href="https://vk.com/id' + friend.id + '">'
            + '<img src="' + friend.photo_100 + '"/>' + '</td>'
            + '<td>' + friend.first_name + ' ' + friend.last_name + '</td>'
            + '<td>' + sex + '</td>'
            + '<td>' + online + '</td>'
            + '</tr>';
    }
    //$('ul').html(html);
    $('tbody').html(htmltr);
}

function getSex(sex) {
    var putSex = '';
    switch (sex) {
        case 0: putSex = 'unknown';
            break;
        case 1: putSex = 'female';
            break;
        case 2: putSex = 'male';
            break;
    }
    return putSex;
}

function getStatus(status) {
    var putStatus = '';
    switch (status) {
        case 0: putStatus = 'offline';
            break;
        case 1: putStatus = 'online';
            break;
    }
    return putStatus;
}