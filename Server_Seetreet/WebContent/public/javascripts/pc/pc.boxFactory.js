/**
 * Created by Limjiuk on 2014-10-27.
 */
var box_Factory = {};

box_Factory.content = {};
box_Factory.content.contentArray = new Array();
box_Factory.content.contentpagenum = 0;
box_Factory.content.finishdatanum = 0;
box_Factory.returnDataFlag = false;
var testnum = 0;
//
box_Factory.content.initContentData = function(cb){
    $('.seetreet-container').find('.content-list-area').find('.contentlist').remove();
    // contentArray를 비워주고
    box_Factory.content.contentArray = [];
    // page넘버를 1로 만들어준다.
    box_Factory.content.contentpagenum = 0;
    current_content_num = 0;
    current_group_num = 0;
    cb();
};

// 더미데이터 넣기

// 데이터를 추가해서 갱신해준다.
//box_Factory.content.appendArray = function(latitude, longitude, callback){
//    for(var i=0;i<2;i++){
//        box_Factory.content.contentpagenum += 1;
//        var pagenumber = box_Factory.content.contentpagenum;
//        getUserContent(latitude, longitude, pagenumber, function(data, status, res){
//            if(status == 'success'){
//                if(data.data.length != 0){
//                    box_Factory.returnDataFlag = true;
//                    for(var index in data.data){
//                        box_Factory.content.contentArray.push(data.data[index]);
//                    }
//                    callback();
//                }
//            }
//            else{
//                console.log('데이터가 안받아짐');
//            }
//        });
//    }
//};


