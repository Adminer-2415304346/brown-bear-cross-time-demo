<template>
  <div class="system-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">System Demo</div>
        <h2 class="scene-title">跨时间识别系统演示</h2>
        <p class="scene-desc">
          选择一张测试图像，展示 Top-k 检索结果、身份预测、年份信息和时间阶段判断，
          用于录制最终演示视频。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented
          v-model:value="topK"
          :options="[
            { label: 'Top-3', value: 3 },
            { label: 'Top-5', value: 5 }
          ]"
        />
      </div>
    </div>

    <div class="overview-grid">
      <BaseCard
        title="Demo Flow"
        subtitle="适合录屏的稳定演示路径"
        padding="md"
      >
        <div class="flow-row">
          <div class="flow-step">
            <span>01</span>
            选择测试样本
          </div>
          <div class="flow-step">
            <span>02</span>
            启动检索
          </div>
          <div class="flow-step">
            <span>03</span>
            展示 Top-k
          </div>
          <div class="flow-step">
            <span>04</span>
            输出预测结论
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="Current Highlight"
        subtitle="本页重点强调系统的跨时间检索能力"
        padding="md"
      >
        <div class="highlight-copy">
          <div class="highlight-point">跨年份命中历史个体</div>
          <div class="highlight-point">显式展示预测年份阶段</div>
          <div class="highlight-point">适合未来时间识别演示</div>
        </div>
      </BaseCard>
    </div>

    <div class="main-grid">
      <BaseCard
        class="query-card"
        title="Query Sample"
        subtitle="输入测试图像并控制检索流程"
        padding="lg"
      >
        <div class="query-panel">
          <div class="query-preview">
            <img
              :src="currentCase.queryImage"
              :alt="currentCase.name"
              class="query-image"
            />
            <div class="query-badges">
              <span class="tag tag-dark">{{ currentCase.identity }}</span>
              <span class="tag">{{ currentCase.queryYear }}</span>
              <span class="tag">{{ currentCase.stageLabel }}</span>
            </div>
          </div>

          <div class="query-meta">
            <div class="sample-title">{{ currentCase.name }}</div>
            <div class="sample-desc">{{ currentCase.description }}</div>

            <div class="sample-info-list">
              <div class="info-row">
                <span>Ground Truth ID</span>
                <strong>{{ currentCase.identity }}</strong>
              </div>
              <div class="info-row">
                <span>Query Year</span>
                <strong>{{ currentCase.queryYear }}</strong>
              </div>
              <div class="info-row">
                <span>Expected Behavior</span>
                <strong>{{ currentCase.expected }}</strong>
              </div>
            </div>

            <div class="selector-wrap">
              <div class="selector-label">切换演示样本</div>
              <a-select
                v-model:value="activeCaseId"
                class="sample-select"
                size="large"
                :options="caseOptions"
              />
            </div>

            <div class="action-row">
              <a-button
                type="primary"
                size="large"
                class="run-btn"
                :loading="isRunning"
                @click="runDemo"
              >
                开始识别
              </a-button>

              <a-button size="large" @click="resetDemo">
                重置结果
              </a-button>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        class="results-card"
        title="Top-k Retrieval Results"
        subtitle="展示最相似的历史个体结果"
        padding="lg"
      >
        <div v-if="!hasStarted" class="empty-state">
          <scan-outlined class="empty-icon" />
          <div class="empty-title">等待开始演示</div>
          <div class="empty-desc">
            点击左侧“开始识别”后，将模拟展示系统输出结果。
          </div>
        </div>

        <div v-else-if="isRunning" class="loading-state">
          <a-spin size="large" />
          <div class="loading-title">模型分析中...</div>
          <div class="loading-desc">
            正在提取特征、执行跨时间检索并生成预测结果
          </div>
        </div>

        <div v-else class="results-grid">
          <div
            v-for="(item, index) in visibleResults"
            :key="`${currentCase.id}-${index}`"
            class="result-item"
            :class="{
              'result-item--correct': item.isCorrect,
              'result-item--cross': item.isCrossTime
            }"
          >
            <div class="result-rank">Top {{ index + 1 }}</div>

            <div class="result-image-wrap">
              <img
                :src="item.image"
                :alt="item.identity"
                class="result-image"
              />
              <span v-if="item.isCorrect" class="result-corner success">
                Match
              </span>
              <span v-else class="result-corner neutral">
                Candidate
              </span>
            </div>

            <div class="result-meta">
              <div class="result-id">{{ item.identity }}</div>
              <div class="result-year-row">
                <span>{{ item.year }}</span>
                <span v-if="item.isCrossTime" class="mini-chip">
                  Cross-Time
                </span>
              </div>

              <div class="score-line">
                <span>Similarity</span>
                <strong>{{ item.score }}</strong>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <div class="side-column">
        <BaseCard
          title="Prediction Summary"
          subtitle="聚合展示最终系统判断"
          padding="lg"
        >
          <div v-if="!hasResult" class="summary-empty">
            结果将在识别完成后显示。
          </div>

          <div v-else class="summary-panel">
            <div class="summary-main">
              <div class="summary-block">
                <span class="summary-label">Predicted Identity</span>
                <strong>{{ prediction.identity }}</strong>
              </div>

              <div class="summary-block">
                <span class="summary-label">Top-1 Score</span>
                <strong>{{ prediction.score }}</strong>
              </div>

              <div class="summary-block">
                <span class="summary-label">Predicted Time Stage</span>
                <strong>{{ prediction.stage }}</strong>
              </div>

              <div class="summary-block">
                <span class="summary-label">Matched Historical Year</span>
                <strong>{{ prediction.year }}</strong>
              </div>
            </div>

            <div class="judge-box" :class="{ success: prediction.isCorrect }">
              <div class="judge-title">
                {{ prediction.isCorrect ? '识别成功' : '识别失败' }}
              </div>
              <div class="judge-desc">
                {{ prediction.message }}
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard
          title="Narration Tip"
          subtitle="录制视频时可直接口播"
          padding="lg"
        >
          <div class="narration-copy">
            <p>
              当前输入图像来自 <strong>{{ currentCase.queryYear }}</strong> 年，
              系统在历史图库中检索出最相似的个体结果。
            </p>
            <p>
              可以看到，Top-1 返回的是
              <strong>{{ prediction.identity || '—' }}</strong>，
              并同时给出了对应年份与时间阶段预测。
            </p>
            <p>
              这个案例强调了：即使跨年份外观变化明显，系统仍能保持较好的匹配能力。
            </p>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ScanOutlined } from '@ant-design/icons-vue'
