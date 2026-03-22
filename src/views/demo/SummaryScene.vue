<template>
  <div class="summary-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">总结</div>
        <h2 class="scene-title">项目总结概览</h2>
        <p class="scene-desc">
          本页总结问题定义、方法设计、系统展示以及整套跨时间识别流程的最终价值。
        </p>
      </div>
    </div>

    <div class="hero-message">
      我们将跨时间识别定义为一个同时面对外观漂移、阶段迁移与域变化的一致性问题。
    </div>

    <div class="main-grid">
      <div class="summary-block">
        <div class="summary-icon">01</div>
        <div class="summary-title">任务定义</div>
        <div class="summary-desc">在时间阶段和视觉条件变化下，识别同一主体。</div>
      </div>
      <div class="summary-block">
        <div class="summary-icon">02</div>
        <div class="summary-title">方法逻辑</div>
        <div class="summary-desc">结合预处理、时间结构与稳定表征学习完成建模。</div>
      </div>
      <div class="summary-block">
        <div class="summary-icon">03</div>
        <div class="summary-title">系统结果</div>
        <div class="summary-desc">提供可解释的检索结果、阶段推断与迁移验证展示。</div>
      </div>
    </div>

    <div class="bottom-grid">
      <BaseCard title="主要贡献" subtitle="本项目最终交付的内容" padding="lg">
        <div class="contribution-list">
          <div class="contribution-item"><span class="contribution-index">01</span>构建了完整的跨时间识别演示流程。</div>
          <div class="contribution-item"><span class="contribution-index">02</span>统一串联了主任务与迁移验证两个场景。</div>
          <div class="contribution-item"><span class="contribution-index">03</span>形成了适合竞赛展示的可解释演示逻辑。</div>
        </div>
      </BaseCard>

      <BaseCard title="未来工作" subtitle="下一步可继续推进的方向" padding="lg">
        <div class="future-list">
          <div class="future-item"><strong>数据规模</strong><span>进一步扩展身份覆盖与时间跨度。</span></div>
          <div class="future-item"><strong>困难样本</strong><span>继续提升对姿态、模糊和遮挡的鲁棒性。</span></div>
          <div class="future-item"><strong>系统部署</strong><span>将当前演示流程接入真实检索与服务逻辑。</span></div>
        </div>
      </BaseCard>
    </div>

    <div class="footer-grid">
      <BaseCard title="结束语" subtitle="适合答辩时的最终口播" padding="lg">
        <div class="closing-copy">
          <p>
            本项目不只是静态身份匹配，而是进一步回答：当时间改变外观时，身份如何保持一致。
          </p>
          <p>
            通过稳定结构、阶段感知和时间关系建模的结合，我们为跨时间识别提供了更清晰的实现路径。
          </p>
        </div>
      </BaseCard>

      <div class="closing-box">
        <span>“时间感知下的稳定识别”是本项目的核心表达。</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.summary-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-message,
.main-grid,
.bottom-grid,
.footer-grid,
.contribution-list,
.future-list,
.closing-copy {
  display: grid;
  gap: 20px;
}

.hero-message,
.closing-box {
  padding: 20px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.7;
  color: var(--demo-sage-ink-strong);
}

.main-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.bottom-grid,
.footer-grid {
  grid-template-columns: 1fr 1fr;
}

.summary-block,
.contribution-item,
.future-item {
  padding: 18px;
  border-radius: 20px;
}

.summary-icon,
.contribution-index {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--demo-sage-badge-gradient);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 8px 16px rgba(66, 96, 78, 0.14);
  color: var(--demo-sage-ink-strong);
  font-size: 12px;
  font-weight: 800;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.38);
}

.summary-title {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
}

.summary-desc,
.future-item span,
.closing-copy p {
  margin-top: 8px;
  line-height: 1.75;
  color: var(--demo-sage-ink-soft);
}

.contribution-list,
.future-list,
.closing-copy {
  grid-template-columns: 1fr;
}

.contribution-item {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 14px;
  align-items: start;
}

.future-item strong {
  display: block;
  font-size: 15px;
  color: var(--demo-sage-ink-strong);
}

@media (max-width: 1200px) {
  .main-grid,
  .bottom-grid,
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
