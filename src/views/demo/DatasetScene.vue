<template>
  <div class="dataset-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">Dataset Overview</div>
        <h2 class="scene-title">双数据域评测框架</h2>
        <p class="scene-desc">
          本项目采用“非人类生物主任务 + 人脸公开数据迁移验证”的数据组织方式。
          前者用于验证跨时间域个体识别能力，后者用于验证模型在人脸场景下的泛化表现。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented
          v-model:value="activeView"
          :options="[
            { label: '总览', value: 'all' },
            { label: '非人类生物', value: 'nonhuman' },
            { label: '人脸迁移验证', value: 'human' }
          ]"
        />
      </div>
    </div>

    <div class="summary-grid">
      <BaseCard
        title="数据组织原则"
        subtitle="赛题要求下的数据构建与划分方式"
        padding="lg"
      >
        <div class="principle-grid">
          <div class="principle-item">
            <span>时间跨度</span>
            <strong>≥ 3 年</strong>
          </div>
          <div class="principle-item">
            <span>数据划分</span>
            <strong>训练/测试时间互斥</strong>
          </div>
          <div class="principle-item">
            <span>主任务</span>
            <strong>非人类生物个体识别</strong>
          </div>
          <div class="principle-item">
            <span>泛化验证</span>
            <strong>标准人脸公开数据集</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="页面主结论"
        subtitle="这不是单一物种数据集展示"
        padding="lg"
      >
        <div class="key-copy">
          <p>
            数据层面不是只展示某一种生物，而是构建一个
            <strong>双数据域评测框架</strong>：
          </p>
          <ul>
            <li>非人类生物数据：作为主任务场景</li>
            <li>人脸公开数据：作为迁移验证场景</li>
          </ul>
          <p>
            这样的结构更符合题目中对
            <strong>跨时间识别能力 + 泛化验证能力</strong>
            的双重要求。
          </p>
        </div>
      </BaseCard>
    </div>

    <div
      v-if="activeView === 'all' || activeView === 'nonhuman'"
      class="dataset-block"
    >
      <BaseCard
        title="非人类生物数据集"
        subtitle="主任务：跨时间域的非人类生物个体识别"
        padding="lg"
      >
        <div class="block-grid">
          <div class="left-panel">
            <div class="stats-grid">
              <div class="stat-card">
                <span>任务角色</span>
                <strong>Primary Task</strong>
              </div>
              <div class="stat-card">
                <span>示例物种</span>
                <strong>Brown Bear / Large Mammal / Bird</strong>
              </div>
              <div class="stat-card">
                <span>时间跨度</span>
                <strong>≥ 3 Years</strong>
              </div>
              <div class="stat-card">
                <span>划分要求</span>
                <strong>Train/Test Temporal Disjoint</strong>
              </div>
            </div>

            <div class="timeline-box">
              <div class="timeline-title">时间划分示意</div>
              <div class="timeline-row">
                <div class="year-node train">2017</div>
                <div class="year-node train">2018</div>
                <div class="year-node train">2019</div>
                <div class="year-node gap">...</div>
                <div class="year-node test">2022</div>
              </div>
              <div class="timeline-legend">
                <span class="legend train">训练阶段</span>
                <span class="legend test">测试阶段</span>
                <span class="legend note">时间互斥</span>
              </div>
            </div>
          </div>

          <div class="right-panel">
            <div class="sample-grid">
              <div class="sample-card">
                <!-- TODO(real-data): Replace this mock non-human sample image with a real dataset image. -->
                <img
                  src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80"
                  alt="sample-1"
                />
                <div class="sample-meta">
                  <strong>Subject A</strong>
                  <span>2018 · Brown Bear</span>
                </div>
              </div>

              <div class="sample-card">
                <!-- TODO(real-data): Replace this mock non-human sample image with a real dataset image. -->
                <img
                  src="https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=800&q=80"
                  alt="sample-2"
                />
                <div class="sample-meta">
                  <strong>Subject A</strong>
                  <span>2022 · Brown Bear</span>
                </div>
              </div>

              <div class="sample-card">
                <!-- TODO(real-data): Replace this mock non-human sample image with a real dataset image. -->
                <img
                  src="https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80"
                  alt="sample-3"
                />
                <div class="sample-meta">
                  <strong>Subject B</strong>
                  <span>2019 · Mammal</span>
                </div>
              </div>

              <div class="sample-card">
                <!-- TODO(real-data): Replace this mock non-human sample image with a real dataset image. -->
                <img
                  src="https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80"
                  alt="sample-4"
                />
                <div class="sample-meta">
                  <strong>Subject C</strong>
                  <span>2021 · Mammal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="note-box">
          该部分是本课题的核心任务：从非人类生物不同时间阶段的面部图像中，
          学习稳定身份特征与时间变化规律，以支持跨时间域个体识别。
        </div>
      </BaseCard>
    </div>

    <div
      v-if="activeView === 'all' || activeView === 'human'"
      class="dataset-block"
    >
      <BaseCard
        title="人脸公开数据迁移验证"
        subtitle="验证模型在标准人脸跨时间场景下的泛化表现"
        padding="lg"
      >
        <div class="human-grid">
          <div class="dataset-cards">
            <div class="human-dataset-card">
              <div class="dataset-name">AgeDB</div>
              <div class="dataset-desc">
                用于验证年龄变化场景下的人脸识别稳定性
              </div>
            </div>

            <div class="human-dataset-card">
              <div class="dataset-name">CACD</div>
              <div class="dataset-desc">
                用于验证跨年龄与时间变化下的人脸匹配能力
              </div>
            </div>

            <div class="human-dataset-card">
              <div class="dataset-name">FG-NET</div>
              <div class="dataset-desc">
                用于补充分析小规模年龄跨度场景下的泛化表现
              </div>
            </div>
          </div>

          <div class="human-right">
            <div class="face-samples">
              <div class="face-card">
                <!-- TODO(real-data): Replace this mock human face image with a real validation sample. -->
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
                  alt="face-1"
                />
                <div class="sample-meta">
                  <strong>Human Subject 01</strong>
                  <span>Earlier Stage</span>
                </div>
              </div>

              <div class="face-card">
                <!-- TODO(real-data): Replace this mock human face image with a real validation sample. -->
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
                  alt="face-2"
                />
                <div class="sample-meta">
                  <strong>Human Subject 01</strong>
                  <span>Later Stage</span>
                </div>
              </div>
            </div>

            <div class="transfer-box">
              <div class="transfer-title">迁移验证目的</div>
              <p>
                该部分不作为主任务排名依据，而是用于展示模型是否具备从非人类生物场景
                迁移到标准人脸跨时间识别场景的能力。
              </p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="bottom-grid">
      <BaseCard
        title="为什么需要双数据域？"
        subtitle="从赛题要求到方法验证的逻辑闭环"
        padding="lg"
      >
        <div class="reason-list">
          <div class="reason-item">
            <strong>非人类生物数据</strong>
            <p>解决题目要求的核心任务，直接验证跨时间个体识别能力。</p>
          </div>
          <div class="reason-item">
            <strong>人脸公开数据</strong>
            <p>作为标准化对照场景，用于辅助验证模型的时间泛化与迁移能力。</p>
          </div>
          <div class="reason-item">
            <strong>双域统一表达</strong>
            <p>说明方法不是单一物种特化设计，而是面向跨时间识别问题本身。</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="简要说明"
        padding="lg"
      >
        <div class="narration-copy">
          <p>
            本项目的数据设计不是单一棕熊数据集，而是采用了
            <strong>双数据域框架</strong>。
          </p>
          <p>
            其中，非人类生物数据集对应赛题主任务，用于训练和测试跨时间个体识别模型；
            人脸公开数据集则用于迁移验证，帮助说明模型在标准跨年龄场景下的泛化能力。
          </p>
          <p>
            这样的数据组织方式，使系统展示既能对齐赛题要求，
            又能更完整地体现方法的适用范围。
          </p>
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
.dataset-scene {
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

.summary-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
}

