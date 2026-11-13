/* Independent fictional rosters for the existing 1,000-teacher classroom examples.
 * Source first/retest counts are preserved; no cross-teacher student identity is inferred. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HouwaiLegacyLearningModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x)),pad=n=>String(n).padStart(2,'0');
 const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return h>>>0;};
 const Q=(prompt,answer,wrong,explanation='',kind='short_answer')=>({prompt,answer:String(answer),wrong:String(wrong),explanation,kind});
 const U=(topic,principle,...specs)=>({topic,principle,specs});
 const O=(topic,...specs)=>U(topic,'按具体动作、过程和作品要求观察，记录完成情况及需要继续练习的地方。',...specs.map(([p,a,w])=>Q(p,a,w,'依据任务要求观察实际动作或作品，不按印象评分。','observation')));
 const banks={
 '数学':{
  primary:[
   U('长方形周长','长方形周长等于长与宽的和乘2。',n=>Q(`长方形长${n+6}厘米、宽${n+2}厘米，周长多少厘米？`,4*n+16,2*n+8,'将长与宽相加，再乘2。','calculation'),n=>Q(`长方形周长${4*n+20}厘米，长${n+7}厘米，宽多少厘米？`,n+3,n+13,'先用周长除以2，再减去长。','calculation'),n=>Q(`一块长方形菜地长${n+8}米、宽${n+1}米，围一圈要多少米篱笆？`,4*n+18,2*n+9,'围一圈的长度就是周长。','calculation')),
   U('分数的认识','分母表示平均分的份数，分子表示取出的份数。',n=>Q(`把蛋糕平均分成${n+3}份，取1份，用分数表示。`,`1/${n+3}`,`${n+3}/1`),n=>Q(`把纸平均分成${n+4}份，涂其中2份，用分数表示。`,`2/${n+4}`,`1/${n+4}`),Q('同样大的两张纸，各取一半和四分之一，哪份大？','一半','四分之一','同样的整体中，二分之一大于四分之一。')),
   U('乘除关系','乘数相乘得到积，积除以一个非零乘数得到另一个乘数。',n=>Q(`${n+2}×4=${4*(n+2)}，${4*(n+2)}÷4等于多少？`,n+2,4*n,'根据乘除互逆关系求另一个乘数。','calculation'),n=>Q(`${n+3}盒铅笔，每盒6支，共有多少支？`,6*(n+3),n+9,'用盒数乘每盒支数。','calculation'),n=>Q(`${5*(n+2)}颗糖，每袋5颗，能装几袋？`,n+2,5*n,'总数除以每份数得到份数。','calculation')),
   U('数量关系图','先找总量、每份量和份数，再根据图示关系列式。',n=>Q(`线段图中甲有${n+5}本书，乙比甲多3本。乙有多少本？`,n+8,n+2,'乙的数量等于甲加上多出的3本。','calculation'),n=>Q(`线段图中两段一样长，每段${n+4}米，总长多少米？`,2*n+8,n+6,'两段相同长度相加。','calculation'),n=>Q(`一条${3*(n+2)}米长线段平均分成3段，每段多少米？`,n+2,3*n,'总长除以段数。','calculation'))],
  middle:[
   U('有理数运算','同号相加取同号并加绝对值；异号运算先辨别符号。',n=>Q(`计算：(-${n+2})+${n+7}。`,5,-5,'正数的绝对值更大，差为5。','calculation'),n=>Q(`计算：(-${n+1})×3。`,-3*(n+1),3*(n+1),'负数乘正数得负数。','calculation'),n=>Q(`计算：${n+8}-(-2)。`,n+10,n+6,'减去负数等于加上它的相反数。','calculation')),
   U('整式化简','合并同类项时系数相加，字母及指数保持不变。',n=>Q(`化简：${n+2}x+3x。`,`${n+5}x`,`${n+5}x²`),n=>Q(`化简：2(a+${n})-a。`,`a+${2*n}`,`a+${n}`,'去括号后合并同类项。'),n=>Q(`当x=2时，${n}x+1的值是多少？`,2*n+1,n+3,'将x=2代入表达式。','calculation')),
   U('一元一次方程','等式两边作相同运算，保持等式成立。',n=>Q(`解方程：x+${n}=${n+7}。`,7,n+7,'等式两边同时减去常数。','calculation'),n=>Q(`解方程：3x=${3*(n+2)}。`,n+2,3*n+6,'等式两边同时除以3。','calculation'),n=>Q(`解方程：2(x+${n})=${2*n+8}。`,4,n+4,'先除以2，再减去括号内常数。','calculation')),
   U('方程应用','设未知数后，根据题目中的相等关系列方程。',n=>Q(`每本练习本x元，买3本共付${3*(n+1)}元，x等于多少？`,n+1,3*n+3,'列3x=总价，再除以3。','calculation'),n=>Q(`甲比乙多4人，共${2*n+12}人。乙有多少人？`,n+4,n+8,'设乙为x人，列x+(x+4)=总人数。','calculation'),n=>Q(`一根绳剪去${n}米后剩8米，原长多少米？`,n+8,8-n,'原长减去剪掉的长度等于8米。','calculation'))],
  high:[
   U('函数性质','结合定义域判断单调性、奇偶性及函数值。',n=>Q(`函数f(x)=2x+${n}在实数范围内递增还是递减？`,'递增','递减','一次函数斜率2为正。'),n=>Q(`函数f(x)=x²，f(${n})是多少？`,n*n,2*n,'将自变量代入平方表达式。','calculation'),Q('函数f(x)=x³在实数范围内是奇函数还是偶函数？','奇函数','偶函数','f(-x)=-f(x)。')),
   U('集合与命题','按元素是否满足条件判断集合关系，并区分充分和必要。',n=>Q(`集合A={1,2,${n+4}}，元素2是否属于A？`,'属于','不属于'),Q('A={1,2}，B={1,2,3}，A与B的关系是什么？','A是B的子集','B是A的子集'),Q('命题“所有正方形都是矩形”的逆命题是否为真？','假','真','矩形不一定四边相等。')),
   U('指数函数','指数函数底数大于1时递增，0与1之间时递减。',n=>Q(`计算2的${n%4+1}次方。`,2**(n%4+1),2*(n%4+2),'指数表示同一底数连乘。','calculation'),Q('函数y=2ˣ在实数范围内递增还是递减？','递增','递减'),Q('函数y=(1/2)ˣ在实数范围内递增还是递减？','递减','递增')),
   U('函数模型','用自变量与因变量的关系建立模型，再代入求值。',n=>Q(`出租车起步费用8元，超过起步里程后每千米2元，额外行驶${n}千米，共多少元？`,8+2*n,8+n,'费用模型y=8+2x。','calculation'),n=>Q(`水箱原有${n+20}升水，每分钟放2升，5分钟后剩多少升？`,n+10,n+15,'水量模型y=原有水量-2t。','calculation'),n=>Q(`一次函数y=3x+2，当x=${n}时y是多少？`,3*n+2,n+5,'代入自变量得到函数值。','calculation'))]},
 '语文':{
  primary:[
   U('观察与写话','写清观察对象、具体动作及发生的变化。',Q('“小猫蹲下身子，盯着滚动的毛线球。”观察对象是什么？','小猫','毛衣'),Q('“叶子慢慢变黄了。”哪个词写出了变化过程？','慢慢','叶子'),Q('把“花很美”写得更具体，补充哪类内容？','花的颜色、形状等细节','只重复三个美字')),
   U('朗读与停顿','按词语和意思停顿，不拆开完整词语。',Q('“春天的花园真美”中，“花园”两个字之间应不应该停顿？','不应该','应该'),Q('朗读问句“你准备好了吗？”时，应注意什么语气？','询问语气','命令语气'),Q('逗号处朗读通常怎样处理？','作短暂停顿','把两个字拆开')),
   U('人物描写','用外貌、动作、语言和神态写出人物特点。',Q('“他紧紧攥着衣角”属于哪种描写？','动作描写','景物描写'),Q('“她笑得眼睛弯弯”主要写了什么？','神态','天气'),Q('表现人物认真，哪个细节更具体？','逐字检查作业','只写他很好')),
   U('整理阅读线索','结合时间、地点和事件先后整理阅读内容。',Q('“先洗手，再吃饭”中先做什么？','洗手','吃饭'),Q('“清晨出发，傍晚回家”按什么线索组织？','时间','颜色'),Q('整理故事起因、经过和结果，适合采用什么方式？','事件顺序图','随机抄句子'))],
  middle:[
   U('记叙文线索','寻找反复出现、串联事件的人、物或情感。',Q('故事反复写“那把旧雨伞”，它串起借伞、还伞和送别，这把伞起什么作用？','串联事件的线索','无关背景'),Q('文章从童年写到青年，再写成年，主要按什么线索组织？','时间线索','颜色变化'),Q('判断文章线索时，应重点看什么？','贯穿多个事件的共同内容','只看最长的一句话')),
   U('人物形象与依据','用人物的具体言行及处境支持形象判断。',Q('人物把仅有的干粮分给同伴，能支持哪种判断？','关心同伴','只顾自己'),Q('评价人物“坚持”，更应该引用什么？','多次失败后继续尝试的行为','无关的景色'),Q('人物说“我再试一次”，并重新练习，表现了什么？','不轻易放弃','随意应付')),
   U('说明顺序','根据材料组织方式区分时间、空间和逻辑顺序。',Q('从校门写到操场，再写到教学楼，主要采用什么顺序？','空间顺序','时间顺序'),Q('依次介绍制造前、制造中、制造后的步骤，主要采用什么顺序？','时间顺序','由主到次'),Q('先说明现象，再解释原因，主要采用什么顺序？','逻辑顺序','游览顺序')),
   U('段落结构','找出中心句及各句之间的总分、并列或递进关系。',Q('首句概括“图书馆服务很完善”，后面分述借阅、咨询和活动，属于什么结构？','总分','倒叙'),Q('段落末句总结前面三个例子的共同特点，主要起什么作用？','归纳总结','另起无关话题'),Q('两句分别介绍南北两侧景观，地位相同，是什么关系？','并列','转折'))],
  high:[
   U('论证结构','区分观点、材料和推理，说明材料如何支持观点。',Q('文章先提出主张，再用三个事例说明，事例的作用是什么？','支持主张','替代标题'),Q('“因此”通常提示前后哪类关系？','推论或因果','纯粹时间先后'),Q('论证中列出反方意见再回应，有什么作用？','澄清争议并加强论证','让所有观点相同')),
   U('文言语境推断','结合上下文、句法位置和已知词义推断文意。',Q('“学而时习之”中“之”指代什么？','所学内容','天气'),Q('“择其善者而从之”中“从”在语境中是什么意思？','学习、效法','跟踪走路'),Q('遇到一词多义，应优先结合什么判断？','上下文及句法','现代最常见意思')),
   U('意象与情感','结合意象、语境和表达方式理解情感，不孤立套标签。',Q('诗中“孤舟”与“独行”相照应，可能强化什么感受？','孤独感','热闹感'),Q('判断“月”在某首诗中的作用，应结合什么？','具体诗句和语境','所有诗都只表达思乡'),Q('诗句以明亮春景写相聚，通常更适合支持哪类情感？','欣悦','恐惧')),
   U('材料作文立意','从材料的核心矛盾和关系提炼观点，不脱离材料。',Q('材料写团队成员各有所长，合作完成任务，适合提炼哪种观点？','协作与互补','只要个人能力'),Q('多则材料作文先做什么更稳妥？','找出共同点及差异','只抄第一则'),Q('论点确定后选择事例的首要标准是什么？','与论点相关并能说明问题','篇幅越长越好'))]},
 '英语':{
  primary:[
   U('My school','Read the sentence and identify rooms and locations.',n=>Q(`The library is on Floor ${n+1}. Where is the library?`,`On Floor ${n+1}.`,`On Floor ${n+2}.`),Q('We read books in the library. Where do we read books?','In the library.','On the playground.'),Q('The playground is next to the gym. What is next to the gym?','The playground.','The kitchen.')),
   U('Daily routines','Use the present simple to describe daily routines.',Q('She ___ breakfast at seven every day. (has/have)','has','have'),Q('I brush my teeth before bed. What do I do before bed?','Brush my teeth.','Play football.'),Q('He goes to school at eight. When does he go to school?','At eight.','At ten.')),
   U('Reading aloud','Read sounds and punctuation accurately.',Q('Which word has the /æ/ sound: cat or cake?','cat','cake'),Q('“Are you ready?” is a question. Should the reader use a questioning tone?','Yes.','No.'),Q('Read the words “red pen”. Which word names a colour?','red','pen')),
   U('My family','Use family relationships and pronouns in context.',Q('My mother’s other daughter is my ___.','sister','uncle'),Q('This is my father. ___ is a teacher. (He/She)','He','She'),Q('My grandfather on my father’s side is my father’s ___.','father','son'))],
  middle:[
   U('Reading for details','Locate the exact person, time, place or reason in a short passage.',n=>Q(`The club starts at ${n+2} o’clock. When does the club start?`,`At ${n+2} o’clock.`,`At ${n+3} o’clock.`),Q('Amy stays home because it rains. Why does Amy stay home?','Because it rains.','Because she is running.'),Q('Tom puts the blue bag under the desk. Where is the bag?','Under the desk.','On the chair.')),
   U('Past tense','Use the simple past for completed actions in a past time.',Q('We ___ the museum yesterday. (visited/visit)','visited','visit'),Q('She ___ to the park last Sunday. (went/goes)','went','goes'),Q('They did not ___ late yesterday. (arrive/arrived)','arrive','arrived')),
   U('Giving directions','Follow location words and a clear sequence of directions.',Q('Go straight, then turn left. Which way do you turn?','Left.','Right.'),Q('The bank is opposite the school. Where is the bank?','Opposite the school.','Inside the school.'),Q('Which is a polite request for directions?','Could you tell me the way to the library?','Give me the road now!')),
   U('Writing a paragraph','A paragraph needs a clear topic and supporting details.',Q('Which sentence best starts a paragraph about a favourite sport?','My favourite sport is basketball.','My address is on this card.'),Q('Which word can introduce the next step after “First”?','Then','Although because'),Q('A paragraph describes reading every evening. Which detail supports it?','I read for twenty minutes before bed.','The bus is blue.'))],
  high:[
   U('Argument and evidence','Distinguish a claim from information that supports it.',Q('Claim: trees cool streets. Which detail supports it?','Measured temperatures are lower under tree shade.','The road has a name.'),Q('A writer gives a survey result after a claim. What is its role?','Supporting evidence.','A greeting.'),Q('Which statement is a claim rather than a measurement?','Schools should provide more reading time.','The session lasted twenty minutes.')),
   U('Relative clauses','Choose a relative word that matches its antecedent and role.',Q('The teacher ___ helped me is kind. (who/which)','who','which'),Q('This is the book ___ I borrowed. (which/where)','which','where'),Q('The girl ___ father is a doctor is here. (whose/who)','whose','who')),
   U('Reading inference','Make an inference supported by details in the text.',Q('Leo checks the train time twice and runs to the station. What is he likely worried about?','Missing the train.','Choosing a paint colour.'),Q('Mia puts on a coat and takes an umbrella. What weather does she likely expect?','Cold or rainy weather.','A hot dry day with no rain.'),Q('A speaker thanks the team repeatedly after a successful event. How does the speaker likely feel?','Grateful.','Indifferent.')),
   U('Writing a summary','Keep the main idea, omit minor examples and use your own wording.',Q('A passage explains three ways to save water at home. What belongs in its summary?','The main water-saving methods.','Every person’s full address.'),Q('Should a summary add an opinion absent from the passage?','No.','Yes.'),Q('A summary is much shorter than the original. What should remain?','Its central ideas.','Every repeated example.'))]},
 '物理':{
  primary:[
   U('科学观察：影子','影子的位置与光源、遮挡物有关，观察时控制其他条件。',Q('手电筒照向不透明玩具，玩具后方出现什么？','影子','彩虹'),Q('同一盏灯下移动玩具，影子是否可能变化？','可能','一定不变'),Q('探究光源位置怎样影响影子，首先保持什么不变？','遮挡物的位置','同时随意移动所有物体')),
   U('声音的产生','声音由物体振动产生。',Q('拨动橡皮筋发声时，橡皮筋在做什么运动？','振动','完全静止'),Q('用手按住正在响的音叉，声音减弱说明了什么？','振动受到了限制','颜色改变了声音'),Q('比较两次敲鼓的声音，应先保证什么？','比较条件清楚','同时改变所有条件')),
   U('磁铁与材料','磁铁能吸引铁等部分材料，不能吸引所有金属。',Q('铁钉和塑料片中，哪一个通常能被磁铁吸引？','铁钉','塑料片'),Q('磁铁可以吸引所有金属吗？','不可以','可以'),Q('检验材料是否被磁铁吸引，应怎样做？','逐件靠近并记录','只凭颜色判断')),
   U('安全用电观察','观察电器时遵守安全规则，实验使用安全低压器材。',Q('手潮湿时能不能触碰正在使用的插座？','不能','能'),Q('发现电线外皮破损，应该怎样做？','停止使用并请成人处理','用手摸裸露处'),Q('小学生电路实验应使用哪类电源？','安全低压电池','直接接入家用插座'))],
  middle:[
   U('长度与时间测量','先看量程与分度值，视线正对刻度并记录单位。',n=>Q(`物体左端在${n}厘米处、右端在${n+7}厘米处，长度多少厘米？`,7,n+7,'长度等于末刻度减初刻度。','calculation'),Q('刻度尺最小一格是1毫米，它的分度值是多少？','1毫米','1厘米'),Q('读刻度时视线应怎样？','正对刻度','斜着观察')),
   U('速度与运动','平均速度等于路程除以时间。',n=>Q(`物体${n+2}秒行进${3*(n+2)}米，平均速度多少米/秒？`,3,n+2,'v=s/t。','calculation'),n=>Q(`物体速度2米/秒，运动${n+3}秒，路程多少米？`,2*(n+3),n+5,'s=vt。','calculation'),n=>Q(`行进${4*(n+1)}米用时${n+1}秒，速度多少米/秒？`,4,n+1,'用路程除以时间。','calculation')),
   U('声音的特性','频率影响音调，振幅影响响度，音色与发声体有关。',Q('振动频率越高，音调通常怎样？','越高','越低'),Q('鼓面振幅增大，响度通常怎样？','增大','减小'),Q('辨认钢琴和小提琴相同音高的声音，主要依据什么？','音色','演奏者身高')),
   U('光的反射','反射角等于入射角，角度相对于法线测量。',n=>Q(`入射角为${n+20}°，反射角多少度？`,n+20,70-n,'反射角等于入射角。','calculation'),Q('入射角从镜面还是法线开始量？','法线','镜面'),Q('平面镜中像的大小与物体相比怎样？','相等','一定更大'))],
  high:[
   U('运动学图像','速度—时间图像斜率表示加速度，面积表示位移。',n=>Q(`物体速度从0增加到${2*(n+1)}米/秒，历时${n+1}秒，加速度多少米/秒²？`,2,n+1,'a=Δv/Δt。','calculation'),n=>Q(`物体以3米/秒匀速运动${n+2}秒，位移多少米？`,3*(n+2),n+5,'v-t图线与时间轴围成的面积为位移。','calculation'),Q('v-t图中一条水平直线表示怎样的运动？','速度不变','加速度不断增大')),
   U('力的分析','先明确研究对象，再画真实受力，不把运动方向当作力。',Q('静止在水平桌面上的书，竖直方向受到哪两个力？','重力和支持力','重力和前进力'),Q('画受力图前首先要明确什么？','研究对象','答案长度'),Q('物体向右运动，是否一定存在向右的合力？','不一定','一定')),
   U('牛顿定律','合力决定加速度，F=ma；作用力与反作用力作用在不同物体上。',n=>Q(`质量2千克的物体受合力${2*(n+1)}牛，加速度多少米/秒²？`,n+1,2*n+2,'a=F/m。','calculation'),Q('合力为零时，物体可能怎样运动？','静止或匀速直线运动','一定加速'),Q('作用力和反作用力是否作用在同一个物体上？','不是','是')),
   U('实验误差','区分随机误差和系统误差，正确记录有效数字与测量条件。',Q('多次测量取平均值通常可以减小哪类误差？','随机误差','所有系统误差'),Q('仪器零点偏移且未校正，属于哪类误差来源？','系统误差来源','计算机字体问题'),Q('测量结果与预想不同时，应怎样记录？','如实记录再分析','改成预想数值'))]},
 '化学':{
  primary:[
   U('科学观察：溶解','观察物质在水中的变化，不用尝味等不安全方式判断。',Q('盐加入水后逐渐看不见颗粒，适合描述为什么现象？','盐逐渐溶解','盐消失不存在了'),Q('比较冷水和温水中溶解快慢，应保持什么相同？','盐的量和水量','同时改变所有条件'),Q('不认识的实验材料能不能直接尝味？','不能','能')),
   U('材料的变化','记录变化前后的特征，区分形状改变与产生新物质的变化。',Q('把纸剪成小片，主要改变了什么？','形状和大小','变成了金属'),Q('冰变成水后，还可通过降温变回什么？','冰','铁'),Q('比较材料变化前后，应先记录什么？','颜色、状态等可观察特征','只写喜欢或不喜欢')),
   U('水的净化体验','过滤可分离部分不溶杂质，过滤后的水不能直接认定可饮用。',Q('用滤纸分离水中的细沙，利用什么操作？','过滤','加颜色'),Q('过滤后的水看起来清澈，能不能直接认定可饮用？','不能','能'),Q('滤纸破损时，过滤效果可能怎样？','杂质可能漏过','一定更好')),
   U('身边的空气','空气是多种气体组成的混合物，占据空间。',Q('把空杯倒扣入水中，杯中阻挡水进入的主要是什么？','空气','真空'),Q('空气是一种纯物质还是混合物？','混合物','纯物质'),Q('观察空气存在可以采用什么方式？','挤压装有空气的袋子','只看空气颜色'))],
  middle:[
   U('物质变化','有无新物质生成是区分物理变化与化学变化的依据。',Q('冰融化成水属于什么变化？','物理变化','化学变化'),Q('铁生锈产生了新物质，属于什么变化？','化学变化','只改变形状'),Q('判断是否为化学变化，关键看什么？','是否生成新物质','是否移动位置')),
   U('空气组成','空气主要由氮气和氧气组成，体积分数与质量分数不混用。',Q('空气中体积分数最高的气体是什么？','氮气','氧气'),Q('氧气约占空气总体积的多少？','约五分之一','约五分之四'),Q('空气是纯净物还是混合物？','混合物','纯净物')),
   U('分子与原子','化学变化中分子可以改变，原子种类通常保持不变。',Q('水蒸发时，水分子本身是否变成其他分子？','没有','变成氧分子'),Q('化学变化前后，通常保持不变的粒子种类是什么？','原子种类','分子种类'),Q('闻到花香说明分子具有怎样的特点？','不断运动','完全静止')),
   U('水的组成','电解水生成氢气和氧气，体积比约为2:1。',Q('电解水产生的两种气体是什么？','氢气和氧气','氮气和氧气'),Q('相同条件下电解水产生氢气和氧气的体积比约是多少？','2:1','1:2'),Q('水是由哪两种元素组成？','氢元素和氧元素','氮元素和氧元素'))],
  high:[
   U('物质的量','物质的量、质量和摩尔质量通过n=m/M联系。',n=>Q(`某物质质量${18*(n+1)}克，摩尔质量18克/摩尔，物质的量多少摩尔？`,n+1,18*(n+1),'n=m/M。','calculation'),Q('物质的量的国际单位名称是什么？','摩尔','千克'),Q('物质的量计算中，同一符号M表示什么？','摩尔质量','溶液总体积')),
   U('离子反应','离子方程式保留实际参加反应的离子，并满足电荷与原子守恒。',Q('稀盐酸与氢氧化钠溶液反应的核心离子过程是什么？','H⁺与OH⁻生成水','Na⁺与Cl⁻生成气体'),Q('书写离子方程式，除原子守恒还要检查什么？','电荷守恒','字符数相同'),Q('旁观离子应在净离子方程式中怎样处理？','约去','重复写两次')),
   U('氧化还原','化合价升高对应失电子，降低对应得电子。',Q('元素化合价升高，通常对应什么过程？','失电子、被氧化','得电子、被还原'),Q('氧化剂在反应中得到电子，化合价怎样变化？','降低','升高'),Q('是否发生氧化还原反应，应检查什么？','元素化合价是否改变','是否一定冒泡')),
   U('实验安全','按规范使用药品与仪器，异常情况及时停止并报告。',Q('加热试管时，管口应该朝向人吗？','不应该','应该'),Q('闻气体气味时，应采用哪种方式？','用手轻扇少量气体','把鼻子直接贴近瓶口'),Q('取药品时，剩余药品通常应怎样处理？','按实验要求回收处理','直接放回原瓶'))]},
 '历史':{
  primary:[
   U('家乡的老照片','从照片的时间、地点与可观察内容了解过去，区分观察和猜测。',Q('看老照片时，要了解拍摄年代应先找什么？','日期标注及可靠说明','图片大小'),Q('老照片中有马车，可以直接推断所有家庭都有马车吗？','不可以','可以'),Q('比较同一地点的新旧照片，适合观察什么？','建筑与生活方式变化','只比较照片文件名')),
   U('时间线与生活','将有时间的信息按先后顺序排列。',Q('2020年、2022年、2021年应按什么顺序排？','2020、2021、2022','2022、2020、2021'),Q('家乡建桥、修路、通车三个事件，时间线应依据什么？','实际发生日期','哪个标题好看'),Q('不知道某事件日期时，应怎样标注？','日期待查','随意补一个年份')),
   U('文物小观察','先看实物特征与来源，再讨论用途。',Q('观察一件旧陶罐，应先记录什么？','形状、材料和纹饰','猜主人姓名'),Q('判断文物用途需要结合什么？','形制、出土信息和资料','只看照片颜色'),Q('接触文物或展品前，应先做什么？','遵守展馆规定','直接拿起来')),
   U('节日与传统','结合活动、来源和不同地区做法理解传统。',Q('了解端午节习俗，可以重点调查什么？','当地活动及其来源','同学鞋码'),Q('不同地区过同一节日的做法一定完全相同吗？','不一定','一定'),Q('记录长辈讲述的节日故事，应注明什么？','讲述者关系和记录时间','编成官方定论'))],
  middle:[
   U('史料与依据','核对材料来源与时代，用材料支持历史解释。',Q('亲历者当时留下的日记属于什么？','一类史料','纯粹现代想象'),Q('引用历史材料前应先核对什么？','来源和形成时间','字体颜色'),Q('不同材料说法不一致时，合适的做法是什么？','比较来源和背景','随便删掉一条')),
   U('秦汉大一统','从制度、交通与文化措施理解统一国家治理。',Q('秦朝在地方主要推行什么制度？','郡县制','现代议会制'),Q('统一文字和度量衡有助于什么？','交流与行政管理','让各地单位更不同'),Q('评价一项统一措施，应结合什么？','具体背景和影响','只看个人喜好')),
   U('历史时间线','时间线帮助呈现事件先后，不直接等同于因果。',Q('公元前221年与公元前202年，哪一个更早？','公元前221年','公元前202年'),Q('两事件在时间上先后发生，能否仅据此认定因果？','不能','能'),Q('整理朝代更替时，首先应核对什么？','年代及先后顺序','标题字数')),
   U('制度的演变','比较制度适用背景、内容及影响，注意时期差异。',Q('比较两个时期的选官制度，应统一什么？','比较角度','强行写相同结论'),Q('制度变化的原因应结合什么分析？','社会条件与治理需要','只看制度名称'),Q('同一制度在不同阶段的运行是否可能有差异？','可能','绝不可能'))],
  high:[
   U('史料辨析','将史料放回形成背景，比较作者立场与材料用途。',Q('史料中的作者立场会不会影响材料表述？','可能影响','绝不影响'),Q('研究一个事件时，比较不同来源材料的目的是什么？','互相补充并辨别差异','让字数越多越好'),Q('后人回忆与当时档案出现差异，应怎样处理？','核对形成时间与背景','直接认为两者都无用')),
   U('国家治理','比较治理结构、政策和社会条件，避免脱离时期套用概念。',Q('分析治理政策，应同时考虑实施背景和什么？','实际影响','文档长度'),Q('中央与地方关系是国家治理的哪类问题？','权力配置','天气变化'),Q('跨时期比较治理制度时，首先应明确什么？','比较范围与标准','默认条件完全相同')),
   U('文明交流','从传播路径、接受和本地变化理解文明互动。',Q('外来技术传播后在当地改进，体现什么？','交流与本地化','完全没有联系'),Q('研究丝绸之路交流，应关注什么？','商品、技术与文化往来','只看一件商品价格'),Q('文明交流是否一定是单向传播？','不一定','一定')),
   U('近代转型','从经济、社会、思想和制度多方面分析转型。',Q('分析工业化影响，只看机器数量是否充分？','不充分','充分'),Q('研究近代社会转型，适合结合哪些方面？','经济、社会与制度变化','只看某个人情绪'),Q('讨论转型进程，应注意什么？','不同地区和群体的差异','默认每个地区完全同步'))]},
 '地理':{
  primary:[
   U('校园方向观察','按统一参照物说明方向，记录路线。',Q('太阳从东方升起，面向东方时左手大致指向哪里？','北','南'),Q('画校园路线图时，应先说明什么？','方向和主要地点','同学姓名'),Q('描述从校门到图书馆的路线，应写清什么？','转向和经过的地点','只说很近')),
   U('天气记录','在相同时间和地点记录天气，区分观察与感受。',Q('比较一周气温，温度计读数应带什么？','单位和日期','只写数字'),Q('“今天下午有小雨”描述的是天气还是长期气候？','天气','长期气候'),Q('一周天气记录中漏了一天，应怎样标注？','未记录','写成0度')),
   U('家乡地形观察','结合高低起伏、河流和土地利用观察地形。',Q('地表起伏大、山岭相连，通常更接近什么地形？','山地','平原'),Q('记录河流位置时，可以参照什么？','道路和建筑等固定地点','当天心情'),Q('只看一张近景照片能否确定整个地区地形？','不能','能')),
   U('生活与环境','从具体生活行为理解资源使用与环境保护。',Q('离开空教室前关灯，有助于什么？','节约用电','增加照明负担'),Q('比较不同包装的垃圾量，应采用什么方式？','按同一标准记录','凭印象决定'),Q('观察校园环境问题，应先记录什么？','具体地点和现象','只写不好看'))],
  middle:[
   U('地图方向与比例尺','根据指向标和比例尺读图，距离单位要一致。',Q('一般地图没有特殊指向标时，上方通常是什么方向？','北','南'),Q('图上1厘米表示实地1千米，比例尺分母是多少？','100000','1000'),Q('同一张地图上，图上距离增大一倍，实际距离怎样？','增大一倍','不变')),
   U('中国区域位置','从纬度、海陆位置和邻近地区描述区域。',Q('我国东部濒临哪个大洋？','太平洋','大西洋'),Q('描述区域位置时，“位于某河以南”使用了哪类信息？','相对位置','人口总数'),Q('分析一个区域特点，应先明确什么？','位置与范围','字体大小')),
   U('天气与气候','天气是短时状况，气候描述长期特征。',Q('“今天最高气温25℃”属于什么信息？','天气','长期气候'),Q('分析气候，通常结合气温与什么？','降水','路灯颜色'),Q('只用一天的下雨情况能否判断全年气候？','不能','能')),
   U('地形与等高线','等高线连接相同海拔点，等高线疏密反映坡度。',Q('同一条等高线上的点，海拔有什么关系？','相等','都为0'),Q('等高距相同时，等高线越密，坡度通常怎样？','越陡','越缓'),Q('海拔与相对高度是否是同一个概念？','不是','是'))],
  high:[
   U('地球运动与时间','区分自转、公转及其地理意义。',Q('地球自转是形成昼夜交替的主要原因吗？','是','不是'),Q('地球公转结合地轴倾斜，主要带来什么变化？','季节变化','每小时潮汐完全相同'),Q('地方时差与什么直接相关？','经度差','山体颜色')),
   U('大气过程与气候','从热量、水分和环流条件解释天气气候。',Q('空气受热上升，一般与什么过程有关？','对流','岩浆冷却'),Q('山地迎风坡抬升湿润空气，通常有利于什么？','形成降水','让所有水汽消失'),Q('分析气候成因时，只看纬度是否充分？','不充分','充分')),
   U('人口与城市空间','结合区位、交通与功能联系理解城市。',Q('通勤距离和交通条件会影响什么？','居住与就业空间选择','地球自转速度'),Q('分析城市商业中心位置，应关注什么？','交通与服务范围','只看建筑颜色'),Q('人口总量相同的城市，人口密度一定相同吗？','不一定','一定')),
   U('区域可持续发展','结合资源、产业、环境和居民需要比较发展方案。',Q('评价产业项目，应同时看经济收益与什么？','环境和社会影响','口号字数'),Q('资源型地区转型，重要方向之一是什么？','拓展产业并治理环境','只扩大单一资源消耗'),Q('比较两地发展指标时，应先统一什么？','单位和统计期间','不同计算范围'))]},
 '生物':{
  primary:[
   U('植物生长观察','连续记录植物生长条件和可观察变化。',Q('比较有光和遮光条件下植物生长，应保持什么相同？','植物种类和浇水条件','同时改变所有因素'),Q('记录幼苗高度应写清什么？','日期和长度单位','只写高了'),Q('叶片颜色变化，应怎样记录？','如实描述并持续观察','改成预期颜色')),
   U('动物与栖息环境','根据动物特征和生活需要观察栖息环境。',Q('鱼通常依靠什么从水中获取氧气？','鳃','羽毛'),Q('观察小动物，应怎样做？','尽量不破坏栖息环境','随意抓走所有个体'),Q('判断动物生活需要，应结合什么？','食物、水和适宜环境','只看名字')),
   U('卫生与均衡饮食','联系日常习惯理解健康，不用单一食物代替均衡饮食。',Q('接触食物前洗手，主要为了什么？','减少污染','改变食物颜色'),Q('合理饮食应强调什么？','食物多样和营养均衡','只吃一种食物'),Q('规律运动与充足休息是否都重要？','都重要','只运动不用休息')),
   U('校园生物与环境','观察生物与环境的联系，记录真实发现。',Q('树荫下与阳光下的土壤湿度可能不同，观察时应记录什么？','位置、时间与湿润程度','只写喜欢哪里'),Q('清除所有落叶是否一定对校园生态最好？','不一定','一定'),Q('连续观察同一地点，有助于发现什么？','随时间出现的变化','所有地方都一样'))],
  middle:[
   U('细胞结构与功能','从结构对应功能，注意动物细胞和植物细胞的差异。',Q('控制物质进出细胞的主要结构是什么？','细胞膜','细胞核'),Q('真核细胞的遗传信息主要存在于哪里？','细胞核','细胞壁'),Q('与动物细胞相比，典型植物细胞常见什么外部结构？','细胞壁','羽毛')),
   U('光合作用与植物','理解绿色植物制造有机物及环境条件的作用。',Q('光合作用通常需要什么能源？','光能','声能'),Q('光合作用吸收的主要气体是什么？','二氧化碳','氮气'),Q('研究光照对光合作用的影响，应主要改变什么？','光照条件','所有条件一起改变')),
   U('呼吸与健康','联系气体交换及日常习惯理解呼吸系统。',Q('人体与外界进行气体交换的主要器官是什么？','肺','胃'),Q('肺泡数量多，有助于什么？','增大气体交换面积','把食物磨碎'),Q('吸烟产生的烟雾会影响呼吸健康吗？','会','不会')),
   U('生态系统与食物链','区分生产者、消费者与分解者，理解能量流动。',Q('绿色植物通常属于生态系统中的什么角色？','生产者','消费者'),Q('食物链箭头一般指向什么？','取食者','被吃的生物'),Q('生态系统中的物质循环是否需要分解者参与？','需要','不需要'))],
  high:[
   U('细胞分子与结构','用分子组成和细胞结构解释生命活动。',Q('蛋白质的基本组成单位是什么？','氨基酸','核苷酸'),Q('DNA的基本组成单位是什么？','脱氧核苷酸','葡萄糖'),Q('细胞膜的选择透过性与其结构和成分有关吗？','有关','无关')),
   U('细胞代谢与能量','区分酶、物质转化与能量供应。',Q('酶在反应中主要发挥什么作用？','降低反应所需的活化能','凭空产生物质'),Q('ATP通常直接参与什么？','细胞生命活动的能量供应','把遗传信息变成颜色'),Q('温度过高可能使部分酶活性怎样变化？','降低甚至失活','无限增大')),
   U('遗传信息与变异','区分基因、染色体与性状，明确条件和适用范围。',Q('有性生殖后代的遗传物质通常来自哪里？','双亲','只来自生活环境'),Q('基因与性状之间是否总是一对一且不受环境影响？','不是','是'),Q('减数分裂对维持有性生殖物种染色体数目稳定有什么作用？','使配子染色体数目减半','使所有细胞数目翻倍')),
   U('生物进化与适应','以种群和环境关系理解适应及自然选择。',Q('自然选择作用于个体表现，进化通常在什么层面体现？','种群','某个器官颜色'),Q('环境改变后，所有个体会同时按需要产生相同变异吗？','不会','会'),Q('某种适应性特征的意义应放在什么条件下讨论？','具体环境','任何环境都完全一样'))]},
 '政治':{
  primary:[
   U('班级规则与协作','从具体情境理解规则和共同生活。',Q('小组轮流发言时，合适的做法是什么？','倾听并按顺序表达','一直打断别人'),Q('制定班级规则，应考虑什么？','共同需要及公平','只方便一个人'),Q('游戏前明确规则有什么帮助？','减少争执','保证所有人获胜')),
   U('关心他人与表达','尊重不同感受，用具体方式表达关心。',Q('同学遇到困难时，合适的第一步是什么？','了解他需要什么帮助','马上嘲笑'),Q('表达不同意见时，应怎样说？','说明想法并尊重对方','只用侮辱词'),Q('别人不愿被公开谈论的事情，应怎样处理？','尊重隐私','随意转发')),
   U('承担任务与兑现承诺','明确答应的任务，及时说明进展和困难。',Q('答应整理图书后遇到困难，应该怎样做？','及时沟通并寻求帮助','完全不理会'),Q('小组分工后，每个人需要知道什么？','自己的任务与时间','只知道组名'),Q('发现自己做错了，负责任的做法是什么？','承认并改进','推给别人')),
   U('公共生活与节约','联系具体行为理解公共秩序和资源使用。',Q('在图书馆阅读，应注意什么？','保持安静并爱护书籍','大声追逐'),Q('排队时应怎样做？','遵守次序','随意插队'),Q('节约用水可以从什么做起？','用后关紧水龙头','让水一直流'))],
  middle:[
   U('权利义务与责任','在情境中理解权利和义务相互联系。',Q('享有权利的同时，对义务应怎样对待？','自觉履行','完全忽略'),Q('参与集体活动时，责任要求包括什么？','完成合理分工并沟通困难','只享受结果'),Q('表达诉求时应兼顾什么？','他人权利与公共秩序','只顾自己')),
   U('规则意识与依法求助','遵守合理规则，遇到侵害通过合法途径求助。',Q('发现个人权益可能受到侵害时，合适的做法是什么？','记录情况并依法求助','立即以暴制暴'),Q('公共规则主要保障什么？','共同生活秩序','只限制某个人'),Q('对规则有疑问时，应怎样表达？','理性说明并通过适当程序提出','破坏公共设施')),
   U('尊重差异与集体协作','区分事实与感受，通过沟通解决分歧。',Q('同学提出不同意见时，首先适合做什么？','听清理由','立刻贴标签'),Q('团队能力互补时，怎样分工更合理？','结合能力、意愿和任务需要','只看谁声音大'),Q('冲突后澄清事实，主要有什么作用？','减少误解','保证自己永远正确')),
   U('网络信息与理性表达','核对来源，尊重隐私，理性表达。',Q('来源不明的消息在转发前应先做什么？','核对来源','立刻扩散'),Q('能不能随意公开同学的家庭资料？','不能','能'),Q('讨论争议时，应围绕什么？','事实与具体理由','人身攻击'))],
  high:[
   U('经济生活与理性选择','结合资源约束、需求和成本讨论经济选择。',Q('预算有限时做消费选择，应先明确什么？','需要和可用预算','只看广告热度'),Q('比较两个方案的成本，应采用什么口径？','相同范围与期间','故意漏掉一种成本'),Q('市场信息不完整时，决定前适合做什么？','补充信息并比较','默认没有风险')),
   U('公共参与与责任','理解参与程序、公共利益和责任边界。',Q('提出公共事务建议，应包含什么？','具体问题、事实与可行做法','只批评某个人'),Q('公共决策讨论中，不同群体意见是否值得了解？','值得','不值得'),Q('参与协商时，理性表达需要什么？','说明理由并听取回应','拒绝任何不同意见')),
   U('逻辑思维与论证','区分事实、观点和推理，检查概念与推论。',Q('“因为先后发生，所以必然有因果”这种推理是否可靠？','不一定可靠','一定可靠'),Q('一段论证中核心概念前后应怎样？','保持清楚一致','随意换意思'),Q('反驳一个观点，应优先针对什么？','理由与推理','发言者外貌')),
   U('文化理解与社会发展','结合背景、实践和多样性理解文化及发展。',Q('不同地区文化习惯有差异，讨论时应怎样？','结合背景并尊重差异','直接判定高低'),Q('传统文化进入当代生活，需要考虑什么？','实际需要与合适表达','只能原样复制一切'),Q('评价社会发展项目，应关注什么？','人的需要和实际影响','只看宣传词'))]},
 '体育':{
  primary:[
   O('跑跳协调',['沿直线慢跑后双脚起跳并平稳落地。','跑动连贯、屈膝缓冲、保持平衡。','落地僵直且失去平衡。'],['听口令完成小步跑与停止。','能听信号调整并安全停止。','未听信号继续冲跑。'],['连续跨过地面三条标记线。','抬脚清楚、步伐连贯、无碰撞。','绊线后仍未调整。']),
   O('投掷与安全',['站在线后向空旷目标区投沙包。','方向明确，等待前方安全后投掷。','有人进入投掷区仍投出。'],['完成侧身挥臂投掷动作。','身体转动与挥臂协调。','只甩手腕且失去控制。'],['投掷后按口令取回器材。','确认所有人停止后再取回。','未经口令穿越目标区。']),
   O('球感练习',['原地连续拍球并控制反弹高度。','手指手腕配合，球在可控范围。','球频繁远离身体。'],['双手抛接球后保持站稳。','眼睛跟球、接球有缓冲。','闭眼接球且身体失衡。'],['绕过标记点运球。','能控球转向并避开同伴。','只追球而忽略周围。']),
   O('合作游戏规则',['接力前说明交接区域。','交接位置明确、遵守顺序。','随意冲入其他跑道。'],['和同伴完成双人传球。','先确认对方准备好再传。','对方未注意仍大力传球。'],['游戏结束整理器材。','按分工安全收纳。','把器材留在通道。'])],
  middle:[
   O('耐久跑配速',['完成分段慢跑并记录主观感受。','前段不过快，能按目标调整节奏。','一开始冲刺后无法保持。'],['跑动中观察呼吸与步频配合。','呼吸自然，步频相对稳定。','持续憋气或明显失衡。'],['跑后进行低强度整理。','逐步减速并完成舒缓动作。','立即躺倒不做整理。']),
   O('篮球传接球',['双手胸前传球给准备好的同伴。','蹬伸协调，出球方向稳定。','手型松散，方向失控。'],['接球时屈臂缓冲。','迎球后有缓冲并保持平衡。','僵硬顶球且频繁脱手。'],['移动中观察空位后传球。','先观察再选择合适传球时机。','只盯球而忽略同伴。']),
   O('运动损伤预防',['运动前完成与主项相关的热身。','从低强度到中等强度逐步准备。','未热身直接高强度冲刺。'],['出现持续疼痛时作出处理选择。','停止相关动作并向老师说明。','继续忍痛重复动作。'],['检查活动区域和鞋带。','排除障碍并固定鞋带。','发现障碍仍在原地冲跑。']),
   O('体能练习设计',['为一周体能练习写出主项和恢复日。','负荷与休息交替，目标清楚。','天天最高强度且无恢复。'],['根据练后感受调整下一次强度。','结合疲劳情况进行适当调整。','不看身体反应一律加量。'],['记录一次练习的内容与感受。','项目、时间和身体感受记录完整。','只写已经做过。'])],
  high:[
   O('体能计划',['设计兼顾力量、耐力与恢复的周计划。','负荷安排有层次，并留恢复时间。','每天都安排极限负荷。'],['根据基线能力设置阶段目标。','目标具体且与起点相匹配。','忽略起点统一定极端目标。'],['依据疲劳与训练完成情况修订计划。','调整有记录且说明原因。','无视疲劳持续加量。']),
   O('排球战术',['接发球前与队友确认站位和分工。','覆盖区域明确，有相互呼应。','多人同时放弃来球区域。'],['完成垫球后及时准备下一次移动。','手型稳定、脚步跟进。','垫球后停在原地不观察。'],['小组练习中说明进攻组织选择。','结合来球和队友位置作出选择。','未观察位置直接随意击球。']),
   O('运动负荷',['记录训练中的强度感受和恢复情况。','记录具体，并用于下次安排。','只以出汗多少作唯一判断。'],['安排高强度主练后的恢复活动。','逐步降低强度并观察身体反应。','突然停止后仍继续憋气。'],['在异常不适时调整负荷。','停止并及时向负责老师说明。','以完成数量为由继续硬撑。']),
   O('体育健康知识',['向同伴说明热身、主练与整理的作用。','能结合本次练习讲清过程。','认为只要热身就不需整理。'],['模拟运动场景中的安全提醒。','提醒具体、及时，能引导停止危险动作。','只在事后批评。'],['选择适合自己当前状态的运动安排。','能解释起点、目标和安全要求。','只模仿他人的极限成绩。'])]},
 '艺术':{
  primary:[
   O('色彩与形状',['用三种颜色表现一处校园景物。','颜色与形状能表达选定景物。','未围绕选定景物组织画面。'],['比较同一形状的两种配色。','能说明冷暖或明暗带来的感受。','只重复好看而无具体说明。'],['用圆形、方形组合一幅画。','形状组合完整并有主要对象。','图形散乱且未完成主体。']),
   O('节奏模仿',['听四拍节奏后拍手模仿。','能保持基本拍点和长短变化。','拍点持续偏离且未调整。'],['与同伴交替完成节奏。','能等待信号并准确接续。','抢拍且未听同伴。'],['用身边安全材料表现强弱变化。','强弱区别清楚且控制音量。','只追求最大声音。']),
   O('生活中的纹样',['从身边物品找出重复纹样。','能指出重复单元及排列方式。','只说颜色而未识别重复。'],['设计一条重复边饰。','单元与重复关系清楚。','没有连续或重复关系。'],['说明纹样放在何种物品上。','用途和位置有具体想法。','无法说明应用位置。']),
   O('作品欣赏表达',['选择一幅作品说出看见的两个细节。','观察具体，能指向画面位置。','只写喜欢而无细节。'],['说明作品带来的感受。','能联系色彩、形状或声音。','感受与作品无关。'],['倾听同伴的不同理解。','能复述并尊重不同表达。','用嘲笑否定其他看法。'])],
  middle:[
   O('构图与视觉中心',['为主题海报安排主体与文字位置。','视觉中心明确，阅读顺序清楚。','主体与标题相互遮挡。'],['比较两种主体大小方案。','能说明比例与留白的影响。','只说大一点却无理由。'],['依据反馈调整画面疏密。','修改对应具体画面问题。','没有针对反馈作调整。']),
   O('旋律与节奏',['模唱短旋律并保持基本节拍。','旋律走向与节奏清楚。','持续跑拍且未跟随提示。'],['用敲击表现同一旋律的强弱。','强弱与乐句有联系。','每拍任意用力。'],['小组演奏时观察进入信号。','能协调起止并听见同伴。','各自开始且不看信号。']),
   O('传统纹样',['观察传统纹样并画出主要结构。','能呈现对称或重复关系。','只照搬一个局部且无法说明。'],['基于传统纹样完成当代用品设计。','保留可识别元素并说明用途。','贴图后与用品功能无关。'],['介绍参考来源与自己的改动。','来源清楚，改动具体。','把全部参考说成原创。']),
   O('作品依据赏析',['对一件作品提出一个判断并说明画面依据。','能指向色彩、结构或材料细节。','只有笼统赞美。'],['比较两件作品的表达方式。','比较角度一致且有具体细节。','只按价格高低判断。'],['依据同伴反馈修订赏析。','保留自己的解释并补充相关细节。','删除所有不同意见。'])],
  high:[
   O('艺术形式分析',['分析作品中线条、色彩与空间的关系。','形式分析指向具体位置和效果。','只列术语而不联系作品。'],['比较两种媒介的表现限制。','能联系材料与表达目的。','默认所有媒介效果相同。'],['用草图呈现一项形式调整。','调整与表达意图有清楚联系。','调整后无法说明目的。']),
   O('审美表达',['以一种媒介表达选定主题。','表达意图清楚，形式选择有依据。','只堆素材而缺少主题联系。'],['说明作品中一处有意保留的差异。','能解释差异带来的感受。','把所有失误都称为风格。'],['回应观众的两种不同解读。','能说明自己的意图并理解差异。','直接否定观众。']),
   O('创作与评论',['提交创作过程及作品版本。','能看到修改内容和选择理由。','只有最终图而无法说明过程。'],['对同伴作品给出可执行建议。','建议指向具体部分及改法。','只写继续加油。'],['说明参考资源与原创部分。','来源与本人贡献区分清楚。','将引用作品全部署为本人原创。']),
   O('文化语境',['把作品放在相应文化背景中介绍。','背景与作品细节有明确联系。','只贴无关历史名词。'],['比较同一符号在不同语境中的含义。','说明具体语境与差异。','默认所有地区含义相同。'],['设计面向当代观众的作品说明。','表达清楚并尊重文化来源。','用标签替代具体解释。'])]}
 };
 function classify(c,t,pending=false){return pending||!Number.isInteger(c)||!Number.isInteger(t)||t<=0||c<0||c>t?'pending':10*c>=9*t?'mastered':'reinforce';}
 function phase(person){return String(person.department||'').includes('小学')?'primary':String(person.department||'').includes('高中')?'high':'middle';}
 function selectUnit(person,lesson,index){const subject=person.subject==='道德与法治'?'政治':person.subject,sets=banks[subject];if(!sets)throw Error('这门学科尚无课堂样板。');const units=sets[phase(person)],source=String(lesson.analysis?.knowledge_points?.[0]||lesson.title?.split(' · ')[0]||'').trim(),found=units.find(u=>u.topic===source)||units.find(u=>source.length>=2&&u.topic.startsWith(source)),unit=found||units[Math.floor(((lesson.sequence||index+1)-1)/4)%units.length];return {unit,subject,adjusted:unit.topic!==source,matched:!!found,source};}
 function shuffle(items,seed){const out=[...items];let state=seed||1;for(let i=out.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
 function create(input){
  if(!input||!input.person||!Array.isArray(input.lessons)||!Array.isArray(input.name_pool))throw Error('请提供教师、课次和已批准的虚拟姓名池。');
  const person=copy(input.person),lessons=copy(input.lessons),pool=[...new Set(input.name_pool.filter(n=>typeof n==='string'&&n.trim()).map(n=>n.trim()))];
  if(!person.id||pool.length<30)throw Error('教师编号和30个以上不同虚拟姓名不可缺少。');
  if(lessons.some(l=>l.teacher_id!==person.id)||new Set(lessons.map(l=>l.id)).size!==lessons.length)throw Error('课次须属于同一教师且编号不可重复。');
  const first=lessons[0],classId=first?.class_id||person.assignments?.[0]?.class_id||'demo-class-'+person.id;
  if(lessons.some(l=>l.class_id!==classId))throw Error('该入口只呈现本教师同一旧演示班级。');
  const klass={id:classId,name:first?.class_name||person.assignments?.[0]?.class_name||'课堂样板班',campus:person.campus,department:person.department,teacher_id:person.id,namespace:'legacy-classroom-review-v20'};
  const oldIds=[...new Set(lessons.flatMap(l=>l.expected_student_ids||l.first?.rows?.map(r=>r.student_id)||[]))];if(oldIds.length&&oldIds.length!==30)throw Error('旧课堂样板须保留固定30人名单。');
  const names=shuffle(pool,hash(person.id+'|'+classId)),students=Array.from({length:30},(_,i)=>({id:'legacy-student-'+person.id+'-'+pad(i+1),student_id:'legacy-student-'+person.id+'-'+pad(i+1),legacy_student_id:oldIds[i]||'SIM-'+pad(i+1),name:names[i],seat:i+1,class_id:classId,class_name:klass.name,teacher_id:person.id,subject:person.subject,avatar:{initial:names[i].slice(-1),color:['#E8F2FF','#E5F5F0','#F3EDFF','#FFF2DE'][i%4]}})),byId=new Map(students.map(s=>[s.id,s])),byOld=new Map(students.map(s=>[s.legacy_student_id,s])),byLesson=new Map(lessons.map((l,i)=>[l.id,{l,index:i,...selectUnit(person,l,i)}])),cache=new Map();
  const kind=person.subject==='体育'||person.subject==='艺术'?'observation':'academic';
  const notice='姓名与作答均为虚拟演示；每位教师旧班单独编号，不与其他教师或八年级945人样板自动合并；不改变正式评价。';
  function metadata(entry){const {l,unit,adjusted}=entry;return{id:l.id,title:adjusted?unit.topic+' · 实践'+pad(l.sequence||entry.index+1):l.title,source_title:l.title,date:l.date,subject:person.subject,class_id:classId,class_name:klass.name,teacher_id:person.id,topic:unit.topic,kind,topic_adjusted:adjusted,topic_note:adjusted?(entry.matched?'原演示主题名称已补齐；保留原统计，仅作演示。':'原演示主题与当前学科不一致，题面按'+person.subject+'重新安排；保留原统计，仅作演示。'):'',learning_goals:adjusted?[unit.principle]:copy(l.learning_goals||[unit.principle])};}
  function makeQuestions(entry,stage,count){const {l,unit}=entry,base=hash(l.id+'|'+stage)%9+1,point='legacy-point-'+person.id+'-'+hash(unit.topic).toString(36);return Array.from({length:count},(_,j)=>{const offset=stage==='retest'?1:0,spec=unit.specs[(j+offset)%unit.specs.length],n=base+j+offset*11,raw=typeof spec==='function'?spec(n,j):copy(spec),mode=Math.floor(j/unit.specs.length);if(String(raw.wrong)===String(raw.answer))raw.wrong=Number.isFinite(Number(raw.answer))?String(Number(raw.answer)+1):'不符合本题要求';let prompt=raw.prompt;if(kind==='observation'){if(mode===1)prompt='依据反馈再做一次：'+prompt;if(mode>=2)prompt='在同伴合作情境中观察：'+prompt;}else{if(mode===1)prompt='有人对“'+raw.prompt+'”回答“'+raw.wrong+'”，请给出正确答案。';if(mode===2)prompt=raw.prompt+' 请从“'+raw.answer+'”和“'+raw.wrong+'”中选择。';if(mode>=3)prompt='检查并改正这份回答：“'+raw.wrong+'”。对应题目：'+raw.prompt;}return{id:'legacy-question-'+l.id+'-'+stage+'-'+pad(j+1),prompt,answer:String(raw.answer),wrong:String(raw.wrong),explanation:raw.explanation||unit.principle,knowledge_point_id:point,knowledge_point_label:unit.topic,kind:raw.kind||'short_answer'};});}
  function summary(rows,available=true){const expected=students.length,pending=rows.filter(r=>r.status==='pending').length,mastered=rows.filter(r=>r.status==='mastered').length,reinforce=rows.filter(r=>r.status==='reinforce').length,determined=rows.length-pending,rate=available&&kind==='academic'?100*mastered/expected:null,class_status=!available?'pending':pending?'pending':kind==='observation'?'observed':10*mastered>=9*expected?'mastered':'reinforce';return{expected,determined,mastered,reinforce,pending,rate,class_status,available,valid:determined,achieved:mastered,unknown:pending,percentage:rate,status_label:!available?'尚无复测':kind==='observation'?'完成 '+mastered+' 人 · 需练习 '+reinforce+' 人'+(pending?' · 待观察 '+pending+' 人':''):pending?'资料待补齐':class_status==='mastered'?'本课达到90/90':'本课仍需巩固'};}
  function lessonView(id,stage='first'){if(!['first','retest'].includes(stage))throw Error('请选择首次练习或独立复测。');const key=id+'|'+stage;if(cache.has(key))return cache.get(key);const entry=byLesson.get(id);if(!entry)throw Error('这堂课不属于当前教师。');const source=entry.l[stage],available=!!source&&Array.isArray(source.rows)&&source.rows.length>0;
   if(!available){const empty={lesson:metadata(entry),class:klass,stage,stage_label:stage==='first'?'首次练习':'独立复测',kind,students,questions:[],rows:[],summary:summary([],false),available:false,empty_reason:stage==='retest'?'这堂课尚未安排独立复测。':'这堂课尚无首次练习记录。',notice};cache.set(key,empty);return empty;}
   const count=Math.max(10,...source.rows.map(r=>Number.isInteger(r.total)?r.total:0)),questions=makeQuestions(entry,stage,count),sourceRows=new Map(source.rows.map(r=>[r.student_id,r]));
   const rows=students.map(s=>{const raw=sourceRows.get(s.legacy_student_id),pending=!raw||raw.correct==null||raw.total==null||raw.status==='undetermined'||classify(raw.correct,raw.total)==='pending';if(pending)return{id:s.id,student_id:s.id,legacy_student_id:s.legacy_student_id,name:s.name,correct:raw?.correct??null,total:raw?.total??null,status:'pending',answers:[]};const order=shuffle(Array.from({length:raw.total},(_,i)=>i),hash(id+'|'+stage+'|'+s.id)),wrong=new Set(order.slice(0,raw.total-raw.correct)),answers=questions.slice(0,raw.total).map((q,i)=>({question_id:q.id,answer:wrong.has(i)?q.wrong:q.answer,correct:!wrong.has(i),status:'answered'})),correct=answers.filter(a=>a.correct).length;return{id:s.id,student_id:s.id,legacy_student_id:s.legacy_student_id,name:s.name,correct,total:answers.length,status:classify(correct,answers.length),answers};});
   for(const raw of source.rows)if(!byOld.has(raw.student_id))throw Error('原课堂名单与固定班级名单不一致。');
   const result={lesson:metadata(entry),class:klass,stage,stage_label:kind==='observation'?(stage==='first'?'首次任务观察':'再次观察'):(stage==='first'?'首次独立练习':'独立复测'),kind,students,questions,rows,summary:summary(rows),available:true,empty_reason:'',notice};cache.set(key,result);return result;
  }
  function catalog(){return{person,class:klass,students,lessons:lessons.map(l=>({...metadata(byLesson.get(l.id)),first:lessonView(l.id,'first').summary,retest:lessonView(l.id,'retest').summary})),notice};}
  function studentView(id){const s=byId.get(id);if(!s)throw Error('这位学生不属于当前教师的旧课堂样板。');const own=lessons.map(l=>{const f=lessonView(l.id,'first'),r=lessonView(l.id,'retest');return{...f.lesson,first:f.rows.find(x=>x.student_id===id)||null,retest:r.rows.find(x=>x.student_id===id)||null};}),topics=[];for(const item of own){const point='legacy-point-'+person.id+'-'+hash(item.topic).toString(36);let t=topics.find(t=>t.id===point);if(!t){t={id:point,label:item.topic,lessons:[],first:null,retest:null,kind,source:'本教师该主题最近一次课堂记录'};topics.push(t);}t.lessons.push(item.id);t.first=item.first?{correct:item.first.correct,total:item.first.total,status:item.first.status,lesson_id:item.id,date:item.date}:null;if(item.retest)t.retest={correct:item.retest.correct,total:item.retest.total,status:item.retest.status,lesson_id:item.id,date:item.date};}const counts={lessons:own.length,determined:0,mastered:0,reinforce:0,pending:0};for(const l of own){const key=l.first?.status||'pending';counts[key]++;if(key!=='pending')counts.determined++;}return{student:s,class:klass,person,lessons:own,topics,summary:counts,notice};}
  return{catalog:()=>copy(catalog()),lesson:(id,stage)=>copy(lessonView(id,stage)),student:id=>copy(studentView(id))};
 }
 return{create,classify,version:'legacy-classroom-review-v20'};
});
