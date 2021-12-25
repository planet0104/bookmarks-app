window.BASE_URL = "";

window.API_TeachUserInfo = 'TeacherUserCenter/TeacherPersonal/GetTeachUserInfo';
window.API_TeacherTaskList = 'teacher/TeacherWorkbook/TeacherTaskList';
window.API_TeacherStudentDoTaskList = 'teacher/TeacherWorkbook/TeacherStudentDoTaskList';
window.API_GetWookbookStudentDoTaskResult = 'student/StudentWorkbook/GetWookbookStudentDoTaskResult';
//查询章节列表
window.API_GetTwoLevalByUserId = 'Report/StudentReport/GetTwoLevalByUserId';
//获取试卷列表
window.API_GetPaperList = 'admin/AdminWorkbook/GetPaperId';
// 获取PageId
window.API_GetPageIdsByPaperType = 'admin/AdminWorkbook/GetPageIdsByPaperType';
//
window.API_GetWorkbookPageByGtp = 'admin/AdminWorkbook/GetWorkbookPageByGtp';
//获取标记
window.API_GetWorkbookMarkJson = 'admin/AdminWorkbook/GetWorkbookMarkJson';
//获取标记ID
window.API_GetMarkId = 'admin/AdminWorkbook/GetMarkId';
//
window.API_DeleteWorkbookMark = 'admin/AdminWorkbook/DeleteWorkbookMark';

function splice_url(api_url){
    return BASE_URL + api_url;
}

//处理get请求，传入参数对象拼接
let formatParams = data => {
    let params = Object.values(data).reduce((a, b, i) => `${a}${Object.keys(data)[i]}=${b}&`, '?');
    return params.substring(0, params.length - 1);
};

function post(api_url, data){
    return request('POST', api_url, data);
}

function get(api_url, data){
    return request('GET', api_url, data);
}

function request(method, api_url, data){

    if(BASE_URL == ''){
        //未配置服务器时走缓存
        return new Promise((resolve, reject) => {
            console.error('服务器网址未配置!');
            var resp = JSON.parse(HttpCache.get(api_url));
            //必须延迟，否则resolve不会被调用
            setTimeout(function(){
                resolve(resp.Data);
            }, 100);
        });
    }

    return new Promise((resolve, reject) => {
        var url = splice_url(api_url)+formatParams(data);
        Logger.info('请求:', url, data);
        fetch(url, {
            method,
            body: method=='POST'? {}: undefined,
        }).then(function(response){
            return response.json();
        }).then(resp => {
            Logger.info(api_url+'返回:', resp);
            if(resp.Success){
                resolve(resp.Data);
            }else{
                reject(resp);
            }
        }).catch(e => {
            Logger.error(e);
            reject({
                errorMsg: e+''
            });
        });
    });
}

window.post_data = function(api_url, body){
    return new Promise((resolve, reject) => {
        var url = splice_url(api_url);
        Logger.info('请求:', url, body);
        fetch(url, {
            headers: {
                "Content-Type":"application/json"
            },
            method: 'POST',
            body
        }).then(function(response){
            return response.json();
        }).then(resp => {
            Logger.info(api_url+'返回:', resp);
            if(resp.Success){
                resolve(resp.Data);
            }else{
                reject(resp);
            }
        }).catch(e => {
            Logger.error(e);
            reject({
                errorMsg: e+''
            });
        });
    });
}

window.GetWorkbookPageByGtp = function(option){
    return post(API_GetWorkbookPageByGtp, option)
}

//获取marks
window.GetWorkbookMarkJson = function(option){
    return post(API_GetWorkbookMarkJson, option)
}

window.GetMarkId = function(option){
    return get(API_GetMarkId, option)
}

window.DeleteWorkbookMark = function(option){
    return post(API_DeleteWorkbookMark, option)
}

window.getPageIdsByPaperType = function(option){
    return post(API_GetPageIdsByPaperType, option)
}

//查询章节列表
window.getChapters = function(Grade, Term){
    return post(API_GetTwoLevalByUserId, {
        Term,
        Grade
    });
}

//获取试卷列表
window.getPaperList = function(creatorId){
    return post(API_GetPaperList, {creatorId})
}

window.downloadImage = async function(url){
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.src = url;
        image.onload = function(){
            resolve(image);
        };
        image.onerror = function(){
            reject('图像加载失败');
        };
    })
}