import BaseCard from '@/components/common/BaseCard.vue'

const demoCases = [
  {
    id: 'case-1',
    name: 'Case A · Brown Bear #023',
    identity: 'Bear-023',
    queryYear: 2022,
    stageLabel: 'Late Stage',
    expected: '跨年份 Top-1 命中',
    description: '同一个体在多年后毛发颜色和姿态均有变化，但仍能在历史图库中完成匹配。',
    queryImage: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80',
    prediction: {
      identity: 'Bear-023',
      score: '0.92',
      stage: 'Late Stage',
      year: '2019',
      isCorrect: true,
      message: '系统成功在不同年份的历史图库中命中同一个体。'
    },
    results: [
      {
        image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-023',
        year: 2019,
        score: '0.92',
        isCorrect: true,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-041',
        year: 2020,
        score: '0.81',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-017',
        year: 2018,
        score: '0.76',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-102',
        year: 2021,
        score: '0.72',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-056',
        year: 2017,
        score: '0.69',
        isCorrect: false,
        isCrossTime: true
      }
    ]
  },
  {
    id: 'case-2',
    name: 'Case B · Brown Bear #011',
    identity: 'Bear-011',
    queryYear: 2021,
    stageLabel: 'Middle Stage',
    expected: 'Top-5 内稳定命中',
    description: '该个体存在轻微遮挡和视角变化，系统仍可在前列候选中返回正确身份。',
    queryImage: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80',
    prediction: {
      identity: 'Bear-011',
      score: '0.87',
      stage: 'Middle Stage',
      year: '2018',
      isCorrect: true,
      message: '虽然出现遮挡与视角变化，系统仍在候选前列返回正确个体。'
    },
    results: [
      {
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-014',
        year: 2020,
        score: '0.88',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-011',
        year: 2018,
        score: '0.87',
        isCorrect: true,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-021',
        year: 2021,
        score: '0.79',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-067',
        year: 2017,
        score: '0.74',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
        identity: 'Bear-045',
        year: 2019,
        score: '0.70',
        isCorrect: false,
        isCrossTime: true
      }
    ]
  }
]

