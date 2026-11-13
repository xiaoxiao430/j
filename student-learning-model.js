/* Fictional student learning engine: one raw question source for every view. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HouwaiStudentLearningModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v)),pad=(n,w=2)=>String(n).padStart(w,'0');
 function fail(message){throw new Error(message);}
 function classify(correct,total,pending=false){return pending||!Number.isInteger(total)||total<=0||!Number.isInteger(correct)||correct<0||correct>total?'pending':10*correct>=9*total?'mastered':'reinforce';}
 function aggregate(rows){const expected=rows.length,pending=rows.filter(r=>r.status==='pending').length,mastered=rows.filter(r=>r.status==='mastered').length,reinforce=rows.filter(r=>r.status==='reinforce').length;return {expected,determined:expected-pending,mastered,reinforce,pending,rate:expected?100*mastered/expected:null,class_status:pending||!expected?'pending':10*mastered>=9*expected?'mastered':'reinforce',rows};}
 const text=(chapter,branch,label,prompt,answer,wrong,explanation)=>({chapter,branch,label,q:()=>({prompt,answer,wrong,explanation})});
 const num=(chapter,branch,label,q)=>({chapter,branch,label,q});
 const banks={
 math:[
  num('图形的性质','全等三角形','全等三角形的对应边',n=>({prompt:`已知△ABC≌△DEF，AB=${n}厘米，对应边DE长多少厘米？`,answer:String(n),wrong:String(n+1),explanation:'全等三角形的对应边相等，AB对应DE。'})),
  num('图形的性质','全等三角形','全等三角形的对应角',n=>({prompt:`△ABC≌△DEF，∠A=${30+n%40}°，对应角∠D是多少度？`,answer:String(30+n%40),wrong:String(60+n%40),explanation:'全等三角形的对应角相等。'})),
  text('图形的性质','全等三角形','全等三角形的判定SSS','两个三角形三条边分别对应相等，可以用哪种判定？','SSS','AAA','三边分别对应相等，使用SSS判定。'),
  text('图形的性质','全等三角形','全等三角形的判定SAS','两边及其夹角分别对应相等，使用哪种判定？','SAS','SSA','必须是两边的夹角对应相等。'),
  text('图形的性质','全等三角形','全等三角形的判定ASA','两角及其夹边分别对应相等，使用哪种判定？','ASA','AAA','两角及夹边对应相等，使用ASA。'),
  num('图形的性质','三角形角度','三角形内角和',n=>({prompt:`三角形两内角分别是${40+n%10}°、60°，第三个角是多少度？`,answer:String(80-n%10),wrong:String(90-n%10),explanation:'三角形内角和180°，减去已知两角。'})),
  num('图形的性质','三角形角度','三角形外角',n=>({prompt:`三角形一个外角所对应的两个不相邻内角是30°、${50+n%20}°，该外角是多少度？`,answer:String(80+n%20),wrong:String(20+n%20),explanation:'三角形外角等于两个不相邻内角的和。'})),
  num('图形的性质','等腰三角形','等腰三角形的角',n=>({prompt:`等腰三角形的一个底角为${50+n%20}°，顶角是多少度？`,answer:String(80-2*(n%20)),wrong:String(50+n%20),explanation:'两个底角相等，顶角等于180°减两个底角。'})),
  text('图形的性质','等腰三角形','等腰三角形的对应关系','等腰三角形的两条腰相等，那么两个底角有什么关系？','相等','互补','等边对等角。'),
  num('方程与不等式','一元一次方程','移项求解',n=>({prompt:`解方程：x+${n}=${n+7}。`,answer:'7',wrong:String(n),explanation:'两边同时减去常数，得x=7。'})),
  num('方程与不等式','一元一次方程','系数化为1',n=>({prompt:`解方程：${n}x=${n*3}。`,answer:'3',wrong:String(n*3),explanation:'等式两边同时除以非零系数。'})),
  num('方程与不等式','一元一次方程','去括号解方程',n=>({prompt:`解方程：2(x+${n})=${2*(n+4)}。`,answer:'4',wrong:String(n+4),explanation:'先两边除以2，再减去括号中的常数。'})),
  num('方程与不等式','方程组','加减消元',n=>({prompt:`方程组x+y=${2*n}，x-y=2，求x。`,answer:String(n+1),wrong:String(n-1),explanation:'两式相加得到2x，再除以2。'})),
  num('方程与不等式','方程组','代入消元',n=>({prompt:`已知y=${n}，x+y=${n+8}，求x。`,answer:'8',wrong:String(n+8),explanation:'把y的值代入第二个方程。'})),
  num('方程与不等式','方程应用','实际问题列方程',n=>({prompt:`每本笔记本x元，买2本再付3元包装费，共付${2*n+3}元。x是多少元？`,answer:String(n),wrong:String(n+3),explanation:'列式2x+3=总金额，先减3再除2。'})),
  num('数与式','幂的运算','同底数幂相乘',n=>({prompt:`a²·a³=a的几次幂？（a为非零数）`,answer:'5',wrong:'6',explanation:'同底数幂相乘，底数不变，指数相加。'})),
  text('数与式','幂的运算','同底数幂相除','a⁷÷a³=a的几次幂？（a≠0）','4','10','同底数幂相除，指数相减。'),
  text('数与式','幂的运算','幂的乘方','(a²)³=a的几次幂？','6','5','幂的乘方，指数相乘。'),
  text('数与式','整式运算','完全平方公式','(a+b)²展开后，中间项是什么？','2ab','ab','完全平方公式为a²+2ab+b²。'),
  text('数与式','整式运算','平方差公式','(a+b)(a-b)等于什么？','a²-b²','a²+b²','相同项之和与差相乘，得到两项的平方差。'),
  num('统计与概率','数据分析','平均数',n=>({prompt:`${n}、${n+2}、${n+4}这三个数的平均数是多少？`,answer:String(n+2),wrong:String(n+4),explanation:'总和除以数据个数3。'})),
  num('统计与概率','数据分析','中位数',n=>({prompt:`从小到大排列的数据${n}、${n+2}、${n+9}，中位数是多少？`,answer:String(n+2),wrong:String(n+9),explanation:'奇数个有序数据，中间的数为中位数。'})),
  num('统计与概率','数据分析','极差',n=>({prompt:`一组数据的最大值为${n+9}，最小值为${n}，极差是多少？`,answer:'9',wrong:String(n),explanation:'极差等于最大值减最小值。'})),
  text('统计与概率','随机事件','简单随机事件','一个不透明袋中只有2个红球和2个白球，随机取1球，取到红球的可能性为多少？','1/2','1/4','红球数2除以总球数4。'),
  num('图形与坐标','坐标变换','平移与坐标',n=>({prompt:`点(${n},2)向右平移3个单位，新点的横坐标是多少？`,answer:String(n+3),wrong:String(n-3),explanation:'向右平移，横坐标增加3。'})),
  num('图形与坐标','坐标变换','关于x轴的对称',n=>({prompt:`点(3,${n})关于x轴对称后，纵坐标是多少？`,answer:String(-n),wrong:String(n),explanation:'关于x轴对称，横坐标不变、纵坐标变号。'})),
  num('图形与坐标','坐标变换','关于y轴的对称',n=>({prompt:`点(${n},2)关于y轴对称后，横坐标是多少？`,answer:String(-n),wrong:String(n),explanation:'关于y轴对称，横坐标变号、纵坐标不变。'})),
  text('图形的变化','轴对称','正方形的对称轴','正方形有几条对称轴？','4','2','两条对角线和两组对边中点连线，共4条。'),
  text('图形的变化','轴对称','矩形的对称轴','非正方形的矩形有几条对称轴？','2','4','两组对边中点连线是对称轴。'),
  text('图形的变化','轴对称','等腰三角形的轴对称','等腰三角形顶角的平分线与底边有什么关系？','垂直平分底边','平行于底边','等腰三角形顶角平分线、底边中线和高三线合一。')],
 chinese:[
  text('阅读理解','信息提取','提取关键行动','句子“雨后，小林扶起倒在路边的自行车，擦去泥点后离开。”写了什么主要行动？','扶起并擦净自行车','借走自行车','抓住“扶起、擦去”两个动词概括。'),
  text('阅读理解','信息提取','理解人物品质','小林扶好别人的自行车后悄悄离开，体现了什么品质？','乐于助人','追求表扬','人物行动与不求回报的细节共同说明品质。'),
  text('阅读理解','表达方法','辨认比喻','“路灯像一串珍珠”主要使用什么修辞？','比喻','排比','把路灯比作珍珠。'),
  text('阅读理解','表达方法','辨认拟人','“小草从土里探出头”主要使用什么修辞？','拟人','反问','把小草写成人的动作。'),
  text('写作表达','材料与结构','围绕中心选材','写“我的坚持”，最适合选择哪类材料？','多次练习后克服困难的经历','无关的天气介绍','材料应服务文章中心。'),
  text('写作表达','材料与结构','叙事顺序','按事情发生的先后顺序写，属于哪种叙事顺序？','顺叙','倒叙','顺叙按时间自然推进。'),
  text('写作表达','语言修改','修改重复表达','“大约十人左右”应删去哪一部分避免重复？','大约或左右其中一个','十人','“大约”和“左右”意思重复。'),
  text('写作表达','语言修改','使用具体细节','表现一个人紧张，哪种写法更具体？','手指反复捏着衣角','他非常非常紧张','具体动作比笼统评价更有画面。'),
  text('拓展学习','说明与议论','列数字','用具体数量说明事物特点，是哪种说明方法？','列数字','作比较','具体数量能使说明准确。'),
  text('拓展学习','说明与议论','论点与论据','议论文中用于支持观点的事实和道理叫什么？','论据','标题','论据为论点提供支持。'),
  text('拓展学习','综合运用','联系语境','理解一个词语在文中的含义，首先要结合什么？','上下文','字数多少','语境限定词语在文中的含义。'),
  text('拓展学习','综合运用','概括主旨','概括文章主旨应综合材料和作者的什么？','情感与态度','字体大小','主旨包含主要内容和情感态度。')],
 english:[
  text('词句与语法','现在时','一般现在时','She ___ to school every day. (go/goes)','goes','go','第三人称单数的一般现在时用goes。'),
  text('词句与语法','现在时','现在进行时','Look! They ___ football. (play/are playing)','are playing','play','Look提示正在发生，用现在进行时。'),
  text('词句与语法','过去时','一般过去时','We ___ the museum yesterday. (visit/visited)','visited','visit','yesterday对应一般过去时。'),
  text('词句与语法','比较与数量','比较级','This book is ___ than that one. (long/longer)','longer','long','than前使用比较级。'),
  text('阅读与表达','信息定位','定位地点','Tom is in the library. Where is Tom?','In the library.','In the park.','答案直接来自句子中的地点信息。'),
  text('阅读与表达','信息定位','定位原因','Amy stays home because it rains. Why does Amy stay home?','Because it rains.','Because she runs.','because后的内容说明原因。'),
  text('阅读与表达','交流表达','礼貌请求','哪句更适合礼貌请求帮助？','Could you help me, please?','Help me now!','Could you...please为礼貌请求。'),
  text('阅读与表达','交流表达','顺序表达','叙述步骤时，First后可接什么连接词？','Then','But because','Then表示随后。'),
  text('拓展学习','语法拓展','最高级','三者中“最高的”通常用什么形式？','the tallest','taller','三者或以上比较使用最高级。'),
  text('拓展学习','语法拓展','频率副词','always通常表示什么频率？','总是','从不','always表示总是。'),
  text('拓展学习','写作','主题句','写介绍爱好的段落，主题句应先说明什么？','主要爱好','无关的地址','主题句明确段落中心。'),
  text('拓展学习','写作','检查时态','改写昨天发生的经历时，先检查哪项？','过去时是否一致','字体是否更大','时间语境要求时态一致。')],
 physics:[
  num('运动与测量','速度','速度计算',n=>({prompt:`物体${n}秒行进${n*3}米，平均速度是多少米/秒？`,answer:'3',wrong:String(n),explanation:'速度等于路程除以时间。'})),
  num('运动与测量','速度','路程计算',n=>({prompt:`物体速度2米/秒，运动${n}秒，路程是多少米？`,answer:String(2*n),wrong:String(n+2),explanation:'路程等于速度乘时间。'})),
  text('运动与测量','实验规范','测量读数','使用刻度尺读数时，视线应怎样对准刻度？','与尺面垂直','斜着观察','垂直观察可以减少视差。'),
  text('声与光','声音','声音传播','声音在真空中能否传播？','不能','能','声音的传播需要介质。'),
  text('声与光','声音','音调','声音的音调主要由振动的什么决定？','频率','振幅','振动频率越高，音调越高。'),
  text('声与光','光现象','光的反射','反射角与入射角有什么关系？','相等','互补','光的反射定律规定二者相等。'),
  text('声与光','光现象','平面镜成像','平面镜成像的大小与物体相比怎样？','相等','一定更大','平面镜成等大的虚像。'),
  text('物态与物质','物态变化','熔化','物质由固态变为液态叫什么？','熔化','液化','固态变液态称为熔化。'),
  text('物态与物质','物态变化','液化','水蒸气遇冷成为小水滴属于什么变化？','液化','升华','气态变液态称为液化。'),
  num('物态与物质','密度','密度计算',n=>({prompt:`某物体质量${2*n}克，体积${n}立方厘米，密度是多少克/立方厘米？`,answer:'2',wrong:String(n),explanation:'密度等于质量除以体积。'})),
  text('拓展学习','科学方法','控制变量','探究一个因素的影响时，其他条件应怎样？','保持相同','随意变化','控制变量才能比较该因素的影响。'),
  text('拓展学习','科学方法','重复测量','重复测量求平均值主要为了减小什么？','偶然误差','物体质量','多次测量有助减小偶然误差。')],
 history:[
  text('历史学习方法','史料阅读','区分史料与观点','亲历者当时留下的日记属于什么？','史料','后来随意编造的故事','史料是研究历史的重要材料。'),
  text('历史学习方法','史料阅读','核对来源','引用一段历史材料时，应先核对什么？','出处与形成时间','纸张颜色','来源和时间有助判断材料价值。'),
  text('历史学习方法','时间与空间','排列时间','整理历史事件先后关系，适合使用什么工具？','时间轴','随机名单','时间轴能直观呈现先后。'),
  text('历史学习方法','时间与空间','历史地图','了解事件发生的空间位置，适合查看什么？','对应时期的历史地图','今天的天气图','地图应与所研究时期相匹配。'),
  text('解释与表达','因果分析','区分原因和结果','解释事件发生的背景时，应主要说明什么？','发生前的条件和原因','只写结尾','背景分析关注促成事件的条件。'),
  text('解释与表达','因果分析','多角度分析','解释复杂事件，为什么要比较多种材料？','避免只凭单一角度','为了堆字数','不同材料可互相补充。'),
  text('解释与表达','材料论证','用材料支持观点','提出历史解释后，下一步应做什么？','引用相关材料说明','只重复结论','观点需有相关材料支持。'),
  text('解释与表达','材料论证','区分事实和评价','“某事件发生于某年”主要属于什么？','事实陈述','情绪表达','可核对的时间事件属于事实陈述。'),
  text('拓展学习','专题学习','同类比较','比较两个历史事件时，应先统一什么？','比较角度','字数','统一角度便于说明异同。'),
  text('拓展学习','专题学习','变化与延续','研究长期历史变化时，也应关注什么？','持续存在的因素','只看最后一天','历史包含变化与延续。'),
  text('拓展学习','综合表达','条理表达','历史短答题中，清楚表达多个要点可采用什么方式？','分点说明','不加标点','分点有助清楚呈现逻辑。'),
  text('拓展学习','综合表达','尊重材料范围','材料不足时应怎样表述？','说明结论的局限','随意编补细节','表达应尊重已有材料范围。')],
 geography:[
  text('地图与空间','地图阅读','地图方向','一般地图没有指向标时，通常上方表示什么方向？','北','南','常规地图上北下南，特殊地图看指向标。'),
  text('地图与空间','地图阅读','比例尺','图上1厘米代表实际1千米，实际距离是多少厘米？','100000','1000','1千米等于100000厘米。'),
  text('地图与空间','地形判读','等高线含义','同一条等高线上的各点海拔有什么关系？','相等','都为零','等高线连接海拔相等的点。'),
  text('地图与空间','地形判读','坡度判读','等高距相同的地图中，等高线越密集，坡度通常怎样？','越陡','越缓','等高线密集意味着相同水平距离高差更大。'),
  text('自然环境','天气与气候','区分天气气候','“今天有小雨”描述的是天气还是气候？','天气','气候','短时间大气状况属于天气。'),
  text('自然环境','天气与气候','气候资料','分析一个地方的气候，通常要结合气温和什么？','降水','建筑颜色','气温与降水是基本气候要素。'),
  text('区域学习','区域联系','分析位置','分析区域特点，首先可从哪一方面入手？','地理位置','姓名笔画','位置有助理解区域环境联系。'),
  text('区域学习','区域联系','人地关系','讨论当地生产活动，应同时考虑自然条件和什么？','社会经济条件','只看天气预报','人类活动受多种条件共同影响。'),
  text('拓展学习','实践观察','实地记录','开展地理观察，应怎样记录时间地点？','准确记录','凭记忆随意写','时间地点让观察可以核对。'),
  text('拓展学习','实践观察','使用图表','展示各月降水量，常用哪种图表？','柱状图','随机涂色图','柱状图便于比较各月数量。'),
  text('拓展学习','综合分析','区域比较','比较两个区域应先确定什么？','相同的比较指标','不同的计算单位','使用一致指标与单位。'),
  text('拓展学习','综合分析','因地制宜','“因地制宜”强调做法应符合什么？','当地实际条件','所有地区完全一样','发展安排应适应地方条件。')],
 biology:[
  text('生命结构','细胞','细胞基本结构','细胞中控制物质进出的结构是什么？','细胞膜','细胞核','细胞膜有选择地控制物质进出。'),
  text('生命结构','细胞','遗传信息','细胞中遗传信息主要存在于哪里？','细胞核','细胞壁','细胞核是遗传信息库。'),
  text('生命活动','植物','光合作用','绿色植物进行光合作用通常需要什么光照条件？','有光','完全黑暗','光合作用需要光能。'),
  text('生命活动','植物','蒸腾作用','植物主要通过哪个器官散失水分？','叶','种子','叶片是蒸腾作用的主要器官。'),
  text('生态联系','生态系统','生产者','生态系统中绿色植物通常属于什么？','生产者','分解者','绿色植物可以制造有机物。'),
  text('生态联系','生态系统','食物链','食物链箭头通常指向什么？','取食者','被吃的生物','箭头表示物质和能量流向取食者。'),
  text('科学探究','实验设计','对照实验','设计对照实验应尽量只改变几个因素？','一个','所有','单一变量便于比较影响。'),
  text('科学探究','实验设计','尊重观察','观察结果与猜想不同时，应怎样？','如实记录再分析','改成猜想的数据','科学探究尊重观察事实。'),
  text('拓展学习','生物多样性','保护生境','保护野生生物，首先应重视保护什么？','栖息环境','只保护名字','生境是生物生存的基础。'),
  text('拓展学习','生物多样性','分类依据','生物分类需要依据什么？','共同特征','名称长短','分类依据生物特征和亲缘关系。'),
  text('拓展学习','生活应用','合理膳食','合理膳食应强调什么？','营养均衡','只吃一种食物','食物多样有助营养均衡。'),
  text('拓展学习','生活应用','卫生习惯','接触食物前洗手主要为了什么？','减少污染','改变食物颜色','清洁双手有助减少污染。')],
 morality:[
  text('成长与交往','尊重他人','尊重差异','同学与自己意见不同时，合适的做法是什么？','先倾听再表达','立即嘲笑','尊重他人也包括尊重不同意见。'),
  text('成长与交往','尊重他人','换位思考','换位思考首先需要尝试理解什么？','他人的处境和感受','只强调自己的要求','理解不同处境有助沟通。'),
  text('规则与责任','遵守规则','规则意识','遵守公共规则主要有什么作用？','维护共同秩序','只限制别人','规则保障共同生活。'),
  text('规则与责任','遵守规则','权利义务','享有权利时，对义务应怎样对待？','自觉履行','完全忽略','权利和义务相互联系。'),
  text('规则与责任','承担责任','对承诺负责','已经作出的合理承诺，应怎样处理？','努力兑现并及时沟通','随意忘记','负责任包括兑现承诺和诚实沟通。'),
  text('规则与责任','承担责任','集体协作','小组任务中遇到困难，合适的做法是什么？','沟通并共同解决','只指责同伴','协作需要沟通与分工。'),
  text('学习与生活','理性表达','表达诉求','表达诉求时应采用什么方式？','理性、有序','攻击别人','理性表达尊重自己也尊重他人。'),
  text('学习与生活','理性表达','信息判断','转发一条来源不明的消息前，应先怎样？','核对来源','立即扩散','审慎判断有助减少谣言传播。'),
  text('拓展学习','社会参与','志愿服务','参加志愿服务时应尊重什么？','服务对象的实际需要','只追求拍照','服务应回应实际需要。'),
  text('拓展学习','社会参与','公共利益','公共生活中的个人行为应兼顾什么？','他人与公共利益','只顾自己','共同生活需要兼顾公共利益。'),
  text('拓展学习','综合运用','依法求助','合法权益受到侵害时，应怎样？','依法寻求帮助','以暴制暴','维护权益应采用合法方式。'),
  text('拓展学习','综合运用','反思改进','出现失误后，负责任的做法是什么？','反思并改进','推卸全部责任','承认问题并采取改进行动。')]
 };
 function create(config){
  if(!config||config.synthetic_only!==true||config.schema_version!=='student-learning-demo-v1'||config.dataset?.id!=='student-learning-demo-v1'||config.students?.length!==945)fail('学生演示配置尚未准备。');
  const cfg=clone(config),classes=new Map(cfg.classes.map(c=>[c.id,c])),students=new Map(cfg.students.map(s=>[s.id,s])),subjects=new Map(cfg.subjects.map(s=>[s.id,s]));
  const rawCache=new Map(),trees=new Map(),examCache=new Map(),subjectCache=new Map(),studentCache=new Map();
  function remember(cache,key,value,limit){cache.set(key,value);if(cache.size>limit)cache.delete(cache.keys().next().value);return value;}
  const student=id=>students.get(id)||fail('没有找到这位学生。'),cl=id=>classes.get(id)||fail('没有找到这个班级。'),sub=id=>subjects.get(id)||fail('请选择有效学科。');
  function tree(sid){if(trees.has(sid))return trees.get(sid);sub(sid);const nodes=[],chapters=new Map(),branches=new Map();banks[sid].forEach((b,i)=>{let cp=chapters.get(b.chapter);if(!cp){cp=sid+'-chapter-'+pad(chapters.size+1);chapters.set(b.chapter,cp);nodes.push({id:cp,parent_id:null,label:b.chapter,depth:1,kind:'chapter'});}const bk=b.chapter+'|'+b.branch;let br=branches.get(bk);if(!br){br=sid+'-branch-'+pad(branches.size+1);branches.set(bk,br);nodes.push({id:br,parent_id:cp,label:b.branch,depth:2,kind:'chapter'});}nodes.push({id:sid+'-point-'+pad(i+1),parent_id:br,label:b.label,depth:3,kind:'point'});});trees.set(sid,nodes);return nodes;}
  function points(sid){return tree(sid).filter(n=>n.kind==='point');}
  function lessonId(cid,sid,n){return 'sl-'+cid.slice(-2)+'-'+sid+'-'+pad(n);}
  function parseLesson(id){const m=/^sl-(\d{2})-(math|chinese|english|physics|history|geography|biology|morality)-(\d{2})$/.exec(id||'');if(!m)fail('请选择有效课次。');const cid='sl-class-'+m[1],sid=m[2],n=Number(m[3]);cl(cid);if(n<1||n>sub(sid).lesson_count)fail('请选择有效课次。');return {cid,sid,n};}
  function day(sid,n){const offset=sid==='math'?n-1:Math.floor((n-1)*19/7),week=Math.floor(offset/5),weekday=offset%5;const d=new Date(Date.UTC(2026,9,12+week*7+weekday));return d.toISOString().slice(0,10);}
  function lessonPoints(sid,n){const ps=points(sid),learned=sid==='math'?24:8,start=((n-1)*3)%learned;return [0,1,2].map(i=>ps[(start+i)%learned]);}
  function summary(cid,sid,n){const c=cl(cid),t=c.teachers[sid],ks=lessonPoints(sid,n);return {id:lessonId(cid,sid,n),title:ks[0].label+' · 巩固与应用',date:day(sid,n),class_id:cid,class_name:c.name,teacher_id:t.id,teacher_name:t.name,subject_id:sid,subject_name:sub(sid).name,knowledge_points:ks.map(p=>({id:p.id,label:p.label}))};}
  function questionsFor(cid,sid,n,variant=0,only=null){const ps=lessonPoints(sid,n),out=[];for(let j=0;j<10;j++){const point=ps[j<4?0:j<7?1:2];if(only&&!only.includes(point.id))continue;const index=points(sid).findIndex(p=>p.id===point.id),spec=banks[sid][index].q(n*3+j+variant+3),qid=lessonId(cid,sid,n)+(variant?'-v'+variant:'')+'-q'+pad(j+1);if(spec.wrong===spec.answer)spec.wrong=Number.isFinite(Number(spec.answer))?String(Number(spec.answer)+1):'另一个结论';out.push({id:qid,knowledge_point_id:point.id,knowledge_point_label:point.label,prompt:spec.prompt,answer:spec.answer,wrong:spec.wrong,explanation:spec.explanation});}return out;}
  function assessAnswers(s,questions,answers){const map=new Map((answers||[]).filter(a=>a&&typeof a.question_id==='string').map(a=>[a.question_id,a])),out=questions.map(q=>{const a=map.get(q.id),state=!a?'missing':typeof a.correct!=='boolean'||!['answered','missing','incomplete'].includes(a.status||'answered')?'incomplete':a.status||'answered';return {question_id:q.id,correct:state==='answered'&&a?.correct===true,answer:a?.answer??(a?.correct===true?q.answer:a?.correct===false?q.wrong:''),status:state};});const pending=!questions.length||out.some(a=>a.status!=='answered'),correct=out.filter(a=>a.status==='answered'&&a.correct).length;return {student_id:s.id||s.student_id,name:s.name||s.student_name,correct,total:questions.length,status:classify(correct,questions.length,pending),rate:questions.length?100*correct/questions.length:null,answers:out};}
  function rawLesson(id){if(rawCache.has(id))return rawCache.get(id);const {cid,sid,n}=parseLesson(id),qs=questionsFor(cid,sid,n),roster=cfg.students.filter(s=>s.class_id===cid),rows=roster.map(s=>{
    let correct=7+((s.seat*13+n*7+Number(cid.slice(-2)))%4);
    if(cid==='sl-class-01'&&sid==='math'&&n===1)correct=s.seat<=42?(s.seat%3?9:10):s.seat===43?8:s.seat===44?6:7;
    if(s.seat===3)correct=Math.min(10,6+Math.floor((n-1)/3));
    if(cid==='sl-class-01'&&sid==='math'&&n===1&&s.seat===3)correct=10;
    const missing=s.seat===45&&((sid==='math'&&n===2)||(sid==='math'&&n===20));
    const wrongSet=new Set();for(let j=0;j<10-correct;j++)wrongSet.add((j*3+s.seat+n)%10);
    if(cid==='sl-class-01'&&sid==='math'&&n===1&&s.seat===1){wrongSet.clear();wrongSet.add(5);}
    return assessAnswers(s,qs,qs.map((q,i)=>({question_id:q.id,correct:!missing&&!wrongSet.has(i),answer:missing?'':wrongSet.has(i)?q.wrong:q.answer,status:missing?'missing':'answered'})));
   });
   const first=aggregate(rows),weak=rows.filter(r=>r.status==='reinforce'),rqs=questionsFor(cid,sid,n,40),cqs=questionsFor(cid,sid,n,20);
   const correction=aggregate(weak.map(r=>assessAnswers(student(r.student_id),cqs,cqs.map(q=>({question_id:q.id,correct:true,answer:q.answer,status:'answered'})))));correction.questions=cqs;correction.label='订正记录，不替代首次';
   const retest=aggregate(weak.map(r=>{const s=student(r.student_id);return assessAnswers(s,rqs,rqs.map((q,j)=>({question_id:q.id,correct:s.seat%3!==0||j!==0,answer:s.seat%3===0&&j===0?q.wrong:q.answer,status:'answered'})));}));retest.questions=rqs;retest.label='独立复测';
   const knowledge=lessonPoints(sid,n).map(k=>{const selected=qs.filter(q=>q.knowledge_point_id===k.id);return {id:k.id,label:k.label,...aggregate(rows.map(r=>assessAnswers(student(r.student_id),selected,r.answers)))};});
   const result={lesson:summary(cid,sid,n),class:cl(cid),questions:qs,knowledge_points:lessonPoints(sid,n).map(p=>({id:p.id,label:p.label})),first,knowledge,correction,retest,dataset:cfg.dataset};
   rawCache.set(id,result);if(rawCache.size>24)rawCache.delete(rawCache.keys().next().value);return result;
  }
  function examQuestion(sid,round,j){const ps=points(sid),point=j===9?ps.at(-1):ps[j%Math.min(ps.length,sid==='math'?24:8)],index=ps.findIndex(p=>p.id===point.id),b=banks[sid][index].q(round*10+j+30);if(b.wrong===b.answer)b.wrong=Number.isFinite(Number(b.answer))?String(Number(b.answer)+1):'另一个结论';return {id:'ex-'+round+'-'+sid+'-q'+pad(j+1),knowledge_point_id:point.id,knowledge_point_label:point.label,...b};}
  function examView(studentId,examId){const cacheKey=studentId+'|'+examId;if(examCache.has(cacheKey))return examCache.get(cacheKey);const s=student(studentId),ri=cfg.exam_rounds.findIndex(e=>e.id===examId);if(ri<0)fail('没有找到这次考试。');const round=ri+1;return remember(examCache,cacheKey,{student:s,exam:{...cfg.exam_rounds[ri],period:cfg.dataset.term},subjects:cfg.subjects.map(sb=>{const qs=Array.from({length:10},(_,j)=>{const q=examQuestion(sb.id,round,j),full=(s.seat*7+j*3+ri+Number(s.class_id.slice(-2)))%7>1,score=full?10:j%2?5:0;return {id:q.id,knowledge_point_id:q.knowledge_point_id,prompt:q.prompt,answer:q.answer,student_answer:full?q.answer:q.wrong,correct:full,score,max_score:10,explanation:q.explanation};});const ks=[...new Set(qs.map(q=>q.knowledge_point_id))].map(id=>{const a=qs.filter(q=>q.knowledge_point_id===id),score=a.reduce((v,q)=>v+q.score,0),max=a.reduce((v,q)=>v+q.max_score,0);return {id,label:points(sb.id).find(p=>p.id===id).label,score,max_score:max,score_rate:100*score/max};});return {subject_id:sb.id,subject_name:sb.name,score:qs.reduce((v,q)=>v+q.score,0),max_score:100,knowledge_points:ks,questions:qs};}),dataset:cfg.dataset},24);}
  function subjectView(studentId,subjectId,contextId){const cacheKey=studentId+'|'+subjectId+'|'+(contextId||'');if(subjectCache.has(cacheKey))return subjectCache.get(cacheKey);const s=student(studentId),sb=sub(subjectId),c=cl(s.class_id);let context=null;if(contextId){const bits=parseLesson(contextId);if(bits.cid!==s.class_id||bits.sid!==subjectId)fail('本课不属于这位学生的班级与学科。');}
   const records={},nodes=tree(subjectId),ls=[];
   for(let n=1;n<=sb.lesson_count;n++){const lid=lessonId(s.class_id,subjectId,n),l=rawLesson(lid),row=l.first.rows.find(r=>r.student_id===studentId),rt=l.retest.rows.find(r=>r.student_id===studentId);ls.push(l.lesson);
    for(const kp of l.knowledge){const first=kp.rows.find(r=>r.student_id===studentId),selected=(rt?l.retest.questions:l.questions).filter(q=>q.knowledge_point_id===kp.id),chosen=rt?assessAnswers(s,selected,rt.answers):first;
     records[kp.id]={status:chosen.status==='pending'?'insufficient':chosen.status,correct:chosen.correct,total:chosen.total,rate:chosen.rate,source:rt?'独立复测':'首次独立练习',assessment_kind:rt?'retest':'first',occurred_on:l.lesson.date,lesson_id:lid,question_ids:selected.map(q=>q.id),questions:selected.map(q=>{const a=chosen.answers.find(a=>a.question_id===q.id);return {...q,student_answer:a?.answer||'',correct:a?.correct===true,status:a?.status||'missing'};}),answers:chosen.answers,first:{correct:first.correct,total:first.total,status:first.status},coverage_note:chosen.total+'道有效题目'};
    }
    if(lid===contextId)context={lesson_id:lid,title:l.lesson.title,knowledge_point_ids:l.knowledge_points.map(k=>k.id),questions:l.questions,first:row,correction:l.correction.rows.find(r=>r.student_id===studentId)||null,retest:rt||null,retest_questions:l.retest.questions,knowledge:l.knowledge.map(k=>({...k,rows:undefined,result:k.rows.find(r=>r.student_id===studentId)}))};
   }
   const exams=cfg.exam_rounds.map(e=>{const ex=examView(studentId,e.id),r=ex.subjects.find(x=>x.subject_id===subjectId);return {id:e.id,name:e.name,date:e.date,...r};});
   for(const kp of exams.at(-1).knowledge_points)if(records[kp.id])records[kp.id].exam_score_rate=kp.score_rate;
   for(const p of nodes.filter(n=>n.kind==='point'))if(!records[p.id])records[p.id]={status:'not_learned',correct:null,total:0,rate:null,source:'本阶段尚未学习',occurred_on:null,lesson_id:null,question_ids:[],questions:[],answers:[]};
   // One explicit exam-only reference node; it is never labelled classroom mastery.
   const reference=nodes.filter(n=>n.kind==='point').at(-1),examReference=exams.at(-1).knowledge_points.find(k=>k.id===reference.id);if(records[reference.id].status==='not_learned'&&examReference)records[reference.id]={...records[reference.id],status:'exam_reference',source:'拓展考点参考',exam_score_rate:examReference.score_rate,occurred_on:exams.at(-1).date,coverage_note:'只有考点得分率，不参与课堂掌握统计'};
   const count=countRecords(nodes,records);
   return remember(subjectCache,cacheKey,{student:s,class:c,subject:{id:sb.id,name:sb.name},teacher:c.teachers[subjectId],nodes,records,summary:count,lessons:ls,context,exams,dataset:cfg.dataset},48);
  }
  function countRecords(nodes,records){const ps=nodes.filter(n=>n.kind==='point'),count={mastered:0,reinforce:0,not_learned:0,insufficient:0,exam_reference:0,total_points:ps.length};for(const p of ps){const key=records[p.id]?.status||'not_learned';count[key]=(count[key]||0)+1;}return count;}
  function studentView(id){if(studentCache.has(id))return studentCache.get(id);const s=student(id),views=cfg.subjects.map(sb=>subjectView(id,sb.id)),summaries=views.map(v=>({id:v.subject.id,name:v.subject.name,teacher:v.teacher,...v.summary,latest_lesson_id:v.lessons.at(-1).id,latest_exam:{id:v.exams.at(-1).id,date:v.exams.at(-1).date,score:v.exams.at(-1).score,max_score:100}}));const first=summaries[0];return remember(studentCache,id,{student:s,qualitative:{summary:first.reinforce>0?'已能完成部分课堂任务，仍有知识点需要针对性巩固。':'当前已检测知识点整体较稳，可继续通过迁移练习深化理解。',strength:'愿意参与任务，能够在反馈后尝试改进。',support:'优先处理最近课堂中尚未稳定掌握的知识点，不把单次分数当作固定能力。'},subjects:summaries,exams:cfg.exam_rounds.map(e=>({id:e.id,name:e.name,date:e.date,subjects:examView(id,e.id).subjects.map(x=>({subject_id:x.subject_id,subject_name:x.subject_name,score:x.score,max_score:x.max_score}))})),observations:[{subject_name:'体育',goal:'动作规范与持续参与',observation:s.seat%3?'能按要求参与活动，动作细节继续练习。':'需要在同伴支持下逐步建立运动信心。'},{subject_name:'艺术',goal:'表达想法与完成作品',observation:s.seat%2?'作品表达积极，可加强细节整理。':'能够完成基本任务，鼓励说明自己的创作意图。'}],dataset:cfg.dataset},12);}
  function teacherView(id){const t=cfg.teachers[id];if(!t)return {teacher:null,classes:[],lessons:[],dataset:cfg.dataset};const cs=cfg.classes.filter(c=>Object.values(c.teachers).some(x=>x.id===id)),lessons=cs.flatMap(c=>cfg.subjects.filter(s=>c.teachers[s.id].id===id).flatMap(s=>Array.from({length:s.lesson_count},(_,i)=>{const l=rawLesson(lessonId(c.id,s.id,i+1));return {...l.lesson,mastered:l.first.mastered,reinforce:l.first.reinforce,pending:l.first.pending,expected:l.first.expected};})));return {teacher:t,classes:cs,lessons,dataset:cfg.dataset};}
  const catalog=()=>({dataset:cfg.dataset,classes:cfg.classes,subjects:cfg.subjects,totals:{students:945,classes:21,lessons:1596},featured:{teacher_id:'teacher-001',class_id:'sl-class-01',lesson_id:'sl-01-math-01',student_id:'stu-demo-0001'},students:cfg.students});
  function resolve(path,q={}){let m;const scoped=cfg.classes.filter(c=>(!q.campus||c.campus===q.campus)&&(!q.department||c.department===q.department)&&(!q.grade||c.grade===q.grade)&&(!q.class_id||c.id===q.class_id));if(path==='/student-learning/catalog'){const v=catalog(),ids=new Set(scoped.map(c=>c.id));return {...v,classes:scoped,students:v.students.filter(s=>ids.has(s.class_id)),totals:{classes:scoped.length,students:scoped.length*45,lessons:scoped.length*76},featured:ids.has(v.featured.class_id)?v.featured:null};}if(!scoped.length)fail('当前组织范围没有这批学生学情。');const detailClass=/^\/student-learning\/lessons\/sl-(\d{2})-/.exec(path);if(detailClass&&!scoped.some(c=>c.id==='sl-class-'+detailClass[1]))fail('课次不在当前组织范围。');const detailStudent=/^\/students\/(stu-demo-\d{4})/.exec(path);if(detailStudent&&!scoped.some(c=>c.id===student(detailStudent[1]).class_id))fail('学生不在当前组织范围。');if((m=/^\/student-learning\/teachers\/([^/]+)$/.exec(path))){const v=teacherView(m[1]),allowed=new Set(scoped.map(c=>c.id));return {...v,classes:v.classes.filter(c=>allowed.has(c.id)),lessons:v.lessons.filter(l=>allowed.has(l.class_id))};}if((m=/^\/student-learning\/lessons\/([^/]+)$/.exec(path)))return rawLesson(m[1]);if((m=/^\/students\/([^/]+)\/subjects\/([^/]+)$/.exec(path)))return subjectView(m[1],m[2],q.lesson_id||undefined);if((m=/^\/students\/([^/]+)\/exams\/([^/]+)$/.exec(path)))return examView(m[1],m[2]);if((m=/^\/students\/([^/]+)$/.exec(path)))return studentView(m[1]);fail('没有这个学生学情接口。');}
  return {catalog:()=>clone(catalog()),teacher:id=>clone(teacherView(id)),lesson:id=>clone(rawLesson(id)),student:id=>clone(studentView(id)),subject:(a,b,c)=>clone(subjectView(a,b,c)),exam:(a,b)=>clone(examView(a,b)),resolve:(p,q)=>clone(resolve(p,q)),classify,summarize:aggregate,assessAnswers,countRecords,practiceQuestions:(id,kps,variant=80)=>{const {cid,sid,n}=parseLesson(id);return questionsFor(cid,sid,n,variant,kps);},config:()=>clone(cfg)};
 }
 return {create,init:create,classify,summarize:aggregate};
});
