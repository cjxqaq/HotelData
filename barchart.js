
let allData;
let colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
    months=["category","Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sept","Oct","Nov","Dec"];
let data_array=['female','local','USA','SA','EU','MEA','ASIA','businessmen','tourists',
    'DR','agency','AC','u20','20to35','35to55','m55','price','LoS','occupancy','conventions'];
let bar_data=[];
let bar_data1=[];
d3.csv("Assignment3-hotel.csv",function (error,data){
	if(error){
       console.log(error);
   }
    allData=data;
    handle_data();
    draw();
})

function handle_data() {
    for (let i=1;i<=allData.length;++i){
        for (let j=0;j<20;++j){
            data_array[i*20+j]=Number(allData[i-1][data_array[j]]);
        }
    }
}
function draw() {
    let grid_size=50;
    let buckets=9;
    let colorScale = d3.scaleLinear()     
        .domain([0, buckets - 1, 100])  // 定义域
         //domain([0, n, 数据的最大值]);
        .range(colors);
    let svg = d3.select("body").append("svg")
        .attr("height", 25*grid_size)
        .attr("width", 40*grid_size)
        .append("g")
        .attr("transform","translate(10,10)")
        .attr("height", 13*grid_size)
        .attr("width", 21*grid_size)
    let svg1 = d3.select("body")
        .select("svg")
        .append("g")
        .attr("height",10*grid_size)
        .attr("width",30*grid_size)
        .attr("transform", "translate(" + 0 + "," + 650 + ")");
    let svg2 = d3.select("body")
        .select("svg")
        .append("g")
        .attr("height",10*grid_size)
        .attr("width",30*grid_size)
        .attr("transform", "translate(" + 22*grid_size + "," + 0 + ")");
    let month_label = svg.selectAll(".month_label")
        .data(months)
        .enter()
        .append("text")
        .text(function (d){return d;})
        .attr("x",0)
        .attr("y",function (d,i){return grid_size/2 + i * grid_size})
        .style("fill","black");

    let heat_map = svg.selectAll(".heat_map")
        .data(data_array)
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return grid_size+(i%20)*grid_size;})
        .attr("y", function(d, i){ return parseInt(i / 20)*grid_size;})
        .attr("width", grid_size-1)
        .attr("height", grid_size-1)
        .attr("fill", function (d,i){
        if (i>=20)
            {if(d<=100){ if(i%20===19&& d===1) return "#175017"; else return colorScale(d);} else return "#fccece";}
        else{
            if(i===0)return "#e8d7b3";
            if(i<7)return "#fdc742";
            if(i<9)return "#35faf3";
            if(i<12)return "#f64040";
            if(i<16)return "#5867f3";
            if(i<17)return "#bda88d";
            if(i<18)return "#78602f";
            if(i<19)return "#6fefd5";
            return "#f638d6";
        }
            })
        .attr("class","heat_map")
        .on("mouseover",Mover)
        .on("mouseout",Mout)
        .on("click",Mclick);

    let max_y=100;
    let min_y=0;
    let y=d3.scaleLinear()
        .domain([min_y,max_y])
        .range([0,200]);

    svg1.selectAll("rect")
        .data(Array(12).fill(0))
        .enter().append("rect")
        .attr("height",function (d){return y(d);})
        .attr("width","10")
        .attr("x", function(d, i) {return (i * 60) + 2*grid_size})
        .attr("y",function (d){return  300-y(d);});

    svg1.selectAll("text")
        .data(Array(25).fill(0))
        .enter()
        .append("text")
        .text(function (d){return d;})
        .attr("class","bar_text")
        .attr("x", function(d, i) {return 10+(i * 60) + 2*grid_size})
        .attr("y",function (d){return   320-y(d);});

    function Mover(){
        let This = d3.select(this);
        let content = This.html();
        d3.select(this).append("title").text(function (d){return d;});
    }

    function Mclick(){
        let This = d3.select(this);
        let x_position = (This.attr("x") - grid_size) / grid_size;
        let y_position = This.attr("y") / grid_size;
        // 选定月份，画柱形图
        if(1){
            console.log(x_position);

            for (let i=0;i<12;++i){
                bar_data[i]=allData[i][data_array[x_position]];
                bar_data1[i]=allData[i][data_array[x_position]];
            }
            max_y=d3.max(bar_data);
            min_y=d3.min(bar_data);
            if(min_y>1){
                min_y = (max_y-2*min_y);
            }
            else {
                min_y=0;
            }
            y=d3.scaleLinear()
                .domain([min_y,max_y])
                .range([0,200]);
            svg1.selectAll("rect")
                .data(bar_data.slice(0,12))
                .attr("class","bar1")
                .attr("height",function (d){return y(d);})
                .attr("width","50")
                .attr("x", function(d, i) {return (i * 60) + 2*grid_size})
                .attr("y",function (d){return   300-y(d);});
            for (let i=0;i<12;++i){
                bar_data1[i+12]=months[i+1];
            }
            bar_data1[24]="histogram of "+data_array[x_position];
            svg1.selectAll("text")
                .data(bar_data1)
                .text(function (d){return d;})
                .attr("class","bar_text")
                .attr("x", function(d, i) {
                    if (i < 12) {
                        return 10 + (i * 60) + 2 * grid_size;
                    }
                    if (i < 24) {
                        return 10 + ((i - 12) * 60) + 2 * grid_size;
                    }
                    return 240+ 2*grid_size;
                })
                .attr("y",function (d,i){
                    if (i < 12) {
                    return 320-y(d);
                }
                    if (i < 24) {
                        return 340;
                    }
                    return 360;
                });
        }
        //其他数据，画相关饼状图
        if(x_position<16) {
            //首先是收集数据
            let pie_data=[];
            let name_y = data_array[x_position];
            let month = months[y_position];
            let i=0;
            if(x_position===0) {
                pie_data[0]=["male",100-allData[y_position-1][name_y]];
                pie_data[1]=["female",allData[y_position-1][name_y]];
            }
            else if(x_position<7) {
                for (i=1;i<7;++i){
                    pie_data[i-1]=[data_array[i],allData[y_position-1][data_array[i]]];
                }
            }
            else if(x_position<9) {
                for (i=7;i<9;++i){
                    pie_data[i-7]=[data_array[i],allData[y_position-1][data_array[i]]];
                }
            }
            else if(x_position<12) {
                for (i=9;i<12;++i){
                    pie_data[i-9]=[data_array[i],allData[y_position-1][data_array[i]]];
                }
            }
            else if(x_position<16) {
                for (i=12;i<16;++i){
                    pie_data[i-12]=[data_array[i],allData[y_position-1][data_array[i]]];
                }
            }
            console.log(pie_data);
            let pie=d3.pie()
                .value(function (d){return d[1];});
            let backup=pie_data;
            pie_data=pie(pie_data);
            let outer_radius=4*grid_size;
            let inner_radius=0;
            let arc = d3.arc()
                .innerRadius(inner_radius)
                .outerRadius(outer_radius);
            svg2.selectAll("path")
                .data([])
                .exit().remove();
            svg2.selectAll("line")
                .data([])
                .exit().remove();
            svg2.selectAll("text")
                .data([])
                .exit().remove();
            let arcs = svg2.selectAll("g")
                .data(pie_data);
            arcs.enter()
                .append("path")
                .attr("transform","translate("+ 300 +","+ 300 + ")")
                .attr("fill",function (d,i){return colors[i];})
                .attr("d",function (d){return arc(d);});
            arcs.enter().append("text")
                .attr("x",function (d){return 300+arc.centroid(d)[0] * 1.4;})
                .attr("y",function (d){return 300+arc.centroid(d)[1] * 1.4;})
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    if(d.value===0)return '';
                    //计算市场份额和百分比
                    let percent = Number(d.value) / d3.sum(backup, function(d) { return d[1]; }) * 100;
                    //保留一个小数点，末尾加一个百分号返回
                    return percent.toFixed(1) + '%';
                });
            arcs.enter().append('line')
                .attr('stroke', 'black')
                .attr('x1', function(d) { return 300+arc.centroid(d)[0] * 2; })
                .attr('y1', function(d) { return 300+arc.centroid(d)[1] * 2; })
                .attr('x2', function(d) { return 300+arc.centroid(d)[0] * 2.2; })
                .attr('y2', function(d) { return 300+arc.centroid(d)[1] * 2.2; });
            arcs.data(pie_data).enter().append('text')
                .attr("x", function(d) {
                    return 300+arc.centroid(d)[0] * 2.5;})
                .attr("y",function (d){return  y = 300+arc.centroid(d)[1] * 2.5;})
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    return d.data[0];
                });
        }
    }
    function Mout() {

    }
    let category_label = svg.selectAll(".category_label")
        .data(data_array.slice(0,20))
        .enter()
        .append("text")
        .text(function (d){if (d!== "businessmen")return d;else return "business";})
        .attr("class","category_label")
        .attr("x",function (d,i){return grid_size*1.1 + i*grid_size;})
        .attr("y", grid_size/2);
}
