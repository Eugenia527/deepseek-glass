import type { BackgroundPreset, AvatarPreset } from "@/store/types";

export const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export const MODELS = [
  {
    id: "deepseek-chat",
    name: "DeepSeek-V3",
    description: "通用对话模型",
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek-R1",
    description: "推理增强模型",
  },
] as const;

export const AVATAR_PRESETS: AvatarPreset[] = [
  { type: "preset", value: "🧑", label: "人物" },
  { type: "preset", value: "👩", label: "女性" },
  { type: "preset", value: "👨‍💻", label: "开发者" },
  { type: "preset", value: "🦊", label: "狐狸" },
  { type: "preset", value: "🐱", label: "猫咪" },
  { type: "preset", value: "🐶", label: "小狗" },
  { type: "preset", value: "🐼", label: "熊猫" },
  { type: "preset", value: "🌟", label: "星星" },
  { type: "preset", value: "🌸", label: "樱花" },
  { type: "preset", value: "🌙", label: "月亮" },
  { type: "preset", value: "🔥", label: "火焰" },
  { type: "preset", value: "💎", label: "钻石" },
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    label: "暮光紫",
  },
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    label: "樱花粉",
  },
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    label: "海洋蓝",
  },
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    label: "翡翠绿",
  },
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    label: "日落橙",
  },
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    label: "薰衣草",
  },
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #0d0d2b 100%)",
    label: "深空黑",
  },
  {
    type: "preset-gradient",
    value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    label: "晨雾白",
  },
];

export const FONT_OPTIONS = [
  { value: "system", label: "系统默认", family: "var(--font-sans)" },
  { value: "serif", label: "衬线体", family: "var(--font-serif)" },
  { value: "mono", label: "等宽体", family: "var(--font-mono)" },
] as const;

export const BUBBLE_STYLES = [
  { value: "bubbles" as const, label: "气泡", icon: "💬" },
  { value: "rounded" as const, label: "圆角", icon: "⬜" },
  { value: "flat" as const, label: "扁平", icon: "▬" },
];

export const SUGGESTED_PROMPTS = [
  "今天有什么有趣的新闻？",
  "帮我写一段 Python 代码",
  "解释一下量子计算的基本原理",
  "推荐几本好看的书",
  "帮我规划一次三天旅行",
  "教我做饭，推荐一道简单菜谱",
];

export const DEFAULT_SETTINGS = {
  apiKey: "",
  userAvatar: AVATAR_PRESETS[3], // 🦊 默认
  chatBackground: BACKGROUND_PRESETS[0], // 暮光紫
  bubbleStyle: "bubbles" as const,
  fontFamily: "system" as const,
  defaultModel: "deepseek-chat" as const,
};
