#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate confession lyrics files for AR, RU, ZH, HI, TL, SW languages
"""

import os
import sys

# Ensure UTF-8 encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Base directory
BASE_DIR = "C:/ScriptBible/bible-chantee/lyrics/confessions"

# Language-specific translations for each confession
CONFESSIONS = {
    "AR": {
        "files": [
            ("01_Farah.txt", "Joy - Farah (فرح)"),
            ("02_Shifa.txt", "Healed - Shifa (شفاء)"),
            ("03_Siha.txt", "Health - Siha (صحة)"),
            ("04_Ghalib.txt", "Conqueror - Ghalib (غالب)"),
            ("05_Najah.txt", "Prosper - Najah (نجاح)"),
            ("06_Shukr.txt", "Grateful - Shukr (شكر)"),
            ("07_Saada.txt", "Happy - Saada (سعادة)"),
            ("08_Baraka.txt", "Blessed - Baraka (بركة)"),
            ("09_Amin.txt", "Amen - Amin (آمين)"),
            ("10_Salam.txt", "Shalom - Salam (سلام)")
        ],
        "lyrics": [
            # 01 Joy
            """[المقطع الأول]
فرح الرب هو قوتي اليوم
حتى في التجربة، أقف قويًا وأعيش
كلمتك تنير كل خطوة أخطوها
تملأ قلبي بفرحك

[اللازمة]
أنا مملوء بالفرح، أنا مملوء بالفرح
فرح الرب يسكن فيّ
أنا مملوء بالفرح، أنا مملوء بالفرح
في حضورك، يبتهج قلبي

[المقطع الثاني]
تريني طريق الحياة
أمام وجهك ينمو الفرح
الملذات الأبدية عن يمينك
تبتهج نفسي وتذكر صلاحك

[الجسر]
حتى لو جاءت الدموع لوقت
فرحك يعود كالشمس المشرقة""",

            # 02 Healed
            """[المقطع الأول]
حمل آثامنا وأوجاعنا أيضًا
بجراحه شُفيت
على الصليب أخذ كل شيء لأجلي
اليوم، حياته تجري فيّ

[اللازمة]
أنا مشفى باسم يسوع
أنا مشفى بالدم المسفوك
الصليب تكلم أقوى من الموت
أنا مشفى بمحبة الرب

[المقطع الثاني]
حمل خطاياي على الخشبة
لكي أحيا لله بالإيمان
بجراحه نلت الحياة
اليوم، الشفاء ينمو فيّ

[الجسر]
أرسل كلمته
وشفاني تمامًا""",

            # 03 Health
            """[المقطع الأول]
أتمنى أن تكون معافى في كل شيء
وأن تكون بصحة جيدة
كما نفسك أيضًا معافاة
هذا هو الوعد الذي أعطاه الله

[اللازمة]
أنا بصحة جيدة، جسدي وروحي في سلام
الرب يعتني بي، يومًا بعد يوم
أنا بصحة جيدة، مقوى بصلاحه
حياتي له إلى الأبد

[المقطع الثاني]
هو الذي يجدد قوتي
كالنسر أطير من جديد

[الجسر]
بك أحيا وأتحرك وأوجد
صحتي تأتي من يدك""",

            # 04 Conqueror
            """[المقطع الأول]
كل ما وُلد من الله يغلب العالم
إيماني يجعلني أتقدم
النصرة قد أُعطيت لي بالفعل
لم أعد أخاف المواجهة

[اللازمة]
أنا منتصر، أكثر من منتصر
بالذي أحبني
أنا منتصر، أكثر من منتصر
نصرتي تأتي من الرب

[المقطع الثاني]
لا شيء يمكن أن يفصلني عن محبته
لا الحياة ولا الموت
في كل هذه الأمور أنتصر
بقوة اسمه القوي

[الجسر]
إن كان الله معي، فمن عليّ؟""",

            # 05 Prosper
            """[المقطع الأول]
هذا الكتاب لا يبرح من شفتي
أتأمل فيه نهارًا وليلاً
حينئذ أنجح في طرقي
والبركة تنمو فيّ

[اللازمة]
أنا مزدهر، بيد الله
كل ما أفعله يثمر
أنا مزدهر، تحت نظره
حياتي تزدهر ليلاً ونهارًا

[المقطع الثاني]
أنا كشجرة مغروسة عند مجاري المياه
تعطي ثمرها في أوانه
كل ما أبدأ به ينجح
في سلام بيته

[الجسر]
كلمتك هي مصباح لرجلي
ونور لسبيلي""",

            # 06 Grateful
            """[المقطع الأول]
في كل شيء أشكر الله
حتى عندما لا أفهم
قلبي يختار أن يثق به
لأن أمانته لا تضعف

[اللازمة]
أنا شاكر، من كل قلبي
لمحبتك وصلاحك
أنا شاكر، يا ربي
إلى الأبد سأسبحك

[المقطع الثاني]
أدخل بيتك بالحمد
بالشكر والترنيم

[الجسر]
اشكروا الرب لأنه صالح
لأن إلى الأبد رحمته""",

            # 07 Happy
            """[المقطع الأول]
في حضورك الفرح الكامل
عن يمينك السعادة بلا نهاية
فرحي لم يعد يعتمد على العالم
بل على محبتك الحية فيّ

[اللازمة]
أنا سعيد، سعيد حقًا
فرحي يأتي منك يا رب يسوع
أنا سعيد، سعيد حقًا
حياتي مستترة في الله

[المقطع الثاني]
حتى عندما يغطيني الليل
فرحك يعلمني أن أبتسم

[الجسر]
في حضورك ملء الفرح
عن يمينك نعم إلى الأبد""",

            # 08 Blessed
            """[المقطع الأول]
مبارك الله الذي باركني في المسيح
بكل بركة في السماء
نعمته تحيط بي اليوم
ونوره يُعلن فيّ

[اللازمة]
أنا مبارك، أنا محفوظ
الرب يعتني بخطواتي
أنا مبارك، أنا محبوب
سلامه يبقى فيّ

