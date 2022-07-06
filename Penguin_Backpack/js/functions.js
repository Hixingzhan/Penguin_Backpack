const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
function confirm(func){
  Swal.fire({
    title: '你确定要继续操作吗？',
    text: '程序运行期间请勿关闭此网页。',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: `取消`
  }).then((result) => {
    if (result.isConfirmed) {
      func();
    }
  })
}
function getProject(){ //获取作品类
  var projectType = [
    {type:"C++",url:"https://code.xueersi.com/api/compilers/my"},
    {type:"Python",url:"https://code.xueersi.com/api/python/my"},
    {type:"Scratch",url:"https://code.xueersi.com/api/projects/my"}
  ];
  var projectsObj = [],projectsData,index = 0,state = 1;
  projectType.map(function(item){
    $.ajax({
      url: item.url,
      type: "get",
      data: {
        published:"all",
        type:"normal",
        page:1,
        per_page:999
      },
      async: false, //关闭异步
      success: function(result){
        projectsData = result.data.data;
        projectsData.map(function(item2){
          var projectObj = {};
          projectObj.index = index;
          projectObj.id = item2.id; //作品id
          projectObj.name = item2.name; //作品标题
          projectObj.published_at = item2.published_at; //发布时间
          projectObj.modified_at = item2.modified_at; //最后修改时间
          projectObj.likes = item2.likes; //赞数
          projectObj.views = item2.views; //观看数
          projectObj.unlikes = item2.unlikes; //踩数
          projectObj.favorites = item2.favorites; //收藏数
          projectObj.published = item2.published; //是否发布
          projectObj.type = item.type;
          switch(item.type){
            case "C++":
              projectObj.url = "https://code.xueersi.com/home/project/detail?lang=code&pid="+item2.id+"&version=cpp&form=cpp&langType=cpp";
              break;
            case "Python":
              projectObj.url = "https://code.xueersi.com/home/project/detail?lang=code&pid="+item2.id+"&version=offline&form=python&langType=python";
              break;
            default:
              projectObj.url = "https://code.xueersi.com/home/project/detail?lang=scratch&pid="+item2.id+"&version=3.0&langType=scratch";
          }
          projectsObj[index++] = projectObj;
        })
      },
      error: function(){
        state = -1;
      }
    })
  })
  if(state) {
    return JSON.parse(JSON.stringify(projectsObj));
  }
  return state;
}
function getFollows(userid){
  var follows = [],total;
  $.ajax({
      url: 'https://code.xueersi.com/api/space/index',
      type: 'GET',
      data: {
          user_id: userid
      },
      async: false, //关闭异步
      success: function(result){
          total = result.data.follows.total;
      }
  })
  $.ajax({
      url: 'https://code.xueersi.com/api/space/follows',
      type: 'GET',
      data: {
          user_id: userid,
          page: 1,
          per_page: total
      },
      async: false, //关闭异步
      success: function(result){
        follows = result.data.data;
      }
  })
  return JSON.parse(JSON.stringify(follows));
}
function getFans(userid){
  var fans = [],total;
  $.ajax({
      url: 'https://code.xueersi.com/api/space/index',
      type: 'GET',
      data: {
          user_id: userid
      },
      async: false, //关闭异步
      success: function(result){
          total = result.data.fans.total;
      }
  })
  $.ajax({
      url: 'https://code.xueersi.com/api/space/fans',
      type: 'GET',
      data: {
          user_id: userid,
          page: 1,
          per_page: total
      },
      async: false, //关闭异步
      success: function(result){
        fans= result.data.data;
      }
  })
  return {
    total:total,
    fans:JSON.parse(JSON.stringify(fans))
  }
}
function IsNaN(value) {
  return (typeof value === 'number' && !isNaN(value));
}
(function($) {
  $.fn.exist = function(){ 
   if($(this).length>=1){
    return true;
   }
   return false;
  };
})(jQuery);
function countdown(theTime) {
  //===倒计时开始===
  let timerInterval
  Swal.fire({
      title: '程序运行中...',
      html: '预计还有<b></b>毫秒',
      timer: theTime,
      timerProgressBar: true,
      didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
          }, 100)
      },
      willClose: () => {
          clearInterval(timerInterval)
      }
  }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
          console.log('预计时间结束')
      }
  })
  //===倒计时结束===
}
var $_GET = (function(){
  var url = window.document.location.href.toString();
  var u = url.split("?");
  if(typeof(u[1]) == "string"){
      u = u[1].split("&");
      var get = {};
      for(var i in u){
          var j = u[i].split("=");
          get[j[0]] = j[1];
      }
      return get;
  } else {
      return {};
  }
})();
var vm,vm2;
var popobj = [];
var sleep_time = 1500; //一次请求等待时间
function open_modal(){
    $(".popup-modal").each(function(index){
        popobj[index] = {};
        popobj[index].modal = this; //模态框对象
        $(this).find(".popup-close").attr("modal-id",index); //模态框id
    })
}