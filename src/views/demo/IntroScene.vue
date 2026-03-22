<template>
  <div class="intro-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">问题引入</div>
        <h2 class="scene-title">为什么跨时间域识别如此困难？</h2>
        <p class="scene-desc">
          无论目标是非人类生物个体还是人脸图像，同一个体都会随着时间发生明显外观变化。
          跨时间识别的难点，在于如何在这种时间漂移下依然保持稳定的身份一致性。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeView" :options="viewOptions" />
      </div>
    </div>

    <div class="hero-grid" :class="{ single: activeView !== 'all' }">
      <BaseCard
        v-if="activeView === 'all' || activeView === 'nonhuman'"
        title="非人类生物跨时间变化"
        subtitle="主任务场景：识别不同年份中的同一非人类个体"
        padding="lg"
        transparent
      >
        <div class="compare-block">
          <div class="compare-header">
            <div class="compare-title">示例：同一非人类个体在不同年份中的外观变化</div>
            <div class="compare-meta">示例物种：大型哺乳动物 / 跨年份观测</div>
          </div>

          <div class="image-compare-grid">
            <div class="image-card image-card--earlier">
              <div class="image-label">
                <span class="image-phase">早期阶段</span>
                <span class="image-year">2018</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay"><span class="overlay-chip">参考样本</span></div>
                <img
                  src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80"
                  alt="nonhuman-2018"
                />
              </div>
            </div>

            <div class="change-arrow">
              <div class="change-arrow-line"></div>
              <div class="change-arrow-core"><span>时间变化</span></div>
              <div class="change-arrow-line"></div>
            </div>

            <div class="image-card image-card--later">
              <div class="image-label">
                <span class="image-phase">后期阶段</span>
                <span class="image-year">2022</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay"><span class="overlay-chip overlay-chip--accent">当前样本</span></div>
                <img
                  src="https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80"
                  alt="nonhuman-2022"
                />
              </div>
            </div>
          </div>

          <div class="change-tags">
            <span class="tag">纹理变化</span>
            <span class="tag">姿态变化</span>
            <span class="tag">遮挡干扰</span>
            <span class="tag">光照变化</span>
            <span class="tag">阶段差异</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        v-if="activeView === 'all' || activeView === 'human'"
        title="人脸迁移验证"
        subtitle="验证场景：年龄变化条件下的人脸身份匹配"
        padding="lg"
        transparent
      >
        <div class="compare-block">
          <div class="compare-header">
            <div class="compare-title">示例：同一人脸个体在年龄增长过程中的外观变化</div>
            <div class="compare-meta">验证数据集：AgeDB / CACD / FG-NET</div>
          </div>

          <div class="image-compare-grid">
            <div class="image-card image-card--earlier">
              <div class="image-label">
                <span class="image-phase">早期阶段</span>
                <span class="image-year">参考时期</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay"><span class="overlay-chip">参考样本</span></div>
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                  alt="human-earlier"
                />
              </div>
            </div>

            <div class="change-arrow">
              <div class="change-arrow-line"></div>
              <div class="change-arrow-core"><span>年龄变化</span></div>
              <div class="change-arrow-line"></div>
            </div>

            <div class="image-card image-card--later">
              <div class="image-label">
                <span class="image-phase">后期阶段</span>
                <span class="image-year">目标时期</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay"><span class="overlay-chip overlay-chip--accent">目标样本</span></div>
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80"
                  alt="human-later"
                />
              </div>
            </div>
          </div>

          <div class="change-tags">
            <span class="tag">年龄增长</span>
            <span class="tag">纹理漂移</span>
            <span class="tag">表情变化</span>
            <span class="tag">分辨率差异</span>
            <span class="tag">姿态偏移</span>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="insight-grid">
      <BaseCard title="核心挑战" subtitle="跨时间识别面临的主要难点" padding="lg" transparent>
        <div class="challenge-list">
          <div class="challenge-item">
            <div class="challenge-index">01</div>
            <div class="challenge-content">
              <strong>时间漂移会改变外观分布</strong>
              <p>同一身份在不同阶段不再保持完全一致的视觉表现。</p>
            </div>
          </div>
          <div class="challenge-item">
            <div class="challenge-index">02</div>
            <div class="challenge-content">
              <strong>未见未来阶段更难泛化</strong>
              <p>模型必须处理训练阶段没有直接见过的时间区间。</p>
            </div>
          </div>
          <div class="challenge-item">
            <div class="challenge-index">03</div>
            <div class="challenge-content">
              <strong>主任务与验证场景存在域差异</strong>
              <p>表征既要稳定，也要在不同任务场景之间保持可迁移性。</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="项目思路" subtitle="项目如何回应这些挑战" padding="lg" transparent>
        <div class="strategy-list">
          <div class="strategy-item"><span>主任务</span><strong>非人类生物跨时间个体识别</strong></div>
          <div class="strategy-item"><span>验证方式</span><strong>人脸公开数据迁移验证</strong></div>
          <div class="strategy-item"><span>方法重点</span><strong>显式时间建模与稳定结构表征</strong></div>
          <div class="strategy-item"><span>系统目标</span><strong>在未来阶段仍保持可靠识别能力</strong></div>
        </div>

        <div class="conclusion-box">
          跨时间识别并不只是检索问题，它需要同时平衡
          <strong>时间变化、域差异与身份一致性</strong>
          这三类核心因素。
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const activeView = ref('all')

