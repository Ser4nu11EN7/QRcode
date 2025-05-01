// src/app/page.tsx
'use client'; // 必须标记为客户端组件

import React, { useState } from 'react'; // 导入 React 和 useState Hook
import QRCode from 'qrcode'; // 导入 qrcode 库
import styles from './HomePage.module.css'; // 导入 CSS Module

export default function HomePage() {
  // --- State Hooks ---
  const [text, setText] = useState<string>(''); // 用于存储用户输入的文本
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // 用于存储生成的 QR Code Data URL
  const [isLoading, setIsLoading] = useState<boolean>(false); // 用于控制按钮的加载状态
  const [error, setError] = useState<string | null>(null); // 用于显示错误信息

  // --- Event Handlers ---
  // 当文本区域内容改变时调用
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value); // 更新文本 state
    setError(null); // 清除之前的错误信息
    setQrCodeUrl(null); // 清除之前生成的二维码，因为输入变了
  };

  // 点击“生成”按钮时调用
  const generateQrCode = async () => {
    // 简单验证：确保输入不为空或仅包含空格
    if (!text.trim()) {
      setError('Please enter some text.'); // 设置错误信息
      setQrCodeUrl(null); // 确保没有旧的二维码显示
      return; // 提前退出函数
    }

    setIsLoading(true); // 开始加载，禁用按钮
    setError(null); // 清除之前的错误
    setQrCodeUrl(null); // 清除之前的二维码

    try {
      // --- 核心：使用 qrcode 库生成 Data URL ---
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H', // 容错级别设为最高 (H)
        type: 'image/png',        // 输出 PNG 格式
        margin: 1,                // 二维码边距 (模块数)
        width: 256                // 指定输出图片的宽度 (像素)，有助于扫描
      });
      setQrCodeUrl(url); // 成功生成，将 Data URL 保存到 state
    } catch (err) {
      // 如果生成过程中发生错误
      console.error('QR Code generation error:', err); // 在控制台打印错误详情
      setError('Failed to generate QR code. Please try again.'); // 设置用户可见的错误信息
    } finally {
      // 无论成功或失败，最终都要结束加载状态
      setIsLoading(false); // 重新启用按钮
    }
  };

  // --- JSX (组件的 UI 结构) ---
  return (
    // 使用 styles.container 应用整体布局和背景色
    <div className={styles.container}>
      {/* 使用 styles.card 创建白色卡片容器 */}
      <div className={styles.card}>
        {/* 使用 styles.title 应用标题样式 */}
        <h1 className={styles.title}>Quick Text-to-QR Code</h1>

        {/* 使用 styles.textarea 应用文本区域样式 */}
        <textarea
          className={styles.textarea}
          value={text} // 绑定 state 中的 text
          onChange={handleTextChange} // 绑定文本变化事件处理器
          placeholder="Enter text here..." // 提示文字
          rows={5} // 默认显示的行数
        />

        {/* 使用 styles.button 应用按钮样式 */}
        <button
          className={styles.button}
          onClick={generateQrCode} // 绑定点击事件处理器
          disabled={isLoading} // 当 isLoading 为 true 时禁用按钮
        >
          {isLoading ? 'Generating...' : 'Generate QR Code'} {/* 根据加载状态显示不同文本 */}
        </button>

        {/* 如果有错误信息，则显示，并应用 styles.error 样式 */}
        {error && <p className={styles.error}>{error}</p>}

        {/* 如果 qrCodeUrl 存在 (即已生成)，则显示二维码区域 */}
        {qrCodeUrl && (
          // 使用 styles.qrCodeArea 应用二维码容器样式
          <div className={styles.qrCodeArea}>
            {/* 使用 styles.qrCodeImage 应用图片样式 */}
            <img
              src={qrCodeUrl} // 图片源为生成的 Data URL
              alt="Generated QR Code" // 图片替代文本
              className={styles.qrCodeImage}
            />
            {/* 下载链接 */}
            <a
              href={qrCodeUrl} // 链接地址也是 Data URL
              download="qrcode.png" // 指定下载的文件名
              className={styles.downloadLink} // 应用下载链接样式
            >
              Download QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
