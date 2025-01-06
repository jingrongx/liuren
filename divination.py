from lunar_python import Lunar
from datetime import datetime, timedelta
import tkinter as tk
from tkinter import ttk
from tkcalendar import Calendar
from PIL import Image, ImageTk
import logging
import os
import sys

# Remove logging configuration
# logging.basicConfig(
#     filename='divination.log',
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     encoding='utf-8'
# )

# 定义卦象列表
gua_list = [
    {"result": "大安", "desc": "大吉，诸事顺利", "gua": "震", "element": "木"},
    {"result": "留连", "desc": "小凶，事情拖延", "gua": "巽", "element": "木"},
    {"result": "速喜", "desc": "中吉，快速成功", "gua": "离", "element": "火"},
    {"result": "赤口", "desc": "大凶，口舌是非", "gua": "兑", "element": "金"},
    {"result": "小吉", "desc": "小吉，平稳顺利", "gua": "坎", "element": "水"},
    {"result": "空亡", "desc": "大凶，诸事不顺", "gua": "中", "element": "土"},
    {"result": "病符", "desc": "小凶，健康不佳", "gua": "坤", "element": "土"},
    {"result": "桃花", "desc": "中吉，感情运势", "gua": "艮", "element": "土"},
    {"result": "天德", "desc": "大吉，贵人相助", "gua": "乾", "element": "金"}
]

def is_chinese(char):
    """判断是否为中文字符"""
    return '\u4e00' <= char <= '\u9fff'

def get_gua_index(step1, step2, step3):
    """根据三个步骤的值计算卦象"""
    # 第一步
    month_index = (step1 - 1) % len(gua_list)
    print(f"1. 根据第一步计算：从 [大安] 开始，数第 {step1} 个，得到：[{gua_list[month_index]['result']}]，{gua_list[month_index]['desc']}")

    # 第二步
    day_index = (month_index + step2 - 1) % len(gua_list)
    print(f"2. 根据第二步计算：从 [{gua_list[month_index]['result']}] 开始，数第 {step2} 个，得到：[{gua_list[day_index]['result']}]，{gua_list[day_index]['desc']}")

    # 第三步
    final_index = (day_index + step3 - 1) % len(gua_list)
    print(f"3. 根据第三步计算：从 [{gua_list[day_index]['result']}] 开始，数第 {step3} 个，得到：[{gua_list[final_index]['result']}]，{gua_list[final_index]['desc']}")

    return final_index

def get_lunar_time(date=None):
    """获取指定时间的农历表示"""
    now = date if date else datetime.now()
    lunar = Lunar.fromDate(now)
    return lunar.getMonth(), lunar.getDay(), now.hour

def get_shichen_number(hour):
    """
    将时辰转换为对应的数字(1-12)
    """
    # 使用Lunar模块获取时辰
    lunar = Lunar.fromDate(datetime.now().replace(hour=hour))
    zhi = lunar.getTimeZhi()
    
    # 时辰对应表
    zhi_map = {
        "子": 1, "丑": 2, "寅": 3, "卯": 4,
        "辰": 5, "巳": 6, "午": 7, "未": 8,
        "申": 9, "酉": 10, "戌": 11, "亥": 12
    }
    return zhi_map.get(zhi, 1)

def get_shichen_name(hour):
    """获取时辰名称"""
    lunar = Lunar.fromDate(datetime.now().replace(hour=hour))
    return f"{lunar.getTimeZhi()}时"

def get_future_gua(days=3):
    """获取未来几天的时辰吉凶"""
    results = []
    for day in range(days):
        date = datetime.now() + timedelta(days=day)
        lunar_month, lunar_day, _ = get_lunar_time(date)
        day_results = []
        for hour in range(0, 24, 2):  # 每2小时一个时辰
            # 移除特殊处理23点的情况，直接使用当前小时
            gua_index = get_gua_index(lunar_month, lunar_day, get_shichen_number(hour))
            gua = gua_list[gua_index]
            day_results.append({
                "time": f"{hour:02d}:00-{(hour+2)%24:02d}:00",
                "gua": gua["result"],
                "desc": gua["desc"]
            })
        results.append({
            "date": date.strftime("%Y-%m-%d"),
            "times": day_results
        })
    return results