box_Factory.content.appendArray = function(latitude, longitude, callback) {
	getRecTables(function(d, state) {
		if (state == "success") {
			var recTable = d.data;
			if(recTable == undefined) {
			    for(var i=0;i<2;i++){
		        box_Factory.content.contentpagenum += 1;
		        var pagenumber = box_Factory.content.contentpagenum;
		        getUserContent(latitude, longitude, pagenumber, function(data, status, res){
		            if(status == 'success'){
		                if(data.data.length != 0){
		                    box_Factory.returnDataFlag = true;
		                    for(var index in data.data){
		                        box_Factory.content.contentArray.push(data.data[index]);
		                    }
		                    callback();
		                }
		            }
		            else{
		                console.log('데이터가 안받아짐');
		            }
		        });
			    }
			} else {
				
				for (var i = 0; i < 2; i++) {
					box_Factory.content.contentpagenum += 1;
					var pagenumber = box_Factory.content.contentpagenum;
					getUserContent(latitude,longitude, pagenumber, function(data, status, res) {
								if (status == 'success') {
									if (data.data.length != 0) {
										box_Factory.returnDataFlag = true;
										var tempArr = new Array();
										for ( var index in data.data) {
											var tContent = data.data[index];
											// console.log(data.data[index]);
											var aGenre = tContent.contentGenre.detailGenre;
											var pGenre = tContent.provider.favoriteGenre[0].detailGenre;
											data.data[index].recvalue = (recTable[aGenre] == undefined ? 0
													: recTable[aGenre])
													+ (recTable[pGenre] == undefined ? 0
															: recTable[pGenre]);
											tempArr.push(data.data[index]);										
										}								

										tempArr.sort(function(x, y) {
											return y.recvalue - x.recvalue;
										});
										
										for(var t in tempArr) {
											box_Factory.content.contentArray
											.push(tempArr[t]);
										}
										
										
										

										callback();
									}
								} else {
									console.log('데이터가 안받아짐');
								}
							});

				}
			}
			

		}
	});

};
// createContentGroup는 data가 1, 8, 15 ... 단위로 만들어지면 된다.
box_Factory.content.createContentGroup = function(groupnumber){
    $('.seetreet-container.container').find('.content-list-area').append(
        '<div class = "contentlist" group-list = "' + groupnumber + '">'
        + '<div class = "largesize-area">'
        + '</div>'
        + '<div class = "smallsize-area">'
        + '</div>'
    );
};
// largesizearea는 1번째, 8번째, 15번째 ... 단위로 만들어지면 된다.
box_Factory.content.createContent = function(contentinfo, groupnumber, size){
    // contentId
    var content_id = contentinfo._id;
//    var content_id = testnum;
//    testnum++;
    // 공공 데이터 인지 Seetreet데이터인지 판별
    var content_type = '';
    if(contentinfo.contentType == 'PUBLIC'){
        content_type = 'public';
    }
    else{
        content_type = 'private';
    }
    // 공연명
    var content_name = contentinfo.contentTitle;
    // 아티스트명 또는 공공주최명
    var performed_name = '';
    
    
    var confirmed_artistId = contentinfo.isConfirmed_artistId;
    var artistArray = contentinfo.artists;
    var artistdata = {};
    for(var i in artistArray){
    	if(confirmed_artistId == artistArray[i]._id){
    		artistdata = artistArray[i];
    	}
    }
    if(content_type == 'public'){
        performed_name = contentinfo.provider.StoreTitle;
    }
    else{
        performed_name = artistdata.name;
    }
    // 공연 시간 만들기 시간 단위면 XX월 XX일 XX:XXPM ~ XX:XXPM
    // 일이 넘어가게 되면 XX월 XX일 ~ XX월 XX일
    // 시간 포맷 201411130800PM
    // 공연 시작 시간
    
    var start_time = contentinfo.contentStartTime;
    // 공연 종료 시간
    var end_time = contentinfo.contentEndTime;
    
    var content_time = '';
    if(content_type == 'public'){
    	content_time = box_Factory.convert_time(start_time, end_time); 
    }
    else{
    	content_time = box_Factory.seetreet_convert_time(start_time, end_time);
    }

    // 공연 장소
    var content_address = contentinfo.provider.StoreAddress;
    // 공연 설명
    var content_description;
    if(content_type == 'public'){
        content_description = contentinfo.provider.description;
    }
    else{
        content_description = contentinfo.artists[0].description;
    }

    // 공연 이미지

    var content_img = contentinfo.provider.providerImage[0];
    if(content_img == ""){
        content_img = "./images/seetreetimg/content_default.jpg";
    }

    if(size == 'large'){
        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.largesize-area').append(
                '<div class = "content' + ' ' +  content_type + '" data-index = "' + content_id + '">'
                    + '<img class = "content-image" src = "' + content_img + '"/>'
                    + '<div class = "content-info">'
                        + '<div class = "place-title">' +  content_name + '</div>'
                        + '<div class = "artist-title">' + performed_name + '</div>'
                        + '<div class = "showtime-title">' + content_time + '</div>'
                        + '<div class = "location-title">' + content_address + '</div>'
                        + '<div class = "description-title">' + content_description + '</div>'
                    + '</div>'
                + '</div>'
        );
        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.largesize-area').find('.content[data-index = "' + content_id + '"]').hide();
//        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.largesize-area').find('.content[data-index = "' + content_id + '"]').show('scale', {direction:"horizontal"});

    }
    else{
        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.smallsize-area').append(
                '<div class = "content' + ' ' + content_type + '" data-index = "' + content_id + '">'
                + '<img class = "content-image" src = "' + content_img + '"/>'
                + '<div class = "content-info">'
                + '<div class = "place-title">' +  content_name + '</div>'
                + '<div class = "artist-title">' + performed_name + '</div>'
                + '<div class = "showtime-title">' + content_time + '</div>'
                + '<div class = "location-title">' + content_address + '</div>'
                + '</div>'
                + '</div>'
        );
        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.smallsize-area').find('.content[data-index = "' + content_id + '"]').hide();
//        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.smallsize-area').find('.content[data-index = "' + content_id + '"]').show('scale', {direction : "horizontal"});

    }
};

var current_show_content_num = 1;
box_Factory.content.contentLoadAnimation = function(groupnumber){
//    console.log('count');
//    if(current_show_content_num == 7){
//        return;
//    }
//    if(current_show_content_num == 1){
//        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.largesize-area').find('.content :nth-child(' + current_show_content_num + ')').show('clip');
//    }
//    else{
//        $('.contentlist[group-list = "' +  groupnumber + '"]').find('.smallsize-area').find('.content:nth-child(' + current_show_content_num + ')').show('clip');
//    }
//    box_Factory.content.contentLoadAnimation(groupnumber);
};


