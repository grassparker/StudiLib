import './App.css'

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>Studilib is changing. Studilib 正在改变。</h1>
          <p>We're rebuilding from the ground up with a new vision.</p>
          <p>我们正在以全新的理念重新构建。</p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>What's coming / 即将推出</h2>
          <ul>
            <li>📥 Dump your tasks for the week, no structure needed / 随意输入本周任务，无需整理</li>
            <li>🤖 AI quietly plans your days in the background / AI 在后台悄悄为你规划每一天</li>
            <li>🌅 Every morning, a gentle suggestion — not a mandate / 每天早上，温柔的建议，而不是命令</li>
            <li>😴 Grind day? Chill day? YouTube day? We adapt. / 拼命日？放松日？YouTube日？我们都能适应。</li>
            <li>🌿 Stuck too long? We'll tell you to touch grass. / 卡太久了？我们会提醒你去透透气。</li>
            <li>🧠 In flow? We leave you alone. / 进入状态了？我们不打扰你。</li>
          </ul>
        </div>

        <div id="social">
          <h2>The idea / 核心理念</h2>
          <p>
            Most productivity apps are built for your best days. Studilib is built for every day — the weird ones, the slow ones, the ones where you just want to draw something.
          </p>
          <p>
            大多数生产力应用是为你状态最好的日子设计的。Studilib 为每一天而生——那些奇怪的日子、缓慢的日子、只想画点东西的日子。
          </p>
          <br />
          <a href="https://github.com/grassparker/StudiLib" target="_blank">
            Follow development on GitHub / 在 GitHub 上关注开发进度 →
          </a>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App