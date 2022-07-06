var userInfo = {};
function reload(){
    var state = -1;
    $.ajax({
        url: 'https://code.xueersi.com/api/user/info',
        type: 'GET',
        success: function(result){
            userInfo.id = result.data.user_id; //用户id
            userInfo.realname = result.data.realname;  //用户名
            userInfo.avatar_path = result.data.avatar_path;  //头像路径
            userInfo.create_time = result.data.create_time;  //注册时间
            state = 1;
        }
    })
    return state;
}
function send(msg,info){
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        let message = {
            msg: msg,
            info: info
        }
        chrome.tabs.sendMessage(tabs[0].id, message, res => {
            console.log('background.js=>content_scripts开始通信');
            console.log(res);
        })
    })
}
reload();