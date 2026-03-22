<template>
  <div class="dataset-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">数据集介绍</div>
        <h2 class="scene-title">跨时间数据集设计</h2>
        <p class="scene-desc">
          本页说明项目如何组织主任务的非人类生物数据集，以及用于迁移验证的人脸公开数据集。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented v-model:value="activeDomain" class="domain-switch" :options="domainOptions" />
      </div>
    </div>

    <div class="summary-grid">
      <BaseCard title="设计原则" subtitle="数据组织的核心思路" padding="lg">
        <div class="principle-grid">
          <div class="principle-item"><span>身份一致性</span><strong>保留稳定的身份线索</strong></div>
          <div class="principle-item"><span>时间显式化</span><strong>清晰标注年份与阶段</strong></div>
          <div class="principle-item"><span>多阶段覆盖</span><strong>纳入早期、中期与后期样本</strong></div>
          <div class="principle-item"><span>双场景验证</span><strong>同时支持主任务和迁移实验</strong></div>
        </div>
      </BaseCard>

      <BaseCard title="核心信息" subtitle="为什么数据设计如此重要" padding="lg">
        <div class="key-copy">
          <p>跨时间识别不仅依赖样本数量，更依赖清晰的时间标注与稳定的身份组织方式。</p>
          <p>数据集需要同时支撑身份识别、阶段判断，以及跨阶段关系建模这三类目标。</p>
        </div>
      </BaseCard>
    </div>

    <div class="dataset-block">
      <div class="block-grid">
        <div class="left-panel">
          <BaseCard :title="currentDomain.title" :subtitle="currentDomain.subtitle" padding="lg">
            <div class="stats-grid">
              <div v-for="item in currentDomain.stats" :key="item.label" class="stat-card">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>

            <div class="timeline-box">
              <div class="timeline-title">时间结构</div>
              <div class="timeline-row">
                <div v-for="item in currentDomain.timeline" :key="item.year" class="year-node" :class="item.type">
                  {{ item.year }}
                </div>
              </div>
              <div class="timeline-legend">
                <span class="legend train">训练阶段</span>
                <span class="legend test">测试阶段</span>
                <span class="legend note">显式建模时间间隔</span>
              </div>
            </div>
          </BaseCard>
        </div>

        <div class="right-panel">
          <BaseCard title="样本示例" subtitle="具有代表性的演示图像" padding="lg">
            <div class="sample-grid">
              <div v-for="item in currentDomain.samples" :key="item.label" class="sample-card">
                <img :src="item.image" :alt="item.label" />
                <div class="sample-meta">
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.note }}</span>
                </div>
              </div>
            </div>

            <div class="note-box">
              当前页面使用示意图片展示结构。后续接入真实资源路径后，可直接替换为项目样本。
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <div class="bottom-grid">
      <BaseCard title="为什么这样组织数据" subtitle="数据设计对任务的实际意义" padding="lg">
        <div class="reason-list">
          <div class="reason-item"><strong>身份连续</strong><p>同一主体被追踪到多个时间阶段，便于学习“变与不变”。</p></div>
          <div class="reason-item"><strong>时间监督</strong><p>年份和阶段标签帮助模型显式学习外观变化规律。</p></div>
          <div class="reason-item"><strong>迁移验证</strong><p>公开人脸数据提供额外场景，帮助验证方法是否具有泛化性。</p></div>
        </div>
      </BaseCard>

      <BaseCard title="讲解提示" subtitle="适合演示时的简短说明" padding="lg">
        <div class="narration-copy">
          <p>数据集设计不是简单收集图片，而是围绕跨时间识别任务搭建可学习的监督结构。</p>
          <p>这也是为什么身份标签、阶段标签和跨阶段组织方式都被当作核心信息来处理。</p>
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
    title: '非人类生物主任务数据集',
    subtitle: '用于跨时间域生物面部识别的核心训练与测试集合',
    stats: [
      { label: '主体数量', value: '120+' },
      { label: '时间阶段', value: '5' },
      { label: '样本数量', value: '8,000+' },
      { label: '跨阶段配对', value: '2,400+' }
    ],
    timeline: [
      { year: '2017', type: 'train' },
      { year: '2019', type: 'train' },
      { year: '2021', type: 'test' },
      { year: '2023', type: 'test' }
    ],
    samples: [
      {
        label: '早期阶段样本',
        note: '结构清晰，适合作为身份基准参考。',
        image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: '后期阶段样本',
        note: '外观纹理与光照发生明显漂移。',
        image: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80'
      }
    ]
  },
  human: {
    title: '人脸迁移验证数据集',
    subtitle: '利用公开人脸年龄数据集验证时间泛化能力',
    stats: [
      { label: '数据集数量', value: '3' },
      { label: '身份划分', value: '多组' },
      { label: '时间跨度', value: '短到长' },
      { label: '验证任务', value: '识别 + 稳定性' }
    ],
    timeline: [
      { year: 'AgeDB', type: 'train' },
      { year: 'CACD', type: 'train' },
      { year: 'FG-NET', type: 'test' }
    ],
    samples: [
      {
        label: '较早阶段人脸',
        note: '作为时间参考样本，用于构建阶段关系。',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: '较晚阶段人脸',
        note: '体现年龄增长带来的外观差异。',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80'
      }
    ]
  }
}

const activeDomain = ref('nonhuman')
const currentDomain = computed(() => domains[activeDomain.value])
</script>

<style scoped>
@import '@/styles/demo-glass.css';

.dataset-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-grid,
.block-grid,
.bottom-grid,
.principle-grid,
.stats-grid,
.sample-grid,
.reason-list {
  display: grid;
  gap: 20px;
}

.summary-grid,
.bottom-grid {
  grid-template-columns: 1fr 1fr;
}

.block-grid {
  grid-template-columns: 1.05fr 0.95fr;
}

.principle-grid,
.stats-grid,
.sample-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.principle-item,
.stat-card,
.sample-card,
.timeline-box,
.note-box,
.reason-item {
  padding: 16px;
  border-radius: 18px;
}

.principle-item span,
.timeline-title,
.sample-meta span {
  display: block;
  color: var(--demo-sage-ink-faint);
  font-size: 12px;
  font-weight: 700;
}

.principle-item strong,
.stat-card strong,
.sample-meta strong,
.reason-item strong {
  display: block;
  margin-top: 6px;
  color: var(--demo-sage-ink-strong);
  font-size: 15px;
}

.key-copy p,
.reason-item p,
.narration-copy p {
  line-height: 1.75;
  color: var(--demo-sage-ink-soft);
}

.timeline-row,
.timeline-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.year-node,
.legend {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.year-node.train,
.legend.train {
  background: rgba(188, 211, 193, 0.22);
  color: var(--demo-sage-accent);
}

.year-node.test,
.legend.test {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
}

.legend.note {
  background: rgba(255, 255, 255, 0.32);
  color: var(--demo-sage-ink-soft);
}

.sample-card img {
  width: 100%;
  display: block;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 10px;
}

.narration-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 1200px) {
  .summary-grid,
  .block-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .principle-grid,
  .stats-grid,
  .sample-grid {
    grid-template-columns: 1fr;
  }
}
</style>