[المقطع الثاني]
ليباركني الرب ويحفظني
لينر بوجهه عليّ

[الجسر]
باركني يا رب
واحفظني في طرقك""",

            # 09 Amen
            """[المقطع الأول]
لتكن مشيئتك
على الأرض كما في السماء
ليأت ملكوتك في حياتنا
في السلام الأبدي

[اللازمة]
آمين، آمين، هكذا ليكن
لك المجد إلى الأبد
آمين، آمين، هكذا ليكن
تعال أيها الرب، املك علينا

[المقطع الثاني]
نعم، تعال أيها الرب يسوع
قلبي ينتظرك بالإيمان

[الجسر]
لتكن مشيئتك
ليأت ملكوتك الآن""",

            # 10 Shalom
            """[المقطع الأول]
أترك لكم سلامًا، أعطيكم سلامي
قال الرب، مملوء محبة
ليس كما يعطي العالم
إنه سلام إلى الأبد

[اللازمة]
سلام الرب، سلام أدوناي
سلام يحفظ قلبي
سلام الرب، سلام أدوناي
سلام يطرد الخوف

[المقطع الثاني]
ليوجه الرب وجهه نحوي
وليعطني السلام

[الجسر]
سلام الله الذي يفوق كل عقل
يحفظ قلبي وأفكاري"""
        ]
    },

    "RU": {
        "files": [
            ("01_Radost.txt", "Joy - Radost"),
            ("02_Istselenie.txt", "Healed - Istselenie"),
            ("03_Zdorovie.txt", "Health - Zdorovie"),
            ("04_Pobeditel.txt", "Conqueror - Pobeditel"),
            ("05_Protsvetanie.txt", "Prosper - Protsvetanie"),
            ("06_Blagodarnost.txt", "Grateful - Blagodarnost"),
            ("07_Schastie.txt", "Happy - Schastie"),
            ("08_Blagoslovenie.txt", "Blessed - Blagoslovenie"),
            ("09_Amin.txt", "Amen - Amin"),
            ("10_Shalom.txt", "Shalom")
        ],
        "lyrics": [
            # 01 Joy
            """[Куплет 1]
Радость Господа - моя сила сегодня
Даже в испытании я стою твёрдо и живу
Твоё Слово освещает каждый мой шаг
Ты наполняешь моё сердце Твоей радостью

[Припев]
Я полон радости, я полон радости
Радость Господа живёт во мне
Я полон радости, я полон радости
В Твоём присутствии моё сердце радуется

[Куплет 2]
Ты показываешь мне путь жизни
Перед Твоим лицом радость растёт
Вечные удовольствия по правую руку от Тебя
Моя душа ликует и помнит Твою доброту

[Бридж]
Даже если слёзы приходят на время
Твоя радость возвращается как восходящее солнце""",

            # 02 Healed
            """[Куплет 1]
Он понёс наши грехи и наши боли
Его ранами я исцелён
На кресте Он взял всё для меня
Сегодня Его жизнь течёт во мне

[Припев]
Я исцелён во имя Иисуса
Я исцелён пролитой кровью
Крест говорил сильнее смерти
Я исцелён любовью Господа

[Куплет 2]
Он понёс мои грехи на дереве
Чтобы я жил для Бога верой
Его ранами я получил жизнь
Сегодня исцеление растёт во мне

[Бридж]
Он послал Своё слово
И полностью исцелил меня""",

            # 03 Health
            """[Куплет 1]
Я желаю, чтобы ты преуспевал во всём
И был здоров
Как здрава твоя душа
Это обещание, которое дал Бог

[Припев]
Я здоров, тело и душа в мире
Господь заботится обо мне день за днём
Я здоров, укреплён Его добротой
Моя жизнь принадлежит Ему навсегда

[Куплет 2]
Он обновляет мои силы
Как орёл я снова взлетаю

[Бридж]
В Тебе я живу, двигаюсь и существую
Моё здоровье приходит из Твоей руки""",

            # 04 Conqueror
            """[Куплет 1]
Всё рождённое от Бога побеждает мир
Моя вера заставляет меня двигаться вперёд
Победа уже дана мне
Я больше не боюсь противостоять

[Припев]
Я победитель, более чем победитель
Тем, кто возлюбил меня
Я победитель, более чем победитель
Моя победа приходит от Господа

[Куплет 2]
Ничто не может отлучить меня от Его любви
Ни жизнь, ни смерть
Во всём этом я торжествую
Силой Его могущественного имени

[Бридж]
Если Бог за меня, кто против меня?""",

            # 05 Prosper
            """[Куплет 1]
Эта книга не отходит от моих уст
Я размышляю о ней день и ночь
Тогда я преуспеваю на моих путях
И благословение растёт во мне

[Припев]
Я процветаю рукой Бога
Всё, что я делаю, приносит плод
Я процветаю под Его взором
Моя жизнь цветёт день и ночь

[Куплет 2]
Я как дерево у потоков воды
Которое приносит свой плод в своё время
Всё, что я начинаю, успешно
В мире Его дома

[Бридж]
Твоё слово - светильник ноге моей
И свет стезе моей""",

            # 06 Grateful
            """[Куплет 1]
Во всём я благодарю Бога
Даже когда я не понимаю
Моё сердце выбирает доверять Ему
Потому что Его верность не ослабевает

[Припев]
Я благодарен от всего сердца
За Твою любовь и доброту
Я благодарен, мой Господь
Навеки я буду славить Тебя

[Куплет 2]
Я вхожу в Твой дом с хвалой
С благодарением и пением

[Бридж]
Благодарите Господа, ибо Он благ
Ибо вовек милость Его""",

            # 07 Happy
            """[Куплет 1]
В Твоём присутствии совершенная радость
По правую руку от Тебя счастье без конца
Моя радость больше не зависит от мира
Но от Твоей любви, живущей во мне

