<template>
  <div class="system-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">系统演示</div>
        <h2 class="scene-title">跨时间识别系统演示台</h2>
        <p class="scene-desc">
          本页统一演示查询样本选择、检索结果展示以及最终时间解释过程，
          同时覆盖主任务与人脸迁移验证两种场景。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeDomain" class="domain-switch" :options="domainOptions" />
        <a-segmented v-model:value="topK" :options="topKOptions" />
      </div>
    </div>

    <div class="overview-grid">
      <BaseCard title="演示流程" subtitle="本页的展示路径" padding="md">
        <div class="flow-row">
          <div class="flow-step"><span>01</span>选择查询样本</div>
          <div class="flow-step"><span>02</span>启动检索</div>
          <div class="flow-step"><span>03</span>查看 Top-K</div>
          <div class="flow-step"><span>04</span>输出结论</div>
        </div>
      </BaseCard>

      <BaseCard title="当前重点" subtitle="本页当前强调的能力" padding="md">
        <div class="highlight-copy">
          <div class="highlight-point">{{ currentDomain.label }}</div>
          <div class="highlight-point">Top-K 检索与时间阶段解释</div>
          <div class="highlight-point">统一展示主任务与验证场景</div>
        </div>
      </BaseCard>
    </div>

    <div class="main-grid">
      <BaseCard class="query-card" title="查询样本" subtitle="控制检索流程" padding="lg">
        <div class="query-panel">
          <div class="query-preview">
            <img :src="currentCase.queryImage" :alt="currentCase.name" class="query-image" />
            <div class="query-badges">
              <span class="tag tag-dark">{{ currentCase.subjectId }}</span>
              <span class="tag">{{ currentCase.queryYear }}</span>
              <span class="tag">{{ currentCase.stageLabel }}</span>
              <span class="tag">{{ currentCase.domainLabel }}</span>
            </div>
          </div>

          <div class="sample-title">{{ currentCase.name }}</div>
          <div class="sample-desc">{{ currentCase.description }}</div>

          <div class="sample-info-list">
            <div class="info-row"><span>任务</span><strong>{{ currentCase.domainLabel }}</strong></div>
            <div class="info-row"><span>来源</span><strong>{{ currentCase.source }}</strong></div>
            <div class="info-row"><span>查询阶段</span><strong>{{ currentCase.stageLabel }}</strong></div>
            <div class="info-row"><span>预期表现</span><strong>{{ currentCase.expected }}</strong></div>
          </div>

          <div class="selector-wrap">
            <div class="selector-label">演示样本</div>
            <a-select v-model:value="activeCaseId" class="sample-select" size="large" :options="caseOptions" />
          </div>

          <div class="action-row">
            <a-button type="primary" class="run-btn" size="large" @click="runDemo">启动检索</a-button>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="检索结果" subtitle="当前查询样本的 Top 候选结果" padding="lg">
        <div v-if="!hasRun" class="empty-state">
          <div class="empty-title">等待执行</div>
          <div class="empty-desc">请选择一个样本并点击按钮，模拟检索过程。</div>
        </div>

        <div v-else class="results-grid">
          <div
            v-for="(item, index) in visibleResults"
            :key="`${currentCase.id}-${index}`"
            class="result-item"
            :class="{ 'result-item--correct': item.correct, 'result-item--cross': item.crossStage }"
          >
            <div class="result-rank">#{{ index + 1 }}</div>
            <div class="result-image-wrap">
              <img :src="item.image" :alt="item.id" class="result-image" />
              <div class="result-corner" :class="item.correct ? 'success' : 'neutral'">
                {{ item.correct ? '命中' : '候选' }}
              </div>
            </div>

            <div class="result-meta">
              <div class="result-id">{{ item.id }}</div>
              <div class="result-source">{{ item.source }}</div>
              <div class="result-year-row">
                <span class="mini-chip">{{ item.year }}</span>
                <span class="mini-chip">{{ item.stage }}</span>
              </div>
              <div class="score-line"><span>相似度</span><strong>{{ item.score }}</strong></div>
            </div>
          </div>
        </div>
      </BaseCard>

      <div class="side-column">
        <BaseCard title="结果总结" subtitle="当前检索的主要解释" padding="lg">
          <div v-if="!hasRun" class="summary-empty">请先运行演示，查看最终解释结果。</div>

          <div v-else class="summary-panel">
            <div class="summary-main">
              <div class="summary-block"><span class="summary-label">预测身份</span><strong>{{ summary.identity }}</strong></div>
              <div class="summary-block"><span class="summary-label">预测阶段</span><strong>{{ summary.stage }}</strong></div>
              <div class="summary-block"><span class="summary-label">结果观察</span><strong>{{ summary.observation }}</strong></div>
            </div>

            <div class="judge-box" :class="{ success: summary.success }">
              <div class="judge-title">{{ summary.success ? '演示成功' : '需要复核' }}</div>
              <div class="judge-desc">{{ summary.message }}</div>
            </div>
          </div>
        </BaseCard>

        <BaseCard title="讲解提示" subtitle="适合演示时的简短说明" padding="lg">
          <div class="narration-copy">
            <p>系统先接收一个查询样本，随后完成 Top-K 检索，并输出身份一致性与时间阶段解释。</p>
            <p>这样展示的不仅是谁，还包括这个样本在跨时间识别场景中的表现。</p>
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