box_Factory.content.get_a_content = function(dataindex){
    var contentarray = box_Factory.content.contentArray;
    for(var index in contentarray){
        if(contentarray[index]._id == dataindex){
            return contentarray[index];
        }
    }
};

//box_Factory.provider = {};
//box_Factory.provider.create_provider_group = function(){
//    // 새로운 listboxgroup provider를 만든다.
//    $('.listtab.provider').find('.provider-list-area').prepend(
//            '<div class = "listboxgroup provider" data-group = "2">'
//            + '<div class = "listbox createbox provider">'
//            + '<div class = "finish-create">'
//            + '<img class = "content-image" src = "./images/seetreetimg/5mile1.jpg"/>'
//            + '<div class = "content-info">'
//            + '<div class = "place-title">Zoo Coffee</div>'
//            + '<div class = "showdate-title">2014/09/21</div>'
//            + '<div class = "showtime-title">08:00PM ~ 10:00PM</div>'
//            + '</div>'
//            + '</div>'
//            + '</div>'
//            + '</div>'
//    );
//};
//box_Factory.provider.create_provider_box = function(datagroup){
//    $('.listgroup.provider[data-group="2"]').append(
//            '<div class = "listbox artist">'
//            + '<img class = "image" src = "./images/seetreetimg/5mile1.jpg"/>'
//            + '<div class = "info">'
//            +   '<div class = "title">Maroon5</div>'
//            +   '<div class = "category">Music-Pop</div>'
//            + '<button type = "button" class = "btn btn-default">confirmed</button>'
//            + '</div>'
//            + '</div>'
//    )
//};
//
//box_Factory.artist = {};
//box_Factory.artist.create_busking_box = function(){
//    $('.listboxgroup.artist.busking').append(
//        '<div class = "listbox buskingbox artist ">'
//            + '<img class = "image" src = "./images/seetreetimg/5mile1.jpg"/>'
//            + '<div class = "info">'
//                + '<div class = "place-title">Zoo Coffee</div>'
//                + '<div class = "showdate-title">2014/09/21</div>'
//                + '<div class = "showtime-title"> 08:00PM ~ 10:00PM</div>'
//                + '<button type = "button" class = "btn btn-default">confirmed</button>'
//            + '</div>'
//        + '</div>'
//    );
//};
// 14 11 13 08 00 PM
// 01 23 45 67 89 1011
box_Factory.convert_time = function(starttime, endtime){
    var startday = starttime.substr(6,2);
    var endday = endtime.substr(6,2);

    var showday = '';

    if(startday != endday){
        showday = starttime.substr(4,2) + "월 " + starttime.substr(6,2) + "일 " + '~ '
            +  endtime.substr(4,2) + '월 ' + endtime.substr(6,2) + "일";
    }
    else{
        showday = starttime.substr(4,2) + "월 " + starttime.substr(4,2) + "일 "
            + starttime.substr(8,2) + ":" + starttime.substr(10,2) + starttime.substr(12,2) + " ~ "
        + endtime.substr(8,2) + ":" + endtime.substr(10,2) + endtime.substr(12,2);
    }
    return showday;
};

box_Factory.seetreet_convert_time = function(starttime, endtime){
	// 년    	.substr(0,4)
	// 월	.substr(5,2)
	// 일	.substr(8,2)
	// 시 	.substr(11,2)
	// 분	.substr(14,2)
    var startday = starttime.substr(8,2);
    var endday = endtime.substr(8,2);

    var showday = '';

    if(startday != endday){
        showday = starttime.substr(5,2) + "월 " + starttime.substr(8,2) + "일 " + '~ '
            +  endtime.substr(5,2) + '월 ' + endtime.substr(8,2) + "일";
    }
    else{
        showday = starttime.substr(5,2) + "월 " + starttime.substr(8,2) + "일 "
            + starttime.substr(11,2) + ":" + starttime.substr(14,2) + "PM" + " ~ "
        + endtime.substr(11,2) + ":" + endtime.substr(14,2) + "PM";
    }
    return showday;
	
}