[Припев]
Я счастлив, действительно счастлив
Моя радость приходит от Тебя, Господь Иисус
Я счастлив, действительно счастлив
Моя жизнь сокрыта в Боге

[Куплет 2]
Даже когда ночь покрывает меня
Твоя радость учит меня улыбаться

[Бридж]
В Твоём присутствии полнота радости
По правую руку от Тебя блаженство вовек""",

            # 08 Blessed
            """[Куплет 1]
Благословен Бог, который благословил меня во Христе
Всяким благословением в небесах
Его благодать окружает меня сегодня
И Его свет открывается во мне

[Припев]
Я благословлён, я сохранён
Господь заботится о моих шагах
Я благословлён, я возлюблен
Его мир пребывает во мне

[Куплет 2]
Да благословит меня Господь и сохранит меня
Да воссияет лицо Его на меня

[Бридж]
Благослови меня, Господь
И сохрани меня на путях Твоих""",

            # 09 Amen
            """[Куплет 1]
Да будет воля Твоя
На земле как на небе
Да придёт Царствие Твоё в наши жизни
В вечном мире

[Припев]
Аминь, аминь, да будет так
Тебе слава навеки
Аминь, аминь, да будет так
Приди, Господь, царствуй над нами

[Куплет 2]
Да, приди, Господь Иисус
Моё сердце ждёт Тебя в вере

[Бридж]
Да будет воля Твоя
Да придёт Царствие Твоё сейчас""",

            # 10 Shalom
            """[Куплет 1]
Мир оставляю вам, мир Мой даю вам
Сказал Господь, полный любви
Не как мир даёт
Это мир навеки

[Припев]
Мир Господа, мир Адонай
Мир, хранящий моё сердце
Мир Господа, мир Адонай
Мир, изгоняющий страх

[Куплет 2]
Да обратит Господь лицо Своё ко мне
И даст мне мир

[Бридж]
Мир Божий, превосходящий всякое разумение
Хранит моё сердце и мои мысли"""
        ]
    },

    "ZH": {
        "files": [
            ("01_Xile.txt", "Joy - Xile (喜乐)"),
            ("02_Yizhi.txt", "Healed - Yizhi (医治)"),
            ("03_Jiankang.txt", "Health - Jiankang (健康)"),
            ("04_Deshenglizhe.txt", "Conqueror - Deshenglizhe (得胜者)"),
            ("05_Chansheng.txt", "Prosper - Chansheng (昌盛)"),
            ("06_Ganen.txt", "Grateful - Ganen (感恩)"),
            ("07_Xingfu.txt", "Happy - Xingfu (幸福)"),
            ("08_Zhufu.txt", "Blessed - Zhufu (祝福)"),
            ("09_Amen.txt", "Amen - Amen (阿们)"),
            ("10_Shalom.txt", "Shalom - Shalom (沙龙)")
        ],
        "lyrics": [
            # 01 Joy
            """[第一节]
主的喜乐是我今天的力量
即使在试炼中，我站立坚强而活着
你的话照亮我的每一步
你用你的喜乐充满我的心

[副歌]
我充满喜乐，我充满喜乐
主的喜乐住在我里面
我充满喜乐，我充满喜乐
在你的同在中，我的心欢喜

[第二节]
你让我知道生命的道路
在你面前喜乐增长
在你右手中有永远的福乐
我的灵魂欢呼并记念你的良善

[桥段]
即使眼泪暂时来临
你的喜乐如旭日东升般回归""",

            # 02 Healed
            """[第一节]
他担当了我们的过犯和痛苦
因他的鞭伤我得医治
在十字架上他为我承受一切
今天，他的生命在我里面流淌

[副歌]
我奉耶稣的名得医治
我因流出的宝血得医治
十字架的话语胜过死亡
我因主的爱得医治

[第二节]
他在木头上担当了我的罪
使我因信为神而活
因他的鞭伤我得到生命
今天，医治在我里面增长

[桥段]
他发出他的话语
完全医治了我""",

            # 03 Health
            """[第一节]
我愿你凡事兴盛
身体健壮
正如你的灵魂兴盛一样
这是神所赐的应许

[副歌]
我身体健康，身心平安
主日日看顾我
我身体健康，因他的良善而刚强
我的生命永远属于他

[第二节]
他使我的力量更新
如鹰重新展翅上腾

[桥段]
我在你里面生活、动作、存留
我的健康从你手中而来""",

            # 04 Conqueror
            """[第一节]
凡从神生的就胜过世界
我的信心使我前进
胜利已经赐给了我
我不再害怕面对

[副歌]
我是得胜者，不止得胜者
靠着那爱我的主
我是得胜者，不止得胜者
我的胜利来自主

[第二节]
没有什么能使我与他的爱隔绝
无论是生是死
在这一切的事上我得胜有余
靠着他大能的名

[桥段]
神若帮助我，谁能敌挡我？""",

            # 05 Prosper
            """[第一节]
这书不可离开我口
我昼夜思想
这样我便在道路上亨通
祝福在我里面增长

[副歌]
我昌盛，因神的手
我所做的都结果子
我昌盛，在他眼前
我的生命昼夜开花

[第二节]
我像一棵树栽在溪水旁
按时候结果子
我所做的尽都顺利
在他家中的平安里

[桥段]
你的话是我脚前的灯
是我路上的光""",

            # 06 Grateful
            """[第一节]
凡事我都感谢神
即使我不明白
我的心选择信靠他
因为他的信实不减退

[副歌]
我感恩，全心全意
为你的爱和良善
我感恩，我的主
我要永远赞美你

[第二节]
我以赞美进入你的家
带着感恩和歌唱

[桥段]
你们要称谢主，因他本为善
他的慈爱永远长存""",

            # 07 Happy
            """[第一节]
在你面前有满足的喜乐
在你右手中有永远的福乐
我的喜乐不再依赖世界
而是依赖活在我里面的你的爱

[副歌]
我幸福，真正幸福
我的喜乐来自你，主耶稣
我幸福，真正幸福
我的生命藏在神里面