const topKOptions = [
  { label: 'Top-3', value: 3 },
  { label: 'Top-5', value: 5 }
]

const domainMeta = {
  nonhuman: { label: '非人类生物跨时间检索' },
  human: { label: '人脸迁移验证检索' }
}

const nonHumanCases = [
  {
    id: 'demo-nh-1',
    name: '棕熊查询样本 A',
    subjectId: 'NH-023',
    domainLabel: '非人类生物',
    source: '棕熊数据集',
    queryYear: '2022',
    stageLabel: '后期阶段',
    expected: '同一身份应出现在 Top-3 中',
    description: '一个后期阶段的非人类样本，具有明显外观漂移。',
    queryImage:
      'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80',
    results: [
      {
        id: 'NH-023',
        source: 'Brown Bear Dataset',
        year: '2019',
        stage: 'Middle',
        score: '0.93',
        correct: true,
        crossStage: true,
        image:
          'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'NH-051',
        source: 'Brown Bear Dataset',
        year: '2021',
        stage: 'Later',
        score: '0.86',
        correct: false,
        crossStage: false,
        image:
          'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'NH-023',
        source: 'Brown Bear Dataset',
        year: '2017',
        stage: 'Early',
        score: '0.84',
        correct: true,
        crossStage: true,
        image:
          'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80'
      }
    ],
    summary: {
      identity: 'NH-023',
      stage: '后期阶段',
      observation: '跨阶段一致性整体稳定。',
      success: true,
      message: '同一身份在多个时间点都保持了较高相似度。'
    }
  }
]

const humanCases = [
  {
    id: 'demo-hm-1',
    name: '年龄验证样本 A',
    subjectId: 'HM-014',
    domainLabel: '人脸验证',
    source: 'AgeDB / CACD',
    queryYear: 'Stage C',
    stageLabel: '后期阶段',
    expected: '同一身份应保持在靠前位置',
    description: '用于迁移验证的后期阶段人脸查询样本。',
    queryImage:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    results: [
      {
        id: 'HM-014',
        source: 'AgeDB',
        year: 'Stage B',
        stage: 'Middle',
        score: '0.91',
        correct: true,
        crossStage: true,
        image:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'HM-044',
        source: 'CACD',
        year: 'Stage C',
        stage: 'Later',
        score: '0.82',
        correct: false,
        crossStage: false,
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'HM-014',
        source: 'FG-NET',
        year: 'Stage A',
        stage: 'Earlier',
        score: '0.80',
        correct: true,
        crossStage: true,
        image:
          'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80'
      }
    ],
    summary: {
      identity: 'HM-014',
      stage: '后期阶段',
      observation: '在年龄变化下，检索结果依然稳定。',
      success: true,
      message: '较早阶段与中期阶段样本仍然保持在前列结果中。'
    }
  }
]

