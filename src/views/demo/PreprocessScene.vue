<template>
  <div class="preprocess-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">预处理流程</div>
        <h2 class="scene-title">面向跨时间识别的数据预处理流程</h2>
        <p class="scene-desc">
          预处理阶段的目标不是简单清洗图像，而是围绕跨时间识别任务，构建更稳定、
          更可用于建模的训练样本基础。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeStep" :options="stepOptions" />
      </div>
    </div>

    <div class="overview-grid">
      <BaseCard
        title="流程总览"
        subtitle="从原始采集到可用于时间建模的训练样本"
        padding="lg"
        transparent
      >
        <div class="pipeline-row">
          <div
            v-for="step in steps"
            :key="step.key"
            class="pipeline-step"
            :class="{ active: activeStep === step.key }"
            @click="activeStep = step.key"
          >
            <span>{{ step.index }}</span>
            <strong>{{ step.title }}</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="核心目标"
        subtitle="预处理阶段需要先解决的问题"
        padding="lg"
        transparent
      >
        <div class="goal-list">
          <div class="goal-item">统一尺度、姿态与取景范围</div>
          <div class="goal-item">去除低质量与低价值样本</div>
          <div class="goal-item">补充身份与时间阶段标注</div>
          <div class="goal-item">构建显式时间关系供后续训练</div>
        </div>
      </BaseCard>
    </div>

    <div class="detail-grid">
      <BaseCard title="当前步骤" :subtitle="currentStep.subtitle" padding="lg" transparent>
        <div class="step-detail">
          <div class="step-header">
            <div class="step-index-badge">{{ currentStep.index }}</div>
            <div class="step-header-copy">
              <div class="step-name">{{ currentStep.title }}</div>
              <div class="step-purpose">{{ currentStep.purpose }}</div>
            </div>
          </div>

          <div class="step-description">{{ currentStep.description }}</div>

          <div class="step-points">
            <div v-for="(point, idx) in currentStep.points" :key="idx" class="point-item">
              <span>{{ idx + 1 }}</span>
              <div>{{ point }}</div>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="示意图"
        subtitle="当前操作的处理前后效果"
        padding="lg"
        transparent
      >
        <div class="visual-panel">
          <div class="visual-card">
            <div class="visual-label">处理前</div>
            <img :src="currentStep.beforeImage" :alt="`${currentStep.title}-before`" />
          </div>

          <div class="visual-arrow">
            <span>{{ currentStep.arrowText }}</span>
          </div>

          <div class="visual-card">
            <div class="visual-label">处理后</div>
            <img :src="currentStep.afterImage" :alt="`${currentStep.title}-after`" />
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="bottom-grid">
      <BaseCard
        title="为什么这些步骤重要"
        subtitle="预处理在模型学习前先减少不稳定因素"
        padding="lg"
        transparent
      >
        <div class="task-support-grid">
          <div class="support-card">
            <span>稳定结构</span>
            <strong>减少对不稳定纹理特征的依赖</strong>
            <p>检测与对齐让模型更多关注核心身份结构，而不是背景噪声和不一致取景。</p>
          </div>

          <div class="support-card">
            <span>可用时间标签</span>
            <strong>把时间漂移转化为可学习监督</strong>
            <p>清晰的阶段信息帮助后续模块区分身份一致性与自然外观变化。</p>
          </div>

          <div class="support-card">
            <span>时间关系</span>
            <strong>为跨时间训练准备配对依据</strong>
            <p>相邻阶段之间的显式关联，构成了时间一致性建模所需的结构基础。</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="讲解提示"
        subtitle="适合答辩或录屏时口播"
        padding="lg"
        transparent
      >
        <div class="narration-copy">
          <p>这一阶段并不只是图像清洗，而是专门面向跨时间识别设计的数据准备流程。</p>
          <p>在模型训练之前，我们先统一结构、过滤噪声，并补充身份与阶段标注。</p>
          <p>这样后续网络才能在更干净、更可靠的基础上学习稳定的时间身份表征。</p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const steps = [
  {
    key: 'detect',
    index: '01',
    title: '目标检测',
    subtitle: '先定位有效主体区域',
    purpose: '从原始图像中提取有效识别区域。',
    description:
      '原始输入中往往包含过多背景和不一致取景。目标检测的作用，是先把注意力收敛到真正有用的身份区域。',
    points: ['定位有效主体区域', '减少背景干扰', '为后续对齐提供稳定基础'],
    arrowText: '定位 / 裁剪',
    beforeImage:
      'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'align',
    index: '02',
    title: '对齐归一',
    subtitle: '让不同阶段样本更具可比性',
    purpose: '统一姿态、尺度与空间结构。',
    description:
      '跨时间样本在角度、距离和构图上常有较大差异。对齐归一能显著降低这些几何偏差。',
    points: ['统一尺度与区域比例', '减少视角差异', '突出更稳定的结构特征'],
    arrowText: '对齐 / 归一',
    beforeImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'clean',
    index: '03',
    title: '样本筛选',
    subtitle: '控制噪声样本影响',
    purpose: '在训练前提升样本质量。',
    description:
      '模糊、遮挡和低分辨率样本会破坏时间学习效果。筛选的目的，就是去除这些不稳定监督。',
    points: ['剔除严重模糊样本', '去除严重遮挡情况', '减少训练中的噪声证据'],
    arrowText: '筛选 / 清洗',
    beforeImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'label',
    index: '04',
    title: '标注整理',
    subtitle: '补充身份与阶段信息',
    purpose: '构建身份与时间的显式监督。',
    description:
      '跨时间识别不仅要知道“是谁”，还要知道“属于哪个阶段”。标注整理就是把这种监督显式化。',
    points: ['赋予稳定身份标签', '标记时间阶段', '保持标注结构统一'],
    arrowText: '标注 / 整理',
    beforeImage:
      'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'pair',
    index: '05',
    title: '时间配对',
    subtitle: '将相邻阶段连接成可学习关系',
    purpose: '构建显式时间关联供模型学习。',
    description:
      '单张图像不足以支持时间推理。跨阶段配对可以给网络提供身份如何演化的直接证据。',
    points: ['连接同一身份的不同阶段', '让模型在变化中看到稳定身份', '支持后续一致性建模'],
    arrowText: '配对 / 组织',
    beforeImage:
      'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=80'
  }
]