[第二节]
即使黑夜笼罩我
你的喜乐教我微笑

[桥段]
在你面前有满足的喜乐
在你右手中有永远的福乐""",

            # 08 Blessed
            """[第一节]
愿颂赞归于神，他在基督里赐福给我
用天上各样属灵的福气
他的恩典今天环绕我
他的光在我里面显现

[副歌]
我蒙福，我被保守
主看顾我的脚步
我蒙福，我被爱
他的平安住在我里面

[第二节]
愿主赐福给我，保护我
愿主使他的脸光照我

[桥段]
主啊，赐福给我
保守我在你的道路上""",

            # 09 Amen
            """[第一节]
愿你的旨意成就
在地如同在天
愿你的国降临在我们的生命中
在永恒的平安里

[副歌]
阿们，阿们，愿这样成就
荣耀永远归于你
阿们，阿们，愿这样成就
来吧，主啊，在我们身上掌权

[第二节]
是的，主耶稣啊，我愿你来
我的心凭信心等候你

[桥段]
愿你的旨意成就
愿你的国现在就降临""",

            # 10 Shalom
            """[第一节]
我留下平安给你们，我将我的平安赐给你们
主说，满有慈爱
不像世人所赐的
这是永远的平安

[副歌]
主的平安，阿多乃的平安
保守我心的平安
主的平安，阿多乃的平安
驱除惧怕的平安

[第二节]
愿主向我仰脸
赐我平安

[桥段]
神所赐出人意外的平安
必在基督耶稣里保守我的心怀意念"""
        ]
    },

    "HI": {
        "files": [
            ("01_Anand.txt", "Joy - Anand (आनंद)"),
            ("02_Changa.txt", "Healed - Changa (चंगा)"),
            ("03_Swasthya.txt", "Health - Swasthya (स्वास्थ्य)"),
            ("04_Vijayi.txt", "Conqueror - Vijayi (विजयी)"),
            ("05_Samriddhi.txt", "Prosper - Samriddhi (समृद्धि)"),
            ("06_Dhanyavad.txt", "Grateful - Dhanyavad (धन्यवाद)"),
            ("07_Khushi.txt", "Happy - Khushi (खुशी)"),
            ("08_Ashirwad.txt", "Blessed - Ashirwad (आशीर्वाद)"),
            ("09_Amen.txt", "Amen - Amen (आमेन)"),
            ("10_Shalom.txt", "Shalom - Shalom (शालोम)")
        ],
        "lyrics": [
            # 01 Joy
            """[पद 1]
प्रभु का आनंद आज मेरी शक्ति है
परीक्षा में भी, मैं मजबूत खड़ा हूँ और जीवित हूँ
आपका वचन मेरे हर कदम को रोशन करता है
आप मेरे दिल को अपने आनंद से भरते हैं

[कोरस]
मैं आनंद से भरा हूँ, मैं आनंद से भरा हूँ
प्रभु का आनंद मुझमें रहता है
मैं आनंद से भरा हूँ, मैं आनंद से भरा हूँ
आपकी उपस्थिति में, मेरा दिल आनंदित होता है

[पद 2]
आप मुझे जीवन का मार्ग दिखाते हैं
आपके सामने आनंद बढ़ता है
आपके दाहिने हाथ में अनन्त सुख हैं
मेरी आत्मा आनंदित होती है और आपकी भलाई को याद करती है

[ब्रिज]
भले ही आँसू कुछ समय के लिए आएं
आपका आनंद उगते सूरज की तरह लौटता है""",

            # 02 Healed
            """[पद 1]
उसने हमारे पापों और दुखों को उठाया
उसके घावों से मैं चंगा हुआ
क्रूस पर उसने मेरे लिए सब कुछ लिया
आज, उसका जीवन मुझमें बहता है

[कोरस]
मैं यीशु के नाम में चंगा हुआ हूँ
मैं बहाए गए लहू से चंगा हुआ हूँ
क्रूस ने मृत्यु से अधिक ज़ोर से बोला
मैं प्रभु के प्रेम से चंगा हुआ हूँ

[पद 2]
उसने मेरे पापों को काठ पर उठाया
ताकि मैं विश्वास से परमेश्वर के लिए जीऊं
उसके घावों से मुझे जीवन मिला
आज, चंगाई मुझमें बढ़ रही है

[ब्रिज]
उसने अपना वचन भेजा
और मुझे पूरी तरह से चंगा किया""",

            # 03 Health
            """[पद 1]
मैं चाहता हूँ कि तू सब बातों में कुशल हो
और स्वस्थ रहे
जैसे तेरी आत्मा कुशल है
यह वह वादा है जो परमेश्वर ने दिया है

[कोरस]
मैं स्वस्थ हूँ, शरीर और आत्मा शांति में हैं
प्रभु दिन-प्रतिदिन मेरी देखभाल करते हैं
मैं स्वस्थ हूँ, उनकी भलाई से मजबूत
मेरा जीवन हमेशा के लिए उनका है

[पद 2]
वह मेरी शक्ति का नवीनीकरण करता है
उकाब के समान मैं फिर से उड़ता हूँ

[ब्रिज]
तुझ में मैं जीवित रहता हूँ, चलता-फिरता हूँ और हूँ
मेरा स्वास्थ्य तेरे हाथ से आता है""",

            # 04 Conqueror
            """[पद 1]
जो कुछ परमेश्वर से उत्पन्न हुआ है वह संसार पर जय पाता है
मेरा विश्वास मुझे आगे बढ़ाता है
विजय मुझे पहले ही दी जा चुकी है
मुझे अब सामना करने से डर नहीं लगता

[कोरस]
मैं विजेता हूँ, विजेता से भी बढ़कर
उस के द्वारा जिस ने मुझ से प्रेम किया
मैं विजेता हूँ, विजेता से भी बढ़कर
मेरी जीत प्रभु से आती है