const viewOptions = [
  { label: '综合视图', value: 'all' },
  { label: '非人类生物', value: 'nonhuman' },
  { label: '人脸迁移验证', value: 'human' }
]
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.intro-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-grid,
.insight-grid {
  display: grid;
  gap: 20px;
}

.hero-grid {
  grid-template-columns: 1fr 1fr;
}

.hero-grid.single,
.insight-grid {
  grid-template-columns: 1fr;
}

.compare-block,
.challenge-list,
.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.compare-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.46);
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(196, 221, 201, 0.24), transparent 42%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.2));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    0 14px 30px rgba(66, 96, 78, 0.08);
}

.compare-title,
.challenge-content strong {
  color: var(--demo-sage-ink-strong);
  font-size: 17px;
  font-weight: 700;
}

.compare-meta,
.challenge-content p {
  color: var(--demo-sage-ink-soft);
  line-height: 1.75;
}

.compare-meta {
  font-size: 13px;
}

.image-compare-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px minmax(0, 1fr);
  gap: 20px;
  align-items: stretch;
}

.image-card,
.challenge-item,
.strategy-item,
.conclusion-box {
  padding: 14px 16px;
  border-radius: 20px;
}

.image-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.image-phase {
  color: var(--demo-sage-accent-strong);
  font-size: 13px;
  font-weight: 700;
}

.image-year,
.overlay-chip,
.tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.image-year,
.overlay-chip,
.tag {
  background: rgba(255, 255, 255, 0.34);
  color: var(--demo-sage-accent);
}

.overlay-chip--accent {
  background: var(--demo-sage-gradient);
  color: #fff;
}

.image-card {
  position: relative;
  overflow: hidden;
}

.image-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: radial-gradient(circle at top, rgba(194, 221, 199, 0.2), transparent 52%);
  pointer-events: none;
}

.image-frame {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 10px 24px rgba(66, 96, 78, 0.1);
}

.image-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
}

.image-card img {
  width: 100%;
  display: block;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 16px;
  transform: scale(1.01);
  filter: saturate(0.94) contrast(1.02);
}

.change-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.change-arrow-line {
  width: 1px;
  flex: 1;
  min-height: 30px;
  background: var(--demo-sage-divider);
}

.change-arrow-core,
.challenge-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--demo-sage-gradient);
  color: var(--demo-sage-ink-strong);
  font-weight: 700;
}

.change-arrow-core {
  min-width: 96px;
  min-height: 96px;
  padding: 0 14px;
  font-size: 12px;
  text-align: center;
  box-shadow:
    0 10px 24px rgba(66, 96, 78, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.change-arrow-core span {
  color: var(--demo-sage-ink-strong) !important;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.38);
}

.change-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 4px;
}

.tag {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 6px 14px rgba(66, 96, 78, 0.06);
}

.challenge-item {
  display: flex;
  gap: 14px;
}

.challenge-index {
  width: 34px;
  height: 34px;
  font-size: 12px;
  flex-shrink: 0;
  background: var(--demo-sage-badge-gradient);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 8px 16px rgba(66, 96, 78, 0.14);
}
.strategy-item span {
  color: var(--demo-sage-ink-faint);
  font-size: 12px;
  font-weight: 700;
}

.strategy-item strong {
  display: block;
  margin-top: 6px;
  color: var(--demo-sage-ink-strong);
  font-size: 15px;
}

.conclusion-box {
  color: rgba(49, 71, 58, 0.84);
  line-height: 1.8;
}

@media (max-width: 1200px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .compare-header {
    padding: 16px;
    border-radius: 18px;
  }

  .image-compare-grid {
    grid-template-columns: 1fr;
  }

  .change-arrow {
    flex-direction: row;
  }

  .change-arrow-line {
    width: 100%;
    height: 1px;
    min-height: 1px;
  }

  .change-arrow-core {
    min-width: 100%;
    min-height: 48px;
    border-radius: 16px;
  }
}
</style>
