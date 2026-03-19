<template>
  <div class="intro-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">问题引入</div>
        <h2 class="scene-title">为什么跨时间域识别如此困难？</h2>
        <p class="scene-desc">
          无论目标是非人类生物还是人脸图像，同一个体都会随着时间发生显著外观变化。
          当模型需要跨越不同时间阶段完成身份匹配时，基于同时间分布训练的方法往往会出现明显性能下降。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented
          v-model:value="activeView"
          :options="[
            { label: '综合视图', value: 'all' },
            { label: '非人类生物', value: 'nonhuman' },
            { label: '人脸迁移验证', value: 'human' }
          ]"
        />
      </div>
    </div>

    <div class="hero-grid" :class="{ single: activeView !== 'all' }">
      <BaseCard
        v-if="activeView === 'all' || activeView === 'nonhuman'"
        title="非人类生物跨时间变化"
        subtitle="主任务场景：识别不同时间阶段中的同一非人类个体"
        padding="lg"
      >
        <div class="compare-block">
          <div class="compare-header">
            <div class="compare-title">示例：同一非人类个体在不同年份的外观变化</div>
            <div class="compare-meta">样例物种：棕熊 / 大型哺乳动物</div>
          </div>

          <div class="image-compare-grid">
            <div class="image-card image-card--earlier">
              <div class="image-label">
                <span class="image-phase">早期阶段</span>
                <span class="image-year">2018</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay">
                  <span class="overlay-chip">基准样本</span>
                </div>
                <!-- TODO(real-data): Replace this mock non-human earlier-stage image with a real dataset sample. -->
                <img
                  src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80"
                  alt="nonhuman-2018"
                />
              </div>
            </div>

            <div class="change-arrow">
              <div class="change-arrow-line"></div>
              <div class="change-arrow-core">
                <span>时间变化</span>
              </div>
              <div class="change-arrow-line"></div>
            </div>

            <div class="image-card image-card--later">
              <div class="image-label">
                <span class="image-phase">后期阶段</span>
                <span class="image-year">2022</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay">
                  <span class="overlay-chip overlay-chip--accent">当前样本</span>
                </div>
                <!-- TODO(real-data): Replace this mock non-human later-stage image with a real dataset sample. -->
                <img
                  src="https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80"
                  alt="nonhuman-2022"
                />
              </div>
            </div>
          </div>

          <div class="change-tags">
            <span class="tag">毛发纹理变化</span>
            <span class="tag">姿态变化</span>
            <span class="tag">遮挡干扰</span>
            <span class="tag">拍摄条件变化</span>
            <span class="tag">生长阶段差异</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        v-if="activeView === 'all' || activeView === 'human'"
        title="人脸跨时间变化"
        subtitle="迁移验证场景：年龄变化与跨阶段人脸匹配"
        padding="lg"
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
                <span class="image-year">较早时期</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay">
                  <span class="overlay-chip">参考样本</span>
                </div>
                <!-- TODO(real-data): Replace this mock human earlier-stage face image with a real validation sample. -->
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                  alt="human-earlier"
                />
              </div>
            </div>

            <div class="change-arrow">
              <div class="change-arrow-line"></div>
              <div class="change-arrow-core">
                <span>年龄变化</span>
              </div>
              <div class="change-arrow-line"></div>
            </div>

            <div class="image-card image-card--later">
              <div class="image-label">
                <span class="image-phase">后期阶段</span>
                <span class="image-year">较晚时期</span>
              </div>

              <div class="image-frame">
                <div class="image-overlay">
                  <span class="overlay-chip overlay-chip--accent">目标样本</span>
                </div>
                <!-- TODO(real-data): Replace this mock human later-stage face image with a real validation sample. -->
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80"
                  alt="human-later"
                />
              </div>
            </div>
          </div>

          <div class="change-tags">
            <span class="tag">年龄增长</span>
            <span class="tag">纹理变化</span>
            <span class="tag">表情变化</span>
            <span class="tag">分辨率差异</span>
            <span class="tag">姿态偏移</span>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="insight-grid">
      <BaseCard
        title="核心挑战"
        subtitle="跨时间域识别面临的关键难点"
        padding="lg"
      >
        <div class="challenge-list">
          <div class="challenge-item">
            <div class="challenge-index">01</div>
            <div class="challenge-content">
              <strong>时间漂移导致外观分布发生变化</strong>
              <p>
                同一身份在不同时间阶段不再保持稳定视觉特征，训练分布与测试分布之间会出现明显偏移。
              </p>
            </div>
          </div>

          <div class="challenge-item">
            <div class="challenge-index">02</div>
            <div class="challenge-content">
              <strong>未见未来阶段更难泛化</strong>
              <p>
                任务要求在训练阶段未出现过的时间片段上完成匹配，这会显著削弱普通同域识别流程的效果。
              </p>
            </div>
          </div>

          <div class="challenge-item">
            <div class="challenge-index">03</div>
            <div class="challenge-content">
              <strong>非人类生物与人脸之间存在域差异</strong>
              <p>
                主任务与迁移验证来自不同视觉域，因此模型表征既要稳定，又要具备良好的可迁移性。
              </p>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="项目思路"
        subtitle="围绕赛题构建完整展示逻辑"
        padding="lg"
      >
        <div class="strategy-list">
          <div class="strategy-item">
            <span>主任务</span>
            <strong>非人类生物跨时间个体识别</strong>
          </div>
          <div class="strategy-item">
            <span>验证方式</span>
            <strong>人脸公开数据迁移验证</strong>
          </div>
          <div class="strategy-item">
            <span>方法重点</span>
            <strong>显式时间建模与稳定结构表征</strong>
          </div>
          <div class="strategy-item">
            <span>系统目标</span>
            <strong>在未来时间阶段依然保持有效识别能力</strong>
          </div>
        </div>

        <div class="conclusion-box">
          跨时间域识别并不只是普通检索，而是要同时平衡
          <strong> 时间变化、域间差异与身份稳定性 </strong>
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
</script>