[पद 2]
कुछ भी मुझे उसके प्रेम से अलग नहीं कर सकता
न जीवन, न मृत्यु
इन सब बातों में मैं जय से भी बढ़कर हूँ
उसके शक्तिशाली नाम की सामर्थ्य से

[ब्रिज]
यदि परमेश्वर मेरी ओर है, तो मेरा विरोधी कौन है?""",

            # 05 Prosper
            """[पद 1]
यह पुस्तक मेरे मुँह से न हटे
मैं दिन रात इस पर ध्यान करता हूँ
तब मैं अपने मार्गों में सफल होता हूँ
और आशीर्वाद मुझमें बढ़ता है

[कोरस]
मैं समृद्ध हूँ, परमेश्वर के हाथ से
जो कुछ मैं करता हूँ वह फलदायी होता है
मैं समृद्ध हूँ, उनकी दृष्टि में
मेरा जीवन दिन और रात फलता-फूलता है

[पद 2]
मैं जल के स्रोतों के पास लगाए गए वृक्ष के समान हूँ
जो अपने समय पर फल देता है
जो कुछ मैं शुरू करता हूँ वह सफल होता है
उनके घर की शांति में

[ब्रिज]
तेरा वचन मेरे पाँव के लिये दीपक
और मेरे मार्ग के लिये उजियाला है""",

            # 06 Grateful
            """[पद 1]
सब बातों में मैं परमेश्वर का धन्यवाद करता हूँ
जब मैं नहीं समझता तब भी
मेरा दिल उस पर भरोसा करना चुनता है
क्योंकि उसकी विश्वासयोग्यता कमजोर नहीं होती

[कोरस]
मैं कृतज्ञ हूँ, अपने पूरे दिल से
तेरे प्रेम और भलाई के लिए
मैं कृतज्ञ हूँ, मेरे प्रभु
सदा के लिए मैं तेरी स्तुति करूँगा

[पद 2]
मैं स्तुति के साथ तेरे घर में प्रवेश करता हूँ
धन्यवाद और गीत के साथ

[ब्रिज]
यहोवा का धन्यवाद करो क्योंकि वह भला है
क्योंकि उसकी करुणा सदा की है""",

            # 07 Happy
            """[पद 1]
तेरी उपस्थिति में पूर्ण आनंद है
तेरे दाहिने हाथ में अनन्त सुख है
मेरा आनंद अब संसार पर निर्भर नहीं है
बल्कि तेरे प्रेम पर जो मुझमें जीवित है

[कोरस]
मैं खुश हूँ, वास्तव में खुश हूँ
मेरा आनंद तुझ से आता है, प्रभु यीशु
मैं खुश हूँ, वास्तव में खुश हूँ
मेरा जीवन परमेश्वर में छिपा हुआ है

[पद 2]
जब रात मुझे ढक लेती है
तेरा आनंद मुझे मुस्कुराना सिखाता है

[ब्रिज]
तेरी उपस्थिति में पूर्ण आनंद है
तेरे दाहिने हाथ में सदा के लिए सुख है""",

            # 08 Blessed
            """[पद 1]
धन्य है वह परमेश्वर जिसने मुझे मसीह में आशीर्वाद दिया
स्वर्गीय स्थानों में सब प्रकार की आशीर्वाद से
उसका अनुग्रह आज मुझे घेरे रहता है
और उसका प्रकाश मुझमें प्रकट होता है

[कोरस]
मैं धन्य हूँ, मैं सुरक्षित हूँ
प्रभु मेरे कदमों की देखभाल करते हैं
मैं धन्य हूँ, मैं प्रिय हूँ
उनकी शांति मुझमें बनी रहती है

[पद 2]
यहोवा मुझे आशीर्वाद दे और मेरी रक्षा करे
यहोवा अपना मुख मुझ पर प्रकाशित करे

[ब्रिज]
हे प्रभु, मुझे आशीर्वाद दे
और मुझे अपने मार्गों में सुरक्षित रख""",

            # 09 Amen
            """[पद 1]
तेरी इच्छा पूरी हो
जैसे स्वर्ग में वैसे पृथ्वी पर भी
तेरा राज्य हमारे जीवन में आए
अनन्त शांति में

[कोरस]
आमेन, आमेन, ऐसा ही हो
तुझे सदा के लिए महिमा हो
आमेन, आमेन, ऐसा ही हो
आ, प्रभु, हम पर राज्य कर

[पद 2]
हाँ, प्रभु यीशु आ
मेरा दिल विश्वास में तेरी प्रतीक्षा करता है

[ब्रिज]
तेरी इच्छा पूरी हो
तेरा राज्य अभी आए""",

            # 10 Shalom
            """[पद 1]
मैं तुम्हें शांति देता हूँ, मैं तुम्हें अपनी शांति देता हूँ
प्रभु ने कहा, प्रेम से भरा हुआ
जैसा संसार देता है वैसा नहीं
यह सदा के लिए शांति है

[कोरस]
प्रभु की शांति, अदोनै की शांति
शांति जो मेरे दिल को सुरक्षित रखती है
प्रभु की शांति, अदोनै की शांति
शांति जो भय को दूर भगाती है

[पद 2]
यहोवा अपना मुख मेरी ओर करे
और मुझे शांति दे

[ब्रिज]
परमेश्वर की शांति जो समझ से परे है
मेरे दिल और विचारों की रक्षा करती है"""
        ]
    },

    "TL": {
        "files": [
            ("01_Kagalakan.txt", "Joy - Kagalakan"),
            ("02_Kagalingan.txt", "Healed - Kagalingan"),
            ("03_Kalusugan.txt", "Health - Kalusugan"),
            ("04_Tagumpay.txt", "Conqueror - Tagumpay"),
            ("05_Kasaganaan.txt", "Prosper - Kasaganaan"),
            ("06_Pasasalamat.txt", "Grateful - Pasasalamat"),
            ("07_Kaligayahan.txt", "Happy - Kaligayahan"),
            ("08_Pagpapala.txt", "Blessed - Pagpapala"),
            ("09_Amen.txt", "Amen"),
            ("10_Shalom.txt", "Shalom")
        ],
        "lyrics": [
            # 01 Joy
            """[Taludtod 1]
