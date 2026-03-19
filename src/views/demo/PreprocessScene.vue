<template>
  <div class="preprocess-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">Preprocess Pipeline</div>
        <h2 class="scene-title">面向跨时间识别的数据预处理流程</h2>
        <p class="scene-desc">
          预处理阶段的目标不是简单清洗图像，而是围绕跨时间身份比对任务构建更稳定的输入样本。
          通过区域定位、对齐裁剪、样本筛选、时间标签整理与阶段关系组织，
          为后续识别模型提供更可靠的数据基础。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented
          v-model:value="activeStep"
          :options="stepOptions"
        />
      </div>
    </div>

    <div class="overview-grid">
      <BaseCard
        title="流程总览"
        subtitle="从原始图像到可训练样本的关键环节"
        padding="lg"
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
        title="这一阶段要解决什么"
        subtitle="预处理为跨时间建模提供统一输入基础"
        padding="lg"
      >
        <div class="goal-list">
          <div class="goal-item">统一图像尺度与有效面部区域</div>
          <div class="goal-item">减少模糊、遮挡和异常样本干扰</div>
          <div class="goal-item">建立清晰的身份与时间阶段标签</div>
          <div class="goal-item">为跨阶段关系建模准备可用样本结构</div>
        </div>
      </BaseCard>
    </div>

    <div class="detail-grid">
      <BaseCard
        title="当前步骤说明"
        :subtitle="currentStep.subtitle"
        padding="lg"
      >
        <div class="step-detail">
          <div class="step-header">
            <div class="step-index-badge">{{ currentStep.index }}</div>
            <div class="step-header-copy">
              <div class="step-name">{{ currentStep.title }}</div>
              <div class="step-purpose">{{ currentStep.purpose }}</div>
            </div>
          </div>

          <div class="step-description">
            {{ currentStep.description }}
          </div>

          <div class="step-points">
            <div
              v-for="(point, idx) in currentStep.points"
              :key="idx"
              class="point-item"
            >
              <span>{{ idx + 1 }}</span>
              <div>{{ point }}</div>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="示意图"
        subtitle="当前步骤对图像与样本组织的影响"
        padding="lg"
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
        title="为什么这些步骤缺一不可"
        subtitle="它们共同决定后续识别效果的上限"
        padding="lg"
      >
        <div class="task-support-grid">
          <div class="support-card">
            <span>身份结构稳定性</span>
            <strong>减弱同期外观干扰</strong>
            <p>通过定位、对齐与筛选，尽量让模型更多看到稳定的面部结构，而不是被背景、噪声或偶然外观变化干扰。</p>
          </div>

          <div class="support-card">
            <span>时间信息可用性</span>
            <strong>让时间变化可被建模</strong>
            <p>整理清晰的阶段标签后，模型才能区分“身份变化”与“时间变化”，避免把阶段差异误当作身份差异。</p>
          </div>

          <div class="support-card">
            <span>跨阶段关系组织</span>
            <strong>为一致性建模提供基础</strong>
            <p>只有明确同一身份在不同阶段之间的样本关系，后续模型才有条件学习跨时间保持稳定的表征方式。</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="口播提示"
        subtitle="适合录制演示视频时直接讲解"
        padding="lg"
      >
        <div class="narration-copy">
          <p>
            这一部分的重点不是普通意义上的图像预处理，而是围绕跨时间识别需求去构造训练样本。
          </p>
          <p>
            我们既要保证输入图像在空间位置和结构上尽量一致，也要保证每张图像具备清晰的身份标签与时间阶段信息。
          </p>
          <p>
            这样，后续模型才能在不同时间条件下学习更稳定的身份表示，而不是依赖某一个时期的外观特征。
          </p>
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
    title: '面部区域定位',
    subtitle: '先确定真正有效的识别区域',
    purpose: '从原始图像中提取更可靠的面部区域，减少背景干扰。',
    description:
      '在原始采集图像中，往往包含大量背景、取景偏移和无关区域。若直接输入模型，容易让特征学习偏离真正与身份相关的结构信息，因此需要先定位有效面部区域。',
    points: [
      '从原始图像中提取面部主体区域',
      '减少背景和取景差异带来的干扰',
      '为后续裁剪与对齐提供统一基础'
    ],
    arrowText: '定位 / 裁剪',
    beforeImage:
      'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'align',
    index: '02',
    title: '对齐与裁剪',
    subtitle: '让不同阶段样本更具可比性',
    purpose: '统一尺度与结构位置，减弱姿态和取景差异。',
    description:
      '跨时间样本经常伴随拍摄距离、角度和取景范围变化。通过对齐与裁剪，可以尽量统一关键结构区域的位置关系，提升不同时期图像之间的可比性。',
    points: [
      '统一图像尺度与面部比例',
      '减小姿态与视角变化影响',
      '突出更稳定的结构区域'
    ],
    arrowText: '对齐 / 归一化',
    beforeImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'clean',
    index: '03',
    title: '样本清洗与筛选',
    subtitle: '控制异常样本对训练的破坏',
    purpose: '提升样本质量，降低噪声对识别建模的影响。',
    description:
      '模糊、遮挡、极端光照和低分辨率样本会显著破坏表征学习效果。在跨时间任务中，这类噪声还容易被误认为是时间变化本身，因此需要进行有针对性的样本筛选。',
    points: [
      '剔除严重模糊和低分辨率图像',
      '过滤极端遮挡与结构缺失样本',
      '减小异常样本对跨时间建模的扰动'
    ],
    arrowText: '清洗 / 筛选',
    beforeImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'label',
    index: '04',
    title: '身份与阶段标签整理',
    subtitle: '让时间信息进入训练过程',
    purpose: '为每个样本建立身份标签与时间阶段信息。',
    description:
      '跨时间识别的难点之一在于：同一身份会随着时间发生变化。为了让模型区分“身份是谁”和“当前处于哪个阶段”，必须在数据层面建立清晰的身份标签与时间阶段标签。',
    points: [
      '为每张图像建立唯一身份标识',
      '为样本标注对应时间阶段',
      '统一标签组织形式，支撑后续训练'
    ],
    arrowText: '标签整理',
    beforeImage:
      'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  },
  {
    key: 'pair',
    index: '05',
    title: '跨阶段关系组织',
    subtitle: '显式建立相邻阶段之间的联系',
    purpose: '为模型学习跨时间稳定性提供数据关系基础。',
    description:
      '仅有单张样本还不够，跨时间识别还需要让模型看到“同一身份在不同阶段之间如何变化”。因此需要构造相邻时间阶段之间的样本关系，显式组织这些阶段联系。',
    points: [
      '组织同一身份在相邻阶段之间的样本关系',
      '突出“身份不变、阶段变化”的训练结构',
      '为后续跨时间稳定性建模提供依据'
    ],
    arrowText: '阶段组织',
    beforeImage:
      'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=900&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=80'
  }
]

