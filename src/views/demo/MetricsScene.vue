<template>
  <div class="metrics-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">指标结果</div>
        <h2 class="scene-title">评估与性能展示</h2>
        <p class="scene-desc">
          本页汇总用于解释识别质量、时间稳定性和迁移表现的主要定量结果。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeDomain" class="domain-switch" :options="domainOptions" />
      </div>
    </div>

    <div class="hero-grid">
      <BaseCard title="主要结论" subtitle="数字背后的含义" padding="md">
        <div class="conclusion-list">
          <div class="conclusion-item">时间建模提升了跨阶段稳定性</div>
          <div class="conclusion-item">在人脸年龄变化下，迁移验证依然保持一致性</div>
          <div class="conclusion-item">困难样本仍然界定了主要优化边界</div>
        </div>
      </BaseCard>

      <BaseCard title="当前视图" subtitle="当前正在比较的结果" padding="md">
        <div class="current-view-box">
          <div class="current-view-title">{{ currentDomain.title }}</div>
          <div class="current-view-desc">{{ currentDomain.description }}</div>
        </div>
      </BaseCard>
    </div>

    <div class="main-grid">
      <BaseCard title="指标表" subtitle="当前视图中的关键指标" padding="lg">
        <div class="table-wrap">
          <table class="metric-table">
            <thead>
              <tr>
                <th>指标</th>
                <th>基线</th>
                <th>我们的方法</th>
                <th>提升</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in currentDomain.table" :key="item.metric" :class="{ highlight: item.highlight }">
                <td>{{ item.metric }}</td>
                <td>{{ item.baseline }}</td>
                <td>{{ item.ours }}</td>
                <td>{{ item.gain }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <div class="metrics-panel">
        <BaseCard title="核心统计" subtitle="单值结果亮点" padding="lg">
          <div class="stat-grid">
            <div v-for="item in currentDomain.stats" :key="item.label" class="stat-card">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </BaseCard>

        <BaseCard title="相对比较" subtitle="简洁的可视化对照" padding="lg">
          <div class="mini-chart">
            <div v-for="item in currentDomain.bars" :key="item.label" class="bar-item">
              <div class="bar-label">{{ item.label }}</div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: `${item.value}%` }"></div>
              </div>
              <div class="bar-value">{{ item.value }}%</div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <div class="bottom-grid">
      <BaseCard title="结果解读" subtitle="这一页应该如何讲述" padding="lg">
        <div class="insight-cards">
          <div class="insight-card" v-for="item in currentDomain.insights" :key="item.title">
            <div class="insight-title">{{ item.title }}</div>
            <div class="insight-desc">{{ item.desc }}</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="讲解提示" subtitle="适合演示时的简短说明" padding="lg">
        <div class="narration-copy">
          <p>这些数字说明模型不仅在静态识别上有效，而且在时间变化条件下也更加稳定。</p>
          <p>这种趋势同时出现在主任务和迁移验证场景中。</p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const domainOptions = [
  { label: '非人类生物主任务', value: 'nonhuman' },
  { label: '人脸迁移验证', value: 'human' }
]

const domains = {
  nonhuman: {
    title: '非人类生物主任务评估',
    description: '展示主任务在跨阶段检索与时间一致性上的核心结果。',
    table: [
      { metric: 'Rank-1', baseline: '82.4', ours: '88.7', gain: '+6.3', highlight: true },
      { metric: 'Rank-5', baseline: '91.2', ours: '95.1', gain: '+3.9', highlight: false },
      { metric: '时间一致性', baseline: '78.6', ours: '86.8', gain: '+8.2', highlight: true }
    ],
    stats: [
      { label: '最佳 Rank-1', value: '88.7%' },
      { label: '最佳 Rank-5', value: '95.1%' },
      { label: '时间一致性', value: '86.8%' }
    ],
    bars: [
      { label: '基线', value: 82 },
      { label: '我们的方法', value: 89 },
      { label: '一致性', value: 87 }
    ],
    insights: [
      { title: '检索质量更高', desc: '引入时间建模后，靠前结果的命中率明显提升。' },
      { title: '跨阶段更稳定', desc: '显式阶段信息帮助模型在时间漂移下仍保持一致识别。' }
    ]
  },
  human: {
    title: '人脸迁移验证评估',
    description: '利用公开人脸年龄数据集验证方法的泛化能力。',
    table: [
      { metric: '验证准确率', baseline: '84.1', ours: '89.2', gain: '+5.1', highlight: true },
      { metric: '年龄跨度鲁棒性', baseline: '76.4', ours: '82.3', gain: '+5.9', highlight: true },
      { metric: '跨阶段稳定性', baseline: '79.5', ours: '85.0', gain: '+5.5', highlight: false }
    ],
    stats: [
      { label: '最佳准确率', value: '89.2%' },
      { label: '年龄鲁棒性', value: '82.3%' },
      { label: '跨阶段稳定性', value: '85.0%' }
    ],
    bars: [
      { label: '基线', value: 84 },
      { label: '我们的方法', value: 89 },
      { label: '稳定性', value: 85 }
    ],
    insights: [
      { title: '迁移验证有效', desc: '同样的方法在公开人脸数据集上仍然保持了正向收益。' },
      { title: '年龄漂移更可控', desc: '相比普通基线，时间相关偏差得到了更好抑制。' }
    ]
  }
}

const activeDomain = ref('nonhuman')
const currentDomain = computed(() => domains[activeDomain.value])
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.metrics-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-grid,
.main-grid,
.bottom-grid,
.stat-grid,
.insight-cards {
  display: grid;
  gap: 20px;
}

.hero-grid,
.bottom-grid {
  grid-template-columns: 1.2fr 1fr;
}

.main-grid {
  grid-template-columns: 1.4fr 1fr;
}

.metrics-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.conclusion-list,
.mini-chart,
.narration-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.conclusion-item,
.current-view-box,
.stat-card,
.insight-card {
  padding: 14px 16px;
  border-radius: 18px;
}

.current-view-title,
.insight-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-sage-ink-strong);
}

.current-view-desc,
.insight-desc,
.narration-copy p {
  line-height: 1.75;
  color: var(--demo-sage-ink-soft);
}

.table-wrap {
  overflow-x: auto;
}

.metric-table {
  width: 100%;
  border-collapse: collapse;
}

.metric-table th,
.metric-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.44);
  font-size: 13px;
}

.metric-table th {
  color: var(--demo-sage-ink-faint);
}

.metric-table td {
  color: rgba(49, 71, 58, 0.84);
}

.metric-table tbody tr.highlight td {
  color: var(--demo-sage-accent);
  font-weight: 700;
}

.stat-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stat-card span,
.bar-label,
.bar-value {
  color: var(--demo-sage-ink-faint);
  font-size: 12px;
  font-weight: 700;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  color: var(--demo-sage-ink-strong);
  font-size: 18px;
}

.bar-item {
  display: grid;
  grid-template-columns: 92px 1fr 56px;
  gap: 12px;
  align-items: center;
}

.bar-track {
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.32);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(117, 151, 127, 0.94), rgba(181, 205, 184, 0.84));
}

@media (max-width: 1200px) {
  .hero-grid,
  .main-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }

  .bar-item {
    grid-template-columns: 1fr;
  }
}
</style>
