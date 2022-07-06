const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
})
var bg = chrome.extension.getBackgroundPage(); 
var url;
function reload_userInfo(){
    $("#avatar").attr("src",bg.userInfo.avatar_path);
    $("#username").text(bg.userInfo.realname);
    $("#create_time").text('注册时间：'+bg.userInfo.create_time);
    url = 'https://code.xueersi.com/space/'+bg.userInfo.id;
}
function load(){
    bg.reload();
    if(bg.userInfo == -1) {
        Swal.fire({
            icon: 'error',
            text: '请求错误'
        })
    }
    else {
        console.log(bg.userInfo);
        reload_userInfo();
    }
    bg.send('reload',bg.userInfo.id);
}
$("#url").click(function(){
    window.open(url);
})
$("#follow").click(function(){
    bg.send('follow',bg.userInfo.id);
})
$("#follow_developers").click(function(){
    bg.send('follow_developers',bg.userInfo.id);
})
$('#follows').click(function(){
    Toast.fire({
        icon: 'success',
        text: '正在加载关注列表...'
    })
    bg.send('follows',bg.userInfo.id);
})
$('#fans').click(function(){
    bg.send('fans',bg.userInfo.id);
})
$('#projects').click(function(){
    Toast.fire({
        icon: 'success',
        text: '作品正在加载中...'
    })
    bg.send('projects',bg.userInfo.id);
})
$('#novel').click(function(){
    Toast.fire({
        icon: 'success',
        text: '小说阅读模式正在加载中...'
    })
    bg.send('novel',bg.userInfo.id);
})
$("#reload_userInfo").click(function(){
    Toast.fire({
        icon: 'success',
        text: '操作成功'
    })
    load();
})
$(".show_nav").click(function(){
    $($(this).attr("for")).toggle();
})
$(".level_2_menu").each(function(){
    $(this).hide();
})
reload_userInfo(bg.userInfo);