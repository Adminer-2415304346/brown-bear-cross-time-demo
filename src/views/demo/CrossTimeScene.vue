<template>
  <div class="cross-time-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">跨时间案例</div>
        <h2 class="scene-title">跨时间案例展示</h2>
        <p class="scene-desc">
          本页展示同一主体在不同时间阶段下的变化过程，以及系统如何在主任务与迁移验证场景中保持身份一致性识别。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeDomain" class="domain-switch" :options="domainOptions" />
      </div>
    </div>

    <div class="overview-grid">
      <BaseCard title="案例洞察" subtitle="跨时间变化中的关键观察" padding="md">
        <div class="insight-list">
          <div class="insight-item"><span class="insight-index">01</span>外观会随着时间持续变化</div>
          <div class="insight-item"><span class="insight-index">02</span>稳定结构比局部纹理更可靠</div>
          <div class="insight-item"><span class="insight-index">03</span>时间建模能够提升鲁棒性</div>
        </div>
      </BaseCard>

      <BaseCard title="当前视图" subtitle="当前场景所代表的数据域" padding="md">
        <div class="domain-panel">
          <div class="domain-name">{{ currentDomain.label }}</div>
          <div class="domain-desc">{{ currentDomain.description }}</div>
        </div>
      </BaseCard>
    </div>

    <div class="main-grid">
      <BaseCard title="案例选择" subtitle="选择一个主体查看其时间演化轨迹" padding="lg">
        <div class="selector-panel">
          <div class="selector-label">当前案例</div>
          <a-select v-model:value="activeCaseId" class="case-select" size="large" :options="caseOptions" />

          <div class="subject-card">
            <img :src="currentCase.coverImage" :alt="currentCase.name" class="subject-cover" />
            <div class="subject-meta">
              <div class="subject-name">{{ currentCase.name }}</div>
              <div class="subject-subline">
                <span class="tag tag-dark">{{ currentCase.subjectId }}</span>
                <span class="tag">{{ currentCase.source }}</span>
                <span class="tag">{{ currentCase.category }}</span>
              </div>
              <p class="subject-desc">{{ currentCase.description }}</p>
            </div>
          </div>

          <div class="summary-list">
            <div class="summary-row"><span>时间跨度</span><strong>{{ currentCase.timeSpan }}</strong></div>
            <div class="summary-row"><span>识别趋势</span><strong>{{ currentCase.trend }}</strong></div>
            <div class="summary-row"><span>核心观察</span><strong>{{ currentCase.observation }}</strong></div>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="时间图谱" subtitle="查看选定主体在各阶段的表现" padding="lg">
        <div class="timeline-wrap">
          <div class="timeline-line"></div>

          <div class="timeline-list">
            <div
              v-for="(item, index) in currentCase.timeline"
              :key="`${currentCase.id}-${index}`"
              class="timeline-item"
              :class="{ 'timeline-item--active': activeTimelineIndex === index }"
              @click="activeTimelineIndex = index"
            >
              <div class="timeline-marker"><span>{{ item.year }}</span></div>

              <div class="timeline-card">
                <img :src="item.image" :alt="`${currentCase.subjectId}-${item.year}`" class="timeline-image" />
                <div class="timeline-meta">
                  <div class="timeline-stage">{{ item.stage }}</div>
                  <div class="timeline-score-row"><span>匹配分数</span><strong>{{ item.score }}</strong></div>
                  <div class="timeline-note">{{ item.note }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <div class="side-column">
        <BaseCard title="聚焦视图" subtitle="当前时间点的详细说明" padding="lg">
          <div class="focused-panel">
            <img :src="activeTimeline.image" :alt="activeTimeline.year" class="focused-image" />

            <div class="focused-info">
              <div class="focused-year">{{ activeTimeline.year }}</div>
              <div class="focused-stage">{{ activeTimeline.stage }}</div>

              <div class="focused-grid">
                <div class="focused-block"><span>分数</span><strong>{{ activeTimeline.score }}</strong></div>
                <div class="focused-block"><span>条件</span><strong>{{ activeTimeline.condition }}</strong></div>
              </div>

              <div class="focused-note">{{ activeTimeline.note }}</div>
            </div>
          </div>
        </BaseCard>

        <BaseCard title="讲解提示" subtitle="适合演示时的简短说明" padding="lg">
          <div class="narration-copy">
            <p>这个案例展示的是同一主体在多个年份或多个阶段中的变化过程。</p>
            <p>虽然纹理、姿态和环境在变化，但系统在大多数时间点上依然保持了较稳定的身份置信度。</p>
            <p>这说明模型学到的不是短期外观特征，而是更稳定的时间一致性规律。</p>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const domainOptions = [
  { label: '非人类生物主任务', value: 'nonhuman' },
  { label: '人脸迁移验证', value: 'human' }
]

const domainMeta = {
  nonhuman: {
    label: '非人类生物识别案例',
    description: '主任务视图，聚焦同一非人类主体在跨时间条件下的身份保持能力。'
  },
  human: {
    label: '人脸迁移验证案例',
    description: '利用公开人脸数据集验证模型在年龄变化条件下的时间泛化能力。'
  }
}

const nonHumanCases = [
  {
    id: 'nh-case-1',
    name: '棕熊主体 023',
    subjectId: 'NH-023',
    source: '棕熊数据集',
    category: '非人类生物',
    timeSpan: '2017 - 2022',
    trend: '整体稳定，后期略有下降',
    observation: '纹理变化明显，但结构线索仍然可用',
    description: '一个多年份棕熊案例，毛发纹理、光照和拍摄环境都有明显变化。',
    coverImage:
      'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80',
    timeline: [
      {
        year: '2017',
        stage: '早期阶段',
        score: '0.95',
        condition: '正面 / 清晰',
        note: '初始样本质量高，结构信息稳定。',
        image:
          'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=80'
      },
      {
        year: '2019',
        stage: '中期阶段',
        score: '0.91',
        condition: '室外 / 强光',
        note: '光照条件发生变化，但几何结构依然可靠。',
        image:
          'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=900&q=80'
      },
      {
        year: '2022',
        stage: '后期阶段',
        score: '0.87',
        condition: '轻微偏转 / 对比度下降',
        note: '外观漂移增大，但匹配结果依然保持稳定。',
        image:
          'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80'
      }
    ]
  }
]

const humanCases = [
  {
    id: 'human-case-1',
    name: '年龄演化样本 A',
    subjectId: 'HM-014',
    source: 'AgeDB / CACD',
    category: '人脸样本',
    timeSpan: '青年到成年后期',
    trend: '稳定识别，伴随自然年龄漂移',
    observation: '年龄变化更多影响局部纹理，而非整体结构',
    description: '用于迁移验证的典型案例，展示年龄增长带来的外观变化。',
    coverImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    timeline: [
      {
        year: '阶段 A',
        stage: '较早阶段',
        score: '0.93',
        condition: '正面 / 清晰',
        note: '初始人脸样本质量较高，关键结构明确。',
        image:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
      },
      {
        year: '阶段 B',
        stage: '中间阶段',
        score: '0.89',
        condition: '自然光 / 中性表情',
        note: '出现轻微年龄漂移，但身份一致性仍较强。',
        image:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80'
      },
      {
        year: '阶段 C',
        stage: '后期阶段',
        score: '0.84',
        condition: '纹理变化 / 胡须干扰',
        note: '外观变化继续加深，但基于结构的匹配仍然有效。',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
      }
    ]
  }
]

const activeDomain = ref('nonhuman')
const activeCaseId = ref(nonHumanCases[0].id)
const activeTimelineIndex = ref(0)

const cases = computed(() => (activeDomain.value === 'nonhuman' ? nonHumanCases : humanCases))
const currentDomain = computed(() => domainMeta[activeDomain.value])
const caseOptions = computed(() =>
  cases.value.map((item) => ({
    label: item.name,
    value: item.id
  }))
)
const currentCase = computed(() => cases.value.find((item) => item.id === activeCaseId.value) || cases.value[0])
const activeTimeline = computed(() => currentCase.value.timeline[activeTimelineIndex.value] || currentCase.value.timeline[0])

watch(activeDomain, () => {
  activeCaseId.value = cases.value[0].id
  activeTimelineIndex.value = 0
})

watch(activeCaseId, () => {
  activeTimelineIndex.value = 0
})
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.cross-time-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview-grid,
.main-grid {
  display: grid;
  gap: 20px;
}

.overview-grid {
  grid-template-columns: 1.35fr 1fr;
}

.main-grid {
  grid-template-columns: 1fr 1.45fr 0.82fr;
  align-items: start;
}

.insight-list,
.selector-panel,
.summary-list,
.side-column,
.narration-copy,
.focused-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
}

