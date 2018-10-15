var totalData=[];
var dataSelected=[];
var xhr = new XMLHttpRequest();
xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true)
xhr.send(null);
xhr.onload = function(){
    var data = JSON.parse(xhr.responseText);
    totalData = data.result.records;
    var len  = totalData.length;

    // 獲得地區列表
    var county=[];
    var result;
    for(var i=0;i<len;i++){
        county[i] = totalData[i].Zone;
    }
    result = county.filter(function(element, index, arr){
        return arr.indexOf(element)===index;
    });

    var el = document.querySelector('#selectArea');
    result.forEach(function(e){
        el.innerHTML += '<option value="'+e+'">'+e+'</option>';
    });

    // 初始值 = "三民區"
    update("三民區");
}

// 監聽事件
var hotAreaButton = document.querySelector('.hotArea2');
var areaSetected = document.getElementById('selectArea');
var pageList = document.querySelector('.pageList');
var backTop = document.querySelector('.back a');

hotAreaButton.addEventListener('click',function(e){
    e.preventDefault();
    // console.log(e.target.nodeName);
    if(e.target.nodeName == "A"){
        update(e.target.textContent);
    }
});
areaSetected.addEventListener('change',function(e){
    e.preventDefault();
    if(e.target.value != "none")
    update(e.target.value);
});
pageList.addEventListener('click',function(e){
    e.preventDefault();
    if(e.target.nodeName == "A"){
        pageBarSelect(e.target.textContent);
    }
});
backTop.addEventListener('click',function(e){
    e.preventDefault();
    goToTop();
});

function goToTop(){
    var value;
    value = window.scrollY;
    if(value>0){
        value -=50;
        if(value<0){
            value=0;
        }
        window.scrollTo(0,value);
        myTimeOut = setTimeout(goToTop,10);
    }else{
        clearTimeout(myTimeOut);
    }
}


function update(str){
    var titleArea = document.querySelector('.titleArea');
    var len = totalData.length;
    var itemCount=0;
    var itemData;
    
    titleArea.innerHTML=str;
    dataSelected=[];

    for(var i=0;i<len ;i++){
        if(str == totalData[i].Zone){
            itemData='<div class="card-box"><div class="card-img" style="background-image: url('+
            totalData[i].Picture1+');"><h4>'+
            totalData[i].Name+'</h4><p>'+
            totalData[i].Zone+'</p></div><div class="card-info"><div class="openTime">'+
            totalData[i].Opentime+'</div><div class="address">'+
            totalData[i].Add+'</div><div class="tel">'+
            totalData[i].Tel+'</div><div class="ticket">'+
            totalData[i].Ticketinfo+'</div></div></div>';

            dataSelected[itemCount] = itemData;
            itemCount++;
        }
    }
    // 顯示第一頁
    pageSelect(1);
    pageBarCreate(itemCount);
}

// 顯示第 page 頁的內容
function pageSelect(page){
    var contentArea = document.querySelector('.container');
    var len;
    var data='';
    var itemStart;
    var itemEnd;

    itemStart = (page-1)*10;
    itemEnd = page*10;
    len = dataSelected.length;

    data='';
    for(var i=itemStart;i<len&&i<itemEnd;i++){
        data+=dataSelected[i];
    }
    contentArea.innerHTML = data;

    // 回到視窗頂端
    window.scrollTo(0,0);
}

// 依資料數量 create page bar 的數量
function pageBarCreate(len){
    var pageList = document.querySelector('.pageList');
    var pageNum=0;
    var pageStr='';
    // 除10，無條件捨去，只取整數部分
    pageNum = Math.floor(len/10);
    if(len%10 > 0){
        pageNum++;
    }
    pageStr='<a class="disable" href="#">< prev</a><a class="disable" href="#">1</a>';
    if(pageNum <= 1){
        pageStr+='<a class="disable" href="#">next ></a>';
    }
    else{
        for(var i=2;i<=pageNum;i++){
            pageStr+='<a class="" href="#">'+i+'</a>';
        }
        pageStr+='<a class="" href="#">next ></a>';
    }
    
    pageList.innerHTML = pageStr;

}

// pageBar 選擇頁數
// pageSelect 顯示該頁數資料
function pageBarSelect(page){
    var pageList = document.querySelectorAll('.pageList a');
    var currentPage;
    var len = pageList.length;
    
    for(var i=1; i<len-1; i++){
        if(pageList[i].className == "disable"){
            currentPage=i;
        }
    }
    for(var i=0;i<len;i++){
        pageList[i].className="";
    }

    if(page == '< prev'){
        page = parseInt(currentPage)-1;
    }
    else if(page == 'next >'){
        page = parseInt(currentPage)+1;
    }
    // console.log(currentPage+'->'+page);
    
    if(parseInt(page) == 1){
        pageList[0].className="disable";
    }
    else if(parseInt(page) == len-2){
        pageList[parseInt(page)+1].className="disable";
    }
    pageList[parseInt(page)].className="disable";

    pageSelect(page);
}
    