def update_result(event=None, use_strokes=False):
    """实时更新占卜结果"""
    global date_entry, time_var, char_entry1, char_entry2, char_entry3, result_text
    
    # 获取输入值
    date_str = date_entry.get()
    time_str = time_var.get()
    # 注释掉汉字输入相关变量
    # char1 = char_entry1.get()
    # char2 = char_entry2.get()
    # char3 = char_entry3.get()
    
    # 清空结果
    result_text.delete(1.0, tk.END)
    
    try:
        # 解析日期，设定时间为当前时间
        date = datetime.strptime(date_str, "%Y-%m-%d")
        current_time = datetime.now()
        date = date.replace(hour=current_time.hour, minute=current_time.minute, second=current_time.second)
        lunar_month, lunar_day, _ = get_lunar_time(date)
        
        # 计算时辰
        if time_str == "当前":
            hour = current_time.hour
            step3 = get_shichen_number(hour)
            time_name = get_shichen_name(hour)
        else:
            # 根据时辰名称获取对应数字
            time_map = {
                "子": 1, "丑": 2, "寅": 3, "卯": 4,
                "辰": 5, "巳": 6, "午": 7, "未": 8,
                "申": 9, "酉": 10, "戌": 11, "亥": 12
            }
            step3 = time_map.get(time_str[0], 1)
            time_name = time_str
        
        # 计算步骤
        step1 = lunar_month
        step2 = lunar_day
        
        # 注释掉笔画计算相关代码
        """
        if use_strokes and char1 and char2 and char3:
            step1 = get_stroke_count(char1)
            step2 = get_stroke_count(char2)
            step3 = get_stroke_count(char3)
            # 添加笔画计算说明
            result_text.insert(tk.END, f"汉字笔画计算：\n")
            result_text.insert(tk.END, f"'{char1}' 的笔画数：{step1}\n")
            result_text.insert(tk.END, f"'{char2}' 的笔画数：{step2}\n")
            result_text.insert(tk.END, f"'{char3}' 的笔画数：{step3}\n\n")
        """
        
        # 获取卦象
        gua_index = get_gua_index(step1, step2, step3)
        gua = gua_list[gua_index]
        
        # 获取农历日期
        lunar = Lunar.fromDate(date)
        lunar_date = f"{lunar.getYearInChinese()}年 {lunar.getMonthInChinese()}月 {lunar.getDayInChinese()}日"
        
        # 显示结果
        result_text.insert(tk.END, f"公历日期：{date.strftime('%Y-%m-%d %H:%M:%S')}\n")
        if time_str == "当前":
            result_text.insert(tk.END, f"当前时间：{current_time.strftime('%H:%M:%S')}\n")
        result_text.insert(tk.END, f"农历日期：{lunar_date}\n")
        result_text.insert(tk.END, f"时辰：{time_name}\n\n")
        
        result_text.insert(tk.END, f"结果：{gua['result']}\n")
        result_text.insert(tk.END, f"描述：{gua['desc']}\n")
        result_text.insert(tk.END, f"卦象：{gua['gua']}\n")
        result_text.insert(tk.END, f"五行：{gua['element']}\n\n")
        
        # 计算每一步的结果索引
        step1_index = (step1 - 1) % len(gua_list)
        step2_index = (step1_index + step2 - 1) % len(gua_list)
        step3_index = (step2_index + step3 - 1) % len(gua_list)
        
        result_text.insert(tk.END, f"推算过程：\n")
        result_text.insert(tk.END, f"1. 从 [大安] 开始，数第 {step1} 个，得到：[{gua_list[step1_index]['result']}]，{gua_list[step1_index]['desc']}，{gua_list[step1_index]['gua']}，{gua_list[step1_index]['element']}\n")
        result_text.insert(tk.END, f"2. 从 [{gua_list[step1_index]['result']}] 开始，数第 {step2} 个，得到：[{gua_list[step2_index]['result']}]，{gua_list[step2_index]['desc']}，{gua_list[step2_index]['gua']}，{gua_list[step2_index]['element']}\n")
        result_text.insert(tk.END, f"3. 从 [{gua_list[step2_index]['result']}] 开始，数第 {step3} 个，得到：[{gua_list[step3_index]['result']}]，{gua_list[step3_index]['desc']}，{gua_list[step3_index]['gua']}，{gua_list[step3_index]['element']}\n")
        
    except Exception as e:
        result_text.insert(tk.END, f"错误：{str(e)}")

