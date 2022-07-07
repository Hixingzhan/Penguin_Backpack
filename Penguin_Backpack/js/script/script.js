chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse('content_scripts=>background.js结束通信')
    if(request.msg == 'follow'){
        Swal.fire({
            title: '批量关注工具',
            html: 
                '<p>由于学而思api限制，每1.5s关注一名用户。程序运行期间请勿关闭本网页。</p>'+
                '<input style="margin:5px 0;" id="swal-input1" class="swal2-input" placeholder="起始关注用户ID（例：10000）" value="10000">' +
                '<input style="margin:5px 0;" id="swal-input2" class="swal2-input" placeholder="关注用户数量（例：100）">',
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            focusConfirm: false,
            preConfirm: () => {
                return {
                    initial: Number(document.getElementById('swal-input1').value),
                    total: Number(document.getElementById('swal-input2').value)
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if(
                    (result.value.initial < 10000) || 
                    (result.value.total <= 0) || 
                    !IsNaN(result.value.initial) || 
                    !IsNaN(result.value.total)
                ){
                    Swal.fire({
                        icon: 'error',
                        title: '出错啦！',
                        text: '关注人数必须>0，起始关注id必须≥10000。请检查输入后重试。'
                    })
                    return false;
                }
                var theTime = result.value.total * sleep_time + 1000; //预计时间
                //===倒计时开始===
                countdown(theTime);
                //===倒计时结束===
                var extent = result.value.initial + result.value.total;  //关注id结束值
                var already = 0;
                var i = 1;
                for(var id = result.value.initial; id < extent; id ++){
                    (function(id) {
                        setTimeout(function() {
                            $.ajax({
                                url: 'https://code.xueersi.com/api/space/follow',
                                type: 'POST',
                                data: {
                                    followed_user_id: id + '',
                                    state:1  //1为关注，0为取消关注
                                },
                                async: false, //关闭异步
                                success: function(){
                                    already ++;
                                    console.log('已关注id为'+id+'的用户');
                                },
                                error: function(r){
                                    console.log('id'+id+'关注失败，原因：'+r.responseJSON.message);
                                }
                            })
                        }, sleep_time * (i++));
                    })(id)
                }
                setTimeout(function() {
                    Swal.fire({
                        icon: 'success',
                        text: '操作成功（' + already + '/' + result.value.total + '）'
                    })
                },sleep_time * (i++))
            }
        })
    } 
    else if(request.msg == 'follow_developers'){
        var developers = [
            {
                avatar_path: 'https://static0.xesimg.com/udc-o-user-avatar/20220604/TalzX0LC2XK1eKv0W-8ZDzIsaw1435.jpg',
                id: '73609760',
                name: 'lyj.',
                sign: '好きで好きでたまんなくて嘘をついた',
                works: 'css、js代码开发'
            },
            {
                avatar_path: 'https://static0.xesimg.com/udc-o-user-avatar/20220129/TalzzPBkBxSKcMTj_2Trmil-Pw1842.jpg',
                id: '15692928',
                name: 'XSY',
                sign: '什么也没有',
                works: 'UI设计、js代码开发'
            },
            {
                avatar_path: 'https://static1.xesimg.com/udc-o-user-avatar/20220619/TalzkXzs7O1YroD0YJX7DrU9Lg1054.jpg',
                id: '2842899',
                name: '欺每',
                sign: 'cheatmay.rth1.me',
                works: 'UI设计'
            }
        ]
        var code = '';
        developers.map(function(item,index){
            code +=  `
                <div class="tools_media border p-3 follow_developer button_circle" index="`+index+`" style="cursor:pointer;">
                    <img src="`+item.avatar_path+`" class="mr-3 mt-3 rounded-circle" style="width:60px;">
                    <div class="tools_media-body">
                        <h4>`+item.name+`</h4>
                        <p style="margin:0;">`+item.sign+`</p>
                        <p style="margin:0;font-size:12px;font-weight:bold;">`+item.works+`</p>
                    </div>
                </div>
            `
        })
        Swal.fire({
            title: '关注开发者',
            html: code,
            showCancelButton: true,
            confirmButtonText: '全部关注',
            cancelButtonText: '取消',
            preConfirm: () => {
                var i = 1;
                developers.map(function(item){
                    (function(item) {
                        setTimeout(function() {
                            $.ajax({
                                url: 'https://code.xueersi.com/api/space/follow',
                                type: 'POST',
                                async: false, //关闭异步
                                data: {
                                    followed_user_id: item.id,
                                    state:1
                                },
                                success: function(){
                                    console.log('已取消关注id为'+item.id+'的用户');
                                },
                                error: function(r){
                                    console.log('id'+item.id+'取消关注失败，原因：'+r.responseJSON.message);
                                }
                            })
                        }, sleep_time * (i++));
                    })(item)
                })
                return i;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setTimeout(function() {
                    Swal.fire({
                        icon: 'success',
                        title: '感谢你的关注！！'
                    })
                }, sleep_time * result.value);
            }   
        })
        $(".follow_developer").click(function(){
            var developer = developers[$(this).attr("index")];
            window.open('https://code.xueersi.com/space/' + developer.id);
        })
    }
    else if(request.msg == 'follows') {
        function select(e){
            if($(e).prop("checked")){
                $(e).removeClass("button_checked");
                $(e).addClass("button_circle");
                $(e).prop("checked",false);
            }
            else {
                $(e).addClass("button_checked");
                $(e).removeClass("button_circle");
                $(e).prop("checked",true);
            }
        }
        function selected(){
            var checked = [],seled = 0;
            $(".follow_people").each(function(){
                if($(this).prop("checked")) {
                    checked[seled ++] = {
                        id: $(this).attr("dataUid"),
                        index: $(this).attr("dataIndex")
                    }
                }
            })
            return {
                selected: seled,
                checked: checked
            }
        }
        if($("#modal2").exist()){ //判断是否已经有该dom
            $("#modal2").show();
        }
        else {        
            $("body").append(`
                <div class="popup-modal" id="modal2">
                    <div class="popup-main">
                        <div class="popup-header">
                            <div class="popup-title">批量管理关注列表</div>
                            <div class="popup-close">&times;</div>
                        </div>
                        <div class="popup-body" id="modal-follows">
                            <div id="follows_nav">
                                <ul class="backpack-ul clear-float">
                                    <li>操作</li>
                                    <li class="backpack-ul-link" @click="allSelected">全选/反选</li>
                                    <li class="backpack-ul-link" @click="allCancelFollow">取消关注</li>
                                </ul>
                                <p>操作说明：左键选中，右键访问个人主页。</p>
                            </div>
                            <div class="backpack-follows">
                                <template v-for="(item,index) in follow">
                                    <div v-if="item.id!=undefined" :key="item.id" class="tools_media border p-3 button_circle follow_people" checked=false :dataUid="item.id" :dataIndex="index" @click="select" @contextmenu.prevent="visit">
                                        <img :src="item.avatar_path" class="mr-3 mt-3 rounded-circle" style="width:60px;height:60px;">
                                        <div class="tools_media-body">
                                            <h4 style="font-weight:bold;">{{ item.realname }}</h4>
                                            <p style="margin:2px 0;">{{ item.signature }}</p>
                                            <p style="margin:2px 0;">关注：{{ item.follows }}&nbsp;&nbsp;&nbsp;&nbsp;粉丝：{{ item.fans }}</p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            vm2 = new Vue({
                el: "#modal-follows",
                data: {
                    follow:getFollows(request.info)
                },
                methods: {
                    allSelected(){
                        $(".follow_people").each(function(){
                            select(this);
                        })
                    },
                    allCancelFollow(){
                        confirm(() => {
                            var data = selected();
                            var theTime = data.selected * sleep_time + 1000; //预计时间
                            //===倒计时开始===
                            countdown(theTime);
                            //===倒计时结束===
                            var already = 0;
                            var i = 1;
                            data.checked.map(function(item){
                                (function(item) {
                                    setTimeout(function() {
                                        $.ajax({
                                            url: 'https://code.xueersi.com/api/space/follow',
                                            type: 'POST',
                                            data: {
                                                followed_user_id: item.id + '',
                                                state:0  //1为关注，0为取消关注
                                            },
                                            async: false, //关闭异步
                                            success: function(){
                                                already ++;
                                                vm2.follow[item.index].id = undefined;
                                                console.log('已取消关注id为'+item.id+'的用户');
                                            },
                                            error: function(r){
                                                console.log('id'+item.id+'取消关注失败，原因：'+r.responseJSON.message);
                                            }
                                        })
                                    }, sleep_time * (i++));
                                })(item)
                            })
                            setTimeout(function() {
                                Swal.fire({
                                   icon: 'success',
                                    text: '操作成功（' + already + '/' + data.selected + '）'
                                })
                            },sleep_time * (i++))
                        })
                    },
                    select(event){
                        select(event.currentTarget);
                    },
                    visit(event){
                        window.open("https://code.xueersi.com/space/"+$(event.currentTarget).attr("dataUid"));
                    }
                }
            })
            open_modal();
        }
        $(".popup-close").on("click",function(){ //关闭当前模态框
            $(popobj[$(this).attr("modal-id")].modal).hide();
        })
    }
    else if(request.msg == 'projects') {
        if($("#modal").exist()){
            $("#modal").show();
        }
        else {
            var _data = getProject();
            if (_data == -1){
                Swal.fire({
                    icon: 'error',
                    text: '作品数据拉取错误，请重新再试！'
                })
            }
            $("body").append(`
                <div class="popup-modal" id="modal">
                    <div class="popup-main">
                        <div class="popup-header">
                            <div class="popup-title">批量管理</div>
                            <div class="popup-close">&times;</div>
                        </div>
                        <div class="popup-body" id="projectObj">
                            <div class="backpack-screen">
                                <div class="backpack-search clear-float">
                                    <div class="backpack-search-title">
                                        <span>关键字搜索</span>
                                    </div>
                                    <div class="backpack-search-info">
                                        <input type="text" class="input-search" id="input-search" v-model="search"/>
                                    </div>
                                </div>
                                <h3 class="backpack-title-h3">筛选</h3>
                                <template v-for="(item,index) in screen">
                                    <ul class="backpack-ul clear-float">
                                        <li v-text="item.title"></li>
                                        <li class="backpack-ul-link" v-for="keyword in item.Keyword" v-text="keyword.name" @click="setKeyWord" :data-type="item.type" :data-keyword="keyword.word"></li>
                                    </ul>
                                </template>
                                <ul class="backpack-ul clear-float">
                                    <li>操作</li>
                                    <li class="backpack-ul-link" @click="allSelect">全选/反选</li>
                                    <li class="backpack-ul-link" @click="allDelete">删除</li>
                                    <li class="backpack-ul-link" @click="allCancelPublish">取消发布</li>
                                </ul>
                            </div>
                            <div class="backpack-projects">
                                <template v-for="(item,index) in projects">
                                    <div v-if="item.id!=undefined" class="backpack-project" :key="item.id">
                                        <label :for="item.id">
                                            <div class="backpack-header clear-float">
                                                <div class="backpack-title" :id="'title'+item.id">
                                                    <input type="checkbox" :value="item.id" :id="item.id" :lang="item.type" :index="item.index">
                                                    <span>{{ item.name }}</span>
                                                    <span v-if="item.published" class="badge">已发布</span>
                                                    <span v-else="item.published" class="badge">未发布</span>
                                                    <span class="badge">{{ item.type }}</span>
                                                    <a :href="item.url" target="_blank" :for="'#title'+item.id" class="backpack-link-open" @mouseenter="mouseenter" @mouseleave="mouseleave"><i class="fa fa-external-link" aria-hidden="true"></i></a>
                                                </div>
                                                <div class="backpack-link">
                                                    <a href="#" :for="'#work'+item.id" @click="moreInfo" class="backpack-open">详细信息<i class="fa fa-caret-down" aria-hidden="true"></i></a>
                                                </div>
                                            </div>
                                        </label>
                                        <div class="backpack-info hide" :id="'work'+item.id">
                                            <ul>  
                                                <li>观看：{{ item.views }}</li>
                                                <li>赞：{{ item.likes }}</li>
                                                <li>踩：{{ item.unlikes }}</li>
                                                <li>收藏：{{ item.favorites }}</li>
                                                <li>发布时间：{{ item.published_at }}</li>
                                                <li>最后修改时间：{{ item.modified_at }}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://use.fontawesome.com/a3ab5d584a.js"></script>
            `);
            vm = new Vue({
                el: "#projectObj",
                data: {
                    search:'',
                    screen: [     //筛选
                        {
                            title: '状态',
                            type: 'state',
                            Keyword: [
                                {
                                    name: '已发布',
                                    word: 'published'
                                },
                                {
                                    name: '未发布',
                                    word: 'unpublished'
                                }
                            ]
                        },
                        {
                            title: '类型',
                            type: 'type',
                            Keyword: [
                                {
                                    name: 'C++',
                                    word: 'C++'
                                },
                                {
                                    name: 'Python',
                                    word: 'Python'
                                },
                                {
                                    name: 'Scratch',
                                    word: 'Scratch'
                                }
                            ]
                        }
                    ],
                    project: _data
                },
                methods:{
                    addEscape(value) { //给特殊字符转义
                        let arr = ['(', '[', '{', '/', '^', '$', '¦', '}', ']', ')', '?', '*', '+', '.', "'", '"']
                        for (let i = 0; i < arr.length; i++) {
                            if (value) {
                                if (value.indexOf(arr[i]) > -1) {
                                    const reg = (str) => str.replace(/[\[\]\/\{\}\(\)\*\'\"\¦\+\?\.\\\^\$\|]/g, "\\$&")
                                    value = reg(value)
                                }
                            }
                        }
                        return value;
                    },
                    moreInfo(event){
                        $($(event.target).attr("for")).toggle();
                    },
                    mouseenter(event){
                        $($(event.target).attr("for")).css("text-decoration","underline");
                    },
                    mouseleave(event){
                        $($(event.target).attr("for")).css("text-decoration","none");
                    },
                    merge(arr1,arr2){
                        return Array.from(new Set(arr1.concat(arr2))); //去重合并数组
                    },
                    stateSearch(state){   //在状态中查找
                        var code = -1,list = [];
                        if(state == "published") code = 1;
                        else if(state == "unpublished") code = 0;
                        var index = 0;
                        this.project.map(function(item){
                            if(item.published == code){
                                list[index++] = item;
                            }
                        })
                        return list;
                    },
                    typeSearch(str){    //在种类中查找
                        return this.project.filter(value => {		 
                            return value.type.match(this.addEscape(str))
                        });
                    },
                    setKeyWord(event){  //设置搜索关键字
                        this.search = $(event.target).attr("data-type")+':'+$(event.target).attr("data-keyword");
                    },
                    allSelect(){
                        $(".backpack-title > input[type='checkbox']").each(function(){
                            if($(this).prop("checked")){
                                $(this).prop("checked",false);
                            } else{
                                $(this).prop("checked",true);
                            }
                        })
                    },
                    allDelete(){
                        confirm(function(){
                            var postUrl,total=0,index=0;
                            $(".backpack-title > input[type='checkbox']:checked").each(function(){
                                var checkbox = this;
                                total++;
                                switch($(checkbox).attr("lang")){
                                    case "C++":
                                        postUrl = "https://code.xueersi.com/api/compilers/";
                                        break;
                                    case "Python":
                                        postUrl = "https://code.xueersi.com/api/compilers/";
                                        break;
                                    case "Scratch":
                                        postUrl = "https://code.xueersi.com/api/projects/";
                                        break;
                                }
                                $.ajax({
                                    url:postUrl+$(checkbox).val()+"/delete",
                                    type: "post",
                                    async: false, //关闭异步
                                    success:function(){
                                        index++;
                                        vm.project[$(checkbox).attr("index")].id = undefined; //标记删除
                                    }
                                })
                            })
                            Toast.fire({
                                icon:"success",
                                text:"操作成功（"+index+"/"+total+")"
                            })
                        })
                    },
                    allCancelPublish(){
                        confirm(function(){
                            var postUrl,total=0,index=0;
                            $(".backpack-title > input[type='checkbox']:checked").each(function(){
                                var checkbox = this;
                                total++;
                                switch($(checkbox).attr("lang")){
                                    case "C++":
                                        postUrl = "https://code.xueersi.com/api/compilers/";
                                        break;
                                    case "Python":
                                        postUrl = "https://code.xueersi.com/api/python/";
                                        break;
                                    case "Scratch":
                                        postUrl = "https://code.xueersi.com/api/projects/";
                                        break;
                                }
                                $.ajax({
                                    url:postUrl+$(checkbox).val()+"/cancel_publish",
                                    type: "post",
                                    async: false, //关闭异步
                                    success:function(){
                                        index++;
                                        vm.project[$(checkbox).attr("index")].published = 0; //设置已发布
                                    }
                                })
                            })
                            Toast.fire({
                                icon:"success",
                                text:"操作成功（"+index+"/"+total+")"
                            })
                        })
                    }
                },
                computed:{
                    projects:function(){
                        var KeyWord = this.search;
                        if(KeyWord.search("state:")!=-1){
                            return this.stateSearch(KeyWord.match(/state:(.*)/)[1]);
                        }
                        if(KeyWord.search("type:")!=-1){
                            return this.typeSearch(KeyWord.match(/type:(.*)/)[1]);
                        }
                        return this.project.filter(value => {		 //在标题中查找
                            return value.name.match(this.addEscape(this.search))
                        });
                    }
                }
            })
            open_modal();
        }
        $(".popup-close").on("click",function(){ //关闭当前模态框
            $(popobj[$(this).attr("modal-id")].modal).hide();
        })
    }
    else if(request.msg == 'reload') {
        try {
            vm.project = getProject();
        }
        catch(err) {
            console.log("加载作品错误，原因："+err.message);
        }
        try {
            vm2.follow = getFollows(request.info);
        }
        catch(err) {
            console.log("加载关注列表错误，原因："+err.message);
        }
    }
    else if(request.msg == 'novel') {
        var pid = $_GET.pid;
        var data;
        if(!$("#bookcase").exist()){
            $.ajax({
                url: 'https://code.xueersi.com/api/compilers/v2/' + pid,
                type: 'GET',
                async: false, //关闭异步
                success: (result) => {
                    data = result.data;
                }
            })
            $("html,body").css({"width":"100%","height":"100%","background":"rgb(233,227,214)"});
            $("head").html(`
                <title>`+data.name+`</title>
                <meta charset="utf-8" />  <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/4.3.1/css/bootstrap.min.css">
                <script src="https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js"></script>
                <script src="https://cdn.staticfile.org/popper.js/1.15.0/umd/popper.min.js"></script>
                <script src="https://cdn.staticfile.org/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
            `)
            $("body").html(`
                <div id="bookcase">
                    <div id="book">
                        <h2>`+data.name+`</h2>
                        <div id="info">
                            <span>作者：<a href="https://code.xueersi.com/space/`+data.user_id+`" target="_blank">`+data.username+`</a></span>
                        </div>
                        <div id="text"></div>
                    </div>
                </div>
            `)
            var lst = data.xml.split('\n');
            var txt = [];
            var is_add = 0;
            lst.map(function(item){
                if(item.match(/xingzhan:novelStart/)) {
                    is_add = 1;
                    return 1;
                }
                if(item.match(/xingzhan:novelEnd/)) is_add = 0;
                if(is_add) txt.push(item.replace(/\s+/g,""));
            })
            txt.map(function(item){
                var p = document.createElement('div');
                p.innerHTML = item;
                $("#text").append(p);
            })
        }
    }
    else if(request.msg == 'fans') {
        Swal.fire({
            title: '自动回关工具',
            text: '由于学而思api限制，每1.5s回关一名粉丝。程序运行期间请勿关闭本网页。',
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = getFans(request.info);
                var theTime = data.total * sleep_time + 1000; //预计时间
                //===倒计时开始===
                countdown(theTime);
                //===倒计时结束===
                var already = 0;
                var i = 1;
                data.fans.map(function(item){
                    (function(item) {
                        setTimeout(function() {
                            $.ajax({
                                url: 'https://code.xueersi.com/api/space/follow',
                                type: 'POST',
                                data: {
                                    followed_user_id: item.user_id + '',
                                    state:1  //1为关注，0为取消关注
                                },
                                async: false, //关闭异步
                                success: function(){
                                    already ++;
                                    console.log('已回关id为'+item.user_id+'的用户');
                                },
                                error: function(r){
                                    console.log('id'+item.user_id+'回关失败，原因：'+r.responseJSON.message);
                                }
                            })
                        }, sleep_time * (i++));
                    })(item)
                })
                setTimeout(function() {
                    Swal.fire({
                        icon: 'success',
                        text: '操作成功（' + already + '/' + data.total + '）'
                    })
                },sleep_time * (i++))
            }
        })
    }
})