Ang kagalakan ng Panginoon ay aking lakas ngayong araw
Kahit sa pagsubok, ako ay matatag at nabubuhay
Ang Iyong Salita ay sumisilakbo sa bawat hakbang ko
Pinupuno Mo ang aking puso ng Iyong kagalakan

[Koro]
Ako ay puno ng kagalakan, ako ay puno ng kagalakan
Ang kagalakan ng Panginoon ay naninirahan sa akin
Ako ay puno ng kagalakan, ako ay puno ng kagalakan
Sa Iyong presensya, ang aking puso ay nagagalak

[Taludtod 2]
Ipinapakita Mo sa akin ang landas ng buhay
Sa harap ng Iyong mukha ay lumalaki ang kagalakan
Walang hanggang kaligayahan ay nasa Iyong kanan
Ang aking kaluluwa ay nagagalak at naaalala ang Iyong kabutihan

[Tulay]
Kahit dumating ang luha sa sandali
Ang Iyong kagalakan ay bumabalik na parang sikat ng araw""",

            # 02 Healed
            """[Taludtod 1]
Dinala Niya ang ating mga kasalanan at mga sakit
Sa Kanyang mga sugat ako ay gumaling
Sa krus kinuha Niya ang lahat para sa akin
Ngayon, ang Kanyang buhay ay dumadaloy sa akin

[Koro]
Ako ay gumaling sa pangalan ni Hesus
Ako ay gumaling sa pamamagitan ng ibinuhos na dugo
Ang krus ay nagsalita ng mas malakas kaysa kamatayan
Ako ay gumaling sa pag-ibig ng Panginoon

[Taludtod 2]
Dinala Niya ang aking mga kasalanan sa kahoy
Upang ako ay mabuhay para sa Diyos sa pamamagitan ng pananampalataya
Sa Kanyang mga sugat ako ay nakatanggap ng buhay
Ngayon, ang pagpapagaling ay lumalaki sa akin

[Tulay]
Isinugo Niya ang Kanyang salita
At lubos akong pinagaling""",

            # 03 Health
            """[Taludtod 1]
Nais kong ikaw ay guminhawa sa lahat ng bagay
At manatiling malusog
Tulad ng iyong kaluluwa ay gumaganda
Ito ang pangako na ibinigay ng Diyos

[Koro]
Ako ay malusog, katawan at kaluluwa ay mapayapa
Ang Panginoon ay nag-aalaga sa akin, araw-araw
Ako ay malusog, pinalalakas ng Kanyang kabutihan
Ang aking buhay ay sa Kanya magpakailanman

[Taludtod 2]
Siya ang nagpapanibago ng aking lakas
Tulad ng agila ay lumilipad akong muli

[Tulay]
Sa Iyo ako nabubuhay, gumagalaw at umiiral
Ang aking kalusugan ay mula sa Iyong kamay""",

            # 04 Conqueror
            """[Taludtod 1]
Lahat ng ipinanganak mula sa Diyos ay lumalampas sa mundo
Ang aking pananampalataya ay nagpapasulong sa akin
Ang tagumpay ay ibinigay na sa akin
Hindi na ako takot na humarap

[Koro]
Ako ay nananalo, higit pa sa nananalo
Sa pamamagitan ng Yaong umibig sa akin
Ako ay nananalo, higit pa sa nananalo
Ang aking tagumpay ay mula sa Panginoon

[Taludtod 2]
Walang makapaghihiwalay sa akin sa Kanyang pag-ibig
Ni buhay, ni kamatayan
Sa lahat ng mga bagay na ito ako ay nananagumpay
Sa kapangyarihan ng Kanyang makapangyarihang pangalan

[Tulay]
Kung ang Diyos ay para sa akin, sino ang laban sa akin?""",

            # 05 Prosper
            """[Taludtod 1]
Ang aklat na ito ay hindi dapat humiwalay sa aking mga labi
Pinagbubulay-bulay ko ito araw at gabi
Pagkatapos ay nagtatagumpay ako sa aking mga daan
At ang pagpapala ay lumalaki sa akin

[Koro]
Ako ay umuunlad, sa pamamagitan ng kamay ng Diyos
Lahat ng aking ginagawa ay namumunga
Ako ay umuunlad, sa ilalim ng Kanyang mga mata
Ang aking buhay ay namumulaklak araw at gabi

[Taludtod 2]
Ako ay parang puno na nakatayo malapit sa tubig
Na nagbubunga sa tamang panahon
Lahat ng aking sinisimulan ay nagtatagumpay
Sa kapayapaan ng Kanyang tahanan

[Tulay]
Ang Iyong salita ay ilawan sa aking mga paa
At liwanag sa aking landas""",

            # 06 Grateful
            """[Taludtod 1]
Sa lahat ng bagay ako ay nagpapasalamat sa Diyos
Kahit hindi ko naiintindihan
Ang aking puso ay pumipili na magtiwala sa Kanya
Sapagkat ang Kanyang katapatan ay hindi humihina

[Koro]
Ako ay nagpapasalamat, buong puso
Para sa Iyong pag-ibig at kabutihan
Ako ay nagpapasalamat, aking Panginoon
Magpakailanman ay pupurihin Kita

[Taludtod 2]
Pumapasok ako sa Iyong tahanan na may pagpuri
Na may pasasalamat at awit

[Tulay]
Magpasalamat kayo sa Panginoon sapagkat Siya ay mabuti
Sapagkat ang Kanyang awa ay magpakailanman""",

            # 07 Happy
            """[Taludtod 1]
Sa Iyong presensya ay may perpektong kagalakan
Sa Iyong kanan ay may walang hanggang kaligayahan
Ang aking kagalakan ay hindi na umaasa sa mundo
Kundi sa Iyong pag-ibig na nabubuhay sa akin