const activeDomain = ref('nonhuman')
const activeCaseId = ref(nonHumanCases[0].id)
const topK = ref(3)
const hasRun = ref(false)

const cases = computed(() => (activeDomain.value === 'nonhuman' ? nonHumanCases : humanCases))
const currentDomain = computed(() => domainMeta[activeDomain.value])
const caseOptions = computed(() => cases.value.map((item) => ({ label: item.name, value: item.id })))
const currentCase = computed(() => cases.value.find((item) => item.id === activeCaseId.value) || cases.value[0])
const visibleResults = computed(() => currentCase.value.results.slice(0, topK.value))
const summary = computed(() => currentCase.value.summary)

const runDemo = () => {
  hasRun.value = true
}

watch(activeDomain, () => {
  activeCaseId.value = cases.value[0].id
  hasRun.value = false
})

watch(activeCaseId, () => {
  hasRun.value = false
})
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.system-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview-grid,
.main-grid,
.flow-row,
.results-grid {
  display: grid;
  gap: 20px;
}

.overview-grid {
  grid-template-columns: 1.4fr 1fr;
}

.flow-row {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.main-grid {
  grid-template-columns: 1.08fr 1.28fr 0.84fr;
  align-items: start;
}

.flow-step,
.highlight-copy,
.query-panel,
.sample-info-list,
.side-column,
.summary-main,
.narration-copy {
  display: flex;
  flex-direction: column;
}

.highlight-copy,
.query-panel,
.sample-info-list,
.side-column,
.summary-main,
.narration-copy {
  gap: 12px;
}

.flow-step {
  gap: 10px;
  padding: 14px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(49, 71, 58, 0.84);
}

.flow-step span {
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

.highlight-point,
.query-preview,
.result-item,
.summary-block,
.judge-box {
  padding: 14px;
  border-radius: 18px;
}

.query-image,
.result-image {
  width: 100%;
  display: block;
  object-fit: cover;
  border-radius: 16px;
}

.query-image {
  aspect-ratio: 16 / 10;
}

.result-image {
  aspect-ratio: 1 / 1;
}

.query-badges,
.result-year-row,
.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag,
.mini-chip {
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

.sample-title,
.result-id,
.judge-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
}

.sample-desc,
.empty-desc,
.judge-desc,
.narration-copy p {
  line-height: 1.75;
  color: var(--demo-sage-ink-soft);
}

.info-row,
.score-line,
.summary-block {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.info-row span,
.score-line span,
.summary-label,
.result-source {
  color: var(--demo-sage-ink-faint);
}

.info-row strong,
.score-line strong,
.summary-block strong {
  color: var(--demo-sage-ink-strong);
}

.selector-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--demo-sage-ink-faint);
}

.sample-select {
  width: 100%;
}

.run-btn {
  min-width: 140px;
}

.empty-state,
.summary-empty {
  padding: 20px;
  border-radius: 18px;
  color: var(--demo-sage-ink-soft);
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
  margin-bottom: 6px;
}

.results-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.result-item {
  position: relative;
}

.result-rank {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--demo-sage-ink-faint);
}

.result-corner {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 28px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.result-corner.success {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
}

.result-corner.neutral {
  background: rgba(255, 255, 255, 0.42);
  color: var(--demo-sage-accent);
}

.judge-box.success {
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.64), rgba(255, 255, 255, 0.24));
}

@media (max-width: 1200px) {
  .overview-grid,
  .main-grid,
  .results-grid {
    grid-template-columns: 1fr;
  }

  .flow-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .flow-row {
    grid-template-columns: 1fr;
  }
}
</style>