.insight-index,
.timeline-marker span {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--demo-sage-badge-gradient);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 8px 16px rgba(66, 96, 78, 0.14);
  color: var(--demo-sage-ink-strong);
  font-size: 11px;
  font-weight: 800;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.38);
}

.domain-name,
.subject-name,
.focused-year {
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
}

.domain-desc,
.subject-desc,
.timeline-note,
.focused-note,
.narration-copy p {
  line-height: 1.75;
  color: var(--demo-sage-ink-soft);
}

.case-select {
  width: 100%;
}

.selector-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--demo-sage-ink-faint);
}

.subject-card,
.timeline-card,
.focused-block {
  padding: 14px;
  border-radius: 20px;
}

.subject-cover,
.timeline-image,
.focused-image {
  width: 100%;
  display: block;
  object-fit: cover;
  border-radius: 16px;
}

.subject-cover {
  aspect-ratio: 16 / 10;
  margin-bottom: 12px;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.34);
  color: var(--demo-sage-accent);
  font-size: 12px;
  font-weight: 700;
}

.tag-dark {
  background: var(--demo-sage-gradient);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 8px 16px rgba(66, 96, 78, 0.14);
  color: #fff;
}

.subject-subline,
.summary-row,
.timeline-score-row,
.focused-grid {
  display: flex;
  gap: 10px;
}

.subject-subline,
.focused-grid {
  flex-wrap: wrap;
}

.summary-row,
.focused-block {
  justify-content: space-between;
}

.summary-row span,
.timeline-score-row span,
.focused-block span,
.focused-stage {
  color: var(--demo-sage-ink-faint);
}

.summary-row strong,
.timeline-score-row strong,
.focused-block strong,
.timeline-stage {
  color: var(--demo-sage-ink-strong);
  font-weight: 700;
}

.timeline-wrap {
  position: relative;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 18px;
  width: 2px;
  background: linear-gradient(180deg, rgba(218, 234, 221, 0.32), rgba(255, 255, 255, 0.42));
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 14px;
  cursor: pointer;
}

.timeline-image {
  aspect-ratio: 16 / 9;
  margin-bottom: 12px;
}

.focused-image {
  aspect-ratio: 1 / 1;
}

@media (max-width: 1200px) {
  .overview-grid,
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