[Koro]
Ako ay maligaya, tunay na maligaya
Ang aking kagalakan ay mula sa Iyo, Panginoong Hesus
Ako ay maligaya, tunay na maligaya
Ang aking buhay ay nakatago sa Diyos

[Taludtod 2]
Kahit takpan ako ng gabi
Ang Iyong kagalakan ay nagtuturo sa akin na ngumiti

[Tulay]
Sa Iyong presensya ay may kabuuan ng kagalakan
Sa Iyong kanan ay may kaligayahan magpakailanman""",

            # 08 Blessed
            """[Taludtod 1]
Purihin ang Diyos na nagpala sa akin kay Cristo
Ng lahat ng pagpapala sa kalangitan
Ang Kanyang biyaya ay sumasaklaw sa akin ngayon
At ang Kanyang liwanag ay nahahayag sa akin

[Koro]
Ako ay pinagpala, ako ay iningatan
Ang Panginoon ay nag-aalaga sa aking mga hakbang
Ako ay pinagpala, ako ay minamahal
Ang Kanyang kapayapaan ay nananatili sa akin

[Taludtod 2]
Nawa'y pagpalain ako ng Panginoon at ingatan
Nawa'y pasikat Niya ang Kanyang mukha sa akin

[Tulay]
Pagpalain mo ako, Panginoon
At ingatan mo ako sa Iyong mga daan""",

            # 09 Amen
            """[Taludtod 1]
Mangyari ang Iyong kalooban
Sa lupa gaya ng sa langit
Dumating ang Iyong kaharian sa aming mga buhay
Sa walang hanggang kapayapaan

[Koro]
Amen, amen, maging gayon
Sa Iyo ang kaluwalhatian magpakailanman
Amen, amen, maging gayon
Halika, Panginoon, maghari sa amin

[Taludtod 2]
Oo, halika Panginoong Hesus
Ang aking puso ay naghihintay sa Iyo sa pananampalataya

[Tulay]
Mangyari ang Iyong kalooban
Dumating ang Iyong kaharian ngayon""",

            # 10 Shalom
            """[Taludtod 1]
Iniiwan Ko sa inyo ang kapayapaan, binibigyan Ko kayo ng Aking kapayapaan
Sabi ng Panginoon, puno ng pag-ibig
Hindi tulad ng ibinibigay ng mundo
Ito ay kapayapaan magpakailanman

[Koro]
Kapayapaan ng Panginoon, kapayapaan ng Adonai
Kapayapaang sumusubaybay sa aking puso
Kapayapaan ng Panginoon, kapayapaan ng Adonai
Kapayapaang nagtataboy ng takot

[Taludtod 2]
Nawa'y itingin ng Panginoon ang Kanyang mukha sa akin
At bigyan ako ng kapayapaan

[Tulay]
Ang kapayapaan ng Diyos na lampas sa lahat ng pag-unawa
Ay sumusubaybay sa aking puso at isipan"""
        ]
    },

    "SW": {
        "files": [
            ("01_Furaha.txt", "Joy - Furaha"),
            ("02_Uponyaji.txt", "Healed - Uponyaji"),
            ("03_Afya.txt", "Health - Afya"),
            ("04_Mshindi.txt", "Conqueror - Mshindi"),
            ("05_Ustawi.txt", "Prosper - Ustawi"),
            ("06_Shukrani.txt", "Grateful - Shukrani"),
            ("07_Furaha.txt", "Happy - Furaha"),
            ("08_Baraka.txt", "Blessed - Baraka"),
            ("09_Amina.txt", "Amen - Amina"),
            ("10_Shalom.txt", "Shalom")
        ],
        "lyrics": [
            # 01 Joy
            """[Ubeti 1]
Furaha ya Bwana ni nguvu yangu leo
Hata katika majaribu, ninasimama imara na kuishi
Neno Lako linaangaza kila hatua ninayoichukua
Unajaza moyo wangu kwa furaha Yako

[Kiitikio]
Nimejaa furaha, nimejaa furaha
Furaha ya Bwana inaishi ndani yangu
Nimejaa furaha, nimejaa furaha
Katika uwepo Wako, moyo wangu unashangilia

[Ubeti 2]
Unaonionyesha njia ya uzima
Mbele ya uso Wako furaha inakua
Furaha za milele ziko mkono Wako wa kuume
Roho yangu inashangilia na kukumbuka wema Wako

[Daraja]
Hata kama machozi yanakuja kwa muda
Furaha Yako inarudi kama jua linachomoza""",

            # 02 Healed
            """[Ubeti 1]
Alichukua dhambi zetu na maumivu yetu
Kwa majeraha Yake nimepona
Msalabani alichukua kila kitu kwa ajili yangu
Leo, maisha Yake yanafurika ndani yangu

[Kiitikio]
Nimepona kwa jina la Yesu
Nimepona kwa damu iliyomwagwa
Msalaba ulisema kwa sauti kubwa kuliko mauti
Nimepona kwa upendo wa Bwana

[Ubeti 2]
Alichukua dhambi zangu juu ya mti
Ili niishi kwa Mungu kwa imani
Kwa majeraha Yake nilipokea uzima
Leo, uponyaji unakua ndani yangu

[Daraja]
Alituma neno Lake
Na kuniponya kabisa""",

            # 03 Health
            """[Ubeti 1]
Natamani ufanikiwe katika mambo yote
Na uwe na afya njema
Kama vile roho yako inavyofanikiwa
Hii ni ahadi aliyotoa Mungu

[Kiitikio]
Nina afya njema, mwili na roho katika amani
Bwana ananiangalia, siku baada ya siku
Nina afya njema, nimethibitishwa na wema Wake
Maisha yangu ni Yake milele

[Ubeti 2]
Yeye ndiye anayefanya nguvu zangu kuwa mpya
Kama tai ninaruka tena

[Daraja]
Ndani Yako ninaishi, kuhamia na kuwepo
Afya yangu inatoka mkononi Mwako""",

            # 04 Conqueror
            """[Ubeti 1]