const activeStep = ref('detect')

const currentStep = computed(() => {
  return steps.find(item => item.key === activeStep.value) || steps[0]
})

const stepOptions = steps.map(item => ({
  label: item.title,
  value: item.key
}))
</script>

<style scoped>
.preprocess-scene {
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

.overview-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  gap: 20px;
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
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pipeline-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.05);
}

.pipeline-step.active {
  border-color: #0f172a;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
}

.pipeline-step span {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #0f172a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.pipeline-step strong {
  font-size: 13px;
  line-height: 1.5;
  color: #0f172a;
}

.goal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-item {
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 20px;
}

.step-detail {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.step-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.step-index-badge {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #0f172a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-header-copy {
  min-width: 0;
}

.step-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.step-purpose {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.step-description {
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.step-points {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.point-item {
  display: flex;
  gap: 12px;
  padding: 13px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.point-item span {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #0f172a;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.point-item div {
  font-size: 13px;
  line-height: 1.7;
  color: #334155;
}

.visual-panel {
  display: grid;
  grid-template-columns: 1fr 88px 1fr;
  gap: 14px;
  align-items: center;
}

.visual-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.visual-label {
  padding: 12px 14px 0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.visual-card img {
  width: 100%;
  height: 280px;
  display: block;
  object-fit: cover;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 22px;
}

.visual-arrow {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
}

.task-support-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.support-card {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.support-card span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.support-card strong {
  display: block;
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.5;
  color: #0f172a;
}

.support-card p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #64748b;
}

.narration-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.narration-copy p {
  margin: 0;
}

@media (max-width: 1280px) {
  .overview-grid,
  .detail-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .pipeline-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .task-support-grid {
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

  .pipeline-row {
    grid-template-columns: 1fr 1fr;
  }

  .visual-panel {
    grid-template-columns: 1fr;
  }

  .visual-arrow {
    height: 44px;
  }

  .visual-card img {
    height: 220px;
  }
}
</style>