<style scoped>
.intro-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.scene-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.scene-heading {
  max-width: 780px;
}

.scene-eyebrow {
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.scene-title {
  margin: 0;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
}

.scene-desc {
  margin: 10px 0 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.7;
  color: #64748b;
}

.scene-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.hero-grid.single {
  grid-template-columns: 1fr;
}

.hero-grid.single .compare-block {
  max-width: 980px;
  margin: 0 auto;
}

.compare-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.compare-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compare-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.compare-meta {
  font-size: 12px;
  color: #64748b;
}

.image-compare-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.hero-grid.single .image-compare-grid {
  max-width: 920px;
  margin: 0 auto;
}

.image-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
}

.image-card--earlier {
  border-color: #dbeafe;
}

.image-card--later {
  border-color: #cbd5e1;
}

.image-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 0;
}

.image-phase {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.image-year {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #0f172a;
  font-size: 12px;
  font-weight: 700;
}

.image-frame {
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 22px;
  left: 22px;
  z-index: 1;
}

.image-card img {
  width: 100%;
  display: block;
  aspect-ratio: 4 / 3;
  max-height: 300px;
  height: auto;
  object-fit: cover;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 24px;
}

.overlay-chip {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.95);
  backdrop-filter: blur(8px);
  color: #334155;
  font-size: 11px;
  font-weight: 700;
}

.overlay-chip--accent {
  background: rgba(15, 23, 42, 0.88);
  border-color: rgba(15, 23, 42, 0.9);
  color: #ffffff;
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
  background: linear-gradient(
    180deg,
    rgba(148, 163, 184, 0.06),
    rgba(148, 163, 184, 0.95),
    rgba(148, 163, 184, 0.06)
  );
}

.change-arrow-core {
  min-width: 96px;
  min-height: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px dashed #cbd5e1;
  border-radius: 999px;
  background: radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%);
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.change-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
}

.insight-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
}

.challenge-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.challenge-item {
  display: flex;
  gap: 14px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.challenge-index {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #0f172a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.challenge-content strong {
  display: block;
  font-size: 15px;
  color: #0f172a;
}

.challenge-content p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.strategy-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.strategy-item span {
  font-size: 12px;
  color: #64748b;
}

.strategy-item strong {
  font-size: 15px;
  color: #0f172a;
}

.conclusion-box {
  margin-top: 16px;
  padding: 16px 18px;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #eff6ff 100%);
  font-size: 13px;
  line-height: 1.8;
  color: #334155;
}

@media (max-width: 1200px) {
  .hero-grid,
  .insight-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .scene-top {
    flex-direction: column;
    align-items: stretch;
  }

  .scene-title {
    font-size: 24px;
  }

  .image-compare-grid {
    grid-template-columns: 1fr;
  }

  .change-arrow {
    flex-direction: row;
    gap: 8px;
  }

  .change-arrow-line {
    width: 100%;
    min-height: 1px;
    height: 1px;
  }

  .change-arrow-core {
    min-width: 100%;
    min-height: 46px;
    border-radius: 16px;
  }

  .image-card img {
    max-height: none;
  }
}
</style>
