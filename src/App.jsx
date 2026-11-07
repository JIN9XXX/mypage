import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
      {/* Hero & Intro */}
      <section className="hero">
        <div className="hero-content">
          <h1>阮靖</h1>
          <p className="tagline">AI Agent / Backend Engineer</p>
          <p className="bio">
            AI 应用落地 | Agent 系统架构 | 后端工程
          </p>
          <div className="contact">
            <span>📧 2319297414@qq.com</span>
            <span>📱 17771744836</span>
            <span>🔗 <a href="https://github.com/JIN9XXX" target="_blank">GitHub</a></span>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section">
        <h2>教育背景</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-title">武汉大学</div>
            <div className="timeline-subtitle">国家网络安全学院 | 电子信息硕士</div>
            <div className="timeline-date">2025.09 — 2027.06</div>
          </div>
          <div className="timeline-item">
            <div className="timeline-title">湖北经济学院</div>
            <div className="timeline-subtitle">统计与数学学院 | 统计学学士</div>
            <div className="timeline-date">2020.09 — 2024.06</div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section">
        <h2>实习经历</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-title">中国信息通信研究院</div>
            <div className="timeline-subtitle">AI 应用 / 智能体开发实习生</div>
            <div className="timeline-date">2026.10 — 至今</div>
            <p className="timeline-desc">AI 应用开发与技术研究</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-title">深圳天源迪科有限公司</div>
            <div className="timeline-subtitle">Agent 工程师</div>
            <div className="timeline-date">2026.07 — 2026.08</div>
            <p className="timeline-desc">
              开发通用任务执行 Agent（Agent Harness）
              <br/>
              技术栈：LangGraph、FastAPI、Redis、Milvus、Kafka
              <br/>
              核心功能：任务规划、虚拟文件系统、子 Agent 委派、上下文管理、可插拔中间件、Skills 技能系统、记忆管理、安全沙箱、链路追踪
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section">
        <h2>项目经历</h2>
        <div className="projects-grid">
          <div className="project-card">
            <div className="project-title">通用任务执行 Agent（Agent Harness）</div>
            <div className="project-meta">LangGraph | FastAPI | Redis | Milvus | Kafka</div>
            <p className="project-desc">
              多层级 Agent 调度系统，支持任务规划、虚拟文件系统、子 Agent 委派、上下文管理、可插拔中间件、Skills 技能系统、记忆管理、安全沙箱、链路追踪
            </p>
          </div>
          <div className="project-card">
            <div className="project-title">谷粒商城分布式电商交易平台</div>
            <div className="project-meta">Spring Cloud Alibaba | Redis | RabbitMQ | Elasticsearch</div>
            <p className="project-desc">
              完整的微服务电商平台架构，包括商品、订单、支付、库存等核心模块
            </p>
          </div>
          <div className="project-card placeholder">
            <div className="project-title">更多项目</div>
            <p className="project-desc">敬请期待...</p>
          </div>
        </div>
      </section>

      {/* Skills & Certifications */}
      <section className="section">
        <h2>技能与认证</h2>
        <div className="skills">
          <div className="skill-group">
            <h3>AI Agent / LLM</h3>
            <div className="skill-tags">
              <span>LangGraph</span>
              <span>ReAct</span>
              <span>RAG</span>
              <span>FastAPI</span>
              <span>MCP</span>
            </div>
          </div>
          <div className="skill-group">
            <h3>后端工程</h3>
            <div className="skill-tags">
              <span>Spring Cloud Alibaba</span>
              <span>Java</span>
              <span>Python</span>
              <span>Redis</span>
              <span>RabbitMQ</span>
              <span>Elasticsearch</span>
            </div>
          </div>
          <div className="skill-group">
            <h3>认证与奖项</h3>
            <div className="skill-tags">
              <span>网络安全人才能力认证（优秀）</span>
              <span>CCP 证书</span>
              <span>全国大学生数学建模竞赛省二等奖</span>
              <span>美国大学生数学建模竞赛 S 奖</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 阮靖 · AI Agent Developer</p>
      </footer>
    </>
  )
}

export default App