.principle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.principle-item {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.principle-item span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.principle-item strong {
  display: block;
  margin-top: 6px;
  font-size: 16px;
  color: #0f172a;
}

.key-copy {
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.key-copy p {
  margin: 0;
}

.key-copy ul {
  margin: 10px 0;
  padding-left: 18px;
}

.dataset-block {
  display: block;
}

.block-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 20px;
  align-items: start;
}

.left-panel,
.right-panel {
  min-width: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.stat-card {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
}

.stat-card span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.stat-card strong {
  display: block;
  margin-top: 6px;
  font-size: 15px;
  color: #0f172a;
  line-height: 1.5;
}

.timeline-box {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.timeline-title {
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.timeline-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.year-node {
  min-width: 58px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.year-node.train {
  background: #0f172a;
  color: #ffffff;
}

.year-node.test {
  background: #dcfce7;
  color: #166534;
}

.year-node.gap {
  background: #f1f5f9;
  color: #64748b;
}

.timeline-legend {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.legend {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.legend.train {
  background: #0f172a;
  color: #ffffff;
}

.legend.test {
  background: #dcfce7;
  color: #166534;
}

.legend.note {
  background: #eff6ff;
  color: #1d4ed8;
}

.sample-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.sample-card,
.face-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.sample-card img,
.face-card img {
  width: 100%;
  height: 190px;
  display: block;
  object-fit: cover;
}

.sample-meta {
  padding: 12px 14px;
}

.sample-meta strong {
  display: block;
  font-size: 14px;
  color: #0f172a;
}

.sample-meta span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.note-box {
  margin-top: 18px;
  padding: 16px 18px;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #eff6ff 100%);
  font-size: 13px;
  line-height: 1.8;
  color: #334155;
}

.human-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 20px;
}

.dataset-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.human-dataset-card {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.dataset-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.dataset-desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.human-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.face-samples {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.transfer-box {
  padding: 16px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
}

.transfer-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.transfer-box p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #64748b;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.reason-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reason-item {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.reason-item strong {
  display: block;
  font-size: 15px;
  color: #0f172a;
}

.reason-item p {
  margin: 6px 0 0;
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

@media (max-width: 1200px) {
  .summary-grid,
  .block-grid,
  .human-grid,
  .bottom-grid {
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

  .principle-grid,
  .stats-grid,
  .sample-grid,
  .face-samples {
    grid-template-columns: 1fr;
  }

  .sample-card img,
  .face-card img {
    height: 220px;
  }
}
</style>