Kila kitu kilichozaliwa na Mungu kinashinda dunia
Imani yangu inaniendesha mbele
Ushindi tayari umenipa
Siogopi tena kukabiliana

[Kiitikio]
Mimi ni mshindi, zaidi ya mshindi
Kwa Yeye aliyenipenda
Mimi ni mshindi, zaidi ya mshindi
Ushindi wangu unatoka kwa Bwana

[Ubeti 2]
Hakuna kinachoweza kunitenga na upendo Wake
Wala uzima, wala mauti
Katika mambo haya yote ninashinda
Kwa nguvu za jina Lake Lenye nguvu

[Daraja]
Kama Mungu yupo upande wangu, ni nani dhidi yangu?""",

            # 05 Prosper
            """[Ubeti 1]
Kitabu hiki kisiondoke katika midomo yangu
Natafakari juu yake usiku na mchana
Ndipo nitafanikiwa katika njia zangu
Na baraka inakua ndani yangu

[Kiitikio]
Ninastawi, kwa mkono wa Mungu
Kila ninachofanya kinazaa matunda
Ninastawi, chini ya macho Yake
Maisha yangu yanachanua usiku na mchana

[Ubeti 2]
Mimi ni kama mti uliopandwa karibu na maji
Unaozaa matunda yake kwa wakati wake
Kila ninachoanza kinafanikiwa
Katika amani ya nyumba Yake

[Daraja]
Neno Lako ni taa kwa miguu yangu
Na mwanga kwa njia yangu""",

            # 06 Grateful
            """[Ubeti 1]
Katika mambo yote namshukuru Mungu
Hata ninapokuwa sielewi
Moyo wangu unachagua kumtumainia
Kwa sababu uaminifu Wake hausinyai

[Kiitikio]
Nina shukrani, kwa moyo wangu wote
Kwa upendo na wema Wako
Nina shukrani, Bwana wangu
Milele nitakusifu

[Ubeti 2]
Ninaingia nyumbani Mwako kwa sifa
Kwa shukrani na wimbo

[Daraja]
Mshukuruni Bwana kwa kuwa ni mwema
Kwa kuwa fadhili Zake ni za milele""",

            # 07 Happy
            """[Ubeti 1]
Katika uwepo Wako kuna furaha kamili
Mkono Wako wa kuume kuna furaha ya milele
Furaha yangu haitegemi tena ulimwengu
Bali upendo Wako unaishi ndani yangu

[Kiitikio]
Mimi ni mwenye furaha, kweli mwenye furaha
Furaha yangu inatoka Kwako, Bwana Yesu
Mimi ni mwenye furaha, kweli mwenye furaha
Maisha yangu yamefichwa katika Mungu

[Ubeti 2]
Hata usiku unaponifu��nika
Furaha Yako inanifu��disha kutabasamu

[Daraja]
Katika uwepo Wako kuna furaha kamili
Mkono Wako wa kuume kuna raha milele""",

            # 08 Blessed
            """[Ubeti 1]
Ahimidiwe Mungu aliyenibariki katika Kristo
Kwa kila baraka mbinguni
Neema Yake inanifu��ika leo
Na mwanga Wake unafunuliwa ndani yangu

[Kiitikio]
Nimebarikiwa, nimelindwa
Bwana anachunguza hatua zangu
Nimebarikiwa, ninapendwa
Amani Yake inakaa ndani yangu

[Ubeti 2]
Bwana anibariki na kunilinda
Bwana aangaze uso Wake juu yangu

[Daraja]
Nibariki, Bwana
Na unilinde katika njia Zako""",

            # 09 Amen
            """[Ubeti 1]
Mapenzi Yako yatimizwe
Duniani kama mbinguni
Ufalme Wako uje katika maisha yetu
Katika amani ya milele

[Kiitikio]
Amina, amina, na iwe hivyo
Utukufu ni Wako milele
Amina, amina, na iwe hivyo
Njoo, Bwana, utawale juu yetu

[Ubeti 2]
Ndiyo, njoo Bwana Yesu
Moyo wangu unakungoja kwa imani

[Daraja]
Mapenzi Yako yatimizwe
Ufalme Wako uje sasa""",

            # 10 Shalom
            """[Ubeti 1]
Ninawaachia amani, ninawapa amani Yangu
Alisema Bwana, akiwa amejaa upendo
Si kama vile ulimwengu unavyotoa
Ni amani ya milele

[Kiitikio]
Amani ya Bwana, amani ya Adonai
Amani inayolinda moyo wangu
Amani ya Bwana, amani ya Adonai
Amani inayofukuza hofu

[Ubeti 2]
Bwana aigeuze uso Wake kwangu
Na anipe amani

[Daraja]
Amani ya Mungu inayozidi uelewa wote
Inalinda moyo wangu na mawazo yangu"""
        ]
    }
}


def create_lyrics_files():
    """Create all lyrics files for each language"""

    for lang, data in CONFESSIONS.items():
        lang_dir = os.path.join(BASE_DIR, lang)

        # Create directory if it doesn't exist
        os.makedirs(lang_dir, exist_ok=True)

        print(f"\n{'='*60}")
        print(f"Creating lyrics for {lang}")
        print(f"{'='*60}")

        # Create each file
        for i, (filename, description) in enumerate(data["files"]):
            filepath = os.path.join(lang_dir, filename)
            lyrics = data["lyrics"][i]

            # Write the file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(lyrics)

            print(f"✅ Created: {filename} - {description}")

    print(f"\n{'='*60}")
    print(f"✅ ALL LYRICS FILES CREATED SUCCESSFULLY!")
    print(f"{'='*60}")
    print(f"\nTotal files created: 60 (10 files × 6 languages)")
    print(f"Languages: AR, RU, ZH, HI, TL, SW")
    print(f"\nNext step: Create suno_confessions_generator.py script")


if __name__ == "__main__":
    create_lyrics_files()