const activeCaseId = ref(demoCases[0].id)
const isRunning = ref(false)
const hasStarted = ref(false)
const hasResult = ref(false)
const topK = ref(5)

const currentCase = computed(() => {
  return demoCases.find(item => item.id === activeCaseId.value) || demoCases[0]
})

const caseOptions = computed(() => {
  return demoCases.map(item => ({
    label: item.name,
    value: item.id
  }))
})

const visibleResults = computed(() => {
  return currentCase.value.results.slice(0, topK.value)
})

const prediction = computed(() => {
  if (!hasResult.value) {
    return {}
  }
  return currentCase.value.prediction
})

const resetDemo = () => {
  isRunning.value = false
  hasStarted.value = false
  hasResult.value = false
}

const runDemo = () => {
  hasStarted.value = true
  hasResult.value = false
  isRunning.value = true

  setTimeout(() => {
    isRunning.value = false
    hasResult.value = true
  }, 1200)
}

watch(activeCaseId, () => {
  resetDemo()
})
</script>

<style scoped>
.system-scene {
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
  max-width: 760px;
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
  max-width: 720px;
  font-size: 14px;
  line-height: 1.7;
  color: #64748b;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}

.flow-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.flow-step span {
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

.highlight-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlight-point {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.main-grid {
  display: grid;
  grid-template-columns: 1.15fr 1.45fr 0.8fr;
  gap: 20px;
  align-items: start;
}

.query-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.query-preview {
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  background: #f8fafc;
}

.query-image {
  width: 100%;
  height: 280px;
  display: block;
  object-fit: cover;
}

.query-badges {
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.tag-dark {
  background: rgba(15, 23, 42, 0.9);
  color: #ffffff;
}

.sample-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.sample-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.sample-info-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.info-row span {
  font-size: 13px;
  color: #64748b;
}

.info-row strong {
  font-size: 13px;
  color: #0f172a;
}

.selector-wrap {
  margin-top: 18px;
}

.selector-label {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.sample-select {
  width: 100%;
}

.action-row {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}

.run-btn {
  background: #0f172a;
  border-color: #0f172a;
}

.run-btn:hover,
.run-btn:focus {
  background: #1e293b !important;
  border-color: #1e293b !important;
}

.empty-state,
.loading-state {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  color: #94a3b8;
}

.empty-title,
.loading-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.empty-desc,
.loading-desc {
  max-width: 340px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.result-item {
  position: relative;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.06);
}

.result-item--correct {
  border-color: #86efac;
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
}

.result-item--cross {
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.08);
}

.result-rank {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.result-image-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #e2e8f0;
}

.result-image {
  width: 100%;
  height: 170px;
  display: block;
  object-fit: cover;
}

.result-corner {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.result-corner.success {
  background: rgba(34, 197, 94, 0.16);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.24);
}

.result-corner.neutral {
  background: rgba(255, 255, 255, 0.88);
  color: #475569;
  border: 1px solid rgba(226, 232, 240, 0.95);
}

.result-meta {
  margin-top: 12px;
}

.result-id {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.result-year-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
}

.mini-chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 700;
}

.score-line {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 12px;
}

.score-line strong {
  color: #0f172a;
  font-size: 14px;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-empty {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
}

.summary-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.summary-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-block {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.summary-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #64748b;
}

.summary-block strong {
  font-size: 15px;
  color: #0f172a;
}

.judge-box {
  padding: 14px 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.judge-box.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.judge-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.judge-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: #475569;
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

@media (max-width: 1400px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1100px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .flow-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

  .results-grid,
  .side-column {
    grid-template-columns: 1fr;
  }

  .flow-row {
    grid-template-columns: 1fr;
  }

  .action-row {
    flex-direction: column;
  }

  .query-image {
    height: 220px;
  }

  .result-image {
    height: 180px;
  }
}
</style>