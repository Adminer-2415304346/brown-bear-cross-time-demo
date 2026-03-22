<template>
  <div class="failure-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">失败分析</div>
        <h2 class="scene-title">困难失败案例</h2>
        <p class="scene-desc">
          本页重点展示系统仍然容易出错的场景，通过分析错误匹配结果，明确下一步优化方向。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeDomain" class="domain-switch" :options="domainOptions" />
      </div>
    </div>

    <div class="hero-grid">
      <BaseCard title="为什么要分析失败" subtitle="困难案例的价值" padding="md">
        <div class="reason-list">
          <div class="reason-item">揭示时间鲁棒性的真实边界</div>
          <div class="reason-item">暴露结构特征仍然不足的场景</div>
          <div class="reason-item">为下一轮优化提供方向</div>
        </div>
      </BaseCard>

      <BaseCard title="类别筛选" subtitle="选择一种失败类型" padding="md">
        <div class="filter-wrap">
          <a-select v-model:value="activeCategory" class="category-select" size="large" :options="categoryOptions" />
        </div>
      </BaseCard>
    </div>

    <div class="main-grid">
      <BaseCard title="失败案例列表" subtitle="当前设置下的典型困难样本" padding="lg">
        <div class="case-grid">
          <div
            v-for="item in filteredCases"
            :key="item.id"
            class="case-card"
            :class="{ active: selectedCase.id === item.id }"
            @click="selectedCaseId = item.id"
          >
            <img :src="item.queryImage" :alt="item.title" class="case-image" />
            <div class="case-meta">
              <div class="case-title">{{ item.title }}</div>
              <div class="case-tags">
                <span class="mini-tag">{{ item.category }}</span>
                <span class="mini-tag">{{ item.source }}</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="详细对比" subtitle="查询样本、错误匹配与正确目标" padding="lg">
        <div class="detail-grid">
          <div class="compare-card">
            <div class="compare-head">查询样本</div>
            <img :src="selectedCase.queryImage" :alt="selectedCase.title" class="compare-image" />
            <div class="compare-note">{{ selectedCase.queryNote }}</div>
          </div>

          <div class="compare-card">
            <div class="compare-head wrong">错误匹配</div>
            <img :src="selectedCase.wrongImage" :alt="selectedCase.title" class="compare-image" />
            <div class="compare-note">{{ selectedCase.wrongNote }}</div>
          </div>

          <div class="compare-card">
            <div class="compare-head right">正确目标</div>
            <img :src="selectedCase.correctImage" :alt="selectedCase.title" class="compare-image" />
            <div class="compare-note">{{ selectedCase.correctNote }}</div>
          </div>
        </div>
      </BaseCard>

      <div class="side-column">
        <BaseCard title="失败原因" subtitle="系统为什么会出错" padding="lg">
          <div class="reason-panel">
            <div class="reason-label">{{ selectedCase.category }}</div>
            <div class="reason-title">{{ selectedCase.title }}</div>
            <div class="reason-desc">{{ selectedCase.analysis }}</div>

            <div class="reason-blocks">
              <div class="reason-block"><span>任务</span><strong>{{ selectedCase.domainLabel }}</strong></div>
              <div class="reason-block"><span>来源</span><strong>{{ selectedCase.source }}</strong></div>
              <div class="reason-block"><span>主要因素</span><strong>{{ selectedCase.factor }}</strong></div>
            </div>
          </div>
        </BaseCard>

        <BaseCard title="优化方向" subtitle="后续可以继续改进的点" padding="lg">
          <div class="opt-list">
            <div v-for="(item, idx) in selectedCase.suggestions" :key="idx" class="opt-item">
              <span class="opt-index">{{ idx + 1 }}</span>
              <span>{{ item }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <div class="bottom-grid">
      <BaseCard title="讲解提示" subtitle="适合演示时的简短说明" padding="lg">
        <div class="narration-copy">
          <p>我们不仅展示成功检索，也展示当前方法仍然容易失败的样本。</p>
          <p>这些失败大多与极端姿态、遮挡、模糊或明显的时间外观漂移有关。</p>
          <p>这些案例帮助我们明确后续数据扩充和模型鲁棒性提升的方向。</p>
        </div>
      </BaseCard>

      <BaseCard title="页面结论" subtitle="这一页的核心结论" padding="lg">
        <div class="takeaway-box">
          跨时间识别不仅是特征提取问题，它同时还涉及遮挡、姿态、时间漂移与域差异的联合建模。
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const domainOptions = [
  { label: '非人类生物', value: 'nonhuman' },
  { label: '人脸迁移验证', value: 'human' }
]

const nonHumanCases = [
  {
    id: 'nh-f-1',
    domain: 'nonhuman',
    domainLabel: '非人类生物',
    category: '极端姿态',
    title: '棕熊极端姿态样本',
    source: '棕熊数据集',
    factor: '姿态偏移',
    queryImage:
      'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=900&q=80',
    wrongImage:
      'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=80',
    correctImage:
      'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80',
    queryNote: '查询图像中的主体转角较大，稳定结构信息暴露不足。',
    wrongNote: '错误匹配在轮廓和粗纹理上相似，但并非同一身份。',
    correctNote: '正确目标结构更接近，但受姿态差异影响得分下降。',
    analysis:
      '极端姿态削弱了稳定局部几何结构，模型更容易依赖不完整的外观证据。',
    suggestions: ['增加大角度姿态样本覆盖', '强化姿态鲁棒表征学习', '提高结构一致性约束']
  },
  {
    id: 'nh-f-2',
    domain: 'nonhuman',
    domainLabel: '非人类生物',
    category: '遮挡干扰',
    title: '局部遮挡哺乳动物样本',
    source: '大型哺乳动物数据集',
    factor: '关键区域缺失',
    queryImage:
      'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80',
    wrongImage:
      'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=900&q=80',
    correctImage:
      'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=900&q=80',
    queryNote: '查询图像中的关键身份区域被部分遮挡。',
    wrongNote: '错误样本在未遮挡区域纹理相似，因此被错误提升。',
    correctNote: '正确目标全局更接近，但缺乏足够的可见重叠区域。',
    analysis:
      '当关键区域被遮挡时，模型可能过度依赖残余纹理，而非完整身份结构。',
    suggestions: ['增加遮挡增强训练', '引入局部重建或掩码目标', '提升全局结构匹配权重']
  }
]

const humanCases = [
  {
    id: 'hm-f-1',
    domain: 'human',
    domainLabel: '人脸迁移验证',
    category: '年龄跨度',
    title: '大年龄跨度人脸样本',
    source: 'AgeDB / CACD',
    factor: '年龄漂移',
    queryImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    wrongImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    correctImage:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    queryNote: '查询样本来自较早年龄阶段，皮肤纹理与轮廓更平滑。',
    wrongNote: '错误匹配共享相近年龄外观，但并非同一身份。',
    correctNote: '正确目标年龄更大，在纹理空间上距离更远。',
    analysis:
      '大年龄跨度会显著改变纹理、轮廓和局部细节，削弱同一身份的匹配置信度。',
    suggestions: ['增强年龄不变表征学习', '增加跨阶段正样本配对', '加入阶段感知正则化']
  }
]

const activeDomain = ref('nonhuman')
const activeCategory = ref('全部')
const selectedCaseId = ref(nonHumanCases[0].id)

const cases = computed(() => (activeDomain.value === 'nonhuman' ? nonHumanCases : humanCases))
const categoryOptions = computed(() => {
  const values = ['全部', ...new Set(cases.value.map((item) => item.category))]
  return values.map((item) => ({ label: item, value: item }))
})
const filteredCases = computed(() =>
  activeCategory.value === '全部'
    ? cases.value
    : cases.value.filter((item) => item.category === activeCategory.value)
)
const selectedCase = computed(() => filteredCases.value.find((item) => item.id === selectedCaseId.value) || filteredCases.value[0])

watch(activeDomain, () => {
  activeCategory.value = '全部'
  selectedCaseId.value = cases.value[0].id
})

watch(activeCategory, () => {
  selectedCaseId.value = filteredCases.value[0]?.id || cases.value[0]?.id
})
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.failure-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-grid,
.main-grid,
.bottom-grid,
.detail-grid {
  display: grid;
  gap: 20px;
}

.hero-grid,
.bottom-grid {
  grid-template-columns: 1fr 1fr;
}

.main-grid {
  grid-template-columns: 1fr 1.1fr 0.8fr;
  align-items: start;
}

.detail-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.reason-list,
.side-column,
.narration-copy,
.opt-list,
.reason-panel,
.reason-blocks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.case-card,
.compare-card {
  padding: 14px;
  border-radius: 18px;
  cursor: pointer;
}

.case-card.active {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 0 0 1px rgba(217, 235, 220, 0.24),
    0 0 18px rgba(150, 182, 159, 0.12),
    0 12px 24px rgba(66, 96, 78, 0.08);
}

.case-image,
.compare-image {
  width: 100%;
  display: block;
  object-fit: cover;
  border-radius: 16px;
}

.case-image {
  aspect-ratio: 16 / 10;
  margin-bottom: 10px;
}

.compare-image {
  aspect-ratio: 1 / 1;
  margin: 10px 0;
}

.case-title,
.reason-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
}

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.mini-tag,
.reason-label,
.compare-head,
.opt-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.mini-tag,
.reason-label {
  height: 28px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.34);
  color: var(--demo-sage-accent);
}

.compare-head {
  height: 30px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.42);
  color: var(--demo-sage-accent);
}

.compare-head.wrong {
  background: rgba(251, 191, 36, 0.16);
  color: #b45309;
}

.compare-head.right {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
}

.compare-note,
.reason-desc,
.narration-copy p {
  color: var(--demo-sage-ink-soft);
  line-height: 1.75;
}

.reason-block {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
}

.reason-block span {
  color: var(--demo-sage-ink-faint);
}

.reason-block strong {
  color: var(--demo-sage-ink-strong);
}

.opt-item {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
}

.opt-index {
  width: 28px;
  height: 28px;
  background: var(--demo-sage-badge-gradient);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 8px 16px rgba(66, 96, 78, 0.14);
  color: var(--demo-sage-ink-strong);
  font-weight: 800;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.38);
}

@media (max-width: 1200px) {
  .hero-grid,
  .main-grid,
  .bottom-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .case-grid {
    grid-template-columns: 1fr;
  }
}
</style>