def create_gui():
    """创建图形界面"""
    global date_entry, time_var, char_entry1, char_entry2, char_entry3, result_text
    
    # 创建主窗口
    root = tk.Tk()
    root.title("六壬占卜")
    root.geometry("1366x900")
    root.configure(bg="#f0f0f0")
    
    # 创建主布局容器
    main_frame = ttk.Frame(root)
    main_frame.pack(fill="both", expand=True, padx=10, pady=10)

    # 创建左侧容器
    left_frame = ttk.Frame(main_frame)
    left_frame.pack(side="left", fill="both", expand=True)

    # 创建顶部标题
    title_frame = ttk.Frame(left_frame)
    title_frame.pack(fill="x", pady=(0, 5))
    ttk.Label(title_frame, text="六壬占卜", font=("微软雅黑", 18, "bold")).pack()

    # 创建占卜结果区域
    result_frame = ttk.LabelFrame(left_frame, text="占卜结果")
    result_frame.pack(fill="both", expand=True, pady=5)
    
    # 创建输入面板
    input_frame = ttk.LabelFrame(left_frame, text="输入选项")
    input_frame.pack(fill="x", pady=(0, 5))
    
    # 日期输入
    date_frame = ttk.Frame(input_frame)
    date_frame.pack(fill="x", pady=5)
    ttk.Label(date_frame, text="选择日期：").pack(side="left")
    
    def set_date():
        date_entry.delete(0, tk.END)
        date_entry.insert(0, cal.get_date())
        update_result()
    
    # 创建日历按钮
    cal_btn = ttk.Button(date_frame, text="📅", command=lambda: cal_popup(), width=3)
    cal_btn.pack(side="left", padx=5)
    
    # 日期显示框
    date_entry = ttk.Entry(date_frame, width=12)
    date_entry.pack(side="left", padx=5)
    date_entry.insert(0, datetime.now().strftime("%Y-%m-%d"))
    
    # 日历弹出窗口
    def cal_popup():
        global cal
        top = tk.Toplevel(root)
        top.title("选择日期")
        cal = Calendar(top, selectmode="day", date_pattern="yyyy-mm-dd")
        cal.pack(padx=10, pady=10)
        ttk.Button(top, text="确定", command=lambda: [set_date(), top.destroy()]).pack(pady=5)
    
    # 时辰选择
    time_frame = ttk.Frame(input_frame)
    time_frame.pack(fill="x", pady=5)
    ttk.Label(time_frame, text="选择时辰：").pack(side="left")
    time_var = tk.StringVar(value="当前")
    time_combobox = ttk.Combobox(time_frame, textvariable=time_var, width=8)
    time_combobox['values'] = ("当前", "子时", "丑时", "寅时", "卯时", 
                             "辰时", "巳时", "午时", "未时", 
                             "申时", "酉时", "戌时", "亥时")
    time_combobox.pack(side="left", padx=5)
    
    # 注释掉汉字输入相关UI
    """
    # 汉字输入
    char_frame = ttk.Frame(input_frame)
    char_frame.pack(fill="x", pady=5)
    ttk.Label(char_frame, text="输入3个汉字：").pack(side="left")
    char_entry1 = ttk.Entry(char_frame, width=4)
    char_entry1.pack(side="left", padx=2)
    char_entry2 = ttk.Entry(char_frame, width=4)
    char_entry2.pack(side="left", padx=2)
    char_entry3 = ttk.Entry(char_frame, width=4)
    char_entry3.pack(side="left", padx=2)
    
    # 添加确认按钮
    confirm_btn = ttk.Button(char_frame, text="确认计算笔画", 
                            command=lambda: update_result(use_strokes=True))
    confirm_btn.pack(side="left", padx=5)
    """

    # 注释掉汉字输入框的事件绑定
    """
    char_entry1.bind("<KeyRelease>", update_result)
    char_entry2.bind("<KeyRelease>", update_result)
    char_entry3.bind("<KeyRelease>", update_result)
    """
    
    # 修改输入框事件绑定，移除实时更新
    date_entry.bind("<KeyRelease>", update_result)
    time_combobox.bind("<<ComboboxSelected>>", update_result)
    
    # 使用ttk主题
    style = ttk.Style()
    style.configure("TFrame", background="#f0f0f0")
    style.configure("TLabelFrame", background="#ffffff", font=("微软雅黑", 12))
    style.configure("TButton", font=("微软雅黑", 12), padding=5)
    
    # 创建右侧容器
    right_frame = ttk.Frame(main_frame)
    right_frame.pack(side="right", fill="y")
    
    # 创建结果文本框
    result_text = tk.Text(result_frame, height=15, width=70, font=("微软雅黑", 12),
                         wrap=tk.WORD, bg="#ffffff", fg="#333333")
    result_text.pack(padx=10, pady=10, fill="both", expand=True)
    
    # 创建卦象表格区域
    gua_frame = ttk.LabelFrame(right_frame, text="卦象对照表")
    gua_frame.pack(fill="both", padx=10, pady=5)
    
    # 创建表格
    columns = ("result", "desc", "gua", "element")
    gua_table = ttk.Treeview(gua_frame, columns=columns, show="headings", height=9)
    
    # 设置表头
    gua_table.heading("result", text="结果")
    gua_table.heading("desc", text="描述")
    gua_table.heading("gua", text="卦象")
    gua_table.heading("element", text="五行")
    
    # 设置列宽
    gua_table.column("result", width=80, anchor="center")
    gua_table.column("desc", width=200, anchor="center")
    gua_table.column("gua", width=80, anchor="center")
    gua_table.column("element", width=80, anchor="center")
    
    # 插入数据
    for gua in gua_list:
        gua_table.insert("", "end", values=(gua["result"], gua["desc"], gua["gua"], gua["element"]))
    
    gua_table.pack(fill="both", padx=10, pady=10)
    
    # 创建时辰对照表区域
    time_table_frame = ttk.LabelFrame(right_frame, text="时辰对照表")
    time_table_frame.pack(fill="both", padx=10, pady=5)
    
    time_text = tk.Text(time_table_frame, height=3, width=70, font=("微软雅黑", 12),
                       wrap=tk.WORD, bg="#ffffff", fg="#333333")
    time_text.pack(padx=10, pady=10)
    
    # 填充时辰对照表
    time_text.insert(tk.END, "子时(23-1) 丑时(1-3) 寅时(3-5) 卯时(5-7)\n")
    time_text.insert(tk.END, "辰时(7-9) 巳时(9-11) 午时(11-13) 未时(13-15)\n")
    time_text.insert(tk.END, "申时(15-17) 酉时(17-19) 戌时(19-21) 亥时(21-23)\n")
    time_text.configure(state="disabled")
    
    # 创建三天时辰吉凶表格
    future_frame = ttk.LabelFrame(left_frame, text="三天时辰吉凶速查表")
    future_frame.pack(fill="both", expand=True, pady=5)
    
    # 创建表格
    future_columns = ("date", "time", "gua", "desc")
    future_table = ttk.Treeview(future_frame, columns=future_columns, show="headings", height=50)
    
    # 设置表头
    future_table.heading("date", text="日期")
    future_table.heading("time", text="时辰")
    future_table.heading("gua", text="结果")
    future_table.heading("desc", text="描述")
    
    # 设置列宽
    future_table.column("date", width=170, anchor="center")
    future_table.column("time", width=100, anchor="center")
    future_table.column("gua", width=80, anchor="center")
    future_table.column("desc", width=250, anchor="center")
    
    # 设置表格样式
    style = ttk.Style()
    style.configure("Treeview", rowheight=25, font=("微软雅黑", 12))
    style.configure("Treeview.Heading", font=("微软雅黑", 12, "bold"))
    
    # 填充数据
    future_results = get_future_gua()
    for day in future_results:
        date = datetime.strptime(day["date"], "%Y-%m-%d")
        lunar = Lunar.fromDate(date)
        lunar_date = f"{lunar.getYearInChinese()}年 {lunar.getMonthInChinese()}月 {lunar.getDayInChinese()}日"
        
        for time in day["times"]:
            # 获取时辰名称
            hour = int(time["time"].split(":")[0])
            time_name = ["子", "丑", "寅", "卯", "辰", "巳", 
                        "午", "未", "申", "酉", "戌", "亥"][(hour // 2) % 12] + "时"
            
            # 插入数据并设置颜色
            item_id = future_table.insert("", "end", values=(
                lunar_date,
                time_name,
                time["gua"],
                time["desc"]
            ))
            
            # 如果包含"吉"字，设置红色字体
            if "吉" in time["desc"]:
                future_table.tag_configure("good", foreground="red")
                future_table.item(item_id, tags=("good",))
    
    # 添加滚动条
    scrollbar = ttk.Scrollbar(future_frame, orient="vertical", command=future_table.yview)
    future_table.configure(yscrollcommand=scrollbar.set)
    scrollbar.pack(side="right", fill="y")
    future_table.pack(fill="both", expand=True, padx=10, pady=10)
    
    # 创建按钮区域
    btn_frame = ttk.Frame(root)
    btn_frame.pack(fill="x", padx=10, pady=10)
    
    def refresh():
        result_text.delete(1.0, tk.END)
        update_result()
    
    refresh_btn = ttk.Button(btn_frame, text="重新占卜", command=refresh, 
                            style="TButton")
    refresh_btn.pack(side="right", padx=5)
    
    try:
        # 创建图片展示区域
        img_frame = ttk.LabelFrame(right_frame, text="抖音扫码关注进群")
        img_frame.pack(fill="both", padx=10, pady=5)
        
        # 获取可能的图片路径
        possible_paths = [
            # 方式1: 相对于执行文件的路径
            os.path.join(os.path.dirname(sys.executable), "DouYinQRCodeID.png"),
            # 方式2: 相对于脚本的路径
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "DouYinQRCodeID.png"),
            # 方式3: 相对于当前工作目录的路径
            os.path.join(os.getcwd(), "DouYinQRCodeID.png")
        ]
        
        img_loaded = False
        for img_path in possible_paths:
            print(f"尝试加载图片: {img_path}")  # 调试信息
            if os.path.exists(img_path):
                img = Image.open(img_path)
                img = img.resize((200, 230), Image.Resampling.LANCZOS)
                img_tk = ImageTk.PhotoImage(img)
                img_label = ttk.Label(img_frame, image=img_tk)
                img_label.image = img_tk  # 保持引用
                img_label.pack(padx=10, pady=10)
                img_loaded = True
                print(f"成功加载图片: {img_path}")
                break
                
        if not img_loaded:
            print("未能找到图片文件")
            ttk.Label(img_frame, 
                     text="抖音ID：1036110286\n星樞引路", 
                     font=("微软雅黑", 12),
                     justify="center").pack(padx=10, pady=10)
            
    except Exception as e:
        print(f"加载图片失败: {e}")
        ttk.Label(img_frame, 
                 text="抖音ID：1036110286\n星樞引路", 
                 font=("微软雅黑", 12),
                 justify="center").pack(padx=10, pady=10)
    
    return root, result_text

def main():
    """主程序入口"""
    global result_text
    root, result_text = create_gui()
    update_result()  # 初始化显示结果
    root.mainloop()

if __name__ == "__main__":
    main()