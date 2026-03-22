<template>
  <div class="model-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">模型方案</div>
        <h2 class="scene-title">跨时间建模策略</h2>
        <p class="scene-desc">
          本页说明模型如何将稳定结构、阶段感知和时间一致性组合成一套统一的识别流程。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeModule" :options="moduleOptions" />
      </div>
    </div>

    <div class="architecture-grid">
      <BaseCard title="结构总览" subtitle="模型的高层组成方式" padding="lg">
        <div class="arch-board">
          <div class="arch-input">输入样本</div>
          <div class="branch-row">
            <div class="module-card" :class="{ active: activeModule === 'encoder' }" @click="activeModule = 'encoder'">
              <span>01</span>
              <strong>编码器</strong>
              <p>提取稳定身份表征</p>
            </div>
            <div class="module-card" :class="{ active: activeModule === 'temporal' }" @click="activeModule = 'temporal'">
              <span>02</span>
              <strong>时间模块</strong>
              <p>进行阶段关系建模</p>
            </div>
            <div class="module-card" :class="{ active: activeModule === 'head' }" @click="activeModule = 'head'">
              <span>03</span>
              <strong>识别头</strong>
              <p>完成身份匹配与评分</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="当前模块" :subtitle="currentModule.subtitle" padding="lg">
        <div class="module-detail">
          <div class="module-detail-head">
            <div class="module-badge">{{ currentModule.index }}</div>
            <div class="module-head-copy">
              <div class="module-name">{{ currentModule.title }}</div>
              <div class="module-goal">{{ currentModule.goal }}</div>
            </div>
          </div>

          <div class="module-description">{{ currentModule.description }}</div>

          <div class="module-points">
            <div v-for="(point, idx) in currentModule.points" :key="idx" class="module-point">
              <span>{{ idx + 1 }}</span>
              <div>{{ point }}</div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="bottom-grid">
      <BaseCard title="为什么这样组织" subtitle="模型层面的设计理由" padding="lg">
        <div class="reason-list">
          <div class="reason-item"><strong>稳定编码</strong><p>编码器优先学习变化速度慢于纹理的结构特征。</p></div>
          <div class="reason-item"><strong>时间感知</strong><p>时间模块显式建模阶段关系，而不是简单忽略时间差异。</p></div>
          <div class="reason-item"><strong>识别约束</strong><p>最终识别头让整套方法始终服务于真实身份判别任务。</p></div>
        </div>
      </BaseCard>

      <BaseCard title="讲解提示" subtitle="适合答辩时的简短说明" padding="lg">
        <div class="narration-copy">
          <p>这套模型遵循一个核心原则：即使外观随时间变化，身份本身仍应保持稳定。</p>
          <p>因此结构中同时保留了稳定编码器、时间关系模块以及最终识别头。</p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const moduleOptions = [
  { label: '编码器', value: 'encoder' },
  { label: '时间模块', value: 'temporal' },
  { label: '识别头', value: 'head' }
]

const modules = {
  encoder: {
    index: '01',
    title: '编码器',
    subtitle: '在时间建模前提取稳定结构特征',
    goal: '学习面向身份的稳定表示。',
    description:
      '编码器从预处理后的样本中提取鲁棒特征，尽量降低背景、姿态与局部纹理噪声带来的干扰。',
    points: ['聚焦更稳定的几何与主体结构', '降低对环境噪声的敏感性', '为时间建模准备紧凑特征']
  },
  temporal: {
    index: '02',
    title: '时间模块',
    subtitle: '面向阶段关系的显式建模',
    goal: '在时间漂移下保持身份稳定。',
    description:
      '时间模块连接不同阶段样本，帮助模型学习同一身份如何在多个时期中演化，同时保持一致性。',
    points: ['注入阶段感知监督', '在变化中维持身份一致性', '用显式关系连接相邻阶段']
  },
  head: {
    index: '03',
    title: '识别头',
    subtitle: '最终身份判定与结果打分',
    goal: '输出身份匹配置信度。',
    description:
      '识别头将时间感知后的表征转化为最终匹配结果，用于系统检索排序、案例解释与演示输出。',
    points: ['输出相似度或分类结果', '支持检索排序与可解释展示', '让整条流程回到真实识别目标']
  }
}

const activeModule = ref('encoder')
const currentModule = computed(() => modules[activeModule.value])
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.model-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.architecture-grid,
.bottom-grid,
.branch-row,
.module-points,
.reason-list,
.narration-copy {
  display: grid;
  gap: 20px;
}

.architecture-grid,
.bottom-grid {
  grid-template-columns: 1fr 1fr;
}

.arch-board {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.arch-input,
.module-card,
.module-point,
.reason-item {
  padding: 16px;
  border-radius: 18px;
}

.arch-input {
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
}

.branch-row {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.module-card {
  cursor: pointer;
}

.module-card.active {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 0 0 1px rgba(217, 235, 220, 0.24),
    0 0 18px rgba(150, 182, 159, 0.12),
    0 12px 24px rgba(66, 96, 78, 0.08);
}

.module-card span,
.module-badge,
.module-point span {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--demo-sage-badge-gradient);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 8px 16px rgba(66, 96, 78, 0.14);
  color: var(--demo-sage-ink-strong);
  font-size: 12px;
  font-weight: 800;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.38);
}

.module-card strong,
.module-name,
.reason-item strong {
  display: block;
  margin-top: 10px;
  font-size: 16px;
  color: var(--demo-sage-ink-strong);
}

.module-card p,
.module-goal,
.module-description,
.reason-item p,
.narration-copy p {
  margin-top: 8px;
  line-height: 1.75;
  color: var(--demo-sage-ink-soft);
}

.module-detail-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.module-points {
  grid-template-columns: 1fr;
}

.module-point {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 12px;
}

@media (max-width: 1200px) {
  .architecture-grid,
  .bottom-grid,
  .branch-row {
    grid-template-columns: 1fr;
  }
}
</style>