const activeStep = ref('detect')
const currentStep = computed(() => steps.find((item) => item.key === activeStep.value) || steps[0])
const stepOptions = steps.map((item) => ({
  label: item.title,
  value: item.key
}))
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.preprocess-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview-grid,
.detail-grid,
.bottom-grid {
  display: grid;
  gap: 20px;
}

.overview-grid {
  grid-template-columns: 1.35fr 0.95fr;
}

.detail-grid {
  grid-template-columns: 1.05fr 0.95fr;
}

.pipeline-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.pipeline-step {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 18px;
  cursor: pointer;
}

.pipeline-step.active {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 0 0 1px rgba(217, 235, 220, 0.24),
    0 0 18px rgba(150, 182, 159, 0.12),
    0 12px 24px rgba(66, 96, 78, 0.08);
}

.pipeline-step span,
.step-index-badge {
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

.goal-list,
.task-support-grid,
.narration-copy,
.step-detail,
.step-points {
  display: flex;
  flex-direction: column;
}

.goal-list,
.task-support-grid,
.step-detail,
.step-points {
  gap: 12px;
}

.goal-item,
.support-card,
.point-item,
.visual-card {
  padding: 14px 16px;
  border-radius: 18px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.step-header-copy,
.support-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.step-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
}

.step-purpose,
.step-description,
.support-card p,
.narration-copy p {
  line-height: 1.75;
  color: var(--demo-sage-ink-soft);
}

.point-item {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
}

.point-item span {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(188, 211, 193, 0.22);
  color: var(--demo-sage-accent);
  font-size: 12px;
  font-weight: 700;
}

.visual-panel {
  display: grid;
  grid-template-columns: 1fr 96px 1fr;
  gap: 16px;
  align-items: center;
}

.visual-label {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--demo-sage-ink-faint);
}

.visual-card img {
  width: 100%;
  display: block;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 16px;
}

.visual-arrow {
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.28));
  color: var(--demo-sage-accent);
  font-size: 12px;
  font-weight: 700;
}

.support-card span {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(96, 126, 108, 0.68);
}

.support-card strong {
  font-size: 15px;
  color: var(--demo-sage-ink-strong);
}

@media (max-width: 1200px) {
  .overview-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .pipeline-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .pipeline-row,
  .visual-panel {
    grid-template-columns: 1fr;
  }

  .visual-arrow {
    min-height: 48px;
    border-radius: 16px;
  }
}
</style>
