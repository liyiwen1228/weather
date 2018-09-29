
	let weather;
	let city;
	$.ajax({
		type:'get',
		url:'https://www.toutiao.com/stream/widget/local_weather/data/?city',
		dataType:'jsonp',
		success:function(obj){
			weather=obj.data.weather;
			console.log(weather);
			update(weather);
		}
	});
	$.ajax({
		type:'get',
		url:`https://www.toutiao.com/stream/widget/local_weather/city/`,
		dataType:'jsonp',
		success:function(obj){
			city=obj.data;
			console.log(city);
			forCity(city);
		}
	});

	function update(weather){
		let higtweather=[];
		let lowweather=[];
		$(".recent .scroll1").html("<div id='main'></div>");
		$(".hours .scroll").html("");
		$("#city").html(weather.city_name);
		$(".kong>h3").html(weather.quality_level);
		$(".du #tem").html(weather.current_temperature+"°");
		$(".du #con").html(weather.current_condition);
		$(".today .top1 .temperature i:first").html(weather.dat_high_temperature);
		$(".today .top1 .temperature i:last").html(weather.dat_low_temperature);
		$(".today .bottom .weather").html(weather.current_condition);
		$(".today .bottom .img").css("background",`url(img/${weather.dat_weather_icon_id}.png)no-repeat center/cover`);
		$(".tomorrow .top1 .temperature i:first").html(weather.tomorrow_high_temperature);
		$(".tomorrow .top1 .temperature i:last").html(weather.tomorrow_low_temperature);
		$(".tomorrow .bottom .weather").html(weather.tomorrow_condition);
		$(".tomorrow .bottom .img").css("background",`url(img/${weather.tomorrow_weather_icon_id}.png)no-repeat center/cover`);
		//循环一天的天气状况
		$(weather.hourly_forecast).each(function(i,v){
			
			let str=`
				<div class="now">
					<p class="now_time">${v.hour.padStart(2,"0")}:00</p>
					<div class="now_img"></div>
					<p class="now_temp">${v.temperature}°</p>
				</div>
			`;
			
			$(".hours .scroll").append(str);
			$(".now").eq(i).find(".now_img").css("background",`url(img/${v.weather_icon_id}.png)no-repeat center/cover`);
		});
		// console.log(weather.forecast_list);
		$(weather.forecast_list).each(function(i,v){
			higtweather.push(v.high_temperature);
			lowweather.push(v.low_temperature);
			let str=`
				<div class="week">
					<div class="week_date">
						<span>${v.date.split('-')[1]}</span>
						<span>/</span>
						<span>${v.date.split('-')[2]}</span>
					</div>
					<div class="week_weaH">${v.condition.split('转')[0]}</div>
					<div class="week_imgH"></div>
					
					<div class="week_weaL">${v.condition.includes("转")?v.condition.split('转')[1]:v.condition}</div>
					<div class="week_imgL"></div>
					<div class="win">${v.wind_direction}</div>
					<div class="level">${v.wind_level}级</div>
				</div>
			`;
			// <div class="high">${v.high_temperature}°</div>
			// 		<div class="low">${v.low_temperature}°</div>
			$(".recent .scroll1").append(str);
		});
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            // title: {
            //     text: 'ECharts 入门示例'
            // },
            // tooltip: {},
            // legend: {
            //     data:['销量']
            // },
            xAxis: {
            	show:false,
            	 boundaryGap: false,
                data : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16']
            },
            yAxis: 
        	{
	            type : 'value',
	            show:false,
	            axisLabel: {
		            formatter: '{value} °C'
		        }
        	},
    		
    		  grid: {
		        left:"0",   
		        top: '20%',
		        bottom: '-10%',
		        containLabel: true
		    },
            series: [
            {
	                name: '最高气温',
	                type: 'line',
	                smooth: 0.5,
	                itemStyle:{normal:{label:{show:true},lineStyle:{color:"#ffb74d"}}},
	                data: higtweather
            	},
            	{
	                name: '最低气温',
	                type: 'line',
	                smooth: 0.5,
	   				itemStyle:{normal:{label:{show:true,position:"bottom"},lineStyle:{color:"#4ec3e7"}}},
	                data: lowweather
            	}
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		
	}
	function forCity(city){
		let k=0;
		$.each(city,function(i,v){
			let str=`<p class="hot_title_sight">${i}</p><ul class="hot_sights"></ul>`;
			let c_str;
			$(".hot_city").append(str);
			// console.log(v);
			$.each(v,function(index,val){
				// console.log(index);
				c_str=`<li>${index}</li>`;
				$(".hot_city .hot_sights").eq(k).append(c_str);
			});
			k++;

			
		});
	}

$("#city").click(function(){
	$("#location").slideDown();
});	
$(".sreach_left input").focus(function(){
	$("#btn").html("搜索");
});

$("#btn").click(function(){
	if($("#btn").html()=="取消"){
		$("#location").slideUp();
	}else{
		
		$("#btn").html("取消");

			for(let i in city){
				for(let k in city[i]){
					if(k==$(".sreach_left input").val()){
						ajaxs($(".sreach_left input").val());
						$(".sreach_left input").val("");
						$("#location").slideUp();
						return;
					}
				}
			}

		alert("没有找到该城市");
		
	}
});
function ajaxs(cityname){
	$.ajax({
		type:'get',
		url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=${cityname}`,
		dataType:'jsonp',
		success:function(obj){
			update(obj.data.weather);
			console.log(obj.data.weather);
		}
	});
}
window.onload=function(){
	$(".hot_citys li").click(function(){
		ajaxs($(this).html());
		$("#location").slideUp();
	});
	$(".hot_sights li").click(function(){
		console.log($(this).html());
		ajaxs($(this).html());
		$("#location").slideUp();
	});
	// console.log($(".hot_sights li"));
}	
			
		
				
				
		
	





	


